import { Application } from 'express'

import { ServerConfigModel } from '../server/models'

export const v1Url = (path: string) => `/api/v1/${path}`

export class Routes {
    static api(app: Application, config: ServerConfigModel) { }
}