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
        amount: number
        subBreakdown?: { [key: string]: number }
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
        return { amount: Number(accountBalance?.baseCoin?.available ?? 0) }
    }

    async function getUnavailableBreakdown(): Promise<BalanceBreakdown> {
        const governanceAmount = parseInt($selectedAccount?.votingPower, 10)

        let unavailableTotalAmount = governanceAmount
        const subBreakdown: { [key: string]: number } = {
            unclaimed: 0,
            storageDepositReturn: 0,
            timelock: 0,
            governance: governanceAmount,
        }
        for (const [outputId, unlocked] of Object.entries(accountBalance?.potentiallyLockedOutputs ?? {})) {
            if (!unlocked) {
                const output = (await $selectedAccount.getOutput(outputId)).output

                let type: string
                let amount: number
                if (output.type !== OutputType.Treasury) {
                    const commonOutput = output as CommonOutput
                    if (containsUnlockCondition(commonOutput.unlockConditions, UnlockConditionType.Expiration)) {
                        type = UnavailableAmountType.Unclaimed
                        amount = Number(output.amount)
                    } else if (
                        containsUnlockCondition(commonOutput.unlockConditions, UnlockConditionType.StorageDepositReturn)
                    ) {
                        type = UnavailableAmountType.StorageDepositReturn
                        amount = getStorageDepositFromOutput(commonOutput)
                    } else if (containsUnlockCondition(commonOutput.unlockConditions, UnlockConditionType.Timelock)) {
                        type = UnavailableAmountType.Timelock
                        amount = Number(output.amount)
                    }
                }

                subBreakdown[type] += amount
                unavailableTotalAmount += amount
            }
        }

        return { amount: unavailableTotalAmount, subBreakdown }
    }

    function getStorageDepositBreakdown(): BalanceBreakdown {
        const storageDeposits = accountBalance?.requiredStorageDeposit
        const totalStorageDeposit = storageDeposits
            ? Object.values(accountBalance.requiredStorageDeposit).reduce(
                  (total: number, value: string): number => total + Number(value ?? 0),
                  0
              )
            : 0

        const subBreakdown = {
            basicOutputs: Number(storageDeposits?.basic ?? 0),
            nftOutputs: Number(storageDeposits?.nft ?? 0),
            aliasOutputs: Number(storageDeposits?.alias ?? 0),
            foundryOutputs: Number(storageDeposits?.foundry ?? 0),
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
                    await checkActiveProfileAuth(
                        async () => {
                            await consolidateOutputs()
                            closePopup()
                        },
                        { stronghold: true }
                    )
                },
            },
        })
    }

    let currentExpandedSection: string
    const expanded: { [key: string]: boolean } = {}
    function expandOne(breakdownKey) {
        if (currentExpandedSection === breakdownKey) {
            expanded[currentExpandedSection] = false
            currentExpandedSection = undefined
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
        <BalanceSummarySection titleKey="totalBalance" amount={Number(accountBalance?.baseCoin?.total ?? 0)} bold />
    </div>
</PopupTemplate>
