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
        var st, _30_25_, _37_21_, _43_40_

        if (!(node.state != null))
        {
            st = new state({cols:0,rows:0},'popo_node')
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
                st.loadLines(((_43_40_=node.lines) != null ? _43_40_ : ['']))
            }
            delete node.s
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
        var _64_43_

        return _k_.max(1,parseInt(((_64_43_=node.scale) != null ? _64_43_ : 1)))
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
        var cells, end, gi, indent, k, li, line, lines, out, scale, si, spans, st, starts, tops, x, x1, x2, y

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
                        out.push([x,y,line[gi]])
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdG9yLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9wb3BvL3Byb2plY3Rvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQU0sV0FBQTs7T0FDSSxVQUFBO0lBQVM7O09BQ0EsVUFBUDs7T0FDTyxZQUFaOzs7QUFFTixhQUFEOzs7OztJQU9JLFdBQUMscUJBQVE7Ozs7Y0FFUzs7bUJBQVo7O2FBRUMsS0FBSzs7Y0FDRCxLQUFLLG1CQUFXLEtBQUMsTUFBTSxRQUFVLEtBQUMsUUFBUTs7NkJBRXBDLEtBQUs7OztZQUFkO1lBQ0EsS0FBQyxPQUFPOztlQUVaOzs7SUFLSixXQUFDLHNCQUFTOzs7O2NBRUMsS0FBSzs7WUFFUixTQUFTLE9BQU8sS0FBSyxFQUFFLEtBQUssR0FBRztZQUMvQixHQUFHLFFBQVUsSUFBSSxLQUFLLEtBQUs7WUFDM0IsR0FBRyxVQUFVO1lBQ2IsR0FBRyxPQUFPLE9BQU8sS0FBQyxNQUFNO2lCQUVyQixLQUFLOztnQkFDSixHQUFHLElBQUksS0FBSztnQkFDWixHQUFHLFFBQVEsS0FBSyxFQUFFLE1BQU07Z0JBQ3hCLEdBQUcsT0FBTyxTQUFTLEtBQUssRUFBRTtnQkFDMUIsR0FBRzs7OztnQkFFSCxHQUFHLG9CQUFVLEtBQUssNEJBQVM7O21CQUV4QixLQUFLO21CQUNMLEtBQUs7WUFFWixLQUFLLFFBQVE7O1FBRWpCLEtBQUssS0FBSztZQUVQLEdBQUcsT0FBTyxRQUFPLEtBQUMsTUFBTTs7WUFDdkIsR0FBRyxPQUFPLE9BQU8sS0FBQyxNQUFNO1lBQ3hCLEdBQUcsT0FBTyxTQUFTLEdBQUcsRUFBRTs7ZUFFNUI7OztJQUVKLFdBQUMsb0JBQU87OzZCQUFlLEtBQUssVUFBdUIsVUFBYixLQUFLLFNBQWUsS0FBSyxPQUFPOzs7SUFFdEUsV0FBQyxzQkFBUzs7ZUFBUSxLQUFDLFFBQVEsTUFBTSxFQUFFLE1BQU0sY0FBSzs7bUJBQU0sS0FBSyxJQUFJOzs7O0lBRTdELFdBQUMscUJBQVE7O2VBQVEsS0FBQyxRQUFR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
//# sourceURL=../../../kode/ked/popo/projector.kode
