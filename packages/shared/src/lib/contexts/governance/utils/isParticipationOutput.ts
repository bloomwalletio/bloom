import { FeatureType, TagFeature } from '@iota/sdk/out/types'

import { Output } from '@core/wallet'

import { PARTICIPATE_TAG_HEX } from '../constants'

export function isParticipationOutput(output: Output): boolean {
    const outputFeature = <TagFeature>output?.features?.find((feature) => feature.type === FeatureType.Tag)
    return outputFeature?.tag === PARTICIPATE_TAG_HEX
}
