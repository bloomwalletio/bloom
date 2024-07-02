export enum RpcMethod {
    EthSign = 'eth_sign',
    PersonalSign = 'personal_sign',
    EthSignTypedData = 'eth_signTypedData',
    EthSignTypedDataV3 = 'eth_signTypedData_v3',
    EthSignTypedDataV4 = 'eth_signTypedData_v4',
    EthSignTransaction = 'eth_signTransaction',
    EthSendTransaction = 'eth_sendTransaction',
    EthSendRawTransaction = 'eth_sendRawTransaction',
    WalletWatchAsset = 'wallet_watchAsset',
    WalletSwitchEthereumChain = 'wallet_switchEthereumChain',
}
