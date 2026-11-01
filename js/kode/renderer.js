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
    
        var _20_30_, _21_30_, _24_42_, _24_64_, _24_85_

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
        var a, k, s, v, _222_19_, _222_33_

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
        var name, s, _446_22_

        name = ((_446_22_=n.text) != null ? _446_22_ : n)
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
        var b, bind, bn, con, e, mi, mthds, s, superCall, _489_29_, _495_50_

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
                    con.keyval.val.func.body.exps = ((_495_50_=con.keyval.val.func.body.exps) != null ? _495_50_ : [])
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
        var key, member, memberTok, s, _540_32_

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
        var b, bind, bn, callsSuper, con, e, mi, mthds, s, _586_54_, _592_50_

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
                        con.keyval.val.func.body.exps = ((_586_54_=con.keyval.val.func.body.exps) != null ? _586_54_ : [])
                        con.keyval.val.func.body.exps.unshift({type:'code',text:`this[\"${bn}\"] = this[\"${bn}\"].bind(this)`})
                    }
                }
                if (n.extends)
                {
                    con.keyval.val.func.body.exps = ((_592_50_=con.keyval.val.func.body.exps) != null ? _592_50_ : [])
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
        var at, f, key, member, memberTok, name, s, _623_23_, _623_28_, _643_23_, _643_28_, _643_34_

        s = ''
        if (f = ((_623_23_=n.keyval) != null ? (_623_28_=_623_23_.val) != null ? _623_28_.func : undefined : undefined))
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
            if (((_643_23_=n.keyval) != null ? (_643_28_=_643_23_.key) != null ? (_643_34_=_643_28_.text) != null ? _643_34_[0] : undefined : undefined : undefined) === '@')
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
        var ast, bind, con, m, name, _674_37_

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
        var args, at, gi, mark, member, memberTok, s, str, t, ths, vs, _697_22_, _697_29_, _707_17_, _728_21_, _728_29_, _744_22_, _744_32_

        if (!n)
        {
            return ''
        }
        gi = this.ind()
        name = (name != null ? name : ((_697_29_=(n.name != null ? n.name.text : undefined)) != null ? _697_29_ : 'function'))
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
        args = ((_728_21_=n.args) != null ? (_728_29_=_728_21_.parens) != null ? _728_29_.exps : undefined : undefined)
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
        if (((_744_22_=n.body.exps) != null ? _744_22_[0] != null ? (_744_32_=_744_22_[0].call) != null ? _744_32_.callee.text : undefined : undefined : undefined) === 'super')
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
            var i, l, lThis, prop, t, thisThis, thisTok, tok, txt, _792_26_, _792_39_, _792_44_, _798_43_, _800_34_, _815_64_

            prop = ((_792_26_=a.prop) != null ? _792_26_ : ((_792_39_=a.operation) != null ? (_792_44_=_792_39_.lhs) != null ? _792_44_.prop : undefined : undefined))
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
            thisTok = (prop != null ? (_800_34_=prop.obj) != null ? _800_34_.type : undefined : undefined) === 'this' ? prop.obj : null
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
                            return this.mark(`${txt}` + (((_815_64_=t.split('=')[1]) != null ? _815_64_ : '')),tok)
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
        var e, s, _977_17_

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
        var fnc, i, numArgs, rv, _1003_23_, _1003_29_, _1003_35_, _1003_43_, _1003_49_, _1048_20_, _1048_26_, _1048_32_, _1048_38_

        numArgs = ((_1003_23_=n.fnc) != null ? (_1003_29_=_1003_23_.func) != null ? (_1003_35_=_1003_29_.args) != null ? (_1003_43_=_1003_35_.parens) != null ? (_1003_49_=_1003_43_.exps) != null ? _1003_49_.length : undefined : undefined : undefined : undefined : undefined)
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
            if (((_1048_20_=n.fnc) != null ? (_1048_26_=_1048_20_.func) != null ? (_1048_32_=_1048_26_.body) != null ? (_1048_38_=_1048_32_.exps) != null ? _1048_38_.length : undefined : undefined : undefined : undefined) > 0)
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
        var e, eb, g2, gi, iterVar, j, list, listVar, nl, postfix, prefix, s, v, _1100_27_, _1122_28_

        if (!n.list.qmrkop && !n.list.array && !n.list.slice)
        {
            this.hint._k_.list = true
            list = `_k_.list(${this.atom(n.list)})`
        }
        else
        {
            if (((_1100_27_=n.list.array) != null ? _1100_27_.items[0] != null ? _1100_27_.items[0].slice : undefined : undefined) || n.list.slice)
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
        var e, eb, end, g2, gi, invCmp, iterCmp, iterDir, iterEnd, iterStart, iterTok, iterVar, llc, loopCheck, loopStart, loopUpdate, lv, nl, postfix, prefix, rlc, rv, s, slice, start, _1151_28_, _1151_46_, _1161_32_

        slice = ((_1151_46_=((_1151_28_=n.list.array) != null ? _1151_28_.items[0] != null ? _1151_28_.items[0].slice : undefined : undefined)) != null ? _1151_46_ : n.list.slice)
        gi = lineBreak || this.ind()
        nl = lineBreak || '\n'
        eb = lineBreak && ';' || '\n'
        g2 = lineBreak ? '' : this.indent
        iterVar = ((_1161_32_=n.vals.text) != null ? _1161_32_ : n.vals[0].text)
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
        var s, _1383_28_

        return s = tok.type === 'comment' ? this.comment(tok) : tok.type === 'this' ? 'this' : tok.type === 'triple' ? '`' + tok.text.slice(3, -3) + '`' : tok.type === 'bool' && tok.text === 'yes' ? 'true' : tok.type === 'bool' && tok.text === 'no' ? 'false' : (tok.type != null ? tok.type.startsWith('prof') : undefined) ? this.prof(tok) : tok.text
    }

    comment (tok)
    {
        var _1396_19_

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
        var close, first, i, ind, keyval, lhs, o, open, opmap, prfx, rhs, ro, s, sep, v, val, _1429_29_, _1429_40_, _1461_25_, _1461_43_, _1461_54_, _1461_64_, _1494_18_, _1494_29_, _1500_25_, _1504_30_, _1509_30_, _1517_30_, _1525_30_, _1530_30_, _1535_30_, _1544_43_

        opmap = function (o)
        {
            var omp, _1422_19_

            omp = {and:'&&',or:'||',not:'!',empty:'_k_.empty',valid:'!_k_.empty',eql:'_k_.eql','==':'===','!=':'!=='}
            return ((_1422_19_=omp[o]) != null ? _1422_19_ : o)
        }
        o = opmap(op.operator.text)
        sep = ' '
        if ((!op.lhs && !(_k_.in(op.operator.text,['delete','new']))) || !op.rhs)
        {
            sep = ''
        }
        if (_k_.in(o,['<','<=','===','!==','>=','>','_k_.eql']))
        {
            ro = opmap(((_1429_29_=op.rhs) != null ? (_1429_40_=_1429_29_.operation) != null ? _1429_40_.operator.text : undefined : undefined))
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
            if ((op.rhs != null ? op.rhs.incond : undefined) || _k_.in(((_1461_43_=op.rhs) != null ? (_1461_54_=_1461_43_.operation) != null ? (_1461_64_=_1461_54_.operator) != null ? _1461_64_.text : undefined : undefined : undefined),['=','is']))
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
        else if (((_1494_18_=op.rhs) != null ? (_1494_29_=_1494_18_.operation) != null ? _1494_29_.operator.text : undefined : undefined) === '=')
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
        var addOne, from, ni, slice, u, upper, upto, _1617_32_, _1621_32_, _1623_25_, _1623_54_, _1639_27_

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
        var from, o, upto, x, _1669_41_

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
        var ctx, _1821_24_, _1824_25_

        ctx = ((_1821_24_=this.fncsName) != null ? _1821_24_ : this.mthdName)
        ctx = (ctx != null ? ctx : '_k_')
        if (ctx === 'constructor')
        {
            ctx = '@'
        }
        this.varcontext[ctx] = ((_1824_25_=this.varcontext[ctx]) != null ? _1824_25_ : 0)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9yZW5kZXJlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O09BUWMsV0FBUDtPQUFZLFlBQVo7O09BQ0QsWUFBQTtJQUFRO0lBQWE7O09BQ3JCLFlBQUE7O09BQ0EsYUFBQTs7QUFFTixjQUFjLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJO0FBRXRDLE1BQU07O0lBRUYsYUFBSTs7UUFBRDs7Ozs7O1FBRUMsS0FBQyxTQUFXLEtBQUMsS0FBSyxlQUFOLEtBQUMsS0FBSyxLQUFNO1FBQ3hCLEtBQUMsV0FBVyxLQUFDLEtBQUssZUFBTixLQUFDLEtBQUssS0FBTTtRQUN4QixLQUFDLFFBQVc7UUFDWixLQUFDO1FBQ0QsS0FBQyxRQUFXLEtBQUMsWUFBVyxLQUFDLEtBQUssZUFBTixLQUFDLEtBQUssS0FBTSx3QkFBVSxLQUFDLEtBQUssZUFBTixLQUFDLEtBQUssS0FBTSx1QkFBUyxLQUFDLEtBQUssZUFBTixLQUFDLEtBQUssS0FBTTs7O0lBRW5GLFNBQVMsS0FBSTs7ZUFBUSxLQUFDLEtBQUssUUFBUSxJQUFJOzs7SUFRdkMsUUFBUSxLQUFJLFFBQU87Ozs7WUFFWixLQUFDOztZQUFVLHFCQUFTOztRQUV2QixLQUFDLE9BQU87WUFDTCxVQUFXLFdBQVc7O1lBQ3JCLEtBQUMsU0FBUyxNQUFNLFNBQVMsT0FBUSxXQUFXLFFBQVE7O1FBRXhELEtBQUMsU0FBUztZQUVQLEtBQUMsS0FBSyxLQUFLLE9BQVEsS0FBQzs7WUFFbkIsT0FBVSxTQUFZLE1BQU0sU0FBUyxPQUFRLE1BQU0sSUFBSTtZQUV2RCxLQUFDLGFBQWEsT0FBTyxLQUFDLE9BQVE7WUFDOUIsS0FBQyxPQUFPLFVBQVUsS0FBQzs7UUFFdkIsS0FBQyxNQUFNO1FBRVAsS0FBQyxRQUFPO1FBQ1IsS0FBQyxZQUFZLElBQUk7UUFDakIsS0FBQyxTQUFTO1FBQ1YsS0FBQyxXQUFXO1FBQ1osS0FBQztRQUVELElBQUk7WUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/renderer.kode
