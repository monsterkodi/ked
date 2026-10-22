var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import os from "./os.js"

class Slash
{
    static sep = '/'

    static logErrors = true

    static path (p)
    {
        var arr, tilde

        if (arguments.length > 1)
        {
            arr = Array.from(arguments)
            arr = arr.filter(function (c)
            {
                return !_k_.empty(c)
            })
            p = arr.join('/')
        }
        if (_k_.empty(p))
        {
            return ''
        }
        if (p.startsWith('~/'))
        {
            p = Slash.untilde(p)
            tilde = true
        }
        p = Slash.unenv(p)
        p = Slash.normalize(p)
        if (!p)
        {
            console.log('slash.path -- no pee?',p)
            return p
        }
        if (tilde)
        {
            p = Slash.tilde(p)
        }
        return p
    }

    static normalize (path)
    {
        var c, comp, i, p, prun

        if (!(_k_.isStr(path)))
        {
            return ''
        }
        if (_k_.empty(path))
        {
            return ''
        }
        path = path.replaceAll('\\','/')
        comp = path.split('/')
        prun = []
        for (i in comp)
        {
            c = comp[i]
            if (!_k_.empty(prun) && c === '.')
            {
                continue
            }
            if (_k_.empty(c) && (0 < i && i < comp.length - 1))
            {
                continue
            }
            if (c === '..')
            {
                if (!_k_.empty(prun))
                {
                    if (prun.slice(-1)[0] === '.')
                    {
                        prun.pop()
                    }
                    else if (prun.slice(-1)[0] !== '..')
                    {
                        prun.pop()
                        continue
                    }
                }
            }
            prun.push(c)
        }
        p = prun.join('/')
        if (p.endsWith(':.') && p.length === 3)
        {
            p = p.slice(0, 2)
        }
        if (p.endsWith(':') && p.length === 2)
        {
            p = p + '/'
        }
        return p
    }

    static unslash (p)
    {
        var reg

        p = Slash.path(p)
        if (Slash.win())
        {
            if (p.length >= 3 && (p[0] === '/' && '/' === p[2]))
            {
                p = p[1] + ':' + p.slice(2)
            }
            reg = new RegExp("/",'g')
            p = p.replace(reg,'\\')
            if (p[1] === ':')
            {
                p = p[0].toUpperCase() + p.slice(1)
            }
        }
        return p
    }

    static relative (rel, to)
    {
        var dd, r, rc, tc

        to = Slash.path(to)
        if (_k_.empty(rel))
        {
            return to
        }
        rel = Slash.path(rel)
        if (to === rel)
        {
            return '.'
        }
        if (rel.startsWith(to))
        {
            r = rel.slice(to.length)
            if (r[0] === Slash.sep)
            {
                r = r.slice(1)
            }
            return r
        }
        rc = Slash.split(rel)
        tc = Slash.split(to)
        dd = ''
        while (rc[0] === tc[0])
        {
            rc.shift()
            tc.shift()
        }
        if (!_k_.empty(dd))
        {
            return dd + rc.join('/')
        }
        while (!_k_.empty(tc))
        {
            tc.shift()
            dd += '../'
        }
        if (!_k_.empty(dd))
        {
            return dd + rc.join('/')
        }
        return rel
    }

    static absolute (p, cwd)
    {
        if (_k_.empty(p))
        {
            return ''
        }
        if (p.startsWith('~/'))
        {
            p = Slash.untilde(p)
        }
        p = Slash.unenv(p)
        if (Slash.isRelative(p) && !_k_.empty(cwd))
        {
            p = cwd + '/' + p
        }
        p = Slash.normalize(p)
        return p
    }

    static split (p)
    {
        return Slash.path(p).split('/').filter(function (e)
        {
            return e.length
        })
    }

    static contains (p, d)
    {
        return _k_.in(d,Slash.split(p))
    }

    static splitDrive (p)
    {
        var parsed

        p = Slash.path(p)
        parsed = Slash.parse(p)
        if (parsed.dir.length > 1)
        {
            if (parsed.dir[1] === ':')
            {
                return [p.slice(2),parsed.dir[0]]
            }
        }
        else if (parsed.file.length === 2)
        {
            if (parsed.file[1] === ':')
            {
                return ['/',parsed.file[0]]
            }
        }
        return [Slash.path(p),'']
    }

    static removeDrive (p)
    {
        return Slash.splitDrive(p)[0]
    }

    static isRoot (p)
    {
        return Slash.removeDrive(p) === '/'
    }

    static splitFileLine (p)
    {
        var c, clmn, d, f, l, line, split

        var _a_ = Slash.splitDrive(p); f = _a_[0]; d = _a_[1]

        split = String(f).split(':')
        if (split.length > 1)
        {
            line = parseInt(split[1])
        }
        if (split.length > 2)
        {
            clmn = parseInt(split[2])
        }
        l = c = 0
        if (Number.isInteger(line))
        {
            l = line
        }
        if (Number.isInteger(clmn))
        {
            c = clmn
        }
        if (d !== '')
        {
            d = d + ':'
        }
        return [d + split[0],Math.max(l,1),Math.max(c,0)]
    }

    static hasFilePos (p)
    {
        var ps

        ps = Slash.splitFilePos(p)
        return ps[1][0] !== 0 || ps[1][1] !== 0
    }

    static sameFilePos (a, b)
    {
        var as, bs

        as = Slash.splitFilePos(a)
        bs = Slash.splitFilePos(b)
        return as[0] === bs[0] && as[1][1] === bs[1][1] && as[1][0] === bs[1][0]
    }

    static sameFileLine (a, b)
    {
        var as, bs

        as = Slash.splitFilePos(a)
        bs = Slash.splitFilePos(b)
        return as[0] === bs[0] && as[1][1] === bs[1][1]
    }

    static removeFilePos (p)
    {
        return Slash.splitFilePos(p)[0]
    }

    static splitFilePos (p)
    {
        var c, f, l

        var _a_ = Slash.splitFileLine(p); f = _a_[0]; l = _a_[1]; c = _a_[2]

        return [f,[c,l - 1]]
    }

    static removeLinePos (p)
    {
        return Slash.splitFileLine(p)[0]
    }

    static removeColumn (p)
    {
        var f, l

        var _a_ = Slash.splitFileLine(p); f = _a_[0]; l = _a_[1]

        if (l > 1)
        {
            return f + ':' + l
        }
        else
        {
            return f
        }
    }

    static ext (p)
    {
        return Slash.parse(p).ext
    }

    static removeExt (p)
    {
        var d

        d = Slash.parse(p)
        return Slash.path(d.dir,d.name)
    }

    static splitExt (p)
    {
        return [Slash.removeExt(p),Slash.ext(p)]
    }

    static swapExt (p, ext)
    {
        return Slash.removeExt(p) + (ext.startsWith('.') && ext || `.${ext}`)
    }

    static joinFilePos (file, pos)
    {
        file = Slash.removeLinePos(file)
        if (!(pos != null) || !(pos[0] != null) || (pos[0] === pos[1] && pos[1] === 0))
        {
            return file
        }
        else if (pos[0])
        {
            return file + `:${pos[1] + 1}:${pos[0]}`
        }
        else
        {
            return file + `:${pos[1] + 1}`
        }
    }

    static joinFileLine (file, line, col)
    {
        file = Slash.removeLinePos(file)
        if (!line)
        {
            return file
        }
        if (!col)
        {
            return `${file}:${line}`
        }
        return `${file}:${line}:${col}`
    }

    static pathlist (p)
    {
        var comp, list

        if (!(p != null ? p.length : undefined))
        {
            Slash.error("Slash.pathlist -- no path?")
            return []
        }
        p = Slash.path(p)
        if (p.length > 1 && p[p.length - 1] === '/' && p[p.length - 2] !== ':')
        {
            p = p.slice(0, p.length - 1)
        }
        else if (p === '/')
        {
            return ['/']
        }
        list = [p]
        comp = p.split(Slash.sep)
        while (comp.length > 1)
        {
            comp.pop()
            if (comp.length === 1 && comp[0] === '')
            {
                list.unshift(Slash.sep)
            }
            else
            {
                list.unshift(comp.join(Slash.sep))
            }
        }
        return list
    }

    static dir (p)
    {
        return Slash.parse(p).dir
    }

    static file (p)
    {
        return Slash.parse(p).file
    }

    static name (p)
    {
        return Slash.parse(p).name
    }

    static isAbsolute (p)
    {
        return _k_.in((p != null ? p[0] : undefined),[Slash.sep,'~'])
    }

    static isRelative (p)
    {
        return !Slash.isAbsolute(p)
    }

    static parse (p)
    {
        var components, dir, dots, ext, file, name

        p = Slash.path(p)
        if (p.endsWith(Slash.sep))
        {
            p = p.slice(0, -1)
        }
        if (p === '~')
        {
            components = Slash.untilde(p).split(Slash.sep)
        }
        else
        {
            components = p.split(Slash.sep)
        }
        file = components.slice(-1)[0]
        dots = file.split('.')
        ext = ((dots.length > 1 && dots.slice(-1)[0].length) ? dots.pop() : '')
        name = dots.join('.')
        dir = components.slice(0, -1).join('/')
        if (Slash.isAbsolute(p) && _k_.empty(dir))
        {
            dir = Slash.sep
        }
        return {path:p,dir:dir,file:file,name:name,ext:ext}
    }

    static home ()
    {
        var _326_35_

        return ((_326_35_=globalThis.homeDir) != null ? _326_35_ : process.env.HOME)
    }

    static user ()
    {
        var _327_35_

        return ((_327_35_=globalThis.useName) != null ? _327_35_ : process.env.USER)
    }

    static tmpdir ()
    {
        var _328_35_

        return ((_328_35_=globalThis.tmpDir) != null ? _328_35_ : '/home/kodi/tmp')
    }

    static tmpfile (ext)
    {
        return Slash.path(Slash.tmpdir(),`${Date.now()}${Math.random()}` + (ext && `.${ext}` || ''))
    }

    static tmpsib (p)
    {
        return Slash.path(Slash.dir(p),`.${Slash.file(p)}.${Date.now()}${Math.random()}`)
    }

    static tilde (p)
    {
        return (p != null ? p.replace(Slash.home(),'~') : undefined)
    }

    static untilde (p)
    {
        return (p != null ? p.replace(/^\~/,Slash.home()) : undefined)
    }

    static unenv (p)
    {
        var i, k, v

        i = p.indexOf('$',0)
        while (i >= 0)
        {
            for (k in process.env)
            {
                v = process.env[k]
                if (k === p.slice(i + 1,i + 1 + k.length))
                {
                    p = p.slice(0,i) + v + p.slice(i + k.length + 1)
                    break
                }
            }
            i = p.indexOf('$',i + 1)
        }
        return p
    }

    static fileUrl (p)
    {
        return `file:///${Slash.encode(p)}`
    }

    static samePath (a, b)
    {
        return Slash.path(a) === Slash.path(b)
    }

    static escape (p)
    {
        return p.replace(/([\`\"])/g,'\\$1')
    }

    static encode (p)
    {
        p = encodeURI(p)
        p = p.replace(/\#/g,"%23")
        p = p.replace(/\&/g,"%26")
        return p = p.replace(/\'/g,"%27")
    }

    static sanitize (p)
    {
        while (_k_.in(p[0],'\n\r\t'))
        {
            p = p.slice(1)
        }
        while (_k_.in(p.slice(-1)[0],'\n\r\t'))
        {
            p = p.slice(0, -1)
        }
        return p
    }

    static textext = null

    static textbase = {profile:1,license:1,'.gitignore':1,'.npmignore':1}

    static reg = new RegExp("\\\\",'g')

    static win ()
    {
        return Slash.sep === '\\'
    }

    static error (msg)
    {
        if (this.logErrors)
        {
            console.error(msg)
        }
        return ''
    }
}

export default Slash;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xhc2guanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva3hrL3NsYXNoLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7QUFVQSxNQUFNOztpQkFFSTs7dUJBRU07O0lBUVosYUFBTzs7OztZQUVBLFVBQVUsU0FBUzs7WUFDbEIsTUFBTSxNQUFNLEtBQUs7WUFDakIsTUFBTSxJQUFJLGlCQUFROztrQ0FBWTs7WUFDOUIsSUFBSSxJQUFJLEtBQUs7O3NCQUVIOzttQkFBWjs7WUFFQyxFQUFFLFdBQVc7O1lBQ1osSUFBSSxNQUFNLFFBQVE7WUFDbEIsUUFBUTs7UUFDWixJQUFJLE1BQU0sTUFBTTtRQUNoQixJQUFJLE1BQU0sVUFBVTthQUViOztZQUNILFlBQUksd0JBQXdCO21CQUMxQjs7WUFFZTs7WUFBckIsSUFBSSxNQUFNLE1BQU07O2VBQ2hCOzs7SUFRSixrQkFBWTs7Ozt3QkFFSTs7bUJBQVY7O3NCQUNZOzttQkFBWjs7UUFFRixPQUFPLEtBQUssV0FBVyxLQUFLO1FBRTVCLE9BQU8sS0FBSyxNQUFNO1FBRWxCO2tCQUNXOztnQkFBQTsyQkFDVyxTQUFTLE1BQUs7O2dCQUFoQzs7MEJBQ2tCLE9BQU0sSUFBSSxLQUFBLElBQUksS0FBSyxTQUFPOztnQkFBNUM7O2dCQUNHLE1BQUs7OytCQUNLOzt3QkFDRixzQkFBWTs7d0JBQ1gsS0FBSzs7NkJBQ0Qsc0JBQVk7O3dCQUNoQixLQUFLO3dCQUNMOzs7O1lBQ1osS0FBSyxLQUFLOztRQUVkLElBQUksS0FBSyxLQUFLO1lBQ0MsRUFBRSxTQUFTLFNBQVUsRUFBRSxXQUFVOztZQUFoRCxJQUFJOztZQUNXLEVBQUUsU0FBUyxRQUFVLEVBQUUsV0FBVTs7WUFBaEQsSUFBSSxJQUFJOztlQUNSOzs7SUFRSixnQkFBVTs7OztRQUVOLElBQUksTUFBTSxLQUFLO1lBRVosTUFBTTs7Z0JBRUYsRUFBRSxVQUFVLE1BQU0sRUFBRSxPQUFNLE9BQUEsUUFBTyxFQUFFOztnQkFDbEMsSUFBSSxFQUFFLEtBQUssTUFBTSxFQUFFLE1B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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/slash.kode
