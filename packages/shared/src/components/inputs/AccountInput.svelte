<script lang="ts">
    import { localize } from '@core/i18n'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { Indicator, IOption, SelectInput } from '@bloomwalletio/ui'
    import { selectedAccount } from '@core/account/stores'
    import { IAccountState } from '@core/account'

    export let account: IAccountState | undefined = $selectedAccount

    let value: any
    const selected: IOption | undefined = undefined

    $: account = $visibleActiveAccounts.find((acc) => acc.depositAddress === value)

    const options: IOption[] =
        $visibleActiveAccounts?.map((account) => ({
            value: account.depositAddress,
            label: account.name,
            color: account.color,
        })) ?? []
</script>

<SelectInput label={localize('general.account')} bind:value {selected} {options} customValue={true} let:color>
    <Indicator {color} size="sm" />
</SelectInput>
