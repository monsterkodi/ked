# sue

#### edit▸tool▸sue

    invisible payloads for areas attached to text

#### payload

    ascii in the tag block U+E0021..U+E007E, which is ascii plus 0xE0000

        '!' four decimal length digits json body

    the length makes the body opaque: no escaping needed, and several
    payloads can follow each other. a payload sits before the text it
    describes. tooling drops the tag block before reading a source file
    (kstr.stripTags), so a decorated file compiles like a plain one.

#### area

    { x, y, value }

    x, y    grapheme index in the line, line index, of the text that
            follows the payload, i.e. the top left of the area
    value   [code, cols, lines, data...]

#### codes

    31  fg colour     [31, 10, 2, "#ff8"]
    32  bg colour     [32, -1, 1, "#0f0f0f"]
    33  fg and bg     [33, 5, 1, "#ff0", "#00f"]
    34  style         [34, 5, 1, "u"]                flags b i u s
                      [34, 3, 1, "#ff0", "u"]       coloured underline
    40  line scale    [40, -1, 1, 3]                the line at 3x
    41  open run      [41, -1, 1, 3]                text after it at 3x
    99  close run     [99, -1, 1, 41]               closes a 41

#### geometry

    a value always starts with the code, then the explicit geometry:
    cols is the width in graphemes, lines the height in rows. a negative
    cols reaches to the end of the line, lines is 1 unless the feature
    spans rows. everything after the geometry is the feature's own data.

    marks (40, 41, 99) are positions, not boxes. they write -1 for cols
    and 1 for lines to keep the shape uniform, and the geometry is
    ignored when they are read. marks are never cut by a range.

#### units

    every anchor and width is in graphemes, never in cells. susan maps
    graphemes to cells with cellPositionsForLine.

#### runs

    open and close markers on one line, paired left to right. a stray
    close is ignored, an open without a close runs to the end of the
    line, an open inside an open is ignored. a run is drawn at
    row-(scale-1), so it grows upwards and sits on the line's baseline.
    the cells it covers are blanked, so decorations must skip them.

#### api

    desue        text       -> { text, sue }
    ensue        text sue   -> text
    sueEncode    value      -> symbols
    sueDecode    symbols    -> value
    sueAscii     symbols    -> ascii
    dataOf       value      -> data

    boxForAreaAndLines        area lines        -> box
    boxMinusRange             box range         -> boxes
    rangesCutFromAreasInLines ranges areas lines -> areas
    rangesWithToggledFlag     ranges areas lines flag -> areas
    cellPositionsForLine      lines y runs      -> cells
    runsForLine               areas lines y     -> runs
    areasForColors            colours           -> areas
    adjust                    areas old new     -> areas

#### rules

    pure, no state, plain data, don't change arguments.
