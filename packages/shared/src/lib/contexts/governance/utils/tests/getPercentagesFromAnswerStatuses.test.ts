import '@mocks/i18n.mock'
import type { AnswerStatus } from '@iota/sdk/out/types'
import { getPercentagesFromAnswerStatuses } from '../getPercentagesFromAnswerStatuses'
import type { IProposal } from '../../interfaces'

describe('File: getPercentagesFromAnswerStatuses.ts', () => {
    describe('Function: getPercentagesFromAnswerStatuses', () => {
        const mockProposal = {
            milestones: { ended: 10000 },
        }

        const ANSWER_STATUSES: AnswerStatus[] = [
            {
                value: 0,
                current: 10,
                accumulated: 1000,
            },
            {
                value: 1,
                current: 20,
                accumulated: 2000,
            },
            {
                value: 2,
                current: 30,
                accumulated: 3000,
            },
        ]

        it('should return percentages with projected votes from valid arguments and proposal', () => {
            const expectedPercentages = {
                0: { accumulated: '16.7%', projected: '25.0%' },
                1: { accumulated: '33.3%', projected: '37.5%' },
                2: { accumulated: '50%', projected: '37.5%' },
            }
            expect(getPercentagesFromAnswerStatuses(ANSWER_STATUSES, mockProposal as IProposal)).toEqual(
                expectedPercentages
            )
        })

        it('should return empty object from invalid arguments', () => {
            expect(getPercentagesFromAnswerStatuses([{} as AnswerStatus], mockProposal as IProposal)).toEqual({})
        })

        it('should return empty object from empty arguments', () => {
            expect(getPercentagesFromAnswerStatuses([], mockProposal as IProposal)).toEqual({})
        })
    })
})
