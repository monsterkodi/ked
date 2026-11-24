# kulur unicode classes

Characters outside of words get a class from the `UNICODE` table in `kulur.kode`.
Every key below becomes `text unicode <key>`. Sets win over ranges, so the `kode`
symbols keep their class although they sit inside the `geometric`, `box` and
`arrow` ranges. In languages whose handlers use the `kode` symbols (kode, kim, kua,
coffee, js, ts, nim, lua) they stay `punct`. Characters that are in no set and no
range are `text unicode` from code 2000 up and `punct` below.

Long ranges show their first and last 16 characters.

## kode

■ □ ▪ ◆ ● ◯ ▸ ➜ ⮐ …

## greek

0x0370 - 0x03ff  Ͱ ͱ Ͳ ͳ ʹ ͵ Ͷ ͷ ͺ ͻ ͼ ͽ Ϳ ΄ ΅ Ά ... ϰ ϱ ϲ ϳ ϴ ϵ ϶ Ϸ ϸ Ϲ Ϻ ϻ ϼ Ͻ Ͼ Ͽ
0x1f00 - 0x1fff  ἀ ἁ ἂ ἃ ἄ ἅ ἆ ἇ Ἀ Ἁ Ἂ Ἃ Ἄ Ἅ Ἆ Ἇ ... Ῥ ῭ ΅ ῲ ῳ ῴ ῶ ῷ Ὸ Ό Ὼ Ώ ῼ ´ ῾

## cyrillic

0x0400 - 0x052f  Ѐ Ё Ђ Ѓ Є Ѕ І Ї Ј Љ Њ Ћ Ќ Ѝ Ў Џ ... Ԡ ԡ Ԣ ԣ Ԥ ԥ Ԧ ԧ Ԩ ԩ Ԫ ԫ Ԭ ԭ Ԯ ԯ
0xa640 - 0xa69f  Ꙁ ꙁ Ꙃ ꙃ Ꙅ ꙅ Ꙇ ꙇ Ꙉ ꙉ Ꙋ ꙋ Ꙍ ꙍ Ꙏ ꙏ ... Ꚏ ꚏ Ꚑ ꚑ Ꚓ ꚓ Ꚕ ꚕ Ꚗ ꚗ Ꚙ ꚙ Ꚛ ꚛ ꚜ ꚝ

0x2de0 - 0x2dff holds only combining marks, which are not shown here.

## symbol

0x00a1 - 0x00bf  ¡ ¢ £ ¤ ¥ ¦ § ¨ © ª « ¬ ® ¯ ° ± ² ³ ´ µ ¶ · ¸ ¹ º » ¼ ½ ¾ ¿
0x00d7 - 0x00d7  ×
0x00f7 - 0x00f7  ÷

## punct

0x2010 - 0x205e  ‐ ‑ ‒ – — ― ‖ ‗ ‘ ’ ‚ ‛ “ ” „ ‟ ... ⁏ ⁐ ⁑ ⁒ ⁓ ⁔ ⁕ ⁖ ⁗ ⁘ ⁙ ⁚ ⁛ ⁜ ⁝ ⁞

## arrow

0x2190 - 0x21ff  ← ↑ → ↓ ↔ ↕ ↖ ↗ ↘ ↙ ↚ ↛ ↜ ↝ ↞ ↟ ... ⇰ ⇱ ⇲ ⇳ ⇴ ⇵ ⇶ ⇷ ⇸ ⇹ ⇺ ⇻ ⇼ ⇽ ⇾ ⇿
0x27f0 - 0x27ff  ⟰ ⟱ ⟲ ⟳ ⟴ ⟵ ⟶ ⟷ ⟸ ⟹ ⟺ ⟻ ⟼ ⟽ ⟾ ⟿
0x2900 - 0x297f  ⤀ ⤁ ⤂ ⤃ ⤄ ⤅ ⤆ ⤇ ⤈ ⤉ ⤊ ⤋ ⤌ ⤍ ⤎ ⤏ ... ⥰ ⥱ ⥲ ⥳ ⥴ ⥵ ⥶ ⥷ ⥸ ⥹ ⥺ ⥻ ⥼ ⥽ ⥾ ⥿
0x2b00 - 0x2bff  ⬀ ⬁ ⬂ ⬃ ⬄ ⬅ ⬆ ⬇ ⬈ ⬉ ⬊ ⬋ ⬌ ⬍ ⬎ ⬏ ... ⯰ ⯱ ⯲ ⯳ ⯴ ⯵ ⯶ ⯷ ⯸ ⯹ ⯺ ⯻ ⯼ ⯽ ⯾ ⯿

## math

0x2200 - 0x22ff  ∀ ∁ ∂ ∃ ∄ ∅ ∆ ∇ ∈ ∉ ∊ ∋ ∌ ∍ ∎ ∏ ... ⋰ ⋱ ⋲ ⋳ ⋴ ⋵ ⋶ ⋷ ⋸ ⋹ ⋺ ⋻ ⋼ ⋽ ⋾ ⋿
0x2a00 - 0x2aff  ⨀ ⨁ ⨂ ⨃ ⨄ ⨅ ⨆ ⨇ ⨈ ⨉ ⨊ ⨋ ⨌ ⨍ ⨎ ⨏ ... ⫰ ⫱ ⫲ ⫳ ⫴ ⫵ ⫶ ⫷ ⫸ ⫹ ⫺ ⫻ ⫼ ⫽ ⫾ ⫿

## box

0x2500 - 0x259f  ─ ━ │ ┃ ┄ ┅ ┆ ┇ ┈ ┉ ┊ ┋ ┌ ┍ ┎ ┏ ... ▐ ░ ▒ ▓ ▔ ▕ ▖ ▗ ▘ ▙ ▚ ▛ ▜ ▝ ▞ ▟

## geometric

0x25a0 - 0x25ff  ■ □ ▢ ▣ ▤ ▥ ▦ ▧ ▨ ▩ ▪ ▫ ▬ ▭ ▮ ▯ ... ◰ ◱ ◲ ◳ ◴ ◵ ◶ ◷ ◸ ◹ ◺ ◻ ◼ ◽ ◾ ◿

## cjk

0x3040 - 0x30ff  ぁ あ ぃ い ぅ う ぇ え ぉ お か が き ぎ く ぐ ... ヰ ヱ ヲ ン ヴ ヵ ヶ ヷ ヸ ヹ ヺ ・ ー ヽ ヾ ヿ
0x4e00 - 0x9fff  一 丁 丂 七 丄 丅 丆 万 丈 三 上 下 丌 不 与 丏 ... 鿰 鿱 鿲 鿳 鿴 鿵 鿶 鿷 鿸 鿹 鿺 鿻 鿼 鿽 鿾 鿿
0xac00 - 0xd7af  가 각 갂 갃 간 갅 갆 갇 갈 갉 갊 갋 갌 갍 갎 갏 ... 힔 힕 힖 힗 힘 힙 힚 힛 힜 힝 힞 힟 힠 힡 힢 힣

## outside of the table

✔ ✘ ☀ ★ 😀 🌈 get plain `text unicode`, © ° ± are `symbol`, ASCII like , ; ( ) stays `punct`.
