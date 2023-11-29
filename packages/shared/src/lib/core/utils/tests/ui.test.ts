import { debounce } from '../ui'

describe('File: ui.ts', () => {
    describe('Function: debounce', () => {
        jest.useFakeTimers()
        it('should call the callback function after 100ms', () => {
            const callback = jest.fn()
            const debounced = debounce(callback, 100)
            debounced()
            jest.advanceTimersByTime(100)
            expect(callback).toHaveBeenCalledTimes(1)
        })
        it('should call the callback function once if called multiple times within 100ms', () => {
            const callback = jest.fn()
            const debounced = debounce(callback, 100)
            debounced()
            debounced()
            debounced()
            jest.advanceTimersByTime(100)
            expect(callback).toHaveBeenCalledTimes(1)
        })
        it('should call the callback function twice if called multiple times with 100ms intervals between', () => {
            const callback = jest.fn()
            const debounced = debounce(callback, 100)
            debounced()
            debounced()
            debounced()
            jest.advanceTimersByTime(100)
            debounced()
            debounced()
            jest.advanceTimersByTime(100)
            expect(callback).toHaveBeenCalledTimes(2)
        })
    })
    describe('Function: clickOutside', () => {
        // it.todo('needs a UI testing library to test')
    })

    describe('Function: slidable', () => {
        // it.todo('needs a UI testing library to test')
    })
})
