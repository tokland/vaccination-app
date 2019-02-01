export interface D2 {
    Api: {
        getApi(): D2Api,
    }
}

export interface Params {
    paging?: boolean,
    filter?: string[],
    fields?: string[],
}

export interface D2Api {
    get(url: string, data: Params): {[key: string]: any};
}
