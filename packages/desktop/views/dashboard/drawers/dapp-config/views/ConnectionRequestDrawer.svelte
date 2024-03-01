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
    $: unsupportedMethods = getUnsupportedMethods($sessionProposal)
    $: supportedNetworks = getSupportedNetworks($sessionProposal)
    $: unsupportedRequiredNetworks = getUnsupportedRequiredNetworks($sessionProposal)
    $: fulfillsRequirements =
        unsupportedMethods.length === 0 &&
        unsupportedRequiredNetworks.networks.length === 0 &&
        supportedNetworks.networks.length > 0
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

    function getUnsupportedRequiredNetworks(_sessionProposal: Web3WalletTypes.SessionProposal | undefined): {
        networks: string[]
        isSupportedOnOtherProfiles: boolean
    } {
        if (!_sessionProposal) return { networks: [], isSupportedOnOtherProfiles: false }

        const requiredNamespaces = _sessionProposal?.params.requiredNamespaces
        const networksSupportedByProfile = getAllNetworkIds()
        const requiredNetworks = Object.values(requiredNamespaces).flatMap((namespace) => namespace.chains)

        const networks = requiredNetworks.filter((network) => !networksSupportedByProfile.includes(network))

        const allSupportedNetworks: string[] = Object.values(SupportedNetworkId)
        const isSupportedOnOtherProfiles = networks.every((network) => allSupportedNetworks.includes(network))

        return { networks, isSupportedOnOtherProfiles }
    }

    function getSupportedNetworks(_sessionProposal: Web3WalletTypes.SessionProposal | undefined): {
        networks: string[]
        networksOnOtherProfiles: string[]
    } {
        if (!_sessionProposal) return { networks: [], networksOnOtherProfiles: [] }

        const requiredNamespaces = _sessionProposal?.params.requiredNamespaces
        const optionalNamespaces = _sessionProposal?.params.optionalNamespaces

        const networksSupportedByProfile = getAllNetworkIds()
        const networksSupportedByDapp = []

        networksSupportedByDapp.push(...Object.values(requiredNamespaces).flatMap((namespace) => namespace.chains))
        networksSupportedByDapp.push(...Object.values(optionalNamespaces).flatMap((namespace) => namespace.chains))
        const networks = networksSupportedByDapp.filter((network) => networksSupportedByProfile.includes(network))

        const allSupportedNetworks: string[] = Object.values(SupportedNetworkId)
        const networksOnOtherProfiles = networksSupportedByDapp.filter((network) =>
            allSupportedNetworks.includes(network)
        )

        return { networks, networksOnOtherProfiles }
    }

    function getUnsupportedMethods(_sessionProposal: Web3WalletTypes.SessionProposal | undefined): string[] {
        if (!_sessionProposal) return []

        const requiredNamespaces = _sessionProposal?.params.requiredNamespaces
        const supportedMethods = Object.values(METHODS_FOR_PERMISSION).flat()
        const requiredMethods = Object.values(requiredNamespaces).flatMap((namespace) => namespace.methods)
        return requiredMethods.filter((network) => !supportedMethods.includes(network as RpcMethod))
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
                    <UnsupportedDappHint {unsupportedRequiredNetworks} {supportedNetworks} {unsupportedMethods} />
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
