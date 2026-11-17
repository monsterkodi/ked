var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var append, appendCount, appends, choice, e, file, files, first, h, headerY, highlight, i, idx, item, j, keep, lineIndex, lineIndices, lineItem, lines, lineX, lineY, logLines, main, mainHandler, markerX, mid, newDir, newFile, oldDir, oldFile, oldHandler, order, other, otherHandler, r, root, row, s, savedConfig, scroll, second, sfil, text, third, view, w, widths, x, y

import fs from "fs"

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import editor from "../edit/editor.js"

import harness from "../util/harness.js"
import config from "../util/config.js"

import theme from "../theme/theme.js"

import kacher from "../index/kacher.js"
import prjcts from "../index/prjcts.js"

import replacer from "../view/menu/replacer.js"
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
        var _d_ = r.arrangeRect(); x = _d_[0]; y = _d_[1]; w = _d_[2]; h = _d_[3]

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
        var list3 = _k_.list(r.sfils)
        for (var _e_ = 0; _e_ < list3.length; _e_++)
        {
            sfil = list3[_e_]
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
    await section("replacing changes included lines and skips excluded files and lines", async function ()
    {
        root = '/tmp/opencode/ked-replacer-submit'
        main = slash.path(root,'main.kode')
        other = slash.path(root,'other.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        fs.writeFileSync(main,'if if\nif b\nif c\n')
        fs.writeFileSync(other,'if d\n')
        delete prjcts.projects[root]
        var list4 = [main,other]
        for (var _f_ = 0; _f_ < list4.length; _f_++)
        {
            file = list4[_f_]
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
        e.cells.layout(1,0,79,30)
        r = new replacer(h.screen,e)
        await r.show('if')
        mainHandler = null
        otherHandler = null
        var list5 = _k_.list(r.sfils)
        for (var _10_ = 0; _10_ < list5.length; _10_++)
        {
            sfil = list5[_10_]
            if (sfil.path === main)
            {
                mainHandler = sfil
            }
            if (sfil.path === other)
            {
                otherHandler = sfil
            }
        }
        compare((mainHandler !== null),true)
        compare((otherHandler !== null),true)
        lineItem = null
        var list6 = _k_.list(mainHandler.resultItems)
        for (var _11_ = 0; _11_ < list6.length; _11_++)
        {
            item = list6[_11_]
            if (item.row === 1)
            {
                lineItem = item
                break
            }
        }
        compare((lineItem !== null),true)
        r.choices.select(r.choices.items.indexOf,lineItem)
        await r.onChoicesAction('space',lineItem)
        await r.onChoicesAction('space',otherHandler.headerItem)
        logLines = []
        keep = console.log
        console.log = function (...args)
        {
            return logLines.push(args.join(' '))
        }
        await r.onReplaceInputAction('submit','X')
        console.log = keep
        compare(fs.readFileSync(main,'utf8'),'X X\nif b\nX c\n')
        compare(fs.readFileSync(other,'utf8'),'if d\n')
        compare(r.visible(),false)
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
        var list7 = _k_.list(files)
        for (var _12_ = 0; _12_ < list7.length; _12_++)
        {
            file = list7[_12_]
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
        var list8 = _k_.list(r.choices.items)
        for (idx = 0; idx < list8.length; idx++)
        {
            item = list8[idx]
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
        var list9 = _k_.list(r.choices.items)
        for (idx = 0; idx < list9.length; idx++)
        {
            item = list9[idx]
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
    await section("included and excluded markers use theme colors", async function ()
    {
        root = '/tmp/opencode/ked-replacer-theme'
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
        r.draw()
        markerX = r.choices.gutter.cells.x + r.choices.gutter.cells.cols - 2
        headerY = r.sfils[0].cells.y
        compare(h.screen.get_fg(markerX,headerY),theme.replacer.included)
        lineItem = null
        var list10 = _k_.list(r.sfils[0].resultItems)
        for (var _15_ = 0; _15_ < list10.length; _15_++)
        {
            item = list10[_15_]
            if (_k_.isNum(item.row))
            {
                lineItem = item
                break
            }
        }
        compare((lineItem !== null),true)
        lineIndex = r.choices.items.indexOf(lineItem)
        lineY = r.choices.cells.y - r.choices.state.s.view[1] + lineIndex
        r.choices.select(lineIndex)
        await r.onChoicesAction('space',lineItem)
        r.draw()
        markerX = r.choices.gutter.cells.x + r.choices.gutter.cells.cols - 2
        compare(h.screen.get_fg(markerX,lineY),theme.replacer.excluded)
        await r.onChoicesAction('space',r.sfils[0].headerItem)
        r.draw()
        markerX = r.choices.gutter.cells.x + r.choices.gutter.cells.cols - 2
        headerY = r.sfils[0].cells.y
        compare(h.screen.get_fg(markerX,headerY),theme.replacer.excluded)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("clicking toggles exclusion and keeps the replacer open", async function ()
    {
        root = '/tmp/opencode/ked-replacer-click'
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
        await r.onChoicesAction('click',r.sfils[0].headerItem)
        compare(r.sfils[0].excluded,true)
        compare(r.visible(),true)
        await r.onChoicesAction('click',r.sfils[0].headerItem)
        compare(r.sfils[0].excluded,false)
        compare(r.visible(),true)
        lineItem = null
        var list11 = _k_.list(r.sfils[0].resultItems)
        for (var _16_ = 0; _16_ < list11.length; _16_++)
        {
            item = list11[_16_]
            if (_k_.isNum(item.row))
            {
                lineItem = item
                break
            }
        }
        compare((lineItem !== null),true)
        await r.onChoicesAction('click',lineItem)
        compare(lineItem.excluded,true)
        compare(r.visible(),true)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("the selected file separator is blue", async function ()
    {
        root = '/tmp/opencode/ked-replacer-selected'
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
        r.choices.select(0)
        r.draw()
        sfil = r.sfils[0]
        lineX = sfil.cells.x + 2
        lineY = sfil.cells.y
        compare(h.screen.get_fg(lineX,lineY),theme.finder.frame)
        r.choices.select(sfil.lineIndex)
        r.draw()
        compare(h.screen.get_fg(lineX,lineY),theme.selection.span)
        config.data = savedConfig
        delete global.ked_session
        fs.rmSync(root,{recursive:true,force:true})
    })
}
toExport["replacer"]._section_ = true
toExport["kacher"] = async function ()
{
    await section("caches the text of a file", async function ()
    {
        root = '/tmp/opencode/ked-kacher-cache'
        file = slash.path(root,'a.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,'alpha')
        text = await kacher.getText(file)
        compare(text,'alpha')
        fs.writeFileSync(file,'beta')
        text = await kacher.getText(file)
        compare(text,'alpha')
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("invalidates cached text on file change", async function ()
    {
        root = '/tmp/opencode/ked-kacher-change'
        file = slash.path(root,'a.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,'alpha')
        text = await kacher.getText(file)
        compare(text,'alpha')
        fs.writeFileSync(file,'beta')
        post.emit('file.change',{path:file,change:'modify'})
        text = await kacher.getText(file)
        compare(text,'beta')
        fs.rmSync(root,{recursive:true,force:true})
    })
    await section("renames invalidate the old path", async function ()
    {
        root = '/tmp/opencode/ked-kacher-rename'
        oldFile = slash.path(root,'old.kode')
        newFile = slash.path(root,'new.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(oldFile,'alpha')
        text = await kacher.getText(oldFile)
        compare(text,'alpha')
        fs.renameSync(oldFile,newFile)
        post.emit('file.change',{path:newFile,oldPath:oldFile,change:'rename'})
        fs.writeFileSync(oldFile,'beta')
        text = await kacher.getText(oldFile)
        fs.rmSync(root,{recursive:true,force:true})
        compare(text,'beta')
    })
    await section("deletes invalidate the old path", async function ()
    {
        root = '/tmp/opencode/ked-kacher-delete'
        file = slash.path(root,'a.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(file,'alpha')
        text = await kacher.getText(file)
        compare(text,'alpha')
        fs.rmSync(file)
        post.emit('file.change',{path:file,change:'delete'})
        fs.writeFileSync(file,'beta')
        text = await kacher.getText(file)
        fs.rmSync(root,{recursive:true,force:true})
        compare(text,'beta')
    })
    await section("folder renames invalidate cached paths below the folder", async function ()
    {
        root = '/tmp/opencode/ked-kacher-folder-rename'
        oldDir = slash.path(root,'old')
        newDir = slash.path(root,'new')
        oldFile = slash.path(oldDir,'a.kode')
        newFile = slash.path(newDir,'a.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(oldDir,{recursive:true})
        fs.writeFileSync(oldFile,'alpha')
        text = await kacher.getText(oldFile)
        compare(text,'alpha')
        fs.renameSync(oldDir,newDir)
        post.emit('file.change',{path:newDir,oldPath:oldDir,change:'rename'})
        fs.mkdirSync(oldDir,{recursive:true})
        fs.writeFileSync(oldFile,'beta')
        text = await kacher.getText(oldFile)
        fs.rmSync(root,{recursive:true,force:true})
        compare(text,'beta')
    })
}
toExport["kacher"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L3NlYXJjaC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztPQUFJLFNBQUE7O09BQ00sVUFBQTtJQUFTO0lBQUs7O09BQ0wsYUFBWjs7T0FDWSxjQUFaO09BQW9CLGFBQXBCOztPQUNZLFlBQVo7O09BQ1ksYUFBWjtPQUFtQixhQUFuQjs7T0FDWSxlQUFOO09BQWUsZUFBZjs7Ozs7O1FBTUwsT0FBUTtRQUNSLE9BQVEsTUFBTSxLQUFLLEtBQUs7UUFDeEIsUUFBUSxNQUFNLEtBQUssS0FBSztRQUV4QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBRTVCLEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxnQkFBZ0I7UUFDakQsR0FBRyxjQUFjLEtBQU07UUFDdkIsR0FBRyxjQUFjLE1BQU07ZUFFaEIsT0FBTyxTQUFTO2VBQ2hCLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7UUFFdkIsT0FBTyxlQUNILGNBQU07O21CQUFRO1VBQ2QsY0FBTSxLQUFJOzttQkFBVTs7UUFFeEIsY0FBYyxPQUFPO1FBQ3JCLE9BQU8sUUFDSCxTQUFTLFNBQVMsR0FBRyxXQUNyQixzQkFBdUI7Y0FFekIsT0FBTyxNQUFNO1FBRWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZUFBZTtRQUN2QyxFQUFFLE1BQU0sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixRQUFRLFNBQVMsRUFBRSxPQUFPO1FBRTFCLGNBQWM7UUFDZCxTQUFTLEVBQUUsUUFBUSxPQUFPLEtBQUssRUFBRTtRQUNqQyxFQUFFLFFBQVEsbUJBQVUsT0FBTTs7WUFDdEIsZUFBZTttQkFDZixPQUFPLE1BQU07O2NBRWYsRUFBRSxLQUFLO2dCQUVULFlBQWM7Z0JBQ2QsRUFBRSxNQUFNLE9BQVM7Z0JBQ2pCLEVBQUUsTUFBTSxjQUFLOzttQkFBTSxFQUFFO1dBQVcsZUFBTSxHQUFFOzttQkFBTSxJQUFFO1lBQU0sRUFBRTtnQkFDeEQsRUFBRSxRQUFRLE1BQU0sT0FBUztRQUV6QixPQUFPLE9BQU87ZUFDUCxPQUFPO1FBQ2QsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Ozs7UUFJcEMsT0FBTztRQUNQO1FBRUEsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUU1QixHQUFHLGNBQWMsTUFBTSxLQUFLLEtBQUssZ0JBQWdCO2FBRTdDLElBQUssT0FBSTs7WUFDVCxPQUFPLE1BQU0sS0FBSyxZQUFZO1lBQzlCLEdBQUcsY0FBYyxLQUFLO1lBQ3RCLE1BQU0sS0FBSzs7UUFFZixPQUFPLE1BQU07ZUFFTixPQUFPLFNBQVM7NEJBQ1g7OztZQUFSO21CQUF1QixPQUFPLFNBQVM7O1FBRTNDLE9BQU8sZUFDSCxjQUFNOzttQkFBUTtVQUNkLGNBQU0sS0FBSTs7bUJBQVU7O1FBRXhCLGNBQWMsT0FBTztRQUNyQixPQUFPLFFBQ0gsU0FBUyxTQUFTLEdBQUcsV0FDckIsc0JBQXVCO2NBRXpCLE9BQU8sTUFBTTtRQUVmLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPLGVBQWU7UUFDdkMsRUFBRSxNQUFNLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDdEIsUUFBUSxTQUFTLEVBQUUsT0FBTztRQUUxQjtRQUNBLFNBQVMsRUFBRSxRQUFRLE9BQU8sS0FBSyxFQUFFO1FBQ2pDLEVBQUUsUUFBUSxtQkFBVSxPQUFNOztZQUN0QixRQUFRLEtBQUssTUFBTTttQkFDbkIsT0FBTyxNQUFNOztjQUVmLEVBQUUsS0FBSztnQkFFVCxTQUFXLEdBQUc7Z0JBQ2QsRUFBRSxNQUFNLE9BQVM7Z0JBQ2pCLEVBQUUsTUFBTSxjQUFLOzttQkFBTSxFQUFFO1dBQVcsZUFBTSxHQUFFOzttQkFBTSxJQUFFO1lBQU0sRUFBRSxFQUFFLEVBQUUsR0FBRztnQkFDL0QsRUFBRSxRQUFRLE1BQU0sT0FBUztRQUV6QixPQUFPLE9BQU87ZUFDUCxPQUFPO1FBQ2QsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Ozs7UUFJcEMsT0FBTztRQUNQO1FBRUEsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUU1QixHQUFHLGNBQWMsTUFBTSxLQUFLLEtBQUssZ0JBQWdCO2FBRTdDLElBQUssT0FBSTs7WUFDVCxPQUFRLE1BQU0sS0FBSyxZQUFZO1lBQy9CO2lCQUNJLElBQUssT0FBSTs7Z0JBQUssTUFBTSxLQUFLOztZQUM3QixNQUFNLEtBQUs7WUFDWCxHQUFHLGNBQWMsS0FBSyxNQUFNLEtBQUs7WUFDakMsTUFBTSxLQUFLOztRQUVmLE9BQU8sTUFBTTtlQUVOLE9BQU8sU0FBUzs2QkFDWDs7O1lBQVI7bUJBQXVCLE9BQU8sU0FBUzs7UUFFM0MsT0FBTyxlQUNILGNBQU07O21CQUFRO1VBQ2QsY0FBTSxLQUFJOzttQkFBVTs7UUFFeEIsY0FBYyxPQUFPO1FBQ3JCLE9BQU8sUUFDSCxTQUFTLFNBQVMsR0FBRyxXQUNyQixzQkFBdUI7Y0FFekIsT0FBTyxNQUFNO1FBRWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZUFBZTtRQUN2QyxFQUFFLE1BQU0sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixRQUFRLFNBQVMsRUFBRSxPQUFPO1FBRTFCO1FBQ0EsWUFBWSxFQUFFLDJCQUEyQixLQUFLO1FBQzlDLEVBQUUsdUNBQThCOztZQUM1QixVQUFVO1lBQ1YsRUFBRTttQkFDRixPQUFPLEtBQUssRUFBRSxRQUFRLE9BQU8sTUFBTTs7Y0FFckMsRUFBRSxLQUFLO2dCQUVULFFBQVUsRUFBRTtnQkFDWixFQUFFLFFBQVEsT0FBTyxNQUFNLEtBQU87UUFFOUIsT0FBTyxPQUFPO2VBQ1AsT0FBTztRQUNkLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzs7O1FBSXBDLE9BQU87UUFDUDtRQUVBLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLGdCQUFnQjthQUU3QyxJQUFLLE9BQUk7O1lBQ1QsT0FBTyxNQUFNLEtBQUssWUFBWTtZQUM5QixHQUFHLGNBQWMsS0FBSztZQUN0QixNQUFNLEtBQUs7O1FBRWYsT0FBTyxNQUFNO2VBRU4sT0FBTyxTQUFTOzZCQUNYOzs7WUFBUjttQkFBdUIsT0FBTyxTQUFTOztRQUUzQyxPQUFPLGVBQ0gsY0FBTTs7bUJBQVE7VUFDZCxjQUFNLEtBQUk7O21CQUFVOztRQUV4QixjQUFjLE9BQU87UUFDckIsT0FBTyxRQUNILFNBQVMsU0FBUyxHQUFHLFdBQ3JCLHNCQUF1QjtjQUV6QixPQUFPLE1BQU07UUFFZixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTyxlQUFlO1FBQ3ZDLEVBQUUsTUFBTSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ3RCLFFBQVEsU0FBUyxFQUFFLE9BQU87Y0FFeEIsRUFBRSxLQUFLO2dCQUVULEVBQUUsUUFBUSxlQUFpQjtnQkFFM0IsRUFBRSx1QkFBeUI7Z0JBQzNCLEVBQUUsUUFBUSxlQUFpQjtnQkFDM0IsRUFBRSxRQUFRLE1BQU0sRUFBRSxLQUFLLEdBQUs7Z0JBRTVCLEVBQUUsdUJBQXlCO2dCQUMzQixFQUFFLFFBQVEsZUFBaUI7Z0JBQzNCLEVBQUUsUUFBUSxNQUFNLEVBQUUsS0FBSyxHQUFLO2dCQUU1QixFQUFFLHVCQUF5QjtnQkFDM0IsRUFBRSxRQUFRLGVBQWlCO2dCQUMzQixFQUFFLFFBQVEsTUFBTSxFQUFFLEtBQUssR0FBSztnQkFFNUIsRUFBRSx1QkFBeUI7Z0JBQzNCLEVBQUUsUUFBUSxlQUFpQjtnQkFDM0IsRUFBRSxRQUFRLE1BQU0sRUFBRSxLQUFLLEdBQUs7UUFFNUIsT0FBTyxPQUFPO2VBQ1AsT0FBTztRQUNkLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzs7O1FBS3BDLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLGdCQUFnQjtRQUNqRCxHQUFHLGNBQWMsS0FBSztlQUVmLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7UUFFdkIsT0FBTyxlQUNILGNBQU07O21CQUFRO1VBQ2QsY0FBTSxLQUFJOzttQkFBVTs7UUFFeEIsY0FBYyxPQUFPO1FBQ3JCLE9BQU8sUUFDSCxTQUFTLFNBQVMsR0FBRyxXQUNyQixzQkFBdUI7Y0FFekIsT0FBTyxNQUFNO1FBRWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZUFBZTtRQUN2QyxFQUFFLE1BQU0sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixRQUFRLFNBQVMsRUFBRSxPQUFPO2NBRXhCLEVBQUUsS0FBSztRQUVULEVBQUUsUUFBUSxPQUFPO1FBQ2pCLEVBQUU7UUFFRixPQUFRLEVBQUUsTUFBTTtRQUNoQixRQUFRLEtBQUssTUFBTSxJQUFJO1FBQ3ZCLFFBQVEsS0FBSyxNQUFNO2dCQUVuQixFQUFFLE9BQU8sT0FBTyxNQUFNLE9BQVMsTUFBTSxPQUFPO1FBRTVDLEVBQUUsUUFBUSxPQUFPLEtBQUs7UUFDdEIsRUFBRTtnQkFFRixFQUFFLE9BQU8sT0FBTyxNQUFNLE9BQVMsTUFBTSxVQUFVO1FBRS9DLE9BQU8sT0FBTztlQUNQLE9BQU87UUFDZCxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTs7Ozs7Ozs7UUFNcEMsT0FBTztRQUNQLE9BQU8sTUFBTSxLQUFLLEtBQUs7UUFFdkIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUU1QixHQUFHLGNBQWMsTUFBTSxLQUFLLEtBQUssZ0JBQWdCO1FBQ2pELEdBQUcsY0FBYyxLQUFLO2VBRWYsT0FBTyxTQUFTO2VBQ2hCLE9BQU8sU0FBUztRQUV2QixPQUFPLGVBQ0gsY0FBTTs7bUJBQVE7VUFDZCxjQUFNLEtBQUk7O21CQUFVOztRQUV4QixjQUFjLE9BQU87UUFDckIsT0FBTyxRQUNILFNBQVMsU0FBUyxHQUFHLFdBQ3JCLHNCQUF1QjtjQUV6QixPQUFPLE1BQU07UUFFZixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTyxlQUFlO1FBQ3ZDLEVBQUUsTUFBTSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ3RCLFFBQVEsU0FBUyxFQUFFLE9BQU87Y0FFeEIsRUFBRSxLQUFLO2tCQUVHLEVBQUUsZUFBYixZQUFFLFlBQUUsWUFBRTs7UUFDUCxlQUFVLElBQUU7Z0JBRVosRUFBRSxNQUFNLE1BQU0sRUFBYyxJQUFFO2dCQUM5QixFQUFFLGFBQWEsTUFBTSxFQUFPLElBQUUsTUFBSTtnQkFDbEMsRUFBRSxNQUFNLE1BQU0sRUFBYyxJQUFFO2dCQUM5QixFQUFFLGFBQWEsTUFBTSxFQUFPLElBQUU7Z0JBQzlCLEVBQUUsTUFBTSxNQUFNLEtBQWMsTUFBSTtnQkFDaEMsRUFBRSxhQUFhLE1BQU0sS0FBTyxJQUFFLE1BQUk7UUFFbEMsT0FBTyxPQUFPO2VBQ1AsT0FBTztRQUNkLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzs7O1FBSXBDLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLGdCQUFnQjtRQUNqRCxHQUFHLGNBQWMsS0FBSztlQUVmLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7UUFFdkIsT0FBTyxlQUNILGNBQU07O21CQUFRO1VBQ2QsY0FBTSxLQUFJOzttQkFBVTs7UUFFeEIsY0FBYyxPQUFPO1FBQ3JCLE9BQU8sUUFDSCxTQUFTLFNBQVMsR0FBRyxXQUNyQixzQkFBdUI7Y0FFekIsT0FBTyxNQUFNO1FBRWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZUFBZTtRQUN2QyxFQUFFLE1BQU0sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixRQUFRLFNBQVMsRUFBRSxPQUFPO2NBRXhCLEVBQUUsS0FBSztnQkFFVCxFQUFFLGFBQWEsV0FBYTtnQkFDNUIsRUFBRSxNQUFNLFdBQW9CO1FBRTVCLE9BQU8sT0FBTztlQUNQLE9BQU87UUFDZCxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTs7OztRQUlwQyxRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTyxlQUFlO1FBQ3ZDLEVBQUUsTUFBTSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ3RCLFFBQVEsU0FBUyxFQUFFLE9BQU87Y0FFeEIsRUFBRSxLQUFLO2dCQUVULEVBQUUsTUFBTSxXQUFvQjtnQkFDNUIsRUFBRSxhQUFhLFdBQWE7Ozs7UUFJNUIsT0FBTztRQUNQLE9BQU8sTUFBTSxLQUFLLEtBQUs7UUFFdkIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUU1QixHQUFHLGNBQWMsTUFBTSxLQUFLLEtBQUssZ0JBQWdCO1FBQ2pELEdBQUcsY0FBYyxLQUFLO2VBRWYsT0FBTyxTQUFTO2VBQ2hCLE9BQU8sU0FBUztRQUV2QixPQUFPLGVBQ0gsY0FBTTs7bUJBQVE7VUFDZCxjQUFNLEtBQUk7O21CQUFVOztRQUV4QixjQUFjLE9BQU87UUFDckIsT0FBTyxRQUNILFNBQVMsU0FBUyxHQUFHLFdBQ3JCLHNCQUF1QjtjQUV6QixPQUFPLE1BQU07UUFFZixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTyxlQUFlO1FBQ3ZDLEVBQUUsTUFBTSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ3RCLFFBQVEsU0FBUyxFQUFFLE9BQU87Y0FFeEIsRUFBRSxLQUFLO2dCQUVULEVBQUUsYUFBYSxXQUFhO1FBRTVCLEVBQUUsSUFBSSxFQUFFO2dCQUNSLEVBQUUsTUFBTSxXQUFvQjtnQkFDNUIsRUFBRSxhQUFhLFdBQWE7UUFFNUIsRUFBRSxJQUFJLEVBQUU7Z0JBQ1IsRUFBRSxNQUFNLFdBQW9CO2dCQUM1QixFQUFFLGFBQWEsV0FBYTtRQUU1QixFQUFFLElBQUksRUFBRTtnQkFDUixFQUFFLE1BQU0sV0FBb0I7Z0JBQzVCLEVBQUUsYUFBYSxXQUFhO1FBRTVCLEVBQUUsSUFBSSxFQUFFO2dCQUNSLEVBQUUsTUFBTSxXQUFvQjtnQkFDNUIsRUFBRSxhQUFhLFdBQWE7UUFFNUIsT0FBTyxPQUFPO2VBQ1AsT0FBTztRQUNkLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzs7O1FBSXBDLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLGdCQUFnQjtRQUNqRCxHQUFHLGNBQWMsS0FBSztlQUVmLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7UUFFdkIsT0FBTyxlQUNILGNBQU07O21CQUFRO1VBQ2QsY0FBTSxLQUFJOzttQkFBVTs7UUFFeEIsY0FBYyxPQUFPO1FBQ3JCLE9BQU8sUUFDSCxTQUFTLFNBQVMsR0FBRyxXQUNyQixzQkFBdUI7Y0FFekIsT0FBTyxNQUFNO1FBRWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZUFBZTtRQUN2QyxFQUFFLE1BQU0sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixRQUFRLFNBQVMsRUFBRSxPQUFPO2NBRXhCLEVBQUUsS0FBSztRQUVULEVBQUUsS0FBSyxFQUFFO2dCQUVULEVBQUUsYUFBYSxVQUFZO2dCQUMzQixFQUFFLE1BQU0sVUFBbUI7UUFFM0IsT0FBTyxPQUFPO2VBQ1AsT0FBTztRQUNkLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzs7O1FBSXBDLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLGdCQUFnQjtRQUNqRCxHQUFHLGNBQWMsS0FBSztlQUVmLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7UUFFdkIsT0FBTyxlQUNILGNBQU07O21CQUFRO1VBQ2QsY0FBTSxLQUFJOzttQkFBVTs7UUFFeEIsY0FBYyxPQUFPO1FBQ3JCLE9BQU8sUUFDSCxTQUFTLFNBQVMsR0FBRyxXQUNyQixzQkFBdUI7Y0FFekIsT0FBTyxNQUFNO1FBRWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZUFBZTtRQUN2QyxFQUFFLE1BQU0sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixRQUFRLFNBQVMsRUFBRSxPQUFPO2NBRXhCLEVBQUUsS0FBSztRQUVULEVBQUU7Z0JBRUYsRUFBRSxNQUFNLE9BQVM7NkJBRUwsRUFBRTs7O1lBQVY7b0JBQ0EsS0FBSyxNQUFNLEtBQU8sRUFBRSxRQUFRLE1BQU07b0JBQ2xDLEtBQUssTUFBTSxLQUFPOztRQUV0QixFQUFFO1FBRUYsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEdBQUcsTUFBTTtnQkFDN0IsSUFBSSxTQUFTLGFBQWM7UUFFM0IsT0FBTyxPQUFPO2VBQ1AsT0FBTztRQUNkLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzs7O1FBSXBDLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLGdCQUFnQjtRQUNqRCxHQUFHLGNBQWMsS0FBSztlQUVmLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7UUFFdkIsT0FBTyxlQUNILGNBQU07O21CQUFRO1VBQ2QsY0FBTSxLQUFJOzttQkFBVTs7UUFFeEIsY0FBYyxPQUFPO1FBQ3JCLE9BQU8sUUFDSCxTQUFTLFNBQVMsR0FBRyxXQUNyQixzQkFBdUI7Y0FFekIsT0FBTyxNQUFNO1FBRWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZUFBZTtRQUN2QyxFQUFFLE1BQU0sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixRQUFRLFNBQVMsRUFBRSxPQUFPO2NBRXhCLEVBQUUsS0FBSztnQkFFVCxFQUFFLE1BQU0sT0FBUztnQkFDakIsRUFBRSxNQUFNLEdBQUcsT0FBUztnQkFDcEIsRUFBRSxRQUFRLE1BQU0sRUFBRSxNQUFNLEdBQUcsV0FBVyxLQUFPO2dCQUM3QyxFQUFFLFFBQVEsTUFBTSxPQUFTO1FBRXpCLEVBQUU7UUFFRixNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sR0FBRyxNQUFNO2dCQUM3QixJQUFJLFNBQVMsS0FBTTtRQUVuQixTQUFTLEVBQUUsUUFBUSxNQUFNLEVBQUUsTUFBTSxHQUFHO2NBRWxDLEVBQUUsZ0JBQWdCLFFBQVE7Z0JBRTVCLEVBQUUsTUFBTSxPQUFTO2dCQUNqQixFQUFFLE1BQU0sR0FBRyxTQUFXO2dCQUN0QixFQUFFLE1BQU0sR0FBRyxPQUFTO2dCQUNwQixFQUFFLFFBQVEsTUFBTSxFQUFFLE1BQU0sR0FBRyxXQUFXLEtBQU87Z0JBQzdDLEVBQUUsUUFBUSxNQUFNLE9BQVM7UUFFekIsRUFBRTtRQUVGLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxHQUFHLE1BQU07Z0JBQzdCLElBQUksU0FBUyxLQUFNO1FBRW5CLFNBQVMsRUFBRSxRQUFRLE1BQU0sRUFBRSxNQUFNLEdBQUc7Y0FFbEMsRUFBRSxnQkFBZ0IsUUFBUTtnQkFFNUIsRUFBRSxNQUFNLEdBQUcsU0FBVztnQkFDdEIsRUFBRSxNQUFNLEdBQUcsT0FBUztnQkFDcEIsRUFBRSxRQUFRLE1BQU0sT0FBUztRQUV6QixPQUFPLE9BQU87ZUFDUCxPQUFPO1FBQ2QsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Ozs7UUFJcEMsT0FBUTtRQUNSLE9BQVEsTUFBTSxLQUFLLEtBQUs7UUFDeEIsUUFBUSxNQUFNLEtBQUssS0FBSztRQUV4QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBRTVCLEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxnQkFBZ0I7UUFDakQsR0FBRyxjQUFjLEtBQUs7UUFDdEIsR0FBRyxjQUFjLE1BQU07ZUFFaEIsT0FBTyxTQUFTO3FCQUNWLEtBQUs7OztZQUFkO21CQUE4QixPQUFPLFNBQVM7O1FBRWxELE9BQU8sZUFDSCxjQUFNOzttQkFBUTtVQUNkLGNBQU0sS0FBSTs7bUJBQVU7O1FBRXhCLGNBQWMsT0FBTztRQUNyQixPQUFPLFFBQ0gsU0FBUyxTQUFTLEdBQUcsV0FDckIsc0JBQXVCO2NBRXpCLE9BQU8sTUFBTTtRQUVmLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPLGVBQWU7UUFDdkMsRUFBRSxNQUFNLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDdEIsUUFBUSxTQUFTLEVBQUUsT0FBTztjQUV4QixFQUFFLEtBQUs7UUFFVCxjQUFlO1FBQ2YsZUFBZTs2QkFFSCxFQUFFOzs7WUFBVjtnQkFDRyxLQUFLLFNBQVE7O2dCQUFPLGNBQWU7O2dCQUNuQyxLQUFLLFNBQVE7O2dCQUFRLGVBQWU7OztpQkFFMUMsZ0JBQWUsTUFBUztpQkFDeEIsaUJBQWdCLE1BQVE7UUFFekIsV0FBVzs2QkFFQyxZQUFZOzs7WUFBcEI7Z0JBQ0csS0FBSyxRQUFPOztnQkFDWCxXQUFXO2dCQUNYOzs7aUJBRVAsYUFBWSxNQUFRO1FBRXJCLEVBQUUsUUFBUSxPQUFPLEVBQUUsUUFBUSxNQUFNLFFBQVE7Y0FFdkMsRUFBRSxnQkFBZ0IsUUFBUTtjQUUxQixFQUFFLGdCQUFnQixRQUFRLGFBQWE7UUFFekM7UUFDQSxPQUFXLFFBQVE7UUFDbkIsUUFBUSxnQkFBTzs7bUJBQVksU0FBUyxLQUFLLEtBQUssS0FBSzs7Y0FFakQsRUFBRSxxQkFBcUIsU0FBUztRQUVsQyxRQUFRLE1BQU07Z0JBRWQsR0FBRyxhQUFhLEtBQUssUUFBVztnQkFDaEMsR0FBRyxhQUFhLE1BQU0sUUFBVTtnQkFDaEMsRUFBRSxVQUFZO1FBRWQsT0FBTyxPQUFPO2VBQ1AsT0FBTztRQUNkLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzs7O1FBSXBDLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLGdCQUFnQjtRQUNqRCxHQUFHLGNBQWMsS0FBSztlQUVmLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7UUFFdkIsT0FBTyxlQUNILGNBQU07O21CQUFRO1VBQ2QsY0FBTSxLQUFJOzttQkFBVTs7UUFFeEIsY0FBYyxPQUFPO1FBQ3JCLE9BQU8sUUFDSCxTQUFTLFNBQVMsR0FBRyxXQUNyQixzQkFBdUI7Y0FFekIsT0FBTyxNQUFNO1FBRWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZUFBZTtRQUN2QyxFQUFFLE1BQU0sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixRQUFRLFNBQVMsRUFBRSxPQUFPO2NBRXhCLEVBQUUsS0FBSztRQUVULGFBQWEsRUFBRSxNQUFNO1FBQ3JCLFNBQVksRUFBRSxRQUFRLE1BQU0sV0FBVztjQUVyQyxFQUFFLGdCQUFnQixRQUFRO2dCQUU1QixFQUFFLE1BQU0sR0FBRyxTQUFXO2dCQUN0QixFQUFFLGNBQWMsTUFBUTtjQUV0QixFQUFFLEtBQUs7Z0JBRVQsRUFBRSxNQUFNLE9BQVM7aUJBQ2hCLEVBQUUsTUFBTSxPQUFNLFlBQWM7Z0JBQzdCLEVBQUUsTUFBTSxHQUFHLFNBQVc7Z0JBQ3RCLEVBQUUsTUFBTSxHQUFHLE9BQVM7Z0JBQ3BCLEVBQUUsV0FBVyxNQUFRO2dCQUNyQixFQUFFLFFBQVEsTUFBTSxPQUFTO1FBRXpCLE9BQU8sT0FBTztlQUNQLE9BQU87UUFDZCxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTs7OztRQUlwQyxPQUFPO1FBQ1A7UUFFQSxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBRTVCLEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxnQkFBZ0I7YUFFN0MsSUFBSyxPQUFJOztZQUNULE9BQU8sTUFBTSxLQUFLLFlBQVk7WUFDOUIsR0FBRyxjQUFjLFdBQVcsVUFBVTtZQUN0QyxNQUFNLEtBQUs7OzZCQUVIOzs7WUFBUjttQkFBdUIsT0FBTyxTQUFTOztlQUNwQyxPQUFPLFNBQVM7UUFFdkIsT0FBTyxlQUNILGNBQU07O21CQUFRLE1BQU07VUFDcEIsY0FBTSxLQUFJOzttQkFBVTs7UUFFeEIsY0FBYyxPQUFPO1FBQ3JCLE9BQU8sUUFDSCxTQUFTLFNBQVMsR0FBRyxXQUNyQixzQkFBdUI7Y0FFekIsT0FBTyxNQUFNLE1BQU07UUFFckIsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZUFBZTtRQUN2QyxFQUFFLE1BQU0sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixRQUFRLFNBQVMsRUFBRSxPQUFPO2NBRXhCLEVBQUUsS0FBSztRQUVULFFBQVEsRUFBRSxNQUFNLGNBQUs7O21CQUFTLEtBQUs7O1FBRW5DLEVBQUUsUUFBUSxNQUFNLFNBQVMsRUFBRTtRQUMzQixFQUFFLFFBQVEsT0FBTyxFQUFFLE1BQU0sR0FBRztRQUM1QixFQUFFLFFBQVE7UUFFVixPQUFTLEVBQUUsUUFBUSxNQUFNLEVBQUUsS0FBSztRQUNoQyxTQUFTLEVBQUUsUUFBUSxNQUFNLEVBQUU7Y0FFekIsRUFBRSxnQkFBZ0IsUUFBUSxFQUFFLFFBQVE7Z0JBRXRDLEVBQUUsTUFBTSxjQUFLOzttQkFBUyxLQUFLO1dBQVE7Z0JBQ25DLEVBQUUsUUFBUSxNQUFNLEVBQUUsS0FBTztnQkFDekIsRUFBRSxRQUFRLE1BQU0sRUFBRSxhQUFlO2dCQUNqQyxFQUFFLFFBQVEsVUFBVSxLQUFPO2dCQUMzQixFQUFFLFFBQVEsVUFBVSxLQUFPLE1BQU07UUFFakMsT0FBTyxPQUFPO2VBQ1AsT0FBTztRQUNkLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzs7O1FBSXBDLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLGdCQUFnQjtRQUNqRCxHQUFHLGNBQWMsS0FBSztlQUVmLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7UUFFdkIsT0FBTyxlQUNILGNBQU07O21CQUFRO1VBQ2QsY0FBTSxLQUFJOzttQkFBVTs7UUFFeEIsY0FBYyxPQUFPO1FBQ3JCLE9BQU8sUUFDSCxTQUFTLFNBQVMsR0FBRyxXQUNyQixzQkFBdUI7Y0FFekIsT0FBTyxNQUFNO1FBRWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZUFBZTtRQUN2QyxFQUFFLE1BQU0sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixRQUFRLFNBQVMsRUFBRSxPQUFPO2NBRXhCLEVBQUUsS0FBSztRQUVULFlBQVk7UUFDWixXQUFZOzZCQUVJLEVBQUUsUUFBUTthQUFqQjs7WUFBTDtnQkFDZSxVQUFaLEtBQUssUUFBZSxLQUFLLFNBQVE7O2dCQUNoQyxZQUFZO2dCQUNaLFdBQVk7Z0JBQ1o7OztpQkFFUCxhQUFZLE1BQVE7UUFFckIsRUFBRSxRQUFRLE9BQU87Y0FFZixFQUFFLGdCQUFnQixRQUFRO2dCQUU1QixTQUFTLFNBQVc7Z0JBQ3BCLEVBQUUsVUFBWTtnQkFDZCxFQUFFLE9BQU8sV0FBVyxTQUFTLEtBQU87Y0FFbEMsRUFBRSxnQkFBZ0IsUUFBUTtnQkFFNUIsU0FBUyxTQUFXO2dCQUNwQixFQUFFLE9BQU8sV0FBVyxTQUFTLEtBQU87UUFFcEMsT0FBTyxPQUFPO2VBQ1AsT0FBTztRQUNkLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzs7O1FBSXBDLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLGdCQUFnQjtRQUNqRCxHQUFHLGNBQWMsS0FBSztlQUVmLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7UUFFdkIsT0FBTyxlQUNILGNBQU07O21CQUFRO1VBQ2QsY0FBTSxLQUFJOzttQkFBVTs7UUFFeEIsY0FBYyxPQUFPO1FBQ3JCLE9BQU8sUUFDSCxTQUFTLFNBQVMsR0FBRyxXQUNyQixzQkFBdUI7Y0FFekIsT0FBTyxNQUFNO1FBRWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZUFBZTtRQUN2QyxFQUFFLE1BQU0sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixRQUFRLFNBQVMsRUFBRSxPQUFPO2NBRXhCLEVBQUUsS0FBSztRQUVUOzZCQUVnQixFQUFFLFFBQVE7YUFBakI7O1lBQUw7Z0JBQ2UsVUFBWixLQUFLLFFBQWUsS0FBSyxTQUFROztnQkFDaEMsWUFBWSxLQUFLOzs7Z0JBRXpCLFlBQVksT0FBUztRQUVyQixFQUFFLFFBQVEsT0FBTyxZQUFZO1FBRTdCLFFBQVEsRUFBRSxRQUFRO2NBRWhCLEVBQUUsZ0JBQWdCLFFBQVE7Z0JBRTVCLE1BQU0sU0FBVztnQkFDakIsRUFBRSxRQUFRLGVBQWlCLFlBQVk7UUFFdkMsU0FBUyxFQUFFLFFBQVE7Y0FFakIsRUFBRSxnQkFBZ0IsUUFBUTtnQkFFNUIsT0FBTyxTQUFXO2dCQUNsQixFQUFFLFFBQVEsZUFBaUIsWUFBWTtRQUV2QyxRQUFRLEVBQUUsUUFBUTtjQUVoQixFQUFFLGdCQUFnQixRQUFRO2dCQUU1QixNQUFNLFNBQVc7Z0JBQ2pCLEVBQUUsUUFBUSxlQUFpQixZQUFZO1FBRXZDLE9BQU8sT0FBTztlQUNQLE9BQU87UUFDZCxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTs7OztRQXFEcEMsT0FBTztRQUNQLE9BQU8sTUFBTSxLQUFLLEtBQUs7UUFFdkIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUU1QixHQUFHLGNBQWMsTUFBTSxLQUFLLEtBQUssZ0JBQWdCO1FBQ2pELEdBQUcsY0FBYyxLQUFLO2VBRWYsT0FBTyxTQUFTO2VBQ2hCLE9BQU8sU0FBUztRQUV2QixPQUFPLGVBQ0gsY0FBTTs7bUJBQVE7VUFDZCxjQUFNLEtBQUk7O21CQUFVOztRQUV4QixjQUFjLE9BQU87UUFDckIsT0FBTyxRQUNILFNBQVMsU0FBUyxHQUFHLFdBQ3JCLHNCQUF1QjtjQUV6QixPQUFPLE1BQU07UUFFZixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTyxlQUFlO1FBQ3ZDLEVBQUUsTUFBTSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ3RCLFFBQVEsU0FBUyxFQUFFLE9BQU87Y0FFeEIsRUFBRSxLQUFLO1FBRVQsRUFBRTtRQUVGLFVBQVUsRUFBRSxRQUFRLE9BQU8sTUFBTSxJQUFJLEVBQUUsUUFBUSxPQUFPLE1BQU0sT0FBTztRQUNuRSxVQUFVLEVBQUUsTUFBTSxHQUFHLE1BQU07Z0JBRTNCLEVBQUUsT0FBTyxPQUFPLFFBQVEsU0FBVyxNQUFNLFNBQVM7UUFFbEQsV0FBVzs4QkFFQyxFQUFFLE1BQU0sR0FBRzs7O1lBQW5CO2dCQUNlLFVBQVosS0FBSzs7Z0JBQ0osV0FBVztnQkFDWDs7O2lCQUVQLGFBQVksTUFBUTtRQUVyQixZQUFZLEVBQUUsUUFBUSxNQUFNLFFBQVE7UUFDcEMsUUFBWSxFQUFFLFFBQVEsTUFBTSxJQUFJLEVBQUUsUUFBUSxNQUFNLEVBQUUsS0FBSyxLQUFLO1FBRTVELEVBQUUsUUFBUSxPQUFPO2NBRWYsRUFBRSxnQkFBZ0IsUUFBUTtRQUU1QixFQUFFO1FBRUYsVUFBVSxFQUFFLFFBQVEsT0FBTyxNQUFNLElBQUksRUFBRSxRQUFRLE9BQU8sTUFBTSxPQUFPO2dCQUVuRSxFQUFFLE9BQU8sT0FBTyxRQUFRLE9BQVMsTUFBTSxTQUFTO2NBRTlDLEVBQUUsZ0JBQWdCLFFBQVEsRUFBRSxNQUFNLEdBQUc7UUFFdkMsRUFBRTtRQUVGLFVBQVUsRUFBRSxRQUFRLE9BQU8sTUFBTSxJQUFJLEVBQUUsUUFBUSxPQUFPLE1BQU0sT0FBTztRQUNuRSxVQUFVLEVBQUUsTUFBTSxHQUFHLE1BQU07Z0JBRTNCLEVBQUUsT0FBTyxPQUFPLFFBQVEsU0FBVyxNQUFNLFNBQVM7UUFFbEQsT0FBTyxPQUFPO2VBQ1AsT0FBTztRQUNkLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzs7O1FBSXBDLE9BQU87UUFDUCxPQUFPLE1BQU0sS0FBSyxLQUFLO1FBRXZCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFFNUIsR0FBRyxjQUFjLE1BQU0sS0FBSyxLQUFLLGdCQUFnQjtRQUNqRCxHQUFHLGNBQWMsS0FBSztlQUVmLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7UUFFdkIsT0FBTyxlQUNILGNBQU07O21CQUFRO1VBQ2QsY0FBTSxLQUFJOzttQkFBVTs7UUFFeEIsY0FBYyxPQUFPO1FBQ3JCLE9BQU8sUUFDSCxTQUFTLFNBQVMsR0FBRyxXQUNyQixzQkFBdUI7Y0FFekIsT0FBTyxNQUFNO1FBRWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZUFBZTtRQUN2QyxFQUFFLE1BQU0sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixRQUFRLFNBQVMsRUFBRSxPQUFPO2NBRXhCLEVBQUUsS0FBSztjQUVQLEVBQUUsZ0JBQWdCLFFBQVEsRUFBRSxNQUFNLEdBQUc7Z0JBRXZDLEVBQUUsTUFBTSxHQUFHLFNBQVc7Z0JBQ3RCLEVBQUUsVUFBWTtjQUVaLEVBQUUsZ0JBQWdCLFFBQVEsRUFBRSxNQUFNLEdBQUc7Z0JBRXZDLEVBQUUsTUFBTSxHQUFHLFNBQVc7Z0JBQ3RCLEVBQUUsVUFBWTtRQUVkLFdBQVc7OEJBRUMsRUFBRSxNQUFNLEdBQUc7OztZQUFuQjtnQkFDZSxVQUFaLEtBQUs7O2dCQUNKLFdBQVc7Z0JBQ1g7OztpQkFFUCxhQUFZLE1BQVE7Y0FFbkIsRUFBRSxnQkFBZ0IsUUFBUTtnQkFFNUIsU0FBUyxTQUFXO2dCQUNwQixFQUFFLFVBQVk7UUFFZCxPQUFPLE9BQU87ZUFDUCxPQUFPO1FBQ2QsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Ozs7UUFLcEMsT0FBTztRQUNQLE9BQU8sTUFBTSxLQUFLLEtBQUs7UUFFdkIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUU1QixHQUFHLGNBQWMsTUFBTSxLQUFLLEtBQUssZ0JBQWdCO1FBQ2pELEdBQUcsY0FBYyxLQUFLO2VBRWYsT0FBTyxTQUFTO2VBQ2hCLE9BQU8sU0FBUztRQUV2QixPQUFPLGVBQ0gsY0FBTTs7bUJBQVE7VUFDZCxjQUFNLEtBQUk7O21CQUFVOztRQUV4QixjQUFjLE9BQU87UUFDckIsT0FBTyxRQUNILFNBQVMsU0FBUyxHQUFHLFdBQ3JCLHNCQUF1QjtjQUV6QixPQUFPLE1BQU07UUFFZixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7UUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTyxlQUFlO1FBQ3ZDLEVBQUUsTUFBTSxPQUFPLEVBQUUsRUFBRSxHQUFHO1FBQ3RCLFFBQVEsU0FBUyxFQUFFLE9BQU87Y0FFeEIsRUFBRSxLQUFLO1FBRVQsRUFBRSxRQUFRLE9BQU87UUFDakIsRUFBRTtRQUVGLE9BQVEsRUFBRSxNQUFNO1FBQ2hCLFFBQVEsS0FBSyxNQUFNLElBQUk7UUFDdkIsUUFBUSxLQUFLLE1BQU07Z0JBRW5CLEVBQUUsT0FBTyxPQUFPLE1BQU0sT0FBUyxNQUFNLE9BQU87UUFFNUMsRUFBRSxRQUFRLE9BQU8sS0FBSztRQUN0QixFQUFFO2dCQUVGLEVBQUUsT0FBTyxPQUFPLE1BQU0sT0FBUyxNQUFNLFVBQVU7UUFFL0MsT0FBTyxPQUFPO2VBQ1AsT0FBTztRQUNkLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNOzs7Ozs7OztRQU1wQyxPQUFPO1FBQ1AsT0FBTyxNQUFNLEtBQUssS0FBSztRQUV2QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsY0FBYyxLQUFLO1FBRXRCLGFBQVEsT0FBTyxRQUFRO2dCQUN2QixLQUFPO1FBRVAsR0FBRyxjQUFjLEtBQUs7UUFFdEIsYUFBUSxPQUFPLFFBQVE7Z0JBQ3ZCLEtBQU87UUFFUCxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTs7OztRQUlwQyxPQUFPO1FBQ1AsT0FBTyxNQUFNLEtBQUssS0FBSztRQUV2QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsY0FBYyxLQUFLO1FBRXRCLGFBQVEsT0FBTyxRQUFRO2dCQUN2QixLQUFPO1FBRVAsR0FBRyxjQUFjLEtBQUs7UUFDdEIsS0FBSyxLQUFLLGVBQWMsS0FBSyxLQUFLLE9BQU87UUFFekMsYUFBUSxPQUFPLFFBQVE7Z0JBQ3ZCLEtBQU87UUFFUCxHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTs7OztRQUlwQyxPQUFPO1FBQ1AsVUFBVSxNQUFNLEtBQUssS0FBSztRQUMxQixVQUFVLE1BQU0sS0FBSyxLQUFLO1FBRTFCLEdBQUcsT0FBTyxNQUFLLFVBQVUsS0FBSyxNQUFNO1FBQ3BDLEdBQUcsVUFBVSxNQUFLLFVBQVU7UUFDNUIsR0FBRyxjQUFjLFFBQVE7UUFFekIsYUFBUSxPQUFPLFFBQVE7Z0JBQ3ZCLEtBQU87UUFFUCxHQUFHLFdBQVcsUUFBUTtRQUN0QixLQUFLLEtBQUssZUFBYyxLQUFLLFFBQVEsUUFBUSxRQUFRLE9BQU87UUFFNUQsR0FBRyxjQUFjLFFBQVE7UUFDekIsYUFBUSxPQUFPLFFBQVE7UUFFdkIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Z0JBRXBDLEtBQU87Ozs7UUFJUCxPQUFPO1FBQ1AsT0FBTyxNQUFNLEtBQUssS0FBSztRQUV2QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBQzVCLEdBQUcsY0FBYyxLQUFLO1FBRXRCLGFBQVEsT0FBTyxRQUFRO2dCQUN2QixLQUFPO1FBRVAsR0FBRyxPQUFPO1FBQ1YsS0FBSyxLQUFLLGVBQWMsS0FBSyxLQUFLLE9BQU87UUFFekMsR0FBRyxjQUFjLEtBQUs7UUFDdEIsYUFBUSxPQUFPLFFBQVE7UUFFdkIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Z0JBRXBDLEtBQU87Ozs7UUFJUCxPQUFPO1FBQ1AsU0FBUyxNQUFNLEtBQUssS0FBSztRQUN6QixTQUFTLE1BQU0sS0FBSyxLQUFLO1FBQ3pCLFVBQVUsTUFBTSxLQUFLLE9BQU87UUFDNUIsVUFBVSxNQUFNLEtBQUssT0FBTztRQUU1QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsUUFBTyxVQUFVO1FBQzlCLEdBQUcsY0FBYyxRQUFRO1FBRXpCLGFBQVEsT0FBTyxRQUFRO2dCQUN2QixLQUFPO1FBRVAsR0FBRyxXQUFXLE9BQU87UUFDckIsS0FBSyxLQUFLLGVBQWMsS0FBSyxPQUFPLFFBQVEsT0FBTyxPQUFPO1FBRTFELEdBQUcsVUFBVSxRQUFPLFVBQVU7UUFDOUIsR0FBRyxjQUFjLFFBQVE7UUFDekIsYUFBUSxPQUFPLFFBQVE7UUFFdkIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07Z0JBRXBDLEtBQU8ifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/search.kode
