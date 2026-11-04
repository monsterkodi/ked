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
    var addIgnored, addParam, addParamOrIgnore, arg, argv, cfg, df, expandedArgs, help, helpText, k, lng, lngHelp, long, long2key, maxHelp, maxLong, name, optionsText, org, param, paramList, result, short, short2key, sht, shtHelp, v, _173_19_, _174_21_, _176_22_, _176_41_, _178_28_, _179_23_, _195_23_, _243_52_

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
    short2key['h'] = ((_173_19_=short2key['h']) != null ? _173_19_ : 'help')
    long2key['help'] = ((_174_21_=long2key['help']) != null ? _174_21_ : 'help')
    if ((options.version != null) || (config.version != null))
    {
        delete config.version
        long2key['version'] = ((_178_28_=long2key['version']) != null ? _178_28_ : 'version')
        short2key['V'] = ((_179_23_=short2key['V']) != null ? _179_23_ : 'version')
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
    options.ignoreArgs = ((_195_23_=options.ignoreArgs) != null ? _195_23_ : 2)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FyZy5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsva2FyZy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ00sV0FBQTtPQUFLLFdBQUE7T0FBSyxXQUFBOztBQUVoQixLQUFLOztBQUVMLG1CQUFVOzs7O3dCQUVHOzs7UUFBTDtZQUNHLFFBQVEsY0FBYyxLQUFLOztZQUMxQixJQUFJLE1BQU0sR0FBRyxNQUFNLElBQUksY0FBSzs7dUJBQU0sTUFBSTs7WUFDdEMsRUFBRSxRQUFRLEVBQUUsUUFBUSxNQUFNLE9BQVE7WUFDbEMsRUFBRSxPQUFPLE1BQU0sRUFBRzttQkFDWCxPQUFPOzs7V0FDdEI7OztBQUVKLGtCQUFTOzs7O0lBRUwsSUFBSSxJQUFJLE9BQUcsTUFBTSxLQUFLLFdBQVc7SUFDakMsS0FBSyxPQUFHLElBQUksT0FBTyxNQUFNLE1BQU0sS0FBSztJQUNwQyxZQUFJOzs7QUFjUixrQkFBUyxRQUFROzs7O1FBRVYsT0FBTyxZQUFXOztRQUNqQixTQUFTLEtBQUssTUFBTTs7OztRQUVwQixTQUFTLE9BQU8sVUFBVzs7SUFFL0IsT0FBUyxPQUFPLEtBQUssUUFBUTtJQUM3QjtJQUNBO0lBQ0E7SUFDQTtJQUNBLFFBQVM7SUFDVCxZQUFZO0lBRVosTUFBTSxPQUFPO0lBRWI7Ozs7K0JBQWdCLEdBQUU7Ozs7dUJBRVgsT0FBSzs7Z0JBRUo7Z0JBQ0EsSUFBSSxFQUFFLE1BQU07b0JBQ1QsRUFBRSxTQUFTOztvQkFDVixFQUFFLE9BQU8sRUFBRTtvQkFDWCxJQUFJLFFBQUUsR0FBSyxLQUFLOzs7O29CQUVoQixJQUFJLEVBQUU7aUNBQ0gsRUFBRSxHQUFVOzt3QkFDWCxFQUFFLE9BQU87d0JBQ1QsSUFBSTs7O2dCQUNaLElBQUksRUFBRSxNQUFNO2dCQUVaLGdCQUFPOzs0QkFDSTs7NkJBQ0g7NkJBQU07bUNBQVE7OzZCQUNkOzZCQUFPO21DQUFPOzs7Z0NBQ1EsVUFBTDs7bUNBQWMsV0FBVzs7OzttQ0FBTzs7Ozs7dUJBRW5ELEVBQUU7O3dCQUVB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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/karg.kode
