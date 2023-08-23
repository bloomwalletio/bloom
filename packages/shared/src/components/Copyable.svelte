<script lang="ts">
    import { CopyableButton } from '@bloomwalletio/ui'

    export let value: string
</script>

<CopyableButton {value}>
    <slot />
</CopyableButton>
