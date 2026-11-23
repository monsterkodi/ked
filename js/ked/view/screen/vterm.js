var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var vterm

import kxk from "../../../kxk.js"
let kseg = kxk.kseg


vterm = (function ()
{
    vterm["BLOCK_MARK"] = '·'
    function vterm (cols, rows)
    {
        this.cols = cols
        this.rows = rows
    
        this["placements"] = this["placements"].bind(this)
        this["colored"] = this["colored"].bind(this)
        this["text"] = this["text"].bind(this)
        this["put"] = this["put"].bind(this)
        this["set"] = this["set"].bind(this)
        this["apc"] = this["apc"].bind(this)
        this["osc"] = this["osc"].bind(this)
        this["csi"] = this["csi"].bind(this)
        this["feed"] = this["feed"].bind(this)
        this["resize"] = this["resize"].bind(this)
        this["blankRow"] = this["blankRow"].bind(this)
        this["reset"] = this["reset"].bind(this)
        this.reset()
    }

    vterm.prototype["reset"] = function ()
    {
        var y

        this.grid = []
        this.images = {}
        this.x = 0
        this.y = 0
        this.style = ''
        this.saved = [0,0]
        for (var _a_ = y = 0, _b_ = this.rows; (_a_ <= _b_ ? y < this.rows : y > this.rows); (_a_ <= _b_ ? ++y : --y))
        {
            this.grid.push(this.blankRow())
        }
    }

    vterm.prototype["blankRow"] = function ()
    {
        var row, x

        row = []
        for (var _a_ = x = 0, _b_ = this.cols; (_a_ <= _b_ ? x < this.cols : x > this.cols); (_a_ <= _b_ ? ++x : --x))
        {
            row.push({char:' ',style:''})
        }
        return row
    }

    vterm.prototype["resize"] = function (cols, rows)
    {
        if (cols === this.cols && rows === this.rows)
        {
            return
        }
        this.cols = cols
        this.rows = rows
        return this.reset()
    }

    vterm.prototype["feed"] = function (bytes)
    {
        var bel, ch, i, j, kind, n, seg, st

        i = 0
        n = bytes.length
        while (i < n)
        {
            ch = bytes[i]
            if (ch === '\x1b')
            {
                kind = bytes[i + 1]
                if (kind === '[')
                {
                    j = i + 2
                    while (j < n && !/[@-~]/.test(bytes[j]))
                    {
                        j += 1
                    }
                    this.csi(bytes.slice(i + 2, typeof j === 'number' ? j : -1),bytes[j])
                    i = j + 1
                    continue
                }
                if (kind === ']')
                {
                    bel = bytes.indexOf('\x07',i)
                    st = bytes.indexOf('\x1b\\',i)
                    if (bel >= 0 && (st < 0 || bel < st))
                    {
                        this.osc(bytes.slice(i + 2, typeof bel === 'number' ? bel : -1))
                        i = bel + 1
                    }
                    else
                    {
                        if (st < 0)
                        {
                            st = n
                        }
                        this.osc(bytes.slice(i + 2, typeof st === 'number' ? st : -1))
                        i = st + 2
                    }
                    continue
                }
                if (kind === '_')
                {
                    st = bytes.indexOf('\x1b\\',i)
                    if (st < 0)
                    {
                        st = n
                    }
                    this.apc(bytes.slice(i + 2, typeof st === 'number' ? st : -1))
                    i = st + 2
                    continue
                }
                if (kind === '7')
                {
                    this.saved = [this.x,this.y]
                }
                if (kind === '8')
                {
                    this.x = this.saved[0]
                    this.y = this.saved[1]
                }
                i += 2
                continue
            }
            if (ch === '\n')
            {
                this.x = 0
                this.y += 1
                i += 1
                continue
            }
            if (ch === '\r')
            {
                this.x = 0
                i += 1
                continue
            }
            j = i
            while (j < n && !(_k_.in(bytes[j],'\x1b\n\r')))
            {
                j += 1
            }
            var list = _k_.list(kseg(bytes.slice(i, typeof j === 'number' ? j : -1)))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                seg = list[_a_]
                this.put(seg,_k_.max(1,kseg.segWidth(seg)))
            }
            i = j
        }
        return this
    }

    vterm.prototype["csi"] = function (params, final)
    {
        var k, nums

        nums = params.split(';').map(function (p)
        {
            return parseInt(p)
        })
        switch (final)
        {
            case 'H':
                this.y = _k_.max(0,(nums[0] || 1) - 1)
                return this.x = _k_.max(0,(nums[1] || 1) - 1)

            case 'C':
                return this.x += nums[0] || 1

            case 'X':
                for (var _a_ = k = 0, _b_ = (nums[0] || 1); (_a_ <= _b_ ? k < (nums[0] || 1) : k > (nums[0] || 1)); (_a_ <= _b_ ? ++k : --k))
                {
                    this.set(this.x + k,this.y,' ',this.style)
                }
                break
            case 'J':
                if (params === '2')
                {
                    return this.reset()
                }
                break
            case 'm':
                if (_k_.in(params,['','0']))
                {
                    return this.style = ''
                }
                else
                {
                    return this.style += `\x1b[${params}m`
                }
                break
        }

    }

    vterm.prototype["osc"] = function (body)
    {
        var c, key, meta, pair, r, scale, semi, text, value, width

        if (!body.startsWith('66;'))
        {
            return
        }
        semi = body.indexOf(';',3)
        meta = body.slice(3, typeof semi === 'number' ? semi : -1)
        text = body.slice(semi + 1)
        scale = 1
        width = 1
        var list = _k_.list(meta.split(':'))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pair = list[_a_]
            var _b_ = pair.split('='); key = _b_[0]; value = _b_[1]

            if (key === 's')
            {
                scale = parseInt(value)
            }
            if (key === 'w')
            {
                width = parseInt(value)
            }
        }
        for (var _c_ = r = 0, _d_ = scale; (_c_ <= _d_ ? r < scale : r > scale); (_c_ <= _d_ ? ++r : --r))
        {
            for (var _e_ = c = 0, _f_ = scale * width; (_e_ <= _f_ ? c < scale * width : c > scale * width); (_e_ <= _f_ ? ++c : --c))
            {
                this.set(this.x + c,this.y + r,vterm.BLOCK_MARK,this.style)
            }
        }
        this.set(this.x,this.y,text,this.style)
        return this.x += scale * width
    }

    vterm.prototype["apc"] = function (body)
    {
        var args, img, key, pair, semi, value, _166_44_, _166_81_, _170_38_, _171_38_

        if (!body.startsWith('G'))
        {
            return
        }
        semi = body.indexOf(';')
        if (semi < 0)
        {
            semi = body.length
        }
        args = {}
        var list = _k_.list(body.slice(1, typeof semi === 'number' ? semi : -1).split(','))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pair = list[_a_]
            var _b_ = pair.split('='); key = _b_[0]; value = _b_[1]

            args[key] = value
        }
        switch (args.a)
        {
            case 'p':
                return this.images[`${args.i}:${((_166_44_=args.p) != null ? _166_44_ : 1)}`] = {i:parseInt(args.i),p:parseInt(((_166_81_=args.p) != null ? _166_81_ : 1)),x:this.x,y:this.y}

            case 'd':
                for (key in this.images)
                {
                    img = this.images[key]
                    if ((args.i != null) && img.i !== parseInt(args.i))
                    {
                        continue
                    }
                    if ((args.p != null) && img.p !== parseInt(args.p))
                    {
                        continue
                    }
                    delete this.images[key]
                }
                break
        }

    }

    vterm.prototype["set"] = function (x, y, char, style)
    {
        if (x < 0 || y < 0 || x >= this.cols || y >= this.rows)
        {
            return
        }
        return this.grid[y][x] = {char:char,style:style}
    }

    vterm.prototype["put"] = function (char, width)
    {
        this.set(this.x,this.y,char,this.style)
        if (width > 1)
        {
            this.set(this.x + 1,this.y,'',this.style)
        }
        return this.x += width
    }

    vterm.prototype["text"] = function ()
    {
        return this.grid.map(function (row)
        {
            return row.map(function (cell)
            {
                return cell.char
            }).join('').replace(/\s+$/,'')
        })
    }

    vterm.prototype["colored"] = function ()
    {
        var cell, line, lines, row, style

        lines = []
        var list = _k_.list(this.grid)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            row = list[_a_]
            line = ''
            style = null
            var list1 = _k_.list(row)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                cell = list1[_b_]
                if (cell.style !== style)
                {
                    line += '\x1b[0m' + cell.style
                    style = cell.style
                }
                line += cell.char
            }
            lines.push(line + '\x1b[0m')
        }
        return lines
    }

    vterm.prototype["placements"] = function ()
    {
        return Object.values(this.images).sort(function (a, b)
        {
            return a.y - b.y || a.x - b.x
        })
    }

    return vterm
})()

export default vterm;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnRlcm0uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvc2NyZWVuL3Z0ZXJtLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDYSxVQUFBO0lBQU07OztBQUVsQixTQUFEOztJQUVJLE9BQUMsZUFBWTthQUViLE9BQUksTUFBTTs7UUFBUDtRQUFNOzs7Ozs7Ozs7Ozs7OztRQUFTLEtBQUM7OztxQkFFbkI7Ozs7UUFFSSxLQUFDO1FBQ0QsS0FBQztRQUNELEtBQUMsSUFBUztRQUNWLEtBQUMsSUFBUztRQUNWLEtBQUMsUUFBUztRQUNWLEtBQUMsU0FBVSxFQUFFO3VCQUVULElBQUssU0FBSSxLQUFDLHdCQUFELEtBQUMsV0FBRCxLQUFDOztZQUNWLEtBQUMsS0FBSyxLQUFLLEtBQUM7Ozs7cUJBRXBCOzs7O1FBRUk7dUJBQ0ksSUFBSyxTQUFJLEtBQUMsd0JBQUQsS0FBQyxXQUFELEtBQUM7O1lBQ1YsSUFBSSxNQUFLLEtBQUssSUFBSSxNQUFNOztlQUM1Qjs7O3FCQUVKLHFCQUFRLE1BQUs7O1lBRUosU0FBUSxLQUFDLFFBQVMsU0FBUSxLQUFDOzs7O1FBRWhDLEtBQUMsT0FBTztRQUNSLEtBQUMsT0FBTztlQUNSLEtBQUM7OztxQkFFTCxtQkFBTTs7OztRQUVGLElBQUk7UUFDSixJQUFJLE1BQU07ZUFFSixJQUFJOztZQUVOLEtBQUssTUFBTTtnQkFFUixPQUFNOztnQkFFTCxPQUFPLE1BQU0sSUFBRTtvQkFFWixTQUFROztvQkFDUCxJQUFJLElBQUU7MkJBQ08sSUFBSSxNQUFVLFFBQVEsS0FBSyxNQUFNOzt3QkFBOUMsS0FBSzs7b0JBQ0wsS0FBQyxJQUFJLFlBQU0sSUFBRSxVQUFJLGlCQUFBLFFBQUcsTUFBTTtvQkFDMUIsSUFBSSxJQUFFO29CQUNOOztvQkFFRCxTQUFROztvQkFDUCxNQUFNLE1BQU0sUUFBUSxPQUFPO29CQUMzQixLQUFNLE1BQU0sUUFBUSxTQUFTO3dCQUMxQixPQUFPLE1BQU8sS0FBSyxLQUFLLE1BQU07O3dC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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/screen/vterm.kode
