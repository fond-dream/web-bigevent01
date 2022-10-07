$(function () { 
    // 随机数字封装函数
    // const randomNum = () => {
    //     Math.random()
    //     let rgb = ''
    // } 
    // $('.text-avatar').css()
    
    // 定义类
    let layer = layui.layer
    getUserInfo()

    // 入口函数
})

// var a =100
// var const 区别？
// 由 var 声明或者 function 关键字声明的变量会默认存在 window 全局变量上 但是let/ const 不会
// 口诀：禁止使用var

// 获取基本信息
function getUserInfo () {
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('big_news_token') || ''
        // },
        success(res) {
        if(res.code !== 0) return layer.msg("res.message")
        renderAvatar(res)
        },
        
    })
}

// 头像渲染
function renderAvatar (res) {
    
    if(res.data.user_pic) {
        $('.text-avatar').hide()
        $('.layui-nav-img').attr('src', res.data.user_pic)
        $('.layui-nav-img').show()
    }else {
        $('.layui-nav-img').hide()
        // 显示文字头像，去除username属性的第一个字母
        // 取nicakname 和 username
        const name = res.data.nickname || res.data.username
        const char = name[0].toUpperCase()
        $('.text-avatar').html(char).show()
    }
    $('.text').html('欢迎&nbsp;&nbsp;'+res.data.username)
}

// 退出操作
// 1 方式一
// $('#btnLogoout').on('click', function () {  
//     const result = confirm('您确认要退出吗？')
//     if(result) {
//         // 1、token 要移除
//         localStorage.removeItem('big_news_token')
//         // 2、页面要跳转到登录页
//         location.href = '/code-01/login.html'

//     }
// })
// 2 方式二
    $('#btnLogoout').on('click', function () {
        layer.confirm('您确认要退出吗?', {icon: 3, title:'提示'}, function(index){
            // 1、token 要移除
            localStorage.removeItem('big_news_token')
            // 2、页面要跳转到登录页
            location.href = '/code-01/login.html'
            // 3、close固定写法，关闭弹窗
            layer.close(index);
        })
    })
