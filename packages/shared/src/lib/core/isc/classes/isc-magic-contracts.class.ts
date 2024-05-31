import { ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2'
import { IIscChain } from '@core/network'
import { Contract } from 'web3'
import { ISC_MAGIC_CONTRACT_SANDBOX_ABI } from '../abis'
import { IscAssets, IscDict, IscHName, IscL1Address, IscSendMetadata, IscSendOptions } from '../types'
import { evmAddressToAgentId } from '@core/layer-2/helpers'
import { ISC_MAGIC_CONTRACT_ACCOUNTS_ABI } from '../abis/isc-magic-contract-accounts.abi'
import { type NonPayableMethodObject, type PayableMethodObject } from 'web3-eth-contract'

interface IEncodableIscMagicContractSandboxMethods {
    send: {
        targetAddress: IscL1Address
        assets: IscAssets
        adjustMinimumStorageDeposit: boolean
        sendMetadata: IscSendMetadata
        sendOptions: IscSendOptions
    }
    call: {
        contractName: IscHName
        entryPoint: IscHName
        params: IscDict
        allowance: IscAssets
    }
}

type EncodableIscMagicContractSandboxMethod<K extends keyof IEncodableIscMagicContractSandboxMethods> = (
    params: IEncodableIscMagicContractSandboxMethods[K]
) => PayableMethodObject | NonPayableMethodObject

class IscMagicContractSandbox {
    private _contract: Contract<typeof ISC_MAGIC_CONTRACT_SANDBOX_ABI>

    constructor(iscChain: IIscChain, contractAddress: string) {
        this._contract = iscChain.getContract(ISC_MAGIC_CONTRACT_SANDBOX_ABI, contractAddress)
    }

    encode<K extends keyof IEncodableIscMagicContractSandboxMethods>(
        method: K,
        params: IEncodableIscMagicContractSandboxMethods[K]
    ): string {
        return (this[method] as EncodableIscMagicContractSandboxMethod<K>)(params).encodeABI()
    }

    estimateGas<K extends keyof IEncodableIscMagicContractSandboxMethods>(
        method: K,
        params: IEncodableIscMagicContractSandboxMethods[K]
    ): Promise<bigint> {
        return (this[method] as EncodableIscMagicContractSandboxMethod<K>)(params).estimateGas()
    }

    private send({
        targetAddress,
        assets,
        adjustMinimumStorageDeposit,
        sendMetadata,
        sendOptions,
    }: IEncodableIscMagicContractSandboxMethods['send']): PayableMethodObject {
        return this._contract.methods.send(
            targetAddress,
            assets,
            adjustMinimumStorageDeposit,
            sendMetadata,
            sendOptions
        )
    }

    private call({
        contractName,
        entryPoint,
        params,
        allowance,
    }: IEncodableIscMagicContractSandboxMethods['call']): NonPayableMethodObject {
        return this._contract.methods.call(contractName, entryPoint, params, allowance)
    }

    callView<T>({
        contractName,
        entryPoint,
        params,
    }: {
        contractName: IscHName
        entryPoint: IscHName
        params: IscDict
    }): Promise<T> {
        return this._contract.methods.callView(contractName, entryPoint, params).call()
    }
}

class IscMagicContractAccounts {
    private _contract: Contract<typeof ISC_MAGIC_CONTRACT_ACCOUNTS_ABI>
    private _iscChain: IIscChain

    constructor(iscChain: IIscChain, contractAddress: string) {
        this._iscChain = iscChain
        this._contract = this._iscChain.getContract(ISC_MAGIC_CONTRACT_ACCOUNTS_ABI, contractAddress)
    }

    getL2BalanceBaseTokens(address: string): Promise<string> {
        const agentId = [evmAddressToAgentId(address, this._iscChain.aliasAddress)]
        return this._contract.methods.getL2BalanceBaseTokens(agentId).call()
    }

    getL2BalanceNativeTokens(address: string, tokenId: string): Promise<string> {
        const agentId = [evmAddressToAgentId(address, this._iscChain.aliasAddress)]
        return this._contract.methods.getL2BalanceNativeTokens(agentId, tokenId).call()
    }

    getL2Nfts(address: string): Promise<string[]> {
        const agentId = [evmAddressToAgentId(address, this._iscChain.aliasAddress)]
        return this._contract.methods.getL2NFTs(agentId).call()
    }
}

export class IscMagicContracts {
    private _iscChain: IIscChain
    private _contractAddress: string
    public sandbox: IscMagicContractSandbox
    public accounts: IscMagicContractAccounts

    constructor(iscChain: IIscChain) {
        this._iscChain = iscChain
        this._contractAddress = ISC_MAGIC_CONTRACT_ADDRESS

        this.sandbox = new IscMagicContractSandbox(this._iscChain, this._contractAddress)
        this.accounts = new IscMagicContractAccounts(this._iscChain, this._contractAddress)
    }
}
