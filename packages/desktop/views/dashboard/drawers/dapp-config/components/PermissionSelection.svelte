<script lang="ts">
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
    export let requiredMethods: string[]
    export let optionalMethods: string[]
    export let persistedSupportedNamespaces: SupportedNamespaces | undefined = undefined

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection.permissions'
    let requiredPermissionsOptions: SelectionOption<string>[] = []
    let optionalPermissionsOptions: SelectionOption<string>[] = []

    function setPermissionSelections(): void {
        const checkedMethods: { [method: string]: boolean } = {}
        const addedPermission: { [permission: string]: boolean } = {}

        const methods = [
            ...requiredMethods.map((method) => ({ method, required: true })),
            ...optionalMethods.map((method) => ({ method, required: false })),
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

            const isChecked = persistedSupportedNamespaces
                ? Object.values(persistedSupportedNamespaces).some((namespace) =>
                      namespace.methods.includes(method.method)
                  )
                : true

            const option = {
                label: localize(`views.dashboard.drawers.dapps.confirmConnection.permissions.${String(permission)}`),
                value: permission,
                checked: isChecked,
                required: method.required,
            }
            if (method.required) {
                requiredPermissionsOptions = [...requiredPermissionsOptions, option]
            } else {
                optionalPermissionsOptions = [...optionalPermissionsOptions, option]
            }
        }
    }

    $: requiredPermissionsOptions, optionalPermissionsOptions, (checkedMethods = getMethodsFromCheckedPermissions())

    function getMethodsFromCheckedPermissions(): string[] {
        return [...requiredPermissionsOptions, ...optionalPermissionsOptions]
            .filter((selection) => selection.checked)
            .flatMap((selection) => METHODS_FOR_PERMISSION[selection.value])
    }

    onMount(() => {
        setPermissionSelections()
    })
</script>

{#if requiredPermissionsOptions.length || optionalPermissionsOptions.length}
    <div class="h-full flex flex-col gap-8">
        {#if requiredPermissionsOptions.length}
            <Selection
                bind:selectionOptions={requiredPermissionsOptions}
                disableSelectAll
                title={localize(`${localeKey}.requiredTitle`)}
            />
        {/if}
        {#if optionalPermissionsOptions.length}
            <Selection
                bind:selectionOptions={optionalPermissionsOptions}
                title={localize(`${localeKey}.optionalTitle`)}
                error={checkedMethods.length ? undefined : localize(`${localeKey}.empty`)}
            />
        {/if}
    </div>
{:else}
    <selection-component class="h-full flex flex-col gap-4">
        <Text textColor="secondary">{localize(`${localeKey}.step`)}</Text>

        <div class="w-full flex-grow flex justify-center items-center">
            <Text type="body2">{localize(`${localeKey}.noPermissionsRequired`)}</Text>
        </div>
    </selection-component>
{/if}
