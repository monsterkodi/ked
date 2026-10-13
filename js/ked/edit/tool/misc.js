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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL21pc2Mua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQW1DUTs0QkFFUzs7OztnQkFFRixFQUFFLFdBQVc7O29CQUNBLEVBQUUsV0FBVzs7b0JBQXpCOztvQkFDWSxFQUFFLFdBQVc7O29CQUF6Qjs7b0JBRVksV0FBVyxLQUFLLE9BQVcsRUFBRSxXQUFXOztvQkFBcEQ7O2dCQUVBLElBQUksS0FBSztvQkFDTixFQUFFLGNBQWMsRUFBRTs7d0JBRWQsRUFBRSxTQUFTLEVBQUUsU0FBVSxFQUFFOzt3QkFDeEIsTUFBTSxFQUFFLFNBQVMsR0FBRyxRQUFRO3dCQUU1QixTQUFTLEtBQUs7d0NBQ0osTUFBTSxLQUFLLE1BQU07OzRCQUN2QixNQUFNLFVBQUksR0FBRyxJQUFJLEdBQUcsUUFBTSxJQUFJLEdBQUcsS0FBSztnQ0FDbkMsUUFBTzs7Z0NBRU4sU0FBUyxLQUFLOzs7OzZCQUNsQixFQUFFOzt3QkFDTixNQUFNLEVBQUUsV0FBVyxHQUFHLFFBQVE7d0JBRTlCLFNBQVMsS0FBSzs7Ozs7b0JBSWxCOztvQkFFRCxLQUFLLEVBQUUsUUFBUTs7b0JBQ2QsSUFBSSxRQUFFLFVBQUksRUFBRSxRQUFRLHFCQUFWLEVBQUUsUUFBUTs7Z0NBRWQsTUFBTSxLQUFLLE1BQU07O29CQUN2QixNQUFNLElBQUksR0FBRyxRQUFNLElBQUksR0FBRyxLQUFLO3dCQUM1QixNQUFNLEVBQUUsU0FBTzs7NEJBQ1gsTUFBTSxPQUFPOzs0QkFDWixNQUFNLFFBQUUsVUFBRyxtQkFBQTs0QkFDWCxJQUFJLEtBQUs7aUNBQ0YsRUFBRSxjQUFjLEVBQUU7O2dDQUVyQixTQUFTLEtBQUs7Z0NBQ2Q7Ozs7Z0NBRUEsV0FBVzs7OzZCQUNaOzs0QkFFSDs7OztnQkFJWixTQUFTLEtBQUs7Z0JBQ2Q7O1lBRUosTUFBTSxLQUFLLE1BQU07aUNBQ0Q7Ozs7b0JBQ1QsS0FBSyxLQUFLLFdBQVc7O29CQUVwQixTQUFTLEtBQUssS0FBSzt3QkFFaEIsUUFBTyxJQUFJLFNBQU8sS0FBTSxLQUFLLFFBQU0sS0FBSyxLQUFLLFNBQVMsRUFBRSxTQUFPOzt3QkFDOUQsTUFBTSxRQUFFLEtBQUs7d0JBQ2IsSUFBSSxLQUFLOzhCQUNELEVBQUUsY0FBYyxFQUFFOzs0QkFFdEIsU0FBUyxLQUFLOzs7O3lCQUVsQixLQUFLLFdBQVUsS0FBTSxTQUFRLEVBQUUsS0FBSyxRQUFNOzt3QkFDM0MsU0FBUTs7d0JBRVAsU0FBUyxLQUFLLG9CQUFXLEtBQUs7Ozs7O3dCQUUvQixRQUFRLEtBQUssV0FBWSxNQUFNLEtBQUssS0FBSzs7NEJBQ3JDLEVBQUUsV0FBVzs7NEJBRVosU0FBUyxLQUFLLG9CQUFXLEtBQUs7Ozs4QkFHMUIsUUFBUSxLQUFLLFlBQWdCLE1BQU0sS0FBSyxLQUFLOzt3QkFFckQsU0FBUyxLQUFLLG9CQUFXLEtBQUs7Ozs7O1FBRTlDLFFBQVEsTUFBTSxLQUFLO3NCQUVKOzs7O1FBRWY7UUFFQTs7OztnQkFFVSxLQUFLLElBQUksT0FBTTs7OztZQUVyQixLQUFLLEtBQUssTUFBTTtZQUNoQixLQUFLLEdBQUc7O3VCQUFjLEVBQUUsUUFBTSxFQUFFLEtBQUssU0FBUyxLQUFLOzsyQkFFMUMsR0FBRzs7b0JBQ0wsR0FBRyxHQUFHLFVBQVMsTUFBTSxTQUFRLEdBQUcsR0FBRyxRQUFOLEdBQUcsR0FBRyxTQUFRLE1BQU0sR0FBRyxHQUFHLEtBQUssV0FBVzs7b0JBQ3RFLE1BQU0sS0FBSyxHQUFHLEdBQUc7OzttQkFNekIsTUFBTSxLQUFLOzs2QkFFSCxLQUFLLE1BQU07Ozs7WUFFbkIsS0FBSyxLQUFLLGNBQWM7Z0JBRXJCLE9BQU0sS0FBSyxPQUFNLEtBQU0sS0FBSyxPQUFNOztnQkFDakMsS0FBSzs7OztnQkFFTCxNQUFNLEtBQUssSUFBSSxXQUFLLEtBQUssU0FBTzsyQkFDN0IsSUFBTyxpQkFBUyxpQkFBVyxtQkFBVSxvQkFBZTs7b0JBQ25ELEtBQUs7Ozs7b0JBRUwsYUFBYSxXQUFLLEdBQUksS0FBSyxTQUFPO21DQUN6Qjs7d0JBQ0wsS0FBSyxXQUFLLEdBQUksS0FBSyxTQUFPOzs7OztRQUUxQyxPQUFPLE1BQU0sSUFBSSxLQUFLO1FBQ3RCLEtBQUs7ZUFDTCxNQUFNLEtBQUs7Ozs7Ozs7UUFVWCxVQUFVLEtBQUssS0FBSztlQUNwQixRQUFRLE9BQU07Ozs7Ozs7Z0JBSVA7O2lCQUNIO2lCQUFPO2dCQUFVLEtBQUs7O2lCQUN0QjtpQkFBTztnQkFBVSxLQUFLOzs7O2dCQUVuQjs7aUJBQ0g7aUJBQU87Z0JBQVUsUUFBUztnQkFBWTs7MkJBQWUsSUFBSTs7O2lCQUN6RDtpQkFBUTtnQkFBUyxRQUFRO2dCQUFhOzsyQkFBZSxJQUFJOzs7Ozs0QkFFOUM7Ozs7Z0JBQ1IsSUFBSSxNQUFNLElBQUk7O2dCQUNiLFFBQVEsSUFBSTtnQkFDWixNQUFROzs7dUJBRVAscUJBQWdCLEtBQUs7O2dCQUN2QixLQUFLLEtBQUssUUFBTyxLQUFLLE9BQU87O3VCQUN6Qjs7O2VBRVg7Ozs7OztlQUVEIn0=
//# sourceURL=file://kode/ked/edit/tool/misc.kode
