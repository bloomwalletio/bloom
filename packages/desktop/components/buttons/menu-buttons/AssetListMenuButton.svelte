<script lang="ts">
    import { AssetListMenu } from '@components'
    import { Modal, MeatballMenuButton } from '@ui'

    let modal: Modal
</script>

<account-actions-button class="block relative">
    <MeatballMenuButton onClick={modal?.toggle} />
    <AssetListMenu bind:modal position={{ right: '0' }} classes="mt-1.5" />
</account-actions-button>
