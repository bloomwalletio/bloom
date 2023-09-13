<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { Platform } from '@core/app'
    import { Icon } from '@ui'
</script>

<button
    on:click={Platform.popupMenu}
    class="flex justify-center items-center p-3 text-gray-500 dark:text-gray-100 w-20"
    type="button"
>
    <Icon icon={IconEnum.Hamburger} />
</button>
