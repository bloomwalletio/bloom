import { EvmChainId } from '@core/network/enums'
import { getActiveProfile } from '@core/profile/stores'
import { ECDSASignature, fromRpcSig } from '@ethereumjs/util'
import type { Bip44 } from '@iota/wallet/types'
import { api } from '@core/profile-manager'

export async function getSignatureForStringWithStronghold(
    text: string,
    bip44Path: Bip44,
    chainId?: EvmChainId
): Promise<ECDSASignature> {
    const manager = await api.getSecretManager(getActiveProfile()?.id)
    const { signature } = await manager.signSecp256k1Ecdsa(text, bip44Path)

    // Make Secp256k1Ecdsa into an Eip155Compatible Signature
    const ecdsaSignature = fromRpcSig(signature)
    if (chainId) {
        ecdsaSignature.v = convertsVToEip155Compatible(ecdsaSignature.v, Number(chainId))
    }
    return ecdsaSignature
}

function convertsVToEip155Compatible(v: bigint, chainId: number): bigint {
    const parity = Number(v) % 27
    const newV = chainId * 2 + (35 + parity)
    return BigInt(newV)
}
