$(function () {  
    const layer = layui.layer
    const form = layui.form

    function loadCateList() {  
        $.ajax({
            method:'GET',
            url:'/my/cate/list',
            success(res) {
                if(res.code !== 0) return layer.msg(res.message)
                // 模板引擎
                const html = template('tpl-cate',res)
                $('tbody').empty().append(html)
            }
        })
    }
    loadCateList()

    // 点击发表事件
    let index = null
    $('#btnAdd').on('click', function() {
        index = layer.open({
            type:1,
            title: '添加分类名称',
            area:['500px', '260px'],
            content: $('#addDialog').html()
          });   
    })

    // 默认状态开关
    let isEdit = false  //判断走修改还是添加分类的状态

    // 代理方式为添加分类绑定submit事假
    $('body').on('submit', '#addForm', function (e) {  
        e.preventDefault()

        if(isEdit) {
            // 修改
            $.ajax({
                method:'PUT',
                url:'/my/cate/info',
                // data:$(this).serialize(),
                data:form.val('addFormFilter'),
                success(res) {
                    if(res.code !== 0) return layer.msg('修改失败！')
                    
                    layer.msg('修改成功！')
                    loadCateList()  
                }
            })
            
        }else {
            // 添加
            $.ajax({
                method:'POST',
                url:'/my/cate/add',
                // data:$(this).serialize(),
                data:form.val('addFormFilter'),
                success(res) {
                    if(res.code !== 0) return layer.msg('添加分类失败！')
                    
                    layer.msg('新增分类成功！')
                    loadCateList()
                }
            })
        }
        // 状态再改为默认值
        isEdit = false
        // 1 关闭弹框
        layer.close(index)
        

    })

    // 通过代理给 编辑 按钮添加点击事件
    $('tbody').on('click', '.btnEdit', function () {  
        // 是true点提交的时候走修改
        isEdit = true
        // console.log($(this).attr('data-id'))
        index = layer.open({
        type:1,
        title: '修改分类名称',
        area:['500px', '260px'],
        content: $('#addDialog').html()
      });   

    // 回显信息     
      $.ajax({
        method:'GET',
        url:'/my/cate/info?id=' + $(this).attr('data-id'),
        // data: {
        //     id: 
        // },
        success(res) {
            if(res.code !== 0 ) return layer.msg('获取分类详情失败')
            form.val('addFormFilter', res.data)
            
        }
      })
    })
    
    // 代理删除
    $('tbody').on('click', '.btnDel', function () {  
        const result = confirm('您确定要删除该分类吗？')
        const id = $(this).attr('data-id') 
        $.ajax({
            method:'DELETE',
            url:`/my/cate/del?id=${id}`,
            success(res) {
                if(res.code !== 0) layer.msg('删除分类失败')
                layer.msg('删除分类成功')
                // 重新加载
                loadCateList()
            }
        })
    })
    // 入口函数
})