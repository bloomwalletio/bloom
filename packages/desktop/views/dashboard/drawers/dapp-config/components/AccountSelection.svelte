<script lang="ts">
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { Selection } from '@ui'
    import { formatCurrency, localize } from '@core/i18n'
    import { ISupportedNamespace, SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { findActiveAccountWithAddress } from '@core/profile/actions'
    import { NetworkId } from '@core/network'
    import { Alert } from '@bloomwalletio/ui'
    import { allAccountFiatBalances } from '@core/token/stores'
    import { Indicator, Pill, Text } from '@bloomwalletio/ui'
    import { SelectionOption } from '@core/utils/interfaces'

    export let checkedAccounts: IAccountState[]
    export let persistedNamespaces: SupportedNamespaces | undefined = undefined
    export let chainIds: string[] | undefined = undefined

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection.accounts'

    $: _chainIds = chainIds ?? Object.values(persistedNamespaces ?? {}).flatMap((p) => p.chains)
    $: _chainIds, setAccountSelections()
    $: checkedAccounts = accountSelections.filter((selection) => selection.checked).map((selection) => selection.value)

    let accountSelections: SelectionOption<IAccountState>[] = []
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

    function getAccountBalance(accountIndex: number): string {
        return formatCurrency($allAccountFiatBalances[accountIndex])
    }

    $: indexOfPrimary = accountSelections.findIndex((option) => option.checked)
</script>

{#if accountSelections.length}
    <Selection
        bind:selectionOptions={accountSelections}
        title={localize(`${localeKey}.title`)}
        error={checkedAccounts.length ? undefined : localize(`${localeKey}.empty`)}
        let:option
        let:index
    >
        <div class="w-full flex items-center justify-between gap-2">
            <div class="flex flex-row items-center gap-3">
                <Indicator color={option.value.color} />
                <Text>{option.value.name}</Text>
            </div>
            {#if indexOfPrimary === index}
                <Pill color="info">{localize('general.primary')}</Pill>
            {/if}
            <Text>{getAccountBalance(option.value.index)}</Text>
        </div>
    </Selection>
{:else}
    <Alert variant="danger" text="No valid accounts" />
{/if}

<style lang="postcss">
    selection-options {
        @apply bg-surface-0 dark:bg-surface-0-dark;
        @apply border border-solid border-stroke dark:border-stroke-dark;
        @apply divide-y divide-solid divide-stroke dark:divide-stroke-dark;
        @apply rounded-xl;
    }
</style>
