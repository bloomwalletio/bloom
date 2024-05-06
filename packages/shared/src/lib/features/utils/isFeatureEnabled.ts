import featuresObject from '@features/features'

export function isFeatureEnabled(featureString: string, recursive: boolean = true): boolean {
    const featurePathToCheck = featureString.split('.')
    let previousFeatures = featuresObject
    for (let i = 0; i < featurePathToCheck.length; i++) {
        const currentFeature = previousFeatures[featurePathToCheck[i]]

        if (i === featurePathToCheck.length - 1 && currentFeature?.enabled) {
            return true
        }

        if (recursive && !currentFeature?.enabled) {
            return false
        }
        previousFeatures = currentFeature
    }
    return false
}
