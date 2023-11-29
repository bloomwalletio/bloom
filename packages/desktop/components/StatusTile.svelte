<script lang="ts" context="module">
    export interface StatusTileProps {
        checked?: boolean
        title: string
        subtitle: string
        logo?: LogoName
        iconName?: IconName
        iconColor?: string
        iconBackgroundColor?: string
        onClick?: () => void
    }
</script>

<script lang="ts">
    import { Avatar, IconName, Text, Tile, Toggle } from '@bloomwalletio/ui'
    import { Logo } from '@ui'
    import { LogoName } from '@auxiliary/logo'

    export let statusTileProps: StatusTileProps

    $: ({ checked, title, subtitle, iconName, iconColor, iconBackgroundColor, logo, onClick } = statusTileProps)
    $: backgroundColor = iconBackgroundColor ?? `${iconColor}/20`
</script>

<Tile border>
    <status-tile>
        <div class="flex flex-row items-center gap-2">
            {#if logo}
                <Avatar {backgroundColor} size="md" shape="square">
                    <Logo {logo} />
                </Avatar>
            {:else}
                <Avatar icon={iconName} {backgroundColor} customTextColor={iconColor} size="md" shape="square" />
            {/if}
            <div>
                <Text>{title}</Text>
                <Text type="xs" textColor="secondary">{subtitle}</Text>
            </div>
        </div>
        {#if onClick}
            <Toggle {onClick} {checked} label="status" />
        {/if}
    </status-tile>
</Tile>

<style lang="postcss">
    status-tile {
        @apply flex justify-between items-center;
        @apply w-full h-9;
    }
</style>
