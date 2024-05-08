export interface ParsedDID {
    did: string
    didUrl: string
    method: string
    id: string
    path?: string
    fragment?: string
    query?: string
    params?: Params
}


export interface Params {
    [index: string]: string
}