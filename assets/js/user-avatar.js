$(function () {  
    const layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 1.4 上传文件的按钮
    $('#btnChoose').on('click', function () {  
        // 虚拟点击
        // 方法一
        // $('#file').click()
        // 方法二
        $('#file').trigger('click')
    })

    // 如何知道用户选择了图片 文件选择框的 change事件
    $('#file').on('change', function (e) {  
        // console.log(e)
        // 获取用户选择的文件
        const fileList = e.target.files     //伪数组
        if(fileList.length === 0) return layer.msg('请选择照片！')
        // 需要转成 blob 格式的图片对象 原生写法 文件对象转成路径
        const blobUrl = URL.createObjectURL(fileList[0])

        // 图片更换
        $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', blobUrl) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
    })

    // 确定按钮点击事件 头像替换
    $('#btnUpload').on('click', function (e) {  
        // 1 要拿到用户裁剪后的头像
        var dataURL = $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')
        // console.log(dataURL)

        // 2 调用接口 把头像上传到服务器
        $.ajax({
            method:'PATCH',
            url:'/my/update/avatar',
            data:{
                avatar:dataURL
            },
            success(res) {
                if(res.code !== 0) return layer.msg('更换头像失败！')
                layer.msg('更换头像成功！')
                console.log(res)
                window.parent.getUserInfo()
            }
        })
    })
})