<script lang="ts">
    import { Avatar } from '@ui'
    import { AvatarSize } from '@ui/enums'
    import { IContact } from '@core/contact'

    export let contact: IContact
    export let size: AvatarSize = AvatarSize.ExtraSmall
</script>

<contact-avatar>
    <Avatar {size} text={contact.name} color={contact?.color} />
</contact-avatar>
