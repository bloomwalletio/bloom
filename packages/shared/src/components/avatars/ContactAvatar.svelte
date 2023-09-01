<script lang="ts">
    import { Avatar, avatarSize } from '@bloomwalletio/ui'
    import { IContact } from '@core/contact'
    import { getInitials } from '@core/utils'

    export let contact: IContact
    export let size: (typeof avatarSize)[number] = 'xs'
</script>

<contact-avatar>
    <Avatar {size} backgroundColor={contact.color} text={getInitials(contact?.name, 2)} />
</contact-avatar>
