$.ajaxPrefilter(function (config) { 
     // 将key =value 形式的数据，转成json格式的字符串
     const format2Json = (source) => {
        let target = {}
        source.split('&').forEach((el) => {
            let kv = el.split('=')
            // 浏览器会自动编码所以需要对value进行解码操作
            // encodeURIComponent编码
            target[kv[0]] = decodeURIComponent(kv[1])
        })
        return JSON.stringify(target)
    }

    // 在此将基准地址拼接一下
    config.url = 'http://big-event-vue-api-t.itheima.net' + config.url

    // 统一设置请求头content-type值
    // if()
    config.contentType = 'application/json;charset=utf-8'

    // 统一设置请求的参数-post 请求
    config.data = config.data && format2Json(config.data)

    // 此为 config 没有 headers ，添加一个 headers 并且只有 abc的属性
    // config.headers = {
    //     'abc' : 'abc'
    // }
    // 此为为 config 本身就有的 headers 添加一个abc属性
    // config[headers] ='abc'

    // 统一设置请求头(有条件的田间)
    // 请求路径中有 /my 字符串的需要添加
    // indexOf startsWith endsWith includes
    if(config.url.includes('/my')) {
        // 调试，headers属性是自定义的属性 需要进行添加
        config.headers = {
            Authorization : localStorage.getItem('big_news_token') || ''
        }
    }
    

    // 统一添加错误 （即没有获取到用户信息）回调
    config.error = function (err) {  
        if(
            err.responseJSON?.code === 1 && err.responseJSON?.message === '身份认证失败！'
             
        ){
            // 1、token 要移除
            localStorage.removeItem('big_news_token')
            // 2、页面要跳转到登录页
            location.href = '/code-01/login.html'
        }
    }
    
})