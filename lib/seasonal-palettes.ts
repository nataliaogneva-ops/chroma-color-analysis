export type SeasonalPalette = {
  name: string
  season: 'spring' | 'summer' | 'autumn' | 'winter'
  // 5–6 signature colors shown in the library preview strip
  previewColors: string[]
  colors: string[]
}

// ─── SPRING ────────────────────────────────────────────────────────────────
// Warm golden undertones · clear to moderately saturated · yellow-based warmth

export const seasonalPalettes: SeasonalPalette[] = [
  {
    // Warm · Light · Delicate clarity
    // Think: champagne, peach, warm pastel mint, ivory, soft coral
    name: 'Light Spring',
    season: 'spring',
    previewColors: ['#FFE898', '#FFB898', '#F08870', '#A8C888', '#98C8E8', '#D4B080'],
    colors: [
      // Neutrals / bases
      '#FFF8F0', // warm white
      '#FFF0DC', // ivory
      '#FAE6C8', // light cream
      '#F0D8B0', // warm buff
      '#E0C090', // sand
      '#C8A870', // light camel
      '#B89060', // camel
      // Peach / blush
      '#FFE8DC', // pale blush
      '#FFD0B8', // blush peach
      '#FFB898', // light peach
      '#F8A080', // peach coral
      '#F08870', // soft coral
      '#FFD0D0', // warm pink blush
      '#F0B8B8', // light warm rose
      // Yellows / golden
      '#FFF8D0', // pale butter
      '#FFE898', // butter yellow
      '#FFD860', // warm yellow
      '#EEC040', // golden yellow
      '#D8A820', // light gold
      // Warm greens
      '#E8F4D8', // pale mint
      '#C8E0B0', // light spring green
      '#A8C888', // spring green
      '#88B068', // meadow green
      '#98C050', // warm lime
      // Blues / aquas (warm-leaning sky tones)
      '#D8F0F8', // pale sky
      '#B8D8F0', // baby blue
      '#98C8E8', // soft sky blue
      '#88B8D8', // light cornflower
      '#A8DCE0', // pale aqua
      '#80C8C0', // soft aqua
      // Warm reds / pinks
      '#FFB8C0', // warm pink
      '#F09098', // light warm rose
      '#E87880', // rose
      '#FF9070', // warm apricot-red
      // Apricot / orange
      '#FFD0A0', // light apricot
      '#FFBA78', // apricot
      '#F0A050', // warm apricot
      '#E89030', // amber
      // Accent
      '#C8F0E0', // mint foam
      '#78D0C0', // turquoise tint
      '#E0B888', // warm tan accent
    ],
  },
  {
    // Warm · Medium value · Clear warmth
    // Think: sunflower, coral, turquoise, warm ivory, bright lime, caramel
    name: 'True Spring',
    season: 'spring',
    previewColors: ['#FFD700', '#FF7F50', '#FF8C30', '#60C850', '#30D0C0', '#A88030'],
    colors: [
      // Neutrals / bases
      '#FFF5E0', // golden white
      '#F5E5C0', // warm ivory
      '#E8D098', // golden cream
      '#D8B870', // warm beige
      '#C8A048', // camel
      '#A88030', // warm brown
      '#8B6520', // dark camel
      // Corals / oranges
      '#FF7F50', // coral
      '#FF6A38', // warm orange-coral
      '#F05525', // vivid coral-orange
      '#FF8C30', // bright orange
      '#FFB040', // amber orange
      '#FFC860', // warm amber
      // Bright warm yellows
      '#FFD700', // gold
      '#FFE020', // sunflower
      '#F5C800', // warm gold
      '#E8B500', // deep warm yellow
      // Warm greens
      '#A8C830', // warm lime
      '#90B818', // yellow-green
      '#78A808', // medium lime
      '#509828', // fresh green
      '#388018', // medium spring green
      // Reds (warm)
      '#FF5030', // warm tomato
      '#E84020', // vivid warm red
      '#FF7060', // warm light red
      // Warm turquoise / teal
      '#30D0C0', // vivid turquoise
      '#18B8A8', // clear turquoise
      '#20C8A0', // warm mint teal
      '#08A890', // medium turquoise
      // Peach
      '#FFD0A8', // peach
      '#FFBA88', // medium peach
      '#F0A870', // warm peach
      // Warm pinks
      '#FF9898', // warm pink
      '#F07868', // dusty coral-pink
      // Greens (additional)
      '#60C850', // vivid green
      '#48A838', // medium green
      // Accent blues (warm)
      '#78C8F8', // clear sky blue
      '#50B0F0', // bright sky
      '#98D8C0', // warm mint
      '#C8F0D0', // pale green-mint
      '#F8C090', // light warm orange
    ],
  },
  {
    // Warm · High chroma · Vivid — bridges Spring brightness with Winter contrast
    // Think: vivid coral, electric teal, hot pink, bright yellow-green, bold orange
    name: 'Bright Spring',
    season: 'spring',
    previewColors: ['#FF5733', '#FFD700', '#00C8C0', '#FF5090', '#4090FF', '#9020F0'],
    colors: [
      // Vivid corals / oranges
      '#FF5733', // vivid coral-orange
      '#FF4422', // bright red-orange
      '#FF6600', // vivid orange
      '#FF8820', // bright amber-orange
      '#FFA030', // warm amber
      '#FFBA00', // vivid amber
      // Vivid yellows
      '#FFD700', // vivid gold
      '#FFEA00', // bright yellow
      '#F0D000', // vivid warm yellow
      // Vivid greens (warm-toned)
      '#80E000', // vivid lime
      '#60C810', // bright warm green
      '#40B000', // clear green
      '#20A830', // vivid medium green
      // Vivid aquas / teals
      '#00C8C0', // vivid teal
      '#00B8D8', // electric cyan
      '#00D0B0', // vivid mint teal
      '#20E0C8', // bright turquoise
      // Vivid pinks / hot pink (warm-leaning)
      '#FF5090', // hot pink
      '#FF3880', // vivid rose-pink
      '#FF6060', // vivid warm pink
      // Vivid blues (clear)
      '#2080FF', // vivid cobalt
      '#4090FF', // bright blue
      '#60A8FF', // clear sky blue
      // Vivid purples (warm-tinted)
      '#9020F0', // vivid purple
      '#A840E0', // vivid violet
      '#C060FF', // bright violet
      // High contrast neutrals (spring wears these differently from winter)
      '#F8F8F0', // warm near-white
      '#1A1A10', // warm near-black
      '#E0E8F0', // icy pale blue
      '#FFF880', // vivid pale yellow
      '#FF88B0', // bright blush
      '#88F0E0', // vivid mint foam
      '#B0F040', // vivid chartreuse
      '#FF8060', // vivid salmon
      '#FFCC50', // bright marigold
      '#40D8A8', // vivid aquamarine
      '#FF90D0', // vivid light pink
      '#70E8A8', // vivid spearmint
      '#D0F870', // vivid lime-yellow
      '#88A0FF', // vivid periwinkle
    ],
  },

  // ─── SUMMER ──────────────────────────────────────────────────────────────
  // Cool blue-pink undertones · soft/muted · rose-based coolness

  {
    // Cool · Light · Soft / watercolor quality
    // Think: powder blue, lavender, blush, soft mint, pearl, periwinkle
    name: 'Light Summer',
    season: 'summer',
    previewColors: ['#F8D0E0', '#E0C8F0', '#C0D0F0', '#98A8E0', '#A8D0C8', '#D0D0E8'],
    colors: [
      // Neutrals / bases
      '#F8F8FF', // ghost white
      '#F0F0F8', // lavender white
      '#E0E0F0', // pale blue-white
      '#D0D0E8', // pearl grey
      '#C0C0D8', // cool light grey
      '#A8A8C0', // silver grey
      '#8888A8', // medium cool grey
      // Powder blues / periwinkles
      '#D8E8F8', // powder blue
      '#C0D0F0', // pale periwinkle
      '#A8B8E8', // soft periwinkle
      '#98A8E0', // periwinkle
      '#88A0D8', // cornflower light
      '#7890C8', // light slate blue
      // Lavenders / lilacs
      '#F0E0F8', // pale lavender
      '#E0C8F0', // soft lilac
      '#D0B8E8', // light lavender
      '#C0A8D8', // medium lavender
      '#B098C8', // muted lavender
      // Blush / soft pinks
      '#FFE8F0', // pale blush
      '#F8D0E0', // blush pink
      '#F0C0D0', // soft rose
      '#E0A8C0', // light rose
      '#D098B0', // blush rose
      // Cool mint / aqua (pale, cool)
      '#D8F0EC', // pale cool mint
      '#C0E0D8', // soft aqua
      '#A8D0C8', // cool sage
      '#90C0B8', // teal-mint light
      // Cool pinks / rose
      '#F8B0C0', // light cool pink
      '#F0A0B0', // soft cool rose
      '#E090A0', // cool medium rose
      // Soft sky (cool)
      '#C8E0F8', // pale sky blue
      '#B0CCF0', // light sky
      '#A0BCE8', // soft azure
      // Accent
      '#D8C0D8', // soft mauve
      '#C8B0C8', // dusty lilac
      '#E8F8D8', // pale cool green-white
      '#B8D8D0', // light teal
      '#F0D0E8', // rose lavender
      '#DDD0F0', // soft blue-purple
      '#C8E8F0', // ice blue
    ],
  },
  {
    // Cool · Medium · Muted — the classic dusty rose / slate blue summer
    // Think: dusty rose, slate blue, soft plum, cool taupe, muted raspberry
    name: 'True Summer',
    season: 'summer',
    previewColors: ['#D8A8B0', '#6880A8', '#B87888', '#806898', '#D06880', '#607880'],
    colors: [
      // Neutrals / bases
      '#E8E8F0', // cool off-white
      '#D0D0E0', // cool light grey
      '#B8B8C8', // medium cool grey
      '#A0A0B8', // slate grey
      '#888898', // medium slate
      '#707080', // blue-grey
      '#585868', // dark slate
      // Dusty rose / mauves
      '#D8A8B0', // dusty rose
      '#C89098', // mauve rose
      '#B87888', // mauve
      '#A86878', // deep mauve
      '#986070', // medium mauve
      '#886068', // warm mauve
      // Slate blues / cool blue-grey
      '#A0B8D0', // light slate blue
      '#8098B8', // slate blue
      '#6880A8', // medium slate
      '#587098', // cool blue
      '#486080', // steel blue
      '#385068', // dark slate blue
      // Soft plums / cool purples
      '#C8A8C8', // soft plum
      '#B090B8', // muted plum
      '#9878A8', // medium plum
      '#806898', // plum
      '#6A5888', // deep plum
      // Muted raspberry / rose
      '#D06880', // raspberry
      '#C05870', // medium raspberry
      '#A84860', // deep raspberry
      // Soft greens (cool-toned)
      '#A0B8A8', // cool sage
      '#8898A0', // blue-sage
      '#789898', // teal-sage
      '#607880', // teal grey
      // Cool blues (medium)
      '#B0C8E0', // powder blue
      '#90B0D0', // cool medium blue
      '#C8B8D0', // lavender grey
      '#B8A8C8', // muted lilac
      '#A890B8', // soft medium lavender
      // Light cool rose accent
      '#E0C0CC', // blush grey
      '#F0D0D8', // pale rose
      '#D8C8D8', // greyed pink
      '#C0B8C8', // cool greige
    ],
  },
  {
    // Cool-Neutral · Medium-light · Extremely muted — foggy, dusty quality
    // Think: greyed lavender, dusty mauve, muted sage, greyed teal, cocoa, warm stone
    name: 'Soft Summer',
    season: 'summer',
    previewColors: ['#C8C0D0', '#A898B0', '#A8B0A0', '#787E88', '#B09898', '#B8A888'],
    colors: [
      // Neutrals / bases (warm-cool neutral)
      '#E8E0D8', // warm off-white
      '#D8D0C8', // warm light grey
      '#C8C0B8', // neutral greige
      '#B8B0A8', // medium greige
      '#A8A098', // dark greige
      '#989088', // warm grey
      '#888078', // stone
      // Muted lavender / dusty purple
      '#C8C0D0', // greyed lavender
      '#B8A8C0', // dusty lavender
      '#A898B0', // muted purple
      '#9888A0', // dusty mauve-purple
      '#887890', // muted violet
      '#786880', // deep dusty violet
      // Muted rose / dusty mauve
      '#C8A8A8', // muted rose
      '#B89898', // dusty rose-grey
      '#A88888', // greyed rose
      '#986878', // muted mauve-rose
      // Muted sage / olive-green
      '#A8B0A0', // muted sage
      '#98A090', // grey-sage
      '#889080', // dusty sage
      '#788070', // olive-sage
      '#6A7860', // dark sage
      // Muted teal / blue-grey
      '#9090A0', // grey-blue
      '#808898', // muted blue
      '#707888', // dusty steel blue
      '#606878', // greyed teal-blue
      '#787E88', // dusty teal
      '#686E78', // dark grey-teal
      // Muted warm-cool pinks
      '#C0A8B0', // warm mauve
      '#B09898', // dusty pink
      '#A08888', // muted warm rose
      // Soft blues (muted)
      '#A8B8C8', // muted sky
      '#98A8B8', // dusty blue
      '#8898A8', // muted steel
      // Earthy warmth (neutral autumn-adjacent)
      '#B8A888', // warm stone
      '#A89878', // khaki
      '#988868', // muted camel
      '#887858', // greyed brown
      '#907868', // warm cocoa
      '#A08870', // dusty tan
    ],
  },

  // ─── AUTUMN ──────────────────────────────────────────────────────────────
  // Warm golden-orange undertones · earthy · muted to rich

  {
    // Warm · Light–Medium · Very muted / dusty warmth
    // Think: warm beige, muted terracotta, warm olive, dusty peach, camel, warm stone
    name: 'Soft Autumn',
    season: 'autumn',
    previewColors: ['#E0B090', '#C89070', '#C8A870', '#909858', '#D8B848', '#A88858'],
    colors: [
      // Warm neutrals / bases
      '#FFF0D8', // warm white
      '#F0E0C0', // warm cream
      '#E0C8A0', // light tan
      '#D0B888', // warm sand
      '#C0A070', // camel light
      '#A88858', // camel
      '#906830', // warm brown light
      '#7A5020', // medium warm brown
      // Muted terracotta / rust (soft)
      '#D8A888', // pale terracotta
      '#C89070', // soft terracotta
      '#B87858', // muted rust
      '#A06840', // dusty brick
      '#906038', // muted rust-brown
      // Warm olive / moss greens
      '#C0C890', // pale warm olive
      '#A8B070', // soft olive
      '#909858', // warm olive
      '#787E40', // dark olive
      '#686E38', // moss
      '#585E30', // deep moss
      // Warm dusty pinks / mauves (warm-tinted)
      '#E0B8A8', // warm blush
      '#D0A090', // dusty peach-rose
      '#C08878', // warm mauve-rose
      '#B07868', // muted warm rose
      '#A06858', // dusty brick rose
      // Dusty peach / apricot
      '#F0D0B0', // pale warm peach
      '#E0B890', // dusty peach
      '#D0A070', // warm apricot
      '#C09060', // muted amber-apricot
      // Warm golden / amber (muted)
      '#D8B848', // muted gold
      '#C8A030', // warm amber
      '#B89020', // dusty mustard
      '#A07818', // dusty gold
      // Warm sage / green-grey
      '#B0B898', // warm sage
      '#A0A888', // greyed warm sage
      '#909878', // muted warm sage
      '#808870', // dusty warm sage
      // Warm taupe / greige
      '#C8B8A8', // warm taupe
      '#B8A898', // greige
      '#A89888', // warm greige
      '#989080', // dusty taupe
      '#B89880', // muted caramel
      '#C8A888', // warm sand accent
    ],
  },
  {
    // Warm · Medium–Deep · Rich and earthy — the quintessential harvest palette
    // Think: burnt orange, olive, forest green, mustard, tomato red, chocolate, rust
    name: 'True Autumn',
    season: 'autumn',
    previewColors: ['#E07828', '#D45A18', '#C89810', '#7A8A2F', '#8B4020', '#2A6858'],
    colors: [
      // Warm neutrals
      '#F5EAD0', // golden cream
      '#E8D0A0', // warm ivory
      '#D8B878', // warm beige
      '#C0A050', // golden beige
      '#A88030', // caramel
      '#8B6820', // warm brown
      '#6A5018', // deep warm brown
      // Rust / burnt orange
      '#D45A18', // rust
      '#C04810', // burnt rust
      '#E06020', // vivid rust
      '#B84008', // dark rust
      '#D07030', // warm amber-rust
      '#E88030', // amber
      // Pumpkin / orange
      '#E07828', // pumpkin
      '#D06818', // deep pumpkin
      '#F09040', // bright pumpkin
      // Warm greens / olive
      '#7A8A2F', // olive
      '#6A7A20', // medium olive
      '#5A6A18', // dark olive
      '#8A9A3A', // warm olive
      '#4A6A20', // forest olive
      '#608038', // forest green
      '#487028', // medium forest
      '#386018', // deep forest
      // Warm reds / tomato
      '#B83020', // tomato
      '#A82810', // deep red
      '#C84030', // vivid warm red
      '#982010', // dark warm red
      // Warm browns / chocolates
      '#8B4020', // warm brown
      '#7A3818', // medium brown
      '#6A2808', // chocolate
      '#A85020', // medium warm brown
      // Mustard / gold
      '#C89810', // mustard
      '#B88800', // golden mustard
      '#D8A818', // warm gold
      '#E8B830', // bright mustard
      '#F0C040', // sunflower
      // Deep warm teal (autumn's teal)
      '#2A6858', // warm teal
      '#1A5848', // deep teal
      '#386858', // medium teal
      '#207060', // forest teal
      // Accent warm apricot
      '#E8B878', // warm apricot
      '#D8A060', // amber apricot
      '#C8B888', // warm sand
    ],
  },
  {
    // Warm · Deep · Rich — darkest and most intense autumn
    // Think: mahogany, deep burgundy (warm), dark forest, deep olive, copper, ochre, aubergine
    name: 'Deep Autumn',
    season: 'autumn',
    previewColors: ['#7A2028', '#A02810', '#3A5820', '#6A6820', '#5A1850', '#8A5838'],
    colors: [
      // Deep warm neutrals
      '#3A2010', // darkest brown
      '#4A2818', // very dark brown
      '#5A3020', // dark mahogany
      '#6A3828', // medium mahogany
      '#7A4830', // mahogany
      '#8A5838', // warm dark brown
      '#9A6840', // medium dark brown
      // Deep burgundy / wine (warm-toned)
      '#6A1820', // deep burgundy
      '#7A2028', // dark burgundy
      '#8A2830', // burgundy
      '#6A1028', // wine
      '#782030', // dark wine
      '#881830', // medium wine-red
      // Deep forest / hunter green
      '#1A3810', // deepest forest
      '#2A4818', // dark forest
      '#3A5820', // forest green
      '#4A6828', // medium forest
      '#2A4820', // hunter green
      '#305830', // deep forest-teal
      // Deep olive
      '#4A4810', // very dark olive
      '#5A5818', // dark olive
      '#6A6820', // deep olive
      '#787030', // olive
      '#686028', // dark golden olive
      // Deep rust / copper
      '#901808', // deep rust
      '#A02810', // dark rust
      '#B03818', // rust
      '#A85020', // copper-rust
      '#C05810', // vivid deep rust
      // Ochre / dark mustard
      '#806000', // dark ochre
      '#906808', // ochre
      '#A07808', // dark mustard
      '#704800', // deep amber-brown
      '#885800', // brown-gold
      // Aubergine / eggplant
      '#3A0830', // deepest aubergine
      '#4A1040', // dark aubergine
      '#5A1850', // aubergine
      '#4A1038', // dark plum
      '#6A2860', // medium aubergine
      // Deep teal
      '#0A2828', // deepest teal
      '#183838', // dark teal
      '#284848', // deep teal
      '#1A4038', // forest teal
      // Dark warm accents
      '#5A3008', // dark caramel
      '#7A4810', // copper-brown
      '#901028', // crimson-burgundy
    ],
  },

  // ─── WINTER ──────────────────────────────────────────────────────────────
  // Cool blue-pink undertones · clear to rich · high contrast capability

  {
    // Cool · Very high chroma · Extreme contrast — the most vivid of all types
    // Think: electric blue, vivid fuchsia, hot coral, true red, vivid teal, bright emerald
    name: 'Bright Winter',
    season: 'winter',
    previewColors: ['#0040FF', '#FF00B0', '#E00020', '#00C8C0', '#00A860', '#7010FF'],
    colors: [
      // Pure contrast anchors
      '#000000', // true black
      '#FFFFFF', // true white
      '#F0F8FF', // icy white
      '#E8F0FF', // cool near-white
      '#181828', // deep cool near-black
      // Electric blues
      '#0040FF', // electric blue
      '#0060FF', // vivid royal blue
      '#1070E8', // bright cobalt
      '#2080FF', // vivid blue
      '#0050D8', // deep electric blue
      // Vivid fuchsia / magenta
      '#FF00B0', // vivid fuchsia
      '#F000A0', // hot fuchsia
      '#E00090', // vivid magenta
      '#FF30C0', // bright magenta
      '#D80080', // deep fuchsia
      // True red (cool)
      '#E00020', // true cool red
      '#D00010', // vivid crimson
      '#FF0028', // bright red
      '#C80018', // cool deep red
      // Vivid teal / electric cyan
      '#00C0C8', // vivid teal
      '#00B0D8', // electric cyan-teal
      '#00A8C0', // vivid aqua
      '#00D8D0', // bright turquoise
      '#00C8B0', // electric turquoise
      // Vivid emerald / bright green (cool)
      '#00A860', // vivid emerald
      '#00C070', // bright emerald
      '#00B058', // electric emerald
      '#10A840', // vivid green
      // Electric violet / purple
      '#7010FF', // electric violet
      '#8000F0', // vivid purple
      '#9020E8', // bright violet
      '#A030F8', // vivid orchid
      // High-impact accents
      '#FF5500', // vivid orange-red (warm-winter accent)
      '#FFD800', // vivid cool yellow
      '#FF80C0', // vivid blush
      '#80F0FF', // vivid ice blue
      '#B040FF', // vivid lavender-purple
      '#40F8A0', // vivid aqua-green
      '#FF4080', // vivid hot pink-red
      '#00A0FF', // electric sky blue
    ],
  },
  {
    // Cool · Clear · Medium–Deep — pure cool jewel tones with black/white anchors
    // Think: true black, true white, cobalt, crimson, emerald, fuchsia, navy, sapphire
    name: 'True Winter',
    season: 'winter',
    previewColors: ['#CC0020', '#0030A0', '#007840', '#CC0090', '#E8F0FF', '#000000'],
    colors: [
      // Core contrast anchors
      '#000000', // true black
      '#FFFFFF', // true white
      '#101010', // deep near-black
      '#F5F5FA', // icy cool white
      '#EBEBF5', // cool off-white
      // Icy light tones
      '#E0ECFF', // icy blue
      '#D8E8FF', // ice blue
      '#E0D8FF', // icy lavender
      '#D8E8F8', // cool ice
      // Cool greys / silver
      '#C8C8D8', // light cool grey
      '#A8A8C0', // silver grey
      '#8888A8', // medium grey-blue
      '#606080', // dark cool grey
      '#404058', // deep charcoal blue
      // True red / crimson
      '#CC0020', // true red
      '#BB0010', // crimson
      '#DD0028', // vivid cool red
      '#AA0018', // deep crimson
      // Royal blue / cobalt / navy
      '#0030A0', // royal blue
      '#0020B0', // deep cobalt
      '#1040C0', // cobalt
      '#002090', // navy blue
      '#001870', // deep navy
      // Fuchsia / cool magenta
      '#CC0090', // fuchsia
      '#BB0080', // deep fuchsia
      '#AA0070', // cool magenta
      '#D800A0', // vivid fuchsia
      // Emerald green (cool)
      '#007840', // emerald
      '#008848', // medium emerald
      '#006030', // deep emerald
      '#009058', // vivid emerald
      // Royal purple
      '#600090', // royal purple
      '#500080', // deep purple
      '#700098', // medium purple
      '#800080', // magenta-purple
      // Teal / cool teal
      '#007878', // classic teal
      '#006868', // deep teal
      '#008080', // teal
      // Sapphire / deep blue
      '#007BC0', // sapphire
      '#006BA8', // deep sapphire
      '#0090C8', // clear sapphire
      // Accent
      '#CC0040', // ruby
      '#BB0030', // deep ruby
      '#5000A0', // indigo
      '#400090', // deep indigo
    ],
  },
  {
    // Cool · Deep · Rich jewel tones — dramatic darkness
    // Think: midnight navy, deep burgundy, forest green, plum, charcoal, dark teal, wine
    name: 'Deep Winter',
    season: 'winter',
    previewColors: ['#880020', '#000080', '#183828', '#580068', '#005058', '#303040'],
    colors: [
      // Deep dark neutrals
      '#000000', // true black
      '#0A0A10', // blue-black
      '#181828', // midnight
      '#202030', // dark charcoal
      '#303040', // deep charcoal
      '#404050', // charcoal
      '#505060', // medium dark grey
      // Deep navy / midnight blue
      '#000050', // midnight
      '#000068', // deepest navy
      '#000080', // dark navy
      '#0A0880', // dark blue
      '#101890', // deep navy blue
      '#1A2890', // navy
      '#0A0070', // ultra navy
      // Deep burgundy / wine (cool)
      '#700010', // deepest burgundy
      '#800018', // deep burgundy
      '#880020', // burgundy
      '#780028', // deep wine
      '#680018', // wine
      '#900020', // vivid deep burgundy
      // Deep forest / hunter green (cool)
      '#082818', // deepest forest
      '#103020', // deep hunter
      '#183828', // hunter green
      '#204030', // forest green
      '#284838', // deep forest
      '#105028', // cool forest green
      // Deep plum / aubergine (cool)
      '#380048', // deepest plum
      '#480058', // deep plum
      '#580068', // dark plum
      '#480060', // deep violet-plum
      '#601870', // plum
      '#5A0868', // rich plum
      // Deep teal (cool)
      '#003038', // deepest teal
      '#004048', // deep teal
      '#005058', // dark teal
      '#004840', // hunter teal
      '#006050', // forest teal
      // Dark rose / raspberry (cool)
      '#800038', // dark raspberry
      '#700030', // deep raspberry
      '#900040', // vivid dark rose
      '#780030', // wine-rose
      // Dark emerald / pine
      '#004030', // pine green
      '#003828', // dark pine
      '#005038', // deep emerald
      // Deep fuchsia / dark magenta
      '#880060', // dark fuchsia
      '#780050', // deep magenta
      '#900058', // vivid dark fuchsia
    ],
  },
]

export function getPaletteByName(name: string): SeasonalPalette | undefined {
  return seasonalPalettes.find(p => p.name === name)
}

export function getPalettesBySeason(season: 'spring' | 'summer' | 'autumn' | 'winter'): SeasonalPalette[] {
  return seasonalPalettes.filter(p => p.season === season)
}

export function getSeasonDescription(season: 'spring' | 'summer' | 'autumn' | 'winter'): string {
  const descriptions: Record<string, string> = {
    spring: 'Warm golden undertones with clear, fresh energy — from delicate pastels to vivid brights.',
    summer: 'Cool blue-pink undertones with soft, muted elegance — from powder pastels to dusty mid-tones.',
    autumn: 'Warm golden-orange undertones with earthy richness — from muted warmth to deep harvest hues.',
    winter: 'Cool blue undertones with crisp, high-contrast clarity — from icy brights to deep dramatic jewels.',
  }
  return descriptions[season]
}

export function getSubseasonDescription(name: string): string {
  const descriptions: Record<string, string> = {
    'Light Spring': 'Warm, light, and delicate. Your palette glows with ivory, warm peach, soft coral, and gentle golden tones. You suit the freshest, most delicate version of warmth.',
    'True Spring': 'Warm, clear, and energetic. Your colors are sunny and vivid — coral orange, golden yellow, warm lime, and clear turquoise. Nature at peak bloom.',
    'Bright Spring': 'Vivid, warm, and high-contrast. You share winter\'s love of intensity but with spring\'s warmth — electric teal, vivid coral, and hot yellow-green.',
    'Light Summer': 'Cool, light, and watercolor-delicate. Your palette whispers in powder blue, lavender, blush, and pale periwinkle. Airy, elegant, understated.',
    'True Summer': 'Cool, muted, and softly romantic. Dusty rose, slate blue, and soft plum — like a fading photograph, beautiful in its gentle restraint.',
    'Soft Summer': 'The most muted of all types. Greyed lavender, dusty mauve, foggy sage, and warm cocoa — understated sophistication in every shade.',
    'Soft Autumn': 'Warm, muted, and gently earthy. Camel, dusty terracotta, warm olive, and golden stone. Autumn seen through soft morning light.',
    'True Autumn': 'The quintessential harvest palette. Burnt orange, forest green, mustard, rust, and chocolate — rich, warm, saturated earthiness.',
    'Deep Autumn': 'Dark, rich, and intensely warm. Mahogany, deep burgundy, dark forest green, copper, and aubergine. Autumn at its most dramatic.',
    'Bright Winter': 'The most vivid type of all. Electric blue, vivid fuchsia, true red, and bright emerald against pure black and white — maximum impact.',
    'True Winter': 'Cool, clear, and boldly elegant. True black, icy white, cobalt blue, crimson, and emerald. Classic jewel-toned winter beauty.',
    'Deep Winter': 'Cool, deep, and powerfully dramatic. Midnight navy, dark burgundy, deep plum, hunter green, and charcoal — jewel tones in their darkest form.',
  }
  return descriptions[name] || ''
}
