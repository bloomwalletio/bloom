<script lang="ts">
    import { Pill, Icon, IconName } from '@bloomwalletio/ui'
    import { ICampaign } from '@contexts/campaigns'

    export let campaign: ICampaign
</script>

<Pill color="neutral" compact>
    <div class="flex flex-row space-x-1 items-center">
        <Icon size="xxs" customColor="neutral" name={IconName.Users} />
        <div>
            {campaign.participants ?? 0}
        </div>
    </div>
</Pill>
