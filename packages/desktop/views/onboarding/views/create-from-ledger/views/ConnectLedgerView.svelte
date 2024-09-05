<script lang="ts">
    import { Icon, IconName, Link, Avatar, Alert } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerConnectionState, MINIMUM_SUPPORTED_LEDGER_APP_VERSION, ledgerConnectionAppState } from '@core/ledger'
    import { OnboardingLayout } from '@views/components'
    import { createFromLedgerRouter } from '..'
    import { CreateFromLedgerRoute } from '../create-from-ledger-route.enum'
    import { StepCard } from './components'
    import { LedgerIllustration } from '@ui'
    import { getProfileLedgerAppName } from '@core/profile/utils'

    $: isDisconnected = $ledgerConnectionAppState?.state === LedgerConnectionState.Disconnected
    $: isLocked = isDisconnected || $ledgerConnectionAppState?.state === LedgerConnectionState.Locked
    $: isOpen = $ledgerConnectionAppState?.state === LedgerConnectionState.AppOpen
    $: appName = getProfileLedgerAppName()
    $: isCorrectApp = $ledgerConnectionAppState?.app === appName
    $: isUnsupportedVersion = $ledgerConnectionAppState?.state === LedgerConnectionState.UnsupportedVersion
    $: minimumVersion = MINIMUM_SUPPORTED_LEDGER_APP_VERSION[appName]

    function onConnectionGuideClick(): void {
        $createFromLedgerRouter.goTo(CreateFromLedgerRoute.LedgerConnectionGuide)
    }

    function onContinueClick(): void {
        $createFromLedgerRouter.next()
    }

    function onBackClick(): void {
        $createFromLedgerRouter.previous()
    }
</script>

<OnboardingLayout
    title={localize('views.onboarding.createFromLedger.connectLedger.title')}
    description={localize('views.onboarding.createFromLedger.connectLedger.description')}
    continueButton={{
        onClick: onContinueClick,
        disabled: !isOpen || !isCorrectApp || isUnsupportedVersion,
    }}
    backButton={{
        onClick: onBackClick,
    }}
>
    <div slot="content" class="flex flex-col justify-center items-center gap-8">
        {#if isCorrectApp && isUnsupportedVersion}
            <div class="flex flex-col justify-center items-center gap-2">
                <LedgerIllustration illustration="ledger-live">
                    <div class="cross-container">
                        <Avatar icon={IconName.CrossClose} size="md" backgroundColor="danger" />
                    </div>
                </LedgerIllustration>
                <Alert
                    variant="danger"
                    text={localize('views.onboarding.createFromLedger.connectLedger.unsupportedVersion', {
                        appName,
                        minimumVersion,
                    })}
                />
            </div>
        {:else}
            <div class="flex flex-nowrap gap-2 justify-center items-center">
                <StepCard
                    stepCount={1}
                    complete={!isDisconnected}
                    icon={IconName.Link}
                    text={localize('views.onboarding.createFromLedger.connectLedger.connect')}
                />
                <StepCard
                    stepCount={2}
                    complete={!isLocked}
                    icon={IconName.Link}
                    text={localize('views.onboarding.createFromLedger.connectLedger.unlock')}
                />
                <StepCard
                    stepCount={3}
                    complete={isCorrectApp && isOpen}
                    icon={IconName.Link}
                    text={localize('views.onboarding.createFromLedger.connectLedger.open', { appName })}
                />
            </div>
        {/if}
        <div class="flex gap-2 justify-center items-center">
            <Icon name={IconName.InfoCircle} size="xs" textColor="brand" />
            <Link
                on:click={onConnectionGuideClick}
                text={localize('views.onboarding.createFromLedger.connectLedger.tip')}
                fontWeight="medium"
            />
        </div>
    </div>
</OnboardingLayout>

<style lang="postcss">
    .cross-container {
        transform: translateY(36px);
    }
</style>
