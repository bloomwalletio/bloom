<script lang="ts">
    import { TextInput } from '@ui'
    import { localize } from '@core/i18n'

    export let inputElement: HTMLInputElement | undefined = undefined

    export let disabled = false
    export let hasFocus = false
    export let value: string
    export let isInteger: boolean
    export let error: string = ''
</script>

<TextInput
    bind:inputElement
    bind:value
    bind:hasFocus
    {error}
    {disabled}
    placeholder={localize('general.amount')}
    float={!isInteger}
    integer={isInteger}
    {...$$restProps}
>
    <slot name="right-full-h" slot="right-full-h" />
</TextInput>
