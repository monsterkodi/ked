var toExport = {}
var baseFile, childFile, e, emitted, f, file, h, idx, originalEmit, root, supr

import fs from "fs"

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import indexer from "../index/indexer.js"

import funtree from "../view/colmns/funtree.js"

toExport["funtree base class items"] = async function ()
{
    await section("shows methods of the base class chain", async function ()
    {
        root = '/tmp/opencode/ked-funtree-base'
        baseFile = slash.path(root,'base.kode')
        childFile = slash.path(root,'child.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(baseFile,`■Base□Root
    alpha: -> 1
    beta: => 2
■Root
    gamma: -> 3`)
        fs.writeFileSync(childFile,"■Child□Base\n")
        idx = new indexer
        await idx.index(baseFile)
        await idx.index(childFile)
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_funtree_editor',[])
        e.currentFile = childFile
        f = new funtree(e,'test_funtree',[])
        f.onFileIndexed(childFile,idx.files[childFile])
        fs.rmSync(root,{recursive:true,force:true})
        compare(f.items.map(function (i)
        {
            return i.name
        }),[' ■ Child',' ■ Base','   -> alpha','   => beta',' ■ Root','   -> gamma'])
        compare(f.items[1].inherited,true)
        compare(f.items[1].file,baseFile)
        compare(f.items[1].line,1)
        compare(f.items[2].inherited,true)
        compare(f.items[2].file,baseFile)
        compare(f.items[2].line,2)
        compare(f.items[2].class,'Base')
        f.selectItemForLineIndex(3)
        compare(f.currentIndex(),0)
        compare(f.lineIndexOfNextFunc(),undefined)
        supr = {clss:true,name:' ■ Child',line:1}
        compare(f.itemsForBaseClass(supr).length,0)
    })
    await section("jumps to inherited items in their file", async function ()
    {
        root = '/tmp/opencode/ked-funtree-jump'
        baseFile = slash.path(root,'base.kode')
        childFile = slash.path(root,'child.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(baseFile,`■Base
    alpha: -> 1`)
        fs.writeFileSync(childFile,"■Child□Base\n")
        idx = new indexer
        await idx.index(baseFile)
        await idx.index(childFile)
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_funtree_jump_editor',[])
        e.currentFile = childFile
        f = new funtree(e,'test_funtree_jump',[])
        f.onFileIndexed(childFile,idx.files[childFile])
        fs.rmSync(root,{recursive:true,force:true})
        emitted = []
        originalEmit = post.emit
        post.emit = function (event, ...args)
        {
            return emitted.push([event].concat(args))
        }
        f.emitAction('return',f.items[0])
        f.emitAction('return',f.items[2])
        post.emit = originalEmit
        compare(emitted[0],['goto.line',0,'ind','topDelta'])
        compare(emitted[1],['focus','editor'])
        compare(emitted[2],['file.open',baseFile,1,'ind','topDelta'])
        compare(emitted[3],['focus','editor'])
    })
    await section("a file without classes has no inherited items", async function ()
    {
        root = '/tmp/opencode/ked-funtree-noclass'
        file = slash.path(root,'funcs.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,"alpha: -> 1\n")
        idx = new indexer
        await idx.index(file)
        h = new harness({cols:100,rows:30})
        e = new editor(h.screen,'test_funtree_noclass_editor',[])
        e.currentFile = file
        f = new funtree(e,'test_funtree_noclass',[])
        f.onFileIndexed(file,idx.files[file])
        fs.rmSync(root,{recursive:true,force:true})
        compare(f.items.length,1)
        compare(f.items[0].name,' -> alpha')
    })
}
toExport["funtree base class items"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVudHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9mdW50cmVlLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUNJLFNBQUE7O09BQ00sVUFBQTtJQUFTO0lBQUs7O09BQ0wsYUFBWjs7T0FDWSxjQUFaOztPQUNZLGNBQVo7O09BQ2MsY0FBVDs7Ozs7O1FBTUosT0FBTztRQUNQLFdBQVcsTUFBTSxLQUFLLEtBQUs7UUFDM0IsWUFBWSxNQUFNLEtBQUssS0FBSztRQUU1QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsY0FBYyxTQUFTOzs7OztRQU8xQixHQUFHLGNBQWMsVUFBVTtRQUUzQixVQUFVO2NBQ1IsSUFBSSxNQUFNO2NBQ1YsSUFBSSxNQUFNO1FBRVosUUFBUSxTQUFRLEtBQUssSUFBSSxLQUFLO1FBQzlCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsRUFBRSxjQUFjO1FBRWhCLFFBQVEsUUFBUSxFQUFFO1FBRWxCLEVBQUUsY0FBYyxVQUFVLElBQUksTUFBTTtRQUVwQyxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtnQkFFcEMsRUFBRSxNQUFNLGNBQUs7O21CQUFNLEVBQUU7WUFBUyxXQUFXLFVBQVUsY0FBYyxhQUFhLFVBQVU7Z0JBRXhGLEVBQUUsTUFBTSxHQUFHLFVBQVk7Z0JBQ3ZCLEVBQUUsTUFBTSxHQUFHLEtBQU87Z0JBQ2xCLEVBQUUsTUFBTSxHQUFHLEtBQU87Z0JBRWxCLEVBQUUsTUFBTSxHQUFHLFVBQVk7Z0JBQ3ZCLEVBQUUsTUFBTSxHQUFHLEtBQU87Z0JBQ2xCLEVBQUUsTUFBTSxHQUFHLEtBQU87Z0JBQ2xCLEVBQUUsTUFBTSxHQUFHLE1BQVE7UUFFbkIsRUFBRSx1QkFBdUI7Z0JBQ3pCLEVBQUUsZUFBaUI7Z0JBQ25CLEVBQUUsc0JBQXdCO1FBRTFCLFFBQU8sS0FBSyxLQUFLLEtBQUssV0FBVyxLQUFLO2dCQUN0QyxFQUFFLGtCQUFrQixNQUFNLE9BQVM7Ozs7UUFJbkMsT0FBTztRQUNQLFdBQVcsTUFBTSxLQUFLLEtBQUs7UUFDM0IsWUFBWSxNQUFNLEtBQUssS0FBSztRQUU1QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsY0FBYyxTQUFTOztRQUkxQixHQUFHLGNBQWMsVUFBVTtRQUUzQixVQUFVO2NBQ1IsSUFBSSxNQUFNO2NBQ1YsSUFBSSxNQUFNO1FBRVosUUFBUSxTQUFRLEtBQUssSUFBSSxLQUFLO1FBQzlCLFFBQVEsT0FBTyxFQUFFLE9BQU87UUFDeEIsRUFBRSxjQUFjO1FBRWhCLFFBQVEsUUFBUSxFQUFFO1FBQ2xCLEVBQUUsY0FBYyxVQUFVLElBQUksTUFBTTtRQUVwQyxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUVwQztRQUNBLGVBQWUsS0FBSztRQUNwQixLQUFLLGlCQUFRLE9BQU07O21CQUFZLFFBQVEsTUFBTSxPQUFPLE9BQU87O1FBRTNELEVBQUUsV0FBVyxTQUFTLEVBQUUsTUFBTTtRQUM5QixFQUFFLFdBQVcsU0FBUyxFQUFFLE1BQU07UUFFOUIsS0FBSyxPQUFPO2dCQUVaLFFBQVEsSUFBTSxZQUFZLEVBQUUsTUFBTTtnQkFDbEMsUUFBUSxJQUFNLFFBQVE7Z0JBQ3RCLFFBQVEsSUFBTSxZQUFZLFNBQVMsRUFBRSxNQUFNO2dCQUMzQyxRQUFRLElBQU0sUUFBUTs7OztRQUl0QixPQUFPO1FBQ1AsT0FBTyxNQUFNLEtBQUssS0FBSztRQUV2QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsY0FBYyxLQUFLO1FBRXRCLFVBQVU7Y0FDUixJQUFJLE1BQU07UUFFWixRQUFRLFNBQVEsS0FBSyxJQUFJLEtBQUs7UUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztRQUN4QixFQUFFLGNBQWM7UUFFaEIsUUFBUSxRQUFRLEVBQUU7UUFDbEIsRUFBRSxjQUFjLEtBQUssSUFBSSxNQUFNO1FBRS9CLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO2dCQUVwQyxFQUFFLE1BQU0sT0FBUztnQkFDakIsRUFBRSxNQUFNLEdBQUcsS0FBTyJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/funtree.kode
