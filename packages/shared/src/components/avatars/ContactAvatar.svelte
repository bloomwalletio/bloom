<script lang="ts">
    import { Avatar } from '@bloomwalletio/ui'
    import { IContact } from '@core/contact'
    import { getInitials } from '@core/utils'
    import { AvatarSize } from '@ui/enums'

    export let contact: IContact
    export let size: AvatarSize = AvatarSize.ExtraSmall
</script>

<contact-avatar>
    <Avatar {size} color={contact.color} text={getInitials(contact?.name, 2)} />
</contact-avatar>
