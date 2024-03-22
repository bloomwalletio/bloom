import { drawerState } from '../stores'

export function updateDrawerProps(props: Record<string, unknown>): void {
    drawerState.update((state) => {
        if (state) {
            return {
                ...state,
                props: {
                    ...state.props,
                    ...props,
                },
            }
        }
    })
}
