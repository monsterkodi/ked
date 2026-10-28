var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var Clip

import slash from "./slash.js"

import fs from "fs"

import child_process from "child_process"


Clip = (function ()
{
    function Clip ()
    {}

    Clip["text"] = ''
    Clip["tool"] = undefined
    Clip["has"] = function (cmd)
    {
        var dir, _25_37_

        if (_k_.empty(cmd))
        {
            return false
        }
        var list = _k_.list((((_25_37_=process.env.PATH) != null ? _25_37_ : '')).split(':'))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dir = list[_a_]
            if (fs.existsSync(slash.path(dir,cmd)))
            {
                return true
            }
        }
        return false
    }

    Clip["detect"] = function ()
    {
        if (!_k_.empty(Clip.tool))
        {
            return Clip.tool
        }
        if (process.env.WAYLAND_DISPLAY && Clip.has('wl-copy') && Clip.has('wl-paste'))
        {
            Clip.tool = 'wl'
        }
        else if (Clip.has('xsel'))
        {
            Clip.tool = 'xsel'
        }
        else if (Clip.has('xclip'))
        {
            Clip.tool = 'xclip'
        }
        else
        {
            Clip.tool = 'none'
        }
        return Clip.tool
    }

    Clip["write"] = function (text)
    {
        var args, cmd, proc, tool

        tool = Clip.detect()
        if (tool === 'wl')
        {
            cmd = 'wl-copy'
            args = []
        }
        else if (tool === 'xsel')
        {
            cmd = 'xsel'
            args = ['-i','--clipboard']
        }
        else if (tool === 'xclip')
        {
            cmd = 'xclip'
            args = ['-selection','clipboard']
        }
        else
        {
            console.error('clip.copy -- no clipboard tool found (tried wl-copy, xsel, xclip)')
            return
        }
        proc = child_process.spawn(cmd,args)
        proc.on('error',function (err)
        {
            console.error(`clip.copy -- ${cmd}: ${err}`)
        })
        proc.stdin.on('error',function (err)
        {
            console.error(`clip.copy -- ${cmd}: ${err}`)
        })
        proc.stdin.write(text)
        return proc.stdin.end()
    }

    Clip["read"] = function ()
    {
        var args, cmd, tool

        tool = Clip.detect()
        if (tool === 'wl')
        {
            cmd = 'wl-paste'
            args = ['--no-newline']
        }
        else if (tool === 'xsel')
        {
            cmd = 'xsel'
            args = ['-o','--clipboard']
        }
        else if (tool === 'xclip')
        {
            cmd = 'xclip'
            args = ['-o','-selection','clipboard']
        }
        else
        {
            console.error('clip.paste -- no clipboard tool found (tried wl-copy, xsel, xclip)')
            return ''
        }
        try
        {
            return child_process.execSync([cmd].concat(args).join(' ')).toString('utf8')
        }
        catch (err)
        {
            if (err.status === null)
            {
                console.error(`clip.paste -- ${cmd}: ${err}`)
            }
            return ''
        }
    }

    Clip["copy"] = function (text)
    {
        if (_k_.empty(text))
        {
            return
        }
        Clip.text = text
        return Clip.write(text)
    }

    Clip["paste"] = function ()
    {
        var text

        text = Clip.read()
        if (!_k_.empty(text))
        {
            return text
        }
        return Clip.text
    }

    return Clip
})()

export default Clip;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvY2xpcC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BVU0sWUFBQTs7T0FDRixTQUFBOztPQUNBLG9CQUFBOzs7QUFFSyxRQUFUOzs7OztJQUVJLE1BQUMsU0FBTTtJQUNQLE1BQUMsU0FBTTtJQUVQLE1BQUMsa0JBQUs7Ozs7c0JBR2U7O21CQUFmOzt1Q0FFVSxRQUFRLElBQUksMEJBQU8sS0FBSSxNQUFNOzs7WUFBckM7Z0JBQ1UsR0FBRyxXQUFXLE1BQU0sS0FBSyxJQUFLOzt1QkFBdEM7OztlQUVOOzs7SUFRSixNQUFDOzt1QkFFd0IsS0FBSzs7bUJBQXhCLEtBQUs7O1lBSUosUUFBUSxJQUFJLG1CQUFvQixLQUFLLElBQUksY0FBZSxLQUFLLElBQUk7O1lBQ2hFLEtBQUssT0FBTzs7aUJBQ1IsS0FBSyxJQUFJOztZQUNiLEtBQUssT0FBTzs7aUJBQ1IsS0FBSyxJQUFJOztZQUNiLEtBQUssT0FBTzs7OztZQUVaLEtBQUssT0FBTzs7ZUFFaEIsS0FBSzs7O0lBUVQsTUFBQyxvQkFBTzs7OztRQUVKLE9BQU8sS0FBSztZQUVULFNBQVE7O1lBQ1AsTUFBTTtZQUNOOztpQkFDSSxTQUFROztZQUNaLE1BQU07WUFDTixRQUFRLEtBQUs7O2lCQUNULFNBQVE7O1lBQ1osTUFBTTtZQUNOLFFBQVEsYUFBYTs7OztZQUVyQixjQUFNOzs7UUFJVixPQUFPLGNBQWMsTUFBTSxJQUFJO1FBRy9CLEtBQUssR0FBRyxrQkFBUzs7WUFBUSw4QkFBc0IsUUFBUTs7UUFFdkQsS0FBSyxNQUFNLEdBQUcsa0JBQVM7O1lBQVEsOEJBQXNCLFFBQVE7O1FBRTdELEtBQUssTUFBTSxNQUFNO2VBQ2pCLEtBQUssTUFBTTs7O0lBUWYsTUFBQzs7OztRQUVHLE9BQU8sS0FBSztZQUVULFNBQVE7O1lBQ1AsTUFBTTtZQUNOLFFBQVE7O2lCQUNKLFNBQVE7O1lBQ1osTUFBTTtZQUNOLFFBQVEsS0FBSzs7aUJBQ1QsU0FBUTs7WUFDWixNQUFNO1lBQ04sUUFBUSxLQUFLLGFBQWE7Ozs7WUFFMUIsY0FBTTttQkFDSjs7OzttQkFLRixjQUFjLFVBQVUsS0FBSyxPQUFPLE1BQU0sS0FBSyxNQUFNLFNBQVM7O2VBQzVEOztnQkFHc0MsSUFBSSxXQUFVOztnQkFBdEQsK0JBQXVCLFFBQVE7O21CQUMvQjs7OztJQVFSLE1BQUMsbUJBQU07O3NCQUdROzs7O1FBRVgsS0FBSyxPQUFPO2VBRVosS0FBSyxNQUFNOzs7SUFFZixNQUFDOzs7O1FBSUcsT0FBTyxLQUFLO3VCQUlJOzttQkFBZDs7ZUFFRixLQUFLOzs7V0FsSUo7OztlQW9JRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/clip.kode
