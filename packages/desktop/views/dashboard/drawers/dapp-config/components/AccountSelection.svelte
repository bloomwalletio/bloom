<script lang="ts">
    import { IAccountState } from '@core/account'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { onMount } from 'svelte'
    import Selection from './Selection.svelte'
    import { localize } from '@core/i18n'
    import { ISupportedNamespace, SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { findActiveAccountWithAddress } from '@core/profile/actions'
    import { NetworkId } from '@core/network'

    export let checkedAccounts: IAccountState[]
    export let persistedNamespaces: SupportedNamespaces | undefined = undefined

    let accountSelections: { label: string; value: IAccountState; checked: boolean; required: boolean }[] = []
    function setAccountSelections(): void {
        const peristedAccountIndexes = persistedNamespaces
            ? getAccountsFromPersistedNamespaces(Object.values(persistedNamespaces))
            : undefined

        accountSelections = $visibleActiveAccounts.map((account) => {
            const isChecked = peristedAccountIndexes?.includes(account.index) ?? true
            return { label: account.name, value: account, checked: isChecked, required: false }
        })
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

    $: checkedAccounts = accountSelections.filter((selection) => selection.checked).map((selection) => selection.value)

    onMount(() => {
        setAccountSelections()
    })
</script>

<Selection
    bind:selectionOptions={accountSelections}
    title={localize('views.dashboard.drawers.dapps.confirmConnection.accounts.title')}
/>
