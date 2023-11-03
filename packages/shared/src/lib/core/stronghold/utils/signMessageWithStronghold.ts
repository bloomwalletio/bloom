import type { Bip44 } from '@iota/sdk/out/types'
import { getSignatureForStringWithStronghold } from './getSignatureForStringWithStronghold'
import { toRpcSig } from '@ethereumjs/util'
import { Converter } from '@core/utils/convert'

export async function signMessageWithStronghold(message: string, bip44Path: Bip44): Promise<string> {
    const prefix = '\x19Ethereum Signed Message:\n' + message.length
    const messageHex = Converter.utf8ToHex(prefix + message)

    const { r, s, v } = await getSignatureForStringWithStronghold(messageHex, bip44Path)
    return toRpcSig(v, r, s)
}
