var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var projector

import fill from "./fill.js"

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import sue from "../edit/tool/sue.js"

import state from "../edit/state.js"


projector = (function ()
{
    function projector ()
    {}

    projector["attach"] = function (node)
    {
        var child, _17_20_, _18_27_, _20_35_

        if (!(node != null))
        {
            return node
        }
        if ((node.text != null))
        {
            ;(node.regions != null) ? this.spans(node) : this.stateOf(node)
        }
        var list = ((_20_35_=node.children) != null ? _20_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.attach(child)
        }
        return node
    }

    projector["stateOf"] = function (node)
    {
        var name, st, _30_25_, _32_29_, _35_33_, _43_21_, _49_40_

        if (!(node.state != null))
        {
            if ((node.stateName != null))
            {
                name = node.stateName.slice(0, -6)
            }
            else
            {
                this.count = (((_35_33_=this.count) != null ? _35_33_ : 0)) + 1
                name = `popo_node_${this.count}`
            }
            st = new state({cols:0,rows:0},name)
            st.wrap = {all:true,word:true}
            st.scaling = false
            st.syntax.setExt(this.extOf(node))
            if ((node.s != null))
            {
                st.s = node.s
                st.segls = node.s.lines.slice()
                st.syntax.setSegls(node.s.lines)
                st.clearHistory()
            }
            else
            {
                st.loadLines(((_49_40_=node.lines) != null ? _49_40_ : ['']))
            }
            delete node.s
            delete node.stateName
            delete node.lines
            node.state = st
        }
        st = node.state
        if (st.syntax.ext !== this.extOf(node))
        {
            st.syntax.setExt(this.extOf(node))
            st.syntax.setSegls(st.s.lines)
        }
        return st
    }

    projector["extOf"] = function (node)
    {
        return ((!_k_.empty((node.text)) && _k_.isStr(node.text)) ? node.text : 'md')
    }

    projector["linesOf"] = function (node)
    {
        return this.stateOf(node).s.lines.map(function (l)
        {
            return kseg.str(l)
        })
    }

    projector["textOf"] = function (node)
    {
        return this.linesOf(node).join('\n')
    }

    projector["scaleOf"] = function (node)
    {
        var _71_43_

        return _k_.max(1,parseInt(((_71_43_=node.scale) != null ? _71_43_ : 1)))
    }

    projector["spans"] = function (node)
    {
        var scale, spans, st, widths

        scale = this.scaleOf(node)
        spans = fill.bands(node,node.regions,node.rect.abs)
        widths = spans.map(function (span)
        {
            return Math.floor((span[2] - span[1]) / scale)
        })
        st = this.stateOf(node)
        if (!(_k_.eql(widths, st.rowWidths)))
        {
            st.setRowWidths(widths)
        }
        return spans
    }

    projector["glyphs"] = function (node)
    {
        var cells, classes, end, gi, indent, k, li, line, lines, out, scale, si, spans, st, starts, tops, x, x1, x2, y, _121_56_

        spans = this.spans(node)
        st = node.state
        scale = this.scaleOf(node)
        out = []
        if (_k_.empty(spans))
        {
            return out
        }
        tops = st.flowLayout().tops
        lines = st.s.lines
        for (li = 0; li < lines.length; li++)
        {
            line = lines[li]
            starts = st.wrapStarts(li)
            cells = sue.cellPositionsForLine(lines,li,[])
            classes = st.syntax.getClasses(li)
            for (k = 0; k < starts.length; k++)
            {
                si = tops[li] + k
                if (si < 0)
                {
                    continue
                }
                if (si >= spans.length)
                {
                    return out
                }
                ;[y,x1,x2] = spans[si]
                end = ((k + 1 < starts.length) ? starts[k + 1] : line.length)
                indent = st.wrapIndent(li,k)
                for (gi = starts[k]; gi < end; gi++)
                {
                    x = x1 + (cells[gi] - cells[starts[k]] + indent) * scale
                    if (x + scale <= x2)
                    {
                        out.push([x,y,line[gi],(((_121_56_=classes[gi]) != null ? _121_56_ : 'text'))])
                    }
                }
            }
        }
        return out
    }

    projector["cellOf"] = function (node, pos)
    {
        var col, k, li, scale, si, spans, st, x, x1, y

        spans = this.spans(node)
        st = node.state
        scale = this.scaleOf(node)
        ;[x,li] = pos
        ;[col,k] = st.lineCell(x,li)
        si = st.flowLayout().tops[li] + k
        if (si < 0 || si >= spans.length)
        {
            return null
        }
        ;[y,x1] = spans[si]
        return [x1 + col * scale,y + scale - 1]
    }

    projector["posAt"] = function (node, cell)
    {
        var cx, cy, k, li, scale, si, spans, st, tops

        spans = this.spans(node)
        st = node.state
        scale = this.scaleOf(node)
        ;[cx,cy] = cell
        si = spans.findIndex(function (span)
        {
            return (span[0] <= cy && cy < span[0] + scale) && (span[1] <= cx && cx < span[2])
        })
        if (si < 0)
        {
            return null
        }
        tops = st.flowLayout().tops
        li = tops.length - 1
        while (li > 0 && tops[li] > si)
        {
            li -= 1
        }
        k = si - tops[li]
        if (k < 0 || k >= st.wrapStarts(li).length)
        {
            return null
        }
        return [st.posInRow(li,k,Math.floor((cx - spans[si][1]) / scale)),li]
    }

    projector["endOf"] = function (node)
    {
        var lines

        lines = this.stateOf(node).s.lines
        return [lines.slice(-1)[0].length,lines.length - 1]
    }

    projector["scrollToCursor"] = function (node)
    {
        var i, li, si, spans, st, x

        spans = this.spans(node)
        st = node.state
        if (_k_.empty(spans))
        {
            return
        }
        ;[x,li] = st.mainCursor()
        for (i = 0; i < 1000; i++)
        {
            si = st.flowLayout().tops[li] + st.wrapRow(x,li)
            if (si < 0)
            {
                if (!this.scrollRows(st,-1))
                {
                    break
                }
            }
            else if (si >= spans.length)
            {
                if (!this.scrollRows(st,1))
                {
                    break
                }
            }
            else
            {
                break
            }
        }
    }

    projector["scrollRows"] = function (st, dir)
    {
        var off, view

        view = st.s.view[1]
        off = st.s.scrollOffset
        if (dir > 0)
        {
            if (off + 1 < st.wrapStarts(view).length)
            {
                off += 1
            }
            else if (view + 1 < st.s.lines.length)
            {
                view += 1
                off = 0
            }
            else
            {
                return false
            }
        }
        else
        {
            if (off > 0)
            {
                off -= 1
            }
            else if (view > 0)
            {
                view -= 1
                off = st.wrapStarts(view).length - 1
            }
            else
            {
                return false
            }
        }
        st.setView([0,view],off)
        return true
    }

    return projector
})()

export default projector;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdG9yLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9wb3BvL3Byb2plY3Rvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQU0sV0FBQTs7T0FDSSxVQUFBO0lBQVM7O09BQ0EsVUFBUDs7T0FDTyxZQUFaOzs7QUFFTixhQUFEOzs7OztJQU9JLFdBQUMscUJBQVE7Ozs7Y0FFUzs7bUJBQVo7O2FBRUMsS0FBSzs7Y0FDRCxLQUFLLG1CQUFXLEtBQUMsTUFBTSxRQUFVLEtBQUMsUUFBUTs7NkJBRXBDLEtBQUs7OztZQUFkO1lBQ0EsS0FBQyxPQUFPOztlQUVaOzs7SUFLSixXQUFDLHNCQUFTOzs7O2NBRUMsS0FBSzs7aUJBRUwsS0FBSzs7Z0JBQ0osT0FBTyxLQUFLLGdCQUFVOzs7O2dCQUV0QixLQUFDLG1CQUFTLEtBQUMsMkJBQVEsTUFBSztnQkFDeEIsb0JBQW9CLEtBQUM7O1lBRXpCLFNBQVMsT0FBTyxLQUFLLEVBQUUsS0FBSyxHQUFHO1lBQy9CLEdBQUcsUUFBVSxJQUFJLEtBQUssS0FBSztZQUMzQixHQUFHLFVBQVU7WUFDYixHQUFHLE9BQU8sT0FBTyxLQUFDLE1BQU07aUJBRXJCLEtBQUs7O2dCQUNKLEdBQUcsSUFBSSxLQUFLO2dCQUNaLEdBQUcsUUFBUSxLQUFLLEVBQUUsTUFBTTtnQkFDeEIsR0FBRyxPQUFPLFNBQVMsS0FBSyxFQUFFO2dCQUMxQixHQUFHOzs7O2dCQUVILEdBQUcsb0JBQVUsS0FBSyw0QkFBUzs7bUJBRXhCLEtBQUs7bUJBQ0wsS0FBSzttQkFDTCxLQUFLO1lBRVosS0FBSyxRQUFROztRQUVqQixLQUFLLEtBQUs7WUFFUCxHQUFHLE9BQU8sUUFBTyxLQUFDLE1BQU07O1lBQ3ZCLEdBQUcsT0FBTyxPQUFPLEtBQUMsTUFBTTtZQUN4QixHQUFHLE9BQU8sU0FBUyxHQUFHLEVBQUU7O2VBRTVCOzs7SUFFSixXQUFDLG9CQUFPOzs2QkFBZSxLQUFLLFVBQXVCLFVBQWIsS0FBSyxTQUFlLEtBQUssT0FBTzs7O0lB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
//# sourceURL=../../../kode/ked/popo/projector.kode
