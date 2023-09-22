<script lang="ts">
    import { IconName } from '@bloomwalletio/ui'
    import { StatusTile } from '@components'
    // import { localize } from '@core/i18n'
    import { LedgerConnectionState, ledgerConnectionState } from '@core/ledger'

    $: statusTileProps = setStatusTileProps($ledgerConnectionState)

    function setStatusTileProps(connectionState: LedgerConnectionState): any {
        const title = 'Ledger Device'
        let iconColor: string
        let iconName: IconName
        let subTitle: string
        let backgroundColor: string

        switch (connectionState) {
            case LedgerConnectionState.AppNotOpen:
                iconColor = 'red'
                iconName = IconName.Cpu
                subTitle = 'Unlocked'
                break
            case LedgerConnectionState.CorrectAppOpen:
                iconColor = 'cyan'
                backgroundColor = 'blue'
                iconName = IconName.Shimmer
                subTitle = 'Shimmer App'
                break
            case LedgerConnectionState.Locked:
                iconColor = 'green'
                iconName = IconName.Cpu
                subTitle = 'Locked'
                break
            case LedgerConnectionState.NotConnected:
            default:
                iconColor = 'red'
                iconName = IconName.Bell
                subTitle = 'Disconnected'
                break
        }

        return {
            iconColor,
            iconName,
            title,
            subTitle,
            backgroundColor,
        }
    }
</script>

<StatusTile {...statusTileProps} />
