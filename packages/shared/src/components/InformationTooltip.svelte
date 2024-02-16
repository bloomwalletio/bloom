<script lang="ts">
    import { Popover, Text, type TextColor } from '@bloomwalletio/ui'

    export let title: string = ''
    export let body: string = ''

    export let titleColor: TextColor | undefined = undefined
    export let bodyColor: TextColor | undefined = undefined
</script>

<Popover
    showArrow
    event="hover"
    class="shadow-elevation-4 p-4 rounded-xl flex flex-col text-left space-y-2 max-w-[15rem]"
    {...$$restProps}
>
    {#if title}
        <Text type="h6" textColor={titleColor}>
            {title}
        </Text>
    {/if}
    {#if body}
        <Text textColor={bodyColor} fontWeight="medium">
            {body}
        </Text>
    {/if}
</Popover>
