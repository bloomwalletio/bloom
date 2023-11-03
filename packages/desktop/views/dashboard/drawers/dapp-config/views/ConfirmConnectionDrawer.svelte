<script lang="ts">
    import { Button, Checkbox, Text } from '@bloomwalletio/ui'
    import { Spinner } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { approveSession } from '@auxiliary/wallet-connect/utils'
    import DappInformationCard from '../components/DappInformationCard.svelte'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { handleError } from '@core/error/handlers'
    import { showNotification } from '@auxiliary/notification'
    import { getAllNetworkIds } from '@core/network/utils'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { SUPPORTED_EVENTS, SUPPORTED_METHODS } from '@auxiliary/wallet-connect/constants'
    import { getAddressFromAccountForNetwork } from '@core/account'
    import { NetworkId } from '@core/network'

    export let drawerRouter: Router<unknown>

    type Selections = Record<string, { label: string; checked: boolean; required: boolean }>

    let loading = false

    enum ConfirmSteps {
        Permission = 'permission',
        Networks = 'networks',
        Accounts = 'accounts',
    }

    let currentStep = 0
    const steps = [ConfirmSteps.Permission, ConfirmSteps.Networks, ConfirmSteps.Accounts]

    let networkSelections: Selections = {}
    let methodSelections: Selections = {}
    let accountSelections: Selections = {}
    $: {
        if ($sessionProposal) {
            setNetworkSelections()
            setMethodSelections()
            setAccountSelections()
        }
    }

    function setAccountSelections(): void {
        const accounts: Selections = {}
        for (const account of $visibleActiveAccounts) {
            accounts[account.index] = { label: account.name, checked: true, required: false }
        }
        accountSelections = accounts
    }

    function setNetworkSelections(): void {
        const networks: Selections = {}
        for (const namespace of Object.values($sessionProposal.params.requiredNamespaces)) {
            for (const chain of namespace.chains) {
                networks[chain] = { label: chain, checked: true, required: true }
            }
        }
        const supportedNetworks = getAllNetworkIds()
        for (const namespace of Object.values($sessionProposal.params.optionalNamespaces)) {
            for (const chain of namespace.chains) {
                if (!networks[chain] && supportedNetworks.includes(chain)) {
                    networks[chain] = { label: chain, checked: true, required: false }
                }
            }
        }
        networkSelections = networks
    }

    function setMethodSelections(): void {
        const methods: Selections = {}
        for (const namespace of Object.values($sessionProposal.params.requiredNamespaces)) {
            for (const method of namespace.methods) {
                methods[method] = { label: method, checked: true, required: true }
            }
        }
        for (const namespace of Object.values($sessionProposal.params.optionalNamespaces)) {
            for (const method of namespace.methods) {
                if (!methods[method] && SUPPORTED_METHODS.includes(method)) {
                    methods[method] = { label: method, checked: true, required: false }
                }
            }
        }
        methodSelections = methods
    }

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

    function getNamespaceForSelections() {
        const requiredNamespaces = $sessionProposal.params.requiredNamespaces
        const optionalNamespaces = $sessionProposal.params.optionalNamespaces

        const supportedNamespaces = {}
        const allNamespaceIds = new Set([...Object.keys(requiredNamespaces), ...Object.keys(optionalNamespaces)])

        for (const namespaceId of allNamespaceIds) {
            const availablChains = [
                ...new Set([...requiredNamespaces[namespaceId].chains, ...optionalNamespaces[namespaceId].chains]),
            ]
            const availableMethods = [
                ...new Set([...requiredNamespaces[namespaceId].methods, ...optionalNamespaces[namespaceId].methods]),
            ]

            const allowedChains = availablChains.filter((chain) => networkSelections[chain]?.checked)
            const allowedMethods = availableMethods.filter((chain) => methodSelections[chain]?.checked)

            const addresses = []
            for (const chain of allowedChains) {
                for (const [accountIndex, accountSelection] of Object.entries(accountSelections)) {
                    if (accountSelection.checked) {
                        const address = getAddressFromAccountForNetwork(
                            $visibleActiveAccounts.find((acc) => String(acc.index) === accountIndex),
                            chain as NetworkId
                        )
                        if (address) {
                            addresses.push(`${chain}:${address}`)
                        }
                    }
                }
            }

            supportedNamespaces[namespaceId] = {
                chains: allowedChains,
                methods: allowedMethods,
                events: SUPPORTED_EVENTS,
                accounts: addresses,
            }
        }

        return supportedNamespaces
    }

    async function onConfirmClick(): Promise<void> {
        try {
            loading = true

            const supportedNamespaces = getNamespaceForSelections()
            await approveSession($sessionProposal, supportedNamespaces)

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
                {#each Object.values(methodSelections) as method}
                    <div class="w-full flex flex-row justify-between p-4">
                        <Text>{method.label}</Text>
                        {#if method.required}
                            <Text textColor="success">Required</Text>
                        {:else}
                            <Checkbox bind:checked={method.checked} size="lg" />
                        {/if}
                    </div>
                {/each}
            {:else if currentStep === 1}
                {#each Object.values(networkSelections) as network}
                    <div class="w-full flex flex-row justify-between p-4">
                        <Text>{network.label}</Text>
                        {#if network.required}
                            <Text textColor="success">Required</Text>
                        {:else}
                            <Checkbox bind:checked={network.checked} size="lg" />
                        {/if}
                    </div>
                {/each}
            {:else}
                {#each Object.values(accountSelections) as account}
                    <div class="w-full flex flex-row justify-between p-4">
                        <Text>{account.label}</Text>
                        {#if account.required}
                            <Text textColor="success">Required</Text>
                        {:else}
                            <Checkbox bind:checked={account.checked} size="lg" />
                        {/if}
                    </div>
                {/each}
            {/if}
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
