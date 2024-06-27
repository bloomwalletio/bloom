<script lang="ts">
    import { localize } from '@core/i18n'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { signMessage } from '@core/wallet/actions'
    import { Alert, Table, Text } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { AccountLabel, DappInfo } from '@ui'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { WCRequestInfo } from '@auxiliary/wallet-connect/types'
    import { MILLISECONDS_PER_SECOND } from '@core/utils'
    import { time } from '@core/app/stores'
    import { ConnectionRequestExpirationAlert } from '@views/dashboard/drawers/dapp-config/components'

    export let message: string
    export let account: IAccountState
    export let requestInfo: WCRequestInfo

    const { dapp, responseCallback, verifiedState, evmNetwork, expiryTimestamp } = requestInfo

    let isBusy = false

    $: hasExpired = (expiryTimestamp ?? 0 * MILLISECONDS_PER_SECOND) - $time.getTime() <= 0

    async function onConfirmClick(): Promise<void> {
        try {
            await checkActiveProfileAuth(LedgerAppName.Ethereum)
        } catch {
            return
        }

        isBusy = true
        try {
            const result = await signMessage(message, evmNetwork.coinType, account)
            closePopup({ forceClose: true })

            responseCallback({ result })
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
    title={localize('popups.signMessage.title')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('popups.signMessage.action'),
        onClick: onConfirmClick,
        disabled: hasExpired,
    }}
    busy={isBusy}
>
    <svelte:fragment slot="banner">
        {#if dapp}
            <DappInfo
                slot="banner"
                metadata={dapp.metadata}
                {verifiedState}
                showLink={false}
                classes="bg-surface-1 dark:bg-surface-1-dark pb-4"
            />
            <ConnectionRequestExpirationAlert {expiryTimestamp} />
        {/if}
    </svelte:fragment>

    <div class="space-y-5">
        <div>
            <Text fontWeight="medium">{localize('general.message')}</Text>
            <Text textColor="secondary" type="sm" fontWeight="medium">{message}</Text>
        </div>
        <Table
            items={[
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
