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
        for (i = 0; i < nodes.length; i++)
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
            for (i = 0; i < mtch.length; i++)
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
            for (i = 0; i < mtch.length; i++)
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
            for (mi = 0; mi < mthds.length; mi++)
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
            for (mi = 0; mi < mthds.length; mi++)
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
        var a, atEnd, i, str, ths, used, _691_89_, _691_96_

        ths = []
        used = {}
        var list = _k_.list(args)
        for (i = 0; i < list.length; i++)
        {
            a = list[i]
            atEnd = i === args.length - 1
            if (a.spread && !atEnd || a.text === '...' && (!atEnd || i === 0 || args[i - 1].type !== 'var'))
            {
                this.onError("rest parameters are written (a b…) -> and go last",((_691_96_=(a.spread != null ? a.spread.dots : undefined)) != null ? _691_96_ : a))
            }
        }
        if (args.length > 1 && args.slice(-1)[0].text === '...' && args.slice(-2,-1)[0].type === 'var')
        {
            args.pop()
            args.slice(-1)[0].text = '...' + args.slice(-1)[0].text
        }
        var list1 = _k_.list(args)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            a = list1[_b_]
            if (a.text)
            {
                used[a.text] = a.text
            }
        }
        args = args.map((function (a)
        {
            var l, lThis, prop, t, thisThis, thisTok, tok, txt, _702_26_, _702_39_, _702_44_, _708_43_, _710_34_, _725_64_

            prop = ((_702_26_=a.prop) != null ? _702_26_ : ((_702_39_=a.operation) != null ? (_702_44_=_702_39_.lhs) != null ? _702_44_.prop : undefined : undefined))
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
            thisTok = (prop != null ? (_710_34_=prop.obj) != null ? _710_34_.type : undefined : undefined) === 'this' ? prop.obj : null
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
                            return this.mark(`${txt}` + (((_725_64_=t.split('=')[1]) != null ? _725_64_ : '')),tok)
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
        var e, s, _859_17_

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
        var fnc, i, numArgs, rv, _881_23_, _881_29_, _881_35_, _881_43_, _881_49_, _926_20_, _926_26_, _926_32_, _926_38_

        numArgs = ((_881_23_=n.fnc) != null ? (_881_29_=_881_23_.func) != null ? (_881_35_=_881_29_.args) != null ? (_881_43_=_881_35_.parens) != null ? (_881_49_=_881_43_.exps) != null ? _881_49_.length : undefined : undefined : undefined : undefined : undefined)
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
            if (((_926_20_=n.fnc) != null ? (_926_26_=_926_20_.func) != null ? (_926_32_=_926_26_.body) != null ? (_926_38_=_926_32_.exps) != null ? _926_38_.length : undefined : undefined : undefined : undefined) > 0)
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
        var e, eb, g2, gi, iterVar, j, list, listVar, nl, postfix, prefix, s, v, _968_27_, _990_28_

        if (!n.list.qmrkop && !n.list.array && !n.list.slice)
        {
            this.hint._k_.list = true
            list = `_k_.list(${this.atom(n.list)})`
        }
        else
        {
            if (((_968_27_=n.list.array) != null ? _968_27_.items[0] != null ? _968_27_.items[0].slice : undefined : undefined) || n.list.slice)
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
            for (j = 0; j < n.vals.array.items.length; j++)
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
        for (var _a_ = 0; _a_ < list1.length; _a_++)
        {
            e = list1[_a_]
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
        var dnCmp, e, eb, excl, g2, gi, iterCmp, iterEnd, iterStart, iterStep, iterTok, iterVar, literal, loopCheck, loopStart, loopUpdate, nl, postfix, prefix, s, slice, step, sv, upCmp, _1013_28_, _1013_46_, _1023_32_

        slice = ((_1013_46_=((_1013_28_=n.list.array) != null ? _1013_28_.items[0] != null ? _1013_28_.items[0].slice : undefined : undefined)) != null ? _1013_46_ : n.list.slice)
        gi = lineBreak || this.ind()
        nl = lineBreak || '\n'
        eb = lineBreak && ';' || '\n'
        g2 = lineBreak ? '' : this.indent
        iterVar = ((_1023_32_=n.vals.text) != null ? _1023_32_ : n.vals[0].text)
        iterTok = n.vals.text ? n.vals : n.vals[0]
        iterStart = this.node(slice.from)
        iterEnd = this.node(slice.upto)
        literal = (function (s)
        {
            return /^-?\d+(\.\d+)?$/.test(this.plain(s))
        }).bind(this)
        excl = slice.dots.text === '...'
        upCmp = excl ? '<' : '<='
        dnCmp = excl ? '>' : '>='
        loopStart = `${this.mark(iterVar,iterTok)} = ${iterStart}`
        if (n.step)
        {
            iterStep = this.node(n.step)
            if (literal(iterStep))
            {
                step = Number(this.plain(iterStep))
                if (step === 0)
                {
                    this.onError("'by' step can't be 0",firstLineCol(n.step))
                }
                iterCmp = step > 0 ? upCmp : dnCmp
                loopUpdate = step === 1 ? `${iterVar}++` : step === -1 ? `${iterVar}--` : step > 0 ? `${iterVar} += ${step}` : `${iterVar} -= ${-step}`
                loopCheck = `${iterVar} ${iterCmp} ${iterEnd}`
            }
            else
            {
                sv = this.makeVar()
                loopStart = `var ${sv} = ${iterStep}, ${loopStart}`
                loopCheck = `(${sv} > 0 ? ${iterVar} ${upCmp} ${iterEnd} : ${iterVar} ${dnCmp} ${iterEnd})`
                loopUpdate = `${iterVar} += ${sv}`
            }
        }
        else if (literal(iterStart) && literal(iterEnd) && Number(this.plain(iterStart)) > Number(this.plain(iterEnd)))
        {
            loopCheck = `${iterVar} ${dnCmp} ${iterEnd}`
            loopUpdate = `${iterVar}--`
        }
        else
        {
            loopCheck = `${iterVar} ${upCmp} ${iterEnd}`
            loopUpdate = `${iterVar}++`
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
        var s, _1219_28_

        return s = tok.type === 'comment' ? this.comment(tok) : tok.type === 'this' ? 'this' : tok.type === 'triple' ? '`' + tok.text.slice(3, -3) + '`' : tok.type === 'bool' && tok.text === 'yes' ? 'true' : tok.type === 'bool' && tok.text === 'no' ? 'false' : (tok.type != null ? tok.type.startsWith('prof') : undefined) ? this.prof(tok) : tok.text
    }

    Renderer.prototype["comment"] = function (tok)
    {
        var _1226_19_

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
        var close, flc, isAssign, lhs, o, open, opmap, prfx, rhs, ro, s, sep, _1255_29_, _1255_40_, _1274_25_, _1274_43_, _1274_54_, _1274_64_, _1307_18_, _1307_29_, _1313_25_, _1317_30_, _1322_30_, _1330_30_, _1338_30_, _1343_30_, _1348_30_, _1353_30_, _1353_51_, _1359_41_

        opmap = function (o)
        {
            var omp, _1248_19_

            omp = {and:'&&',or:'||',not:'!',empty:'_k_.empty',valid:'!_k_.empty',eql:'_k_.eql','==':'===','!=':'!=='}
            return ((_1248_19_=omp[o]) != null ? _1248_19_ : o)
        }
        o = opmap(op.operator.text)
        sep = ' '
        if ((!op.lhs && !(_k_.in(op.operator.text,['delete','new']))) || !op.rhs)
        {
            sep = ''
        }
        if (_k_.in(o,['<','<=','===','!==','>=','>','_k_.eql']))
        {
            ro = opmap(((_1255_29_=op.rhs) != null ? (_1255_40_=_1255_29_.operation) != null ? _1255_40_.operator.text : undefined : undefined))
            if (_k_.in(ro,['<','<=','===','!==','>=','>','_k_.eql']))
            {
                return '(' + this.atom(op.lhs) + sep + o + sep + this.atom(op.rhs.operation.lhs) + ' && ' + kstr.lstrip(this.atom(op.rhs)) + ')'
            }
        }
        open = close = ''
        if (o === '=')
        {
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
            if ((op.rhs != null ? op.rhs.incond : undefined) || _k_.in(((_1274_43_=op.rhs) != null ? (_1274_54_=_1274_43_.operation) != null ? (_1274_64_=_1274_54_.operator) != null ? _1274_64_.text : undefined : undefined : undefined),['=','is']))
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
        else if (((_1307_18_=op.rhs) != null ? (_1307_29_=_1307_18_.operation) != null ? _1307_29_.operator.text : undefined : undefined) === '=')
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

    Renderer.prototype["destruct"] = function (p)
    {
        var keys

        keys = p.keys.map((function (k)
        {
            if (k.key.text === k.target.text)
            {
                return this.mark(k.target.text,k.target)
            }
            else
            {
                return k.key.text + ': ' + this.mark(k.target.text,k.target)
            }
        }).bind(this))
        return `({${keys.join(', ')}} = ${this.atom(p.rhs)})`
    }

    Renderer.prototype["incond"] = function (p)
    {
        this.hint._k_.in = true
        return `_k_.in(${this.atom(p.lhs)},${this.atom(p.rhs)})`
    }

    Renderer.prototype["parens"] = function (p)
    {
        var e

        var list = _k_.list(p.exps)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            e = list[_a_]
            if (e.spread)
            {
                this.onError("… only spreads into call arguments and arrays",e.spread.dots)
            }
        }
        return `(${this.nodes(p.exps)})`
    }

    Renderer.prototype["spread"] = function (p)
    {
        return '...' + this.atom(p.exp)
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
        var addOne, from, ni, slice, u, upper, upto, _1412_32_, _1416_32_, _1418_25_, _1418_54_, _1434_27_

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
        var d, from, i, o, r, upto, x, _1454_41_

        if ((p.from.type === 'num' && 'num' === (p.upto != null ? p.upto.type : undefined)))
        {
            from = parseInt(p.from.text)
            upto = parseInt(p.upto.text)
            d = from <= upto ? 1 : -1
            if (p.dots.text === '...')
            {
                upto -= d
            }
            if (Math.abs(upto - from) <= 10)
            {
                r = []
                x = from
                while (x * d <= upto * d)
                {
                    r.push(x)
                    x += d
                }
                return '[' + r.join(',') + ']'
            }
            else
            {
                o = p.dots.text === '...' ? '<' : '<='
                o = d > 0 ? o : o.replace('<','>')
                i = d > 0 ? 'i++' : 'i--'
                return `(function() { var r = []; for (var i = ${from}; i ${o} ${p.upto.text}; ${i}){ r.push(i); } return r; }).apply(this)`
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
        var _1547_83_

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
        var ctx, _1624_24_, _1627_25_

        ctx = ((_1624_24_=this.fncsName) != null ? _1624_24_ : this.mthdName)
        ctx = (ctx != null ? ctx : '_k_')
        if (ctx === 'constructor')
        {
            ctx = '@'
        }
        this.varcontext[ctx] = ((_1627_25_=this.varcontext[ctx]) != null ? _1627_25_ : 0)
        this.varcontext[ctx] = this.varcontext[ctx] + 1
        return `_${(this.varcontext[ctx] + 9).toString(16)}_`
    }

    Renderer.prototype["verb"] = function (...args)
    {
        if (this.debug)
        {
            return console.log(...args)
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
