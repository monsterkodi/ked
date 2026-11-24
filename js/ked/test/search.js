var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var append, appendCount, appends, choice, e, file, files, h, headerY, highlight, i, idx, item, j, keep, lineIndex, lineIndices, lineItem, lines, lineX, lineY, logLines, main, mainHandler, markerX, mid, newDir, newFile, oldDir, oldFile, oldHandler, order, other, otherHandler, r, root, row, s, savedConfig, scroll, second, sfil, text, third, tmp, view, w, widths, x, y

import fs from "fs"

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import testdir from "../../kxk/testdir.js"

import editor from "../edit/editor.js"

import harness from "../util/harness.js"
import config from "../util/config.js"

import theme from "../theme/theme.js"

import kacher from "../index/kacher.js"
import prjcts from "../index/prjcts.js"

import replacer from "../view/menu/replacer.js"
import searcher from "../view/menu/searcher.js"

tmp = testdir()
toExport["searcher"] = async function ()
{
    await section("a multi file search appends its results once", async function ()
    {
        root = slash.path(tmp,'ked-searcher-append')
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
        root = slash.path(tmp,'ked-searcher-threshold')
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
        root = slash.path(tmp,'ked-searcher-gutter')
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
        root = slash.path(tmp,'ked-searcher-headers')
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
        root = slash.path(tmp,'ked-searcher-selected')
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
        root = slash.path(tmp,'ked-replacer-split')
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
        ;[x,y,w,h] = r.arrangeRect()
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
        root = slash.path(tmp,'ked-replacer-focus')
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
        root = slash.path(tmp,'ked-replacer-tab')
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
        root = slash.path(tmp,'ked-replacer-type')
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
        root = slash.path(tmp,'ked-replacer-separators')
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
        for (var _d_ = 0; _d_ < list3.length; _d_++)
        {
            sfil = list3[_d_]
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
        root = slash.path(tmp,'ked-replacer-exclude')
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
        root = slash.path(tmp,'ked-replacer-submit')
        main = slash.path(root,'main.kode')
        other = slash.path(root,'other.kode')
        fs.rmSync(root,{recursive:true,force:true})
        fs.mkdirSync(root,{recursive:true})
        fs.writeFileSync(slash.path(root,'package.json'),'{}')
        fs.writeFileSync(main,'if if\nif b\nif c\n')
        fs.writeFileSync(other,'if d\n')
        delete prjcts.projects[root]
        var list4 = [main,other]
        for (var _e_ = 0; _e_ < list4.length; _e_++)
        {
            file = list4[_e_]
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
        for (var _f_ = 0; _f_ < list5.length; _f_++)
        {
            sfil = list5[_f_]
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
        for (var _10_ = 0; _10_ < list6.length; _10_++)
        {
            item = list6[_10_]
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
        root = slash.path(tmp,'ked-replacer-reset')
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
        root = slash.path(tmp,'ked-replacer-order')
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
        for (var _11_ = 0; _11_ < list7.length; _11_++)
        {
            file = list7[_11_]
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
        root = slash.path(tmp,'ked-replacer-line-exclude')
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
        root = slash.path(tmp,'ked-replacer-line-repeat')
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
        choice = r.choices.current()
        await r.onChoicesAction('space',choice)
        compare(choice.excluded,true)
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
        root = slash.path(tmp,'ked-replacer-theme')
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
        for (var _14_ = 0; _14_ < list10.length; _14_++)
        {
            item = list10[_14_]
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
        root = slash.path(tmp,'ked-replacer-click')
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
        for (var _15_ = 0; _15_ < list11.length; _15_++)
        {
            item = list11[_15_]
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
        root = slash.path(tmp,'ked-replacer-selected')
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
        root = slash.path(tmp,'ked-kacher-cache')
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
        root = slash.path(tmp,'ked-kacher-change')
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
        root = slash.path(tmp,'ked-kacher-rename')
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
        root = slash.path(tmp,'ked-kacher-delete')
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
        root = slash.path(tmp,'ked-kacher-folder-rename')
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L3NlYXJjaC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztPQUFJLFNBQUE7O09BQ00sVUFBQTtJQUFTO0lBQUs7O09BQ0wsY0FBVDs7T0FDUyxhQUFaOztPQUNZLGNBQVo7T0FBb0IsYUFBcEI7O09BQ1ksWUFBWjs7T0FDWSxhQUFaO09BQW1CLGFBQW5COztPQUNZLGVBQU47T0FBZSxlQUFmOztBQUViLE1BQU07Ozs7O1FBTUUsT0FBUSxNQUFNLEtBQUssSUFBSTtRQUN2QixPQUFRLE1BQU0sS0FBSyxLQUFLO1FBQ3hCLFFBQVEsTUFBTSxLQUFLLEtBQUs7UUFFeEIsR0FBRyxPQUFPLE1BQUssVUFBVSxLQUFLLE1BQU07UUFDcEMsR0FBRyxVQUFVLE1BQUssVUFBVTtRQUU1QixHQUFHLGNBQWMsTUFBTSxLQUFLLEtBQUssZ0JBQWdCO1FBQ2pELEdBQUcsY0FBYyxLQUFNO1FBQ3ZCLEdBQUcsY0FBYyxNQUFNO2VBRWhCLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7ZUFDaEIsT0FBTyxTQUFTO1FBRXZCLE9BQU8sZUFDSCxjQUFNOzttQkFBUTtVQUNkLGNBQU0sS0FBSTs7bUJBQVU7O1FBRXhCLGNBQWMsT0FBTztRQUNyQixPQUFPLFFBQ0gsU0FBUyxTQUFTLEdBQUcsV0FDckIsc0JBQXVCO2NBRXpCLE9BQU8sTUFBTTtRQUVmLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztRQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPLGVBQWU7UUFDdkMsRUFBRSxNQUFNLE9BQU8sRUFBRSxFQUFFLEdBQUc7UUFDdEIsUUFBUSxTQUFTLEVBQUUsT0FBTztRQUUxQixjQUFjO1FBQ2QsU0FBUyxFQUFFLFFBQVEsT0FBTyxLQUFLLEVBQUU7UUFDakMsRUFBRSxRQUFRLG1CQUFVLE9BQU07O1lBQ3RCLGVBQWU7bUJBQ2YsT0FBTyxNQUFNOztjQUVmLEVBQUUsS0FBSztRQUVHLFFBQVosWUFBYztRQUNDLFFB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
//# sourceURL=../../../kode/ked/test/search.kode
