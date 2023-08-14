<script lang="ts">
    import { IToken } from '@core/token'
    import { Modal, TokenActionsMenuModal, MeatballMenuButton } from '@ui'

    export let token: IToken

    let modal: Modal
</script>

<div class="max-h-7 max-w-9 flex-none flex-initial overflow-visible relative">
    <MeatballMenuButton onClick={modal?.toggle} />
    <TokenActionsMenuModal bind:modal {token} position={{ right: '0' }} classes="mt-1.5" />
</div>
