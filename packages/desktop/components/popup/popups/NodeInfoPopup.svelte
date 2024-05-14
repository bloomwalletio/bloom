<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { IItem, Table, Tabs } from '@bloomwalletio/ui'
    import { formatNumber, localize } from '@core/i18n'
    import { getNodeInfo } from '@core/profile-manager'
    import { closePopup } from '@desktop/auxiliary/popup'
    import type { INode, INodeInfo } from '@iota/sdk'
    import { onMount } from 'svelte'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { KeyValue } from '@ui/types'

    enum NodeInfoTab {
        General = 'general',
        Metrics = 'metrics',
        Protocol = 'protocol',
        BaseToken = 'baseToken',
    }

    export let node: INode = { url: '' }
    export let selectedTab: KeyValue<string>

    let nodeInfo: INodeInfo

    let generalItems: IItem[]
    $: generalItems =
        node && nodeInfo
            ? [
                  { key: localize('popups.node.info.general.url'), value: node.url, copyable: true },
                  { key: localize('popups.node.info.general.name'), value: nodeInfo.name, copyable: true },
                  { key: localize('popups.node.info.general.version'), value: nodeInfo.version, copyable: true },
                  {
                      key: localize('popups.node.info.general.pruningIndex'),
                      value: nodeInfo.status.pruningIndex,
                      copyable: true,
                  },
                  { key: localize('popups.node.info.general.features'), value: nodeInfo.features, copyable: true },
              ]
            : []

    let metricsItems: IItem[]
    $: metricsItems = nodeInfo
        ? [
              {
                  key: localize('popups.node.info.metrics.blocksPerSecond'),
                  value: formatNumber(nodeInfo.metrics.blocksPerSecond, 1, 1),
                  copyable: true,
              },
              {
                  key: localize('popups.node.info.metrics.referencedBlocksPerSecond'),
                  value: formatNumber(nodeInfo.metrics.referencedBlocksPerSecond, 1, 1),
                  copyable: true,
              },
              {
                  key: localize('popups.node.info.metrics.referencedRate'),
                  value: `${formatNumber(Math.min(nodeInfo.metrics.referencedRate, 100), 1, 1)}%`,
                  copyable: true,
              },
              {
                  key: localize('popups.node.info.metrics.latestMilestone'),
                  value: nodeInfo.status.latestMilestone.index,
                  copyable: true,
              },
              {
                  key: localize('popups.node.info.metrics.confirmedMilestone'),
                  value: nodeInfo.status.confirmedMilestone.index,
                  copyable: true,
              },
          ]
        : []

    let protocolItems: IItem[]
    $: protocolItems = nodeInfo
        ? [
              {
                  key: localize('popups.node.info.protocol.network'),
                  value: nodeInfo.protocol.networkName,
                  copyable: true,
              },
              {
                  key: localize('popups.node.info.protocol.bech32Hrp'),
                  value: nodeInfo.protocol.bech32Hrp,
                  copyable: true,
              },
              {
                  key: localize('popups.node.info.protocol.tokenSupply'),
                  value: nodeInfo.protocol.tokenSupply,
                  copyable: true,
              },
              { key: localize('popups.node.info.protocol.version'), value: nodeInfo.protocol.version, copyable: true },
              {
                  key: localize('popups.node.info.protocol.minPowScore'),
                  value: nodeInfo.protocol.minPowScore,
                  copyable: true,
              },
          ]
        : []

    let baseTokenItems: IItem[]
    $: baseTokenItems = nodeInfo
        ? [
              { key: localize('popups.node.info.baseToken.token'), value: nodeInfo.baseToken.name, copyable: true },
              {
                  key: localize('popups.node.info.baseToken.tickerSymbol'),
                  value: nodeInfo.baseToken.tickerSymbol,
                  copyable: true,
              },
              { key: localize('popups.node.info.baseToken.unit'), value: nodeInfo.baseToken.unit, copyable: true },
              {
                  key: localize('popups.node.info.baseToken.subunit'),
                  value: nodeInfo.baseToken.subunit,
                  copyable: true,
              },
              {
                  key: localize('popups.node.info.baseToken.decimals'),
                  value: nodeInfo.baseToken.decimals,
                  copyable: true,
              },
          ]
        : []

    let itemsMap: {
        [NodeInfoTab.General]: IItem[]
        [NodeInfoTab.Metrics]: IItem[]
        [NodeInfoTab.Protocol]: IItem[]
        [NodeInfoTab.BaseToken]: IItem[]
    }
    $: itemsMap = {
        [NodeInfoTab.General]: generalItems,
        [NodeInfoTab.Metrics]: metricsItems,
        [NodeInfoTab.Protocol]: protocolItems,
        [NodeInfoTab.BaseToken]: baseTokenItems,
    }

    onMount(() => {
        getNodeInfo(node?.url, node?.auth)
            .then((nodeInfoResponse) => {
                nodeInfo = nodeInfoResponse?.nodeInfo
            })
            .catch((err) => {
                closePopup()
                showNotification({
                    variant: 'error',
                    text: localize(err?.error),
                })
            })
    })
</script>

<PopupTemplate title={localize('popups.node.titleInfo')}>
    <Tabs
        bind:selectedTab
        tabs={Object.values(NodeInfoTab).map((key) => ({ key, value: localize(`popups.node.info.${key}.tab`) }))}
    />
    <Table items={itemsMap[selectedTab?.key] ?? []} />
</PopupTemplate>
