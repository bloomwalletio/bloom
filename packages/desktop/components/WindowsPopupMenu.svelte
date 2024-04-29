<script lang="ts">
    import { Platform } from '@core/app'
    import { Icon, IconName } from '@bloomwalletio/ui'
</script>

<button
    on:click={Platform.popupMenu}
    class="flex justify-center items-center p-3 text-gray-500 dark:text-gray-100"
    type="button"
>
    <Icon name={IconName.WindowsHamburger} />
</button>
