var roots, testdir

import fs from "fs"
import os from "os"

import slash from "./slash.js"

roots = {}

testdir = function (name, base)
{
    base = (base != null ? base : os.tmpdir())
    if (!roots[base])
    {
        fs.mkdirSync(base,{recursive:true})
        roots[base] = fs.mkdtempSync(slash.path(base,'ked-test-'))
    }
    if (name)
    {
        return slash.path(roots[base],name)
    }
    else
    {
        return roots[base]
    }
}

testdir.id = function ()
{
    return slash.file(testdir())
}
process.on('exit',function ()
{
    var base, root

    for (base in roots)
    {
        root = roots[base]
        fs.rmSync(root,{recursive:true,force:true})
    }
})
export default testdir;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGRpci5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9reGsvdGVzdGRpci5rb2RlIl0sIm1hcHBpbmdzIjoiOztPQUNJLFNBQUE7T0FBRyxTQUFBOztPQUNELFlBQUE7O0FBZ0JOOztBQUVBLG9CQUFXLE1BQU07O0lBRWIsUUFBQSxlQUFBLE9BQVEsR0FBRztTQUVKLE1BQU07O1FBQ1QsR0FBRyxVQUFVLE1BQU0sVUFBVTtRQUM3QixNQUFNLFFBQVEsR0FBRyxZQUFZLE1BQU0sS0FBSyxLQUFNOztRQUUvQzs7ZUFBVSxNQUFNLEtBQUssTUFBTSxNQUFPOzs7O2VBQVcsTUFBTTs7OztBQUUxRCxRQUFROztXQUFRLE1BQU0sS0FBSzs7QUFFM0IsUUFBUSxHQUFHOzs7O1NBRUgsUUFBYTs7UUFBUixPQUFRO1FBQ2IsR0FBRyxPQUFPLE1BQU0sVUFBVSxLQUFNLE1BQU07OztlQUV2QyJ9
//# sourceURL=../../kode/kxk/testdir.kode
