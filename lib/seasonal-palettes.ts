export type SeasonalPalette = {
  name: string
  season: 'spring' | 'summer' | 'autumn' | 'winter'
  previewColors: string[]
  colors: string[]
}

// ─── SPRING ────────────────────────────────────────────────────────────────

export const seasonalPalettes: SeasonalPalette[] = [
  {
    name: 'Light Spring',
    season: 'spring',
    previewColors: ['#FFB799', '#FFE299', '#CCFF99', '#70BEEA', '#AE84F4', '#FFEACC'],
    colors: [
      // Reds
      '#FF9999', '#F48A84', '#EA7F70', '#E0755E', '#D66E4D', '#CC683D',
      // Oranges
      '#FFB799', '#F4AF84', '#EAA970', '#E0A65E', '#D6A44D', '#CCA43D',
      // Yellows
      '#FFE299', '#F4E084', '#EADF70', '#DFE05E', '#C7D64D', '#AFCC3D',
      // Greens
      '#CCFF99', '#A1F484', '#73EA70', '#5EE07A', '#4DD68C', '#3DCCA1',
      // Blues
      '#99FFFF', '#84E0F4', '#70BEEA', '#5E9AE0', '#4D73D6', '#3D4BCC',
      // Purples
      '#AD99FF', '#AE84F4', '#B470EA', '#BE5EE0', '#CB4DD6', '#CC3DBD',
      // Pinks
      '#FF99F4', '#F484DC', '#EA70C1', '#E05EA4', '#D64D86', '#CC3D68',
      // Browns
      '#996E5B', '#996B52', '#996A49', '#996A40', '#996E3D', '#99743D',
      // Greys
      '#FFFFFF', '#F4F4F4', '#EAEAEA', '#E0E0E0', '#D6D6D6', '#CCCCCC',
      // Neutrals
      '#FFEACC', '#F4E4C3', '#EADDBB', '#E0D6B3', '#D6CFAB', '#CCC7A3',
    ],
  },
  {
    name: 'True Spring',
    season: 'spring',
    previewColors: ['#F28C60', '#F2C960', '#A9F260', '#3CA0D8', '#943CD8', '#F2DEC1'],
    colors: [
      // Reds
      '#F26060', '#E5574E', '#D84F3C', '#CB492C', '#BF451E', '#B24211',
      // Oranges
      '#F28C60', '#E5884E', '#D8853C', '#CB842C', '#BF841E', '#B28511',
      // Yellows
      '#F2C960', '#E5C94E', '#D8CB3C', '#CACB2C', '#AEBF1E', '#92B211',
      // Greens
      '#A9F260', '#75E54E', '#3FD83C', '#2CCB4F', '#1EBF68', '#11B282',
      // Blues
      '#60F2F2', '#4ECAE5', '#3CA0D8', '#2C76CB', '#1E4BBF', '#1121B2',
      // Purples
      '#7D60F2', '#874EE5', '#943CD8', '#A22CCB', '#B21EBF', '#B211A2',
      // Pinks
      '#F260E3', '#E54EC4', '#D83CA3', '#CB2C82', '#BF1E62', '#B21142',
      // Browns
      '#99583D', '#995E3D', '#99633D', '#99693D', '#996E3D', '#99743D',
      // Greys
      '#F2F2F2', '#E5E5E5', '#D8D8D8', '#CBCBCB', '#BFBFBF', '#B2B2B2',
      // Neutrals
      '#F2DEC1', '#E5D5B7', '#D8CCAD', '#CCC3A3', '#CCC5A3', '#CCC7A3',
    ],
  },
  {
    name: 'Bright Spring',
    season: 'spring',
    previewColors: ['#FF3232', '#FFC532', '#99FF32', '#1CA0EA', '#8F1CEA', '#FFEACC'],
    colors: [
      // Reds
      '#FF3232', '#F43327', '#EA341C', '#E03711', '#D63908', '#CC3D00',
      // Oranges
      '#FF7032', '#F47627', '#EA7C1C', '#E08311', '#D68B08', '#CC9200',
      // Yellows
      '#FFC532', '#F4CE27', '#EAD81C', '#DEE011', '#C0D608', '#A3CC00',
      // Greens
      '#99FF32', '#5CF427', '#20EA1C', '#11E03F', '#08D667', '#00CC8E',
      // Blues
      '#32FFFF', '#27CFF4', '#1CA0EA', '#1170E0', '#0842D6', '#0014CC',
      // Purples
      '#5B32FF', '#7527F4', '#8F1CEA', '#AA11E0', '#C508D6', '#CC00B7',
      // Pinks
      '#FF32EA', '#F427C7', '#EA1CA4', '#E01181', '#D6085E', '#CC003D',
      // Browns
      '#99583D', '#995E3D', '#99633D', '#99693D', '#996E3D', '#99743D',
      // Greys
      '#FFFFFF', '#F4F4F4', '#EAEAEA', '#E0E0E0', '#D6D6D6', '#CCCCCC',
      // Neutrals
      '#FFEACC', '#F4E4C3', '#EADDBB', '#E0D6B3', '#D6CFAB', '#CCC7A3',
    ],
  },

  // ─── SUMMER ──────────────────────────────────────────────────────────────

  {
    name: 'Light Summer',
    season: 'summer',
    previewColors: ['#F2C1C1', '#F2E4C1', '#DAF2C1', '#93BFD8', '#CBC1F2', '#F2DEC1'],
    colors: [
      // Reds
      '#F2C1C1', '#E5ADA9', '#D89B93', '#CB8C7E', '#BF7F6B', '#B27459',
      // Oranges
      '#F2D0C1', '#E5C0A9', '#D8B393', '#CBA97E', '#BFA06B', '#B29959',
      // Yellows
      '#F2E4C1', '#E5DAA9', '#D8D293', '#CBCB7E', '#B6BF6B', '#A0B259',
      // Greens
      '#DAF2C1', '#B9E5A9', '#94D893', '#7ECB8F', '#6BBF91', '#59B297',
      // Blues
      '#C1F2F2', '#A9DAE5', '#93BFD8', '#7EA2CB', '#6B82BF', '#5962B2',
      // Purples
      '#CBC1F2', '#C0A9E5', '#BA93D8', '#B77ECB', '#B86BBF', '#B259A9',
      // Pinks
      '#F2C1ED', '#E5A9D8', '#D893C1', '#CB7EA8', '#BF6B8E', '#B25974',
      // Browns
      '#99837A', '#997F71', '#997C68', '#997A5E', '#997A55', '#997A4C',
      // Greys
      '#F2F2F2', '#E5E5E5', '#D8D8D8', '#CBCBCB', '#BFBFBF', '#B2B2B2',
      // Neutrals
      '#F2DEC1', '#E5D5B7', '#D8CCAD', '#CCC3A3', '#CCC5A3', '#CCC7A3',
    ],
  },
  {
    name: 'True Summer',
    season: 'summer',
    previewColors: ['#CC8E8E', '#CCBA8E', '#ADCC8E', '#6493AD', '#9B8ECC', '#CCBBA3'],
    colors: [
      // Reds
      '#CC8E8E', '#BC7C78', '#AD6D64', '#9E5F52', '#8E5441', '#7F4933',
      // Oranges
      '#CCA18E', '#BC9278', '#AD8664', '#9E7C52', '#8E7241', '#7F6A33',
      // Yellows
      '#CCBA8E', '#BCB078', '#ADA664', '#9D9E52', '#868E41', '#707F33',
      // Greens
      '#ADCC8E', '#8ABC78', '#66AD64', '#529E62', '#418E65', '#337F68',
      // Blues
      '#8ECCCC', '#78B0BC', '#6493AD', '#52759E', '#41578E', '#333A7F',
      // Purples
      '#9B8ECC', '#9278BC', '#8D64AD', '#8A529E', '#88418E', '#7F3377',
      // Pinks
      '#CC8EC5', '#BC78AD', '#AD6494', '#9E527B', '#8E4162', '#7F3349',
      // Browns
      '#99786B', '#997561', '#997358', '#99724F', '#8E6B41', '#7F6033',
      // Greys
      '#CCCCCC', '#BCBCBC', '#ADADAD', '#9E9E9E', '#8E8E8E', '#7F7F7F',
      // Neutrals
      '#CCBBA3', '#CCBEA3', '#CCC0A3', '#CCC3A3', '#CCC5A3', '#CCC7A3',
    ],
  },
  {
    name: 'Soft Summer',
    season: 'summer',
    previewColors: ['#B2A0A0', '#B2ADA0', '#A9B2A0', '#738893', '#A4A0B2', '#CCC3B7'],
    colors: [
      // Reds
      '#B2A0A0', '#A38A89', '#937773', '#84665F', '#75564D', '#66493D',
      // Oranges
      '#B2A6A0', '#A39389', '#938273', '#84735F', '#75664D', '#665A3D',
      // Yellows
      '#B2ADA0', '#A39E89', '#939173', '#84845F', '#71754D', '#5D663D',
      // Greens
      '#A9B2A0', '#8FA389', '#749373', '#5F8467', '#4D755F', '#3D6659',
      // Blues
      '#A0B2B2', '#899EA3', '#738893', '#5F7084', '#4D5875', '#3D4166',
      // Purples
      '#A4A0B2', '#9389A3', '#857393', '#7A5F84', '#724D75', '#663D61',
      // Pinks
      '#B2A0B0', '#A3899D', '#937388', '#845F73', '#754D5E', '#663D49',
      // Browns
      '#998E89', '#998980', '#938173', '#84715F', '#75624D', '#66553D',
      // Greys
      '#B2B2B2', '#A3A3A3', '#939393', '#848484', '#757575', '#666666',
      // Neutrals
      '#CCC3B7', '#CCC0AB', '#CCC0A3', '#CCC3A3', '#CCC5A3', '#CCC7A3',
    ],
  },

  // ─── AUTUMN ──────────────────────────────────────────────────────────────

  {
    name: 'Soft Autumn',
    season: 'autumn',
    previewColors: ['#B28E8E', '#B2A88E', '#A0B28E', '#648293', '#958EB2', '#CCBBA3'],
    colors: [
      // Reds
      '#B28E8E', '#A37B78', '#936A64', '#845B52', '#754E41', '#664233',
      // Oranges
      '#B2998E', '#A38978', '#937A64', '#846E52', '#756241', '#665733',
      // Yellows
      '#B2A88E', '#A39B78', '#938F64', '#848452', '#6F7541', '#5B6633',
      // Greens
      '#A0B28E', '#83A378', '#659364', '#52845D', '#417559', '#336656',
      // Blues
      '#8EB2B2', '#789BA3', '#648293', '#526984', '#415075', '#333866',
      // Purples
      '#958EB2', '#8878A3', '#7F6493', '#775284', '#714175', '#663360',
      // Pinks
      '#B28EAE', '#A37899', '#936483', '#84526D', '#754157', '#663342',
      // Browns
      '#99837A', '#997F71', '#937864', '#846A52', '#755D41', '#665133',
      // Greys
      '#B2B2B2', '#A3A3A3', '#939393', '#848484', '#757575', '#666666',
      // Neutrals
      '#CCBBA3', '#CCBEA3', '#CCC0A3', '#CCC3A3', '#CCC5A3', '#CCC7A3',
    ],
  },
  {
    name: 'True Autumn',
    season: 'autumn',
    previewColors: ['#B25959', '#B29959', '#85B259', '#346A89', '#6B59B2', '#CCBBA3'],
    colors: [
      // Reds
      '#B25959', '#9E4A45', '#893E34', '#753325', '#602A19', '#4C210F',
      // Oranges
      '#B27459', '#9E6745', '#895C34', '#755125', '#604619', '#4C3B0F',
      // Yellows
      '#B29959', '#9E8D45', '#898234', '#747525', '#596019', '#404C0F',
      // Greens
      '#85B259', '#5C9E45', '#368934', '#257537', '#19603A', '#0F4C3A',
      // Blues
      '#59B2B2', '#458E9E', '#346A89', '#254A75', '#192D60', '#0F154C',
      // Purples
      '#6B59B2', '#67459E', '#643489', '#602575', '#5B1960', '#4C0F46',
      // Pinks
      '#B259A9', '#9E458A', '#89346C', '#752550', '#601937', '#4C0F21',
      // Browns
      '#99634C', '#996243', '#895937', '#75502E', '#604626', '#4C3A1E',
      // Greys
      '#B2B2B2', '#9E9E9E', '#898989', '#757575', '#606060', '#4C4C4C',
      // Neutrals
      '#CCBBA3', '#CCBEA3', '#CCC0A3', '#CCC3A3', '#CCC5A3', '#CCC7A3',
    ],
  },
  {
    name: 'Deep Autumn',
    season: 'autumn',
    previewColors: ['#7F3333', '#7F6A33', '#597F33', '#1B4760', '#42337F', '#CCBBA3'],
    colors: [
      // Reds
      '#7F3333', '#702A26', '#60231B', '#511D11', '#42170A', '#331205',
      // Oranges
      '#7F4933', '#704226', '#603B1B', '#513511', '#422E0A', '#332605',
      // Yellows
      '#7F6A33', '#706226', '#605A1B', '#515111', '#3C420A', '#293305',
      // Greens
      '#597F33', '#397026', '#1C601B', '#11511F', '#0A4224', '#053325',
      // Blues
      '#337F7F', '#266270', '#1B4760', '#112F51', '#0A1A42', '#050933',
      // Purples
      '#42337F', '#422670', '#421B60', '#411151', '#3D0A42', '#33052E',
      // Pinks
      '#7F3377', '#70265F', '#601B49', '#511134', '#420A21', '#330512',
      // Browns
      '#7F4933', '#70452C', '#603F26', '#513820', '#42301A', '#332614',
      // Greys
      '#7F7F7F', '#707070', '#606060', '#515151', '#424242', '#333333',
      // Neutrals
      '#CCBBA3', '#CCBEA3', '#CCC0A3', '#CCC3A3', '#CCC5A3', '#CCC7A3',
    ],
  },

  // ─── WINTER ──────────────────────────────────────────────────────────────

  {
    name: 'Bright Winter',
    season: 'winter',
    previewColors: ['#FF1919', '#FFBE19', '#8CFF19', '#0C8DD6', '#4719FF', '#FF19E8'],
    colors: [
      // Reds
      '#FF1919', '#EA1F12', '#D6250C', '#C12907', '#AD2C03', '#992D00',
      // Oranges
      '#FF5E19', '#EA6512', '#D66B0C', '#C16E07', '#AD6F03', '#996E00',
      // Yellows
      '#FFBE19', '#EAC212', '#D6C40C', '#C0C107', '#9BAD03', '#7A9900',
      // Greens
      '#8CFF19', '#4AEA12', '#10D60C', '#07C130', '#03AD51', '#00996B',
      // Blues
      '#19FFFF', '#12C3EA', '#0C8DD6', '#075DC1', '#0333AD', '#000F99',
      // Purples
      '#4719FF', '#6412EA', '#7D0CD6', '#9107C1', '#9F03AD', '#990089',
      // Pinks
      '#FF19E8', '#EA12BB', '#D60C91', '#C1076C', '#AD034A', '#99002D',
      // Browns
      '#99583D', '#995E3D', '#99633D', '#99693D', '#996E3D', '#99743D',
      // Greys
      '#FFFFFF', '#EAEAEA', '#D6D6D6', '#C1C1C1', '#ADADAD', '#999999',
      // Neutrals
      '#FFEACC', '#EADABB', '#D6CAAB', '#CCC3A3', '#CCC5A3', '#CCC7A3',
    ],
  },
  {
    name: 'True Winter',
    season: 'winter',
    previewColors: ['#CC2828', '#CC9E28', '#7ACC28', '#126899', '#4928CC', '#CC28BB'],
    colors: [
      // Reds
      '#CC2828', '#B2251C', '#992212', '#7F1F0A', '#661B04', '#4C1600',
      // Oranges
      '#CC5928', '#B2561C', '#995112', '#7F4A0A', '#664204', '#4C3700',
      // Yellows
      '#CC9E28', '#B2961C', '#998D12', '#7E7F0A', '#5B6604', '#3D4C00',
      // Greens
      '#7ACC28', '#43B21C', '#159912', '#0A7F24', '#046631', '#004C35',
      // Blues
      '#28CCCC', '#1C97B2', '#126899', '#0A407F', '#041F66', '#00074C',
      // Purples
      '#4928CC', '#551CB2', '#5D1299', '#610A7F', '#5E0466', '#4C0044',
      // Pinks
      '#CC28BB', '#B21C91', '#99126B', '#7F0A49', '#66042D', '#4C0016',
      // Browns
      '#99583D', '#995E3D', '#99633D', '#7F5733', '#664928', '#4C3A1E',
      // Greys
      '#CCCCCC', '#B2B2B2', '#999999', '#7F7F7F', '#666666', '#4C4C4C',
      // Neutrals
      '#CCBBA3', '#CCBEA3', '#CCC0A3', '#CCC3A3', '#CCC5A3', '#CCC7A3',
    ],
  },
  {
    name: 'Deep Winter',
    season: 'winter',
    previewColors: ['#661E1E', '#66521E', '#42661E', '#0C3247', '#2C1E66', '#661E5E'],
    colors: [
      // Reds
      '#661E1E', '#561814', '#47130C', '#380F06', '#280B02', '#190700',
      // Oranges
      '#66341E', '#562E14', '#47280C', '#382106', '#281A02', '#191200',
      // Yellows
      '#66521E', '#564A14', '#47420C', '#373806', '#242802', '#141900',
      // Greens
      '#42661E', '#255614', '#0E470C', '#063811', '#022814', '#001911',
      // Blues
      '#1E6666', '#144A56', '#0C3247', '#061D38', '#020D28', '#000219',
      // Purples
      '#2C1E66', '#2D1456', '#2D0C47', '#2B0638', '#250228', '#190016',
      // Pinks
      '#661E5E', '#561448', '#470C33', '#380621', '#280212', '#190007',
      // Browns
      '#663B28', '#563522', '#472E1C', '#382616', '#281D10', '#19130A',
      // Greys
      '#666666', '#565656', '#474747', '#383838', '#282828', '#191919',
      // Neutrals
      '#CCBBA3', '#CCBEA3', '#CCC0A3', '#CCC3A3', '#CCC5A3', '#CCC7A3',
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
