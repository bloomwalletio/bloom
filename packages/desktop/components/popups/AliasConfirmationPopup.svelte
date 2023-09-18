<script lang="ts">
    import { onMount } from 'svelte'
    import {
        AliasOutputBuilderParams,
        Ed25519Address,
        GovernorAddressUnlockCondition,
        StateControllerAddressUnlockCondition,
    } from '@iota/sdk/out/types'
    import { Button, FontWeight, Text, TextType } from '@ui'
    import { Table } from '@bloomwalletio/ui'
    import { getSelectedAccount, selectedAccount, updateSelectedAccount } from '@core/account/stores'
    import { processAndAddToActivities } from '@core/activity/utils'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { getActiveNetworkId } from '@core/network'
    import { checkActiveProfileAuth, getBaseToken } from '@core/profile/actions'
    import { api, getClient } from '@core/profile-manager'
    import { formatTokenAmountPrecise } from '@core/token'
    import { EMPTY_HEX_ID, sendPreparedTransaction } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let storageDeposit: string = '0'

    const address = new Ed25519Address(api.bech32ToHex($selectedAccount.depositAddress))

    const aliasOutputParams: AliasOutputBuilderParams = {
        aliasId: EMPTY_HEX_ID,
        unlockConditions: [
            new GovernorAddressUnlockCondition(address),
            new StateControllerAddressUnlockCondition(address),
        ],
    }

    void setStorageDeposit(aliasOutputParams)

    $: isTransferring = $selectedAccount.isTransferring

    async function setStorageDeposit(params: AliasOutputBuilderParams): Promise<void> {
        try {
            const client = await getClient()
            const resp = await client.buildAliasOutput(params)
            storageDeposit = formatTokenAmountPrecise(Number(resp.amount), getBaseToken())
        } catch (err) {
            handleError(err)
        }
    }

    async function createAlias(): Promise<void> {
        try {
            const account = getSelectedAccount()
            const networkId = getActiveNetworkId()

            updateSelectedAccount({ isTransferring: true })
            const preparedTransaction = await $selectedAccount.prepareCreateAliasOutput()
            const transaction = await sendPreparedTransaction(preparedTransaction)
            await processAndAddToActivities(transaction, account, networkId)
            closePopup()
        } catch (err) {
            handleError(err)
        } finally {
            updateSelectedAccount({ isTransferring: false })
        }
    }

    async function onConfirmClick(): Promise<void> {
        await checkActiveProfileAuth(createAlias, { stronghold: true, ledger: false })
    }

    function onCancelClick(): void {
        closePopup()
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<send-confirmation-popup class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">{localize('popups.alias.title')}</Text
    >
    <div class="w-full flex-col space-y-2">
        <Table
            items={[
                {
                    key: localize('general.storageDeposit'),
                    value: storageDeposit,
                    tooltip: localize('tooltips.transactionDetails.incoming.storageDeposit'),
                },
                {
                    key: localize('general.governorAddress'),
                    value: $selectedAccount.depositAddress,
                    truncate: { firstCharCount: 10, endCharCount: 10 },
                    copyable: true,
                },
                {
                    key: localize('popups.walletFinder.totalWalletBalance'),
                    value: $selectedAccount.depositAddress,
                    truncate: { firstCharCount: 10, endCharCount: 10 },
                    copyable: true,
                },
            ]}
        />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick} disabled={isTransferring}>
            {localize('actions.cancel')}
        </Button>
        <Button autofocus classes="w-full" onClick={onConfirmClick} disabled={isTransferring} isBusy={isTransferring}>
            {localize('actions.confirm')}
        </Button>
    </popup-buttons>
</send-confirmation-popup>
