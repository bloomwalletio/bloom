<script lang="ts">
    import { onMount } from 'svelte'
    import { Button, FontWeight, NftImageOrIconBox, Tabs, Text, TextType } from '@ui'
    import { Table } from '@bloomwalletio/ui'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { CURRENT_IRC27_VERSION } from '@core/nfts'
    import { checkActiveProfileAuth, getBaseToken } from '@core/profile/actions'
    import { getClient } from '@core/profile-manager'
    import { formatTokenAmountPrecise } from '@core/token'
    import { buildNftOutputBuilderParams, mintNft, mintNftDetails } from '@core/wallet'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'

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

    async function prepareNftOutput(): Promise<void> {
        const outputData = buildNftOutputBuilderParams(irc27Metadata, $selectedAccount.depositAddress)
        const client = await getClient()
        const preparedOutput = await client.buildNftOutput(outputData)
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
    <Text type={TextType.h4} fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('popups.mintNftForm.title')}
    </Text>
    <div class="space-y-2 max-h-100 scrollable-y flex-1">
        <nft-details class="flex flex-col justify-center items-center space-y-4">
            <NftImageOrIconBox size="large" {type} />
            <activity-details class="w-full h-full space-y-2 flex flex-auto flex-col shrink-0">
                <Tabs bind:activeTab {tabs} />
                {#if activeTab === Tab.Transaction}
                    <Table
                        items={[
                            {
                                key: localize('general.quantity'),
                                value: quantity > 1 ? quantity : undefined,
                            },
                            {
                                key: localize('general.storageDepositPerNft'),
                                value:
                                    quantity > 1 ? formatTokenAmountPrecise(storageDeposit, getBaseToken()) : undefined,
                            },
                            {
                                key: localize('general.totalStorageDeposit'),
                                value:
                                    quantity > 1
                                        ? formatTokenAmountPrecise(totalStorageDeposit, getBaseToken())
                                        : undefined,
                            },
                            {
                                key: localize('general.storageDeposit'),
                                value:
                                    quantity === 0
                                        ? formatTokenAmountPrecise(storageDeposit, getBaseToken())
                                        : undefined,
                            },
                            {
                                key: localize('general.immutableIssuer'),
                                value: $selectedAccount?.depositAddress,
                            },
                        ]}
                    />
                {:else if activeTab === Tab.Nft}
                    <Table
                        items={[
                            {
                                key: localize('general.name'),
                                value: name,
                            },
                            {
                                key: localize('general.description'),
                                value: description ? description : undefined,
                            },
                            {
                                key: localize('general.uri'),
                                value: uri,
                            },
                            {
                                key: localize('general.issuerName'),
                                value: issuerName ? issuerName : undefined,
                            },
                            {
                                key: localize('general.collectionName'),
                                value: collectionName ? collectionName : undefined,
                            },
                        ]}
                    />
                {:else if activeTab === Tab.Metadata}
                    <Table
                        items={[
                            {
                                key: localize('general.metadata'),
                                value: irc27Metadata,
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
