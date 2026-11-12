<?php
/**
 * MaxMobila Default Data Set
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function maxmobila_get_default_data() {
    return array(
      'store' => array(
        'name' => 'MaxMobila',
        'tagline' => 'Outlet · mobilă din Germania',
        'phone' => '+40 700 000 000',
        'phoneRaw' => '+40700000000',
        'email' => 'contact@maxmobila.ro',
        'city' => 'Satu Mare',
        'address' => 'Showroom & depozit, Satu Mare',
        'freeShipOverRON' => 2500,
        'warrantyYears' => 2
      ),
      'calc' => array(
        'fx' => 5.05,
        'transportEUR' => 18,
        'lossPct' => 0.1,
        'good' => 2.5,
        'marginal' => 1.5
      ),
      'categories' => array(
        array(
          'id' => 'canapele',
          'name' => 'Canapele & colțare'
        ),
        array(
          'id' => 'fotolii',
          'name' => 'Fotolii & taburete'
        ),
        array(
          'id' => 'paturi',
          'name' => 'Paturi'
        ),
        array(
          'id' => 'noptiere',
          'name' => 'Noptiere'
        ),
        array(
          'id' => 'dulapuri',
          'name' => 'Dulapuri'
        ),
        array(
          'id' => 'comode',
          'name' => 'Comode'
        ),
        array(
          'id' => 'mese',
          'name' => 'Mese'
        ),
        array(
          'id' => 'scaune',
          'name' => 'Scaune'
        ),
        array(
          'id' => 'masute',
          'name' => 'Măsuțe'
        ),
        array(
          'id' => 'birouri',
          'name' => 'Birouri'
        )
      ),
      'states' => array(
        array(
          'id' => 'nou',
          'name' => 'Nou',
          'short' => 'Nou, în ambalaj original',
          'desc' => 'Produs nou, nefolosit, în cutia originală. Surplus de stoc sau colecție trecută din magazinele din Germania.'
        ),
        array(
          'id' => 'resigilat',
          'name' => 'Resigilat',
          'short' => 'Desfăcut, nefolosit',
          'desc' => 'Cutia a fost deschisă (retur sau verificare), produsul nu a fost folosit. Complet, verificat de noi.'
        ),
        array(
          'id' => 'expus',
          'name' => 'Expus',
          'short' => 'Din showroom',
          'desc' => 'A stat expus în showroom. Poate avea urme minime de manipulare, fără defecte de funcționare.'
        ),
        array(
          'id' => 'defecte',
          'name' => 'Mici defecte',
          'short' => 'Defect estetic descris',
          'desc' => 'Are un defect estetic mic, descris exact pe pagina produsului și arătat în poze. Prețul e redus pe măsură.'
        )
      ),
      'products' => array(
        array(
          'id' => 'm00',
          'cat' => 'canapele',
          'name' => 'Canapea Bigsofa Verona',
          'material' => 'textil',
          'color' => 'verde oliv',
          'dims' => null,
          'state' => 'nou',
          'newRON' => 3590,
          'priceRON' => 2229,
          'buyEUR' => 110,
          'stock' => 1,
          'img' => 'p00'
        ),
        array(
          'id' => 'm01',
          'cat' => 'canapele',
          'name' => 'Canapea 3 locuri Nuvola',
          'material' => 'textil',
          'color' => 'alb crem',
          'dims' => null,
          'state' => 'resigilat',
          'newRON' => 5890,
          'priceRON' => 3059,
          'buyEUR' => 184,
          'stock' => 2,
          'img' => 'p01'
        ),
        array(
          'id' => 'm02',
          'cat' => 'canapele',
          'name' => 'Canapea 3,5 locuri Cognac',
          'material' => 'piele',
          'color' => 'maro închis',
          'dims' => null,
          'state' => 'expus',
          'newRON' => 7790,
          'priceRON' => 3659,
          'buyEUR' => 266,
          'stock' => 1,
          'img' => 'p02'
        ),
        array(
          'id' => 'm03',
          'cat' => 'paturi',
          'name' => 'Pat tapițat Linea 140×200 cu ladă',
          'material' => 'catifea',
          'color' => 'gri',
          'dims' => null,
          'state' => 'nou',
          'newRON' => 1586,
          'priceRON' => 979,
          'buyEUR' => 74,
          'stock' => 3,
          'img' => 'p03'
        ),
        array(
          'id' => 'm04',
          'cat' => 'paturi',
          'name' => 'Pat tapițat Siena 160×200',
          'material' => 'textil',
          'color' => 'bej',
          'dims' => null,
          'state' => 'defecte',
          'newRON' => 2490,
          'priceRON' => 949,
          'buyEUR' => 47,
          'stock' => 1,
          'img' => 'p04',
          'defect' => 'Mică adâncitură pe partea laterală stângă.'
        ),
        array(
          'id' => 'm05',
          'cat' => 'paturi',
          'name' => 'Pat tapițat Nox 160×200 cu LED și USB',
          'material' => 'textil',
          'color' => 'gri',
          'dims' => null,
          'state' => 'resigilat',
          'newRON' => 2072,
          'priceRON' => 1079,
          'buyEUR' => 39,
          'stock' => 4,
          'img' => 'p05'
        ),
        array(
          'id' => 'm06',
          'cat' => 'paturi',
          'name' => 'Pat extensibil Duo 90/180×200',
          'material' => 'textil',
          'color' => 'bej',
          'dims' => null,
          'state' => 'nou',
          'newRON' => 2519,
          'priceRON' => 1559,
          'buyEUR' => 156,
          'stock' => 2,
          'img' => 'p06'
        ),
        array(
          'id' => 'm07',
          'cat' => 'paturi',
          'name' => 'Pat Alba 160×200',
          'material' => 'pal melaminat',
          'color' => 'alb / crom',
          'dims' => null,
          'state' => 'expus',
          'newRON' => 599,
          'priceRON' => 279,
          'buyEUR' => 3,
          'stock' => 1,
          'img' => 'p07'
        ),
        array(
          'id' => 'm08',
          'cat' => 'paturi',
          'name' => 'Pat tapițat Oslo 160×200',
          'material' => 'textil',
          'color' => 'gri',
          'dims' => null,
          'state' => 'nou',
          'newRON' => 2267,
          'priceRON' => 1409,
          'buyEUR' => 102,
          'stock' => 1,
          'img' => 'p08'
        ),
        array(
          'id' => 'm09',
          'cat' => 'dulapuri',
          'name' => 'Șifonier Kira 120 cm',
          'material' => 'pal melaminat',
          'color' => 'alb',
          'dims' => '120 × 196 × 53,5 cm',
          'state' => 'resigilat',
          'newRON' => 719,
          'priceRON' => 369,
          'buyEUR' => 3,
          'stock' => 2,
          'img' => 'p09'
        ),
        array(
          'id' => 'm10',
          'cat' => 'dulapuri',
          'name' => 'Dulap Linz 225 cm cu oglindă',
          'material' => 'pal melaminat',
          'color' => 'alb / crom',
          'dims' => '225 × 210 × 58 cm',
          'state' => 'expus',
          'newRON' => 1490,
          'priceRON' => 699,
          'buyEUR' => 28,
          'stock' => 1,
          'img' => 'p10'
        ),
        array(
          'id' => 'm11',
          'cat' => 'dulapuri',
          'name' => 'Dulap Riva 129 cm',
          'material' => 'pal melaminat',
          'color' => 'stejar / alb',
          'dims' => '128,7 × 200 × 54 cm',
          'state' => 'nou',
          'newRON' => 1690,
          'priceRON' => 1049,
          'buyEUR' => 63,
          'stock' => 3,
          'img' => 'p11'
        ),
        array(
          'id' => 'm12',
          'cat' => 'dulapuri',
          'name' => 'Dulap Mini 81 cm',
          'material' => 'pal melaminat',
          'color' => 'alb',
          'dims' => '81 × 176 × 51,1 cm',
          'state' => 'defecte',
          'newRON' => 329,
          'priceRON' => 129,
          'buyEUR' => 3,
          'stock' => 1,
          'img' => 'p12',
          'defect' => 'Tapițerie cu o mică decolorare pe spătar, zona din spate.'
        ),
        array(
          'id' => 'm13',
          'cat' => 'scaune',
          'name' => 'Scaun Tono',
          'material' => 'metal, textil',
          'color' => 'gri închis',
          'dims' => null,
          'state' => 'resigilat',
          'newRON' => 90,
          'priceRON' => 47,
          'buyEUR' => 3,
          'stock' => 4,
          'img' => 'p13'
        ),
        array(
          'id' => 'm14',
          'cat' => 'scaune',
          'name' => 'Scaun Tono',
          'material' => 'metal, textil',
          'color' => 'gri',
          'dims' => null,
          'state' => 'nou',
          'newRON' => 90,
          'priceRON' => 56,
          'buyEUR' => 3,
          'stock' => 2,
          'img' => 'p14'
        ),
        array(
          'id' => 'm15',
          'cat' => 'scaune',
          'name' => 'Scaun Mila',
          'material' => 'metal, textil',
          'color' => 'bej',
          'dims' => null,
          'state' => 'expus',
          'newRON' => 239,
          'priceRON' => 109,
          'buyEUR' => 3,
          'stock' => 1,
          'img' => 'p15'
        ),
        array(
          'id' => 'm16',
          'cat' => 'scaune',
          'name' => 'Scaun cu brațe Rombo',
          'material' => 'metal, textil',
          'color' => 'gri / negru',
          'dims' => null,
          'state' => 'nou',
          'newRON' => 199,
          'priceRON' => 119,
          'buyEUR' => 3,
          'stock' => 1,
          'img' => 'p16'
        ),
        array(
          'id' => 'm17',
          'cat' => 'scaune',
          'name' => 'Scaun rotativ cu brațe Arco',
          'material' => 'lemn, metal, textil',
          'color' => 'taupe',
          'dims' => null,
          'state' => 'resigilat',
          'newRON' => 499,
          'priceRON' => 259,
          'buyEUR' => 4,
          'stock' => 2,
          'img' => 'p17'
        ),
        array(
          'id' => 'm18',
          'cat' => 'scaune',
          'name' => 'Scaun cu brațe Luna',
          'material' => 'metal, textil',
          'color' => 'crem',
          'dims' => null,
          'state' => 'expus',
          'newRON' => 259,
          'priceRON' => 119,
          'buyEUR' => 3,
          'stock' => 1,
          'img' => 'p18'
        ),
        array(
          'id' => 'm19',
          'cat' => 'birouri',
          'name' => 'Birou Nova 120 cm',
          'material' => 'metal, PAL',
          'color' => 'alb',
          'dims' => '120 × 55 × 76 cm',
          'state' => 'nou',
          'newRON' => 1090,
          'priceRON' => 679,
          'buyEUR' => 27,
          'stock' => 3,
          'img' => 'p19'
        ),
        array(
          'id' => 'm20',
          'cat' => 'birouri',
          'name' => 'Birou Fjord 140 cm',
          'material' => 'lemn, PAL',
          'color' => 'alb / stejar',
          'dims' => '140 × 45-60 × 76 cm',
          'state' => 'defecte',
          'newRON' => 859,
          'priceRON' => 329,
          'buyEUR' => 7,
          'stock' => 1,
          'img' => 'p20',
          'defect' => 'Zgârietură fină de ~2 cm pe latura din spate, nu se vede la montaj.'
        ),
        array(
          'id' => 'm21',
          'cat' => 'birouri',
          'name' => 'Birou Compact 91 cm',
          'material' => 'PAL',
          'color' => 'stejar',
          'dims' => '91,5 × 50 × 75 cm',
          'state' => 'resigilat',
          'newRON' => 249,
          'priceRON' => 129,
          'buyEUR' => 3,
          'stock' => 4,
          'img' => 'p21'
        ),
        array(
          'id' => 'm22',
          'cat' => 'birouri',
          'name' => 'Birou Wave 140 cm',
          'material' => 'PAL lucios',
          'color' => 'alb / gri',
          'dims' => '140 × 55 × 76 cm',
          'state' => 'nou',
          'newRON' => 999,
          'priceRON' => 619,
          'buyEUR' => 24,
          'stock' => 2,
          'img' => 'p22'
        ),
        array(
          'id' => 'm24',
          'cat' => 'canapele',
          'name' => 'Colțar extensibil Bruno 294×173',
          'material' => 'textil',
          'color' => 'gri',
          'dims' => null,
          'state' => 'expus',
          'newRON' => 5690,
          'priceRON' => 2669,
          'buyEUR' => 122,
          'stock' => 1,
          'img' => 'p24'
        ),
        array(
          'id' => 'm25',
          'cat' => 'canapele',
          'name' => 'Colțar electric Relax 284×183',
          'material' => 'textil',
          'color' => 'grej',
          'dims' => null,
          'state' => 'nou',
          'newRON' => 9990,
          'priceRON' => 6189,
          'buyEUR' => 671,
          'stock' => 1,
          'img' => 'p25'
        ),
        array(
          'id' => 'm26',
          'cat' => 'fotolii',
          'name' => 'Balansoar Nordic',
          'material' => 'lemn, textil',
          'color' => 'roz',
          'dims' => null,
          'state' => 'resigilat',
          'newRON' => 499,
          'priceRON' => 259,
          'buyEUR' => 3,
          'stock' => 2,
          'img' => 'p26'
        ),
        array(
          'id' => 'm27',
          'cat' => 'fotolii',
          'name' => 'Fotoliu Velvet',
          'material' => 'textil',
          'color' => 'albastru',
          'dims' => null,
          'state' => 'expus',
          'newRON' => 369,
          'priceRON' => 169,
          'buyEUR' => 3,
          'stock' => 1,
          'img' => 'p27'
        ),
        array(
          'id' => 'm28',
          'cat' => 'fotolii',
          'name' => 'Taburet Puff',
          'material' => 'lemn, textil',
          'color' => 'grej',
          'dims' => null,
          'state' => 'nou',
          'newRON' => 269,
          'priceRON' => 169,
          'buyEUR' => 3,
          'stock' => 3,
          'img' => 'p28'
        ),
        array(
          'id' => 'm29',
          'cat' => 'fotolii',
          'name' => 'Fotoliu de masaj Zen',
          'material' => 'textil',
          'color' => 'gri',
          'dims' => null,
          'state' => 'defecte',
          'newRON' => 7390,
          'priceRON' => 2809,
          'buyEUR' => 167,
          'stock' => 1,
          'img' => 'p29',
          'defect' => 'Lipsă un capac decorativ la șurub — inclus în colet un înlocuitor.'
        ),
        array(
          'id' => 'm30',
          'cat' => 'noptiere',
          'name' => 'Noptieră Cara 40 cm',
          'material' => 'PAL',
          'color' => 'cașmir',
          'dims' => '40 × 55 × 48 cm',
          'state' => 'resigilat',
          'newRON' => 279,
          'priceRON' => 149,
          'buyEUR' => 3,
          'stock' => 4,
          'img' => 'p30'
        ),
        array(
          'id' => 'm31',
          'cat' => 'noptiere',
          'name' => 'Noptieră suspendată Flo',
          'material' => 'PAL',
          'color' => 'cașmir',
          'dims' => '50 × 16 × 40 cm',
          'state' => 'nou',
          'newRON' => 229,
          'priceRON' => 139,
          'buyEUR' => 3,
          'stock' => 2,
          'img' => 'p31'
        ),
        array(
          'id' => 'm32',
          'cat' => 'noptiere',
          'name' => 'Noptieră Artisan',
          'material' => 'stejar',
          'color' => 'stejar',
          'dims' => '42 × 28 × 30 cm',
          'state' => 'expus',
          'newRON' => 499,
          'priceRON' => 229,
          'buyEUR' => 3,
          'stock' => 1,
          'img' => 'p32'
        ),
        array(
          'id' => 'm33',
          'cat' => 'noptiere',
          'name' => 'Noptieră Cara 40 cm',
          'material' => 'PAL',
          'color' => 'alb',
          'dims' => '40 × 55 × 48 cm',
          'state' => 'nou',
          'newRON' => 199,
          'priceRON' => 119,
          'buyEUR' => 3,
          'stock' => 1,
          'img' => 'p33'
        ),
        array(
          'id' => 'm34',
          'cat' => 'noptiere',
          'name' => 'Noptieră Graf 46 cm',
          'material' => 'PAL',
          'color' => 'grafit',
          'dims' => '46 × 61 × 42 cm',
          'state' => 'resigilat',
          'newRON' => 319,
          'priceRON' => 169,
          'buyEUR' => 3,
          'stock' => 2,
          'img' => 'p34'
        ),
        array(
          'id' => 'm35',
          'cat' => 'comode',
          'name' => 'Comodă Tall 80 cm',
          'material' => 'PAL',
          'color' => 'alb',
          'dims' => '80 × 103 × 48 cm',
          'state' => 'expus',
          'newRON' => 449,
          'priceRON' => 209,
          'buyEUR' => 3,
          'stock' => 1,
          'img' => 'p35'
        ),
        array(
          'id' => 'm36',
          'cat' => 'comode',
          'name' => 'Comodă Mini 60 cm',
          'material' => 'PAL',
          'color' => 'alb',
          'dims' => '60 × 70 × 30 cm',
          'state' => 'nou',
          'newRON' => 139,
          'priceRON' => 86,
          'buyEUR' => 3,
          'stock' => 3,
          'img' => 'p36'
        ),
        array(
          'id' => 'm37',
          'cat' => 'comode',
          'name' => 'Comodă Wide 160 cm',
          'material' => 'PAL',
          'color' => 'alb / beton',
          'dims' => '160 × 82 × 35 cm',
          'state' => 'defecte',
          'newRON' => 599,
          'priceRON' => 229,
          'buyEUR' => 3,
          'stock' => 1,
          'img' => 'p37',
          'defect' => 'Colț ușor ciobit la bază (3 mm).'
        ),
        array(
          'id' => 'm38',
          'cat' => 'comode',
          'name' => 'Comodă cu uși Mix 139 cm',
          'material' => 'PAL',
          'color' => 'alb / stejar',
          'dims' => '139 × 90 × 34 cm',
          'state' => 'resigilat',
          'newRON' => 599,
          'priceRON' => 309,
          'buyEUR' => 3,
          'stock' => 4,
          'img' => 'p38'
        ),
        array(
          'id' => 'm39',
          'cat' => 'comode',
          'name' => 'Comodă Wide 160 cm',
          'material' => 'PAL',
          'color' => 'alb',
          'dims' => '160 × 79 × 48 cm',
          'state' => 'nou',
          'newRON' => 719,
          'priceRON' => 449,
          'buyEUR' => 17,
          'stock' => 2,
          'img' => 'p39'
        ),
        array(
          'id' => 'm40',
          'cat' => 'mese',
          'name' => 'Masă ovală Terra 200×110',
          'material' => 'lemn, ceramică',
          'color' => 'alb marmorat / stejar',
          'dims' => '200 × 110 × 75 cm',
          'state' => 'expus',
          'newRON' => 1790,
          'priceRON' => 839,
          'buyEUR' => 61,
          'stock' => 1,
          'img' => 'p40'
        ),
        array(
          'id' => 'm41',
          'cat' => 'mese',
          'name' => 'Masă rotundă Cono Ø120',
          'material' => 'lemn, ceramică',
          'color' => 'alb / nuc',
          'dims' => '120 × 120 × 75 cm',
          'state' => 'nou',
          'newRON' => 1290,
          'priceRON' => 799,
          'buyEUR' => 37,
          'stock' => 1,
          'img' => 'p41'
        ),
        array(
          'id' => 'm42',
          'cat' => 'mese',
          'name' => 'Masă extensibilă Cross 180–220',
          'material' => 'metal, PAL',
          'color' => 'stejar / negru',
          'dims' => '180-220 × 100 × 75 cm',
          'state' => 'resigilat',
          'newRON' => 1190,
          'priceRON' => 619,
          'buyEUR' => 14,
          'stock' => 2,
          'img' => 'p42'
        ),
        array(
          'id' => 'm43',
          'cat' => 'mese',
          'name' => 'Masă Live Edge 200×100',
          'material' => 'lemn masiv, metal',
          'color' => 'nuc / negru',
          'dims' => '200 × 100 × 76 cm',
          'state' => 'expus',
          'newRON' => 3490,
          'priceRON' => 1639,
          'buyEUR' => 165,
          'stock' => 1,
          'img' => 'p43'
        ),
        array(
          'id' => 'm44',
          'cat' => 'mese',
          'name' => 'Masă Metro 120×75',
          'material' => 'metal, ceramică',
          'color' => 'antracit',
          'dims' => '120 × 75 × 75 cm',
          'state' => 'nou',
          'newRON' => 399,
          'priceRON' => 249,
          'buyEUR' => 3,
          'stock' => 3,
          'img' => 'p44'
        ),
        array(
          'id' => 'm45',
          'cat' => 'mese',
          'name' => 'Masă extensibilă Stone 130–190',
          'material' => 'metal, sticlă, ceramică',
          'color' => 'antracit',
          'dims' => '130-190 × 100 × 77 cm',
          'state' => 'defecte',
          'newRON' => 4390,
          'priceRON' => 1669,
          'buyEUR' => 124,
          'stock' => 1,
          'img' => 'p45',
          'defect' => 'Mică adâncitură pe partea laterală stângă.'
        ),
        array(
          'id' => 'm46',
          'cat' => 'masute',
          'name' => 'Măsuță Curve',
          'material' => 'lemn masiv',
          'color' => 'nuc',
          'dims' => null,
          'state' => 'resigilat',
          'newRON' => 549,
          'priceRON' => 289,
          'buyEUR' => 3,
          'stock' => 4,
          'img' => 'p46'
        ),
        array(
          'id' => 'm47',
          'cat' => 'masute',
          'name' => 'Măsuță Ball Ø45',
          'material' => 'lemn, metal',
          'color' => 'stejar / negru',
          'dims' => '45 × 45 × 50 cm',
          'state' => 'nou',
          'newRON' => 699,
          'priceRON' => 429,
          'buyEUR' => 10,
          'stock' => 2,
          'img' => 'p47'
        ),
        array(
          'id' => 'm48',
          'cat' => 'masute',
          'name' => 'Măsuță Scandi Ø40',
          'material' => 'lemn, PAL',
          'color' => 'alb',
          'dims' => '40 × 40 × 40 cm',
          'state' => 'expus',
          'newRON' => 249,
          'priceRON' => 119,
          'buyEUR' => 3,
          'stock' => 1,
          'img' => 'p48'
        ),
        array(
          'id' => 'm49',
          'cat' => 'masute',
          'name' => 'Set 3 măsuțe Tower',
          'material' => 'metal, PAL',
          'color' => 'negru',
          'dims' => null,
          'state' => 'nou',
          'newRON' => 189,
          'priceRON' => 119,
          'buyEUR' => 3,
          'stock' => 1,
          'img' => 'p49'
        )
      ),
      'shipping' => array(
        array(
          'id' => 'curier',
          'name' => 'Curier (colete mici)',
          'priceRON' => 49,
          'days' => '2–4 zile',
          'maxRON' => 800
        ),
        array(
          'id' => 'camion',
          'name' => 'Livrare cu camionul',
          'priceRON' => 249,
          'days' => '3–7 zile'
        ),
        array(
          'id' => 'ridicare',
          'name' => 'Ridicare din depozit Satu Mare',
          'priceRON' => 0,
          'days' => 'după confirmare'
        )
      ),
      'payments' => array(
        array(
          'id' => 'ramburs',
          'name' => 'Ramburs la livrare',
          'note' => 'Plătești când primești marfa.'
        ),
        array(
          'id' => 'card',
          'name' => 'Card online',
          'note' => 'Visa / Mastercard (demo în prototip).'
        ),
        array(
          'id' => 'op',
          'name' => 'Transfer bancar (OP)',
          'note' => 'Primești factură proformă pe email.'
        )
      ),
      'services' => array(
        array(
          'id' => 'montaj',
          'name' => 'Montaj la domiciliu',
          'priceRON' => 149
        )
      ),
      'faq' => array(
        array(
          'Ce înseamnă mobilă outlet din Germania?',
          'Aducem direct din Germania surplus de stoc, colecții trecute, retururi și produse din expoziție. Aceleași produse care se vând acolo la preț întreg, la noi la preț de outlet.'
        ),
        array(
          'Ce diferență e între Nou, Resigilat, Expus și Mici defecte?',
          'Fiecare produs are starea scrisă pe card și pe pagină. La „Mici defecte” descriem exact ce are și unde, ca să știi ce cumperi.'
        ),
        array(
          'Pot vedea produsul înainte să-l cumpăr?',
          'Da. Toate produsele sunt în depozitul din Satu Mare. Ne suni, programăm vizita și îl vezi pe viu.'
        ),
        array(
          'Faceți montaj?',
          'Da, montaj la domiciliu la 149 lei pe produs. Îl bifezi în coș.'
        ),
        array(
          'Am garanție?',
          'Da, 2 ani garanție pe toate produsele, inclusiv cele resigilate sau expuse. La „Mici defecte”, garanția nu acoperă defectul descris.'
        ),
        array(
          'Pot returna?',
          'Da, în 14 zile de la livrare, conform legii, dacă produsul e în starea în care l-ai primit.'
        )
      )
    );
}
