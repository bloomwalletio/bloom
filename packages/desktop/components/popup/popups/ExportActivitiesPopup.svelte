<script lang="ts">
    import { formatCurrency, localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { convertActvitiesToCsv } from '@core/activity/utils'
    import { allAccountActivities } from '@core/activity'
    import { activeProfile, visibleActiveAccounts } from '@core/profile/stores'
    import { Platform } from '@core/app/classes'
    import { handleError } from '@core/error/handlers'
    import { SelectionOption, getTimestampForFilenames } from '@core/utils'
    import { IAccountState } from '@core/account/interfaces'
    import { Selection } from '@ui'
    import { Indicator, Text } from '@bloomwalletio/ui'
    import { allAccountFiatBalances } from '@core/token/stores'
    import { showNotification } from '@auxiliary/notification'

    let busy = false

    $: checkedAccounts = accountSelections.filter((selection) => selection.checked).map((selection) => selection.value)
    let accountSelections: SelectionOption<IAccountState>[] = $visibleActiveAccounts.map((account) => ({
        label: account.name,
        value: account,
        checked: true,
        required: false,
    }))

    function onCancelClick(): void {
        closePopup()
    }

    async function onExportClick(): Promise<void> {
        try {
            busy = true
            const timestamp = getTimestampForFilenames()
            const filename = `bloom-activities-${$activeProfile.name.replaceAll(' ', '')}-${timestamp}`
            const content = convertActvitiesToCsv(checkedAccounts, $allAccountActivities)

            await Platform.saveTextInFile(filename, 'csv', content)
            showNotification({
                variant: 'success',
                text: localize('notifications.exportActivities.success'),
            })
            closePopup()
        } catch (err) {
            handleError(err)
        } finally {
            busy = false
        }
    }

    function getAccountBalance(accountIndex: number): string {
        return formatCurrency($allAccountFiatBalances[accountIndex]?.total)
    }
</script>

<PopupTemplate
    title={localize('popups.exportActivities.title')}
    description={localize('popups.exportActivities.body')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('actions.export'),
        onClick: onExportClick,
        disabled: checkedAccounts.length === 0,
    }}
    {busy}
>
    <div class="max-h-80 overflow-auto">
        <Selection
            bind:selectionOptions={accountSelections}
            title={localize('popups.exportActivities.chooseAccounts')}
            error={checkedAccounts.length ? undefined : localize('popups.exportActivities.emptyAccounts')}
            let:option
        >
            <div class="w-full flex items-center justify-between gap-2">
                <div class="flex flex-row items-center gap-3">
                    <Indicator color={option.value.color} />
                    <Text>{option.value.name}</Text>
                </div>
                <Text>{getAccountBalance(option.value.index)}</Text>
            </div>
        </Selection>
    </div>
</PopupTemplate>
