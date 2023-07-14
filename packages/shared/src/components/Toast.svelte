<script lang="ts">
    import { Icon, Text, FontWeight, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { removeAppNotification } from '@auxiliary/notification/stores'

    export let id: string = ''
    export let variant: string
    export let text: string
    export let showDismiss: boolean = false
    export let classes: string = ''

    const TOAST_STYLE = {
        info: {
            backgroundColor: 'blue-100',
            iconColor: 'blue-700',
            icon: 'info-filled',
            messageColor: 'blue-700',
        },
        success: {
            backgroundColor: 'green-100',
            iconColor: 'green-800',
            icon: 'checkmark-filled',
            messageColor: 'green-800',
        },
        warning: {
            backgroundColor: 'yellow-100',
            iconColor: 'yellow-800',
            icon: 'exclamation-filled',
            messageColor: 'yellow-800',
        },
        error: {
            backgroundColor: 'red-100',
            iconColor: 'red-700',
            icon: 'error-filled',
            messageColor: 'red-700',
        },
    }

    function onDismissClick(): void {
        removeAppNotification(id)
    }
</script>

<div class="{classes} flex flex-row items-center rounded-xl p-4 bg-{TOAST_STYLE[variant].backgroundColor}">
    <Icon
        height={24}
        width={24}
        primaryColor="white"
        icon={TOAST_STYLE?.[variant]?.icon}
        classes="fill-current text-{TOAST_STYLE?.[variant]?.iconColor}"
    />
    <div class="flex flex-auto flex-col px-4">
        <Text
            type={TextType.p}
            fontWeight={FontWeight.semibold}
            class="flex text-13 text text-{TOAST_STYLE[variant].messageColor}">{text}</Text
        >
    </div>
    {#if showDismiss}
        <button
            type="button"
            on:click={onDismissClick}
            class="dismiss-min-wh cursor-pointer text-center rounded-lg
            font-bold text-11 text-{TOAST_STYLE[variant].messageColor}"
        >
            {localize('actions.dismiss')}
        </button>
    {/if}
</div>
