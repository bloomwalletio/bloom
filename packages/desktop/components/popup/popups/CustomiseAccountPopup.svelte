<script lang="ts">
    import { validateAccountName } from '@core/account/actions'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { updateActiveAccountPersistedData } from '@core/profile/actions'
    import { getTrimmedLength } from '@core/utils'
    import { closePopup } from '@desktop/auxiliary/popup'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { ColorPicker, Input, Text } from '@bloomwalletio/ui'

    export let error = ''

    let isBusy = false
    let accountName = $selectedAccount.name
    let color = $selectedAccount.color

    $: accountName, (error = '')
    $: trimmedAccountAlias = accountName.trim()
    $: invalidAliasUpdate = !getTrimmedLength(accountName) || isBusy || accountName === $selectedAccount.name
    $: hasColorChanged = $selectedAccount.color !== color

    async function onSaveClick(): Promise<void> {
        if (trimmedAccountAlias) {
            error = ''
            try {
                await validateAccountName(trimmedAccountAlias, true, trimmedAccountAlias !== $selectedAccount.name)
            } catch ({ message }) {
                error = message
                return
            }

            isBusy = true
            saveAccountPersistedData()
        }
    }

    function onCancelClick(): void {
        closePopup()
    }

    function saveAccountPersistedData(): void {
        try {
            if (trimmedAccountAlias || color) {
                updateActiveAccountPersistedData($selectedAccount?.index, { name: trimmedAccountAlias, color })
                closePopup()
            }
        } finally {
            isBusy = false
        }
    }
</script>

<PopupTemplate
    title={localize('general.manageAccount')}
    busy={isBusy}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        form: 'customise-account-form',
        text: localize('actions.save'),
        disabled: invalidAliasUpdate && !hasColorChanged,
        onClick: onSaveClick,
    }}
>
    <form on:submit|preventDefault={onSaveClick} id="customise-account-form" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <Text type="body1">{localize('general.name')}</Text>
            <Input bind:value={accountName} label={localize('general.accountName')} disabled={isBusy} bind:error />
        </div>
        <div class="flex flex-col gap-2">
            <Text type="body1">{localize('general.color')}</Text>
            <ColorPicker bind:value={color} />
        </div>
    </form>
</PopupTemplate>
