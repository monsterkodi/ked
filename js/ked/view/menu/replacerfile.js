var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var replacerfile

import searcherfile from "./searcherfile.js"


replacerfile = (function ()
{
    _k_.extend(replacerfile, searcherfile)
    function replacerfile (screen, name, replacer)
    {
        this.screen = screen
        this.name = name
        this.replacer = replacer
    
        this["toggle"] = this["toggle"].bind(this)
        this["set"] = this["set"].bind(this)
        replacerfile.__super__.constructor.call(this,this.screen,this.name)
        this.excluded = false
        this.marker = '✔'
        this.lineCount = 0
    }

    replacerfile.prototype["set"] = function (file)
    {
        replacerfile.__super__.set.call(this,file)
    
        var _19_20_

        this.excluded = false
        if ((this.replacer != null))
        {
            this.excluded = this.replacer.isExcluded(this.path)
        }
        return this.marker = (this.excluded ? '✘' : '✔')
    }

    replacerfile.prototype["toggle"] = function ()
    {
        var _29_19_

        this.excluded = !this.excluded
        this.marker = (this.excluded ? '✘' : '✔')
        return (this.replacer != null ? this.replacer.onFileToggled(this.path) : undefined)
    }

    return replacerfile
})()

export default replacerfile;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZXJmaWxlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9rb2RlL2tlZC92aWV3L21lbnUvcmVwbGFjZXJmaWxlLmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7T0FDTSxtQkFBQTs7O0FBQ0wsZ0JBQUQ7OzZCQUFjO2FBR1YsY0FBSSxRQUFRLE1BQU07O1FBQWY7UUFBUTtRQUFNOzs7O3FEQUVQLEtBQUMsT0FBTyxLQUFDO1FBRWYsS0FBQyxXQUFZO1FBQ2IsS0FBQyxTQUFZO1FBQ2IsS0FBQyxZQUFZOzs7NEJBRWpCLGtCQUFLOzs2Q0FFSzs7OztRQUVOLEtBQUMsV0FBVzthQUNULEtBQUM7O1lBQ0EsS0FBQyxXQUFXLEtBQUMsU0FBUyxXQUFXLEtBQUM7O2VBRXRDLEtBQUMsVUFBUyxLQUFDLFdBQVcsTUFBTTs7OzRCQUVoQzs7OztRQUVJLEtBQUMsWUFBZSxLQUFDO1FBQ2pCLEtBQUMsVUFBVyxLQUFDLFdBQVcsTUFBTTtnQkFFNUIsS0FBQyxtQkFBRCxLQUFDLFNBQVUsY0FBYyxLQUFDOzs7V0ExQm5DOzs7ZUE0Qk0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/replacerfile.kode
