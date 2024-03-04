<script lang="ts">
    import { localize } from '@core/i18n'
    import { Pill } from '@bloomwalletio/ui'
    import { StardustActivity, StardustActivityType } from '@core/activity'
    import { getTokenFromActivity } from '@core/activity/utils/getTokenFromActivity'
    import { BASE_TOKEN_ID } from '@core/token'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { selectedAccountIndex } from '@core/account/stores'

    export let activity: StardustActivity

    let typePill = ''
    let standardPill = ''

    $: activity, setPills()
    function setPills() {
        if (activity.type === StardustActivityType.Basic) {
            if (activity.tokenTransfer && activity.tokenTransfer?.tokenId !== BASE_TOKEN_ID) {
                const token = getTokenFromActivity(activity)
                typePill = 'token'
                standardPill = token.standard
            } else {
                typePill = 'baseCoin'
                standardPill = ''
            }
        } else if (activity.type === StardustActivityType.Nft) {
            const nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
            standardPill = nft?.standard ?? ''
            typePill = 'nft'
        } else if (activity.type === StardustActivityType.SmartContract) {
            typePill = 'unverifiedContract'
            standardPill = ''
        } else if (activity.type === StardustActivityType.Alias) {
            typePill = 'alias'
            standardPill = ''
        } else if (activity.type === StardustActivityType.Foundry) {
            const token = getTokenFromActivity(activity)
            typePill = 'foundry'
            standardPill = token?.standard ?? ''
        } else if (activity.type === StardustActivityType.Governance) {
            typePill = 'governance'
            standardPill = ''
        } else {
            typePill = ''
            standardPill = ''
        }
    }
</script>

{#if typePill || standardPill}
    <div class="flex flex-row gap-2">
        {#if typePill}
            <Pill color="neutral" compact>
                {localize(`general.${typePill}`)}
            </Pill>
        {/if}
        {#if standardPill}
            <Pill color="neutral" compact>
                {standardPill}
            </Pill>
        {/if}
    </div>
{/if}
