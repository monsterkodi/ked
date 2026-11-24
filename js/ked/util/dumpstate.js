var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var dumpstate

import mode from "../edit/mode.js"

import sue from "../edit/tool/sue.js"

import layout from "../popo/layout.js"


dumpstate = (function ()
{
    function dumpstate ()
    {}

    dumpstate["tags"] = function (state, file, focus)
    {
        var area, names, novim, tags, wrap, _12_41_, _16_54_, _24_21_, _27_37_, _29_38_

        tags = []
        if (!_k_.empty(focus))
        {
            tags.push(`focus: ${focus}`)
        }
        names = (((_12_41_=mode.active[state.name]) != null ? _12_41_ : [])).map(function (m)
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
        wrap = []
        if ((state.wrap != null ? state.wrap.all : undefined))
        {
            wrap.push('all')
        }
        else
        {
            var list = _k_.list((((_27_37_=state.s.sue) != null ? _27_37_ : [])))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                area = list[_a_]
                if (area.value[0] === sue.WRAP)
                {
                    wrap.push(area.y)
                }
            }
        }
        if ((state.wrap != null ? state.wrap.word : undefined))
        {
            wrap.push('word')
        }
        if (!_k_.empty(wrap))
        {
            tags.push(`wrap: ${wrap.join(' ')}`)
        }
        return tags.map(function (tag)
        {
            return `[${tag}]`
        }).join(' ')
    }

    dumpstate["ROWS"] = 10
    dumpstate["section"] = function (info, rows)
    {
        var atCursor, cursors, line, logs, out, ranges, rect, selected, state, tags, _58_28_, _61_24_, _71_25_

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
        logs = ((_71_25_=info.logs) != null ? _71_25_ : [])
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
        var path, rect, text, _83_43_, _85_27_

        if (!(node != null))
        {
            return '-'
        }
        path = ((_83_43_=layout.pathOf(rectree,node)) != null ? _83_43_ : [])
        text = `${path.join('.')} ${layout.roleOf(node)}`
        if (rect = (node.rect != null ? node.rect.abs : undefined))
        {
            text += ` ${rect.x}:${rect.y} ${rect.w}x${rect.h}`
        }
        return text
    }

    dumpstate["imageBoxes"] = function (images, names, cellh)
    {
        var box, boxes, img, key, name, rows, _97_33_

        boxes = {}
        var list = _k_.list(images)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            img = list[_a_]
            name = ((_97_33_=(names != null ? names[img.i] : undefined)) != null ? _97_33_ : img.i)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcHN0YXRlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2R1bXBzdGF0ZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2MsV0FBUDs7T0FDWSxVQUFQOztPQUNFLGFBQVA7OztBQUNOLGFBQUQ7Ozs7O0lBQ0ksV0FBQyxtQkFBTyxPQUFNLE1BQUs7Ozs7UUFFZjt1QkFFcUM7O1lBQXJDLEtBQUssZUFBZTs7UUFFcEIsbUJBQVMsS0FBSyxPQUFPLE1BQU0sZ0NBQVksY0FBSzs7bUJBQU0sRUFBRTtXQUFNO3VCQUNaOztZQUE5QyxLQUFLLGVBQWUsTUFBTSxLQUFLOztRQUUvQixRQUFRLEtBQUssSUFBSSxNQUFNO2NBQ2MsZ0JBQUEsTUFBTzs7WUFBNUMsS0FBSyxrQkFBa0IsTUFBTTs7WUFFUixNQUFNOztZQUEzQixLQUFLLEtBQUs7O1lBQzhCLE1BQU0sRUFBRSxTQUFTOztZQUF6RCxLQUFLLGFBQWEsTUFBTSxFQUFFLFNBQU87O3VCQUNXLE1BQU07O1lBQWxELEtBQUssYUFBYSxNQUFNLEVBQUU7O3VCQUNTOztZQUFuQyxLQUFLLGNBQWM7O1FBRW5CO2FBQ0csTUFBTSxlQUFOLE1BQU0sS0FBTTs7WUFDWCxLQUFLLEtBQUs7Ozs7MkNBRUcsTUFBTSxFQUFFOzs7Z0JBQWpCO29CQUNvQixLQUFLLE1BQU0sT0FBTSxJQUFJOztvQkFBekMsS0FBSyxLQUFLLEtBQUs7Ozs7YUFDSCxNQUFNLGVBQU4sTUFBTSxLQUFNOztZQUFoQyxLQUFLLEtBQUs7O3VCQUNrQzs7WUFBNUMsS0FBSyxjQUFjLEtBQUssS0FBSzs7ZUFFN0IsS0FBSyxjQUFLOzt1QkFBWTtXQUFRLEtBQUs7OztJQUV2QyxXQUFDLFNBQU07SUFLUCxXQUFDLHNCQUFTLE1BQUs7Ozs7UUFFWCxRQUFRLEtBQUs7UUFDYixjQUFnQixLQUFLO1FBQ3JCLE9BQVEsS0FBQyxLQUFLLE1BQU0sS0FBSyxLQUFLLEtBQUs7dUJBRUg7O1lBQWhDLElBQUksWUFBWTs7UUFFaEIsVUFBVSxN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
//# sourceURL=../../../kode/ked/util/dumpstate.kode
