import { PlatformOption } from '../enums/platform-option.enum'

export const OS = process.platform

export const IS_WINDOWS = OS === PlatformOption.Windows
export const IS_MAC = OS === PlatformOption.MacOs
export const IS_LINUX = OS === PlatformOption.Linux
