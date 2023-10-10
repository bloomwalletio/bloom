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
    } from '@ui'
    import { Tabs } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let activity: Activity
    export let selectedTab: { key: string; value: string } = { key: 'transaction', value: localize('transaction') }

    let hasMetadata = false
    $: {
        const storedNft =
            activity.type === ActivityType.Nft
                ? getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
                : undefined
        hasMetadata = !!storedNft?.metadata
    }

    let tabs: { key: string; value: string }[] = []
    $: {
        switch (activity.type) {
            case ActivityType.Basic:
                tabs = [
                    { key: 'transaction', value: localize('general.transaction') },
                    ...(activity.smartContract
                        ? [{ key: 'smartContract', value: localize('general.transaction') }]
                        : []),
                ]
                break
            case ActivityType.Governance:
                tabs = [{ key: 'transaction', value: localize('general.transaction') }]
                break
            case ActivityType.Consolidation:
                tabs = [{ key: 'transaction', value: localize('general.transaction') }]
                break
            case ActivityType.Alias:
                tabs = [
                    { key: 'transaction', value: localize('general.transaction') },
                    { key: 'alias', value: localize('general.alias') },
                ]
                break
            case ActivityType.Nft:
                tabs = [
                    { key: 'transaction', value: localize('general.transaction') },
                    { key: 'nft', value: localize('general.nft') },
                    ...(hasMetadata ? [{ key: 'nftMetadata', value: localize('general.metadata') }] : []),
                    ...(activity.smartContract
                        ? [{ key: 'smartContract', value: localize('general.smartContract') }]
                        : []),
                ]
                break
            case ActivityType.Foundry:
                tabs = [
                    { key: 'transaction', value: localize('general.transaction') },
                    { key: 'foundry', value: localize('general.foundry') },
                    { key: 'token', value: localize('general.token') },
                ]
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
    {#if selectedTab.key === 'transaction'}
        {#if activity.type === ActivityType.Governance}
            <GovernanceActivityInformation {activity} />
        {:else if activity.type === ActivityType.Consolidation}
            <ConsolidationActivityInformation {activity} />
        {:else}
            <GenericActivityInformation {activity} />
        {/if}
    {:else if selectedTab.key === 'alias' && activity.type === ActivityType.Alias}
        <AliasActivityInformation {activity} />
    {:else if selectedTab.key === 'nft' && activity.type === ActivityType.Nft}
        <NftActivityInformation {activity} />
    {:else if selectedTab.key === 'foundry'}
        <FoundryActivityInformation {activity} />
    {:else if selectedTab.key === 'token'}
        <TokenActivityInformation {activity} />
    {:else if selectedTab.key === 'nftMetadata' && activity.type === ActivityType.Nft}
        <NftMetadataInformation {activity} />
    {:else if selectedTab.key === 'smartContract'}
        <SmartContractActivityInformation {activity} />
    {/if}
</activity-details>
