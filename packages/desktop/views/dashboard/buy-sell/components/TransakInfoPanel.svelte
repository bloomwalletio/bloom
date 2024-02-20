<script lang="ts">
    import { Pill, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Pane } from '@ui'
</script>

<Pane classes="flex flex-col justify-start items-start w-full p-6 gap-4 bg-surface dark:bg-surface-dark shadow-lg">
    <Pill color="brand">{localize('general.info')}</Pill>
    <Text color="secondary">{localize('views.buySell.info.receive')}</Text>
    <Text color="secondary">{localize('views.buySell.info.multipleAccounts')}</Text>
    <Text color="secondary">{localize('views.buySell.info.changingAccounts')}</Text>
</Pane>
