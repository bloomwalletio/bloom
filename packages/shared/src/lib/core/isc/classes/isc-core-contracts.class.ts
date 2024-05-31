import { TransferredAsset } from '@core/layer-2'
import { evmAddressToAgentId, getSmartContractHexName } from '@core/layer-2/helpers'
import { IIscChain } from '@core/network'
import { IscAssets, IscHName } from '../types'
import { buildIscAssets } from '../utils'
import { IscMagicContracts } from './isc-magic-contracts.class'
import { buildIscDictFromObject } from '../helpers'
import { Converter } from '@core/utils'
import { ITokenBalance } from '@core/token/interfaces'

class IscCoreContractAccounts {
    private _contractHname = getSmartContractHexName('accounts')
    private parent: IscCoreContracts

    constructor(coreContracts: IscCoreContracts) {
        this.parent = coreContracts
    }

    async getBalance(address: string): Promise<ITokenBalance> {
        const agentId = evmAddressToAgentId(address, this.parent._iscChain.aliasAddress)
        return (
            await this.parent.callView<{ items: { key: string; value: string }[] }>(this._contractHname, 'balance', {
                a: agentId,
            })
        ).items.reduce((acc, item) => {
            acc[item.key] = Converter.bigIntLikeToBigInt(item.value)
            return acc
        }, {} as ITokenBalance)
    }

    async getBalanceBaseToken(address: string): Promise<bigint> {
        const agentId = evmAddressToAgentId(address, this.parent._iscChain.aliasAddress)
        const results = await this.parent.callView<{ items: { key: '0x42'; value: 'string' }[] }>(
            this._contractHname,
            'balanceBaseToken',
            { a: agentId }
        )
        const value = results.items.find((item) => item.key === '0x42')?.value
        return Converter.bigIntLikeToBigInt(value)
    }

    async getBalanceNativeToken(address: string, tokenId: string): Promise<bigint> {
        const agentId = evmAddressToAgentId(address, this.parent._iscChain.aliasAddress)
        // TODO: fix type of param builder
        const result = await this.parent.callView<{ items: { key: '0x42'; value: 'string' }[] }>(
            this._contractHname,
            'balanceNativeToken',
            { a: agentId, N: tokenId }
        )
        const value = result.items.find((item) => item.key === '0x42')?.value
        return Converter.bigIntLikeToBigInt(value)
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

    public callView<T>(contractHname: IscHName, entryPoint: string, params: Record<string, Uint8Array>): Promise<T> {
        const entryPointHname = getSmartContractHexName(entryPoint)
        const paramsDict = buildIscDictFromObject(params)
        return this._magicContracts.sandbox.callView<T>({
            contractName: contractHname,
            entryPoint: entryPointHname,
            params: paramsDict,
        })
    }
}
