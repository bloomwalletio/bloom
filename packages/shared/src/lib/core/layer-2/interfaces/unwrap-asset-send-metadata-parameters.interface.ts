export interface IUnwrapAssetSendMetadataParameters {
    items:
        | {
              key: Uint8Array
              value: Uint8Array
          }
        | []
}
