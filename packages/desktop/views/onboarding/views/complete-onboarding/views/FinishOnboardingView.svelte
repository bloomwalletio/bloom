<script lang="ts">
    import { Button, IconName, Text } from '@bloomwalletio/ui'
    import { completeOnboardingProcess, isOnboardingLedgerProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { checkOrConnectLedger } from '@core/ledger'
    import { OnboardingLayout } from '@views/components'
    import { onboardingRouter } from '@views/onboarding/onboarding-router'

    const LOCALE_KEY = 'views.onboarding.congratulations'

    function onContinueClick(): void {
        if ($isOnboardingLedgerProfile) {
            checkOrConnectLedger(_continue)
        } else {
            void _continue()
        }
    }

    function _continue(): Promise<void> {
        completeOnboardingProcess()
        $onboardingRouter.next()
        return Promise.resolve()
    }
</script>

<OnboardingLayout
    continueButton={{
        onClick: onContinueClick,
        hidden: true,
    }}
    backButton={{
        hidden: true,
    }}
>
    <div slot="content" class="flex flex-col justify-center items-center gap-8">
        <svg-container>
            <svg width="76" height="77" viewBox="0 0 76 77" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_420_4340)">
                    <path
                        d="M31.9668 3.06426C35.5358 0.364219 40.4642 0.364223 44.0332 3.06426L45.6695 4.30217C47.4593 5.65614 49.6524 6.36873 51.8962 6.32533L53.9476 6.28564C58.4221 6.19908 62.4092 9.09593 63.7096 13.3781L64.3058 15.3414C64.9579 17.4888 66.3133 19.3544 68.154 20.6381L69.837 21.8118C73.5078 24.3718 75.0308 29.059 73.5658 33.2877L72.8941 35.2265C72.1594 37.347 72.1594 39.653 72.8941 41.7735L73.5658 43.7123C75.0308 47.941 73.5078 52.6282 69.837 55.1882L68.154 56.3619C66.3133 57.6456 64.9578 59.5112 64.3058 61.6586L63.7096 63.6219C62.4092 67.9041 58.4221 70.8009 53.9476 70.7144L51.8962 70.6747C49.6524 70.6313 47.4593 71.3439 45.6695 72.6978L44.0332 73.9357C40.4642 76.6358 35.5358 76.6358 31.9668 73.9357L30.3305 72.6978C28.5407 71.3439 26.3476 70.6313 24.1038 70.6747L22.0524 70.7144C17.5779 70.8009 13.5908 67.9041 12.2904 63.6219L11.6942 61.6586C11.0421 59.5112 9.68671 57.6456 7.84595 56.3619L6.16298 55.1882C2.4922 52.6282 0.969239 47.941 2.43424 43.7123L3.10591 41.7735C3.84055 39.653 3.84055 37.347 3.10591 35.2265L2.43424 33.2877C0.969238 29.059 2.4922 24.3718 6.16298 21.8118L7.84595 20.6381C9.68671 19.3544 11.0421 17.4888 11.6942 15.3414L12.2904 13.3781C13.5908 9.09593 17.5779 6.19908 22.0524 6.28564L24.1038 6.32533C26.3476 6.36873 28.5407 5.65614 30.3305 4.30217L31.9668 3.06426Z"
                        fill="#50A361"
                    />
                    <path
                        d="M48.6673 30.5L34.0007 45.1667L27.334 38.5"
                        stroke="white"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_420_4340">
                        <rect y="0.5" width="76" height="76" rx="38" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </svg-container>
        <div class="flex flex-col justify-center items-center gap-3">
            <div class="flex flex-col justify-center items-center">
                <Text type="h5" customColor="success-500">{localize(`${LOCALE_KEY}.title`)}</Text>
                <Text type="h1">{localize(`${LOCALE_KEY}.body1`)}</Text>
            </div>
            <Text type="body2" fontWeight="medium" textColor="secondary">{localize(`${LOCALE_KEY}.body2`)}</Text>
        </div>
        <Button icon={IconName.ArrowNarrowRight} reverse text={localize(`${LOCALE_KEY}.action`)} />
    </div>
</OnboardingLayout>

<style lang="postcss">
    svg-container {
        @apply block -mt-[5.5rem];
    }
</style>
