$(function () {  
    const layer = layui.layer
    const form = layui.form

    // 定义加载文章分类的方法
    initCate()
    initEditor()

    // 加载文章分类的函数
    function initCate() {  
        $.ajax({
            method:'GET',
            url:'http://big-event-vue-api-t.itheima.net/my/cate/list',
            headers: {
                Authorization:localStorage.getItem('big_news_token')
            },
            success(res) {
                if(res.code !== 0) return layer.msg('获取文章分类失败')
                
                // 模板引擎渲染分类的可选项
                const html = template('tpl-cate',res)
                // 填充到html
                $('[name=cate_id]').html(html)
                form.render()
            }
        })
    }

    // 图片裁剪
     // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 点击事件-选择封面的按钮
    $('#btnChooseImg').on('click', function() {
        // $('#coverFile').click()
        coverFile.click()
    })

    // 监听 封面提交 coverFile 的change 事件 获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {  
        let files = e.target.files
        if(files.length === 0) return

        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
    })


    
    // 设置默认发布状态
    let state = '已发布'

    // 为存为草稿按钮绑定点击事件处理函数
    $('#btnSave2').on('click', function () {  
        state = '草稿'
    })

    // // 发布
    // $('#btnSave1').on('click', function () {  

    // })
    // 点击发布 表单绑定submit事件
    $('#form-pub').on('submit', function(e) {
        // 1 阻止默认
        e.preventDefault()
        // 2 快速创建formData对象
       let fd = new FormData($(this)[0])
        // 新增一个状态
       fd.append('state',state)
        // 4 获取封面裁剪过后的图片 输出为一个文件对象
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5 将对象存到fd
            fd.append('cover_img',blob)
            // 6发起ajax请求
            publishArticle(fd)
        })
       
    })

    function publishArticle(fd) {  
        $.ajax({
            method:'POST',
            url:'http://big-event-vue-api-t.itheima.net/my/article/add',
            data:fd,
            headers: {
                Authorization:localStorage.getItem('big_news_token')
            },
            contentType:false,
            processData:false,
            success:function (res) {  
                if(res.code !== 0) return layer.msg('发布文章失败！')
                layer.msg('发布文章成功')
                location.href = '/code-01/article/article_list.html'
            }
            
        })
    }

        
    
})