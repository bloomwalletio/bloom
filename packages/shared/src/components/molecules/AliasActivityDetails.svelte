<script lang="ts">
    import { AddressBox } from '@ui'
    import { AliasActivity } from '@core/activity'

    export let activity: AliasActivity
</script>

<main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
    <AddressBox clearBackground clearPadding isCopyable address={activity.aliasId} />
</main-content>
