<script lang="ts">
    import { onMount } from 'svelte'
    import features from '@features/features'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { ContactManager } from '@core/contact'
    import { localize } from '@core/i18n'
    import { ChainType, IChain, IIscpChainConfiguration, network } from '@core/network'
    import { visibleActiveAccounts } from '@core/profile'
    import {
        sendFlowParameters,
        SendFlowType,
        Subject,
        SubjectType,
        TokenStandard,
        updateSendFlowParameters,
    } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { INetworkRecipientSelectorOption, NetworkRecipientSelector } from '@ui'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'

    let networkAddress = $sendFlowParameters?.layer2Parameters?.networkAddress
    let selectorOptions: INetworkRecipientSelectorOption[] = []
    let selectedIndex = -1

    const assetName = getAssetName()

    $: selectedOption = selectorOptions[selectedIndex]
    $: isLayer2 = !!networkAddress

    $: networkAddress = selectedOption?.networkAddress ?? $sendFlowParameters?.layer2Parameters?.networkAddress
    $: recipient = selectedOption?.selectedRecipient ?? $sendFlowParameters?.recipient

    onMount(() => {
        buildNetworkRecipientOptions()
    })

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
        if (!$network) {
            return
        }

        selectorOptions = getCompatibleTransferNetworks()
        selectedIndex =
            networkAddress && selectorOptions.length
                ? selectorOptions.findIndex((option) => option.networkAddress === networkAddress)
                : 0

        const recipients = selectorOptions.map((options) => getRecipients(options.name, options.networkAddress))
        if (recipients.length) {
            selectorOptions = selectorOptions.map((option, index) => ({
                ...option,
                recipients: recipients[index],
            }))
        }
    }

    function getRecipients(networkId: string, networkAddress?: string): Subject[] {
        return [...(networkAddress ? [] : getLayer1AccountRecipients()), ...getContactRecipients(networkId)]
    }

    function getLayer1AccountRecipients(): Subject[] {
        return $visibleActiveAccounts
            .filter((account) => account.index !== $selectedAccountIndex)
            .map(
                (account) =>
                    <Subject>{
                        type: SubjectType.Account,
                        account,
                        address: account.depositAddress,
                    }
            )
    }

    function getContactRecipients(networkId: string): Subject[] {
        const recipients = ContactManager.listContactAddressesForNetwork(networkId).map((address) => {
            const contact = ContactManager.getContact(address.contactId)
            return <Subject>{
                type: SubjectType.Contact,
                address: address.address,
                contact,
            }
        })
        return [...new Map(recipients.map((recipient) => [recipient?.['contact']?.['id'], recipient])).values()]
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

    function getCompatibleTransferNetworks(): INetworkRecipientSelectorOption[] {
        if (!$network || !$sendFlowParameters) {
            return []
        }

        if ($sendFlowParameters.type === SendFlowType.NftTransfer) {
            // TODO: Currently we only support L1 NFTs
            return [
                {
                    name: $network.getMetadata().name,
                    networkAddress: '',
                },
            ]
        } else {
            let compatibleNetworks: INetworkRecipientSelectorOption[] = []

            const asset =
                $sendFlowParameters?.type === SendFlowType.BaseCoinTransfer
                    ? $sendFlowParameters.baseCoinTransfer.asset
                    : $sendFlowParameters.tokenTransfer.asset
            // L1 network
            const { id, name } = $network.getMetadata()
            const layer1Network = {
                id,
                name,
                networkAddress: '',
            }
            // L2 chains, ISCP only for now
            const iscpChains = features?.network?.layer2?.enabled
                ? $network.getChains().filter((chain) => chain.getConfiguration().type === ChainType.Iscp)
                : []
            const chainMatchingAssetChainId = iscpChains.find(
                (chain) => chain.getConfiguration().chainId === asset.chainId
            )

            switch (asset.standard) {
                case TokenStandard.Irc27:
                case TokenStandard.Irc30:
                case TokenStandard.BaseToken:
                    if (!asset.chainId) {
                        compatibleNetworks = [layer1Network, ...iscpChains.map(getSelectorOptionFromChain)]
                    } else if (chainMatchingAssetChainId) {
                        compatibleNetworks = [getSelectorOptionFromChain(chainMatchingAssetChainId), layer1Network]
                    }
                    break
                case TokenStandard.Erc20:
                    if (chainMatchingAssetChainId) {
                        compatibleNetworks = [getSelectorOptionFromChain(chainMatchingAssetChainId)]
                    }
                    break
            }
            return compatibleNetworks
        }
    }

    function getSelectorOptionFromChain(chain: IChain): INetworkRecipientSelectorOption {
        const chainConfig = chain.getConfiguration() as IIscpChainConfiguration
        return {
            chainId: chainConfig.chainId,
            name: chainConfig.name,
            networkAddress: chainConfig.aliasAddress,
        }
    }
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
