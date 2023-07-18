import { IFeatureFlag } from './feature-flag.interface'

export interface IContactsFeatures extends IFeatureFlag {
    sendTo: IFeatureFlag
    addContact: IFeatureFlag
    editContact: IFeatureFlag
    removeContact: IFeatureFlag
    addNetworkAddress: IFeatureFlag
    editNetworkAddresses: IFeatureFlag
    removeNetwork: IFeatureFlag
}
