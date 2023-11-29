<script lang="ts">
    import { Text } from '@bloomwalletio/ui'
    import { ContactCard } from '@components'
    import { IContact } from '@core/contact'

    export let contacts: IContact[]
    export let onContactClick: ((contact: IContact) => void) | undefined

    const contactGroupings = getGroupingsForContactList()
    function getGroupingsForContactList(): { [letter: string]: IContact[] } {
        const groupings: { [letter: string]: IContact[] } = {}
        for (const contact of contacts.sort((c1, c2) => c1.name.toLowerCase().localeCompare(c2.name.toLowerCase()))) {
            const lowercaseInitial = contact.name[0]?.toLowerCase()

            if (!(lowercaseInitial in groupings)) {
                groupings[lowercaseInitial] = []
            }
            groupings[lowercaseInitial].push(contact)
        }
        return groupings
    }
</script>

<contact-list class="flex flex-col justify-between gap-4 mb-6">
    {#each Object.keys(contactGroupings) as letter}
        <div class="flex flex-col justify-between gap-2">
            <Text type="body1" textColor="brand">{letter.toUpperCase()}</Text>
            {#each contactGroupings[letter] as contact}
                <ContactCard {contact} onCardClick={() => onContactClick(contact)} />
            {/each}
        </div>
    {/each}
</contact-list>
