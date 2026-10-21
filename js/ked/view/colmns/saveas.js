var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var saveas

import kxk from "../../../kxk.js"
let slash = kxk.slash
let post = kxk.post

import browse from "./browse.js"


saveas = (function ()
{
    _k_.extend(saveas, browse)
    function saveas (screen)
    {
        this.screen = screen
    
        this["onChoicesAction"] = this["onChoicesAction"].bind(this)
        this["showDialog"] = this["showDialog"].bind(this)
        saveas.__super__.constructor.call(this,this.screen,'saveas')
    }

    saveas.prototype["showDialog"] = function (dir, file)
    {
        console.log("saveas.showDialog",dir,file)
        return this.gotoDir(dir,slash.path(dir,file))
    }

    saveas.prototype["onChoicesAction"] = function (action, choice)
    {
        console.log('--- onChoicesAction',action,choice,this.currentDir)
        switch (action)
        {
            case 'right':
            case 'space':
                if ((choice != null ? choice.path : undefined) && choice.type === 'file')
                {
                    console.log("SETSAVENAME",choice.path)
                    return
                }
                break
            case 'return':
                if ((choice != null ? choice.path : undefined) && choice.type === 'file')
                {
                    console.log("RETURN",choice)
                    return
                }
                break
        }

        return saveas.__super__.onChoicesAction.call(this,action,choice)
    }

    return saveas
})()

export default saveas;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWFzLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L2NvbG1ucy9zYXZlYXMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozt1QkFhd0I7Ozs7Ozs7K0NBSVYsS0FBQyxPQUFPOzs7OztRQUlkLFlBQUksb0JBQW9CLElBQUk7ZUFFNUIsS0FBQyxRQUFRLElBQUksTUFBTSxLQUFLLElBQUk7Ozs7O1FBSTVCLFlBQUksc0JBQXNCLE9BQU8sT0FBTyxLQUFDO2dCQUVsQzs7aUJBRUg7aUJBQ0E7cUJBRU8saUJBQUEsT0FBUSxxQkFBUyxPQUFPLFNBQVE7O29CQUMvQixZQUFJLGNBQWMsT0FBTzs7OztpQkFHakM7cUJBQ08saUJBQUEsT0FBUSxxQkFBUyxPQUFPLFNBQVE7O29CQUMvQixZQUFJLFNBQVM7Ozs7OzswREFHbkIsT0FBTzs7Ozs7O2VBRWQifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/saveas.kode
