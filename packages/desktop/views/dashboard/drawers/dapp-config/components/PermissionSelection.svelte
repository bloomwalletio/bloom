<script lang="ts">
    import { ProposalTypes } from '@walletconnect/types'
    import { METHODS_FOR_PERMISSION } from '@auxiliary/wallet-connect/constants'
    import { DappPermission } from '@auxiliary/wallet-connect/enums'
    import { onMount } from 'svelte'
    import Selection from './Selection.svelte'
    import { localize } from '@core/i18n'
    import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'

    export let checkedMethods: string[]
    export let requiredNamespaces: ProposalTypes.RequiredNamespaces
    export let persistedNamespaces: SupportedNamespaces | undefined = undefined

    let permissionSelections: { label: string; value: string; checked: boolean; required: boolean }[] = []
    function setPermissionSelections(): void {
        const permissions: { label: string; value: string; checked: boolean; required: boolean }[] = []
        const namespaces = Object.values(requiredNamespaces)

        for (const permission of Object.values(DappPermission)) {
            const supportedMethods = METHODS_FOR_PERMISSION[permission] ?? []

            const isRequired = namespaces.some((namespace) => {
                return supportedMethods.some((method) => namespace.methods.includes(method))
            })

            const isChecked = persistedNamespaces
                ? Object.values(persistedNamespaces).some((namespace) => {
                      return supportedMethods.some((method) => namespace.methods.includes(method))
                  })
                : true

            permissions.push({
                label: localize(`views.dashboard.drawers.dapps.confirmConnection.permissions.${String(permission)}`),
                value: permission,
                checked: isChecked,
                required: isRequired,
            })
        }

        permissionSelections = permissions
    }

    $: permissionSelections, (checkedMethods = getMethodsFromCheckedPermissions())

    function getMethodsFromCheckedPermissions(): string[] {
        return permissionSelections
            .filter((selection) => selection.checked)
            .flatMap((selection) => METHODS_FOR_PERMISSION[selection.value])
    }

    onMount(() => {
        setPermissionSelections()
    })
</script>

<Selection
    bind:selectionOptions={permissionSelections}
    title={localize('views.dashboard.drawers.dapps.confirmConnection.permissions.title')}
/>
