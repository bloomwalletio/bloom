<script lang="ts">
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { METHODS_FOR_PERMISSION } from '@auxiliary/wallet-connect/constants'
    import { DappPermission } from '@auxiliary/wallet-connect/enums'
    import { onMount } from 'svelte'
    import Selection from './Selection.svelte'
    import { localize } from '@core/i18n'

    export let checkedMethods: string[]

    let permissionSelections: { label: string; value: string; checked: boolean; required: boolean }[] = []
    function setPermissionSelections(): void {
        const permissions: { label: string; value: string; checked: boolean; required: boolean }[] = []
        const namespaces = Object.values($sessionProposal.params.requiredNamespaces)

        for (const permission of Object.values(DappPermission)) {
            const supportedMethods = METHODS_FOR_PERMISSION[permission]

            const isRequired = namespaces.some((namespace) => {
                const requiredMethods = namespace.methods
                const supportedMethodsForNamespace: string[] = supportedMethods ?? []
                return supportedMethodsForNamespace.some((method) => requiredMethods.includes(method))
            })

            permissions.push({ label: permission, value: permission, checked: true, required: isRequired })
        }

        permissionSelections = permissions
    }

    $: permissionSelections, (checkedMethods = getMethodsFromCheckedPermissions())

    function getMethodsFromCheckedPermissions(): string[] {
        const methods: string[] = []
        const checkedPermissions = permissionSelections
            .filter((selection) => selection.checked)
            .map((selection) => selection.value)

        for (const permission of checkedPermissions) {
            const supportedMethods = METHODS_FOR_PERMISSION[permission]
            methods.push(...supportedMethods)
        }
        return methods
    }

    onMount(() => {
        setPermissionSelections()
    })
</script>

<Selection
    bind:selectionOptions={permissionSelections}
    title={localize('views.dashboard.drawers.dapps.confirmConnection.permissions.title')}
/>
