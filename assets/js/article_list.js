$(function () {  
    const layer = layui.layer
    const form = layui.form
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.formatTime = function (date) {  
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = (dt.getMonth() + 1 + '').padStart(2,'0')
        let d = (dt.getDate() + '').padStart(2,'0')

        let hh = (dt.getHours() + '').padStart(2,'0')
        let mm = (dt.getMinutes() + '').padStart(2,'0')
        let ss = (dt.getSeconds() + '').padStart(2,'0')

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 需要将请求的参数提交到服务器
    let qs = {
        pagenum:1,   //当前页面值（表示当前是第几页）
        pagesize:3,     //当前每页显示多少条
        cate_id:'',     //当前选择的文章分类
        state:''        //当前文章所处的状态：可选值：已发布/草稿
    }

    // 加载分类下拉框
    loadCateList()

     // 动态获取文章分类
     function loadCateList() {  
        $.ajax({
            method:'GET',
            url:'/my/cate/list',
            success(res) {
                if(res.code !== 0) return layer.msg('获取文章分类失败')

                // 模板引擎渲染分类的可选项
                const html = template('tpl-cate',res)
                // 填充到html
                $('[name=cate_id]').html(html)
                // layui的特性 要重新再让layui渲染
                form.render()
            }
        })
    }


    // 加载文章列表
    loadArticleList()
    
    // 加载文章详情列表函数
    function loadArticleList() {  
        $.ajax({
            method:'GET',
            url:`/my/article/list?pagenum=${qs.pagenum}&pagesize=${qs.pagesize}&cate_id=${qs.cate_id}&state=${qs.state}`,
            data:qs,
            success(res) {
                if(res.code !== 0 ) return layer.msg('获取列表失败'+ res.message)

                // 使用模板引擎渲染文章列表
                const str = template('tpl-list',res)
                $('tbody').empty().append(str)

                // 调用渲染分页的函数
                renderPage(res.total)
            }   
        })
    }

   

    // 为筛选表单绑定submit 事件
    $('#choose-form').on('submit', function (e) {  
        e.preventDefault()
        // 获取表单中选中项的值 重新赋值
        qs.cate_id = $('[name=cate_id]').val()
        qs.state = $('[name=state]').val()
        // 不能用if判断 因为用if 为空的话就不能进行判断渲染了

        // 调用渲染列表
        loadArticleList()
    })


    // 渲染分页函数
    function renderPage(total) {
        laypage.render({
            elem:document.getElementById('pagerWrapper'),
            count: total,   //数据总数，从服务端得到
            limit:qs.pagesize,      //每页显示多少条
            curr:qs.pagenum,        //当前是第几页
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            // jump 回调 分页切换
            jump(obj,first) {  
                // 重新赋值当前第几页 和 每页显示多少条
                qs.pagenum = obj.curr
                qs.pagesize = obj.limit
                console.log(first)
                // 直接调用渲染文章列表函数 会死循环
                // 应该是用户主动切换页码的时候去加载列表
                // 第一次点击是true 之后再点击就是undefined
                // if(typeof first === 'undefined') {
                //     loadArticleList()

                // }
                if(!first) {
                    loadArticleList()
                }
            }
        })

    }


    // 代理点击事件 --删除
    $('tbody').on('click', '.btn-delete', function () {  
        const result = confirm('您确定要删除该文章吗？')

        // 获取当前页面删除按钮个数
        let len = $('.btn-delete').length
        if(result) {
            // prop attr 都是用来根据属性名称获取属性值的
            // prop:固有属性  attr:自定义属性
            const id = $(this).attr('data-id')
             $.ajax({
                method:'DELETE',
                url:`/my/article/info?id=${id}`,
                success(res) {
                    if(res.code !== 0) return layer.msg('删除文章失败')
                    layer.msg('删除文章成功')
                    // 判断 如果当前页面只有一个删除按钮 点击删除后一定这个页面就没有数据了
                    if(len === 1) {
                        // 如果当前是第一页就不要再减了 默认第一页就好
                        qs.pagenum = qs.pagenum === 1 ? 1 : qs.pagenum - 1
                    }
                    loadArticleList()

                }
            })
        }    
    })


    
})