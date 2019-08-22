import 'whatwg-fetch'


export async function BrowserHttpClient<T>(req: GeniusRequest): Promise<RespStatusBody<T>> {
    validateGeniusRequest(req)
    const { host, urlPath, method, body, headers } = req
    const url = host ? (host + urlPath) : urlPath
    const bodySer = (body && typeof body != 'string') ? JSON.stringify(body) : (body || "")
    const errStr = () => `${url} ${body ? ("with body " + JSON.stringify(body)) : ""}`
    const reqOptions: RequestInit = { method, headers: headers as any, body: bodySer }
    let response: Response
    try {
        response = await fetch(url, reqOptions)
    } catch (err) {
        throw new Error(`Network error in fetching ${errStr()}`)
    }

    let respStr: string
    try {
        respStr = await response.text()
    } catch (e) {
        //TODO
        const error = new Error(`Unable to get response as text ${errStr()} status ${response.status}`)
        throw error
    }
    return processResponseBodyStr<T>(respStr, response.status, headers.Accept)
}

const URL = require('url-parse')

export class GeniusUrl {
    static v1(...urlParts: string[]) {
        return GeniusUrl._url(urlParts.join("/"), 1)
    }

    static v2(...urlParts: string[]) {
        return GeniusUrl._url(urlParts.join("/"), 2)
    }

    static v3(...urlParts: string[]) {
        return GeniusUrl._url(urlParts.join("/"), 3)
    }

    //Don't use unless needed. Use the earlier version
    static _url(url: string, version: number) {
        if (url.startsWith("/")) url = url.slice(1)
        return `/api/${version}/${url}`
    }
}

export const jsonContentType = "application/json"
export const csvContentType = "text/csv"
export type HttpContentType = typeof jsonContentType | typeof csvContentType

export interface GeniusHeaders {
    "Content-Type"?: HttpContentType
    Accept?: HttpContentType
    Authorization?: string
    host?: string
    //AWS headers
    //Taken from http://docs.aws.amazon.com/elasticloadbalancing/latest/classic/x-forwarded-headers.html
    'x-forwarded-proto'?: string
    'x-forwarded-for'?: string
    'x-forwarded-port'?: string
    'x-genius-app'?: string
}

export interface GeniusRequest {
    host?: string
    urlPath: string
    method: "POST" | "GET"
    body?: object
    headers: GeniusHeaders
}

const commonDefaultHeaders: GeniusHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const defaultHeaders = (token?: string): GeniusHeaders => {
    const reqToken = token || _authToken
    return reqToken ? { ...commonDefaultHeaders, ...getAuthorizationHeader(reqToken) } : commonDefaultHeaders
}

export const getAuthorizationHeader = (token: string) => ({ Authorization: "Bearer " + token })

//Helpful for determining the origin app of the request. 
//Helps in debugging on the server through server logs
export const setReqHeaderXGeniusApp = (appName: string) => {
    commonDefaultHeaders["x-genius-app"] = appName
}

/**
 * Used to create GeniusRequest 
 * @param urlPath follows the convention of window.localtion.apt
 * @param body 
 */
export const makeRequestObj = (urlPath: string, body: object, headers: GeniusHeaders | undefined = undefined, host: string | undefined = getGlobalApiHost(), authToken?: string): GeniusRequest => {
    const reqHeaders = headers || defaultHeaders(authToken)
    const obj: GeniusRequest = { urlPath, method: 'POST', body, headers: reqHeaders }
    return host ? { ...obj, host } : obj
}

export const validateGeniusRequest = (reqObj: GeniusRequest) => {
    const { host, urlPath, method, headers, body } = reqObj
    let errMsg: string[] = []
    if (method == "GET" && body) errMsg.push("Body should not be specified with method GET")
    if (method != "POST" && method != "GET") errMsg.push(`Invalid req obj method ${method}`)
    if (errMsg.length > 0) {
        throw new Error(errMsg.join("\n"))
    }
}

export const apiRequest = async <Response>(url: string, body: object, host: string | undefined = getGlobalApiHost(), token: string | undefined = undefined): Promise<Response> => {
    const reqObj = makeRequestObj(url, body, undefined, host, token)
    const httpClient = getGlobalHttpClient()
    return (await httpClient<Response>(reqObj)).body
}

export interface RespStatusBody<T> {
    status: number,
    body: T
}

export const processResponseBodyStr = <T>(responseStr: string | undefined, status: number, contentType: HttpContentType = jsonContentType): RespStatusBody<T> => {
    if (contentType != jsonContentType) {
        throw new Error("Http Client cannot process content type " + contentType)
    }
    let resp: T | string | undefined = responseStr
    if (typeof responseStr == 'string') {
        //Make it empty obj if nothing is present
        responseStr = responseStr || "{}"
        try {
            resp = JSON.parse(responseStr)
        } catch (e) {
            //TODO
            throw new Error("Unable to parse response json")
            // .setHttpStatus(status)
        }
    }

    if (!is2xx(status)) {
        throw new Error(JSON.stringify(resp))
        // throw GeniusError.fromObj(resp as string | undefined | GeniusErrorSerModel).setHttpStatus(status)
    }

    return { status: status, body: resp as T }
}

/**
 * It should reject on all non 200 HTTP status
 */
export type HttpClientType = <T>(reqObj: GeniusRequest) => Promise<RespStatusBody<T>>

let _host: string | undefined
let _httpClient: HttpClientType | undefined
let _authToken: string | undefined

//At the start of your application, set these
//TODO fix it
export const setGlobalHttpClient = (httpClient: HttpClientType) => { _httpClient = httpClient }
export const getGlobalHttpClient = (): HttpClientType => {
    if (!_httpClient) {
        throw new Error(`Default HttpClient not set`)
    }
    return _httpClient
}

export const setGlobalAuthToken = (token: string | undefined = undefined) => {
    _authToken = token ? token : undefined
}
export const getGlobalAuthToken = (): string | undefined => _authToken

export const setGlobalApiHost = (host: string | undefined = undefined, isDomain: boolean = true) => { _host = host }
export const getGlobalApiHost = (): string => {
    if (!_host) {
        throw new Error("No api host found")
    }
    return _host
}

export const is2xx = (httpStatusCode: number) => httpStatusCode.toString()[0] === '2'
export const is4xx = (httpStatusCode: number) => httpStatusCode.toString()[0] === '4'
export const is5xx = (httpStatusCode: number) => httpStatusCode.toString()[0] === '5'