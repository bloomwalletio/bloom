<script lang="ts">
    import { Alert, Button, Checkbox, Table, TableRow, Text } from '@bloomwalletio/ui'
    import { Spinner } from '@ui'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { DrawerTemplate } from '@components'
    import { getPersistedDappNamespacesForDapp, sessionProposal } from '@auxiliary/wallet-connect/stores'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import DappInformationCard from '../components/DappInformationCard.svelte'

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

    function onRejectClick(): void {
        $sessionProposal = undefined
        closeDrawer()
    }

    function onContinueClick(): void {
        drawerRouter.next()
    }
</script>

<DrawerTemplate title={localize(`${localeKey}.title`)} {drawerRouter}>
    <div class="w-full h-full flex flex-col justify-between">
        {#if $sessionProposal}
            {@const metadata = $sessionProposal.params.proposer.metadata}
            <DappInformationCard {metadata} />

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
            {#if !isVerified}
                <div class="flex flex-col gap-8 px-6">
                    <Alert variant="danger" text={localize(`${localeKey}.insecure`)} />
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
        <Button width="full" variant="outlined" on:click={onRejectClick} text={localize('actions.reject')} />
        <Button
            width="full"
            on:click={onContinueClick}
            disabled={!isVerified && !acceptedInsecureConnection}
            text={localize('actions.continue')}
        />
    </div>
</DrawerTemplate>
