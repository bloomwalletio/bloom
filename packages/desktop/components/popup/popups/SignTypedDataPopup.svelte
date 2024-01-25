<script lang="ts">
    import { localize } from '@core/i18n'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { IConnectedDapp } from '@auxiliary/wallet-connect/interface'
    import { CallbackParameters } from '@auxiliary/wallet-connect/types'
    import { Alert, JsonTree, Table, Text } from '@bloomwalletio/ui'
    import { IAccountState } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { IChain } from '@core/network'
    import { AccountLabel } from '@ui'
    import { onMount } from 'svelte'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { LedgerAppName } from '@core/ledger'
    import PopupTemplate from '../PopupTemplate.svelte'
    import DappDataBanner from '@components/DappDataBanner.svelte'
    import { getSdkError } from '@walletconnect/utils'
    import { SignTypedDataVersion } from '@metamask/eth-sig-util'
    import { signEip712Message } from '@core/wallet/actions/signEip712Message'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let data: string
    export let version: SignTypedDataVersion
    export let account: IAccountState
    export let chain: IChain
    export let dapp: IConnectedDapp | undefined
    export let callback: (params: CallbackParameters) => void

    let isBusy = false

    async function unlockAndSign(): Promise<string> {
        // const typedData = JSON.parse(data)

        // let hashedData: string
        // if (version === SignTypedDataVersion.V1) {
        //     hashedData = '0x' + typedSignatureHash(typedData)
        //     console.log('v1', hashedData)
        // } else {
        //     console.log("hex2", TypedDataUtils.eip712Hash(typedData, SignTypedDataVersion.V4).toString('hex'))
        //     hashedData = '0x' + TypedDataUtils.eip712Hash(typedData, version).toString('hex')
        // }

        return new Promise((resolve, reject) => {
            checkActiveProfileAuth(
                async () => {
                    try {
                        const { coinType } = chain.getConfiguration()
                        const result = await signEip712Message(data, version, coinType, account)
                        closePopup({ forceClose: true })
                        resolve(result)
                        return
                    } catch (error) {
                        closePopup({ forceClose: true })
                        reject(error)
                    }
                },
                { stronghold: true, ledger: true },
                LedgerAppName.Ethereum,
                () => {
                    reject(getSdkError('USER_REJECTED'))
                }
            )
        })
    }

    async function onConfirmClick(): Promise<void> {
        isBusy = true
        try {
            const result = await unlockAndSign()
            // const typedData = JSON.parse(data)

            // const signerAddress = recoverTypedSignature({ data: typedData, signature: result, version })
            // console.log(signerAddress);

            callback({ result })
            openPopup({
                id: PopupId.SuccessfulDappInteraction,
                props: {
                    successMessage: localize('popups.signMessage.success'),
                    url: dapp.metadata?.url,
                },
            })
        } catch (err) {
            callback({ error: err })
            handleError(err)
        } finally {
            isBusy = false
        }
    }

    function onCancelClick(): void {
        closePopup({ callOnCancel: true })
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
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
    busy={$selectedAccount?.isTransferring || isBusy}
>
    <DappDataBanner slot="banner" {dapp} />

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
                text={localize('popups.signMessage.hint', { dappName: dapp.metadata?.name ?? 'Unkown' })}
            />
        {:else}
            <Alert variant="warning" text={localize('popups.signMessage.warning')} />
        {/if}
    </div>
</PopupTemplate>
