<script lang="ts">
    import { WCRequestInfo } from '@auxiliary/wallet-connect/types'
    import { DappInfo } from '@ui'
    import { RequestExpirationAlert } from '@views/dashboard/drawers/dapp-config/components'

    export let requestInfo: WCRequestInfo
</script>

{#if requestInfo.dapp}
    <DappInfo
        metadata={requestInfo.dapp.metadata}
        verifiedState={requestInfo.verifiedState}
        showLink={false}
        classes="bg-surface-1 dark:bg-surface-1-dark pb-4"
    />
    <RequestExpirationAlert expiryTimestamp={requestInfo.expiryTimestamp} />
{/if}
