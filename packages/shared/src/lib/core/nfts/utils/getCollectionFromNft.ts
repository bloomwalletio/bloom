import { NftStandard } from '../enums'
import { Collection, Nft } from '../interfaces'
import { Converter } from '@core/utils'
import { getClient } from '@core/profile-manager'
import type { AliasOutput, MetadataFeature, NftOutput } from '@iota/sdk'
import { FeatureType } from '@iota/sdk/out/types'

export async function getCollectionFromNft(nft: Nft): Promise<Collection | undefined> {
    if (nft.standard !== NftStandard.Irc27) {
        console.error('Unsupported NFT standard:', nft.standard)
        return
    }

    const { aliasId = '', nftId = '' } = nft.issuer ?? {}
    if (!aliasId && !nftId) {
        console.error('Missing NFT identifiers.')
        return
    }

    try {
        const client = await getClient()
        const outputId = aliasId ? await client.aliasOutputId(aliasId) : await client.nftOutputId(nftId)
        if (!outputId) {
            console.error('Failed to obtain output ID for:', aliasId, nftId)
            return
        }

        const outputResponse = await client.getOutput(outputId)
        const output = outputResponse.output as AliasOutput | NftOutput

        const metadataFeature = output.immutableFeatures?.find(
            (feature) => feature.type === FeatureType.Metadata
        ) as MetadataFeature

        if (!metadataFeature?.data) {
            console.error('No metadata found in output.')
            return
        }

        const { standard, name, type, uri } = JSON.parse(Converter.hexToUtf8(metadataFeature.data))

        return { standard, name, type, uri, nfts: [] }
    } catch (error) {
        console.error('Error retrieving collection from NFT:', error)
    }
}
