import { ITideLeaderboardItem, ITideUserPosition } from '@core/tide/interfaces'

export interface ILeaderBoard {
    board: ITideLeaderboardItem[]
    userPosition: ITideUserPosition
}
