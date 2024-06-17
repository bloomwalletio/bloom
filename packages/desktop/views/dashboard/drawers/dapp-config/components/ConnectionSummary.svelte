<script lang="ts">
    import { METHODS_FOR_PERMISSION } from '@auxiliary/wallet-connect/constants'
    import { DappPermission } from '@auxiliary/wallet-connect/enums'
    import { onMount } from 'svelte'
    import { IconButton, IconName, Table, TableRow, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { findActiveAccountWithAddress } from '@core/profile/actions'
    import { NetworkId, getEvmNetwork } from '@core/network'
    import { IAccountState } from '@core/account'
    import { ProposalTypes } from '@walletconnect/types'
    import { DappConfigRoute } from '../dapp-config-route.enum'
    import { Router } from '@core/router/classes'

    export let requiredNamespaces: ProposalTypes.RequiredNamespaces | undefined
    export let editable: boolean
    export let supportedNamespaces: SupportedNamespaces
    export let drawerRouter: Router<unknown>

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection'

    type PermissionPreference = { label: string; enabled: boolean; required: boolean }

    let permissionPreferences: PermissionPreference[] = []
    let networkPreferences: string[] = []
    let accountPreferences: IAccountState[] = []

    function getPermissionPreferences(): PermissionPreference[] {
        const namespaces = Object.values(requiredNamespaces ?? {})
        const _supportedNamespaces = Object.values(supportedNamespaces)

        return Object.values(DappPermission)
            .map((permission) => {
                const supportedMethods = METHODS_FOR_PERMISSION[permission] ?? []

                const isRequired = namespaces.some((namespace) =>
                    supportedMethods.some((method) => namespace.methods.includes(method))
                )

                const isEnabled = _supportedNamespaces.some((namespace) =>
                    supportedMethods.some((method) => namespace.methods.includes(method))
                )

                return {
                    label: localize(
                        `views.dashboard.drawers.dapps.confirmConnection.permissions.${String(permission)}`
                    ),
                    enabled: isEnabled,
                    required: isRequired,
                }
            })
            .filter((permission) => permission.enabled)
    }

    function getNetworkPreferences(): string[] {
        return Object.values(supportedNamespaces).flatMap((namespace) => {
            return namespace.chains.map((chainId) => {
                const evmNetwork = getEvmNetwork(chainId as NetworkId)
                return evmNetwork?.name ?? chainId
            })
        })
    }

    function getAccountPreferences(): IAccountState[] {
        const accounts = Object.values(supportedNamespaces)
            .flatMap((namespace) =>
                namespace.accounts.map((accountWithNetworkId) => {
                    const [namespace, chainId, address] = accountWithNetworkId.split(':')
                    return findActiveAccountWithAddress(address, `${namespace}:${chainId}` as NetworkId)
                })
            )
            .filter(Boolean) as IAccountState[]

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
    {#if permissionPreferences.length}
        <div class="flex flex-row justify-between">
            <Text textColor="secondary">{localize(`${localeKey}.permissions.step`)}</Text>
            {#if editable}
                <IconButton icon={IconName.SettingsSliders} size="xs" on:click={onEditPermissionsClick} />
            {/if}
        </div>
        <Table>
            {#each permissionPreferences as permission}
                <TableRow item={{ key: permission.label }}>
                    <Text
                        textColor={permission.required || permission.enabled ? 'success' : 'warning'}
                        slot="boundValue"
                    >
                        {localize(`general.${permission.required ? 'required' : permission.enabled ? 'yes' : 'no'}`)}
                    </Text>
                </TableRow>
            {/each}
        </Table>
    {/if}

    <div class="flex flex-row justify-between">
        <Text textColor="secondary">{localize(`${localeKey}.networks.step`)}</Text>
        {#if editable}
            <IconButton icon={IconName.SettingsSliders} size="xs" on:click={onEditNetworksClick} />
        {/if}
    </div>
    <Table>
        {#each networkPreferences as network}
            <TableRow item={{ key: network }}>
                <Text textColor="success" slot="boundValue">{localize('general.connected')}</Text>
            </TableRow>
        {/each}
    </Table>

    <div class="flex flex-row justify-between">
        <Text textColor="secondary">{localize(`${localeKey}.accounts.step`)}</Text>
        {#if editable}
            <IconButton icon={IconName.SettingsSliders} size="xs" on:click={onEditAccountsClick} />
        {/if}
    </div>
    <Table items={accountPreferences.map((account) => ({ key: account.name, value: '' }))} />
</selection-component>
