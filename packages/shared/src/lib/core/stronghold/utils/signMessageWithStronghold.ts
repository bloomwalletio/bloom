import type { Bip44 } from '@iota/sdk/out/types'
import { getSignatureForStringWithStronghold } from './getSignatureForStringWithStronghold'
import { toRpcSig } from '@ethereumjs/util'

export async function signMessageWithStronghold(messageHex: string, bip44Path: Bip44): Promise<string> {
    const { r, s, v } = await getSignatureForStringWithStronghold(messageHex, bip44Path)
    return toRpcSig(v, r, s)
}
