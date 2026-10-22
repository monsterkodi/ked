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
        console.log("clip.write",cmd,args)
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
        console.log("clip.read",cmd,args)
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

        console.log("PASTE")
        text = Clip.read()
        console.log("PASTE",text)
        if (!_k_.empty(text))
        {
            return text
        }
        return Clip.text
    }

    return Clip
})()

export default Clip;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvY2xpcC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQWNTLFFBQVQ7Ozs7O21CQUVXO21CQUNBO1VBRVAsa0JBQU07Ozs7c0JBR2U7O21CQUFmOzt1Q0FFVSxRQUFRLElBQUksMEJBQU8sS0FBSSxNQUFNOzs7WUFBckM7Z0JBQ1UsR0FBRyxXQUFXLE1BQU0sS0FBSyxJQUFLOzt1QkFBdEM7OztlQUVOOzs7VUFRSjs7dUJBRXlCLEtBQUs7O21CQUF4QixLQUFLOztZQUlKLFFBQVEsSUFBSSxtQkFBb0IsS0FBSyxJQUFJLGNBQWUsS0FBSyxJQUFJOztZQUNoRSxLQUFLLE9BQU87O2lCQUNSLEtBQUssSUFBSTs7WUFDYixLQUFLLE9BQU87O2lCQUNSLEtBQUssSUFBSTs7WUFDYixLQUFLLE9BQU87Ozs7WUFFWixLQUFLLE9BQU87O2VBRWhCLEtBQUs7OztVQVFULG9CQUFROzs7O1FBRUosT0FBTyxLQUFLO1lBRVQsU0FBUTs7WUFDUCxNQUFNO1lBQ047O2lCQUNJLFNBQVE7O1lBQ1osTUFBTTtZQUNOLFFBQVEsS0FBSzs7aUJBQ1QsU0FBUTs7WUFDWixNQUFNO1lBQ04sUUFBUSxhQUFhOzs7O1lBRXJCLGNBQU07OztRQUdWLFlBQUksYUFBYSxJQUFJO1FBQ3JCLE9BQU8sY0FBYyxNQUFNLElBQUk7UUFHL0IsS0FBSyxHQUFHLGtCQUFTOztZQUFRLDhCQUFzQixRQUFROztRQUV2RCxLQUFLLE1BQU0sR0FBRyxrQkFBUzs7WUFBUSw4QkFBc0IsUUFBUTs7UUFFN0QsS0FBSyxNQUFNLE1BQU07ZUFDakIsS0FBSyxNQUFNOzs7VUFRZjs7OztRQUVJLE9BQU8sS0FBSztZQUVULFNBQVE7O1lBQ1AsTUFBTTtZQUNOLFFBQVE7O2lCQUNKLFNBQVE7O1lBQ1osTUFBTTtZQUNOLFFBQVEsS0FBSzs7aUJBQ1QsU0FBUTs7WUFDWixNQUFNO1lBQ04sUUFBUSxLQUFLLGFBQWE7Ozs7WUFFMUIsY0FBTTttQkFDSjs7UUFFTixZQUFJLFlBQVksSUFBSTs7O21CQUdoQixjQUFjLFVBQVUsS0FBSyxPQUFPLE1BQU0sS0FBSyxNQUFNLFNBQVM7O2VBQzVEOztnQkFHc0MsSUFBSSxXQUFVOztnQkFBdEQsK0JBQXVCLFFBQVE7O21CQUMvQjs7OztVQVFSLG1CQUFPOztzQkFHUTs7OztRQUVYLEtBQUssT0FBTztlQUVaLEtBQUssTUFBTTs7O1VBRWY7Ozs7UUFFSSxZQUFJO1FBRUosT0FBTyxLQUFLO1FBRVosWUFBSSxRQUFRO3VCQUVJOzttQkFBZDs7ZUFFRixLQUFLOzs7V0FsSUo7OztlQW9JRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/clip.kode
