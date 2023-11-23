<script lang="ts">
    import { Link, Text } from '@bloomwalletio/ui'
    import { CoreTypes } from '@walletconnect/types'

    export let metadata: CoreTypes.Metadata
</script>

<dapp-information>
    <img class="dapp-image" src={metadata?.icons?.[0]} alt={metadata?.name} />
    <div class="flex flex-col">
        <Text type="body2">
            {metadata?.name}
        </Text>
        <Link text={metadata?.url} />
    </div>
</dapp-information>

<style lang="scss">
    dapp-information {
        @apply h-[92px] w-full p-6;
        @apply flex flex-row items-center justify-center gap-3;
        @apply bg-surface-0 dark:bg-surface-0-dark;
    }

    .dapp-image {
        width: 40px;
        height: 40px;
        border-radius: 40px;
    }
</style>
