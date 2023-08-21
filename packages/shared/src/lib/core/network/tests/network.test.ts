import { SupportedNetworkId } from '../enums'
import { IClientOptions, INode } from '../interfaces'
import { NetworkId } from '../types'
import { checkNodeUrlValidity, getDefaultClientOptions, getOfficialNodes, isSupportedNetworkId } from '../utils'

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

    function _buildNodes(networkId: NetworkId): INode[] | undefined {
        const nodes = (EXPECTED_NODE_URLS?.[networkId] ?? []).map((url) => _buildNode(url))
        return nodes?.filter((node) => node !== undefined) as INode[]
    }

    const EXPECTED_NODE_URLS: Readonly<{ [key in NetworkId]?: string[] }> = {
        [SupportedNetworkId.Shimmer]: ['https://api.shimmer.network'],
        [SupportedNetworkId.Testnet]: ['https://api.testnet.shimmer.network'],
    }

    function getExpectedNodes(networkId: NetworkId): INode[] | undefined {
        return _buildNodes(networkId)
    }

    describe('Function: getOfficialNodes', () => {
        it('should return the correct official nodes given a valid network type', () => {
            Object.values(SupportedNetworkId).forEach((networkId) => {
                expect(getOfficialNodes(networkId)).toEqual(_buildNodes(networkId))
            })
        })
        it('should return no official nodes given an invalid network type', () => {
            expect(getOfficialNodes('undefined' as NetworkId)).toEqual([])
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
