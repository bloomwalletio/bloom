<script lang="ts">
    import { Pane } from '@ui'
    import { AccountEvmChainSummary, AccountStardustNetworkSummary, AccountSummary } from './components'
    import { IAccountState } from '@core/account'
    import { getActiveNetworkId, network } from '@core/network'

    export let account: IAccountState

    const stardustNetworkId = getActiveNetworkId()
    const evmChainNetworkId = $network.getChains()[0].getConfiguration().id
</script>

<Pane classes="w-full flex flex-row shrink-0 justify-between items-center shadow-lg">
    <AccountSummary {account} {stardustNetworkId} {evmChainNetworkId} />
    <div class="middle w-full border-l border-r border-solid border-stroke">
        <AccountStardustNetworkSummary {account} networkId={stardustNetworkId} />
    </div>
    <AccountEvmChainSummary {account} networkId={evmChainNetworkId} />
</Pane>
