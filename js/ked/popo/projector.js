var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var projector

import fill from "./fill.js"

import sue from "../edit/tool/sue.js"

import state from "../edit/state.js"


projector = (function ()
{
    function projector ()
    {}

    projector["attach"] = function (node)
    {
        var child, _16_27_, _18_35_

        if (!(node != null))
        {
            return node
        }
        if (!_k_.empty(node.text))
        {
            ;(node.regions != null) ? this.spans(node) : this.stateOf(node)
        }
        var list = ((_18_35_=node.children) != null ? _18_35_ : [])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            child = list[_a_]
            this.attach(child)
        }
        return node
    }

    projector["stateOf"] = function (node)
    {
        var st, _27_25_

        if (!(node.state != null))
        {
            st = new state({cols:0,rows:0},'popo_node')
            st.wrap = {all:true,word:false}
            st.scaling = false
            st.syntax.setExt('md')
            node.state = st
        }
        if (node.stateText !== node.text)
        {
            node.state.loadLines(node.text.split('\n'))
            node.stateText = node.text
        }
        return node.state
    }

    projector["scaleOf"] = function (node)
    {
        var _40_43_

        return _k_.max(1,parseInt(((_40_43_=node.scale) != null ? _40_43_ : 1)))
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
        if (si >= spans.length)
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
        if (k >= st.wrapStarts(li).length)
        {
            return null
        }
        return [st.posInRow(li,k,Math.floor((cx - spans[si][1]) / scale)),li]
    }

    return projector
})()

export default projector;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdG9yLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9wb3BvL3Byb2plY3Rvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQU0sV0FBQTs7T0FDYSxVQUFQOztPQUNPLFlBQVo7OztBQUVOLGFBQUQ7Ozs7O0lBTUksV0FBQyxxQkFBUTs7OztjQUVTOzttQkFBWjs7dUJBRU8sS0FBSzs7Y0FDUCxLQUFLLG1CQUFXLEtBQUMsTUFBTSxRQUFVLEtBQUMsUUFBUTs7NkJBRXBDLEtBQUs7OztZQUFkO1lBQ0EsS0FBQyxPQUFPOztlQUVaOzs7SUFJSixXQUFDLHNCQUFTOzs7O2NBRUMsS0FBSzs7WUFDUixTQUFTLE9BQU8sS0FBSyxFQUFFLEtBQUssR0FBRztZQUMvQixHQUFHLFFBQVUsSUFBSSxLQUFLLEtBQUs7WUFDM0IsR0FBRyxVQUFVO1lBQ2IsR0FBRyxPQUFPLE9BQU87WUFDakIsS0FBSyxRQUFROztZQUVkLEtBQUssY0FBYSxLQUFLOztZQUN0QixLQUFLLE1BQU0sVUFBVSxLQUFLLEtBQUssTUFBTTtZQUNyQyxLQUFLLFlBQVksS0FBSzs7ZUFFMUIsS0FBSzs7O0lBRVQsV0FBQyxzQkFBUzs7Ozt1QkFBWSxxQkFBTSxLQUFLLDJCQUFROzs7SUFJekMsV0FBQyxvQkFBTzs7OztRQUVKLFFBQVMsS0FBQyxRQUFRO1FBQ2xCLFFBQVMsS0FBSyxNQUFNLEtBQUssS0FBSyxRQUFRLEtBQUssS0FBSztRQUNoRCxTQUFTLE1BQU0sY0FBSzs7K0JBQWdCLEtBQUssS0FBSyxLQUFLLE1BQU07O1FBQ3pELEtBQVMsS0FBQyxRQUFRO3NCQUVhLFFBQVcsR0FBRzs7WUFBN0MsR0FBRyxhQUFhOztlQUVoQjs7O0lBSUosV0FBQyxxQkFBUTs7OztRQUVMLFFBQVEsS0FBQyxNQUFNO1FBQ2YsS0FBUSxLQUFLO1FBQ2IsUUFBUSxLQUFDLFFBQVE7UUFDakI7c0JBRWU7O21CQUFiOztRQUVGLE9BQVEsR0FBRyxhQUFhO1FBQ3hCLFFBQVEsR0FBRyxFQUFFO2FBRVQsS0FBTSxRQUFJLE1BQU07O1lBRWhCLE9BQVMsTUFBTTtZQUNmLFNBQVMsR0FBRyxXQUFXO1lBQ3ZCLFFBQVMsSUFBSSxxQkFBcUIsTUFBTTtpQkFFcEMsSUFBSyxPQUFJLE9BQU87O2dCQUVoQixLQUFLLEtBQUssTUFBTTtvQkFFUCxNQUFNLE1BQU07OzJCQUFuQjs7a0JBRUQsRUFBRSxHQUFHLE1BQU0sTUFBTTtnQkFDbEIsUUFBVSxJQUFFLElBQUksT0FBTyxVQUFVLE9BQU8sSUFBRSxLQUFLLEtBQUs7Z0JBQ3BELFNBQVMsR0FBRyxXQUFXLEdBQUc7cUJBRXRCLEtBQU0sT0FBTyxTQUFLOztvQkFDbEIsSUFBSSxNQUFNLE1BQU0sTUFBTSxNQUFNLE9BQU8sTUFBTSxVQUFVO3dCQUN4QixJQUFJLFNBQVM7O3dCQUF4QyxJQUFJLE1BQU0sRUFBRSxFQUFFLEtBQUs7Ozs7O2VBRS9COzs7SUFLSixXQUFDLHFCQUFRLE1BQUs7Ozs7UUFFVixRQUFRLEtBQUMsTUFBTTtRQUNmLEtBQVEsS0FBSztRQUNiLFFBQVEsS0FBQyxRQUFRO1VBRWhCLEVBQUUsTUFBUTtVQUNWLElBQUksS0FBTSxHQUFHLFNBQVMsRUFBRTtRQUN6QixLQUFXLEdBQUcsYUFBYSxLQUFLLE1BQU07WUFFNUIsTUFBTSxNQUFNOzttQkFBcEI7O1VBRUQsRUFBRSxNQUFNLE1BQU07Z0JBRWQsS0FBSyxNQUFJLE1BQU8sSUFBSSxRQUFNOzs7SUFLL0IsV0FBQyxvQkFBTyxNQUFLOzs7O1FBRVQsUUFBUSxLQUFDLE1BQU07UUFDZixLQUFRLEtBQUs7UUFDYixRQUFRLEtBQUMsUUFBUTtVQUVoQixHQUFHLE1BQU07UUFFVixLQUFLLE1BQU0sb0JBQVc7O29CQUFTLEtBQUssTUFBTSxNQUFBLEtBQUssS0FBSyxLQUFHLFdBQVUsS0FBSyxNQUFNLE1BQUEsS0FBSyxLQUFLOztZQUU1RSxLQUFLOzttQkFBYjs7UUFFRixPQUFPLEdBQUcsYUFBYTtRQUN2QixLQUFPLEtBQUssU0FBTztlQUNKLEtBQUssS0FBTSxLQUFLLE1BQU07O1lBQXJDLE1BQU87O1FBQ1AsSUFBTyxLQUFLLEtBQUs7WUFFUCxLQUFLLEdBQUcsV0FBVyxJQUFJOzttQkFBL0I7O2dCQUVELEdBQUcsU0FBUyxHQUFHLGNBQVMsS0FBSyxNQUFNLElBQUksTUFBTSxRQUFROzs7V0EvSDdEOzs7ZUFpSU0ifQ==
//# sourceURL=../../../kode/ked/popo/projector.kode
