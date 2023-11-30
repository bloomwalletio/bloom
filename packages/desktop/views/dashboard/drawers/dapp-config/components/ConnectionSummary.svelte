<script lang="ts">
    import { METHODS_FOR_PERMISSION } from '@auxiliary/wallet-connect/constants'
    import { DappPermission } from '@auxiliary/wallet-connect/enums'
    import { onMount } from 'svelte'
    import { IconButton, IconName, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { findActiveAccountWithAddress } from '@core/profile/actions'
    import { NetworkId } from '@core/network'
    import { IAccountState } from '@core/account'
    import { ProposalTypes } from '@walletconnect/types'
    import { DappConfigRoute } from '../dapp-config-route.enum'
    import { Router } from '@core/router/classes'

    export let requiredNamespaces: ProposalTypes.RequiredNamespaces | undefined
    export let editable: boolean
    export let persistedNamespaces: SupportedNamespaces
    export let drawerRouter: Router<unknown>

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection'

    type PermissionPreference = { label: string; enabled: boolean; required: boolean }

    let permissionPreferences: PermissionPreference[] = []
    let networkPreferences: string[] = []
    let accountPreferences: IAccountState[] = []

    function getPermissionPreferences(): PermissionPreference[] {
        const namespaces = Object.values(requiredNamespaces ?? {})
        const _persistedNamespaces = Object.values(persistedNamespaces)

        return Object.values(DappPermission).map((permission) => {
            const supportedMethods = METHODS_FOR_PERMISSION[permission] ?? []

            const isRequired = namespaces.some((namespace) =>
                supportedMethods.some((method) => namespace.methods.includes(method))
            )

            const isEnabled = _persistedNamespaces.some((namespace) =>
                supportedMethods.some((method) => namespace.methods.includes(method))
            )

            return {
                label: localize(`views.dashboard.drawers.dapps.confirmConnection.permissions.${String(permission)}`),
                enabled: isEnabled,
                required: isRequired,
            }
        })
    }

    function getNetworkPreferences(): string[] {
        return Object.values(persistedNamespaces).flatMap((namespace) => namespace.chains)
    }

    function getAccountPreferences(): IAccountState[] {
        const accounts = Object.values(persistedNamespaces)
            .flatMap((namespace) =>
                namespace.accounts.map((accountWithNetworkId) => {
                    const [namespace, chainId, address] = accountWithNetworkId.split(':')
                    return findActiveAccountWithAddress(address, `${namespace}:${chainId}` as NetworkId)
                })
            )
            .filter(Boolean)

        const accountMap = accounts.reduce((acc, account) => ({ ...acc, [account.index]: account }), {})
        return Object.values(accountMap)
    }

    function onEditPermissionsClick(): void {
        drawerRouter.goTo(DappConfigRoute.EditPermissions)
    }
    function onEditNetworksClick(): void {
        drawerRouter.goTo(DappConfigRoute.EditNetworks)
    }
    function onEditAccountsClick(): void {
        drawerRouter.goTo(DappConfigRoute.EditAccounts)
    }

    onMount(() => {
        permissionPreferences = getPermissionPreferences()
        networkPreferences = getNetworkPreferences()
        accountPreferences = getAccountPreferences()
    })
</script>

<selection-component class="flex flex-col gap-4">
    <div class="flex flex-row justify-between">
        <Text textColor="secondary">{localize(`${localeKey}.permissions.step`)}</Text>
        {#if editable}
            <IconButton icon={IconName.SettingsSliders} size="xs" on:click={onEditPermissionsClick} />
        {/if}
    </div>
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

    <div class="flex flex-row justify-between">
        <Text textColor="secondary">{localize(`${localeKey}.networks.step`)}</Text>
        {#if editable}
            <IconButton icon={IconName.SettingsSliders} size="xs" on:click={onEditNetworksClick} />
        {/if}
    </div>
    <table>
        {#each networkPreferences as network}
            <div class="w-full flex flex-row justify-between p-4">
                <Text>{network}</Text>
                <Text textColor="success">{localize('general.connected')}</Text>
            </div>
        {/each}
    </table>

    <div class="flex flex-row justify-between">
        <Text textColor="secondary">{localize(`${localeKey}.accounts.step`)}</Text>
        {#if editable}
            <IconButton icon={IconName.SettingsSliders} size="xs" on:click={onEditAccountsClick} />
        {/if}
    </div>
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
