import { localize } from '@core/i18n'
import { composeUrlFromNftUri } from '@core/nfts/utils/composeUrlFromNftUri'
import { fetchWithTimeout } from '@core/nfts/utils/fetchWithTimeout'
import { isValidUri, HttpHeader } from '@core/utils'
import { IMintNftCollectionDetails } from '@core/wallet'
import { IOptionalInput, IOptionalInputs } from '@ui'
import { MimeType } from '@core/nfts/enums'
import { getNetworkHrp } from '@core/profile/actions'
import { validateBech32Address } from '@core/utils/crypto'

export async function validateNftForm(details: IMintNftCollectionDetails, optionalInputs: IOptionalInputs): Promise<boolean> {
    const { uri, name } = details || {}
    let nameError, uriError: string

    if (!name || name?.length === 0) {
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

    if (optionalInputs.royalties.isOpen) {
        validateRoyalties(optionalInputs.royalties)
    }

    if (optionalInputs.attributes.isOpen) {
        validateAttributes(optionalInputs.attributes)
    }

    if (uri?.length === 0 || !isValidUri(uri)) {
        uriError = localize('popups.mintNftForm.errors.invalidURI')
    } else {
        try {
            const response = await fetchWithTimeout(composeUrlFromNftUri(uri) ?? '', 1, { method: 'HEAD' })
            if (response.status === 200 || response.status === 304) {
                details.type = response.headers.get(HttpHeader.ContentType) as MimeType
            } else {
                uriError = localize('popups.mintNftForm.errors.notReachable')
            }
        } catch (err) {
            uriError = localize('popups.mintNftForm.errors.notReachable')
        }
    }
    const inputErrors = Object.values(optionalInputs).map((optionalInput) => optionalInput.error)
    return { uriError, nameError, inputErrors }
}

function validateAttributes(rawAttributes: IOptionalInput): void {
    let attributes: IOptionalInput = { value: '', error: '', inputType: 'text'}
    try {
        attributes = JSON.parse(rawAttributes.value)
    } catch (err) {
        attributes.error = localize('popups.mintNftForm.errors.attributesMustBeJSON')
        return
    }
    if (!Array.isArray(attributes)) {
        attributes.error = localize('popups.mintNftForm.errors.attributesMustBeArrayOfObjects')
        return
    }
    const isArrayOfObjects = attributes.every(
        (attribute) => typeof attribute === 'object' && !Array.isArray(attribute) && attribute !== null
    )
    if (!isArrayOfObjects) {
        attributes.error = localize('popups.mintNftForm.errors.attributesMustBeArrayOfObjects')
        return
    }
    const isKeysValid = attributes.every(
        (attribute) =>
            Object.keys(attribute).every((key) => key === 'trait_type' || key === 'value') &&
            Object.keys(attribute).filter((key) => key === 'trait_type').length === 1 &&
            Object.keys(attribute).filter((key) => key === 'value').length === 1
    )
    if (!isKeysValid) {
        attributes.error = localize('popups.mintNftForm.errors.attributesInvalidKeys')
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
        attributes.error = localize('popups.mintNftForm.errors.attributesInvalidValues')
        return
    }
}

function validateRoyalties(rawRoyalties: IOptionalInput): void {
    let royalties: IOptionalInput = { value: '', error: '', inputType: 'text'}
    try {
        royalties = JSON.parse(rawRoyalties.value)
    } catch (err) {
        rawRoyalties.error = localize('popups.mintNftForm.errors.royaltiesMustBeJSON')
        return
    }

    const isObject = typeof royalties === 'object' && !Array.isArray(royalties) && royalties !== null

    if (!isObject) {
        rawRoyalties.error = localize('popups.mintNftForm.errors.royaltiesMustBeObject')
        return
    }

    try {
        Object.keys(royalties).forEach((key) => validateBech32Address(getNetworkHrp(), key))
    } catch (err) {
        rawRoyalties.error = localize('popups.mintNftForm.errors.invalidAddress', {
            values: { networkHrp: getNetworkHrp() },
        })
        return
    }

    const areValuesValid = Object.values(royalties).every((value) => value >= 0 && value <= 1)
    if (!areValuesValid) {
        rawRoyalties.error = localize('popups.mintNftForm.errors.invalidRoyaltyValue')
        return
    }
    const isSumValid = Object.values(royalties).reduce((acc, val) => acc + val, 0) <= 1
    if (!isSumValid) {
        rawRoyalties.error = localize('popups.mintNftForm.errors.invalidRoyaltyValueSum')
        return
    }
}
