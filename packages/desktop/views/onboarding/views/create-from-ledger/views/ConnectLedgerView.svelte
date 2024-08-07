<script lang="ts">
    import { Icon, IconName, Link, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName, LedgerConnectionState, ledgerConnectionAppState } from '@core/ledger'
    import { OnboardingLayout } from '@views/components'
    import { createFromLedgerRouter } from '..'
    import { CreateFromLedgerRoute } from '../create-from-ledger-route.enum'
    import { onboardingProfile } from '@contexts/onboarding'
    import { SupportedStardustNetworkId } from '@core/network'

    $: isDisconnected = $ledgerConnectionAppState?.state === LedgerConnectionState.Disconnected
    $: isLocked = isDisconnected || $ledgerConnectionAppState?.state === LedgerConnectionState.Locked
    $: isOpen = $ledgerConnectionAppState?.state === LedgerConnectionState.AppOpen
    $: appName =
        $onboardingProfile?.network?.id === SupportedStardustNetworkId.Iota ? LedgerAppName.Iota : LedgerAppName.Shimmer
    $: isCorrectApp = $ledgerConnectionAppState?.app === appName
    $: isUnsupportedVersion = $ledgerConnectionAppState?.state === LedgerConnectionState.UnsupportedVersion

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
        <div class="flex flex-nowrap gap-2 justify-center items-center">
            <connect-card class:success={!isDisconnected}>
                <status-icon-container>
                    <Icon
                        name={isDisconnected ? IconName.CrossClose : IconName.Check}
                        size="xs"
                        customColor="neutral-1"
                    />
                </status-icon-container>
                <icon-container>
                    <Icon name={IconName.Link} textColor="current" />
                </icon-container>
                <Text align="center">{localize('views.onboarding.createFromLedger.connectLedger.connect')}</Text>
            </connect-card>
            <connect-card class:success={!isLocked}>
                <status-icon-container>
                    <Icon name={isLocked ? IconName.CrossClose : IconName.Check} size="xs" customColor="neutral-1" />
                </status-icon-container>
                <icon-container>
                    <Icon name={IconName.Unlocked} textColor="current" />
                </icon-container>
                <Text align="center">{localize('views.onboarding.createFromLedger.connectLedger.unlock')}</Text>
            </connect-card>
            <connect-card
                class:warning={isCorrectApp && isUnsupportedVersion}
                class:success={isCorrectApp && isOpen && !isUnsupportedVersion}
            >
                <status-icon-container>
                    <Icon
                        name={isCorrectApp
                            ? isOpen
                                ? IconName.Check
                                : isUnsupportedVersion
                                  ? IconName.DangerTriangle
                                  : IconName.CrossClose
                            : IconName.CrossClose}
                        size="xs"
                        customColor="neutral-1"
                    />
                </status-icon-container>
                <icon-container>
                    <Icon name={IconName.LinkExternal} textColor="current" />
                </icon-container>
                <Text align="center">
                    {isCorrectApp && isUnsupportedVersion
                        ? localize('views.onboarding.createFromLedger.connectLedger.unsupportedVersion', { appName })
                        : localize('views.onboarding.createFromLedger.connectLedger.open', { appName })}
                </Text>
            </connect-card>
        </div>
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
    connect-card {
        @apply relative flex flex-col items-center;
        @apply w-36 h-[11.25rem] px-4 pb-4 pt-10 gap-4;
        @apply rounded-xl bg-surface-1 dark:bg-surface-1-dark;

        &.success {
            @apply ring-2 ring-success/50;

            status-icon-container {
                @apply bg-success;
            }

            icon-container {
                @apply bg-success/20 text-success;
            }
        }

        &.warning {
            @apply ring-2 ring-warning/50;

            status-icon-container {
                @apply bg-warning;
            }

            icon-container {
                @apply bg-warning/20 text-warning;
            }
        }

        status-icon-container {
            @apply bg-warning;
        }

        icon-container {
            @apply bg-warning/20 text-warning;
        }
    }

    status-icon-container {
        @apply absolute top-2 left-2 rounded-full p-1.5;
    }

    icon-container {
        @apply p-3 rounded-xl;
    }
</style>
