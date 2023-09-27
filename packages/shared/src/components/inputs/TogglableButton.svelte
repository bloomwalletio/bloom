<script lang="ts">
    import { IconButton, IconName } from '@bloomwalletio/ui'

    export let icon: IconName
    export let active: boolean = false
    export let onClick: () => void = () => {}

    function clickToggle(): void {
        active = !active
        onClick && onClick()
    }
</script>

<IconButton {icon} size="sm" textColor={active ? 'primary' : 'secondary'} on:click={clickToggle} />
