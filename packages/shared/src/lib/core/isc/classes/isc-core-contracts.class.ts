import { ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2'
import { IscChain } from '@core/network'
import { ISC_CORE_CONTRACT_ACCOUNTS_ABI } from '../abis/isc-core-contract-accounts.abi'

class IscCoreContractAccounts {
    private _contract: unknown

    constructor(iscChain: IscChain, contractAddress: string) {
        this._contract = iscChain.getContract(ISC_CORE_CONTRACT_ACCOUNTS_ABI, contractAddress)
    }
}

export class IscCoreContracts {
    private _iscChain: IscChain
    private _contractAddress: string
    public accounts: IscCoreContractAccounts

    constructor(iscChain: IscChain) {
        this._iscChain = iscChain
        this._contractAddress = ISC_MAGIC_CONTRACT_ADDRESS
        this.accounts = new IscCoreContractAccounts(this._iscChain, this._contractAddress)
    }
}
