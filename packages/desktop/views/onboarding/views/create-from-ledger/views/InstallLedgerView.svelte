<script lang="ts">
    import { Icon, IconName, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { LedgerAppName, pollLedgerDeviceState, stopPollingLedgerDeviceState } from '@core/ledger'
    import { OnboardingLayout } from '@views/components'
    import { onMount } from 'svelte'
    import { createFromLedgerRouter } from '../create-from-ledger-router'
    import { onboardingProfile } from '@contexts/onboarding'
    import { SupportedStardustNetworkId } from '@core/network/constants'

    function onContinueClick(): void {
        $createFromLedgerRouter.next()
    }

    function onBackClick(): void {
        stopPollingLedgerDeviceState()
        $createFromLedgerRouter.previous()
    }

    interface LedgerAppIconDetails {
        ledgerAppName: LedgerAppName
        iconName: IconName
        iconColor: string
        backgroundColor: string
        textColor?: string
    }

    function getLedgerAppIconDetails(
        networkId: keyof typeof SupportedStardustNetworkId | undefined
    ): LedgerAppIconDetails {
        switch (networkId) {
            case SupportedStardustNetworkId.Iota:
            case SupportedStardustNetworkId.IotaTestnet:
                return {
                    ledgerAppName: LedgerAppName.Iota,
                    iconName: IconName.Iota,
                    iconColor: '#ffffff',
                    backgroundColor: 'bg-black',
                }
            case SupportedStardustNetworkId.Shimmer:
            case SupportedStardustNetworkId.Testnet:
                return {
                    ledgerAppName: LedgerAppName.Shimmer,
                    iconName: IconName.ShimmerLedger,
                    iconColor: 'neutral-1',
                    backgroundColor: 'bg-neutral-4',
                    textColor: 'neutral-4/95',
                }
            default:
                throw new Error(`Unsupported network id: ${networkId}`)
        }
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
        {@const { ledgerAppName, iconName, iconColor, backgroundColor, textColor } = getLedgerAppIconDetails(
            $onboardingProfile?.network?.id
        )}
        <icon-container class={backgroundColor}>
            <Icon name={iconName} size="lg" customColor={iconColor} />
        </icon-container>
        <Text customColor={textColor}>{ledgerAppName}</Text>
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
