import { IssuerFeature, NftOutput, FeatureType } from '@iota/sdk/out/types'

export function getIssuerFromNftOutput(output: NftOutput): { type: number; nftId?: string; aliasId?: string } {
    const metadata = output.immutableFeatures?.find((feature) => feature.type === FeatureType.Issuer) as IssuerFeature
    return metadata?.address
}
