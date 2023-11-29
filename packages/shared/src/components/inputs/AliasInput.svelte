<script lang="ts">
    import { AddressType } from '@iota/sdk/out/types'
    import { IOption, SelectInput } from '@bloomwalletio/ui'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { validateBech32Address } from '@core/utils/crypto'
    import { getNetworkHrp } from '@core/profile/actions'
    import { api } from '@core/profile-manager'

    export let alias: string = ''
    export let error: string = ''

    const aliasOptions: IOption[] =
        $selectedAccount?.balances?.aliases.map((hexAliasId, index) => {
            const aliasId = api.aliasIdToBech32(hexAliasId, getNetworkHrp())
            return { label: 'Alias ' + (index + 1), value: aliasId }
        }) ?? []

    let selected = aliasOptions.find((option) => option.value === alias)?.value
    $: alias = selected ?? ''

    export async function validate(): Promise<void> {
        try {
            if (!alias) {
                throw new Error(localize('error.aliasMinting.aliasRequired'))
            }

            if (!aliasOptions.some((option) => option.value === alias)) {
                throw new Error(localize('error.aliasMinting.aliasNotInPossession'))
            }

            validateBech32Address(getNetworkHrp(), alias, AddressType.Alias)
        } catch (err) {
            error = err?.message ?? err
            return Promise.reject(error)
        }
    }
</script>

<SelectInput
    label={localize('popups.nativeToken.property.alias')}
    bind:value={selected}
    options={aliasOptions}
    bind:error
/>
