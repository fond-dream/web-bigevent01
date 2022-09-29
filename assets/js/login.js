$(function () {  
    // 点击去注册
    $('#go2Reg').on('click', function() {
        $('.login-wrap').hide()
        $('.reg-wrap').show()
    })
    $('#go2Login').on('click', function() {
        $('.login-wrap').show()
        $('.reg-wrap').hide()
    })

    // 需要从 layui对象身上取到 form
    const form = layui.form
    const layer = layui.layer 
    form.verify({
        // 自定义规则
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ] ,
        repwd: function(value) {
            // 拿到密码框和再次确认密码作比较
            // 属性选择器：$('[name=xxx]').val()
            if($('#passWord').val() !== value) {
                return console.log('两次密码不一致，请重新输入')
            }
        }

    })

   
    // 给注册表单添加提交事件（会刷新浏览器）
    $('#formReg').on('submit',function (e) { 
        // alert('111')
        // 阻止默认提交动作 
        e.preventDefault()
        // 发起请求 ajax
        // 1、修改 Content-Type 
        // 2、需要将参数转换成JSON
        $.ajax({
            method:'POST',
            url:'/api/reg',
            // contentType:'application/json',
            // data:JSON.stringify({
            //     username:$('#formReg [name=username]').val(),
            //     password:$('#formReg [name=password]').val(),
            //     repassword:$('#formReg [name=repassword]').val(),
            // }),
            data:$(this).serialize(),
            success(res) {
                if(res.code !== 0 ) return layer.msg(res.message)

                layer.msg('注册成功')
                // 模拟点击事件
                // click方法
                $('#go2Login').click()
                // trigger方法
                // $('#go2Login').trigger('click')              
            }
        })

    })
   
    // 登录formLogin
    $('#formLogin').on('submit', function (e) { 
        // 阻止默认提交动作 
        // alert('11')
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/api/login',
            data:$(this).serialize(),
            success(res) {
                if(res.code !== 0 ) return layer.msg(res.message)
                // 要转到主页
                // token 意思是令牌的意思（下一次去请求有权限的接口的时候“带着”）
                localStorage.setItem('big_news_token', res.token)
                // 固定的写法： Bearer token 字符串、Bearer 译为持票人拿着token去请求。
                console.log('成功')
                // location.href = '/code-01/index.html'
            }
        })
    })
})