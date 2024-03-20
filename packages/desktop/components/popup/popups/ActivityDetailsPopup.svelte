<script lang="ts">
    import { selectedAccountActivities } from '@core/activity'
    import { NetworkNamespace } from '@core/network'
    import StardustActivityDetailsPopup from './StardustActivityDetailsPopup.svelte'
    import EvmActivityDetailsPopup from './EvmActivityDetailsPopup.svelte'

    export let activityId: string

    $: activity = $selectedAccountActivities.find((_activity) => _activity.id === activityId)
</script>

{#if activity?.namespace === NetworkNamespace.Stardust}
    <StardustActivityDetailsPopup {activity} />
{:else if activity?.namespace === NetworkNamespace.Evm}
    <EvmActivityDetailsPopup {activity} />
{:else}
    <!-- else content here -->
{/if}
