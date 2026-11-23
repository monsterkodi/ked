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
            l.splice(...a)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FyZy5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsva2FyZy5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ00sV0FBQTtPQUFLLFdBQUE7T0FBSyxXQUFBOztBQUVoQixLQUFLOztBQUVMLG1CQUFVOzs7O3dCQUVHOzs7UUFBTDtZQUNHLFFBQVEsY0FBYyxLQUFLOztZQUMxQixJQUFJLE1BQU0sR0FBRyxNQUFNLElBQUksY0FBSzs7dUJBQU0sTUFBSTs7WUFDdEMsRUFBRSxRQUFRLEVBQUUsUUFBUSxNQUFNLE9BQVE7WUFDbEMsRUFBRSxVQUFPO21CQUNGLE9BQU87OztXQUN0Qjs7O0FBRUosa0JBQVM7Ozs7SUFFTCxJQUFJLElBQUksT0FBRyxNQUFNLEtBQUssV0FBVztJQUNqQyxLQUFLLE9BQUcsSUFBSSxPQUFPLE1BQU0sTUFBTSxLQUFLO0lBQ3BDLFlBQUk7OztBQWNSLGtCQUFTLFFBQVE7Ozs7UUFFVixPQUFPLFlBQVc7O1FBQ2pCLFNBQVMsS0FBSyxNQUFNOzs7O1FBRXBCLFNBQVMsT0FBTyxVQUFXOztJQUUvQixPQUFTLE9BQU8sS0FBSyxRQUFRO0lBQzdCO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsUUFBUztJQUNULFlBQVk7SUFFWixNQUFNLE9BQU87SUFFYjs7OzsrQkFBZ0IsR0FBRTs7Ozt1QkFFWCxPQUFLOztnQkFFSjtnQkFDQSxJQUFJLEVBQUUsTUFBTTtvQkFDVCxFQUFFLFNBQVM7O29CQUNWLEVBQUUsT0FBTyxFQUFFO29CQUNYLElBQUksUUFBRSxHQUFLLEtBQUs7Ozs7b0JBRWhCLElBQUksRUFBRTtpQ0FDSCxFQUFFLEdBQVU7O3dCQUNYLEVBQUUsT0FBTzt3QkFDVCxJQUFJOzs7Z0JBQ1osSUFBSSxFQUFFLE1BQU07Z0JBRVosZ0JBQU87OzRCQUNJOzs2QkFDSDs2QkFBTTttQ0FBUTs7NkJBQ2Q7NkJBQU87bUNBQU87OztnQ0FDUSxVQUFMOzttQ0FBYyxXQUFXOzs7O21DQUFPOzs7Ozt1QkFFbkQsRUFBRTs7d0JBRUEsRUFBRSxPQUFN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
//# sourceURL=../../kode/kxk/karg.kode
