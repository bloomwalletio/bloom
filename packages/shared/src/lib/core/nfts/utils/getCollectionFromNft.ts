import { NftStandard } from '../enums'
import { Collection, Nft } from '../interfaces'
import { Converter } from '@core/utils'
import { getClient } from '@core/profile-manager'
import type { AliasOutput, MetadataFeature, NftOutput } from '@iota/sdk'
import { FeatureType } from '@iota/sdk/out/types'

export async function getCollectionFromNft(nft: Nft): Promise<Collection | undefined> {
    if (nft.standard !== NftStandard.Irc27) {
        return
    }

    const { aliasId, nftId } = nft.issuer ?? {}

    const client = await getClient()

    const outputId = await client.aliasOutputId(aliasId ?? nftId ?? '')
    const outputResponse = await client.getOutput(outputId)
    const output = outputResponse.output as AliasOutput | NftOutput

    const metadataFeature = output.immutableFeatures?.find(
        (immutableFeature) => immutableFeature.type === FeatureType.Metadata
    ) as MetadataFeature
    const immutableMetadata = metadataFeature?.data
    if (!immutableMetadata) {
        return
    }

    const { standard, name, type, uri } = JSON.parse(Converter.hexToUtf8(immutableMetadata))

    return { standard, name, type, uri, nfts: [] }
}
