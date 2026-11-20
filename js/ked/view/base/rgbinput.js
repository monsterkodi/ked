var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var rgbinput

import kxk from "../../../kxk.js"
let post = kxk.post

import theme from "../../theme/theme.js"

import input from "./input.js"


rgbinput = (function ()
{
    _k_.extend(rgbinput, input)
    function rgbinput (screen, name)
    {
        this.screen = screen
        this.name = name
    
        this["onKey"] = this["onKey"].bind(this)
        rgbinput.__super__.constructor.call(this,this.screen,this.name,{number:true,min:0,max:255})
        this.drawUnfocusedCursors = false
        this.setColor('bg',theme.colorpicker.bg)
        this.setColor('bg_blur',theme.colorpicker.bg)
        this.setColor('bg_focus',theme.selection.line)
        this.setColor('empty',theme.colorpicker.bg)
        this.textColor = theme.colorpicker.fg
        this.value = 0
        this.set('0')
        this.state.skipAdjustViewForMainCursor = true
        this.pointerType = 'text'
    }

    rgbinput.prototype["draw"] = function ()
    {
        rgbinput.__super__.draw.call(this)
    
        var ch, x

        if (this.hidden() || this.collapsed())
        {
            return
        }
        var list = _k_.list(this.current())
        for (x = 0; x < list.length; x++)
        {
            ch = list[x]
            this.cells.set_fg(x,0,this.textColor)
        }
    }

    rgbinput.prototype["onKey"] = function (key, event)
    {
        if (!this.hasFocus())
        {
            return false
        }
        if (this.hidden() || this.collapsed())
        {
            return false
        }
        switch (event.combo)
        {
            case 'cmd+a':
            case 'cmd+left':
            case 'cmd+right':
            case 'shift+left':
            case 'shift+right':
            case 'left':
            case 'right':
            case 'delete':
            case 'backspace':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
                return rgbinput.__super__.onKey.call(this,key,event)

        }

        return false
    }

    return rgbinput
})()

export default rgbinput;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmdiaW5wdXQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvYmFzZS9yZ2JpbnB1dC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNOztPQUNBLFlBQVQ7O09BQ1MsWUFBQTs7O0FBRWxCLFlBQUQ7O3lCQUFVO2FBR04sVUFBSSxRQUFROztRQUFUO1FBQVE7OztpREFFRCxLQUFDLE9BQU8sS0FBQyxNQUFLLE9BQU8sS0FBSyxJQUFJLEVBQUUsSUFBSTtRQUUxQyxLQUFDLHVCQUF1QjtRQUV4QixLQUFDLFNBQVMsS0FBVyxNQUFNLFlBQVk7UUFDdkMsS0FBQyxTQUFTLFVBQVcsTUFBTSxZQUFZO1FBQ3ZDLEtBQUMsU0FBUyxXQUFXLE1BQU0sVUFBVTtRQUNyQyxLQUFDLFNBQVMsUUFBVyxNQUFNLFlBQVk7UUFFdkMsS0FBQyxZQUFZLE1BQU0sWUFBWTtRQUMvQixLQUFDLFFBQVk7UUFDYixLQUFDLElBQUk7UUFFTCxLQUFDLE1BQU0sOEJBQThCO1FBRXJDLEtBQUMsY0FBaUI7Ozt3QkFFdEI7Ozs7OztZQUlTLEtBQUMsWUFBWSxLQUFDOzs7OzRCQUVOLEtBQUM7YUFBTjs7WUFBSjtZQUNBLEtBQUMsTUFBTSxPQUFPLEVBQUUsRUFBRSxLQUFDOzs7O3dCQUUzQixvQkFBTyxLQUFJOzthQUVRLEtBQUM7O21CQUFkOztZQUNTLEtBQUMsWUFBWSxLQUFDOzttQkFBdkI7O2dCQUVLLE1BQU07O2lCQUNUO2lCQUFRO2lCQUFXO2lCQUFZO2lCQUFhO2lCQUM1QztpQkFBTztpQkFBUTtpQkFBUztpQkFDeEI7aUJBQUc7aUJBQUc7aUJBQUc7aUJBQUc7aUJBQUc7aUJBQUc7aUJBQUc7aUJBQUc7aUJBQUc7MERBQ2YsSUFBSTs7OztlQUNwQjs7O1dBekNQOzs7ZUEyQ00ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/base/rgbinput.kode
