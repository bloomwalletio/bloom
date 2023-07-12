import { CONTACT_NOTE_MAX_LENGTH } from '../constants'

export function validateContactNote(note: string): void {
    if (note.length > CONTACT_NOTE_MAX_LENGTH) {
        throw new Error('Note too long')
    }
}
