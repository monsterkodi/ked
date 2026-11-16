var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var BG_COLOR, FG_BG_COLOR, FG_COLOR, susan

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import color from "../theme/color.js"

FG_COLOR = 31
BG_COLOR = 32
FG_BG_COLOR = 33

susan = (function ()
{
    susan["FG_COLOR"] = FG_COLOR
    susan["BG_COLOR"] = BG_COLOR
    susan["FG_BG_COLOR"] = FG_BG_COLOR
    susan["fromColors"] = function (colors)
    {
        var areas, span, _38_31_, _41_31_

        areas = []
        if (!(colors != null))
        {
            return areas
        }
        var list = _k_.list((((_38_31_=colors.fg) != null ? _38_31_ : [])))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            span = list[_a_]
            areas.push({x:span[0],y:span[1],value:[FG_COLOR,[span[3],span[2] - span[0],1]]})
        }
        var list1 = _k_.list((((_41_31_=colors.bg) != null ? _41_31_ : [])))
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            span = list1[_b_]
            areas.push({x:span[0],y:span[1],value:[BG_COLOR,[span[3],span[2] - span[0],1]]})
        }
        return areas
    }

    susan["ncolors"] = function (code)
    {
        if (code === FG_BG_COLOR)
        {
            return 2
        }
        if (code === FG_COLOR || code === BG_COLOR)
        {
            return 1
        }
        return 0
    }

    susan["box"] = function (area, lines)
    {
        var code, data, h, line, n, open, w, _67_29_, _69_25_, _72_33_

        code = area.value[0]
        n = this.ncolors(code)
        if (n === 0)
        {
            return null
        }
        data = ((_67_29_=area.value[1]) != null ? _67_29_ : [])
        w = data[n]
        h = ((_69_25_=data[n + 1]) != null ? _69_25_ : 1)
        if (!!_k_.empty(w))
        {
            line = ((_72_33_=lines[area.y]) != null ? _72_33_ : [])
            w = _k_.max(0,(kseg.width(line) - area.x))
            open = true
        }
        else
        {
            open = false
        }
        return {x:area.x,y:area.y,w:w,h:h,colors:data.slice(0, typeof n === 'number' ? n : -1),open:open}
    }

    susan["rebox"] = function (area, box)
    {
        var code, data, w

        var _a_ = area.value; code = _a_[0]; data = _a_[1]

        w = (box.open ? null : box.w)
        return {x:box.x,y:box.y,value:[code,box.colors.concat([w,box.h])]}
    }

    susan["subtract"] = function (box, rng)
    {
        var mh, my1, my2, parts, rx1, rx2, ry1, ry2, x1, x2, y1, y2

        var _a_ = rng; rx1 = _a_[0]; ry1 = _a_[1]; rx2 = _a_[2]; ry2 = _a_[3]

        x1 = box.x
        x2 = box.x + box.w
        y1 = box.y
        y2 = box.y + box.h - 1
        if (rx2 <= x1 || rx1 >= x2 || ry2 < y1 || ry1 > y2)
        {
            return [box]
        }
        parts = []
        if (ry1 > y1)
        {
            parts.push({x:x1,y:y1,w:box.w,h:ry1 - y1,colors:box.colors,open:box.open})
        }
        if (ry2 < y2)
        {
            parts.push({x:x1,y:ry2 + 1,w:box.w,h:y2 - ry2,colors:box.colors,open:box.open})
        }
        my1 = _k_.max(y1,ry1)
        my2 = _k_.min(y2,ry2)
        if (my2 >= my1)
        {
            mh = my2 - my1 + 1
            if (rx1 > x1)
            {
                parts.push({x:x1,y:my1,w:rx1 - x1,h:mh,colors:box.colors,open:false})
            }
            if (rx2 < x2)
            {
                parts.push({x:rx2,y:my1,w:x2 - rx2,h:mh,colors:box.colors,open:box.open})
            }
        }
        return parts
    }

    susan["cut"] = function (areas, ranges, lines)
    {
        var area, box, next, part, parts, result, rng

        result = []
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            box = this.box(area,lines)
            if (!(box != null))
            {
                result.push(area)
                continue
            }
            parts = [box]
            var list1 = _k_.list(ranges)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                rng = list1[_b_]
                next = []
                var list2 = _k_.list(parts)
                for (var _c_ = 0; _c_ < list2.length; _c_++)
                {
                    part = list2[_c_]
                    next = next.concat(this.subtract(part,rng))
                }
                parts = next
                if (_k_.empty(parts))
                {
                    break
                }
            }
            var list3 = _k_.list(parts)
            for (var _d_ = 0; _d_ < list3.length; _d_++)
            {
                part = list3[_d_]
                result.push(this.rebox(area,part))
            }
        }
        return result
    }

    function susan (cells, state)
    {
        this.cells = cells
        this.state = state
    
        this["draw"] = this["draw"].bind(this)
    }

    susan.prototype["draw"] = function ()
    {
        var area, areas, bg, code, data, fg, h, lines, r, row, scale, view, w, x, x1, x2, y, _149_29_

        areas = ((_149_29_=this.state.s.sue) != null ? _149_29_ : [])
        if (_k_.empty(areas))
        {
            return
        }
        view = this.state.s.view
        lines = this.state.s.lines
        var list = _k_.list(areas)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            area = list[_a_]
            y = area.y
            if (y < 0 || y >= lines.length)
            {
                continue
            }
            row = this.state.rowOfLine(y)
            if (row < 0)
            {
                continue
            }
            scale = this.state.lineHeight(y)
            if (row + scale > this.cells.rows)
            {
                continue
            }
            var _b_ = area.value; code = _b_[0]; data = _b_[1]

            data = (data != null ? data : [])
            fg = null
            bg = null
            w = null
            h = null
            if (code === FG_COLOR)
            {
                fg = data[0]
                w = data[1]
                h = data[2]
            }
            else if (code === BG_COLOR)
            {
                bg = data[0]
                w = data[1]
                h = data[2]
            }
            else if (code === FG_BG_COLOR)
            {
                fg = data[0]
                bg = data[1]
                w = data[2]
                h = data[3]
            }
            else
            {
                continue
            }
            if (!!_k_.empty(w))
            {
                w = _k_.max(0,(kseg.width(lines[y]) - area.x))
            }
            h = (h != null ? h : 1)
            x1 = _k_.max(0,(area.x * scale - view[0]))
            x2 = _k_.min(this.cells.cols,((area.x + w) * scale - view[0]))
            if (x1 >= x2)
            {
                continue
            }
            if ((fg != null))
            {
                fg = color.values(fg)
            }
            if ((bg != null))
            {
                bg = color.values(bg)
            }
            for (var _c_ = r = row, _d_ = _k_.min(this.cells.rows,row + h * scale); (_c_ <= _d_ ? r < _k_.min(this.cells.rows,row + h * scale) : r > _k_.min(this.cells.rows,row + h * scale)); (_c_ <= _d_ ? ++r : --r))
            {
                if ((bg != null))
                {
                    this.cells.bg_rect(x1,r,(x2 - 1),r,bg)
                }
                if ((fg != null))
                {
                    for (var _e_ = x = x1, _f_ = x2; (_e_ <= _f_ ? x < x2 : x > x2); (_e_ <= _f_ ? ++x : --x))
                    {
                        this.cells.set_fg(x,r,fg)
                    }
                }
            }
        }
    }

    return susan
})()

export default susan;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VzYW4uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL2VkaXQvc3VzYW4ua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUFVLFVBQUE7SUFBTTs7T0FDRyxZQUFaOztBQUVQLFdBQWM7QUFDZCxXQUFjO0FBQ2QsY0FBYzs7QUFFYixTQUFEOztJQWtCSSxPQUFDLGFBQWE7SUFDZCxPQUFDLGFBQWE7SUFDZCxPQUFDLGdCQUFhO0lBSWQsT0FBQyx5QkFBWTs7OztRQUVUO2NBRWU7O21CQUFiOzt1Q0FFVyxPQUFPOzs7WUFBaEI7WUFDQSxNQUFNLE1BQU0sRUFBRyxLQUFLLEdBQUcsRUFBRyxLQUFLLEdBQUcsT0FBUSxVQUFVLEtBQUssR0FBRyxLQUFLLEtBQUcsS0FBSyxHQUFHOzt3Q0FFbkUsT0FBTzs7O1lBQWhCO1lBQ0EsTUFBTSxNQUFNLEVBQUcsS0FBSyxHQUFHLEVBQUcsS0FBSyxHQUFHLE9BQVEsVUFBVSxLQUFLLEdBQUcsS0FBSyxLQUFHLEtBQUssR0FBRzs7ZUFFaEY7OztJQVdKLE9BQUMsc0JBQVM7O1lBQ0MsU0FBUTs7bUJBQWI7O1lBQ0ssU0FBUSxZQUFZLFNBQVE7O21CQUFqQzs7ZUFDRjs7O0lBRUosT0FBQyxrQkFBTSxNQUFLOzs7O1FBRVIsT0FBTyxLQUFLLE1BQU07UUFDbEIsSUFBTyxLQUFDLFFBQVE7WUFFTixNQUFLOzttQkFBYjs7UUFFRixpQkFBTyxLQUFLLE1BQU07UUFDbEIsSUFBTyxLQUFLO1FBQ1osY0FBTyxLQUFLLElBQUUsd0JBQUs7d0JBRU47O1lBQ1QsaUJBQU8sTUFBTSxLQUFLO1lBQ2xCLFlBQVcsR0FBRyxLQUFLLE1BQU0sUUFBUSxLQUFLO1lBQ3RDLE9BQU87Ozs7WUFFUCxPQUFPOztnQkFFVixFQUFHLEtBQUssRUFBRSxFQUFHLEtBQUssRUFBRSxFQUFHLEVBQUUsRUFBRyxFQUFFLE9BQVEsV0FBSyxVQUFJLGlCQUFBLFFBQUcsS0FBTTs7O0lBRTdELE9BQUMsb0JBQVEsTUFBSzs7OztrQkFDSSxLQUFLLE9B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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/susan.kode
