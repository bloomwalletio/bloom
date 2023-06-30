import { INITIAL_ACTIVE_PROFILE } from '@core/profile/constants/initial-active-profile.constant'
import { getActiveProfile, updateActiveProfile } from '@core/profile/stores/active-profile.store'
import { ContactManager } from '@core/contacts/classes'

jest.mock('../../../profile/stores/active-profile.store', () => ({
    getActiveProfile: jest.fn(() => INITIAL_ACTIVE_PROFILE),
    updateActiveProfile: jest.fn(() => {}),
}))

jest.mock('../../../utils/random.ts', () => ({
    generateRandomId: jest.fn(() => '1273ac5a067ab69a350ada37a660555c'),
}))

describe('File: contact-manager.test.ts', () => {
    beforeEach(() => {
        jest.clearAllMocks() // Reset the mock calls before each test
    })

    it('should add a contact with the provided details', () => {
        const mockContactId = 'contactId'
        const mockContact = {
            id: mockContactId,
            name: 'John Doe',
            color: 'blue',
            addresses: [],
            note: 'Test note',
        }

        const mockNetworkId = 'networkId'
        const mockAddressName = 'addressName'
        const mockAddress = 'test@example.com'

        // Call the addContact function
        ContactManager.addContact(
            { name: mockContact.name, note: mockContact.note },
            { networkId: mockNetworkId, addressName: mockAddressName, address: mockAddress }
        )

        // Expect the getActiveProfile function to be called three times
        expect(getActiveProfile).toHaveBeenCalledTimes(3)

        // Expect the updateActiveProfile function to be called once with the modified profile
        expect(updateActiveProfile).toHaveBeenCalledTimes(1)
        // expect(updateActiveProfile).toHaveBeenCalledWith({});

        // Expect the contact to be added to the contacts object in the profile
        // expect(mockProfile.contacts[mockContactId]).toEqual(mockContact);

        // Expect the addContactAddress function to be called with the correct parameters
        // expect(ContactManager.addContactAddress).toHaveBeenCalledTimes(1);
        // expect(ContactManager.addContactAddress).toHaveBeenCalledWith(
        //     mockContactId,
        //     mockNetworkId,
        //     mockAddressName,
        //     mockAddress
        // );
    })
})
