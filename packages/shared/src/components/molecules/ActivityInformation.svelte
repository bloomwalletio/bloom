<script lang="ts">
    import { selectedAccountIndex } from '@core/account/stores'
    import { Activity, ActivityType } from '@core/activity'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import {
        AliasActivityInformation,
        ConsolidationActivityInformation,
        FoundryActivityInformation,
        GenericActivityInformation,
        GovernanceActivityInformation,
        NftActivityInformation,
        NftMetadataInformation,
        SmartContractActivityInformation,
        TokenActivityInformation,
        PopupTab,
        KeyValue,
        getTabItems,
    } from '@ui'
    import { Tabs } from '@bloomwalletio/ui'

    export let activity: Activity
    export let selectedTab: KeyValue<string> = getTabItems([PopupTab.Transaction])[0]

    let hasMetadata = false
    $: {
        const storedNft =
            activity.type === ActivityType.Nft
                ? getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
                : undefined
        hasMetadata = !!storedNft?.rawMetadata
    }

    let tabs: KeyValue<string>[] = []
    $: {
        switch (activity.type) {
            case ActivityType.Basic:
                tabs = getTabItems([PopupTab.Transaction, ...(activity.smartContract ? [PopupTab.SmartContract] : [])])
                break
            case ActivityType.SmartContract:
                tabs = getTabItems([PopupTab.Transaction, PopupTab.SmartContract])
                break
            case ActivityType.Alias:
                tabs = getTabItems([PopupTab.Transaction, PopupTab.Alias])
                break
            case ActivityType.Nft:
                tabs = getTabItems([
                    PopupTab.Transaction,
                    PopupTab.Nft,
                    ...(hasMetadata ? [PopupTab.NftMetadata] : []),
                    ...(activity.smartContract ? [PopupTab.SmartContract] : []),
                ])
                break
            case ActivityType.Foundry:
                tabs = getTabItems([PopupTab.Transaction, PopupTab.Foundry, PopupTab.Token])
                break
            case ActivityType.Consolidation:
            case ActivityType.Governance:
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
        {#if activity.type === ActivityType.Governance}
            <GovernanceActivityInformation {activity} />
        {:else if activity.type === ActivityType.Consolidation}
            <ConsolidationActivityInformation {activity} />
        {:else}
            <GenericActivityInformation {activity} />
        {/if}
    {:else if selectedTab.key === PopupTab.Alias && activity.type === ActivityType.Alias}
        <AliasActivityInformation {activity} />
    {:else if selectedTab.key === PopupTab.Nft && activity.type === ActivityType.Nft}
        <NftActivityInformation {activity} />
    {:else if selectedTab.key === PopupTab.Foundry}
        <FoundryActivityInformation {activity} />
    {:else if selectedTab.key === PopupTab.Token}
        <TokenActivityInformation {activity} />
    {:else if selectedTab.key === PopupTab.NftMetadata && activity.type === ActivityType.Nft}
        <NftMetadataInformation {activity} />
    {:else if selectedTab.key === PopupTab.SmartContract}
        <SmartContractActivityInformation {activity} />
    {/if}
</activity-details>
