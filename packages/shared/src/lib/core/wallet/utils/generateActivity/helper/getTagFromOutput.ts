import { FeatureType, TagFeature } from '@iota/sdk/out/types'
import { Converter } from '@core/utils'
import { Output } from '@core/wallet/types'

export function getTagFromOutput(output: Output): string {
    const { tag } = <TagFeature>output?.features?.find((feature) => feature.type === FeatureType.Tag) ?? {
        tag: undefined,
    }
    if (tag) {
        return Converter.hexToUtf8(tag)
    }
}
