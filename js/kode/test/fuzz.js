var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var COUNT, FRAGMENTS, internal, pick, program, rand, REGRESSIONS, rng, SEED, _5_41_, _6_40_

import utils from "./utils.js"
let kc = utils.kc

import lexer from "../lexer.js"

SEED = +((_5_41_=(await process.env.KODE_FUZZ_SEED)) != null ? _5_41_ : 1)
COUNT = +((_6_40_=(await process.env.KODE_FUZZ_N)) != null ? _6_40_ : 3000)

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
FRAGMENTS = lexer.Patterns.keyword.concat(['@','@a','@.','this','▸','▴','⮐','◆','▪','●','●▸','■','->','=>','◯->','◯=>','+','-','*','/','%','!','~','^','&&','||','<<','>>','++','--','??','===','(',')','[',']','{','}',',',';',':','.','?','?.','\\','"str"',"'s'",'`t`','"""triple"""','/re/g','/re/i','1','0','1.5','1e3','0x1f','0b101','0o17','42n','-Infinity','true','false','yes','no','null','undefined','NaN','a','b','foo','bar','_x','$y','list','item','\n','  ','\n    ','\t','# c','#','a = 1','log x','f a b','[1, 2]','{a: 1}','(x)','x.y','a?[0]'])

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnV6ei5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rb2RlL3Rlc3QvZnV6ei5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ00sWUFBQTtJQUFROztPQUNELFlBQUE7O0FBRWIsd0JBQVksUUFBUSxJQUFJLG9DQUFtQjtBQUMzQyx5QkFBWSxRQUFRLElBQUksaUNBQWtCOztBQUUxQyxrQkFBTzs7OztJQUVILEdBQUcsSUFBSSxHQUFHLElBQUksYUFBYTtJQUMzQixJQUFJLEtBQUssS0FBSyxHQUFHLElBQUksR0FBRyxNQUFNLEdBQUksSUFBSSxHQUFHO0lBQ3pDLElBQUksSUFBSSxLQUFLLEtBQUssSUFBSSxNQUFNLEVBQUcsS0FBSyxLQUFLO1lBQ3hDLElBQUksTUFBTSxRQUFROzs7QUFFdkIsZ0JBQU07Ozs7SUFFRixNQUFLLEVBQUU7OztlQUVKLEtBQUssTUFBTTs7OztBQUVsQixpQkFBTyxHQUFFOztXQUFRLEtBQUssS0FBSyxNQUFNLE1BQU0sS0FBSzs7QUFFNUMsWUFBWSxNQUFNLFNBQVMsUUFBUSxRQUMvQixJQUFLLEtBQU0sS0FBTSxPQUFRLElBQUssSUFBSyxJQUFLLElBQUssSUFBSyxJQUFLLEtBQU0sSUFDN0QsS0FBTSxLQUFNLE1BQU8sTUFBTyxJQUFLLElBQUssSUFBSyxJQUFLLElBQUssSUFBSyxJQUFLLElBQzdELEtBQU0sS0FBTSxLQUFNLEtBQU0sS0FBTSxLQUFNLEtBQU0sTUFDMUMsSUFBSyxJQUFLLElBQUssSUFBSyxJQUFLLElBQUssSUFBSyxJQUFLLElBQUssSUFBSyxJQUFLLEtBQU0sS0FDN0QsUUFBUyxNQUFPLE1BQU8sZUFBZ0IsUUFBUyxRQUNoRCxJQUFLLElBQUssTUFBTyxNQUFPLE9BQVEsUUFBUyxPQUFRLE1BQU8sWUFDeEQsT0FBUSxRQUFTLE1BQU8sS0FBTSxPQUFRLFlBQWEsTUFDbkQsSUFBSyxJQUFLLE1BQU8sTUFBTyxLQUFNLEtBQU0sT0FBUSxPQUM1QyxLQUFNLEtBQU0sU0FBVSxLQUFNLE1BQU8sSUFDbkMsUUFBUyxRQUFTLFFBQVMsU0FBVSxTQUFVLE1BQU8sTUFBTzs7QUFHakUsb0JBQVU7Ozs7SUFFTixJQUFJLElBQUksS0FBSyxNQUFNLE1BQU07SUFFekI7bUJBQ0ksSUFBSyxTQUFJLHFCQUFBLFFBQUE7O1FBQ1QsTUFBTSxLQUFLLEtBQUssRUFBRztZQUVoQixNQUFNOztZQUNMLE1BQU0sS0FBSzs7OztZQUVYLE1BQU0sS0FBSzs7O1dBRW5CLE1BQU0sS0FBSzs7O0FBRWYscUJBQVc7O2tCQUFPLCtCQUFrQyxPQUFPOztBQUUzRCxlQUNJLEtBQU0sS0FBTSxNQUFPLE9BQ25CLE1BQU8sVUFDUCxLQUFNLFFBQVMsV0FBWSxNQUFPLFdBQVksTUFBTyxRQUNyRCxTQUFVLFNBQ1YsU0FBVSxlQUNWIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/kode/test/fuzz.kode
