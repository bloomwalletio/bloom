<script lang="ts">
    import { IMenuItem, IconName, Menu } from '@bloomwalletio/ui'
    import { hideActivitiesForHiddenTokens } from '@core/activity/actions'
    import { localize } from '@core/i18n'
    import { isStardustNetwork } from '@core/network'
    import { ITokenWithBalance, NotVerifiedStatus, VerifiedStatus } from '@core/token'
    import { removeTrackedTokenFromActiveProfile } from '@core/token/actions'
    import { hideToken, unhideToken, unverifyToken, verifyToken } from '@core/token/stores'
    import { isTrackedTokenAddress } from '@core/wallet'
    import { PopupId, closePopup, openPopup, updatePopupProps } from '@desktop/auxiliary/popup'
    import features from '@features/features'

    export let token: ITokenWithBalance

    let menu: Menu | undefined = undefined

    $: isTrackedToken = isTrackedTokenAddress(token.networkId, token.id)

    function onUntrackTokenClick(): void {
        removeTrackedTokenFromActiveProfile(token.id, token.networkId)
        menu?.close()
        closePopup()
    }

    function onUnverifyClick(): void {
        unverifyToken(token, NotVerifiedStatus.Skipped)
        updatePopupProps({
            token: { ...token, verification: { verified: false, status: NotVerifiedStatus.Skipped } },
        })
        menu?.close()
    }

    function onVerifyClick(): void {
        verifyToken(token, VerifiedStatus.SelfVerified)
        updatePopupProps({
            token: { ...token, verification: { verified: true, status: VerifiedStatus.SelfVerified } },
        })
        menu?.close()
    }

    function onUnhideClick(): void {
        unhideToken(token)
        hideActivitiesForHiddenTokens()
        updatePopupProps({
            token: { ...token, hidden: false },
        })
        menu?.close()
    }

    function onHideClick(): void {
        hideToken(token)
        hideActivitiesForHiddenTokens()
        updatePopupProps({
            token: { ...token, hidden: true },
        })
        menu?.close()
    }

    function onBurnTokenClick(): void {
        openPopup({ id: PopupId.BurnNativeTokens, props: { token } })
        menu?.close()
    }

    let items: IMenuItem[] = []
    function setItems(token: ITokenWithBalance) {
        items = []
        if (token.verification?.status === VerifiedStatus.SelfVerified) {
            items.push({
                icon: IconName.DangerCircle,
                title: localize('actions.unverifyToken'),
                onClick: onUnverifyClick,
            })
        } else {
            items.push({
                icon: IconName.Verified,
                title: localize('actions.verifyToken'),
                onClick: onVerifyClick,
            })
        }
        if (token.hidden) {
            items.push({
                icon: IconName.Eye,
                title: localize('actions.unhideToken'),
                onClick: onUnhideClick,
            })
        } else {
            items.push({
                icon: IconName.EyeOff,
                title: localize('actions.hideToken'),
                onClick: onHideClick,
            })
        }
        if (isTrackedToken) {
            items.push({
                icon: IconName.Trash,
                title: localize('actions.untrackToken'),
                onClick: onUntrackTokenClick,
            })
        } else if (isStardustNetwork(token.networkId)) {
            items.push({
                icon: IconName.Trash,
                title: localize('actions.burnToken'),
                variant: 'danger',
                disabled: !features?.wallet?.assets?.burnToken.enabled,
                onClick: onBurnTokenClick,
            })
        }
    }
    $: setItems(token)
</script>

<Menu bind:this={menu} {items} />
