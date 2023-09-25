<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import { StatusTile } from '@components'
    import { localize } from '@core/i18n'
    import { LedgerConnectionState, ledgerConnectionState } from '@core/ledger'

    $: statusTileProps = setStatusTileProps($ledgerConnectionState)

    function setStatusTileProps(connectionState: LedgerConnectionState): any {
        const title = localize('general.ledgerDevice')
        let iconColor: string
        let iconName: IconName
        let subTitle: string
        let iconBackgroundColor: string
        let logo: string

        switch (connectionState) {
            case LedgerConnectionState.AppNotOpen:
                iconColor = 'gray'
                iconName = IconName.Cpu
                subTitle = 'Unlocked'
                break
            case LedgerConnectionState.ShimmerAppOpen:
                iconColor = '#17E1D5'
                iconBackgroundColor = '#002D56'
                iconName = IconName.Shimmer
                subTitle = 'Shimmer App'
                break
            case LedgerConnectionState.EthereumAppOpen:
                logo = 'ethereum'
                iconBackgroundColor = '#627EEA'
                subTitle = 'Ethereum App'
                break
            case LedgerConnectionState.Locked:
                iconColor = 'green'
                iconName = IconName.Cpu
                subTitle = 'Locked'
                break
            case LedgerConnectionState.NotConnected:
            default:
                iconColor = 'danger'
                iconName = IconName.ZapOff
                subTitle = 'Disconnected'
                break
        }

        return {
            iconColor,
            iconName,
            title,
            subTitle,
            iconBackgroundColor,
            logo,
        }
    }
</script>

<StatusTile {...statusTileProps} />
