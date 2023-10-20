<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { OnboardingLayout } from '@views/components'
    import { createFromMnemonicRouter } from '../create-from-mnemonic-router'
    import { SuccessSvg } from '@views/onboarding/components'

    const LOCALE_KEY = 'views.onboarding.profileBackup.verifyMnemonic.success'

    function onContinueClick(): void {
        $createFromMnemonicRouter.next()
    }
</script>

<OnboardingLayout
    continueButton={{
        onClick: onContinueClick,
    }}
    backButton={{
        hidden: true,
    }}
>
    <content slot="content" class="flex flex-col justify-center items-center">
        <div class="flex flex-col justify-center items-center gap-4">
            <SuccessSvg />
            <Text type="body1" customColor="success-500">
                {localize(`${LOCALE_KEY}.body1`)}
            </Text>
        </div>
        <div class="flex flex-col justify-center items-center gap-3">
            <Text type="h3">
                {localize(`${LOCALE_KEY}.title`)}
            </Text>
            <Text type="sm" textColor="secondary" fontWeight="medium">
                {localize(`${LOCALE_KEY}.body2`)}
            </Text>
        </div>
    </content>
</OnboardingLayout>
