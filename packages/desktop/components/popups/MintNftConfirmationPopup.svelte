<script lang="ts">
    import { type IItem, Table } from '@bloomwalletio/ui'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { CURRENT_IRC27_VERSION } from '@core/nfts'
    import { checkActiveProfileAuth, getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountPrecise } from '@core/token'
    import { buildNftOutputData, mintNft, mintNftDetails } from '@core/wallet'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { Button, FontWeight, NftImageOrIconBox, Tabs, Text } from '@ui'
    import { onMount } from 'svelte'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    enum Tab {
        Transaction = 'general.transaction',
        Nft = 'general.nft',
        Metadata = 'general.metadata',
    }

    const tabs: Tab[] = [Tab.Transaction, Tab.Nft, Tab.Metadata]
    let activeTab = Tab.Transaction

    let storageDeposit: number = 0
    let totalStorageDeposit: number = 0
    const { standard, type, uri, name, collectionName, royalties, issuerName, description, attributes, quantity } =
        $mintNftDetails || {}

    $: irc27Metadata = {
        standard,
        version: CURRENT_IRC27_VERSION,
        name,
        type,
        uri,
        ...(collectionName && { collectionName }),
        ...(royalties && { royalties }),
        ...(issuerName && { issuerName }),
        ...(description && { description }),
        ...(attributes && { attributes }),
    }

    let nftTabDetails: { [key in string]: string }
    $: {
        nftTabDetails = {
            name,
            ...(description && { description }),
            uri,
            ...(issuerName && { issuerName }),
            ...(collectionName && { collectionName }),
        }
    }

    let transactionTabItems: IItem[] = []
    $: activeTab === Tab.Transaction && setTransactionTabItems(quantity)
    function setTransactionTabItems(quantity: number): void {
        transactionTabItems = []

        if (quantity > 1) {
            transactionTabItems.push({
                key: localize('general.quantity'),
                value: quantity,
            })
            transactionTabItems.push({
                key: localize('general.storageDepositPerNft'),
                value: formatTokenAmountPrecise(storageDeposit, getBaseToken()),
            })
            transactionTabItems.push({
                key: localize('general.totalStorageDeposit'),
                value: formatTokenAmountPrecise(totalStorageDeposit, getBaseToken()),
            })
        } else {
            transactionTabItems.push({
                key: localize('general.storageDeposit'),
                value: formatTokenAmountPrecise(storageDeposit, getBaseToken()),
            })
        }
        transactionTabItems.push({
            key: localize('general.immutableIssuer'),
            value: $selectedAccount.depositAddress,
        })
    }

    async function prepareNftOutput(): Promise<void> {
        const outputData = buildNftOutputData(irc27Metadata, $selectedAccount.depositAddress)
        const preparedOutput = await $selectedAccount.buildNftOutput(outputData)
        storageDeposit = Number(preparedOutput.amount) ?? 0
        totalStorageDeposit = storageDeposit * quantity
    }

    async function mintAction(): Promise<void> {
        try {
            await mintNft(irc27Metadata, Number(quantity))
            closePopup()
        } catch (err) {
            handleError(err)
        }
    }

    function onBackClick(): void {
        closePopup()
        openPopup({
            id: PopupId.MintNftForm,
            overflow: true,
        })
    }

    async function onConfirmClick(): Promise<void> {
        try {
            await checkActiveProfileAuth(mintAction, { stronghold: true, ledger: false })
        } catch (err) {
            handleError(err)
        }
    }

    onMount(async () => {
        try {
            await _onMount()
            await prepareNftOutput()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<div class="space-y-6">
    <Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('popups.mintNftForm.title')}
    </Text>
    <div class="space-y-2 max-h-100 scrollable-y flex-1">
        <nft-details class="flex flex-col justify-center items-center space-y-4">
            <NftImageOrIconBox size="large" {type} />
            <activity-details class="w-full h-full space-y-2 flex flex-auto flex-col shrink-0">
                <Tabs bind:activeTab {tabs} />
                {#if activeTab === Tab.Transaction}
                    <Table items={transactionTabItems} />
                {:else if activeTab === Tab.Nft}
                    <Table
                        items={Object.entries(nftTabDetails).map(([key, value]) => ({
                            key: localize(`general.${key}`),
                            value,
                        }))}
                    />
                {:else if activeTab === Tab.Metadata}
                    <!-- Todo we need to create a code display component -->
                    <Table
                        orientation="vertical"
                        items={[
                            {
                                key: localize('general.metadata'),
                                value: JSON.stringify(irc27Metadata, null, '\t'),
                                copyable: true,
                            },
                        ]}
                    />
                {/if}
            </activity-details>
        </nft-details>
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={$selectedAccount.isTransferring} onClick={onBackClick}>
            {localize('actions.back')}
        </Button>
        <Button
            classes="w-full"
            disabled={$selectedAccount.isTransferring}
            onClick={onConfirmClick}
            isBusy={$selectedAccount.isTransferring}
        >
            {localize('actions.confirm')}
        </Button>
    </div>
</div>
