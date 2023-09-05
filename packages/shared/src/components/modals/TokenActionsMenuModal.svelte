<script lang="ts">
    import { hideActivitiesForHiddenTokens } from '@core/activity/actions'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import { ITokenWithBalance, NotVerifiedStatus, VerifiedStatus } from '@core/token'
    import { removeTrackedTokenFromActiveProfile } from '@core/token/actions'
    import { hideToken, unhideToken, unverifyToken, verifyToken } from '@core/token/stores'
    import features from '@features/features'
    import { Icon } from '@lib/auxiliary/icon'
    import { MenuItem, Modal } from '@ui'
    import { closePopup, openPopup, PopupId, updatePopupProps } from '../../../../desktop/lib/auxiliary/popup'

    export let modal: Modal | undefined = undefined
    export let token: ITokenWithBalance

    $: isTrackedToken = $activeProfile?.trackedTokens?.[token.networkId]?.includes(token.id)

    function onUntrackTokenClick(): void {
        removeTrackedTokenFromActiveProfile(token.id, token.networkId)
        modal?.close()
        closePopup()
    }

    function onUnverifyClick(): void {
        unverifyToken(token.id, NotVerifiedStatus.Skipped)
        updatePopupProps({
            token: { ...token, verification: { verified: false, status: NotVerifiedStatus.Skipped } },
        })
        modal?.close()
    }

    function onVerifyClick(): void {
        verifyToken(token.id, VerifiedStatus.SelfVerified)
        updatePopupProps({
            token: { ...token, verification: { verified: true, status: VerifiedStatus.SelfVerified } },
        })
        modal?.close()
    }

    function onUnhideClick(): void {
        unhideToken(token.id)
        hideActivitiesForHiddenTokens()
        updatePopupProps({
            token: { ...token, hidden: false },
        })
        modal?.close()
    }

    function onHideClick(): void {
        hideToken(token.id)
        hideActivitiesForHiddenTokens()
        updatePopupProps({
            token: { ...token, hidden: true },
        })
        modal?.close()
    }

    function onBurnTokenClick(): void {
        modal?.close()
        openPopup({ id: PopupId.BurnNativeTokens, props: { token } })
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <div class="flex flex-col">
        {#if isTrackedToken}
            <MenuItem icon={Icon.Search} title={localize('actions.untrackToken')} onClick={onUntrackTokenClick} />
        {/if}
        {#if token.verification?.status === VerifiedStatus.SelfVerified}
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
        {#if token.hidden}
            <MenuItem icon={Icon.View} title={localize('actions.unhideToken')} onClick={onUnhideClick} />
        {:else}
            <MenuItem icon={Icon.Hide} title={localize('actions.hideToken')} onClick={onHideClick} />
        {/if}
        <MenuItem
            icon={Icon.Delete}
            disabled={!features?.wallet?.assets?.burnToken.enabled}
            title={localize('actions.burnToken')}
            onClick={onBurnTokenClick}
        />
    </div>
</Modal>
