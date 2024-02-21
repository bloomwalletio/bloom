<script lang="ts">
    import { localize } from '@core/i18n'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { CallbackParameters } from '@auxiliary/wallet-connect/types'
    import { signMessage } from '@core/wallet/actions'
    import { Table, Tabs, Text } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { IChain } from '@core/network'
    import { AccountLabel, DappInfo, KeyValue } from '@ui'
    import { checkActiveProfileAuthAsync } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { ParsedMessage } from '@spruceid/siwe-parser'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { openUrlInBrowser } from '@core/app'

    export let rawMessage: string
    export let siweObject: ParsedMessage
    export let account: IAccountState
    export let chain: IChain
    export let dapp: IConnectedDapp
    export let verifiedState: DappVerification
    export let callback: (params: CallbackParameters) => void

    enum Tab {
        Details = 'details',
        Ressources = 'ressources',
        RawMessage = 'rawMessage',
    }

    const TABS: KeyValue<string>[] = [
        { key: Tab.Details, value: localize('popups.siwe.details') },
        { key: Tab.Ressources, value: localize('popups.siwe.ressources') },
        { key: Tab.RawMessage, value: localize('popups.siwe.raw') },
    ]

    let selectedTab = TABS[0]

    let isBusy = false

    async function onConfirmClick(): Promise<void> {
        try {
            await checkActiveProfileAuthAsync(LedgerAppName.Ethereum)
        } catch {
            return
        }

        isBusy = true
        try {
            const { coinType } = chain.getConfiguration()
            const result = await signMessage(rawMessage, coinType, account)
            closePopup({ forceClose: true })

            callback({ result })
            openPopup({
                id: PopupId.SuccessfulDappInteraction,
                props: {
                    successMessage: localize('popups.signMessage.success'),
                    url: dapp.metadata?.url,
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

    <div class="space-y-5">
        <Tabs bind:selectedTab tabs={TABS} />
        {#if selectedTab.key === Tab.Details}
            <div class="border border-solid border-stroke dark:border-stroke-dark rounded-lg p-4">
                <Text fontWeight="medium">{localize('popups.siwe.statement')}</Text>
                <Text textColor="secondary" type="sm" fontWeight="medium" class="whitespace-pre-line break-words"
                    >{siweObject.statement}</Text
                >
            </div>
            <Table
                items={[
                    {
                        key: localize('popups.siwe.domain'),
                        value: siweObject.domain,
                    },
                    {
                        key: localize('popups.siwe.chainId'),
                        value: siweObject.chainId,
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
        {:else if selectedTab.key === Tab.Ressources}
            <Table
                items={siweObject.resources.map((resource, index) => ({
                    key: `Ressource ${index + 1}`,
                    value: resource,
                    onClick: () => openUrlInBrowser(resource),
                }))}
            />
        {:else}
            <div class="border border-solid border-stroke dark:border-stroke-dark rounded-lg p-4">
                <Text fontWeight="medium">{localize('popups.siwe.rawMessage')}</Text>
                <Text textColor="secondary" type="sm" fontWeight="medium" class="whitespace-pre-line break-words"
                    >{rawMessage}</Text
                >
            </div>
        {/if}
    </div>
</PopupTemplate>
