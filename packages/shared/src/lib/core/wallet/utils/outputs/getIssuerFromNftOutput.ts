import { Address } from '@iota/sdk/out/types/block/address'
import { IssuerFeature, NftOutput, FeatureType } from '@iota/sdk/out/types/block/output'

export function getIssuerFromNftOutput(output: NftOutput): Address {
    const metadata = output.immutableFeatures?.find((feature) => feature.type === FeatureType.Issuer) as IssuerFeature
    return metadata?.address
}
