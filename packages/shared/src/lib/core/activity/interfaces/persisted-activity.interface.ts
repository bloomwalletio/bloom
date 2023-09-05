import { ILayer2TransferAllowanceMetadata } from '@core/layer-2'
import { NetworkId } from '@core/network'
import { IParticipation, Subject } from '@core/wallet'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, GovernanceAction, InclusionState } from '../enums'

export interface IActivityAsyncData {
    asyncStatus: ActivityAsyncStatus
    timelockDate: Date
    expirationDate: Date
    isRejected: boolean
    isClaiming: boolean
    claimingTransactionId?: string
    claimedDate?: Date
}

export interface IPersistedActivityStardustBase {
    // meta information
    id: string
    isHidden?: boolean
    isTokenHidden?: boolean // is this needed?
    containsValue?: boolean // is this needed?

    // transaction information
    transactionId?: string
    outputId?: string
    time: Date
    inclusionState: InclusionState
    tag?: string
    metadata?: string

    // sender / recipient information
    sourceNetworkId: NetworkId
    senderAddress: Subject | undefined
    destinationNetworkId: NetworkId
    recipientAddress: Subject | undefined
    isInternal: boolean
    direction: ActivityDirection

    // asset information
    storageDeposit?: number
}

export interface IPersistedActivityStardustBasic extends IPersistedActivityStardustBase {
    type: ActivityType.Basic
    data: {
        action: BasicActivityAction
        baseToken: string
        nativeTokens: {
            tokenId: string
            amount: string
        }
    }
    asyncData?: IActivityAsyncData
}

export enum BasicActivityAction {
    Transfer = 'transfer',
    Burn = 'burn',
}

export interface IPersistedActivityStardustNft extends IPersistedActivityStardustBase {
    type: ActivityType.Nft
    data: {
        action: NftActivityAction
        tokenId: string
    }
    asyncData?: IActivityAsyncData
}

export enum NftActivityAction {
    Mint = 'mint',
    Transfer = 'transfer',
    Burn = 'burn',
}

export interface IPersistedActivityStardustSmartContract extends IPersistedActivityStardustBase {
    type: ActivityType.SmartContract
    data: IActivitySmartContractData
}

export interface IActivitySmartContractData {
    action: SmartContractActivityAction.Transfer
    request?: ILayer2TransferAllowanceMetadata
    estimatedGasFee?: number
    maxGasFee?: number
    transactionFee?: number
}

export enum SmartContractActivityAction {
    Transfer = 'transfer',
}

export interface IPersistedActivityStardustConsolidation extends IPersistedActivityStardustBase {
    type: ActivityType.Consolidation
    data: {
        consolidatedInputCount: number
    }
}

export interface IPersistedActivityStardustGovernance extends IPersistedActivityStardustBase {
    type: ActivityType.Governance
    data:
        | {
              action: GovernanceAction.IncreaseVotingPower | GovernanceAction.DecreaseVotingPower // Todo rename enum to GovernanceActivityAction
              votingPower: number // do we need this?
              votingPowerDifference: number
          }
        | {
              action:
                  | GovernanceAction.StartVoting
                  | GovernanceAction.StopVoting
                  | GovernanceAction.ChangedVote
                  | GovernanceAction.Revote // Todo rename enum to GovernanceActivityAction
              votingPower: number // do we need this?
              participation: IParticipation
          }
}

export interface IPersistedActivityStardustAlias extends IPersistedActivityStardustBase {
    type: ActivityType.Alias
    data: {
        action: AliasActivityAction
        aliasId: string
        governorAddress: string
        stateControllerAddress: string
    }
}

export enum AliasActivityAction {
    Mint = 'mint',
    TransferGovernor = 'transferGovernor',
    TransferStateController = 'transferStateController',
    Burn = 'burn',
}

export interface IPersistedActivityStardustFoundry extends IPersistedActivityStardustBase {
    type: ActivityType.Foundry
    data: {
        action: FoundryActivityAction
        tokenId: string
        aliasAddress: string
        mintedTokens: string
        meltedTokens: string
        maximumSupply: string
    }
}

export enum FoundryActivityAction {
    Mint = 'mint',
    MintTokens = 'mintTokens',
    MeltTokens = 'meltTokens',
    Burn = 'burn',
}

export type PersistedActivityStardust =
    | IPersistedActivityStardustBasic
    | IPersistedActivityStardustNft
    | IPersistedActivityStardustSmartContract
    | IPersistedActivityStardustConsolidation
    | IPersistedActivityStardustGovernance
    | IPersistedActivityStardustAlias
    | IPersistedActivityStardustFoundry
