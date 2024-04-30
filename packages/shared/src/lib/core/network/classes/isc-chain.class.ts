import { IIscChain, IIscChainConfiguration, IIscChainMetadata } from '../interfaces'
import { Converter } from '@core/utils'
import { IAccountState } from '@core/account/interfaces'
import { ITokenBalance } from '@core/token/interfaces'
import { fetchIscAssetsForAccount } from '@core/layer-2/utils'
import { getActiveProfileId } from '@core/profile/stores'
import { NetworkType } from '@core/network/enums'
import { EvmNetwork } from './evm-network.class'

export class IscChain extends EvmNetwork implements IIscChain {
    private readonly _chainApi: string
    private _metadata: IIscChainMetadata | undefined

    public readonly explorerUrl: string | undefined
    public readonly apiEndpoint: string
    public readonly aliasAddress: string
    public readonly type = NetworkType.Isc

    constructor(chainConfiguration: IIscChainConfiguration) {
        const { rpcEndpoint, aliasAddress, apiEndpoint } = chainConfiguration
        const _rpcEndpoint = new URL(`v1/chains/${aliasAddress}/evm`, rpcEndpoint).href

        super({ ...chainConfiguration, rpcEndpoint: _rpcEndpoint })

        this.aliasAddress = aliasAddress
        this.apiEndpoint = apiEndpoint
        this._chainApi = new URL(`v1/chains/${aliasAddress}`, apiEndpoint).href
    }

    getMetadata(): Promise<IIscChainMetadata> {
        if (this._metadata) {
            return Promise.resolve(this._metadata)
        } else {
            this._metadata = <IIscChainMetadata>{} // await this.fetchChainMetadata()
            return Promise.resolve(this._metadata)
        }
    }

    /**
     * CAUTION: The API endpoint used by this method is not available
     * with the public ShimmerEVM node URL (b/c it's actually just
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

        const tokenBalance = (await super.getBalance(account)) ?? {}
        const iscBalance = (await fetchIscAssetsForAccount(getActiveProfileId(), evmAddress, this, account)) ?? {}

        return { ...tokenBalance, ...iscBalance }
    }

    async getGasEstimate(hex: string): Promise<bigint> {
        const URL = `${this._chainApi}/estimategas-onledger`
        const body = JSON.stringify({ outputBytes: hex })

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
            const gasEstimate = Converter.bigIntLikeToBigInt(data.gasFeeCharged)
            if (gasEstimate === BigInt(0)) {
                throw new Error(`Gas fee has an invalid value: ${gasEstimate}!`)
            }

            return gasEstimate
        } else {
            throw new Error(data)
        }
    }
}
