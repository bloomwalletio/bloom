<script lang="ts">
    import { Icon, IconName, Pill, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Pane } from '@ui'
</script>

<Pane classes="flex flex-col items-center w-full p-6 gap-4 bg-surface dark:bg-surface-dark shadow-lg">
    <div class="w-full flex justify-between items-center">
        <img data-label="transak-logo" width="90" height="29" src="assets/logos/transak.png" alt="Transak" />
        <div>
            <Pill color="success">{localize('general.connected')}</Pill>
        </div>
    </div>
    <div class="flex items-center gap-1 w-full">
        <Icon name={IconName.ShieldOn} textColor="success" size="xxs" />
        <Text type="sm" textColor="secondary">www.transak.com</Text>
    </div>
</Pane>
