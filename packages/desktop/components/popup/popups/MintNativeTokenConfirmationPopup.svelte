<script lang="ts">
    import { Table } from '@bloomwalletio/ui'
    import { onMount } from 'svelte'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { getBaseToken, checkActiveProfileAuth } from '@core/profile/actions'
    import { mintNativeToken, mintTokenDetails, buildFoundryOutputBuilderParams, IMintTokenDetails } from '@core/wallet'
    import { closePopup, openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { IIrc30Metadata, TokenStandard, formatTokenAmountBestMatch } from '@core/token'
    import { getClient } from '@core/profile-manager'
    import PopupTemplate from '../PopupTemplate.svelte'

    let storageDeposit = '0'

    let metadata: IIrc30Metadata | undefined
    $: metadata = getMetadata($mintTokenDetails)
    $: isTransferring = $selectedAccount?.isTransferring

    async function prepareFoundryOutput(): Promise<void> {
        if ($mintTokenDetails && $selectedAccount && metadata) {
            const { totalSupply, circulatingSupply, aliasId } = $mintTokenDetails
            const foundryOutputParams = await buildFoundryOutputBuilderParams(
                totalSupply,
                circulatingSupply,
                metadata,
                aliasId
            )
            const client = await getClient()
            const preparedOutput = await client.buildFoundryOutput(foundryOutputParams)
            storageDeposit = formatTokenAmountBestMatch(BigInt(preparedOutput.amount ?? 0), getBaseToken())
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

    function onBackClick(): void {
        closePopup()
        openPopup({
            id: PopupId.MintNativeTokenForm,
            overflow: true,
        })
    }

    async function onConfirmClick(): Promise<void> {
        try {
            await checkActiveProfileAuth()
        } catch (error) {
            return
        }

        try {
            if ($mintTokenDetails && metadata) {
                await mintNativeToken($mintTokenDetails.totalSupply, $mintTokenDetails.circulatingSupply, metadata)
                closePopup()
            } else {
                throw new Error()
            }
        } catch (err) {
            handleError(err)
        }
    }

    onMount(async () => {
        try {
            await prepareFoundryOutput()
        } catch (err) {
            handleError(err.error)
        }
    })
</script>

<PopupTemplate
    title={localize('popups.nativeToken.confirmationTitle')}
    backButton={{
        text: localize('actions.back'),
        onClick: onBackClick,
        disabled: isTransferring,
    }}
    continueButton={{
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
        disabled: isTransferring,
    }}
    busy={isTransferring}
>
    {#if $mintTokenDetails}
        {@const { name: tokenName, symbol, aliasId, url, logoUrl, decimals, totalSupply } = $mintTokenDetails}
        <div class="max-h-100 scrollable-y flex-1">
            <Table
                items={[
                    {
                        key: localize('popups.nativeToken.property.alias'),
                        value: aliasId,
                        copyable: true,
                        truncate: true,
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
                        value: url || undefined,
                    },
                    {
                        key: localize('popups.nativeToken.property.logoUrl'),
                        value: logoUrl || undefined,
                    },
                ]}
            />
        </div>
    {/if}
</PopupTemplate>
