import { fetchWithTimeout } from '@core/nfts'
import { APP_PARAMETERS_REMOTE_CONFIGURATION_URL } from '../constants'
import { appParameters } from '../stores'

export async function updateAppParametersWithRemoteConfiguration(): Promise<void> {
    try {
        const response = await fetchWithTimeout(APP_PARAMETERS_REMOTE_CONFIGURATION_URL, 2, { method: 'GET' })
        if (response.ok) {
            const remoteAppParameters = await response.json()
            appParameters.set(remoteAppParameters)
        }
    } catch (error) {
        console.error('Failed to fetch remote app parameters', error)
    }
}
