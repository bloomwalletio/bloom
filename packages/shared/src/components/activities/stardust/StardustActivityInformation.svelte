<script lang="ts">
    import { selectedAccountIndex } from '@core/account/stores'
    import { StardustActivity, StardustActivityType } from '@core/activity'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import {
        StardustAliasInformation,
        StardustConsolidationInformation,
        StardustFoundryInformation,
        StardustGenericInformation,
        StardustGovernanceInformation,
        StardustNftInformation,
        StardustNftMetadataInformation,
        StardustSmartContractInformation,
        StardustTokenInformation,
    } from './info'
    import { Tabs } from '@bloomwalletio/ui'
    import { getTabItems, KeyValue, PopupTab } from '@ui'

    export let activity: StardustActivity
    export let selectedTab: KeyValue<string> = getTabItems([PopupTab.Transaction])[0]

    let hasMetadata = false
    $: {
        const storedNft =
            activity.type === StardustActivityType.Nft
                ? getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
                : undefined
        hasMetadata = !!storedNft?.metadata
    }

    let tabs: KeyValue<string>[] = []
    $: {
        switch (activity.type) {
            case StardustActivityType.Basic:
                tabs = getTabItems([PopupTab.Transaction, ...(activity.smartContract ? [PopupTab.SmartContract] : [])])
                break
            case StardustActivityType.SmartContract:
                tabs = getTabItems([PopupTab.Transaction, PopupTab.SmartContract])
                break
            case StardustActivityType.Alias:
                tabs = getTabItems([PopupTab.Transaction, PopupTab.Alias])
                break
            case StardustActivityType.Nft:
                tabs = getTabItems([
                    PopupTab.Transaction,
                    PopupTab.Nft,
                    ...(hasMetadata ? [PopupTab.NftMetadata] : []),
                    ...(activity.smartContract ? [PopupTab.SmartContract] : []),
                ])
                break
            case StardustActivityType.Foundry:
                tabs = getTabItems([PopupTab.Transaction, PopupTab.Foundry, PopupTab.Token])
                break
            case StardustActivityType.Consolidation:
            case StardustActivityType.Governance:
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
        {#if activity.type === StardustActivityType.Governance}
            <StardustGovernanceInformation {activity} />
        {:else if activity.type === StardustActivityType.Consolidation}
            <StardustConsolidationInformation {activity} />
        {:else}
            <StardustGenericInformation {activity} />
        {/if}
    {:else if selectedTab.key === PopupTab.Alias && activity.type === StardustActivityType.Alias}
        <StardustAliasInformation {activity} />
    {:else if selectedTab.key === PopupTab.Nft && activity.type === StardustActivityType.Nft}
        <StardustNftInformation {activity} />
    {:else if selectedTab.key === PopupTab.Foundry && activity.type === StardustActivityType.Foundry}
        <StardustFoundryInformation {activity} />
    {:else if selectedTab.key === PopupTab.Token && activity.type === StardustActivityType.Foundry}
        <StardustTokenInformation {activity} />
    {:else if selectedTab.key === PopupTab.NftMetadata && activity.type === StardustActivityType.Nft}
        <StardustNftMetadataInformation {activity} />
    {:else if selectedTab.key === PopupTab.SmartContract}
        <StardustSmartContractInformation {activity} />
    {/if}
</activity-details>
