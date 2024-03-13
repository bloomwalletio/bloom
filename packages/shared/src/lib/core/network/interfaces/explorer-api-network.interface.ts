export interface IExplorerApiNetwork {
    network: string
    label: string
    protocolVersion: string
    isEnabled: boolean
    showMarket: boolean
    hasStatisticsSupport: boolean
    description: string
    bechHrp?: string
    didExample?: string
    milestoneInterval?: number
    coordinatorAddress?: string
    coordinatorSecurityLevel?: number
    uiTheme?: string
    circulatingSupply?: number
    tokenRegistryEndpoint?: string
    faucet?: string
}
