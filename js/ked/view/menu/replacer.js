var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var replacer

import kxk from "../../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import searcher from "./searcher.js"


replacer = (function ()
{
    _k_.extend(replacer, searcher)
    function replacer (screen, editor, name = 'replacer')
    {
        this.screen = screen
        this.editor = editor
        this.name = name
    
        this["onFileLoaded"] = this["onFileLoaded"].bind(this)
        replacer.__super__.constructor.call(this,this.screen,this.editor,this.name)
        if (this.name === 'replacer')
        {
            post.on('replacer.show',this.show)
            post.on('file.loaded',this.onFileLoaded)
        }
        this.sfils = []
        this.searchId = 0
    }

    replacer.prototype["onFileLoaded"] = function (file)
    {
        if (this.hidden())
        {
            return
        }
        return this.hide()
    }

    return replacer
})()

export default replacer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9yZXBsYWNlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNO0lBQUs7O09BQ0wsZUFBQTs7O0FBQ2xCLFlBQUQ7O3lCQUFVO2FBR04sVUFBSSxRQUFRLFFBQVE7O1FBQWpCO1FBQVE7UUFBUTs7O2lEQUVULEtBQUMsT0FBTyxLQUFDLE9BQU8sS0FBQztZQUVwQixLQUFDLFNBQVE7O1lBQ1IsS0FBSyxHQUFHLGdCQUFnQixLQUFDO1lBQ3pCLEtBQUssR0FBRyxjQUFnQixLQUFDOztRQUU3QixLQUFDO1FBQ0QsS0FBQyxXQUFXOzs7d0JBRWhCLDJCQUFjOztZQUVMLEtBQUM7Ozs7ZUFFTixLQUFDOzs7V0FsQlI7OztlQTZCTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/replacer.kode
