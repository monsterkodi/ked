var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var NFS

import slash from "./slash.js"

import fs from "fs"

import child_process from "child_process"

import fsp from 'fs/promises'

NFS = (function ()
{
    function NFS ()
    {}

    NFS["listdir"] = async function (dir, opt)
    {
        var absPath, dirent, dirents, file, isDir, resolved, _12_22_, _13_18_, _14_23_

        opt = (opt != null ? opt : {})
        opt.recursive = ((_12_22_=opt.recursive) != null ? _12_22_ : true)
        opt.found = ((_13_18_=opt.found) != null ? _13_18_ : [])
        opt.ignoreDirs = ((_14_23_=opt.ignoreDirs) != null ? _14_23_ : [])
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
        var fileName, hfs, newPath, os, shellCommand, trashPath

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
                newPath = slash.path(trashPath,fileName)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmZzLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9uZnMua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNNLFlBQUE7O09BQ0YsU0FBQTs7T0FDQSxvQkFBQTs7T0FFRyxJQUFJLEtBQUs7O0FBRWYsT0FBRDs7Ozs7SUFDSSxLQUFDLDRCQUFTLEtBQUk7Ozs7UUFFVixPQUFBLGNBQUE7UUFDQSxJQUFJLHNCQUFKLElBQUksK0JBQWE7UUFDakIsSUFBSSxrQkFBSixJQUFJO1FBQ0osSUFBSSx1QkFBSixJQUFJO1FBRUosWUFBTyxJQUFJLGVBQWU7OztZQUt0QixnQkFBVyxJQUFJLFFBQVEsS0FBSSxjQUFjOztlQUN2Qzs7eUJBQ1MsSUFBSSxNQUFhLFNBQVMsUUFBUTs7Z0JBQTdDLFlBQUk7O21CQUNGLElBQUk7OzRCQUVJOzs7WUFBVjtZQUVBLE9BQVcsT0FBTztZQUNsQixRQUFXLE9BQU87WUFDbEIsVUFBVyxNQUFNLEtBQUssSUFBSTtZQUMxQixXQUFXO2dCQUVSLE9BQU87O2dCQUNOLGlCQUFZLElBQUksU0FBUztxQkFDbEIsTUFBTSxXQUFXOztvQkFDcEIsV0FBVyxNQUFNLEtBQUssSUFBSTs7Z0JBRTlCLGNBQVMsS0FBQyxNQUFNOztnQkFFakI7OzJCQUNhLE1BQVMsZUFBZTs7b0JBQXBDOzsyQkFDWSxLQUFRLElBQUk7O29CQUF4Qjs7MkJBQ1ksU0FBWTs7b0JBQXhCOzs7OzsyQkFFWSxNQUFTLFlBQVk7O29CQUFqQzs7O1lBSUosSUFBSSxNQUFNLE1BQ04sTUFBTSxRQUFRLFFBQVEsUUFDdEIsS0FBTSxLQUNOLEtBQU07Z0JBRXVCOztnQkFBakMsSUFBSSxtQkFBVSxPQUFPOztnQkFFbEIsU0FBVSxJQUFJOztzQkFFWCxJQUFJLFFBQVEsUUFBUTs7O1FBRTlCLElBQUksTUFBTSxlQUFNLEdBQUU7O21CQUFNLEVBQUUsS0FBSyxjQUFjLEVBQUU7O2VBQy9DLElBQUk7OztJQUVSLEtBQUMsU0FBUyxJQUFJO0lBQ2QsS0FBQyxZQUFTLElBQUk7SUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/nfs.kode
