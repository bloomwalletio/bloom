<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        hideAsset,
        IAsset,
        unhideAsset,
        unverifyAsset,
        verifyAsset,
        hideActivitiesForHiddenAssets,
        NotVerifiedStatus,
        VerifiedStatus,
        removeTokenFromActiveProfileTrackedTokens,
    } from '@core/wallet'
    import { Icon } from '@lib/auxiliary/icon'
    import { closePopup, openPopup, PopupId, updatePopupProps } from '../../../../desktop/lib/auxiliary/popup'
    import { MenuItem, Modal } from '@ui'
    import features from '@features/features'

    import { getActiveProfilePersistedTrackedTokensByAccountIndex } from '@core/profile/stores'
    import { selectedAccountIndex } from '@core/account/stores'

    export let modal: Modal = undefined
    export let asset: IAsset

    $: isTrackedToken = getActiveProfilePersistedTrackedTokensByAccountIndex($selectedAccountIndex)[
        asset?.chainId
    ]?.includes(asset?.id)

    function onUntrackTokenClick(): void {
        removeTokenFromActiveProfileTrackedTokens(asset?.id, asset?.chainId)
        modal.close()
        closePopup()
    }

    function onUnverifyClick(): void {
        unverifyAsset(asset.id, NotVerifiedStatus.Skipped)
        updatePopupProps({
            asset: { ...asset, verification: { verified: false, status: NotVerifiedStatus.Skipped } },
        })
        modal.close()
    }

    function onVerifyClick(): void {
        verifyAsset(asset.id, VerifiedStatus.SelfVerified)
        updatePopupProps({
            asset: { ...asset, verification: { verified: true, status: VerifiedStatus.SelfVerified } },
        })
        modal.close()
    }

    function onUnhideClick(): void {
        unhideAsset(asset.id)
        hideActivitiesForHiddenAssets()
        updatePopupProps({
            asset: { ...asset, hidden: false },
        })
        modal.close()
    }

    function onHideClick(): void {
        hideAsset(asset.id)
        hideActivitiesForHiddenAssets()
        updatePopupProps({
            asset: { ...asset, hidden: true },
        })
        modal.close()
    }

    function onBurnTokenClick(): void {
        modal.close()
        openPopup({ id: PopupId.BurnNativeTokens, props: { asset } })
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <div class="flex flex-col">
        {#if isTrackedToken}
            <MenuItem icon={Icon.Search} title={localize('actions.untrackToken')} onClick={onUntrackTokenClick} />
        {/if}
        {#if asset?.verification?.status === VerifiedStatus.SelfVerified}
            <MenuItem
                icon={Icon.NotVerified}
                iconProps={{ secondaryColor: 'white' }}
                title={localize('actions.unverifyToken')}
                onClick={onUnverifyClick}
            />
        {:else}
            <MenuItem
                icon={Icon.NotVerified}
                iconProps={{ secondaryColor: 'white' }}
                title={localize('actions.verifyToken')}
                onClick={onVerifyClick}
            />
        {/if}
        {#if asset?.hidden}
            <MenuItem icon={Icon.View} title={localize('actions.unhideToken')} onClick={onUnhideClick} />
        {:else}
            <MenuItem icon={Icon.Hide} title={localize('actions.hideToken')} onClick={onHideClick} />
        {/if}
        <MenuItem
            icon={Icon.Delete}
            disabled={!features?.wallet?.assets?.burnAsset?.enabled}
            title={localize('actions.burnToken')}
            onClick={onBurnTokenClick}
        />
    </div>
</Modal>
