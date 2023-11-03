<script lang="ts">
    import { Button, Checkbox, Text } from '@bloomwalletio/ui'
    import { Spinner } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { getAllEvmAddresses, approveSession } from '@auxiliary/wallet-connect/utils'
    import DappInformationCard from '../components/DappInformationCard.svelte'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { handleError } from '@core/error/handlers'
    import { showNotification } from '@auxiliary/notification'
    import { getAllNetworkIds } from '@core/network/utils'

    export let drawerRouter: Router<unknown>

    type Selections = Record<string, { checked: boolean; required: boolean }>

    const chains = getAllNetworkIds()
    const addresses: string[] = getAllEvmAddresses(chains)

    let loading = false

    enum ConfirmSteps {
        Permission = 'permission',
        Networks = 'networks',
        Accounts = 'accounts',
    }

    let currentStep = 0
    const steps = [ConfirmSteps.Permission, ConfirmSteps.Networks, ConfirmSteps.Accounts]

    function onCancelClick(): void {
        $sessionProposal = undefined
        closeDrawer()
    }

    function onBackClick(): void {
        currentStep--
    }

    function onNextClick(): void {
        currentStep++
    }

    async function onConfirmClick(): Promise<void> {
        try {
            loading = true
            await approveSession($sessionProposal, addresses)

            showNotification({
                variant: 'success',
                text: localize('notifications.newDappConnected'),
            })
            closeDrawer()
        } catch (error) {
            handleError(error)
        } finally {
            loading = false
        }
    }

    let networkSelections: Selections = {}
    let methodSelections: Selections = {}
    $: $sessionProposal, (networkSelections = getNetworksFromProposal()), (methodSelections = getMethodsFromProposal())

    function getNetworksFromProposal(): Selections {
        if (!$sessionProposal) {
            return {}
        }

        const networks: Selections = {}
        for (const namespace of Object.values($sessionProposal.params.requiredNamespaces)) {
            for (const chain of namespace.chains) {
                networks[chain] = { checked: true, required: true }
            }
        }
        for (const namespace of Object.values($sessionProposal.params.optionalNamespaces)) {
            for (const chain of namespace.chains) {
                if (networks[chain]) {
                    continue
                }
                networks[chain] = { checked: true, required: false }
            }
        }
        return networks
    }

    function getMethodsFromProposal(): Selections {
        if (!$sessionProposal) {
            return {}
        }

        const methods: Selections = {}
        for (const namespace of Object.values($sessionProposal.params.requiredNamespaces)) {
            for (const method of namespace.methods) {
                methods[method] = { checked: true, required: true }
            }
        }
        for (const namespace of Object.values($sessionProposal.params.optionalNamespaces)) {
            for (const method of namespace.methods) {
                if (methods[method]) {
                    continue
                }
                methods[method] = { checked: true, required: false }
            }
        }
        return methods
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.dapps.confirmConnection.title')} {drawerRouter}>
    <div class="w-full h-full">
        {#if $sessionProposal}
            <DappInformationCard />

            <div class="w-full flex flex-row justify-between gap-2 p-4">
                {#each steps as step, index}
                    {@const isPastStep = index < currentStep}
                    {@const isCurrentStep = index === currentStep}
                    <Text textColor={isCurrentStep ? 'brand' : isPastStep ? 'secondary' : 'secondary'}
                        >{index + 1}. {step}</Text
                    >
                {/each}
            </div>

            {#if currentStep === 0}
                {#each Object.keys(methodSelections) as method}
                    <div class="w-full flex flex-row justify-between p-4">
                        <Text>{method}</Text>
                        {#if methodSelections[method].required}
                            <Text textColor="success">Required</Text>
                        {:else}
                            <Checkbox bind:checked={methodSelections[method].checked} />
                        {/if}
                    </div>
                {/each}
            {:else if currentStep === 1}
                {#each Object.keys(networkSelections) as networkId}
                    <div class="w-full flex flex-row justify-between p-4">
                        <Text>{networkId}</Text>
                        {#if networkSelections[networkId].required}
                            <Text textColor="success">Required</Text>
                        {:else}
                            <Checkbox bind:checked={networkSelections[networkId].checked} />
                        {/if}
                    </div>
                {/each}
            {:else}{/if}
        {:else}
            <div class="w-full h-full flex items-center justify-center">
                <Spinner busy size={50} />
            </div>
        {/if}
    </div>
    <div slot="footer" class="flex flex-row gap-2">
        <Button
            variant="outlined"
            width="full"
            on:click={currentStep === 0 ? onCancelClick : onBackClick}
            disabled={loading}
            text={localize(`actions.${currentStep === 0 ? 'cancel' : 'back'}`)}
        />
        {@const isLastStep = currentStep === steps.length - 1}
        <Button
            width="full"
            on:click={isLastStep ? onConfirmClick : onNextClick}
            disabled={loading}
            busy={loading}
            text={localize(`actions.${isLastStep ? 'confirm' : 'next'}`)}
        />
    </div>
</DrawerTemplate>
