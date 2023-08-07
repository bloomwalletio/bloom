<script lang="ts">
    import { Text, FontWeight, ColoredCircle } from '@ui/'

    export let color: string
    export let text: string
    export let selected = true
</script>

<div class="flex flex-row items-center space-x-3">
    <ColoredCircle {color} />
    <Text fontSize="14" fontWeight={FontWeight.semibold} classes={selected ? '' : 'opacity-50'}>
        {text}
    </Text>
</div>
