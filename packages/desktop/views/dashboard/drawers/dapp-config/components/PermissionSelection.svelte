<script lang="ts">
    import { Checkbox, Text } from '@bloomwalletio/ui'
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { METHODS_FOR_PERMISSION } from '@auxiliary/wallet-connect/constants'
    import { DappPermission } from '@auxiliary/wallet-connect/enums'
    import { onMount } from 'svelte'

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

{#each permissionSelections as permission}
    <div class="w-full flex flex-row justify-between p-4">
        <Text>{permission.label}</Text>
        {#if permission.required}
            <Text textColor="success">Required</Text>
        {:else}
            <Checkbox bind:checked={permission.checked} size="lg" />
        {/if}
    </div>
{/each}
