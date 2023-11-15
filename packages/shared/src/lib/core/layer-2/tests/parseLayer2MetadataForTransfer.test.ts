import { Converter } from '@iota/util.js'
import { parseLayer2MetadataForTransfer } from '../utils/parseLayer2MetadataForTransfer'

describe('Function: parseLayer2MetadataForTransfer.ts', () => {
    it('should correctly parse metadata with base token', () => {
        const metadata = '0x00025e4b3ca1e3f423a0c21e0101611503807d707f59f1345e1063dbb64f2495d1491283a080c0843d'
        const metadataByteArray = Converter.hexToBytes(metadata)
        const expected = {
            senderContract: '0x0',
            targetContract: 'Accounts',
            contractFunction: 'transferAllowanceTo',
            gasLimit: '500000',
            ethereumAddress: '0x807d707f59f1345e1063dbb64f2495d1491283a0',
            baseTokens: '1000000',
            nativeTokens: [],
            nfts: [],
        }
        const parsedMetadata = parseLayer2MetadataForTransfer(metadataByteArray)
        expect(parsedMetadata).toEqual(expected)
    })
    it('should correctly parse metadata with long base token', () => {
        const metadata =
            '0x00025e4b3ca1e3f423f855010161350342f7da9bdb55b3ec87e5ac1a1e6d88e16768663fde5eca3429eb6f579cc538ac0611dabb31ea69bc4983566005f277611eee1ec980bfcceca025'
        const metadataByteArray = Converter.hexToBytes(metadata)
        const expected = {
            senderContract: '0x0',
            targetContract: 'Accounts',
            contractFunction: 'transferAllowanceTo',
            gasLimit: '11000',
            ethereumAddress: '0x0611dabb31ea69bc4983566005f277611eee1ec9',
            baseTokens: '10000999999',
            nativeTokens: [],
            nfts: [],
        }
        const parsedMetadata = parseLayer2MetadataForTransfer(metadataByteArray)
        expect(parsedMetadata).toEqual(expected)
    })

    it('should correctly parse metadata with native tokens', () => {
        const metadata =
            '0x00025e4b3ca1e3f423a0c21e01016115038cc8112290f8c350a60e1afdb8379c686e2a5bb3400108fcccc313acc182fc2c647dc98864062b163a8ee254231d7f029dc6be3a2de52e01000000000132'
        const metadataByteArray = Converter.hexToBytes(metadata)
        const expected = {
            senderContract: '0x0',
            targetContract: 'Accounts',
            contractFunction: 'transferAllowanceTo',
            gasLimit: '500000',
            ethereumAddress: '0x8cc8112290f8c350a60e1afdb8379c686e2a5bb3',
            baseTokens: '0',
            nativeTokens: [
                {
                    amount: '50',
                    ID: ['0x08fcccc313acc182fc2c647dc98864062b163a8ee254231d7f029dc6be3a2de52e0100000000'],
                },
            ],
            nfts: [],
        }
        const parsedMetadata = parseLayer2MetadataForTransfer(metadataByteArray)
        expect(parsedMetadata).toEqual(expected)
    })

    it('should correctly parse metadata with nfts', () => {
        const metadata =
            '0x00025e4b3ca1e3f423a0c21e0101611503cbcd6d8659ed1998a452335ae53904dc0af1c99b200166b71141974aa368c9152a24d631494b46172ba05dd998eef553e7fa1218b704'
        const metadataByteArray = Converter.hexToBytes(metadata)
        const expected = {
            senderContract: '0x0',
            targetContract: 'Accounts',
            contractFunction: 'transferAllowanceTo',
            gasLimit: '500000',
            ethereumAddress: '0xcbcd6d8659ed1998a452335ae53904dc0af1c99b',
            baseTokens: '0',
            nativeTokens: [],
            nfts: ['0x66b71141974aa368c9152a24d631494b46172ba05dd998eef553e7fa1218b704'],
        }
        const parsedMetadata = parseLayer2MetadataForTransfer(metadataByteArray)
        expect(parsedMetadata).toEqual(expected)
    })
})
