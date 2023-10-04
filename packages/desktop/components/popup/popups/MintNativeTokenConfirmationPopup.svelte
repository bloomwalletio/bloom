<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { onMount } from 'svelte'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { getBaseToken, checkActiveProfileAuth } from '@core/profile/actions'
    import { mintNativeToken, mintTokenDetails, buildFoundryOutputBuilderParams, IMintTokenDetails } from '@core/wallet'
    import { closePopup, openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { Button, Text, FontWeight, TextType } from '@ui'
    import { IIrc30Metadata, TokenStandard, formatTokenAmountPrecise } from '@core/token'
    import { getClient } from '@core/profile-manager'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let storageDeposit = '0'

    let metadata: IIrc30Metadata | undefined
    $: metadata = getMetadata($mintTokenDetails)
    $: isTransferring = $selectedAccount?.isTransferring

    async function prepareFoundryOutput(): Promise<void> {
        if ($mintTokenDetails && $selectedAccount && metadata) {
            const { totalSupply, circulatingSupply, aliasId } = $mintTokenDetails
            const foundryOutputParams = await buildFoundryOutputBuilderParams(
                Number(totalSupply),
                Number(circulatingSupply),
                metadata,
                aliasId
            )
            const client = await getClient()
            const preparedOutput = await client.buildFoundryOutput(foundryOutputParams)
            storageDeposit = formatTokenAmountPrecise(Number(preparedOutput.amount) ?? 0, getBaseToken())
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
    {#if $mintTokenDetails}
        {@const { name: tokenName, symbol, aliasId, url, logoUrl, decimals, totalSupply } = $mintTokenDetails}
        <div class="space-y-2 max-h-100 scrollable-y flex-1">
            <Table
                items={[
                    {
                        key: localize('popups.nativeToken.property.alias'),
                        value: aliasId,
                        copyable: true,
                    },
                    {
                        key: localize('popups.nativeToken.property.storageDeposit'),
                        value: storageDeposit ? storageDeposit : undefined,
                    },
                    {
                        key: localize('popups.nativeToken.property.tokenName'),
                        value: tokenName,
                    },
                    {
                        key: localize('popups.nativeToken.property.totalSupply'),
                        value: String(totalSupply),
                    },
                    {
                        key: localize('popups.nativeToken.property.decimals'),
                        value: decimals ? String(decimals) : undefined,
                    },
                    {
                        key: localize('popups.nativeToken.property.symbol'),
                        value: symbol,
                    },
                    {
                        key: localize('popups.nativeToken.property.url'),
                        value: url,
                    },
                    {
                        key: localize('popups.nativeToken.property.logoUrl'),
                        value: logoUrl,
                    },
                ]}
            />
        </div>
    {/if}
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={isTransferring} onClick={onBackClick}>
            {localize('actions.back')}
        </Button>
        <Button classes="w-full" disabled={isTransferring} onClick={onConfirmClick} isBusy={isTransferring}>
            {localize('actions.confirm')}
        </Button>
    </div>
</div>
