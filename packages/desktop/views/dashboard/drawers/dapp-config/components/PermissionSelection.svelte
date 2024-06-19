<script lang="ts">
    import { ProposalTypes } from '@walletconnect/types'
    import { METHODS_FOR_PERMISSION } from '@auxiliary/wallet-connect/constants'
    import { onMount } from 'svelte'
    import { Selection } from '@ui'
    import { localize } from '@core/i18n'
    import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { Text } from '@bloomwalletio/ui'
    import { getPermissionForMethod } from '@auxiliary/wallet-connect/utils'
    import { RpcMethod } from '@auxiliary/wallet-connect/enums'
    import { SelectionOption } from '@core/utils/interfaces'

    export let checkedMethods: string[]
    export let requiredNamespaces: ProposalTypes.RequiredNamespaces
    export let optionalNamespaces: ProposalTypes.RequiredNamespaces
    export let supportedNamespaces: SupportedNamespaces | undefined = undefined

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection.permissions'
    let requiredPermissions: SelectionOption<string>[] = []
    let optionalPermissions: SelectionOption<string>[] = []

    function setPermissionSelections(): void {
        const checkedMethods: { [method: string]: boolean } = {}
        const addedPermission: { [permission: string]: boolean } = {}

        const methods = [
            ...Object.values(requiredNamespaces).flatMap((namespace) =>
                namespace.methods.map((method) => ({ method, required: true }))
            ),
            ...Object.values(optionalNamespaces).flatMap((namespace) =>
                namespace.methods.map((method) => ({ method, required: false }))
            ),
        ]

        for (const method of methods) {
            if (checkedMethods[method.method]) {
                continue
            }
            checkedMethods[method.method] = true

            const permission = getPermissionForMethod(method.method as RpcMethod)
            if (!permission || addedPermission[permission]) {
                continue
            }
            addedPermission[permission] = true

            const isChecked = supportedNamespaces
                ? Object.values(supportedNamespaces).some((namespace) => namespace.methods.includes(method.method))
                : true

            const option = {
                label: localize(`views.dashboard.drawers.dapps.confirmConnection.permissions.${String(permission)}`),
                value: permission,
                checked: isChecked,
                required: method.required,
            }
            if (method.required) {
                requiredPermissions = [...requiredPermissions, option]
            } else {
                optionalPermissions = [...optionalPermissions, option]
            }
        }
    }

    $: requiredPermissions, optionalPermissions, (checkedMethods = getMethodsFromCheckedPermissions())

    function getMethodsFromCheckedPermissions(): string[] {
        return [...requiredPermissions, ...optionalPermissions]
            .filter((selection) => selection.checked)
            .flatMap((selection) => METHODS_FOR_PERMISSION[selection.value])
    }

    onMount(() => {
        setPermissionSelections()
    })
</script>

{#if requiredPermissions.length || optionalPermissions.length}
    <div class="h-full flex flex-col gap-8">
        {#if requiredPermissions.length}
            <Selection
                bind:selectionOptions={requiredPermissions}
                disableSelectAll
                title={localize(`${localeKey}.requiredTitle`)}
            />
        {/if}
        {#if optionalPermissions.length}
            <Selection
                bind:selectionOptions={optionalPermissions}
                title={localize(`${localeKey}.optionalTitle`)}
                error={checkedMethods.length ? undefined : localize(`${localeKey}.empty`)}
            />
        {/if}
    </div>
{:else}
    <selection-component class="h-full flex flex-col gap-4">
        <Text textColor="secondary">{localize(`${localeKey}.title`)}</Text>

        <div class="w-full flex-grow flex justify-center items-center">
            <Text type="body2">{localize(`${localeKey}.noPermissionsRequired`)}</Text>
        </div>
    </selection-component>
{/if}
