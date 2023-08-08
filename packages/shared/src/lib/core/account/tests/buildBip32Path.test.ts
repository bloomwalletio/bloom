import { buildBip32PathFromBip44 } from '../utils/buildBip32PathFromBip44'

describe('File: buildBip32PathFromBip44.ts', () => {
    it('should correctly give BIP32 path', () => {
        const bip32Path = buildBip32PathFromBip44({
            coinType: 60,
            account: 1,
        })
        const expectedBip32Path = "44'/60'/1'/0/0"

        expect(expectedBip32Path).toStrictEqual(bip32Path)
    })
})
