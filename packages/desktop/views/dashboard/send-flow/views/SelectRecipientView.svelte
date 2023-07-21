<script lang="ts">
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { ChainType, IChain, IIscpChainConfiguration, network } from '@core/network'
    import {
        NewTransactionType,
        SubjectType,
        TokenStandard,
        newTransactionData,
        updateNewTransactionData,
    } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { INetworkRecipientSelectorOption, NetworkRecipientSelector } from '@ui'
    import { onMount } from 'svelte'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'

    let networkAddress = $newTransactionData?.layer2Parameters?.networkAddress
    let selectorOptions: INetworkRecipientSelectorOption[] = []
    let selectedIndex = -1

    const assetName = getAssetName()

    $: selectedOption = selectorOptions[selectedIndex]
    $: isLayer2 = !!networkAddress

    $: networkAddress = selectedOption?.networkAddress ?? $newTransactionData?.layer2Parameters?.networkAddress
    $: recipient = selectedOption?.recipient ?? $newTransactionData?.recipient

    onMount(() => {
        buildNetworkRecipientOptions()
    })

    function getAssetName(): string | undefined {
        if ($newTransactionData?.type === NewTransactionType.TokenTransfer) {
            return $newTransactionData.asset?.metadata.name
        } else if ($newTransactionData?.type === NewTransactionType.NftTransfer) {
            return $newTransactionData.nft.name
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

        const recipient = $newTransactionData?.recipient
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

    function onContinueClick(): void {
        const layer2Parameters = isLayer2
            ? {
                  chainId: selectedOption.chainId,
                  networkAddress: selectedOption?.networkAddress,
                  senderAddress: $selectedAccount.depositAddress,
              }
            : null
        updateNewTransactionData({
            type: $newTransactionData?.type,
            recipient,
            layer2Parameters,
        })
        $sendFlowRouter.next()
    }

    function onBackClick(): void {
        updateNewTransactionData({
            type: $newTransactionData?.type,
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
        if (!$network || !$newTransactionData) {
            return []
        }

        if ($newTransactionData.type === NewTransactionType.NftTransfer) {
            // TODO: Currently we only support L1 NFTs
            return [
                {
                    name: $network.getMetadata().name,
                    networkAddress: '',
                },
            ]
        } else {
            let compatibleNetworks: INetworkRecipientSelectorOption[] = []

            const asset = $newTransactionData.asset
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
