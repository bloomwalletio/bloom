<script lang="ts">
    import LedgerIllustration from './LedgerIllustration.svelte'
    import { Avatar, IconName } from '@bloomwalletio/ui'
    import { Illustration, Logo } from '@ui'
    import { LedgerIllustrationVariant } from './ledger-illustration-variant.enum'
    import { Color } from '@bloomwalletio/ui/dist/constants/colors.constant'
    import { LogoName } from '@auxiliary/logo'

    export let variant: LedgerIllustrationVariant

    let icon: IconName | undefined
    let backgroundColor: Color
    let pill: any
    let illustration: string
    let logo: LogoName | undefined

    $: setLedgerIllustrationProps(variant)
    function setLedgerIllustrationProps(variant: LedgerIllustrationVariant) {
        icon = undefined
        logo = undefined
        pill = undefined
        switch (variant) {
            case LedgerIllustrationVariant.Danger: {
                icon = IconName.WarningCircle
                backgroundColor = 'danger'
                pill = { localeKey: 'pills.ledgerStatus.notConnected', color: backgroundColor }
                break
            }
            case LedgerIllustrationVariant.Pin: {
                illustration = 'ledger-pin'
                pill = { localeKey: 'pills.ledgerStatus.locked', color: 'warning' }
                break
            }
            case LedgerIllustrationVariant.OpenEthereum:
                logo = LogoName.Ethereum
                backgroundColor = '#627EEA'
                pill = { localeKey: 'pills.ledgerStatus.appNotOpen', color: 'warning' }
                break
            case LedgerIllustrationVariant.OpenShimmer:
                icon = IconName.Shimmer
                backgroundColor = 'neutral'
                pill = { localeKey: 'pills.ledgerStatus.appNotOpen', color: 'warning' }
                break
            case LedgerIllustrationVariant.Warning:
                break
            case LedgerIllustrationVariant.Success:
                break
            default:
        }
    }
</script>

<LedgerIllustration class={$$restProps.class} {pill}>
    {#if icon}
        <Avatar {backgroundColor} {icon} shape="square" />
    {:else if logo}
        <Avatar {backgroundColor} size="md" shape="square">
            <Logo {logo} />
        </Avatar>
    {:else}
        <div class="flex flex-none">
            <Illustration {illustration} />
        </div>
    {/if}
</LedgerIllustration>
