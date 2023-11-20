<script lang="ts">
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { METHODS_FOR_PERMISSION } from '@auxiliary/wallet-connect/constants'
    import { DappPermission } from '@auxiliary/wallet-connect/enums'
    import { onMount } from 'svelte'
    import { Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { findActiveAccountWithAddress } from '@core/profile/actions'
    import { NetworkId } from '@core/network'
    import { IAccountState } from '@core/account'

    export let requiredNamespaces: Record<string, unknown>
    export let optionalNamespaces: Record<string, unknown>
    export let persistedDappNamespace: SupportedNamespaces

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection'

    type PermissionPreference = { label: string; enabled: boolean; required: boolean }

    let permissionPreferences: PermissionPreference[] = []
    function setPermissionPreferences(): void {
        const permissions: PermissionPreference[] = []
        const namespaces = Object.values($sessionProposal.params.requiredNamespaces)
        const persistedNamespaces = Object.values(persistedDappNamespace)

        for (const permission of Object.values(DappPermission)) {
            const supportedMethods = METHODS_FOR_PERMISSION[permission] ?? []

            const isRequired = namespaces.some((namespace) => {
                const requiredMethods = namespace.methods
                return supportedMethods.some((method) => requiredMethods.includes(method))
            })

            const isEnabled = persistedNamespaces.some((namespace) => {
                return supportedMethods.some((method) => namespace.methods.includes(method))
            })

            permissions.push({ label: permission, enabled: isEnabled, required: isRequired })
        }

        permissionPreferences = permissions
    }

    let networkPreferences: string[] = []
    function setNetworkPreferences(): void {
        const networks = []
        for (const namespace of Object.values(persistedDappNamespace)) {
            for (const chain of namespace.chains) {
                networks.push(chain)
            }
        }
        networkPreferences = Object.values(networks)
    }

    let accountPreferences: IAccountState[] = []
    function setAccountPreferences(): void {
        const accounts = {}
        for (const namespace of Object.values(persistedDappNamespace)) {
            for (const accountWithNetworkId of namespace.accounts) {
                const [namespace, chainId, address] = accountWithNetworkId.split(':')
                const account = findActiveAccountWithAddress(address, `${namespace}:${chainId}` as NetworkId)
                if (account) {
                    accounts[account.index] = account
                }
            }
        }
        accountPreferences = Object.values(accounts)
    }

    onMount(() => {
        setPermissionPreferences()
        setNetworkPreferences()
        setAccountPreferences()
    })
</script>

<selection-component class="flex flex-col gap-4">
    <Text textColor="secondary">{localize(`${localeKey}.permissions.step`)}</Text>
    <table>
        {#each permissionPreferences as permission}
            <div class="w-full flex flex-row justify-between p-4">
                <Text>{permission.label}</Text>
                <Text textColor={permission.required || permission.enabled ? 'success' : 'warning'}>
                    {localize(`general.${permission.required ? 'required' : permission.enabled ? 'yes' : 'no'}`)}
                </Text>
            </div>
        {/each}
    </table>

    <Text textColor="secondary">{localize(`${localeKey}.networks.step`)}</Text>
    <table>
        {#each networkPreferences as network}
            <div class="w-full flex flex-row justify-between p-4">
                <Text>{network}</Text>
                <Text textColor="success">{localize('general.connected')}</Text>
            </div>
        {/each}
    </table>

    <Text textColor="secondary">{localize(`${localeKey}.accounts.step`)}</Text>
    <table>
        {#each accountPreferences as account}
            <div class="w-full flex flex-row justify-between p-4">
                <Text>{account.name}</Text>
                <div />
            </div>
        {/each}
    </table>
</selection-component>

<style lang="postcss">
    table {
        @apply bg-surface-0 dark:bg-surface-0-dark;
        @apply border border-solid border-stroke dark:border-stroke-dark;
        @apply divide-y divide-solid divide-stroke dark:divide-stroke-dark;
        @apply rounded-xl;
    }
</style>
