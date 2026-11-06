var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var choice, e, file, files, first, h, i, idx, item, keep, lineIndex, lineIndices, lineItem, lines, main, mid, oldHandler, order, r, root, row, savedConfig, scroll, second, sfil, third, view, w, x, y

import fs from "fs"

import kxk from "../../kxk.js"
let slash = kxk.slash

import editor from "../edit/editor.js"

import harness from "../util/harness.js"
import config from "../util/config.js"

import prjcts from "../index/prjcts.js"

import replacer from "../view/menu/replacer.js"

toExport["replacer"] = async function ()
{
    await section("the input is split into search and replacement fields", async function ()
    {
        root = '/tmp/opencode/ked-replacer-split'
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
        e.cells.layout(0,0,80,30)
        r = new replacer(h.screen,e)
        await r.show('if')
        var _a_ = r.arrangeRect(); x = _a_[0]; y = _a_[1]; w = _a_[2]; h = _a_[3]

        mid = parseInt(w / 2)
        compare(r.input.cells.x,x + 2)
        compare(r.replaceInput.cells.x,x + mid + 2)
        compare(r.input.cells.y,y + 1)
        compare(r.replaceInput.cells.y,y + 1)
        compare(r.input.cells.cols,mid - 4)
        compare(r.replaceInput.cells.cols,w - mid - 4)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("starting with a search text focuses the replacement field", async function ()
    {
        root = '/tmp/opencode/ked-replacer-focus'
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
        e.cells.layout(0,0,80,30)
        r = new replacer(h.screen,e)
        await r.show('if')
        compare(r.replaceInput.hasFocus(),true)
        compare(r.input.hasFocus(),false)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("starting without a search text focuses the search field", async function ()
    {
        h = new harness({cols:80,rows:30})
        e = new editor(h.screen,'test_editor',['gutter'])
        e.cells.layout(0,0,80,30)
        r = new replacer(h.screen,e)
        await r.show('')
        compare(r.input.hasFocus(),true)
        compare(r.replaceInput.hasFocus(),false)
    })
    await section("tab switches between the search and replacement fields", async function ()
    {
        root = '/tmp/opencode/ked-replacer-tab'
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
        e.cells.layout(0,0,80,30)
        r = new replacer(h.screen,e)
        await r.show('if')
        compare(r.replaceInput.hasFocus(),true)
        h.key(r,'tab')
        compare(r.input.hasFocus(),true)
        compare(r.replaceInput.hasFocus(),false)
        h.key(r,'tab')
        compare(r.input.hasFocus(),false)
        compare(r.replaceInput.hasFocus(),true)
        h.key(r,'shift+tab')
        compare(r.input.hasFocus(),true)
        compare(r.replaceInput.hasFocus(),false)
        h.key(r,'shift+tab')
        compare(r.input.hasFocus(),false)
        compare(r.replaceInput.hasFocus(),true)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("typing goes into the focused replacement field", async function ()
    {
        root = '/tmp/opencode/ked-replacer-type'
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
        e.cells.layout(0,0,80,30)
        r = new replacer(h.screen,e)
        await r.show('if')
        h.type(r,'xx')
        compare(r.replaceInput.current(),'xx')
        compare(r.input.current(),'if')
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("file separators are laid out and drawn with the results", async function ()
    {
        root = '/tmp/opencode/ked-replacer-separators'
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
        r = new replacer(h.screen,e)
        await r.show('if')
        r.arrange()
        compare(r.sfils.length,1)
        var list = _k_.list(r.sfils)
        for (var _b_ = 0; _b_ < list.length; _b_++)
        {
            sfil = list[_b_]
            compare(sfil.cells.cols,r.choices.cells.cols)
            compare(sfil.cells.rows,1)
        }
        r.draw()
        row = h.row(r.sfils[0].cells.y)
        compare(row.includes('main.kode'),true)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("file headers show checkmarks and space toggles exclusion", async function ()
    {
        root = '/tmp/opencode/ked-replacer-exclude'
        main = slash.path(root,'main.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        fs.writeFileSync(main,'if a\nif b\n')
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
        r = new replacer(h.screen,e)
        await r.show('if')
        compare(r.sfils.length,1)
        compare(r.sfils[0].marker,'✔')
        compare(r.choices.items[r.sfils[0].lineIndex].line,'✔')
        compare(r.choices.items.length,5)
        r.draw()
        row = h.row(r.sfils[0].cells.y)
        compare(row.includes('✔'),true)
        choice = r.choices.items[r.sfils[0].lineIndex]
        await r.onChoicesAction('space',choice)
        compare(r.sfils.length,1)
        compare(r.sfils[0].excluded,true)
        compare(r.sfils[0].marker,'✘')
        compare(r.choices.items[r.sfils[0].lineIndex].line,'✘')
        compare(r.choices.items.length,2)
        r.draw()
        row = h.row(r.sfils[0].cells.y)
        compare(row.includes('✘'),true)
        choice = r.choices.items[r.sfils[0].lineIndex]
        await r.onChoicesAction('space',choice)
        compare(r.sfils[0].excluded,false)
        compare(r.sfils[0].marker,'✔')
        compare(r.choices.items.length,5)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("submitting the replacement field logs the planned changes", async function ()
    {
        root = '/tmp/opencode/ked-replacer-submit'
        main = slash.path(root,'main.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        fs.writeFileSync(main,'if a\nif b\nif c\n')
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
        r = new replacer(h.screen,e)
        await r.show('if')
        h.type(r,'XX')
        lines = []
        keep = console.log
        console.log = function (...args)
        {
            return lines.push(args.join(' '))
        }
        h.key(r,'return')
        console.log = keep
        compare(lines.length,2)
        compare(lines[0].includes('1 files'),true)
        compare(lines[0].includes('3 lines'),true)
        compare(lines[1].includes('main.kode'),true)
        compare(lines[1].includes('3 lines'),true)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("showing the replacer again resets previous exclusions", async function ()
    {
        root = '/tmp/opencode/ked-replacer-reset'
        main = slash.path(root,'main.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        fs.writeFileSync(main,'if a\nif b\n')
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
        h = new harness({cols:80,rows:16})
        e = new editor(h.screen,'test_editor',['gutter'])
        e.cells.layout(1,0,79,16)
        r = new replacer(h.screen,e)
        await r.show('if')
        oldHandler = r.sfils[0]
        choice = r.choices.items[oldHandler.lineIndex]
        await r.onChoicesAction('space',choice)
        compare(r.sfils[0].excluded,true)
        compare(r.excludedPaths[main],true)
        await r.show('if')
        compare(r.sfils.length,1)
        compare((r.sfils[0] !== oldHandler),true)
        compare(r.sfils[0].excluded,false)
        compare(r.sfils[0].marker,'✔')
        compare(r.isExcluded(main),false)
        compare(r.choices.items.length,5)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("toggling a file keeps the file order and the view", async function ()
    {
        root = '/tmp/opencode/ked-replacer-order'
        files = []
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        for (i = 0; i < 5; i++)
        {
            file = slash.path(root,`file${i}.kode`)
            fs.writeFileSync(file,`if ${i}a\nif ${i}b\n`)
            files.push(file)
        }
        var list1 = _k_.list(files)
        for (var _c_ = 0; _c_ < list1.length; _c_++)
        {
            file = list1[_c_]
            delete prjcts.allFiles[file]
        }
        delete prjcts.projects[root]
        global.ked_session = {get:function (key)
        {
            return files[0]
        },set:function (key, value)
        {
            return null
        }}
        savedConfig = config.data
        config.data = {project:{maxDepth:12,ignore:[]},sourceFileExtensions:['kode']}
        await prjcts.index(files[0])
        h = new harness({cols:80,rows:16})
        e = new editor(h.screen,'test_editor',['gutter'])
        e.cells.layout(1,0,79,16)
        r = new replacer(h.screen,e)
        await r.show('if')
        order = r.sfils.map(function (sfil)
        {
            return sfil.path
        })
        r.choices.state.setView([0,8])
        r.choices.select(r.sfils[2].lineIndex)
        r.choices.grabFocus()
        view = r.choices.state.s.view.slice()
        scroll = r.choices.state.s.scrollOffset
        await r.onChoicesAction('space',r.choices.current())
        compare(r.sfils.map(function (sfil)
        {
            return sfil.path
        }),order)
        compare(r.choices.state.s.view,view)
        compare(r.choices.state.s.scrollOffset,scroll)
        compare(r.choices.current().line,'✘')
        compare(r.choices.current().path,files[2])
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("space on a result line excludes it from the replacement", async function ()
    {
        root = '/tmp/opencode/ked-replacer-line-exclude'
        main = slash.path(root,'main.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        fs.writeFileSync(main,'if a\nif b\nif c\n')
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
        r = new replacer(h.screen,e)
        await r.show('if')
        lineIndex = null
        lineItem = null
        var list2 = _k_.list(r.choices.items)
        for (idx = 0; idx < list2.length; idx++)
        {
            item = list2[idx]
            if (_k_.isNum(item.row) && item.type !== 'file')
            {
                lineIndex = idx
                lineItem = item
                break
            }
        }
        compare((lineItem !== null),true)
        r.choices.select(lineIndex)
        await r.onChoicesAction('space',lineItem)
        compare(lineItem.excluded,true)
        compare(r.visible(),true)
        compare(r.lineno(lineIndex).includes('✘'),true)
        lines = []
        keep = console.log
        console.log = function (...args)
        {
            return lines.push(args.join(' '))
        }
        r.onReplaceInputAction('submit','XX')
        console.log = keep
        compare(lines[0].includes('2 lines'),true)
        compare(lines[1].includes('2 lines'),true)
        await r.onChoicesAction('space',lineItem)
        compare(lineItem.excluded,false)
        compare(r.lineno(lineIndex).includes('✘'),false)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("excluding a line moves focus to the next result line", async function ()
    {
        root = '/tmp/opencode/ked-replacer-line-repeat'
        main = slash.path(root,'main.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        fs.writeFileSync(main,'if a\nif b\nif c\n')
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
        r = new replacer(h.screen,e)
        await r.show('if')
        lineIndices = []
        var list3 = _k_.list(r.choices.items)
        for (idx = 0; idx < list3.length; idx++)
        {
            item = list3[idx]
            if (_k_.isNum(item.row) && item.type !== 'file')
            {
                lineIndices.push(idx)
            }
        }
        compare(lineIndices.length,3)
        r.choices.select(lineIndices[0])
        first = r.choices.current()
        await r.onChoicesAction('space',first)
        compare(first.excluded,true)
        compare(r.choices.currentIndex(),lineIndices[1])
        second = r.choices.current()
        await r.onChoicesAction('space',second)
        compare(second.excluded,true)
        compare(r.choices.currentIndex(),lineIndices[2])
        third = r.choices.current()
        await r.onChoicesAction('space',third)
        compare(third.excluded,true)
        compare(r.choices.currentIndex(),lineIndices[2])
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
}
toExport["replacer"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvcmVwbGFjZXIua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7T0FDSSxTQUFBOztPQUNNLFVBQUE7SUFBUzs7T0FDQSxhQUFaOztPQUNZLGNBQVo7T0FBb0IsYUFBcEI7O09BQ1ksYUFBWjs7T0FDWSxlQUFOOzs7Ozs7UUFNTCxPQUFPO1FBQ1AsT0FBTyxNQUFNLEtBQUssS0FBSztRQUV2QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBRTVCLEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxnQkFBZ0I7UUFDakQsR0FBRyxjQUFjLEtBQUs7ZUFFZixPQUFPLFNBQVM7ZUFDaEIsT0FBTyxTQUFTO1FBRXZCLE9BQU8sZUFDSCxjQUFNOzttQkFBUTtVQUNkLGNBQU0sS0FBSTs7bUJBQVU7O1FBRXhCLGNBQWMsT0FBTztRQUNyQixPQUFPLFFBQ0gsU0FBUyxTQUFTLEdBQUcsV0FDckIsc0JBQXVCO2NBRXpCLE9BQU8sTUFBTTtRQUVmLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPLGVBQWU7UUFDdkMsRUFBRSxNQUFNLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDdEIsUUFBUSxTQUFTLEVBQUUsT0FBTztjQUV4QixFQUFFLEtBQUs7a0JBRUcsRUFBRSxlQUFiLFlBQUUsWUFBRSxZQUFFOztRQUNQLGVBQVUsSUFBRTtnQkFFWixFQUFFLE1BQU0sTUFBTSxFQUFjLElBQUU7Z0JBQzlCLEVBQUUsYUFBYSxNQUFNLEVBQU8sSUFBRSxNQUFJO2dCQUNsQyxFQUFFLE1BQU0sTUFBTSxFQUFjLElBQUU7Z0JBQzlCLEVBQUUsYUFBYSxNQUFNLEVBQU8sSUFBRTtnQkFDOUIsRUFBRSxNQUFNLE1BQU0sS0FBYyxNQUFJO2dCQUNoQyxFQUFFLGFBQWEsTUFBTSxLQUFPLElBQUUsTUFBSTtRQUVsQyxPQUFP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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/replacer.kode
