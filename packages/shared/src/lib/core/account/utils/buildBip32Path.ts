export function buildBip32Path(
    coinType: number,
    accountIndex: number = 0,
    addressIndex: number = 0,
    internal = false
): string {
    return `44'/${coinType}'/${accountIndex}'/${internal ? '1' : '0'}/${addressIndex}`
}
