var _k_ = {isArr: function (o) {return Array.isArray(o)}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var util

util = {isEqual:function (a, b)
{
    var index

    if (_k_.isArr(a) && _k_.isArr(b))
    {
        if (a.length !== b.length)
        {
            return false
        }
        for (index = 0; index < a.length; index++)
        {
            if (!util.isEqual(a[index],b[index]))
            {
                return false
            }
        }
        return true
    }
    if (_k_.isObj(a) && _k_.isObj(b))
    {
        return util.isEqual(Object.keys(a),Object.keys(b)) && util.isEqual(Object.values(a),Object.values(b))
    }
    return a === b
},zip:function (...args)
{
    var i, maxLen, result

    if (_k_.empty(args))
    {
        return []
    }
    result = []
    maxLen = _k_.max(args.map(function (a)
    {
        return a.length
    }))
    for (i = 0; i < maxLen; i++)
    {
        result.push(args.map(function (a)
        {
            return a[i]
        }))
    }
    return result
},fold:function (l, a)
{
    var i, result

    result = []
    i = 0
    while (i <= a.length - l)
    {
        result.push(a.slice(i,i + l))
        i += l
    }
    return result
},reversed:function (arr)
{
    return arr.slice(0).reverse()
},max:function (arr)
{
    return Math.max.apply(null,arr)
},min:function (arr)
{
    return Math.min.apply(null,arr)
},pull:function (arr, item)
{
    var index

    if (_k_.isArr(arr))
    {
        index = arr.indexOf(item)
        if (index >= 0)
        {
            arr.splice(index,1)
        }
    }
    return arr
},pullIf:function (arr, pred)
{
    var index

    for (index = arr.length - 1; index >= 0; index--)
    {
        if (pred(arr[index]))
        {
            arr.splice(index,1)
        }
    }
    return arr
},keepIf:function (arr, pred)
{
    return util.pullIf(arr,function (m)
    {
        return !pred(m)
    })
},splitWith:function (arr, pred)
{
    var exc, inc, item

    inc = []
    exc = []
    if (!_k_.empty(arr) && _k_.isArr(arr))
    {
        var list = _k_.list(arr)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            if (pred(item))
            {
                inc.push(item)
            }
            else
            {
                exc.push(item)
            }
        }
    }
    else if (!(_k_.isArr(arr)))
    {
        console.log('not an array!?',arr)
    }
    return [inc,exc]
},findIf:function (arr, pred)
{
    var v

    var list = _k_.list(arr)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        v = list[_b_]
        if (pred(v))
        {
            return v
        }
    }
},findIndex:function (arr, pred)
{
    var i, v

    var list = _k_.list(arr)
    for (i = 0; i < list.length; i++)
    {
        v = list[i]
        if (pred(v))
        {
            return i
        }
    }
},pullAll:function (arr, items, cmp = util.isEqual)
{
    var index, item

    if (!_k_.empty(arr) && _k_.isArr(arr))
    {
        var list = _k_.list(items)
        for (var _d_ = 0; _d_ < list.length; _d_++)
        {
            item = list[_d_]
            for (index = arr.length - 1; index >= 0; index--)
            {
                if (cmp(arr[index],item))
                {
                    arr.splice(index,1)
                }
            }
        }
    }
    return arr
},uniq:function (arr)
{
    var item, result

    result = []
    var list = _k_.list(arr)
    for (var _e_ = 0; _e_ < list.length; _e_++)
    {
        item = list[_e_]
        if (!(_k_.in(item,result)))
        {
            result.push(item)
        }
    }
    return result
},uniqEqual:function (arr)
{
    var add, item, result, ritem

    result = []
    var list = _k_.list(arr)
    for (var _f_ = 0; _f_ < list.length; _f_++)
    {
        item = list[_f_]
        add = true
        var list1 = _k_.list(result)
        for (var _10_ = 0; _10_ < list1.length; _10_++)
        {
            ritem = list1[_10_]
            if (util.isEqual(item,ritem))
            {
                add = false
                break
            }
        }
        if (add)
        {
            result.push(item)
        }
    }
    return result
},uniqBy:function (arr, prop)
{
    var add, item, key, result, ritem

    if (_k_.isStr(prop))
    {
        key = prop
        prop = function (o)
        {
            return o[key]
        }
    }
    result = []
    var list = _k_.list(arr)
    for (var _11_ = 0; _11_ < list.length; _11_++)
    {
        item = list[_11_]
        add = true
        var list1 = _k_.list(result)
        for (var _12_ = 0; _12_ < list1.length; _12_++)
        {
            ritem = list1[_12_]
            if (prop(item) === prop(ritem))
            {
                add = false
                break
            }
        }
        if (add)
        {
            result.push(item)
        }
    }
    return result
},sortBy:function (arr, prop)
{
    var key

    if (_k_.isStr(prop))
    {
        key = prop
        prop = function (o)
        {
            return o[key]
        }
    }
    return arr.sort(function (a, b)
    {
        var pa, pb

        pa = prop(a)
        pb = prop(b)
        if (_k_.isStr(pa) && _k_.isStr(pb))
        {
            return pa.localeCompare(pb,'en',{sensitivity:'variant',caseFirst:'upper',numeric:true})
        }
        else
        {
            return Number(pa) - Number(pb)
        }
    })
},replace:function (array, index, numToRemove, arrayToInsert)
{
    if (_k_.isArr(array))
    {
        return array.splice.apply(array,[index,numToRemove].concat(arrayToInsert))
    }
},insert:function (array, index, arrayToInsert)
{
    return util.replace(array,index,0,arrayToInsert)
},defaults:function (obj, def)
{
    var key, val, _155_21_

    for (key in def)
    {
        val = def[key]
        obj[key] = ((_155_21_=obj[key]) != null ? _155_21_ : val)
    }
    return obj
},pickBy:function (obj, pred)
{
    var key, result, val

    result = {}
    for (key in obj)
    {
        val = obj[key]
        if (pred(key,val))
        {
            result[key] = val
        }
    }
    return result
},deleteBy:function (obj, pred)
{
    var key, val

    for (key in obj)
    {
        val = obj[key]
        if (pred(key,val))
        {
            delete obj[key]
        }
    }
    return obj
},toPairs:function (obj)
{
    var key, result, val

    result = []
    if (_k_.isObj(obj))
    {
        for (key in obj)
        {
            val = obj[key]
            result.push([key,val])
        }
    }
    else if (_k_.isArr(obj))
    {
        result = util.fold(2,obj)
    }
    return result
},fromPairs:function (pairs)
{
    var pair, result

    result = {}
    var list = _k_.list(pairs)
    for (var _13_ = 0; _13_ < list.length; _13_++)
    {
        pair = list[_13_]
        result[pair[0]] = pair[1]
    }
    return result
},sleep:async function (ms)
{
    await new Promise((function (r)
    {
        return setTimeout(r,ms)
    }).bind(this))
    return true
},uuid:function ()
{
    return crypto.randomUUID()
},sessionId:function ()
{
    var now, seconds, year, yearStart

    now = new Date()
    year = now.getFullYear()
    yearStart = new Date(year,0,1)
    seconds = Math.floor((now.getTime() - yearStart.getTime()) / 522).toString(36)
    return (year - 2025).toString(36) + _k_.lpad(5,seconds,'0')
},rad2deg:function (r)
{
    return 180 * r / Math.PI
},deg2rad:function (d)
{
    return Math.PI * d / 180
},randInt:function (r)
{
    return Math.floor(Math.random() * r)
},randIntRange:function (l, h)
{
    return Math.floor(l + Math.random() * (h - l + 1))
},randRange:function (l, h)
{
    return l + Math.random() * (h - l)
},absMax:function (a, b)
{
    return ((Math.abs(a) >= Math.abs(b)) ? a : b)
},absMin:function (a, b)
{
    return ((Math.abs(a) < Math.abs(b)) ? a : b)
},fade:function (a, b, v)
{
    var c

    c = _k_.clamp(0,1,v)
    return a * (1 - c) + b * c
}}
export default util;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvdXRpbC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsUUFJSSxrQkFBUyxHQUFFOzs7O1FBRUMsVUFBTCxNQUFrQixVQUFMOztZQUVELEVBQUUsV0FBVSxFQUFFOzttQkFBdkI7O2FBRUUsUUFBUyxXQUFJLEVBQUU7O2lCQUNBLEtBQUssUUFBUSxFQUFFLE9BQU8sRUFBRTs7dUJBQXJDOzs7ZUFFSjs7UUFFRSxVQUFMLE1BQWtCLFVBQUw7O2VBRVYsS0FBSyxRQUFRLE9BQU8sS0FBSyxHQUFHLE9BQU8sS0FBSyxPQUFRLEtBQUssUUFBUSxPQUFPLE9BQU8sR0FBRyxPQUFPLE9BQU87O1dBRWxHLE1BQUs7RUFJVCxjQUFLOzs7O2tCQUVhOzs7O0lBRWQ7SUFDQSxpQkFBYSxLQUFLLGNBQUs7O2VBQU0sRUFBRTs7U0FDM0IsSUFBSyxPQUFJOztRQUNULE9BQU8sS0FBSyxLQUFLLGNBQUs7O21CQUFNLEVBQUU7OztXQUNsQztFQUVKLGVBQU0sR0FBRTs7OztJQUVKO0lBQ0EsSUFBSTtXQUNFLEtBQUssRUFBRSxTQUFPOztRQUNoQixPQUFPLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBRTtRQUN4QixLQUFLOztXQUNUO0VBRUosbUJBQVU7O1dBQU8sSUFBSSxNQUFNLEdBQUc7RUFFOUIsY0FBVTs7V0FBTyxLQUFLLElBQUksTUFBTSxLQUFLO0VBQ3JDLGNBQVU7O1dBQU8sS0FBSyxJQUFJLE1BQU0sS0FBSztFQUVyQyxlQUFVLEtBQUk7Ozs7UUFFQSxVQUFQOztRQUNDLFFBQVEsSUFBSSxRQUFRO1lBQ2pCLFNBQVM7O1lBQ1IsSUFBSSxPQUFPLE1BQU07OztXQUN6QjtFQUVKLGlCQUFRLEtBQUk7Ozs7U0FFSixRQUFTLElBQUksU0FBTyxZQUFHOztZQUNwQixLQUFLLElBQUk7O1lBQ1IsSUFBSSxPQUFPLE1BQU07OztXQUN6QjtFQUVKLGlCQUFRLEtBQUk7O1dBQVEsS0FBSyxPQUFPLGNBQUs7O2dCQUFV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
//# sourceURL=../../kode/kxk/util.kode
