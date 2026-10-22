var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, each_r: function (o) {return Array.isArray(o) ? [] : typeof o == 'string' ? o.split('') : {}}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}};_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.m5=_k_.k.F256(_k_.k.m(5));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w5=_k_.k.F256(_k_.k.w(5))

var error, expand, parse

import kstr from "./kstr.js"
import klor from "./klor.js"
import noon from "./noon.js"

klor.globalize()

expand = function (l)
{
    var a, match

    var list = _k_.list(l)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        a = list[_a_]
        if (match = /^\-(\w\w+)$/.exec(a))
        {
            a = match[1].split('').map(function (i)
            {
                return '-' + i
            })
            a.unshift(l.indexOf(match.input),1)
            l.splice.apply(l,a)
            return expand(l)
        }
    }
    return l
}

error = function (msg)
{
    var s

    s = dim(_k_.r5("[" + bold("ERROR") + "] "))
    s += _k_.r5(msg.trim().split('\n').join("\n        "))
    console.log(s)
}

parse = function (config, options = {})
{
    var addIgnored, addParam, addParamOrIgnore, arg, argv, cfg, df, expandedArgs, help, helpText, k, lng, lngHelp, long, long2key, maxHelp, maxLong, name, optionsText, org, param, paramList, result, short, short2key, sht, shtHelp, v, _216_19_, _217_21_, _219_22_, _219_41_, _221_28_, _222_23_, _245_23_, _293_52_

    if (typeof(config) === 'string')
    {
        config = noon.parse(config)
    }
    else
    {
        config = Object.assign({},config)
    }
    name = Object.keys(config)[0]
    result = {}
    help = {}
    short = {}
    long = {}
    param = ''
    paramList = false
    cfg = config[name]
    cfg = (function (o) {
        var r = _k_.each_r(o)
        for (var k in o)
        {   
            var m = (function (k, v)
        {
            var cvt, o, s

            if (typeof(v) === 'string')
            {
                o = {}
                s = v.split(/\s\s+/)
                if (s.length > 1)
                {
                    o['?'] = s[0]
                    s = s.slice(1).join(' ')
                }
                else
                {
                    s = s[0]
                    if (!(_k_.in(s[0],'*=-')))
                    {
                        o['?'] = s
                        s = ''
                    }
                }
                s = s.split(' ')
                cvt = function (s)
                {
                    switch (s)
                    {
                        case 'true':
                        case 'yes':
                            return true

                        case 'false':
                        case 'no':
                            return false

                        default:
                            if (_k_.isNum(s))
                        {
                            return parseFloat(s)
                        }
                        else
                        {
                            return s
                        }
                    }

                }
                while (s.length)
                {
                    if (s[0] === '')
                    {
                        s.shift()
                    }
                    else if (s[0] === '**')
                    {
                        o['**'] = true
                        s.shift()
                    }
                    else if (s[0] === '*')
                    {
                        o['*'] = true
                        s.shift()
                    }
                    else if (s[0] === '=')
                    {
                        o['='] = cvt(s[1])
                        s.shift()
                        s.shift()
                    }
                    else if (s[0].startsWith('--'))
                    {
                        o['--'] = s[0].slice(2) || '-'
                        s.shift()
                    }
                    else if (s[0].startsWith('-'))
                    {
                        o['-'] = s[0].slice(1) || '-'
                        s.shift()
                    }
                    else
                    {
                        if ((o['='] != null))
                        {
                            o['='] += ' ' + s.shift()
                        }
                    }
                }
                return [k,o]
            }
            else
            {
                return [k,v]
            }
        })(k, o[k])
            if (m != null && m[0] != null)
            {
                r[m[0]] = m[1]
            }
        }
        return typeof o == 'string' ? r.join('') : r
    })(cfg)
    for (k in cfg)
    {
        v = cfg[k]
        if (0 <= k.indexOf(' '))
        {
            console.error(`wrong karg setup: ${bold("keys can't contain spaces!")}
broken key: ${bold(_k_.y5(k))}`)
            process.exit(1)
        }
        if ((v['='] != null))
        {
            result[k] = v['=']
        }
        sht = k[0]
        lng = k
        if (v['-'])
        {
            sht = v['-']
        }
        if (v['--'])
        {
            lng = v['--']
        }
        if (_k_.in(sht,['-']))
        {
            sht = ''
        }
        if (_k_.in(lng,['-','--']))
        {
            lng = ''
        }
        if (Array.isArray(v))
        {
            if (_k_.in('*',v))
            {
                param = k
            }
            else if (_k_.in('**',v))
            {
                param = k
                paramList = true
                result[k] = []
            }
            else
            {
                short[k] = sht
                long[k] = lng
            }
        }
        else
        {
            if (_k_.in('*',Object.keys(v)))
            {
                param = k
            }
            else if (_k_.in('**',Object.keys(v)))
            {
                param = k
                paramList = true
                result[k] = []
            }
            else
            {
                short[k] = sht
                long[k] = lng
                help[k] = v['?']
            }
        }
    }
    long2key = (function (o) {
        var r = _k_.each_r(o)
        for (var k in o)
        {   
            var m = (function (k, v)
        {
            return [v,k]
        })(k, o[k])
            if (m != null && m[0] != null)
            {
                r[m[0]] = m[1]
            }
        }
        return typeof o == 'string' ? r.join('') : r
    })(long)
    short2key = (function (o) {
        var r = _k_.each_r(o)
        for (var k in o)
        {   
            var m = (function (k, v)
        {
            return [v,k]
        })(k, o[k])
            if (m != null && m[0] != null)
            {
                r[m[0]] = m[1]
            }
        }
        return typeof o == 'string' ? r.join('') : r
    })(short)
    optionsText = ""
    maxLong = 0
    maxHelp = 0
    for (k in cfg)
    {
        v = cfg[k]
        if ((long[k] != null))
        {
            maxLong = Math.max(maxLong,long[k].length)
        }
        if ((help[k] != null))
        {
            maxHelp = Math.max(maxHelp,kstr.strip(help[k]).length)
        }
    }
    for (k in cfg)
    {
        v = cfg[k]
        sht = short[k]
        lng = long[k]
        if ((help[k] != null))
        {
            df = ((function ()
            {
                switch (result[k])
                {
                    case false:
                        return _k_.r5(dim('✘'))

                    case true:
                        return _k_.g5(bold('✔'))

                    default:
                        return result[k]
                }

            }).bind(this))()
            shtHelp = sht !== '' ? `${_k_.w5('-')}${sht}` : '  '
            lngHelp = lng !== '' ? `${_k_.w5('--')}${kstr.rpad(lng,maxLong)}` : '  ' + kstr.pad('',maxLong)
            optionsText += '\n'
            optionsText += `    ${shtHelp} ${lngHelp}`
            optionsText += _k_.w5(bold(`  ${kstr.rpad(help[k],maxHelp)}`))
            if ((df != null))
            {
                optionsText += _k_.m5(`  ${df}`)
            }
        }
    }
    helpText = ''
    if (!_k_.empty(options.preHelp))
    {
        helpText += options.preHelp
    }
    helpText += `\n${_k_.w5('usage:')}  ${bold(name)} `
    helpText += `${_k_.w5('[ ')}${bold(_k_.y5(param))}${paramList && _k_.w5(' ... ]') || _k_.w5(']')}`
    helpText += '\n'
    if ((cfg[param] != null ? cfg[param]['?'] : undefined))
    {
        helpText += _k_.y5(bold(`\n        ${param} ${_k_.w5(cfg[param]['?'])}`))
        if ((cfg[param]['='] != null) && !paramList)
        {
            helpText += _k_.m5(`  ${kstr.pad('',Math.max(0,maxHelp - strip(cfg[param]['?']).length))} ${cfg[param]['=']}`)
        }
        helpText += '\n'
    }
    if (optionsText.length)
    {
        helpText += _k_.w5("\noptions:\n")
        helpText += optionsText
        helpText += '\n'
    }
    short2key['h'] = ((_216_19_=short2key['h']) != null ? _216_19_ : 'help')
    long2key['help'] = ((_217_21_=long2key['help']) != null ? _217_21_ : 'help')
    if ((options.version != null) || (config.version != null))
    {
        delete config.version
        long2key['version'] = ((_221_28_=long2key['version']) != null ? _221_28_ : 'version')
        short2key['V'] = ((_222_23_=short2key['V']) != null ? _222_23_ : 'version')
    }
    delete config[name]
    if (Object.keys(config).length)
    {
        helpText += '\n'
        helpText += noon.stringify(config,{maxalign:16,colors:{key:gray,string:white}})
        helpText += '\n'
    }
    if (!_k_.empty(options.postHelp))
    {
        helpText += options.postHelp
    }
    options.ignoreArgs = ((_245_23_=options.ignoreArgs) != null ? _245_23_ : 2)
    if (options.argv)
    {
        argv = options.argv
    }
    else
    {
        argv = process.argv.slice(options.ignoreArgs)
    }
    expandedArgs = expand(argv)
    addParam = function (arg)
    {
        if (paramList)
        {
            return result[param].push(arg)
        }
        else
        {
            return result[param] = arg
        }
    }
    addIgnored = function (arg)
    {
        if (!result['__ignored'])
        {
            result['__ignored'] = []
        }
        return result['__ignored'].push(arg)
    }
    addParamOrIgnore = function (arg)
    {
        if (param)
        {
            return addParam(arg)
        }
        else
        {
            return addIgnored(arg)
        }
    }
    while (arg = expandedArgs.shift())
    {
        org = arg
        if (arg.substr(0,2) === '--')
        {
            if (!(arg = long2key[arg.substr(2)]))
            {
                addIgnored(org)
                continue
            }
        }
        else if (arg[0] === '-')
        {
            if (!(arg = short2key[arg.substr(1)]))
            {
                addIgnored(org)
                continue
            }
        }
        else
        {
            addParamOrIgnore(arg)
            continue
        }
        if (arg === 'help')
        {
            if (options.returnLog)
            {
                return helpText
            }
            console.log(helpText)
            if (options.dontExit)
            {
                return
            }
            process.exit(0)
        }
        else if (arg === 'version' && (options.version != null))
        {
            if (options.returnLog)
            {
                return version
            }
            v = ''
            if (!_k_.empty(options.preVersion))
            {
                v += options.preVersion
            }
            v += options.version
            if (!_k_.empty(options.postVersion))
            {
                v += options.postVersion
            }
            console.log(v)
            if (options.dontExit)
            {
                return
            }
            process.exit(0)
        }
        if (result[arg] === false || result[arg] === true)
        {
            result[arg] = !result[arg]
        }
        else if (_k_.isNum(result[arg]))
        {
            result[arg] = parseFloat(expandedArgs.shift())
        }
        else if (_k_.in(arg,Object.keys(short2key)))
        {
            result[short2key[arg]] = expandedArgs.shift()
        }
        else if (_k_.in(arg,Object.keys(long2key)))
        {
            result[long2key[arg]] = expandedArgs.shift()
        }
        else
        {
            addParamOrIgnore(arg)
        }
    }
    return result
}
export default parse;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FyZy5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsva2FyZy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BUU0sV0FBQTtPQUFLLFdBQUE7T0FBSyxXQUFBOztBQUVoQixLQUFLOztBQVVMLG1CQUFVOzs7O3dCQUVHOzs7UUFBTDtZQUNHLFFBQVEsY0FBYyxLQUFLOztZQUMxQixJQUFJLE1BQU0sR0FBRyxNQUFNLElBQUksY0FBSzs7dUJBQU0sTUFBSTs7WUFDdEMsRUFBRSxRQUFRLEVBQUUsUUFBUSxNQUFNLE9BQVE7WUFDbEMsRUFBRSxPQUFPLE1BQU0sRUFBRzttQkFDWCxPQUFPOzs7V0FDdEI7OztBQVVKLGtCQUFTOzs7O0lBRUwsSUFBSSxJQUFJLE9BQUcsTUFBTSxLQUFLLFdBQVc7SUFDakMsS0FBSyxPQUFHLElBQUksT0FBTyxNQUFNLE1BQU0sS0FBSztJQUNwQyxZQUFJOzs7QUFvQlIsa0JBQVMsUUFBUTs7OztRQUVWLE9BQU8sWUFBVzs7UUFDakIsU0FBUyxLQUFLLE1BQU07Ozs7UUFFcEIsU0FBUyxPQUFPLFVBQVc7O0lBRS9CLE9BQVMsT0FBTyxLQUFLLFFBQVE7SUFDN0I7SUFDQTtJQUNBO0lBQ0E7SUFDQSxRQUFTO0lBQ1QsWUFBWTtJQUVaLE1BQU0sT0FBTztJQUViOzs7OytCQUFnQixHQUFFOzs7O3VCQUVYLE9BQUs7O2dCQUVKO2dCQUNBLElBQUksRUFBRSxNQUFNO29CQUNULEVBQUUsU0FBUzs7b0JBQ1YsRUFBRSxPQUFPLEVBQUU7b0JBQ1gsSUFBSSxRQUFFLEdBQUssS0FBSzs7OztvQkFFaEIsSUFBSSxFQUFFO2lDQUNILEVBQUUsR0FBVTs7d0JBQ1gsRUFBRSxPQUFPO3dCQUNULElBQUk7OztnQkFDWixJQUFJLEVBQUUsTUFBTTtnQkFFWixnQkFBTzs7NEJBQ0k7OzZCQUNIOzZCQUFNO21DQUFROzs2QkFDZDs2QkFBTzttQ0FBTzs7O2dDQUNRLFVBQUw7O21DQUFjLFdBQVc7Ozs7bUNBQU87Ozs7O3VCQUVuRCxFQUFFOzt3QkFF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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/karg.kode
