<script lang="ts">
    import { ProposalTypes } from '@walletconnect/types'
    import { getAllNetworkIds } from '@core/network/utils'
    import { onMount } from 'svelte'
    import { Selection } from '@ui'
    import { localize } from '@core/i18n'
    import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { NetworkId, getEvmNetwork } from '@core/network'
    import { SelectionOption } from '@core/utils/interfaces'

    export let checkedNetworks: string[]
    export let requiredNamespaces: ProposalTypes.RequiredNamespaces
    export let optionalNamespaces: ProposalTypes.RequiredNamespaces
    export let supportedNamespaces: SupportedNamespaces | undefined = undefined

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection.networks'

    let requiredNetworks: SelectionOption<NetworkId>[] = []
    let optionalNetworks: SelectionOption<NetworkId>[] = []
    function setNetworkSelections(): void {
        const networks: Record<string, SelectionOption<NetworkId>> = {}
        for (const namespace of Object.values(requiredNamespaces)) {
            for (const chainId of namespace.chains ?? []) {
                const chainName = getEvmNetwork(chainId as NetworkId)?.name ?? chainId
                networks[chainId] = { label: chainName, value: chainId as NetworkId, checked: true, required: true }
            }
        }
        const supportedNetworks = getAllNetworkIds()
        for (const [namespaceId, namespace] of Object.entries(optionalNamespaces)) {
            const persistedNamespace = supportedNamespaces?.[namespaceId]
            for (const chainId of namespace.chains ?? []) {
                if (!networks[chainId] && supportedNetworks.includes(chainId)) {
                    const isChecked = persistedNamespace?.chains?.includes(chainId) ?? true
                    const chainName = getEvmNetwork(chainId as NetworkId)?.name ?? chainId
                    networks[chainId] = {
                        label: chainName,
                        value: chainId as NetworkId,
                        checked: isChecked,
                        required: false,
                    }
                }
            }
        }
        requiredNetworks = Object.values(networks).filter((network) => network.required)
        optionalNetworks = Object.values(networks).filter((network) => !network.required)
    }

    $: checkedNetworks = [...requiredNetworks, ...optionalNetworks]
        .filter((selection) => selection.checked)
        .map((selection) => selection.value)

    onMount(() => {
        setNetworkSelections()
    })
</script>

<div class="h-full flex flex-col gap-8">
    {#if requiredNetworks.length}
        <Selection
            bind:selectionOptions={requiredNetworks}
            disableSelectAll
            title={localize(`${localeKey}.requiredTitle`)}
        />
    {/if}
    {#if optionalNetworks.length}
        <Selection
            bind:selectionOptions={optionalNetworks}
            title={localize(`${localeKey}.optionalTitle`)}
            error={checkedNetworks.length ? undefined : localize(`${localeKey}.empty`)}
        />
    {/if}
</div>
