<script lang="ts">
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { Checkbox, Error, Pill, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { ISupportedNamespace, SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { findActiveAccountWithAddress } from '@core/profile/actions'
    import { NetworkId } from '@core/network'
    import { Alert } from '@bloomwalletio/ui'

    export let checkedAccounts: IAccountState[]
    export let persistedNamespaces: SupportedNamespaces | undefined = undefined
    export let chainIds: string[] | undefined = undefined

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection.accounts'

    $: _chainIds = chainIds ?? Object.values(persistedNamespaces ?? {}).flatMap((p) => p.chains)
    $: _chainIds, setAccountSelections()
    $: checkedAccounts = accountSelections.filter((selection) => selection.checked).map((selection) => selection.value)

    let accountSelections: { label: string; value: IAccountState; checked: boolean; required: boolean }[] = []
    function setAccountSelections(): void {
        if (!_chainIds || _chainIds.length === 0) {
            accountSelections = []
            return
        }

        const persistedAccountIndexes = persistedNamespaces
            ? getAccountsFromPersistedNamespaces(Object.values(persistedNamespaces))
            : undefined

        accountSelections = $visibleActiveAccounts
            .filter((account) => {
                return hasAddressForAllChains(account, _chainIds)
            })
            .map((account) => {
                const isChecked = persistedAccountIndexes?.includes(account.index) ?? true
                return { label: account.name, value: account, checked: isChecked, required: false }
            })
    }

    function hasAddressForAllChains(account: IAccountState, chainIds: string[]): boolean {
        return chainIds.every((chainId) => getAddressFromAccountForNetwork(account, chainId as NetworkId))
    }

    function getAccountsFromPersistedNamespaces(_persistedNamespaces: ISupportedNamespace[]): number[] {
        return _persistedNamespaces.flatMap((namespace) => {
            const accounts = namespace.accounts
                .map((addressWithNetworkId) => {
                    const parts = addressWithNetworkId.split(':')
                    if (parts.length !== 3) {
                        return undefined
                    }

                    const [namespaceId, networkId, address] = parts
                    const account = findActiveAccountWithAddress(address, `${namespaceId}:${networkId}` as NetworkId)
                    return account?.index
                })
                .filter(Number.isInteger)
            return accounts
        })
    }

    let allChecked = true
    function onAllClick() {
        if (allChecked) {
            accountSelections = accountSelections.map((option) => ({ ...option, checked: true }))
        } else {
            accountSelections = accountSelections.map((option) => ({ ...option, checked: false || option.required }))
        }
    }

    $: allChecked = accountSelections.every((option) => option.checked)
    $: indexOfPrimary = accountSelections.findIndex((option) => option.checked)
</script>

{#if accountSelections.length}
    <selection-component class="flex flex-col gap-4">
        <div class="flex flex-row justify-between items-center px-4">
            <Text textColor="secondary">{localize(`${localeKey}.title`)}</Text>
            <div class="flex flex-row items-center gap-3">
                <Text textColor="secondary">{localize('general.all')}</Text>
                <Checkbox size="md" on:click={onAllClick} bind:checked={allChecked} />
            </div>
        </div>
        <selection-options>
            {#each accountSelections as option, index}
                <div class="w-full flex flex-row items-center justify-between p-4">
                    <div class="flex items-center gap-2">
                        <Text>{option.label}</Text>
                        {#if indexOfPrimary === index}
                            <Pill color="info">{localize('general.primary')}</Pill>
                        {/if}
                    </div>
                    {#if option.required}
                        <Text textColor="success">{localize('general.required')}</Text>
                    {:else}
                        <Checkbox bind:checked={option.checked} size="md" />
                    {/if}
                </div>
            {/each}
        </selection-options>
        {#if !checkedAccounts.length}
            <Error error={localize(`${localeKey}.empty`)} />
        {/if}
    </selection-component>
{:else}
    <Alert variant="danger" text="No valid accounts" />
{/if}
