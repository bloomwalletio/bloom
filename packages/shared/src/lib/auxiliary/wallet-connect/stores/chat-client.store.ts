import { Writable, get, writable } from 'svelte/store'
import type { ChatClient } from '@walletconnect/chat-client/dist/types/client'

export const chatClient: Writable<ChatClient | undefined> = writable(undefined)

export function getChatClient(): ChatClient | undefined {
    return get(chatClient)
}
