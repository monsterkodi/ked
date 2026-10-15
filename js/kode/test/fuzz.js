var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.w2=_k_.k.F256(_k_.k.w(2))

var CASES, compiled, crashed, index, m, outcome, reported, src

import utils from "./utils.js"
let kc = utils.kc

CASES = ['','   ','\n\n','▸','->','@','@.','@a','.','a.','a..','a.b.','a:',':a','a?','(',')','[',']','{','}','((','[[','{{','((((','))))','[1,','{a:','a = [1, 2','a = {a:1','=','==','+=','+','-','*','a +','+ a','a * * b','a = 1 +','a = 1 *','a = 1 ==','a = 1 ?','a = 1 and','a =','a = = 1','a = [','a = {','a = (','a = (1','a.b =','a=','a = 1;',';;','if','if a','if a then','else','switch','switch x','class','class C','class C extends','function','function f','for','for x in','for x in y do','while','while a','return','return 1 2','try','try a','catch','finally','a = ->','a = -> b =','f = (a,','f = (a, b) ->','(a, b)','▸ x','▸ ','a ▸','▴','▴ a','●','●▸','●▪','▸▸','a = """','a = "',"a = '",'a = `','a = /','a = /re','#','# comment','a = 1 # c','\\','a = "\\','use','use a','use a from','import','export','a each','a each (k,v)','a each (k,v) ->','lpad','rpad','is','1 is','empty','valid','noon','dbg','log','error','a ? b : c','a?.b','a?[0]','0x','0b','1e','.5','1..2','1...','..','...','a[','a[0','a[]','a()','a(1,','new','new a','throw','super','yield','await','async','typeof','instanceof','f = =>','-> ->','a => b','f = ->\n  a = 1\n b = 2']

outcome = function (src)
{
    try
    {
        kc(src,'kode/test/fuzz.kode')
        return ''
    }
    catch (err)
    {
        return err
    }
}
crashed = []
reported = 0
compiled = 0
var list = _k_.list(CASES)
for (index = 0; index < list.length; index++)
{
    src = list[index]
    try
    {
        m = outcome(src)
    }
    catch (err)
    {
        crashed.push([src,err])
        continue
    }
    if (m)
    {
        reported++
        console.log(_k_.w2("fuzz case"),_k_.b5(index))
        console.log(m)
    }
    else
    {
        compiled++
    }
}
toExport["fuzz"] = function ()
{
    section("nothing crashes", function ()
    {
        compare(crashed.length,0)
    })
    section("cases exercise both paths", function ()
    {
        compare(compiled > 0,true)
        compare(reported > 0,true)
    })
}
toExport["fuzz"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnV6ei5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2RlL3Rlc3QvZnV6ei5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQWlCQSxTQUNJLEdBQUksTUFBTyxPQUFRLElBQUssS0FBTSxJQUFLLEtBQU0sS0FDekMsSUFBSyxLQUFNLE1BQU8sT0FBUSxLQUFNLEtBQU0sS0FDdEMsSUFBSyxJQUFLLElBQUssSUFBSyxJQUFLLElBQUssS0FBTSxLQUFNLEtBQzFDLE9BQVEsT0FBUSxNQUFPLE1BQU8sWUFBYSxXQUMzQyxJQUFLLEtBQU0sS0FBTSxJQUFLLElBQUssSUFBSyxNQUFPLE1BQU8sVUFDOUMsVUFBVyxVQUFXLFdBQVksVUFBVyxZQUM3QyxNQUFPLFVBQVcsUUFBUyxRQUFTLFFBQVMsU0FDN0MsUUFBUyxLQUFNLFNBQVUsS0FDekIsS0FBTSxPQUFRLFlBQWEsT0FBUSxTQUFVLFdBQzdDLFFBQVMsVUFBVyxrQkFBbUIsV0FBWSxhQUNuRCxNQUFPLFdBQVksZ0JBQWlCLFFBQVMsVUFDN0MsU0FBVSxhQUFjLE1BQU8sUUFBUyxRQUFTLFVBQ2pELFNBQVUsYUFBYyxVQUFXLGdCQUFpQixTQUNwRCxNQUFPLEtBQU0sTUFBTyxJQUFLLE1BQU8sSUFBSyxLQUFNLEtBQU0sS0FDakQsVUFBVyxRQUFTLFFBQVMsUUFBUyxRQUFTLFVBQy9DLElBQUssWUFBYSxZQUFhLEtBQU0sVUFDckMsTUFBTyxRQUFTLGFBQWMsU0FBVSxTQUN4QyxTQUFVLGVBQWdCLGtCQUFtQixPQUFRLE9BQ3JELEtBQU0sT0FBUSxRQUFTLFFBQVMsT0FBUSxNQUN4QyxNQUFPLFFBQVMsWUFBYSxPQUFRLFFBQ3JDLEtBQU0sS0FBTSxLQUFNLEtBQU0sT0FBUSxPQUFRLEtBQU0sTUFDOUMsS0FBTSxNQUFPLE1BQU8sTUFBTyxPQUFRLE1BQU8sUUFBUyxRQUNuRCxRQUFTLFFBQVMsUUFBUyxRQUFTLFNBQVUsYUFDOUMsU0FBVSxRQUFTLFNBQVU7O0FBR2pDOzs7O1FBR1EsR0FBRyxJQUFJO2VBQ1A7O1dBQ0U7O2VBQ0Y7OztBQUVSO0FBQ0EsV0FBVztBQUNYLFdBQVc7b0JBRU07Ozs7OztRQUdULElBQUksUUFBUTs7V0FDVjs7UUFDRixRQUFRLE1BQU0sSUFBSztRQUNuQjs7UUFDRDs7UUFDQztRQUNBLG1CQUFPLG9CQUFnQjtRQUN2QixZQUFJOzs7O1FBQ0g7Ozs7Ozs7Z0JBTUQsUUFBUSxPQUFTOzs7O2dCQUlqQixXQUFXLEVBQUk7Z0JBQ2YsV0FBVyxFQUFJIn0=
//# sourceURL=file://kode/kode/test/fuzz.kode
