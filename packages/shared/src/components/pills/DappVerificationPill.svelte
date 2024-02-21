<script lang="ts">
    import { Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { VERIFICATION_ICONS } from '@auxiliary/wallet-connect/constants/verification-icons.constant'

    export let verifiedState: DappVerification
</script>

<Pill color={VERIFICATION_ICONS[verifiedState]?.color ?? 'neutral'}>
    {localize(`pills.dappVerification.${verifiedState.toLowerCase()}`)}
</Pill>
