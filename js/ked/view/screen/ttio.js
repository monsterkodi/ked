var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, noon: function (obj) { 
    var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; 
    var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; 
    var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = '|'+k+'|' } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; 
    var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; 
    return toStr(obj);
}}

var TTIO

import kxk from "../../../kxk.js"
let events = kxk.events
let post = kxk.post
let kstr = kxk.kstr
let nfs = kxk.nfs

import keyscript from "../../util/keyscript.js"

import rounded from "../../util/img/rounded.js"


TTIO = (function ()
{
    _k_.extend(TTIO, events)
    function TTIO (opt)
    {
        var cols, rows, _15_33_, _16_30_, _17_37_, _19_24_, _20_24_

        this["onData"] = this["onData"].bind(this)
        this["parseData"] = this["parseData"].bind(this)
        this["emitMouseEvent"] = this["emitMouseEvent"].bind(this)
        this["parseMouse"] = this["parseMouse"].bind(this)
        this["setPointerStyle"] = this["setPointerStyle"].bind(this)
        this["onPointer"] = this["onPointer"].bind(this)
        this["keyEventForCombo"] = this["keyEventForCombo"].bind(this)
        this["keyEventForChar"] = this["keyEventForChar"].bind(this)
        this["parseRaw"] = this["parseRaw"].bind(this)
        this["parseEsc"] = this["parseEsc"].bind(this)
        this["parseCsi"] = this["parseCsi"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["restore"] = this["restore"].bind(this)
        this["store"] = this["store"].bind(this)
        this["showCursor"] = this["showCursor"].bind(this)
        this["hideCursor"] = this["hideCursor"].bind(this)
        this["requestCursor"] = this["requestCursor"].bind(this)
        this["setCursor"] = this["setCursor"].bind(this)
        this["onEnd"] = this["onEnd"].bind(this)
        this["play"] = this["play"].bind(this)
        this["steps"] = this["steps"].bind(this)
        this["onInputData"] = this["onInputData"].bind(this)
        this["onHeadlessResize"] = this["onHeadlessResize"].bind(this)
        this["rows"] = this["rows"].bind(this)
        this["cols"] = this["cols"].bind(this)
        this["clear"] = this["clear"].bind(this)
        this["detach"] = this["detach"].bind(this)
        this["written"] = this["written"].bind(this)
        this["write"] = this["write"].bind(this)
        opt = (opt != null ? opt : {})
        this.headless = ((_15_33_=opt.headless) != null ? _15_33_ : false)
        this.input = ((_16_30_=opt.input) != null ? _16_30_ : true)
        this.textSizing = ((_17_37_=opt.textSizing) != null ? _17_37_ : !this.headless)
        cols = ((_19_24_=opt.cols) != null ? _19_24_ : 0)
        rows = ((_20_24_=opt.rows) != null ? _20_24_ : 0)
        if (!cols && !_k_.empty(process.env.COLUMNS))
        {
            cols = parseInt(process.env.COLUMNS)
        }
        if (!rows && !_k_.empty(process.env.LINES))
        {
            rows = parseInt(process.env.LINES)
        }
        if (cols !== cols || cols < 1)
        {
            cols = 80
        }
        if (rows !== rows || rows < 1)
        {
            rows = 24
        }
        this.size = [cols,rows]
        this.out = []
        this.inputChunks = []
        this.hasFocus = true
        this.imgIds = 100
        this.lastplImgs = {}
        this.placedImgs = {}
        this.plargs = {}
        this.hiddenImgs = {}
        this.modifiers = ['cmd','ctrl','alt','shift']
        this.activeMods = {}
        global.ked_ttio = this
        if (this.headless)
        {
            this.input = this.input && !process.stdin.isTTY
            this.cellsz = []
            if (this.input)
            {
                process.stdin.on('data',this.onInputData)
                process.stdin.on('end',this.onEnd)
            }
            setTimeout(this.onHeadlessResize,0)
        }
        else
        {
            this.store()
            this.hideCursor()
            if (process.stdin.isTTY)
            {
                process.stdin.setRawMode(true)
            }
            this.write('\x1b[?1000h')
            this.write('\x1b[?1002h')
            this.write('\x1b[?1003h')
            this.write('\x1b[?1004h')
            this.write('\x1b[?1006h')
            this.write('\x1b[?1016h')
            this.write('\x1b[?1049h')
            this.write('\x1b[?7l')
            this.write('\x1b[?2004h')
            this.write('\x1b[>1s')
            this.write('\x1b[>1u')
            this.write('\x1b[=31;1u')
            process.stdout.on('resize',this.onResize)
            process.stdin.on('data',this.onData)
            post.on('pointer',this.onPointer)
            this.setTitle('kėd')
            setTimeout(this.onResize,10)
        }
        return TTIO.__super__.constructor.apply(this, arguments)
    }

    TTIO.prototype["write"] = function (str)
    {
        if (this.headless)
        {
            this.out.push(str)
            return
        }
        return process.stdout.write(str)
    }

    TTIO.prototype["written"] = function ()
    {
        return this.out.join('')
    }

    TTIO.prototype["detach"] = function ()
    {
        process.stdout.removeListener('resize',this.onResize)
        process.stdin.removeListener('data',this.onData)
        process.stdin.removeListener('data',this.onInputData)
        process.stdin.removeListener('end',this.onEnd)
        this.clear()
        this.write('\x1b[>0s')
        this.write('\x1b[<u')
        this.write('\x1b[?1000l')
        this.write('\x1b[?1002l')
        this.write('\x1b[?1003l')
        this.write('\x1b[?1004l')
        this.write('\x1b[?1006l')
        this.write('\x1b[?1016l')
        this.write('\x1b[?1049l')
        this.write('\x1b[?7h')
        this.write('\x1b[?2004l')
        this.write('\x1b[?1049l')
        this.showCursor()
        return this.restore()
    }

    TTIO.prototype["clear"] = function ()
    {
        this.write('\x1b[2J')
        return this.write('\x1b[H')
    }

    TTIO.prototype["cols"] = function ()
    {
        return (this.headless ? this.size[0] : process.stdout.columns)
    }

    TTIO.prototype["rows"] = function ()
    {
        return (this.headless ? this.size[1] : process.stdout.rows)
    }

    TTIO.prototype["onHeadlessResize"] = function ()
    {
        return this.emit('resize',this.cols(),this.rows(),null,([]))
    }

    TTIO.prototype["onInputData"] = function (data)
    {
        return this.inputChunks.push(data)
    }

    TTIO.prototype["steps"] = function ()
    {
        var text

        if (_k_.empty(this.inputChunks))
        {
            return
        }
        text = Buffer.concat(this.inputChunks).toString('utf8')
        this.inputChunks = []
        return keyscript.steps(text)
    }

    TTIO.prototype["play"] = function (bytes)
    {
        return this.onData(Buffer.from(bytes))
    }

    TTIO.prototype["onEnd"] = function ()
    {
        return this.emit('end')
    }

    TTIO.prototype["setTitle"] = function (t)
    {
        return this.write(`\x1b]2;${t}\x1b\\`)
    }

    TTIO.prototype["placeLineImage"] = function (id, cx, y, py, ry = 1)
    {
        var cy, oy, pl, placement

        for (var _a_ = placement = 0, _b_ = ry; (_a_ <= _b_ ? placement < ry : placement > ry); (_a_ <= _b_ ? ++placement : --placement))
        {
            pl = py + placement
            cy = y + parseInt(pl / this.cellsz[1])
            oy = pl % this.cellsz[1]
            this.setCursor(cx,cy)
            this.write(`\x1b_Gq=1,a=p,i=${id},p=${placement + 1},X=0,Y=${oy},C=1\x1b\\`)
        }
    }

    TTIO.prototype["placeImageSlice"] = function (id, cx, y, py, srcY, srcH, iw)
    {
        var cy, oy

        cy = y + parseInt(py / this.cellsz[1])
        oy = py % this.cellsz[1]
        this.setCursor(cx,cy)
        return this.write(`\x1b_Gq=1,a=p,i=${id},p=1,X=0,Y=${oy},x=0,y=${srcY},w=${iw},h=${srcH},C=1\x1b\\`)
    }

    TTIO.prototype["placeImageOverlay"] = function (id, x, y, py, pw, ph)
    {
        var cy, oy

        if (!this.overlayID)
        {
            this.overlayID = this.sendImg(rounded.rect(300,400,0,[255,255,255,2]),1)
        }
        cy = y + parseInt(py / this.cellsz[1])
        oy = py % this.cellsz[1]
        this.setCursor(x,cy)
        return this.write(`\x1b_Gq=1,a=p,i=${this.overlayID},p=${id},X=0,Y=${oy},w=${pw},h=${ph},z=1000,C=1\x1b\\`)
    }

    TTIO.prototype["hideImageOverlay"] = function (id)
    {
        return this.write(`\x1b_Gq=1,a=d,d=i,i=${this.overlayID},p=${id}\x1b\\`)
    }

    TTIO.prototype["sendImg"] = function (img, id)
    {
        var base64

        if (_k_.empty(id))
        {
            this.imgIds += 1
            id = this.imgIds
        }
        base64 = img.png.toString('base64')
        this.write(`\x1b_Gq=1,i=${id},f=100;${base64}\x1b\\`)
        img.id = id
        return id
    }

    TTIO.prototype["placeImg"] = function (img, x, y, px, py, pw, ph, z)
    {
        var placed, _223_32_, _233_16_, _236_28_

        if (_k_.empty(img.id))
        {
            this.sendImg(img)
        }
        this.setCursor(x,y)
        px = (px != null ? px : 0)
        py = (py != null ? py : 0)
        pw = (pw != null ? pw : this.cellsz[0])
        ph = (ph != null ? ph : this.cellsz[1])
        if (placed = (this.lastplImgs[img.id] != null ? this.lastplImgs[img.id][[x,y,px,py,pw,ph]] : undefined))
        {
            this.placedImgs[img.id] = ((_223_32_=this.placedImgs[img.id]) != null ? _223_32_ : {})
            this.placedImgs[img.id][[x,y,px,py,pw,ph]] = placed
            return [img.id,placed]
        }
        if (placed = (this.placedImgs[img.id] != null ? this.placedImgs[img.id][[x,y,px,py,pw,ph]] : undefined))
        {
            return [img.id,placed]
        }
        img.pid = ((_233_16_=img.pid) != null ? _233_16_ : 0)
        img.pid++
        this.placedImgs[img.id] = ((_236_28_=this.placedImgs[img.id]) != null ? _236_28_ : {})
        this.placedImgs[img.id][[x,y,px,py,pw,ph].toString()] = img.pid
        z = (z != null ? z : 1000)
        this.plargs[[img.id,img.pid]] = [x,y,px,py,pw,ph,z]
        this.write(`\x1b_Gq=1,a=p,i=${img.id},p=${img.pid},X=${px},Y=${py},w=${pw},h=${ph},z=${z},C=1\x1b\\`)
        return [img.id,img.pid]
    }

    TTIO.prototype["hideImg"] = function (id, pl)
    {
        var args

        if (this.hiddenImgs[[id,pl]])
        {
            return
        }
        if (args = this.plargs[[id,pl]])
        {
            delete this.plargs[[id,pl]]
            this.hiddenImgs[[id,pl]] = args
        }
        return this.write(`\x1b_Gq=1,a=d,d=i,i=${id},p=${pl}\x1b\\`)
    }

    TTIO.prototype["showImg"] = function (id, pl)
    {
        var args, ph, pw, px, py, x, y, z

        args = this.hiddenImgs[[id,pl]]
        if (_k_.empty(args))
        {
            return
        }
        delete this.hiddenImgs[[id,pl]]
        this.plargs[[id,pl]] = args
        var _a_ = args; x = _a_[0]; y = _a_[1]; px = _a_[2]; py = _a_[3]; pw = _a_[4]; ph = _a_[5]; z = _a_[6]

        this.setCursor(x,y)
        return this.write(`\x1b_Gq=1,a=p,i=${id},p=${pl},X=${px},Y=${py},w=${pw},h=${ph},z=${z},C=1\x1b\\`)
    }

    TTIO.prototype["removeImgs"] = function ()
    {
        var iid, plid, pos, posplids

        for (iid in this.lastplImgs)
        {
            posplids = this.lastplImgs[iid]
            for (pos in posplids)
            {
                plid = posplids[pos]
                if (_k_.empty((this.placedImgs[iid])) || _k_.empty((this.placedImgs[iid][pos])))
                {
                    this.hideImg(iid,plid)
                    delete this.hiddenImgs[[iid,plid]]
                }
            }
        }
        this.lastplImgs = this.placedImgs
        return this.placedImgs = {}
    }

    TTIO.prototype["hideImage"] = function (id)
    {
        return this.write(`\x1b_Gq=1,a=d,d=i,i=${id}\x1b\\`)
    }

    TTIO.prototype["hideImagesInRange"] = function (start, end)
    {
        return this.write(`\x1b_Gq=2,a=d,d=r,x=${start},y=${end}\x1b\\`)
    }

    TTIO.prototype["deleteImage"] = function (id)
    {
        return this.write(`\x1b_Gq=1,a=d,d=I,i=${id}\x1b\\`)
    }

    TTIO.prototype["deleteImagesInRange"] = function (start, end)
    {
        if (!(_k_.isNum(start)))
        {
            return console.log(`range start '${start}' not a number`)
        }
        if (!(_k_.isNum(end)))
        {
            return console.log(`range end '${end}' not a number`)
        }
        return this.write(`\x1b_Gq=2,a=d,d=R,x=${start},y=${end}\x1b\\`)
    }

    TTIO.prototype["sendImageData"] = function (data, id, w, h, bytesperpixel = 3)
    {
        var base64, chunk, chunks, i

        base64 = data.toString('base64')
        if (base64.length > 4096)
        {
            chunk = base64.slice(0, 4096)
            this.write(`\x1b_Gq=1,i=${id},p=${id},f=${8 * bytesperpixel},s=${w},v=${h},m=1;${chunk}\x1b\\`)
            chunks = Math.ceil(base64.length / 4096)
            for (var _a_ = i = 1, _b_ = chunks; (_a_ <= _b_ ? i < chunks : i > chunks); (_a_ <= _b_ ? ++i : --i))
            {
                chunk = base64.slice(i * 4096, typeof _k_.min((i + 1) * 4096,base64.length) === 'number' ? _k_.min((i + 1) * 4096,base64.length) : -1)
                this.write(`\x1b_Gq=1,m=${((i === chunks - 1) ? 0 : 1)};${chunk}\x1b\\`)
            }
        }
        else
        {
            return this.write(`\x1b_Gq=1,i=${id},p=${id},f=${8 * bytesperpixel},s=${w},v=${h};${base64}\x1b\\`)
        }
    }

    TTIO.prototype["setCursor"] = function (x, y)
    {
        return this.write(`\x1b[${y + 1};${x + 1}H`)
    }

    TTIO.prototype["requestCursor"] = function ()
    {
        return this.write("\x1b[6n")
    }

    TTIO.prototype["hideCursor"] = function ()
    {
        return this.write('\x1b[?25l')
    }

    TTIO.prototype["showCursor"] = function (show = true)
    {
        if (show)
        {
            return this.write('\x1b[?25h')
        }
        else
        {
            return this.hideCursor()
        }
    }

    TTIO.prototype["store"] = function ()
    {
        return this.write('\x1b7')
    }

    TTIO.prototype["restore"] = function ()
    {
        return this.write('\x1b8')
    }

    TTIO.prototype["onResize"] = function ()
    {
        this.emit('preResize')
        return this.write('\x1b[14t')
    }

    TTIO.prototype["parseKitty"] = function (csi, data)
    {
        var char, code, combo, di, event, key, mbit, mods, splt, type

        if (!(_k_.in(csi.slice(-1)[0],'uABCDFH~')))
        {
            if (_k_.in(':3u',csi))
            {
                console.log('?????',data.length)
                for (var _a_ = di = 1, _b_ = data.length; (_a_ <= _b_ ? di < data.length : di > data.length); (_a_ <= _b_ ? ++di : --di))
                {
                    console.log(`${di} 0x${data[di].toString(16)} ${String.fromCodePoint(data[di])}`)
                }
            }
            return
        }
        key = ((function ()
        {
            switch (csi.slice(-1)[0])
            {
                case 'A':
                    return 'up'

                case 'B':
                    return 'down'

                case 'D':
                    return 'left'

                case 'C':
                    return 'right'

                case 'H':
                    return 'home'

                case 'F':
                    return 'end'

            }

        }).bind(this))()
        if (csi.slice(-1)[0] === '~')
        {
            key = ((function ()
            {
                switch (csi.slice(0, -1).split(';')[0])
                {
                    case '3':
                        return 'entf'

                    case '5':
                        return 'pageup'

                    case '6':
                        return 'pagedown'

                    case '13':
                        return 'f3'

                    case '15':
                        return 'f5'

                    case '17':
                        return 'f6'

                    case '18':
                        return 'f7'

                    case '19':
                        return 'f8'

                }

            }).bind(this))()
        }
        char = ''
        if (csi.slice(-1)[0] === 'u')
        {
            code = parseInt(csi)
            if (_k_.empty(code))
            {
                return
            }
            key = ((function ()
            {
                switch (code)
                {
                    case 9:
                        return 'tab'

                    case 27:
                        return 'esc'

                    case 32:
                        return 'space'

                    case 13:
                        return 'return'

                    case 127:
                        return 'delete'

                    case 57441:
                        return 'shift'

                    case 57442:
                        return 'ctrl'

                    case 57443:
                        return 'alt'

                    case 57444:
                        return 'cmd'

                    default:
                        return String.fromCodePoint(code)
                }

            }).bind(this))()
            char = ((function ()
            {
                switch (key)
                {
                    case 'tab':
                        return '\t'

                    case 'return':
                        return '\n'

                    case 'space':
                        return ' '

                    default:
                        return ''
                }

            }).bind(this))()
        }
        mods = []
        type = 'press'
        splt = csi.slice(0, -1).split(';')
        if (splt.length > 1)
        {
            if (splt[1].endsWith(':2'))
            {
                type = 'repeat'
            }
            if (splt[1].endsWith(':3'))
            {
                type = 'release'
            }
            if (splt.length > 2)
            {
                code = parseInt(splt[2])
                if (!_k_.empty(code))
                {
                    char = String.fromCodePoint(code)
                }
            }
            mbit = parseInt(splt[1]) - 1
            if (mbit & 0x1)
            {
                mods.push('shift')
            }
            if (mbit & 0x4)
            {
                mods.push('ctrl')
            }
            if (mbit & 0x2)
            {
                mods.push('alt')
            }
            if (mbit & 0x8)
            {
                mods.push('cmd')
            }
        }
        if (!(_k_.in(key,mods)))
        {
            mods.push(key)
        }
        combo = mods.join('+')
        event = {key:key,combo:combo,type:type,char:char}
        return event
    }

    TTIO.prototype["parseCsi"] = function (csi)
    {
        switch (csi)
        {
            case 'H':
                return this.keyEventForCombo('home')

            case 'F':
                return this.keyEventForCombo('end')

            case '3~':
                return this.keyEventForCombo('entf')

            case '5~':
                return this.keyEventForCombo('pageup')

            case '6~':
                return this.keyEventForCombo('pagedown')

            case 'Z':
                return this.keyEventForCombo('shift+z','Z')

            case 'Q':
                return this.keyEventForCombo('f2')

            case 'S':
                return this.keyEventForCombo('f4')

            case 'I':
                this.hasFocus = true
                this.activeMods = {}
                post.emit('window.focus')
                return {type:'focus'}

            case 'O':
                this.hasFocus = false
                this.activeMods = {}
                post.emit('window.blur')
                return {type:'focus'}

        }

        return null
    }

    TTIO.prototype["parseEsc"] = function (esc)
    {
        var code, combo, event, key

        if (esc.length === 1)
        {
            code = esc.charCodeAt(0)
            if ((1 <= code && code <= 26))
            {
                key = String.fromCharCode(code + 96)
                return this.keyEventForCombo(`alt+cmd+${key}`)
            }
            if (esc === '\\')
            {
                return
            }
            if ((32 <= code && code <= 126))
            {
                key = esc.toLowerCase()
                combo = 'alt'
                if (esc !== key)
                {
                    combo += '+shift'
                }
                combo += `+${key}`
                return this.keyEventForCombo(combo,esc)
            }
        }
        else
        {
            if (esc.startsWith('_G'))
            {
                return
            }
        }
        switch (esc)
        {
            case 'OP':
                return this.keyEventForCombo('f1')

            case 'OQ':
                return this.keyEventForCombo('f2')

            case 'OR':
                return this.keyEventForCombo('f3')

            case 'OS':
                return this.keyEventForCombo('f4')

            default:
                console.log('esc',esc.charCodeAt(0),esc.length)
        }

        if (event = this.keyEventForChar(esc))
        {
            return event
        }
        console.log('---- esc',esc)
        return null
    }

    TTIO.prototype["parseRaw"] = function (raw)
    {
        var char, event

        if (raw.length === 1)
        {
            switch (raw[0])
            {
                case 0x9:
                    return this.keyEventForCombo('tab')

                case 0xd:
                    return this.keyEventForCombo('return','\n')

                case 0x1b:
                    return this.keyEventForCombo('esc')

                case 0x7f:
                    return this.keyEventForCombo('delete')

            }

            if ((0x1 <= raw[0] && raw[0] <= 0x1a))
            {
                return this.keyEventForCombo(`ctrl+${String.fromCharCode(raw[0] + 96)}`)
            }
            char = raw.toString('utf8')
            if (event = this.keyEventForChar(char))
            {
                return event
            }
            if (raw[0] > 127)
            {
                raw[0] -= 128
                return parseEsc(raw.toString,'utf8')
            }
        }
    }

    TTIO.prototype["keyEventForChar"] = function (char)
    {
        var key

        if (char.length)
        {
            key = char.toLowerCase()
            return {key:key,type:'press',combo:(key !== char ? 'shift' : ''),char:char}
        }
    }

    TTIO.prototype["keyEventForCombo"] = function (combo, char = '')
    {
        return {key:combo.split('+').slice(-1)[0],type:'press',combo:combo,char:char}
    }

    TTIO.prototype["onPointer"] = function (style)
    {
        if (style !== this.pointerStyle)
        {
            this.pointerStyle = style
            return this.setPointerStyle(this.pointerStyle)
        }
    }

    TTIO.prototype["setPointerStyle"] = function (pointerStyle = 'pointer')
    {
        return this.write(`\x1b]22;${pointerStyle}\x1b\\`)
    }

    TTIO.prototype["parseMouse"] = function (csi)
    {
        var code, cx, cy, event, m, mods, px, py

        var _a_ = csi.slice(1, -1).split(';').map(function (s)
        {
            return parseInt(s)
        }); code = _a_[0]; px = _a_[1]; py = _a_[2]

        if (_k_.empty(this.cellsz))
        {
            return
        }
        cx = parseInt(px / this.cellsz[0])
        cy = parseInt(py / this.cellsz[1])
        event = {type:'release',cell:[cx,cy],pixel:[px,py]}
        mods = []
        if (code & 0b00100)
        {
            mods.push('shift')
        }
        if (code & 0b01000)
        {
            mods.push('alt')
        }
        if (code & 0b10000)
        {
            mods.push('ctrl')
        }
        if (!_k_.empty(mods))
        {
            event.mods = mods.join('+')
        }
        var list = ['shift','ctrl','alt','cmd']
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            m = list[_b_]
            event[m] = (_k_.in(m,mods))
        }
        if (csi.endsWith('M'))
        {
            event.type = ((function ()
            {
                switch (code & 0b11100000)
                {
                    case 32:
                        return (((code & 0b11) === 3) ? 'move' : 'drag')

                    case 64:
                        return 'wheel'

                    case 0:
                        return 'press'

                }

            }).bind(this))()
        }
        else
        {
            event.type = ((function ()
            {
                switch (code)
                {
                    case 35:
                        return 'move'

                    default:
                        return 'release'
                }

            }).bind(this))()
        }
        if (event.type === 'wheel')
        {
            event.dir = ((function ()
            {
                switch (code & 0b11)
                {
                    case 0:
                        return 'up'

                    case 1:
                        return 'down'

                    case 2:
                        return 'left'

                    case 3:
                        return 'right'

                }

            }).bind(this))()
        }
        else if ((code & 0b11) !== 3)
        {
            event.button = ((function ()
            {
                switch (code & 0b11)
                {
                    case 0:
                        return 'left'

                    case 1:
                        return 'middle'

                    case 2:
                        return 'right'

                }

            }).bind(this))()
        }
        return event
    }

    TTIO.prototype["emitMouseEvent"] = function (event)
    {
        var diff, _590_23_, _611_20_

        if (event.type === 'press')
        {
            this.lastClick = ((_590_23_=this.lastClick) != null ? _590_23_ : {x:event.cell[0],y:event.cell[1],count:0,time:process.hrtime()})
            if (this.lastClick.x === event.cell[0] && this.lastClick.y === event.cell[1])
            {
                diff = process.hrtime(this.lastClick.time)
                this.lastClick.time = process.hrtime()
                if (diff[0] < 1 && diff[1] < 500000000)
                {
                    this.lastClick.count += 1
                }
                else
                {
                    this.lastClick.count = 1
                }
            }
            else
            {
                this.lastClick.x = event.cell[0]
                this.lastClick.y = event.cell[1]
                this.lastClick.count = 1
                this.lastClick.time = process.hrtime()
            }
            event.count = this.lastClick.count
        }
        this.lastPixels = ((_611_20_=this.lastPixels) != null ? _611_20_ : [])
        if (this.lastPixels.length >= 4)
        {
            event.delta = [event.pixel[0] - this.lastPixels[0][0],event.pixel[1] - this.lastPixels[0][1]]
        }
        this.lastPixels.push(event.pixel)
        if (this.lastPixels.length > 4)
        {
            this.lastPixels.shift()
        }
        event.cmd = this.activeMods.cmd
        return this.emit('mouse',event)
    }

    TTIO.prototype["parseData"] = function (data)
    {
        var e, raw, s, seq, seqs, type

        seqs = []
        s = 0
        while (s < data.length)
        {
            type = data[s] === 0x1b && data[s + 1] === 0x5b ? 'csi' : data[s] === 0x1b ? 'esc' : 'raw'
            e = s + 1
            if (type === 'csi')
            {
                e = s + 2
                while (e < data.length)
                {
                    if ((0x40 <= data[e] && data[e] <= 0x7e))
                    {
                        break
                    }
                    e += 1
                }
                e = _k_.min(e + 1,data.length)
            }
            else
            {
                while (e < data.length)
                {
                    if (data[e] === 0x1b)
                    {
                        break
                    }
                    e += 1
                }
            }
            raw = data.slice(s, typeof e === 'number' ? e : -1)
            seq = {type:type,data:raw}
            switch (type)
            {
                case 'csi':
                    seq.csi = data.slice(s + 2, typeof e === 'number' ? e : -1).toString('utf8')
                    break
                case 'esc':
                    seq.esc = data.slice(s + 1, typeof e === 'number' ? e : -1).toString('utf8')
                    break
                case 'raw':
                    seq.raw = raw.toString('utf8')
                    break
            }

            s = e
            seqs.push(seq)
        }
        if (seq.length > 1)
        {
            console.log(`multiseq ${seq.length}`)
        }
        return seqs
    }

    TTIO.prototype["onData"] = function (data)
    {
        var content, csi, end, endMarker, esc, event, pxs, raw, rest, seq, start, startMarker, text, _673_23_

        startMarker = Buffer.from('\x1b[200~')
        endMarker = Buffer.from('\x1b[201~')
        if ((this.pasteBuffer != null))
        {
            this.pasteBuffer = Buffer.concat([this.pasteBuffer,data])
            end = this.pasteBuffer.indexOf(endMarker)
            if (end >= 0)
            {
                text = this.pasteBuffer.slice(0, typeof end === 'number' ? end : -1).toString('utf8')
                rest = this.pasteBuffer.slice(end + 6)
                this.emit('paste',kstr.clean(text))
                delete this.pasteBuffer
                if (rest.length)
                {
                    this.onData(rest)
                }
            }
            return
        }
        start = data.indexOf(startMarker)
        if (start >= 0)
        {
            if (start > 0)
            {
                this.onData(data.slice(0, typeof start === 'number' ? start : -1))
            }
            content = data.slice(start + 6)
            end = content.indexOf(endMarker)
            if (end >= 0)
            {
                this.emit('paste',kstr.clean(content.slice(0, typeof end === 'number' ? end : -1).toString('utf8')))
                rest = content.slice(end + 6)
                if (rest.length)
                {
                    this.onData(rest)
                }
            }
            else
            {
                this.pasteBuffer = content
            }
            return
        }
        var list = _k_.list(this.parseData(data))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            seq = list[_a_]
            data = seq.data
            csi = seq.csi
            esc = seq.esc
            raw = seq.raw
            if (csi)
            {
                if (csi.startsWith('4;') && csi.endsWith('t'))
                {
                    pxs = csi.slice(2, -1).split(';').map(function (p)
                    {
                        return parseInt(p)
                    })
                    this.pixels = [pxs[1],pxs[0]]
                    this.cellsz = [parseInt(this.pixels[0] / this.cols()),parseInt(this.pixels[1] / this.rows())]
                    this.emit('resize',this.cols(),this.rows(),this.pixels,this.cellsz)
                    continue
                }
                if (csi.startsWith('<') && (_k_.in(csi.slice(-1)[0],'Mm')))
                {
                    if (event = this.parseMouse(csi))
                    {
                        this.emitMouseEvent(event)
                        continue
                    }
                    console.log('unhandled mouse event?',csi)
                    continue
                }
                if (event = this.parseKitty(csi,data))
                {
                    if (event.type === 'release')
                    {
                        if (_k_.in(event.key,this.modifiers))
                        {
                            this.activeMods[event.key] = false
                        }
                        this.emit('release',event.combo,event)
                        continue
                    }
                    else
                    {
                        if (_k_.in(event.key,this.modifiers))
                        {
                            this.activeMods[event.key] = true
                        }
                        this.emit('key',event.combo,event)
                        continue
                    }
                }
                if (event = this.parseCsi(csi))
                {
                    if (_k_.in(event.type,['press','repeat']))
                    {
                        this.emit('key',event.combo,event)
                        continue
                    }
                    if (event.type === 'release')
                    {
                        console.log(`ignored csi key release ${_k_.noon(event)}`)
                        continue
                    }
                    if (event.type === 'focus')
                    {
                        continue
                    }
                }
            }
            else if (esc)
            {
                if (event = this.parseEsc(esc))
                {
                    if (_k_.in(event.type,['press','repeat']))
                    {
                        this.emit('key',event.combo,event)
                        continue
                    }
                }
                if (esc === '\\')
                {
                    continue
                }
                if (esc.startsWith('_G'))
                {
                    continue
                }
            }
            else
            {
                if (event = this.parseRaw(data))
                {
                    if (_k_.in(event.type,['press','repeat']))
                    {
                        this.emit('key',event.combo,event)
                        continue
                    }
                }
                text = data.toString('utf8')
                if (text.length > 1)
                {
                    this.emit('paste',kstr.clean(text))
                    continue
                }
            }
        }
    }

    return TTIO
})()

export default TTIO;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHRpby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9zY3JlZW4vdHRpby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O09BQ2EsVUFBQTtJQUFRO0lBQU87SUFBSztJQUFLOztPQUNqQixnQkFBVjs7T0FDVSxjQUFBOzs7QUFDcEIsUUFBRDs7cUJBQU07YUFNRixNQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFFQyxPQUFBLGNBQUE7UUFFQSxLQUFDLHFCQUFXLElBQUksOEJBQVc7UUFDM0IsS0FBQyxrQkFBVyxJQUFJLDJCQUFRO1FBQ3hCLEtBQUMsdUJBQWEsSUFBSSxpQ0FBaUIsS0FBQztRQUVwQyxpQkFBTyxJQUFJLDBCQUFPO1FBQ2xCLGlCQUFPLElBQUksMEJBQU87YUFFWCxtQkFBZSxRQUFRLElBQUk7O1lBQzlCLGdCQUFXLFFBQVEsSUFBSTs7YUFDcEIsbUJBQWUsUUFBUSxJQUFJOztZQUM5QixnQkFBVyxRQUFRLElBQUk7O1lBRWQsU0FBUSxRQUFRLE9BQU87O1lBQXBDLE9BQU87O1lBQ00sU0FBUSxRQUFRLE9BQU87O1lBQXBDLE9BQU87O1FBRVAsS0FBQyxRQUFRLEtBQUs7UUFFZCxLQUFDO1FBQ0QsS0FBQztRQUVELEtBQUMsV0FBVztRQUVaLEtBQUMsU0FBYTtRQUNkLEtBQUM7UUFDRCxLQUFDO1FBQ0QsS0FBQztRQUNELEtBQUM7UUFFRCxLQUFDLGFBQWMsTUFBTSxPQUFPLE1BQU07UUFDbEMsS0FBQztRQUVELE9BQU8sV0FBVztZQUVmLEtBQUM7O1lBRUEsS0FBQyxRQUFRLEtBQUMsVUFBYyxRQUFRLE1BQU07WUFFdEMsS0FBQztnQkFFRSxLQUFDOztnQkFDQSxRQUFRLE1BQU0sR0FBRyxPQUFPLEtBQUM7Z0JBQ3pCLFFBQVEsTUFBTSxHQUFHLE1BQU8sS0FBQzs7WUFFN0IsV0FBVyxLQUFDLGlCQUFpQjs7OztZQUk3QixLQUFDO1lBRUQsS0FBQztnQkFFRSxRQUFRLE1BQU07O2dCQUFR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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/screen/ttio.kode
