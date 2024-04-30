<script lang="ts">
    import { Tabs } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import { EvmActivity } from '@core/activity'
    import { EvmActivityType } from '@core/activity/enums/evm'
    import { Nft, NftStandard } from '@core/nfts'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { KeyValue, NftMetadataTable, PopupTab, getTabItems } from '@ui'
    import { EvmGenericInformation, EvmSmartContractInformation } from './info'
    import { localize } from '@core/i18n'

    export let activity: EvmActivity
    export let selectedTab: KeyValue<string> = getTabItems([PopupTab.Transaction])[0]

    let nft: Nft | undefined

    let tabs: KeyValue<string>[] = []
    $: {
        switch (activity.type) {
            case EvmActivityType.CoinTransfer:
                tabs = getTabItems([PopupTab.Transaction])
                break
            case EvmActivityType.TokenTransfer:
            case EvmActivityType.TokenMinting:
            case EvmActivityType.BalanceChange:
                if (
                    activity.tokenTransfer.standard === NftStandard.Erc721 ||
                    activity.tokenTransfer.standard === NftStandard.Irc27
                ) {
                    nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.tokenTransfer.tokenId)
                    tabs = getTabItems([PopupTab.Transaction, PopupTab.NftMetadata])
                } else {
                    tabs = getTabItems([PopupTab.Transaction])
                }
                if (activity.type === EvmActivityType.TokenTransfer || activity.type === EvmActivityType.TokenMinting) {
                    tabs.push({ key: PopupTab.SmartContract, value: localize(`general.${PopupTab.SmartContract}`) })
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
            sourceNetworkId={activity.sourceNetworkId}
            destinationNetworkId={activity.destinationNetworkId}
            maxGasFee={activity.maxGasFee}
            transactionFee={activity.transactionFee}
        />
    {:else if selectedTab.key === PopupTab.NftMetadata && nft}
        <NftMetadataTable {nft} />
    {:else if selectedTab.key === PopupTab.SmartContract && (activity.type === EvmActivityType.ContractCall || activity.type === EvmActivityType.TokenTransfer || activity.type === EvmActivityType.TokenMinting)}
        <EvmSmartContractInformation {activity} />
    {/if}
</activity-details>
