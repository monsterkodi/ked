var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var pretty

import klor from "./klor.js"
import slash from "./slash.js"


pretty = (function ()
{
    function pretty ()
    {}

    pretty["age"] = function (dateOrString, opt = {})
    {
        var date, diff, key, levels, s, sec, time, val, _21_28_

        levels = ((_21_28_=opt.levels) != null ? _21_28_ : 1)
        if (_k_.isStr(dateOrString))
        {
            date = new Date(Date.parse(dateOrString))
        }
        else
        {
            date = new Date(dateOrString)
        }
        diff = Date.now() - date.valueOf()
        sec = parseInt(diff / 1000)
        time = {year:Math.floor(sec / (60 * 60 * 24 * 30 * 12)),month:Math.floor(sec / (60 * 60 * 24 * 30) % 12),day:Math.floor(sec / (60 * 60 * 24) % 30),hour:Math.floor(sec / (60 * 60) % 24),minute:Math.floor(sec / 60 % 60),second:Math.floor(sec % 60)}
        s = []
        for (key in time)
        {
            val = time[key]
            if (val === 0)
            {
                if (s.length)
                {
                    return s[0]
                }
            }
            else
            {
                s.push(`${val} ${this.deplural(key + 's',val)}`)
            }
            if (s.length === levels)
            {
                return s.join(' ')
            }
        }
        if (_k_.empty(s))
        {
            return '0 seconds'
        }
        else
        {
            return s.join(' ')
        }
    }

    pretty["bytes"] = function (bytes)
    {
        var exponent, number, numStr, UNITS

        number = Math.abs(parseInt(bytes))
        if (!(_k_.isNum(number)) || number === 0)
        {
            return '0 bytes'
        }
        UNITS = ['bytes','kB','MB','GB','TB']
        exponent = Math.min(Math.floor(Math.log10(number) / 3),UNITS.length - 1)
        number /= Math.pow(1000,exponent)
        numStr = this.number(number,{decimals:0})
        return numStr + ' ' + this.deplural(UNITS[exponent],numStr)
    }

    pretty["number"] = function (number, opt = {})
    {
        var decimals, prune, ps, _83_32_, _86_32_

        decimals = ((_83_32_=opt.decimals) != null ? _83_32_ : 1)
        prune = ((_86_32_=opt.prune) != null ? _86_32_ : true)
        ps = number.toFixed(decimals)
        if (prune && decimals)
        {
            while (ps.slice(-1)[0] === '0')
            {
                ps = ps.slice(0, -1)
            }
            if (ps.slice(-1)[0] === '.')
            {
                ps = ps.slice(0, -1)
            }
        }
        return ps
    }

    pretty["deplural"] = function (plural, num)
    {
        if (parseInt(num) === 1 && plural.slice(-1)[0] === 's')
        {
            return plural.slice(0, -1)
        }
        else
        {
            return plural
        }
    }

    pretty["shortCount"] = function (num)
    {
        var v

        v = parseInt(num)
        if (v > 999999)
        {
            return `${Math.floor(v / 1000000)}M`
        }
        else if (v > 999)
        {
            return `${Math.floor(v / 1000)}k`
        }
        else
        {
            return `${v}`
        }
    }

    pretty["path"] = function (p, c = klor.y5)
    {
        return p.split('/').map(function (n)
        {
            return c(n)
        }).join(klor.dim(c('/')))
    }

    pretty["ext"] = function (e, c = klor.y3)
    {
        return (e.length ? klor.dim(c('.')) + c(e) : '')
    }

    pretty["file"] = function (f, c = klor.y5, e = klor.y3)
    {
        return `${klor.bold(c(slash.name(f)))}${pretty.ext(slash.ext(f),e)}`
    }

    pretty["filePath"] = function (p, c = klor.y5, d = klor.y3, e)
    {
        e = (e != null ? e : d)
        if (!_k_.empty(slash.dir(p)))
        {
            return `${pretty.path(slash.tilde(slash.dir(p)),d)}${pretty.path('/',d)}${pretty.file(slash.file(p),c,e)}`
        }
        else
        {
            return `${pretty.file(slash.file(p),c)}`
        }
    }

    pretty["ranges"] = function (rgs)
    {
        var cfunc, plain, result, rng

        result = ''
        plain = ''
        var list = _k_.list(rgs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            while (plain.length < rng.start)
            {
                plain += ' '
                result += ' '
            }
            cfunc = ((function ()
            {
                switch (rng.clss)
                {
                    case 'text':
                        return function (s)
                        {
                            return klor.white(s)
                        }

                    case 'text require string':
                        return function (s)
                        {
                            return klor.gray(klor.bold(s))
                        }

                    case 'comment':
                        return function (s)
                        {
                            return klor.w1(s)
                        }

                    case 'punct comment':
                        return function (s)
                        {
                            return klor.w1(klor.dim(s))
                        }

                    case 'punct':
                    case 'punct minor':
                    case 'punct require':
                    case 'keyword require':
                        return function (s)
                        {
                            return klor.gray(klor.dim(s))
                        }

                    case 'function':
                    case 'function call':
                    case 'string single':
                    case 'string double':
                    case 'dir text':
                    case 'property':
                    case 'function argument':
                        return function (s)
                        {
                            return klor.g3(klor.bold(s))
                        }

                    case 'punct string interpolation start':
                    case 'punct string interpolation end':
                        return function (s)
                        {
                            return klor.g1(klor.bold(s))
                        }

                    case 'punct string single':
                    case 'punct string double':
                    case 'punct string double triple':
                    case 'punct dir':
                    case 'punct function call':
                        return function (s)
                        {
                            return klor.green(klor.dim(s))
                        }

                    case 'method class':
                        return function (s)
                        {
                            return klor.y4(klor.bold(s))
                        }

                    case 'obj':
                    case 'class':
                    case 'git file':
                    case 'dictionary key':
                    case 'module':
                        return function (s)
                        {
                            return klor.y4(s)
                        }

                    case 'method':
                        return function (s)
                        {
                            return klor.y5(klor.bold(s))
                        }

                    case 'punct method':
                        return function (s)
                        {
                            return klor.y2(klor.bold(s))
                        }

                    case 'punct git':
                    case 'git ext':
                    case 'punct method class':
                    case 'punct dictionary':
                    case 'punct function':
                        return function (s)
                        {
                            return klor.yellow(klor.dim(s))
                        }

                    case 'number':
                    case 'keyword':
                    case 'punct compare ligature':
                    case 'url domain':
                        return function (s)
                        {
                            return klor.blue(klor.bold(s))
                        }

                    case 'require':
                    case 'punct property':
                        return function (s)
                        {
                            return klor.green(klor.dim(s))
                        }

                    case 'punct semver':
                    case 'url protocol':
                    case 'punct regexp start':
                    case 'punct regexp end':
                    case 'punct regexp':
                    case 'punct url':
                        return function (s)
                        {
                            return klor.magenta(s)
                        }

                    case 'punct escape regexp':
                        return function (s)
                        {
                            return klor.m1(s)
                        }

                    case 'semver':
                    case 'dir url tld':
                    case 'text regexp':
                    case 'punct url tld':
                        return function (s)
                        {
                            return klor.magenta(klor.bold(s))
                        }

                    case 'punct function tail ligature':
                    case 'punct function async':
                    case 'punct keyword':
                    case 'punct await':
                    case 'punct keyword return':
                        return function (s)
                        {
                            return klor.b5(klor.bold(s))
                        }

                    case 'nil':
                        return function (s)
                        {
                            return klor.r2(s)
                        }

                    default:
                        return function (s)
                    {
                        return klor.white(s)
                    }
                }

            }).bind(this))()
            plain += rng.match
            result += cfunc(rng.match)
        }
        return result
    }

    return pretty
})()

export default pretty;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldHR5LmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9wcmV0dHkua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFVUyxVQUFUOzs7OztZQVFJLGtCQUFNLGNBQWE7Ozs7UUFFZixtQkFBUyxJQUFJLDRCQUFTO3NCQUluQjs7WUFDQyxXQUFXLEtBQUssS0FBSyxNQUFNOzs7O1lBRTNCLFdBQVcsS0FBSzs7UUFFcEIsT0FBTyxLQUFLLFFBQVEsS0FBSztRQUV6QixNQUFNLFNBQVMsT0FBSztRQUVwQixRQUNJLEtBQVEsS0FBSyxNQUFNLE9BQU8sS0FBRyxLQUFHLEtBQUcsS0FBRyxLQUN0QyxNQUFRLEtBQUssTUFBTSxPQUFPLEtBQUcsS0FBRyxLQUFHLE1BQU0sSUFDekMsSUFBUSxLQUFLLE1BQU0sT0FBTyxLQUFHLEtBQUcsTUFBTSxJQUN0QyxLQUFRLEtBQUssTUFBTSxPQUFPLEtBQUcsTUFBTSxJQUNuQyxPQUFRLEtBQUssTUFBTSxNQUFNLEtBQUssSUFDOUIsT0FBUSxLQUFLLE1BQU0sTUFBTTtRQUU3QjtvQkFDZTs7a0JBQUE7Z0JBQ1IsUUFBTzs7b0JBQU8sRUFBRTs7MkJBQWdCLEVBQUU7Ozs7O2dCQUNoQyxFQUFFLFFBQVEsT0FBTyxLQUFDLFNBQVMsTUFBSSxJQUFJOztnQkFFckMsRUFBRSxXQUFVOzt1QkFBZ0IsRUFBRSxLQUFLOzs7c0JBRWpDOzttQkFDTDs7OzttQkFFQSxFQUFFLEtBQUs7Ozs7WUFRZixvQkFBUTs7OztRQUVKLFNBQVMsS0FBSyxJQUFJLFNBQVM7d0JBRVIsWUFBaUIsV0FBVTs7bUJBQTVDOztRQUVGLFNBQVUsUUFBUSxLQUFLLEtBQUssS0FBSztRQUVqQyxXQUFXLEtBQUssSUFBSSxLQUFLLE1BQU0sS0FBSyxNQUFNLFVBQVEsR0FBSSxNQUFNLFNBQVM7UUFDckUsVUFBVyxLQUFLLElBQUksS0FBSztRQUV6QixTQUFTLEtBQUMsT0FBTyxRQUFRLFNBQVM7ZUFDbEMsU0FBUyxNQUFNLEtBQUMsU0FBUyxNQUFNLFVB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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/pretty.kode
