<script lang="ts">
    import { selectedAccountIndex } from '@core/account/stores'
    import { time } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts/actions'
    import { ownedNfts } from '@core/nfts/stores'
    import { HEX_PREFIX } from '@core/utils'
    import { IOption, Modal, NftImageOrIconBox, SelectorInput } from '@ui'

    export let nftId: string = ''
    export let error: string = ''
    export let readonly: boolean = null

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined
    let selected: IOption = nftId
        ? { key: getNftByIdFromAllAccountNfts($selectedAccountIndex, nftId).name, value: nftId }
        : {}

    const nftOptions: IOption[] = $ownedNfts
        .filter((nft) => nft.isSpendable && (!nft.timelockTime || nft.timelockTime < $time.getTime()))
        .map((_nft) => ({ key: _nft.name, value: _nft.id }))

    $: nftId = selected?.value

    export async function validate(): Promise<void> {
        if (!nftId) {
            error = localize('error.send.nftRequired')
            return Promise.reject(error)
        } else if (!nftId.startsWith(HEX_PREFIX)) {
            error = localize('error.send.nftNotInHex')
            return Promise.reject(error)
        } else if (!isNftInPossession()) {
            error = localize('error.send.nftNotInPossession')
            return Promise.reject(error)
        } else {
            return Promise.resolve()
        }
    }

    function isNftInPossession(): boolean {
        return nftOptions.some((option) => option.value === nftId)
    }
</script>

<SelectorInput
    labelLocale="popups.sendNft.property.nft"
    bind:selected
    bind:inputElement
    bind:modal
    bind:error
    {readonly}
    options={nftOptions}
    let:option
>
    <NftImageOrIconBox nftId={option.value} size="small" />
</SelectorInput>
