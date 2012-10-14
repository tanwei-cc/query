即将推出，尽请期待...
===================================

query Javascript CSS Selector engine
====================================

    query是一个javascript css selector engine，小巧而功能强大，压缩后2k左右，可以很轻松的集成到代码当中。

<h2>支持浏览器</h2>
    IE6+、Firefox、Chrome、Safari、Opera

<h2>联系作者</h2>
    欢迎大家使用，并提出问题或改进，相信有你们的参与将使query越来越完美，谢谢。   
    email:tabwei_yx@126.com
    blog:http://home.cnblogs.com/weishao/

<h2>选择器</h2>
<pre>
query(selector[,context])
    div
    #intro
    div#intro                    
    .red                
    span.red
    [name] 
    [name=keywords]          
    input[name]                
    input[name=keywords]
    input[name='keywords']
    input[name="keywords"]                
    input[name*=key]
    label[class~=red]
    #nav>li
    #nav> li
    #nav >li
    #nav > li
    #nav li
    #intro,.red,div
    input[name],#nav>li    
</pre>

<h2>原生方法</h2>   
<pre>
query.getById(id)
query.getByName(name)
query.getByTagName(tagName[, parent])
query.getByClass(className[, parent][, tagName])
    Example:
        query.getByClass("red");
query.getByAttr(name, val[, parent][, tagName])
    Example:
        query.getByAttr("name","keywords",parent,"input");                                    
query.extend
    Example:
        query.extend({                       
            getByCity:function(){...}
        });
        var city=query.getByCity();
</pre>