<script lang="ts">
    import Input from './Input.svelte'
    import { FontWeight, TextPropTypes, TextType } from '@ui'

    export let value: string = ''
    export let inputElement: HTMLInputElement | undefined = undefined
    export let hasFocus: boolean = false
    export let error: string = ''
    export let inputType: 'text' | 'number' | 'password' = 'text'
    export let alignment: 'left' | 'right' | 'center' | 'justify' = 'left'

    // Text Props
    export let textType = TextType.p
    export let fontWeight: FontWeight = FontWeight.normal
    export let fontSize = 'text-32'
    export let lineHeight = '140'

    export function validate(): void {
        input?.validate()
    }

    let textProps: TextPropTypes
    $: textProps = { type: textType, fontSize, lineHeight, fontWeight }

    let input: Input
</script>

<Input
    bind:this={input}
    bind:inputElement
    bind:value
    bind:hasFocus
    type={inputType}
    {textProps}
    {alignment}
    {error}
    {...$$restProps}
>
    <slot name="left" slot="left" />
    <slot name="right" slot="right" />
</Input>
