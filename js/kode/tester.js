var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isArr: function (o) {return Array.isArray(o)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, noon: function (obj) { 
    var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; 
    var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; 
    var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = '|'+k+'|' } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; 
    var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; 
    return toStr(obj);
}, each_r: function (o) {return Array.isArray(o) ? [] : typeof o == 'string' ? o.split('') : {}}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.R1=_k_.k.B256(_k_.k.R(1));_k_.R2=_k_.k.B256(_k_.k.R(2));_k_.r3=_k_.k.F256(_k_.k.r(3));_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g1=_k_.k.F256(_k_.k.g(1));_k_.G1=_k_.k.B256(_k_.k.G(1));_k_.g3=_k_.k.F256(_k_.k.g(3));_k_.y2=_k_.k.F256(_k_.k.y(2));_k_.y3=_k_.k.F256(_k_.k.y(3));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.y6=_k_.k.F256(_k_.k.y(6));_k_.y8=_k_.k.F256(_k_.k.y(8));_k_.W1=_k_.k.B256(_k_.k.W(1));_k_.w2=_k_.k.F256(_k_.k.w(2))

var allfails, allsuccs, columns, comps, fail, fails, file, files, stack, succs, test, tester

import klor from "../kxk/klor.js"
import kstr from "../kxk/kstr.js"
import slash from "../kxk/slash.js"
import nfs from "../kxk/nfs.js"

import print from "./print.js"

klor.globalize()
comps = 0
succs = 0
fails = []
stack = []
allfails = []
allsuccs = 0
columns = 60
class Tester
{
    constructor ()
    {
        this.test = this.test.bind(this)
        this.compare = this.compare.bind(this)
        this.section = this.section.bind(this)
    }

    async section (t, f)
    {
        var depth

        stack.push(t)
        comps = 0
        depth = stack.length
        if (this.logSections !== false)
        {
            console.log(_k_.W1(_k_.lpad(depth * 3 - 1) + ' ' + global[`g${_k_.max(1,8 - 2 * depth)}`](kstr.crop(t,columns + 1 - depth * 3) + ' ')))
        }
        try
        {
            await f()
        }
        catch (err)
        {
            fails.push({stack:stack.concat([comps]),comps:comps,lhs:`${err}`,rhs:''})
        }
        return stack.pop()
    }

    sameObjects (a, b, keystack)
    {
        var i, sameKeys, sameVals

        if (Object.is(a,b))
        {
            return true
        }
        else if (typeof(a) !== typeof(b))
        {
            return false
        }
        else if (_k_.isArr(a) && _k_.isArr(b))
        {
            if (a.length !== b.length)
            {
                return false
            }
            for (var _a_ = i = 0, _b_ = a.length; (_a_ <= _b_ ? i < a.length : i > a.length); (_a_ <= _b_ ? ++i : --i))
            {
                if (!this.sameObjects(a[i],b[i]))
                {
                    return false
                }
            }
            return true
        }
        else if (_k_.isStr(a) && _k_.isStr(b))
        {
            if (a !== b)
            {
                console.log(_k_.r5(this.showSpace(a)))
                console.log(_k_.g3(this.showSpace(b)))
                return false
            }
            return true
        }
        else if (_k_.isObj(a) && _k_.isObj(b))
        {
            sameKeys = this.sameObjects(Object.keys(a),Object.keys(b))
            sameVals = this.sameObjects(Object.values(a),Object.values(b))
            return sameKeys && sameVals
        }
        return a === b
    }

    compare (a, b)
    {
        var ind

        comps++
        if (typeof(b) === 'function')
        {
            if (b(a))
            {
                succs++
                return
            }
        }
        if (this.sameObjects(a,b))
        {
            succs++
            return
        }
        ind = _k_.lpad((stack.length + 1) * 3)
        console.log(_k_.R1(black(ind + comps + ' ')) + ' ' + _k_.r5(this.short(a)) + ' ' + _k_.R1(_k_.r4(' ▸ ')) + ' ' + _k_.g1(this.short(b)))
        return fails.push({stack:stack.concat([comps]),comps:comps,lhs:a,rhs:b})
    }

    async test (testModule)
    {
        var k, keys, logModules, v

        if ((testModule != null ? testModule._test_ : undefined) !== true)
        {
            return
        }
        comps = 0
        succs = 0
        fails = []
        stack = []
        global.compare = this.compare
        global.section = this.section
        logModules = this.logModules
        keys = Object.keys(testModule)
        var list = _k_.list(keys)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            k = list[_a_]
            v = testModule[k]
            if (v._section_)
            {
                stack.push(k)
                if (logModules !== false)
                {
                    console.log(_k_.G1(_k_.y8(' ' + kstr.crop(k,columns) + ' ')))
                }
                try
                {
                    await v()
                }
                catch (err)
                {
                    fails.push({stack:stack.concat([comps]),comps:comps,lhs:`${err}`,rhs:''})
                }
                stack.pop()
            }
        }
        allsuccs += succs
        allfails = allfails.concat(fails)
        return _k_.empty(fails)
    }

    showSpace (s)
    {
        if (!(_k_.isStr(s)))
        {
            return _k_.noon(s)
        }
        return s.split('\n').map(function (l)
        {
            return l + _k_.w2('◂')
        }).join('\n')
    }

    summarize ()
    {
        var fail, summary

        var list = _k_.list(allfails)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            fail = list[_a_]
            console.log(_k_.R2(_k_.y5(' ' + fail.stack[0] + ' ')) + _k_.R1(_k_.y5(' ')) + fail.stack.slice(1).join(_k_.r3(' ▸ ')) + ' ')
            console.log(_k_.r5(this.showSpace(fail.lhs)))
            console.log(_k_.R1(_k_.r3(' ▸ ')))
            console.log(_k_.g3(this.showSpace(fail.rhs)))
        }
        if (allsuccs || fails.length)
        {
            summary = _k_.w2(kstr.now() + ' ')
            if (!_k_.empty(allfails))
            {
                summary += _k_.R2(_k_.y2(' ✘ ') + _k_.y6(allfails.length) + _k_.y3(' failure' + ((allfails.length > 1 ? 's ' : ' '))))
            }
            else if (allsuccs)
            {
                summary += _k_.g3(" ✔ ") + _k_.g1(allsuccs) + ' '
            }
            console.log(summary)
        }
        allfails = []
        return allsuccs = 0
    }

    short (s)
    {
        var l, split, ss

        if (_k_.empty(s))
        {
            return s
        }
        split = ('' + s).split('\n')
        l = 0
        split = (function (o) {
            var r_a_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                if (!_k_.empty(v))
                {
                    return v = '' + v
                }
            })(o[k])
                if (m != null)
                {
                    r_a_[k] = m
                }
            }
            return typeof o == 'string' ? r_a_.join('') : r_a_
        })(split)
        split = split.filter(function (s)
        {
            return s.length
        })
        ss = split.join(_k_.w2('➜ '))
        return ss
    }
}

export default new Tester;
if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    files = await nfs.list(slash.path(_k_.dir(),'test'))
    fail = false
    var list = _k_.list(files)
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    file = list[_a_]
    if (slash.name(file.path) === 'utils')
    {
        continue
    }
    test = await import(file.path)
    tester = new Tester
    tester.logSections = false
    tester.logModules = false
    fail = fail || !(await tester.test(test.default))
}
    tester.summarize()
    if (fail)
{
    process.exit(1)
}
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tvZGUvdGVzdGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7T0FRYSxXQUFOO09BQVcsV0FBWDtPQUFnQixZQUFoQjtPQUFzQixVQUF0Qjs7T0FDRCxZQUFBOztBQUVOLEtBQUs7QUFFTCxRQUFRO0FBQ1IsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxVQUFXO0FBRVgsTUFBTTs7SUFFRjs7Ozs7OztVQVFBLFNBQVMsR0FBRTs7OztRQUVQLE1BQU0sS0FBSztRQUNYLFFBQVE7UUFDUixRQUFRLE1BQU07WUFDWCxLQUFDLGdCQUFlOztZQUNmLFlBQUksZ0JBQVEsUUFBTSxJQUFFLEtBQUssTUFBTSxtQkFBZSxFQUFHLElBQUUsSUFBRSxVQUFVLEtBQUssS0FBSyxFQUFHLFVBQVEsSUFBRSxRQUFNLEtBQUs7Ozs7a0JBRS9GOztlQUNBOztZQUVGLE1BQU0sTUFDRixNQUFPLE1BQU0sUUFBUSxRQUNyQixNQUFPLE1BQ1AsT0FBVSxNQUNWLElBQU87O2VBRWYsTUFBTTs7O0lBUVYsYUFBYSxHQUFFLEdBQUU7Ozs7WUFHVCxPQUFPLEdBQUcsRUFBRzs7bUJBRVA7O2lCQUVOLE9BQU8sT0FBSyxPQUFPOzttQkFFYjs7aUJBRUQsVUFBTCxNQUFrQixVQUFMOztnQkFFTixFQUFFLFdBQVUsRUFBRTs7dUJBQ1g7OzJCQUNGLElBQUssU0FBSSxFQUFFLDBCQUFGLEVBQUUsYUFBRixFQUFFOztxQkFDSixLQUFDLFlBQVksRUFBRSxHQUFJLEVBQUU7OzJCQUN0Qjs7O21CQUNSOztpQkFFRCxVQUFMLE1BQWtCLFVBQUw7O2dCQUVOLE1BQUs7O2dCQUNKLFlBQUksT0FBRyxLQUFDLFVBQVU7Z0JBQ2xCLFlBQUksT0FBRyxLQUFDLFVBQVU7dUJBQ2hCOzttQkFDSjs7aUJBRUQsVUFBTCxNQUFrQixVQUFMOztZQUVULFdBQVcsS0FBQyxZQUFZLE9BQU8sS0FBSyxHQUFJLE9BQU8sS0FBSztZQUNw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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/tester.kode
