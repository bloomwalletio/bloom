<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { openUrlInBrowser } from '@core/app'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { isEvmNetwork } from '@core/network'
    import { IIrc27Nft, Nft, getPrimaryNftUrl, isNftLocked, isValidNftUri } from '@core/nfts'
    import { updateNftInAllAccountNfts } from '@core/nfts/actions'
    import { updatePersistedNft } from '@core/nfts/stores'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { burnNft } from '@core/wallet'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'

    export let menu: Menu = undefined
    export let nft: Nft

    $: isLocked = isNftLocked(nft)
    $: isBurnDisabled = isLocked || isEvmNetwork(nft.networkId)
    $: isCurrentPfp = $activeProfile.pfp?.id === nft.id

    function onSetPfpClick(): void {
        const pfp = isCurrentPfp ? undefined : structuredClone(nft)
        // It's not possible to store bigint's in stores
        delete (pfp as IIrc27Nft)?.storageDeposit
        updateActiveProfile({ pfp })
        menu?.close()
    }

    function onOpenMediaClick(): void {
        openUrlInBrowser(getPrimaryNftUrl(nft?.mediaUrl))
        menu?.close()
    }

    function onHideClick(): void {
        updatePersistedNft(nft.id, { hidden: !nft.hidden })
        updateNftInAllAccountNfts(nft.id, { hidden: !nft.hidden })
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
                        await checkActiveProfileAuth()
                    } catch {
                        return
                    }

                    try {
                        await burnNft(nft.id)
                        $collectiblesRouter?.goTo(CollectiblesRoute.Gallery)
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
                disabled: !isValidNftUri(nft.mediaUrl),
                onClick: onOpenMediaClick,
            },
            {
                icon: nft.hidden ? IconName.Eye : IconName.EyeOff,
                title: localize(`views.collectibles.details.menu.${nft.hidden ? 'unhide' : 'hide'}`),
                onClick: onHideClick,
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
