<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
    import { processAndAddToActivities } from '@core/activity/actions'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuthAsync, getBaseToken } from '@core/profile/actions'
    import { EMPTY_HEX_ID, sendPreparedTransaction } from '@core/wallet'
    import {
        AliasOutputBuilderParams,
        Ed25519Address,
        GovernorAddressUnlockCondition,
        StateControllerAddressUnlockCondition,
    } from '@iota/sdk/out/types'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { api, getClient } from '@core/profile-manager'
    import { formatTokenAmountPrecise } from '@core/token'
    import { getActiveNetworkId } from '@core/network'
    import PopupTemplate from '../PopupTemplate.svelte'

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

    $: isTransferring = $selectedAccount?.isTransferring

    async function setStorageDeposit(params: AliasOutputBuilderParams): Promise<void> {
        try {
            const client = await getClient()
            const resp = await client.buildAliasOutput(params)
            storageDeposit = formatTokenAmountPrecise(Number(resp.amount), getBaseToken())
        } catch (err) {
            handleError(err)
        }
    }

    async function onConfirmClick(): Promise<void> {
        try {
            await checkActiveProfileAuthAsync()
        } catch (error) {
            return
        }

        try {
            const networkId = getActiveNetworkId()

            updateSelectedAccount({ isTransferring: true })
            const preparedTransaction = await $selectedAccount.prepareCreateAliasOutput()
            const transaction = await sendPreparedTransaction(preparedTransaction)
            await processAndAddToActivities(transaction, $selectedAccount, networkId)
            closePopup()
        } catch (err) {
            handleError(err)
        } finally {
            updateSelectedAccount({ isTransferring: false })
        }
    }

    function onCancelClick(): void {
        closePopup()
    }
</script>

<PopupTemplate
    title={localize('popups.alias.title')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
        disabled: isTransferring,
    }}
    continueButton={{
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
        disabled: isTransferring,
    }}
    busy={isTransferring}
>
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
                key: localize('general.stateControllerAddress'),
                value: $selectedAccount.depositAddress,
                truncate: { firstCharCount: 10, endCharCount: 10 },
                copyable: true,
            },
        ]}
    />
</PopupTemplate>
