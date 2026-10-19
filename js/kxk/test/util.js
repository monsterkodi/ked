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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9reGsvdGVzdC91dGlsLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztnQkFvQlEsS0FBSyxTQUFTLEVBQUUsSUFBSyxFQUFFLElBQUs7Z0JBQzVCLEtBQUssU0FBUyxFQUFFLElBQUssRUFBRSxJQUFLO2dCQUM1QixLQUFLLFNBQVMsRUFBRSxJQUFLLEVBQUUsSUFBSztnQkFDNUIsS0FBSyxTQUFTLEVBQUUsSUFBSyxFQUFFLElBQUs7Z0JBQzVCLEtBQUssU0FBUyxFQUFFLElBQUssRUFBRSxJQUFLO2dCQUM1QixLQUFLLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUs7Z0JBQzVDLEtBQUssU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSztnQkFDNUMsS0FBSyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLElBQUksSUFBSSxNQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLElBQUksSUFBSSxNQUFPO2dCQUN4RSxLQUFLLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksSUFBSSxJQUFJLE1BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksSUFBSSxJQUFJLE1BQU87Z0JBQ3hFLEtBQUssU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFJLElBQUksTUFBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxJQUFJLElBQUksTUFBTztnQkFDeEUsS0FBSyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLElBQUksSUFBSSxNQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLElBQUksSUFBSSxNQUFPO2dCQUN4RSxLQUFLLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFB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
//# sourceURL=file://kode/kxk/test/util.kode
