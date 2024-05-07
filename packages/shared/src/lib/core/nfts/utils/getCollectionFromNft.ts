import { getClient } from '@core/profile-manager'
import type { AliasOutput, MetadataFeature, NftOutput } from '@iota/sdk'
import { FeatureType } from '@iota/sdk/out/types'
import { NftStandard } from '../enums'
import { Collection, IErc721Collection, IErc721Nft, IIrc27Collection, IIrc27Nft, Nft } from '../interfaces'
import { parseNftMetadata } from './parseNftMetadata'

export async function getCollectionFromNft(nft: Nft): Promise<Collection | undefined> {
    if (nft.standard === NftStandard.Irc27) {
        return getCollectionForIrc27Nft(nft)
    } else if (nft.standard === NftStandard.Erc721) {
        return getCollectionForErc721Nft(nft)
    }
}

async function getCollectionForIrc27Nft(nft: IIrc27Nft): Promise<IIrc27Collection | undefined> {
    const { aliasId = '', nftId = '' } = nft.issuer ?? {}
    if (!aliasId && !nftId) {
        return
    }

    try {
        const client = await getClient()
        const outputId = aliasId ? await client.aliasOutputId(aliasId) : await client.nftOutputId(nftId)
        if (!outputId) {
            return
        }

        const outputResponse = await client.getOutput(outputId)
        const output = outputResponse.output as AliasOutput | NftOutput

        const metadataFeature = output.immutableFeatures?.find(
            (feature) => feature.type === FeatureType.Metadata
        ) as MetadataFeature

        if (!metadataFeature?.data) {
            return
        }

        const parsedMetadata = parseNftMetadata(metadataFeature.data)
        if (parsedMetadata?.standard !== NftStandard.Irc27) {
            return
        }

        return { id: aliasId ?? nftId, ...parsedMetadata }
    } catch (error) {
        console.error('Error retrieving collection from NFT:', error)
    }
}

function getCollectionForErc721Nft(nft: IErc721Nft): IErc721Collection | undefined {
    return { id: nft.contractMetadata.address, ...nft.contractMetadata }
}
