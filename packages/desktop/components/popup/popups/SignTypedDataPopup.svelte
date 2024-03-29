<script lang="ts">
    import { localize } from '@core/i18n'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { CallbackParameters } from '@auxiliary/wallet-connect/types'
    import { Alert, JsonTree, Table, Text } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { IChain } from '@core/network'
    import { AccountLabel, DappInfo } from '@ui'
    import { checkActiveProfileAuthAsync } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { SignTypedDataVersion } from '@metamask/eth-sig-util'
    import { signEip712Message } from '@core/wallet/actions/signEip712Message'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'

    export let data: string
    export let version: SignTypedDataVersion.V3 | SignTypedDataVersion.V4
    export let account: IAccountState
    export let chain: IChain
    export let dapp: IConnectedDapp
    export let verifiedState: DappVerification
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
            const result = await signEip712Message(data, version, coinType, account)
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
            closePopup({ forceClose: true })
            callback({ error: err.message ?? localize('error.global.generic') })
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
        <div>
            <Text fontWeight="medium">{localize('general.message')}</Text>
            <JsonTree value={JSON.parse(data)} truncated copyable />
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
                text={localize('popups.signMessage.hint', {
                    dappName: dapp.metadata?.name ?? localize('general.unknown'),
                })}
            />
        {:else}
            <Alert variant="warning" text={localize('popups.signMessage.warning')} />
        {/if}
    </div>
</PopupTemplate>
