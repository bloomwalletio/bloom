<script lang="ts">
    import { ProposalTypes } from '@walletconnect/types'
    import { METHODS_FOR_PERMISSION } from '@auxiliary/wallet-connect/constants'
    import { onMount } from 'svelte'
    import Selection from './Selection.svelte'
    import { localize } from '@core/i18n'
    import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { Text } from '@bloomwalletio/ui'
    import { getPermissionForMethod } from '@auxiliary/wallet-connect/utils'

    type SelectionOption = {
        label: string
        value: string
        checked: boolean
        required: boolean
    }

    export let checkedMethods: string[]
    export let requiredNamespaces: ProposalTypes.RequiredNamespaces
    export let optionalNamespaces: ProposalTypes.RequiredNamespaces
    export let persistedNamespaces: SupportedNamespaces | undefined = undefined

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection.permissions'
    let requiredPermissions: SelectionOption[] = []
    let optionalPermissions: SelectionOption[] = []

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

            const permission = getPermissionForMethod(method.method)
            if (!permission || addedPermission[permission]) {
                continue
            }
            addedPermission[permission] = true

            const isChecked = persistedNamespaces
                ? Object.values(persistedNamespaces).some((namespace) => namespace.methods.includes(method.method))
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
                title={localize(`${localeKey}.title`)}
                error={checkedMethods.length ? undefined : localize(`${localeKey}.empty`)}
            />
        {/if}
        {#if optionalPermissions.length}
            <Selection
                bind:selectionOptions={optionalPermissions}
                title={localize(`${localeKey}.title`)}
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
