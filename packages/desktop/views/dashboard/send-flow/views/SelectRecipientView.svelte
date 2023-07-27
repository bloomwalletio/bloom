<script lang="ts">
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { ContactManager } from '@core/contact'
    import { localize } from '@core/i18n'
    import { IChain, IIscpChainConfiguration, INetwork, network } from '@core/network'
    import { visibleActiveAccounts } from '@core/profile'
    import {
        SendFlowType,
        TokenStandard,
        sendFlowParameters,
        updateSendFlowParameters,
        getChainIdFromSendFlowParameters,
        SubjectType,
        Subject,
    } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { INetworkRecipientSelectorOption, NetworkRecipientSelector } from '@ui'
    import { onMount } from 'svelte'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'
    import { getAssetStandard } from '@core/wallet/actions/getTokenStandartFromSendFlowParameters'

    let networkAddress = $sendFlowParameters?.layer2Parameters?.networkAddress
    let selectorOptions: INetworkRecipientSelectorOption[] = []
    let selectedIndex = -1

    const assetName = getAssetName()

    $: selectedOption = selectorOptions[selectedIndex]
    $: isLayer2 = !!networkAddress

    $: networkAddress = selectedOption?.networkAddress ?? $sendFlowParameters?.layer2Parameters?.networkAddress
    $: recipient = selectedOption?.selectedRecipient ?? $sendFlowParameters?.recipient

    function getAssetName(): string | undefined {
        if ($sendFlowParameters?.type === SendFlowType.BaseCoinTransfer) {
            return $sendFlowParameters.baseCoinTransfer.asset?.metadata.name
        } else if ($sendFlowParameters?.type === SendFlowType.TokenTransfer) {
            return $sendFlowParameters.tokenTransfer.asset?.metadata.name
        } else if ($sendFlowParameters?.type === SendFlowType.NftTransfer) {
            return $sendFlowParameters.nft.name
        } else {
            return ''
        }
    }

    function buildNetworkRecipientOptions(): void {
        selectorOptions = getRecipientOptions()
        selectedIndex =
            networkAddress && selectorOptions.length
                ? selectorOptions.findIndex((option) => option.networkAddress === networkAddress)
                : 0

        setInitialRecipient()
    }

    function setInitialRecipient(): void {
        selectorOptions = selectorOptions.map((option, index) =>
            index === selectedIndex
                ? {
                      ...option,
                      recipient: $sendFlowParameters?.recipient,
                  }
                : option
        )
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

    function getContactRecipientsForNetwork(networkId: string): Subject[] {
        const recipients: Subject[] = ContactManager.listContactAddressesForNetwork(networkId).map((address) => {
            const contact = ContactManager.getContact(address.contactId)
            return {
                type: SubjectType.Contact,
                address: address.address,
                contact,
            }
        })
        return [...new Map(recipients.map((recipient) => [recipient?.['contact']?.['id'], recipient])).values()]
    }

    function getLayer1RecipientOption(
        sourceNetwork: INetwork,
        accountIndexToExclude?: number
    ): INetworkRecipientSelectorOption {
        const name = sourceNetwork.getMetadata().name
        return {
            name,
            networkAddress: '',
            recipients: [...getLayer1AccountRecipients(accountIndexToExclude), ...getContactRecipientsForNetwork(name)],
        }
    }

    function getLayer2AccountRecipients(coinType: number, accountIndexToExclude?: number): Subject[] {
        return $visibleActiveAccounts
            .filter(
                (account) => account.index !== accountIndexToExclude && account.evmAddresses?.[coinType] !== undefined
            )
            .map((account) => ({
                type: SubjectType.Account,
                account,
                address: account.evmAddresses?.[coinType],
            }))
    }

    function getRecipientOptionFromChain(
        chain: IChain,
        accountIndexToExclude?: number
    ): INetworkRecipientSelectorOption {
        const chainConfig = chain.getConfiguration() as IIscpChainConfiguration
        return {
            chainId: chainConfig.chainId,
            name: chainConfig.name,
            networkAddress: chainConfig.aliasAddress,
            recipients: [
                ...getLayer2AccountRecipients(chainConfig.coinType, accountIndexToExclude),
                ...getContactRecipientsForNetwork(chainConfig.name),
            ], // TODO: We use the name here, because we use that currently as the key for the network addresses. This should be updated
        }
    }

    function getRecipientOptions(): INetworkRecipientSelectorOption[] {
        if (!$network || !$sendFlowParameters) {
            return []
        }

        const layer1Network = getLayer1RecipientOption($network, $selectedAccountIndex)
        if (!features?.network?.layer2?.enabled) {
            return [layer1Network]
        }

        const assetStandard = getAssetStandard($sendFlowParameters)
        const sourceChainId = getChainIdFromSendFlowParameters($sendFlowParameters)
        const sourceChain = $network.getChain(sourceChainId)

        let networkRecipientOptions = []

        switch (assetStandard) {
            case TokenStandard.Irc27:
            case TokenStandard.Irc30:
            case TokenStandard.BaseToken:
                if (!sourceChainId) {
                    networkRecipientOptions = [
                        layer1Network,
                        ...$network
                            .getIscpChains()
                            .map((chain) => getRecipientOptionFromChain(chain, $selectedAccountIndex)),
                    ]
                } else if (sourceChain) {
                    networkRecipientOptions = [
                        getRecipientOptionFromChain(sourceChain, $selectedAccountIndex),
                        layer1Network,
                    ]
                }
                break
            case TokenStandard.Erc20:
                if (sourceChain) {
                    networkRecipientOptions = [getRecipientOptionFromChain(sourceChain, $selectedAccountIndex)]
                }
                break
        }

        return networkRecipientOptions
    }

    function onContinueClick(): void {
        const layer2Parameters = isLayer2
            ? {
                  chainId: selectedOption.chainId,
                  networkAddress: selectedOption?.networkAddress,
                  senderAddress: $selectedAccount.depositAddress,
              }
            : null
        updateSendFlowParameters({
            type: $sendFlowParameters?.type,
            recipient,
            layer2Parameters,
        })
        $sendFlowRouter.next()
    }

    function onBackClick(): void {
        updateSendFlowParameters({
            type: $sendFlowParameters?.type,
            recipient: undefined,
            layer2Parameters: undefined,
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

<SendFlowTemplate
    title={localize('popups.transaction.selectRecipient', {
        values: { assetName },
    })}
    leftButton={{
        text: localize($sendFlowRouter.hasHistory() ? 'actions.back' : 'actions.cancel'),
        onClick: onBackClick,
    }}
    rightButton={{
        text: localize('actions.continue'),
        onClick: onContinueClick,
        disabled:
            networkAddress === undefined ||
            !recipient ||
            (recipient.type === SubjectType.Address && !recipient.address) ||
            (recipient.type === SubjectType.Contact && !recipient.address && !recipient.contact) ||
            (recipient.type === SubjectType.Account && !recipient.account),
    }}
>
    <NetworkRecipientSelector bind:options={selectorOptions} bind:selectedIndex />
</SendFlowTemplate>
