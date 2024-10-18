import {
    NovesTxTypeCrossChain,
    NovesTxTypeDEX,
    NovesTxTypeToken,
    NovesTxTypeNFT,
    NovesTxTypeLending,
    NovesTxTypeYield,
    NovesTxTypeDomain,
    NovesTxTypeGovernance,
    NovesTxTypeInfrastructure,
    NovesTxTypeSpecial,
    NovesTxTypeMiscellaneous,
} from '../enums'

export type NovesTxType =
    | NovesTxTypeCrossChain
    | NovesTxTypeDEX
    | NovesTxTypeToken
    | NovesTxTypeNFT
    | NovesTxTypeLending
    | NovesTxTypeYield
    | NovesTxTypeDomain
    | NovesTxTypeGovernance
    | NovesTxTypeInfrastructure
    | NovesTxTypeSpecial
    | NovesTxTypeMiscellaneous
