var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var append, appendCount, appends, e, file, files, h, i, main, other, root, s, savedConfig

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash

import editor from "../edit/editor.js"

import harness from "../util/harness.js"
import config from "../util/config.js"

import prjcts from "../index/prjcts.js"

import searcher from "../view/menu/searcher.js"

toExport["searcher"] = async function ()
{
    await section("a multi file search appends its results once", async function ()
    {
        root = '/tmp/opencode/ked-searcher-append'
        main = slash.path(root,'main.kode')
        other = slash.path(root,'other.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        fs.writeFileSync(main,'if a\n')
        fs.writeFileSync(other,'if b\n')
        delete prjcts.projects[root]
        delete prjcts.allFiles[main]
        delete prjcts.allFiles[other]
        global.ked_session = {get:function (key)
        {
            return main
        },set:function (key, value)
        {
            return null
        }}
        savedConfig = config.data
        config.data = {project:{maxDepth:12,ignore:[]},sourceFileExtensions:['kode']}
        await prjcts.index(main)
        h = new harness({cols:80,rows:30})
        e = new editor(h.screen,'test_editor',['gutter'])
        e.cells.layout(0,0,80,30)
        s = new searcher(h.screen,e)
        appendCount = 0
        append = s.choices.append.bind(s.choices)
        s.choices.append = function (items, ext)
        {
            appendCount += 1
            return append(items,ext)
        }
        await s.show('if')
        compare(appendCount,1)
        compare(s.sfils.length,2)
        compare(s.sfils.map(function (f)
        {
            return f.lineIndex
        }).sort(function (a, b)
        {
            return a - b
        }),[1,5])
        compare(s.choices.items.length,8)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("results are appended as soon as the visible rows are filled", async function ()
    {
        root = '/tmp/opencode/ked-searcher-threshold'
        files = []
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        for (i = 0; i < 5; i++)
        {
            file = slash.path(root,`file${i}.kode`)
            fs.writeFileSync(file,'if a\n')
            files.push(file)
        }
        main = files[0]
        delete prjcts.projects[root]
        var list = _k_.list(files)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
            delete prjcts.allFiles[file]
        }
        global.ked_session = {get:function (key)
        {
            return main
        },set:function (key, value)
        {
            return null
        }}
        savedConfig = config.data
        config.data = {project:{maxDepth:12,ignore:[]},sourceFileExtensions:['kode']}
        await prjcts.index(main)
        h = new harness({cols:80,rows:30})
        e = new editor(h.screen,'test_editor',['gutter'])
        e.cells.layout(0,0,80,10)
        s = new searcher(h.screen,e)
        appends = []
        append = s.choices.append.bind(s.choices)
        s.choices.append = function (items, ext)
        {
            appends.push(items.length)
            return append(items,ext)
        }
        await s.show('if')
        compare(appends,[12,8])
        compare(s.sfils.length,5)
        compare(s.sfils.map(function (f)
        {
            return f.lineIndex
        }).sort(function (a, b)
        {
            return a - b
        }),[1,5,9,13,17])
        compare(s.choices.items.length,20)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
}
toExport["searcher"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc2VhcmNoZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FDSSxTQUFBOztPQUNNLFVBQUE7SUFBUzs7T0FDQSxhQUFaOztPQUNZLGNBQVo7T0FBb0IsYUFBcEI7O09BQ1ksYUFBWjs7T0FDWSxlQUFOOzs7Ozs7UUFNTCxPQUFRO1FBQ1IsT0FBUSxNQUFNLEtBQUssS0FBSztRQUN4QixRQUFRLE1BQU0sS0FBSyxLQUFLO1FBRXhCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLGdCQUFnQjtRQUNqRCxHQUFHLGNBQWMsS0FBTTtRQUN2QixHQUFHLGNBQWMsTUFBTTtlQUVoQixPQUFPLFNBQVM7ZUFDaEIsT0FBTyxTQUFTO2VBQ2hCLE9BQU8sU0FBUztRQUV2QixPQUFPLGVBQ0gsY0FBTTs7bUJBQVE7VUFDZCxjQUFNLEtBQUk7O21CQUFVOztRQUV4QixjQUFjLE9BQU87UUFDckIsT0FBTyxRQUNILFNBQVMsU0FBUyxHQUFHLFdBQ3JCLHNCQUF1QjtjQUV6QixPQUFPLE1BQU07UUFFZixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTyxlQUFlO1FBQ3ZDLEVBQUUsTUFBTSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ3RCLFFBQVEsU0FBUyxFQUFFLE9BQU87UUFFMUIsY0FBYztRQUNkLFNBQVMsRUFBRSxRQUFRLE9BQU8sS0FBSyxFQUFFO1FBQ2pDLEVBQUUsUUFBUSxtQkFBVSxPQUFNOztZQUN0QixlQUFlO21CQUNmLE9BQU8sTUFBTTs7Y0FFZixFQUFFLEtBQUs7Z0JBRVQsWUFBYztnQkFDZCxFQUFFLE1BQU0sT0FBUztnQkFDakIsRUFBRSxNQUFNLGNBQUs7O21CQUFNLEVBQUU7V0FBVyxlQUFNLEdBQUU7O21CQUFNLElBQUU7WUFBTSxFQUFFO2dCQUN4RCxFQUFFLFFBQVEsTUFBTSxPQUFTO1FBRXpCLE9BQU8sT0FBTztlQUNQLE9BQU87UUFDZCxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTs7OztRQUlwQyxPQUFPO1FBQ1A7UUFFQSxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBRTVCLEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxnQkFBZ0I7YUFFN0MsSUFBSyxPQUFJOztZQUNULE9BQU8sTUFBTSxLQUFLLFlBQVk7WUFDOUIsR0FBRyxjQUFjLEtBQUs7WUFDdEIsTUFBTSxLQUFLOztRQUVmLE9BQU8sTUFBTTtlQUVOLE9BQU8sU0FBUzs0QkFDWDs7O1lBQVI7bUJBQXVCLE9BQU8sU0FBUzs7UUFFM0MsT0FBTyxlQUNILGNBQU07O21CQUFRO1VBQ2QsY0FBTSxLQUFJOzttQkFBVTs7UUFFeEIsY0FBYyxPQUFPO1FBQ3JCLE9BQU8sUUFDSCxTQUFTLFNBQVMsR0FBRyxXQUNyQixzQkFBdUI7Y0FFekIsT0FBTyxNQUFNO1FBRWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZUFBZTtRQUN2QyxFQUFFLE1BQU0sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixRQUFRLFNBQVMsRUFBRSxPQUFPO1FBRTFCO1FBQ0EsU0FBUyxFQUFFLFFBQVEsT0FBTyxLQUFLLEVBQUU7UUFDakMsRUFBRSxRQUFRLG1CQUFVLE9BQU07O1lBQ3RCLFFBQVEsS0FBSyxNQUFNO21CQUNuQixPQUFPLE1BQU07O2NBRWYsRUFBRSxLQUFLO2dCQUVULFNBQVcsR0FBRztnQkFDZCxFQUFFLE1BQU0sT0FBUztnQkFDakIsRUFBRSxNQUFNLGNBQUs7O21CQUFNLEVBQUU7V0FBVyxlQUFNLEdBQUU7O21CQUFNLElBQUU7WUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHO2dCQUMvRCxFQUFFLFFBQVEsTUFBTSxPQUFTO1FBRXpCLE9BQU8sT0FBTztlQUNQLE9BQU87UUFDZCxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/searcher.kode
