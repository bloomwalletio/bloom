import { countryCode } from '@auxiliary/country/stores'
import { appParameters } from '@core/app/stores'
import { get } from 'svelte/store'

export function isFeatureNotGeoFenced(featureString: string): boolean {
    const currentCountryCode = get(countryCode)
    const featurePathToCheck = featureString.split('.')
    const geoFence = get(appParameters)?.geoFence
    let previousFeatures = geoFence
    for (let i = 0; i < featurePathToCheck.length; i++) {
        const currentFeature = previousFeatures?.[featurePathToCheck[i]]
        if (!currentFeature) {
            return true
        }
        if (i === featurePathToCheck.length - 1) {
            return !currentFeature?.some((blockedCountry) => blockedCountry === currentCountryCode)
        }
        previousFeatures = currentFeature
    }
    return true
}
