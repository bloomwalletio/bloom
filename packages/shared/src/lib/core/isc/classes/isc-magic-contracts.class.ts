import { ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2'
import { IscChain } from '@core/network'
import { Contract } from 'web3'
import { ISC_MAGIC_CONTRACT_SANDBOX_ABI } from '../abis'
import { IscAssets, IscL1Address, IscSendMetadata, IscSendOptions } from '../types'

interface IEncodableIscMagicContractSandboxMethods {
    send: {
        params: {
            targetAddress: IscL1Address
            assets: IscAssets
            adjustMinimumStorageDeposit: boolean
            sendMetadata: IscSendMetadata
            sendOptions: IscSendOptions
        }
        returns: string
    }
}

class IscMagicContractSandbox {
    private _contract: Contract<typeof ISC_MAGIC_CONTRACT_SANDBOX_ABI>

    constructor(iscChain: IscChain, contractAddress: string) {
        this._contract = iscChain.getContract(ISC_MAGIC_CONTRACT_SANDBOX_ABI, contractAddress)
    }

    encode<K extends keyof IEncodableIscMagicContractSandboxMethods>(
        method: K,
        params: IEncodableIscMagicContractSandboxMethods[K]['params']
    ): IEncodableIscMagicContractSandboxMethods[K]['returns'] {
        return this._contract.methods[method](params).encodeABI()
    }

    protected send({
        targetAddress,
        assets,
        adjustMinimumStorageDeposit,
        sendMetadata,
        sendOptions,
    }: IEncodableIscMagicContractSandboxMethods['send']['params']): Promise<unknown> {
        return this._contract.methods
            .send(targetAddress, assets, adjustMinimumStorageDeposit, sendMetadata, sendOptions)
            .call()
    }
}

class IscMagicContractAccounts {
    private _contract: Contract<typeof ISC_MAGIC_CONTRACT_SANDBOX_ABI>

    constructor(iscChain: IscChain, contractAddress: string) {
        this._contract = iscChain.getContract(ISC_MAGIC_CONTRACT_SANDBOX_ABI, contractAddress)
    }
}

export class IscMagicContracts {
    private _iscChain: IscChain
    private _contractAddress: string
    public sandbox: IscMagicContractSandbox
    public accounts: IscMagicContractAccounts

    constructor(iscChain: IscChain) {
        this._iscChain = iscChain
        this._contractAddress = ISC_MAGIC_CONTRACT_ADDRESS

        this.sandbox = new IscMagicContractSandbox(this._iscChain, this._contractAddress)
        this.accounts = new IscMagicContractAccounts(this._iscChain, this._contractAddress)
    }
}
