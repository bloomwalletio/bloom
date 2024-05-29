import { TransferredAsset } from '@core/layer-2'
import { evmAddressToAgentId, getSmartContractHexName } from '@core/layer-2/helpers'
import { IIscChain } from '@core/network'
import { IscAssets, IscHName } from '../types'
import { buildIscAssets } from '../utils'
import { IscMagicContracts } from './isc-magic-contracts.class'
import { buildIscDictFromObject } from '../helpers'

class IscCoreContractAccounts {
    private _contractHname = getSmartContractHexName('accounts')
    private parent: IscCoreContracts

    constructor(coreContracts: IscCoreContracts) {
        this.parent = coreContracts
    }

    encodeTransferAllowanceTo(recipientAddress: string, transferredAsset: TransferredAsset): string {
        const agentId = evmAddressToAgentId(recipientAddress, this.parent._iscChain.aliasAddress)
        const parameters = { a: agentId }
        const allowance = buildIscAssets(this.parent._iscChain, transferredAsset)

        return this.parent.encodeCall(this._contractHname, 'transferAllowanceTo', parameters, allowance)
    }
}

export class IscCoreContracts {
    public _iscChain: IIscChain
    public _magicContracts: IscMagicContracts

    public accounts: IscCoreContractAccounts

    constructor(iscChain: IIscChain) {
        this._iscChain = iscChain
        this._magicContracts = new IscMagicContracts(this._iscChain)

        this.accounts = new IscCoreContractAccounts(this)
    }

    public encodeCall(
        contractHname: IscHName,
        entryPoint: string,
        params: Record<string, Uint8Array>,
        allowance: IscAssets
    ): string {
        const entryPointHname = getSmartContractHexName(entryPoint)
        const paramsDict = buildIscDictFromObject(params)
        return this._magicContracts.sandbox.encode('call', {
            contractName: contractHname,
            entryPoint: entryPointHname,
            params: paramsDict,
            allowance,
        })
    }
}
