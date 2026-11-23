var toExport = {}
var a, arr, b, def, obj

import util from "../util.js"

toExport["util"] = async function ()
{
    await section("isEqual", async function ()
    {
        compare(util.isEqual([1,2],[1,2]),true)
        compare(util.isEqual([1,2],[1,3]),false)
        compare(util.isEqual([1,2],[2,1]),false)
        compare(util.isEqual({a:1},{a:1}),true)
        compare(util.isEqual({a:1},{a:2}),false)
        compare(util.isEqual({a:1,b:2,c:3},{a:1,b:2,c:3}),true)
        compare(util.isEqual({a:1,b:2,c:3},{c:3,b:2,a:1}),false)
        compare(util.isEqual({a:1,b:2,c:'3',d:[[1],[2]]},{a:1,b:2,c:'3',d:[[1],[2]]}),true)
        compare(util.isEqual({b:2,a:1,c:'3',d:[[1],[2]]},{a:1,b:2,c:'3',d:[[1],[2]]}),false)
        compare(util.isEqual({b:1,a:2,c:'3',d:[[1],[2]]},{a:1,b:2,c:'3',d:[[1],[2]]}),false)
        compare(util.isEqual({a:1,b:2,c:'3',d:[[2],[1]]},{a:1,b:2,c:'3',d:[[1],[2]]}),false)
        compare(util.isEqual({a:1,b:2,c:'2',d:[[2],[1]]},{a:1,b:2,c:'3',d:[[1],[2]]}),false)
    })
    await section("zip", async function ()
    {
        compare(util.zip(),[])
        a = [1,2,4]
        b = ['c','d','e']
        compare(util.zip(a,b),[[1,'c'],[2,'d'],[4,'e']])
    })
    await section("fold", async function ()
    {
        a = [1,2,3,4,5,6]
        compare(util.fold(2,a),[[1,2],[3,4],[5,6]])
        compare(util.fold(3,a),[[1,2,3],[4,5,6]])
    })
    await section("reversed", async function ()
    {
        arr = [1,2,3]
        compare(util.reversed(arr),[3,2,1])
        compare(arr,[1,2,3])
    })
    await section("max", async function ()
    {
        arr = [1,2,3]
        compare(util.max(arr),3)
    })
    await section("min", async function ()
    {
        arr = [1,2,3]
        compare(util.min(arr),1)
    })
    await section("pull", async function ()
    {
        arr = [1,2,3]
        compare(util.pull(arr,2),[1,3])
        compare(arr,[1,3])
        compare(util.pull(['a','b'],'a'),['b'])
        compare(util.pull(['a','b'],'c'),['a','b'])
        compare(util.pull([1,4],2),[1,4])
        compare(util.pull([],2),[])
        compare(util.pull({}),{})
        compare(util.pull(1),1)
        compare(util.pull(null),null)
    })
    await section("pullIf", async function ()
    {
        arr = [1,2,3]
        compare(util.pullIf(arr,function (i)
        {
            return i === 2
        }),[1,3])
        compare(arr,[1,3])
    })
    await section("keepIf", async function ()
    {
        arr = [1,2,3]
        compare(util.keepIf(arr,function (i)
        {
            return i >= 2
        }),[2,3])
        compare(arr,[2,3])
    })
    await section("splitWith", async function ()
    {
        arr = [1,2,3]
        compare(util.splitWith(arr,function (i)
        {
            return i >= 2
        }),[[2,3],[1]])
        compare(arr,[1,2,3])
    })
    await section("findIf", async function ()
    {
        arr = [1,2,3]
        compare(util.findIf(arr,function (i)
        {
            return i >= 2
        }),2)
        compare(util.findIf(arr,function (i)
        {
            return i <= 2
        }),1)
        compare(util.findIf(arr,function (i)
        {
            return i >= 8
        }),undefined)
    })
    await section("pullAll", async function ()
    {
        arr = [1,2,3]
        compare(util.pullAll(arr,[1,3]),[2])
        compare(arr,[2])
        arr = [1,9,9,2,8,3,7]
        compare(util.pullAll(arr,[3,5],function (a, b)
        {
            return a >= b
        }),[1,2])
        compare(arr,[1,2])
        compare(util.pullAll([],[],null),[])
        compare(util.pullAll([],[1,3],null),[])
        compare(util.pullAll([]),[])
    })
    await section("uniq", async function ()
    {
        arr = [3,3,5,3,2]
        compare(util.uniq(arr),[3,5,2])
        compare(arr,[3,3,5,3,2])
        compare(util.uniq([]),[])
        compare(util.uniq([1,2]),[1,2])
        compare(util.uniq([2,1]),[2,1])
        compare(util.uniq([0,null,'',undefined,[]]),[0,null,'',undefined,[]])
        compare(util.uniq([0,0,null,null,'','',null,undefined,undefined]),[0,null,'',undefined])
        compare(util.uniq(['ab','abc','abd','ab']),['ab','abc','abd'])
    })
    await section("uniqEqual", async function ()
    {
        a = [[1,2,3],[1,2,3],[1,2,3,4]]
        compare(util.uniqEqual(a),[[1,2,3],[1,2,3,4]])
    })
    await section("uniqBy", async function ()
    {
        a = [{name:'a',age:1},{name:'a',age:2},{name:'c',age:1}]
        compare(util.uniqBy(a,'name'),[{name:'a',age:1},{name:'c',age:1}])
        compare(util.uniqBy(a,'age'),[{name:'a',age:1},{name:'a',age:2}])
        a = [{name:'a',age:1},{name:'a',age:2},{name:'c',age:1},{name:'c',age:'1'}]
        compare(util.uniqBy(a,function (o)
        {
            return o.name + o.age
        }),[{name:'a',age:1},{name:'a',age:2},{name:'c',age:1}])
    })
    await section("pickBy", async function ()
    {
        obj = {a:1,b:2,c:4,d:8}
        compare(util.pickBy(obj,function (k, v)
        {
            return k === 'a' || v > 3
        }),{a:1,c:4,d:8})
    })
    await section("toPairs", async function ()
    {
        compare(util.toPairs({a:1,b:2,c:3}),[['a',1],['b',2],['c',3]])
        compare(util.toPairs([1,2,3,4,5]),[[1,2],[3,4]])
    })
    await section("fromPairs", async function ()
    {
        compare(util.fromPairs([['a',1],['b',2],['c',3]]),{a:1,b:2,c:3})
    })
    await section("defaults", async function ()
    {
        def = {c:3,b:4}
        obj = {a:1,b:2}
        compare(util.defaults(obj,def),{a:1,b:2,c:3})
        compare(util.defaults({},def),{c:3,b:4})
        obj = {a:1,b:2}
        compare(util.defaults(obj,obj),{a:1,b:2})
        compare(util.defaults({},{}),{})
        compare(util.defaults({}),{})
        compare(util.defaults({a:1}),{a:1})
    })
}
toExport["util"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC91dGlsLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNTLFdBQUE7Ozs7OztRQU15QixRQUExQixLQUFLLFNBQVMsRUFBRSxJQUFLLEVBQUUsSUFBSztRQUNGLFFBQTFCLEtBQUssU0FBUyxFQUFFLElBQUssRUFBRSxJQUFLO1FBQ0YsUUFBMUIsS0FBSyxTQUFTLEVBQUUsSUFBSyxFQUFFLElBQUs7UUFDRixRQUExQixLQUFLLFNBQVMsRUFBRSxJQUFLLEVBQUUsSUFBSztRQUNGLFFBQTFCLEtBQUssU0FBUyxFQUFFLElBQUssRUFBRSxJQUFLO1FBQ2MsUUFBMUMsS0FBSyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFLO1FBQ0YsUUFBMUMsS0FBSyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFLO1FBQzBCLFFBQXRFLEtBQUssU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFJLElBQUksTUFBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFJLElBQUksTUFBTztRQUNGLFFBQXRFLEtBQUssU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFJLElBQUksTUFBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFJLElBQUksTUFBTztRQUNGLFFBQXRFLEtBQUssU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFJLElBQUksTUFBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFJLElBQUksTUFBTztRQUNGLFFBQXRFLEtBQUssU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFJLElBQUksTUFBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUs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
//# sourceURL=../../../kode/kxk/test/util.kode
