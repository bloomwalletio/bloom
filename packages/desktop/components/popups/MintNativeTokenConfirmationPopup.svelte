<script lang="ts">
    import { type IItem, Table } from '@bloomwalletio/ui'
    import { onMount } from 'svelte'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { getBaseToken, checkActiveProfileAuth } from '@core/profile/actions'
    import { mintNativeToken, mintTokenDetails, buildFoundryOutputData, IMintTokenDetails } from '@core/wallet'
    import { closePopup, openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { Button, Text, FontWeight, TextType } from '@ui'
    import { IIrc30Metadata, TokenStandard, formatTokenAmountPrecise } from '@core/token'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let storageDeposit = '0'

    let metadata: IIrc30Metadata | undefined
    $: metadata = getMetadata($mintTokenDetails)
    $: isTransferring = $selectedAccount?.isTransferring

    async function prepareFoundryOutput(): Promise<void> {
        if ($mintTokenDetails && $selectedAccount && metadata) {
            const { totalSupply, circulatingSupply, aliasId } = $mintTokenDetails
            const outputData = await buildFoundryOutputData(
                Number(totalSupply),
                Number(circulatingSupply),
                metadata,
                aliasId
            )
            const preparedOutput = await $selectedAccount.buildFoundryOutput(outputData)
            storageDeposit = formatTokenAmountPrecise(Number(preparedOutput.amount) ?? 0, getBaseToken())
        }
    }

    let items: IItem[] = []

    $: setItems($mintTokenDetails)

    function setItems(details: IMintTokenDetails | undefined): void {
        if (!details) {
            return
        }

        items = []
        const { name: tokenName, symbol, aliasId, url, logoUrl, decimals, totalSupply } = details

        if (aliasId) {
            items.push({
                key: localize('popups.nativeToken.property.alias'),
                value: aliasId,
                copyable: true,
            })
        }
        if (storageDeposit) {
            items.push({
                key: localize('popups.nativeToken.property.storageDeposit'),
                value: storageDeposit,
            })
        }
        if (tokenName) {
            items.push({
                key: localize('popups.nativeToken.property.tokenName'),
                value: tokenName,
            })
        }
        if (totalSupply) {
            items.push({
                key: localize('popups.nativeToken.property.totalSupply'),
                value: String(totalSupply),
            })
        }
        if (decimals) {
            items.push({
                key: localize('popups.nativeToken.property.decimals'),
                value: String(decimals),
            })
        }
        if (symbol) {
            items.push({
                key: localize('popups.nativeToken.property.symbol'),
                value: symbol,
            })
        }
        if (url) {
            items.push({
                key: localize('popups.nativeToken.property.url'),
                value: url,
            })
        }
        if (logoUrl) {
            items.push({
                key: localize('popups.nativeToken.property.logoUrl'),
                value: logoUrl,
            })
        }
    }

    function getMetadata(details: IMintTokenDetails | undefined): IIrc30Metadata | undefined {
        if (details) {
            const { name: tokenName, symbol, description, url, logoUrl, decimals } = details

            return {
                standard: TokenStandard.Irc30,
                name: tokenName,
                symbol,
                decimals: Number(decimals),
                ...(description && { description }),
                ...(url && { url }),
                ...(logoUrl && { logoUrl }),
            }
        }
    }

    async function mintAction(): Promise<void> {
        try {
            if ($mintTokenDetails && metadata) {
                await mintNativeToken(
                    Number($mintTokenDetails.totalSupply),
                    Number($mintTokenDetails.circulatingSupply),
                    metadata
                )
                closePopup()
            } else {
                throw new Error()
            }
        } catch (err) {
            handleError(err)
        }
    }

    function onBackClick(): void {
        closePopup()
        openPopup({
            id: PopupId.MintNativeTokenForm,
            overflow: true,
        })
    }

    async function onConfirmClick(): Promise<void> {
        try {
            await checkActiveProfileAuth(mintAction, { stronghold: true, ledger: false })
        } catch (err) {
            handleError(err)
        }
    }

    onMount(async () => {
        try {
            await _onMount()
            await prepareFoundryOutput()
        } catch (err) {
            handleError(err.error)
        }
    })
</script>

<div class="space-y-6">
    <Text type={TextType.h4} fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('popups.nativeToken.confirmationTitle')}
    </Text>

    <div class="space-y-2 max-h-100 scrollable-y flex-1">
        <Table {items} />
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={isTransferring} onClick={onBackClick}>
            {localize('actions.back')}
        </Button>
        <Button classes="w-full" disabled={isTransferring} onClick={onConfirmClick} isBusy={isTransferring}>
            {localize('actions.confirm')}
        </Button>
    </div>
</div>
