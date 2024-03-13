<script lang="ts">
    import { IAccountState } from '@core/account'
    import { Indicator, Text } from '@bloomwalletio/ui'

    export let account: IAccountState
</script>

<div class="flex flex-row items-center space-x-3">
    <Indicator color={account.color} />
    <Text textColor="secondary">
        {account.name}
    </Text>
</div>
