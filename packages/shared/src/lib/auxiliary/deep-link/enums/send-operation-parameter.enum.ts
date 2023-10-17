/**
 * The query parameters available in a send operation.
 */
export enum SendOperationParameter {
    Address = 'address',
    BaseCoinAmount = 'baseCoinAmount',
    TokenId = 'tokenId',
    TokenAmount = 'tokenAmount',
    Metadata = 'metadata',
    Tag = 'tag',
    GiftStorageDeposit = 'giftStorageDeposit',
    DisableToggleGift = 'disableToggleGift',
    DisableChangeExpiration = 'disableChangeExpiration',
    DisableChangeTimelock = 'disableChangeTimelock',

    // Firefly Specific
    Surplus = 'surplus',
    Amount = 'amount',
    Unit = 'unit',
}
