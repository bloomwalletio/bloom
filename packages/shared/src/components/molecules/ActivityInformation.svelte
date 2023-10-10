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
        Tab,
        KeyValue,
        getTabItems,
    } from '@ui'
    import { Tabs } from '@bloomwalletio/ui'

    export let activity: Activity
    export let selectedTab: KeyValue<string> = getTabItems([Tab.Transaction])[0]

    let hasMetadata = false
    $: {
        const storedNft =
            activity.type === ActivityType.Nft
                ? getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
                : undefined
        hasMetadata = !!storedNft?.metadata
    }

    let tabs: KeyValue<string>[] = []
    $: {
        switch (activity.type) {
            case ActivityType.Basic:
                tabs = getTabItems([Tab.Transaction, ...(activity.smartContract ? [Tab.SmartContract] : [])])
                break
            case ActivityType.Alias:
                tabs = getTabItems([Tab.Transaction, Tab.Alias])
                break
            case ActivityType.Nft:
                tabs = getTabItems([
                    Tab.Transaction,
                    Tab.Nft,
                    ...(hasMetadata ? [Tab.NftMetadata] : []),
                    ...(activity.smartContract ? [Tab.SmartContract] : []),
                ])
                break
            case ActivityType.Foundry:
                tabs = getTabItems([Tab.Transaction, Tab.Foundry, Tab.Token])
                break
            case ActivityType.Consolidation:
            case ActivityType.Governance:
            default:
                tabs = getTabItems([Tab.Transaction])
                break
        }
    }
</script>

<activity-details class="w-full h-full space-y-2 flex flex-auto flex-col shrink-0">
    {#if tabs.length > 1}
        <div class="flex">
            <Tabs bind:selectedTab {tabs} />
        </div>
    {/if}
    {#if selectedTab.key === Tab.Transaction}
        {#if activity.type === ActivityType.Governance}
            <GovernanceActivityInformation {activity} />
        {:else if activity.type === ActivityType.Consolidation}
            <ConsolidationActivityInformation {activity} />
        {:else}
            <GenericActivityInformation {activity} />
        {/if}
    {:else if selectedTab.key === Tab.Alias && activity.type === ActivityType.Alias}
        <AliasActivityInformation {activity} />
    {:else if selectedTab.key === Tab.Nft && activity.type === ActivityType.Nft}
        <NftActivityInformation {activity} />
    {:else if selectedTab.key === Tab.Foundry}
        <FoundryActivityInformation {activity} />
    {:else if selectedTab.key === Tab.Token}
        <TokenActivityInformation {activity} />
    {:else if selectedTab.key === Tab.NftMetadata && activity.type === ActivityType.Nft}
        <NftMetadataInformation {activity} />
    {:else if selectedTab.key === Tab.SmartContract}
        <SmartContractActivityInformation {activity} />
    {/if}
</activity-details>
