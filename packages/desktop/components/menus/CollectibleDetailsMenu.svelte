<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { openUrlInBrowser } from '@core/app'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { IIrc27Nft, Nft, isIrc27Nft, isNftLocked } from '@core/nfts'
    import { checkActiveProfileAuthAsync } from '@core/profile/actions'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { burnNft } from '@core/wallet'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'

    export let menu: Menu = undefined
    export let nft: Nft

    $: isLocked = isNftLocked(nft)
    $: isBurnDisabled = isLocked || !isIrc27Nft(nft)
    $: isCurrentPfp = $activeProfile.pfp?.id === nft.id

    function onSetPfpClick(): void {
        const pfp = isCurrentPfp ? undefined : structuredClone(nft)
        // It's not possible to store bigint's in stores
        delete (pfp as IIrc27Nft)?.storageDeposit
        updateActiveProfile({ pfp })
        menu?.close()
    }

    function onOpenMediaClick(): void {
        if (nft.composedUrl) {
            openUrlInBrowser(nft.composedUrl)
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
                    try {
                        await checkActiveProfileAuthAsync()
                    } catch (error) {
                        return
                    }

                    try {
                        await burnNft(nft.id)
                        $collectiblesRouter.goTo(CollectiblesRoute.Gallery)
                        closePopup()
                    } catch (error) {
                        handleError(error)
                    }
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
                disabled: !nft.composedUrl,
                onClick: onOpenMediaClick,
            },
            {
                icon: IconName.Trash,
                title: localize('views.collectibles.details.menu.burn'),
                variant: 'danger',
                disabled: isBurnDisabled,
                onClick: openBurnNft,
            },
        ]}
    />
</collectible-details-menu>
