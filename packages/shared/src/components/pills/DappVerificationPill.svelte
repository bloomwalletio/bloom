<script lang="ts">
    import { Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'

    export let verifiedState: DappVerification

    let color: 'success' | 'warning' | 'danger' = 'success'
    $: {
        switch (verifiedState) {
            case DappVerification.Valid:
                color = 'success'
                break
            case DappVerification.Unknown:
                color = 'warning'
                break
            case DappVerification.Invalid:
            case DappVerification.Scam:
                color = 'danger'
                break
        }
    }
</script>

<Pill {color}>
    {localize(`pills.dappVerification.${verifiedState.toLowerCase()}`)}
</Pill>
