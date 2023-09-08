<script lang="ts">
    import { Pane, ReceiveAddressButton, TokenList } from '@ui'
    import { AccountActivity, AccountSummary, SendButton } from '@components'
    import { selectedAccountTokens } from '@core/token/stores'
    import { selectedAccount } from '@core/account/stores'
    import features from '@features/features'

    import { onMount } from 'svelte'
    import { SIMPLE_ABI } from '@core/layer-2/abis/simple-abi'

    /* eslint-disable no-console */

    async function onMountHelper(): Promise<void> {
        const decoder = await import('abi-decoder')

        try {
            console.log('abi-decoder: Callview from fetSelectedLayer2Balance.ts')
            const data =
                '0x0a260617000000000000000000000000000000000000000000000000000000003c4b5e020000000000000000000000000000000000000000000000000000000084168cb4000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000161000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000015036fd95aa9c6421c1a0cc77cd5ff9ddd347b4f55490000000000000000000000'
            decoder.addABI(SIMPLE_ABI)
            console.log('L2', decoder.getABIs())
            console.log('L2', decoder.getMethodIDs())
            const decoded = decoder.decodeMethod(data)
            console.log('decoded data: ', decoded)
            decoder.removeABI(SIMPLE_ABI)
        } catch (err) {
            console.error(err)
        }

        // try {
        //     console.log('abi-decoder: ERC20 TRANSFER')
        //     const data =
        //         '0xa9059cbb0000000000000000000000009a3f0eab003b9f7052383917f82ff49c3e5950c000000000000000000000000000000000000000000000000000000000001e8480'
        //     decoder.addABI(ERC20_ABI)
        //     console.log("ERC20", decoder.getABIs())
        //     console.log("ERC20", decoder.getMethodIDs())

        //     const decoded = decoder.decodeMethod(data)
        //     console.log('decoded data: ', decoded)
        // } catch (err) {
        //     console.error(err)
        // }

        // try {
        //     console.log('web3: L2 -> L1 TRANSFER')

        //     const data =
        //         '0xb7a53f5300000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000340000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000210045e32be7978d105b63e4c32f7c8789cac27bd388d4956d4ad46c5d50c5b9b4f200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000098968000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000'

        //     const web3 = new Web3(
        //         'https://json-rpc.evm.shimmer.network/v1/chains/rms1pr75wa5xuepg2hew44vnr28wz5h6n6x99zptk2g68sp2wuu2karywgrztx3/evm'
        //     )
        //      // Won't work, since we need to pass in the parameter types as a first argument instead of the full ABI.
        //     const decoded = web3.eth.abi.decodeParameters(ISC_SANDBOX_ABI, data)
        //     console.log(decoded)
        // } catch (err) {
        //     console.error(err)
        // }

        // try {
        //     console.log('web3: ERC20 TRANSFER')

        //     const data =
        //         '0xa9059cbb0000000000000000000000009a3f0eab003b9f7052383917f82ff49c3e5950c000000000000000000000000000000000000000000000000000000000001e8480'
        //     const web3 = new Web3(
        //         'https://json-rpc.evm.shimmer.network/v1/chains/rms1pr75wa5xuepg2hew44vnr28wz5h6n6x99zptk2g68sp2wuu2karywgrztx3/evm'
        //     )
        //      // Won't work, since we need to pass in the parameter types as a first argument instead of the full ABI.
        //     const decoded = web3.eth.abi.decodeParameters(ERC20_ABI, data)
        //     console.log(decoded)
        // } catch (err) {
        //     console.error(err)
        // }
    }

    onMount(() => {
        void onMountHelper()
    })
</script>

{#if $selectedAccount}
    <wallet-container
        class="w-full h-full flex flex-nowrap p-8 relative flex-1
        bg-gray-50 dark:bg-gray-900 justify-center items-center"
    >
        {#key $selectedAccount?.index}
            <div class="h-full grid grid-cols-3 gap-x-4 min-h-0 min-w-0 max-w-7xl">
                <div class="flex flex-col space-y-4">
                    <Pane overflow="visible" classes="flex-none">
                        {#if features?.wallet?.accountSummary?.enabled}
                            <AccountSummary />
                        {/if}
                    </Pane>
                    <Pane classes="flex flex-col p-6 space-y-6">
                        {#if features?.wallet?.sendAndReceive?.enabled}
                            <SendButton />
                            <ReceiveAddressButton />
                        {/if}
                    </Pane>
                </div>
                <Pane classes="h-full">
                    {#if features?.wallet?.assets?.enabled}
                        <TokenList accountTokens={$selectedAccountTokens} />
                    {/if}
                </Pane>
                <Pane classes="h-full">
                    {#if features?.wallet?.activityHistory?.enabled}
                        <AccountActivity />
                    {/if}
                </Pane>
            </div>
        {/key}
    </wallet-container>
{/if}
