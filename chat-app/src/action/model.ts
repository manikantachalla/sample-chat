export interface BaseAction {
    type: string
}

export interface Action<Payload = object> extends BaseAction {
    payload?: Payload
    error?: boolean
}

export const makeAction = <T = object>(type: string, payload?: T): Action<T> => ({ type, payload })