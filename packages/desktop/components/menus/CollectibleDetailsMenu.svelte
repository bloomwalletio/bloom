<script lang="ts">
    import { openUrlInBrowser } from '@core/app'
    import { time } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { INft, rewriteIpfsUri } from '@core/nfts'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { burnNft } from '@core/wallet'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { MeatballMenuButton, MenuItem, Modal } from '@ui'

    export let modal: Modal = undefined
    export let nft: INft

    $: url = nft?.parsedMetadata?.uri && composeUrl(nft.parsedMetadata.uri)
    $: isLocked = nft.timelockTime > $time.getTime()
    $: isCurrentPfp = $activeProfile.pfp?.id === nft.id

    function openBurnNft(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('actions.confirmNftBurn.title', {
                    values: {
                        nftName: nft.name,
                    },
                }),
                description: localize('actions.confirmNftBurn.description'),
                hint: localize('actions.confirmNftBurn.hint'),
                warning: true,
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
    }

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
    }

    function onOpenMediaClick(): void {
        if (url) {
            openUrlInBrowser(url)
        }
    }
</script>

<collectible-details-menu class="relative">
    <MeatballMenuButton onClick={modal?.toggle} />
    <Modal bind:this={modal} position={{ right: '0' }}>
        <div class="flex flex-col">
            <MenuItem
                icon="receive"
                title={localize('views.collectibles.details.menu.download')}
                disabled={true}
                onClick={() => {}}
            />
            <MenuItem
                icon="profile"
                title={localize(`views.collectibles.details.menu.${isCurrentPfp ? 'unsetPfp' : 'setPfp'}`)}
                onClick={onSetPfpClick}
            />
            <MenuItem
                icon="export"
                title={localize('views.collectibles.details.menu.view')}
                onClick={onOpenMediaClick}
                disabled={!url}
            />
            <MenuItem
                icon="delete"
                title={localize('views.collectibles.details.menu.burn')}
                onClick={openBurnNft}
                disabled={isLocked}
            />
        </div>
    </Modal>
</collectible-details-menu>
