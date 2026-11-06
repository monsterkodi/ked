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
        var name, s, sm, vl

        if (this.verbose)
        {
            console.log(_k_.noon(ast))
        }
        this.file = source
        if (source && globalThis.process)
        {
            this.source = slash.absolute(source,globalThis.process.cwd())
        }
        this.srcmap = null
        if (this.kode.args.map && this.source)
        {
            name = target ? slash.relative(source,slash.dir(target)) : undefined
            this.srcmap = new srcmap(this.source,name)
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
        var a, k, s, v, _193_19_, _193_33_

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
        var name, s, _389_22_

        name = ((_389_22_=n.text) != null ? _389_22_ : n)
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
        var b, bind, bn, con, e, mi, mthds, s, superCall, _428_29_, _434_50_

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
                    con.keyval.val.func.body.exps = ((_434_50_=con.keyval.val.func.body.exps) != null ? _434_50_ : [])
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
        var key, member, memberTok, s, _467_32_

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
        var b, bind, bn, callsSuper, con, e, mi, mthds, s, _509_54_, _515_50_

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
                        con.keyval.val.func.body.exps = ((_509_54_=con.keyval.val.func.body.exps) != null ? _509_54_ : [])
                        con.keyval.val.func.body.exps.unshift({type:'code',text:`this[\"${bn}\"] = this[\"${bn}\"].bind(this)`})
                    }
                }
                if (n.extends)
                {
                    con.keyval.val.func.body.exps = ((_515_50_=con.keyval.val.func.body.exps) != null ? _515_50_ : [])
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
        var at, f, key, member, memberTok, name, s, _540_23_, _540_28_, _560_23_, _560_28_, _560_34_

        s = ''
        if (f = ((_540_23_=n.keyval) != null ? (_540_28_=_540_23_.val) != null ? _540_28_.func : undefined : undefined))
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
            if (((_560_23_=n.keyval) != null ? (_560_28_=_560_23_.key) != null ? (_560_34_=_560_28_.text) != null ? _560_34_[0] : undefined : undefined : undefined) === '@')
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
        var ast, bind, con, m, name, _585_37_

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
            else if (_k_.in((m.keyval.val.func != null ? m.keyval.val.func.arrow.text : undefined),['=>','○=>']))
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
        var args, at, gi, mark, member, memberTok, s, str, t, ths, vs, _602_22_, _602_29_, _612_17_, _633_21_, _633_29_, _649_22_, _649_32_

        if (!n)
        {
            return ''
        }
        gi = this.ind()
        name = (name != null ? name : ((_602_29_=(n.name != null ? n.name.text : undefined)) != null ? _602_29_ : 'function'))
        if (n.arrow.text[0] === '○')
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
        args = ((_633_21_=n.args) != null ? (_633_29_=_633_21_.parens) != null ? _633_29_.exps : undefined : undefined)
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
        if (((_649_22_=n.body.exps) != null ? _649_22_[0] != null ? (_649_32_=_649_22_[0].call) != null ? _649_32_.callee.text : undefined : undefined : undefined) === 'super')
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
            var i, l, lThis, prop, t, thisThis, thisTok, tok, txt, _691_26_, _691_39_, _691_44_, _697_43_, _699_34_, _714_64_

            prop = ((_691_26_=a.prop) != null ? _691_26_ : ((_691_39_=a.operation) != null ? (_691_44_=_691_39_.lhs) != null ? _691_44_.prop : undefined : undefined))
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
            thisTok = (prop != null ? (_699_34_=prop.obj) != null ? _699_34_.type : undefined : undefined) === 'this' ? prop.obj : null
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
                            return this.mark(`${txt}` + (((_714_64_=t.split('=')[1]) != null ? _714_64_ : '')),tok)
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
                    return `_k_.dbg(${'\"' + (this.source || '???') + '\"'}, ${p.callee.line}, ${p.callee.col}, ${msg}, ${this.nodes(p.args,',')})`

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
                    return `_k_.assert(${'\"' + (this.source || '???') + '\"'}, ${p.callee.line}, ${p.callee.col}, ${msg}, ${this.nodes(p.args,',')})`

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
        var e, s, _848_17_

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
        var fnc, i, numArgs, rv, _870_23_, _870_29_, _870_35_, _870_43_, _870_49_, _915_20_, _915_26_, _915_32_, _915_38_

        numArgs = ((_870_23_=n.fnc) != null ? (_870_29_=_870_23_.func) != null ? (_870_35_=_870_29_.args) != null ? (_870_43_=_870_35_.parens) != null ? (_870_49_=_870_43_.exps) != null ? _870_49_.length : undefined : undefined : undefined : undefined : undefined)
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
            if (((_915_20_=n.fnc) != null ? (_915_26_=_915_20_.func) != null ? (_915_32_=_915_26_.body) != null ? (_915_38_=_915_32_.exps) != null ? _915_38_.length : undefined : undefined : undefined : undefined) > 0)
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
        var e, eb, g2, gi, iterVar, j, list, listVar, nl, postfix, prefix, s, v, _957_27_, _979_28_

        if (!n.list.qmrkop && !n.list.array && !n.list.slice)
        {
            this.hint._k_.list = true
            list = `_k_.list(${this.atom(n.list)})`
        }
        else
        {
            if (((_957_27_=n.list.array) != null ? _957_27_.items[0] != null ? _957_27_.items[0].slice : undefined : undefined) || n.list.slice)
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
        var e, eb, end, g2, gi, invCmp, iterCmp, iterDir, iterEnd, iterStart, iterTok, iterVar, llc, loopCheck, loopStart, loopUpdate, lv, nl, postfix, prefix, rlc, rv, s, slice, start, _1002_28_, _1002_46_, _1012_32_

        slice = ((_1002_46_=((_1002_28_=n.list.array) != null ? _1002_28_.items[0] != null ? _1002_28_.items[0].slice : undefined : undefined)) != null ? _1002_46_ : n.list.slice)
        gi = lineBreak || this.ind()
        nl = lineBreak || '\n'
        eb = lineBreak && ';' || '\n'
        g2 = lineBreak ? '' : this.indent
        iterVar = ((_1012_32_=n.vals.text) != null ? _1012_32_ : n.vals[0].text)
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
        var s, _1197_28_

        return s = tok.type === 'comment' ? this.comment(tok) : tok.type === 'this' ? 'this' : tok.type === 'triple' ? '`' + tok.text.slice(3, -3) + '`' : tok.type === 'bool' && tok.text === 'yes' ? 'true' : tok.type === 'bool' && tok.text === 'no' ? 'false' : (tok.type != null ? tok.type.startsWith('prof') : undefined) ? this.prof(tok) : tok.text
    }

    Renderer.prototype["comment"] = function (tok)
    {
        var _1204_19_

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
        var close, first, i, ind, keyval, lhs, o, open, opmap, prfx, rhs, ro, s, sep, v, val, _1233_29_, _1233_40_, _1265_25_, _1265_43_, _1265_54_, _1265_64_, _1298_18_, _1298_29_, _1304_25_, _1308_30_, _1313_30_, _1321_30_, _1329_30_, _1334_30_, _1339_30_, _1348_43_

        opmap = function (o)
        {
            var omp, _1226_19_

            omp = {and:'&&',or:'||',not:'!',empty:'_k_.empty',valid:'!_k_.empty',eql:'_k_.eql','==':'===','!=':'!=='}
            return ((_1226_19_=omp[o]) != null ? _1226_19_ : o)
        }
        o = opmap(op.operator.text)
        sep = ' '
        if ((!op.lhs && !(_k_.in(op.operator.text,['delete','new']))) || !op.rhs)
        {
            sep = ''
        }
        if (_k_.in(o,['<','<=','===','!==','>=','>','_k_.eql']))
        {
            ro = opmap(((_1233_29_=op.rhs) != null ? (_1233_40_=_1233_29_.operation) != null ? _1233_40_.operator.text : undefined : undefined))
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
                v = this.makeVar(op.operator)
                s = `var ${v} = ${this.atom(op.rhs)}`
                var list1 = _k_.list(op.lhs.array.items)
                for (var _b_ = 0; _b_ < list1.length; _b_++)
                {
                    val = list1[_b_]
                    i = op.lhs.array.items.indexOf(val)
                    s += `; ${this.mark(val.text,val)} = ${v}[${i}]`
                }
                return s + '\n'
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
        var lhs, rhs, s

        lhs = this.node(p.lhs)
        rhs = this.node(p.rhs)
        if (p.async)
        {
            lhs = `await (${lhs})`
            rhs = `await (${rhs})`
        }
        s = 'compare(' + lhs + ',' + rhs + ')'
        return s
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
        var ctx, _1551_24_, _1554_25_

        ctx = ((_1551_24_=this.fncsName) != null ? _1551_24_ : this.mthdName)
        ctx = (ctx != null ? ctx : '_k_')
        if (ctx === 'constructor')
        {
            ctx = '@'
        }
        this.varcontext[ctx] = ((_1554_25_=this.varcontext[ctx]) != null ? _1554_25_ : 0)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9yZW5kZXJlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O09BQ2MsV0FBUDtPQUFZLFlBQVo7O09BQ0QsWUFBQTtJQUFRO0lBQWE7O09BQ3JCLFlBQUE7O09BQ0EsYUFBQTs7QUFFTixjQUFjLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJOztBQUVyQyxZQUFEOzthQUVJLFVBQUk7O1FBQUQ7Ozs7OztRQUVDLEtBQUMsU0FBVyxLQUFDLEtBQUssZUFBTixLQUFDLEtBQUssS0FBTTtRQUN4QixLQUFDLFdBQVcsS0FBQyxLQUFLLGVBQU4sS0FBQyxLQUFLLEtBQU07UUFDeEIsS0FBQyxRQUFXO1FBQ1osS0FBQztRQUNELEtBQUMsUUFBVyxLQUFDLFlBQVcsS0FBQyxLQUFLLGVBQU4sS0FBQyxLQUFLLEtBQU0sd0JBQVUsS0FBQyxLQUFLLGVBQU4sS0FBQyxLQUFLLEtBQU0sdUJBQVMsS0FBQyxLQUFLLGVBQU4sS0FBQyxLQUFLLEtBQU07Ozt3QkFFbkYsc0JBQVMsS0FBSTs7ZUFBUSxLQUFDLEtBQUssUUFBUSxJQUFJOzs7d0JBRXZDLHFCQUFRLEtBQUksUUFBTzs7OztZQUVaLEtBQUM7O1lBQVUscUJBQVM7O1FBRXZCLEtBQUMsT0FBTztZQUNMLFVBQVcsV0FBVzs7WUFDckIsS0FBQyxTQUFTLE1BQU0sU0FBUyxPQUFRLFdBQVcsUUFBUTs7UUFFeEQsS0FBQyxTQUFTO1lBRVAsS0FBQyxLQUFLLEtBQUssT0FBUSxLQUFDOztZQUVuQixPQUFVLFNBQVksTUFBTSxTQUFTLE9BQVEsTUFBTSxJQUFJO1lBRXZELEtBQUMsYUFBYSxPQUFPLEtBQUMsT0FBUTtZQUM5QixLQUFDLE9BQU8sVUFBVSxLQUFDOztRQUV2QixLQUFDLE1BQU07UUFFUCxLQUFDLFFBQU87UUFDUixLQUFDLFlBQVksSUFBSTtRQUNqQixLQUFDLFNBQVM7UUFDVixLQUFDLFdBQVc7UUFDWixLQUFDO1FBRUQsSUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/renderer.kode
