var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var dumpstate

import mode from "../edit/mode.js"


dumpstate = (function ()
{
    function dumpstate ()
    {}

    dumpstate["tags"] = function (state, file)
    {
        var names, novim, tags, _12_54_, _8_41_

        tags = []
        names = (((_8_41_=mode.active[state.name]) != null ? _8_41_ : [])).map(function (m)
        {
            return m.name
        }).sort()
        if (!_k_.empty(names))
        {
            tags.push(`modes: ${names.join(' ')}`)
        }
        novim = mode.get(state,'novim')
        if (((novim != null ? novim.ex : undefined) != null))
        {
            tags.push(`pending: :${novim.ex}`)
        }
        if (state.isDirty())
        {
            tags.push('dirty')
        }
        if (!_k_.empty(file))
        {
            tags.push(`file: ${file}`)
        }
        return tags.map(function (tag)
        {
            return `[${tag}]`
        }).join(' ')
    }

    dumpstate["ROWS"] = 6
    dumpstate["section"] = function (label, state, cells, file, images)
    {
        var cursors, out, ranges, rect, tags

        out = [`=== ${label}`]
        tags = this.tags(state,file)
        if (!_k_.empty(tags))
        {
            out.push(`    ${tags}`)
        }
        cursors = state.s.cursors.map(function (c)
        {
            return `${c[0]}:${c[1]}`
        })
        if (cursors.length === 1)
        {
            out.push(`    cursor ${cursors[0]}`)
        }
        else
        {
            out.push(`    cursors ${cursors.join(' ')} main ${state.s.main}`)
        }
        if (!_k_.empty(state.s.selections))
        {
            ranges = state.s.selections.map(function (r)
            {
                return `${r[0]}:${r[1]}-${r[2]}:${r[3]}`
            })
            out.push(`    select ${ranges.join(' ')}`)
        }
        if (rect = (cells != null ? cells.cellRect : undefined))
        {
            out.push(`    rect ${rect.x}:${rect.y} ${rect.w}x${rect.h}`)
        }
        if (!_k_.empty(images))
        {
            out.push(`    images ${this.imageBoxes(images).join(' ')}`)
        }
        return out
    }

    dumpstate["imageBoxes"] = function (images)
    {
        var box, boxes, img

        boxes = {}
        var list = _k_.list(images)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            img = list[_a_]
            if (box = boxes[img.i])
            {
                box.x1 = _k_.min(box.x1,img.x)
                box.y1 = _k_.min(box.y1,img.y)
                box.x2 = _k_.max(box.x2,img.x)
                box.y2 = _k_.max(box.y2,img.y)
                box.n += 1
            }
            else
            {
                boxes[img.i] = {x1:img.x,y1:img.y,x2:img.x,y2:img.y,n:1}
            }
        }
        return Object.values(boxes).map(function (b)
        {
            var s

            s = `${b.x1}:${b.y1}`
            if (b.x2 !== b.x1 || b.y2 !== b.y1)
            {
                s += `-${b.x2}:${b.y2}`
            }
            if (b.n > 1)
            {
                s += `×${b.n}`
            }
            return s
        })
    }

    return dumpstate
})()

export default dumpstate;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcHN0YXRlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2R1bXBzdGF0ZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2MsV0FBUDs7O0FBQ04sYUFBRDs7Ozs7SUFDSSxXQUFDLG1CQUFPLE9BQU07Ozs7UUFFVjtRQUVBLGtCQUFTLEtBQUssT0FBTyxNQUFNLCtCQUFZLGNBQUs7O21CQUFNLEVBQUU7V0FBTTt1QkFDWjs7WUFBOUMsS0FBSyxlQUFlLE1BQU0sS0FBSzs7UUFFL0IsUUFBUSxLQUFLLElBQUksTUFBTTtjQUNjLGdCQUFBLE1BQU87O1lBQTVDLEtBQUssa0JBQWtCLE1BQU07O1lBRVIsTUFBTTs7WUFBM0IsS0FBSyxLQUFLOzt1QkFDeUI7O1lBQW5DLEtBQUssY0FBYzs7ZUFFbkIsS0FBSyxjQUFLOzt1QkFBWTtXQUFRLEtBQUs7OztJQUV2QyxXQUFDLFNBQU07SUFFUCxXQUFDLHNCQUFVLE9BQU0sT0FBTSxPQUFNLE1BQUs7Ozs7UUFFOUIsY0FBZTtRQUNmLE9BQU8sS0FBQyxLQUFLLE1BQU07dUJBRWE7O1lBQWhDLElBQUksWUFBWTs7UUFFaEIsVUFBVSxNQUFNLEVBQUUsUUFBUSxjQUFLOztzQkFBUyxFQUFFLE1BQU0sRUFBRTs7WUFFL0MsUUFBUSxXQUFVOztZQUNqQixJQUFJLG1CQUFtQixRQUFROzs7O1lBRS9CLElBQUksb0JBQW9CLFFBQVEsS0FBSyxhQUFZLE1BQU0sRUFBRTs7dUJBRXBELE1BQU0sRUFBRTs7WUFDYixTQUFTLE1BQU0sRUFBRSxXQUFXLGNBQUs7OzBCQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7O1lBQ3BFLElBQUksbUJBQW1CLE9BQU8sS0FBSzs7WUFFcEMsUUFBTyxnQkFBQSxNQUFPOztZQUNiLElBQUksaUJBQWlCLEtBQUssS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFLLEtBQUs7O3VCQUVuRDs7WUFDTCxJQUFJLG1CQUFtQixLQUFDLFdBQVcsUUFBUSxLQUFLOztlQUVwRDs7O0lBSUosV0FBQyx5QkFBWTs7OztRQUVUOzRCQUNXOzs7WUFBUDtnQkFDRyxNQUFNLE1BQU0sSUFBSTs7Z0JBQ2YsSUFBSSxhQUFTLElBQUksR0FBRyxJQUFJO2dCQUN4QixJQUFJLGFBQVMsSUFBSSxHQUFHLElBQUk7Z0JBQ3hCLElBQUksYUFBUyxJQUFJLEdBQUcsSUFBSTtnQkFDeEIsSUFBSSxhQUFTLElBQUksR0FBRyxJQUFJO2dCQUN4QixJQUFJLEtBQUs7Ozs7Z0JBRVQsTUFBTSxJQUFJLE1BQUssR0FBRyxJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsR0FBRyxJQUFJLEVBQUUsRUFBRTs7O2VBRTdELE9BQU8sT0FBTyxPQUFPLGNBQUs7Ozs7WUFDdEIsT0FBTyxFQUFFLE1BQU0sRUFBRTtnQkFDVSxFQUFFLE9BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTSxFQUFFOztnQkFBckQsU0FBUyxFQUFFLE1BQU0sRUFBRTs7Z0JBQ0QsRUFBRSxJQUFJOztnQkFBeEIsU0FBUyxFQUFFOzttQkFDWDs7OztXQS9EWDs7O2VBaUVNIn0=
//# sourceURL=../../../kode/ked/util/dumpstate.kode
