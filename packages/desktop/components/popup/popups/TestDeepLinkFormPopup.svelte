<script lang="ts">
    import { handleDeepLink } from '@auxiliary/deep-link'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { TextInput } from '@bloomwalletio/ui'
    import PopupTemplate from '../PopupTemplate.svelte'

    const PREFIX = process.env.APP_PROTOCOL + '://'
    let url: string = PREFIX

    function onCancelClick(): void {
        closePopup()
    }

    function onTestClick(): void {
        closePopup()
        handleDeepLink(url)
    }
</script>

<PopupTemplate
    title={localize('actions.testDeepLink')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('actions.test'),
        onClick: onTestClick,
    }}
>
    <div class="space-y-4 max-h-100 scrollable-y flex-1">
        <TextInput bind:value={url} label={localize('general.url')} />
    </div>
</PopupTemplate>
