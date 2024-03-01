<script lang="ts">
    import { Alert, Table, TableRow, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { NetworkAvatarGroup } from '@ui'

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
            items={[
                {
                    key: localize(`${localeKey}.supportedNetworks`),
                    slot: {
                        component: NetworkAvatarGroup,
                        props: {
                            networkIds: supportedNetworks.networks,
                        },
                    },
                },
                {
                    key: localize(`${localeKey}.unsupportedNetworks`),
                    value: unsupportedRequiredNetworks.networks.join(', '),
                },
            ]}
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
            items={[
                {
                    key: localize(`${localeKey}.supportedNetworks`),
                    slot: {
                        component: NetworkAvatarGroup,
                        props: {
                            networkIds: supportedNetworks.networks,
                        },
                    },
                },
                {
                    key: localize(`${localeKey}.unsupportedNetworks`),
                    slot: {
                        component: NetworkAvatarGroup,
                        props: {
                            networkIds: supportedNetworks.networksOnOtherProfiles,
                        },
                    },
                },
            ]}
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
