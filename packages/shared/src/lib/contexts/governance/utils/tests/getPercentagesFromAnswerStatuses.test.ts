import '@mocks/i18n.mock'
import type { AnswerStatus } from '@iota/sdk/out/types'
import { getPercentagesFromAnswerStatuses } from '../getPercentagesFromAnswerStatuses'
import type { IProposal } from '../../interfaces'
import { writable } from 'svelte/store'

jest.mock('../../../../core/network/stores/networks.store.ts', () => ({
    getStardustNetwork: jest.fn(() => {
        return { currentMilestone: writable(-1) }
    }),
}))

describe('File: getPercentagesFromAnswerStatuses.ts', () => {
    describe('Function: getPercentagesFromAnswerStatuses', () => {
        const mockProposal = {
            milestones: { ended: 100 },
        }

        it('should return percentages with same projected votes as total votes from valid arguments and proposal', () => {
            const answerStatuses: AnswerStatus[] = [
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

            const expectedPercentages = {
                0: { accumulated: '16.7%', projected: '16.7%' },
                1: { accumulated: '33.3%', projected: '33.3%' },
                2: { accumulated: '50%', projected: '50%' },
            }
            expect(getPercentagesFromAnswerStatuses(answerStatuses, mockProposal as IProposal)).toEqual(
                expectedPercentages
            )
        })

        it('should return percentages with different projected votes as total votes from valid arguments and proposal', () => {
            const answerStatuses: AnswerStatus[] = [
                {
                    value: 0,
                    current: 400,
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

            const expectedPercentages = {
                0: { accumulated: '16.7%', projected: '80.5%' },
                1: { accumulated: '33.3%', projected: '7.8%' },
                2: { accumulated: '50%', projected: '11.7%' },
            }
            expect(getPercentagesFromAnswerStatuses(answerStatuses, mockProposal as IProposal)).toEqual(
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
