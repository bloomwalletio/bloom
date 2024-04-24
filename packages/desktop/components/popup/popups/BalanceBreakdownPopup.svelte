<script lang="ts">
    import { selectedAccount } from '@core/account/stores'
    import { getStorageDepositFromOutput } from '@core/activity/utils/helper'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { consolidateOutputs } from '@core/wallet/actions/consolidateOutputs'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { CommonOutput, OutputType, UnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
    import { BalanceSummarySection } from '@ui'
    import PopupTemplate from '../PopupTemplate.svelte'

    interface BalanceBreakdown {
        amount: bigint
        subBreakdown?: { [key: string]: bigint }
    }

    enum UnavailableAmountType {
        Unclaimed = 'unclaimed',
        StorageDepositReturn = 'storageDepositReturn',
        Timelock = 'timelock',
    }

    $: accountBalance = $selectedAccount?.balances

    let breakdown: { [key: string]: BalanceBreakdown } = {}
    $: accountBalance, void setBreakdown()
    async function setBreakdown(): Promise<void> {
        const availableBreakdown = getAvailableBreakdown()
        const pendingBreakdown = await getUnavailableBreakdown()
        const storageDepositBreakdown = getStorageDepositBreakdown()

        breakdown = {
            available: availableBreakdown,
            unavailable: pendingBreakdown,
            storageDeposit: storageDepositBreakdown,
        }
    }

    function getAvailableBreakdown(): BalanceBreakdown {
        return { amount: accountBalance?.baseCoin?.available ?? BigInt(0) }
    }

    async function getUnavailableBreakdown(): Promise<BalanceBreakdown> {
        const subBreakdown: { [key: string]: bigint } = {
            unclaimed: BigInt(0),
            storageDepositReturn: BigInt(0),
            timelock: BigInt(0),
            governance: $selectedAccount?.votingPower ?? BigInt(0),
        }

        let unavailableTotalAmount = $selectedAccount?.votingPower ?? BigInt(0)
        for (const [outputId, unlocked] of Object.entries(accountBalance?.potentiallyLockedOutputs ?? {})) {
            if (unlocked) {
                continue
            }

            const output = (await $selectedAccount?.getOutput(outputId))?.output
            if (output?.type === OutputType.Treasury) {
                continue
            }

            let type: string
            let amount: bigint

            const commonOutput = output as CommonOutput
            if (containsUnlockCondition(commonOutput.unlockConditions, UnlockConditionType.Expiration)) {
                type = UnavailableAmountType.Unclaimed
                amount = BigInt(output?.amount ?? 0)
            } else if (
                containsUnlockCondition(commonOutput.unlockConditions, UnlockConditionType.StorageDepositReturn)
            ) {
                type = UnavailableAmountType.StorageDepositReturn
                amount = getStorageDepositFromOutput(commonOutput)
            } else if (containsUnlockCondition(commonOutput.unlockConditions, UnlockConditionType.Timelock)) {
                type = UnavailableAmountType.Timelock
                amount = BigInt(output?.amount ?? 0)
            } else {
                continue
            }

            subBreakdown[type] += amount
            unavailableTotalAmount += amount
        }

        return { amount: unavailableTotalAmount, subBreakdown }
    }

    function getStorageDepositBreakdown(): BalanceBreakdown {
        const storageDeposits = accountBalance?.requiredStorageDeposit
        const totalStorageDeposit = storageDeposits
            ? Object.values(storageDeposits).reduce(
                  (total: bigint, value: string): bigint => total + BigInt(value ?? 0),
                  BigInt(0)
              )
            : BigInt(0)

        const subBreakdown = {
            basicOutputs: storageDeposits?.basic ?? BigInt(0),
            nftOutputs: storageDeposits?.nft ?? BigInt(0),
            aliasOutputs: storageDeposits?.alias ?? BigInt(0),
            foundryOutputs: storageDeposits?.foundry ?? BigInt(0),
        }

        return { amount: totalStorageDeposit, subBreakdown }
    }

    function containsUnlockCondition(unlockConditions: UnlockCondition[], type: UnlockConditionType) {
        return unlockConditions.some((unlockCondition) => unlockCondition.type === type)
    }

    function onConsolidationClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('popups.minimizeStorageDeposit.title'),
                description: localize('popups.minimizeStorageDeposit.description'),
                confirmText: localize('popups.minimizeStorageDeposit.confirmButton'),
                onConfirm: async () => {
                    try {
                        await checkActiveProfileAuth()
                    } catch (err) {
                        return
                    }

                    await consolidateOutputs()
                    closePopup()
                },
            },
        })
    }

    let currentExpandedSection: string
    const expanded: { [key: string]: boolean } = {}
    function expandOne(breakdownKey: string): void {
        if (currentExpandedSection === breakdownKey) {
            expanded[currentExpandedSection] = false
            currentExpandedSection = ''
        } else {
            expanded[currentExpandedSection] = false
            expanded[breakdownKey] = true
            currentExpandedSection = breakdownKey
        }
    }
</script>

<PopupTemplate
    title={localize('popups.balanceBreakdown.title')}
    continueButton={{
        text: localize('popups.balanceBreakdown.minimizeStorageDepositButton'),
        onClick: onConsolidationClick,
    }}
>
    <div class="flex flex-col space-y-1">
        {#each Object.keys(breakdown) as breakdownKey}
            <BalanceSummarySection
                titleKey={breakdownKey}
                subtitleKey={breakdownKey}
                amount={breakdown[breakdownKey].amount}
                subBreakdown={breakdown[breakdownKey].subBreakdown}
                expanded={expanded[breakdownKey]}
                onClick={() => expandOne(breakdownKey)}
            />
        {/each}
        <BalanceSummarySection titleKey="totalBalance" amount={accountBalance?.baseCoin?.total ?? BigInt(0)} bold />
    </div>
</PopupTemplate>
