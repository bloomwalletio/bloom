<script lang="ts">
    import { Icon, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { getBestTimeDuration } from '@core/utils'
    import { NotifyClientTypes } from '@walletconnect/notify-client'

    export let notification: NotifyClientTypes.NotifyNotification
</script>

<Tile class="!rounded-none">
    <div class="flex justify-between gap-2 w-full">
        <icon-container
            class="w-12 h-12 flex justify-center items-center rounded-xl shrink-0"
            style:background-color={'#fff'}
        >
            <Icon name={IconName.Bell} customColor={'brand'} size="sm" />
        </icon-container>
        <div class="flex-grow flex flex-col items-start">
            <div class="flex justify-between items-center gap-2">
                <Text type="sm" lineClamp={1}>{notification.title}</Text>
                <Text type="xs" fontWeight="normal"
                    >{getBestTimeDuration(new Date().getTime() - notification.sentAt, 'day', true)}</Text
                >
            </div>
            <Text type="xs" fontWeight="normal" lineClamp={2}>{notification.body}</Text>
        </div>
    </div>
</Tile>
