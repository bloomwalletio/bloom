<script lang="ts">
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import Selection from './Selection.svelte'
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
            // .filter((account) => {
            //     return hasAddressForAllChains(account, _chainIds)
            // })
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
</script>

{#if accountSelections.length}
    <Selection
        bind:selectionOptions={accountSelections}
        title={localize(`${localeKey}.title`)}
        error={checkedAccounts.length ? undefined : localize(`${localeKey}.empty`)}
    />
{:else}
    <Alert variant="danger" text="No valid accounts" />
{/if}
