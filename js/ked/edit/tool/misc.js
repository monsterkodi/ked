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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC90b29sL21pc2Mua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFhLFVBQUE7SUFBTTtJQUFNOztPQUNOLFdBQU47O09BQ00sV0FBQTs7O0FBRVYsUUFBVDs7Ozs7SUFxQkksTUFBQyx3Q0FBMkIsUUFBTyxNQUFLOzs7O1FBRXBDOzRCQUVTOzs7WUFBTDtnQkFFRyxFQUFFLFdBQVc7O29CQUNBLEVBQUUsV0FBVzs7b0JBQXpCOztvQkFDWSxFQUFFLFdBQVc7O29CQUF6Qjs7b0JBRVksV0FBVyxLQUFLLE9BQVcsRUFBRSxXQUFXOztvQkFBcEQ7O2dCQUVBLElBQUksS0FBSztvQkFDTixFQUFFLGNBQWMsRUFBRTs7d0JBRWQsRUFBRSxTQUFTLEVBQUUsU0FBVSxFQUFFOzt3QkFDeEIsTUFBTSxFQUFFLFNBQVMsR0FBRyxRQUFRO3dCQUU1QixTQUFTLEtBQUs7d0NBQ0osTUFBTSxLQUFLLE1BQU07OzRCQUN2QixNQUFNLFVBQUksR0FBRyxJQUFJLEdBQUcsUUFBTSxJQUFJLEdBQUcsS0FBSztnQ0FDbkMsUUFBTzs7Z0NBRU4sU0FBUyxLQUFLOzs7OzZCQUNsQixFQUFFOzt3QkFDTixNQUFNLEVBQUUsV0FBVyxHQUFHLFFBQVE7d0JBRTlCLFNBQVMsS0FBSzs7Ozs7b0JBSWxCOztvQkFFRCxLQUFLLEVBQUUsUUFBUTs7b0JBQ2QsSUFBSSxRQUFFLFVBQUksRUFBRSxRQUFRLHFCQUFWLEVBQUUsUUFBUTs7Z0NBRWQsTUFBTSxLQUFLLE1BQU07O29CQUN2QixNQUFNLElBQUksR0FBRyxRQUFNLElBQUksR0FBRyxLQUFLO3dCQUM1QixNQUFNLEVBQUUsU0FBTzs7NEJBQ1gsTUFBTSxPQUFPOzs0QkFDWixNQUFNLFFBQUUsVUFBRyxtQkFBQTs0QkFDWCxJQUFJLEtBQUs7aUNBQ0YsRUFBRSxjQUFjLEVBQUU7O2dDQUVyQixTQUFTLEtBQUs7Z0NBQ2Q7Ozs7Z0NBRUEsV0FBVzs7OzZCQUNaOzs0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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/tool/misc.kode
