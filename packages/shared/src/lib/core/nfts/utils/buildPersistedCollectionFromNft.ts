import { getClient } from '@core/profile-manager'
import type { AliasOutput, MetadataFeature, NftOutput } from '@iota/sdk'
import { FeatureType } from '@iota/sdk/out/types'
import { NftStandard } from '../enums'
import {
    IErc721Nft,
    IIrc27Nft,
    IPersistedErc721Collection,
    IPersistedIrc27Collection,
    Nft,
    PersistedCollection,
} from '../interfaces'
import { parseNftMetadata } from './parseNftMetadata'

export async function buildPersistedCollectionFromNft(nft: Nft): Promise<PersistedCollection | undefined> {
    if (nft.standard === NftStandard.Irc27) {
        return buildPersistedCollectionForIrc27Nft(nft)
    } else if (nft.standard === NftStandard.Erc721) {
        return buildPersistedCollectionForErc721Nft(nft)
    }
}

async function buildPersistedCollectionForIrc27Nft(nft: IIrc27Nft): Promise<IPersistedIrc27Collection | undefined> {
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

function buildPersistedCollectionForErc721Nft(nft: IErc721Nft): IPersistedErc721Collection | undefined {
    return { id: nft.contractMetadata.address, ...nft.contractMetadata }
}
