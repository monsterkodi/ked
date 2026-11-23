var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isArr: function (o) {return Array.isArray(o)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, noon: function (obj) { 
    var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; 
    var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; 
    var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = '|'+k+'|' } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; 
    var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; 
    return toStr(obj);
}, each_r: function (o) {return Array.isArray(o) ? [] : typeof o == 'string' ? o.split('') : {}}, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.R1=_k_.k.B256(_k_.k.R(1));_k_.R2=_k_.k.B256(_k_.k.R(2));_k_.r3=_k_.k.F256(_k_.k.r(3));_k_.r4=_k_.k.F256(_k_.k.r(4));_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g1=_k_.k.F256(_k_.k.g(1));_k_.G1=_k_.k.B256(_k_.k.G(1));_k_.g3=_k_.k.F256(_k_.k.g(3));_k_.b2=_k_.k.F256(_k_.k.b(2));_k_.b5=_k_.k.F256(_k_.k.b(5));_k_.y2=_k_.k.F256(_k_.k.y(2));_k_.y3=_k_.k.F256(_k_.k.y(3));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.y6=_k_.k.F256(_k_.k.y(6));_k_.y8=_k_.k.F256(_k_.k.y(8));_k_.W1=_k_.k.B256(_k_.k.W(1));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3))

var allfails, allsuccs, columns, comps, fail, fails, file, files, ok, stack, succs, test, tester, Tester

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

Tester = (function ()
{
    function Tester ()
    {
        this["test"] = this["test"].bind(this)
        this["compare"] = this["compare"].bind(this)
        this["section"] = this["section"].bind(this)
        this["location"] = this["location"].bind(this)
        this["skips"] = this["skips"].bind(this)
        this["setFilter"] = this["setFilter"].bind(this)
        this.plain = false
        this.filter = []
    }

    Tester.prototype["setFilter"] = function (text)
    {
        return this.filter = text.toLowerCase().split('/').filter(function (t)
        {
            return t.length
        })
    }

    Tester.prototype["skips"] = function (depth, name)
    {
        var term

        term = this.filter[depth - 1]
        return (term != null) && !name.toLowerCase().includes(term)
    }

    Tester.prototype["location"] = function (err)
    {
        var file, line, m, _37_32_

        var list = _k_.list((((_37_32_=(err != null ? err.stack : undefined)) != null ? _37_32_ : new Error().stack)).split('\n').slice(1))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            line = list[_a_]
            if (/tester\.(js|kode)/.test(line))
            {
                continue
            }
            if (line.includes('node:'))
            {
                continue
            }
            if (m = /\(?([^\s(]+):(\d+):\d+\)?$/.exec(line))
            {
                file = m[1].replace('file://','')
                return `${slash.relative(file,process.cwd())}:${m[2]}`
            }
        }
        return ''
    }

    Tester.prototype["section"] = async function (t, f)
    {
        var depth

        if (this.skips(stack.length + 1,t))
        {
            return
        }
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
            fails.push({stack:stack.concat([comps]),comps:comps,lhs:`${err}`,rhs:'',where:this.location(err)})
        }
        return stack.pop()
    }

    Tester.prototype["sameObjects"] = function (a, b, keystack)
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
                if (!this.plain)
                {
                    console.log(_k_.r5(this.showSpace(a)))
                    console.log(_k_.g3(this.showSpace(b)))
                }
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

    Tester.prototype["compare"] = function (a, b)
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
        if (!this.plain)
        {
            ind = _k_.lpad((stack.length + 1) * 3)
            console.log(_k_.R1(black(ind + comps + ' ')) + ' ' + _k_.r5(this.short(a)) + ' ' + _k_.R1(_k_.r4(' ▸ ')) + ' ' + _k_.g1(this.short(b)))
        }
        return fails.push({stack:stack.concat([comps]),comps:comps,lhs:a,rhs:b,where:this.location()})
    }

    Tester.prototype["test"] = async function (testModule)
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
                if (this.skips(1,k))
                {
                    continue
                }
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
                    fails.push({stack:stack.concat([comps]),comps:comps,lhs:`${err}`,rhs:'',where:this.location(err)})
                }
                stack.pop()
            }
        }
        allsuccs += succs
        allfails = allfails.concat(fails)
        return _k_.empty(fails)
    }

    Tester.prototype["showSpace"] = function (s)
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

    Tester.prototype["timesText"] = function (times)
    {
        var s, time

        s = ''
        var list = _k_.list(times)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            time = list[_a_]
            s += ' ' + _k_.b5(time.name) + ' ' + _k_.b2(time.ms) + '  '
        }
        return s
    }

    Tester.prototype["oneLine"] = function (v)
    {
        var _190_30_

        if (typeof(v) === 'function')
        {
            return '<predicate>'
        }
        if (v === undefined)
        {
            return String(v)
        }
        try
        {
            return ((_190_30_=JSON.stringify(v)) != null ? _190_30_ : String(v))
        }
        catch (err)
        {
            return String(v)
        }
    }

    Tester.prototype["summarize"] = function (times)
    {
        var fail, summary, _198_62_, _210_120_

        if (this.plain)
        {
            var list = _k_.list(allfails)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                fail = list[_a_]
                console.log(`✘ ${fail.stack.join(' ▸ ')}  ${((_198_62_=fail.where) != null ? _198_62_ : '')}`)
                console.log(`  actual:   ${this.oneLine(fail.lhs)}`)
                if (fail.rhs !== '')
                {
                    console.log(`  expected: ${this.oneLine(fail.rhs)}`)
                }
            }
            if (!_k_.empty(allfails))
            {
                console.log(`${allfails.length} failed, ${allsuccs} passed`)
            }
            else
            {
                console.log(`${allsuccs} passed`)
            }
            allfails = []
            allsuccs = 0
            return
        }
        var list1 = _k_.list(allfails)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            fail = list1[_b_]
            console.log(_k_.R2(_k_.y5(' ' + fail.stack[0] + ' ')) + _k_.R1(_k_.y5(' ')) + fail.stack.slice(1).join(_k_.r3(' ▸ ')) + ' ' + _k_.w3(((_210_120_=fail.where) != null ? _210_120_ : '')))
            console.log(_k_.r5(this.showSpace(fail.lhs)))
            console.log(_k_.R1(_k_.r3(' ▸ ')))
            console.log(_k_.g3(this.showSpace(fail.rhs)))
        }
        if (allsuccs || fails.length)
        {
            summary = '\n '
            if (!_k_.empty(allfails))
            {
                summary += _k_.R2(_k_.y2(' ✘ ') + _k_.y6(allfails.length) + _k_.y3(' failure' + ((allfails.length > 1 ? 's ' : ' '))))
            }
            else if (allsuccs)
            {
                summary += _k_.g1(allsuccs) + _k_.g3(" ✔ ") + ' '
                if (!_k_.empty(times))
                {
                    summary += this.timesText(times)
                }
            }
            console.log(summary)
        }
        allfails = []
        return allsuccs = 0
    }

    Tester.prototype["short"] = function (s)
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

    return Tester
})()

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
    ok = await tester.test(test.default)
    if (ok === false)
    {
        fail = true
    }
}
    tester.summarize()
    if (fail)
{
    process.exit(1)
}
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2tvZGUvdGVzdGVyLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7T0FDYSxXQUFOO09BQVcsV0FBWDtPQUFnQixZQUFoQjtPQUFzQixVQUF0Qjs7T0FDRCxZQUFBOztBQUVOLEtBQUs7QUFFTCxRQUFXO0FBQ1gsUUFBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxVQUFXOztBQUVWLFVBQUQ7O2FBRUk7Ozs7Ozs7O1FBRUksS0FBQyxRQUFTO1FBQ1YsS0FBQzs7O3NCQUlMLHdCQUFXOztlQUVQLEtBQUMsU0FBUyxLQUFLLGNBQWMsTUFBTSxLQUFLLGlCQUFROzttQkFBTSxFQUFFOzs7O3NCQUU1RCxvQkFBTyxPQUFNOzs7O1FBRVQsT0FBTyxLQUFDLE9BQU8sUUFBTTtnQkFDckIsa0JBQWMsS0FBSyxjQUFjLFNBQVM7OztzQkFJOUMsdUJBQVU7Ozs7d0NBRU8sY0FBQSxJQUFLLDRDQUFZLFFBQVEsUUFBTyxNQUFNLFlBQU07OztZQUFyRDtnQkFDWSxvQkFBb0IsS0FBSzs7Z0JBQXJDOztnQkFDWSxLQUFLLFNBQVM7O2dCQUExQjs7Z0JBQ0csSUFBSSw2QkFBNkIsS0FBSzs7Z0JBQ3JDLE9BQU8sRUFBRSxHQUFHLFFBQVEsVUFBVTswQkFDekIsTUFBTSxTQUFTLEtBQUssUUFBUSxVQUFVLEVBQUU7OztlQUNyRDs7O3NCQUVKLDRCQUFTLEdBQUU7Ozs7WUFFRixLQUFDLE1BQU0sTUFBTSxTQUFPLEVBQUU7Ozs7UUFFM0IsTUFBTSxLQUFLO1FBQ1gsUUFBUTtRQUNSLFFBQVEsTUFBTTtZQUNYLEtBQUMsZ0JBQWU7O1lBQ2YsWUFBSSxnQkFBUSxRQUFNLElBQUUsS0FBSyxNQUFNLG1CQUFlLEVBQUcsSUFBRSxJQUFFLFVBQVUsS0FBSyxLQUFLLEVBQUcsVUFBUSxJQUFFLFFBQU0sS0FBSzs7OztrQkFFL0Y7O2VBQ0E7O1lBQ0YsTUFBTSxNQUNGLE1BQU8sTUFBTSxRQUFRLFFBQ3JCLE1BQU8s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
//# sourceURL=../../kode/kode/tester.kode
