<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { openUrlInBrowser } from '@core/app'
    import { localize } from '@core/i18n'
    import { INft, isNftLocked, rewriteIpfsUri } from '@core/nfts'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { burnNft } from '@core/wallet'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'

    export let menu: Menu = undefined
    export let nft: INft

    $: url = nft?.metadata?.uri && composeUrl(nft.metadata.uri)
    $: isLocked = isNftLocked(nft)
    $: isCurrentPfp = $activeProfile.pfp?.id === nft.id

    function composeUrl(targetUrl: string): string | undefined {
        if (!targetUrl) {
            return undefined
        }
        const url = new URL(targetUrl)

        switch (url.protocol) {
            case 'http:':
                return targetUrl.replace('http:', 'https:')
            case 'https:':
                return targetUrl
            case 'ipfs:':
                return rewriteIpfsUri(targetUrl)
            default:
                return undefined
        }
    }

    function onSetPfpClick(): void {
        updateActiveProfile({
            pfp: isCurrentPfp ? undefined : nft,
        })
        menu?.close()
    }

    function onOpenMediaClick(): void {
        if (url) {
            openUrlInBrowser(url)
        }
        menu?.close()
    }

    function openBurnNft(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                variant: 'danger',
                title: localize('actions.confirmNftBurn.title', {
                    values: {
                        nftName: nft.name,
                    },
                }),
                description: localize('actions.confirmNftBurn.description'),
                alert: { variant: 'warning', text: localize('actions.confirmNftBurn.hint') },
                confirmText: localize('actions.burn'),
                onConfirm: async () => {
                    await checkActiveProfileAuth(
                        async () => {
                            await burnNft(nft.id)
                            $collectiblesRouter.goTo(CollectiblesRoute.Gallery)
                            closePopup()
                        },
                        { stronghold: true }
                    )
                },
            },
        })
        menu?.close()
    }
</script>

<collectible-details-menu>
    <Menu
        bind:this={menu}
        items={[
            {
                icon: isCurrentPfp ? IconName.ImageUserX : IconName.ImageUserCheck,
                title: localize(`views.collectibles.details.menu.${isCurrentPfp ? 'unsetPfp' : 'setPfp'}`),
                onClick: onSetPfpClick,
            },
            {
                icon: IconName.LinkExternal,
                title: localize('views.collectibles.details.menu.view'),
                disabled: !url,
                onClick: onOpenMediaClick,
            },
            {
                icon: IconName.Trash,
                title: localize('views.collectibles.details.menu.burn'),
                variant: 'danger',
                disabled: isLocked,
                onClick: openBurnNft,
            },
        ]}
    />
</collectible-details-menu>
