var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

import slash from "./slash.js"

import fs from "fs"

import child_process from "child_process"

import fsp from 'fs/promises'
class NFS
{
    static async listdir (dir, opt)
    {
        var absPath, dirent, dirents, file, isDir, resolved, _26_22_, _27_18_, _28_23_

        opt = (opt != null ? opt : {})
        opt.recursive = ((_26_22_=opt.recursive) != null ? _26_22_ : true)
        opt.found = ((_27_18_=opt.found) != null ? _27_18_ : [])
        opt.ignoreDirs = ((_28_23_=opt.ignoreDirs) != null ? _28_23_ : [])
        dir = await NFS.resolveSymlink(dir)
        try
        {
            dirents = await fsp.readdir(dir,{withFileTypes:true})
        }
        catch (err)
        {
            console.log(err)
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

    static list = NFS.listdir

    static dirlist = NFS.listdir

    static async resolveSymlink (p)
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

    static async read (p)
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

    static async mode (p)
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

    static async write (p, text)
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

    static async info (p)
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

    static async mkdir (p)
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

    static async exists (p)
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

    static async type (p)
    {
        var stat

        if (stat = await NFS.exists(p))
        {
            return (stat.isFile() ? 'file' : 'dir')
        }
    }

    static async fileExists (p)
    {
        var stat

        stat = await NFS.exists(p)
        if ((stat != null ? stat.isFile() : undefined))
        {
            return stat
        }
    }

    static async isFile (p)
    {
        return NFS.fileExists(p)
    }

    static async dirExists (p)
    {
        var stat

        stat = await NFS.exists(p)
        if ((stat != null ? stat.isDirectory() : undefined))
        {
            return stat
        }
    }

    static async isDir (p)
    {
        return NFS.dirExists(p)
    }

    static async remove (p)
    {
        return await fsp.rm(p,{force:true,recursive:true})
    }

    static async copy (from, to)
    {
        if (await NFS.isDir(to))
        {
            to = slash.path(to,slash.file(from))
        }
        return await fsp.cp(from,to,{recursive:true})
    }

    static async move (from, to)
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

    static async git (p)
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

    static async pkg (p)
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

    static async prj (p)
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

    static async readText (p)
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

    static async hfsPath (p)
    {
        var escapedPath, hfsPath, osascript, stdout

        escapedPath = p.replace(/"/g,'\\\"')
        osascript = "tell application \\"
        Finder(" to return posix file \\")
        stdout = await this.exec(`/usr/bin/osascript -e \"${osascript}\"`)
        hfsPath = stdout.match(/^file\s(.*)/)
        return _k_.trim(hfsPath[1])
    }

    static async trash (p)
    {
        var fileName, hfs, newPath, os, shellCommand, trashPath

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

    static async exec (cmd)
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

    static async isWritable (p)
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

    static async isReadable (p)
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
}

export default NFS;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmZzLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9uZnMua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FRTSxZQUFBOztPQUNGLFNBQUE7O09BQ0Esb0JBQUE7O09BRUcsSUFBSSxLQUFLO0FBRWhCLE1BQU07O0lBUUYsYUFBQyxTQUFTLEtBQUk7Ozs7UUFFVixPQUFBLGNBQUE7UUFDQSxJQUFJLHNCQUFKLElBQUksK0JBQWE7UUFDakIsSUFBSSxrQkFBSixJQUFJO1FBQ0osSUFBSSx1QkFBSixJQUFJO1FBRUosWUFBTyxJQUFJLGVBQWU7OztZQUt0QixnQkFBVyxJQUFJLFFBQVEsS0FBSSxjQUFjOztlQUN2Qzs7WUFDRixZQUFJO21CQUNGLElBQUk7OzRCQUVJOzs7WUFBVjtZQUVBLE9BQVcsT0FBTztZQUNsQixRQUFXLE9BQU87WUFDbEIsVUFBVyxNQUFNLEtBQUssSUFBSTtZQUMxQixXQUFXO2dCQUVSLE9BQU87O2dCQUNOLGlCQUFZLElBQUksU0FBUztxQkFDbEIsTUFBTSxXQUFXOztvQkFDcEIsV0FBVyxNQUFNLEtBQUssSUFBSTs7Z0JBRTlCLGNBQVMsS0FBQyxNQUFNOztnQkFFakI7OzJCQUNhLE1BQVMsZUFBZTs7b0JBQXBDOzsyQkFDWSxLQUFRLElBQUk7O29CQUF4Qjs7MkJBQ1ksU0FBWTs7b0JBQXhCOzs7OzsyQkFFWSxNQUFTLFlBQVk7O29CQUFqQzs7O1lBSUosSUFBSSxNQUFNLE1BQ04sTUFBTSxRQUFRLFFBQVEsUUFDdEIsS0FBTSxLQUNOLEtBQU07Z0JBRXVCOztnQkFBakMsSUFBSSxtQkFBVSxPQUFPOztnQkFFbEIsU0FBVSxJQUFJOztzQkFFWCxJQUFJLFFBQVEsUUFBUTs7O1FBRTlCLElBQUksTUFBTSxlQUFNLEdBQUU7O21CQUFNLEVBQUUsS0FBSyxjQUFjLEVBQUU7O2VBQy9DLElBQUk7OztJQUVSLE9BQUMsT0FBUyxJQUFJOztJQUNkLE9BQUMsVUFBUyxJQUFJOztJQUVkLGFBQUMsZ0JBQWdCOzs7O2NBRUQsVUFBTDs7WUFDSCxv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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/nfs.kode
