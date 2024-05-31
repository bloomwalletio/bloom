<script lang="ts">
    import { Button, Spinner } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { connectionRequest } from '@auxiliary/wallet-connect/stores'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import ConnectionRequest from './ConnectionRequest.svelte'
    import { rejectConnectionRequest } from '@auxiliary/wallet-connect/utils'
    import { showNotification } from '@auxiliary/notification'
    import { onDestroy } from 'svelte'
    import { DappVerification, RpcMethod } from '@auxiliary/wallet-connect/enums'
    import { Web3WalletTypes } from '@walletconnect/web3wallet'

    export let drawerRouter: Router<unknown>

    const localeKey = 'views.dashboard.drawers.dapps.connectionRequest'

    let timeout: ReturnType<typeof setTimeout> | undefined
    $: {
        if ($connectionRequest) {
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

    type ConnectionRequestProps = {
        dappMetadata: Web3WalletTypes.Metadata
        verifiedState: DappVerification
        requiredNetworks: string[]
        optionalNetworks: string[]
        requiredMethods: RpcMethod[]
    }

    function getConnectionRequestDataFromSessionProposal(
        sessionProposal: Web3WalletTypes.SessionProposal
    ): ConnectionRequestProps {
        const dappMetadata = sessionProposal.params.proposer.metadata
        const verifiedState = sessionProposal.verifyContext.verified.isScam
            ? DappVerification.Scam
            : (sessionProposal.verifyContext.verified.validation as DappVerification)

        const requiredNetworks = Object.values(sessionProposal.params.requiredNamespaces)
            .flatMap(({ chains }) => chains ?? [])
            .filter(Boolean)
        const optionalNetworks = Object.values(sessionProposal.params.optionalNamespaces)
            .flatMap(({ chains }) => chains ?? [])
            .filter(Boolean)
        const requiredMethods = Object.values(sessionProposal.params.requiredNamespaces).flatMap(
            ({ methods }) => methods
        ) as RpcMethod[]

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
        rejectConnectionRequest()
        closeDrawer()
    }

    onDestroy(() => {
        clearTimeout(timeout)
    })
</script>

{#if $connectionRequest?.type === 'session_proposal'}
    {@const { dappMetadata, verifiedState, requiredNetworks, optionalNetworks, requiredMethods } =
        getConnectionRequestDataFromSessionProposal($connectionRequest.payload)}
    <ConnectionRequest
        {dappMetadata}
        {verifiedState}
        {requiredNetworks}
        {optionalNetworks}
        {requiredMethods}
        {drawerRouter}
    />
{:else if $connectionRequest?.type === 'session_authenticate'}
    {@const { dappMetadata, verifiedState, requiredNetworks, optionalNetworks, requiredMethods } =
        getConnectionRequestDataFromSessionAuthenticate($connectionRequest.payload)}
    <ConnectionRequest
        {dappMetadata}
        {verifiedState}
        {requiredNetworks}
        {optionalNetworks}
        {requiredMethods}
        {drawerRouter}
    />
{:else}
    <DrawerTemplate title={localize(`${localeKey}.title`)} {drawerRouter} onBack={rejectConnectionRequest}>
        <div class="w-full h-full flex items-center justify-center">
            <Spinner size="lg" textColor="primary" />
        </div>
        <div class="flex flex-row gap-2" slot="footer">
            <Button width="full" variant="outlined" on:click={onRejectClick} text={localize('actions.cancel')} />
        </div>
    </DrawerTemplate>
{/if}
