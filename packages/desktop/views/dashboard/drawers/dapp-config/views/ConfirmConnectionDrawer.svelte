<script lang="ts">
    import { Button, Steps } from '@bloomwalletio/ui'
    import { Spinner } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { buildSupportedNamespacesFromSelections, clearOldPairings } from '@auxiliary/wallet-connect/actions'
    import {
        getPersistedDappNamespacesForDapp,
        persistDappNamespacesForDapp,
        sessionProposal,
    } from '@auxiliary/wallet-connect/stores'
    import { approveSession } from '@auxiliary/wallet-connect/utils'
    import {
        AccountSelection,
        ConnectionSummary,
        DappInformationCard,
        NetworkSelection,
        PermissionSelection,
    } from '../components'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { handleError } from '@core/error/handlers'
    import { showNotification } from '@auxiliary/notification'
    import { IAccountState } from '@core/account'

    export let drawerRouter: Router<unknown>

    let loading = false

    const localeKey = 'views.dashboard.drawers.dapps.confirmConnection'
    let currentStep = 0
    const steps = [
        localize(`${localeKey}.permissions.step`),
        localize(`${localeKey}.networks.step`),
        localize(`${localeKey}.accounts.step`),
    ]

    let checkedAccounts: IAccountState[] = []
    let checkedNetworks: string[] = []
    let checkedMethods: string[] = []
    const persistedDappNamespace = $sessionProposal
        ? getPersistedDappNamespacesForDapp($sessionProposal.params.proposer.metadata.url)
        : undefined

    function onBackClick(): void {
        if (currentStep === 0) {
            drawerRouter.previous()
        } else {
            currentStep--
        }
    }

    function onNextClick(): void {
        currentStep++
    }

    async function onConfirmClick(): Promise<void> {
        try {
            loading = true

            const supportedNamespaces = buildSupportedNamespacesFromSelections(
                {
                    chains: checkedNetworks,
                    methods: checkedMethods,
                    accounts: checkedAccounts,
                },
                $sessionProposal.params.requiredNamespaces,
                $sessionProposal.params.optionalNamespaces
            )
            persistDappNamespacesForDapp($sessionProposal.params.proposer.metadata.url, supportedNamespaces)
            await clearOldPairings($sessionProposal.params.proposer.metadata.url)
            await approveSession($sessionProposal, supportedNamespaces)

            showNotification({
                variant: 'success',
                text: localize('notifications.newDappConnection.success'),
            })
            closeDrawer()
        } catch (error) {
            handleError(error)
        } finally {
            loading = false
        }
    }
</script>

<DrawerTemplate title={localize(`${localeKey}.title`)} {drawerRouter}>
    <div class="w-full h-full space-y-6 px-6">
        {#if $sessionProposal}
            <DappInformationCard metadata={$sessionProposal.params.proposer.metadata} />

            {#if persistedDappNamespace}
                <ConnectionSummary
                    requiredNamespaces={$sessionProposal.params.requiredNamespaces}
                    optionalNamespaces={$sessionProposal.params.optionalNamespaces}
                    {persistedDappNamespace}
                />
            {:else}
                <div class="flex flex-col gap-8">
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
            on:click={onBackClick}
            disabled={loading}
            text={localize('actions.back')}
        />
        {@const isLastStep = persistedDappNamespace || currentStep === steps.length - 1}
        <Button
            width="full"
            on:click={isLastStep ? onConfirmClick : onNextClick}
            disabled={loading}
            busy={loading}
            text={localize(`actions.${isLastStep ? 'confirm' : 'next'}`)}
        />
    </div>
</DrawerTemplate>
