import { FALLBACK_ESTIMATED_GAS } from '@core/layer-2/constants'
import { TESTNET_EVM_CHAIN_CONFIGURATION, SupportedNetworkId } from '@core/network/constants'
import { IscChain } from '@core/network/classes'
import { getOutputParameters } from '../utils'
import { ReturnStrategy, SubjectType } from '../enums'
import { IToken, IPersistedToken } from '@core/token/interfaces'
import { TokenStandard, VerifiedStatus } from '@core/token/enums'
import { SendFlowType } from '../enums'
import { SendFlowParameters } from '../types'
import { writable } from 'svelte/store'

const PERSISTED_ASSET_SHIMMER: IPersistedToken = {
    id: '1',
    standard: TokenStandard.BaseToken,
    hidden: false,
    verification: { verified: true, status: VerifiedStatus.Official },
}
const tag = 'tag'
const metadata = 'metadata'
const expirationDate = new Date('2023-03-30T08:04:34.932Z')
const timelockDate = new Date('2023-03-15T08:04:34.932Z')
const recipientAddress = 'rms1qqqp07ychhkc3u68ueug0zqq9g0wtfgeatynr6ksm9jwud30rvlkyqnhpl5'
const senderAddress = 'rms1abcp07ychhkc3u68ueug0zqq9g0wtfgeatynr6ksm9jwud30rvlkyqnhdef'
const amount = '1000000000'
const nativeTokenAsset: IToken = {
    id: '0x08cd4dcad7ccc383111942671ee8cdc487ddd250398331ca2692b8b1a81551a1c30100000000',
    chainId: 60,
    standard: 'erc20',
    balance: {
        total: Number(amount),
    },
    hidden: false,
    verification: { verified: true, status: VerifiedStatus.SelfVerified },
}

const destinationNetwork = new IscChain(TESTNET_EVM_CHAIN_CONFIGURATION)

const nftId = '0xcd9430ff870a22f81f92428e5c06975fa3ec1a993331aa3db9fb2298e931ade1'
const surplus = '50000'
const gasFee = 25000

const testNft = {
    id: nftId,
    address: 'rms1qqqp07ychhkc3u68ueug0zqq9g0wtfgeatynr6ksm9jwud30rvlkyqnhpl5',
    name: 'testNft',
    isSpendable: true,
    timelockTime: 1678867475,
    latestOutputId: 'testOutputId',
    mediaUrl: 'http://example.com',
    downloadUrl: 'http://example.com/download',
    storageDeposit: 100,
    filePath: 'path/to/file',
    downloadMetadata: {
        format: 'jpg',
        type: 'image/jpeg',
        size: 12345,
    },
}

const baseTransaction: SendFlowParameters = {
    type: SendFlowType.BaseCoinTransfer,
    baseCoinTransfer: {
        token: PERSISTED_ASSET_SHIMMER,
        rawAmount: BigInt(amount),
        unit: 'glow',
    },
    recipient: {
        type: SubjectType.Address,
        address: recipientAddress,
    },
    destinationNetworkId: SupportedNetworkId.Shimmer,
}

// TODO: refactor getOutputParameters to not rely on this store
jest.mock('@core/profile/stores/active-profile-id.store', () => ({
    activeProfileId: jest.fn(() => writable('')),
}))

jest.mock('@core/token/stores/persisted-tokens.store', () => ({
    persistedTokens: jest.fn(() => writable([])),
    getPersistedToken: jest.fn(() => PERSISTED_ASSET_SHIMMER),
    getAssetById: jest.fn((id) => (id === PERSISTED_ASSET_SHIMMER.id ? PERSISTED_ASSET_SHIMMER : nativeTokenAsset)),
}))

jest.mock('@core/token/actions/getAccountTokensForAccount', () => ({
    getAccountTokensForAccount: jest.fn((_) => {
        return {
            [SupportedNetworkId.Testnet]: {
                baseCoin: PERSISTED_ASSET_SHIMMER,
                nativeTokens: [nativeTokenAsset],
            },
        }
    }),
}))

jest.mock('../../network/stores/networks.store', () => ({
    getIscChain: jest.fn((_) => destinationNetwork),
}))

jest.mock('../../layer-2/actions/getGasFeeForLayer1ToLayer2Transaction', () => ({
    getGasFeeForLayer1ToLayer2Transaction: jest.fn(({ type }) => FALLBACK_ESTIMATED_GAS[type]),
}))

jest.mock('../../network/actions/getActiveNetworkId.ts', () => ({
    getActiveNetworkId: jest.fn(() => {
        return SupportedNetworkId.Shimmer
    }),
}))

describe('File: getOutputParameters.ts', () => {
    let sendFlowParameters: SendFlowParameters

    it('should return output parameters for base token with metadata and tag', () => {
        sendFlowParameters = {
            ...baseTransaction,
            metadata,
            tag,
        }
        const output = getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress,
            amount,
            unlocks: {},
            features: { metadata: '0x6d65746164617461', tag: '0x746167' },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for base token with expiration date', () => {
        sendFlowParameters = {
            ...baseTransaction,
            expirationDate,
        }
        const output = getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for base token with timelock date', () => {
        sendFlowParameters = {
            ...baseTransaction,
            timelockDate,
        }
        const output = getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { timelockUnixTime: 1678867475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for base token with timelock and expiration date', () => {
        sendFlowParameters = {
            ...baseTransaction,
            expirationDate,
            timelockDate,
        }
        const output = getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: 1680163475, timelockUnixTime: 1678867475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for native token without surplus', () => {
        sendFlowParameters = {
            ...baseTransaction,
            type: SendFlowType.TokenTransfer,
            expirationDate,
            baseCoinTransfer: {
                token: PERSISTED_ASSET_SHIMMER,
                rawAmount: BigInt('0'),
                unit: 'glow',
            },
            tokenTransfer: {
                token: nativeTokenAsset,
                rawAmount: BigInt(amount),
            },
        }
        const output = getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress,
            amount: '0',
            assets: {
                nativeTokens: [
                    {
                        amount: 1000000000n,
                        id: nativeTokenAsset.id,
                    },
                ],
            },
            features: {},
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for base token to layer 2', () => {
        sendFlowParameters = {
            ...baseTransaction,
            expirationDate,
            destinationNetworkId: destinationNetwork.id,
            gasFee: BigInt(gasFee),
        }
        const output = getOutputParameters(sendFlowParameters, senderAddress)
        const expectedOutput = {
            recipientAddress: destinationNetwork.aliasAddress,
            amount: '1000000000',
            features: {
                metadata:
                    '0x00025e4b3ca1e3f423ecd601010161200300010000070c000c30680e00000090000f0ea000060009000d300000000000808094ebdc03',
                sender: senderAddress,
            },
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Gift },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for native token to layer 2', () => {
        sendFlowParameters = {
            ...baseTransaction,
            type: SendFlowType.TokenTransfer,
            expirationDate,
            baseCoinTransfer: {
                token: PERSISTED_ASSET_SHIMMER,
                rawAmount: BigInt('0'),
                unit: 'glow',
            },
            tokenTransfer: {
                token: nativeTokenAsset,
                rawAmount: BigInt(amount),
            },
            destinationNetworkId: destinationNetwork.id,
            gasFee: BigInt(gasFee),
        }
        const output = getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress: destinationNetwork.aliasAddress,
            amount: '0',
            assets: {
                nativeTokens: [
                    {
                        amount: 1000000000n,
                        id: nativeTokenAsset.id,
                    },
                ],
            },
            features: {
                metadata:
                    '0x00025e4b3ca1e3f423ecd601010161200300010000070c000c30680e00000090000f0ea000060009000d300000000000400108cd4dcad7ccc383111942671ee8cdc487ddd250398331ca2692b8b1a81551a1c30100000000043b9aca00',
                sender: senderAddress,
            },
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Gift },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for nft to layer 2', () => {
        sendFlowParameters = {
            type: SendFlowType.NftTransfer,
            recipient: baseTransaction.recipient,
            nft: testNft,
            destinationNetworkId: destinationNetwork.id,
            gasFee: BigInt(gasFee),
        }
        const output = getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress: destinationNetwork.aliasAddress,
            amount: '0',
            assets: {
                nftId,
            },
            features: {
                metadata:
                    '0x00025e4b3ca1e3f423ecd601010161200300010000070c000c30680e00000090000f0ea000060009000d3000000000002001cd9430ff870a22f81f92428e5c06975fa3ec1a993331aa3db9fb2298e931ade1',
                sender: senderAddress,
            },
            unlocks: {},
            storageDeposit: { returnStrategy: ReturnStrategy.Gift },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for nft transfer', () => {
        sendFlowParameters = {
            type: SendFlowType.NftTransfer,
            recipient: baseTransaction.recipient,
            nft: testNft,
            expirationDate,
            destinationNetworkId: SupportedNetworkId.Shimmer,
        }
        const output = getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress,
            amount: '0',
            assets: {
                nftId,
            },
            features: {},
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for native token with surplus', () => {
        sendFlowParameters = {
            ...baseTransaction,
            type: SendFlowType.TokenTransfer,
            expirationDate,
            baseCoinTransfer: {
                token: PERSISTED_ASSET_SHIMMER,
                rawAmount: BigInt(surplus),
                unit: 'glow',
            },
            tokenTransfer: {
                token: nativeTokenAsset,
                rawAmount: BigInt(amount),
            },
        }
        const output = getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress,
            amount: surplus,
            assets: {
                nativeTokens: [
                    {
                        amount: 1000000000n,
                        id: nativeTokenAsset.id,
                    },
                ],
            },
            features: {},
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for transfer with gifted storage deposit', () => {
        sendFlowParameters = {
            ...baseTransaction,
            expirationDate,
            giftStorageDeposit: true,
        }
        const output = getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Gift },
        }
        expect(output).toStrictEqual(expectedOutput)
    })
})
