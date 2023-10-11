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
    import { Checkbox, Link } from '@bloomwalletio/ui'
    import PopupTemplate from '../PopupTemplate.svelte'

    let checked = false
    const tos = needsToAcceptLatestTermsOfService()
    const privacyPolicy = needsToAcceptLatestPrivacyPolicy()

    function onViewTosClick(): void {
        openUrlInBrowser(TERMS_OF_SERVICE_URL)
    }

    function onViewPrivPolicyClick(): void {
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

    function getCheckboxText(): string {
        if (tos && privacyPolicy) {
            return 'popups.legalUpdate.tosAndPrivPolicyCheckbox'
        } else if (tos) {
            return 'popups.legalUpdate.tosCheckbox'
        } else if (privacyPolicy) {
            return 'popups.legalUpdate.privPolicyCheckbox'
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
    <div class="flex flex-col gap-2">
        {#if tos && privacyPolicy}
            <ul>
                <li><Link on:click={onViewTosClick} text={localize('popups.legalUpdate.tosTitle')} /></li>
                <li><Link on:click={onViewPrivPolicyClick} text={localize('popups.legalUpdate.privPolicyTitle')} /></li>
            </ul>
        {:else if tos}
            <ul>
                <li><Link on:click={onViewTosClick} text={localize('popups.legalUpdate.tosTitle')} /></li>
            </ul>
        {:else if privacyPolicy}
            <ul>
                <li><Link on:click={onViewPrivPolicyClick} text={localize('popups.legalUpdate.privPolicyTitle')} /></li>
            </ul>
        {/if}
        <div class="mt-2">
            <Checkbox label={localize(getCheckboxText())} bind:checked />
        </div>
    </div>
</PopupTemplate>

<style lang="scss">
    ul {
        display: block;
        list-style-type: disc;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 20px;
    }
</style>
