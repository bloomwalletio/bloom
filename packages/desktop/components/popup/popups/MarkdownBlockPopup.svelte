<script lang="ts">
    import PopupTemplate from '../PopupTemplate.svelte'
    import { MarkdownBlock, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { closePopup } from '@desktop/auxiliary/popup'

    export let title: string
    export let markdown: string
</script>

<PopupTemplate backButton={{ text: localize('actions.close'), onClick: closePopup }}>
    <Text type="h5">{title}</Text>
    <MarkdownBlock text={markdown} />
</PopupTemplate>
