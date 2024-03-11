<script lang="ts">
    import { Alert, Table, TableRow, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { ProposalTypes } from '@walletconnect/types'
    import { NetworkAvatarGroup } from '@ui'
    import { METHODS_FOR_PERMISSION } from '@auxiliary/wallet-connect/constants'
    import { SupportedNetworkId, getAllNetworkIds } from '@core/network'
    import { RpcMethod } from '@auxiliary/wallet-connect/enums'

    export let requiredNamespaces: ProposalTypes.RequiredNamespaces
    export let optionalNamespaces: ProposalTypes.RequiredNamespaces

    const localeKey = 'views.dashboard.drawers.dapps.connectionRequest'

    $: ({
        supportedNetworksByProfile,
        supportedNetworksByOtherProfile,
        unsupportedRequiredNetworks,
        otherProfileSupportsRequiredNetworks,
        supportsAnyNetwork,
    } = getNetworkRequirementsSummary(requiredNamespaces, optionalNamespaces))
    $: unsupportedMethods = getUnsupportedMethods(requiredNamespaces)

    function getNetworkRequirementsSummary(
        _requiredNamespaces: ProposalTypes.RequiredNamespaces,
        _optionalNamespaces: ProposalTypes.RequiredNamespaces
    ): {
        supportedNetworksByProfile: string[]
        supportedNetworksByOtherProfile: string[]
        unsupportedRequiredNetworks: string[]
        otherProfileSupportsRequiredNetworks: boolean
        supportsAnyNetwork: boolean
    } {
        const supportedNetworksByProfile = getAllNetworkIds()
        const allSupportedNetworksByWallet: string[] = Object.values(SupportedNetworkId)
        const requiredNetworksByDapp = Object.values(_requiredNamespaces).flatMap((namespace) => namespace.chains)
        const supportedNetworksByDapp = [
            ...requiredNetworksByDapp,
            ...Object.values(_optionalNamespaces).flatMap((namespace) => namespace.chains),
        ]

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

    function getUnsupportedMethods(_requiredNamespaces: ProposalTypes.RequiredNamespaces): RpcMethod[] {
        const supportedMethodsByWallet = Object.values(METHODS_FOR_PERMISSION).flat() as RpcMethod[]
        const requiredMethods = Object.values(_requiredNamespaces).flatMap(
            (namespace) => namespace.methods
        ) as RpcMethod[]

        return requiredMethods.filter((method) => !supportedMethodsByWallet.includes(method))
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
                    key: localize(`${localeKey}.supported`),
                    slot: {
                        component: NetworkAvatarGroup,
                        props: {
                            networkIds: supportedNetworksByProfile,
                            size: 'sm',
                        },
                    },
                },
                {
                    key: localize(`${localeKey}.notSupported`),
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
                    key: localize(`${localeKey}.supported`),
                    slot: {
                        component: NetworkAvatarGroup,
                        props: {
                            networkIds: supportedNetworksByProfile,
                            size: 'sm',
                        },
                    },
                },
                {
                    key: localize(`${localeKey}.onAnotherProfile`),
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
