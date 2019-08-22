//Logger needs to be setup first before http client can be imported
import './setup-logger'
import './setup-time-measurer'

import { BrowserHttpClient, setGlobalHttpClient } from '../network/browser-http-client'


setGlobalHttpClient(BrowserHttpClient)