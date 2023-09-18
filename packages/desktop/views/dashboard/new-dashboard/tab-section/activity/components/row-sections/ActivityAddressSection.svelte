<script lang="ts">
    import { FontWeight, Text } from '@ui'
    import { Activity } from '@core/activity'
    import { truncateString } from '@core/utils/string'
    import { Subject, SubjectType } from '@core/wallet'

    export let activity: Activity

    function getDisplayedSubject(subject: Subject | undefined): string {
        if (!subject) {
            return 'Unknown'
        }

        switch (subject.type) {
            case SubjectType.Contact:
                return truncateString(subject.contact.name, 13, 0)
            case SubjectType.Account:
                return truncateString(subject.account.name, 13, 0)
            default:
                return truncateString(subject.address, 6, 6)
        }
    }
</script>

<Text fontWeight={FontWeight.semibold} classes="text-start">{getDisplayedSubject(activity.sender)}</Text>
<Text fontWeight={FontWeight.semibold} classes="text-start">{getDisplayedSubject(activity.recipient)}</Text>
