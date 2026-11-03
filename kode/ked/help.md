
#shortcuts
##files

    ctrl+s          cmd+s               save
    shift+cmd+s     shift+ctrl+s        save as
    ctrl+r          cmd+r               reload file from disk
    ctrl+n          cmd+n               new file
    ctrl+q   alt+q  cmd+esc             quit
    alt+o                               jump to counterpart
    alt+1                               filepos: previous entry
    alt+2                               filepos: next entry
    cmd+1           ctrl+1              filepos: swap previous
    alt+h                               show filepos history

##views

    alt+m                               menu
    cmd+p           ctrl+p              quicky: project files
    cmd+f           ctrl+f              finder, or searcher if finder is open
    shift+cmd+f     shift+ctrl+f        searcher
    cmd+.           ctrl+.              browse: go to directory
    alt+,                               cursor to previous function
    alt+.                               cursor to next function
    alt+r                               reveal file in dir column
    cmd+i                               differ: status
    cmd+m   cmd+;   ctrl+;              macro
    cmd+\           ctrl+\              toggle dir column
    cmd+'           ctrl+'              toggle function column
    alt+\                               focus dir column
    alt+'                               focus function column
    
##cursors

    ctrl+alt+up     ctrl+alt+down       page up / down
    shift+ctrl+alt+up|down              move 16 lines up / down
    home                                single cursor to indent or line start
    end                                 single cursor to end of line
    ctrl+h                              cursor to start of file
    ctrl+j                              cursor to end of file

    cmd+left        ctrl+left           to selection start, then to indent
    cmd+right       ctrl+right          to selection end, then to line end
    alt+left        alt+right           jump by word / space / punctuation
    shift+up|down|left|right            extend selection by one
    shift+alt+left|right                select by word jump
    shift+cmd+left|right                select to indent / line end
    shift+ctrl+h    shift+ctrl+j        select to start / end of file

    shift+alt+cmd+up                    shift+alt+cmd+down
    shift+alt+cmd+left                  shift+alt+cmd+right
                                        paint: move main cursor, keep others

###multicursors

    cmd+up          ctrl+up             add cursor line up
    cmd+down        ctrl+down           add cursor line down
    shift+cmd+up    shift+ctrl+up       drop cursor above
    shift+cmd+down  shift+ctrl+down     drop cursor below

    alt+up          alt+down            move selection or cursor lines
    shift+alt+up    shift+alt+down      clone selection or cursor lines

##selections

    cmd+a           ctrl+a              select all lines (press again to deselect)
    cmd+l           ctrl+l              select more lines
    shift+cmd+l     shift+ctrl+l        select less lines
    esc                                 clear selections, highlights, cursors

##delete

    delete                              delete backwards
    ctrl+delete     cmd+delete          delete to previous word boundary
    alt+d                               delete to next word boundary
    shift+ctrl+k    entf                delete forwards
    ctrl+k                              delete to end of line

##edit
    tab                                 insert tab
    shift+tab                           deindent selected or cursor lines
    cmd+j                               join lines
    ctrl+x   alt+x  cmd+x               cut 
    ctrl+c   alt+c  cmd+c               copy
    ctrl+v   alt+v  cmd+v               paste
    cmd+z   ctrl+z                      undo
    cmd+y   ctrl+y                      redo
    cmd+3           ctrl+3              insert ascii header over selection
    cmd+/           ctrl+/              toggle comment on lines
    alt+cmd+/       ctrl+alt+/          toggle comment type

##highlights
    cmd+e           ctrl+e              highlight word, go to next highlight
    shift+cmd+e     shift+ctrl+e        highlight word, go to prev highlight
    cmd+d           ctrl+d              select word, add next highlight
    shift+cmd+d     shift+ctrl+d        select word, add prev highlight
    cmd+g           ctrl+g              select word, select next highlight
    shift+cmd+g     shift+ctrl+g        select word, select prev highlight
    alt+cmd+d       alt+ctrl+d          select word, select all highlights

##modes
    alt+3                               salter mode: ascii art headers
    alt+y                               unype mode: unicode type writer
    alt+n           alt+z               novim mode: vi style commands

###novim (alt+n alt+z)

    w  b  e                             next word, previous word, end of word
    W  B  E                             same, but a WORD skips punctuation
    f{char}  t{char}  ;                 find a character, till before it, repeat
    F{char}  T{char}  ,                 the same, searching backwards
    iw  aw  iW  aW                      inner and around word or WORD text objects
    /{pattern}                          open the search strip and highlight matches
    n  N                                jump to the next or previous highlight
    :w  :w {file}                       write the buffer to the file
    :q                                  quit, fail if there are pending changes
    :q!                                 quit discarding pending changes
    :wq                                 write then quit
    :x                                  write only if changed, then quit

###brckts

    alt+cmd+'                           swap ' and " around cursor
    alt+cmd+b                           select delimiters or brackets

####structure
```    
┬ ked
├── edit
│   ├── act
│   │   ├── del
│   │   ├── indent
│   │   ├── insert
│   │   ├── join
│   │   ├── main
│   │   ├── multi
│   │   └── select
│   ├── complete
│   ├── draw
│   ├── editor
│   ├── keys
│   ├── mode
│   │   ├── brckts
│   │   ├── filepos
│   │   ├── novim
│   │   ├── replex
│   │   ├── salter
│   │   └── unype
│   ├── mode
│   ├── specs
│   ├── state
│   └── tool
│       ├── belt
│       ├── belt.md
│       ├── cell
│       ├── edit
│       ├── misc
│       ├── pair
│       ├── salt
│       └── text
├── index
│   ├── indexer
│   ├── index_...
│   └── prjcts
├── theme
│   ├── color
│   ├── icons
│   ├── theme
│   └── theme.noon
├── util
│   ├── fileutil
│   ├── fonts.noon
│   ├── frecent
│   ├── git
│   ├── help
│   ├── img
│   │   ├── png
│   │   ├── rounded
│   │   ├── sircels
│   │   └── squares
│   ├── julia.noon
│   ├── logfile
│   ├── prof
│   ├── session
│   ├── syntax
│   ├── walker
│   └── watcher
└── view
    ├── base
    │   ├── bubble
    │   ├── crumbs
    │   ├── input
    │   ├── knob
    │   ├── scroll
    │   └── view
    ├── colmns
    │   ├── browse                  file browser:
    │   ├── brocol                     folder content
    │   ├── dircol                  column at left edge:
    │   ├── dirtree                    folder structure
    │   ├── diritem                 
    │   ├── droop                   file list used by file history and title crumbs
    │   ├── funcol                  column at right edge:
    │   ├── funtree                    list of functions
    │   ├── quicky                  quick file opener (cmd+p)
    │   └── quicky.noon
    ├── editor
    │   ├── fileeditor
    │   ├── gutter
    │   ├── mapscr
    │   └── mapview
    ├── menu
    │   ├── choices
    │   ├── context
    │   ├── differ                  git status, history, diff, commit
    │   ├── finder                  search in current file
    │   ├── greet                   splash screen
    │   ├── inputchoice
    │   ├── macro
    │   ├── menu
    │   ├── searcher                search in project files
    │   └── searcherfile            header for each searcher file
    ├── screen
    │   ├── cells
    │   ├── screen                  renders cells
    │   └── ttio                    low level terminal io
    └── status
        ├── statusfile
        └── status
 ```       
<!-- ked-colors {"v":1,"hash":"216103610:8351","fg":[[40,4,44,"#2ca1e6"],[40,5,47,"#2ca1e6"],[40,6,61,"#2ca1e6"],[40,7,48,"#2ca1e6"],[40,8,44,"#2ca1e6"],[40,9,59,"#2ca1e6"],[40,10,63,"#2ca1e6"],[40,11,59,"#2ca1e6"],[40,12,62,"#2ca1e6"],[40,13,60,"#2ca1e6"],[40,17,44,"#2ca1e6"],[40,18,61,"#2ca1e6"],[40,19,77,"#2ca1e6"],[40,20,48,"#2ca1e6"],[40,21,63,"#2ca1e6"],[40,22,67,"#2ca1e6"],[40,23,63,"#2ca1e6"],[40,24,65,"#2ca1e6"],[40,25,54,"#2ca1e6"],[40,26,45,"#2ca1e6"],[40,27,57,"#2ca1e6"],[40,28,62,"#2ca1e6"],[40,29,56,"#2ca1e6"],[40,30,61,"#2ca1e6"],[40,34,54,"#2ca1e6"],[40,35,63,"#2ca1e6"],[40,36,77,"#2ca1e6"],[40,37,68,"#2ca1e6"],[40,38,63,"#2ca1e6"],[40,39,61,"#2ca1e6"],[40,41,74,"#2ca1e6"],[40,42,74,"#2ca1e6"],[40,43,74,"#2ca1e6"],[40,44,63,"#2ca1e6"],[40,45,59,"#2ca1e6"],[40,46,67,"#2ca1e6"],[40,47,69,"#2ca1e6"],[40,49,58,"#2ca1e6"],[40,50,59,"#2ca1e6"],[40,51,76,"#2ca1e6"],[40,55,58,"#2ca1e6"],[40,56,60,"#2ca1e6"],[40,57,57,"#2ca1e6"],[40,58,57,"#2ca1e6"],[40,60,70,"#2ca1e6"],[40,61,71,"#2ca1e6"],[40,65,82,"#2ca1e6"],[40,66,57,"#2ca1e6"],[40,67,57,"#2ca1e6"],[40,68,77,"#2ca1e6"],[40,72,56,"#2ca1e6"],[40,73,72,"#2ca1e6"],[40,74,68,"#2ca1e6"],[40,75,55,"#2ca1e6"],[40,76,61,"#2ca1e6"],[40,79,50,"#2ca1e6"],[40,80,73,"#2ca1e6"],[40,81,50,"#2ca1e6"],[40,82,44,"#2ca1e6"],[40,83,44,"#2ca1e6"],[40,84,45,"#2ca1e6"],[40,85,44,"#2ca1e6"],[40,86,44,"#2ca1e6"],[40,87,74,"#2ca1e6"],[40,88,63,"#2ca1e6"],[40,89,59,"#2ca1e6"],[40,92,76,"#2ca1e6"],[40,93,76,"#2ca1e6"],[40,94,71,"#2ca1e6"],[40,95,71,"#2ca1e6"],[40,96,74,"#2ca1e6"],[40,97,74,"#2ca1e6"],[40,98,74,"#2ca1e6"],[40,101,70,"#2ca1e6"],[40,102,71,"#2ca1e6"],[40,103,69,"#2ca1e6"],[40,107,77,"#2ca1e6"],[40,108,74,"#2ca1e6"],[40,109,80,"#2ca1e6"],[40,110,69,"#2ca1e6"],[40,111,82,"#2ca1e6"],[40,112,83,"#2ca1e6"],[40,113,78,"#2ca1e6"],[40,114,68,"#2ca1e6"],[40,115,79,"#2ca1e6"],[40,116,71,"#2ca1e6"],[40,117,55,"#2ca1e6"],[40,118,72,"#2ca1e6"],[40,122,66,"#2ca1e6"],[40,123,69,"#2ca1e6"]],"bg":[]} -->
