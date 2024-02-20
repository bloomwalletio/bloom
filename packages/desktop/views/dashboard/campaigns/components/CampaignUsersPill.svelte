<script lang="ts">
    import { Icon, IconName, Pill } from '@bloomwalletio/ui'
    import { ICampaign, campaignLeaderboards } from '@contexts/campaigns'

    export let campaign: ICampaign

    $: ({ totalUsers } = $campaignLeaderboards[campaign.projectId]?.[campaign.id] ?? { totalUsers: 0 })
</script>

{#if totalUsers}
    <Pill color="neutral" compact>
        <div class="flex flex-row space-x-1 items-center">
            <Icon size="xxs" customColor="neutral" name={IconName.Users} />
            <div>
                {totalUsers}
            </div>
        </div>
    </Pill>
{/if}
