<script lang="ts">
    import { Button, Steps } from '@bloomwalletio/ui'
    import { Spinner } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { approveSession } from '@auxiliary/wallet-connect/utils'
    import { AccountSelection, DappInformationCard, NetworkSelection, PermissionSelection } from '../components'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { handleError } from '@core/error/handlers'
    import { showNotification } from '@auxiliary/notification'
    import { SUPPORTED_EVENTS } from '@auxiliary/wallet-connect/constants'
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
    import { NetworkId } from '@core/network'

    export let drawerRouter: Router<unknown>

    let loading = false

    enum ConfirmSteps {
        Permission = 'permission',
        Networks = 'networks',
        Accounts = 'accounts',
    }

    let currentStep = 0
    const steps = [ConfirmSteps.Permission, ConfirmSteps.Networks, ConfirmSteps.Accounts]

    let checkedAccounts: IAccountState[] = []
    let checkedNetworks: string[] = []
    let checkedMethods: string[] = []

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
            const allowedChains = getAllowedChainsForNamespace(namespaceId)
            const allowedMethods = getAllowedMethodsForNamespace(namespaceId)

            const addresses = getAddressWithPrefixForAccounts(checkedAccounts, allowedChains)
            supportedNamespaces[namespaceId] = {
                chains: checkedNetworks,
                methods: allowedMethods,
                events: SUPPORTED_EVENTS,
                accounts: addresses,
            }
        }

        return supportedNamespaces
    }

    function getAllowedMethodsForNamespace(namespaceId: string): string[] {
        const requiredNamespaces = $sessionProposal.params.requiredNamespaces
        const optionalNamespaces = $sessionProposal.params.optionalNamespaces

        const availableMethods = [
            ...new Set([...requiredNamespaces[namespaceId].methods, ...optionalNamespaces[namespaceId].methods]),
        ]

        return checkedMethods.filter((network) => availableMethods.includes(network))
    }

    function getAllowedChainsForNamespace(namespaceId: string): string[] {
        const requiredNamespaces = $sessionProposal.params.requiredNamespaces
        const optionalNamespaces = $sessionProposal.params.optionalNamespaces

        const availablChains = [
            ...new Set([...requiredNamespaces[namespaceId].chains, ...optionalNamespaces[namespaceId].chains]),
        ]

        return checkedNetworks.filter((network) => availablChains.includes(network))
    }

    function getAddressWithPrefixForAccounts(accounts: IAccountState[], networkIds: string[]): string[] {
        const addresses: string[] = []
        for (const chain of networkIds) {
            for (const account of accounts) {
                const address = getAddressFromAccountForNetwork(account, chain as NetworkId)
                if (address) {
                    addresses.push(`${chain}:${address}`)
                }
            }
        }

        return addresses
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
    <div class="w-full h-full space-y-6">
        {#if $sessionProposal}
            <DappInformationCard />

            <div>
                <Steps bind:currentStep {steps} />

                <div class={currentStep === 0 ? 'visible' : 'hidden'}>
                    <PermissionSelection bind:checkedMethods />
                </div>
                <div class={currentStep === 1 ? 'visible' : 'hidden'}>
                    <NetworkSelection bind:checkedNetworks />
                </div>
                <div class={currentStep === 2 ? 'visible' : 'hidden'}>
                    <AccountSelection bind:checkedAccounts />
                </div>
            </div>
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
