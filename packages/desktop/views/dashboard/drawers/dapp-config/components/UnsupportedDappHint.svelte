<script lang="ts">
    import { Alert, Table, TableRow, Text } from '@bloomwalletio/ui'
    import { NetworkLabel } from '@ui'
    import { localize } from '@core/i18n'

    export let unsupportedMethods: string[]
    export let supportedNetworks: {
        networks: string[]
        networksOnOtherProfiles: string[]
    }
    export let unsupportedRequiredNetworks: {
        networks: string[]
        isSupportedOnOtherProfiles: boolean
    }

    const localeKey = 'views.dashboard.drawers.dapps.connectionRequest'
</script>

{#if unsupportedRequiredNetworks.networks.length}
    <Alert
        variant={unsupportedRequiredNetworks.isSupportedOnOtherProfiles ? 'warning' : 'danger'}
        text={localize(
            `${localeKey}.${
                unsupportedRequiredNetworks.isSupportedOnOtherProfiles
                    ? 'supportedOnOtherProfile'
                    : 'unsupportedNetworks'
            }`
        )}
    >
        <Table
            slot="body"
            items={unsupportedRequiredNetworks.networks.map((networkId) => ({
                key: localize(`${localeKey}.onAnotherProfile`),
                slot: {
                    component: NetworkLabel,
                    props: { networkId },
                },
            }))}
        />
    </Alert>
{:else if supportedNetworks.networks.length === 0}
    <Alert
        variant={supportedNetworks.networksOnOtherProfiles.length ? 'warning' : 'danger'}
        text={localize(
            `${localeKey}.${
                supportedNetworks.networksOnOtherProfiles.length ? 'supportedOnOtherProfile' : 'noSupportedNetworks'
            }`
        )}
    >
        <Table
            slot="body"
            items={supportedNetworks.networksOnOtherProfiles.map((networkId) => ({
                key: localize('onOtherProfile'),
                slot: {
                    component: NetworkLabel,
                    props: { networkId },
                },
            }))}
        />
    </Alert>
{:else if unsupportedMethods.length}
    <Alert variant="danger" text={localize(`${localeKey}.unsupportedMethods`)}>
        <Table slot="body">
            {#each unsupportedMethods as method}
                <TableRow item={{ key: method }}>
                    <Text textColor="warning" slot="boundValue">{localize(`${localeKey}.notSupported`)}</Text>
                </TableRow>
            {/each}
        </Table>
    </Alert>
{/if}
