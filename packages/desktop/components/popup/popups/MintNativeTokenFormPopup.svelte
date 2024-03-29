<script lang="ts">
    import { BaseError } from '@core/error'
    import { localize } from '@core/i18n'
    import { setMintTokenDetails, mintTokenDetails, IMintTokenDetails } from '@core/wallet'
    import { closePopup, openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { OptionalInput, AliasInput } from '@ui'
    import { Error, NumberInput, TextInput } from '@bloomwalletio/ui'
    import { onMount } from 'svelte'
    import { MAX_SUPPORTED_DECIMALS } from '@core/wallet/constants/max-supported-decimals.constants'
    import { handleError } from '@core/error/handlers/handleError'
    import PopupTemplate from '../PopupTemplate.svelte'
    import { Converter } from '@core/utils'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const DEFAULT: IMintTokenDetails = {
        name: undefined,
        totalSupply: undefined,
        circulatingSupply: undefined,
        decimals: 0,
        symbol: undefined,
        description: undefined,
        url: undefined,
        logoUrl: undefined,
        aliasId: undefined,
    }

    let {
        name: tokenName,
        totalSupply,
        circulatingSupply,
        decimals,
        symbol,
        description,
        url,
        logoUrl,
        aliasId,
    } = $mintTokenDetails ?? DEFAULT

    let totalSupplyString = totalSupply?.toString()
    $: totalSupply = Converter.bigIntLikeToBigInt(totalSupplyString ?? '0')
    let circulatingSupplyString = circulatingSupply?.toString()
    $: circulatingSupply = Converter.bigIntLikeToBigInt(circulatingSupplyString ?? '0')

    let nameError = ''
    $: tokenName, (nameError = '')
    let totalSupplyError = ''
    $: totalSupplyString, (totalSupplyError = '')
    let circulatingSupplyError = ''
    $: circulatingSupplyString, (circulatingSupplyError = '')
    let symbolError = ''
    $: symbol, (symbolError = '')
    let aliasIdError = ''
    $: aliasId, (aliasIdError = '')
    let decimalsError = ''
    $: decimals, (decimalsError = '')

    let error: BaseError
    let aliasInput: AliasInput

    function onCancelClick(): void {
        closePopup()
    }

    async function onContinueClick(): Promise<void> {
        const valid = await validate()
        const tokenDetailsForm = {
            name: tokenName,
            totalSupply,
            circulatingSupply,
            decimals,
            symbol,
            description,
            url,
            logoUrl,
            aliasId,
        }
        if (valid && isEverythingDefined(tokenDetailsForm)) {
            setMintTokenDetails(tokenDetailsForm)
            openPopup({
                id: PopupId.MintNativeTokenConfirmation,
                overflow: true,
            })
        }
    }

    function isEverythingDefined(form: IMintTokenDetails): form is IMintTokenDetails {
        return (
            form.name !== undefined &&
            form.totalSupply !== undefined &&
            form.circulatingSupply !== undefined &&
            form.decimals !== undefined &&
            form.symbol !== undefined &&
            form.aliasId !== undefined
        )
    }

    async function validate(): Promise<boolean> {
        try {
            await Promise.all([
                isNameValid(),
                aliasInput.validate(),
                isTotalSupplyValid(),
                isCirculatingSupplyValid(),
                isDecimalsValid(),
                isSymbolValid(),
            ])
            return true
        } catch (err) {
            console.error('Error: ', err)
            return false
        }
    }

    function isNameValid(): Promise<void> {
        if (!tokenName) {
            nameError = 'Name is required'
            return Promise.reject(nameError)
        } else {
            return Promise.resolve()
        }
    }

    function isTotalSupplyValid(): Promise<void> {
        if (totalSupply === undefined || totalSupply?.toString().length < 1) {
            totalSupplyError = 'Total supply is required'
            return Promise.reject(totalSupplyError)
        } else if (totalSupply < 1) {
            totalSupplyError = 'Total supply must be greater than 0'
            return Promise.reject(totalSupplyError)
        } else {
            return Promise.resolve()
        }
    }

    function isCirculatingSupplyValid(): Promise<void> {
        if (circulatingSupply === undefined || circulatingSupply.toString().length < 1) {
            circulatingSupplyError = 'Circulating supply is required'
            return Promise.reject(circulatingSupplyError)
        } else if (circulatingSupply < BigInt(1)) {
            circulatingSupplyError = 'Circulating supply must be greater than 0'
            return Promise.reject(circulatingSupplyError)
        } else if (circulatingSupply > totalSupply) {
            circulatingSupplyError = 'Circulating supply must be less than or equal to the total supply'
            return Promise.reject(circulatingSupplyError)
        } else {
            return Promise.resolve()
        }
    }

    function isDecimalsValid(): Promise<void> {
        if (decimals === undefined || decimals?.toString().length < 1) {
            decimalsError = 'Decimals is required'
            return Promise.reject(decimalsError)
        } else if (decimals < 0) {
            decimalsError = 'Decimals must be greater than or equal to 0'
            return Promise.reject(decimalsError)
        } else {
            return Promise.resolve()
        }
    }

    function isSymbolValid(): Promise<void> {
        if (!symbol) {
            symbolError = 'Symbol is required'
            return Promise.reject(symbolError)
        } else {
            return Promise.resolve()
        }
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<PopupTemplate
    title={localize('popups.nativeToken.formTitle')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('actions.continue'),
        onClick: onContinueClick,
    }}
>
    <div class="space-y-5 max-h-100 scrollable-y flex-1">
        <AliasInput bind:this={aliasInput} bind:alias={aliasId} bind:error={aliasIdError} />
        <TextInput bind:value={tokenName} label={localize('popups.nativeToken.property.tokenName')} error={nameError} />
        <TextInput
            bind:value={symbol}
            label={localize('popups.nativeToken.property.symbol')}
            maxlength={5}
            error={symbolError}
        />
        <NumberInput
            bind:value={totalSupplyString}
            label={localize('popups.nativeToken.property.totalSupply')}
            error={totalSupplyError}
        />
        <NumberInput
            bind:value={circulatingSupplyString}
            label={localize('popups.nativeToken.property.circulatingSupply')}
            error={circulatingSupplyError}
        />
        <optional-inputs class="flex flex-row flex-wrap gap-4">
            <OptionalInput
                bind:value={decimals}
                inputType="number"
                isInteger
                maxlength={MAX_SUPPORTED_DECIMALS}
                label={localize('popups.nativeToken.property.decimals')}
                description={localize('tooltips.mintNativeToken.decimals')}
                error={decimalsError}
                fontSize={14}
            />
            <OptionalInput
                bind:value={description}
                label={localize('popups.nativeToken.property.description')}
                description={localize('tooltips.mintNativeToken.description')}
                fontSize={14}
            />
            <OptionalInput
                bind:value={url}
                label={localize('popups.nativeToken.property.url')}
                description={localize('tooltips.mintNativeToken.url')}
                fontSize={14}
            />
            <OptionalInput
                bind:value={logoUrl}
                label={localize('popups.nativeToken.property.logoUrl')}
                description={localize('tooltips.mintNativeToken.logoUrl')}
                fontSize={14}
            />
        </optional-inputs>
        {#if error}
            <Error error={error?.message} />
        {/if}
    </div>
</PopupTemplate>
