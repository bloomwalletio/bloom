<script lang="ts">
    import { localize } from "@core/i18n"
    import { KeyValue, Pane } from "@ui";
    import { Button, NumberInput, Pill, SelectInput, Tabs, Text } from "@bloomwalletio/ui"
    import { AccountSwitcher } from "@components"

    const TABS = [
        { key: 'buy', value: 'Buy tokens' },
        { key: 'sell', value: 'Sell tokens' },
    ]

    const PAYMENT_METHODS = [
        { key: 'credit-card', value: 'Credit card' },
        { key: 'bank-transfer', value: 'Bank transfer' },
    ]

    let selectedTab: KeyValue<string>

    let selectedPaymentMethod = PAYMENT_METHODS[0]
</script>

<div class="flex gap-4 h-full w-full">
    <div class="flex flex-col gap-4 w-1/2">
        <Pane classes="flex flex-col justify-start items-start w-full p-6 gap-4 bg-surface dark:bg-surface-dark shadow-lg">
            <Pill color="brand">{localize('general.info')}</Pill>
            <Text color="secondary">
                Don't invest unless you're prepared to lose all the money you invest.
                This is a high-risk investment and you are unlikely to be protected if something goes wrong.
            </Text>
        </Pane>
        <Pane classes="flex-1 flex flex-col justify-between items-center w-full p-6 gap-4 bg-surface dark:bg-surface-dark shadow-lg">
            <div class="flex flex-col justify-center items-center w-full gap-4">
                <div class="w-1/2">
                    <Tabs bind:selectedTab tabs={TABS} />
                </div>
                <AccountSwitcher compact placement="bottom-end" />
                <NumberInput value={0} label="Crypto" />
                <NumberInput value={0} label="Fiat" />
                <SelectInput bind:selected={selectedPaymentMethod} options={PAYMENT_METHODS} label="Payment method" />
            </div>
            <Button text="Buy now"></Button>
        </Pane>
    </div>
</div>
