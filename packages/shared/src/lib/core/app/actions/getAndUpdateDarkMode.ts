import { Platform } from '../classes'
import { darkMode } from '../stores'

export async function getAndUpdateDarkMode(): Promise<void> {
    const shouldBeDarkMode = await Platform.shouldBeDarkMode()
    darkMode.set(shouldBeDarkMode)
}
