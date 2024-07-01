export interface IFeatureFlag {
    enabled: boolean
    hidden?: boolean
    sell?: IFeatureFlag
}
