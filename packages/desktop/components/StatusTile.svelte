<script lang="ts">
    import { Avatar, IconName, Text, Tile, Toggle } from '@bloomwalletio/ui'
    import { Logo } from '@ui'
    import { LogoName } from '@auxiliary/logo'

    export let checked = true
    export let title: string
    export let subtitle: string
    export let iconName: IconName | undefined
    export let iconColor: string | undefined
    export let iconBackgroundColor: string | undefined = undefined
    export let logo: LogoName | undefined = undefined
    export let onClick: () => void | undefined = undefined

    $: backgroundColor = iconBackgroundColor ?? `${iconColor}-200`
</script>

<Tile>
    <status-tile>
        <div class="flex flex-row items-center gap-2">
            {#if logo}
                <Avatar {backgroundColor} size="sm" shape="square">
                    <Logo {logo} />
                </Avatar>
            {:else}
                <Avatar icon={iconName} {backgroundColor} textColor={iconColor} size="sm" shape="square" />
            {/if}
            <div>
                <Text>{title}</Text>
                <Text type="xs" color="secondary">{subtitle}</Text>
            </div>
        </div>
        {#if onClick}
            <Toggle {onClick} label="status" {checked} size="sm" border="rounded-full" />
        {/if}
    </status-tile>
</Tile>

<style lang="postcss">
    status-tile {
        @apply flex justify-between items-center;
        @apply w-full h-9;
    }
</style>
