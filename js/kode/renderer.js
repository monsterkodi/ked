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
            var _a_ = this.prepareMethods(mthds); con = _a_[0]; bind = _a_[1]

            if (bind.length)
            {
                var list = _k_.list(con.keyval.val.func.body.exps)
                for (var _b_ = 0; _b_ < list.length; _b_++)
                {
                    e = list[_b_]
                    if ((e.call != null ? e.call.callee.text : undefined) === 'super')
                    {
                        superCall = con.keyval.val.func.body.exps.splice(con.keyval.val.func.body.exps.indexOf(e),1)[0]
                        break
                    }
                }
                var list1 = _k_.list(bind)
                for (var _c_ = 0; _c_ < list1.length; _c_++)
                {
                    b = list1[_c_]
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
            for (var _d_ = mi = 0, _e_ = mthds.length; (_d_ <= _e_ ? mi < mthds.length : mi > mthds.length); (_d_ <= _e_ ? ++mi : --mi))
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
            var _b_ = this.prepareMethods(mthds); con = _b_[0]; bind = _b_[1]

            if (con)
            {
                if (bind.length)
                {
                    var list1 = _k_.list(bind)
                    for (var _c_ = 0; _c_ < list1.length; _c_++)
                    {
                        b = list1[_c_]
                        bn = b.keyval.val.func.name.text
                        con.keyval.val.func.body.exps = ((_514_54_=con.keyval.val.func.body.exps) != null ? _514_54_ : [])
                        con.keyval.val.func.body.exps.unshift({type:'code',text:`this[\"${bn}\"] = this[\"${bn}\"].bind(this)`})
                    }
                }
                if (n.extends)
                {
                    con.keyval.val.func.body.exps = ((_520_50_=con.keyval.val.func.body.exps) != null ? _520_50_ : [])
                    var list2 = _k_.list(con.keyval.val.func.body.exps)
                    for (var _d_ = 0; _d_ < list2.length; _d_++)
                    {
                        e = list2[_d_]
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
            for (var _e_ = mi = 0, _f_ = mthds.length; (_e_ <= _f_ ? mi < mthds.length : mi > mthds.length); (_e_ <= _f_ ? ++mi : --mi))
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
            var _a_ = this.args(args); str = _a_[0]; ths = _a_[1]

            s += str
        }
        s += ')\n'
        s += gi + '{'
        this.varstack.push(n.body.vars)
        if (!_k_.empty(ths))
        {
            s += '\n'
            var list = _k_.list(ths)
            for (var _b_ = 0; _b_ < list.length; _b_++)
            {
                t = list[_b_]
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
        var elif, first, gi, last, s

        first = firstLineCol(n)
        last = lastLineCol(n)
        if ((first.line === last.line && n.else && !n.returns) || n.inline)
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
            s += g2 + prefix + this.node(e) + postfix + nl
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
            s += g2 + prefix + this.node(e) + postfix + nl
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
            s += g2 + prefix + this.node(e) + postfix + nl
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
                s += this.indent + '    ' + this.node(e) + '\n'
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
            s += gi + '    ' + this.node(e) + '\n'
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
        var close, first, ind, keyval, lhs, o, open, opmap, prfx, rhs, ro, s, sep, _1238_29_, _1238_40_, _1265_25_, _1265_43_, _1265_54_, _1265_64_, _1298_18_, _1298_29_, _1304_25_, _1308_30_, _1313_30_, _1321_30_, _1329_30_, _1334_30_, _1339_30_, _1348_43_

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
                return this.arrayAssign(op.lhs.array.items,this.atom(op.rhs),op.operator) + '\n'
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
                else
                {
                    return `${this.atom(op.lhs)} instanceof ${this.atom(op.rhs)}`
                }
            }
        }
        first = firstLineCol(op.lhs)
        prfx = first.col === 0 && (op.rhs != null ? op.rhs.func : undefined) ? '\n' : ''
        lhs = op.lhs ? this.atom(op.lhs) + sep : ''
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
        var addOne, from, ni, slice, u, upper, upto, _1387_32_, _1391_32_, _1393_25_, _1393_54_, _1409_27_

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
        var from, o, upto, x, _1429_41_

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

    Renderer.prototype["arrayAssign"] = function (items, rhs, tok)
    {
        var i, s, v

        v = this.makeVar(tok)
        s = `var ${v} = ${rhs}`
        for (var _a_ = i = 0, _b_ = items.length; (_a_ <= _b_ ? i < items.length : i > items.length); (_a_ <= _b_ ? ++i : --i))
        {
            s += '; ' + this.arrayTarget(items[i],`${v}[${i}]`,tok)
        }
        return s
    }

    Renderer.prototype["arrayTarget"] = function (val, src, tok)
    {
        if (_k_.in(val.type,['var','keyword']))
        {
            return `${this.mark(val.text,val)} = ${src}`
        }
        if (val.array)
        {
            return this.arrayAssign(val.array.items,src,tok)
        }
        if ((val.prop || val.index) && !this.containsAssert(val))
        {
            return `${this.node(val)} = ${src}`
        }
        return this.onError("invalid destructuring target: only names, members, indices and arrays can be assigned",firstLineCol(val))
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
        var ctx, _1566_24_, _1569_25_

        ctx = ((_1566_24_=this.fncsName) != null ? _1566_24_ : this.mthdName)
        ctx = (ctx != null ? ctx : '_k_')
        if (ctx === 'constructor')
        {
            ctx = '@'
        }
        this.varcontext[ctx] = ((_1569_25_=this.varcontext[ctx]) != null ? _1569_25_ : 0)
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
