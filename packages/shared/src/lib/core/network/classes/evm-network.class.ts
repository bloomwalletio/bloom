import { writable, Writable } from 'svelte/store'

import Web3 from 'web3'

import { EVM_CONTRACT_ABIS } from '@core/layer-2/constants'
import { ContractType } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'

import { IAccountState } from '@core/account'
import { IError } from '@core/error/interfaces'
import { NETWORK_STATUS_POLL_INTERVAL } from '@core/network/constants'
import { updateErc721NftsOwnership } from '@core/nfts/actions'
import { getActiveProfile } from '@core/profile/stores'
import { BASE_TOKEN_ID, IBaseToken, ITokenBalance, TokenTrackingStatus } from '@core/token'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { Converter } from '@core/utils'
import features from '@features/features'
import { CoinType } from '@iota/sdk/out/types'
import { ChainId, NetworkHealth, NetworkNamespace, NetworkType } from '../enums'
import { IBaseEvmNetworkConfiguration, IBlock, IEvmNetwork } from '../interfaces'
import { EvmNetworkId, EvmNetworkType, Web3Provider } from '../types'

export class EvmNetwork implements IEvmNetwork {
    public readonly provider: Web3Provider

    public readonly id: EvmNetworkId
    public readonly namespace: NetworkNamespace.Evm
    public readonly chainId: ChainId
    public readonly coinType: CoinType
    public readonly name: string
    public readonly baseToken: IBaseToken
    public readonly explorerUrl: string | undefined
    public readonly rpcEndpoint: string
    public readonly type: EvmNetworkType = NetworkType.Evm

    public health: Writable<NetworkHealth> = writable(NetworkHealth.Operational)
    public statusPoll: number | undefined

    constructor({
        id,
        namespace,
        chainId,
        coinType,
        baseToken,
        name,
        explorerUrl,
        rpcEndpoint,
    }: IBaseEvmNetworkConfiguration) {
        try {
            const _rpcEndpoint = new URL(rpcEndpoint).href
            this.provider = new Web3(`${_rpcEndpoint}`)

            this.id = id
            this.namespace = namespace
            this.chainId = chainId
            this.coinType = coinType
            this.baseToken = baseToken
            this.name = name
            this.explorerUrl = explorerUrl
            this.rpcEndpoint = _rpcEndpoint

            void this.startStatusPoll()
        } catch (err) {
            console.error(err)
            throw new Error('Failed to construct EVM Network!')
        }
    }

    startStatusPoll(): void {
        this.statusPoll = window.setInterval(() => {
            this.getLatestBlock()
                .then(() => this.health.set(NetworkHealth.Operational))
                .catch(() => this.health.set(NetworkHealth.Disconnected))
        }, NETWORK_STATUS_POLL_INTERVAL)
    }

    destroy(): void {
        clearInterval(this.statusPoll)
    }

    getContract(type: ContractType, address: string): Contract {
        const abi = EVM_CONTRACT_ABIS[type]
        if (!abi) {
            throw new Error(`Unable to determine contract type "${type}"`)
        }
        return new this.provider.eth.Contract(abi, address)
    }

    async getGasPrice(): Promise<bigint | undefined> {
        try {
            const gasPrice = await this.provider.eth.getGasPrice()
            return BigInt(gasPrice)
        } catch {
            return undefined
        }
    }

    async getLatestBlock(): Promise<IBlock> {
        const number = await this.provider.eth.getBlockNumber()
        return this.provider.eth.getBlock(number)
    }

    async getBalance(account: IAccountState): Promise<ITokenBalance | undefined> {
        const evmAddress = account.evmAddresses?.[this.coinType]
        if (!evmAddress) {
            return
        }

        if (features.collectibles.erc721.enabled) {
            void updateErc721NftsOwnership(account, this.id)
        }

        const rawBalance = await this.provider.eth.getBalance(evmAddress)
        const tokenBalance = { [BASE_TOKEN_ID]: Converter.bigIntLikeToBigInt(rawBalance) }

        const erc20Balances = await this.getErc20BalancesForAddress(evmAddress)
        for (const [tokenId, balance] of Object.entries(erc20Balances)) {
            await getOrRequestTokenFromPersistedTokens(tokenId, this.id)
            tokenBalance[tokenId] = Number.isNaN(Number(balance)) ? BigInt(0) : balance
        }

        return tokenBalance
    }

    async getErc20BalancesForAddress(evmAddress: string): Promise<ITokenBalance> {
        const trackedTokens = getActiveProfile()?.trackedTokens?.[this.id] ?? {}
        const erc20TokenBalances: ITokenBalance = {}
        for (const [erc20Address, trackingStatus] of Object.entries(trackedTokens)) {
            try {
                if (trackingStatus === TokenTrackingStatus.Untracked) {
                    continue
                }

                const contract = this.getContract(ContractType.Erc20, erc20Address)
                if (!contract || !this.coinType) {
                    continue
                }
                const rawBalance = await contract.methods.balanceOf(evmAddress).call()
                erc20TokenBalances[erc20Address] = Converter.bigIntLikeToBigInt(rawBalance)
            } catch (err) {
                const error = (err as IError)?.message ?? err
                console.error(error)
            }
        }
        return erc20TokenBalances
    }
}
