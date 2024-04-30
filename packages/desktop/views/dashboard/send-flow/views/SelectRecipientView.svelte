<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { PopupTemplate } from '@components'
    import { selectedAccountIndex } from '@core/account/stores'
    import { ContactManager } from '@core/contact/classes'
    import { localize } from '@core/i18n'
    import { canAccountMakeEvmTransaction } from '@core/layer-2/actions'
    import {
        IEvmNetwork,
        NetworkId,
        NetworkType,
        getActiveNetworkId,
        getEvmNetwork,
        getIscChains,
        getL1Network,
        getNetwork,
        isEvmNetwork,
    } from '@core/network'
    import { NftStandard } from '@core/nfts'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import { TokenStandard } from '@core/token'
    import { SendFlowType, Subject, SubjectType, sendFlowParameters, updateSendFlowParameters } from '@core/wallet'
    import { getTokenStandardFromSendFlowParameters } from '@core/wallet/utils'
    import { closePopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { INetworkRecipientSelectorOption, NetworkRecipientSelector } from '@ui'
    import { onMount } from 'svelte'
    import { sendFlowRouter } from '../send-flow.router'

    let selector: NetworkRecipientSelector
    let selectorOptions: INetworkRecipientSelectorOption[] = []
    let selectedIndex = -1

    const assetName = getAssetName()

    let selectedNetworkId: NetworkId
    $: selectedNetworkId = selectorOptions[selectedIndex]?.networkId
    $: selectedRecipient = selectorOptions[selectedIndex]?.selectedRecipient

    let hasInsufficientFunds = false
    $: $sendFlowParameters, void checkFundsForGas()
    async function checkFundsForGas(): Promise<void> {
        if (!$sendFlowParameters) {
            return
        }

        if ($sendFlowParameters.sourceNetworkId && isEvmNetwork($sendFlowParameters.sourceNetworkId)) {
            hasInsufficientFunds = !(await canAccountMakeEvmTransaction(
                $selectedAccountIndex,
                $sendFlowParameters.sourceNetworkId,
                $sendFlowParameters.type
            ))
        } else {
            hasInsufficientFunds = false
        }
    }

    function getAssetName(): string | undefined {
        if ($sendFlowParameters?.type === SendFlowType.BaseCoinTransfer) {
            return $sendFlowParameters.baseCoinTransfer?.token?.metadata?.name
        } else if ($sendFlowParameters?.type === SendFlowType.TokenTransfer) {
            return $sendFlowParameters.tokenTransfer?.token?.metadata?.name
        } else if ($sendFlowParameters?.type === SendFlowType.NftTransfer) {
            return $sendFlowParameters.nft?.name
        } else {
            return ''
        }
    }

    function buildNetworkRecipientOptions(): void {
        selectorOptions = getRecipientOptions()
        setInitialNetworkAndRecipient()
    }

    function setInitialNetworkAndRecipient(): void {
        selectedIndex = $sendFlowParameters?.destinationNetworkId
            ? selectorOptions.findIndex((option) => option.networkId === $sendFlowParameters?.destinationNetworkId)
            : selectorOptions.findIndex((option) => option.networkId === $sendFlowParameters?.sourceNetworkId) ?? 0

        selectorOptions[selectedIndex] = {
            ...selectorOptions[selectedIndex],
            selectedRecipient: $sendFlowParameters?.recipient,
        }
    }

    function getLayer1AccountRecipients(accountIndexToExclude?: number): Subject[] {
        return $visibleActiveAccounts
            .filter((account) => account.index !== accountIndexToExclude)
            .map((account) => ({
                type: SubjectType.Account,
                account,
                address: account.depositAddress,
            }))
    }

    function getContactRecipientsForNetwork(networkId: NetworkId): Subject[] {
        const recipients: Subject[] = ContactManager.listContactAddressesForNetwork(networkId).map((address) => {
            const contact = ContactManager.getContact(address.contactId)
            return {
                type: SubjectType.Contact,
                address: address.address,
                contact,
            } as Subject
        })
        return [...new Map(recipients.map((recipient) => [recipient?.['contact']?.['id'], recipient])).values()]
    }

    function getLayer1RecipientOption(accountIndexToExclude?: number): INetworkRecipientSelectorOption {
        const network = getL1Network()
        return {
            networkId: network.id,
            name: network.name,
            recipients: [
                ...getLayer1AccountRecipients(accountIndexToExclude),
                ...getContactRecipientsForNetwork(network.id),
            ],
        }
    }

    function getEvmAddressAccountRecipients(coinType: number, accountIndexToExclude?: number): Subject[] {
        return $visibleActiveAccounts
            .filter(
                (account) => account.index !== accountIndexToExclude && account.evmAddresses?.[coinType] !== undefined
            )
            .map(
                (account) =>
                    ({
                        type: SubjectType.Account,
                        account,
                        address: account.evmAddresses?.[coinType],
                    }) as Subject
            )
    }

    function getRecipientOptionForEvmNetwork(
        evmNetwork: IEvmNetwork,
        accountIndexToExclude?: number
    ): INetworkRecipientSelectorOption {
        return {
            networkId: evmNetwork.id,
            name: evmNetwork.name,
            recipients: [
                ...getEvmAddressAccountRecipients(evmNetwork.coinType, accountIndexToExclude),
                ...getContactRecipientsForNetwork(evmNetwork.id),
            ],
        }
    }

    function getRecipientOptions(): INetworkRecipientSelectorOption[] {
        const sourceNetworkId = $sendFlowParameters?.sourceNetworkId
        if (!$sendFlowParameters || !sourceNetworkId) {
            return []
        }

        const sourceNetwork = getNetwork(sourceNetworkId)

        if (!sourceNetwork) {
            return []
        }

        switch (sourceNetwork.type) {
            case NetworkType.Evm: {
                const networkRecipientOptions: INetworkRecipientSelectorOption[] = [
                    getRecipientOptionForEvmNetwork(sourceNetwork, $selectedAccountIndex),
                ]
                return networkRecipientOptions
            }
            case NetworkType.Isc:
                break
            case NetworkType.Stardust:
                break
            default:
                return []
        }

        const layer1Network = getLayer1RecipientOption($selectedAccountIndex)
        if (!features?.network?.layer2?.enabled) {
            return [layer1Network]
        }

        const assetStandard = getTokenStandardFromSendFlowParameters($sendFlowParameters)
        const sourceChain = sourceNetworkId ? getEvmNetwork(sourceNetworkId) : undefined

        let networkRecipientOptions: INetworkRecipientSelectorOption[] = []

        switch (assetStandard) {
            case NftStandard.Irc27:
            case TokenStandard.Irc30:
            case TokenStandard.BaseToken:
                if (sourceNetworkId === getActiveNetworkId()) {
                    // if we are on layer 1
                    networkRecipientOptions = [
                        layer1Network,
                        ...getIscChains().map((iscChain) => getRecipientOptionForEvmNetwork(iscChain)),
                    ]
                } else if (sourceChain) {
                    // if we are on layer 2
                    networkRecipientOptions = [
                        ...(features.wallet.assets.unwrapToken.enabled ? [getLayer1RecipientOption()] : []),
                        getRecipientOptionForEvmNetwork(sourceChain, $selectedAccountIndex),
                    ]
                }
                break
            case TokenStandard.Erc20:
            case NftStandard.Erc721:
                if (sourceChain) {
                    networkRecipientOptions = [getRecipientOptionForEvmNetwork(sourceChain, $selectedAccountIndex)]
                }
                break
        }

        return networkRecipientOptions
    }

    function onContinueClick(): void {
        if (validate()) {
            updateSendFlowParameters({
                type: $sendFlowParameters?.type,
                destinationNetworkId: selectedNetworkId,
                recipient: selectedRecipient,
            })
            $sendFlowRouter.next()
        }
    }

    function validate(): boolean {
        try {
            selector?.validate()
            return true
        } catch (err) {
            return false
        }
    }

    function onBackClick(): void {
        updateSendFlowParameters({
            type: $sendFlowParameters?.type,
            recipient: undefined,
        })
        if (!$sendFlowRouter.hasHistory()) {
            closePopup()
        } else {
            $sendFlowRouter.previous()
        }
    }
    onMount(() => {
        buildNetworkRecipientOptions()
    })
</script>

<PopupTemplate
    title={localize('popups.transaction.selectRecipient', {
        values: { assetName },
    })}
    backButton={{
        text: localize($sendFlowRouter.hasHistory() ? 'actions.back' : 'actions.cancel'),
        onClick: onBackClick,
    }}
    continueButton={{
        form: 'select-recipient-form',
        text: localize('actions.continue'),
        onClick: onContinueClick,
        disabled: !selectedNetworkId || !selectedRecipient?.address,
    }}
>
    <form on:submit|preventDefault={onContinueClick} id="select-recipient-form">
        <NetworkRecipientSelector
            hasError={hasInsufficientFunds}
            bind:this={selector}
            bind:options={selectorOptions}
            bind:selectedIndex
        />
    </form>
    {#if hasInsufficientFunds}
        <Alert variant="danger" text={localize('error.send.insufficientFundsGasFee')} />
    {/if}
</PopupTemplate>
