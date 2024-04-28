<script lang="ts">
    import { Button, Spinner, Table, TableRow, Text } from '@bloomwalletio/ui'
    import { DappInfo } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { SecurityWarning, UnsupportedDappHint } from '../components'
    import { getAllNetworkIds } from '@core/network'
    import { ALL_SUPPORTED_METHODS } from '@auxiliary/wallet-connect/constants'
    import { rejectSession } from '@auxiliary/wallet-connect/utils'
    import { showNotification } from '@auxiliary/notification'
    import { onDestroy } from 'svelte'
    import { DappVerification, RpcMethod } from '@auxiliary/wallet-connect/enums'
    import { ProposalTypes } from '@walletconnect/types'

    export let drawerRouter: Router<unknown>

    const localeKey = 'views.dashboard.drawers.dapps.connectionRequest'
    let acceptedInsecureConnection = false
    let flashingCheckbox = false
    $: fulfillsRequirements =
        !!$sessionProposal &&
        doesFulfillNetworkRequirements(
            $sessionProposal.params.requiredNamespaces,
            $sessionProposal.params.optionalNamespaces
        ) &&
        doesFulfillMethodRequirements($sessionProposal.params.requiredNamespaces)
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

    function doesFulfillNetworkRequirements(
        requiredNamespaces: ProposalTypes.RequiredNamespaces,
        optionalNamespaces: ProposalTypes.RequiredNamespaces
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
        {#if false}
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
                    <UnsupportedDappHint
                        requiredNamespaces={$sessionProposal.params.requiredNamespaces}
                        optionalNamespaces={$sessionProposal.params.optionalNamespaces}
                    />
                </div>
            {:else if verifiedState !== DappVerification.Valid}
                <div class="px-6">
                    <SecurityWarning {verifiedState} {flashingCheckbox} bind:acceptedInsecureConnection />
                </div>
            {/if}
        {:else}
            <div class="w-full h-full flex items-center justify-center">
                <Spinner size={'lg'} />
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
