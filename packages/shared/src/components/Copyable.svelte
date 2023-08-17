<script lang="ts">
    import { CopyableButton } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let value: string
</script>

<CopyableButton {value} toCopyText={localize('general.copyToClipboard')} copiedText={localize('general.copied')}>
    <slot />
</CopyableButton>
