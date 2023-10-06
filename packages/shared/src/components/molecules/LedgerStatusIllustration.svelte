<script lang="ts">
    import { Avatar, AvatarShape, IconName } from '@bloomwalletio/ui'
    import { Illustration, Logo } from '@ui'
    import { Color } from '@bloomwalletio/ui'
    import { LogoName } from '@auxiliary/logo'
    import { LedgerIllustration } from '../atoms'
    import { LedgerIllustrationVariant } from '../enums'

    export let variant: LedgerIllustrationVariant

    let icon: IconName | undefined
    let backgroundColor: Color
    let pill: any
    let illustration: string
    let logo: LogoName | undefined
    let shape: AvatarShape

    $: setLedgerIllustrationProps(variant)
    function setLedgerIllustrationProps(variant: LedgerIllustrationVariant): void {
        icon = undefined
        logo = undefined
        pill = undefined
        switch (variant) {
            case LedgerIllustrationVariant.NotConnected: {
                icon = IconName.WarningCircle
                backgroundColor = 'danger'
                pill = { localeKey: 'pills.ledgerStatus.notConnected', color: backgroundColor }
                shape = 'circle'
                break
            }
            case LedgerIllustrationVariant.Pin: {
                illustration = 'ledger-pin'
                pill = { localeKey: 'pills.ledgerStatus.locked', color: 'warning' }
                break
            }
            case LedgerIllustrationVariant.OpenEthereum:
                logo = LogoName.Ethereum
                // @ts-ignore
                backgroundColor = '#627EEA'
                pill = { localeKey: 'pills.ledgerStatus.appNotOpen', color: 'warning' }
                shape = 'square'
                break
            case LedgerIllustrationVariant.OpenShimmer:
                icon = IconName.Shimmer
                backgroundColor = 'neutral'
                pill = { localeKey: 'pills.ledgerStatus.appNotOpen', color: 'warning' }
                shape = 'square'
                break
            case LedgerIllustrationVariant.Warning:
                icon = IconName.HelpCircle
                backgroundColor = 'warning'
                shape = 'circle'
                break
            case LedgerIllustrationVariant.Success:
                icon = IconName.SuccessCircle
                backgroundColor = 'success'
                shape = 'circle'
                break
            default:
        }
    }
</script>

<LedgerIllustration {pill}>
    {#if icon}
        <Avatar {backgroundColor} size="md" {icon} {shape} />
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
