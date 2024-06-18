// Potential circular import so importing this first
import { EvmNetwork } from './evm-network.class'
// REQUIRED GAP FOR CIRCULAR IMPORTS ABOVE
import { IAccountState } from '@core/account/interfaces'
import { ParsedSmartContractType } from '@core/layer-2'
import { fetchIscAssetsForAccount } from '@core/layer-2/utils'
import { parseSmartContractDataFromTransactionData } from '@core/layer-2/utils/parseSmartContractDataFromTransactionData'
import { NetworkType } from '@core/network/enums'
import { Nft } from '@core/nfts/interfaces'
import { getNftsFromNftIds } from '@core/nfts/utils'
import { getActiveProfileId } from '@core/profile/stores'
import { ITokenBalance } from '@core/token/interfaces'
import { getPersistedTransactionsForChain } from '@core/transactions/stores'
import { Converter } from '@core/utils'
import { BigIntLike } from '@ethereumjs/util'
import { IIscChain, IIscChainConfiguration, IIscChainMetadata } from '../interfaces'
import { NftStandard } from '@core/nfts/enums'
import { ISC_CONFIRMATION_THRESHOLD } from '@core/network/constants'

export class IscChain extends EvmNetwork implements IIscChain {
    private readonly _chainApi: string
    private _metadata: IIscChainMetadata | undefined
    private WEI_PER_GLOW = BigInt(1_000_000_000_000)

    public readonly explorerUrl: string | undefined
    public readonly apiEndpoint: string
    public readonly aliasAddress: string
    public readonly type = NetworkType.Isc
    public readonly blocksUntilConfirmed = ISC_CONFIRMATION_THRESHOLD

    constructor(chainConfiguration: IIscChainConfiguration) {
        const { rpcEndpoint, aliasAddress, apiEndpoint } = chainConfiguration
        const _rpcEndpoint = new URL(`v1/chains/${aliasAddress}/evm`, rpcEndpoint).href

        super({ ...chainConfiguration, rpcEndpoint: _rpcEndpoint })

        this.aliasAddress = aliasAddress
        this.apiEndpoint = apiEndpoint
        this._chainApi = new URL(`v1/chains/${aliasAddress}`, apiEndpoint).href

        void this.setMetadata()
    }

    getMetadata(): IIscChainMetadata | undefined {
        return this._metadata
    }

    async setMetadata(): Promise<void> {
        try {
            this._metadata = await this.fetchChainMetadata()
        } catch (err) {
            console.error(err)
        }
    }

    async getNftsForAccount(account: IAccountState): Promise<Nft[]> {
        // ERC721 NFTs
        const erc721Nfts = await super.getNftsForAccount(account)

        // Wrapped L1 IRC NFTs
        const transactionsOnChain = getPersistedTransactionsForChain(getActiveProfileId(), account.index, this)
        const ircNftsIds: string[] = []
        for (const transaction of transactionsOnChain) {
            if (!transaction.local || !transaction.local.data) {
                continue
            }
            const parsedData = parseSmartContractDataFromTransactionData(
                { to: transaction.local.to, data: transaction.local.data, value: transaction.local.value },
                this
            )

            if (parsedData?.type === ParsedSmartContractType.NftTransfer && parsedData.standard === NftStandard.Irc27) {
                ircNftsIds.push(parsedData.nftId)
            }
        }
        const ircNfts = await getNftsFromNftIds(ircNftsIds, this.id)

        return [...ircNfts, ...erc721Nfts]
    }

    /**
     * CAUTION: The API endpoint used by this method is not available
     * with the public ShimmerEvm node URL (b/c it's actually just
     * the EVM JSON-RPC endpoint rather than the underlying WASP
     * node URL). See here for more: https://github.com/iotaledger/wasp/issues/2385
     */
    private async fetchChainMetadata(): Promise<IIscChainMetadata> {
        const response = await fetch(this._chainApi)
        return (await response.json()) as IIscChainMetadata
    }

    async getBalance(account: IAccountState): Promise<ITokenBalance | undefined> {
        const evmAddress = account.evmAddresses?.[this.coinType]
        if (!evmAddress) {
            return undefined
        }

        const evmTokenBalances = (await super.getBalance(account)) ?? {}
        const iscTokenBalances = (await fetchIscAssetsForAccount(getActiveProfileId(), evmAddress, this, account)) ?? {}

        return { ...evmTokenBalances, ...iscTokenBalances }
    }

    async getGasFeeEstimate(outputBytes: string): Promise<bigint> {
        const URL = `${this._chainApi}/estimategas-onledger`
        const body = JSON.stringify({ outputBytes })

        const requestInit: RequestInit = {
            method: 'POST',
            body,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }

        const response = await fetch(URL, requestInit)
        const data = await response.json()

        if (response.status === 200) {
            const gasFee = BigInt(data.gasFeeCharged)
            if (gasFee === BigInt(0)) {
                throw new Error(`Gas fee has an invalid value: ${gasFee}!`)
            }

            return gasFee
        } else {
            throw new Error(data)
        }
    }

    denormaliseAmount(amount: BigIntLike): bigint {
        return Converter.bigIntLikeToBigInt(amount) * this.WEI_PER_GLOW
    }

    normaliseAmount(amount: BigIntLike): bigint {
        return Converter.bigIntLikeToBigInt(amount) / this.WEI_PER_GLOW
    }
}
