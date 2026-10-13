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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvY2xpcC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O21CQWdCVzttQkFDQTs7Ozs7c0JBS2M7O21CQUFmOzt1Q0FFVSxRQUFRLElBQUksMEJBQU8sS0FBSSxNQUFNOzs7O2dCQUMzQixHQUFHLFdBQVcsTUFBTSxLQUFLLElBQUs7O3VCQUF0Qzs7O2VBRU47Ozs7O3VCQVVxQixLQUFLOzttQkFBeEIsS0FBSzs7WUFJSixRQUFRLElBQUksbUJBQW9CLEtBQUssSUFBSSxjQUFlLEtBQUssSUFBSTs7WUFDaEUsS0FBSyxPQUFPOztpQkFDUixLQUFLLElBQUk7O1lBQ2IsS0FBSyxPQUFPOztpQkFDUixLQUFLLElBQUk7O1lBQ2IsS0FBSyxPQUFPOzs7O1lBRVosS0FBSyxPQUFPOztlQUVoQixLQUFLOzs7Ozs7O1FBVUwsT0FBTyxLQUFLO1lBRVQsU0FBUTs7WUFDUCxNQUFNO1lBQ047O2lCQUNJLFNBQVE7O1lBQ1osTUFBTTtZQUNOLFFBQVEsS0FBSzs7aUJBQ1QsU0FBUTs7WUFDWixNQUFNO1lBQ04sUUFBUSxhQUFhOzs7O1lBRXJCLGNBQU07OztRQUdWLFlBQUksYUFBYSxJQUFJO1FBQ3JCLE9BQU8sY0FBYyxNQUFNLElBQUk7UUFHL0IsS0FBSyxHQUFHOztZQUFpQiw4QkFBc0IsUUFBUTs7UUFFdkQsS0FBSyxNQUFNLEdBQUc7O1lBQWlCLDhCQUFzQixRQUFROztRQUU3RCxLQUFLLE1BQU0sTUFBTTtlQUNqQixLQUFLLE1BQU07Ozs7Ozs7UUFVWCxPQUFPLEtBQUs7WUFFVCxTQUFROztZQUNQLE1BQU07WUFDTixRQUFROztpQkFDSixTQUFROztZQUNaLE1BQU07WUFDTixRQUFRLEtBQUs7O2lCQUNULFNBQVE7O1lBQ1osTUFBTTtZQUNOLFFBQVEsS0FBSyxhQUFhOzs7O1lBRTFCLGNBQU07bUJBQ0o7O1FBRU4sWUFBSSxZQUFZLElBQUk7OzttQkFHaEIsY0FBYyxVQUFVLEtBQUssT0FBTyxNQUFNLEtBQUssTUFBTSxTQUFTOztlQUM1RDs7Z0JBR3NDLElBQUksV0FBVTs7Z0JBQXRELCtCQUF1QixRQUFROzttQkFDL0I7Ozs7OztzQkFXTzs7OztRQUVYLEtBQUssT0FBTztlQUVaLEtBQUssTUFBTTs7Ozs7OztRQUlYLFlBQUk7UUFFSixPQUFPLEtBQUs7UUFFWixZQUFJLFFBQVE7dUJBRUk7O21CQUFkOztlQUVGLEtBQUs7Ozs7OztlQUVOIn0=
//# sourceURL=file://kode/kxk/clip.kode
