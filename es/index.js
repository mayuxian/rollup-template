const INVOKETYPE = 'BridgeProxy';
const INVOKECBTYPE = 'BridgeProxyCallback';

class ParentInvoker {
  listen (iframeId) {
    const postChildData = (data) => {
      data.type = INVOKECBTYPE;
      let ele = document.getElementById(iframeId);
      if (ele.src) {
        console.log('父页面执行完api,向子页面回调数据', data);
        ele.contentWindow.postMessage(data, ele.src);
      } else {
        throw new Error()
      }
    }
    const listenChildPost = (data) => {
      console.log('父页面接收到子页面请求:', data);
      let cbArgNums = data.callbackArgNums;
      let cbProxy = [];
      if (cbArgNums) {
        for (let i = 0; i < cbArgNums.length; i++) {
          let num = cbArgNums[i];
          let cbArgsParams = [];
          for (let j = 0; j < num; j++) {
            cbArgsParams.push('cb' + j);
          }
          cbProxy.push(function (...cbArgsParams) {
            let cbIndex = i;
            let listenId = data.id;
            let listenPage = data.sourcePage;
            //向子页面post 父页面调用api返回的参数
            postChildData({
              id: listenId,
              sourcePage: listenPage,
              cbIndex: cbIndex,
              cbArgsData: cbArgsParams
            })
          })
        }
      }
      //若调用AHAPP等相关api,采用此种方式
      //示例:
      // AHAPP.invokeNative('nativepage', {
      //     url: url, //打开页面的scheme
      //     success: function (result) {
      //         resolve(result)
      //     },
      //     fail: function (error) {
      //         reject(error)
      //     }
      // });

      //子页面返回的数据是:
      //    let invokerParams={
      //     type:'BridgeApi',
      //     bridgeKey: 'AHAPP',
      //     api: 'invokeNative',
      //     params: ['nativepage],
      //     //回调参数数组
      //     callbackArgNums:[
      //         1, //表示第一个回调函数中的参数个数,即上面实例AHAPP接口的success回调函数
      //         1, //表示第二个回调函数的参数个数,即上面实例AHAPP接口的fail回调函数
      //     ],
      //     };
      //    let bridge = window[invokerParams.bridgeKey];
      //    if (bridge) {
      //         bridge[invokerParams.api](...data.params,...cbProxy);
      //    }
    };
    window.addEventListener('message', msg => {
      const data = msg.data;
      if (data && data.type === INVOKETYPE) {
        listenChildPost(msg.data);
      }
    });
  }
}

class ChildInvoker {

}

export default {
  ParentInvoker,
  ChildInvoker,
};