import { ILoginFeatures } from '@lib/features/interfaces'

const loginFeatures: ILoginFeatures = {
    profileActions: {
        enabled: true,
        diagnostics: {
            enabled: true,
        },
        delete: {
            enabled: false,
        },
    },
}

export default loginFeatures
