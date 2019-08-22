import { NextFunction, Request, Response, Router } from 'express'

const isHtmlRequest = (req: Request): boolean => {
    let accept = req.header("accept")
    return !!accept && accept.includes("text/html")
}

const spaRoute = (appPath: string) => {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!isHtmlRequest(req)) {            
            return next()
        }
        let accept = req.header("accept")
        if (accept && accept.includes("text/html")) {
            res.sendFile("index.html", { root: appPath })
        } else {
            next()
        }
    }
}

export function staticFileRoutes(staticPath: string): Router {
    const router = Router()
    router.get('/*', spaRoute(staticPath + "/"))
    return router
}