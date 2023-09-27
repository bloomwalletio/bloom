<script lang="ts">
    import { localize } from '@core/i18n'
    import { getActiveNetworkId } from '@core/network'
    import { openPopup, PopupId } from '../../../../desktop/lib/auxiliary/popup'

    export let text: string = localize('actions.receive')

    function onClick(): void {
        openPopup({
            id: PopupId.ReceiveAddress,
            props: {
                selectedNetworkId: getActiveNetworkId(),
            },
        })
    }
</script>

<button class="action py-3 px-8 text-center rounded-lg font-medium text-14 bg-blue-500 text-white" on:click={onClick}>
    {text}
</button>
