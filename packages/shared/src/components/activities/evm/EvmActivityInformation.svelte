<script lang="ts">
    import { selectedAccountIndex } from '@core/account/stores'
    import { EvmActivity } from '@core/activity'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import {
        EvmGenericInformation,
        EvmSmartContractInformation,
        EvmNftMetadataInformation,
        EvmTokenInformation,
    } from './info'
    import { getTabItems, KeyValue, PopupTab } from '@ui'
    import { EvmActivityType } from '@core/activity/enums/evm'
    import { Nft, NftStandard } from '@core/nfts'
    import { getPersistedToken } from '@core/token/stores'
    import { TokenMetadata } from '@core/token/types'
    import { Tabs } from '@bloomwalletio/ui'

    export let activity: EvmActivity
    export let selectedTab: KeyValue<string> = getTabItems([PopupTab.Transaction])[0]

    let nft: Nft | undefined
    let token: TokenMetadata | undefined

    let tabs: KeyValue<string>[] = []
    $: {
        switch (activity.type) {
            case EvmActivityType.CoinTransfer:
                tabs = getTabItems([PopupTab.Transaction])
                break
            case EvmActivityType.TokenTransfer:
            case EvmActivityType.BalanceChange:
                if (
                    activity.tokenTransfer.standard === NftStandard.Erc721 ||
                    activity.tokenTransfer.standard === NftStandard.Irc27
                ) {
                    nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.tokenTransfer.tokenId)
                    tabs = getTabItems([PopupTab.Transaction, PopupTab.NftMetadata])
                } else {
                    token = getPersistedToken(activity.tokenTransfer.tokenId)?.metadata
                    tabs = getTabItems([PopupTab.Transaction, PopupTab.Token])
                }
                break
            case EvmActivityType.ContractCall:
                tabs = getTabItems([PopupTab.Transaction, PopupTab.SmartContract])
                break
            default:
                tabs = getTabItems([PopupTab.Transaction])
                break
        }
    }
</script>

<activity-details class="w-full h-full space-y-2 flex flex-auto flex-col shrink-0">
    {#if tabs.length > 1}
        <Tabs bind:selectedTab {tabs} />
    {/if}
    {#if selectedTab.key === PopupTab.Transaction}
        <EvmGenericInformation
            time={activity.time}
            destinationNetworkId={activity.destinationNetworkId}
            maxGasFee={activity.maxGasFee}
            transactionFee={activity.transactionFee}
        />
    {:else if selectedTab.key === PopupTab.Token && token}
        <EvmTokenInformation {token} />
    {:else if selectedTab.key === PopupTab.NftMetadata && nft}
        <EvmNftMetadataInformation {nft} />
    {:else if selectedTab.key === PopupTab.SmartContract && activity.type === EvmActivityType.ContractCall}
        <EvmSmartContractInformation {activity} />
    {/if}
</activity-details>
