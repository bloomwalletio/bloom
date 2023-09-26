<script lang="ts">
    import { LogoName } from '@auxiliary/logo'
    import { IconName } from '@bloomwalletio/ui'
    import { StatusTile } from '@components'
    import { localize } from '@core/i18n'
    import { LedgerConnectionState, ledgerConnectionState } from '@core/ledger'

    $: statusTileProps = setStatusTileProps($ledgerConnectionState)

    interface StatusTileProps {
        title: string
        subtitle: string
        logo: LogoName
        iconName: IconName
        iconColor: string
        iconBackgroundColor: string
    }

    function setStatusTileProps(connectionState: LedgerConnectionState): StatusTileProps {
        let subtitle: string
        let logo: LogoName
        let iconName: IconName
        let iconColor: string
        let iconBackgroundColor: string

        switch (connectionState) {
            case LedgerConnectionState.AppNotOpen:
                subtitle = localize('general.unlocked')
                iconName = IconName.Cpu
                iconColor = 'gray'
                break
            case LedgerConnectionState.ShimmerAppOpen:
                subtitle = 'Shimmer App'
                iconName = IconName.Shimmer
                iconColor = '#17E1D5'
                iconBackgroundColor = '#002D56'
                break
            case LedgerConnectionState.EthereumAppOpen:
                subtitle = 'Ethereum App'
                logo = LogoName.Ethereum
                iconBackgroundColor = '#627EEA'
                break
            case LedgerConnectionState.Locked:
                subtitle = localize('general.locked')
                iconName = IconName.Cpu
                iconColor = 'green'
                break
            case LedgerConnectionState.NotConnected:
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

<StatusTile {...statusTileProps} />
