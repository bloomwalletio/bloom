<script lang="ts">
    import {
        PRIVACY_POLICY_URL,
        PRIVACY_POLICY_VERSION,
        TERMS_OF_SERVICE_URL,
        TERMS_OF_SERVICE_VERSION,
        needsToAcceptLatestPrivacyPolicy,
        needsToAcceptLatestTermsOfService,
        openUrlInBrowser,
    } from '@core/app'
    import { lastAcceptedPrivacyPolicy, lastAcceptedTermsOfService } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { Checkbox, Link, Text } from '@bloomwalletio/ui'
    import PopupTemplate from '../PopupTemplate.svelte'

    let checked = false
    const tos = needsToAcceptLatestTermsOfService()
    const privacyPolicy = needsToAcceptLatestPrivacyPolicy()

    function onTermsOfServiceClick(): void {
        openUrlInBrowser(TERMS_OF_SERVICE_URL)
    }

    function onPrivacyPolicyClick(): void {
        openUrlInBrowser(PRIVACY_POLICY_URL)
    }

    function onConfirmClick(): void {
        if (tos) {
            lastAcceptedTermsOfService.set(TERMS_OF_SERVICE_VERSION)
        }
        if (privacyPolicy) {
            lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        }

        closePopup(true)
    }

    function getTitleText(): string {
        if (tos && privacyPolicy) {
            return 'views.onboarding.appSetup.legal.title'
        } else if (tos) {
            return 'popups.legalUpdate.tosTitle'
        } else if (privacyPolicy) {
            return 'popups.legalUpdate.privPolicyTitle'
        }
    }

    function getBodyText(): string {
        if (tos && privacyPolicy) {
            return 'popups.legalUpdate.tosAndPrivPolicyBody'
        } else if (tos) {
            return 'popups.legalUpdate.tosBody'
        } else if (privacyPolicy) {
            return 'popups.legalUpdate.privPolicyBody'
        }
    }
</script>

<PopupTemplate
    title={localize(getTitleText())}
    description={localize(getBodyText())}
    continueButton={{
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
        disabled: !checked,
    }}
>
    <Checkbox bind:checked size="lg">
        <div slot="label" class="flex flex-col">
            <Text type="body2" fontWeight="medium">{localize('views.onboarding.appSetup.welcome.legalBody')}</Text>
            <div class="flex">
                <Link on:click={onPrivacyPolicyClick} text="Privacy Policy" textType="body2" external />
                <Text type="body2" fontWeight="medium">&nbsp&&nbsp</Text>
                <Link on:click={onTermsOfServiceClick} text="Terms of Service" textType="body2" external />
            </div>
        </div>
    </Checkbox>
</PopupTemplate>
