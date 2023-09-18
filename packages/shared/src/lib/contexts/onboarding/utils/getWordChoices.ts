import { get } from 'svelte/store'

import { generateRandomWord } from '@auxiliary/wordlists/utils'

import { onboardingProfile } from '../stores'

export function getWordChoices(mnemonicWordIndex: number): [string, string, string, string] {
    const mnemonic = get(onboardingProfile)?.mnemonic ?? []

    const actualWord = mnemonic[mnemonicWordIndex]
    const random1 = generateRandomWord(mnemonic)
    const random2 = generateRandomWord([...mnemonic, random1])
    const random3 = generateRandomWord([...mnemonic, random1, random2])

    return [actualWord, random1, random2, random3].sort(() => 0.5 - Math.random()) as [string, string, string, string]
}
