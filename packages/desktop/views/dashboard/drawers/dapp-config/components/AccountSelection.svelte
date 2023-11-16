<script lang="ts">
    import { IAccountState } from '@core/account'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { onMount } from 'svelte'
    import Selection from './Selection.svelte'
    import { localize } from '@core/i18n'

    export let checkedAccounts: IAccountState[]

    let accountSelections: { label: string; value: IAccountState; checked: boolean; required: boolean }[] = []
    function setAccountSelections(): void {
        accountSelections = $visibleActiveAccounts.map((account) => ({
            label: account.name,
            value: account,
            checked: true,
            required: false,
        }))
    }

    $: checkedAccounts = accountSelections.filter((selection) => selection.checked).map((selection) => selection.value)

    onMount(() => {
        setAccountSelections()
    })
</script>

<Selection
    bind:selectionOptions={accountSelections}
    title={localize('views.dashboard.drawers.dapps.confirmConnection.accounts.title')}
/>
