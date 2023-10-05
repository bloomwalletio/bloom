<script lang="ts">
    import { Avatar } from '@bloomwalletio/ui'
    import { Animation, Illustration } from '@ui'

    export let animation: string | undefined = undefined
    export let illustration: string | undefined = undefined
    export let classes: string = ''
    export let avatar = false
</script>

<ledger-animation class="h-full relative flex {classes}">
    {#if animation}
        <Animation {animation} classes="z-0" />
    {:else if illustration}
        <div class="absolute">
            <div class="relative top-30 left-37">
                {#if avatar}
                    <Avatar />
                {:else}
                    <Illustration illustration="ledger-pin" />
                {/if}
            </div>
        </div>
        <Illustration width={380} illustration="ledger-base" classes="z-0" />
    {/if}
</ledger-animation>
