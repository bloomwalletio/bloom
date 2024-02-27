<script lang="ts">
    import { ProposalTypes } from '@walletconnect/types'
    import { getAllNetworkIds } from '@core/network/utils'
    import { onMount } from 'svelte'
    import Selection from './Selection.svelte'
    import { localize } from '@core/i18n'
    import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'
    import { NetworkId, getChainConfiguration } from '@core/network'
    import { SelectionOption } from '@core/utils/interfaces'

    export let checkedNetworks: string[]
    export let requiredNamespaces: ProposalTypes.RequiredNamespaces
    export let optionalNamespaces: ProposalTypes.RequiredNamespaces
    export let persistedNamespaces: SupportedNamespaces | undefined = undefined

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection.networks'

    let requiredNetworks: SelectionOption[] = []
    let optionalNetworks: SelectionOption[] = []
    function setNetworkSelections(): void {
        const networks: Record<string, SelectionOption> = {}
        for (const namespace of Object.values(requiredNamespaces)) {
            for (const chain of namespace.chains) {
                const chainName = getChainConfiguration(chain as NetworkId)?.name ?? chain
                networks[chain] = { label: chainName, value: chain, checked: true, required: true }
            }
        }
        const supportedNetworks = getAllNetworkIds()
        for (const [namespaceId, namespace] of Object.entries(optionalNamespaces)) {
            const persistedNamespace = persistedNamespaces?.[namespaceId]
            for (const chain of namespace.chains) {
                if (!networks[chain] && supportedNetworks.includes(chain)) {
                    const isChecked = persistedNamespace?.chains?.includes(chain) ?? true
                    const chainName = getChainConfiguration(chain as NetworkId)?.name ?? chain
                    networks[chain] = { label: chainName, value: chain, checked: isChecked, required: false }
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
