<script lang="ts">
    import { AccountActionsButton } from '@components'
    import { localize } from '@core/i18n'
    import { nodeInfo } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { selectedAccountAssets } from '@core/wallet'
    import { Text, TogglableAssetBalanceLabel } from '@ui'
    import { TextType } from '@ui/enums'

    $: fomattedNetworkName = $nodeInfo?.protocol.networkName
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(' ')

    $: ({ baseCoin } = $selectedAccountAssets[$activeProfile?.network.id])
</script>

<account-summary class="block relative p-6 space-y-4">
    <div class="flex flex-row items-center justify-between">
        <Text type={TextType.h5} classes="text-left">
            {localize('general.balanceWithNetwork', { values: { network: fomattedNetworkName } })}
        </Text>
        <AccountActionsButton />
    </div>
    <div class="flex flex-col flex-wrap items-start space-y-1">
        <TogglableAssetBalanceLabel asset={baseCoin} />
    </div>
</account-summary>
