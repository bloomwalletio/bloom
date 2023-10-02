import { IAccountState } from '@core/account'
import type { Bip44 } from '@iota/wallet/types'
import { Converter } from '@core/utils'
import { getSignatureForStringWithStronghold } from './getSignatureForStringWithStronghold'
import { toRpcSig } from '@ethereumjs/util'

export async function signMessageWithStronghold(
    message: string,
    signStandart: 'eth_sign' | 'personal_sign',
    bip44Path: Bip44,
    account: IAccountState
): Promise<string> {
    const prefix = signStandart ? '\x19Ethereum Signed Message:\n' + message.length : ''
    const hexMessage = Converter.utf8ToHex(prefix + message)

    const { r, s, v } = await getSignatureForStringWithStronghold(hexMessage, bip44Path, account)

    return toRpcSig(v, r, s)
}
