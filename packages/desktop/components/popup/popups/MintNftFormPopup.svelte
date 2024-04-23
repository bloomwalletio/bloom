<script lang="ts">
    import { BaseError } from '@core/error/classes'
    import { localize } from '@core/i18n'
    import { getPrimaryNftUrl, NftStandard } from '@core/nfts'
    import { MimeType } from '@core/nfts/enums'
    import { fetchWithTimeout } from '@core/nfts/utils/fetchWithTimeout'
    import { getNetworkHrp } from '@core/profile/actions'
    import { HttpHeader } from '@core/utils'
    import { validateBech32Address } from '@core/utils/crypto'
    import { isValidUri } from '@core/utils/validation'
    import { IMintNftDetails } from '@core/wallet'
    import { mintNftDetails, setMintNftDetails } from '@core/wallet/stores'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { AliasInput, OptionalInput } from '@ui'
    import { Error, TextInput } from '@bloomwalletio/ui'
    import PopupTemplate from '../PopupTemplate.svelte'

    let {
        standard,
        version,
        type,
        uri,
        quantity,
        name,
        collectionId,
        collectionName,
        royalties,
        issuerName,
        description,
        attributes,
        startIndex,
    } = $mintNftDetails || {}

    let collectionIdInput: AliasInput
    let collectionIdError: string

    interface IOptionalInputs {
        [key: string]: {
            inputType: 'text' | 'number'
            isInteger?: boolean
            value: string
            error: string
            isOpen?: boolean
        }
    }

    const optionalInputs: IOptionalInputs = {
        issuerName: {
            inputType: 'text',
            value: issuerName,
            error: '',
        },
        collectionName: {
            inputType: 'text',
            value: collectionName,
            error: '',
        },
        description: {
            inputType: 'text',
            value: description,
            error: '',
        },
        attributes: {
            inputType: 'text',
            value: attributes ? JSON.stringify(attributes) : undefined,
            error: '',
        },
        royalties: {
            inputType: 'text',
            value: royalties ? JSON.stringify(royalties) : undefined,
            error: '',
        },
        quantity: {
            inputType: 'number',
            isInteger: true,
            value: quantity ? String(quantity <= 1 ? '' : quantity) : '',
            error: '',
        },
        startIndex: {
            inputType: 'number',
            isInteger: true,
            value: startIndex ? String(startIndex <= 1 ? '' : startIndex) : '',
            error: '',
        },
    }

    let uriError: string, nameError: string

    const error: BaseError = null

    function onCancelClick(): void {
        closePopup()
    }

    async function onContinueClick(): Promise<void> {
        resetErrors()
        const valid = await validate()
        if (valid) {
            setMintNftDetails(convertInputsToMetadataType())
            openPopup({
                id: PopupId.MintNftConfirmation,
                overflow: true,
                confirmClickOutside: true,
            })
        }
    }

    async function validate(): Promise<boolean> {
        if (!name || name.length === 0) {
            nameError = localize('popups.mintNftForm.errors.emptyName')
        }

        if (optionalInputs.quantity?.isOpen) {
            if (Number(optionalInputs.quantity.value) < 1) {
                optionalInputs.quantity.error = localize('popups.mintNftForm.errors.quantityTooSmall')
            }
            if (Number(optionalInputs.quantity.value) > 126) {
                optionalInputs.quantity.error = localize('popups.mintNftForm.errors.quantityTooLarge')
            }
        }

        const dummyUri = uri?.replace('{id}', '1')
        if (!uri || uri.length === 0 || !dummyUri || !isValidUri(dummyUri)) {
            uriError = localize('popups.mintNftForm.errors.invalidURI')
        } else {
            try {
                const downloadUrl = getPrimaryNftUrl(dummyUri)
                if (downloadUrl) {
                    const response = await fetchWithTimeout(downloadUrl, 1, { method: 'HEAD' })
                    if (response.status === 200 || response.status === 304) {
                        type = response.headers.get(HttpHeader.ContentType) as MimeType
                    } else {
                        uriError = localize('popups.mintNftForm.errors.notReachable')
                    }
                } else {
                    uriError = localize('popups.mintNftForm.errors.invalidURI')
                }
            } catch (err) {
                uriError = localize('popups.mintNftForm.errors.notReachable')
            }
        }

        if (optionalInputs.royalties.isOpen) {
            validateRoyalties()
        }

        if (optionalInputs.attributes.isOpen) {
            validateAttributes()
        }

        const optionalInputsErrors = Object.values(optionalInputs).map((optionalInput) => optionalInput.error)

        const hasErrors = Object.values({ ...optionalInputsErrors, nameError, uriError }).some((e) => e !== '')

        return !hasErrors
    }

    function resetErrors(): void {
        nameError = ''
        uriError = ''

        for (const key of Object.keys(optionalInputs)) {
            optionalInputs[key].error = ''
        }
    }

    function validateRoyalties(): void {
        let royalties: unknown
        try {
            royalties = JSON.parse(optionalInputs.royalties.value)
        } catch (err) {
            optionalInputs.royalties.error = localize('popups.mintNftForm.errors.royaltiesMustBeJSON')
            return
        }

        const isObject = typeof royalties === 'object' && !Array.isArray(royalties) && royalties !== null

        if (!isObject) {
            optionalInputs.royalties.error = localize('popups.mintNftForm.errors.royaltiesMustBeObject')
            return
        }

        try {
            Object.keys(royalties).forEach((key) => validateBech32Address(getNetworkHrp(), key))
        } catch (err) {
            optionalInputs.royalties.error = localize('popups.mintNftForm.errors.invalidAddress', {
                values: { networkHrp: getNetworkHrp() },
            })
            return
        }

        const areValuesValid = Object.values(royalties).every((value) => value >= 0 && value <= 1)
        if (!areValuesValid) {
            optionalInputs.royalties.error = localize('popups.mintNftForm.errors.invalidRoyaltyValue')
            return
        }
        const isSumValid = Object.values(royalties).reduce((acc, val) => acc + val, 0) <= 1
        if (!isSumValid) {
            optionalInputs.royalties.error = localize('popups.mintNftForm.errors.invalidRoyaltyValueSum')
            return
        }
    }

    function validateAttributes(): void {
        let attributes: unknown
        try {
            attributes = JSON.parse(optionalInputs.attributes.value)
        } catch (err) {
            optionalInputs.attributes.error = localize('popups.mintNftForm.errors.attributesMustBeJSON')
            return
        }
        if (!Array.isArray(attributes)) {
            optionalInputs.attributes.error = localize('popups.mintNftForm.errors.attributesMustBeArrayOfObjects')
            return
        }
        const isArrayOfObjects = attributes.every(
            (attribute) => typeof attribute === 'object' && !Array.isArray(attribute) && attribute !== null
        )
        if (!isArrayOfObjects) {
            optionalInputs.attributes.error = localize('popups.mintNftForm.errors.attributesMustBeArrayOfObjects')
            return
        }
        const isKeysValid = attributes.every(
            (attribute) =>
                Object.keys(attribute).every((key) => key === 'trait_type' || key === 'value') &&
                Object.keys(attribute).filter((key) => key === 'trait_type').length === 1 &&
                Object.keys(attribute).filter((key) => key === 'value').length === 1
        )
        if (!isKeysValid) {
            optionalInputs.attributes.error = localize('popups.mintNftForm.errors.attributesInvalidKeys')
            return
        }
        const isValuesValid = attributes.every(
            (attribute) =>
                (typeof attribute.trait_type === 'string' &&
                    attribute.trait_type.length > 0 &&
                    typeof attribute.value === 'string' &&
                    attribute.value.length > 0) ||
                typeof attribute.value === 'number'
        )
        if (!isValuesValid) {
            optionalInputs.attributes.error = localize('popups.mintNftForm.errors.attributesInvalidValues')
            return
        }
    }

    function convertInputsToMetadataType(): IMintNftDetails {
        return {
            standard: standard ?? NftStandard.Irc27,
            version,
            issuerName: optionalInputs.issuerName?.value,
            description: optionalInputs.description?.value,
            collectionId,
            collectionName: optionalInputs.collectionName?.value,
            quantity: optionalInputs.quantity?.value ? Number(optionalInputs.quantity.value) : 1,
            startIndex: optionalInputs.startIndex?.value ? Number(optionalInputs.startIndex.value) : 1,
            uri,
            name,
            royalties: optionalInputs.royalties?.value ? JSON.parse(optionalInputs.royalties.value) : undefined,
            attributes: optionalInputs.attributes?.value ? JSON.parse(optionalInputs.attributes.value) : undefined,
            type,
        }
    }
</script>

<PopupTemplate
    title={localize('popups.mintNftForm.title')}
    backButton={{
        text: localize('actions.cancel'),
        onClick: onCancelClick,
    }}
    continueButton={{
        text: localize('actions.continue'),
        onClick: onContinueClick,
    }}
>
    <popup-inputs class="block space-y-5 max-h-100 scrollable-y overflow-x-hidden flex-1">
        <AliasInput bind:this={collectionIdInput} bind:alias={collectionId} bind:error={collectionIdError} />
        <TextInput bind:value={uri} bind:error={uriError} label={localize('general.uri')} />
        <TextInput bind:value={name} bind:error={nameError} label={localize('general.name')} />
        <optional-inputs class="flex flex-row flex-wrap gap-4">
            {#each Object.keys(optionalInputs) as key}
                <OptionalInput
                    bind:value={optionalInputs[key].value}
                    bind:error={optionalInputs[key].error}
                    bind:isOpen={optionalInputs[key].isOpen}
                    inputType={optionalInputs[key].inputType}
                    isInteger={optionalInputs[key]?.isInteger}
                    label={localize(`general.${key}`)}
                    description={localize(`tooltips.mintNftForm.${key}`)}
                    fontSize={14}
                />
            {/each}
        </optional-inputs>
        {#if error}
            <Error error={error?.message} />
        {/if}
    </popup-inputs>
</PopupTemplate>
