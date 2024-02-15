<script lang="ts">
    import { Alert, Button, Checkbox, Table, TableRow, Text } from '@bloomwalletio/ui'
    import { Spinner } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { getPersistedDappNamespacesForDapp, sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import DappInformationCard from '../components/DappInformationCard.svelte'
    import { SupportedNetworkId, getAllNetworkIds } from '@core/network'
    import { METHODS_FOR_PERMISSION } from '@auxiliary/wallet-connect/constants'
    import { rejectSession } from '@auxiliary/wallet-connect/utils'
    import { showNotification } from '@auxiliary/notification'
    import { onDestroy } from 'svelte'
    import { Web3WalletTypes } from '@walletconnect/web3wallet'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'

    enum SessionVerification {
        Valid = 'VALID',
        Invalid = 'INVALID',
        Unknown = 'UNKNOWN',
    }

    export let drawerRouter: Router<unknown>

    const localeKey = 'views.dashboard.drawers.dapps.connectionRequest'
    let acceptedInsecureConnection = false
    $: isVerified = $sessionProposal?.verifyContext.verified.validation === SessionVerification.Valid
    $: alreadyConnected = !!getPersistedDappNamespacesForDapp($sessionProposal?.params.proposer.metadata.url)
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
        hasSupportedOnOtherProfiles: boolean
    } {
        if (!_sessionProposal) return { networks: [], hasSupportedOnOtherProfiles: false }

        const requiredNamespaces = _sessionProposal?.params.requiredNamespaces
        const optionalNamespaces = _sessionProposal?.params.optionalNamespaces

        const networksSupportedByProfile = getAllNetworkIds()
        const networksSupportedByDapp = []

        networksSupportedByDapp.push(...Object.values(requiredNamespaces).flatMap((namespace) => namespace.chains))
        networksSupportedByDapp.push(...Object.values(optionalNamespaces).flatMap((namespace) => namespace.chains))
        const networks = networksSupportedByDapp.filter((network) => networksSupportedByProfile.includes(network))

        const allSupportedNetworks: string[] = Object.values(SupportedNetworkId)
        const hasSupportedOnOtherProfiles = networksSupportedByDapp.some((network) =>
            allSupportedNetworks.includes(network)
        )

        return { networks, hasSupportedOnOtherProfiles }
    }

    function getUnsupportedMethods(_sessionProposal: Web3WalletTypes.SessionProposal | undefined): string[] {
        if (!_sessionProposal) return []

        const requiredNamespaces = _sessionProposal?.params.requiredNamespaces
        const supportedMethods = Object.values(METHODS_FOR_PERMISSION).flat()
        const requiredMethods = Object.values(requiredNamespaces).flatMap((namespace) => namespace.methods)
        return requiredMethods.filter((network) => !supportedMethods.includes(network))
    }

    function onRejectClick(): void {
        rejectSession()
        closeDrawer()
    }

    function onContinueClick(): void {
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
            <DappInformationCard {metadata} {verifiedState} />

            <div class="flex-grow overflow-hidden">
                <div class="h-full overflow-scroll flex flex-col gap-5 p-6">
                    <Alert
                        variant={alreadyConnected ? 'info' : 'warning'}
                        text={localize(`${localeKey}.${alreadyConnected ? 'reconnectHint' : 'firstTimeHint'}`)}
                    />
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
                                <Text textColor={isVerified ? 'success' : 'danger'}
                                    >{localize(`general.${isVerified ? 'yes' : 'no'}`)}</Text
                                >
                            </div>
                        </TableRow>
                    </Table>
                </div>
            </div>
            {#if unsupportedRequiredNetworks.networks.length}
                <div class="flex flex-col gap-8 px-6">
                    <Alert
                        variant={unsupportedRequiredNetworks.isSupportedOnOtherProfiles ? 'warning' : 'danger'}
                        text={localize(
                            `${localeKey}.${
                                unsupportedRequiredNetworks.isSupportedOnOtherProfiles
                                    ? 'supportedOnOtherProfile'
                                    : 'unsupportedNetworks'
                            }`
                        )}
                    />
                </div>
            {:else if supportedNetworks.networks.length === 0}
                <div class="flex flex-col gap-8 px-6">
                    <Alert
                        variant={supportedNetworks.hasSupportedOnOtherProfiles ? 'warning' : 'danger'}
                        text={localize(
                            `${localeKey}.${
                                supportedNetworks.hasSupportedOnOtherProfiles
                                    ? 'supportedOnOtherProfile'
                                    : 'noSupportedNetworks'
                            }`
                        )}
                    />
                </div>
            {:else if unsupportedMethods.length}
                <div class="flex flex-col gap-8 px-6">
                    <Alert variant="danger" text={localize(`${localeKey}.unsupportedMethods`)} />
                </div>
            {:else if !isVerified}
                <div class="flex flex-col gap-8 px-6">
                    <Alert variant="warning" text={localize(`${localeKey}.insecure`)} />
                    <Checkbox
                        label={localize(`${localeKey}.acceptInsecureConnection`)}
                        bind:checked={acceptedInsecureConnection}
                    />
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
        {#if fulfillsRequirements}
            <Button
                width="full"
                on:click={onContinueClick}
                disabled={!isVerified && !acceptedInsecureConnection}
                text={localize('actions.continue')}
            />
        {/if}
    </div>
</DrawerTemplate>
