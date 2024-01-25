import type { Bip44 } from '@iota/sdk/out/types'
import { getSignatureForStringWithStronghold } from './getSignatureForStringWithStronghold'
import { toRpcSig } from '@ethereumjs/util'
import { SignTypedDataVersion, TypedDataUtils, typedSignatureHash } from '@metamask/eth-sig-util'

export async function signEIP712MessageWithStronghold(
    jsonString: string,
    bip44Path: Bip44,
    version: SignTypedDataVersion
): Promise<string> {
    const typedData = JSON.parse(jsonString)

    let hashedData: string
    if (version === SignTypedDataVersion.V1) {
        hashedData = '0x' + typedSignatureHash(typedData)
    } else {
        hashedData = '0x' + TypedDataUtils.eip712Hash(typedData, version).toString('hex')
    }

    const { r, s, v } = await getSignatureForStringWithStronghold(hashedData, bip44Path)
    return toRpcSig(v, r, s)
}
