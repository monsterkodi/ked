var toExport = {}
var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, file: function () { return import.meta.url.substring(7); }, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.b5=_k_.k.F256(_k_.k.b(5))

var c, COUNT, crashed, FRAGMENTS, i, internal, msg, pick, program, r, rand, REGRESSIONS, rng, SEED, src, _27_41_, _28_40_

import utils from "./utils.js"
let kc = utils.kc

import lexer from "../lexer.js"

SEED = +((_27_41_=(await process.env.KODE_FUZZ_SEED)) != null ? _27_41_ : 1)
COUNT = +((_28_40_=(await process.env.KODE_FUZZ_N)) != null ? _28_40_ : 3000)

rand = (function (st)
{
    var t

    st.s = st.s + 0x6D2B79F5 | 0
    t = Math.imul(st.s ^ st.s >>> 15,1 | st.s)
    t = t + Math.imul(t ^ t >>> 7,61 | t) ^ t
    return (t ^ t >>> 14) >>> 0
}).bind(this)

rng = function (seed)
{
    var st

    st = {s:seed}
    return function ()
    {
        return rand(st) / 0x80000000
    }
}

pick = function (r, list)
{
    return list[Math.floor(r() * list.length)]
}
FRAGMENTS = lexer.Patterns.keyword.concat(['@','@a','@.','this','▸','▴','⮐','◆','▪','●','●▸','■','->','=>','○->','○=>','+','-','*','/','%','!','~','^','&&','||','<<','>>','++','--','??','===','(',')','[',']','{','}',',',';',':','.','?','?.','\\','"str"',"'s'",'`t`','"""triple"""','/re/g','/re/i','1','0','1.5','1e3','0x1f','0b101','0o17','42n','-Infinity','true','false','yes','no','null','undefined','NaN','a','b','foo','bar','_x','$y','list','item','\n','  ','\n    ','\t','# c','#','a = 1','log x','f a b','[1, 2]','{a: 1}','(x)','x.y','a?[0]'])

program = function (r)
{
    var i, n, parts

    n = 1 + Math.floor(r() * 12)
    parts = []
    for (var _a_ = i = 0, _b_ = n; (_a_ <= _b_ ? i < n : i > n); (_a_ <= _b_ ? ++i : --i))
    {
        parts.push(pick(r,FRAGMENTS))
        if (r() < 0.6)
        {
            parts.push(' ')
        }
        else
        {
            parts.push('\n')
        }
    }
    return parts.join('')
}

internal = function (err)
{
    return _k_.in('internal kode compiler error',String(err))
}
REGRESSIONS = ['@.','a.','a..','a.b.','a +','a = 1 +','if','class','function','for','for x in','try','try a','import','export','a each','a each (k,v)','1 is']
toExport["fuzz"] = async function ()
{
    await section("nothing crashes", async function ()
    {
        crashed = []
        var list = _k_.list(REGRESSIONS)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            src = list[_c_]
            try
            {
                kc(src,_k_.file())
            }
            catch (err)
            {
                if (internal(err))
                {
                    msg = String(err)
                    crashed.push({seed:0,index:src,src:src,err:msg})
                }
            }
        }
        r = rng(SEED)
        for (var _d_ = i = 0, _e_ = COUNT; (_d_ <= _e_ ? i < COUNT : i > COUNT); (_d_ <= _e_ ? ++i : --i))
        {
            src = program(r)
            try
            {
                kc(src,_k_.file())
            }
            catch (err)
            {
                if (internal(err))
                {
                    msg = String(err)
                    crashed.push({seed:SEED,index:i,src:src,err:msg})
                }
            }
        }
        var list1 = _k_.list(crashed)
        for (var _f_ = 0; _f_ < list1.length; _f_++)
        {
            c = list1[_f_]
            console.log(_k_.r5('fuzz case'),_k_.b5((c.seed ? c.index : 'regression')))
            console.log((c.seed ? `seed ${c.seed}` : 'regression'))
            console.log(JSON.stringify(c.src))
            console.log(c.err)
            console.log('')
        }
        compare(crashed.length,0)
    })
}
toExport["fuzz"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnV6ei5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2RlL3Rlc3QvZnV6ei5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBMEJBLHlCQUFZLFFBQVEsSUFBSSxxQ0FBbUI7QUFDM0MsMEJBQVksUUFBUSxJQUFJLGtDQUFrQjs7QUFTMUMsa0JBQU87Ozs7SUFFSCxHQUFHLElBQUksR0FBRyxJQUFJLGFBQWE7SUFDM0IsSUFBSSxLQUFLLEtBQUssR0FBRyxJQUFJLEdBQUcsTUFBTSxHQUFJLElBQUksR0FBRztJQUN6QyxJQUFJLElBQUksS0FBSyxLQUFLLElBQUksTUFBTSxFQUFHLEtBQUssS0FBSztZQUN4QyxJQUFJLE1BQU0sUUFBUTs7O0FBRXZCLGdCQUFNOzs7O0lBRUYsTUFBSyxFQUFFOzs7ZUFLSixLQUFLLE1BQU07Ozs7QUFFbEIsaUJBQU8sR0FBRTs7V0FBUSxLQUFLLEtBQUssTUFBTSxNQUFNLEtBQUs7O0FBSzVDLFlBQVksTUFBTSxTQUFTLFFBQVEsUUFDL0IsSUFBSyxLQUFNLEtBQU0sT0FBUSxJQUFLLElBQUssSUFBSyxJQUFLLElBQUssSUFBSyxLQUFNLElBQzdELEtBQU0sS0FBTSxNQUFPLE1BQU8sSUFBSyxJQUFLLElBQUssSUFBSyxJQUFLLElBQUssSUFBSyxJQUM3RCxLQUFNLEtBQU0sS0FBTSxLQUFNLEtBQU0sS0FBTSxLQUFNLE1BQzFDLElBQUssSUFBSyxJQUFLLElBQUssSUFBSyxJQUFLLElBQUssSUFBSyxJQUFLLElBQUssSUFBSyxLQUFNLEtBQzdELFFBQVMsTUFBTyxNQUFPLGVBQWdCLFFBQVMsUUFDaEQsSUFBSyxJQUFLLE1BQU8sTUFBTyxPQUFRLFFBQVMsT0FBUSxNQUFPLFlBQ3hELE9BQVEsUUFBUyxNQUFPLEtBQU0sT0FBUSxZQUFhLE1BQ25ELElBQUssSUFBSyxNQUFPLE1BQU8sS0FBTSxLQUFNLE9BQVEsT0FDNUMsS0FBTSxLQUFNLFNBQVUsS0FBTSxNQUFPLElBQ25DLFFBQVMsUUFBUyxRQUFTLFNBQVUsU0FBVSxNQUFPLE1BQU87O0FBT2pFLG9CQUFVOzs7O0lBRU4sSUFBSSxJQUFJLEtBQUssTUFBTSxNQUFNO0lBRXpCO21CQUNJLElBQUssU0FBSSxxQkFBQSxRQUFBOztRQUNULE1BQU0sS0FBSyxLQUFLLEVBQUc7WUFFaEIsTUFBTTs7WUFDTCxNQUFNLEtBQUs7Ozs7WUFFWCxNQUFNLEtBQUs7OztXQUVuQixNQUFNLEtBQUs7OztBQUtmLHFCQUFXOztrQkFBTywrQkFBa0MsT0FBTzs7QUFFM0QsZUFDSSxLQUFNLEtBQU0sTUFBTyxPQUNuQixNQUFPLFVBQ1AsS0FBTSxRQUFTLFdBQVksTUFBTyxXQUFZLE1BQU8sUUFDckQsU0FBVSxTQUNWLFNBQVUsZUFDVjs7Ozs7UUFPSTs0QkFFVzs7O1lBQVA7OztnQkFHSSxHQUFHOzttQkFDRDs7b0JBQ0MsU0FBUzs7b0JBQ1IsTUFBTSxPQUFPO29CQUNiLFFBQVEsTUFDSixLQUFNLEVBQ04sTUFBTyxJQUNQLElBQU8sSUFDUCxJQUFPOzs7O1FBRXZCLElBQUksSUFBSTt1QkFFSixJQUFLLFNBQUkseUJBQUEsWUFBQTs7WUFFVCxNQUFNLFFBQVE7OztnQkFHVixHQUFHOzttQkFDRDs7b0JBQ0MsU0FBUzs7b0JBQ1IsTUFBTSxPQUFPO29CQUNiLFFBQVEsTUFDSixLQUFPLEtBQ1AsTUFBTyxFQUNQLElBQU8sSUFDUCxJQUFPOzs7OzZCQUVkOzs7WUFBTDtZQUVBLG1CQUFPLHFCQUFnQixFQUFFLE9BQU8sRUFBRSxRQUFRO1lBQzFDLGFBQUksRUFBRSxlQUFlLEVBQUUsU0FBUztZQUNoQyxZQUFJLEtBQUssVUFBVSxFQUFFO1lBQ3JCLFlBQUksRUFBRTtZQUNOLFlBQUk7O2dCQUVSLFFBQVEsT0FBUyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/fuzz.kode
