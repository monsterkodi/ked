var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var NFS

import slash from "./slash.js"

import kstr from "./kstr.js"

import fs from "fs"

import child_process from "child_process"

import fsp from 'fs/promises'

NFS = (function ()
{
    function NFS ()
    {}

    NFS["listdir"] = async function (dir, opt)
    {
        var absPath, dirent, dirents, file, isDir, resolved, _13_22_, _14_18_, _15_23_

        opt = (opt != null ? opt : {})
        opt.recursive = ((_13_22_=opt.recursive) != null ? _13_22_ : true)
        opt.found = ((_14_18_=opt.found) != null ? _14_18_ : [])
        opt.ignoreDirs = ((_15_23_=opt.ignoreDirs) != null ? _15_23_ : [])
        dir = await NFS.resolveSymlink(dir)
        try
        {
            dirents = await fsp.readdir(dir,{withFileTypes:true})
        }
        catch (err)
        {
            if (!(_k_.in(err.code,['EACCES','EPERM','ENOENT'])))
            {
                console.log(err)
            }
            return opt.found
        }
        var list = _k_.list(dirents)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dirent = list[_a_]
            file = dirent.name
            isDir = dirent.isDirectory()
            absPath = slash.path(dir,file)
            resolved = undefined
            if (dirent.isSymbolicLink())
            {
                resolved = await fsp.readlink(absPath)
                if (!slash.isAbsolute(resolved))
                {
                    resolved = slash.path(dir,resolved)
                }
                isDir = await this.isDir(resolved)
            }
            if (isDir)
            {
                if (_k_.in(file,['node_modules','.git']))
                {
                    continue
                }
                if (_k_.in(file,opt.ignoreDirs))
                {
                    continue
                }
                if (_k_.in(absPath,['/Users/Shared']))
                {
                    continue
                }
            }
            else
            {
                if (_k_.in(file,['.DS_Store','.localized']))
                {
                    continue
                }
            }
            opt.found.push({type:(isDir ? 'dir' : 'file'),file:file,path:absPath})
            if (resolved)
            {
                opt.found.slice(-1)[0].link = resolved
            }
            if (isDir && opt.recursive)
            {
                await NFS.listdir(absPath,opt)
            }
        }
        opt.found.sort(function (a, b)
        {
            return a.path.localeCompare(b.path)
        })
        return opt.found
    }

    NFS["list"] = NFS.listdir
    NFS["dirlist"] = NFS.listdir
    NFS["resolveSymlink"] = async function (p)
    {
        var r, stat

        if (!(_k_.isStr(p)))
        {
            console.error(`nfs.resolveSymlink needs a string! ${p}`)
            return p
        }
        try
        {
            stat = await fsp.lstat(p)
            if (stat.isSymbolicLink())
            {
                r = await fsp.readlink(p)
                if (!slash.isAbsolute(r))
                {
                    r = slash.path(slash.dir(p),r)
                }
                return r
            }
        }
        catch (err)
        {
            console.warn("nfs.resolveSymlink --",err)
        }
        return p
    }

    NFS["read"] = async function (p)
    {
        try
        {
            return await fsp.readFile(p,'utf8')
        }
        catch (err)
        {
            return ''
        }
    }

    NFS["mode"] = async function (p)
    {
        var stat

        if (_k_.empty(p))
        {
            return
        }
        try
        {
            stat = await fsp.stat(p)
        }
        catch (err)
        {
            return
        }
        return stat.mode & 0o7777
    }

    NFS["write"] = async function (p, text)
    {
        var dir, file, mode, tmp

        file = slash.untilde(p)
        dir = slash.dir(file)
        mode = await NFS.mode(file)
        try
        {
            await fsp.mkdir(dir,{recursive:true})
            if (await fsp.access(dir,fs.constants.W_OK))
            {
                return {error:`can't access ${dir}`}
            }
            tmp = slash.tmpsib(file)
            if (await fsp.writeFile(tmp,text))
            {
                return {error:`can't write ${tmp}`}
            }
            if (!_k_.empty(mode))
            {
                await fsp.chmod(tmp,mode)
            }
            if (await fsp.rename(tmp,file))
            {
                return {error:`can't move ${tmp} to ${file}`}
            }
            return file
        }
        catch (err)
        {
            return {error:`nfs.write -- ${String(err)}`}
        }
    }

    NFS["info"] = async function (p)
    {
        try
        {
            return await fsp.stat(p)
        }
        catch (err)
        {
            console.error("nfs.info -- " + String(err))
        }
    }

    NFS["mkdir"] = async function (p)
    {
        try
        {
            await fsp.mkdir(p,{recursive:true})
        }
        catch (err)
        {
            if (err.code !== 'EEXIST')
            {
                return {error:`nfs.mkdir -- ${String(err)}`}
            }
        }
        return p
    }

    NFS["exists"] = async function (p)
    {
        try
        {
            if (!(p != null))
            {
                return
            }
            p = slash.absolute(slash.removeLinePos(p),process.cwd())
            return await fsp.stat(p)
        }
        catch (err)
        {
            return null
        }
    }

    NFS["type"] = async function (p)
    {
        var stat

        if (stat = await NFS.exists(p))
        {
            return (stat.isFile() ? 'file' : 'dir')
        }
    }

    NFS["fileExists"] = async function (p)
    {
        var stat

        stat = await NFS.exists(p)
        if ((stat != null ? stat.isFile() : undefined))
        {
            return stat
        }
    }

    NFS["isFile"] = async function (p)
    {
        return NFS.fileExists(p)
    }

    NFS["dirExists"] = async function (p)
    {
        var stat

        stat = await NFS.exists(p)
        if ((stat != null ? stat.isDirectory() : undefined))
        {
            return stat
        }
    }

    NFS["isDir"] = async function (p)
    {
        return NFS.dirExists(p)
    }

    NFS["remove"] = async function (p)
    {
        return await fsp.rm(p,{force:true,recursive:true})
    }

    NFS["copy"] = async function (from, to)
    {
        if (await NFS.isDir(to))
        {
            to = slash.path(to,slash.file(from))
        }
        return await fsp.cp(from,to,{recursive:true})
    }

    NFS["move"] = async function (from, to)
    {
        if (await NFS.isDir(to))
        {
            to = slash.path(to,slash.file(from))
        }
        if (await NFS.exists(from))
        {
            return await fsp.rename(from,to)
        }
    }

    NFS["duplicate"] = async function (p)
    {
        var target

        if (_k_.empty(p))
        {
            return
        }
        p = slash.path(p)
        if (!await NFS.exists(p))
        {
            return
        }
        target = await NFS.copyPath(p)
        if (_k_.empty(target))
        {
            return
        }
        await NFS.copy(p,target)
        return target
    }

    NFS["copyPath"] = async function (p)
    {
        var base, dir, entries, entry, ext, highest, name, number, parsed, prefix, rest, stem, suffix

        parsed = slash.parse(p)
        dir = parsed.dir
        name = parsed.name
        ext = parsed.ext
        if (_k_.empty(name))
        {
            name = parsed.file
            ext = ''
        }
        base = name.replace(/-copy\d*$/,'')
        prefix = `${base}-copy`
        suffix = (ext ? `.${ext}` : '')
        highest = 0
        try
        {
            entries = await fsp.readdir(dir)
        }
        catch (err)
        {
            entries = []
        }
        var list = _k_.list(entries)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            entry = list[_a_]
            stem = entry
            if (suffix)
            {
                if (!entry.endsWith(suffix))
                {
                    continue
                }
                stem = entry.slice(0, entry.length - suffix.length)
            }
            if (!stem.startsWith(prefix))
            {
                continue
            }
            rest = stem.slice(prefix.length)
            number = 1
            if (rest)
            {
                if (!/^\d+$/.test(rest))
                {
                    continue
                }
                number = parseInt(rest)
            }
            if (number > highest)
            {
                highest = number
            }
        }
        if (highest)
        {
            return slash.path(dir,`${prefix}${highest + 1}${suffix}`)
        }
        else
        {
            return slash.path(dir,`${prefix}${suffix}`)
        }
    }

    NFS["git"] = async function (p)
    {
        var git

        git = slash.path(p)
        while (git.length && git !== "/")
        {
            if (await NFS.isDir(slash.path(git,'.git')))
            {
                return git
            }
            git = slash.dir(git)
        }
    }

    NFS["pkg"] = async function (p)
    {
        var pkg

        pkg = slash.path(p)
        while (pkg.length && pkg !== "/")
        {
            if (await NFS.isFile(slash.path(pkg,'package.json')))
            {
                return pkg
            }
            pkg = slash.dir(pkg)
        }
    }

    NFS["prj"] = async function (p)
    {
        var pth

        pth = slash.path(p)
        if (await NFS.isFile(pth))
        {
            pth = slash.dir(pth)
        }
        while (pth.length && pth !== "/")
        {
            if (await NFS.isDir(slash.path(pth,'.git')))
            {
                return pth
            }
            if (await NFS.isFile(slash.path(pth,'package.json')))
            {
                return pth
            }
            if (await NFS.isFile(slash.path(slash.dir(pth),'kakao.kode')))
            {
                return pth
            }
            pth = slash.dir(pth)
        }
        return pth
    }

    NFS["readText"] = async function (p)
    {
        var text

        text = await NFS.read(p)
        if (text.includes('\ufffd'))
        {
            if (text.slice(0, 33).includes('\x00'))
            {
                return
            }
        }
        return text
    }

    NFS["hfsPath"] = async function (p)
    {
        var escapedPath, hfsPath, osascript, stdout

        escapedPath = p.replace(/"/g,'\\\"')
        osascript = "tell application \\"
        Finder(" to return posix file \\")
        stdout = await this.exec(`/usr/bin/osascript -e \"${osascript}\"`)
        hfsPath = stdout.match(/^file\s(.*)/)
        return _k_.trim(hfsPath[1])
    }

    NFS["trashImmediate"] = function (p)
    {
        var dir, dirs, home

        p = slash.untilde(p)
        home = slash.home()
        dirs = ['/tmp',slash.path(home,'tmp'),slash.path(home,'.local/share/Trash')]
        var list = _k_.list(dirs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dir = list[_a_]
            if (p === dir || p.startsWith(dir + '/'))
            {
                return true
            }
        }
        return false
    }

    NFS["trash"] = async function (p)
    {
        var fileName, hfs, newPath, now, os, shellCommand, stamp, trashDir, trashPath

        if (NFS.trashImmediate(p))
        {
            await NFS.remove(p)
            return p
        }
        os = process.platform
        if (os === 'darwin')
        {
            hfs = await NFS.hfsPath(p)
            shellCommand = `/usr/bin/osascript -l JavaScript -e \"Application('Finder').delete([\"${hfs}\"])\"`
            return this.exec(shellCommand)
        }
        else if (os === 'linux')
        {
            trashPath = slash.path(process.env.HOME,'.local/share/Trash/files')
            fileName = slash.file(p)
            try
            {
                await fsp.mkdir(trashPath,{recursive:true})
                now = new Date(Date.now())
                stamp = [now.getFullYear(),kstr.lpad(now.getMonth() + 1,2,'0'),kstr.lpad(now.getDate(),2,'0'),kstr.lpad(now.getHours(),2,'0'),kstr.lpad(now.getMinutes(),2,'0'),kstr.lpad(now.getSeconds(),2,'0')].join('-')
                trashDir = slash.path(trashPath,`${stamp}-${crypto.randomUUID().slice(0, 8)}`)
                await fsp.mkdir(trashDir)
                newPath = slash.path(trashDir,fileName)
                await fsp.rename(p,newPath)
                return newPath
            }
            catch (err)
            {
                console.error(`Failed to move to trash: ${err}`)
                return null
            }
        }
        else
        {
            console.error(`Trash functionality not supported on ${os}`)
            return null
        }
    }

    NFS["exec"] = async function (cmd)
    {
        return new Promise(function (resolve, reject)
        {
            try
            {
                return child_process.exec(cmd,{},function (err, stdout, stderr)
                {
                    if (err)
                    {
                        return reject(err,stderr)
                    }
                    else
                    {
                        return resolve(stdout)
                    }
                })
            }
            catch (err)
            {
                return reject(err)
            }
        })
    }

    NFS["isWritable"] = async function (p)
    {
        try
        {
            await fsp.access(p,fs.constants.W_OK)
            return true
        }
        catch (err)
        {
            return false
        }
    }

    NFS["isReadable"] = async function (p)
    {
        try
        {
            await fsp.access(p,fs.constants.R_OK)
            return true
        }
        catch (err)
        {
            return false
        }
    }

    return NFS
})()

export default NFS;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmZzLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9uZnMua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNNLFlBQUE7O09BQ0EsV0FBQTs7T0FDRixTQUFBOztPQUNBLG9CQUFBOztPQUVHLElBQUksS0FBSzs7QUFFZixPQUFEOzs7OztJQUNJLEtBQUMsNEJBQVMsS0FBSTs7OztRQUVWLE9BQUEsY0FBQTtRQUNBLElBQUksc0JBQUosSUFBSSwrQkFBYTtRQUNqQixJQUFJLGtCQUFKLElBQUk7UUFDSixJQUFJLHVCQUFKLElBQUk7UUFFSixZQUFPLElBQUksZUFBZTs7O1lBS3RCLGdCQUFXLElBQUksUUFBUSxLQUFJLGNBQWM7O2VBQ3ZDOzt5QkFDUyxJQUFJLE1BQWEsU0FBUyxRQUFROztnQkFBN0MsWUFBSTs7bUJBQ0YsSUFBSTs7NEJBRUk7OztZQUFWO1lBRUEsT0FBVyxPQUFPO1lBQ2xCLFFBQVcsT0FBTztZQUNsQixVQUFXLE1BQU0sS0FBSyxJQUFJO1lBQzFCLFdBQVc7Z0JBRVIsT0FBTzs7Z0JBQ04saUJBQVksSUFBSSxTQUFTO3FCQUNsQixNQUFNLFdBQVc7O29CQUNwQixXQUFXLE1BQU0sS0FBSyxJQUFJOztnQkFFOUIsY0FBUyxLQUFDLE1BQU07O2dCQUVqQjs7MkJBQ2EsTUFBUyxlQUFlOztvQkFBcEM7OzJCQUNZLEtBQVEsSUFBSTs7b0JBQXhCOzsyQkFDWSxTQUFZOztvQkFBeEI7Ozs7OzJCQUVZLE1BQVMsWUFBWTs7b0JBQWpDOzs7WUFJSixJQUFJLE1BQU0sTUFDTixNQUFNLFFBQVEsUUFBUSxRQUN0QixLQUFNLEtBQ04sS0FBTTtnQkFFdUI7O2dCQUFqQyxJQUFJLG1CQUFVLE9BQU87O2dCQUVsQixTQUFVLElBQUk7O3NCQUVYLElBQUksUUFBUSxRQUFROzs7UUFFOUIsSUFBSSxNQUFNLGVBQU0sR0FBRTs7bUJBQU0sRUFBRSxLQUFLLGNBQWMsRUFBRTs7ZUFDL0MsSUFBSTs7O0lBRVIsS0FBQyxTQUFTLElBQUk7SUFDZCxLQUFDLFlB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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/nfs.kode
