const INVOKETYPE = 'BridgeProxy'
const INVOKECBTYPE = 'BridgeProxyCallback'
//目前只是Invoker的js库
//如果想做跨域信息交互,则包含Commander,Invoker,Communication等模块交互
//这个时候模块就属于Observer和Publisher
export class ParentInvoker {
    listen(iframe) {
        console.log('parent listen start')
        const postChildData = function (data) {
            if (!iframe) return
            data.type = INVOKECBTYPE
            const ele = iframe.nodeType === 1 || iframe instanceof HTMLElement ? iframe : document.getElementById(iframe)
            if (ele.src) {
                console.log('父页面执行完api,向子页面回调数据', data)
                ele.contentWindow.postMessage(data, ele.src)
            } else {
                throw new Error(`获取iframe元素src为null`)
            }
        }
        const listenChildPost = function (data) {
            console.log('父页面接收到子页面请求:', data)
            const { id, sourcePage, objectKey, api, method, params, callbacks } = data
            const invokeApi = window[objectKey] && window[objectKey][api]
            if (invokeApi) {
                if (callbacks) {
                    const cbObj = Object.create(null)
                    callbacks.forEach(key => {
                        cbObj[key] = function (...cbArgs) {
                            console.log('回调参数', cbArgs)
                            let cbKey = key
                            let listenId = id
                            let listenPage = sourcePage
                            //向子页面post 父页面调用api返回的参数
                            postChildData({
                                id: listenId,
                                sourcePage: listenPage,
                                cbKey: cbKey,
                                cbArgsData: cbArgs
                            })
                        }
                    })
                    Object.assign(params, cbObj)
                }
                invokeApi(method, params)
            }

        }
        window.addEventListener('message', msg => {
            if (msg.data && msg.data.type === INVOKETYPE) {
                listenChildPost(msg.data)
            }
        })
    }
}
// window.parentInvokerInstance = new ParentInvoker()

export class ChildInvoker {
    constructor() {
        this.postCallback = new Map()
    }
    listen() {
        console.log('child listen start')
        window.addEventListener('message', msg => {
            const cbData = msg.data
            if (cbData && cbData.type === INVOKECBTYPE) {
                console.log('子页面接收到父页面执行完API的回调数据')
                console.log(msg.data)
                const postCb = this.postCallback.get(cbData.id)
                if (postCb) {
                    console.log('执行方法:', postCb)
                    postCb[cbData.cbKey](...cbData.cbArgsData)
                    this.postCallback.delete(cbData.id)
                }
            }
        })
    }
    post(cmdOptions, cbObjArgs) {
        // const { id, sourcePage, objectKey, api, method, params, callbacks } = cmdOptions
        cmdOptions.type = INVOKETYPE
        cmdOptions.id = cmdOptions.id || Math.floor((Math.random() * 1000) + 1)
        cmdOptions.callbacks = cmdOptions.callbacks || ['success', 'fail']
        cmdOptions.api = cmdOptions.api || 'invokeNative'
        cmdOptions.params = cmdOptions.params || {}

        const parenthref = window.parent !== window ? document.referrer : window.parent.location.href
        if (parenthref) {
            console.log('子页面向父页面发送命令配置:', cmdOptions)
            console.log('子页面向父页面发送参数:', cbObjArgs)
            this.postCallback.set(cmdOptions.id, cbObjArgs)
            window.parent.postMessage(cmdOptions, parenthref)
        }
    }
}
// window.childInvokerInstance = new ChildInvoker()
const parentInvoker = new ParentInvoker()
const childInvoker = new ChildInvoker()
export {
    parentInvoker,
    childInvoker
}
