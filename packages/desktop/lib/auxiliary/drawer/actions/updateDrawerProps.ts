import { drawerState } from '../stores'

export function updateDrawerProps(props: Record<string, unknown>): void {
    drawerState.update((state) => ({
        ...state,
        props: {
            ...state.props,
            ...props,
        },
    }))
}
