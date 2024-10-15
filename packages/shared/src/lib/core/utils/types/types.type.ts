export type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type AtLeastOne<T, Keys extends keyof T = keyof T> = Keys extends keyof T
    ? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>>
    : never
