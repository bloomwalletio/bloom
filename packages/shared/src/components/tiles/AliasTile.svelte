<script lang="ts">
    import { ClickableTile, Text, FontWeight, Icon } from '@ui'
    import { setClipboard, truncateString } from '@core/utils'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let aliasId: string
    export let fullWidth = true
    export let classes = ''

    function onTileClick(): void {
        setClipboard(aliasId, true)
    }
</script>

<ClickableTile onClick={onTileClick} classes="border-2 border-solid border-transparent {classes}" {...$$restProps}>
    <div class="w-full flex flex-row items-center text-left space-x-4">
        <div class="relative flex w-8 h-8">
            <div class="rounded-full flex justify-center items-center transition-none p-1 w-8 h-8 bg-gray-500">
                <Icon
                    icon={IconEnum.Alias}
                    width="83.33333%"
                    height="83.33333%"
                    classes="text-white dark:text-gray-800 text-center"
                />
            </div>
        </div>

        <div class="flex flex-col gap-1 overflow-hidden">
            <Text classes="text-ellipsis overflow-hidden whitespace-nowrap" fontWeight={FontWeight.semibold}>
                Alias
            </Text>
            <Text secondary classes="text-ellipsis overflow-hidden" smaller>
                {fullWidth ? aliasId : truncateString(aliasId, 7, 7)}
            </Text>
        </div>
    </div>
</ClickableTile>
