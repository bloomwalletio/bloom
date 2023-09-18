<script lang="ts">
    import { selectedAccountIndex } from '@core/account/stores'
    import { NetworkId } from '@core/network'
    import { truncateString } from '@core/utils/string'
    import { Subject, SubjectType } from '@core/wallet'
    import { FontWeight, NetworkAvatar, Text } from '@ui'

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
    <Text fontWeight={isSelectedAccount ? FontWeight.semibold : FontWeight.normal} classes="text-start"
        >{getDisplayedSubject(subject)}</Text
    >
</div>
