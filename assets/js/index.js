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

// 获取基本信息
const getUserInfo = () => {
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
const renderAvatar = (res) => {
    if(res.user_pic) {
        $('.text-avatar').hide()
        $('.user-box img').css('src', res.user_pic)
    }else {
        $('.layui-nav-img').hide()
        // 显示文字头像，去除username属性的第一个字母
        // 取nicakname 和 username
        const name = res.data.nickname || res.data.username
        const char = name[0].toUpperCase()
        $('.text-avatar').html(char)
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
