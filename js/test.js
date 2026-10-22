var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, file: function () { return import.meta.url.substring(7); }, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }};_k_.B5=_k_.k.B256(_k_.k.B(5));_k_.y5=_k_.k.F256(_k_.k.y(5))

var columns, fail, file, files, hdr, lastArg, m, mod, mods, result, test, tests

import nfs from "./kxk/nfs.js"
import slash from "./kxk/slash.js"
import kstr from "./kxk/kstr.js"

import tester from "./kode/tester.js"

mods = ['kxk','kode','kolor','ked','konrad']
lastArg = process.argv.slice(-1)[0]
columns = 60
if (lastArg === 'help')
{
    console.log(`
test runner

usage

    kk -t                    run all tests
    kk -t brief|silent       set verbosity
    kk -t ${mods.join('|')}  test a single module
    kk -t .../file.js        run a single test file
`)
    process.exit(0)
}
tests = {}
var list = _k_.list(mods)
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    m = list[_a_]
    tests[m] = true
}
fail = false

hdr = function (h)
{
    console.log(_k_.B5(_k_.y5(' ' + kstr.crop(h,columns) + ' ')))
}
if (lastArg === 'brief')
{
    tester.logSections = false
}
else if (lastArg === 'silent')
{
    tester.logSections = false
    tester.logModules = false
}
else if (_k_.in(lastArg,mods))
{
    var list1 = _k_.list(mods)
    for (var _b_ = 0; _b_ < list1.length; _b_++)
    {
        m = list1[_b_]
        tests[m] = m === lastArg
    }
}
else if (lastArg !== _k_.file())
{
    var list2 = _k_.list(mods)
    for (var _c_ = 0; _c_ < list2.length; _c_++)
    {
        m = list2[_c_]
        tests[m] = false
    }
    hdr(process.argv.slice(-1)[0])
    file = slash.path(_k_.dir(),'..',lastArg)
    test = await import(file)
    result = await tester.test(test.default)
    fail = fail || !((result != null ? result : true))
}
var list3 = _k_.list(mods)
for (var _d_ = 0; _d_ < list3.length; _d_++)
{
    mod = list3[_d_]
    if (tests[mod])
    {
        hdr(mod)
        files = await nfs.list(slash.path(_k_.dir(),mod,'test'))
        var list4 = _k_.list(files)
        for (var _e_ = 0; _e_ < list4.length; _e_++)
        {
            file = list4[_e_]
            if (file.type === 'dir')
            {
                continue
            }
            test = await import(file.path)
            result = await tester.test(test.default)
            fail = fail || !((result != null ? result : true))
        }
    }
}
tester.summarize()
if (fail)
{
    process.exitCode = 1
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZXMiOlsiLi4va29kZS90ZXN0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFXQSxRQUFRLE1BQU0sT0FBTyxRQUFRLE1BQU07QUFFbkMsVUFBVSxRQUFRO0FBQ2xCLFVBQVU7SUFFUCxZQUFXOztJQUVWOzs7Ozs7O1lBUWdCLEtBQUssS0FBSzs7O0lBSTFCLFFBQVEsS0FBSzs7QUFFakI7b0JBQXFCOzs7O0lBQU8sTUFBTSxLQUFLOztBQUV2QyxPQUFPOztBQUVQOztJQUFXLDBCQUFVLE1BQU0sS0FBSyxLQUFLLEVBQUcsV0FBVzs7SUFHL0MsWUFBVzs7SUFFUCxPQUFPLGNBQWM7O1NBRXpCLFlBQVc7O0lBRVAsT0FBTyxjQUFjO0lBQ3JCLE9BQU8sYUFBYTs7Z0JBRXhCLFFBQVc7O3lCQUVFOzs7O1FBQU8sTUFBTSxLQUFLLE1BQUs7OztTQUVwQzs7eUJBRWE7Ozs7UUFBTyxNQUFNLEtBQUs7O0lBRTNCLElBQUksUUFBUTtJQUVaLE9BQU8sTUFBTSxlQUFVLEtBQUs7SUFDNUIsYUFBUSxPQUFPO0lBQ2YsZUFBVSxPQUFPLEtBQUssS0FBSztJQUMzQixPQUFPLFdBQWEsaUJBQUEsU0FBUzs7cUJBRTFCOzs7O1FBRUosTUFBTTs7UUFDTCxJQUFJO1FBQ0osY0FBUyxJQUFJLEtBQUssTUFBTSxlQUFVLElBQUk7NkJBQzFCOzs7O2dCQUNJLEtBQUssU0FBUTs7Z0JBQXpCOztZQUNBLGFBQVEsT0FBTyxLQUFLO1lBQ3BCLGVBQVUsT0FBTyxLQUFLLEtBQUs7WUFDM0IsT0FBTyxXQUFhLGlCQUFBLFNBQVM7Ozs7QUFFekMsT0FBTztJQUVKOztJQUNDLFFBQVEsV0FBVyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/test.kode
