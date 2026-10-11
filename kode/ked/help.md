###
    ███   ███  ████████  ███      ████████
    ███   ███  ███       ███      ███   ███
    █████████  ███████   ███      ████████
    ███   ███  ███       ███      ███
    ███   ███  ████████  ███████  ███
###

# files

    ctrl+s          cmd+s           save
    shift+cmd+s     shift+ctrl+s    save as (todo)
    ctrl+r          cmd+r           reload file from disk
    ctrl+n          cmd+n           new file
    ctrl+q   alt+q  cmd+esc         quit
    alt+o                           jump to counterpart
    alt+1                           filepos: previous entry
    alt+2                           filepos: next entry
    cmd+1                           filepos: swap previous
    alt+h                           show filepos history

# views

    alt+m                           menu
    cmd+p           ctrl+p          quicky: project files
    cmd+f           ctrl+f          finder, or searcher if finder open
    shift+cmd+f     shift+ctrl+f    searcher
    cmd+.           ctrl+.          browse: go to directory
    alt+,                           cursor to previous function
    alt+.                           cursor to next function
    alt+r                           reveal file in dir column
    cmd+\           ctrl+\          toggle dir column
    cmd+'           ctrl+'          toggle function column
    cmd+i                           differ: status
    cmd+m   cmd+;   ctrl+;          macro

# cursor

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

# multiple cursors

    cmd+up          ctrl+up             add cursor line up
    cmd+down        ctrl+down           add cursor line down
    shift+cmd+up    shift+ctrl+up       drop cursor above
    shift+cmd+down  shift+ctrl+down     drop cursor below

    alt+up          alt+down            move selection or cursor lines
    shift+alt+up    shift+alt+down      clone selection or cursor lines

# selection

    cmd+a           ctrl+a              select all lines (press again to deselect)
    cmd+l           ctrl+l              select more lines
    shift+cmd+l     shift+ctrl+l        select less lines
    esc                                 clear selections, highlights, cursors

# delete

    delete                              delete backwards
    ctrl+delete     cmd+delete          delete to previous word boundary
    alt+d                               delete to next word boundary
    shift+ctrl+k    entf                delete forwards
    ctrl+k                              delete to end of line

# edit

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

# highlights

    cmd+e           ctrl+e              highlight word, go to next highlight
    shift+cmd+e     shift+ctrl+e        highlight word, go to prev highlight
    cmd+d           ctrl+d              select word, add next highlight
    shift+cmd+d     shift+ctrl+d        select word, add prev highlight
    cmd+g           ctrl+g              select word, select next highlight
    shift+cmd+g     shift+ctrl+g        select word, select prev highlight
    alt+cmd+d       alt+ctrl+d          select word, select all highlights

# modes

    alt+3                               salter mode: ascii art headers
    alt+y                               unype mode: unicode type writer
    alt+u                               uniko mode
    alt+;                               vimple mode
    alt+r                               record mode (shadowed, see below)

# mode: brckts (auto, on selection)

    alt+cmd+'                           swap ' and " around cursor
    alt+cmd+b                           select delimiters or brackets

# notes

    ctrl+j is bound twice in keys.kode: the first match wins, so
    it moves to end of file and never joins lines. Use cmd+j.

    alt+r is bound in both ked.kode and keys.kode. ked.kode wins,
    so it reveals the file in the dir column and never toggles
    record mode.

    cmd+o and ctrl+o are listed in ked.kode but have no action.