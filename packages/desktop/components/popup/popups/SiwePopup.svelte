<script lang="ts">
    import { localize } from '@core/i18n'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { CallbackParameters } from '@auxiliary/wallet-connect/types'
    import { signMessage } from '@core/wallet/actions'
    import { Table, Tabs, Text } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { IEvmNetwork, EvmNetworkId, getNameFromNetworkId } from '@core/network'
    import { AccountLabel, DappInfo, KeyValue, NetworkLabel } from '@ui'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { ParsedMessage } from '@spruceid/siwe-parser'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { openUrlInBrowser } from '@core/app'

    export let rawMessage: string
    export let siweObject: ParsedMessage
    export let account: IAccountState
    export let evmNetwork: IEvmNetwork
    export let dapp: IConnectedDapp
    export let verifiedState: DappVerification
    export let callback: (params: CallbackParameters) => void

    enum Tab {
        Details = 'details',
        Resources = 'resources',
        Raw = 'raw',
    }

    const TABS: KeyValue<string>[] = (
        siweObject.resources ? [Tab.Details, Tab.Resources, Tab.Raw] : [Tab.Details, Tab.Raw]
    ).map((key) => ({
        key,
        value: localize(`popups.siwe.${key}`),
    }))

    let selectedTab = TABS[0]
    let isBusy = false
    const networkId: EvmNetworkId = `eip155:${siweObject.chainId}`

    async function onConfirmClick(): Promise<void> {
        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch {
            return
        }

        isBusy = true
        try {
            const result = await signMessage(rawMessage, evmNetwork.coinType, account)
            closePopup({ forceClose: true })

            callback({ result })
            openPopup({
                id: PopupId.SuccessfulDappInteraction,
                props: {
                    successMessage: localize('popups.signMessage.success'),
                    dapp,
                },
            })
        } catch (err) {
            handleError(err)
        } finally {
            isBusy = false
        }
    }

    function onCancelClick(): void {
        closePopup({ callOnCancel: true })
    }
</script>

<PopupTemplate
    title={localize('popups.siwe.title')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('popups.siwe.action'),
        onClick: onConfirmClick,
    }}
    busy={isBusy}
>
    <DappInfo
        slot="banner"
        metadata={dapp.metadata}
        {verifiedState}
        showLink={false}
        classes="bg-surface-1 dark:bg-surface-1-dark pb-4"
    />

    <div class="flex flex-col gap-5">
        {#if siweObject.statement}
            <div class="border border-solid border-stroke dark:border-stroke-dark rounded-lg p-4 max-h-28 scrollable-y">
                <Text fontWeight="medium">{localize('popups.siwe.statement')}</Text>
                <Text textColor="secondary" type="sm" fontWeight="medium" class="whitespace-pre-line break-words"
                    >{siweObject.statement}</Text
                >
            </div>
        {/if}
        <Tabs bind:selectedTab tabs={TABS} />
        {#if selectedTab.key === Tab.Details}
            <Table
                items={[
                    {
                        key: localize('popups.siwe.domain'),
                        value: siweObject.domain,
                    },
                    {
                        key: localize('general.network'),
                        slot: getNameFromNetworkId(networkId)
                            ? {
                                  component: NetworkLabel,
                                  props: {
                                      networkId,
                                  },
                              }
                            : undefined,
                    },
                    {
                        key: localize('popups.siwe.chainId'),
                        value: getNameFromNetworkId(networkId) ? undefined : networkId,
                    },
                    {
                        key: localize('general.account'),
                        slot: {
                            component: AccountLabel,
                            props: {
                                account,
                            },
                        },
                    },
                ]}
            />
        {:else if selectedTab.key === Tab.Resources}
            <Table
                items={siweObject.resources?.map((resource, index) => ({
                    key: `Ressource ${index + 1}`,
                    value: resource,
                    onClick: () => openUrlInBrowser(resource),
                }))}
            />
        {:else}
            <div class="border border-solid border-stroke dark:border-stroke-dark rounded-lg p-4 max-h-64 scrollable-y">
                <Text fontWeight="medium">{localize('popups.siwe.rawMessage')}</Text>
                <Text textColor="secondary" type="sm" fontWeight="medium" class="whitespace-pre-line break-words"
                    >{rawMessage}</Text
                >
            </div>
        {/if}
    </div>
</PopupTemplate>
