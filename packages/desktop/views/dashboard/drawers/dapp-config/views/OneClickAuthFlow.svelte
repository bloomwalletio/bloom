<script lang="ts">
    import { Button, SidebarToast, Steps } from '@bloomwalletio/ui'
    import { DappInfo } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { rejectConnectionRequest } from '@auxiliary/wallet-connect/utils'
    import { AccountSelection, NetworkSelection, PermissionSelection } from '../components'
    import { handleError } from '@core/error/handlers'
    import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
    import { DappConfigRoute } from '../dapp-config-route.enum'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { Web3WalletTypes } from '@walletconnect/web3wallet'
    import { walletClient } from '@auxiliary/wallet-connect/stores'
    import { populateAuthPayload, buildAuthObject } from '@walletconnect/utils'
    import { NetworkId, getEvmNetwork } from '@core/network'
    import { AuthTypes } from '@walletconnect/types'
    import { signMessage } from '@core/wallet'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'
    import { GENERAL_SUPPORTED_METHODS } from '@auxiliary/wallet-connect/constants'

    export let drawerRouter: Router<unknown>
    export let sessionProposal: Web3WalletTypes.SessionAuthenticate

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

    const verifiedState = DappVerification.Unknown

    const dappMetadata = sessionProposal.params.requester.metadata

    const requiredNetworks = []
    const optionalNetworks = sessionProposal.params.authPayload.chains

    const requiredMethods = []
    const optionalMethods = [
        'eth_accounts',
        'eth_requestAccounts',
        'eth_sendRawTransaction',
        'eth_sendTransaction',
        'eth_sign',
        'eth_signTransaction',
        'eth_signTypedData',
        'eth_signTypedData_v3',
        'eth_signTypedData_v4',
        'personal_sign',
        'wallet_addEthereumChain',
        'wallet_getCallsStatus',
        'wallet_getCapabilities',
        'wallet_getPermissions',
        'wallet_registerOnboarding',
        'wallet_requestPermissions',
        'wallet_scanQRCode',
        'wallet_sendCalls',
        'wallet_showCallsStatus',
        'wallet_switchEthereumChain',
        'wallet_watchAsset',
    ]

    $: isButtonDisabled =
        loading ||
        (currentStep === 0 && checkedMethods.length === 0) ||
        (currentStep === 1 && checkedNetworks.length === 0) ||
        (currentStep === 2 && checkedAccounts.length === 0)

    function onBackClick(): void {
        if (currentStep === 0) {
            if (drawerRouter.hasHistory()) {
                drawerRouter.previous()
            } else {
                rejectConnectionRequest()
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
        if (!$walletClient) {
            return
        }

        loading = true
        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch {
            loading = false
            return
        }

        try {
            const allowedMethods = [...checkedMethods, ...GENERAL_SUPPORTED_METHODS]

            const authPayload = populateAuthPayload({
                authPayload: sessionProposal.params.authPayload,
                chains: checkedNetworks,
                methods: allowedMethods,
            })

            const auths: AuthTypes.Cacao[] = []
            for (const chain of authPayload.chains) {
                const network = getEvmNetwork(chain as NetworkId)
                if (!network) {
                    continue
                }

                for (const account of checkedAccounts) {
                    const address = `${chain}:${getAddressFromAccountForNetwork(account, chain as NetworkId)}`

                    const message = $walletClient.formatAuthMessage({
                        request: authPayload,
                        iss: address,
                    })
                    const signature = await signMessage(message, network.coinType, account)
                    if (!signature) {
                        continue
                    }

                    const auth = buildAuthObject(authPayload, { t: 'eip191', s: signature }, address)
                    auths.push(auth)
                }
            }

            await $walletClient.approveSessionAuthenticate({
                id: sessionProposal.id,
                auths,
            })

            drawerRouter.reset()
            drawerRouter.goTo(DappConfigRoute.ConnectedDapps)
            loading = false
        } catch (error) {
            loading = false
            handleError(error)
        }
    }
</script>

<DrawerTemplate title={localize(`${localeKey}.title`)} {drawerRouter}>
    <div class="w-full h-full flex flex-col space-y-6 overflow-hidden">
        <DappInfo metadata={dappMetadata} {verifiedState} />

        <div class="px-6 flex-grow overflow-hidden">
            <div class="h-full flex flex-col gap-8">
                <Steps bind:currentStep {steps} />

                <div class="flex-grow overflow-hidden">
                    <div class="h-full flex flex-col gap-8 overflow-scroll">
                        <SidebarToast
                            color="green"
                            header={localize('general.tip')}
                            body={localize(
                                `${localeKey}.${currentStep === 0 ? 'permissions' : currentStep === 1 ? 'networks' : 'accounts'}.tip`
                            )}
                            dismissable={false}
                        />
                        <div class="flex-grow {currentStep === 0 ? 'visible' : 'hidden'}">
                            <PermissionSelection bind:checkedMethods {requiredMethods} {optionalMethods} />
                        </div>
                        <div class="flex-grow {currentStep === 1 ? 'visible' : 'hidden'}">
                            <NetworkSelection bind:checkedNetworks {requiredNetworks} {optionalNetworks} />
                        </div>
                        <div class="flex-grow {currentStep === 2 ? 'visible' : 'hidden'}">
                            <AccountSelection bind:checkedAccounts chainIds={checkedNetworks} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div slot="footer" class="flex flex-row gap-2">
        <Button
            variant="outlined"
            width="full"
            on:click={onBackClick}
            disabled={loading}
            text={localize(!drawerRouter.hasHistory() && currentStep === 0 ? 'actions.cancel' : 'actions.back')}
        />
        {@const isLastStep = currentStep === steps.length - 1}
        <Button
            width="full"
            on:click={isLastStep ? onConfirmClick : onNextClick}
            disabled={isButtonDisabled}
            busy={loading}
            text={localize(`actions.${isLastStep ? 'confirm' : 'next'}`)}
        />
    </div>
</DrawerTemplate>
