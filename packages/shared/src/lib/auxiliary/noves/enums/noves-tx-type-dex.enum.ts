// https://docs.noves.fi/reference/dex-transactions
export enum NovesTxTypeDEX {
    AddLiquidity = 'addLiquidity',
    CancelOrderTransaction = 'cancelOrderTransaction',
    CustodiedRemoveLiquidity = 'custodiedRemoveLiquidity',
    DepositToExchange = 'depositToExchange',
    FillOrderTransaction = 'fillOrderTransaction',
    PlaceOrderTransaction = 'placeOrderTransaction',
    Swap = 'swap',
    RemoveLiquidity = 'removeLiquidity',
    WithdrawFromExchange = 'withdrawFromExchange',
}
