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
        dirents = await fsp.readdir(dir,{withFileTypes:true})
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmZzLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9uZnMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7T0FZTyxJQUFJLEtBQUs7Ozs7Ozs7UUFZUixPQUFBLGNBQUE7UUFDQSxJQUFJLHNCQUFKLElBQUksK0JBQWE7UUFDakIsSUFBSSxrQkFBSixJQUFJO1FBQ0osSUFBSSx1QkFBSixJQUFJO1FBRUosWUFBTyxJQUFJLGVBQWU7UUFJMUIsZ0JBQVcsSUFBSSxRQUFRLEtBQUksY0FBYzs0QkFFM0I7Ozs7WUFFVixPQUFXLE9BQU87WUFDbEIsUUFBVyxPQUFPO1lBQ2xCLFVBQVcsTUFBTSxLQUFLLElBQUk7WUFDMUIsV0FBVztnQkFFUixPQUFPOztnQkFDTixpQkFBWSxJQUFJLFNBQVM7cUJBQ2xCLE1BQU0sV0FBVzs7b0JBQ3BCLFdBQVcsTUFBTSxLQUFLLElBQUk7O2dCQUU5QixjQUFTLEtBQUMsTUFBTTs7Z0JBRWpCOzsyQkFDYSxNQUFTLGVBQWU7O29CQUFwQzs7MkJBQ1ksS0FBUSxJQUFJOztvQkFBeEI7OzJCQUNZLFNBQVk7O29CQUF4Qjs7Ozs7MkJBRVksTUFBUyxZQUFZOztvQkFBakM7OztZQUlKLElBQUksTUFBTSxNQUNOLE1BQU0sUUFBUSxRQUFRLFFBQ3RCLEtBQU0sS0FDTixLQUFNO2dCQUV1Qjs7Z0JBQWpDLElBQUksbUJBQVUsT0FBTzs7Z0JBRWxCLFNBQVUsSUFBSTs7c0JBRVgsSUFBSSxRQUFRLFFBQVE7OztRQUU5QixJQUFJLE1BQU07O21CQUFjLEVBQUUsS0FBSyxjQUFjLEVBQUU7O2VBQy9DLElBQUk7OztrQkFFRSxJQUFJOztxQkFDSixJQUFJOzs7Ozs7d0JBSUg7O1lBQ0gsb0RBQTRDO21CQUN6Qzs7UUFFUCxhQUFRLElBQUksTUFBTTtZQUNmLEtBQUs7O1lBQ0osVUFBSyxJQUFJLFNBQVM7aUJBQ1gsTUFBTSxXQUFXOztnQkFDcEIsSUFBSSxNQUFNLEtBQUssTUFBTSxJQUFJLEdBQUc7O21CQUM3Qjs7ZUFDUDs7Ozs7Ozt5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
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/nfs.kode
