<script lang="ts">
    import { requestTokensFromFaucet } from '@contexts/developer'
    import { localize } from '@core/i18n'
    import { network } from '@core/network'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { Error } from '@bloomwalletio/ui'
    import { handleError } from '@core/error/handlers/handleError'
    import PopupTemplate from '../PopupTemplate.svelte'

    let isBusy = false
    let error: string

    $: networkData = $network.getMetadata()

    async function onConfirmClick(): Promise<void> {
        error = null
        try {
            isBusy = true
            await requestTokensFromFaucet()
            closePopup()
        } catch (err) {
            error = err.error
            handleError(err)
        } finally {
            isBusy = false
        }
    }

    function onCancelClick(): void {
        closePopup()
    }
</script>

<PopupTemplate
    title={localize('popups.faucetRequest.title')}
    description={localize('popups.faucetRequest.body', {
        values: { token: networkData.baseToken.name, network: networkData.networkName },
    })}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
        disabled: isBusy,
    }}
    continueButton={{
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
        disabled: isBusy,
    }}
    busy={isBusy}
>
    {#if error}
        <Error {error} />
    {/if}
</PopupTemplate>
