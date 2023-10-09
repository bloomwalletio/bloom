<script lang="ts">
    import { Table, Avatar, Tabs } from '@bloomwalletio/ui'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { CURRENT_IRC27_VERSION } from '@core/nfts'
    import { getClient } from '@core/profile-manager'
    import { checkActiveProfileAuth, getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountPrecise } from '@core/token'
    import { buildNftOutputBuilderParams, mintNft, mintNftDetails } from '@core/wallet'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { MediaPlaceholder } from '@ui'
    import { onMount } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    enum Tab {
        Transaction = 'transaction',
        Nft = 'nft',
        Metadata = 'metadata',
    }
    const TABS = [
        { key: Tab.Transaction, value: localize('general.transaction') },
        { key: Tab.Nft, value: localize('general.nft') },
        { key: Tab.Metadata, value: localize('general.metadata') },
    ]

    let selectedTab = TABS[0]

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

<PopupTemplate
    title={localize('popups.mintNftForm.title')}
    backButton={{
        text: localize('actions.back'),
        disabled: $selectedAccount.isTransferring,
        onClick: onBackClick,
    }}
    continueButton={{
        text: localize('actions.confirm'),
        disabled: $selectedAccount.isTransferring,
        onClick: onConfirmClick,
    }}
    busy={$selectedAccount.isTransferring}
>
    <div class="space-y-2 max-h-100 scrollable-y flex-1">
        <nft-details class="flex flex-col justify-center items-center space-y-4">
            <Avatar size="lg" shape="square" surface={2}>
                <MediaPlaceholder {type} smallIcon />
            </Avatar>
            <activity-details class="w-full h-full space-y-2 flex flex-auto flex-col items-start shrink-0">
                <div>
                    <Tabs bind:selectedTab tabs={TABS} />
                </div>
                {#if selectedTab.key === Tab.Transaction}
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
                                truncate: true,
                            },
                        ]}
                    />
                {:else if selectedTab.key === Tab.Nft}
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
                                truncate: true,
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
                {:else if selectedTab.key === Tab.Metadata}
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
</PopupTemplate>
