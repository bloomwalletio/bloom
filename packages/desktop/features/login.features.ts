import { ILoginFeatures } from '@lib/features/interfaces'

const loginFeatures: ILoginFeatures = {
    selectProfile: {
        autoSelect: {
            enabled: false,
        },
        createNewProfile: {
            enabled: true,
        },
        profileActions: {
            enabled: false,
            edit: {
                enabled: false,
            },
            remove: {
                enabled: false,
            },
            viewInFiles: {
                enabled: false,
            },
        },
    },
    login: {
        errorCooldown: {
            enabled: false,
        },
    },
    settings: {
        enabled: false,
    },
    help: {
        enabled: false,
    },
}

export default loginFeatures
