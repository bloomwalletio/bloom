<script lang="ts">
    import { Alert } from '@bloomwalletio/ui'
    import { selectedAccountIndex } from '@core/account/stores'
    import { ContactManager } from '@core/contact/classes'
    import { localize } from '@core/i18n'
    import {
        IEvmNetwork,
        NetworkId,
        getActiveNetworkId,
        isEvmNetwork,
        getEvmNetwork,
        getiscChains,
        getL1Network,
    } from '@core/network'
    import { visibleActiveAccounts } from '@core/profile/stores'
    import {
        SendFlowType,
        sendFlowParameters,
        updateSendFlowParameters,
        SubjectType,
        Subject,
        getNetworkIdFromSendFlowParameters,
    } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { INetworkRecipientSelectorOption, NetworkRecipientSelector } from '@ui'
    import { onMount } from 'svelte'
    import { sendFlowRouter } from '../send-flow.router'
    import { PopupTemplate } from '@components'
    import { getTokenStandardFromSendFlowParameters } from '@core/wallet/utils'
    import { TokenStandard } from '@core/token'
    import { canAccountMakeEvmTransaction } from '@core/layer-2/actions'
    import { NftStandard } from '@core/nfts'

    let selector: NetworkRecipientSelector
    let selectorOptions: INetworkRecipientSelectorOption[] = []
    let selectedIndex = -1

    const assetName = getAssetName()

    let selectedNetworkId: NetworkId
    $: selectedNetworkId = selectorOptions[selectedIndex]?.networkId
    $: selectedRecipient = selectorOptions[selectedIndex]?.selectedRecipient

    let hasNetworkRecipientError: boolean = false
    $: {
        const originNetworkId = getNetworkIdFromSendFlowParameters($sendFlowParameters)
        if (originNetworkId && isEvmNetwork(originNetworkId)) {
            hasNetworkRecipientError = !canAccountMakeEvmTransaction(
                $selectedAccountIndex,
                originNetworkId,
                $sendFlowParameters?.type
            )
        } else {
            hasNetworkRecipientError = false
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
            : selectorOptions.findIndex(
                  (option) => option.networkId === getNetworkIdFromSendFlowParameters($sendFlowParameters)
              ) ?? 0

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

    function getLayer2AccountRecipients(coinType: number, accountIndexToExclude?: number): Subject[] {
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

    function getRecipientOptionFromChain(
        evmNetwork: IEvmNetwork,
        accountIndexToExclude?: number
    ): INetworkRecipientSelectorOption {
        return {
            networkId: evmNetwork.id,
            name: evmNetwork.name,
            recipients: [
                ...getLayer2AccountRecipients(evmNetwork.coinType, accountIndexToExclude),
                ...getContactRecipientsForNetwork(evmNetwork.id),
            ],
        }
    }

    function getRecipientOptions(): INetworkRecipientSelectorOption[] {
        if (!$sendFlowParameters) {
            return []
        }

        const layer1Network = getLayer1RecipientOption($selectedAccountIndex)
        if (!features?.network?.layer2?.enabled) {
            return [layer1Network]
        }

        const assetStandard = getTokenStandardFromSendFlowParameters($sendFlowParameters)
        const sourceNetworkId = getNetworkIdFromSendFlowParameters($sendFlowParameters)
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
                        ...getiscChains().map((evmNetwork) => getRecipientOptionFromChain(evmNetwork)),
                    ]
                } else if (sourceChain) {
                    // if we are on layer 2
                    networkRecipientOptions = [
                        ...(features.wallet.assets.unwrapToken.enabled ? [getLayer1RecipientOption()] : []),
                        getRecipientOptionFromChain(sourceChain, $selectedAccountIndex),
                    ]
                }
                break
            case TokenStandard.Erc20:
            case NftStandard.Erc721:
                if (sourceChain) {
                    networkRecipientOptions = [getRecipientOptionFromChain(sourceChain, $selectedAccountIndex)]
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
            hasError={hasNetworkRecipientError}
            bind:this={selector}
            bind:options={selectorOptions}
            bind:selectedIndex
        />
    </form>
    {#if hasNetworkRecipientError}
        <Alert variant="danger" text={localize('error.send.insufficientFundsGasFee')} />
    {/if}
</PopupTemplate>
