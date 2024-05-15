<script lang="ts">
    import {
        PRIVACY_POLICY_URL,
        PRIVACY_POLICY_VERSION,
        TERMS_OF_SERVICE_URL,
        TERMS_OF_SERVICE_VERSION,
        needsToAcceptLatestPrivacyPolicy,
        needsToAcceptLatestTermsOfService,
    } from '@core/app'
    import { lastAcceptedPrivacyPolicy, lastAcceptedTermsOfService } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { Checkbox, Link, Text } from '@bloomwalletio/ui'
    import PopupTemplate from '../PopupTemplate.svelte'

    let checked = false
    const tos = needsToAcceptLatestTermsOfService()
    const privacyPolicy = needsToAcceptLatestPrivacyPolicy()

    function onConfirmClick(): void {
        if (tos) {
            lastAcceptedTermsOfService.set(TERMS_OF_SERVICE_VERSION)
        }
        if (privacyPolicy) {
            lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        }

        closePopup({ forceClose: true })
    }

    function getTitleText(): string {
        if (tos && privacyPolicy) {
            return localize('general.privacyPolicy') + ' & ' + localize('general.termsOfService')
        } else if (tos) {
            return localize('general.termsOfService')
        } else if (privacyPolicy) {
            return localize('general.privacyPolicy')
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
            <Text type="body2" fontWeight="medium">{localize('views.onboarding.welcome.legalAction')}</Text>
            <div class="flex flex-wrap">
                <Link href={PRIVACY_POLICY_URL} text={localize('general.privacyPolicy')} textType="body2" external />
                <Text type="body2" fontWeight="medium">&nbsp&&nbsp</Text>
                <Link href={TERMS_OF_SERVICE_URL} text={localize('general.termsOfService')} textType="body2" external />
            </div>
        </div>
    </Checkbox>
</PopupTemplate>
