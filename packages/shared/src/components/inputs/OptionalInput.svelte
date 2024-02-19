<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { ClosableInput, AddInputButton, FontWeight, InformationTooltip } from '@ui'

    export let label: string = ''
    export let description: string = ''
    export let value: string | undefined = undefined
    export let fontSize: number = 15
    export let error: string = ''
    export let classes: string = ''
    export let isOpen: boolean = false
    export let isTooltipVisible: boolean = false
    export let disabled: boolean = false

    let buttonElement: HTMLButtonElement

    export function open(): void {
        isOpen = true
    }

    function onMouseEnter(): void {
        isTooltipVisible = !!description // only show tooltip if it has description
    }

    function onMouseLeave(): void {
        isTooltipVisible = false
    }

    $: if (!isOpen) {
        isTooltipVisible = false
    }

    onMount(() => {
        if (value) {
            open()
        }
    })
</script>

<optional-input class="{isOpen ? 'w-full order-first' : 'order-last'} {classes}">
    <ClosableInput
        bind:open={isOpen}
        bind:value
        bind:error
        {label}
        {fontSize}
        fontWeight={FontWeight.medium}
        {disabled}
        {...$$restProps}
    />
    {#if !isOpen}
        <AddInputButton
            bind:buttonElement
            bind:open={isOpen}
            text={label}
            {disabled}
            onClick={open}
            {onMouseEnter}
            {onMouseLeave}
        />
        {#if isTooltipVisible}
            <tooltip-container transition:fade={{ duration: 100 }}>
                <InformationTooltip
                    anchor={buttonElement}
                    title={label}
                    titleColor="primary"
                    body={description}
                    bodyColor="secondary"
                />
            </tooltip-container>
        {/if}
    {/if}
</optional-input>
