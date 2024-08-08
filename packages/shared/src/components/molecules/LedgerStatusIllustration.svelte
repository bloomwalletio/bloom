<script lang="ts">
    import { Avatar, AvatarShape, IconName } from '@bloomwalletio/ui'
    import { Illustration, Logo } from '@ui'
    import { LogoName } from '@auxiliary/logo'
    import { LedgerIllustration } from '../atoms'
    import { LedgerIllustrationVariant } from '../enums'

    export let variant: LedgerIllustrationVariant

    let icon: IconName | undefined
    let backgroundColor: string
    let customTextColor: string | undefined
    let pill: any
    let illustration: string
    let logo: LogoName | undefined
    let shape: AvatarShape
    let showArrows: boolean = false

    $: setLedgerIllustrationProps(variant)
    function setLedgerIllustrationProps(variant: LedgerIllustrationVariant): void {
        icon = undefined
        customTextColor = undefined
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
            case LedgerIllustrationVariant.Hash: {
                illustration = 'ledger-hash'
                showArrows = true
                break
            }
            case LedgerIllustrationVariant.OpenShimmer:
                icon = IconName.Shimmer
                customTextColor = 'shimmer'
                backgroundColor = 'shimmer-background'
                pill = { localeKey: 'pills.ledgerStatus.appNotOpen', color: 'warning' }
                shape = 'square'
                break
            case LedgerIllustrationVariant.OpenIota:
                icon = IconName.Iota
                customTextColor = 'iota'
                backgroundColor = 'text-primary'
                pill = { localeKey: 'pills.ledgerStatus.appNotOpen', color: 'warning' }
                shape = 'square'
                break
            case LedgerIllustrationVariant.OpenEthereum:
                logo = LogoName.Ethereum
                backgroundColor = 'ethereum'
                pill = { localeKey: 'pills.ledgerStatus.appNotOpen', color: 'warning' }
                shape = 'square'
                break
            case LedgerIllustrationVariant.Warning:
                icon = IconName.HelpCircle
                backgroundColor = 'warning'
                shape = 'circle'
                break
            case LedgerIllustrationVariant.UnsupportedVersion:
                icon = IconName.DangerCircle
                backgroundColor = 'danger'
                pill = { localeKey: 'pills.ledgerStatus.unsupportedVersion', color: 'danger' }
                shape = 'circle'
                break
            default:
        }
    }
</script>

<LedgerIllustration {pill} {showArrows}>
    {#if icon}
        <Avatar {backgroundColor} size="md" {icon} {customTextColor} {shape} />
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
