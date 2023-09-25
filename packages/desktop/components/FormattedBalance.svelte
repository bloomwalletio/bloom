<script lang="ts">
    import { Text, TextType } from '@bloomwalletio/ui'

    export let primaryText: string = ''
    export let secondaryText: string = ''
    export let textType: TextType = 'h1'
</script>

<formatted-balance class="flex flex-row items-center">
    <Text type={textType}>{primaryText}</Text>
    <Text type={textType} color="text-secondary">{secondaryText}</Text>
</formatted-balance>
