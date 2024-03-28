<script lang="ts">
    import { selectedAccountIndex } from '@core/account/stores'
    import { NetworkId } from '@core/network'
    import { truncateString } from '@core/utils/string'
    import { Subject, SubjectType } from '@core/wallet'
    import { NetworkAvatar } from '@ui'
    import { IconName, Text, TooltipIcon } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    export let subject: Subject | undefined
    export let networkId: NetworkId | undefined

    $: isSelectedAccount = subject?.type === SubjectType.Account && subject.account.index === $selectedAccountIndex

    function getDisplayedSubject(subject: Subject | undefined): string {
        if (!subject) {
            return localize('general.unknown')
        }

        switch (subject.type) {
            case SubjectType.Contact:
                return truncateString(subject.contact.name, 13, 0)
            case SubjectType.SmartContract:
                return subject.name ? truncateString(subject.name, 13, 0) : truncateString(subject.address, 5, 5)
            case SubjectType.Account:
                return truncateString(subject.account.name, 13, 0)
            case SubjectType.Network:
                return truncateString(subject.name, 13, 0)
            default:
                return truncateString(subject.address, 5, 5)
        }
    }
</script>

<div class="flex flex-row items-center gap-2">
    {#if networkId}
        <NetworkAvatar size="xs" {networkId} />
    {/if}
    <div class="flex flex-row items-center gap-1">
        {#if subject?.type === SubjectType.SmartContract}
            <TooltipIcon
                icon={subject.verified ? IconName.FileCheck : IconName.FileCode}
                size="xs"
                textColor={subject.verified ? 'success' : 'secondary'}
                tooltip={localize(`general.${subject.verified ? 'verified' : 'unverified'}`)}
            />
        {/if}
        <Text
            type={subject?.type === SubjectType.Address ? 'pre-sm' : 'sm'}
            fontWeight={isSelectedAccount ? 'semibold' : 'medium'}
        >
            {getDisplayedSubject(subject)}
        </Text>
    </div>
</div>
