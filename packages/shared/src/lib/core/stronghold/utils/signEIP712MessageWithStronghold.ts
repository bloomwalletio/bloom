import type { Bip44 } from '@iota/sdk/out/types'
import { getSignatureForStringWithStronghold } from './getSignatureForStringWithStronghold'
import { toRpcSig } from '@ethereumjs/util'
import { SignTypedDataVersion, TypedDataUtils } from '@metamask/eth-sig-util'

export async function signEIP712MessageWithStronghold(
    jsonString: string,
    bip44Path: Bip44,
    version: SignTypedDataVersion.V3 | SignTypedDataVersion.V4
): Promise<string> {
    const typedData = JSON.parse(jsonString)
    const sanitizedData = TypedDataUtils.sanitizeData(typedData)

    const hashedDomain = TypedDataUtils.eip712DomainHash(typedData, SignTypedDataVersion.V4).toString('hex')
    const hashedMessage = TypedDataUtils.hashStruct(
        sanitizedData.primaryType as string,
        sanitizedData.message,
        sanitizedData.types,
        version
    ).toString('hex')

    const eip712Message = getEip712MessageFromBuffer(hashedDomain, hashedMessage)

    const { r, s, v } = await getSignatureForStringWithStronghold(eip712Message, bip44Path)
    return toRpcSig(v, r, s)
}

function getEip712MessageFromBuffer(hashedDomain: string, hashedMessage: string): string {
    const domainSeparator = Buffer.from(hashedDomain, 'hex')
    const hashStruct = Buffer.from(hashedMessage, 'hex')
    const eip712Prefix = Buffer.from([0x19, 0x01])

    const buffer = Buffer.alloc(eip712Prefix.length + domainSeparator.length + hashStruct.length, 0)

    let offset = 0
    eip712Prefix.copy(buffer, offset)
    offset = eip712Prefix.length
    domainSeparator.copy(buffer, offset)
    offset += domainSeparator.length
    hashStruct.copy(buffer, offset)

    return '0x' + buffer.toString('hex')
}
