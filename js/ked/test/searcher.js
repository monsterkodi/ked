var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var append, appendCount, appends, e, file, files, h, highlight, i, j, lines, main, other, root, s, savedConfig, widths

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
    await section("the gutter width follows the displayed line numbers", async function ()
    {
        root = '/tmp/opencode/ked-searcher-gutter'
        files = []
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        for (i = 0; i < 5; i++)
        {
            file = slash.path(root,`file${i}.kode`)
            lines = []
            for (j = 0; j < 99; j++)
            {
                lines.push('x')
            }
            lines.push('if a')
            fs.writeFileSync(file,lines.join('\n'))
            files.push(file)
        }
        main = files[0]
        delete prjcts.projects[root]
        var list1 = _k_.list(files)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            file = list1[_b_]
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
        widths = []
        highlight = s.highlightTextAndEmitRedraw.bind(s)
        s.highlightTextAndEmitRedraw = function (text)
        {
            highlight(text)
            s.arrange()
            return widths.push(s.choices.gutter.cells.cols)
        }
        await s.show('if')
        compare(widths,[5,5])
        compare(s.choices.gutter.cells.cols,5)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("next and previous file headers jump and scroll to the top", async function ()
    {
        root = '/tmp/opencode/ked-searcher-headers'
        files = []
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        for (i = 0; i < 4; i++)
        {
            file = slash.path(root,`file${i}.kode`)
            fs.writeFileSync(file,'if a\n')
            files.push(file)
        }
        main = files[0]
        delete prjcts.projects[root]
        var list2 = _k_.list(files)
        for (var _c_ = 0; _c_ < list2.length; _c_++)
        {
            file = list2[_c_]
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
        e.cells.layout(0,0,80,30)
        s = new searcher(h.screen,e)
        await s.show('if')
        compare(s.choices.currentIndex(),0)
        compare(s.selectNextFileHeader(),true)
        compare(s.choices.currentIndex(),1)
        compare(s.choices.state.s.view[1],1)
        compare(s.selectNextFileHeader(),true)
        compare(s.choices.currentIndex(),5)
        compare(s.choices.state.s.view[1],5)
        compare(s.selectPrevFileHeader(),true)
        compare(s.choices.currentIndex(),1)
        compare(s.choices.state.s.view[1],1)
        compare(s.selectPrevFileHeader(),false)
        compare(s.choices.currentIndex(),1)
        compare(s.choices.state.s.view[1],1)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
}
toExport["searcher"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc2VhcmNoZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FDSSxTQUFBOztPQUNNLFVBQUE7SUFBUzs7T0FDQSxhQUFaOztPQUNZLGNBQVo7T0FBb0IsYUFBcEI7O09BQ1ksYUFBWjs7T0FDWSxlQUFOOzs7Ozs7UUFNTCxPQUFRO1FBQ1IsT0FBUSxNQUFNLEtBQUssS0FBSztRQUN4QixRQUFRLE1BQU0sS0FBSyxLQUFLO1FBRXhCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLGdCQUFnQjtRQUNqRCxHQUFHLGNBQWMsS0FBTTtRQUN2QixHQUFHLGNBQWMsTUFBTTtlQUVoQixPQUFPLFNBQVM7ZUFDaEIsT0FBTyxTQUFTO2VBQ2hCLE9BQU8sU0FBUztRQUV2QixPQUFPLGVBQ0gsY0FBTTs7bUJBQVE7VUFDZCxjQUFNLEtBQUk7O21CQUFVOztRQUV4QixjQUFjLE9BQU87UUFDckIsT0FBTyxRQUNILFNBQVMsU0FBUyxHQUFHLFdBQ3JCLHNCQUF1QjtjQUV6QixPQUFPLE1BQU07UUFFZixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTyxlQUFlO1FBQ3ZDLEVBQUUsTUFBTSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ3RCLFFBQVEsU0FBUyxFQUFFLE9BQU87UUFFMUIsY0FBYztRQUNkLFNBQVMsRUFBRSxRQUFRLE9BQU8sS0FBSyxFQUFFO1FBQ2pDLEVBQUUsUUFBUSxtQkFBVSxPQUFNOztZQUN0QixlQUFlO21CQUNmLE9BQU8sTUFBTTs7Y0FFZixFQUFFLEtBQUs7Z0JBRVQsWUFBYztnQkFDZCxFQUFFLE1BQU0sT0FBUztnQkFDakIsRUFBRSxNQUFNLGNBQUs7O21CQUFNLEVBQUU7V0FBVyxlQUFNLEdBQUU7O21CQUFNLElBQUU7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/searcher.kode
