<script lang="ts">
    import { IAccountState } from '@core/account'
    import ColorLabel from './ColorLabel.svelte'

    export let account: IAccountState
    export let selected = true
</script>

<ColorLabel color={account?.color} text={account?.name} {selected} />
