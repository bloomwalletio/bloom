import type { FoundryOutput } from '@iota/sdk'

export function getMetadataFromFoundryOutput(foundry: FoundryOutput): string | undefined {
    for (const feature of foundry?.immutableFeatures ?? []) {
        if (feature?.type === 2) {
            return feature.data
        }
    }

    for (const feature of foundry?.features ?? []) {
        if (feature.type === 2) {
            return feature.data
        }
    }
    return undefined
}
