<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
    import { processAndAddToActivities } from '@core/activity/utils'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { network } from '@core/network/stores'
    import { checkActiveProfileAuth, getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountPrecise } from '@core/token'
    import {
        EMPTY_HEX_ID,
        UNLOCK_CONDITION_GOVERNOR_ADDRESS,
        UNLOCK_CONDITION_STATE_CONTROLLER_ADDRESS,
        convertBech32ToHexAddress,
    } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { Button, FontWeight, Text, TextType } from '@ui'
    import { onMount } from 'svelte'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let storageDeposit: string = '0'

    $: address = {
        type: 0,
        pubKeyHash: convertBech32ToHexAddress($selectedAccount.depositAddress),
    }
    $: aliasOutput = address
        ? {
              aliasId: EMPTY_HEX_ID,
              unlockConditions: [
                  {
                      type: UNLOCK_CONDITION_GOVERNOR_ADDRESS,
                      address,
                  },
                  {
                      type: UNLOCK_CONDITION_STATE_CONTROLLER_ADDRESS,
                      address,
                  },
              ],
          }
        : ''

    $: void setStorageDeposit(aliasOutput)
    $: isTransferring = $selectedAccount.isTransferring

    async function setStorageDeposit(aliasOutput): Promise<void> {
        try {
            const { amount } = await $selectedAccount.buildAliasOutput(aliasOutput)
            storageDeposit = formatTokenAmountPrecise(Number(amount), getBaseToken())
        } catch (err) {
            handleError(err)
        }
    }

    async function createAlias(): Promise<void> {
        try {
            const account = $selectedAccount
            const networkId = $network?.getMetadata()?.id
            if (!account || !networkId) {
                throw new Error(localize('error.global.accountOrNetworkUndefined'))
            }

            updateSelectedAccount({ isTransferring: true })
            const transaction = await account.createAliasOutput()
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
                    popover: { content: localize('tooltips.transactionDetails.incoming.storageDeposit') },
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
