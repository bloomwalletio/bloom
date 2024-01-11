<script lang="ts">
    import { Checkbox } from '@bloomwalletio/ui'
    import { setNextSelectedAccount } from '@core/account/actions'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'
    import SettingsSection from '../SettingsSection.svelte'

    let showHiddenAccounts = $activeProfile?.showHiddenAccounts

    $: hasLoadedAccounts = $activeProfile?.hasLoadedAccounts
    $: updateActiveProfile({ showHiddenAccounts: showHiddenAccounts })

    $: if ($hasLoadedAccounts && !showHiddenAccounts) {
        setNextSelectedAccount()
    }
</script>

<SettingsSection
    title={localize('views.settings.hiddenAccounts.title')}
    description={localize('views.settings.hiddenAccounts.description')}
>
    <Checkbox
        size="lg"
        textType="base"
        label={localize('actions.showHiddenAccounts')}
        bind:checked={showHiddenAccounts}
    />
</SettingsSection>
