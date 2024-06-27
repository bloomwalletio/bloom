<script lang="ts">
    import { Button, Spinner, Table } from '@bloomwalletio/ui'
    import { sessionInitiationRequest } from '@auxiliary/wallet-connect/stores'
    import {
        getNetworksAndMethodsFromNamespaces,
        rejectAndClearSessionInitiationRequest,
    } from '@auxiliary/wallet-connect/utils'
    import { showNotification } from '@auxiliary/notification'
    import { DappVerification, RpcMethod, SessionInitiationType } from '@auxiliary/wallet-connect/enums'
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import ConnectionRequest from './ConnectionRequest.svelte'
    import { Web3WalletTypes } from '@walletconnect/web3wallet'
    import { onDestroy } from 'svelte'

    export let drawerRouter: Router<unknown>

    const localeKey = 'views.dashboard.drawers.dapps.connectionRequest'

    type ConnectionRequestProps = {
        dappMetadata: Web3WalletTypes.Metadata
        verifiedState: DappVerification
        requiredNetworks: string[]
        optionalNetworks: string[]
        requiredMethods: RpcMethod[]
    }

    let timeout: ReturnType<typeof setTimeout> | undefined
    $: {
        if ($sessionInitiationRequest) {
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

    function getConnectionRequestDataFromSessionProposal(
        sessionProposal: Web3WalletTypes.SessionProposal
    ): ConnectionRequestProps {
        const dappMetadata = sessionProposal.params.proposer.metadata
        const verifiedState = sessionProposal.verifyContext.verified.isScam
            ? DappVerification.Scam
            : (sessionProposal.verifyContext.verified.validation as DappVerification)

        const { requiredNetworks, optionalNetworks, requiredMethods } = getNetworksAndMethodsFromNamespaces(
            sessionProposal.params.requiredNamespaces,
            sessionProposal.params.optionalNamespaces
        )

        return {
            dappMetadata,
            verifiedState,
            requiredNetworks,
            optionalNetworks,
            requiredMethods,
        }
    }

    function getConnectionRequestDataFromSessionAuthenticate(
        sessionAuthenticatePayload: Web3WalletTypes.SessionAuthenticate
    ): ConnectionRequestProps {
        return {
            dappMetadata: sessionAuthenticatePayload.params.requester.metadata,
            verifiedState: DappVerification.Unknown,
            requiredNetworks: [],
            optionalNetworks: sessionAuthenticatePayload.params.authPayload.chains,
            requiredMethods: [],
        }
    }

    function onRejectClick(): void {
        void rejectAndClearSessionInitiationRequest()
        closeDrawer()
    }

    onDestroy(() => {
        clearTimeout(timeout)
    })
</script>

{#if $sessionInitiationRequest?.type === SessionInitiationType.SessionProposal}
    {@const { dappMetadata, verifiedState, requiredNetworks, optionalNetworks, requiredMethods } =
        getConnectionRequestDataFromSessionProposal($sessionInitiationRequest.payload)}
    <ConnectionRequest
        {dappMetadata}
        {verifiedState}
        {requiredNetworks}
        {optionalNetworks}
        {requiredMethods}
        {drawerRouter}
        expiryTimestamp={$sessionInitiationRequest.payload.params.expiryTimestamp}
    >
        <Table
            items={[
                {
                    key: localize('general.description'),
                    value: dappMetadata.description || undefined,
                },
            ]}
            orientation="vertical"
        />
    </ConnectionRequest>
{:else if $sessionInitiationRequest?.type === SessionInitiationType.SessionAuthenticate}
    {@const { dappMetadata, verifiedState, requiredNetworks, optionalNetworks, requiredMethods } =
        getConnectionRequestDataFromSessionAuthenticate($sessionInitiationRequest.payload)}
    <ConnectionRequest
        {dappMetadata}
        {verifiedState}
        {requiredNetworks}
        {optionalNetworks}
        {requiredMethods}
        {drawerRouter}
        expiryTimestamp={$sessionInitiationRequest.payload.params.expiryTimestamp}
    >
        <Table
            items={[
                {
                    key: localize('general.message'),
                    value: localize('views.dashboard.drawers.dapps.confirmConnection.siweStatement', {
                        origin: dappMetadata.url,
                    }),
                },
            ]}
            orientation="vertical"
        />
    </ConnectionRequest>
{:else}
    <DrawerTemplate
        title={localize(`${localeKey}.title`)}
        {drawerRouter}
        onBack={() => void rejectAndClearSessionInitiationRequest()}
    >
        <div class="w-full h-full flex items-center justify-center">
            <Spinner size="lg" textColor="primary" />
        </div>
        <div class="flex flex-row gap-2" slot="footer">
            <Button width="full" variant="outlined" on:click={onRejectClick} text={localize('actions.cancel')} />
        </div>
    </DrawerTemplate>
{/if}
