<script lang="ts">
    import { Text, TextType } from '@ui'
    export let error = ''
</script>

{#if error !== null}
    <div class="inline-block w-full h-full mt-1">
        <Text type={TextType.p} classes="inline-block" error>{error}</Text>
    </div>
{/if}
