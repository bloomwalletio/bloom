<script lang="ts">
    import { localize } from '@core/i18n'
    import { Pill } from '@bloomwalletio/ui'
    import { Activity, StardustActivityType, isEvmTokenActivity } from '@core/activity'
    import { getTokenFromActivity } from '@core/activity/utils/getTokenFromActivity'
    import { BASE_TOKEN_ID } from '@core/token'
    import { getNftByIdForAccount } from '@core/nfts/stores'
    import { selectedAccountIndex } from '@core/account/stores'
    import { NetworkNamespace } from '@core/network/enums'
    import { EvmActivityType } from '@core/activity/enums/evm'
    import { NftStandard } from '@core/nfts/enums'
    import { convertCamelCaseToPhrase } from '@core/utils/string'
    import { ConfirmationPill } from '@ui'

    export let activity: Activity

    let typePill = ''
    let standardPill = ''

    $: activity, setPills()
    function setPills(): void {
        if (activity.namespace === NetworkNamespace.Stardust) {
            if (activity.type === StardustActivityType.Basic) {
                if (activity.tokenTransfer && activity.tokenTransfer?.tokenId !== BASE_TOKEN_ID) {
                    const token = getTokenFromActivity(activity)
                    typePill = 'token'
                    standardPill = token?.standard ?? ''
                } else {
                    typePill = 'baseCoin'
                    standardPill = ''
                }
            } else if (activity.type === StardustActivityType.Nft) {
                const nft = getNftByIdForAccount($selectedAccountIndex, activity.nftId)
                standardPill = nft?.standard ?? ''
                typePill = 'nft'
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
        } else if (activity.namespace === NetworkNamespace.Evm) {
            if (activity.type === EvmActivityType.CoinTransfer) {
                typePill = 'baseCoin'
                standardPill = ''
            } else if (isEvmTokenActivity(activity)) {
                const standard = activity.tokenTransfer.standard
                standardPill = standard
                typePill = standard === NftStandard.Erc721 || standard === NftStandard.Irc27 ? 'nft' : 'token'
            } else if (activity.type === EvmActivityType.ContractCall) {
                typePill = ''
                standardPill = convertCamelCaseToPhrase(activity.method ?? '')
            } else {
                typePill = ''
                standardPill = ''
            }
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
        {#if activity.namespace === NetworkNamespace.Evm}
            <ConfirmationPill {activity} />
        {/if}
    </div>
{/if}
