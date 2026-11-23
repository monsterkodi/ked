var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var append, appendCount, appends, choice, e, file, files, first, h, headerY, highlight, i, idx, item, j, keep, lineIndex, lineIndices, lineItem, lines, lineX, lineY, logLines, main, mainHandler, markerX, mid, newDir, newFile, oldDir, oldFile, oldHandler, order, other, otherHandler, r, root, row, s, savedConfig, scroll, second, sfil, text, third, tmp, view, w, widths, x, y

import fs from "fs"
import os from "os"

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

tmp = fs.mkdtempSync(slash.path(os.tmpdir(),'ked-test-'))
process.on('exit',function ()
{
    return fs.rmSync(tmp,{recursive:true,force:true})
})
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L3NlYXJjaC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztPQUFJLFNBQUE7T0FBRyxTQUFBOztPQUNHLFVBQUE7SUFBUztJQUFLOztPQUNMLGFBQVo7O09BQ1ksY0FBWjtPQUFvQixhQUFwQjs7T0FDWSxZQUFaOztPQUNZLGFBQVo7T0FBbUIsYUFBbkI7O09BQ1ksZUFBTjtPQUFlLGVBQWY7O0FBRWIsTUFBTSxHQUFHLFlBQVksTUFBTSxLQUFLLEdBQUcsU0FBUztBQUM1QyxRQUFRLEdBQUc7O1dBQVUsR0FBRyxPQUFPLEtBQUksVUFBVSxLQUFLLE1BQU07Ozs7OztRQU1oRCxPQUFRLE1BQU0sS0FBSyxJQUFJO1FBQ3ZCLE9BQVEsTUFBTSxLQUFLLEtBQUs7UUFDeEIsUUFBUSxNQUFNLEtBQUssS0FBSztRQUV4QixHQUFHLE9BQU8sTUFBSyxVQUFVLEtBQUssTUFBTTtRQUNwQyxHQUFHLFVBQVUsTUFBSyxVQUFVO1FBRTVCLEdBQUcsY0FBYyxNQUFNLEtBQUssS0FBSyxnQkFBZ0I7UUFDakQsR0FBRyxjQUFjLEtBQU07UUFDdkIsR0FBRyxjQUFjLE1BQU07ZUFFaEIsT0FBTyxTQUFTO2VBQ2hCLE9BQU8sU0FBUztlQUNoQixPQUFPLFNBQVM7UUFFdkIsT0FBTyxlQUNILGNBQU07O21CQUFRO1VBQ2QsY0FBTSxLQUFJOzttQkFBVTs7UUFFeEIsY0FBYyxPQUFPO1FBQ3JCLE9BQU8sUUFDSCxTQUFTLFNBQVMsR0FBRyxXQUNyQixzQkFBdUI7Y0FFekIsT0FBTyxNQUFNO1FBRWYsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO1FBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZUFBZTtRQUN2QyxFQUFFLE1BQU0sT0FBTyxFQUFFLEVBQUUsR0FBRztRQUN0QixRQUFRLFNBQVMsRUFBRSxPQUFPO1FBRTFCLGNBQWM7UUFDZCxTQUFTLEVBQUUsUUFBUSxPQUFPLEtBQUssRUFBRTtRQUNqQyxFQUFF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
//# sourceURL=../../../kode/ked/test/search.kode
