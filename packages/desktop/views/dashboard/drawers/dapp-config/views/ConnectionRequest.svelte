<script lang="ts">
    import { Button } from '@bloomwalletio/ui'
    import { DappInfo } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import { ConnectionRequestExpirationAlert, SecurityWarning, UnsupportedDappHint } from '../components'
    import { getAllNetworkIds } from '@core/network'
    import { ALL_SUPPORTED_METHODS } from '@auxiliary/wallet-connect/constants'
    import { DappVerification, RpcMethod } from '@auxiliary/wallet-connect/enums'
    import { Web3WalletTypes } from '@walletconnect/web3wallet'
    import { onMount } from 'svelte'
    import { MILLISECONDS_PER_SECOND } from '@core/utils'
    import { time } from '@core/app/stores'
    import { rejectAndClearSessionInitiationRequest } from '@auxiliary/wallet-connect/utils'

    export let drawerRouter: Router<unknown>
    export let dappMetadata: Web3WalletTypes.Metadata
    export let verifiedState: DappVerification
    export let requiredNetworks: string[]
    export let optionalNetworks: string[]
    export let requiredMethods: RpcMethod[]
    export let expiryTimestamp: number | undefined

    const localeKey = 'views.dashboard.drawers.dapps.connectionRequest'
    let acceptedInsecureConnection = false
    let flashingCheckbox = false

    $: hasRequestExpired = expiryTimestamp ? expiryTimestamp - $time.getTime() / MILLISECONDS_PER_SECOND <= 0 : false

    const fulfillsRequirements = doesFulfillsRequirements()
    function doesFulfillsRequirements(): boolean {
        const supportedNetworksByDapp = [...requiredNetworks, ...optionalNetworks]

        return (
            doesFulfillNetworkRequirements(requiredNetworks, supportedNetworksByDapp) &&
            doesFulfillMethodRequirements(requiredMethods)
        )
    }

    function doesFulfillNetworkRequirements(requiredNetworks: string[], optionalNetworks: string[]): boolean {
        const supportedNetworksByProfile = getAllNetworkIds()

        const supportsAllRequiredNetworks = requiredNetworks.every((networkId) =>
            supportedNetworksByProfile.includes(networkId)
        )
        if (!supportsAllRequiredNetworks) {
            return false
        }

        const supportsAnyNetwork = optionalNetworks.some((networkId) => supportedNetworksByProfile.includes(networkId))
        if (!supportsAnyNetwork) {
            return false
        }

        return true
    }

    function doesFulfillMethodRequirements(requiredMethods: RpcMethod[]): boolean {
        return requiredMethods.every((method) => ALL_SUPPORTED_METHODS.includes(method))
    }

    function onRejectClick(): void {
        void rejectAndClearSessionInitiationRequest()
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

    onMount(() => {
        const fulfillsRequirements =
            doesFulfillNetworkRequirements(requiredNetworks, optionalNetworks) &&
            doesFulfillMethodRequirements(requiredMethods)

        if (fulfillsRequirements && verifiedState === DappVerification.Valid) {
            drawerRouter.next()
        }
    })
</script>

<DrawerTemplate title={localize(`${localeKey}.title`)} {drawerRouter} showBack={false}>
    <div class="w-full h-full flex flex-col justify-between">
        <div>
            <DappInfo metadata={dappMetadata} {verifiedState} />
            <ConnectionRequestExpirationAlert {expiryTimestamp} />
        </div>
        <div class="flex-grow overflow-hidden">
            <div class="h-full overflow-scroll flex flex-col gap-5 p-6">
                <slot />
            </div>
        </div>
        {#if !fulfillsRequirements}
            <div class="px-6">
                <UnsupportedDappHint {requiredNetworks} {optionalNetworks} {requiredMethods} />
            </div>
        {:else if verifiedState !== DappVerification.Valid}
            <div class="px-6">
                <SecurityWarning {verifiedState} {flashingCheckbox} bind:acceptedInsecureConnection />
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
