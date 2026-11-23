var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, noon: function (obj) { 
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
let nfs = kxk.nfs

import keyscript from "../../util/keyscript.js"

import rounded from "../../util/img/rounded.js"


TTIO = (function ()
{
    _k_.extend(TTIO, events)
    function TTIO (opt)
    {
        var cols, rows, _15_33_, _16_30_, _17_37_, _19_24_, _20_24_, _53_33_, _66_39_

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
        this["syncEnd"] = this["syncEnd"].bind(this)
        this["syncStart"] = this["syncStart"].bind(this)
        this["showCursor"] = this["showCursor"].bind(this)
        this["hideCursor"] = this["hideCursor"].bind(this)
        this["requestCursor"] = this["requestCursor"].bind(this)
        this["setCursor"] = this["setCursor"].bind(this)
        this["hideStaleImgs"] = this["hideStaleImgs"].bind(this)
        this["onEnd"] = this["onEnd"].bind(this)
        this["play"] = this["play"].bind(this)
        this["steps"] = this["steps"].bind(this)
        this["onInputData"] = this["onInputData"].bind(this)
        this["onHeadlessResize"] = this["onHeadlessResize"].bind(this)
        this["liveSize"] = this["liveSize"].bind(this)
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
            this.live = opt.live && process.stdin.isTTY
            this.input = this.input && !process.stdin.isTTY
            this.cellsz = ((_53_33_=opt.cellsz) != null ? _53_33_ : [10,20])
            if (this.input)
            {
                process.stdin.on('data',this.onInputData)
                process.stdin.on('end',this.onEnd)
            }
            if (this.live)
            {
                process.stdin.setRawMode(true)
                process.stdout.write('\x1b[?1049h\x1b[?7l\x1b[>1u\x1b[=31;1u')
                process.on('exit',function ()
                {
                    process.stdout.write('\x1b[<u\x1b[?7h\x1b[?1049l')
                    return process.stdin.setRawMode(false)
                })
                process.stdin.on('data',(function (data)
                {
                    return this.emit('live',data)
                }).bind(this))
                this.reserve = ((_66_39_=opt.reserve) != null ? _66_39_ : 0)
                this.liveSize()
                process.stdout.on('resize',(function ()
                {
                    this.liveSize()
                    return this.onHeadlessResize()
                }).bind(this))
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
        this.syncEnd()
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

    TTIO.prototype["liveSize"] = function ()
    {
        this.size = [process.stdout.columns,_k_.max(1,process.stdout.rows - this.reserve)]
        return process.stdout.write('\x1b[14t')
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
        var _204_19_

        this.overlayID = ((_204_19_=this.overlayID) != null ? _204_19_ : this.sendImg(rounded.rect(300,400,0,[255,255,255,2])))
        return this.placeOverlay(this.overlayID,id,x,y,py,pw,ph)
    }

    TTIO.prototype["placeCellRectOverlay"] = function (id, x, y, py, pw, ph)
    {
        var _210_27_

        this.cellRectOverlayID = ((_210_27_=this.cellRectOverlayID) != null ? _210_27_ : this.sendImg(rounded.rect(300,400,0,[255,255,255,100])))
        return this.placeOverlay(this.cellRectOverlayID,id,x,y,py,pw,ph)
    }

    TTIO.prototype["placeOverlay"] = function (imgId, id, x, y, py, pw, ph)
    {
        var cy, oy

        cy = y + parseInt(py / this.cellsz[1])
        oy = py % this.cellsz[1]
        this.setCursor(x,cy)
        return this.write(`\x1b_Gq=1,a=p,i=${imgId},p=${id},X=0,Y=${oy},w=${pw},h=${ph},z=1000,C=1\x1b\\`)
    }

    TTIO.prototype["hideImageOverlay"] = function (id)
    {
        return this.hideOverlay(this.overlayID,id)
    }

    TTIO.prototype["hideCellRectOverlay"] = function (id)
    {
        return this.hideOverlay(this.cellRectOverlayID,id)
    }

    TTIO.prototype["hideOverlay"] = function (imgId, id)
    {
        if (_k_.empty(imgId))
        {
            return
        }
        return this.write(`\x1b_Gq=1,a=d,d=i,i=${imgId},p=${id}\x1b\\`)
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
        var placed, _257_32_, _267_16_, _270_28_

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
            this.placedImgs[img.id] = ((_257_32_=this.placedImgs[img.id]) != null ? _257_32_ : {})
            this.placedImgs[img.id][[x,y,px,py,pw,ph]] = placed
            return [img.id,placed]
        }
        if (placed = (this.placedImgs[img.id] != null ? this.placedImgs[img.id][[x,y,px,py,pw,ph]] : undefined))
        {
            return [img.id,placed]
        }
        img.pid = ((_267_16_=img.pid) != null ? _267_16_ : 0)
        img.pid++
        this.placedImgs[img.id] = ((_270_28_=this.placedImgs[img.id]) != null ? _270_28_ : {})
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

    TTIO.prototype["hideStaleImgs"] = function (z)
    {
        var args, iid, plid, pos, posplids

        for (iid in this.lastplImgs)
        {
            posplids = this.lastplImgs[iid]
            for (pos in posplids)
            {
                plid = posplids[pos]
                args = this.plargs[[iid,plid]]
                if (_k_.empty(args))
                {
                    continue
                }
                if (args[6] !== z)
                {
                    continue
                }
                if ((this.placedImgs[iid] != null ? this.placedImgs[iid][pos] : undefined))
                {
                    continue
                }
                this.hideImg(iid,plid)
                delete this.lastplImgs[iid][pos]
            }
        }
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

    TTIO.prototype["syncStart"] = function ()
    {
        return this.write('\x1b[?2026h')
    }

    TTIO.prototype["syncEnd"] = function ()
    {
        return this.write('\x1b[?2026l')
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
        if (_k_.empty(char) && key.length === 1 && key.charCodeAt(0) >= 32 && !(_k_.in('ctrl',mods) || _k_.in('alt',mods) || _k_.in('cmd',mods)))
        {
            if (_k_.in('shift',mods))
            {
                char = key.toUpperCase()
            }
            else
            {
                char = key
            }
        }
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
        var combo, key

        if (char.length)
        {
            key = char.toLowerCase()
            combo = (key === char ? char : `shift+${key}`)
            return {key:key,type:'press',combo:combo,char:char}
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
        var diff, _648_23_, _669_20_

        if (event.type === 'press')
        {
            this.lastClick = ((_648_23_=this.lastClick) != null ? _648_23_ : {x:event.cell[0],y:event.cell[1],count:0,time:process.hrtime()})
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
        this.lastPixels = ((_669_20_=this.lastPixels) != null ? _669_20_ : [])
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
        var char, cols, content, csi, end, endMarker, esc, event, pxs, raw, recent, rest, rows, seq, start, startMarker, text

        startMarker = Buffer.from('\x1b[200~')
        endMarker = Buffer.from('\x1b[201~')
        if (this.pasting)
        {
            recent = data
            if (this.pasteTail)
            {
                recent = Buffer.concat([this.pasteTail,data])
            }
            end = recent.indexOf(endMarker)
            if (end < 0)
            {
                this.pasteTail = recent.slice(-5)
                return
            }
            rest = recent.slice(end + 6)
            delete this.pasting
            delete this.pasteTail
            this.emit('paste')
            if (rest.length)
            {
                this.onData(rest)
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
                this.emit('paste')
                rest = content.slice(end + 6)
                if (rest.length)
                {
                    this.onData(rest)
                }
            }
            else
            {
                this.pasting = true
                this.pasteTail = content.slice(-5)
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
                    cols = (this.live ? process.stdout.columns : this.cols())
                    rows = (this.live ? process.stdout.rows : this.rows())
                    this.cellsz = [parseInt(this.pixels[0] / cols),parseInt(this.pixels[1] / rows)]
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
                var list1 = _k_.list(Array.from(text))
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    char = list1[_b_]
                    if (event = this.parseRaw(Buffer.from(char)))
                    {
                        this.emit('key',event.combo,event)
                    }
                    else if (event = this.keyEventForChar(char))
                    {
                        this.emit('key',event.combo,event)
                    }
                }
                continue
            }
        }
    }

    return TTIO
})()

export default TTIO;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHRpby5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9zY3JlZW4vdHRpby5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O09BQ2EsVUFBQTtJQUFRO0lBQU87SUFBSzs7T0FDWixnQkFBVjs7T0FDVSxjQUFBOzs7QUFDcEIsUUFBRDs7cUJBQU07YUFNRixNQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBRUMsT0FBQSxjQUFBO1FBRUEsS0FBQyxxQkFBVyxJQUFJLDhCQUFXO1FBQzNCLEtBQUMsa0JBQVcsSUFBSSwyQkFBUTtRQUN4QixLQUFDLHVCQUFhLElBQUksaUNBQWlCLEtBQUM7UUFFcEMsaUJBQU8sSUFBSSwwQkFBTztRQUNsQixpQkFBTyxJQUFJLDBCQUFPO2FBRVgsbUJBQWUsUUFBUSxJQUFJOztZQUM5QixnQkFBVyxRQUFRLElBQUk7O2FBQ3BCLG1CQUFlLFFBQVEsSUFBSTs7WUFDOUIsZ0JBQVcsUUFBUSxJQUFJOztZQUVkLFNBQVEsUUFBUSxPQUFPOztZQUFwQyxPQUFPOztZQUNNLFNBQVEsUUFBUSxPQUFPOztZQUFwQyxPQUFPOztRQUVQLEtBQUMsUUFBUSxLQUFLO1FBRWQsS0FBQztRQUNELEtBQUM7UUFFRCxLQUFDLFdBQVc7UUFFWixLQUFDLFNBQWE7UUFDZCxLQUFDO1FBQ0QsS0FBQztRQUNELEtBQUM7UUFDRCxLQUFDO1FBRUQsS0FBQyxhQUFjLE1BQU0sT0FBTyxNQUFNO1FBQ2xDLEtBQUM7UUFFRCxPQUFPLFdBQVc7WUFFZixLQUFDOztZQUVBLEtBQUMsT0FBUSxJQUFJLFFBQVMsUUFBUSxNQUFNO1lBQ3BDLEtBQUMsUUFBUSxLQUFDLFVBQWMsUUFBUSxNQUFNO1lBRXRDLEtBQUMsbUJBQVMsSUFBSSw2QkFBVSxHQUFHO2dCQUV4QixLQUFDOztnQkFDQSxRQUFRLE1BQU0sR0FBRyxPQUFPLEtBQUM7Z0JBQ3pCLFFBQVEsTUFBTSxHQUFHLE1BQU8sS0FBQzs7Z0JBRTFCLEtBQUM7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/screen/ttio.kode
