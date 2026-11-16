
# shortcuts
## files

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

## views

    alt+m                               menu
    cmd+p           ctrl+p              quicky: project files
    cmd+f           ctrl+f              finder, or searcher if finder is open
    shift+cmd+f     shift+ctrl+f        searcher
    shift+cmd+v     shift+ctrl+v        clippo: clipboard history
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
    
## cursors

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

### multicursors

    cmd+up          ctrl+up             add cursor line up
    cmd+down        ctrl+down           add cursor line down
    shift+cmd+up    shift+ctrl+up       drop cursor above
    shift+cmd+down  shift+ctrl+down     drop cursor below

    alt+up          alt+down            move selection or cursor lines
    shift+alt+up    shift+alt+down      clone selection or cursor lines

## selections

    cmd+a           ctrl+a              select all lines (press again to deselect)
    cmd+l           ctrl+l              select more lines
    shift+cmd+l     shift+ctrl+l        select less lines
    esc                                 clear selections, highlights, cursors

## delete

    delete                              delete backwards
    ctrl+delete     cmd+delete          delete to previous word boundary
    alt+d                               delete to next word boundary
    shift+ctrl+k    entf                delete forwards
    ctrl+k                              delete to end of line

## edit
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

## highlights
    cmd+e           ctrl+e              highlight word, go to next highlight
    shift+cmd+e     shift+ctrl+e        highlight word, go to prev highlight
    cmd+d           ctrl+d              select word, add next highlight
    shift+cmd+d     shift+ctrl+d        select word, add prev highlight
    cmd+g           ctrl+g              select word, select next highlight
    shift+cmd+g     shift+ctrl+g        select word, select prev highlight
    alt+cmd+d       alt+ctrl+d          select word, select all highlights

## brckts

    alt+cmd+'                           swap ' and " around cursor
    alt+cmd+b                           select delimiters or brackets

# modes
    alt+3                               salter mode: ascii art headers
    alt+y                               unype mode: unicode type writer
    alt+n           alt+z               novim mode: vi style commands
        
## novim

    w  b  e                             next word, previous word, end of word
    W  B  E                             same, but a WORD skips punctuation
    f{char}  t{char}  ;                 find a character, till before it, repeat
    F{char}  T{char}  ,                 the same, searching backwards
    iw  aw  iW  aW                      inner and around word or WORD text objects

#### visual

    v  V  ctrl+v                       select by char, line, block
    r{char}                             replace the selected chars with char
    gv                                  reselect the last visual area

#### replace

    R                                   replace characters while typing

#### case

    gu{motion}                          lowercase text
    gU{motion}                          uppercase text
    g~{motion}                          toggle case
    guu  gUU  g~~                       current line

#### search
    
    /{pattern}                          search forward and highlight matches
    ?{pattern}                          search backward and highlight matches
    n  N                                jump in or against the search direction
    up  down                            previous and next search history entry

#### registers

    "{register}                         use a register for the next yank, delete, or put
    "a ... "z                           named registers
    "A ... "Z                           uppercase names append
    "0  "1-"9                           last yank, delete history
    "-  "_                              small delete, black hole
    "/  ":                              last search, last ex command

#### macros

    q{register}                         start recording into a named register
    q{Register}                         append to an existing macro
    q                                   stop recording
    @{register}                         execute a register as keys
    @@                                  repeat the last executed register
    3@a                                 execute a macro three times
    
#### write & quit
    :w  :w {file}                       write the buffer to the file
    :q                                  quit, fail if there are pending changes
    :q!                                 quit discarding pending changes
    :wq                                 write then quit
    :x                                  write only if changed, then quit
    up  down                            previous and next ex command history entry

#### edit
    
    :e  :e {file}                       edit a file, fail on unsaved changes
    :e!  :e! {file}                     edit a file, discarding changes
    
#### substitute
    
    :s/old/new/[gic]                    substitute on the current line
    :%s/old/new/[gic]                   substitute in the whole buffer
    :'<,'>s/old/new/[gic]               substitute in the selected lines
    :5,9s/old/new/[gic]                 substitute in a line range

    :s/old/[gic]  :%s/old/[gic]         select all matches, one cursor per match
    :%s/old//[gic]                      delete matches (empty replacement)

    [gic]
        g                               substitute all occurences in line
        i                               ignore case (also when selecting)
        c                               ask for confirmation

#### global
    
    :g/pat/<cmd>                        run cmd on matching lines
    :g!/pat/<cmd>       :v/pat/<cmd>    run cmd on non-matching lines

    <cmd> is one of
        d                               delete the line
        s/old/new/[gic]                 substitute on the line
        normal keys                     run normal-mode keys on the line
        g/pat/cmd  :v/pat/cmd           nest another global

#### normal
    :[range]normal keys                 run normal keys on each range line
    
#### delete    
    :[range]d                           delete the lines in the range

# structure
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
    │   ├── choices
    │   ├── clippo                  clipboard history
    │   ├── context
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