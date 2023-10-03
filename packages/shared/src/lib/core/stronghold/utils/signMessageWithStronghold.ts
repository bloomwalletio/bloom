import type { Bip44 } from '@iota/sdk/out/types'
import { Converter } from '@core/utils'
import { getSignatureForStringWithStronghold } from './getSignatureForStringWithStronghold'
import { toRpcSig } from '@ethereumjs/util'

export async function signMessageWithStronghold(
    message: string,
    signStandard: 'eth_sign' | 'personal_sign',
    bip44Path: Bip44
): Promise<string> {
    const prefix = signStandard ? '\x19Ethereum Signed Message:\n' + message.length : ''
    const hexMessage = Converter.utf8ToHex(prefix + message)
    const { r, s, v } = await getSignatureForStringWithStronghold(hexMessage, bip44Path)
    return toRpcSig(v, r, s)
}
