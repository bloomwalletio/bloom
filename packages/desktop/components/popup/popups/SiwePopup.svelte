<script lang="ts">
    import { localize } from '@core/i18n'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { CallbackParameters } from '@auxiliary/wallet-connect/types'
    import { signMessage } from '@core/wallet/actions'
    import { Alert, Table } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { IChain } from '@core/network'
    import { AccountLabel } from '@ui'
    import { checkActiveProfileAuthAsync } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'
    import PopupTemplate from '../PopupTemplate.svelte'
    import DappDataBanner from '@components/DappDataBanner.svelte'
    import { ParsedMessage } from '@spruceid/siwe-parser'

    export let rawMessage: string
    export let siweObject: ParsedMessage
    export let account: IAccountState
    export let chain: IChain
    export let dapp: IConnectedDapp | undefined
    export let callback: (params: CallbackParameters) => void

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
    <DappDataBanner slot="banner" {dapp} />

    <div class="space-y-5">
        <Table
            items={[
                {
                    key: localize('popups.siwe.domain'),
                    value: siweObject.domain,
                },
                {
                    key: localize('popups.siwe.statement'),
                    value: siweObject.statement,
                },
                {
                    key: localize('popups.siwe.resources'),
                    value: siweObject.resources,
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
        {#if dapp}
            <Alert
                variant="info"
                text={localize('popups.signMessage.hint', { dappName: dapp.metadata?.name ?? 'Unkown' })}
            />
        {:else}
            <Alert variant="warning" text={localize('popups.signMessage.warning')} />
        {/if}
    </div>
</PopupTemplate>
