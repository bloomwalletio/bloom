<script lang="ts">
    import { selectedAccountIndex } from '@core/account/stores'
    import { NetworkId } from '@core/network'
    import { truncateString } from '@core/utils/string'
    import { Subject, SubjectType } from '@core/wallet'
    import { NetworkAvatar } from '@ui'
    import { Text } from '@bloomwalletio/ui'

    export let subject: Subject | undefined
    export let networkId: NetworkId | undefined

    $: isSelectedAccount = subject?.type === SubjectType.Account && subject.account.index === $selectedAccountIndex

    function getDisplayedSubject(subject: Subject | undefined): string {
        if (!subject) {
            return '-'
        }

        switch (subject.type) {
            case SubjectType.Contact:
                return truncateString(subject.contact.name, 13, 0)
            case SubjectType.Account:
                return truncateString(subject.account.name, 13, 0)
            default:
                return truncateString(subject.address, 5, 5)
        }
    }
</script>

<div class="flex flex-row items-center gap-2">
    {#if networkId}
        <NetworkAvatar size="xxs" {networkId} />
    {/if}
    <Text
        type={subject?.type === SubjectType.Address ? 'pre-sm' : 'sm'}
        fontWeight={isSelectedAccount ? 'semibold' : 'medium'}
        classes="text-start">{getDisplayedSubject(subject)}</Text
    >
</div>
