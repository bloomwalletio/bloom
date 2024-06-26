<script lang="ts">
    import { Alert, Table, TableRow, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { NetworkAvatarGroup } from '@ui'
    import { ALL_SUPPORTED_METHODS } from '@auxiliary/wallet-connect/constants'
    import { SupportedNetworkId, getAllNetworkIds } from '@core/network'
    import { RpcMethod } from '@auxiliary/wallet-connect/enums'

    export let requiredNetworks: string[] = []
    export let optionalNetworks: string[] = []
    export let requiredMethods: string[] = []

    const MAX_UNSUPPORTED_METHODS = 3
    const localeKey = 'views.dashboard.drawers.dapps.connectionRequest'

    $: ({
        supportedNetworksByProfile,
        supportedNetworksByOtherProfile,
        unsupportedRequiredNetworks,
        otherProfileSupportsRequiredNetworks,
        supportsAnyNetwork,
    } = getNetworkRequirementsSummary(requiredNetworks, optionalNetworks))
    $: unsupportedMethods = getUnsupportedMethods(requiredMethods as RpcMethod[])

    function getNetworkRequirementsSummary(
        requiredNetworksByDapp: string[],
        optionalMethods: string[]
    ): {
        supportedNetworksByProfile: string[]
        supportedNetworksByOtherProfile: string[]
        unsupportedRequiredNetworks: string[]
        otherProfileSupportsRequiredNetworks: boolean
        supportsAnyNetwork: boolean
    } {
        const supportedNetworksByProfile = getAllNetworkIds()
        const allSupportedNetworksByWallet: string[] = Object.values(SupportedNetworkId)
        const supportedNetworksByDapp = [...requiredNetworksByDapp, ...optionalMethods] as string[]

        const unsupportedRequiredNetworks = requiredNetworksByDapp.filter(
            (networkId) => !supportedNetworksByProfile.includes(networkId)
        )
        const otherProfileSupportsRequiredNetworks = requiredNetworksByDapp.every((networkId) =>
            allSupportedNetworksByWallet.includes(networkId)
        )

        const supportsAnyNetwork = supportedNetworksByDapp.some((networkId) =>
            supportedNetworksByProfile.includes(networkId)
        )
        const supportedNetworksByOtherProfile = supportedNetworksByDapp.filter((networkId) =>
            allSupportedNetworksByWallet.includes(networkId)
        )

        return {
            supportedNetworksByProfile,
            supportedNetworksByOtherProfile,
            unsupportedRequiredNetworks,
            otherProfileSupportsRequiredNetworks,
            supportsAnyNetwork,
        }
    }

    function getUnsupportedMethods(_requiredMethods: RpcMethod[]): RpcMethod[] {
        return _requiredMethods.filter((method) => !ALL_SUPPORTED_METHODS.includes(method))
    }
</script>

{#if unsupportedRequiredNetworks.length}
    <Alert
        variant={supportedNetworksByOtherProfile.length ? 'warning' : 'danger'}
        text={localize(
            `${localeKey}.${supportedNetworksByOtherProfile.length ? 'supportedOnOtherProfile' : 'unsupportedNetworks'}`
        )}
    >
        <Table
            slot="body"
            items={[
                {
                    key: localize(`${localeKey}.requiredNetworks`),
                    value: unsupportedRequiredNetworks.join(', '),
                    slot: otherProfileSupportsRequiredNetworks
                        ? {
                              component: NetworkAvatarGroup,
                              props: {
                                  networkIds: unsupportedRequiredNetworks,
                                  size: 'sm',
                              },
                          }
                        : undefined,
                },
                {
                    key: localize(`${localeKey}.supported`),
                    slot: {
                        component: NetworkAvatarGroup,
                        props: {
                            networkIds: supportedNetworksByProfile,
                            size: 'sm',
                        },
                    },
                },
            ]}
        />
    </Alert>
{:else if !supportsAnyNetwork}
    <Alert
        variant={supportedNetworksByOtherProfile.length ? 'warning' : 'danger'}
        text={localize(
            `${localeKey}.${supportedNetworksByOtherProfile.length ? 'supportedOnOtherProfile' : 'noSupportedNetworks'}`
        )}
    >
        <Table
            slot="body"
            items={[
                {
                    key: localize(`${localeKey}.requiredNetworks`),
                    slot: supportedNetworksByOtherProfile.length
                        ? {
                              component: NetworkAvatarGroup,
                              props: {
                                  networkIds: supportedNetworksByOtherProfile,
                                  size: 'sm',
                              },
                          }
                        : undefined,
                },
                {
                    key: localize(`${localeKey}.supported`),
                    slot: {
                        component: NetworkAvatarGroup,
                        props: {
                            networkIds: supportedNetworksByProfile,
                            size: 'sm',
                        },
                    },
                },
            ]}
        />
    </Alert>
{:else if unsupportedMethods.length}
    <Alert variant="danger" text={localize(`${localeKey}.unsupportedMethods`)}>
        <Table slot="body">
            {#each unsupportedMethods.slice(0, MAX_UNSUPPORTED_METHODS) as method}
                <TableRow item={{ key: method }}>
                    <Text textColor="warning" slot="boundValue">{localize(`${localeKey}.requiredNetworks`)}</Text>
                </TableRow>
            {/each}
        </Table>
    </Alert>
{/if}
