<script lang="ts">
    import { Checkbox, Text } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { onMount } from 'svelte'

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

{#each Object.values(accountSelections) as account}
    <div class="w-full flex flex-row justify-between p-4">
        <Text>{account.label}</Text>
        {#if account.required}
            <Text textColor="success">Required</Text>
        {:else}
            <Checkbox bind:checked={account.checked} size="lg" />
        {/if}
    </div>
{/each}
