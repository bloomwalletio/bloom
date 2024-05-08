<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { NodeListTable } from '@components'
    import { localize } from '@core/i18n'

    export let nodesContainer: HTMLElement
</script>

<div class="flex flex-col space-y-2">
    <Text type="body1">
        {localize('views.dashboard.drawers.networkConfig.networkSettings.configureNodeList.title')}
    </Text>
    <Text textColor="secondary">
        {localize('views.dashboard.drawers.networkConfig.networkSettings.configureNodeList.description')}
    </Text>
    <NodeListTable bind:nodesContainer />
</div>
