<script lang="ts">
    import { ColorPicker, Input, Text } from '@bloomwalletio/ui'
    import { getRandomAccountColor } from '@core/account'
    import { tryCreateAdditionalAccount, validateAccountName } from '@core/account/actions'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { getTrimmedLength } from '@core/utils'
    import { closePopup, updatePopupProps } from '@desktop/auxiliary/popup'
    import { onMount } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let accountName: string | undefined = undefined
    export let error: string | undefined = undefined
    export let color: string | undefined = getRandomAccountColor()
    export let _onMount: ((..._: any[]) => Promise<void>) | undefined = undefined

    let isBusy: boolean = false

    $: accountName, (error = null)

    async function onCreateClick(): Promise<void> {
        try {
            if (!accountName) {
                return
            }
            isBusy = true
            error = null
            await validateAccountName(accountName.trim())
            updatePopupProps({ accountAlias: accountName, color, error })
            await checkActiveProfileAuth(_create, { stronghold: true, ledger: true })
        } catch (err) {
            error = err.error
            handleError(err)
        } finally {
            isBusy = false
        }
    }

    async function _create(): Promise<void> {
        try {
            isBusy = true
            if (accountName && color) {
                await tryCreateAdditionalAccount(accountName.trim(), color.toString())
                closePopup()
            }
        } catch (err) {
            error = err.error
        } finally {
            isBusy = false
        }
    }

    function onCancelClick(): void {
        closePopup()
    }

    onMount(async () => {
        if (_onMount) {
            try {
                isBusy = true
                await _onMount()
            } catch (err) {
                error = err.error
                handleError(err)
            } finally {
                isBusy = false
            }
        }
    })
</script>

<PopupTemplate
    title={localize('popups.createAccount.title')}
    busy={isBusy}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('actions.create'),
        disabled: !getTrimmedLength(accountName),
        onClick: onCreateClick,
    }}
>
    <div class="flex flex-col space-y-5">
        <div class="flex flex-col gap-2">
            <Text type="body1">{localize('general.name')}</Text>
            <Input bind:value={accountName} label={localize('general.accountName')} disabled={isBusy} {error} />
        </div>
        <div class="flex flex-col gap-2">
            <Text type="body1">{localize('general.color')}</Text>
            <ColorPicker bind:value={color} />
        </div>
    </div>
</PopupTemplate>
