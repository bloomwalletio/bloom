<script lang="ts">
    import { Table, Avatar, Tabs } from '@bloomwalletio/ui'
    import { getSelectedAccount, selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { CURRENT_IRC27_VERSION, IIrc27Metadata } from '@core/nfts'
    import { getClient } from '@core/profile-manager'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { formatTokenAmount } from '@core/token'
    import { buildNftOutputBuilderParams, mintNftCollection, mintNftCollectionDetails } from '@core/wallet'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { MediaIcon, PopupTab, getTabItems } from '@ui'
    import { onMount } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { getL1Network } from '@core/network'

    const TABS = getTabItems([PopupTab.Transaction, PopupTab.Nft, PopupTab.NftMetadata])
    const network = getL1Network()

    let selectedTab = TABS[0]

    let storageDeposit: number = 0
    const { standard, type, uri, name, issuerName, description, attributes } = $mintNftCollectionDetails || {}

    $: irc27Metadata = {
        standard,
        version: CURRENT_IRC27_VERSION,
        name,
        type,
        uri,
        ...(issuerName && { issuerName }),
        ...(description && { description }),
        ...(attributes && { attributes }),
    } as IIrc27Metadata

    async function setStorageDeposit(): Promise<void> {
        try {
            const { depositAddress } = getSelectedAccount()
            const outputData = buildNftOutputBuilderParams(irc27Metadata, depositAddress)
            const client = await getClient()
            const preparedOutput = await client.buildNftOutput(outputData)

            storageDeposit = Number(preparedOutput.amount) ?? 0
        } catch (err) {
            handleError(err)
        }
    }

    function onBackClick(): void {
        closePopup()
        openPopup({
            id: PopupId.MintNftCollectionForm,
            overflow: true,
            confirmClickOutside: true,
        })
    }

    async function onConfirmClick(): Promise<void> {
        try {
            await checkActiveProfileAuth()
        } catch (err) {
            return
        }

        try {
            await mintNftCollection(irc27Metadata)
            closePopup()
        } catch (err) {
            handleError(err)
        }
    }

    onMount(() => {
        try {
            void setStorageDeposit()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<PopupTemplate
    title={localize('popups.mintNftForm.title')}
    backButton={{
        text: localize('actions.back'),
        disabled: $selectedAccount?.isTransferring,
        onClick: onBackClick,
    }}
    continueButton={{
        text: localize('actions.confirm'),
        disabled: $selectedAccount?.isTransferring,
        onClick: onConfirmClick,
    }}
    busy={$selectedAccount?.isTransferring}
>
    <div class="max-h-100 scrollable-y flex-1">
        <nft-details class="flex flex-col justify-center items-center space-y-5">
            <Avatar size="lg" shape="square" surface={2}>
                <MediaIcon {type} size="base" surface={2} />
            </Avatar>
            <activity-details class="w-full h-full space-y-2 flex flex-auto flex-col shrink-0">
                <Tabs bind:selectedTab tabs={TABS} />
                {#if selectedTab.key === PopupTab.Transaction}
                    <Table
                        items={[
                            {
                                key: localize('general.storageDeposit'),
                                value: formatTokenAmount(BigInt(storageDeposit), network.baseToken),
                            },
                            {
                                key: localize('general.immutableIssuer'),
                                value: $selectedAccount?.depositAddress,
                                truncate: true,
                            },
                        ]}
                    />
                {:else if selectedTab.key === PopupTab.Nft}
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
                        ]}
                    />
                {:else if selectedTab.key === PopupTab.NftMetadata}
                    <Table
                        items={[
                            {
                                key: localize('general.metadata'),
                                // @ts-expect-error IIrc27Metadata satisfies the type of JsonTreeValue
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
