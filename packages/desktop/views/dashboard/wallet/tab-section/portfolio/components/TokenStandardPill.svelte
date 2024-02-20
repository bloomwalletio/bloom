<script lang="ts">
    import { ITokenWithBalance, TokenStandard } from '@core/token'
    import { Pill } from '@bloomwalletio/ui'

    export let token: ITokenWithBalance
</script>

{#if token.standard}
    <token-standard-pill>
        <Pill color="neutral" compact>
            {token.standard === TokenStandard.BaseToken
                ? 'Base'
                : token.standard === TokenStandard.Erc20
                  ? 'ERC20'
                  : token.standard === TokenStandard.Irc30
                    ? 'IRC30'
                    : undefined}
        </Pill>
    </token-standard-pill>
{/if}
