<script lang="ts">
    import { onMount } from 'svelte'
    import { plainToInstance } from 'class-transformer'
    import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
    import { processAndAddToActivities } from '@core/activity/utils'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth, getBaseToken } from '@core/profile/actions'
    import { EMPTY_HEX_ID } from '@core/wallet'
    import {
        AliasOutputBuilderParams,
        Ed25519Address,
        GovernorAddressUnlockCondition,
        PreparedTransaction,
        StateControllerAddressUnlockCondition,
    } from '@iota/sdk/out/types'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { Button, FontWeight, KeyValueBox, Text, TextType } from '@ui'
    import { api, getClient } from '@core/profile-manager'
    import { formatTokenAmountPrecise } from '@core/token'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let storageDeposit: string = '0'

    const address = new Ed25519Address(api.bech32ToHex($selectedAccount.depositAddress))

    const aliasOutputParams: AliasOutputBuilderParams = {
        aliasId: EMPTY_HEX_ID,
        amount: '100000',
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
            updateSelectedAccount({ isTransferring: true })
            const preparedTransaction = await $selectedAccount.prepareCreateAliasOutput()
            const transaction = await plainToInstance(PreparedTransaction, preparedTransaction).send()
            await processAndAddToActivities(transaction, $selectedAccount)
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
        <KeyValueBox
            keyText={localize('general.storageDeposit')}
            valueText={storageDeposit}
            tooltipText={localize('tooltips.transactionDetails.incoming.storageDeposit')}
        />
        <KeyValueBox
            keyText={localize('general.governorAddress')}
            valueText={$selectedAccount.depositAddress}
            isCopyable
        />
        <KeyValueBox
            keyText={localize('general.stateControllerAddress')}
            valueText={$selectedAccount.depositAddress}
            isCopyable
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
