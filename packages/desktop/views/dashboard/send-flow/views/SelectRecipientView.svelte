<script lang="ts">
    import { onMount } from 'svelte'
    import features from '@features/features'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { IChain, IIscpChainConfiguration, network } from '@core/network'
    import {
        SendFlowParameters,
        SendFlowType,
        TokenStandard,
        sendFlowParameters,
        updateSendFlowParameters,
        getChainIdFromSendFlowParameters,
        SubjectType,
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

        setInitialRecipient()
    }

    function setInitialRecipient(): void {
        const recipient = $sendFlowParameters?.recipient
        if (recipient) {
            selectorOptions = selectorOptions.map((option, index) =>
                index === selectedIndex
                    ? {
                          ...option,
                          recipient,
                      }
                    : option
            )
        }
    }

    function getAssetStandard(params: SendFlowParameters): string {
        if (params.type === SendFlowType.NftTransfer) {
            return params.nft?.parsedMetadata.standard
        } else if (params.type === SendFlowType.TokenTransfer) {
            return params.tokenTransfer?.asset.standard
        } else {
            return params.baseCoinTransfer?.asset.standard
        }
    }

    function getCompatibleTransferNetworks(): INetworkRecipientSelectorOption[] {
        if (!$network || !$sendFlowParameters) {
            return []
        }

        // L1 network
        const { id, name } = $network.getMetadata()
        const layer1Network = {
            id,
            name,
            networkAddress: '',
        }

        if (!features?.network?.layer2?.enabled) {
            return [layer1Network]
        }

        let compatibleNetworks: INetworkRecipientSelectorOption[] = []

        const chainId = getChainIdFromSendFlowParameters($sendFlowParameters)
        const assetStandard = getAssetStandard($sendFlowParameters)
        const sourceChain = $network.getChain(chainId)

        switch (assetStandard) {
            case TokenStandard.Irc27:
            case TokenStandard.Irc30:
            case TokenStandard.BaseToken:
                if (!chainId) {
                    compatibleNetworks = [layer1Network, ...$network.getIscpChains().map(getSelectorOptionFromChain)]
                } else if (sourceChain) {
                    compatibleNetworks = [getSelectorOptionFromChain(sourceChain), layer1Network]
                }
                break
            case TokenStandard.Erc20:
                if (sourceChain) {
                    compatibleNetworks = [getSelectorOptionFromChain(sourceChain)]
                }
                break
        }
        return compatibleNetworks
    }

    function getSelectorOptionFromChain(chain: IChain): INetworkRecipientSelectorOption {
        const chainConfig = chain.getConfiguration() as IIscpChainConfiguration
        return {
            chainId: chainConfig.chainId,
            name: chainConfig.name,
            networkAddress: chainConfig.aliasAddress,
        }
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
