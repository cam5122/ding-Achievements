import {
    getOs
} from './index'

var buryData = {
    appVersion: '1.0.0',
    city: '',
    corpId: '',
    eventId: '',
    ip: '',
    operateSystem: '',
    operateVersion: navigator.appVersion,
    province: '',
    questUrl: '',
    userId: '',
    suiteId: '',
    cookie: '',
    userName: '',
    corpName: '',
    appName: '智能绩效'
}

let os = getOs()
switch (os) {
case 'Windows':
    buryData.operateSystem = 100
    break
case 'Mac':
    buryData.operateSystem = 101
    break
case 'Linux':
    buryData.operateSystem = 102
    break
case 'iOS':
    buryData.operateSystem = 201
    break
case 'Android':
    buryData.operateSystem = 202
    break
default:
    buryData.operateSystem = 100
}

export default {
    buryData
}
