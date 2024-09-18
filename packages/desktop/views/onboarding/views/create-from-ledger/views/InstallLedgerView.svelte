<script lang="ts">
    import { Icon, IconName, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName, pollLedgerDeviceState, stopPollingLedgerDeviceState } from '@core/ledger'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { createFromLedgerRouter } from '../create-from-ledger-router'
    import { getProfileLedgerAppName } from '@core/profile/actions/active-profile'

    const appName = getProfileLedgerAppName()

    function onContinueClick(): void {
        $createFromLedgerRouter.next()
    }

    function onBackClick(): void {
        stopPollingLedgerDeviceState()
        $createFromLedgerRouter.previous()
    }

    const LEDGER_APP_ICON_DETAILS = {
        [LedgerAppName.Iota]: {
            iconName: IconName.Iota,
            iconColor: '#ffffff',
            backgroundColor: 'bg-black',
        },
        [LedgerAppName.Shimmer]: {
            iconName: IconName.ShimmerLedger,
            iconColor: 'neutral-1',
            backgroundColor: 'bg-neutral-4',
            textColor: 'neutral-4/95',
        },
    }

    onMount(() => {
        pollLedgerDeviceState()
    })
</script>

<OnboardingLayout
    title={localize('views.onboarding.createFromLedger.installLedger.title')}
    description={localize('views.onboarding.createFromLedger.installLedger.description')}
    continueButton={{
        onClick: onContinueClick,
    }}
    backButton={{
        onClick: onBackClick,
    }}
>
    <content slot="content">
        {@const { iconName, iconColor, backgroundColor, textColor } = LEDGER_APP_ICON_DETAILS[appName]}
        <icon-container class={backgroundColor}>
            <Icon name={iconName} size="lg" customColor={iconColor} />
        </icon-container>
        <Text customColor={textColor}>{appName}</Text>
    </content>
</OnboardingLayout>

<style lang="postcss">
    content {
        @apply flex flex-col justify-center items-center gap-2 py-5;
    }

    icon-container {
        @apply p-4 rounded-[20px] w-fit scale-[1.17];
    }
</style>
