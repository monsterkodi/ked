var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var dumpstate

import mode from "../edit/mode.js"

import layout from "../popo/layout.js"


dumpstate = (function ()
{
    function dumpstate ()
    {}

    dumpstate["tags"] = function (state, file, focus)
    {
        var names, novim, tags, _11_41_, _15_54_

        tags = []
        if (!_k_.empty(focus))
        {
            tags.push(`focus: ${focus}`)
        }
        names = (((_11_41_=mode.active[state.name]) != null ? _11_41_ : [])).map(function (m)
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
        if (state.h.length > 1)
        {
            tags.push(`undo ${state.h.length - 1}`)
        }
        if (!_k_.empty(state.r))
        {
            tags.push(`redo ${state.r.length}`)
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

    dumpstate["ROWS"] = 10
    dumpstate["section"] = function (info, rows)
    {
        var atCursor, cursors, line, logs, out, ranges, rect, selected, state, tags, _48_28_, _51_24_, _61_25_

        state = info.state
        out = [`=== ${info.label}`]
        tags = this.tags(state,info.file,info.focus)
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
        if (rect = (info.cells != null ? info.cells.cellRect : undefined))
        {
            out.push(`    rect ${rect.x}:${rect.y} ${rect.w}x${rect.h}`)
        }
        if ((state.rectree != null))
        {
            selected = this.nodeText(state.rectree,info.selected)
            atCursor = this.nodeText(state.rectree,state.sheetNodeAtCursor())
            line = `    node ${selected}`
            if (atCursor !== selected)
            {
                line += ` · at cursor ${atCursor}`
            }
            out.push(line)
        }
        if (!_k_.empty(info.images))
        {
            out.push(`    images ${this.imageBoxes(info.images,info.names,info.cellh).join('  ')}`)
        }
        logs = ((_61_25_=info.logs) != null ? _61_25_ : [])
        if ((rows != null))
        {
            logs = logs.slice(_k_.max(0,logs.length - (rows - out.length)))
            if (out.length >= rows)
            {
                logs = []
            }
        }
        out = out.concat(logs.map(function (l)
        {
            return `    log ${l}`
        }))
        return out
    }

    dumpstate["nodeText"] = function (rectree, node)
    {
        var path, rect, text, _73_43_, _75_27_

        if (!(node != null))
        {
            return '-'
        }
        path = ((_73_43_=layout.pathOf(rectree,node)) != null ? _73_43_ : [])
        text = `${path.join('.')} ${layout.roleOf(node)}`
        if (rect = (node.rect != null ? node.rect.abs : undefined))
        {
            text += ` ${rect.x}:${rect.y} ${rect.w}x${rect.h}`
        }
        return text
    }

    dumpstate["imageBoxes"] = function (images, names, cellh)
    {
        var box, boxes, img, key, name, rows, _87_33_

        boxes = {}
        var list = _k_.list(images)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            img = list[_a_]
            name = ((_87_33_=(names != null ? names[img.i] : undefined)) != null ? _87_33_ : img.i)
            rows = 1
            if (_k_.in(name,['cursor','multi']) && cellh && img.h > cellh)
            {
                rows = Math.round(img.h / cellh)
            }
            key = `${name} ${rows}`
            if (box = boxes[key])
            {
                box.x1 = _k_.min(box.x1,img.x)
                box.y1 = _k_.min(box.y1,img.y)
                box.x2 = _k_.max(box.x2,img.x)
                box.y2 = _k_.max(box.y2,img.y)
                box.n += 1
            }
            else
            {
                boxes[key] = {name:name,x1:img.x,y1:img.y,x2:img.x,y2:img.y,n:1,rows:rows}
            }
        }
        return Object.values(boxes).map(function (b)
        {
            var s

            s = `${b.name} ${b.x1}:${b.y1}`
            if (b.x2 !== b.x1 || b.y2 !== b.y1)
            {
                s += `-${b.x2}:${b.y2}`
            }
            if (b.n > 1)
            {
                s += `×${b.n}`
            }
            if (b.rows > 1)
            {
                s += ` h${b.rows}`
            }
            return s
        })
    }

    return dumpstate
})()

export default dumpstate;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcHN0YXRlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2R1bXBzdGF0ZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2MsV0FBUDs7T0FDTyxhQUFQOzs7QUFDTixhQUFEOzs7OztJQUNJLFdBQUMsbUJBQU8sT0FBTSxNQUFLOzs7O1FBRWY7dUJBRXFDOztZQUFyQyxLQUFLLGVBQWU7O1FBRXBCLG1CQUFTLEtBQUssT0FBTyxNQUFNLGdDQUFZLGNBQUs7O21CQUFNLEVBQUU7V0FBTTt1QkFDWjs7WUFBOUMsS0FBSyxlQUFlLE1BQU0sS0FBSzs7UUFFL0IsUUFBUSxLQUFLLElBQUksTUFBTTtjQUNjLGdCQUFBLE1BQU87O1lBQTVDLEtBQUssa0JBQWtCLE1BQU07O1lBRVIsTUFBTTs7WUFBM0IsS0FBSyxLQUFLOztZQUM4QixNQUFNLEVBQUUsU0FBUzs7WUFBekQsS0FBSyxhQUFhLE1BQU0sRUFBRSxTQUFPOzt1QkFDVyxNQUFNOztZQUFsRCxLQUFLLGFBQWEsTUFBTSxFQUFFOzt1QkFDUzs7WUFBbkMsS0FBSyxjQUFjOztlQUVuQixLQUFLLGNBQUs7O3VCQUFZO1dBQVEsS0FBSzs7O0lBRXZDLFdBQUMsU0FBTTtJQUtQLFdBQUMsc0JBQVMsTUFBSzs7OztRQUVYLFFBQVEsS0FBSztRQUNiLGNBQWdCLEtBQUs7UUFDckIsT0FBUSxLQUFDLEtBQUssTUFBTSxLQUFLLEtBQUssS0FBSzt1QkFFSDs7WUFBaEMsSUFBSSxZQUFZOztRQUVoQixVQUFVLE1BQU0sRUFBRSxRQUFRLGNBQUs7O3NCQUFTLEVBQUUsTUFBTSxFQUFFOztZQUUvQyxRQUFRLFdBQVU7O1lBQ2pCLElBQUksbUJBQW1CLFFBQVE7Ozs7WUFFL0IsSUFBSSxvQkFBb0IsUUFBUSxLQUFLLGFBQVksTUFBTSxFQUFFOzt1QkFFcEQsTUFBTSxFQUFFOztZQUNiLFNBQVMsTUFBTSxFQUFFLFdBQVcsY0FBSzs7MEJBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTs7WUFDcEUsSUFBSSxtQkFBbUIsT0FBTyxLQUFLOztZQUVwQyxRQUFPLEtBQUssZ0JBQUwsS0FBSyxNQUFPOztZQUNsQixJQUFJLGlCQUFpQixLQUFLLEtBQUssS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFLOzthQUV6RCxNQUFNOztZQUNMLFdBQVcsS0FBQyxTQUFTLE1BQU0sUUFBUSxLQUFLO1lBQ3hDLFdBQVcsS0FBQyxTQUFTLE1BQU0sUUFBUSxNQUFNO1lBQ3pDLG1CQUFtQjtnQkFDbUIsYUFBWTs7Z0JBQWxELHdCQUF3Qjs7WUFDeEIsSUFBSSxLQUFLOzt1QkFFSixLQUFLOztZQUNWLElBQUksbUJBQW1CLEtBQUMsV0FBVyxLQUFLLE9BQU8sS0FBSyxNQUFNLEtBQUssT0FBTyxLQUFLOztRQUUvRSxpQkFBTyxLQUFLO2FBQ1Q7O1lBQ0MsT0FBTyxLQUFLLGNBQVUsRUFBRSxLQUFLLFVBQVUsT0FBTyxJQUFJO2dCQUNyQyxJQUFJLFVBQVU7O2dCQUEzQjs7O1FBQ0osTUFBTSxJQUFJLE9BQU8sS0FBSyxjQUFLOzs4QkFBaUI7O2VBRTVDOzs7SUFFSixXQUFDLHVCQUFVLFNBQVE7Ozs7Y0FFRjs7bUJBQVg7O1FBRUYsaUJBQU8sT0FBTyxPQUFPLFFBQVE7UUFDN0IsVUFBVSxLQUFLLEtBQUssUUFBUSxPQUFPLE9BQU87WUFDdkMsUUFBTyxLQUFLLGVBQUwsS0FBSyxLQUFNOztZQUNqQixZQUFZLEtBQUssS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFLLEtBQUs7O2VBQ25EOzs7SUFNSixXQUFDLHlCQUFZLFFBQU8sT0FBTTs7OztRQUV0Qjs0QkFDVzs7O1lBQVA7WUFDQSxrQkFBTyxnQkFBQSxNQUFPLElBQUkscUNBQUssSUFBSTtZQUMzQixPQUFPO3VCQUNKLE1BQVMsU0FBUyxhQUFhLFNBQVUsSUFBSSxJQUFJOztnQkFDaEQsa0JBQWEsSUFBSSxJQUFJOztZQUN6QixTQUFVLFFBQVE7Z0JBQ2YsTUFBTSxNQUFNOztnQkFDWCxJQUFJLGFBQVMsSUFBSSxHQUFHLElBQUk7Z0JBQ3hCLElBQUksYUFBUyxJQUFJLEdBQUcsSUFBSTtnQkFDeEIsSUFBSSxhQUFTLElBQUksR0FBRyxJQUFJO2dCQUN4QixJQUFJLGFBQVMsSUFBSSxHQUFHLElBQUk7Z0JBQ3hCLElBQUksS0FBSzs7OztnQkFFVCxNQUFNLFFBQU8sS0FBSyxLQUFLLEdBQUcsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLOzs7ZUFFNUUsT0FBTyxPQUFPLE9BQU8sY0FBSzs7OztZQUN0QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTtnQkFDQSxFQUFFLE9BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTSxFQUFFOztnQkFBckQsU0FBUyxFQUFFLE1BQU0sRUFBRTs7Z0JBQ0QsRUFBRSxJQUFJOztnQkFBeEIsU0FBUyxFQUFFOztnQkFDVyxFQUFFLE9BQU87O2dCQUEvQixVQUFVLEVBQUU7O21CQUNaOzs7O1dBdEdYOzs7ZUF3R00ifQ==
//# sourceURL=../../../kode/ked/util/dumpstate.kode
