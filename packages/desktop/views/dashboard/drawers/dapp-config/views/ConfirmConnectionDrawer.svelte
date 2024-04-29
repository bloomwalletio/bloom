<script lang="ts">
    import { Button, SidebarToast, Spinner, Steps } from '@bloomwalletio/ui'
    import { DappInfo } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { connectToDapp } from '@auxiliary/wallet-connect/actions'
    import { getPersistedDappNamespacesForDapp, sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { rejectSession } from '@auxiliary/wallet-connect/utils'
    import { AccountSelection, ConnectionSummary, NetworkSelection, PermissionSelection } from '../components'
    import { handleError } from '@core/error/handlers'
    import { IAccountState } from '@core/account'
    import { DappConfigRoute } from '../dapp-config-route.enum'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { selectedAccount } from '@core/account/stores'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { deepEquals } from '@core/utils/object'
    import { ProposalTypes } from '@walletconnect/types'
    import { IPersistedNamespaces } from '@auxiliary/wallet-connect/interface'

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

    $: verifiedState = $sessionProposal?.verifyContext.verified.isScam
        ? DappVerification.Scam
        : ($sessionProposal?.verifyContext.verified.validation as DappVerification)
    $: persistedNamespaces = $sessionProposal
        ? getPersistedDappNamespacesForDapp($sessionProposal.params.proposer.metadata.url)
        : undefined

    $: isButtonDisabled =
        loading ||
        (!persistedNamespaces && currentStep === 0 && checkedMethods.length === 0) ||
        (currentStep === 1 && checkedNetworks.length === 0) ||
        (currentStep === 2 && checkedAccounts.length === 0)

    $: isPreferenceSelectionRequired = $sessionProposal
        ? preferenceSelectionRequired(
              $sessionProposal.params.requiredNamespaces,
              $sessionProposal.params.optionalNamespaces,
              persistedNamespaces
          )
        : false
    function preferenceSelectionRequired(
        requiredNamespaces: ProposalTypes.RequiredNamespaces,
        optionalNamespaces: ProposalTypes.OptionalNamespaces,
        _persistedNamespaces?: IPersistedNamespaces
    ): boolean {
        if (!_persistedNamespaces || !$sessionProposal) {
            return true
        }

        const didRequiredChange = !deepEquals(_persistedNamespaces.required, requiredNamespaces)
        const didOptionalChange = !deepEquals(_persistedNamespaces.optional, optionalNamespaces)
        return didRequiredChange || didOptionalChange
    }

    function onBackClick(): void {
        if (currentStep === 0) {
            if (drawerRouter.hasHistory()) {
                drawerRouter.previous()
            } else {
                rejectSession()
                closeDrawer()
            }
        } else {
            currentStep--
        }
    }

    function onNextClick(): void {
        currentStep++
    }

    async function onConfirmClick(): Promise<void> {
        if (!$sessionProposal) {
            return
        }

        try {
            loading = true
            const persistedSupportedNamespaces = getPersistedDappNamespacesForDapp(
                $sessionProposal.params.proposer.metadata.url
            )?.supported

            const selections = {
                chains: persistedSupportedNamespaces ? undefined : checkedNetworks,
                methods: persistedSupportedNamespaces ? undefined : checkedMethods,
                accounts: persistedSupportedNamespaces ? undefined : checkedAccounts,
            }
            await connectToDapp(
                selections,
                persistedSupportedNamespaces,
                $sessionProposal,
                $selectedAccount as IAccountState
            )
            $sessionProposal = undefined

            drawerRouter.reset()
            drawerRouter.goTo(DappConfigRoute.ConnectedDapps)
        } catch (error) {
            loading = false
            handleError(error)
        }
    }
</script>

<DrawerTemplate title={localize(`${localeKey}.title`)} {drawerRouter}>
    <div class="w-full h-full flex flex-col space-y-6 overflow-hidden">
        {#if $sessionProposal}
            {@const requiredNamespaces = $sessionProposal.params.requiredNamespaces}
            {@const optionalNamespaces = $sessionProposal.params.optionalNamespaces}

            <DappInfo metadata={$sessionProposal.params.proposer.metadata} {verifiedState} />

            <div class="px-6 flex-grow overflow-hidden">
                {#if persistedNamespaces && !isPreferenceSelectionRequired}
                    <div class="h-full overflow-scroll">
                        <ConnectionSummary
                            {requiredNamespaces}
                            editable
                            persistedSupportedNamespaces={persistedNamespaces.supported}
                            {drawerRouter}
                        />
                    </div>
                {:else}
                    {@const tipLocale = currentStep === 0 ? 'permissions' : currentStep === 1 ? 'networks' : 'accounts'}
                    <div class="h-full flex flex-col gap-8">
                        <Steps bind:currentStep {steps} />

                        <div class="flex-grow overflow-hidden">
                            <div class="h-full flex flex-col gap-8 overflow-scroll">
                                <SidebarToast
                                    color="green"
                                    header={localize('general.tip')}
                                    body={localize(`${localeKey}.${tipLocale}.tip`)}
                                    dismissable={false}
                                />
                                <div class="flex-grow {currentStep === 0 ? 'visible' : 'hidden'}">
                                    <PermissionSelection
                                        bind:checkedMethods
                                        {requiredNamespaces}
                                        {optionalNamespaces}
                                        persistedSupportedNamespaces={persistedNamespaces?.supported}
                                    />
                                </div>
                                <div class="flex-grow {currentStep === 1 ? 'visible' : 'hidden'}">
                                    <NetworkSelection
                                        bind:checkedNetworks
                                        {requiredNamespaces}
                                        {optionalNamespaces}
                                        persistedSupportedNamespaces={persistedNamespaces?.supported}
                                    />
                                </div>
                                <div class="flex-grow {currentStep === 2 ? 'visible' : 'hidden'}">
                                    <AccountSelection
                                        bind:checkedAccounts
                                        chainIds={checkedNetworks}
                                        persistedSupportedNamespaces={persistedNamespaces?.supported}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        {:else}
            <div class="w-full h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        {/if}
    </div>
    <div slot="footer" class="flex flex-row gap-2">
        <Button
            variant="outlined"
            width="full"
            on:click={onBackClick}
            disabled={loading}
            text={localize(!drawerRouter.hasHistory() && currentStep === 0 ? 'actions.cancel' : 'actions.back')}
        />
        {@const isLastStep = persistedNamespaces || currentStep === steps.length - 1}
        <Button
            width="full"
            on:click={isLastStep ? onConfirmClick : onNextClick}
            disabled={isButtonDisabled}
            busy={loading}
            text={localize(`actions.${isLastStep ? 'confirm' : 'next'}`)}
        />
    </div>
</DrawerTemplate>
