export type SeasonalPalette = {
    name: string
    season: 'spring' | 'summer' | 'autumn' | 'winter'
    previewColors: string[]
    colors: string[]
}

// Color data sourced from the "Seasonal Color Palette Library" reference doc
// (curated by a professional colour analyst) rather than programmatically
// generated hue ramps. Each palette combines:
//   Signature colors — the 6 colors that represent the season type at its best
//   Great colors      — 12 additional flattering, highly recommended colors
//   Neutrals          — 12 neutrals shared across all types within the season

export const seasonalPalettes: SeasonalPalette[] = [
    // ─── SPRING ────────────────────────────────────────────────────────────────
  {
        name: 'Light Spring',
        season: 'spring',
        previewColors: ['#FFAA99', '#EAA27F', '#FFEF9A', '#DFEE8B', '#9FE8DB', '#8B93F4'],
        colors: [
                // Signature
          '#FFAA99', '#EAA27F', '#FFEF9A', '#DFEE8B', '#9FE8DB', '#8B93F4',
                // Great
                '#F5D07D', '#C98BDC', '#F89B72', '#F2716C', '#F48BA8', '#AADA76',
                '#B6CD7E', '#7DDBCD', '#7DD2B9', '#76CCE9', '#14B6C8', '#EBADE8',
                // Neutrals
                '#C49769', '#CAA867', '#E8C685', '#EECB9B', '#F4F4DE', '#C2AD7F',
                '#FFF9E6', '#8B4428', '#6C2B13', '#91573B', '#6F5C40', '#205D82',
              ],
  },
  {
        name: 'True Spring',
        season: 'spring',
        previewColors: ['#FF716C', '#FFA15C', '#FFB642', '#AED251', '#15B4C6', '#D87EE4'],
        colors: [
                // Signature
          '#FF716C', '#FFA15C', '#FFB642', '#AED251', '#15B4C6', '#D87EE4',
                // Great
                '#FD914A', '#F47341', '#F6836B', '#FF6320', '#FCCE4A', '#F27C7B',
                '#83C44D', '#6FCB75', '#39BE92', '#39BEBF', '#65B6D9', '#E19EE9',
                // Neutrals
                '#C49769', '#CAA867', '#E8C685', '#EECB9B', '#F4F4DE', '#C2AD7F',
                '#FFF9E6', '#8B4428', '#6C2B13', '#91573B', '#6F5C40', '#205D82',
              ],
  },
  {
        name: 'Bright Spring',
        season: 'spring',
        previewColors: ['#DF3118', '#FD4470', '#FFDE59', '#2AA54D', '#CE47E4', '#0473EB'],
        colors: [
                // Signature
          '#DF3118', '#FD4470', '#FFDE59', '#2AA54D', '#CE47E4', '#0473EB',
                // Great
                '#EF5436', '#F25F2F', '#F5832B', '#ED4F59', '#F06066', '#96BC3C',
                '#169D27', '#23BBA8', '#1177BD', '#4452C2', '#CD2B6F', '#33A0DA',
                // Neutrals
                '#C49769', '#CAA867', '#E8C685', '#EECB9B', '#F4F4DE', '#C2AD7F',
                '#FFF9E6', '#8B4428', '#6C2B13', '#91573B', '#6F5C40', '#205D82',
              ],
  },
  {
        name: 'Warm Spring',
        season: 'spring',
        previewColors: ['#EB5650', '#E54A33', '#DF6936', '#EF8600', '#7CAF2C', '#56BF9D'],
        colors: [
                // Signature
          '#EB5650', '#E54A33', '#DF6936', '#EF8600', '#7CAF2C', '#56BF9D',
                // Great
                '#BE542D', '#F8AD2F', '#FBA42F', '#F89372', '#FAB47E', '#9AA135',
                '#5E9541', '#54BD84', '#23B99E', '#C64779', '#64B7C9', '#367639',
                // Neutrals
                '#C49769', '#CAA867', '#E8C685', '#EECB9B', '#F4F4DE', '#C2AD7F',
                '#FFF9E6', '#8B4428', '#6C2B13', '#91573B', '#6F5C40', '#205D82',
              ],
  },

    // ─── SUMMER ──────────────────────────────────────────────────────────────
  {
        name: 'Light Summer',
        season: 'summer',
        previewColors: ['#9ED1C4', '#97C9E1', '#A9DADF', '#C0ABDB', '#EAADD2', '#FAF8CF'],
        colors: [
                // Signature
          '#9ED1C4', '#97C9E1', '#A9DADF', '#C0ABDB', '#EAADD2', '#FAF8CF',
                // Great
                '#FAD9ED', '#F0C6F8', '#889DBC', '#7DB9D8', '#C9E8F6', '#EABECF',
                '#73DBBF', '#74BDAD', '#9A97C6', '#F7F5B8', '#C0C0E0', '#A1CEAC',
                // Neutrals
                '#666363', '#A6A6A6', '#D9D9D9', '#49556A', '#4A4F68', '#EAEBEF',
                '#BABCB2', '#908783', '#7A656C', '#A49E92', '#9E8990', '#525B50',
              ],
  },
  {
        name: 'True Summer',
        season: 'summer',
        previewColors: ['#8EB4A6', '#5487A4', '#7AA7DF', '#A09ACF', '#EB9CCA', '#CD6182'],
        colors: [
                // Signature
          '#8EB4A6', '#5487A4', '#7AA7DF', '#A09ACF', '#EB9CCA', '#CD6182',
                // Great
                '#608D8F', '#73B3AF', '#3B7192', '#8198CA', '#747EB2', '#667AA9',
                '#A29BC7', '#877AAC', '#C269AB', '#BF6391', '#F599BA', '#F9F5BB',
                // Neutrals
                '#666363', '#A6A6A6', '#D9D9D9', '#49556A', '#4A4F68', '#EAEBEF',
                '#BABCB2', '#908783', '#7A656C', '#A49E92', '#9E8990', '#525B50',
              ],
  },
  {
        name: 'Soft Summer',
        season: 'summer',
        previewColors: ['#728D86', '#60838A', '#6B8698', '#896F9B', '#A68196', '#CE9099'],
        colors: [
                // Signature
          '#728D86', '#60838A', '#6B8698', '#896F9B', '#A68196', '#CE9099',
                // Great
                '#667266', '#97BDB9', '#E1C6CF', '#DB8CA6', '#7A4350', '#E1DDB4',
                '#A6658C', '#4E7390', '#915D67', '#BBA1C4', '#97A8B6', '#717B9B',
                // Neutrals
                '#666363', '#A6A6A6', '#D9D9D9', '#49556A', '#4A4F68', '#EAEBEF',
                '#BABCB2', '#908783', '#7A656C', '#A49E92', '#9E8990', '#525B50',
              ],
  },
  {
        name: 'Cool Summer',
        season: 'summer',
        previewColors: ['#39A495', '#4066A8', '#436EBE', '#8B65CD', '#B6539B', '#D65899'],
        colors: [
                // Signature
          '#39A495', '#4066A8', '#436EBE', '#8B65CD', '#B6539B', '#D65899',
                // Great
                '#2E6499', '#3989BD', '#7D62AF', '#6E5FB2', '#DB8CCB', '#B6436D',
                '#F7FFB9', '#368484', '#3D8196', '#A365AB', '#55A18F', '#5FADCB',
                // Neutrals
                '#666363', '#A6A6A6', '#D9D9D9', '#49556A', '#4A4F68', '#EAEBEF',
                '#BABCB2', '#908783', '#7A656C', '#A49E92', '#9E8990', '#525B50',
              ],
  },

    // ─── AUTUMN ──────────────────────────────────────────────────────────────
  {
        name: 'Soft Autumn',
        season: 'autumn',
        previewColors: ['#AB5151', '#BCA357', '#9C916D', '#6C6C45', '#4B7C82', '#894D63'],
        colors: [
                // Signature
          '#AB5151', '#BCA357', '#9C916D', '#6C6C45', '#4B7C82', '#894D63',
                // Great
                '#AD5B52', '#914F4F', '#C68484', '#8D566B', '#5D999C', '#547384',
                '#B3B480', '#4D645D', '#5C6853', '#CB927E', '#693D47', '#876F4A',
                // Neutrals
                '#4F2D1D', '#664736', '#846955', '#6C4C3A', '#EBE8D5', '#612010',
                '#493C30', '#47472D', '#444A60', '#7D684E', '#664E46', '#5A5D3F',
              ],
  },
  {
        name: 'True Autumn',
        season: 'autumn',
        previewColors: ['#8D3330', '#C26827', '#9B6E23', '#647229', '#4A531F', '#01827E'],
        colors: [
                // Signature
          '#8D3330', '#C26827', '#9B6E23', '#647229', '#4A531F', '#01827E',
                // Great
                '#8D361F', '#C3694E', '#CD9930', '#924741', '#611F11', '#AA532E',
                '#6E2536', '#0F686D', '#47472D', '#57673F', '#6F5C40', '#29696D',
                // Neutrals
                '#4F2D1D', '#664736', '#846955', '#6C4C3A', '#EBE8D5', '#612010',
                '#493C30', '#47472D', '#444A60', '#7D684E', '#664E46', '#5A5D3F',
              ],
  },
  {
        name: 'Deep Autumn',
        season: 'autumn',
        previewColors: ['#7B1111', '#72122A', '#963D0C', '#0F4012', '#17645D', '#5D1D32'],
        colors: [
                // Signature
          '#7B1111', '#72122A', '#963D0C', '#0F4012', '#17645D', '#5D1D32',
                // Great
                '#9C1E20', '#62151B', '#650D30', '#662243', '#23283B', '#103A4B',
                '#124D33', '#302D1B', '#063A35', '#51571E', '#D5AA0B', '#81310F',
                // Neutrals
                '#4F2D1D', '#664736', '#846955', '#6C4C3A', '#EBE8D5', '#612010',
                '#493C30', '#47472D', '#444A60', '#7D684E', '#664E46', '#5A5D3F',
              ],
  },
  {
        name: 'Warm Autumn',
        season: 'autumn',
        previewColors: ['#AB3516', '#AA532E', '#C65817', '#DE9737', '#647229', '#1E9268'],
        colors: [
                // Signature
          '#AB3516', '#AA532E', '#C65817', '#DE9737', '#647229', '#1E9268',
                // Great
                '#983706', '#C0492D', '#A74106', '#E18C19', '#B65F34', '#E0754C',
                '#E4B117', '#F26C56', '#207C6E', '#27A1A0', '#5E6B28', '#5D9947',
                // Neutrals
                '#4F2D1D', '#664736', '#846955', '#6C4C3A', '#EBE8D5', '#612010',
                '#493C30', '#47472D', '#444A60', '#7D684E', '#664E46', '#5A5D3F',
              ],
  },

    // ─── WINTER ──────────────────────────────────────────────────────────────
  {
        name: 'Bright Winter',
        season: 'winter',
        previewColors: ['#009F7B', '#00928E', '#002ECF', '#721ACD', '#CB1989', '#CB1C36'],
        colors: [
                // Signature
          '#009F7B', '#00928E', '#002ECF', '#721ACD', '#CB1989', '#CB1C36',
                // Great
                '#DFF915', '#FFFF1D', '#18AC5E', '#07B1AD', '#1FC0E4', '#019ABB',
                '#E82D57', '#0039FF', '#B147E4', '#BB1E98', '#EE2A7B', '#E7194D',
                // Neutrals
                '#000000', '#FFFFFF', '#737373', '#242424', '#061C3D', '#3B0028',
                '#0D3A5D', '#2E2321', '#351F16', '#3D3023', '#530000', '#172422',
              ],
  },
  {
        name: 'True Winter',
        season: 'winter',
        previewColors: ['#017264', '#071594', '#013076', '#48139D', '#94036A', '#A2072B'],
        colors: [
                // Signature
          '#017264', '#071594', '#013076', '#48139D', '#94036A', '#A2072B',
                // Great
                '#BF0A33', '#C42466', '#056D69', '#022563', '#270599', '#0B3E8D',
                '#921484', '#55228D', '#811A96', '#A20F2F', '#9D1439', '#D13A84',
                // Neutrals
                '#000000', '#FFFFFF', '#737373', '#242424', '#061C3D', '#3B0028',
                '#0D3A5D', '#2E2321', '#351F16', '#3D3023', '#530000', '#172422',
              ],
  },
  {
        name: 'Deep Winter',
        season: 'winter',
        previewColors: ['#004245', '#004363', '#0C0F66', '#341259', '#59003C', '#5A0023'],
        colors: [
                // Signature
          '#004245', '#004363', '#0C0F66', '#341259', '#59003C', '#5A0023',
                // Great
                '#5D0125', '#8F0D3B', '#003432', '#061C3D', '#0F274C', '#79005B',
                '#3B104B', '#890958', '#890919', '#790A21', '#12004D', '#9F2144',
                // Neutrals
                '#000000', '#FFFFFF', '#737373', '#242424', '#061C3D', '#3B0028',
                '#0D3A5D', '#2E2321', '#351F16', '#3D3023', '#530000', '#172422',
              ],
  },
  {
        name: 'Cool Winter',
        season: 'winter',
        previewColors: ['#214A45', '#263C66', '#2C4E84', '#423066', '#692B53', '#782A3B'],
        colors: [
                // Signature
          '#214A45', '#263C66', '#2C4E84', '#423066', '#692B53', '#782A3B',
                // Great
                '#9F2B64', '#893368', '#2D7074', '#215759', '#283A5E', '#5D4689',
                '#63307B', '#922E46', '#2B576C', '#642447', '#403D77', '#9F2144',
                // Neutrals
                '#000000', '#FFFFFF', '#737373', '#242424', '#061C3D', '#3B0028',
                '#0D3A5D', '#2E2321', '#351F16', '#3D3023', '#530000', '#172422',
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
          'Warm Spring': 'Warm and grounded, the richest of the Springs. Terracotta, burnt orange, golden amber, and olive green — Spring\'s warmth deepened toward Autumn.',
          'Light Summer': 'Cool, light, and watercolor-delicate. Your palette whispers in powder blue, lavender, blush, and pale periwinkle. Airy, elegant, understated.',
          'True Summer': 'Cool, muted, and softly romantic. Dusty rose, slate blue, and soft plum — like a fading photograph, beautiful in its gentle restraint.',
          'Soft Summer': 'The most muted of all types. Greyed lavender, dusty mauve, foggy sage, and warm cocoa — understated sophistication in every shade.',
          'Cool Summer': 'Cool and softly saturated, the bridge between Summer and Winter. Teal, denim blue, muted plum, and dusty rose — Summer\'s softness with Winter\'s cool clarity.',
          'Soft Autumn': 'Warm, muted, and gently earthy. Camel, dusty terracotta, warm olive, and golden stone. Autumn seen through soft morning light.',
          'True Autumn': 'The quintessential harvest palette. Burnt orange, forest green, mustard, rust, and chocolate — rich, warm, saturated earthiness.',
          'Deep Autumn': 'Dark, rich, and intensely warm. Mahogany, deep burgundy, dark forest green, copper, and aubergine. Autumn at its most dramatic.',
          'Warm Autumn': 'The warmest, most golden Autumn type, where Spring\'s warmth deepens into Autumn richness. Rust, terracotta, burnt orange, and golden ochre.',
          'Bright Winter': 'The most vivid type of all. Electric blue, vivid fuchsia, true red, and bright emerald against pure black and white — maximum impact.',
          'True Winter': 'Cool, clear, and boldly elegant. True black, icy white, cobalt blue, crimson, and emerald. Classic jewel-toned winter beauty.',
          'Deep Winter': 'Cool, deep, and powerfully dramatic. Midnight navy, dark burgundy, deep plum, hunter green, and charcoal — jewel tones in their darkest form.',
          'Cool Winter': 'Cool and deep, the bridge between Summer and Winter. Deep teal, navy, plum, and blue-based jewel tones — cooler and moodier than True Winter\'s high contrast.',
    }
    return descriptions[name] || ''
}
