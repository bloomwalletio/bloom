<script lang="ts">
    import { BaseError } from '@core/error/classes'
    import { localize } from '@core/i18n'
    import { NftStandard, getPrimaryNftUrl } from '@core/nfts'
    import { MimeType } from '@core/nfts/enums'
    import { fetchWithTimeout } from '@core/nfts/utils/fetchWithTimeout'
    import { HttpHeader } from '@core/utils'
    import { isValidUri } from '@core/utils/validation'
    import { IMintNftCollectionDetails } from '@core/wallet'
    import { mintNftCollectionDetails, setMintNftCollectionDetails } from '@core/wallet/stores'
    import { PopupId, closePopup, openPopup } from '@desktop/auxiliary/popup'
    import { OptionalInput } from '@ui'
    import { Error, TextInput } from '@bloomwalletio/ui'
    import PopupTemplate from '../PopupTemplate.svelte'

    let { standard, version, type, uri, name, issuerName, description, attributes } = $mintNftCollectionDetails || {}

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
            setMintNftCollectionDetails(convertInputsToMetadataType())
            openPopup({
                id: PopupId.MintNftCollectionConfirmation,
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
            if (Number(optionalInputs.quantity.value) >= 64) {
                optionalInputs.quantity.error = localize('popups.mintNftForm.errors.quantityTooLarge')
            }
        }

        if (!uri || uri.length === 0 || !isValidUri(uri)) {
            uriError = localize('popups.mintNftForm.errors.invalidURI')
        } else {
            try {
                const downloadUrl = getPrimaryNftUrl(uri)
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

    function convertInputsToMetadataType(): IMintNftCollectionDetails {
        return {
            standard: standard ?? NftStandard.Irc27,
            version,
            issuerName: optionalInputs.issuerName?.value,
            description: optionalInputs.description?.value,
            uri,
            name,
            attributes: optionalInputs.attributes?.value ? JSON.parse(optionalInputs.attributes.value) : undefined,
            type: type as MimeType,
        }
    }
</script>

<PopupTemplate
    title={localize('actions.mintNftCollection')}
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
