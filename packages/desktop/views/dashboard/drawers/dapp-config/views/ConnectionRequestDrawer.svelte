<script lang="ts">
    import { Button, Table, TableRow, Text } from '@bloomwalletio/ui'
    import { DappInfo, Spinner } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { SecurityWarning, UnsupportedDappHint } from '../components'
    import { SupportedNetworkId, getAllNetworkIds } from '@core/network'
    import { METHODS_FOR_PERMISSION } from '@auxiliary/wallet-connect/constants'
    import { rejectSession } from '@auxiliary/wallet-connect/utils'
    import { showNotification } from '@auxiliary/notification'
    import { onDestroy } from 'svelte'
    import { Web3WalletTypes } from '@walletconnect/web3wallet'
    import { DappVerification, RpcMethod } from '@auxiliary/wallet-connect/enums'

    export let drawerRouter: Router<unknown>

    const localeKey = 'views.dashboard.drawers.dapps.connectionRequest'
    let acceptedInsecureConnection = false
    let flashingCheckbox = false
    $: fulfillsRequirements =
        doesFulfillNetworkRequirements($sessionProposal) && doesFulfillMethodRequirements($sessionProposal)
    $: verifiedState = $sessionProposal?.verifyContext.verified.isScam
        ? DappVerification.Scam
        : ($sessionProposal?.verifyContext.verified.validation as DappVerification)

    let timeout: ReturnType<typeof setTimeout> | undefined
    $: {
        if ($sessionProposal) {
            clearTimeout(timeout)
        } else {
            timeout = setTimeout(() => {
                showNotification({
                    variant: 'error',
                    text: localize('notifications.newDappConnection.noProposal'),
                })
                closeDrawer()
            }, 5_000)
        }
    }

    function doesFulfillNetworkRequirements(_sessionProposal: Web3WalletTypes.SessionProposal | undefined): boolean {
        if (!_sessionProposal) return false

        const { supportedNetworksByProfile, requiredNetworksByDapp, supportedNetworksByDapp } =
            getNetworkRequirements(_sessionProposal)

        const supportsAllRequiredNetworks = supportedNetworksByProfile.every((networkId) =>
            requiredNetworksByDapp.includes(networkId)
        )
        if (!supportsAllRequiredNetworks) {
            return false
        }

        const supportsAnyNetwork = supportedNetworksByDapp.some((networkId) =>
            requiredNetworksByDapp.includes(networkId)
        )
        if (!supportsAnyNetwork) {
            return false
        }

        return true
    }

    function doesFulfillMethodRequirements(_sessionProposal: Web3WalletTypes.SessionProposal | undefined): boolean {
        if (!_sessionProposal) return false

        const supportedMethodsByWallet = Object.values(METHODS_FOR_PERMISSION).flat() as RpcMethod[]
        const requiredMethods = Object.values(_sessionProposal.params.requiredNamespaces).flatMap(
            (namespace) => namespace.methods
        ) as RpcMethod[]
        const supportsAllRequiredMethods = requiredMethods.every((method) => !supportedMethodsByWallet.includes(method))
        if (!supportsAllRequiredMethods) {
            return false
        }

        return true
    }

    function getNetworkRequirements(_sessionProposal: Web3WalletTypes.SessionProposal | undefined): {
        allSupportedNetworksByWallet: string[]
        supportedNetworksByProfile: string[]
        requiredNetworksByDapp: string[]
        supportedNetworksByDapp: string[]
    } {
        if (!_sessionProposal)
            return {
                allSupportedNetworksByWallet: [],
                supportedNetworksByProfile: [],
                requiredNetworksByDapp: [],
                supportedNetworksByDapp: [],
            }
        const requiredNamespaces = _sessionProposal?.params.requiredNamespaces
        const optionalNamespaces = _sessionProposal?.params.optionalNamespaces

        const supportedNetworksByProfile = getAllNetworkIds()
        const allSupportedNetworksByWallet: string[] = Object.values(SupportedNetworkId)
        const requiredNetworksByDapp = Object.values(requiredNamespaces).flatMap((namespace) => namespace.chains)
        const supportedNetworksByDapp = [
            ...requiredNetworksByDapp,
            ...Object.values(optionalNamespaces).flatMap((namespace) => namespace.chains),
        ]

        return {
            allSupportedNetworksByWallet,
            supportedNetworksByProfile,
            requiredNetworksByDapp,
            supportedNetworksByDapp,
        }
    }

    function onRejectClick(): void {
        rejectSession()
        closeDrawer()
    }

    function onContinueClick(): void {
        if (verifiedState !== DappVerification.Valid && !acceptedInsecureConnection) {
            flashingCheckbox = true
            setTimeout(() => {
                flashingCheckbox = false
            }, 1500)
            return
        }

        drawerRouter.next()
    }

    onDestroy(() => {
        clearTimeout(timeout)
    })
</script>

<DrawerTemplate title={localize(`${localeKey}.title`)} {drawerRouter} onBack={rejectSession}>
    <div class="w-full h-full flex flex-col justify-between">
        {#if $sessionProposal}
            {@const metadata = $sessionProposal.params.proposer.metadata}
            <DappInfo {metadata} {verifiedState} />

            <div class="flex-grow overflow-hidden">
                <div class="h-full overflow-scroll flex flex-col gap-5 p-6">
                    <Table
                        items={[
                            {
                                key: localize('general.description'),
                                value: metadata.description,
                            },
                        ]}
                        orientation="vertical"
                    >
                        <TableRow item={{ key: localize('general.verified') }} orientation="vertical">
                            <div slot="boundValue">
                                <Text textColor={verifiedState === DappVerification.Valid ? 'success' : 'danger'}
                                    >{localize(
                                        `general.${verifiedState === DappVerification.Valid ? 'yes' : 'no'}`
                                    )}</Text
                                >
                            </div>
                        </TableRow>
                    </Table>
                </div>
            </div>
            {#if !fulfillsRequirements}
                <div class="px-6">
                    <UnsupportedDappHint {unsupportedMethods} />
                </div>
            {:else if verifiedState !== DappVerification.Valid}
                <div class="px-6">
                    <SecurityWarning {verifiedState} {flashingCheckbox} bind:acceptedInsecureConnection />
                </div>
            {/if}
        {:else}
            <div class="w-full h-full flex items-center justify-center">
                <Spinner busy size={50} />
            </div>
        {/if}
    </div>
    <div class="flex flex-row gap-2" slot="footer">
        <Button
            width="full"
            variant="outlined"
            on:click={onRejectClick}
            text={localize(`actions.${fulfillsRequirements ? 'reject' : 'cancel'}`)}
        />
        {#if fulfillsRequirements && verifiedState !== DappVerification.Scam}
            <Button width="full" on:click={onContinueClick} text={localize('actions.continue')} />
        {/if}
    </div>
</DrawerTemplate>
