var _k_ = {noon: function (obj) { 
    var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; 
    var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; 
    var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = '|'+k+'|' } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; 
    var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; 
    return toStr(obj);
}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, each_r: function (o) {return Array.isArray(o) ? [] : typeof o == 'string' ? o.split('') : {}}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isFunc: function (o) {return typeof o === 'function'}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, isArr: function (o) {return Array.isArray(o)}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}};_k_.R4=_k_.k.B256(_k_.k.R(4))

var kolorNames, Renderer

import kstr from "../kxk/kstr.js"
import slash from "../kxk/slash.js"

import utils from "./utils.js"
let firstLineCol = utils.firstLineCol
let lastLineCol = utils.lastLineCol

import print from "./print.js"

import srcmap from "./srcmap.js"

kolorNames = ['r','g','b','c','m','y','w']

Renderer = (function ()
{
    function Renderer (kode)
    {
        this.kode = kode
    
        var _13_30_, _14_30_, _17_42_, _17_64_, _17_85_

        this["plain"] = this["plain"].bind(this)
        this["mark"] = this["mark"].bind(this)
        this.debug = (this.kode.args != null ? this.kode.args.debug : undefined)
        this.verbose = (this.kode.args != null ? this.kode.args.verbose : undefined)
        this.hint = {_k_:{}}
        this.varstack = []
        this.trace = this.verbose || (this.kode.args != null ? this.kode.args.tokens : undefined) || (this.kode.args != null ? this.kode.args.block : undefined) || (this.kode.args != null ? this.kode.args.parse : undefined)
    }

    Renderer.prototype["onError"] = function (msg, info)
    {
        return this.kode.onError(msg,info)
    }

    Renderer.prototype["render"] = function (ast, source, target)
    {
        var cwd, s, sm, vl

        if (this.verbose)
        {
            console.log(_k_.noon(ast))
        }
        this.file = source
        this.name = null
        this.where = null
        if (source && globalThis.process)
        {
            cwd = globalThis.process.cwd()
            this.source = slash.absolute(source,cwd)
            this.where = this.source.startsWith(cwd + '/') ? this.source.slice(cwd.length + 1) : this.source
            if (target)
            {
                this.name = slash.relative(source,slash.dir(target))
            }
        }
        this.srcmap = null
        if (this.kode.args.map && this.source)
        {
            this.srcmap = new srcmap(this.source,this.name)
            this.srcmap.verbose = this.trace
        }
        this.ast = ast
        this.hint = {_k_:{}}
        this.varstack = [ast.vars]
        this.indent = ''
        this.varindex = 0
        this.varcontext = {}
        s = ''
        if (this.kode.args.header)
        {
            s += `// kode ${this.kode.version}\n\n`
        }
        s += 'var _k_\n\n'
        if (!_k_.empty(ast.vars))
        {
            vl = this.sortVars(ast.vars)
            s += `var ${vl}\n\n`
        }
        s += this.nodes(ast.exps,'\n',true)
        if (this.hint.section)
        {
            s = 'var toExport = {}\n' + s
            s += '\ntoExport._test_ = true'
            s += '\nexport default toExport\n'
        }
        s = this.header(s)
        if (this.srcmap)
        {
            s = this.srcmap.strip(s)
            if (this.trace)
            {
                this.srcmap.done(s)
            }
            sm = this.srcmap.generate()
            if (this.trace)
            {
                print.noon(sm)
            }
            s += this.srcmap.jscode(sm)
        }
        else if (this.name)
        {
            s += `\n//# sourceURL=${this.name}\n`
        }
        else if (this.source)
        {
            s += `\n//# sourceURL=file://${this.source}\n`
        }
        return s
    }

    Renderer.prototype["mark"] = function (s, tok)
    {
        if (this.srcmap && tok && !_k_.empty(tok.line))
        {
            return this.srcmap.mark(s,tok)
        }
        else
        {
            return s
        }
    }

    Renderer.prototype["plain"] = function (s)
    {
        if (this.srcmap)
        {
            return this.srcmap.plain(s)
        }
        else
        {
            return s
        }
    }

    Renderer.prototype["header"] = function (s)
    {
        var c, hr, ht, i, kf, ks, ps, u

        if (_k_.empty(Object.keys(this.hint._k_)))
        {
            return s.replace("var _k_\n\n",'')
        }
        kf = {isNum:"function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}",isObj:"function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}",isArr:"function (o) {return Array.isArray(o)}",isStr:"function (o) {return typeof o === 'string' || o instanceof String}",isFunc:"function (o) {return typeof o === 'function'}",isElem:"function (o) {return o != null && typeof o === 'object' && o.nodeType === 1}",list:"function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}",first:"function (o) {return o != null ? o.length ? o[0] : undefined : o}",last:"function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}",min:"function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }",max:"function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }",empty:"function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}",in:"function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}",extend:"function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}",each_r:"function (o) {return Array.isArray(o) ? [] : typeof o == 'string' ? o.split('') : {}}",dbg:"function (f,l,c,m,...a) { console.log(f + ':' + l + ':' + c + (m ? ' ' + m + '\\n' : '\\n') + a.map(function (a) { return _k_.noon(a) }).join(' '))}",profile:"function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = performance.now(); }",profilend:"function (id) { var b = performance.now()-_k_.hrtime[id]; let f=0.001; for (let u of ['s','ms','μs','ns']) { if (u=='ns' || (b*f)>=1) { return console.log(id+' '+Number.parseFloat(b*f).toFixed(1)+' '+u); } f*=1000; }}",assert:"function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}",clamp:"function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }",copy:"function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }",clone:"function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }",eql:"function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }",k:"{ f:(r,g,b)=>'\\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\\x1b[39m',new RegExp('\\\\x1b\\\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\\x1b[49m',new RegExp('\\\\x1b\\\\[49m','g'))}",lpad:"function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}",rpad:"function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}",trim:"function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}",rtrim:"function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}",ltrim:"function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}",dir:"function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }",file:"function () { return import.meta.url.substring(7); }",noon:`function (obj) { 
    var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; 
    var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\\n')) { sp = k.split('\\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /\ \ /.test(k)) { k = '|' + k + '|' }; return k }; 
    var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = '|'+k+'|' } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\\n') }; 
    var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\\n') || ((ind !== '') && '\\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; 
    return toStr(obj);
}`}
        if (this.hint._k_.eql)
        {
            this.hint._k_.isStr = true
            this.hint._k_.list = true
            this.hint._k_.empty = true
        }
        if (this.hint._k_.noon)
        {
            this.hint._k_.in = true
            this.hint._k_.list = true
        }
        if (this.hint._k_.trim)
        {
            this.hint._k_.ltrim = true
            this.hint._k_.rtrim = true
        }
        if (this.hint._k_.clamp)
        {
            this.hint._k_.isNum = true
        }
        if (this.hint._k_.ltrim)
        {
            this.hint._k_.in = true
        }
        if (this.hint._k_.rtrim)
        {
            this.hint._k_.in = true
        }
        if (this.hint._k_.dbg)
        {
            this.hint._k_.noon = true
        }
        hr = (function (o) {
            var r = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (k, v)
            {
                if (kf[k])
                {
                    return [k,`${k}: ${kf[k]}`]
                }
            })(k, o[k])
                if (m != null && m[0] != null)
                {
                    r[m[0]] = m[1]
                }
            }
            return typeof o == 'string' ? r.join('') : r
        })(this.hint._k_)
        ks = Object.values(hr).join(', ')
        ps = ''
        if (this.hint._k_.k)
        {
            var list = _k_.list(kolorNames)
            for (var _b_ = 0; _b_ < list.length; _b_++)
            {
                c = list[_b_]
                for (i = 1; i <= 8; i++)
                {
                    u = c.toUpperCase()
                    if (this.hint._k_[c + i] || this.hint._k_[u + c + (9 - i)])
                    {
                        ps += ';_k_.' + c + i + '=' + `_k_.k.F256(_k_.k.${c}(${i}))`
                    }
                    if (this.hint._k_[u + i] || this.hint._k_[u + c + i])
                    {
                        ps += ';_k_.' + u + i + '=' + `_k_.k.B256(_k_.k.${u}(${i}))`
                    }
                    if (this.hint._k_[u + c + i])
                    {
                        ps += ';_k_.' + u + c + i + '=' + `s=>_k_.${u}${i}(_k_.${c}${9 - i}(s))`
                    }
                }
            }
        }
        ht = `var _k_ = {${ks}}${ps}\n\n`
        s = s.replace("var _k_\n\n",ht)
        return s
    }

    Renderer.prototype["nodes"] = function (nodes, sep = ',', tl)
    {
        var a, i, s, stripped

        if (!(nodes != null))
        {
            if (this.debug)
            {
                console.log('no nodes?!?',this.stack,this.sheap)
            }
            if (this.debug)
            {
                print.ast('no nodes',this.ast)
            }
            return ''
        }
        s = ''
        for (var _a_ = i = 0, _b_ = nodes.length; (_a_ <= _b_ ? i < nodes.length : i > nodes.length); (_a_ <= _b_ ? ++i : --i))
        {
            a = this.atom(nodes[i])
            if (sep[0] === '\n')
            {
                stripped = kstr.lstrip(a)
                if (_k_.in(stripped[0],'(['))
                {
                    a = ';' + a
                }
                else if (stripped.startsWith('function'))
                {
                    a = `(${a})`
                }
            }
            a += i < nodes.length - 1 ? sep : ''
            s += a
        }
        return s
    }

    Renderer.prototype["node"] = function (exp)
    {
        var a, k, s, v, _198_19_, _198_33_

        if (!exp)
        {
            return ''
        }
        if ((exp.type != null) && (exp.text != null))
        {
            return this.mark(this.token(exp),exp)
        }
        if (exp instanceof Array)
        {
            return (function () { var r_a_ = []; var list = _k_.list(exp); for (var _b_ = 0; _b_ < list.length; _b_++)  { a = list[_b_];r_a_.push(this.node(a))  } return r_a_ }).bind(this)().join(';\n')
        }
        s = ''
        for (k in exp)
        {
            v = exp[k]
            if (_k_.isFunc(this[k]))
            {
                s += this[k](v)
            }
            else
            {
                if (this.debug)
                {
                    console.log(_k_.R4(`renderer.node unhandled key ${k} in exp`),exp)
                }
            }
        }
        return s
    }

    Renderer.prototype["atom"] = function (exp)
    {
        return this.fixAsserts(this.node(exp))
    }

    Renderer.prototype["qmrkop"] = function (p)
    {
        var lhs, vn

        if (p.lhs.type === 'var' || !p.qmrk)
        {
            lhs = this.atom(p.lhs)
            return `(${lhs} != null ? ${lhs} : ${this.atom(p.rhs)})`
        }
        else
        {
            vn = this.lineVar(p.qmrk)
            return `((${vn}=${this.atom(p.lhs)}) != null ? ${vn} : ${this.atom(p.rhs)})`
        }
    }

    Renderer.prototype["qmrkcolon"] = function (p)
    {
        return `(${this.atom(p.lhs)} ? ${this.atom(p.mid)} : ${this.atom(p.rhs)})`
    }

    Renderer.prototype["assert"] = function (p)
    {
        if (p.obj.type !== 'var' && !p.obj.index)
        {
            return '▾' + this.node(p.obj) + `▸${p.qmrk.line}_${p.qmrk.col}◂`
        }
        else
        {
            return '▾' + this.node(p.obj) + `▸${0}_${0}◂`
        }
    }

    Renderer.prototype["fixAsserts"] = function (s)
    {
        var i, l, mtch, n, rhs, splt, t

        if (!(s != null) || s.length === 0)
        {
            return ''
        }
        if (_k_.in(s,['▾',"'▾'",'"▾"']))
        {
            return s
        }
        while (s[0] === '▾')
        {
            s = s.slice(1)
        }
        if (/(?<!['"\[])[▾]/.test(s))
        {
            i = s.indexOf('▾')
            if ((n = s.indexOf('\n',i)) > i)
            {
                return s.slice(0, typeof i === 'number' ? i : -1) + this.fixAsserts(s.slice(i + 1, typeof n === 'number' ? n : -1)) + this.fixAsserts(s.slice(n))
            }
            else
            {
                return s.slice(0, typeof i === 'number' ? i : -1) + this.fixAsserts(s.slice(i + 1))
            }
        }
        splt = s.split(/▸\d+_\d+◂/)
        mtch = s.match(/▸\d+_\d+◂/g)
        if (splt.length > 1)
        {
            mtch = mtch.map(function (m)
            {
                return `_${m.slice(1, -1)}_`
            })
            if (splt.slice(-1)[0] === '')
            {
                if (splt.length > 2)
                {
                    splt.pop()
                    mtch.pop()
                    t = splt.shift()
                    while (splt.length)
                    {
                        t += '▸' + mtch.shift().slice(1, -1) + '◂'
                        t += splt.shift()
                    }
                    t = this.fixAsserts(t)
                }
                else
                {
                    t = splt[0]
                }
                return `(${t} != null)`
            }
            s = ''
            for (var _a_ = i = 0, _b_ = mtch.length; (_a_ <= _b_ ? i < mtch.length : i > mtch.length); (_a_ <= _b_ ? ++i : --i))
            {
                if (mtch.length > 1)
                {
                    rhs = i ? (mtch[i - 1] !== "_0_0_" ? mtch[i - 1] : l) + splt[i] : splt[0]
                    if (mtch[i] !== "_0_0_")
                    {
                        l = `(${mtch[i]}=${rhs})`
                    }
                    else
                    {
                        l = rhs
                    }
                }
                else
                {
                    l = splt[0]
                }
                if (splt[i + 1][0] === '(')
                {
                    s += `typeof ${l} === \"function\" ? `
                }
                else
                {
                    s += `${l} != null ? `
                }
            }
            if (mtch.length > 1)
            {
                if (mtch.slice(-1)[0] !== "_0_0_")
                {
                    s += mtch.slice(-1)[0] + splt.slice(-1)[0]
                }
                else
                {
                    s += l + splt.slice(-1)[0]
                }
            }
            else
            {
                s += splt[0] + splt[1]
            }
            for (var _c_ = i = 0, _d_ = mtch.length; (_c_ <= _d_ ? i < mtch.length : i > mtch.length); (_c_ <= _d_ ? ++i : --i))
            {
                s += " : undefined"
            }
            s = `(${s})`
        }
        return s
    }

    Renderer.prototype["use"] = function (n)
    {
        var it, item, m, mod, name, nm, path, s

        s = ''
        path = (function (m, text)
        {
            return this.mark(text,((m.base ? m.base : m)))
        }).bind(this)
        if (!_k_.empty(n.items))
        {
            if (n.toUse.length > 1)
            {
                console.error('items for multiple modules?!')
            }
            m = n.toUse[0]
            mod = m.text
            if (!mod)
            {
                return s
            }
            name = slash.name(mod)
            s += 'import ' + this.mark(name,m)
            if (mod[0] === '.')
            {
                s += " from \"" + path(m,slash.swapExt(mod,'js')) + "\"\n"
            }
            else
            {
                s += " from \"" + path(m,mod) + "\"\n"
            }
            var list = _k_.list(n.items)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                item = list[_a_]
                it = item.text
                s += "let " + this.mark(it,item) + ` = ${name}.${it}\n`
            }
        }
        else if (!_k_.empty(n.name))
        {
            if (n.toUse.length > 1)
            {
                console.error('named import for multiple modules?!')
            }
            m = n.toUse[0]
            mod = m.text
            if (!mod)
            {
                return s
            }
            name = slash.name(mod)
            nm = n.name.text
            s += 'import ' + this.mark(nm,n.name)
            if (mod[0] === '.')
            {
                s += " from \"" + path(m,slash.swapExt(mod,'js')) + "\"\n"
            }
            else
            {
                s += " from \"" + path(m,mod) + "\"\n"
            }
        }
        else
        {
            var list1 = _k_.list(n.toUse)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                m = list1[_b_]
                mod = m.text
                if (!mod)
                {
                    continue
                }
                name = slash.name(mod)
                s += 'import ' + this.mark(name,m)
                if (mod[0] === '.')
                {
                    s += " from \"" + path(m,slash.swapExt(mod,'js')) + "\"\n"
                }
                else
                {
                    s += " from \"" + path(m,mod) + "\"\n"
                }
            }
        }
        return s
    }

    Renderer.prototype["import"] = function (n)
    {
        var s

        s = ''
        s += 'import '
        s += this.nodes(n.args,' ')
        return s
    }

    Renderer.prototype["export"] = function (n)
    {
        var a, s

        s = ''
        s += 'export '
        if (_k_.isArr(n.args))
        {
            if (_k_.empty(n.args))
            {
                this.onError("export is missing what to export",n)
            }
            if (n.args[0].object)
            {
                a = this.object(n.args[0].object,',\n',true)
            }
            else
            {
                a = this.node(n.args[0])
            }
            if (a[0] === "{")
            {
                s += 'default ' + a
            }
            else
            {
                s += '{ ' + a + ' };'
            }
        }
        else
        {
            s += 'default ' + this.node(n.args)
            s += ';'
        }
        return s
    }

    Renderer.prototype["dirFile"] = function (n)
    {
        var name, s, _394_22_

        name = ((_394_22_=n.text) != null ? _394_22_ : n)
        s = ''
        if (name === 'dir')
        {
            this.hint._k_.dir = true
            s = "_k_.dir()"
        }
        if (name === 'file')
        {
            this.hint._k_.file = true
            s = "_k_.file()"
        }
        return this.mark(s,n)
    }

    Renderer.prototype["main"] = function (n)
    {
        var idt, s

        idt = _k_.rpad(4)
        s = this.mark('if',n.token) + ' (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])'
        s += '\n{\n'
        s += idt + this.nodes(n.exps,'\n' + idt)
        s += '\n}'
        return s
    }

    Renderer.prototype["class"] = function (n)
    {
        var b, bind, bn, con, e, mi, mthds, s, superCall, _433_29_, _439_50_

        s = ''
        s += this.mark('class',n.keyword) + ' ' + this.mark(n.name.text,n.name)
        if (n.extends)
        {
            s += " extends " + n.extends.map((function (e)
            {
                return this.node(e)
            }).bind(this)).join(', ')
        }
        s += '\n{'
        mthds = n.body
        if ((mthds != null ? mthds.length : undefined))
        {
            ;[con,bind] = this.prepareMethods(mthds)
            if (bind.length)
            {
                var list = _k_.list(con.keyval.val.func.body.exps)
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    e = list[_a_]
                    if ((e.call != null ? e.call.callee.text : undefined) === 'super')
                    {
                        superCall = con.keyval.val.func.body.exps.splice(con.keyval.val.func.body.exps.indexOf(e),1)[0]
                        break
                    }
                }
                var list1 = _k_.list(bind)
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    b = list1[_b_]
                    bn = b.keyval.val.func.name.text
                    con.keyval.val.func.body.exps = ((_439_50_=con.keyval.val.func.body.exps) != null ? _439_50_ : [])
                    con.keyval.val.func.body.exps.unshift({type:'code',text:`this.${bn} = this.${bn}.bind(this)`})
                }
                if (superCall)
                {
                    con.keyval.val.func.body.exps.unshift(superCall)
                }
            }
            this.indent = '    '
            for (var _c_ = mi = 0, _d_ = mthds.length; (_c_ <= _d_ ? mi < mthds.length : mi > mthds.length); (_c_ <= _d_ ? ++mi : --mi))
            {
                if (mi)
                {
                    s += '\n'
                }
                s += this.mthd(mthds[mi])
            }
            s += '\n'
            this.indent = ''
        }
        s += '}\n'
        return s
    }

    Renderer.prototype["super"] = function (p)
    {
        if (this.mthdName)
        {
            if (this.mthdName === 'constructor')
            {
                return `${p.callee.text}(${this.nodes(p.args,',')})`
            }
            else
            {
                return `${p.callee.text}.${this.mthdName}(${this.nodes(p.args,',')})`
            }
        }
        else if (this.fncnName && this.fncsName)
        {
            return `${this.fncnName}.__super__.${this.fncsName}.call(this${(!_k_.empty(p.args) ? (',' + this.nodes(p.args,',')) : '')})`
        }
    }

    Renderer.prototype["mthd"] = function (n)
    {
        var key, member, memberTok, s, _472_32_

        if (n.keyval)
        {
            s = '\n'
            if ((n.keyval.val.func != null))
            {
                this.mthdName = n.keyval.val.func.name.text
                s += this.indent + this.func(n.keyval.val.func)
                delete this.mthdName
            }
            else
            {
                if (n.keyval.key.text.startsWith('@'))
                {
                    key = n.keyval.key
                    member = key.text.slice(1)
                    memberTok = {type:'var',text:member,line:key.line,col:key.col + 1}
                    s += this.indent + this.mark('static',key) + ' ' + this.mark(member,memberTok) + ' = ' + this.node(n.keyval.val)
                }
                else
                {
                    if (this.debug)
                    {
                        console.log('what is this?',n)
                    }
                }
            }
        }
        return s
    }

    Renderer.prototype["function"] = function (n)
    {
        var b, bind, bn, callsSuper, con, e, mi, mthds, s, _514_54_, _520_50_

        this.fncnName = n.name.text
        s = '\n'
        s += `${this.mark(this.fncnName,n.name)} = (`
        s += this.mark('function',n.keyword)
        s += " ()\n"
        s += '{\n'
        if (n.extends)
        {
            var list = _k_.list(n.extends)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                e = list[_a_]
                this.hint._k_.extend = true
                s += `    _k_.extend(${n.name.text}, ${this.node(e)})`
            }
            s += '\n'
        }
        mthds = n.body
        if ((mthds != null ? mthds.length : undefined))
        {
            ;[con,bind] = this.prepareMethods(mthds)
            if (con)
            {
                if (bind.length)
                {
                    var list1 = _k_.list(bind)
                    for (var _b_ = 0; _b_ < list1.length; _b_++)
                    {
                        b = list1[_b_]
                        bn = b.keyval.val.func.name.text
                        con.keyval.val.func.body.exps = ((_514_54_=con.keyval.val.func.body.exps) != null ? _514_54_ : [])
                        con.keyval.val.func.body.exps.unshift({type:'code',text:`this[\"${bn}\"] = this[\"${bn}\"].bind(this)`})
                    }
                }
                if (n.extends)
                {
                    con.keyval.val.func.body.exps = ((_520_50_=con.keyval.val.func.body.exps) != null ? _520_50_ : [])
                    var list2 = _k_.list(con.keyval.val.func.body.exps)
                    for (var _c_ = 0; _c_ < list2.length; _c_++)
                    {
                        e = list2[_c_]
                        if (e.call && e.call.callee.text === 'super')
                        {
                            callsSuper = true
                            break
                        }
                    }
                    if (!callsSuper)
                    {
                        con.keyval.val.func.body.exps.push({type:'code',text:`return ${this.fncnName}.__super__.constructor.apply(this, arguments)`})
                    }
                }
            }
            this.indent = '    '
            for (var _d_ = mi = 0, _e_ = mthds.length; (_d_ <= _e_ ? mi < mthds.length : mi > mthds.length); (_d_ <= _e_ ? ++mi : --mi))
            {
                s += this.funcs(mthds[mi],n.name.text)
                s += '\n'
            }
            this.indent = ''
        }
        delete this.fncnName
        s += `    return ${this.mark(n.name.text,n.name)}\n`
        s += '})()\n'
        return s
    }

    Renderer.prototype["funcs"] = function (n, className)
    {
        var at, f, key, member, memberTok, name, s, _545_23_, _545_28_, _565_23_, _565_28_, _565_34_

        s = ''
        if (f = ((_545_23_=n.keyval) != null ? (_545_28_=_545_23_.val) != null ? _545_28_.func : undefined : undefined))
        {
            if (f.name.text === 'constructor')
            {
                this.fncsName = 'constructor'
                name = 'function ' + className
                at = name.lastIndexOf(className)
                name = name.slice(0, typeof at === 'number' ? at : -1) + this.mark(className,f.name) + name.slice((at + className.length))
                s = this.indent + this.func(f,name)
                s += '\n'
            }
            else if (f.name.text.startsWith('static'))
            {
                this.fncsName = f.name.text.slice(7)
                s = this.indent + this.func(f,`${this.mark(className,f.name)}[\"${this.fncsName}\"] = function`)
                s += '\n'
            }
            else
            {
                this.fncsName = f.name.text
                s = this.indent + this.func(f,`${className}.prototype[\"${this.fncsName}\"] = function`)
                s += '\n'
            }
            delete this.fncsName
        }
        else
        {
            if (((_565_23_=n.keyval) != null ? (_565_28_=_565_23_.key) != null ? (_565_34_=_565_28_.text) != null ? _565_34_[0] : undefined : undefined : undefined) === '@')
            {
                key = n.keyval.key
                member = key.text.slice(1)
                memberTok = {type:'var',text:member,line:key.line,col:key.col + 1}
                s = this.indent + this.mark(className,key) + "[\"" + this.mark(member,memberTok) + "\"] = " + this.node(n.keyval.val)
            }
        }
        return s
    }

    Renderer.prototype["prepareMethods"] = function (mthds)
    {
        var ast, bind, con, m, name, _590_37_

        bind = []
        var list = _k_.list(mthds)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            if (!m.keyval)
            {
                if (this.debug)
                {
                    print.ast('not a method?',m)
                }
                if (this.debug)
                {
                    print.ast('not a method?',mthds)
                }
                continue
            }
            if (!m.keyval.val.func)
            {
                continue
            }
            name = m.keyval.val.func.name.text
            if (_k_.in(name,['@','constructor']))
            {
                if (con)
                {
                    console.error('more than one constructor?')
                }
                m.keyval.val.func.name.text = 'constructor'
                con = m
            }
            else if ((name != null ? name.startsWith('@') : undefined))
            {
                m.keyval.val.func.name.text = 'static ' + name.slice(1)
            }
            else if (_k_.in((m.keyval.val.func != null ? m.keyval.val.func.arrow.text : undefined),['=>','◯=>']))
            {
                bind.push(m)
            }
        }
        if ((bind.length || this.fncnName) && !con)
        {
            ast = this.kode.ast("constructor: ->")
            con = ast.exps[0].object.keyvals[0]
            con.keyval.val.func.name = {type:'name',text:'constructor'}
            mthds.unshift(con)
        }
        return [con,bind]
    }

    Renderer.prototype["func"] = function (n, name)
    {
        var args, at, gi, mark, member, memberTok, s, str, t, ths, vs, _607_22_, _607_29_, _617_17_, _638_21_, _638_29_, _654_22_, _654_32_

        if (!n)
        {
            return ''
        }
        gi = this.ind()
        name = (name != null ? name : ((_607_29_=(n.name != null ? n.name.text : undefined)) != null ? _607_29_ : 'function'))
        if (n.arrow.text[0] === '◯')
        {
            if (name.indexOf('function') >= 0)
            {
                name = name.replace('function','async function')
            }
            else if (name.indexOf('static') >= 0)
            {
                name = name.replace('static','static async')
            }
            else
            {
                name = 'async ' + name
            }
        }
        if ((n.name != null ? n.name.text : undefined) && !_k_.empty(n.name.line))
        {
            mark = n.name.text
            if (mark.startsWith('static '))
            {
                member = mark.slice(7)
                at = name.lastIndexOf(member)
                if (at >= 0)
                {
                    memberTok = {type:'var',text:member,line:n.name.line,col:n.name.col + 1}
                    name = name.slice(0, typeof at === 'number' ? at : -1) + this.mark(member,memberTok) + name.slice((at + member.length))
                }
                at = name.lastIndexOf('static')
                if (at >= 0)
                {
                    name = name.slice(0, typeof at === 'number' ? at : -1) + this.mark('static',n.name) + name.slice((at + 6))
                }
            }
            else
            {
                at = name.lastIndexOf(mark)
                if (at >= 0)
                {
                    name = name.slice(0, typeof at === 'number' ? at : -1) + this.mark(mark,n.name) + name.slice((at + mark.length))
                }
            }
        }
        s = name
        s += ' ('
        args = ((_638_21_=n.args) != null ? (_638_29_=_638_21_.parens) != null ? _638_29_.exps : undefined : undefined)
        if (args)
        {
            ;[str,ths] = this.args(args)
            s += str
        }
        s += ')\n'
        s += gi + '{'
        this.varstack.push(n.body.vars)
        if (!_k_.empty(ths))
        {
            s += '\n'
            var list = _k_.list(ths)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                t = list[_a_]
                s += this.indent + t + '\n'
            }
            s += gi
        }
        if (((_654_22_=n.body.exps) != null ? _654_22_[0] != null ? (_654_32_=_654_22_[0].call) != null ? _654_32_.callee.text : undefined : undefined : undefined) === 'super')
        {
            s += '\n'
            s += this.indent + this.node(n.body.exps.shift())
            s += '\n' + gi
        }
        if (!_k_.empty(n.body.vars))
        {
            s += '\n'
            vs = this.sortVars(n.body.vars)
            s += this.indent + `var ${vs}\n`
        }
        if (!_k_.empty(n.body.exps))
        {
            s += '\n'
            s += this.indent + this.nodes(n.body.exps,'\n' + this.indent)
            s += '\n' + gi
        }
        s += '}'
        this.varstack.pop()
        this.ded()
        if (n.arrow.text === '=>' && !n.name)
        {
            s = `(${s}).bind(this)`
        }
        return s
    }

    Renderer.prototype["args"] = function (args)
    {
        var a, str, ths, used

        ths = []
        used = {}
        if (args.length > 1 && args.slice(-1)[0].text === '...' && args.slice(-2,-1)[0].type === 'var')
        {
            args.pop()
            args.slice(-1)[0].text = '...' + args.slice(-1)[0].text
        }
        var list = _k_.list(args)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            a = list[_a_]
            if (a.text)
            {
                used[a.text] = a.text
            }
        }
        args = args.map((function (a)
        {
            var i, l, lThis, prop, t, thisThis, thisTok, tok, txt, _696_26_, _696_39_, _696_44_, _702_43_, _704_34_, _719_64_

            prop = ((_696_26_=a.prop) != null ? _696_26_ : ((_696_39_=a.operation) != null ? (_696_44_=_696_39_.lhs) != null ? _696_44_.prop : undefined : undefined))
            tok = a
            if (!tok.type && a.obj)
            {
                tok = a.obj
            }
            if (!tok.type && (prop != null ? prop.obj : undefined))
            {
                tok = prop.obj.type === 'this' ? prop.prop : prop.obj
            }
            if (!tok.type && (a.operation != null ? a.operation.lhs : undefined))
            {
                tok = a.operation.lhs
            }
            thisTok = (prop != null ? (_704_34_=prop.obj) != null ? _704_34_.type : undefined : undefined) === 'this' ? prop.obj : null
            thisThis = thisTok && !_k_.empty(thisTok.line) ? this.mark('this',thisTok) : 'this'
            t = this.plain(this.node(a))
            if ((t != null ? t.startsWith('this.') : undefined))
            {
                l = _k_.trim(t.split('=')[0])
                lThis = thisTok ? thisThis + l.slice(4) : l
                txt = l.slice(5)
                if (used[txt])
                {
                    for (i = 1; i <= 100; i++)
                    {
                        if (!used[txt + i])
                        {
                            ths.push(`${thisThis}.${txt} = ${txt + i}`)
                            txt += i
                            used[txt] = txt
                            return this.mark(`${txt}` + (((_719_64_=t.split('=')[1]) != null ? _719_64_ : '')),tok)
                        }
                    }
                }
                else
                {
                    ths.push(`${lThis} = ${txt}`)
                }
                return this.mark(t.slice(5),tok)
            }
            return this.node(a)
        }).bind(this))
        str = args.join(', ')
        return [str,ths]
    }

    Renderer.prototype["return"] = function (n)
    {
        var s

        s = 'return ' + this.node(n.val)
        return _k_.trim(s)
    }

    Renderer.prototype["await"] = function (n)
    {
        var s

        s = 'await ' + this.node(n.exp)
        return _k_.trim(s)
    }

    Renderer.prototype["call"] = function (p)
    {
        var callee, msg, name

        if (_k_.in(p.callee.text,['log','warn','error']))
        {
            p.callee.text = `console.${p.callee.text}`
        }
        callee = this.node(p.callee)
        name = this.plain(callee)
        if (p.args)
        {
            if (name.length === 2 && /[1-8]/.test(name[1]) && _k_.in(name[0].toLowerCase(),kolorNames))
            {
                this.hint._k_.k = true
                this.hint._k_[name] = true
                return this.mark(`_k_.${name}`,p.callee) + `(${this.nodes(p.args,',')})`
            }
            if (name.length === 3 && /[1-8]/.test(name[2]) && _k_.in(name[0].toLowerCase(),kolorNames) && _k_.in(name[1],kolorNames))
            {
                this.hint._k_.k = true
                this.hint._k_[name] = true
                return this.mark(`_k_.${name}`,p.callee) + `(${this.nodes(p.args,',')})`
            }
            switch (name)
            {
                case 'throw':
                case 'new':
                    return `${callee} ${this.nodes(p.args,',')}`

                case 'int':
                    return `parseInt(${this.nodes(p.args,',')})`

                case 'float':
                    return `parseFloat(${this.nodes(p.args,',')})`

                case 'floor':
                    return `Math.floor(${this.node(p.args[0])})`

                case 'ceil':
                    return `Math.ceil(${this.node(p.args[0])})`

                case 'round':
                    return `Math.round(${this.node(p.args[0])})`

                case 'abs':
                    return `Math.abs(${this.node(p.args[0])})`

                case 'random':
                    return `Math.random(${this.node(p.args[0])})`

                case 'super':
                    return this.super(p)

                case 'dbg':
                    this.hint._k_.dbg = true
                    if (_k_.in((p.args[0] != null ? p.args[0].type : undefined),['var']) || (p.args[0] != null ? p.args[0].prop : undefined) || (p.args[0] != null ? p.args[0].call : undefined))
                    {
                        msg = '"'
                        msg += this.node(p.args[0])
                        msg += '"'
                    }
                    else
                    {
                        msg = 'null'
                    }
                    return `_k_.dbg(${'\"' + (this.where || '???') + '\"'}, ${p.callee.line}, ${p.callee.col}, ${msg}, ${this.nodes(p.args,',')})`

                case 'clamp':
                case 'min':
                case 'max':
                case 'lpad':
                case 'rpad':
                case 'trim':
                case 'ltrim':
                case 'rtrim':
                    this.hint._k_[name] = true
                    return `_k_.${name}(${this.nodes(p.args,',')})`

                case '▴':
                    this.hint._k_.assert = true
                    if (_k_.in((p.args[0] != null ? p.args[0].type : undefined),['single','double','triple']))
                    {
                        msg = p.args[0].text
                        p.args.shift()
                    }
                    else
                    {
                        msg = '"assert failed!"'
                    }
                    msg += ' + " ' + this.nodes(p.args,',') + '"'
                    return `_k_.assert(${'\"' + (this.where || '???') + '\"'}, ${p.callee.line}, ${p.callee.col}, ${msg}, ${this.nodes(p.args,',')})`

                default:
                    return `${callee}(${this.nodes(p.args,',')})`
            }

        }
        else
        {
            return `${callee}()`
        }
    }

    Renderer.prototype["prof"] = function (p)
    {
        if (_k_.in(p.text,['●','●▸']))
        {
            this.hint._k_.profile = true
            this.hint._k_.profilend = true
            return `_k_.profile('${p.id}')`
        }
        else if (p.text === '●▪')
        {
            this.hint._k_.profilend = true
            return `_k_.profilend('${p.id}')`
        }
    }

    Renderer.prototype["if"] = function (n)
    {
        var elif, flc, gi, llc, s

        flc = firstLineCol(n)
        llc = lastLineCol(n)
        if ((flc.line === llc.line && n.else && !n.returns) || n.inline)
        {
            return this.ifInline(n)
        }
        gi = this.ind()
        s = ''
        s += `if (${this.atom(n.cond)})\n`
        s += gi + "{\n"
        if (!_k_.empty(n.then))
        {
            s += this.indent + this.nodes(n.then,'\n' + this.indent) + '\n'
        }
        s += gi + "}"
        var list = _k_.list(n.elifs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            elif = list[_a_]
            s += '\n'
            s += gi + `else if (${this.atom(elif.elif.cond)})\n`
            s += gi + "{\n"
            if (!_k_.empty(elif.elif.then))
            {
                s += this.indent + this.nodes(elif.elif.then,'\n' + this.indent) + '\n'
            }
            s += gi + "}"
        }
        if (n.else)
        {
            s += '\n'
            s += gi + 'else\n'
            s += gi + "{\n"
            if (!_k_.empty(n.else))
            {
                s += this.indent + this.nodes(n.else,'\n' + this.indent) + '\n'
            }
            s += gi + "}"
        }
        this.ded()
        return s
    }

    Renderer.prototype["ifInline"] = function (n, dontClose)
    {
        var e, s, _853_17_

        s = ''
        s += `${this.atom(n.cond)} ? `
        if ((n.then != null ? n.then.length : undefined))
        {
            s += (function () { var r_a_ = []; var list = _k_.list(n.then); for (var _b_ = 0; _b_ < list.length; _b_++)  { e = list[_b_];r_a_.push(this.atom(e))  } return r_a_ }).bind(this)().join(', ')
        }
        if (n.elifs)
        {
            var list1 = _k_.list(n.elifs)
            for (var _c_ = 0; _c_ < list1.length; _c_++)
            {
                e = list1[_c_]
                s += ' : '
                s += this.ifInline(e.elif,true)
            }
        }
        if (n.else)
        {
            s += ' : '
            if (n.else.length === 1)
            {
                s += this.atom(n.else[0])
            }
            else
            {
                s += '(' + (function () { var r_d_ = []; var list2 = _k_.list(n.else); for (var _e_ = 0; _e_ < list2.length; _e_++)  { e = list2[_e_];r_d_.push(this.atom(e))  } return r_d_ }).bind(this)().join(', ') + ')'
            }
        }
        else if (!dontClose)
        {
            s += ' : undefined'
        }
        return s
    }

    Renderer.prototype["each"] = function (n)
    {
        var fnc, i, numArgs, rv, _875_23_, _875_29_, _875_35_, _875_43_, _875_49_, _920_20_, _920_26_, _920_32_, _920_38_

        numArgs = ((_875_23_=n.fnc) != null ? (_875_29_=_875_23_.func) != null ? (_875_35_=_875_29_.args) != null ? (_875_43_=_875_35_.parens) != null ? (_875_49_=_875_43_.exps) != null ? _875_49_.length : undefined : undefined : undefined : undefined : undefined)
        rv = 'r' + this.makeVar(n.each)
        i = this.indent
        if (numArgs === 1)
        {
            this.hint._k_.each_r = true
            this.ind()
            fnc = this.node(n.fnc)
            this.ded()
            return `${i}(function (o) {
${i}    var ${rv} = _k_.each_r(o)
${i}    for (var k in o)
${i}    {   
${i}        var m = (${fnc})(o[k])
${i}        if (m != null)
${i}        {
${i}            ${rv}[k] = m
${i}        }
${i}    }
${i}    return typeof o == 'string' ? ${rv}.join('') : ${rv}
${i}})(${this.node(n.lhs)})`
        }
        else if (numArgs)
        {
            this.hint._k_.each_r = true
            this.ind()
            fnc = this.node(n.fnc)
            this.ded()
            return `${i}(function (o) {
${i}    var r = _k_.each_r(o)
${i}    for (var k in o)
${i}    {   
${i}        var m = (${fnc})(k, o[k])
${i}        if (m != null && m[0] != null)
${i}        {
${i}            r[m[0]] = m[1]
${i}        }
${i}    }
${i}    return typeof o == 'string' ? r.join('') : r
${i}})(${this.node(n.lhs)})`
        }
        else
        {
            if (((_920_20_=n.fnc) != null ? (_920_26_=_920_20_.func) != null ? (_920_32_=_920_26_.body) != null ? (_920_38_=_920_32_.exps) != null ? _920_38_.length : undefined : undefined : undefined : undefined) > 0)
            {
                this.hint._k_.each_r = true
                this.ind()
                fnc = this.node(n.fnc)
                this.ded()
                return `${i}(function (o) {
${i}    var r = _k_.each_r(o)
${i}    for (var k in o)
${i}    {   
${i}        var m = (${fnc})(o[k])
${i}        if (m != null)
${i}        {
${i}            r[k] = m
${i}        }
${i}    }
${i}    return typeof o == 'string' ? r.join('') : r
${i}})(${this.node(n.lhs)})
    `
            }
            else
            {
                return `${i}(function (o) { return Array.isArray(o) ? [] : typeof o == 'string' ? '' : {} })(${this.node(n.lhs)})`
            }
        }
    }

    Renderer.prototype["for"] = function (n)
    {
        if (!n.then)
        {
            this.verb('for expected then',n)
        }
        switch (n.inof.text)
        {
            case 'in':
                return this.for_in(n)

            case 'of':
                return this.for_of(n)

            default:
                return this.onError(`renderer.for expected either 'in' or 'of' but got '${n.inof.text}'`,n.inof)
        }

    }

    Renderer.prototype["for_in"] = function (n, varPrefix = '', lastPrefix = '', lastPostfix = '', lineBreak)
    {
        var e, eb, g2, gi, iterVar, j, list, listVar, nl, postfix, prefix, s, v, _962_27_, _984_28_

        if (!n.list.qmrkop && !n.list.array && !n.list.slice)
        {
            this.hint._k_.list = true
            list = `_k_.list(${this.atom(n.list)})`
        }
        else
        {
            if (((_962_27_=n.list.array) != null ? _962_27_.items[0] != null ? _962_27_.items[0].slice : undefined : undefined) || n.list.slice)
            {
                return this.for_in_range(n,varPrefix,lastPrefix,lastPostfix,lineBreak)
            }
            list = this.node(n.list)
        }
        if (!list || list === 'undefined')
        {
            if (this.debug)
            {
                print.noon('no list for',n.list)
            }
            if (this.debug)
            {
                print.ast('no list for',n.list)
            }
        }
        gi = lineBreak || this.ind()
        nl = lineBreak || '\n'
        eb = lineBreak && ';' || '\n'
        g2 = lineBreak ? '' : this.indent
        listVar = this.freshVar('list')
        iterVar = this.makeVar(n.inof)
        s = ''
        s += `var ${listVar} = ${list}` + eb
        if (n.vals.text)
        {
            s += gi + `for (var ${iterVar} = 0; ${iterVar} < ${listVar}.length; ${iterVar}++)` + nl
            s += gi + "{" + nl
            s += g2 + `${this.mark(n.vals.text,n.vals)} = ${listVar}[${iterVar}]` + eb
        }
        else if ((n.vals.array != null ? n.vals.array.items : undefined))
        {
            s += gi + `for (var ${iterVar} = 0; ${iterVar} < ${listVar}.length; ${iterVar}++)` + nl
            s += gi + "{" + nl
            for (var _a_ = j = 0, _b_ = n.vals.array.items.length; (_a_ <= _b_ ? j < n.vals.array.items.length : j > n.vals.array.items.length); (_a_ <= _b_ ? ++j : --j))
            {
                v = n.vals.array.items[j]
                s += g2 + `${this.mark(v.text,v)} = ${listVar}[${iterVar}][${j}]` + eb
            }
        }
        else if (n.vals.length > 1)
        {
            iterVar = n.vals[1].text
            s += gi + `for (${this.mark(iterVar,n.vals[1])} = 0; ${iterVar} < ${listVar}.length; ${iterVar}++)` + nl
            s += gi + "{" + nl
            s += g2 + `${varPrefix}${this.mark(n.vals[0].text,n.vals[0])} = ${listVar}[${iterVar}]` + eb
        }
        var list1 = _k_.list(n.then)
        for (var _c_ = 0; _c_ < list1.length; _c_++)
        {
            e = list1[_c_]
            prefix = lastPrefix && e === n.then.slice(-1)[0] ? lastPrefix : ''
            postfix = lastPostfix && e === n.then.slice(-1)[0] ? lastPostfix : ''
            s += g2 + this.stmt(e,prefix) + postfix + nl
        }
        s += gi + "}"
        if (!lineBreak)
        {
            this.ded()
        }
        return s
    }

    Renderer.prototype["for_in_range"] = function (n, varPrefix, lastPrefix, lastPostfix, lineBreak)
    {
        var e, eb, end, g2, gi, invCmp, iterCmp, iterDir, iterEnd, iterStart, iterTok, iterVar, llc, loopCheck, loopStart, loopUpdate, lv, nl, postfix, prefix, rlc, rv, s, slice, start, _1007_28_, _1007_46_, _1017_32_

        slice = ((_1007_46_=((_1007_28_=n.list.array) != null ? _1007_28_.items[0] != null ? _1007_28_.items[0].slice : undefined : undefined)) != null ? _1007_46_ : n.list.slice)
        gi = lineBreak || this.ind()
        nl = lineBreak || '\n'
        eb = lineBreak && ';' || '\n'
        g2 = lineBreak ? '' : this.indent
        iterVar = ((_1017_32_=n.vals.text) != null ? _1017_32_ : n.vals[0].text)
        iterTok = n.vals.text ? n.vals : n.vals[0]
        iterStart = this.node(slice.from)
        iterEnd = this.node(slice.upto)
        start = parseInt(iterStart)
        end = parseInt(iterEnd)
        iterCmp = slice.dots.text === '...' ? '<' : '<='
        invCmp = slice.dots.text === '...' ? '>' : '>='
        iterDir = '++'
        if (Number.isFinite(start) && Number.isFinite(end))
        {
            if (start > end)
            {
                iterCmp = slice.dots.text === '...' ? '>' : '>='
                iterDir = '--'
            }
            loopStart = `${this.mark(iterVar,iterTok)} = ${iterStart}`
            loopCheck = `${iterVar} ${iterCmp} ${iterEnd}`
            loopUpdate = `${iterVar}${iterDir}`
        }
        else
        {
            llc = firstLineCol(slice.from)
            rlc = firstLineCol(slice.upto)
            lv = this.makeVar(llc)
            rv = this.makeVar(rlc)
            loopStart = `var ${lv} = ${this.mark(iterVar,iterTok)} = ${iterStart}, ${rv} = ${iterEnd}`
            loopCheck = `(${lv} <= ${rv} ? ${iterVar} ${iterCmp} ${iterEnd} : ${iterVar} ${invCmp} ${iterEnd})`
            loopUpdate = `(${lv} <= ${rv} ? ++${iterVar} : --${iterVar})`
        }
        s = ''
        s += `for (${loopStart}; ${loopCheck}; ${loopUpdate})` + nl
        s += gi + "{" + nl
        var list = _k_.list(n.then)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            e = list[_a_]
            prefix = lastPrefix && e === n.then.slice(-1)[0] ? lastPrefix : ''
            postfix = lastPostfix && e === n.then.slice(-1)[0] ? lastPostfix : ''
            s += g2 + this.stmt(e,prefix) + postfix + nl
        }
        s += gi + "}"
        if (!lineBreak)
        {
            this.ded()
        }
        return s
    }

    Renderer.prototype["for_of"] = function (n, varPrefix = '', lastPrefix = '', lastPostfix = '', lineBreak)
    {
        var e, eb, g2, gi, key, keyTok, nl, obj, postfix, prefix, s, val, valTok

        gi = lineBreak || this.ind()
        nl = lineBreak || '\n'
        eb = lineBreak && ';' || '\n'
        g2 = lineBreak ? '' : this.indent
        keyTok = (n.vals.text ? n.vals : n.vals[0])
        key = (keyTok != null ? keyTok.text : undefined)
        valTok = n.vals[1]
        val = (valTok != null ? valTok.text : undefined)
        obj = this.node(n.list)
        s = ''
        s += `for (${varPrefix}${this.mark(key,keyTok)} in ${obj})` + nl
        s += gi + "{" + nl
        if (val)
        {
            s += g2 + `${varPrefix}${this.mark(val,valTok)} = ${obj}[${key}]` + eb
        }
        var list = _k_.list(n.then)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            e = list[_a_]
            prefix = lastPrefix && e === n.then.slice(-1)[0] ? lastPrefix : ''
            postfix = lastPostfix && e === n.then.slice(-1)[0] ? lastPostfix : ''
            s += g2 + this.stmt(e,prefix) + postfix + nl
        }
        s += gi + "}"
        if (!lineBreak)
        {
            this.ded()
        }
        return s
    }

    Renderer.prototype["lcomp"] = function (n)
    {
        var comp, v

        v = 'r' + this.makeVar(n.for.inof)
        comp = (function (f)
        {
            switch (f.inof.text)
            {
                case 'in':
                    return this.for_in(f,'var ',`${v}.push(`,')',' ')

                case 'of':
                    return this.for_of(f,'var ',`${v}.push(`,')',' ')

            }

        }).bind(this)
        return `(function () { var ${v} = []; ${comp(n.for)} return ${v} }).bind(this)()`
    }

    Renderer.prototype["while"] = function (n)
    {
        var gi, s

        gi = this.ind()
        s = ''
        s += `while (${this.atom(n.cond)})\n`
        s += gi + "{\n"
        if (!_k_.empty(n.then))
        {
            s += this.indent + this.nodes(n.then,'\n' + this.indent) + '\n'
        }
        s += gi + "}"
        this.ded()
        return s
    }

    Renderer.prototype["switch"] = function (n)
    {
        var e, gi, s

        if (!n.match)
        {
            console.error('switch expected match',n)
        }
        if (!n.whens)
        {
            console.error('switch expected whens',n)
        }
        gi = this.ind()
        s = ''
        s += `switch (${this.node(n.match)})\n`
        s += gi + "{\n"
        var list = _k_.list(n.whens)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            e = list[_a_]
            s += gi + this.node(e) + '\n'
        }
        if (!_k_.empty(n.else))
        {
            s += this.indent + 'default:\n'
            var list1 = _k_.list(n.else)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                e = list1[_b_]
                s += this.indent + '    ' + (e === n.else[0] ? this.node(e) : this.stmt(e)) + '\n'
            }
        }
        s += gi + "}\n"
        this.ded()
        return s
    }

    Renderer.prototype["when"] = function (n)
    {
        var e, gi, i, s

        if (!n.vals)
        {
            return console.error('when expected vals',n)
        }
        s = ''
        var list = _k_.list(n.vals)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            e = list[_a_]
            i = e !== n.vals[0] && this.indent || '    '
            s += i + 'case ' + this.node(e) + ':\n'
        }
        var list1 = _k_.list(n.then)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            e = list1[_b_]
            gi = this.ind()
            s += gi + '    ' + (e === n.then[0] ? this.node(e) : this.stmt(e)) + '\n'
            this.ded()
        }
        if (!(n.then && n.then.slice(-1)[0] && n.then.slice(-1)[0].return))
        {
            s += this.indent + '    ' + 'break'
        }
        return s
    }

    Renderer.prototype["try"] = function (n)
    {
        var gi, s

        s = ''
        gi = this.ind()
        s += 'try\n'
        s += gi + '{\n'
        s += this.indent + this.nodes(n.exps,'\n' + this.indent)
        s += '\n'
        s += gi + '}'
        if (n.catch)
        {
            s += '\n'
            s += gi + `catch (${this.node(n.catch.errr) || 'err'})\n`
            s += gi + '{\n'
            s += this.indent + this.nodes(n.catch.exps,'\n' + this.indent)
            s += '\n'
            s += gi + '}'
        }
        if (n.finally)
        {
            s += '\n'
            s += gi + 'finally\n'
            s += gi + '{\n'
            s += this.indent + this.nodes(n.finally,'\n' + this.indent)
            s += '\n'
            s += gi + '}'
        }
        this.ded()
        return s
    }

    Renderer.prototype["token"] = function (tok)
    {
        var s, _1202_28_

        return s = tok.type === 'comment' ? this.comment(tok) : tok.type === 'this' ? 'this' : tok.type === 'triple' ? '`' + tok.text.slice(3, -3) + '`' : tok.type === 'bool' && tok.text === 'yes' ? 'true' : tok.type === 'bool' && tok.text === 'no' ? 'false' : (tok.type != null ? tok.type.startsWith('prof') : undefined) ? this.prof(tok) : tok.text
    }

    Renderer.prototype["comment"] = function (tok)
    {
        var _1209_19_

        if ((tok.text != null ? tok.text.startsWith('###') : undefined))
        {
            return '/*' + tok.text.slice(3, -3) + '*/' + '\n'
        }
        else if (tok.text.startsWith('#'))
        {
            return _k_.rpad(tok.col) + '//' + tok.text.slice(1)
        }
        else
        {
            console.error("# comment token expected")
            return ''
        }
    }

    Renderer.prototype["operation"] = function (op)
    {
        var close, flc, ind, isAssign, keyval, lhs, o, open, opmap, prfx, rhs, ro, s, sep, _1238_29_, _1238_40_, _1265_25_, _1265_43_, _1265_54_, _1265_64_, _1298_18_, _1298_29_, _1304_25_, _1308_30_, _1313_30_, _1321_30_, _1329_30_, _1334_30_, _1339_30_, _1344_30_, _1344_51_, _1350_41_

        opmap = function (o)
        {
            var omp, _1231_19_

            omp = {and:'&&',or:'||',not:'!',empty:'_k_.empty',valid:'!_k_.empty',eql:'_k_.eql','==':'===','!=':'!=='}
            return ((_1231_19_=omp[o]) != null ? _1231_19_ : o)
        }
        o = opmap(op.operator.text)
        sep = ' '
        if ((!op.lhs && !(_k_.in(op.operator.text,['delete','new']))) || !op.rhs)
        {
            sep = ''
        }
        if (_k_.in(o,['<','<=','===','!==','>=','>','_k_.eql']))
        {
            ro = opmap(((_1238_29_=op.rhs) != null ? (_1238_40_=_1238_29_.operation) != null ? _1238_40_.operator.text : undefined : undefined))
            if (_k_.in(ro,['<','<=','===','!==','>=','>','_k_.eql']))
            {
                return '(' + this.atom(op.lhs) + sep + o + sep + this.atom(op.rhs.operation.lhs) + ' && ' + kstr.lstrip(this.atom(op.rhs)) + ')'
            }
        }
        open = close = ''
        if (o === '=')
        {
            if (op.lhs.object)
            {
                s = ''
                var list = _k_.list(op.lhs.object.keyvals)
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    keyval = list[_a_]
                    ind = op.lhs.object.keyvals.indexOf(keyval) > 0 ? this.indent : ''
                    s += ind + `${this.mark(keyval.text,keyval)} = ${this.atom(op.rhs)}.${keyval.text}\n`
                }
                return s
            }
            if (op.lhs.array)
            {
                return this.arrayPattern(op.lhs.array.items) + ' = ' + this.atom(op.rhs)
            }
            if (op.lhs && this.containsAssert(op.lhs))
            {
                s = "if (" + this.atom(this.pruneAssert(op.lhs)) + `) { ${this.node(this.clearAsserts(op.lhs))} = ` + this.atom(op.rhs) + " }"
                return s
            }
        }
        else if (o === '!')
        {
            if ((op.rhs != null ? op.rhs.incond : undefined) || _k_.in(((_1265_43_=op.rhs) != null ? (_1265_54_=_1265_43_.operation) != null ? (_1265_64_=_1265_54_.operator) != null ? _1265_64_.text : undefined : undefined : undefined),['=','is']))
            {
                open = '('
                close = ')'
            }
        }
        else if (_k_.in(op.operator.text,['empty','valid']))
        {
            this.hint._k_.empty = true
            if (op.operator.text === 'valid')
            {
                this.hint._k_.valid = true
            }
            open = '('
            close = ')'
        }
        else if (_k_.in(op.operator.text,['first','last']))
        {
            this.hint._k_[op.operator.text] = true
            rhs = this.node(op.rhs)
            if (!(_k_.in(rhs[0],'.-+')))
            {
                if (rhs[0] === '(')
                {
                    return `_k_.${op.operator.text}${this.node(op.rhs)}`
                }
                else
                {
                    return `_k_.${op.operator.text}(${this.node(op.rhs)})`
                }
            }
        }
        else if (op.operator.text === 'eql')
        {
            this.hint._k_[op.operator.text] = true
            return `_k_.${op.operator.text}(${this.node(op.lhs)}, ${this.node(op.rhs)})`
        }
        else if (_k_.in(op.operator.text,['copy','clone']))
        {
            this.hint._k_[op.operator.text] = true
            return `_k_.${op.operator.text}(${this.node(op.rhs)})`
        }
        else if (op.operator.text === 'noon')
        {
            this.hint._k_.noon = true
            return `_k_.noon(${this.node(op.rhs)})`
        }
        else if (((_1298_18_=op.rhs) != null ? (_1298_29_=_1298_18_.operation) != null ? _1298_29_.operator.text : undefined : undefined) === '=')
        {
            open = '('
            close = ')'
        }
        else if (op.operator.text === 'is')
        {
            if (_k_.in((op.rhs != null ? op.rhs.type : undefined),['single','double','triple']))
            {
                return `typeof(${this.atom(op.lhs)}) === ${this.node(op.rhs)}`
            }
            else
            {
                if ((op.rhs != null ? op.rhs.text : undefined) === 'num')
                {
                    lhs = this.atom(op.lhs)
                    this.hint._k_.isNum = true
                    return `${this.mark('_k_.isNum',op.rhs)}(${lhs})`
                }
                else if ((op.rhs != null ? op.rhs.text : undefined) === 'obj')
                {
                    if (op.lhs.type === 'num')
                    {
                        return 'false'
                    }
                    else
                    {
                        lhs = this.atom(op.lhs)
                        this.hint._k_.isObj = true
                        return `${this.mark('_k_.isObj',op.rhs)}(${lhs})`
                    }
                }
                else if ((op.rhs != null ? op.rhs.text : undefined) === 'arr')
                {
                    if (op.lhs.type === 'num')
                    {
                        return 'false'
                    }
                    else
                    {
                        lhs = this.atom(op.lhs)
                        this.hint._k_.isArr = true
                        return `${this.mark('_k_.isArr',op.rhs)}(${lhs})`
                    }
                }
                else if ((op.rhs != null ? op.rhs.text : undefined) === 'str')
                {
                    lhs = this.atom(op.lhs)
                    this.hint._k_.isStr = true
                    return `${this.mark('_k_.isStr',op.rhs)}(${lhs})`
                }
                else if ((op.rhs != null ? op.rhs.text : undefined) === 'func')
                {
                    lhs = this.atom(op.lhs)
                    this.hint._k_.isFunc = true
                    return `${this.mark('_k_.isFunc',op.rhs)}(${lhs})`
                }
                else if ((op.rhs != null ? op.rhs.text : undefined) === 'elem')
                {
                    lhs = this.atom(op.lhs)
                    this.hint._k_.isElem = true
                    return `${this.mark('_k_.isElem',op.rhs)}(${lhs})`
                }
                else if ((op.rhs != null ? op.rhs.operation : undefined) || (op.rhs != null ? op.rhs.qmrkcolon : undefined))
                {
                    this.onError("'is' expects a type on its right side, not an expression",{tok:op.operator})
                }
                else
                {
                    return `${this.atom(op.lhs)} instanceof ${this.atom(op.rhs)}`
                }
            }
        }
        flc = firstLineCol(op.lhs)
        prfx = flc.col === 0 && (op.rhs != null ? op.rhs.func : undefined) ? '\n' : ''
        isAssign = o.endsWith('=') && !(_k_.in(o,['==','!=','===','!==','<=','>=']))
        lhs = op.lhs ? (isAssign ? this.assignee(op.lhs) : this.atom(op.lhs)) + sep : ''
        return prfx + lhs + o + sep + open + kstr.lstrip(this.atom(op.rhs) + close)
    }

    Renderer.prototype["incond"] = function (p)
    {
        this.hint._k_.in = true
        return `_k_.in(${this.atom(p.lhs)},${this.atom(p.rhs)})`
    }

    Renderer.prototype["parens"] = function (p)
    {
        return `(${this.nodes(p.exps)})`
    }

    Renderer.prototype["object"] = function (p, sep = ',', tl)
    {
        var newls, nodes

        nodes = p.keyvals.map((function (s)
        {
            return this.atom(s)
        }).bind(this))
        nodes = nodes.map(function (n)
        {
            if (_k_.in(':',n))
            {
                return n
            }
            else
            {
                return `${n}:${n}`
            }
        })
        if (tl)
        {
            nodes = nodes.map(function (n)
            {
                return kstr.lines(n).map(function (l)
                {
                    return '    ' + l
                }).join('\n')
            })
        }
        newls = (tl ? '\n' : '')
        return `{${newls}${nodes.join(sep)}${newls}}`
    }

    Renderer.prototype["keyval"] = function (p)
    {
        var key

        key = this.node(p.key)
        if (!(_k_.in(key[0],"'\"")) && /[\.\,\;\*\+\-\/\=\|]/.test(key))
        {
            key = `'${key}'`
        }
        return `${key}:${this.atom(p.val)}`
    }

    Renderer.prototype["prop"] = function (p)
    {
        return `${this.node(p.obj)}.${this.node(p.prop)}`
    }

    Renderer.prototype["index"] = function (p)
    {
        var addOne, from, ni, slice, u, upper, upto, _1390_32_, _1394_32_, _1396_25_, _1396_54_, _1412_27_

        if (slice = p.slidx.slice)
        {
            from = (slice.from != null) ? this.node(slice.from) : '0'
            addOne = slice.dots.text === '..'
            upto = (slice.upto != null) ? this.node(slice.upto) : '-1'
            if ((slice.upto != null ? slice.upto.type : undefined) === 'num' || (slice.upto != null ? slice.upto.operation : undefined) || upto === '-1')
            {
                u = parseInt(upto)
                if (Number.isFinite(u))
                {
                    if (u === -1 && addOne)
                    {
                        upper = ''
                    }
                    else
                    {
                        if (addOne)
                        {
                            u += 1
                        }
                        upper = `, ${u}`
                    }
                }
                else
                {
                    upper = `, ${upto}`
                }
            }
            else
            {
                if (addOne)
                {
                    if (upto)
                    {
                        upper = `, typeof ${upto} === 'number' ? ${upto}+1 : Infinity`
                    }
                }
                else
                {
                    upper = `, typeof ${upto} === 'number' ? ${upto} : -1`
                }
            }
            return `${this.node(p.idxee)}.slice(${from}${(upper != null ? upper : '')})`
        }
        else
        {
            if ((p.slidx.text != null ? p.slidx.text[0] : undefined) === '-')
            {
                ni = parseInt(p.slidx.text)
                if (ni === -1)
                {
                    return `${this.node(p.idxee)}.slice(${ni})[0]`
                }
                else
                {
                    return `${this.node(p.idxee)}.slice(${ni},${ni + 1})[0]`
                }
            }
            return `${this.node(p.idxee)}[${this.node(p.slidx)}]`
        }
    }

    Renderer.prototype["array"] = function (p)
    {
        if ((p.items[0] != null ? p.items[0].slice : undefined))
        {
            return this.slice(p.items[0].slice)
        }
        else
        {
            return `[${this.nodes(p.items,',')}]`
        }
    }

    Renderer.prototype["slice"] = function (p)
    {
        var from, o, upto, x, _1432_41_

        if ((p.from.type === 'num' && 'num' === (p.upto != null ? p.upto.type : undefined)))
        {
            from = parseInt(p.from.text)
            upto = parseInt(p.upto.text)
            if (upto - from <= 10)
            {
                if (p.dots.text === '...')
                {
                    upto--
                }
                return '[' + ((function () { var r_a_ = []; for (var _b_ = x = from, _c_ = upto; (_b_ <= _c_ ? x <= upto : x >= upto); (_b_ <= _c_ ? ++x : --x))  { r_a_.push(x)  } return r_a_ }).bind(this)().join(',')) + ']'
            }
            else
            {
                o = p.dots.text === '...' ? '<' : '<='
                return `(function() { var r = []; for (var i = ${from}; i ${o} ${upto}; i++){ r.push(i); } return r; }).apply(this)`
            }
        }
        else
        {
            o = p.dots.text === '...' ? '<' : '<='
            return `(function() { var r = []; for (var i = ${this.node(p.from)}; i ${o} ${this.node(p.upto)}; i++){ r.push(i); } return r; }).apply(this)`
        }
    }

    Renderer.prototype["stripol"] = function (chunks)
    {
        var c, chunk, s, t

        s = '`'
        var list = _k_.list(chunks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            chunk = list[_a_]
            t = chunk.text
            switch (chunk.type)
            {
                case 'open':
                    s += t + '${'
                    break
                case 'midl':
                    s += '}' + t + '${'
                    break
                case 'close':
                    s += '}' + t
                    break
                default:
                    if (chunk.code)
                {
                    c = this.nodes(chunk.code.exps)
                    if (c[0] === ';')
                    {
                        c = c.slice(1)
                    }
                    s += c
                }
            }

        }
        s += '`'
        return s
    }

    Renderer.prototype["section"] = function (p)
    {
        var gi, s

        this.hint.section = true
        gi = this.ind()
        s = `toExport[${p.title.text}] = async function ()\n`
        s += gi + '{\n'
        if (!_k_.empty(p.exps))
        {
            s += this.indent + this.nodes(p.exps,'\n' + this.indent,true) + '\n'
        }
        s += gi + '}\n'
        s += `toExport[${p.title.text}]._section_ = true`
        this.ded()
        return s
    }

    Renderer.prototype["subsect"] = function (p)
    {
        var gi, s

        gi = this.ind()
        s = `await section(${p.title.text}, async function ()\n`
        s += gi + '{\n'
        if (!_k_.empty(p.exps))
        {
            s += this.indent + this.nodes(p.exps,'\n' + this.indent) + '\n'
        }
        s += gi + '})'
        this.ded()
        return s
    }

    Renderer.prototype["compare"] = function (p)
    {
        var lhs, rhs

        lhs = this.atom(p.lhs)
        rhs = this.atom(p.rhs)
        if (p.async)
        {
            lhs = `await (${lhs})`
            rhs = `await (${rhs})`
        }
        return this.mark('compare',p.arrow) + '(' + lhs + ',' + rhs + ')'
    }

    Renderer.prototype["stmt"] = function (e, prefix = '')
    {
        var s

        s = this.node(e)
        if (!prefix && _k_.in(kstr.lstrip(s)[0],'(['))
        {
            s = ';' + s
        }
        return prefix + s
    }

    Renderer.prototype["arrayPattern"] = function (items)
    {
        var val

        return `[${(function () { var r_a_ = []; var list = _k_.list(items); for (var _b_ = 0; _b_ < list.length; _b_++)  { val = list[_b_];r_a_.push(this.arrayTarget(val))  } return r_a_ }).bind(this)().join(',')}]`
    }

    Renderer.prototype["arrayTarget"] = function (val)
    {
        if (_k_.in(val.type,['var','keyword']))
        {
            return this.mark(val.text,val)
        }
        if (val.array)
        {
            return this.arrayPattern(val.array.items)
        }
        if (this.negativeIndex(val))
        {
            this.onError("negative indices can't be destructured into",firstLineCol(val))
        }
        if ((val.prop || val.index) && !this.containsAssert(val))
        {
            return this.node(val)
        }
        return this.onError("invalid destructuring target: only names, members, indices and arrays can be assigned",firstLineCol(val))
    }

    Renderer.prototype["negativeIndex"] = function (e)
    {
        var _1517_83_

        return (e != null ? e.index : undefined) && !e.index.slidx.slice && (e.index.slidx.text != null ? e.index.slidx.text[0] : undefined) === '-'
    }

    Renderer.prototype["assignee"] = function (e)
    {
        var obj

        if (!this.negativeIndex(e))
        {
            return this.atom(e)
        }
        if (!this.plainChain(e.index.idxee))
        {
            this.onError("negative index assignment needs a plain receiver (names, members and indices)",firstLineCol(e))
        }
        obj = this.node(e.index.idxee)
        return `${obj}[${obj}.length${e.index.slidx.text}]`
    }

    Renderer.prototype["plainChain"] = function (e)
    {
        if (!e)
        {
            return false
        }
        if (_k_.in(e.type,['var','keyword','this','num','single','double']))
        {
            return true
        }
        if (e.prop)
        {
            return this.plainChain(e.prop.obj)
        }
        if (e.index)
        {
            return this.plainChain(e.index.idxee) && this.plainChain(e.index.slidx)
        }
        return false
    }

    Renderer.prototype["containsAssert"] = function (e)
    {
        if (!e)
        {
            return false
        }
        if (e.assert)
        {
            return true
        }
        if (e.prop)
        {
            return this.containsAssert(e.prop.obj)
        }
        if (e.index)
        {
            return this.containsAssert(e.index.idxee)
        }
        if (e.call)
        {
            return this.containsAssert(e.call.callee)
        }
        return false
    }

    Renderer.prototype["pruneAssert"] = function (e)
    {
        if (!e)
        {
            return e
        }
        if (e.prop)
        {
            return this.pruneAssert(e.prop.obj)
        }
        if (e.index)
        {
            return this.pruneAssert(e.index.idxee)
        }
        if (e.call)
        {
            return this.pruneAssert(e.call.callee)
        }
        return e
    }

    Renderer.prototype["clearAsserts"] = function (e)
    {
        var c

        if (!e)
        {
            return e
        }
        if (e.assert)
        {
            return this.clearAsserts(e.assert.obj)
        }
        if (e.prop)
        {
            c = _k_.clone(e)
            c.prop.obj = this.clearAsserts(e.prop.obj)
            return c
        }
        if (e.index)
        {
            c = _k_.clone(e)
            c.index.idxee = this.clearAsserts(e.index.idxee)
            return c
        }
        if (e.call)
        {
            c = _k_.clone(e)
            c.call.callee = this.clearAsserts(e.call.callee)
            return c
        }
        return e
    }

    Renderer.prototype["sortVars"] = function (vars)
    {
        var v, vl

        vl = (function () { var r_a_ = []; var list = _k_.list(vars); for (var _b_ = 0; _b_ < list.length; _b_++)  { v = list[_b_];r_a_.push(v.text)  } return r_a_ }).bind(this)()
        vl.sort(function (a, b)
        {
            if (a[0] === '_' && b[0] !== '_')
            {
                return 1
            }
            else if (a[0] !== '_' && b[0] === '_')
            {
                return -1
            }
            else
            {
                return a.localeCompare(b)
            }
        })
        return vl.join(', ')
    }

    Renderer.prototype["freshVar"] = function (name, suffix = 0)
    {
        var v, vars

        var list = _k_.list(this.varstack)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            vars = list[_a_]
            var list1 = _k_.list(vars)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                v = list1[_b_]
                if (v.text === name + (suffix || ''))
                {
                    return this.freshVar(name,suffix + 1)
                }
            }
        }
        this.varstack.slice(-1)[0].push({text:name + (suffix || '')})
        return name + (suffix || '')
    }

    Renderer.prototype["lineVar"] = function (tok)
    {
        return `_${tok.line}_${tok.col}_`
    }

    Renderer.prototype["makeVar"] = function (tok)
    {
        var ctx, _1594_24_, _1597_25_

        ctx = ((_1594_24_=this.fncsName) != null ? _1594_24_ : this.mthdName)
        ctx = (ctx != null ? ctx : '_k_')
        if (ctx === 'constructor')
        {
            ctx = '@'
        }
        this.varcontext[ctx] = ((_1597_25_=this.varcontext[ctx]) != null ? _1597_25_ : 0)
        this.varcontext[ctx] = this.varcontext[ctx] + 1
        return `_${(this.varcontext[ctx] + 9).toString(16)}_`
    }

    Renderer.prototype["verb"] = function ()
    {
        if (this.debug)
        {
            return console.log.apply(console.log,arguments)
        }
    }

    Renderer.prototype["ind"] = function ()
    {
        var oi

        oi = this.indent
        this.indent += '    '
        return oi
    }

    Renderer.prototype["ded"] = function ()
    {
        return this.indent = this.indent.slice(0, -4)
    }

    return Renderer
})()

export default Renderer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9yZW5kZXJlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O09BQ2MsV0FBUDtPQUFZLFlBQVo7O09BQ0QsWUFBQTtJQUFRO0lBQWE7O09BQ3JCLFlBQUE7O09BQ0EsYUFBQTs7QUFFTixjQUFjLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJOztBQUVyQyxZQUFEOzthQUVJLFVBQUk7O1FBQUQ7Ozs7OztRQUVDLEtBQUMsU0FBVyxLQUFDLEtBQUssZUFBTixLQUFDLEtBQUssS0FBTTtRQUN4QixLQUFDLFdBQVcsS0FBQyxLQUFLLGVBQU4sS0FBQyxLQUFLLEtBQU07UUFDeEIsS0FBQyxRQUFXO1FBQ1osS0FBQztRQUNELEtBQUMsUUFBVyxLQUFDLFlBQVcsS0FBQyxLQUFLLGVBQU4sS0FBQyxLQUFLLEtBQU0sd0JBQVUsS0FBQyxLQUFLLGVBQU4sS0FBQyxLQUFLLEtBQU0sdUJBQVMsS0FBQyxLQUFLLGVBQU4sS0FBQyxLQUFLLEtBQU07Ozt3QkFFbkYsc0JBQVMsS0FBSTs7ZUFBUSxLQUFDLEtBQUssUUFBUSxJQUFJOzs7d0JBRXZDLHFCQUFRLEtBQUksUUFBTzs7OztZQUVaLEtBQUM7O1lBQVUscUJBQVM7O1FBRXZCLEtBQUMsT0FBUztRQUNWLEtBQUMsT0FBUztRQUNWLEtBQUMsUUFBUztZQUNQLFVBQVcsV0FBVzs7WUFDckIsTUFBVSxXQUFXLFFBQVE7WUFDN0IsS0FBQyxTQUFTLE1BQU0sU0FBUyxPQUFRO1lBQ2pDLEtBQUMsUUFBWSxLQUFDLE9BQU8sV0FBVyxNQUFNLE9BQVUsS0FBQyxhQUFPLElBQUksU0FBTyxLQUFVLEtBQUM7Z0JBQ3ZCOztnQkFBdkQsS0FBQyxPQUFTLE1BQU0sU0FBUyxPQUFRLE1BQU0sSUFBSTs7O1FBRS9DLEtBQUMsU0FBUztZQUVQLEtBQUMsS0FBSyxLQUFLLE9BQVEsS0FBQzs7WUFFbkIsS0FBQyxhQUFhLE9BQU8sS0FBQyxPQUFRLEtBQUM7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
//# sourceURL=../../kode/kode/renderer.kode
