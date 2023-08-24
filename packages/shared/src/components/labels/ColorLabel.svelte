<script lang="ts">
    import { Indicator } from '@bloomwalletio/ui'
    import { FontWeight, Text } from '@ui'

    export let color: string
    export let text: string
    export let selected = true
</script>

<div class="flex flex-row items-center space-x-3">
    <Indicator {color} />
    <Text fontSize="14" fontWeight={FontWeight.semibold} classes={selected ? '' : 'opacity-50'}>
        {text}
    </Text>
</div>
