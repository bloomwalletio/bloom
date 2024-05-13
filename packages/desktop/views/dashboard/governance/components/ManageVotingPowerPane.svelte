<script lang="ts">
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import { formatTokenAmount } from '@core/token'
    import { visibleSelectedAccountTokens } from '@core/token/stores'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { Button, Text } from '@bloomwalletio/ui'
    import { Pane } from '@ui'
    import { ManageVotingPowerMenu } from './'

    const token = $visibleSelectedAccountTokens?.[$activeProfile?.network.id]?.baseCoin

    $: votingPower = $selectedAccount?.votingPower
    $: maxVotingPower = $selectedAccount?.balances?.baseCoin?.available + votingPower
    $: formattedVotingPower = formatTokenAmount(votingPower, token?.metadata)
    $: formattedMaxVotingPower = formatTokenAmount(maxVotingPower, token?.metadata)
    $: hasTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress ||
        $selectedAccount?.hasVotingTransactionInProgress ||
        $selectedAccount?.isTransferring

    function onManageVotingPowerClick(): void {
        openPopup({
            id: PopupId.ManageVotingPower,
        })
    }
</script>

<Pane classes="p-6 h-fit space-y-4">
    <div class="flex justify-between items-center relative">
        <Text type="sm" textColor="secondary">
            {localize('views.governance.votingPower.title')}
        </Text>
        <ManageVotingPowerMenu />
    </div>
    <div class="flex-col space-y-1">
        <Text type="h2">{formattedVotingPower}</Text>
        <Text textColor="secondary">
            {localize('views.governance.votingPower.maximal', { values: { value: formattedMaxVotingPower } })}
        </Text>
    </div>
    <Button
        on:click={onManageVotingPowerClick}
        width="full"
        disabled={hasTransactionInProgress}
        busy={hasTransactionInProgress}
        text={localize('views.governance.votingPower.manage')}
    />
</Pane>
