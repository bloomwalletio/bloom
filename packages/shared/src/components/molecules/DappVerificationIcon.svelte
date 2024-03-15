<script lang="ts">
    import { Icon } from '@bloomwalletio/ui'
    import { DappVerification } from '@auxiliary/wallet-connect/enums'
    import { VERIFICATION_ICONS } from '@auxiliary/wallet-connect/constants/verification-icons.constant'

    export let verifiedState: DappVerification | undefined = undefined
</script>

{#if verifiedState}
    {@const { color, icon } = VERIFICATION_ICONS[verifiedState]}
    <Icon name={icon} size="xs" textColor={color} />
{/if}
