import { NovesToken } from './noves-token.interface'

export interface NovesTxResponse {
    txTypeVersion: number
    chain: string
    accountAddress: string
    classificationData: ClassificationData
    rawTransactionData: RawTransactionData
}

interface TransactionParty {
    name: string | null
    address: string | null
}

interface SentReceived {
    action: string
    from: TransactionParty
    to: TransactionParty
    amount: string
    token: NovesToken
}

interface ClassificationSource {
    type: string
}

interface Protocol {
    name: string | null
}

interface ClassificationData {
    type: string
    source: ClassificationSource
    description: string
    protocol: Protocol
    sent: SentReceived[]
    received: SentReceived[]
}

interface TransactionFee {
    amount: string
    token: NovesToken
}

interface RawTransactionData {
    transactionHash: string
    fromAddress: string
    toAddress: string
    blockNumber: number
    gas: number
    gasUsed: number
    gasPrice: number
    transactionFee: TransactionFee
    timestamp: number
}
