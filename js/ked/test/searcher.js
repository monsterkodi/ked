var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var append, appendCount, appends, e, file, files, h, highlight, i, j, lines, lineX, lineY, main, other, root, s, savedConfig, sfil, widths

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash

import editor from "../edit/editor.js"

import harness from "../util/harness.js"
import config from "../util/config.js"

import theme from "../theme/theme.js"

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
    await section("the selected file separator is blue", async function ()
    {
        root = '/tmp/opencode/ked-searcher-selected'
        main = slash.path(root,'main.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        fs.writeFileSync(main,'if a\n')
        delete prjcts.projects[root]
        delete prjcts.allFiles[main]
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
        e.cells.layout(1,0,79,30)
        s = new searcher(h.screen,e)
        await s.show('if')
        s.choices.select(0)
        s.draw()
        sfil = s.sfils[0]
        lineX = sfil.cells.x + 2
        lineY = sfil.cells.y
        compare(h.screen.get_fg(lineX,lineY),theme.finder.frame)
        s.choices.select(sfil.lineIndex)
        s.draw()
        compare(h.screen.get_fg(lineX,lineY),theme.selection.span)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
}
toExport["searcher"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3Qvc2VhcmNoZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FDSSxTQUFBOztPQUNNLFVBQUE7SUFBUzs7T0FDQSxhQUFaOztPQUNZLGNBQVo7T0FBb0IsYUFBcEI7O09BQ1ksWUFBWjs7T0FDWSxhQUFaOztPQUNZLGVBQU47Ozs7OztRQU1MLE9BQVE7UUFDUixPQUFRLE1BQU0sS0FBSyxLQUFLO1FBQ3hCLFFBQVEsTUFBTSxLQUFLLEtBQUs7UUFFeEIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUU1QixHQUFHLGNBQWMsTUFBTSxLQUFLLEtBQUssZ0JBQWdCO1FBQ2pELEdBQUcsY0FBYyxLQUFNO1FBQ3ZCLEdBQUcsY0FBYyxNQUFNO2VBRWhCLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7ZUFDaEIsT0FBTyxTQUFTO1FBRXZCLE9BQU8sZUFDSCxjQUFNOzttQkFBUTtVQUNkLGNBQU0sS0FBSTs7bUJBQVU7O1FBRXhCLGNBQWMsT0FBTztRQUNyQixPQUFPLFFBQ0gsU0FBUyxTQUFTLEdBQUcsV0FDckIsc0JBQXVCO2NBRXpCLE9BQU8sTUFBTTtRQUVmLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPLGVBQWU7UUFDdkMsRUFBRSxNQUFNLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDdEIsUUFBUSxTQUFTLEVBQUUsT0FBTztRQUUxQixjQUFjO1FBQ2QsU0FBUyxFQUFFLFFBQVEsT0FBTyxLQUFLLEVBQUU7UUFDakMsRUFBRSxRQUFRLG1CQUFVLE9BQU07O1lBQ3RCLGVBQWU7bUJBQ2YsT0FBTyxNQUFNOztjQUVmLEVBQUUsS0FBSztnQkFFVCxZQUFjO2dCQUNkLEVBQUUsTUFBTSxPQUFTO2dCQUNqQixFQUFFLE1BQU0sY0FBSzs7bUJBQU0sRUFBRTtXQUFXLGVBQU0sR0FBRTs7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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/searcher.kode
