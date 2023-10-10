<script lang="ts">
    import { ClickableTile } from '@ui'
    import { setClipboard, truncateString } from '@core/utils'
    import { Text, IconName, Avatar } from '@bloomwalletio/ui'

    export let aliasId: string
    export let fullWidth = true
    export let classes = ''

    function onTileClick(): void {
        setClipboard(aliasId, true)
    }
</script>

<ClickableTile onClick={onTileClick} classes="border-2 border-solid border-transparent {classes}" {...$$restProps}>
    <div class="w-full flex flex-row items-center text-left space-x-4">
        <Avatar icon={IconName.Alias} size="lg" textColor="brand" backgroundColor="surface-2" />

        <div class="flex flex-col overflow-hidden">
            <Text truncate>Alias</Text>
            <Text textColor="secondary" fontWeight="medium" truncate>
                {fullWidth ? aliasId : truncateString(aliasId, 7, 7)}
            </Text>
        </div>
    </div>
</ClickableTile>
