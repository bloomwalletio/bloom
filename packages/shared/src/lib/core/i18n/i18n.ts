import { Writable, get } from 'svelte/store'
import { addMessages, dictionary, getLocaleFromNavigator, init, _, getDateFormatter } from 'svelte-i18n'

import { DEFAULT_LOCALE_OPTIONS, SUPPORTED_LOCALES } from './constants'
import { LocaleOptions } from './types'

/*
 * Code following https://phrase.com/blog/posts/a-step-by-step-guide-to-svelte-localization-with-svelte-i18n-v3/
 */

type LocaleDictionary = (typeof dictionary extends Writable<infer U> ? U : never)[string]

function verifySupportedLocale(locale: string): string {
    return locale in SUPPORTED_LOCALES ? locale : DEFAULT_LOCALE_OPTIONS.fallbackLocale
}

function reduceLocale(locale: string): string {
    return locale.replace('_', '-').split('-')[0]
}

function hasLoadedLocale(locale: string): boolean {
    return locale in get(dictionary)
}

function loadJson(url: string): Promise<LocaleDictionary> {
    return fetch(url).then((response) => response.json())
}

async function loadLocaleMessages(locale: string): Promise<void> {
    const messagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', locale)
    const localeDictionary = await loadJson(messagesFileUrl)

    addMessages(locale, localeDictionary)
}

const MESSAGE_FILE_URL_TEMPLATE = 'locales/{locale}.json'

/**
 * Initializes and loads the appropriate i18n dictionary given
 * specific locale options.
 */
export async function setupI18n(options: LocaleOptions = { fallbackLocale: 'en', initialLocale: null }): Promise<void> {
    // Attempt to auto-detect user's locale if not explicitly given
    const locale = verifySupportedLocale(options.initialLocale || reduceLocale(getLocaleFromNavigator() || 'en'))

    await init({ ...DEFAULT_LOCALE_OPTIONS, initialLocale: locale } as Parameters<typeof init>[0])

    if (!hasLoadedLocale(locale)) {
        await loadLocaleMessages(locale)

        // Load English locale dictionary as fallback for unsupported translations
        if (locale !== 'en' && !hasLoadedLocale('en')) {
            await loadLocaleMessages('en')
        }
    }
}

/**
 * Translates a given dictionary path into the appropriate locale.
 */
export function localize(path: string, options?: unknown): string {
    if (options && typeof options === 'object') {
        if ('values' in options && options.values && typeof options.values === 'object') {
            return get(_)(path, options as Record<string, string>)
        } else {
            return get(_)(path, { values: options as Record<string, string> })
        }
    } else {
        return get(_)(path)
    }
}

/**
 * Sets the locale dictionary to a given language, resetting the dictionary
 * if already initialized.
 */
export function setLanguage(language: string): void {
    void setupI18n({ fallbackLocale: 'en', initialLocale: language })
}

/**
 * Formats a given date according to the current locale options.
 */
export function formatDate(
    date: Date,
    options: Intl.DateTimeFormatOptions & {
        format?: string
        locale?: string
        dateStyle?: 'full' | 'long' | 'medium' | 'short'
        timeStyle?: 'full' | 'long' | 'medium' | 'short'
    }
): string {
    return getDateFormatter({ locale: getLocaleFromNavigator(), ...options }).format(date)
}

// We expose the svelte-i18n _ store so that our app has a single API for i18n
export { _ }
