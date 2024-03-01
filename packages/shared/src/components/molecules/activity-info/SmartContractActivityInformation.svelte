<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { ActivityType, StardustSmartContractActivity, StardustTransactionActivity } from '@core/activity'

    export let activity: StardustTransactionActivity | StardustSmartContractActivity
</script>

<Table
    items={activity.type === ActivityType.SmartContract
        ? [
              {
                  key: localize('general.methodName'),
                  value: activity.methodName,
                  copyable: true,
              },
              {
                  key: localize('general.data'),
                  value: activity.data,
                  copyable: true,
              },
          ]
        : [
              {
                  key: localize('general.targetContract'),
                  value: activity?.smartContract?.targetContract,
                  copyable: true,
              },
              {
                  key: localize('general.contractFunction'),
                  value: activity?.smartContract?.contractFunction,
                  copyable: true,
              },
          ]}
/>
