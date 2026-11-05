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

    kacher["clear"] = function ()
    {
        return this.cache = Object.create(null)
    }

    return kacher
})()

post.on('file.change',(function (info)
{
    return kacher.invalidate(info.path)
}).bind(this))
export default kacher;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FjaGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC9pbmRleC9rYWNoZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7T0FDVSxVQUFBO0lBQU07SUFBSzs7O0FBRXBCLFVBQUQ7Ozs7O0lBRUksUUFBQyxVQUFPLE9BQU8sT0FBTztJQUV0QixRQUFDLDRCQUFTOzs7O2FBRVksS0FBQyxNQUFNOzttQkFBdkIsS0FBQyxNQUFNOztRQUVULGFBQVEsSUFBSSxTQUFTO2FBRUU7O1lBQXZCLEtBQUMsTUFBTSxRQUFROztlQUVmOzs7SUFFSixRQUFDLHlCQUFZOztzQkFFRixLQUFDLE1BQU07OztJQUVsQixRQUFDOztlQUVHLEtBQUMsUUFBUSxPQUFPLE9BQU87OztXQXBCOUI7OztBQXNCRCxLQUFLLEdBQUcseUJBQWU7O1dBQVMsT0FBTyxXQUFXLEtBQUs7O2VBRWhEIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/index/kacher.kode
