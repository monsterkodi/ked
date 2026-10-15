var _k_ = {noon: function (obj) { 
    var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; 
    var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; 
    var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = '|'+k+'|' } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; 
    var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; 
    return toStr(obj);
}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, each_r: function (o) {return Array.isArray(o) ? [] : typeof o == 'string' ? o.split('') : {}}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isFunc: function (o) {return typeof o === 'function'}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, isArr: function (o) {return Array.isArray(o)}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}};_k_.R4=_k_.k.B256(_k_.k.R(4))

var kolorNames

import kstr from "../kxk/kstr.js"
import slash from "../kxk/slash.js"

import utils from "./utils.js"
let firstLineCol = utils.firstLineCol
let lastLineCol = utils.lastLineCol

import print from "./print.js"

import srcmap from "./srcmap.js"

kolorNames = ['r','g','b','c','m','y','w']
class Renderer
{
    constructor (kode)
    {
        this.kode = kode
    
        var _20_30_, _21_30_, _27_42_, _27_64_, _27_85_

        this.plain = this.plain.bind(this)
        this.mark = this.mark.bind(this)
        this.debug = (this.kode.args != null ? this.kode.args.debug : undefined)
        this.verbose = (this.kode.args != null ? this.kode.args.verbose : undefined)
        this.hint = {_k_:{}}
        this.varstack = []
        this.trace = this.verbose || (this.kode.args != null ? this.kode.args.tokens : undefined) || (this.kode.args != null ? this.kode.args.block : undefined) || (this.kode.args != null ? this.kode.args.parse : undefined)
    }

    onError (msg, info)
    {
        return this.kode.onError(msg,info)
    }

    render (ast, source, target)
    {
        var name, s, sm, vl

        if (this.verbose)
        {
            console.log(_k_.noon(ast))
        }
        this.file = source
        if (source && globalThis.process)
        {
            this.source = slash.relative(source,globalThis.process.cwd())
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
        return s
    }

    mark (s, tok)
    {
        if (this.srcmap && !_k_.empty(tok.line))
        {
            return this.srcmap.mark(s,tok)
        }
        else
        {
            return s
        }
    }

    plain (s)
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

    header (s)
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

    nodes (nodes, sep = ',', tl)
    {
        var a, i, s, stripped

        if (!(nodes != null))
        {
            console.log('no nodes?!?',this.stack,this.sheap)
            print.ast('no nodes',this.ast)
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

    node (exp)
    {
        var a, k, s, v, _247_19_, _247_33_

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
                console.log(_k_.R4(`renderer.node unhandled key ${k} in exp`),exp)
            }
        }
        return s
    }

    atom (exp)
    {
        return this.fixAsserts(this.node(exp))
    }

    qmrkop (p)
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

    qmrkcolon (p)
    {
        return `(${this.atom(p.lhs)} ? ${this.atom(p.mid)} : ${this.atom(p.rhs)})`
    }

    assert (p)
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

    fixAsserts (s)
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

    use (n)
    {
        var item, m, mod, name, s, _378_25_, _397_25_, _414_29_

        s = ''
        if (!_k_.empty(n.items))
        {
            if (n.toUse.length > 1)
            {
                console.error('items for multiple modules?!')
            }
            m = n.toUse[0]
            mod = ((_378_25_=m.text) != null ? _378_25_ : m)
            name = slash.name(mod)
            s += 'import ' + name
            if (mod[0] === '.')
            {
                s += ` from \"${slash.swapExt(mod,'js')}\"\n`
            }
            else
            {
                s += ` from \"${mod}\"\n`
            }
            var list = _k_.list(n.items)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                item = list[_a_]
                s += `let ${item} = ${name}.${item}\n`
            }
        }
        else if (!_k_.empty(n.name))
        {
            if (n.toUse.length > 1)
            {
                console.error('named import for multiple modules?!')
            }
            m = n.toUse[0]
            mod = ((_397_25_=m.text) != null ? _397_25_ : m)
            name = slash.name(mod)
            s += 'import ' + n.name
            if (mod[0] === '.')
            {
                s += ` from \"${slash.swapExt(mod,'js')}\"\n`
            }
            else
            {
                s += ` from \"${mod}\"\n`
            }
        }
        else
        {
            var list1 = _k_.list(n.toUse)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                m = list1[_b_]
                name = slash.name(m.text)
                s += 'import ' + name
                mod = ((_414_29_=m.text) != null ? _414_29_ : m)
                if (true)
                {
                    if (mod[0] === '.')
                    {
                        s += ` from \"${slash.swapExt(mod,'js')}\"\n`
                    }
                    else
                    {
                        s += ` from \"${mod}\"\n`
                    }
                }
            }
        }
        return s
    }

    import (n)
    {
        var s

        s = ''
        s += 'import '
        s += this.nodes(n.args,' ')
        return s
    }

    export (n)
    {
        var a, s

        s = ''
        s += 'export '
        if (_k_.isArr(n.args))
        {
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

    dirFile (n)
    {
        var s

        s = ''
        if (n === 'dir')
        {
            this.hint._k_.dir = true
            s = "_k_.dir()"
        }
        if (n === 'file')
        {
            this.hint._k_.file = true
            s = "_k_.file()"
        }
        return s
    }

    main (n)
    {
        var idt, s

        idt = _k_.rpad(4)
        s = 'if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])'
        s += '\n{\n'
        s += idt + this.nodes(n,'\n' + idt)
        s += '\n}'
        return s
    }

    class (n)
    {
        var b, bind, bn, con, e, mi, mthds, s, superCall, _510_29_, _516_50_

        s = ''
        s += `class ${n.name.text}`
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
                    con.keyval.val.func.body.exps = ((_516_50_=con.keyval.val.func.body.exps) != null ? _516_50_ : [])
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

    super (p)
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

    mthd (n)
    {
        var s, _561_32_

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
                    s += this.indent + 'static ' + n.keyval.key.text.slice(1) + ' = ' + this.node(n.keyval.val)
                }
                else
                {
                    console.log('what is this?',n)
                }
            }
        }
        return s
    }

    function (n)
    {
        var b, bind, bn, callsSuper, con, e, mi, mthds, s, _601_50_, _607_46_

        this.fncnName = n.name.text
        s = '\n'
        s += `${this.fncnName} = (function ()\n`
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

            if (bind.length)
            {
                var list1 = _k_.list(bind)
                for (var _c_ = 0; _c_ < list1.length; _c_++)
                {
                    b = list1[_c_]
                    bn = b.keyval.val.func.name.text
                    con.keyval.val.func.body.exps = ((_601_50_=con.keyval.val.func.body.exps) != null ? _601_50_ : [])
                    con.keyval.val.func.body.exps.unshift({type:'code',text:`this[\"${bn}\"] = this[\"${bn}\"].bind(this)`})
                }
            }
            if (n.extends)
            {
                con.keyval.val.func.body.exps = ((_607_46_=con.keyval.val.func.body.exps) != null ? _607_46_ : [])
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
            this.indent = '    '
            for (var _e_ = mi = 0, _f_ = mthds.length; (_e_ <= _f_ ? mi < mthds.length : mi > mthds.length); (_e_ <= _f_ ? ++mi : --mi))
            {
                s += this.funcs(mthds[mi],n.name.text)
                s += '\n'
            }
            this.indent = ''
        }
        delete this.fncnName
        s += `    return ${n.name.text}\n`
        s += '})()\n'
        return s
    }

    funcs (n, className)
    {
        var f, member, s, _638_23_, _638_28_, _653_23_, _653_28_, _653_34_

        s = ''
        if (f = ((_638_23_=n.keyval) != null ? (_638_28_=_638_23_.val) != null ? _638_28_.func : undefined : undefined))
        {
            if (f.name.text === 'constructor')
            {
                this.fncsName = 'constructor'
                s = this.indent + this.func(f,'function ' + className)
                s += '\n'
            }
            else if (f.name.text.startsWith('static'))
            {
                this.fncsName = f.name.text.slice(7)
                s = this.indent + this.func(f,`${className}[\"${this.fncsName}\"] = function`)
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
            if (((_653_23_=n.keyval) != null ? (_653_28_=_653_23_.key) != null ? (_653_34_=_653_28_.text) != null ? _653_34_[0] : undefined : undefined : undefined) === '@')
            {
                member = n.keyval.key.text.slice(1)
                s = this.indent + `${className}[\"${member}\"] = ` + this.node(n.keyval.val)
            }
        }
        return s
    }

    prepareMethods (mthds)
    {
        var ast, bind, con, m, name, _682_37_

        bind = []
        var list = _k_.list(mthds)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            m = list[_a_]
            if (!m.keyval)
            {
                print.ast('not a method?',m)
                print.ast('not a method?',mthds)
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

    func (n, name)
    {
        var args, gi, s, str, t, ths, vs, _705_22_, _705_29_, _718_21_, _718_29_, _734_22_, _734_32_

        if (!n)
        {
            return ''
        }
        gi = this.ind()
        name = (name != null ? name : ((_705_29_=(n.name != null ? n.name.text : undefined)) != null ? _705_29_ : 'function'))
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
        s = name
        s += ' ('
        args = ((_718_21_=n.args) != null ? (_718_29_=_718_21_.parens) != null ? _718_29_.exps : undefined : undefined)
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
        if (((_734_22_=n.body.exps) != null ? _734_22_[0] != null ? (_734_32_=_734_22_[0].call) != null ? _734_32_.callee.text : undefined : undefined : undefined) === 'super')
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

    args (args)
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
            var i, l, t, txt, _797_58_

            t = this.plain(this.node(a))
            if ((t != null ? t.startsWith('this.') : undefined))
            {
                l = _k_.trim(t.split('=')[0])
                txt = l.slice(5)
                if (used[txt])
                {
                    for (i = 1; i <= 100; i++)
                    {
                        if (!used[txt + i])
                        {
                            ths.push(`this.${txt} = ${txt + i}`)
                            txt += i
                            used[txt] = txt
                            return `${txt}` + (((_797_58_=t.split('=')[1]) != null ? _797_58_ : ''))
                        }
                    }
                }
                else
                {
                    ths.push(`${l} = ${txt}`)
                }
                return t.slice(5)
            }
            return t
        }).bind(this))
        str = args.join(', ')
        return [str,ths]
    }

    return (n)
    {
        var s

        s = 'return ' + this.node(n.val)
        return _k_.trim(s)
    }

    await (n)
    {
        var s

        s = 'await ' + this.node(n.exp)
        return _k_.trim(s)
    }

    call (p)
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
                return `_k_.${name}(${this.nodes(p.args,',')})`
            }
            if (name.length === 3 && /[1-8]/.test(name[2]) && _k_.in(name[0].toLowerCase(),kolorNames) && _k_.in(name[1],kolorNames))
            {
                this.hint._k_.k = true
                this.hint._k_[name] = true
                return `_k_.${name}(${this.nodes(p.args,',')})`
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
                    if (_k_.in(p.args[0].type,['var']) || (p.args[0] != null ? p.args[0].prop : undefined) || (p.args[0] != null ? p.args[0].call : undefined))
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
                    if (_k_.in(p.args[0].type,['single','double','triple']))
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

    prof (p)
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

    if (n)
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

    ifInline (n, dontClose)
    {
        var e, s, _963_17_

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

    each (n)
    {
        var fnc, i, numArgs, rv, _1034_20_, _1034_26_, _1034_32_, _1034_38_, _989_23_, _989_29_, _989_35_, _989_43_, _989_49_

        numArgs = ((_989_23_=n.fnc) != null ? (_989_29_=_989_23_.func) != null ? (_989_35_=_989_29_.args) != null ? (_989_43_=_989_35_.parens) != null ? (_989_49_=_989_43_.exps) != null ? _989_49_.length : undefined : undefined : undefined : undefined : undefined)
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
            if (((_1034_20_=n.fnc) != null ? (_1034_26_=_1034_20_.func) != null ? (_1034_32_=_1034_26_.body) != null ? (_1034_38_=_1034_32_.exps) != null ? _1034_38_.length : undefined : undefined : undefined : undefined) > 0)
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

    for (n)
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

    for_in (n, varPrefix = '', lastPrefix = '', lastPostfix = '', lineBreak)
    {
        var e, eb, g2, gi, iterVar, j, list, listVar, nl, postfix, prefix, s, v, _1086_27_, _1108_28_

        if (!n.list.qmrkop && !n.list.array && !n.list.slice)
        {
            this.hint._k_.list = true
            list = `_k_.list(${this.atom(n.list)})`
        }
        else
        {
            if (((_1086_27_=n.list.array) != null ? _1086_27_.items[0] != null ? _1086_27_.items[0].slice : undefined : undefined) || n.list.slice)
            {
                return this.for_in_range(n,varPrefix,lastPrefix,lastPostfix,lineBreak)
            }
            list = this.node(n.list)
        }
        if (!list || list === 'undefined')
        {
            print.noon('no list for',n.list)
            print.ast('no list for',n.list)
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
            s += g2 + `${n.vals.text} = ${listVar}[${iterVar}]` + eb
        }
        else if ((n.vals.array != null ? n.vals.array.items : undefined))
        {
            s += gi + `for (var ${iterVar} = 0; ${iterVar} < ${listVar}.length; ${iterVar}++)` + nl
            s += gi + "{" + nl
            for (var _a_ = j = 0, _b_ = n.vals.array.items.length; (_a_ <= _b_ ? j < n.vals.array.items.length : j > n.vals.array.items.length); (_a_ <= _b_ ? ++j : --j))
            {
                v = n.vals.array.items[j]
                s += g2 + `${v.text} = ${listVar}[${iterVar}][${j}]` + eb
            }
        }
        else if (n.vals.length > 1)
        {
            iterVar = n.vals[1].text
            s += gi + `for (${iterVar} = 0; ${iterVar} < ${listVar}.length; ${iterVar}++)` + nl
            s += gi + "{" + nl
            s += g2 + `${varPrefix}${n.vals[0].text} = ${listVar}[${iterVar}]` + eb
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

    for_in_range (n, varPrefix, lastPrefix, lastPostfix, lineBreak)
    {
        var e, eb, end, g2, gi, invCmp, iterCmp, iterDir, iterEnd, iterStart, iterVar, llc, loopCheck, loopStart, loopUpdate, lv, nl, postfix, prefix, rlc, rv, s, slice, start, _1137_28_, _1137_46_, _1147_32_

        slice = ((_1137_46_=((_1137_28_=n.list.array) != null ? _1137_28_.items[0] != null ? _1137_28_.items[0].slice : undefined : undefined)) != null ? _1137_46_ : n.list.slice)
        gi = lineBreak || this.ind()
        nl = lineBreak || '\n'
        eb = lineBreak && ';' || '\n'
        g2 = lineBreak ? '' : this.indent
        iterVar = ((_1147_32_=n.vals.text) != null ? _1147_32_ : n.vals[0].text)
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
            loopStart = `${iterVar} = ${iterStart}`
            loopCheck = `${iterVar} ${iterCmp} ${iterEnd}`
            loopUpdate = `${iterVar}${iterDir}`
        }
        else
        {
            llc = firstLineCol(slice.from)
            rlc = firstLineCol(slice.upto)
            lv = this.makeVar(llc)
            rv = this.makeVar(rlc)
            loopStart = `var ${lv} = ${iterVar} = ${iterStart}, ${rv} = ${iterEnd}`
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

    for_of (n, varPrefix = '', lastPrefix = '', lastPostfix = '', lineBreak)
    {
        var e, eb, g2, gi, key, nl, obj, postfix, prefix, s, val, _1207_26_

        gi = lineBreak || this.ind()
        nl = lineBreak || '\n'
        eb = lineBreak && ';' || '\n'
        g2 = lineBreak ? '' : this.indent
        key = ((_1207_26_=n.vals.text) != null ? _1207_26_ : (n.vals[0] != null ? n.vals[0].text : undefined))
        val = (n.vals[1] != null ? n.vals[1].text : undefined)
        obj = this.node(n.list)
        s = ''
        s += `for (${varPrefix}${key} in ${obj})` + nl
        s += gi + "{" + nl
        if (val)
        {
            s += g2 + `${varPrefix}${val} = ${obj}[${key}]` + eb
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

    lcomp (n)
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

    while (n)
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

    switch (n)
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

    when (n)
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

    try (n)
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

    token (tok)
    {
        var s, _1366_28_

        return s = tok.type === 'comment' ? this.comment(tok) : tok.type === 'this' ? 'this' : tok.type === 'triple' ? '`' + tok.text.slice(3, -3) + '`' : tok.type === 'bool' && tok.text === 'yes' ? 'true' : tok.type === 'bool' && tok.text === 'no' ? 'false' : (tok.type != null ? tok.type.startsWith('prof') : undefined) ? this.prof(tok) : tok.text
    }

    comment (tok)
    {
        var _1379_19_

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

    operation (op)
    {
        var close, first, i, ind, keyval, lhs, o, open, opmap, prfx, rhs, ro, s, sep, v, val, _1412_29_, _1412_40_, _1444_25_, _1444_43_, _1444_54_, _1444_64_, _1477_18_, _1477_29_, _1484_25_, _1488_30_, _1493_30_, _1501_30_, _1509_30_, _1514_30_, _1519_30_, _1528_43_

        opmap = function (o)
        {
            var omp, _1405_19_

            omp = {and:'&&',or:'||',not:'!',empty:'_k_.empty',valid:'!_k_.empty',eql:'_k_.eql','==':'===','!=':'!=='}
            return ((_1405_19_=omp[o]) != null ? _1405_19_ : o)
        }
        o = opmap(op.operator.text)
        sep = ' '
        if ((!op.lhs && !(_k_.in(op.operator.text,['delete','new']))) || !op.rhs)
        {
            sep = ''
        }
        if (_k_.in(o,['<','<=','===','!==','>=','>','_k_.eql']))
        {
            ro = opmap(((_1412_29_=op.rhs) != null ? (_1412_40_=_1412_29_.operation) != null ? _1412_40_.operator.text : undefined : undefined))
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
                    s += ind + `${keyval.text} = ${this.atom(op.rhs)}.${keyval.text}\n`
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
                    s += `; ${val.text} = ${v}[${i}]`
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
            if ((op.rhs != null ? op.rhs.incond : undefined) || _k_.in(((_1444_43_=op.rhs) != null ? (_1444_54_=_1444_43_.operation) != null ? (_1444_64_=_1444_54_.operator) != null ? _1444_64_.text : undefined : undefined : undefined),['=','is']))
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
        else if (((_1477_18_=op.rhs) != null ? (_1477_29_=_1477_18_.operation) != null ? _1477_29_.operator.text : undefined : undefined) === '=')
        {
            open = '('
            close = ')'
        }
        else if (op.operator.text === 'is')
        {
            if (!op.rhs)
            {
                this.onError("'is' is missing what to test against",op.operator)
            }
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
                    return `_k_.isNum(${lhs})`
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
                        return `_k_.isObj(${lhs})`
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
                        return `_k_.isArr(${lhs})`
                    }
                }
                else if ((op.rhs != null ? op.rhs.text : undefined) === 'str')
                {
                    lhs = this.atom(op.lhs)
                    this.hint._k_.isStr = true
                    return `_k_.isStr(${lhs})`
                }
                else if ((op.rhs != null ? op.rhs.text : undefined) === 'func')
                {
                    lhs = this.atom(op.lhs)
                    this.hint._k_.isFunc = true
                    return `_k_.isFunc(${lhs})`
                }
                else if ((op.rhs != null ? op.rhs.text : undefined) === 'elem')
                {
                    lhs = this.atom(op.lhs)
                    this.hint._k_.isElem = true
                    return `_k_.isElem(${lhs})`
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

    incond (p)
    {
        this.hint._k_.in = true
        return `_k_.in(${this.atom(p.lhs)},${this.atom(p.rhs)})`
    }

    parens (p)
    {
        return `(${this.nodes(p.exps)})`
    }

    object (p, sep = ',', tl)
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

    keyval (p)
    {
        var key

        key = this.node(p.key)
        if (!(_k_.in(key[0],"'\"")) && /[\.\,\;\*\+\-\/\=\|]/.test(key))
        {
            key = `'${key}'`
        }
        return `${key}:${this.atom(p.val)}`
    }

    prop (p)
    {
        return `${this.node(p.obj)}.${this.node(p.prop)}`
    }

    index (p)
    {
        var addOne, from, ni, slice, u, upper, upto, _1601_32_, _1605_32_, _1607_25_, _1607_54_, _1623_27_

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

    array (p)
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

    slice (p)
    {
        var from, o, upto, x, _1653_41_

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

    stripol (chunks)
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

    section (p)
    {
        var gi, s

        this.hint.section = true
        gi = this.ind()
        s = `toExport[${p.title.text}] = function ()\n`
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

    subsect (p)
    {
        var gi, s

        gi = this.ind()
        s = `section(${p.title.text}, function ()\n`
        s += gi + '{\n'
        if (!_k_.empty(p.exps))
        {
            s += this.indent + this.nodes(p.exps,'\n' + this.indent) + '\n'
        }
        s += gi + '})'
        this.ded()
        return s
    }

    compare (p)
    {
        var s

        s = 'compare(' + this.node(p.lhs) + ',' + this.node(p.rhs) + ')'
        return s
    }

    containsAssert (e)
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

    pruneAssert (e)
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

    clearAsserts (e)
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

    sortVars (vars)
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

    freshVar (name, suffix = 0)
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

    lineVar (tok)
    {
        return `_${tok.line}_${tok.col}_`
    }

    makeVar (tok)
    {
        var ctx, _1802_24_, _1805_25_

        ctx = ((_1802_24_=this.fncsName) != null ? _1802_24_ : this.mthdName)
        ctx = (ctx != null ? ctx : '_k_')
        if (ctx === 'constructor')
        {
            ctx = '@'
        }
        this.varcontext[ctx] = ((_1805_25_=this.varcontext[ctx]) != null ? _1805_25_ : 0)
        this.varcontext[ctx] = this.varcontext[ctx] + 1
        return `_${(this.varcontext[ctx] + 9).toString(16)}_`
    }

    verb ()
    {
        if (this.debug)
        {
            return console.log.apply(console.log,arguments)
        }
    }

    ind ()
    {
        var oi

        oi = this.indent
        this.indent += '    '
        return oi
    }

    ded ()
    {
        return this.indent = this.indent.slice(0, -4)
    }
}

export default Renderer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9yZW5kZXJlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhQSxjQUFjLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJOzs7Ozs7Ozs7OztRQU05QixLQUFDLFNBQVcsS0FBQyxLQUFLLGVBQU4sS0FBQyxLQUFLLEtBQU07UUFDeEIsS0FBQyxXQUFXLEtBQUMsS0FBSyxlQUFOLEtBQUMsS0FBSyxLQUFNO1FBQ3hCLEtBQUMsUUFBVztRQUNaLEtBQUM7UUFJRCxLQUFDLFFBQVcsS0FBQyxZQUFXLEtBQUMsS0FBSyxlQUFOLEtBQUMsS0FBSyxLQUFNLHdCQUFVLEtBQUMsS0FBSyxlQUFOLEtBQUMsS0FBSyxLQUFNLHVCQUFTLEtBQUMsS0FBSyxlQUFOLEtBQUMsS0FBSyxLQUFNOzs7OztlQUU5RCxLQUFDLEtBQUssUUFBUSxJQUFJOzs7Ozs7O1lBVWhDLEtBQUM7O1lBQVUscUJBQVM7O1FBRXZCLEtBQUMsT0FBTztZQUNMLFVBQVcsV0FBVzs7WUFDckIsS0FBQyxTQUFTLE1BQU0sU0FBUyxPQUFRLFdBQVcsUUFBUTs7UUFNeEQsS0FBQyxTQUFTO1lBRVAsS0FBQyxLQUFLLEtBQUssT0FBUSxLQUFDOztZQU1uQixPQUFVLFNBQVksTUFBTSxTQUFTLE9BQVEsTUFBTSxJQUFJO1lBRXZELEtBQUMsYUFBYSxPQUFPLEtBQUMsT0FBUTtZQUM5QixLQUFDLE9BQU8sVUFBVSxLQUFDOztRQUV2QixLQUFDLE1BQU07UUFFUCxLQUFDLFFBQU87UUFDUixLQUFDLFlBQVksSUFBSTtRQUNqQixLQUFDLFNBQVM7UUFDVixLQUFDLFdBQVc7UUFDWixLQUFDO1FBRUQsSUFBSTtZQUVELEtBQUMsS0FBSyxLQUFLOztZQUNWLGdCQUFnQixLQUFDLEtBQUs7O1FBRTFCLEtBQUs7dUJBRUksSUFBSTs7WUFDVCxLQUFLLEtBQUMsU0FBUyxJQUFJO1lBQ25CLFlBQVk7O1FBRWhCLEtB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
//# sourceURL=file://kode/kode/renderer.kode
