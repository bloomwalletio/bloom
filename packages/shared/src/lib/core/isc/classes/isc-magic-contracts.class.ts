import { ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2'
import { IIscChain } from '@core/network'
import { Contract } from 'web3'
import { ISC_MAGIC_CONTRACT_SANDBOX_ABI } from '../abis'
import { IscAssets, IscDict, IscHName, IscL1Address, IscSendMetadata, IscSendOptions } from '../types'

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

class IscMagicContractSandbox {
    private _contract: Contract<typeof ISC_MAGIC_CONTRACT_SANDBOX_ABI>

    constructor(iscChain: IIscChain, contractAddress: string) {
        this._contract = iscChain.getContract(ISC_MAGIC_CONTRACT_SANDBOX_ABI, contractAddress)
    }

    encode<K extends keyof IEncodableIscMagicContractSandboxMethods>(
        method: K,
        params: IEncodableIscMagicContractSandboxMethods[K]
    ): string {
        return this[method as keyof Omit<IscMagicContractSandbox, 'encode' | 'estimateGas'>](params).encodeABI()
    }

    estimateGas<K extends keyof IEncodableIscMagicContractSandboxMethods>(
        method: K,
        params: IEncodableIscMagicContractSandboxMethods[K]
    ): Promise<number> {
        return this[method as keyof Omit<IscMagicContractSandbox, 'encode' | 'estimateGas'>](params).estimateGas()
    }

    protected send({
        targetAddress,
        assets,
        adjustMinimumStorageDeposit,
        sendMetadata,
        sendOptions,
    }: IEncodableIscMagicContractSandboxMethods['send']): unknown {
        return this._contract.methods.send(
            targetAddress,
            assets,
            adjustMinimumStorageDeposit,
            sendMetadata,
            sendOptions
        )
    }

    protected call({
        contractName,
        entryPoint,
        params,
        allowance,
    }: IEncodableIscMagicContractSandboxMethods['call']): unknown {
        return this._contract.methods.call(contractName, entryPoint, params, allowance)
    }
}

class IscMagicContractAccounts {
    private _contract: Contract<typeof ISC_MAGIC_CONTRACT_SANDBOX_ABI>

    constructor(iscChain: IIscChain, contractAddress: string) {
        this._contract = iscChain.getContract(ISC_MAGIC_CONTRACT_SANDBOX_ABI, contractAddress)
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
