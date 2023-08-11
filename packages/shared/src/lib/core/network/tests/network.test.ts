import { SupportedNetworkId } from '../enums'
import { IClientOptions, INode } from '../interfaces'
import { NetworkIdType } from '../types'
import { checkNodeUrlValidity, getDefaultClientOptions, getOfficialNodes, isOfficialNetwork } from '../utils'

describe('File: network.ts', () => {
    function _buildNode(url: string | undefined): INode | undefined {
        if (url) {
            return {
                url,
                disabled: false,
            }
        } else {
            return undefined
        }
    }

    function _buildNodes(networkId: NetworkIdType): INode[] | undefined {
        const nodes = (EXPECTED_NODE_URLS?.[networkId] ?? []).map((url) => _buildNode(url))
        return nodes?.filter((node) => node !== undefined) as INode[]
    }

    const EXPECTED_NODE_URLS: Readonly<{ [key in NetworkIdType]?: string[] }> = {
        [SupportedNetworkId.Iota]: [
            'https://chrysalis-nodes.iota.org',
            'https://chrysalis-nodes.iota.cafe',
            'https://iota-node.tanglebay.com',
        ],
        [SupportedNetworkId.Shimmer]: ['https://api.shimmer.network'],
        [SupportedNetworkId.Testnet]: ['https://api.testnet.shimmer.network'],
    }

    function getExpectedNodes(networkId: NetworkIdType): INode[] | undefined {
        return _buildNodes(networkId)
    }

    describe('Function: getClientOptions', () => {
        it('should return the client options of the active profile if present', () => {
            const clientOptions = getDefaultClientOptions(SupportedNetworkId.Iota)
            expect(clientOptions).toEqual(<IClientOptions>{
                nodes: [
                    _buildNode(EXPECTED_NODE_URLS?.[SupportedNetworkId.Iota]?.[0]),
                    _buildNode(EXPECTED_NODE_URLS?.[SupportedNetworkId.Iota]?.[1]),
                    _buildNode(EXPECTED_NODE_URLS?.[SupportedNetworkId.Iota]?.[2]),
                ],
            })
        })
    })

    describe('Function: getOfficialNodes', () => {
        it('should return the correct official nodes given a valid network type', () => {
            Object.values(SupportedNetworkId).forEach((networkId) => {
                expect(getOfficialNodes(networkId)).toEqual(_buildNodes(networkId))
            })
        })
        it('should return no official nodes given an invalid network type', () => {
            expect(getOfficialNodes('undefined' as NetworkIdType)).toEqual([])
        })
    })

    describe('Function: isOfficialNetwork', () => {
        it('should return the correct values given a valid network type', () => {
            Object.values(SupportedNetworkId).forEach((networkId) => {
                expect(isOfficialNetwork(networkId)).toBe(true)
            })
        })
        it('should return false given an invalid network type', () => {
            expect(isOfficialNetwork('undefined' as NetworkIdType)).toBe(false)
        })
    })

    describe('Function: checkNodeUrlValidity', () => {
        enum UrlError {
            Invalid = 'error.node.invalid',
            Insecure = 'error.node.https',
            Duplicate = 'error.node.duplicate',
        }

        const _check = (url: string | undefined, allowInsecure: boolean = false): string | undefined =>
            checkNodeUrlValidity(getExpectedNodes(SupportedNetworkId.Iota), url ?? '', allowInsecure)

        it('should return undefined for valid node URLs', () => {
            expect(_check('https://mainnet.tanglebay.com')).toBeUndefined()
            expect(_check(EXPECTED_NODE_URLS?.[SupportedNetworkId.Shimmer]?.[0] ?? '')).toBeUndefined()
        })
        it('should catch generally invalid URLs', () => {
            expect(_check('htps://mainnet.tanglebay.com')).toEqual(UrlError.Invalid)
            expect(_check('https:/mainnet.tanglebay.com')).toEqual(UrlError.Invalid)

            expect(_check('https://mainnet.tanglebay.com')).toBeUndefined()
        })
        it('should catch duplicate node URLs', () => {
            expect(_check(EXPECTED_NODE_URLS?.[SupportedNetworkId.Iota]?.[0])).toEqual(UrlError.Duplicate)
            expect(_check(EXPECTED_NODE_URLS?.[SupportedNetworkId.Iota]?.[1])).toEqual(UrlError.Duplicate)

            expect(_check(EXPECTED_NODE_URLS[SupportedNetworkId.Shimmer]?.[0])).toBeUndefined()
        })
        it('may or may NOT catch insecure URLs', () => {
            expect(_check('http://mainnet.tanglebay.com')).toEqual(UrlError.Insecure)

            // TODO: Enable this test when HTTP support has been audited
            // expect(_check('http://mainnet.tanglebay.com', true)).toBeUndefined()
        })
    })
})
