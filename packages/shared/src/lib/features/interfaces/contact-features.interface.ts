import { IFeatureFlag } from '@features/interfaces/feature-flag.interface'

export interface IContactFeatures extends IFeatureFlag {
    sendTo: IFeatureFlag
    addContact: IFeatureFlag
    editContact: IFeatureFlag
    removeContact: IFeatureFlag
    addNetworkAddress: IFeatureFlag
    editNetworkAddresses: IFeatureFlag
    removeNetwork: IFeatureFlag
}
