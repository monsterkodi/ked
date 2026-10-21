var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, noon: function (obj) { 
    var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; 
    var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; 
    var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = '|'+k+'|' } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; 
    var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; 
    return toStr(obj);
}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        var cols, rows, _26_33_, _27_30_, _29_24_, _30_24_

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
        this["quit"] = this["quit"].bind(this)
        this["written"] = this["written"].bind(this)
        this["write"] = this["write"].bind(this)
        opt = (opt != null ? opt : {})
        this.headless = ((_26_33_=opt.headless) != null ? _26_33_ : false)
        this.input = ((_27_30_=opt.input) != null ? _27_30_ : true)
        cols = ((_29_24_=opt.cols) != null ? _29_24_ : 0)
        rows = ((_30_24_=opt.rows) != null ? _30_24_ : 0)
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

    TTIO.prototype["quit"] = function ()
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
        var placed, _259_32_, _263_16_, _266_28_

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
            this.placedImgs[img.id] = ((_259_32_=this.placedImgs[img.id]) != null ? _259_32_ : {})
            this.placedImgs[img.id][[x,y,px,py,pw,ph]] = placed
            return
        }
        img.pid = ((_263_16_=img.pid) != null ? _263_16_ : 0)
        img.pid++
        this.placedImgs[img.id] = ((_266_28_=this.placedImgs[img.id]) != null ? _266_28_ : {})
        this.placedImgs[img.id][[x,y,px,py,pw,ph].toString()] = img.pid
        z = (z != null ? z : 1000)
        return this.write(`\x1b_Gq=1,a=p,i=${img.id},p=${img.pid},X=${px},Y=${py},w=${pw},h=${ph},z=${z},C=1\x1b\\`)
    }

    TTIO.prototype["hideImg"] = function (id, pl)
    {
        return this.write(`\x1b_Gq=1,a=d,d=i,i=${id},p=${pl}\x1b\\`)
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
        var code, event, key

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
        var diff, _635_23_, _656_20_

        if (event.type === 'press')
        {
            this.lastClick = ((_635_23_=this.lastClick) != null ? _635_23_ : {x:event.cell[0],y:event.cell[1],count:0,time:process.hrtime()})
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
        this.lastPixels = ((_656_20_=this.lastPixels) != null ? _656_20_ : [])
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
        var csi, dataStr, esc, event, pxs, raw, seq, text, _727_23_

        if ((this.pasteBuffer != null))
        {
            dataStr = data.toString('utf8')
            if (dataStr.endsWith('\x1b[201~'))
            {
                this.pasteBuffer += data.slice(0, -6).toString('utf8')
                console.log('tty paste end',_k_.noon((this.pasteBuffer)))
                this.emit('paste',kstr.clean(this.pasteBuffer))
                delete this.pasteBuffer
            }
            else
            {
                this.pasteBuffer += dataStr
                console.log('tty paste cont',_k_.noon((this.pasteBuffer)))
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
                if (csi.startsWith('200~'))
                {
                    this.pasteBuffer = data.slice(6).toString('utf8')
                    console.log('tty paste start',_k_.noon((this.pasteBuffer)))
                    continue
                }
                if (csi.startsWith('201~'))
                {
                    console.log('tty paste end',_k_.noon((this.pasteBuffer)))
                    this.emit('paste',kstr.clean(this.pasteBuffer))
                    delete this.pasteBuffer
                    continue
                }
                if (csi.startsWith('<') && _k_.in(csi.slice(-1)[0],'Mm'))
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
                    console.log('paste?',text)
                    continue
                }
            }
        }
    }

    return TTIO
})()

export default TTIO;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHRpby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9zY3JlZW4vdHRpby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFnQnNCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBSWQsT0FBQSxjQUFBO1FBS0EsS0FBQyxxQkFBVyxJQUFJLDhCQUFXO1FBQzNCLEtBQUMsa0JBQVcsSUFBSSwyQkFBUTtRQUV4QixpQkFBTyxJQUFJLDBCQUFPO1FBQ2xCLGlCQUFPLElBQUksMEJBQU87YUFFWCxtQkFBZSxRQUFRLElBQUk7O1lBQzlCLGdCQUFXLFFBQVEsSUFBSTs7YUFDcEIsbUJBQWUsUUFBUSxJQUFJOztZQUM5QixnQkFBVyxRQUFRLElBQUk7O1lBRWQsU0FBUSxRQUFRLE9BQU87O1lBQXBDLE9BQU87O1lBQ00sU0FBUSxRQUFRLE9BQU87O1lBQXBDLE9BQU87O1FBRVAsS0FBQyxRQUFRLEtBQUs7UUFFZCxLQUFDO1FBQ0QsS0FBQztRQUVELEtBQUMsV0FBVztRQUVaLEtBQUMsU0FBYTtRQUNkLEtBQUM7UUFDRCxLQUFDO1FBRUQsS0FBQyxhQUFjLE1BQU0sT0FBTyxNQUFNO1FBQ2xDLEtBQUM7UUFFRCxPQUFPLFdBQVc7WUFFZixLQUFDOztZQUtBLEtBQUMsUUFBUSxLQUFDLFVBQWMsUUFBUSxNQUFNO1lBS3RDLEtBQUM7Z0JBRUUsS0FBQzs7Z0JBQ0EsUUFBUSxNQUFNLEdBQUcsT0FBTyxLQUFDO2dCQUN6QixRQUFRLE1BQU0sR0FBRyxNQUFPLEtBQUM7O1lBRTdCLFdBQVcsS0FBQyxpQkFBaUI7Ozs7WUFJN0IsS0FBQztZQUVELEtBQUM7Z0JBRUUsUUFBUSxNQUFNOztnQkFBUSxRQUFRLE1BQU0sV0FBVzs7WUFFbEQsS0FBQyxNQUFNO1lBQ1AsS0FBQyxNQUFNO1lBQ1AsS0FBQyxNQUFNO1lBQ1AsS0FBQyxNQUFNO1lBQ1AsS0FBQyxNQUFNO1lBQ1AsS0FBQyxNQUFNO1lBQ1AsS0FB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/screen/ttio.kode
