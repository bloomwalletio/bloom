import { activeProfileId } from '@core/profile/stores/active-profile-id.store'
import { SupportedNetworkId } from '@core/network/enums'
import { FALLBACK_ESTIMATED_GAS } from '@core/layer-2/constants'
import { DEFAULT_CHAIN_CONFIGURATIONS } from '@core/network/constants'
import { getOutputParameters } from '../utils'
import { ReturnStrategy, SubjectType } from '../enums'
import { IToken, IPersistedToken } from '@core/token/interfaces'
import { TokenStandard, VerifiedStatus } from '@core/token/enums'
import { SendFlowType } from '../stores'
import { SendFlowParameters } from '../types'

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

const destinationNetwork = DEFAULT_CHAIN_CONFIGURATIONS[SupportedNetworkId.Testnet]

const nftId = '0xcd9430ff870a22f81f92428e5c06975fa3ec1a993331aa3db9fb2298e931ade1'
const surplus = '50000'

const testNft = {
    id: nftId,
    address: 'rms1qqqp07ychhkc3u68ueug0zqq9g0wtfgeatynr6ksm9jwud30rvlkyqnhpl5',
    name: 'testNft',
    isSpendable: true,
    timelockTime: 1678867475,
    latestOutputId: 'testOutputId',
    composedUrl: 'http://example.com',
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
        rawAmount: amount,
        unit: 'glow',
    },
    recipient: {
        type: SubjectType.Address,
        address: recipientAddress,
    },
}

jest.mock('@core/token/stores/persisted-tokens.store', () => ({
    getPersistedToken: jest.fn(() => PERSISTED_ASSET_SHIMMER),
    getAssetById: jest.fn((id) => (id === PERSISTED_ASSET_SHIMMER.id ? PERSISTED_ASSET_SHIMMER : nativeTokenAsset)),
}))

jest.mock('@core/token/actions/getAccountTokensForSelectedAccount', () => ({
    getAccountTokensForSelectedAccount: jest.fn((_) => {
        return {
            [SupportedNetworkId.Testnet]: {
                baseCoin: PERSISTED_ASSET_SHIMMER,
                nativeTokens: [nativeTokenAsset],
            },
        }
    }),
}))

jest.mock('../../network/actions/getChainConfiguration', () => ({
    getChainConfiguration: jest.fn((_) => destinationNetwork),
}))

jest.mock('../../profile/actions/active-profile/getCoinType', () => ({
    getCoinType: jest.fn((_) => '1'),
}))

jest.mock('../../layer-2/utils/estimateGasForLayer1ToLayer2Transaction', () => ({
    estimateGasForLayer1ToLayer2Transaction: jest.fn(() => FALLBACK_ESTIMATED_GAS.toJSNumber()),
}))

describe('File: getOutputParameters.ts', () => {
    let sendFlowParameters: SendFlowParameters

    beforeAll(() => {
        // TODO: refactor getOutputParameters to not rely on this store
        activeProfileId.set('id')
    })

    it('should return output parameters for base token with metadata and tag', async () => {
        sendFlowParameters = {
            ...baseTransaction,
            metadata,
            tag,
        }
        const output = await getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress,
            amount,
            unlocks: {},
            features: { metadata: '0x6d65746164617461', tag: '0x746167' },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for base token with expiration date', async () => {
        sendFlowParameters = {
            ...baseTransaction,
            expirationDate,
        }
        const output = await getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for base token with timelock date', async () => {
        sendFlowParameters = {
            ...baseTransaction,
            timelockDate,
        }
        const output = await getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { timelockUnixTime: 1678867475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for base token with timelock and expiration date', async () => {
        sendFlowParameters = {
            ...baseTransaction,
            expirationDate,
            timelockDate,
        }
        const output = await getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: 1680163475, timelockUnixTime: 1678867475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for native token without surplus', async () => {
        sendFlowParameters = {
            ...baseTransaction,
            type: SendFlowType.TokenTransfer,
            expirationDate,
            baseCoinTransfer: {
                token: PERSISTED_ASSET_SHIMMER,
                rawAmount: '0',
                unit: 'glow',
            },
            tokenTransfer: {
                token: nativeTokenAsset,
                rawAmount: amount,
            },
        }
        const output = await getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress,
            amount: '0',
            assets: {
                nativeTokens: [
                    {
                        amount: '0x3b9aca00',
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

    it('should return output parameters for base token to layer 2', async () => {
        sendFlowParameters = {
            ...baseTransaction,
            expirationDate,
            destinationNetworkId: destinationNetwork.id,
        }
        const output = await getOutputParameters(sendFlowParameters, senderAddress)
        const expectedOutput = {
            recipientAddress: destinationNetwork.aliasAddress,
            amount: (Number(FALLBACK_ESTIMATED_GAS) + Number(amount)).toString(),
            features: {
                metadata:
                    '0x00000000025e4b3ca1e3f423c09a0c010161200300010000070c000c30680e00000090000f0ea000060009000d300000000000808094ebdc03',
                sender: senderAddress,
            },
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for native token to layer 2', async () => {
        sendFlowParameters = {
            ...baseTransaction,
            type: SendFlowType.TokenTransfer,
            expirationDate,
            baseCoinTransfer: {
                token: PERSISTED_ASSET_SHIMMER,
                rawAmount: '0',
                unit: 'glow',
            },
            tokenTransfer: {
                token: nativeTokenAsset,
                rawAmount: amount,
            },
            destinationNetworkId: destinationNetwork.id,
        }
        const output = await getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress: destinationNetwork.aliasAddress,
            amount: FALLBACK_ESTIMATED_GAS.toString(),
            assets: {
                nativeTokens: [
                    {
                        amount: '0x3b9aca00',
                        id: nativeTokenAsset.id,
                    },
                ],
            },
            features: {
                metadata:
                    '0x00000000025e4b3ca1e3f423c09a0c010161200300010000070c000c30680e00000090000f0ea000060009000d300000000000400108cd4dcad7ccc383111942671ee8cdc487ddd250398331ca2692b8b1a81551a1c30100000000043b9aca00',
                sender: senderAddress,
            },
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for nft to layer 2', async () => {
        sendFlowParameters = {
            type: SendFlowType.NftTransfer,
            recipient: baseTransaction.recipient,
            nft: testNft,
            destinationNetworkId: destinationNetwork.id,
        }
        const output = await getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress: destinationNetwork.aliasAddress,
            amount: FALLBACK_ESTIMATED_GAS.toString(),
            assets: {
                nftId,
            },
            features: {
                metadata:
                    '0x00000000025e4b3ca1e3f423c09a0c010161200300010000070c000c30680e00000090000f0ea000060009000d3000000000002001cd9430ff870a22f81f92428e5c06975fa3ec1a993331aa3db9fb2298e931ade1',
                sender: senderAddress,
            },
            unlocks: {},
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for nft transfer', async () => {
        sendFlowParameters = {
            type: SendFlowType.NftTransfer,
            recipient: baseTransaction.recipient,
            nft: testNft,
            expirationDate,
        }
        const output = await getOutputParameters(sendFlowParameters, senderAddress)

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

    it('should return output parameters for native token with surplus', async () => {
        sendFlowParameters = {
            ...baseTransaction,
            type: SendFlowType.TokenTransfer,
            expirationDate,
            baseCoinTransfer: {
                token: PERSISTED_ASSET_SHIMMER,
                rawAmount: surplus,
                unit: 'glow',
            },
            tokenTransfer: {
                token: nativeTokenAsset,
                rawAmount: amount,
            },
        }
        const output = await getOutputParameters(sendFlowParameters, senderAddress)

        const expectedOutput = {
            recipientAddress,
            amount: surplus,
            assets: {
                nativeTokens: [
                    {
                        amount: '0x3b9aca00',
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

    it('should return output parameters for transfer with gifted storage deposit', async () => {
        sendFlowParameters = {
            ...baseTransaction,
            expirationDate,
            giftStorageDeposit: true,
        }
        const output = await getOutputParameters(sendFlowParameters, senderAddress)

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
