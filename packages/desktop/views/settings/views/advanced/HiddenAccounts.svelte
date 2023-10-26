<script lang="ts">
    import { Checkbox, Text } from '@bloomwalletio/ui'
    import { setNextSelectedAccount } from '@core/account/actions'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'

    let showHiddenAccounts = $activeProfile?.showHiddenAccounts
    $: updateActiveProfile({ showHiddenAccounts: showHiddenAccounts })

    $: if ($activeProfile?.hasLoadedAccounts && !showHiddenAccounts) {
        setNextSelectedAccount()
    }
</script>

<Text type="body2" class="mb-2">{localize('views.settings.hiddenAccounts.title')}</Text>
<Text type="base" textColor="secondary" class="mb-6">{localize('views.settings.hiddenAccounts.description')}</Text>
<Checkbox label={localize('actions.showHiddenAccounts')} bind:checked={showHiddenAccounts} />
