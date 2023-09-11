<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { localize } from '@core/i18n'
    import { LedgerConnectionState, ledgerConnectionState } from '@core/ledger'
    import { Subrouter } from '@core/router'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import { Icon, Link, Text } from '@ui'

    export let router: Subrouter<unknown>

    $: isNotConnected = $ledgerConnectionState === LedgerConnectionState.NotConnected
    $: isLocked = isNotConnected || $ledgerConnectionState === LedgerConnectionState.Locked
    $: isAppNotOpen = isLocked || $ledgerConnectionState === LedgerConnectionState.AppNotOpen
    $: isCorrectAppOpen = $ledgerConnectionState === LedgerConnectionState.CorrectAppOpen
    $: $ledgerConnectionState, setAnimation()

    let animation: string
    function setAnimation(): void {
        if (isNotConnected) {
            animation = 'ledger-disconnected-desktop'
        } else if (isLocked) {
            // TODO: Get animation for locked ledger
            animation = undefined
        } else if (isAppNotOpen) {
            animation = 'ledger-app-closed-desktop'
        } else if (isCorrectAppOpen) {
            animation = 'ledger-connected-desktop'
        }
    }

    function handleGuidePopup(): void {
        openPopup({
            id: PopupId.LedgerConnection,
        })
    }

    function onContinueClick(): void {
        router.next()
    }

    function onBackClick(): void {
        router.previous()
    }
</script>

<OnboardingLayout
    title={localize('views.connectLedger.title')}
    description={localize('views.connectLedger.body')}
    {onContinueClick}
    {onBackClick}
    busy={!isCorrectAppOpen}
>
    <div slot="content" class="space-y-4">
        <div class="flex flex-col flex-nowrap space-y-2">
            <div class="flex flex-row items-center space-x-2">
                <Icon
                    icon={`status-${isNotConnected ? 'error' : 'success'}`}
                    classes={`text-white bg-${isNotConnected ? 'red' : 'green'}-600 rounded-full`}
                />
                <Text type="p" secondary>{localize('views.connectLedger.connect')}</Text>
            </div>
            <div class="flex flex-row items-center space-x-2">
                <Icon
                    icon={`status-${isLocked ? 'error' : 'success'}`}
                    classes={`text-white bg-${isLocked ? 'red' : 'green'}-600 rounded-full`}
                />
                <Text type="p" secondary>{localize('views.connectLedger.unlock')}</Text>
            </div>
            <div class="flex flex-row items-center space-x-2">
                <Icon
                    icon={`status-${isAppNotOpen ? 'error' : 'success'}`}
                    classes={`text-white bg-${isAppNotOpen ? 'red' : 'green'}-600 rounded-full`}
                />
                <Text type="p" secondary>{localize('views.connectLedger.openApp')}</Text>
            </div>
        </div>
        <Link icon="info" onClick={handleGuidePopup}>
            {localize('popups.ledgerConnectionGuide.title')}
        </Link>
    </div>
</OnboardingLayout>
