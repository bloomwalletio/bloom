<script lang="ts">
    import { IMenuItem, Menu } from '@bloomwalletio/ui'
    import { hideActivitiesForHiddenTokens } from '@core/activity/actions'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import { ITokenWithBalance, NotVerifiedStatus, VerifiedStatus } from '@core/token'
    import { removeTrackedTokenFromActiveProfile } from '@core/token/actions'
    import { hideToken, unhideToken, unverifyToken, verifyToken } from '@core/token/stores'
    import { PopupId, closePopup, openPopup, updatePopupProps } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { Modal } from '@ui'

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

    let items: IMenuItem[] = []
    function setItems(token: ITokenWithBalance) {
        items = []
        if (isTrackedToken) {
            items.push({
                text: localize('actions.untrackToken'),
                onClick: onUntrackTokenClick,
            })
        }
        if (token.verification?.status === VerifiedStatus.SelfVerified) {
            items.push({
                text: localize('actions.unverifyToken'),
                onClick: onUnverifyClick,
            })
        } else {
            items.push({
                text: localize('actions.verifyToken'),
                onClick: onVerifyClick,
            })
        }
        if (token.hidden) {
            items.push({
                text: localize('actions.unhideToken'),
                onClick: onUnhideClick,
            })
        } else {
            items.push({
                text: localize('actions.hideToken'),
                onClick: onHideClick,
            })
        }
        items.push({
            text: localize('actions.burnToken'),
            variant: 'danger',
            disabled: !features?.wallet?.assets?.burnToken.enabled,
            onClick: onBurnTokenClick,
        })
    }
    $: setItems(token)
</script>

<Menu {items} />
