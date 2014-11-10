/**
* "query" JavaScript CSS Selector Engine
* Copyright (c) 2012 tanwei
* Version: 1.0
* Download: http://tanwei-cc.github.com/query/
* Blog: http://www.cnblogs.com/weishao/
* Date:2012/10/14
*/
(function (win) {
    var doc = win.document, isDOMQuery = doc.querySelectorAll,
    id_expr = /^([\w-]+)?#([\w-]+)/,
    class_expr = /^([\w-]+)?\.([\w-]+)/,
    attr_expr = /^([\w-]+)?\[([\w]+)([|*~\$!]*)(?:=(?:['"]?)(\w+)(?:['"]?))?\]/,
    gt_expr = /^([\w-#.]+)(?:[ ]*)(\>)(?:[ ]*)([\w#.-]+)/; //Greater than

    var query = function (selector, context) {
        context = context || doc;

        var res = [];
        if (isDOMQuery)
            res = context.querySelectorAll(selector);
        else {
            //var splits = selector.split(',');
            _each(selector.split(','), function (s) {
                res = res.concat(_filters(s, context));
            });
        }
        var l = res && res.length;
        return (l && l == 1) ? res[0] : _unique(res);
    };

    function _filters(selector, context) {
        var res = [], splits = selector.match(gt_expr);
        if (splits)
            return _childFilters(splits, context);

        splits = selector.split(/[ ]+/);
        var ps = _find(splits[0], context);
        if (!splits[1]) return ps;

        _each(ps, function (el) {
            res = res.concat(_find(splits[1], el));
        });
        return res;
    };

    function _childFilters(splits, context) {
        var res = [];
        _each(_find(splits[1]), function (parent) {
            _each(parent.childNodes, function (child) {
                if (child.nodeType == 1 &&
                     (child.tagName == splits[3].toUpperCase() ||
                        "#" + child.id == splits[3] ||
                        _hasString(child.className, splits[3].replace('.', ''))))
                    res.push(child);
            });
        });
        return res;
    };

    function _find(selector, context) {
        var res = [], className = selector.match(class_expr),  //Use most times
            id = !className && selector.match(id_expr),
            attr = !id && selector.match(attr_expr);

        if (id) {
            var el = _getById(id[2], id[1]);
            if (el) res.push(el);
        }
        else if (className) res = _getByClass(className[2], context, className[1]);
        else if (attr) res = _getByAttr(attr[2], attr[4], context, attr[1], attr[3]);
        else res = _getByTagName(selector, context);

        return _toArrary(res);
    };

    function _toArrary(obj) {
        var res = [];
        try {
            return Array.prototype.slice.call(obj);
        } catch (e) {
            _each(obj, function (el) {
                res.push(el);
            });
        }
        return res;
    };

    function _unique(arr) {
        var res = [], uid = +new Date;
        _each(arr, function (el) {
            if (!el[uid]) {
                res.push(el);
                el[uid] = 1;
            }
        });

        _each(res, function (el) {
            el.removeAttribute(uid);
        });

        return res;
    };

    function _each(obj, fn) {
        if (obj)
            for (var i = 0, l = obj.length; i < l; i++)
                fn(obj[i], i);
    };

    function _hasString(strs, str) {
        return RegExp("\\b" + str + "\\b").test(strs);
        //return RegExp('(\\s|^)'+str+'(\\s|$)').test(strs)
    };

    function _addMethods(target, source) {
        for (var key in source)
            target[key] = source[key];
        return target;
    };

    function _get(id) {
        if (typeof id == "string")
            return doc.getElementById(id);
        return id || doc;
    };

    function _getById(id, tag) {
        var el = _get(id);
        if (tag && el && el.tagName != tag.toUpperCase())
            return null;
        return el;
    };

    //querySelectorAll donot support '|$!'
    function _getByAttr(name, val, parent, tag, sign) {
        if (name == 'class') name = 'className';
        var res = [], vl = val ? val.length : 0, vi = !val ? -1 : (!sign ? 0 : ' |*~$!'.indexOf(sign));
        _each(_getByTagName(tag, parent), function (el) {
            var v = el[name] || el.getAttribute(name);
            if (el.nodeType == 1 && v) {
                var exprs = [true, v == val, v.substr(0, vl) == val, v.indexOf(val) > -1, _hasString(v, val), v.substr(v.length - vl) == val, v != val];
                if (exprs[vi + 1])
                    res.push(el);
            }
        });
        return res;
    };

    function _getByName(name) {
        return doc.getElementsByName(name);
    };

    function _getByTagName(tag, parent) {
        tag = tag || "*";
        return _get(parent).getElementsByTagName(tag);
    };

    function _getByClass(className, parent, tag) {
        //if (doc.getElementsByClassName)
        //  return _get(parent).getElementsByClassName(className);        
        if (isDOMQuery)
            return _get(parent).querySelectorAll((tag || "") + "." + className);
        return _getByAttr("class", className, parent, tag, '~');
    };

    _addMethods(query, {
        extend: function (source) { _addMethods(query, source); },
        getById: _getById,
        getByAttr: _getByAttr,
        getByName: _getByName,
        getByTagName: _getByTagName,
        getByClass: _getByClass
        //        ,hasClass: function (elem, className) {
        //            return _hasString(elem.className, className);
        //        }
    });

    win.query = query;
})(window);