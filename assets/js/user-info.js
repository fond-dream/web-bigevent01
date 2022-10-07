$(function () {  
    const form = layui.form
    const layer = layui.layer
    form.verify({
        nickname:function (value) {  
            if(value.length > 6){
                return '昵称不得超过6位数!'
              }
        }
    })

    // 获取用户信息
    const initInfo = () => {
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success(res) {
                if(res.code !== 0) return layer.msg('获取用户信息失败')
                console.log(res)
                form.val('userForm', res.data)
            }
        })
    }
    initInfo()

    // 重置表单的数据
    $('#btnReset').on('click',function (e) {  
        // 阻止默认的重置行为
        e.preventDefault()
        // 重新刷新用户信息
        initInfo()
        
    })

    // 监听表单提交事件
    $('.layui-form').submit(function (e) {  
        e.preventDefault()

        // 把表单数据打印出来
        // $(this).serialize()---> kry=value&ke=value
        // form.val('userForm')---> {key:value}
        // 空格---> %20 
        // @---> %40
        console.log(form.val('userForm'))
        $.ajax({
            method:'PUT',
            url:'/my/userinfo',
            // data:$(this).serialize(),
            data:form.val('userForm'),
            success(res) {
                if(res.code !== 0) return layer.msg('更新用户信息失败')
                window.parent.getUserInfo()
                layer.msg('更新用户信息成功')
            }
        })
    })
    // 入口函数
})