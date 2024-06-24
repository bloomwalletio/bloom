<script lang="ts">
    import { sessionInitiationRequest } from '@auxiliary/wallet-connect/stores'
    import { rejectSessionInitiationRequest } from '@auxiliary/wallet-connect/utils'
    import { showNotification } from '@auxiliary/notification'
    import { ALL_SUPPORTED_METHODS } from '@auxiliary/wallet-connect/constants'
    import { DappVerification, RpcMethod } from '@auxiliary/wallet-connect/enums'
    import { Button, Spinner, Table } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { time } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { getAllNetworkIds } from '@core/network'
    import { Router } from '@core/router'
    import { MILLISECONDS_PER_SECOND } from '@core/utils/constants'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { DappInfo } from '@ui'
    import { ProposalTypes } from '@walletconnect/types'
    import { Web3WalletTypes } from '@walletconnect/web3wallet'
    import { onDestroy } from 'svelte'
    import { ConnectionRequestExpirationAlert, SecurityWarning, UnsupportedDappHint } from '../components'

    export let drawerRouter: Router<unknown>

    const localeKey = 'views.dashboard.drawers.dapps.connectionRequest'
    let acceptedInsecureConnection = false
    let flashingCheckbox = false
    $: fulfillsRequirements =
        !!$sessionInitiationRequest &&
        doesFulfillNetworkRequirements(
            $sessionInitiationRequest.params.requiredNamespaces,
            $sessionInitiationRequest.params.optionalNamespaces
        ) &&
        doesFulfillMethodRequirements($sessionInitiationRequest.params.requiredNamespaces)
    $: verifiedState = $sessionInitiationRequest?.verifyContext.verified.isScam
        ? DappVerification.Scam
        : ($sessionInitiationRequest?.verifyContext.verified.validation as DappVerification)

    const timeout: ReturnType<typeof setTimeout> | undefined = setTimeout(() => {
        showNotification({
            variant: 'error',
            text: localize('notifications.newDappConnection.noProposal'),
        })
        closeDrawer()
    }, 5_000)

    $: $sessionInitiationRequest && onSessionProposal($sessionInitiationRequest)

    $: hasRequestExpired = $sessionInitiationRequest?.params.expiryTimestamp
        ? $sessionInitiationRequest.params.expiryTimestamp - $time.getTime() / MILLISECONDS_PER_SECOND <= 0
        : false

    function onSessionProposal(_sessionProposal: Web3WalletTypes.SessionProposal): void {
        clearTimeout(timeout)

        const fulfillsRequirements =
            doesFulfillNetworkRequirements(
                _sessionProposal.params.requiredNamespaces,
                _sessionProposal.params.optionalNamespaces
            ) && doesFulfillMethodRequirements(_sessionProposal.params.requiredNamespaces)

        if (fulfillsRequirements && verifiedState === DappVerification.Valid) {
            drawerRouter.next()
        }
    }

    function doesFulfillNetworkRequirements(
        requiredNamespaces: ProposalTypes.RequiredNamespaces,
        optionalNamespaces: ProposalTypes.OptionalNamespaces
    ): boolean {
        const supportedNetworksByProfile = getAllNetworkIds()
        const requiredNetworksByDapp = Object.values(requiredNamespaces)
            .flatMap(({ chains }) => chains)
            .filter(Boolean)
        const supportedNetworksByDapp = [
            ...requiredNetworksByDapp,
            ...Object.values(optionalNamespaces)
                .flatMap(({ chains }) => chains)
                .filter(Boolean),
        ] as string[]

        const supportsAllRequiredNetworks = requiredNetworksByDapp.every((networkId) =>
            supportedNetworksByProfile.includes(networkId)
        )

        if (!supportsAllRequiredNetworks) {
            return false
        }

        const supportsAnyNetwork = supportedNetworksByDapp.some((networkId) =>
            supportedNetworksByProfile.includes(networkId)
        )
        if (!supportsAnyNetwork) {
            return false
        }

        return true
    }

    function doesFulfillMethodRequirements(requiredNamespaces: ProposalTypes.RequiredNamespaces): boolean {
        const requiredMethods = Object.values(requiredNamespaces).flatMap(({ methods }) => methods) as RpcMethod[]
        const supportsAllRequiredMethods = requiredMethods.every((method) => ALL_SUPPORTED_METHODS.includes(method))
        return supportsAllRequiredMethods
    }

    function onRejectClick(): void {
        if (!hasRequestExpired && $sessionInitiationRequest) {
            rejectSessionInitiationRequest($sessionInitiationRequest.id)
        }
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

<DrawerTemplate title={localize(`${localeKey}.title`)} {drawerRouter} showBack={false}>
    <div class="w-full h-full flex flex-col justify-between">
        {#if $sessionInitiationRequest}
            {@const metadata = $sessionInitiationRequest.params.proposer.metadata}
            <div>
                <DappInfo {metadata} {verifiedState} />
                <ConnectionRequestExpirationAlert expiryTimestamp={$sessionInitiationRequest.params.expiryTimestamp} />
            </div>

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
                    />
                </div>
            </div>
            {#if !fulfillsRequirements}
                <div class="px-6">
                    <UnsupportedDappHint
                        requiredNamespaces={$sessionInitiationRequest.params.requiredNamespaces}
                        optionalNamespaces={$sessionInitiationRequest.params.optionalNamespaces}
                    />
                </div>
            {:else if verifiedState !== DappVerification.Valid}
                <div class="px-6">
                    <SecurityWarning {verifiedState} {flashingCheckbox} bind:acceptedInsecureConnection />
                </div>
            {/if}
        {:else}
            <div class="w-full h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        {/if}
    </div>
    <div class="flex flex-row gap-2" slot="footer">
        <Button
            width="full"
            variant="outlined"
            on:click={onRejectClick}
            text={localize(`actions.${fulfillsRequirements && !hasRequestExpired ? 'reject' : 'cancel'}`)}
        />
        {#if fulfillsRequirements && verifiedState !== DappVerification.Scam}
            <Button width="full" on:click={onContinueClick} text={localize('actions.continue')} />
        {/if}
    </div>
</DrawerTemplate>
