import {
    IIscpEvmNetworkConfiguration,
    IPureEvmNetworkConfiguration,
    IStardustNetworkMetadata,
} from '@core/network/interfaces'

export interface IPersistedStardustNetwork extends IStardustNetworkMetadata {
    chainConfigurations: IIscpEvmNetworkConfiguration[]
}

export type IPersistedNetwork = IPersistedStardustNetwork | IPureEvmNetworkConfiguration
