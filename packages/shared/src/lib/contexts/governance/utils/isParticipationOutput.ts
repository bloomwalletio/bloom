import { CommonOutput, FeatureType, TagFeature } from '@iota/sdk/out/types'

import { PARTICIPATE_TAG_HEX } from '../constants'

export function isParticipationOutput(output: CommonOutput): boolean {
    const outputFeature = output?.features?.find((feature) => feature.type === FeatureType.Tag) as TagFeature
    return outputFeature.tag === PARTICIPATE_TAG_HEX
}
