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
        var item, m, mod, name, s, _402_25_, _421_25_, _438_29_

        s = ''
        if (!_k_.empty(n.items))
        {
            if (n.toUse.length > 1)
            {
                console.error('items for multiple modules?!')
            }
            m = n.toUse[0]
            mod = ((_402_25_=m.text) != null ? _402_25_ : m)
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
            mod = ((_421_25_=m.text) != null ? _421_25_ : m)
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
                mod = ((_438_29_=m.text) != null ? _438_29_ : m)
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
        var b, bind, bn, con, e, mi, mthds, s, superCall, _539_29_, _545_50_

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
                    con.keyval.val.func.body.exps = ((_545_50_=con.keyval.val.func.body.exps) != null ? _545_50_ : [])
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
        var s, _590_32_

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
        var b, bind, bn, callsSuper, con, e, mi, mthds, s, _636_54_, _642_50_

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
                        con.keyval.val.func.body.exps = ((_636_54_=con.keyval.val.func.body.exps) != null ? _636_54_ : [])
                        con.keyval.val.func.body.exps.unshift({type:'code',text:`this[\"${bn}\"] = this[\"${bn}\"].bind(this)`})
                    }
                }
                if (n.extends)
                {
                    con.keyval.val.func.body.exps = ((_642_50_=con.keyval.val.func.body.exps) != null ? _642_50_ : [])
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
        var at, f, member, name, s, _673_23_, _673_28_, _693_23_, _693_28_, _693_34_

        s = ''
        if (f = ((_673_23_=n.keyval) != null ? (_673_28_=_673_23_.val) != null ? _673_28_.func : undefined : undefined))
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
            if (((_693_23_=n.keyval) != null ? (_693_28_=_693_23_.key) != null ? (_693_34_=_693_28_.text) != null ? _693_34_[0] : undefined : undefined : undefined) === '@')
            {
                member = n.keyval.key.text.slice(1)
                s = this.indent + `${className}[\"${member}\"] = ` + this.node(n.keyval.val)
            }
        }
        return s
    }

    prepareMethods (mthds)
    {
        var ast, bind, con, m, name, _722_37_

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
        var args, at, gi, mark, s, str, t, ths, vs, _745_22_, _745_29_, _759_17_, _774_21_, _774_29_, _790_22_, _790_32_

        if (!n)
        {
            return ''
        }
        gi = this.ind()
        name = (name != null ? name : ((_745_29_=(n.name != null ? n.name.text : undefined)) != null ? _745_29_ : 'function'))
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
            at = name.lastIndexOf(mark)
            if (at < 0 && mark.startsWith('static '))
            {
                mark = mark.slice(7)
                at = name.lastIndexOf(mark)
            }
            if (at >= 0)
            {
                name = name.slice(0, typeof at === 'number' ? at : -1) + this.mark(mark,n.name) + name.slice((at + mark.length))
            }
        }
        s = name
        s += ' ('
        args = ((_774_21_=n.args) != null ? (_774_29_=_774_21_.parens) != null ? _774_29_.exps : undefined : undefined)
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
        if (((_790_22_=n.body.exps) != null ? _790_22_[0] != null ? (_790_32_=_790_22_[0].call) != null ? _790_32_.callee.text : undefined : undefined : undefined) === 'super')
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
            var i, l, t, tok, txt, _846_38_, _847_43_, _860_64_

            tok = a
            if (!tok.type && a.obj)
            {
                tok = a.obj
            }
            if (!tok.type && (a.prop != null ? a.prop.obj : undefined))
            {
                tok = a.prop.obj
            }
            if (!tok.type && (a.operation != null ? a.operation.lhs : undefined))
            {
                tok = a.operation.lhs
            }
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
                            return this.mark(`${txt}` + (((_860_64_=t.split('=')[1]) != null ? _860_64_ : '')),tok)
                        }
                    }
                }
                else
                {
                    ths.push(`${l} = ${txt}`)
                }
                return this.mark(t.slice(5),tok)
            }
            return this.mark(t,tok)
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
        var e, s, _1026_17_

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
        var fnc, i, numArgs, rv, _1052_23_, _1052_29_, _1052_35_, _1052_43_, _1052_49_, _1097_20_, _1097_26_, _1097_32_, _1097_38_

        numArgs = ((_1052_23_=n.fnc) != null ? (_1052_29_=_1052_23_.func) != null ? (_1052_35_=_1052_29_.args) != null ? (_1052_43_=_1052_35_.parens) != null ? (_1052_49_=_1052_43_.exps) != null ? _1052_49_.length : undefined : undefined : undefined : undefined : undefined)
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
            if (((_1097_20_=n.fnc) != null ? (_1097_26_=_1097_20_.func) != null ? (_1097_32_=_1097_26_.body) != null ? (_1097_38_=_1097_32_.exps) != null ? _1097_38_.length : undefined : undefined : undefined : undefined) > 0)
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
        var e, eb, g2, gi, iterVar, j, list, listVar, nl, postfix, prefix, s, v, _1149_27_, _1171_28_

        if (!n.list.qmrkop && !n.list.array && !n.list.slice)
        {
            this.hint._k_.list = true
            list = `_k_.list(${this.atom(n.list)})`
        }
        else
        {
            if (((_1149_27_=n.list.array) != null ? _1149_27_.items[0] != null ? _1149_27_.items[0].slice : undefined : undefined) || n.list.slice)
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
            s += gi + `for (${iterVar} = 0; ${iterVar} < ${listVar}.length; ${iterVar}++)` + nl
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
        var e, eb, end, g2, gi, invCmp, iterCmp, iterDir, iterEnd, iterStart, iterTok, iterVar, llc, loopCheck, loopStart, loopUpdate, lv, nl, postfix, prefix, rlc, rv, s, slice, start, _1200_28_, _1200_46_, _1210_32_

        slice = ((_1200_46_=((_1200_28_=n.list.array) != null ? _1200_28_.items[0] != null ? _1200_28_.items[0].slice : undefined : undefined)) != null ? _1200_46_ : n.list.slice)
        gi = lineBreak || this.ind()
        nl = lineBreak || '\n'
        eb = lineBreak && ';' || '\n'
        g2 = lineBreak ? '' : this.indent
        iterVar = ((_1210_32_=n.vals.text) != null ? _1210_32_ : n.vals[0].text)
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
        var e, eb, g2, gi, key, nl, obj, postfix, prefix, s, val, _1271_26_

        gi = lineBreak || this.ind()
        nl = lineBreak || '\n'
        eb = lineBreak && ';' || '\n'
        g2 = lineBreak ? '' : this.indent
        key = ((_1271_26_=n.vals.text) != null ? _1271_26_ : (n.vals[0] != null ? n.vals[0].text : undefined))
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
        var s, _1430_28_

        return s = tok.type === 'comment' ? this.comment(tok) : tok.type === 'this' ? 'this' : tok.type === 'triple' ? '`' + tok.text.slice(3, -3) + '`' : tok.type === 'bool' && tok.text === 'yes' ? 'true' : tok.type === 'bool' && tok.text === 'no' ? 'false' : (tok.type != null ? tok.type.startsWith('prof') : undefined) ? this.prof(tok) : tok.text
    }

    comment (tok)
    {
        var _1443_19_

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
        var close, first, i, ind, keyval, lhs, o, open, opmap, prfx, rhs, ro, s, sep, v, val, _1476_29_, _1476_40_, _1508_25_, _1508_43_, _1508_54_, _1508_64_, _1541_18_, _1541_29_, _1548_25_, _1552_30_, _1557_30_, _1565_30_, _1573_30_, _1578_30_, _1583_30_, _1592_43_

        opmap = function (o)
        {
            var omp, _1469_19_

            omp = {and:'&&',or:'||',not:'!',empty:'_k_.empty',valid:'!_k_.empty',eql:'_k_.eql','==':'===','!=':'!=='}
            return ((_1469_19_=omp[o]) != null ? _1469_19_ : o)
        }
        o = opmap(op.operator.text)
        sep = ' '
        if ((!op.lhs && !(_k_.in(op.operator.text,['delete','new']))) || !op.rhs)
        {
            sep = ''
        }
        if (_k_.in(o,['<','<=','===','!==','>=','>','_k_.eql']))
        {
            ro = opmap(((_1476_29_=op.rhs) != null ? (_1476_40_=_1476_29_.operation) != null ? _1476_40_.operator.text : undefined : undefined))
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
            if ((op.rhs != null ? op.rhs.incond : undefined) || _k_.in(((_1508_43_=op.rhs) != null ? (_1508_54_=_1508_43_.operation) != null ? (_1508_64_=_1508_54_.operator) != null ? _1508_64_.text : undefined : undefined : undefined),['=','is']))
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
        else if (((_1541_18_=op.rhs) != null ? (_1541_29_=_1541_18_.operation) != null ? _1541_29_.operator.text : undefined : undefined) === '=')
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
        var addOne, from, ni, slice, u, upper, upto, _1665_32_, _1669_32_, _1671_25_, _1671_54_, _1687_27_

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
        var from, o, upto, x, _1717_41_

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
        var ctx, _1877_24_, _1880_25_

        ctx = ((_1877_24_=this.fncsName) != null ? _1877_24_ : this.mthdName)
        ctx = (ctx != null ? ctx : '_k_')
        if (ctx === 'constructor')
        {
            ctx = '@'
        }
        this.varcontext[ctx] = ((_1880_25_=this.varcontext[ctx]) != null ? _1880_25_ : 0)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9yZW5kZXJlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhQSxjQUFjLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJO0FBRXRDLE1BQU07O0lBRUYsYUFBRzs7Ozs7Ozs7UUFFQyxLQUFDLFNBQVcsS0FBQyxLQUFLLGVBQU4sS0FBQyxLQUFLLEtBQU07UUFDeEIsS0FBQyxXQUFXLEtBQUMsS0FBSyxlQUFOLEtBQUMsS0FBSyxLQUFNO1FBQ3hCLEtBQUMsUUFBVztRQUNaLEtBQUM7UUFJRCxLQUFDLFFBQVcsS0FBQyxZQUFXLEtBQUMsS0FBSyxlQUFOLEtBQUMsS0FBSyxLQUFNLHdCQUFVLEtBQUMsS0FBSyxlQUFOLEtBQUMsS0FBSyxLQUFNLHVCQUFTLEtBQUMsS0FBSyxlQUFOLEtBQUMsS0FBSyxLQUFNOzs7SUFFbkYsU0FBUyxLQUFJOztlQUFRLEtBQUMsS0FBSyxRQUFRLElBQUk7OztJQVF2QyxRQUFRLEtBQUksUUFBTzs7OztZQUVaLEtBQUM7O1lBQVUscUJBQVM7O1FBRXZCLEtBQUMsT0FBTztZQUNMLFVBQVcsV0FBVzs7WUFNckIsS0FBQyxTQUFTLE1BQU0sU0FBUyxPQUFRLFdBQVcsUUFBUTs7UUFNeEQsS0FBQyxTQUFTO1lBRVAsS0FBQyxLQUFLLEtBQUssT0FBUSxLQUFDOztZQU1uQixPQUFVLFNBQVksTUFBTSxTQUFTLE9BQVEsTUFBTSxJQUFJO1lBRXZELEtBQUMsYUFBYSxPQUFPLEtBQUMsT0FBUTtZQUM5QixLQUFDLE9BQU8sVUFBVSxLQUFDOztRQUV2QixLQUFDLE1BQU07UUFFUCxLQUFDLFFBQU87UUFDUixLQUFDLFlBQVksSUFBSTtRQUNqQixLQUFDLFNBQVM7UUFDVixLQUFDLFdBQVc7UUFDWixLQUFDO1FBRUQsSUFBSTtZQUVELEtBQUMsS0FBSyxLQUFLOztZQUNWLGdCQUFnQixLQUFDLEtBQUs7O1FBRTFCLEtBQUs7dUJBRUks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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/renderer.kode
