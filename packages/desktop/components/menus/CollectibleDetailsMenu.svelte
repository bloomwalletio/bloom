<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { openUrlInBrowser } from '@core/app'
    import { localize } from '@core/i18n'
    import { isEvmNetwork } from '@core/network'
    import { IIrc27Nft, Nft, getPrimaryNftUrl, isNftLocked, isValidNftUri } from '@core/nfts'
    import { addNftsToDownloadQueue, updateNftInAllAccountNfts } from '@core/nfts/actions'
    import { updatePersistedNft } from '@core/nfts/stores'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'
    import { Platform } from '@core/app'

    export let menu: Menu | undefined = undefined
    export let nft: Nft
    export let burnNft: () => void

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

    async function onRefreshClick(): Promise<void> {
        if (nft.downloadMetadata?.filePath) {
            await Platform.deleteFile(nft.downloadMetadata?.filePath)
        }

        updatePersistedNft(nft.id, { downloadMetadata: {} })
        updateNftInAllAccountNfts(nft.id, { downloadMetadata: {}, isLoaded: false })
        addNftsToDownloadQueue([nft])
        menu?.close()
    }

    function onHideClick(): void {
        updatePersistedNft(nft.id, { hidden: !nft.hidden })
        updateNftInAllAccountNfts(nft.id, { hidden: !nft.hidden })
        menu?.close()
    }

    function onBurnNft(): void {
        burnNft()
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
                icon: IconName.Refresh,
                title: localize('views.collectibles.details.menu.refresh'),
                onClick: () => void onRefreshClick(),
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
                onClick: onBurnNft,
            },
        ]}
    />
</collectible-details-menu>
