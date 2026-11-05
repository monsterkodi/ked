var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var replacer

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg
let slash = kxk.slash

import belt from "../../edit/tool/belt.js"

import prjcts from "../../index/prjcts.js"
import kacher from "../../index/kacher.js"

import view from "../base/view.js"

import finder from "./finder.js"
import searcher from "./searcher.js"


replacer = (function ()
{
    _k_.extend(replacer, searcher)
    function replacer (screen, editor, name = 'replacer')
    {
        this.screen = screen
        this.editor = editor
    
        this["onFileLoaded"] = this["onFileLoaded"].bind(this)
        replacer.__super__.constructor.call(this,this.screen,this.editor,name)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2tvZGUva2VkL3ZpZXcvbWVudS9yZXBsYWNlci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFTO0lBQUs7SUFBSzs7T0FDVixXQUFQOztPQUNPLGFBQVg7T0FBa0IsYUFBbEI7O09BQ1csV0FBZjs7T0FDZSxhQUFBO09BQU8sZUFBQTs7O0FBQzVCLFlBQUQ7O3lCQUFVO2FBR04sVUFBSSxRQUFRLFFBQU8sT0FBSzs7UUFBckI7UUFBUTs7O2lEQUVELEtBQUMsT0FBTyxLQUFDLE9BQU87WUFFbkIsS0FBQyxTQUFROztZQUNSLEtBQUssR0FBRyxnQkFBZ0IsS0FBQztZQUN6QixLQUFLLEdBQUcsY0FBZ0IsS0FBQzs7UUFFN0IsS0FBQztRQUNELEtBQUMsV0FBVzs7O3dCQUVoQiwyQkFBYzs7WUFFTCxLQUFDOzs7O2VBRU4sS0FBQzs7O1dBbEJSOzs7ZUE2Qk0ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/menu/replacer.kode
