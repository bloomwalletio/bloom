<script lang="ts">
    import { ColorPicker, Input, Text } from '@bloomwalletio/ui'
    import { getRandomAccountColor } from '@core/account'
    import { tryCreateAdditionalAccount, validateAccountName } from '@core/account/actions'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { getTrimmedLength } from '@core/utils'
    import { closePopup } from '@desktop/auxiliary/popup'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let accountName: string | undefined = undefined
    export let error: string | undefined = undefined
    export let color: string | undefined = getRandomAccountColor()

    let isBusy: boolean = false

    $: accountName, (error = null)

    function validate(): boolean {
        try {
            validateAccountName(accountName?.trim() ?? '')
            if (!color) {
                throw new Error(localize('errors.accountColorRequired'))
            }
            return true
        } catch (err) {
            error = err.message
            return false
        }
    }

    async function onCreateClick(): Promise<void> {
        if (!validate()) {
            return
        }

        try {
            await checkActiveProfileAuth()
        } catch (error) {
            return
        }

        isBusy = true
        try {
            await tryCreateAdditionalAccount(accountName.trim(), color.toString())
            closePopup()
        } catch (err) {
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
            <Input bind:value={accountName} label={localize('general.accountName')} disabled={isBusy} bind:error />
        </div>
        <div class="flex flex-col gap-2">
            <Text type="body1">{localize('general.color')}</Text>
            <ColorPicker bind:value={color} />
        </div>
    </div>
</PopupTemplate>
