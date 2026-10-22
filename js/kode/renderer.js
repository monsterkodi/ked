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

    mark (s, tok)
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

    node (exp)
    {
        var a, k, s, v, _271_19_, _271_33_

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

    dirFile (n)
    {
        var name, s, _506_22_

        name = ((_506_22_=n.text) != null ? _506_22_ : n)
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

    main (n)
    {
        var idt, s

        idt = _k_.rpad(4)
        s = this.mark('if',n.token) + ' (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])'
        s += '\n{\n'
        s += idt + this.nodes(n.exps,'\n' + idt)
        s += '\n}'
        return s
    }

    class (n)
    {
        var b, bind, bn, con, e, mi, mthds, s, superCall, _549_29_, _555_50_

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
                    con.keyval.val.func.body.exps = ((_555_50_=con.keyval.val.func.body.exps) != null ? _555_50_ : [])
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
        var key, member, memberTok, s, _600_32_

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

    function (n)
    {
        var b, bind, bn, callsSuper, con, e, mi, mthds, s, _649_54_, _655_50_

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
                        con.keyval.val.func.body.exps = ((_649_54_=con.keyval.val.func.body.exps) != null ? _649_54_ : [])
                        con.keyval.val.func.body.exps.unshift({type:'code',text:`this[\"${bn}\"] = this[\"${bn}\"].bind(this)`})
                    }
                }
                if (n.extends)
                {
                    con.keyval.val.func.body.exps = ((_655_50_=con.keyval.val.func.body.exps) != null ? _655_50_ : [])
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

    funcs (n, className)
    {
        var at, f, key, member, memberTok, name, s, _686_23_, _686_28_, _706_23_, _706_28_, _706_34_

        s = ''
        if (f = ((_686_23_=n.keyval) != null ? (_686_28_=_686_23_.val) != null ? _686_28_.func : undefined : undefined))
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
            if (((_706_23_=n.keyval) != null ? (_706_28_=_706_23_.key) != null ? (_706_34_=_706_28_.text) != null ? _706_34_[0] : undefined : undefined : undefined) === '@')
            {
                key = n.keyval.key
                member = key.text.slice(1)
                memberTok = {type:'var',text:member,line:key.line,col:key.col + 1}
                s = this.indent + this.mark(className,key) + "[\"" + this.mark(member,memberTok) + "\"] = " + this.node(n.keyval.val)
            }
        }
        return s
    }

    prepareMethods (mthds)
    {
        var ast, bind, con, m, name, _737_37_

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

    func (n, name)
    {
        var args, at, gi, mark, member, memberTok, s, str, t, ths, vs, _760_22_, _760_29_, _774_17_, _795_21_, _795_29_, _811_22_, _811_32_

        if (!n)
        {
            return ''
        }
        gi = this.ind()
        name = (name != null ? name : ((_760_29_=(n.name != null ? n.name.text : undefined)) != null ? _760_29_ : 'function'))
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
        args = ((_795_21_=n.args) != null ? (_795_29_=_795_21_.parens) != null ? _795_29_.exps : undefined : undefined)
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
        if (((_811_22_=n.body.exps) != null ? _811_22_[0] != null ? (_811_32_=_811_22_[0].call) != null ? _811_32_.callee.text : undefined : undefined : undefined) === 'super')
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
            var i, l, lThis, prop, t, thisThis, thisTok, tok, txt, _865_26_, _865_39_, _865_44_, _871_43_, _873_34_, _888_64_

            prop = ((_865_26_=a.prop) != null ? _865_26_ : ((_865_39_=a.operation) != null ? (_865_44_=_865_39_.lhs) != null ? _865_44_.prop : undefined : undefined))
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
            thisTok = (prop != null ? (_873_34_=prop.obj) != null ? _873_34_.type : undefined : undefined) === 'this' ? prop.obj : null
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
                            return this.mark(`${txt}` + (((_888_64_=t.split('=')[1]) != null ? _888_64_ : '')),tok)
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
        var e, s, _1054_17_

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
        var fnc, i, numArgs, rv, _1080_23_, _1080_29_, _1080_35_, _1080_43_, _1080_49_, _1125_20_, _1125_26_, _1125_32_, _1125_38_

        numArgs = ((_1080_23_=n.fnc) != null ? (_1080_29_=_1080_23_.func) != null ? (_1080_35_=_1080_29_.args) != null ? (_1080_43_=_1080_35_.parens) != null ? (_1080_49_=_1080_43_.exps) != null ? _1080_49_.length : undefined : undefined : undefined : undefined : undefined)
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
            if (((_1125_20_=n.fnc) != null ? (_1125_26_=_1125_20_.func) != null ? (_1125_32_=_1125_26_.body) != null ? (_1125_38_=_1125_32_.exps) != null ? _1125_38_.length : undefined : undefined : undefined : undefined) > 0)
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
        var e, eb, g2, gi, iterVar, j, list, listVar, nl, postfix, prefix, s, v, _1177_27_, _1199_28_

        if (!n.list.qmrkop && !n.list.array && !n.list.slice)
        {
            this.hint._k_.list = true
            list = `_k_.list(${this.atom(n.list)})`
        }
        else
        {
            if (((_1177_27_=n.list.array) != null ? _1177_27_.items[0] != null ? _1177_27_.items[0].slice : undefined : undefined) || n.list.slice)
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

    for_in_range (n, varPrefix, lastPrefix, lastPostfix, lineBreak)
    {
        var e, eb, end, g2, gi, invCmp, iterCmp, iterDir, iterEnd, iterStart, iterTok, iterVar, llc, loopCheck, loopStart, loopUpdate, lv, nl, postfix, prefix, rlc, rv, s, slice, start, _1228_28_, _1228_46_, _1238_32_

        slice = ((_1228_46_=((_1228_28_=n.list.array) != null ? _1228_28_.items[0] != null ? _1228_28_.items[0].slice : undefined : undefined)) != null ? _1228_46_ : n.list.slice)
        gi = lineBreak || this.ind()
        nl = lineBreak || '\n'
        eb = lineBreak && ';' || '\n'
        g2 = lineBreak ? '' : this.indent
        iterVar = ((_1238_32_=n.vals.text) != null ? _1238_32_ : n.vals[0].text)
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

    for_of (n, varPrefix = '', lastPrefix = '', lastPostfix = '', lineBreak)
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
        var s, _1460_28_

        return s = tok.type === 'comment' ? this.comment(tok) : tok.type === 'this' ? 'this' : tok.type === 'triple' ? '`' + tok.text.slice(3, -3) + '`' : tok.type === 'bool' && tok.text === 'yes' ? 'true' : tok.type === 'bool' && tok.text === 'no' ? 'false' : (tok.type != null ? tok.type.startsWith('prof') : undefined) ? this.prof(tok) : tok.text
    }

    comment (tok)
    {
        var _1473_19_

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
        var close, first, i, ind, keyval, lhs, o, open, opmap, prfx, rhs, ro, s, sep, v, val, _1506_29_, _1506_40_, _1538_25_, _1538_43_, _1538_54_, _1538_64_, _1571_18_, _1571_29_, _1578_25_, _1582_30_, _1587_30_, _1595_30_, _1603_30_, _1608_30_, _1613_30_, _1622_43_

        opmap = function (o)
        {
            var omp, _1499_19_

            omp = {and:'&&',or:'||',not:'!',empty:'_k_.empty',valid:'!_k_.empty',eql:'_k_.eql','==':'===','!=':'!=='}
            return ((_1499_19_=omp[o]) != null ? _1499_19_ : o)
        }
        o = opmap(op.operator.text)
        sep = ' '
        if ((!op.lhs && !(_k_.in(op.operator.text,['delete','new']))) || !op.rhs)
        {
            sep = ''
        }
        if (_k_.in(o,['<','<=','===','!==','>=','>','_k_.eql']))
        {
            ro = opmap(((_1506_29_=op.rhs) != null ? (_1506_40_=_1506_29_.operation) != null ? _1506_40_.operator.text : undefined : undefined))
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
            if ((op.rhs != null ? op.rhs.incond : undefined) || _k_.in(((_1538_43_=op.rhs) != null ? (_1538_54_=_1538_43_.operation) != null ? (_1538_64_=_1538_54_.operator) != null ? _1538_64_.text : undefined : undefined : undefined),['=','is']))
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
        else if (((_1571_18_=op.rhs) != null ? (_1571_29_=_1571_18_.operation) != null ? _1571_29_.operator.text : undefined : undefined) === '=')
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
        var addOne, from, ni, slice, u, upper, upto, _1695_32_, _1699_32_, _1701_25_, _1701_54_, _1717_27_

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
        var from, o, upto, x, _1747_41_

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

    subsect (p)
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

    compare (p)
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
        var ctx, _1907_24_, _1910_25_

        ctx = ((_1907_24_=this.fncsName) != null ? _1907_24_ : this.mthdName)
        ctx = (ctx != null ? ctx : '_k_')
        if (ctx === 'constructor')
        {
            ctx = '@'
        }
        this.varcontext[ctx] = ((_1910_25_=this.varcontext[ctx]) != null ? _1910_25_ : 0)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9yZW5kZXJlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O09BUWMsV0FBUDtPQUFZLFlBQVo7O09BQ0QsWUFBQTtJQUFRO0lBQWE7O09BQ3JCLFlBQUE7O09BQ0EsYUFBQTs7QUFFTixjQUFjLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJO0FBRXRDLE1BQU07O0lBRUYsYUFBSTs7UUFBRDs7Ozs7O1FBRUMsS0FBQyxTQUFXLEtBQUMsS0FBSyxlQUFOLEtBQUMsS0FBSyxLQUFNO1FBQ3hCLEtBQUMsV0FBVyxLQUFDLEtBQUssZUFBTixLQUFDLEtBQUssS0FBTTtRQUN4QixLQUFDLFFBQVc7UUFDWixLQUFDO1FBSUQsS0FBQyxRQUFXLEtBQUMsWUFBVyxLQUFDLEtBQUssZUFBTixLQUFDLEtBQUssS0FBTSx3QkFBVSxLQUFDLEtBQUssZUFBTixLQUFDLEtBQUssS0FBTSx1QkFBUyxLQUFDLEtBQUssZUFBTixLQUFDLEtBQUssS0FBTTs7O0lBRW5GLFNBQVMsS0FBSTs7ZUFBUSxLQUFDLEtBQUssUUFBUSxJQUFJOzs7SUFRdkMsUUFBUSxLQUFJLFFBQU87Ozs7WUFFWixLQUFDOztZQUFVLHFCQUFTOztRQUV2QixLQUFDLE9BQU87WUFDTCxVQUFXLFdBQVc7O1lBTXJCLEtBQUMsU0FBUyxNQUFNLFNBQVMsT0FBUSxXQUFXLFFBQVE7O1FBTXhELEtBQUMsU0FBUztZQUVQLEtBQUMsS0FBSyxLQUFLLE9BQVEsS0FBQzs7WUFNbkIsT0FBVSxTQUFZLE1BQU0sU0FBUyxPQUFRLE1BQU0sSUFBSTtZQUV2RCxLQUFDLGFBQWEsT0FBTyxLQUFDLE9BQVE7WUFDOUIsS0FBQyxPQUFPLFVBQVUsS0FBQzs7UUFFdkIsS0FBQyxNQUFNO1FBRVAsS0FBQyxRQUFPO1FBQ1IsS0FBQyxZQUFZLElBQUk7UUFDakIsS0FBQyxTQUFTO1FBQ1YsS0FBQyxXQUFXO1FBQ1osS0FBQztRQUVELElBQUk7WUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/renderer.kode
