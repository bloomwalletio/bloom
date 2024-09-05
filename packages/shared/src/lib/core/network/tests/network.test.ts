import { INode } from '@iota/sdk/out/types'
import { SupportedNetworkId, SupportedStardustNetworkId } from '../constants'
import { NetworkId, StardustNetworkId } from '../types'
import { getDefaultNodes, isSupportedNetworkId } from '../utils'

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

    function _buildNodes(networkId: StardustNetworkId): INode[] | undefined {
        const nodes = (EXPECTED_NODE_URLS?.[networkId] ?? []).map((url) => _buildNode(url))
        return nodes?.filter((node) => node !== undefined) as INode[]
    }

    const EXPECTED_NODE_URLS: Readonly<{ [key in StardustNetworkId]?: string[] }> = {
        [SupportedNetworkId.Iota]: ['https://api.stardust-mainnet.iotaledger.net', 'https://iota-node.tanglebay.com'],
        [SupportedNetworkId.Shimmer]: ['https://api.shimmer.network'],
        [SupportedNetworkId.IotaTestnet]: ['https://api.testnet.iotaledger.net'],
        [SupportedNetworkId.Testnet]: ['https://api.testnet.shimmer.network'],
    }

    describe('Function: getDefaultNodes', () => {
        it('should return the correct official nodes given a valid network type', () => {
            Object.values(SupportedStardustNetworkId).forEach((networkId) => {
                expect(getDefaultNodes(networkId)).toEqual(_buildNodes(networkId))
            })
        })
        it('should return no official nodes given an invalid network type', () => {
            expect(getDefaultNodes('undefined' as StardustNetworkId)).toEqual([])
        })
    })

    describe('Function: isSupportedNetworkId', () => {
        it('should return the correct values given a valid network type', () => {
            Object.values(SupportedNetworkId).forEach((networkId) => {
                expect(isSupportedNetworkId(networkId)).toBe(true)
            })
        })
        it('should return false given an invalid network type', () => {
            expect(isSupportedNetworkId('undefined' as NetworkId)).toBe(false)
        })
    })
})
