var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var kacher

import kxk from "../../kxk.js"
let post = kxk.post
let nfs = kxk.nfs


kacher = (function ()
{
    function kacher ()
    {}

    kacher["cache"] = Object.create(null)
    kacher["getText"] = async function (file)
    {
        var text

        if ((this.cache[file] != null))
        {
            return this.cache[file]
        }
        text = await nfs.readText(file)
        if ((text != null))
        {
            this.cache[file] = text
        }
        return text
    }

    kacher["invalidate"] = function (file)
    {
        return delete this.cache[file]
    }

    kacher["invalidatePath"] = function (path)
    {
        var file, prefix

        this.invalidate(path)
        prefix = path + '/'
        var list = _k_.list(Object.keys(this.cache))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
            if (file.startsWith(prefix))
            {
                delete this.cache[file]
            }
        }
    }

    kacher["clear"] = function ()
    {
        return this.cache = Object.create(null)
    }

    return kacher
})()

post.on('file.change',(function (info)
{
    var _45_27_

    switch (info.change)
    {
        case 'create':
        case 'modify':
            return kacher.invalidate(info.path)

        case 'delete':
            return kacher.invalidatePath(info.path)

        case 'rename':
            if ((info.oldPath != null))
            {
                kacher.invalidatePath(info.oldPath)
            }
            return kacher.invalidatePath(info.path)

    }

}).bind(this))
export default kacher;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FjaGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9rYWNoZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBTTtJQUFLOzs7QUFFcEIsVUFBRDs7Ozs7SUFFSSxRQUFDLFVBQU8sT0FBTyxPQUFPO0lBRXRCLFFBQUMsNEJBQVM7Ozs7YUFFWSxLQUFDLE1BQU07O21CQUF2QixLQUFDLE1BQU07O1FBRVQsYUFBUSxJQUFJLFNBQVM7YUFFRTs7WUFBdkIsS0FBQyxNQUFNLFFBQVE7O2VBRWY7OztJQUVKLFFBQUMseUJBQVk7O3NCQUVGLEtBQUMsTUFBTTs7O0lBRWxCLFFBQUMsNkJBQWdCOzs7O1FBRWIsS0FBQyxXQUFXO1FBRVosU0FBUyxPQUFPOzRCQUVKLE9BQU8sS0FBSyxLQUFDOzs7WUFBckI7Z0JBQ0csS0FBSyxXQUFXOzt1QkFDUixLQUFDLE1BQU07Ozs7O0lBRTFCLFFBQUM7O2VBRUcsS0FBQyxRQUFRLE9BQU8sT0FBTzs7O1dBOUI5Qjs7O0FBZ0NELEtBQUssR0FBRyx5QkFBZTs7OztZQUVaLEtBQUs7O2FBQ1I7YUFDQTttQkFDSSxPQUFPLFdBQVcsS0FBSzs7YUFDM0I7bUJBQ0ksT0FBTyxlQUFlLEtBQUs7O2FBQy9CO2lCQUNPLEtBQUs7O2dCQUNKLE9BQU8sZUFBZSxLQUFLOzttQkFDL0IsT0FBTyxlQUFlLEtBQUs7Ozs7O2VBRWhDIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/kacher.kode
