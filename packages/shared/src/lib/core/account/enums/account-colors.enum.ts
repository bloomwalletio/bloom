import tailwindConfig from 'shared/tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

const configColors = resolveConfig(tailwindConfig).theme.colors

export enum AccountColors {
    Red = configColors['red']['500'],
    Orange = configColors['orange']['500'],
    Amber = configColors['amber']['500'],
    Yellow = configColors['yellow']['500'],
    Lime = configColors['lime']['500'],
    Green = configColors['green']['500'],
    Emerald = configColors['emerald']['500'],
    Teal = configColors['teal']['500'],
    Cyan = configColors['cyan']['500'],
    Sky = configColors['sky']['500'],
    Blue = configColors['blue']['500'],
    Indigo = configColors['indigo']['500'],
    Violet = configColors['violet']['500'],
    Purple = configColors['purple']['500'],
    Fuchsia = configColors['fuchsia']['500'],
    Pink = configColors['pink']['500'],
    Rose = configColors['rose']['500'],
}
