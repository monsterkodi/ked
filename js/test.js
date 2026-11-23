var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }};_k_.B5=_k_.k.B256(_k_.k.B(5));_k_.y5=_k_.k.F256(_k_.k.y(5))

var arg, columns, f, fail, file, files, hdr, list, m, mod, mods, moduleTimes, result, selected, start, test, tests, usage

import nfs from "./kxk/nfs.js"
import slash from "./kxk/slash.js"
import kstr from "./kxk/kstr.js"

import tester from "./kode/tester.js"

mods = ['kxk','kode','kolor','ked','konrad']
columns = 60

usage = function ()
{
    console.log(`
test runner

usage

    kk -t                    run all tests
    kk -t brief|silent       set verbosity
    kk -t plain              only failures: file:line, actual and expected, no colors
    kk -t ${mods.join('|')}  test a single module
    kk -t .../file.js|kode   run a single test file
    kk -t ked popo/cursor    run the sections whose names contain the terms, level by level
`)
    return process.exit(0)
}
selected = []
files = []
var list1 = _k_.list(process.argv.slice(2))
for (var _a_ = 0; _a_ < list1.length; _a_++)
{
    arg = list1[_a_]
    if (arg === 'help')
    {
        usage()
    }
    else if (arg === 'brief')
    {
        tester.logSections = false
    }
    else if (arg === 'silent')
    {
        tester.logSections = false
        tester.logModules = false
    }
    else if (arg === 'plain')
    {
        tester.plain = true
        tester.logSections = false
        tester.logModules = false
    }
    else if (_k_.in(arg,mods))
    {
        selected.push(arg)
    }
    else if (slash.ext(arg) === 'js')
    {
        files.push(arg)
    }
    else if (slash.ext(arg) === 'kode')
    {
        files.push(arg.replace(/^kode\//,'js/').replace(/\.kode$/,'.js'))
    }
    else
    {
        tester.setFilter(arg)
    }
}
tests = {}
var list2 = _k_.list(mods)
for (var _b_ = 0; _b_ < list2.length; _b_++)
{
    m = list2[_b_]
    tests[m] = _k_.empty((files)) && (_k_.empty((selected)) || _k_.in(m,selected))
}
moduleTimes = []
fail = false

hdr = function (h)
{
    if (!tester.plain)
    {
        console.log(_k_.B5(_k_.y5(' ' + kstr.crop(h,columns) + ' ')))
    }
}
var list3 = _k_.list(files)
for (var _c_ = 0; _c_ < list3.length; _c_++)
{
    f = list3[_c_]
    hdr(f)
    test = await import(slash.path(_k_.dir(),'..',f))
    result = await tester.test(test.default)
    fail = fail || !((result != null ? result : true))
}
var list4 = _k_.list(mods)
for (var _d_ = 0; _d_ < list4.length; _d_++)
{
    mod = list4[_d_]
    if (tests[mod])
    {
        start = Date.now()
        hdr(mod)
        list = await nfs.list(slash.path(_k_.dir(),mod,'test'))
        var list5 = _k_.list(list)
        for (var _e_ = 0; _e_ < list5.length; _e_++)
        {
            file = list5[_e_]
            if (file.type === 'dir')
            {
                continue
            }
            test = await import(file.path)
            result = await tester.test(test.default)
            fail = fail || !((result != null ? result : true))
        }
        moduleTimes.push({name:mod,ms:Date.now() - start})
    }
}
tester.summarize(moduleTimes)
if (fail)
{
    process.exitCode = 1
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZXMiOlsiLi4va29kZS90ZXN0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FBYSxVQUFQO09BQVcsWUFBWDtPQUFpQixXQUFqQjs7T0FDTyxhQUFQOztBQUdOLFFBQVEsTUFBTSxPQUFPLFFBQVEsTUFBTTtBQUVuQyxVQUFVOztBQUVWOztJQUVJOzs7Ozs7OztZQVNnQixLQUFLLEtBQUs7Ozs7V0FLMUIsUUFBUSxLQUFLOztBQUVqQjtBQUNBO3FCQUVXLFFBQVEsV0FBSzs7O0lBQXBCO1FBRUksUUFBTzs7UUFBZ0I7O2FBQ3ZCLFFBQU87O1FBQWdCLE9BQU8sY0FBYzs7YUFDNUMsUUFBTzs7UUFBZ0IsT0FBTyxjQUFjO1FBQVEsT0FBTyxhQUFhOzthQUN4RSxRQUFPOztRQUFnQixPQUFPLFFBQVE7UUFBTyxPQUFPLGNBQWM7UUFBUSxPQUFPLGFBQWE7O29CQUM5RixJQUFPOztRQUFnQixTQUFTLEtBQUs7O2FBQ3JDLE1BQU0sSUFBSSxTQUFROztRQUFTLE1BQU0sS0FBSzs7YUFDdEMsTUFBTSxJQUFJLFNBQVE7O1FBQVMsTUFBTSxLQUFLLElBQUksUUFBUSxVQUFXLE9BQU8sUUFBUSxVQUFXOzs7O1FBQ2hFLE9BQU8sVUFBVTs7O0FBRWhEO3FCQUFxQjs7O0lBQUw7SUFBWSxNQUFNLGdCQUFXLHVCQUFrQixxQkFBYSxFQUFLOztBQUNqRjtBQUVBLE9BQU87O0FBRVAsZ0JBQU07O1NBQTBELE9BQU87O1FBQTVELFlBQUksT0FBRyxPQUFHLE1BQU0sS0FBSyxLQUFLLEVBQUcsV0FBVzs7O3FCQUUxQzs7O0lBQUw7SUFFQSxJQUFJO0lBRUosYUFBUSxPQUFPLE1BQU0sS0FBTSxVQUFJLEtBQUs7SUFDcEMsZUFBVSxPQUFPLEtBQUssS0FBSztJQUMzQixPQUFPLFdBQWEsaUJBQUEsU0FBUzs7cUJBRXRCOzs7SUFBUDtRQUVHLE1BQU07O1FBQ0wsUUFBUSxLQUFLO1FBQ2IsSUFBSTtRQUNKLGFBQVEsSUFBSSxLQUFLLE1BQU0sS0FBTSxVQUFJLElBQUk7NkJBQ3pCOzs7WUFBUjtnQkFDWSxLQUFLLFNBQVE7O2dCQUF6Qjs7WUFDQSxhQUFRLE9BQU8sS0FBSztZQUNwQixlQUFVLE9BQU8sS0FBSyxLQUFLO1lBQzNCLE9BQU8sV0FBYSxpQkFBQSxTQUFTOztRQUNqQyxZQUFZLE1BQU0sS0FBSyxJQUFJLEdBQUcsS0FBSyxRQUFROzs7QUFFbkQsT0FBTyxVQUFVO0lBRWQ7O0lBQ0MsUUFBUSxXQUFXIn0=
//# sourceURL=../kode/test.kode
