import type { Bip44 } from '@iota/wallet'

export function buildBip32PathFromBip44(bip44: Bip44): string {
    return `44'/${bip44.coinType ?? 0}'/${bip44.account ?? 0}'/${bip44.change ?? 0}/${bip44.addressIndex ?? 0}`
}
