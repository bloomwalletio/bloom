<script lang="ts">
    import { LogoName } from '@auxiliary/logo'
    import { IconName } from '@bloomwalletio/ui'
    import { StatusTile, StatusTileProps } from '@components'
    import { localize } from '@core/i18n'
    import { LedgerConnectionState, ledgerConnectionState } from '@core/ledger'

    $: statusTileProps = setStatusTileProps($ledgerConnectionState)

    function setStatusTileProps(connectionState: LedgerConnectionState): StatusTileProps {
        let subtitle: string
        let logo: LogoName
        let iconName: IconName
        let iconColor: string
        let iconBackgroundColor: string

        switch (connectionState) {
            case LedgerConnectionState.AppNotOpen:
                subtitle = localize('general.unlocked')
                iconName = IconName.Hardware
                iconColor = 'neutral'
                break
            case LedgerConnectionState.ShimmerAppOpen:
                subtitle = 'Shimmer App'
                iconName = IconName.Shimmer
                iconColor = 'shimmer'
                iconBackgroundColor = 'shimmer-background'
                break
            case LedgerConnectionState.EthereumAppOpen:
                subtitle = 'Ethereum App'
                logo = LogoName.Ethereum
                iconBackgroundColor = 'ethereum'
                break
            case LedgerConnectionState.Locked:
                subtitle = localize('general.locked')
                iconName = IconName.Hardware
                iconColor = 'success'
                break
            case LedgerConnectionState.Disconnected:
            default:
                subtitle = localize('general.disconnected')
                iconName = IconName.ZapOff
                iconColor = 'danger'
                break
        }

        return {
            title: localize('general.ledgerDevice'),
            subtitle,
            logo,
            iconName,
            iconColor,
            iconBackgroundColor,
        }
    }
</script>

<StatusTile {statusTileProps} />
