import { getSelectedAccount } from '@core/account/stores'
import { localize } from '@core/i18n'
import { FAUCET_URLS } from '@core/network/constants'
import { getActiveNetworkId } from '@core/network/actions'
import { showNotification } from '@auxiliary/notification/actions'

export async function requestTokensFromFaucet(): Promise<void> {
    const networkId = getActiveNetworkId()
    const url = FAUCET_URLS?.[networkId]

    if (!url) {
        return Promise.reject()
    }
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const address = getSelectedAccount().depositAddress
    const body = JSON.stringify({ address })

    const requestInit = {
        method: 'POST',
        headers,
        body,
    }

    try {
        const response = await fetch(url, requestInit)
        if (response?.status === 202) {
            showNotification({
                variant: 'success',
                text: localize('notifications.faucetRequest.success'),
            })
            return Promise.resolve()
        } else if (response?.status === 400) {
            return Promise.reject('Request already being processed for your address')
        } else {
            return Promise.reject('Request failed, please try again')
        }
    } catch (err) {
        return Promise.reject(err)
    }
}
