<script lang="ts">
    import { Link } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import { EvmActivity, getActivityDetailsTitle, isEvmTokenActivity } from '@core/activity'
    import { EvmActivityType } from '@core/activity/enums/evm'
    import { openUrlInBrowser } from '@core/app'
    import { localize } from '@core/i18n'
    import { ExplorerEndpoint } from '@core/network'
    import { getDefaultExplorerUrl } from '@core/network/utils'
    import { NftStandard } from '@core/nfts'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { Nft } from '@core/nfts/interfaces'
    import { ownedNfts, selectedNftId } from '@core/nfts/stores'
    import { CollectiblesRoute, DashboardRoute, collectiblesRouter, dashboardRouter } from '@core/router'
    import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
    import { buildUrl, setClipboard, truncateString } from '@core/utils'
    import { TokenTransferData } from '@core/wallet/types'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { EvmActivityInformation, TransactionAssetSection } from '@ui'
    import { tick } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let activity: EvmActivity

    $: nftIsOwned = nft ? $ownedNfts.some((_onMountnft) => _onMountnft.id === nft?.id) : false

    let title: string = localize('popups.activityDetails.title.fallback')
    $: void setTitle(activity)
    async function setTitle(_activity: EvmActivity | undefined): Promise<void> {
        if (_activity) {
            title = await getActivityDetailsTitle(_activity)
        }
    }

    $: explorerUrl = getExplorerUrl(activity)
    function getExplorerUrl(_activity: EvmActivity): string | undefined {
        const { baseUrl, endpoint } = getDefaultExplorerUrl(activity?.sourceNetworkId, ExplorerEndpoint.Transaction)
        return buildUrl({ origin: baseUrl, pathname: `${endpoint}/${_activity?.transactionId}` })?.href
    }

    $: nft = getNft(activity)
    function getNft(_activity: EvmActivity): Nft | undefined {
        if (isEvmTokenActivity(_activity)) {
            if (
                _activity.tokenTransfer.standard === NftStandard.Erc721 ||
                _activity.tokenTransfer.standard === NftStandard.Irc27
            ) {
                return getNftByIdFromAllAccountNfts($selectedAccountIndex, _activity.tokenTransfer.tokenId) as Nft
            }
        }
    }

    $: transactionAssets = getTransactionAssets(activity)
    function getTransactionAssets(_activity: EvmActivity):
        | {
              nft?: Nft
              tokenTransfer?: TokenTransferData
              baseCoinTransfer?: TokenTransferData
          }
        | undefined {
        if (isEvmTokenActivity(_activity)) {
            const { tokenId, rawAmount, standard } = _activity.tokenTransfer
            if (standard === NftStandard.Erc721 || standard === NftStandard.Irc27) {
                return {
                    nft: getNftByIdFromAllAccountNfts($selectedAccountIndex, _activity.tokenTransfer.tokenId) as Nft,
                }
            } else {
                const token = getTokenFromSelectedAccountTokens(tokenId, _activity.sourceNetworkId)
                return {
                    tokenTransfer: {
                        token,
                        rawAmount,
                    },
                }
            }
        } else if (_activity.type === EvmActivityType.CoinTransfer) {
            const { tokenId, rawAmount } = _activity.baseTokenTransfer
            const token = getTokenFromSelectedAccountTokens(tokenId, _activity.sourceNetworkId)
            return {
                baseCoinTransfer: {
                    token,
                    rawAmount,
                },
            }
        }
    }

    async function onNftClick(): Promise<void> {
        closePopup()
        $selectedNftId = nft?.id
        $dashboardRouter?.goTo(DashboardRoute.Collectibles)
        await tick()
        $collectiblesRouter?.goTo(CollectiblesRoute.Details)
        $collectiblesRouter?.setBreadcrumb(nft?.name)
    }
</script>

{#if activity}
    <PopupTemplate {title}>
        <div slot="description" class="flex">
            {#if explorerUrl}
                <Link
                    text={localize('general.viewOnExplorer')}
                    external
                    on:click={() => openUrlInBrowser(explorerUrl)}
                />
            {:else if activity.transactionId}
                <Link
                    text={truncateString(activity.transactionId, 12, 12)}
                    on:click={() => setClipboard(activity.transactionId ?? '')}
                />
            {/if}
        </div>
        <activity-details class="w-full h-full space-y-5 flex flex-auto flex-col shrink-0">
            <TransactionAssetSection {...transactionAssets} onNftClick={nftIsOwned ? onNftClick : undefined} />
            <EvmActivityInformation {activity} />
        </activity-details>
    </PopupTemplate>
{/if}
