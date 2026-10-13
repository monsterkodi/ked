var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isArr: function (o) {return Array.isArray(o)}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }}

var collect, del, find, get, regexp, set


regexp = function (s)
{
    s = String(s)
    s = s.replace(/([^.]+\|[^.]+)/g,'($1)')
    s = s.replace(/\./g,'\\.')
    s = s.replace(/\^/g,'\\^')
    s = s.replace(/\?/g,'[^.]')
    s = s.replace(/\*\*/g,'####')
    s = s.replace(/\*/g,'[^.]*')
    s = s.replace(/####/g,'.*')
    return new RegExp("^" + s + "$")
}

collect = function (object, filter, map, count = -1, keyPath = [], result = [])
{
    var i, k, v

    filter = (filter != null ? filter : function (p, k, v)
    {
        return true
    })
    map = (map != null ? map : function (p, v)
    {
        return [p,v]
    })
    switch (object.constructor.name)
    {
        case "Array":
            for (var _a_ = i = 0, _b_ = object.length; (_a_ <= _b_ ? i < object.length : i > object.length); (_a_ <= _b_ ? ++i : --i))
            {
                v = object[i]
                keyPath.push(i)
                if (filter(keyPath,i,v))
                {
                    result.push(map([].concat(keyPath),v))
                    if (count > 0 && result.length >= count)
                    {
                        return result
                    }
                }
                if (_k_.in((v != null ? v.constructor.name : undefined),["Array","Object"]))
                {
                    collect(v,filter,map,count,keyPath,result)
                }
                keyPath.pop()
            }
            break
        case "Object":
            for (k in object)
            {
                v = object[k]
                keyPath.push(k)
                if (filter(keyPath,k,v))
                {
                    result.push(map([].concat(keyPath),v))
                    if (count > 0 && result.length >= count)
                    {
                        return result
                    }
                }
                if (_k_.in((v != null ? v.constructor.name : undefined),["Array","Object"]))
                {
                    collect(v,filter,map,count,keyPath,result)
                }
                keyPath.pop()
            }
            break
    }

    return result
}

find = (function ()
{
    function find ()
    {}

    find["key"] = function (object, key)
    {
        var keyReg

        keyReg = this.reg(key)
        return this.traverse(object,(function (p, k, v)
        {
            return this.match(k,keyReg)
        }).bind(this))
    }

    find["path"] = function (object, path)
    {
        var pthReg

        pthReg = this.reg(path)
        return this.traverse(object,(function (p, k, v)
        {
            return this.matchPath(p,pthReg)
        }).bind(this))
    }

    find["value"] = function (object, val)
    {
        var valReg

        valReg = this.reg(val)
        return this.traverse(object,(function (p, k, v)
        {
            return this.match(v,valReg)
        }).bind(this))
    }

    find["keyValue"] = function (object, key, val)
    {
        var keyReg, valReg

        keyReg = this.reg(key)
        valReg = this.reg(val)
        return this.traverse(object,(function (p, k, v)
        {
            return this.match(k,keyReg) && this.match(v,valReg)
        }).bind(this))
    }

    find["pathValue"] = function (object, path, val)
    {
        var pthReg, valReg

        pthReg = this.reg(path)
        valReg = this.reg(val)
        return this.traverse(object,(function (p, k, v)
        {
            return this.matchPath(p,pthReg) && this.match(v,valReg)
        }).bind(this))
    }

    find["traverse"] = function (object, func)
    {
        return collect(object,func,function (p, v)
        {
            return p
        })
    }

    find["matchPath"] = function (a, r)
    {
        return this.match(a.join('.'),r)
    }

    find["match"] = function (a, r)
    {
        var _118_30_

        if (!(a instanceof Array))
        {
            return (String(a).match(r) != null ? String(a).match(r).length : undefined)
        }
        else
        {
            return false
        }
    }

    find["reg"] = function (s)
    {
        return regexp(s)
    }

    return find
})()


get = function (object, keypath, defaultValue)
{
    var kp

    if (!object)
    {
        return defaultValue
    }
    if (!(keypath != null ? keypath.length : undefined))
    {
        return defaultValue
    }
    if (typeof(keypath) === 'string')
    {
        keypath = keypath.split('.')
    }
    kp = [].concat(keypath)
    while (kp.length)
    {
        object = object[kp.shift()]
        if (!(object != null))
        {
            return defaultValue
        }
    }
    return object
}

set = function (object, keypath, value)
{
    var k, kp, o

    if (_k_.isStr(keypath))
    {
        keypath = keypath.split('.')
    }
    if (!(_k_.isArr(keypath)))
    {
        throw `invalid keypath: ${JSON.stringify(keypath)}`
    }
    kp = _k_.clone(keypath)
    o = object
    while (kp.length > 1)
    {
        k = kp.shift()
        if (!(o[k] != null))
        {
            if (!Number.isNaN(parseInt(k)))
            {
                o = o[k] = []
            }
            else
            {
                o = o[k] = {}
            }
        }
        else
        {
            o = o[k]
        }
    }
    if (kp.length === 1 && (o != null))
    {
        if (value === undefined)
        {
            delete o[kp[0]]
        }
        else
        {
            o[kp[0]] = value
            if (o[kp[0]] !== value)
            {
                throw `couldn't set value ${JSON.stringify(value)} for keypath ${keypath.join('.')} in ${JSON.stringify(object)}`
            }
        }
    }
    else
    {
        console.log('no keypath?',kp,keypath)
    }
    return object
}

del = function (object, keypath)
{
    var k, kp, o

    if (typeof(keypath) === 'string')
    {
        keypath = keypath.split('.')
    }
    if (!(keypath instanceof Array))
    {
        throw `invalid keypath: ${JSON.stringify(keypath)}`
    }
    kp = [].concat(keypath)
    o = object
    while (kp.length > 1)
    {
        k = kp.shift()
        o = o[k]
        if (!o)
        {
            break
        }
    }
    if (kp.length === 1 && (o != null))
    {
        if (o instanceof Array)
        {
            o.splice(parseInt(kp[0]))
        }
        else if (o instanceof Object)
        {
            delete o[kp[0]]
        }
    }
    return object
}
export default {
    find:find,
    get:get,
    set:set,
    del:del
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2RzLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9zZHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFRQTs7SUFDSSxJQUFJLE9BQU87SUFDWCxJQUFJLEVBQUUsUUFBUSxrQkFBbUI7SUFDakMsSUFBSSxFQUFFLFFBQVEsTUFBTztJQUNyQixJQUFJLEVBQUUsUUFBUSxNQUFPO0lBQ3JCLElBQUksRUFBRSxRQUFRLE1BQU87SUFDckIsSUFBSSxFQUFFLFFBQVEsUUFBUztJQUN2QixJQUFJLEVBQUUsUUFBUSxNQUFPO0lBQ3JCLElBQUksRUFBRSxRQUFRLFFBQVM7ZUFDbkIsT0FBTyxNQUFJLElBQUU7OztBQXVCckI7Ozs7SUFFSSxVQUFBLGlCQUFBOztlQUFxQjs7SUFDckIsT0FBQSxjQUFBOztnQkFBb0IsRUFBRTs7WUFFZixPQUFPLFlBQVk7O2FBRWpCOytCQUNTLFNBQUksT0FBTywwQkFBUCxPQUFPLGFBQVAsT0FBTzs7Z0JBQ2pCLElBQUksT0FBTztnQkFDWCxRQUFRLEtBQUs7b0JBQ1YsT0FBTyxRQUFTLEVBQUU7O29CQUNqQixPQUFPLEtBQUssT0FBTyxPQUFPLFNBQVU7d0JBQ25CLFFBQVEsS0FBTSxPQUFPLFVBQVU7OytCQUF6Qzs7OzRCQUNSLFlBQUEsRUFBRyxZQUFZLG1CQUFTLFFBQVM7O29CQUNoQyxRQUFRLEVBQUcsT0FBUSxJQUFLLE1BQU8sUUFBUzs7Z0JBQzVDLFFBQVE7OzthQUVYO3NCQUNVOztvQkFBQTtnQkFDUCxRQUFRLEtBQUs7b0JBQ1YsT0FBTyxRQUFTLEVBQUU7O29CQUNqQixPQUFPLEtBQUssT0FBTyxPQUFPLFNBQVU7d0JBQ25CLFFBQVEsS0FBTSxPQUFPLFVBQVU7OytCQUF6Qzs7OzRCQUNSLFlBQUEsRUFBRyxZQUFZLG1CQUFTLFFBQVM7O29CQUNoQyxRQUFRLEVBQUcsT0FBUSxJQUFLLE1BQU8sUUFBUzs7Z0JBQzVDLFFBQVE7Ozs7O1dBQ3BCOzs7Ozs7Ozs7Ozs7UUFjSSxTQUFTLEtBQUMsSUFBSTtlQUNkLEtBQUMsU0FBUzs7bUJBQW1CLEtBQUMsTUFBTSxFQUFHOzs7Ozs7OztRQUd2QyxTQUFTLEtBQUMsSUFBSTtlQUNkLEtBQUMsU0FBUzs7bUJBQW1CLEtBQUMsVUFBVSxFQUFHOzs7Ozs7OztRQUczQyxTQUFTLEtBQUMsSUFBSTtlQUNkLEtBQUMsU0FBUzs7bUJBQW1CLEtBQUMsTUFBTSxFQUFHOzs7Ozs7OztRQU12QyxTQUFTLEtBQUMsSUFBSTtRQUNkLFNBQVMsS0FBQyxJQUFJO2VBQ2QsS0FBQyxTQUFTOzttQkFBbUIsS0FBQyxNQUFNLEVBQUcsV0FBWSxLQUFDLE1BQU0sRUFBRzs7Ozs7Ozs7UUFHN0QsU0FBUyxLQUFDLElBQUk7UUFDZCxTQUFTLEtBQUMsSUFBSTtlQUNkLEtBQUMsU0FBUzs7bUJBQW1CLEtBQUMsVUFBVSxFQUFHLFdBQVksS0FBQyxNQUFNLEVBQUc7Ozs7OztlQUV4QyxRQUFRLE9BQVE7O21CQUFlOzs7Ozs7ZUFRdEMsS0FBQyxNQUFNLEVBQUUsS0FBSyxLQUFNOzs7Ozs7O2NBRzlCLGFBQWE7O29CQUNqQixPQUFPLEdBQUcsTUFBTSxhQUFoQixPQUFPLEdBQUcsTUFBTSxHQUFJOzs7O21CQUVwQjs7Ozs7O2VBRUssT0FBTzs7Ozs7OztBQVd4Qjs7OztTQUUwQjs7ZUFBcEI7O1VBQ29CLGtCQUFBLFFBQVM7O2VBQTdCOztRQUU2QixPQUFPLGFBQVk7O1FBQWxELFVBQVUsUUFBUSxNQUFNOztJQUV4QixRQUFRLE9BQU87V0FFVCxHQUFHOztRQUNMLFNBQVMsT0FBTyxHQUFHO2NBQ0c7O21CQUFwQjs7O1dBRU47OztBQVdKOzs7O2tCQUVtQzs7UUFBL0IsVUFBVSxRQUFRLE1BQU07O29CQUNrQzs7UUFBMUQsMEJBQTBCLEtBQUssVUFBVTs7SUFFekMsZUFBVztJQUVYLElBQUk7V0FFRSxHQUFHLFNBQVM7O1FBQ2QsSUFBSSxHQUFHO2NBQ0EsRUFBRTs7aUJBQ0UsT0FBTyxNQUFNLFNBQVM7O2dCQUN6QixJQUFJLEVBQUU7Ozs7Z0JBRU4sSUFBSSxFQUFFOzs7OztZQUVWLElBQUksRUFBRTs7O1FBRVgsR0FBRyxXQUFVLE1BQU07O1lBQ2YsVUFBUzs7bUJBQ0QsRUFBRSxHQUFHOzs7O1lBRVosRUFBRSxHQUFHLE1BQU07Z0JBQ1IsRUFBRSxHQUFHLFFBQU87O2dCQUNYLDRCQUE0QixLQUFLLFVBQVUsc0JBQXFCLFFBQVEsS0FBSyxXQUFVLEtBQUssVUFBVTs7Ozs7O1FBRTlHLFlBQUksY0FBYyxHQUFJOztXQUMxQjs7O0FBYUo7Ozs7UUFFbUMsT0FBTyxhQUFZOztRQUFsRCxVQUFVLFFBQVEsTUFBTTs7VUFDbUMsbUJBQW1COztRQUE5RSwwQkFBMEIsS0FBSyxVQUFVOztJQUV6QyxRQUFRLE9BQU87SUFDZixJQUFJO1dBRUUsR0FBRyxTQUFTOztRQUNkLElBQUksR0FBRztRQUNQLElBQUksRUFBRTthQUNDOztZQUFPOzs7UUFFZixHQUFHLFdBQVUsTUFBTTs7WUFDZixhQUFhOztZQUNaLEVBQUUsT0FBTyxTQUFTLEdBQUc7O2lCQUNqQixhQUFhOzttQkFDVixFQUFFLEdBQUc7OztXQUNwQjs7O0lBR0EsS0FBSztJQUNMLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSSJ9
//# sourceURL=kode/kxk/sds.kode
