var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var misc

import kxk from "../../../kxk.js"
let kutil = kxk.kutil
let kseg = kxk.kseg

import pepe from "../../../kxk/pepe.js"

import belt from "./belt.js"


misc = (function ()
{
    function misc ()
    {}

    misc["prepareWordsForCompletion"] = function (before, turd, words)
    {
        var balanced, beforeTurd, end, filtered, fix, fst, idx, lst, p, push, rwd, segl, segls, strs, subw, tc, w, wds

        filtered = []
        var list = _k_.list(words)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            w = list[_a_]
            if (w.startsWith(turd))
            {
                if (w.startsWith('..'))
                {
                    continue
                }
                if (w.startsWith('./'))
                {
                    continue
                }
                if (/\d+\.\d+/.test(w) && !w.startsWith(before))
                {
                    continue
                }
                p = pepe(w)
                if (p.unbalanced || p.mismatch)
                {
                    if (w.endsWith(p.tail) && p.mismatch)
                    {
                        fix = p.mismatch[0].content[0]
                        filtered.push(fix)
                        if (!_k_.empty((wds = kseg.words(fix))))
                        {
                            fst = fix.slice(0, wds[0].index + wds[0].word.length)
                            if (fst !== fix)
                            {
                                filtered.push(fst)
                            }
                        }
                    }
                    else if (p.unbalanced)
                    {
                        fix = p.unbalanced[0].content[0]
                        filtered.push(fix)
                    }
                    else
                    {
                    }
                    continue
                }
                if (0 <= w.indexOf('\n'))
                {
                    w = w.slice(0, typeof w.indexOf('\n') === 'number' ? w.indexOf('\n') : -1)
                }
                if (!_k_.empty((wds = kseg.words(w))))
                {
                    lst = wds[0].index + wds[0].word.length
                    if (lst < w.length - 1)
                    {
                        if (lst > before.length)
                        {
                            fst = w.slice(0, typeof lst === 'number' ? lst+1 : Infinity)
                            p = pepe(fst)
                            if (!p.unbalanced || p.mismatch)
                            {
                                filtered.push(fst)
                                continue
                            }
                            else
                            {
                                balanced = true
                            }
                        }
                        if (!balanced)
                        {
                            continue
                        }
                    }
                }
                filtered.push(w)
                continue
            }
            wds = kseg.words(w)
            var list1 = _k_.list(wds)
            for (idx = 0; idx < list1.length; idx++)
            {
                subw = list1[idx]
                if (subw.word.startsWith(turd))
                {
                    filtered.push(subw.word)
                    if (idx === wds.length - 1 && subw.index + subw.word.length < w.length - 1)
                    {
                        rwd = w.slice(subw.index)
                        p = pepe(rwd)
                        if (!(p.unbalanced || p.mismatch))
                        {
                            filtered.push(rwd)
                        }
                    }
                }
                else if (turd.length === 1 && turd === w[subw.index - 1])
                {
                    if (turd !== '.')
                    {
                        filtered.push(turd.slice(-1)[0] + subw.word)
                    }
                    else
                    {
                    }
                    if (/\d+\./.test(before) && /\d+/.test(subw.word))
                    {
                        if (w.startsWith(before))
                        {
                            filtered.push(turd.slice(-1)[0] + subw.word)
                        }
                    }
                    else if (!/\d+\./.test(before) && !/\d+/.test(subw.word))
                    {
                        filtered.push(turd.slice(-1)[0] + subw.word)
                    }
                }
            }
        }
        words = kutil.uniq(filtered)
        if (_k_.empty(words))
        {
            return []
        }
        segls = []
        push = function (s)
        {
            var ws

            if (kseg.str(s) === turd)
            {
                return
            }
            ws = kseg.words(s)
            ws = ws.filter(function (w)
            {
                return w.index + w.segl.length > turd.length
            })
            if (!_k_.empty(ws[0]))
            {
                if (ws[0].index === 0 && (turd !== ws[0].word && ws[0].word !== s) && ws[0].word.startsWith(turd))
                {
                    segls.push(ws[0].segl)
                }
            }
            return segls.push(s)
        }
        var list2 = _k_.list(kseg.segls(words))
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            segl = list2[_c_]
            tc = kseg.tailCountTurd(segl)
            if (tc === 0 || tc === 1 && segl[0] === segl.slice(-1)[0])
            {
                push(segl)
            }
            else
            {
                end = kseg.str(segl.slice(segl.length - tc))
                if (_k_.in(end,'])}') || _k_.in(end.slice(-1)[0],')]}') && !(_k_.in(end.slice(-2,-1)[0],',')))
                {
                    push(segl)
                }
                else
                {
                    beforeTurd = segl.slice(0, segl.length - tc)
                    if (!_k_.empty(beforeTurd))
                    {
                        push(segl.slice(0, segl.length - tc))
                    }
                }
            }
        }
        strs = segls.map(kseg.str)
        strs.sort()
        return kutil.uniq(strs)
    }

    misc["isCommentLine"] = function (line)
    {
        var trimmed

        trimmed = kseg.trim(line)
        return trimmed[0] === "#"
    }

    misc["indexOfExtremePositionInDirection"] = function (posl, dir, index)
    {
        var ci, cmp, exi, idx, pos, start

        switch (dir)
        {
            case 'left':
            case 'right':
                ci = 0
                break
            case 'up':
            case 'down':
                ci = 1
                break
        }

        switch (dir)
        {
            case 'left':
            case 'up':
                start = Infinity
                cmp = function (a, b)
                {
                    return a > b
                }
                break
            case 'right':
            case 'down':
                start = -Infinity
                cmp = function (a, b)
                {
                    return a < b
                }
                break
        }

        var list = _k_.list(posl)
        for (idx = 0; idx < list.length; idx++)
        {
            pos = list[idx]
            if (cmp(start,pos[ci]))
            {
                start = pos[ci]
                exi = idx
            }
        }
        if (!_k_.empty(index) && !_k_.empty(posl[index]))
        {
            if (posl[exi][ci] === posl[index][ci])
            {
                return index
            }
        }
        return exi
    }

    return misc
})()

export default misc;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL21pc2Mua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQVlTLFFBQVQ7Ozs7O1VBcUJJLHdDQUE0QixRQUFPLE1BQUs7Ozs7UUFFcEM7NEJBRVM7OztZQUFMO2dCQUVHLEVBQUUsV0FBVzs7b0JBQ0EsRUFBRSxXQUFXOztvQkFBekI7O29CQUNZLEVBQUUsV0FBVzs7b0JBQXpCOztvQkFFWSxXQUFXLEtBQUssT0FBVyxFQUFFLFdBQVc7O29CQUFwRDs7Z0JBRUEsSUFBSSxLQUFLO29CQUNOLEVBQUUsY0FBYyxFQUFFOzt3QkFFZCxFQUFFLFNBQVMsRUFBRSxTQUFVLEVBQUU7O3dCQUN4QixNQUFNLEVBQUUsU0FBUyxHQUFHLFFBQVE7d0JBRTVCLFNBQVMsS0FBSzt3Q0FDSixNQUFNLEtBQUssTUFBTTs7NEJBQ3ZCLE1BQU0sVUFBSSxHQUFHLElBQUksR0FBRyxRQUFNLElBQUksR0FBRyxLQUFLO2dDQUNuQyxRQUFPOztnQ0FFTixTQUFTLEtBQUs7Ozs7NkJBQ2xCLEVBQUU7O3dCQUNOLE1BQU0sRUFBRSxXQUFXLEdBQUcsUUFBUTt3QkFFOUIsU0FBUyxLQUFLOzs7OztvQkFJbEI7O29CQUVELEtBQUssRUFBRSxRQUFROztvQkFDZCxJQUFJLFFBQUUsVUFBSSxFQUFFLFFBQVEscUJBQVYsRUFBRSxRQUFROztnQ0FFZCxNQUFNLEtBQUssTUFBTTs7b0JBQ3ZCLE1BQU0sSUFBSSxHQUFHLFFBQU0sSUFBSSxHQUFHLEtBQUs7d0JBQzVCLE1BQU0sRUFBRSxTQUFPOzs0QkFDWCxNQUFNLE9BQU87OzRCQUNaLE1BQU0sUUFBRSxVQUFHLG1CQUFBOzRCQUNYLElBQUksS0FBSztpQ0FDRixFQUFFLGNBQWMsRUFBRTs7Z0NBRXJCLFNBQVMsS0FBSztnQ0FDZDs7OztnQ0FFQSxXQUFXOzs7NkJBQ1o7OzRCQUVIOzs7O2dCQUlaLFNBQVMsS0FBSztnQkFDZDs7WUFFSixNQUFNLEtBQUssTUFBTTtpQ0FDRDs7O2dCQUFaO29CQUNHLEtBQUssS0FBSyxXQUFXOztvQkFFcEIsU0FBUyxLQUFLLEtBQUs7d0JBRWhCLFFBQU8sSUFBSSxTQUFPLEtBQU0sS0FBSyxRQUFNLEtBQUssS0FBSyxTQUFTLEVBQUUsU0FBTzs7d0JBQzlELE1BQU0sUUFBRSxLQUFLO3dCQUNiLElBQUksS0FBSzs4QkFDRCxFQUFFLGNBQWMsRUFBRTs7NEJBRXRCLFNBQVMsS0FBSzs7Ozt5QkFFbEIsS0FBSyxXQUFVLEtBQU0sU0FBUSxFQUFFLEtBQUssUUFBTTs7d0JBQzNDLFNBQVE7O3dCQUVQLFNBQVMsS0FBSyxvQkFBVyxLQUFLOzs7Ozt3QkFFL0IsUUFBUSxLQUFLLFdBQVksTUFBTSxLQUFLLEtBQUs7OzRCQUNyQyxFQUFFLFdBQVc7OzRCQUVaLFNBQVMsS0FBSyxvQkFBVyxLQUFLOzs7OEJBRzFCLFFBQVEsS0FBSyxZQUFnQixNQUFNLEtBQUssS0FBSzs7d0JBRXJELFNBQVMsS0FBSyxvQkFBVyxLQUFLOzs7OztRQUU5QyxRQUFRLE1BQU0sS0FBSztzQkFFSjs7OztRQUVmO1FBRUEsaUJBQU87Ozs7Z0JBRUcsS0FBSyxJQUFJLE9BQU07Ozs7WUFFckIsS0FBSyxLQUFLLE1BQU07WUFDaEIsS0FBSyxHQUFHLGlCQUFROzt1QkFBTSxFQUFFLFFBQU0sRUFBRSxLQUFLLFNBQVMsS0FBSzs7MkJBRTFDLEdBQUc7O29CQUNMLEdBQUcsR0FBRyxVQUFTLE1BQU0sU0FBUSxHQUFHLEdBQUcsUUFBTixHQUFHLEdBQUcsU0FBUSxNQUFNLEdBQUcsR0FBRyxLQUFLLFdBQVc7O29CQUN0RSxNQUFNLEtBQUssR0FBRyxHQUFHOzs7bUJBTXpCLE1BQU0sS0FBSzs7NkJBRUgsS0FBSyxNQUFNOzs7WUFBbkI7WUFFQSxLQUFLLEtBQUssY0FBYztnQkFFckIsT0FBTSxLQUFLLE9BQU0sS0FBTSxLQUFLLE9BQU07O2dCQUNqQyxLQUFLOzs7O2dCQUVMLE1BQU0sS0FBSyxJQUFJLFdBQUssS0FBSyxTQUFPOzJCQUM3QixJQUFPLGlCQUFTLGlCQUFXLG1CQUFVLG9CQUFlOztvQkFDbkQsS0FBSzs7OztvQkFFTCxhQUFhLFdBQUssR0FBSSxLQUFLLFNBQU87bUNBQ3pCOzt3QkFDTCxLQUFLLFdBQUssR0FBSSxLQUFLLFNBQU87Ozs7O1FBRTFDLE9BQU8sTUFBTSxJQUFJLEtBQUs7UUFDdEIsS0FBSztlQUNMLE1BQU0sS0FBSzs7O1VBUWYsNEJBQWdCOzs7O1FBRVosVUFBVSxLQUFLLEtBQUs7ZUFDcEIsUUFBUSxPQUFNOzs7VUFFbEIsZ0RBQW9DLE1BQUssS0FBSTs7OztnQkFFbEM7O2lCQUNIO2lCQUFPO2dCQUFVLEtBQUs7O2lCQUN0QjtpQkFBTztnQkFBVSxLQUFLOzs7O2dCQUVuQjs7aUJBQ0g7aUJBQU87Z0JBQVUsUUFBUztnQkFBWSxnQkFBTyxHQUFFOzsyQkFBTSxJQUFJOzs7aUJBQ3pEO2lCQUFRO2dCQUFTLFFBQVE7Z0JBQWEsZ0JBQU8sR0FBRTs7MkJBQU0sSUFBSTs7Ozs7NEJBRTlDOzs7WUFBWDtnQkFDRyxJQUFJLE1BQU0sSUFBSTs7Z0JBQ2IsUUFBUSxJQUFJO2dCQUNaLE1BQVE7Ozt1QkFFUCxxQkFBZ0IsS0FBSzs7Z0JBQ3ZCLEtBQUssS0FBSyxRQUFPLEtBQUssT0FBTzs7dUJBQ3pCOzs7ZUFFWDs7O1dBbExDOzs7ZUFvTEYifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/misc.kode
