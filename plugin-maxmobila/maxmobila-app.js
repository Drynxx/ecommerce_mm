/**
 * MaxMobila - Headless Outlet Store App
 * Identical frontend engine extracted from MaxMobila.html
 * Supports standalone mode & WordPress/WooCommerce integration
 */
(function() {
  'use strict';

  const DEFAULT_DATA = {
  "store": {
    "name": "MaxMobila",
    "tagline": "Outlet · mobilă din Germania",
    "phone": "+40 700 000 000",
    "phoneRaw": "+40700000000",
    "email": "contact@maxmobila.ro",
    "city": "Satu Mare",
    "address": "Showroom & depozit, Satu Mare",
    "freeShipOverRON": 2500,
    "warrantyYears": 2
  },
  "calc": {
    "fx": 5.05,
    "transportEUR": 18,
    "lossPct": 0.1,
    "good": 2.5,
    "marginal": 1.5
  },
  "categories": [
    {
      "id": "canapele",
      "name": "Canapele & colțare"
    },
    {
      "id": "fotolii",
      "name": "Fotolii & taburete"
    },
    {
      "id": "paturi",
      "name": "Paturi"
    },
    {
      "id": "noptiere",
      "name": "Noptiere"
    },
    {
      "id": "dulapuri",
      "name": "Dulapuri"
    },
    {
      "id": "comode",
      "name": "Comode"
    },
    {
      "id": "mese",
      "name": "Mese"
    },
    {
      "id": "scaune",
      "name": "Scaune"
    },
    {
      "id": "masute",
      "name": "Măsuțe"
    },
    {
      "id": "birouri",
      "name": "Birouri"
    }
  ],
  "states": [
    {
      "id": "nou",
      "name": "Nou",
      "short": "Nou, în ambalaj original",
      "desc": "Produs nou, nefolosit, în cutia originală. Surplus de stoc sau colecție trecută din magazinele din Germania."
    },
    {
      "id": "resigilat",
      "name": "Resigilat",
      "short": "Desfăcut, nefolosit",
      "desc": "Cutia a fost deschisă (retur sau verificare), produsul nu a fost folosit. Complet, verificat de noi."
    },
    {
      "id": "expus",
      "name": "Expus",
      "short": "Din showroom",
      "desc": "A stat expus în showroom. Poate avea urme minime de manipulare, fără defecte de funcționare."
    },
    {
      "id": "defecte",
      "name": "Mici defecte",
      "short": "Defect estetic descris",
      "desc": "Are un defect estetic mic, descris exact pe pagina produsului și arătat în poze. Prețul e redus pe măsură."
    }
  ],
  "products": [
    {
      "id": "m00",
      "cat": "canapele",
      "name": "Canapea Bigsofa Verona",
      "material": "textil",
      "color": "verde oliv",
      "dims": null,
      "state": "nou",
      "newRON": 3590,
      "priceRON": 2229,
      "buyEUR": 110,
      "stock": 1,
      "img": "p00"
    },
    {
      "id": "m01",
      "cat": "canapele",
      "name": "Canapea 3 locuri Nuvola",
      "material": "textil",
      "color": "alb crem",
      "dims": null,
      "state": "resigilat",
      "newRON": 5890,
      "priceRON": 3059,
      "buyEUR": 184,
      "stock": 2,
      "img": "p01"
    },
    {
      "id": "m02",
      "cat": "canapele",
      "name": "Canapea 3,5 locuri Cognac",
      "material": "piele",
      "color": "maro închis",
      "dims": null,
      "state": "expus",
      "newRON": 7790,
      "priceRON": 3659,
      "buyEUR": 266,
      "stock": 1,
      "img": "p02"
    },
    {
      "id": "m03",
      "cat": "paturi",
      "name": "Pat tapițat Linea 140×200 cu ladă",
      "material": "catifea",
      "color": "gri",
      "dims": null,
      "state": "nou",
      "newRON": 1586,
      "priceRON": 979,
      "buyEUR": 74,
      "stock": 3,
      "img": "p03"
    },
    {
      "id": "m04",
      "cat": "paturi",
      "name": "Pat tapițat Siena 160×200",
      "material": "textil",
      "color": "bej",
      "dims": null,
      "state": "defecte",
      "newRON": 2490,
      "priceRON": 949,
      "buyEUR": 47,
      "stock": 1,
      "img": "p04",
      "defect": "Mică adâncitură pe partea laterală stângă."
    },
    {
      "id": "m05",
      "cat": "paturi",
      "name": "Pat tapițat Nox 160×200 cu LED și USB",
      "material": "textil",
      "color": "gri",
      "dims": null,
      "state": "resigilat",
      "newRON": 2072,
      "priceRON": 1079,
      "buyEUR": 39,
      "stock": 4,
      "img": "p05"
    },
    {
      "id": "m06",
      "cat": "paturi",
      "name": "Pat extensibil Duo 90/180×200",
      "material": "textil",
      "color": "bej",
      "dims": null,
      "state": "nou",
      "newRON": 2519,
      "priceRON": 1559,
      "buyEUR": 156,
      "stock": 2,
      "img": "p06"
    },
    {
      "id": "m07",
      "cat": "paturi",
      "name": "Pat Alba 160×200",
      "material": "pal melaminat",
      "color": "alb / crom",
      "dims": null,
      "state": "expus",
      "newRON": 599,
      "priceRON": 279,
      "buyEUR": 3,
      "stock": 1,
      "img": "p07"
    },
    {
      "id": "m08",
      "cat": "paturi",
      "name": "Pat tapițat Oslo 160×200",
      "material": "textil",
      "color": "gri",
      "dims": null,
      "state": "nou",
      "newRON": 2267,
      "priceRON": 1409,
      "buyEUR": 102,
      "stock": 1,
      "img": "p08"
    },
    {
      "id": "m09",
      "cat": "dulapuri",
      "name": "Șifonier Kira 120 cm",
      "material": "pal melaminat",
      "color": "alb",
      "dims": "120 × 196 × 53,5 cm",
      "state": "resigilat",
      "newRON": 719,
      "priceRON": 369,
      "buyEUR": 3,
      "stock": 2,
      "img": "p09"
    },
    {
      "id": "m10",
      "cat": "dulapuri",
      "name": "Dulap Linz 225 cm cu oglindă",
      "material": "pal melaminat",
      "color": "alb / crom",
      "dims": "225 × 210 × 58 cm",
      "state": "expus",
      "newRON": 1490,
      "priceRON": 699,
      "buyEUR": 28,
      "stock": 1,
      "img": "p10"
    },
    {
      "id": "m11",
      "cat": "dulapuri",
      "name": "Dulap Riva 129 cm",
      "material": "pal melaminat",
      "color": "stejar / alb",
      "dims": "128,7 × 200 × 54 cm",
      "state": "nou",
      "newRON": 1690,
      "priceRON": 1049,
      "buyEUR": 63,
      "stock": 3,
      "img": "p11"
    },
    {
      "id": "m12",
      "cat": "dulapuri",
      "name": "Dulap Mini 81 cm",
      "material": "pal melaminat",
      "color": "alb",
      "dims": "81 × 176 × 51,1 cm",
      "state": "defecte",
      "newRON": 329,
      "priceRON": 129,
      "buyEUR": 3,
      "stock": 1,
      "img": "p12",
      "defect": "Tapițerie cu o mică decolorare pe spătar, zona din spate."
    },
    {
      "id": "m13",
      "cat": "scaune",
      "name": "Scaun Tono",
      "material": "metal, textil",
      "color": "gri închis",
      "dims": null,
      "state": "resigilat",
      "newRON": 90,
      "priceRON": 47,
      "buyEUR": 3,
      "stock": 4,
      "img": "p13"
    },
    {
      "id": "m14",
      "cat": "scaune",
      "name": "Scaun Tono",
      "material": "metal, textil",
      "color": "gri",
      "dims": null,
      "state": "nou",
      "newRON": 90,
      "priceRON": 56,
      "buyEUR": 3,
      "stock": 2,
      "img": "p14"
    },
    {
      "id": "m15",
      "cat": "scaune",
      "name": "Scaun Mila",
      "material": "metal, textil",
      "color": "bej",
      "dims": null,
      "state": "expus",
      "newRON": 239,
      "priceRON": 109,
      "buyEUR": 3,
      "stock": 1,
      "img": "p15"
    },
    {
      "id": "m16",
      "cat": "scaune",
      "name": "Scaun cu brațe Rombo",
      "material": "metal, textil",
      "color": "gri / negru",
      "dims": null,
      "state": "nou",
      "newRON": 199,
      "priceRON": 119,
      "buyEUR": 3,
      "stock": 1,
      "img": "p16"
    },
    {
      "id": "m17",
      "cat": "scaune",
      "name": "Scaun rotativ cu brațe Arco",
      "material": "lemn, metal, textil",
      "color": "taupe",
      "dims": null,
      "state": "resigilat",
      "newRON": 499,
      "priceRON": 259,
      "buyEUR": 4,
      "stock": 2,
      "img": "p17"
    },
    {
      "id": "m18",
      "cat": "scaune",
      "name": "Scaun cu brațe Luna",
      "material": "metal, textil",
      "color": "crem",
      "dims": null,
      "state": "expus",
      "newRON": 259,
      "priceRON": 119,
      "buyEUR": 3,
      "stock": 1,
      "img": "p18"
    },
    {
      "id": "m19",
      "cat": "birouri",
      "name": "Birou Nova 120 cm",
      "material": "metal, PAL",
      "color": "alb",
      "dims": "120 × 55 × 76 cm",
      "state": "nou",
      "newRON": 1090,
      "priceRON": 679,
      "buyEUR": 27,
      "stock": 3,
      "img": "p19"
    },
    {
      "id": "m20",
      "cat": "birouri",
      "name": "Birou Fjord 140 cm",
      "material": "lemn, PAL",
      "color": "alb / stejar",
      "dims": "140 × 45-60 × 76 cm",
      "state": "defecte",
      "newRON": 859,
      "priceRON": 329,
      "buyEUR": 7,
      "stock": 1,
      "img": "p20",
      "defect": "Zgârietură fină de ~2 cm pe latura din spate, nu se vede la montaj."
    },
    {
      "id": "m21",
      "cat": "birouri",
      "name": "Birou Compact 91 cm",
      "material": "PAL",
      "color": "stejar",
      "dims": "91,5 × 50 × 75 cm",
      "state": "resigilat",
      "newRON": 249,
      "priceRON": 129,
      "buyEUR": 3,
      "stock": 4,
      "img": "p21"
    },
    {
      "id": "m22",
      "cat": "birouri",
      "name": "Birou Wave 140 cm",
      "material": "PAL lucios",
      "color": "alb / gri",
      "dims": "140 × 55 × 76 cm",
      "state": "nou",
      "newRON": 999,
      "priceRON": 619,
      "buyEUR": 24,
      "stock": 2,
      "img": "p22"
    },
    {
      "id": "m24",
      "cat": "canapele",
      "name": "Colțar extensibil Bruno 294×173",
      "material": "textil",
      "color": "gri",
      "dims": null,
      "state": "expus",
      "newRON": 5690,
      "priceRON": 2669,
      "buyEUR": 122,
      "stock": 1,
      "img": "p24"
    },
    {
      "id": "m25",
      "cat": "canapele",
      "name": "Colțar electric Relax 284×183",
      "material": "textil",
      "color": "grej",
      "dims": null,
      "state": "nou",
      "newRON": 9990,
      "priceRON": 6189,
      "buyEUR": 671,
      "stock": 1,
      "img": "p25"
    },
    {
      "id": "m26",
      "cat": "fotolii",
      "name": "Balansoar Nordic",
      "material": "lemn, textil",
      "color": "roz",
      "dims": null,
      "state": "resigilat",
      "newRON": 499,
      "priceRON": 259,
      "buyEUR": 3,
      "stock": 2,
      "img": "p26"
    },
    {
      "id": "m27",
      "cat": "fotolii",
      "name": "Fotoliu Velvet",
      "material": "textil",
      "color": "albastru",
      "dims": null,
      "state": "expus",
      "newRON": 369,
      "priceRON": 169,
      "buyEUR": 3,
      "stock": 1,
      "img": "p27"
    },
    {
      "id": "m28",
      "cat": "fotolii",
      "name": "Taburet Puff",
      "material": "lemn, textil",
      "color": "grej",
      "dims": null,
      "state": "nou",
      "newRON": 269,
      "priceRON": 169,
      "buyEUR": 3,
      "stock": 3,
      "img": "p28"
    },
    {
      "id": "m29",
      "cat": "fotolii",
      "name": "Fotoliu de masaj Zen",
      "material": "textil",
      "color": "gri",
      "dims": null,
      "state": "defecte",
      "newRON": 7390,
      "priceRON": 2809,
      "buyEUR": 167,
      "stock": 1,
      "img": "p29",
      "defect": "Lipsă un capac decorativ la șurub — inclus în colet un înlocuitor."
    },
    {
      "id": "m30",
      "cat": "noptiere",
      "name": "Noptieră Cara 40 cm",
      "material": "PAL",
      "color": "cașmir",
      "dims": "40 × 55 × 48 cm",
      "state": "resigilat",
      "newRON": 279,
      "priceRON": 149,
      "buyEUR": 3,
      "stock": 4,
      "img": "p30"
    },
    {
      "id": "m31",
      "cat": "noptiere",
      "name": "Noptieră suspendată Flo",
      "material": "PAL",
      "color": "cașmir",
      "dims": "50 × 16 × 40 cm",
      "state": "nou",
      "newRON": 229,
      "priceRON": 139,
      "buyEUR": 3,
      "stock": 2,
      "img": "p31"
    },
    {
      "id": "m32",
      "cat": "noptiere",
      "name": "Noptieră Artisan",
      "material": "stejar",
      "color": "stejar",
      "dims": "42 × 28 × 30 cm",
      "state": "expus",
      "newRON": 499,
      "priceRON": 229,
      "buyEUR": 3,
      "stock": 1,
      "img": "p32"
    },
    {
      "id": "m33",
      "cat": "noptiere",
      "name": "Noptieră Cara 40 cm",
      "material": "PAL",
      "color": "alb",
      "dims": "40 × 55 × 48 cm",
      "state": "nou",
      "newRON": 199,
      "priceRON": 119,
      "buyEUR": 3,
      "stock": 1,
      "img": "p33"
    },
    {
      "id": "m34",
      "cat": "noptiere",
      "name": "Noptieră Graf 46 cm",
      "material": "PAL",
      "color": "grafit",
      "dims": "46 × 61 × 42 cm",
      "state": "resigilat",
      "newRON": 319,
      "priceRON": 169,
      "buyEUR": 3,
      "stock": 2,
      "img": "p34"
    },
    {
      "id": "m35",
      "cat": "comode",
      "name": "Comodă Tall 80 cm",
      "material": "PAL",
      "color": "alb",
      "dims": "80 × 103 × 48 cm",
      "state": "expus",
      "newRON": 449,
      "priceRON": 209,
      "buyEUR": 3,
      "stock": 1,
      "img": "p35"
    },
    {
      "id": "m36",
      "cat": "comode",
      "name": "Comodă Mini 60 cm",
      "material": "PAL",
      "color": "alb",
      "dims": "60 × 70 × 30 cm",
      "state": "nou",
      "newRON": 139,
      "priceRON": 86,
      "buyEUR": 3,
      "stock": 3,
      "img": "p36"
    },
    {
      "id": "m37",
      "cat": "comode",
      "name": "Comodă Wide 160 cm",
      "material": "PAL",
      "color": "alb / beton",
      "dims": "160 × 82 × 35 cm",
      "state": "defecte",
      "newRON": 599,
      "priceRON": 229,
      "buyEUR": 3,
      "stock": 1,
      "img": "p37",
      "defect": "Colț ușor ciobit la bază (3 mm)."
    },
    {
      "id": "m38",
      "cat": "comode",
      "name": "Comodă cu uși Mix 139 cm",
      "material": "PAL",
      "color": "alb / stejar",
      "dims": "139 × 90 × 34 cm",
      "state": "resigilat",
      "newRON": 599,
      "priceRON": 309,
      "buyEUR": 3,
      "stock": 4,
      "img": "p38"
    },
    {
      "id": "m39",
      "cat": "comode",
      "name": "Comodă Wide 160 cm",
      "material": "PAL",
      "color": "alb",
      "dims": "160 × 79 × 48 cm",
      "state": "nou",
      "newRON": 719,
      "priceRON": 449,
      "buyEUR": 17,
      "stock": 2,
      "img": "p39"
    },
    {
      "id": "m40",
      "cat": "mese",
      "name": "Masă ovală Terra 200×110",
      "material": "lemn, ceramică",
      "color": "alb marmorat / stejar",
      "dims": "200 × 110 × 75 cm",
      "state": "expus",
      "newRON": 1790,
      "priceRON": 839,
      "buyEUR": 61,
      "stock": 1,
      "img": "p40"
    },
    {
      "id": "m41",
      "cat": "mese",
      "name": "Masă rotundă Cono Ø120",
      "material": "lemn, ceramică",
      "color": "alb / nuc",
      "dims": "120 × 120 × 75 cm",
      "state": "nou",
      "newRON": 1290,
      "priceRON": 799,
      "buyEUR": 37,
      "stock": 1,
      "img": "p41"
    },
    {
      "id": "m42",
      "cat": "mese",
      "name": "Masă extensibilă Cross 180–220",
      "material": "metal, PAL",
      "color": "stejar / negru",
      "dims": "180-220 × 100 × 75 cm",
      "state": "resigilat",
      "newRON": 1190,
      "priceRON": 619,
      "buyEUR": 14,
      "stock": 2,
      "img": "p42"
    },
    {
      "id": "m43",
      "cat": "mese",
      "name": "Masă Live Edge 200×100",
      "material": "lemn masiv, metal",
      "color": "nuc / negru",
      "dims": "200 × 100 × 76 cm",
      "state": "expus",
      "newRON": 3490,
      "priceRON": 1639,
      "buyEUR": 165,
      "stock": 1,
      "img": "p43"
    },
    {
      "id": "m44",
      "cat": "mese",
      "name": "Masă Metro 120×75",
      "material": "metal, ceramică",
      "color": "antracit",
      "dims": "120 × 75 × 75 cm",
      "state": "nou",
      "newRON": 399,
      "priceRON": 249,
      "buyEUR": 3,
      "stock": 3,
      "img": "p44"
    },
    {
      "id": "m45",
      "cat": "mese",
      "name": "Masă extensibilă Stone 130–190",
      "material": "metal, sticlă, ceramică",
      "color": "antracit",
      "dims": "130-190 × 100 × 77 cm",
      "state": "defecte",
      "newRON": 4390,
      "priceRON": 1669,
      "buyEUR": 124,
      "stock": 1,
      "img": "p45",
      "defect": "Mică adâncitură pe partea laterală stângă."
    },
    {
      "id": "m46",
      "cat": "masute",
      "name": "Măsuță Curve",
      "material": "lemn masiv",
      "color": "nuc",
      "dims": null,
      "state": "resigilat",
      "newRON": 549,
      "priceRON": 289,
      "buyEUR": 3,
      "stock": 4,
      "img": "p46"
    },
    {
      "id": "m47",
      "cat": "masute",
      "name": "Măsuță Ball Ø45",
      "material": "lemn, metal",
      "color": "stejar / negru",
      "dims": "45 × 45 × 50 cm",
      "state": "nou",
      "newRON": 699,
      "priceRON": 429,
      "buyEUR": 10,
      "stock": 2,
      "img": "p47"
    },
    {
      "id": "m48",
      "cat": "masute",
      "name": "Măsuță Scandi Ø40",
      "material": "lemn, PAL",
      "color": "alb",
      "dims": "40 × 40 × 40 cm",
      "state": "expus",
      "newRON": 249,
      "priceRON": 119,
      "buyEUR": 3,
      "stock": 1,
      "img": "p48"
    },
    {
      "id": "m49",
      "cat": "masute",
      "name": "Set 3 măsuțe Tower",
      "material": "metal, PAL",
      "color": "negru",
      "dims": null,
      "state": "nou",
      "newRON": 189,
      "priceRON": 119,
      "buyEUR": 3,
      "stock": 1,
      "img": "p49"
    }
  ],
  "shipping": [
    {
      "id": "curier",
      "name": "Curier (colete mici)",
      "priceRON": 49,
      "days": "2–4 zile",
      "maxRON": 800
    },
    {
      "id": "camion",
      "name": "Livrare cu camionul",
      "priceRON": 249,
      "days": "3–7 zile"
    },
    {
      "id": "ridicare",
      "name": "Ridicare din depozit Satu Mare",
      "priceRON": 0,
      "days": "după confirmare"
    }
  ],
  "payments": [
    {
      "id": "ramburs",
      "name": "Ramburs la livrare",
      "note": "Plătești când primești marfa."
    },
    {
      "id": "card",
      "name": "Card online",
      "note": "Visa / Mastercard (demo în prototip)."
    },
    {
      "id": "op",
      "name": "Transfer bancar (OP)",
      "note": "Primești factură proformă pe email."
    }
  ],
  "services": [
    {
      "id": "montaj",
      "name": "Montaj la domiciliu",
      "priceRON": 149
    }
  ],
  "faq": [
    [
      "Ce înseamnă mobilă outlet din Germania?",
      "Aducem direct din Germania surplus de stoc, colecții trecute, retururi și produse din expoziție. Aceleași produse care se vând acolo la preț întreg, la noi la preț de outlet."
    ],
    [
      "Ce diferență e între Nou, Resigilat, Expus și Mici defecte?",
      "Fiecare produs are starea scrisă pe card și pe pagină. La „Mici defecte” descriem exact ce are și unde, ca să știi ce cumperi."
    ],
    [
      "Pot vedea produsul înainte să-l cumpăr?",
      "Da. Toate produsele sunt în depozitul din Satu Mare. Ne suni, programăm vizita și îl vezi pe viu."
    ],
    [
      "Faceți montaj?",
      "Da, montaj la domiciliu la 149 lei pe produs. Îl bifezi în coș."
    ],
    [
      "Am garanție?",
      "Da, 2 ani garanție pe toate produsele, inclusiv cele resigilate sau expuse. La „Mici defecte”, garanția nu acoperă defectul descris."
    ],
    [
      "Pot returna?",
      "Da, în 14 zile de la livrare, conform legii, dacă produsul e în starea în care l-ai primit."
    ]
  ]
};

  const DATA = (window.MAXMOBILA_DATA && typeof window.MAXMOBILA_DATA === 'object')
    ? Object.assign({}, DEFAULT_DATA, window.MAXMOBILA_DATA)
    : DEFAULT_DATA;

const TODAY = new Date();
const S = DATA.store, C = DATA.calc;

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lei = n => Math.round(n).toLocaleString('ro-RO') + ' lei';
const byId = (a, id) => a.find(x => String(x.id) === String(id));
const I = {
  cart:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>',
  plus:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M12 5v14M5 12h14"/></svg>',
  phone:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  pin:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  arrow:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 5l7 7-7 7"/></svg>'
};

/* ---------- state derivat ---------- */
const CAT = Object.fromEntries(DATA.categories.map(c => [c.id, c]));
const ST = Object.fromEntries(DATA.states.map(s => [s.id, s]));
const P = DATA.products.map(p => {
  const cost = (p.buyEUR + C.transportEUR) / (1 - C.lossPct) * C.fx, mult = p.priceRON / cost;
  return { ...p, costRON: cost, profitRON: p.priceRON - cost, mult,
    verdict: mult >= C.good ? 'BUN' : mult >= C.marginal ? 'Marginal' : 'NU',
    disc: Math.round((1 - p.priceRON / p.newRON) * 100) };
});
const inCat = id => P.filter(p => p.cat === id);
const maxDisc = Math.max(...P.map(p => p.disc));
const avgDisc = Math.round(P.reduce((a, p) => a + p.disc, 0) / P.length);
if (!window.MAXMOBILA_ASSETS_URL) {
  const currentScript = document.currentScript;
  if (currentScript && currentScript.src) {
    window.MAXMOBILA_ASSETS_URL = currentScript.src.substring(0, currentScript.src.lastIndexOf('/') + 1) + 'assets/images/';
  } else {
    window.MAXMOBILA_ASSETS_URL = '/wp-content/plugins/plugin-maxmobila/assets/images/';
  }
}

const imgUrl = (p) => {
  if (!p) return '';
  if (p.custom_img) return p.custom_img;
  if (window.MAXMOBILA_ASSETS_URL && p.img) {
    return window.MAXMOBILA_ASSETS_URL + p.img + '.webp';
  }
  if (typeof IMGS !== 'undefined' && IMGS[p.img]) {
    return IMGS[p.img];
  }
  return '';
};
const img = (p, cls) => `<img src="${imgUrl(p)}" alt="${esc(p ? p.name : '')}"${cls ? ` class="${cls}"` : ''} loading="lazy">`;
const stBadge = p => `<span class="st ${p.state}">${ST[p.state].name}</span>`;
const meta = p => [p.material, p.color].filter(Boolean).map(esc).join(' · ');

/* ---------- coș ---------- */
let CART = { items: {}, svc: {}, ship: null, pay: 'ramburs', type: 'pf' };
let FORM = {}, ERR = [], PQ = 1; const ORDERS = {};
try { const s = JSON.parse(localStorage.getItem('mx_cart') || 'null'); if (s) CART = { ...CART, ...s }; } catch (e) {}
const save = () => { try { localStorage.setItem('mx_cart', JSON.stringify(CART)); } catch (e) {} };
const lines = () => Object.entries(CART.items).map(([id, q]) => { const p = byId(P, id); return p ? { p, q, tot: p.priceRON * q } : null; }).filter(Boolean);
const count = () => lines().reduce((a, l) => a + l.q, 0);
function totals(){
  const L = lines(), sub = L.reduce((a, l) => a + l.tot, 0), was = L.reduce((a, l) => a + l.p.newRON * l.q, 0);
  const big = L.some(l => l.p.priceRON > DATA.shipping[0].maxRON);
  const ships = DATA.shipping.map(s => ({ ...s, disabled: s.id === 'curier' && big, cost: s.id !== 'ridicare' && sub >= S.freeShipOverRON ? 0 : s.priceRON }));
  let ship = byId(ships, CART.ship); if (!ship || ship.disabled) ship = big ? byId(ships, 'camion') : byId(ships, 'curier');
  const units = count();
  const svc = DATA.services.filter(s => CART.svc[s.id]).map(s => ({ ...s, q: units, tot: s.priceRON * units }));
  const svcTot = svc.reduce((a, s) => a + s.tot, 0);
  return { L, sub, was, big, ships, ship, svc, svcTot, total: sub + svcTot + (L.length ? ship.cost : 0) };
}
function add(id, q){ const p = byId(P, id); q = q || 1; CART.items[id] = Math.min(p.stock, (CART.items[id] || 0) + q); save(); renderTop(); toast(`Adăugat în coș: ${esc(p.name)}`, '#/cos', 'Vezi coșul'); const cm = document.getElementById('maxmobila-cos-embed'); if (cm) cm.innerHTML = V.cos(); }
function setQ(id, d){ const p = byId(P, id); const n = (CART.items[id] || 0) + d; if (n <= 0) delete CART.items[id]; else CART.items[id] = Math.min(p.stock, n); save(); render(true); const cm = document.getElementById('maxmobila-cos-embed'); if (cm) cm.innerHTML = V.cos(); }
function del(id){ delete CART.items[id]; save(); render(true); const cm = document.getElementById('maxmobila-cos-embed'); if (cm) cm.innerHTML = V.cos(); }
function toggleSvc(id){ CART.svc[id] = !CART.svc[id]; save(); render(true); const cm = document.getElementById('maxmobila-cos-embed'); if (cm) cm.innerHTML = V.cos(); }
function setShip(id){ CART.ship = id; save(); render(true); const cm = document.getElementById('maxmobila-cos-embed'); if (cm) cm.innerHTML = V.cos(); const chm = document.getElementById('maxmobila-checkout-embed'); if (chm) chm.innerHTML = V.checkout(); }
function setPay(id){ CART.pay = id; save(); render(true); const chm = document.getElementById('maxmobila-checkout-embed'); if (chm) chm.innerHTML = V.checkout(); }
function setType(t){ CART.type = t; save(); render(true); const chm = document.getElementById('maxmobila-checkout-embed'); if (chm) chm.innerHTML = V.checkout(); }
let tT; function toast(m, h, l){ const t = document.getElementById('toast'); t.innerHTML = `<span>${m}</span>${h ? `<a href="${h}">${l}</a>` : ''}`; t.classList.add('show'); clearTimeout(tT); tT = setTimeout(() => t.classList.remove('show'), 3000); }

/* ---------- chrome ---------- */
const logoUrl = (window.MAXMOBILA_ASSETS_URL || '/wp-content/plugins/plugin-maxmobila/assets/images/') + 'logo-maxmobila.png';
const logoDarkUrl = (window.MAXMOBILA_ASSETS_URL || '/wp-content/plugins/plugin-maxmobila/assets/images/') + 'logo-maxmobila-white.png';
const logoHTML = `<img src="${logoUrl}" alt="MaxMobila Outlet" class="logo-img" width="220" height="54" loading="eager">`;
const logoFooterHTML = `<img src="${logoDarkUrl}" alt="MaxMobila Outlet" class="logo-img" width="220" height="54" loading="lazy">`;

function renderTop(){
  const { page, q } = parse(); const cat = page === 'produse' ? q.get('cat') : page === 'produs' ? (byId(P, parse().id) || {}).cat : '';
  document.getElementById('promo').innerHTML = `<span>OUTLET · până la −${maxDisc}% față de prețul nou din Germania</span><span class="sp"></span><span class="o">Showroom & depozit în ${S.city} · Livrare în toată țara</span>`;
  document.getElementById('hdr').innerHTML = `<a class="logo" href="#/acasa" aria-label="MaxMobila, acasă">${logoHTML}</a>
    <form class="search" onsubmit="event.preventDefault();go('#/produse?s='+encodeURIComponent(this.s.value))"><input id="s" name="s" placeholder="Caută: canapea, pat 160, masă extensibilă…" value="${page === 'produse' ? esc(q.get('s') || '') : ''}"><button>Caută</button></form>
    <div class="hlinks"><a class="hl" href="#/contact">${I.pin}<span class="t">Showroom</span></a><a class="hl cartb" href="#/cos">${I.cart}<span class="t">Coș</span>${count() ? `<span class="n">${count()}</span>` : ''}</a></div>`;
  document.getElementById('cats').innerHTML = DATA.categories.map(c => `<a href="#/produse?cat=${c.id}" class="${cat === c.id ? 'on' : ''}">${c.name}</a>`).join('') + `<a class="hot" href="#/produse?sort=disc">Reduceri −${maxDisc}%</a>`;
}
function renderStatic(){
  document.getElementById('ftr').innerHTML = `<div class="wrap"><div class="cols">
    <div><a class="logo" href="#/acasa" aria-label="MaxMobila, acasă">${logoFooterHTML}</a><p style="font-size:14px;max-width:320px;margin-top:14px">Mobilă adusă direct din Germania: surplus de stoc, colecții trecute, retururi și expoziție. Showroom și depozit în ${S.city}.</p></div>
    <div><h5>Categorii</h5>${DATA.categories.slice(0, 6).map(c => `<a href="#/produse?cat=${c.id}">${c.name}</a>`).join('')}</div>
    <div><h5>Informații</h5><a href="#/despre">Cum funcționează outlet-ul</a><a href="#/acasa?f=1">Întrebări frecvente</a><a href="#/contact">Showroom & contact</a><a href="#/cos">Coșul meu</a></div>
    <div><h5>Contact</h5><span style="display:block;font-size:14px;user-select:all">${S.phone}</span><span style="display:block;font-size:14px;user-select:all">${S.email}</span><span style="display:block;font-size:14px">${S.address}</span></div>
  </div><div class="bot"><span>© ${TODAY.getFullYear()} ${esc(S.name)}</span></div></div>`;
}

/* ---------- componente ---------- */
let RECENT_IDS = [];
let FAV_IDS = {};
try { RECENT_IDS = JSON.parse(localStorage.getItem('mx_recent') || '[]'); } catch(e) {}
try { FAV_IDS = JSON.parse(localStorage.getItem('mx_favs') || '{}'); } catch(e) {}

const card = p => {
  const isFav = !!FAV_IDS[p.id];
  return `<article class="pc">
  <a class="ph" href="#/produs/${p.id}">${img(p)}</a>
  <span class="tl">${stBadge(p)}</span><span class="tr off">−${p.disc}%</span>
  <div class="bd"><span class="pc-brand">COLECȚIA GERMANIA</span><a href="#/produs/${p.id}"><h3>${esc(p.name)}</h3></a>
    <div class="meta">${meta(p)}${p.dims ? `<br>${esc(p.dims)}` : ''}</div>
    <div class="pr"><div><div class="was">Preț nou: <s>${lei(p.newRON)}</s></div><div class="price num">${lei(p.priceRON)}</div></div>
      <div class="pc-acts"><button type="button" class="pc-fav ${isFav ? 'on' : ''}" onclick="toggleFav('${p.id}',this)" aria-label="Favorite" title="Adaugă la favorite">${isFav ? '♥' : '♡'}</button><button type="button" class="addb" onclick="add('${p.id}')" aria-label="Adaugă în coș" title="Adaugă în coș">${I.cart}</button></div></div></div></article>`;
};
const head = (title, sub, crumbs) => `<section class="pagehead"><div class="wrap"><div class="crumb"><a href="#/acasa">Acasă</a>${(crumbs || []).map(([h, l]) => ` / ${h ? `<a href="${h}">${l}</a>` : l}`).join('')}</div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div></section>`;

/* ========================= VIEWS ========================= */
const V = {};
V.acasa = () => {
  const hero = [byId(P, 'm00'), byId(P, 'm43'), byId(P, 'm04')];
  const top = [...P].sort((a, b) => b.disc - a.disc).slice(0, 8);
  return `
<section class="hero"><div class="wrap g">
  <div><div class="eyebrow">Direct din Germania</div>
    <h1>Mobilă nemțească.<br><em>Preț de outlet.</em></h1>
    <p class="lead">Canapele, paturi, mese și dulapuri din surplusul magazinelor din Germania. Fiecare piesă are starea scrisă clar: nou, resigilat, expus sau cu mici defecte.</p>
    <div class="ctas"><a class="btn red" href="#/produse?sort=disc">Vezi reducerile ${I.arrow}</a><a class="btn outl" href="#/produse">Toate produsele</a></div>
    <div class="hstats"><div><b class="num">${P.length}</b><span>produse în stoc</span></div><div><b class="num">−${avgDisc}%</b><span>reducere medie</span></div><div><b>2 ani</b><span>garanție</span></div></div>
  </div>
  <div class="collage">${hero.map((p, i) => `<a class="tile ${i ? '' : 'big'}" href="#/produs/${p.id}">${img(p)}<span class="off">−${p.disc}%</span><span class="tag"><small>${lei(p.newRON)}</small><b class="num">${lei(p.priceRON)}</b></span></a>`).join('')}</div>
</div></section>

<section class="sec white"><div class="wrap">
  <div class="sh"><div><h2>Categorii</h2><p>Alege camera, noi avem piesa.</p></div><a class="more" href="#/produse">Toate cele ${P.length} de produse</a></div>
  <div class="catgrid">${DATA.categories.map(c => { const ps = inCat(c.id); return `<a class="cat" href="#/produse?cat=${c.id}"><span class="im">${img(ps[0])}</span><b>${c.name}</b><span>${ps.length} produse · de la ${lei(Math.min(...ps.map(p => p.priceRON)))}</span></a>`; }).join('')}</div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sh"><div><h2>Cele mai mari reduceri</h2><p>Față de prețul nou din Germania.</p></div><a class="more" href="#/produse?sort=disc">Vezi toate</a></div>
  <div class="grid">${top.map(card).join('')}</div>
</div></section>

<section class="sec white"><div class="wrap">
  <div class="sh"><div><h2>Știi exact ce cumperi</h2><p>Fiecare produs are una din cele 4 stări. Filtrezi după ea în catalog.</p></div></div>
  <div class="states">${DATA.states.map(s => `<a href="#/produse?st=${s.id}"><span class="st ${s.id}">${s.name}</span><b>${s.short}</b><p>${s.desc}</p><span class="cnt">${P.filter(p => p.state === s.id).length} produse ${I.arrow}</span></a>`).join('')}</div>
</div></section>

<section class="sec"><div class="wrap"><div class="band">
  <div><div class="eyebrow" style="color:var(--gold)">Showroom ${S.city}</div><h2>Vezi mobila pe viu înainte să o cumperi</h2><p>Toate produsele sunt în depozitul nostru. Sună, programăm vizita și testezi canapeaua înainte să plătești.</p></div>
  <div><div class="ph">${S.phone}</div><div class="row"><a class="btn red" href="tel:${S.phoneRaw}">Sună acum</a><a class="btn outl" href="#/contact" style="background:transparent;color:#fff;border-color:#fff">Programează vizita</a></div></div>
</div></div></section>

<section class="sec white" id="faq"><div class="wrap"><div class="sh"><div><h2>Întrebări frecvente</h2></div></div>
  <div class="faq">${DATA.faq.map(([qq, a], i) => `<details class="card" ${i ? '' : 'open'}><summary>${esc(qq)}</summary><div>${esc(a)}</div></details>`).join('')}</div>
</div></section>`;
};

V.produse = (q) => {
  const cat = q.get('cat') || '', st = q.get('st') || '', s = (q.get('s') || '').trim().toLowerCase(), max = +q.get('max') || 0, sort = q.get('sort') || 'rec';
  const base = P.filter(p => !s || (p.name + ' ' + p.material + ' ' + p.color + ' ' + CAT[p.cat].name).toLowerCase().includes(s));
  const f1 = base.filter(p => !cat || p.cat === cat);
  let list = f1.filter(p => (!st || p.state === st) && (!max || p.priceRON <= max));
  const sorts = { rec: (a, b) => a.cat.localeCompare(b.cat) || b.disc - a.disc, disc: (a, b) => b.disc - a.disc, pa: (a, b) => a.priceRON - b.priceRON, pd: (a, b) => b.priceRON - a.priceRON };
  list.sort(sorts[sort] || sorts.rec);
  const o = (k, v, l, n) => `<button class="opt ${String(q.get(k) || '') === String(v) ? 'on' : ''}" onclick="qset('${k}','${v}')">${l}${n != null ? `<em>${n}</em>` : ''}</button>`;
  const chips = [cat && ['cat', CAT[cat].name], st && ['st', ST[st].name], s && ['s', `„${esc(s)}”`], max && ['max', `sub ${lei(max)}`]].filter(Boolean);
  const title = cat ? CAT[cat].name : s ? `Rezultate: „${esc(s)}”` : sort === 'disc' ? 'Reduceri' : 'Toate produsele';
  return head(title, `${list.length} produse · reduceri de până la −${list.length ? Math.max(...list.map(p => p.disc)) : 0}%`, [['#/produse', 'Produse'], ...(cat ? [[null, CAT[cat].name]] : [])]) + `
  <div class="wrap shop"><aside class="filters">
    <h4>Categorie</h4>${o('cat', '', 'Toate', base.length)}${DATA.categories.map(c => o('cat', c.id, c.name, base.filter(p => p.cat === c.id).length)).join('')}
    <h4>Stare</h4>${o('st', '', 'Oricare')}${DATA.states.map(x => o('st', x.id, x.name, f1.filter(p => p.state === x.id).length)).join('')}
    <h4>Buget</h4>${o('max', '', 'Oricât')}${[300, 800, 1500, 3000].map(m => o('max', m, `până la ${lei(m)}`)).join('')}
  </aside><div>
    <div class="toolbar"><b>${list.length} produse</b><select class="inp" id="sort" onchange="qset('sort',this.value)">${[['rec','Recomandate'],['disc','Reducere maximă'],['pa','Preț crescător'],['pd','Preț descrescător']].map(([k, l]) => `<option value="${k}" ${sort === k ? 'selected' : ''}>Sortare: ${l}</option>`).join('')}</select></div>
    ${chips.length ? `<div class="chips">${chips.map(([k, l]) => `<button onclick="qset('${k}','')">${l} ✕</button>`).join('')}<button class="clr" onclick="go('#/produse')">Șterge filtrele</button></div>` : ''}
    ${list.length ? `<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${list.map(card).join('')}</div>` : `<div class="empty"><h3>Niciun produs pentru filtrele alese</h3><p>Scoate un filtru sau sună-ne: poate avem piesa în depozit, încă nefotografiată.</p><button class="btn ink sm" onclick="go('#/produse')">Șterge filtrele</button></div>`}
  </div></div>`;
};

function getColorHex(colStr) {
  const c = (colStr || '').toLowerCase();
  if (c.includes('verde')) return '#556B2F';
  if (c.includes('maro') || c.includes('cognac') || c.includes('nuc')) return '#6E473B';
  if (c.includes('stejar') || c.includes('lemn') || c.includes('natur')) return '#C89D66';
  if (c.includes('gri') || c.includes('antracit')) return '#6E737B';
  if (c.includes('bej') || c.includes('crem') || c.includes('șampanie')) return '#DFD3C3';
  if (c.includes('negru')) return '#222225';
  if (c.includes('roz')) return '#E8B4B8';
  if (c.includes('galben') || c.includes('muștar')) return '#D9A026';
  if (c.includes('albastru')) return '#3B6998';
  return '#F4F3EF';
}

V.produs = (id) => {
  const p = byId(P, id); if (!p) return V.nf();
  // Track recently viewed
  RECENT_IDS = [p.id, ...RECENT_IDS.filter(x => x !== p.id)].slice(0, 8);
  try { localStorage.setItem('mx_recent', JSON.stringify(RECENT_IDS)); } catch(e) {}

  const s = ST[p.state];
  const similar = inCat(p.cat).filter(x => x.id !== p.id).slice(0, 4);
  const crossSell = [...P].filter(x => x.cat !== p.cat).sort((a, b) => b.disc - a.disc).slice(0, 4);
  let recentProds = RECENT_IDS.filter(x => x !== p.id).map(x => byId(P, x)).filter(Boolean).slice(0, 4);
  if (recentProds.length < 4) {
    const filler = P.filter(x => x.id !== p.id && !recentProds.some(r => r.id === x.id)).slice(0, 4 - recentProds.length);
    recentProds = [...recentProds, ...filler];
  }

  const isFav = !!FAV_IDS[p.id];
  const views = [
    ['full', 'Vedere frontală', '1/5 · Ansamblu'],
    ['zoom', 'Detaliu textură & finisaj', '2/5 · Textură'],
    ['left', 'Perspectivă laterală stânga', '3/5 · Unghi 1'],
    ['right', 'Perspectivă laterală dreapta', '4/5 · Unghi 2'],
    ['detail', 'Macro cusături / structură', '5/5 · Detaliu']
  ];

  const shipFast = p.priceRON <= DATA.shipping[0].maxRON ? DATA.shipping[0] : DATA.shipping[1];
  const freeShip = p.priceRON >= S.freeShipOverRON;
  const prodCode = '00236500-' + p.id.toUpperCase();

  return `<div class="p-page-bg">
  <div class="wrap">
    <nav class="p-crumb" aria-label="Breadcrumb">
      <a href="#/acasa">Acasă</a> <span>›</span>
      <a href="#/produse">Produse</a> <span>›</span>
      <a href="#/produse?cat=${p.cat}">${CAT[p.cat].name}</a> <span>›</span>
      <b>${esc(p.name)}</b>
    </nav>

    <div class="pp-hybrid">
      <!-- COLOANA STÂNGA: GALERIE CU THUMBNAILS VERTICALE (STIL XXXLUTZ) -->
      <div class="gal-col">
        <div class="gal-wrap">
          <div class="gal-thumbs" role="tablist" aria-label="Unghiuri vizualizare produs">
            ${views.map(([vKey, vLabel, vShort], idx) => `
              <button type="button" class="gal-thumb ${idx === 0 ? 'on' : ''}" data-v="${vKey}" onclick="setProdView('${vKey}','${vLabel}',this)" title="${vLabel}">
                ${img(p)}
                <span class="t-lbl">${vShort.split('·')[1].trim()}</span>
              </button>
            `).join('')}
          </div>

          <div>
            <div class="gal-stage" id="gal-stage" data-view="full">
              <div class="gal-top-left">
                <span class="brand-pill"><i></i> COLECȚIA GERMANIA</span>
                ${stBadge(p)}
              </div>
              <div class="gal-top-right">
                <span class="off">−${p.disc}%</span>
              </div>
              ${img(p)}
              <span class="gal-view-tag" id="gal-view-tag">Vedere frontală · Verificat în Satu Mare</span>
            </div>
            <div class="gal-caption">
              <span>Fotografii și inspecție realizate în depozitul MaxMobila ${S.city}.</span>
              <span>Cod produs: <b>${prodCode}</b></span>
            </div>
          </div>
        </div>

        <div class="trust" style="margin-top:16px">
          <div>🛡️ Garanție ${S.warrantyYears} ani</div>
          <div>🔄 Retur 14 zile</div>
          <div>📍 Showroom ${S.city}</div>
        </div>
      </div>

      <!-- COLOANA DREAPTA: BUY BOX & INFORMAȚII (FORMAT XXXLUTZ + MAXMOBILA) -->
      <div class="p-info">
        <div class="p-eyebrow-row">
          <span class="p-brand-name">COLECȚIA GERMANIA · ${CAT[p.cat].name}</span>
          <span class="p-sku">Cod produs: ${prodCode}</span>
        </div>

        <h1>${esc(p.name)}</h1>
        <div class="p-submeta">${meta(p)}${p.dims ? ` · ${esc(p.dims)}` : ''}</div>

        <div class="p-badges-bar">
          <span class="p-outlet-badge">PREȚ OUTLET</span>
          ${stBadge(p)}
          <span class="p-rating"><span class="stars">★★★★★</span> 4.9/5</span>
        </div>

        <!-- SECȚIUNEA DE PREȚ CU DELIMITATOARE ORIZONTALE -->
        <div class="p-price-panel">
          <div class="p-was-line">
            <span>Preț de catalog Germania:</span>
            <s>${lei(p.newRON)}</s>
          </div>
          <div class="p-price-row">
            <span class="p-price-big num">${lei(p.priceRON)}</span>
            <span class="p-save-pill">−${p.disc}% (${lei(p.newRON - p.priceRON)})</span>
          </div>
          <div class="p-vat-note">
            Preț cu TVA inclus, plus costuri de livrare · ${freeShip ? '<b style="color:var(--ok)">Transport gratuit inclus</b>' : `Transport de la ${lei(shipFast.priceRON)} (gratuit peste ${lei(S.freeShipOverRON)})`}
          </div>
        </div>

        <!-- ATRIBUTE VIZUALE (EXECUȚIE & DIMENSIUNI) -->
        <div class="p-attrs">
          <div>
            <span class="p-attr-lbl">Execuție: <b>${esc(p.color)} (${esc(p.material)})</b></span>
            <div class="p-swatch-list">
              <div class="p-swatch-chip">
                <span class="p-swatch-dot" style="background:${getColorHex(p.color)}"></span>
                <span>${esc(p.color)}</span>
              </div>
              <div class="p-swatch-chip" style="border-color:var(--line);font-weight:600;color:var(--mut)">
                <span>Material: <b style="color:var(--ink)">${esc(p.material)}</b></span>
              </div>
            </div>
          </div>

          <div>
            <span class="p-attr-lbl">Dimensiuni (L × Î × A):</span>
            <div class="p-dim-select">
              <span>${esc(p.dims || 'Dimensiuni standard de catalog — confirmare telefonică')}</span>
              <span style="font-size:11.5px;color:var(--ok);font-weight:700">✓ În stoc</span>
            </div>
          </div>
        </div>

        <!-- STAREA PRODUSULUI (SPECIFIC MAXMOBILA) -->
        <div class="stbox ${p.state}" style="margin:2px 0 12px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            ${stBadge(p)}
            <b style="font-size:12px">${s.short}</b>
          </div>
          <span>${s.desc}</span>
          ${p.defect ? `<span class="def">⚠️ Detaliu estetic: ${esc(p.defect)}</span>` : ''}
        </div>

        <!-- BUTOANE ACȚIUNE (CANTITATE + INIMIOARĂ PĂTRATĂ + ADAUGĂ ÎN COȘ ROȘU) -->
        <div class="p-cta-box">
          <div class="p-cta-main">
            <div class="qty">
              <button type="button" onclick="changePQ(-1, ${p.stock})" aria-label="Mai puțin">−</button>
              <span id="pq">${PQ}</span>
              <button type="button" onclick="changePQ(1, ${p.stock})" aria-label="Mai mult">+</button>
            </div>
            <button type="button" class="fav-btn ${isFav ? 'on' : ''}" onclick="toggleFav('${p.id}', this)" aria-label="Salvează la favorite" title="Salvează la favorite">
              ${isFav ? '♥' : '♡'}
            </button>
            <button type="button" class="btn red" style="flex:1;font-size:14.5px" onclick="addCurrentPQ('${p.id}', false)">
              ${I.cart} Adaugă în coș
            </button>
          </div>
          <button type="button" class="btn outl block" onclick="addCurrentPQ('${p.id}', true)">
            Cumpără acum — Comandă rapidă pe o pagină ${I.arrow}
          </button>
        </div>

        <!-- DISPONIBILITATE & LIVRARE (STIL XXXLUTZ CU INDICATOR „ÎN STOC ›”) -->
        <div class="p-avail-box">
          <div class="p-avail-item">
            <div class="p-avail-icon">${I.truck}</div>
            <div class="p-avail-body">
              <b>Livrare prin ${shipFast.name}</b>
              <span>Timp estimat de livrare: ${shipFast.days} · Ambalat și asigurat</span><br>
              <a href="#p-conditii-livrare" onclick="event.preventDefault();const d=document.getElementById('p-conditii-livrare');if(d){d.open=true;d.scrollIntoView({behavior:'smooth'});}">Vezi costuri transport și montaj</a>
            </div>
            <span class="p-avail-badge">În stoc</span>
          </div>
          <div class="p-avail-item">
            <div class="p-avail-icon">${I.pin}</div>
            <div class="p-avail-body">
              <b>Ridicare / Vizionare în Showroom ${S.city}</b>
              <span>${p.stock <= 1 ? 'Ultima bucată disponibilă în depozit!' : `${p.stock} bucăți în depozitul din ${S.city}`}</span><br>
              <a href="#/contact">Verifică adresa și programul magazinului</a>
            </div>
            <span class="p-avail-badge ${p.stock <= 1 ? 'low' : ''}">${p.stock <= 1 ? 'Ultima buc.' : 'În stoc'}</span>
          </div>
        </div>

        <!-- SECȚIUNEA „DETALII” CU ICONIȚE ȘI LINK „MAI MULTE DETALII ›” -->
        <div class="p-det-box">
          <h4>Detalii</h4>
          <div class="p-det-list">
            <div class="p-det-row">${I.check} <span>Dimensiuni: <b>${esc(p.dims || 'Standard de catalog')}</b></span></div>
            <div class="p-det-row">${I.shield} <span>Material & finisaj: <b>${esc(p.material)} · ${esc(p.color)}</b></span></div>
            <div class="p-det-row">${I.truck} <span>Montaj opțional la domiciliu (${lei(DATA.services[0].priceRON)} / produs)</span></div>
            <div class="p-det-row">${I.pin} <span>Garanție <b>${S.warrantyYears} ani</b> și retur simplu în 14 zile</span></div>
          </div>
          <a class="p-more-link" href="#p-detalii-complete" onclick="event.preventDefault();document.getElementById('p-detalii-complete')?.scrollIntoView({behavior:'smooth'})">Mai multe detalii ›</a>
        </div>

        <!-- ACORDEOANE SPECIFICAȚII & LIVRARE -->
        <details class="card" open>
          <summary>Specificații</summary>
          <div>
            <table class="spec">
              ${[
                ['Cod produs', prodCode],
                ['Categorie', CAT[p.cat].name],
                ['Dimensiuni (L × Î × A)', p.dims || 'Standard (conform modelului)'],
                ['Material principal', p.material],
                ['Culoare / Execuție', p.color],
                ['Stare produs', s.name + ' (' + s.short + ')'],
                ['Garanție', `${S.warrantyYears} ani`],
                ['Stoc depozit ' + S.city, p.stock + ' buc.']
              ].map(([a, b]) => `<tr><td>${a}</td><td><b>${esc(b)}</b></td></tr>`).join('')}
            </table>
          </div>
        </details>

        <details class="card" id="p-conditii-livrare">
          <summary>Livrare, montaj și retur</summary>
          <div>
            ${DATA.shipping.map(x => `<div style="margin-bottom:6px">• <b>${x.name}</b>: ${x.priceRON ? lei(x.priceRON) : 'Gratuit'} (${x.days})${x.maxRON ? ` — valabil pentru colete sub ${lei(x.maxRON)}` : ''}</div>`).join('')}
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--soft)">
              <b>Livrare gratuită</b> la orice comandă de peste <b>${lei(S.freeShipOverRON)}</b>.<br>
              <b>Plată acceptată:</b> Ramburs la livrare (numerar), Card bancar sau Ordin de plată (OP).
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>
  </div>

  <!-- SECȚIUNEA EDITORIALĂ CENTRALĂ (DESCRIERE DETALIATĂ CA PE XXXLUTZ.RO) -->
  <section class="p-editorial" id="p-detalii-complete">
    <div class="p-ed-wrap">
      <h2>${esc(p.name)} — Calitate germană la preț de outlet</h2>
      <p class="p-ed-lead">Design modern, materiale rezistente și o reducere reală de −${p.disc}% față de prețul din magazinele din Germania.</p>

      <h3>Caracteristici generale</h3>
      <ul class="p-red-bullets">
        <li>Categorie: <b>${CAT[p.cat].name}</b></li>
        <li>Material: <b>${esc(p.material)}</b></li>
        <li>Culoare: <b>${esc(p.color)}</b></li>
        <li>Dimensiuni: <b>${esc(p.dims || 'Standard de catalog')}</b></li>
        <li>Stare verificată: <b>${s.name} — ${s.short}</b></li>
        <li>Economie imediată: <b>${lei(p.newRON - p.priceRON)} (−${p.disc}%)</b></li>
        <li>Disponibilitate: <b>În stoc propriu (${S.city})</b></li>
        <li>Garanție inclusă: <b>${S.warrantyYears} ani</b></li>
      </ul>

      <h3>Despre produs și proveniență</h3>
      <p>
        Piesa <b>${esc(p.name)}</b> face parte din selecția noastră de mobilier importat direct din Germania. Realizată din <b>${esc(p.material)}</b> într-o nuanță versatilă de <b>${esc(p.color)}</b>, această piesă îmbină standardele riguroase de fabricație vest-europene cu funcționalitatea de zi cu zi.
      </p>
      <p>
        Spre deosebire de magazinele care comandă marfa pe bază de catalog cu termen de așteptare de 6–10 săptămâni, la <b>${esc(S.name)}</b> fiecare produs se află fizic în depozitul nostru din <b>${S.city}</b>. Este verificat individual de echipa noastră, încadrat corect în starea <b>„${s.name}”</b> și pregătit pentru livrare rapidă sau ridicare directă.
      </p>

      <h3>Întreținere și recomandări</h3>
      <ul class="p-red-bullets">
        <li>Se curăță ușor cu o lavetă moale, ușor umedă</li>
        <li>Evitați utilizarea detergenților abrazivi sau a solvenților chimici</li>
        <li>Se livrează ambalat corespunzător pentru protecție maximă la transport</li>
        <li>La cerere, echipa noastră asigură montajul la domiciliu (${lei(DATA.services[0].priceRON)})</li>
      </ul>

      <!-- CASETĂ FEEDBACK PAGINĂ -->
      <div class="p-feedback">
        <h4>Cât de mulțumit ești de informațiile din această pagină?</h4>
        <div class="p-fb-grid">
          ${[
            ['😞', 'Foarte nemulțumit'],
            ['😕', 'Nemulțumit'],
            ['😐', 'Neutru'],
            ['🙂', 'Mulțumit'],
            ['😍', 'Foarte mulțumit']
          ].map(([emo, lbl], idx) => `
            <button type="button" class="p-fb-item" onclick="ratePage(${idx+1}, '${lbl}', this)">
              <span>${emo}</span>
              <small>${lbl}</small>
            </button>
          `).join('')}
        </div>
        <div id="p-fb-msg" style="font-size:13px;color:var(--ok);font-weight:700;min-height:20px"></div>
      </div>
    </div>
  </section>

  <!-- RÂNDUL 1: PRODUSE SIMILARE DIN ACEEAȘI CATEGORIE -->
  ${similar.length ? `
  <section class="sec">
    <div class="wrap">
      <div class="sh">
        <div>
          <h2>Produse similare</h2>
          <p>Alte piese din categoria ${CAT[p.cat].name.toLowerCase()} disponibile în depozit.</p>
        </div>
        <a class="more" href="#/produse?cat=${p.cat}">Vezi toate (${inCat(p.cat).length})</a>
      </div>
      <div class="grid">${similar.map(card).join('')}</div>
    </div>
  </section>` : ''}

  <!-- RÂNDUL 2: S-AR PUTEA SĂ-ȚI PLACĂ ȘI (CROSS-SELL) -->
  <section class="sec white">
    <div class="wrap">
      <div class="sh">
        <div>
          <h2>S-ar putea să-ți placă și</h2>
          <p>Piese complementare cu cele mai mari reduceri din stoc.</p>
        </div>
        <a class="more" href="#/produse?sort=disc">Toate reducerile</a>
      </div>
      <div class="grid">${crossSell.map(card).join('')}</div>
    </div>
  </section>

  <!-- RÂNDUL 3: PRODUSE VIZUALIZATE RECENT -->
  ${recentProds.length ? `
  <section class="sec">
    <div class="wrap">
      <div class="sh">
        <div>
          <h2>Produse vizualizate recent</h2>
          <p>Revino rapid la piesele pe care le-ai analizat.</p>
        </div>
      </div>
      <div class="grid">${recentProds.map(card).join('')}</div>
    </div>
  </section>` : ''}

  <!-- BANDA CU CELE 6 AVANTAJE ALE MAGAZINULUI -->
  <section class="p-adv-sec">
    <div class="wrap">
      <h2>Avantajele magazinului ${esc(S.name)} Outlet</h2>
      <div class="p-adv-grid">
        <div class="p-adv-card">
          <div class="p-adv-ic">${I.shield}</div>
          <b>Calitate Germană</b>
          <span>Mobilier original din rețelele de magazine din Germania</span>
        </div>
        <div class="p-adv-card">
          <div class="p-adv-ic"><span style="font:900 14px var(--fd)">%</span></div>
          <b>Prețuri de Outlet</b>
          <span>Economisești până la 70% față de prețul de catalog</span>
        </div>
        <div class="p-adv-card">
          <div class="p-adv-ic">${I.pin}</div>
          <b>Stoc Real în ${S.city}</b>
          <span>Vezi și testezi mobila în showroom înainte de achiziție</span>
        </div>
        <div class="p-adv-card">
          <div class="p-adv-ic">${I.check}</div>
          <b>Stare 100% Clară</b>
          <span>Fiecare piesă este verificată și descrisă transparent</span>
        </div>
        <div class="p-adv-card">
          <div class="p-adv-ic">${I.truck}</div>
          <b>Livrare & Montaj</b>
          <span>Transport sigur în toată țara și opțiune de montaj</span>
        </div>
        <div class="p-adv-card">
          <div class="p-adv-ic">↺</div>
          <b>Garanție ${S.warrantyYears} Ani & Retur</b>
          <span>Cumpără fără griji, cu drept de retur în 14 zile</span>
        </div>
      </div>
    </div>
  </section>`;
};

const shipHTML = T => T.ships.map(s => `<button class="radio ${T.ship.id === s.id ? 'on' : ''} ${s.disabled ? 'dis' : ''}" ${s.disabled ? 'disabled' : `onclick="setShip('${s.id}')"`}><span class="dot"></span><span><b>${s.name}</b><small>${s.days}${s.disabled ? ` · doar pentru produse sub ${lei(s.maxRON)}` : ''}</small></span><span class="pr">${s.cost ? lei(s.cost) : 'Gratuit'}</span></button>`).join('');
const sumHTML = (T, act) => `<aside class="panel sum"><h3>Sumar comandă</h3>
  <div class="r"><span>Produse (${count()})</span><b class="num">${lei(T.sub)}</b></div>
  ${T.svc.map(s => `<div class="r"><span>${s.name} ×${s.q}</span><b class="num">${lei(s.tot)}</b></div>`).join('')}
  <div class="r"><span>${T.ship.name}</span><b class="num">${T.ship.cost ? lei(T.ship.cost) : 'Gratuit'}</b></div>
  <div class="r sv"><span>Economisești față de prețul nou</span><span class="num">${lei(T.was - T.sub)}</span></div>
  <div class="r t"><span>Total</span><span class="num">${lei(T.total)}</span></div>
  <div class="note">TVA inclus.${T.sub < S.freeShipOverRON ? ` Mai adaugă ${lei(S.freeShipOverRON - T.sub)} pentru livrare gratuită.` : ' Ai livrare gratuită.'}</div>${act}</aside>`;

V.cos = () => {
  const T = totals();
  if (!T.L.length) return head('Coșul tău', null, [[null, 'Coș']]) + `<div class="wrap" style="padding:40px 20px 70px"><div class="empty"><h3>Coșul e gol</h3><p>Începe cu cele mai mari reduceri sau alege o categorie.</p><a class="btn red" href="#/produse?sort=disc">Vezi reducerile</a></div></div>`;
  return head('Coșul tău', `${count()} produse · economisești ${lei(T.was - T.sub)}`, [[null, 'Coș']]) + `<div class="wrap two"><div style="display:grid;gap:16px">
    <div class="panel"><h3>Produse</h3>${T.L.map(({ p, q, tot }) => `<div class="line"><a class="im" href="#/produs/${p.id}">${img(p)}</a>
      <div><a href="#/produs/${p.id}"><h4>${esc(p.name)}</h4></a><div class="m">${stBadge(p)} · ${lei(p.priceRON)} / buc.</div><button class="link" onclick="del('${p.id}')">Șterge</button></div>
      <div class="qty" style="height:40px"><button onclick="setQ('${p.id}',-1)" aria-label="Mai puțin">−</button><span>${q}</span><button onclick="setQ('${p.id}',1)" ${q >= p.stock ? 'disabled' : ''} aria-label="Mai mult">+</button></div><div class="tot num">${lei(tot)}</div></div>`).join('')}</div>
    <div class="panel"><h3>Servicii</h3>${DATA.services.map(s => `<label class="check"><input type="checkbox" id="svc-${s.id}" ${CART.svc[s.id] ? 'checked' : ''} onchange="toggleSvc('${s.id}')"><span><b>${s.name}</b> — ${lei(s.priceRON)} / produs</span></label>`).join('')}</div>
    <div class="panel"><h3>Livrare</h3>${shipHTML(T)}</div></div>
    ${sumHTML(T, `<a class="btn red block" href="#/checkout">Finalizează comanda ${I.arrow}</a><a class="btn outl block" href="#/produse" style="margin-top:8px">Continuă cumpărăturile</a>`)}</div>`;
};

const JUD = ['Alba','Arad','Argeș','Bacău','Bihor','Bistrița-Năsăud','Botoșani','Brașov','Brăila','București','Buzău','Caraș-Severin','Călărași','Cluj','Constanța','Covasna','Dâmbovița','Dolj','Galați','Giurgiu','Gorj','Harghita','Hunedoara','Ialomița','Iași','Ilfov','Maramureș','Mehedinți','Mureș','Neamț','Olt','Prahova','Satu Mare','Sălaj','Sibiu','Suceava','Teleorman','Timiș','Tulcea','Vaslui','Vâlcea','Vrancea'];
V.checkout = () => {
  const T = totals(); if (!T.L.length) return V.cos();
  const f = (k, l, req, x) => { x = x || {}; const cls = `inp ${ERR.includes(k) ? 'err' : ''}`;
    const ctl = x.select ? `<select id="f-${k}" class="${cls}" onchange="FORM.${k}=this.value"><option value="">Alege…</option>${x.select.map(o => `<option ${FORM[k] === o ? 'selected' : ''}>${o}</option>`).join('')}</select>`
      : x.area ? `<textarea id="f-${k}" class="inp" rows="3" oninput="FORM.${k}=this.value" placeholder="${x.ph || ''}">${esc(FORM[k])}</textarea>`
      : `<input id="f-${k}" class="${cls}" value="${esc(FORM[k])}" oninput="FORM.${k}=this.value" placeholder="${x.ph || ''}" type="${x.type || 'text'}">`;
    return `<div class="${x.full ? 'full' : ''}"><label for="f-${k}">${l}${req ? ' <i>*</i>' : ''}</label>${ctl}</div>`; };
  return head('Finalizează comanda', 'O singură pagină. Te sunăm în 24h să confirmăm livrarea.', [['#/cos', 'Coș'], [null, 'Comandă']]) + `<div class="wrap two"><div style="display:grid;gap:16px">
    ${ERR.length ? `<div class="alert err">Completează câmpurile marcate cu roșu${ERR.includes('terms') ? ' și bifează acordul cu termenii' : ''}.</div>` : ''}
    <div class="panel"><h3>1. Datele tale</h3><div class="tog"><button class="${CART.type === 'pf' ? 'on' : ''}" onclick="setType('pf')">Persoană fizică</button><button class="${CART.type === 'pj' ? 'on' : ''}" onclick="setType('pj')">Firmă</button></div>
      <div class="frm">${CART.type === 'pj' ? f('firma', 'Denumire firmă', 1, { ph: 'SC Exemplu SRL' }) + f('cui', 'CUI', 1, { ph: 'RO12345678' }) : ''}
      ${f('nume', 'Nume și prenume', 1, { ph: 'Maria Ionescu' })}${f('tel', 'Telefon', 1, { ph: '07xx xxx xxx', type: 'tel' })}${f('email', 'Email', 1, { ph: 'nume@email.ro', type: 'email', full: 1 })}
      ${f('jud', 'Județ', 1, { select: JUD })}${f('loc', 'Localitate', 1, { ph: 'Satu Mare' })}${f('adr', 'Adresă de livrare', 1, { ph: 'Strada, număr, bloc, etaj, apartament', full: 1 })}
      ${f('obs', 'Observații (opțional)', 0, { area: 1, full: 1, ph: 'Ex: etaj 4 fără lift, sunați cu o zi înainte…' })}</div></div>
    <div class="panel"><h3>2. Livrare</h3>${shipHTML(T)}</div>
    <div class="panel"><h3>3. Plată</h3>${DATA.payments.map(m => `<button class="radio ${CART.pay === m.id ? 'on' : ''}" onclick="setPay('${m.id}')"><span class="dot"></span><span><b>${m.name}</b><small>${m.note}</small></span></button>`).join('')}
      ${CART.pay === 'card' ? '<div class="alert info">Pe site-ul real, aici se deschide pagina securizată a procesatorului de plăți. În prototip nu se încasează nimic.</div>' : ''}
      <label class="check" style="margin-top:12px"><input type="checkbox" id="terms" ${FORM.terms ? 'checked' : ''} onchange="FORM.terms=this.checked"><span>Sunt de acord cu termenii și condițiile și am citit starea fiecărui produs din coș. <i style="color:var(--red);font-style:normal">*</i></span></label></div>
  </div>${sumHTML(T, `<button class="btn red block" onclick="placeOrder()">Plasează comanda · ${lei(T.total)}</button><div class="note" style="text-align:center;margin:10px 0 0">Prototip: nu se încasează nimic.</div>`)}</div>`;
};
function placeOrder(){
  const req = ['nume', 'tel', 'email', 'jud', 'loc', 'adr'].concat(CART.type === 'pj' ? ['firma', 'cui'] : []);
  ERR = req.filter(k => !String(FORM[k] || '').trim());
  if (FORM.email && !/^\S+@\S+\.\S+$/.test(FORM.email)) ERR.push('email');
  if (FORM.tel && String(FORM.tel).replace(/\D/g, '').length < 10) ERR.push('tel');
  if (!FORM.terms) ERR.push('terms');
  if (ERR.length){ render(true); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  const id = 'MX-' + (41000 + Object.keys(ORDERS).length + 1);
  const currentTotals = totals();
  ORDERS[id] = { id, T: currentTotals, form: { ...FORM }, pay: byId(DATA.payments, CART.pay), type: CART.type };

  // Sync to WordPress backend if available
  if (window.MAXMOBILA_AJAX_URL) {
    const fd = new FormData();
    fd.append('action', 'maxmobila_submit_order');
    fd.append('nonce', window.MAXMOBILA_NONCE || '');
    fd.append('order_json', JSON.stringify(ORDERS[id]));
    fetch(window.MAXMOBILA_AJAX_URL, { method: 'POST', body: fd }).catch(e => console.log('Notice:', e));
  }

  CART.items = {}; CART.svc = {}; save(); go('#/comanda/' + id);
}
V.comanda = (id) => { const o = ORDERS[id]; if (!o) return V.nf('Comanda nu mai e în memorie. Prototipul nu salvează comenzile după refresh.');
  return `<div class="wrap"><div class="ok"><div class="ic">✓</div><div class="eyebrow">Comanda ${id}</div><h1>Mulțumim, ${esc(o.form.nume.split(' ')[0])}!</h1><p style="color:var(--mut)">Confirmarea a plecat pe <b>${esc(o.form.email)}</b>. Ai economisit <b style="color:var(--red)">${lei(o.T.was - o.T.sub)}</b> față de prețul nou.</p></div>
  <div class="steps4"><div><i>1</i><b>Te sunăm</b><span>În 24h la ${esc(o.form.tel)}, confirmăm stocul și data.</span></div><div><i>2</i><b>${o.pay.id === 'op' ? 'Proforma' : 'Pregătim marfa'}</b><span>${o.pay.id === 'op' ? 'O primești pe email; livrăm după plată.' : 'Verificăm și ambalăm fiecare piesă.'}</span></div><div><i>3</i><b>Livrare</b><span>${o.T.ship.name} · ${o.T.ship.days}.</span></div><div><i>4</i><b>${o.T.svc.length ? 'Montaj' : 'Gata'}</b><span>${o.T.svc.length ? 'Echipa noastră montează la tine acasă.' : 'Garanție 2 ani pe tot.'}</span></div></div>
  <div class="two" style="padding-top:0"><div class="panel"><h3>Produse</h3>${o.T.L.map(({ p, q, tot }) => `<div class="line"><div class="im">${img(p)}</div><div><h4>${esc(p.name)}</h4><div class="m">${q} × ${lei(p.priceRON)}</div></div><div></div><div class="tot num">${lei(tot)}</div></div>`).join('')}
  <p style="font-size:13.5px;color:var(--mut)"><b>Livrare la:</b> ${esc(o.form.adr)}, ${esc(o.form.loc)}, jud. ${esc(o.form.jud)}${o.type === 'pj' ? `<br><b>Factură:</b> ${esc(o.form.firma)} (${esc(o.form.cui)})` : ''}<br><b>Plată:</b> ${o.pay.name}</p></div>
  <aside class="panel"><div class="sum" style="position:static"><div class="r t" style="border:0;margin:0;padding:0"><span>Total</span><span class="num">${lei(o.T.total)}</span></div></div><a class="btn ink block" href="#/acasa" style="margin-top:14px">Înapoi la magazin</a></aside></div></div>`; };

V.despre = () => head('Cum funcționează outlet-ul', 'De unde vine mobila și ce înseamnă fiecare stare.', [[null, 'Despre']]) + `
<section class="sec"><div class="wrap" style="display:grid;gap:22px;max-width:980px">
  <div class="panel"><h3>De unde vine mobila</h3><p style="margin:0">Cumpărăm direct din Germania surplus de stoc, colecții scoase din catalog, retururi și mobilier din expoziție. Marfa ajunge în depozitul nostru din ${S.city}, o verificăm bucată cu bucată, o fotografiem și o punem pe site cu starea ei reală.</p></div>
  <div class="states">${DATA.states.map(s => `<a href="#/produse?st=${s.id}"><span class="st ${s.id}">${s.name}</span><b>${s.short}</b><p>${s.desc}</p></a>`).join('')}</div>
  <div class="panel"><h3>De ce e mai ieftin</h3><p style="margin:0">Magazinele din Germania plătesc depozitare pentru fiecare zi în care o canapea nu se vinde. Pentru ele e mai ieftin să elibereze spațiul. Noi o cumpărăm la preț de lot și o vindem cu o reducere medie de ${avgDisc}% față de prețul nou.</p></div>
</div></section>`;

V.contact = () => head('Showroom & contact', `Vino să vezi mobila pe viu, în ${S.city}.`, [[null, 'Contact']]) + `
<section class="sec"><div class="wrap two" style="padding-block:0">
  <div class="panel"><h3>Programează o vizită sau pune o întrebare</h3>
    <form class="frm" onsubmit="event.preventDefault();this.reset();toast('Mesaj trimis. Revenim în 24h (demo)')">
      <div><label for="c-n">Nume <i>*</i></label><input id="c-n" class="inp" required placeholder="Maria Ionescu"></div>
      <div><label for="c-t">Telefon <i>*</i></label><input id="c-t" class="inp" required placeholder="07xx xxx xxx"></div>
      <div class="full"><label for="c-s">Subiect</label><select id="c-s" class="inp"><option>Vreau să văd un produs în showroom</option><option>Întrebare despre un produs</option><option>Livrare / montaj</option><option>Altceva</option></select></div>
      <div class="full"><label for="c-m">Mesaj</label><textarea id="c-m" class="inp" rows="4" placeholder="Ex: aș vrea să văd colțarul Bruno sâmbătă dimineață"></textarea></div>
      <div class="full"><button class="btn red block">Trimite</button></div></form></div>
  <aside class="panel" style="display:grid;gap:14px">
    <div><div class="eyebrow">Telefon</div><div style="font:900 24px var(--fd);user-select:all">${S.phone}</div></div>
    <div><div class="eyebrow">Email</div><div style="font-weight:800;user-select:all">${S.email}</div></div>
    <div><div class="eyebrow">Adresă</div><div style="font-weight:700">${S.address}</div></div>
    <div><div class="eyebrow">Program</div><div>Luni–Vineri 9–18 · Sâmbătă 9–14</div></div>
    <a class="btn outl" href="https://www.google.com/maps/search/?api=1&query=Satu+Mare" target="_blank" rel="noopener">${I.pin} Deschide în Google Maps</a>
  </aside></div></section>`;

V.intern = () => V.nf('Această pagină a fost scoasă din funcțiune.');
V.nf = (m) => `<div class="wrap" style="padding:70px 20px"><div class="empty"><h3>Pagina nu a fost găsită</h3><p>${m || 'Linkul nu mai e valid.'}</p><a class="btn ink" href="#/acasa">Înapoi acasă</a></div></div>`;

/* ========================= ROUTER ========================= */
function parse(){ 
  const rawHash = location.hash || '';
  const m = rawHash.match(/^#\/([a-z]+)(?:\/([\w-]+))?(?:\?(.*))?$/) || [, 'acasa']; 
  return { raw: rawHash, page: m[1], id: m[2], q: new URLSearchParams(m[3] || '') }; 
}
function qset(k, v){ 
  const p = parse(); 
  const page = (p.page && p.page !== 'acasa') ? p.page : 'produse';
  const q = p.q; 
  if (v === '' || v == null) q.delete(k); else q.set(k, v); 
  const s = q.toString(); 
  go(`#/${page}${p.id ? '/' + p.id : ''}${s ? '?' + s : ''}`); 
}
function go(h){ if (location.hash === h) render(); else location.hash = h; }
let LAST = '';
let INITIAL_SERVER_CONTENT = null;
let IS_FIRST_LOAD = true;
function render(keep){
  const { raw, page, id, q } = parse();
  const v = document.getElementById('view');
  if (!v) return;

  const hasRouteHash = /^#\/[a-z]+/.test(raw);

  // Check for specialized embed containers in server content
  const cosMount = document.getElementById('maxmobila-cos-embed');
  if (cosMount && (!hasRouteHash || page === 'cos')) {
    cosMount.innerHTML = V.cos();
    renderTop();
    return;
  }

  const checkoutMount = document.getElementById('maxmobila-checkout-embed');
  if (checkoutMount && (!hasRouteHash || page === 'checkout')) {
    checkoutMount.innerHTML = V.checkout();
    renderTop();
    return;
  }

  // Handle first load with server-rendered content
  if (IS_FIRST_LOAD) {
    IS_FIRST_LOAD = false;
    const hasChildren = v.children.length > 0 && v.textContent.trim().length > 0;
    if (hasChildren) {
      INITIAL_SERVER_CONTENT = v.innerHTML;
      if (!hasRouteHash || raw === '#/' || raw === '#/acasa') {
        renderTop();
        return;
      }
    }
  }

  // If navigating back to root or home, restore editable server content if available
  if ((!hasRouteHash || raw === '#/' || (page === 'acasa' && !q.get('f'))) && INITIAL_SERVER_CONTENT) {
    v.innerHTML = INITIAL_SERVER_CONTENT;
    renderTop();
    if (keep) window.scrollTo(0, window.scrollY); else window.scrollTo(0, 0);
    LAST = 'acasa/';
    return;
  }

  const key = page + '/' + (id || ''), y = window.scrollY;
  if (key !== LAST){ PQ = 1; if (page !== 'checkout') ERR = []; }
  
  v.innerHTML = (page === 'produs' || page === 'comanda') ? V[page](id) : (V[page] || V.acasa)(q);
  renderTop();
  if (keep || key === LAST) window.scrollTo(0, y);
  else if (page === 'acasa' && q.get('f')) document.getElementById('faq').scrollIntoView();
  else window.scrollTo(0, 0);
  LAST = key;
}

  // Export global helpers for HTML inline onclick handlers
  window.qset = qset;
  window.go = go;
  window.add = add;
  window.del = del;
  window.setQ = setQ;
  window.toggleSvc = toggleSvc;
  window.setShip = setShip;
  window.setPay = setPay;
  window.setType = setType;
  window.placeOrder = placeOrder;
  window.toast = toast;
  window.changePQ = function(delta, maxStock) {
    PQ = Math.max(1, Math.min(maxStock || 99, PQ + delta));
    const el = document.getElementById('pq');
    if (el) el.textContent = PQ;
  };
  window.addCurrentPQ = function(id, goCheckout) {
    add(id, PQ);
    if (goCheckout) go('#/checkout');
  };
  window.setProdView = function(viewMode, label, btnEl) {
    const stage = document.getElementById('gal-stage');
    if (stage) stage.setAttribute('data-view', viewMode);
    const tag = document.getElementById('gal-view-tag');
    if (tag) tag.textContent = label + ' · Verificat în Satu Mare';
    if (btnEl && btnEl.parentElement) {
      btnEl.parentElement.querySelectorAll('.gal-thumb').forEach(b => b.classList.remove('on'));
      btnEl.classList.add('on');
    }
  };
  window.toggleFav = function(id, btnEl) {
    if (FAV_IDS[id]) {
      delete FAV_IDS[id];
      if (btnEl) { btnEl.classList.remove('on'); btnEl.innerHTML = '♡'; }
      toast('Produs eliminat de la favorite');
    } else {
      FAV_IDS[id] = true;
      if (btnEl) { btnEl.classList.add('on'); btnEl.innerHTML = '♥'; }
      toast('Produs salvat la favorite ♥');
    }
    try { localStorage.setItem('mx_favs', JSON.stringify(FAV_IDS)); } catch(e) {}
  };
  window.ratePage = function(score, label, btnEl) {
    if (btnEl && btnEl.parentElement) {
      btnEl.parentElement.querySelectorAll('.p-fb-item').forEach(b => b.classList.remove('on'));
      btnEl.classList.add('on');
    }
    const msg = document.getElementById('p-fb-msg');
    if (msg) msg.textContent = '✓ Mulțumim pentru evaluare (' + label + ')! Opinia ta ne ajută să îmbunătățim prezentarea produselor.';
    toast('Mulțumim pentru feedback!');
  };
  window.maxmobilaSubmitContact = function(form) {
  if (window.MAXMOBILA_AJAX_URL) {
    const fd = new FormData();
    fd.append('action', 'maxmobila_contact_submit');
    fd.append('nonce', window.MAXMOBILA_NONCE || '');
    fd.append('nume', form.querySelector('#c-n')?.value || '');
    fd.append('tel', form.querySelector('#c-t')?.value || '');
    fd.append('subiect', form.querySelector('#c-s')?.value || '');
    fd.append('mesaj', form.querySelector('#c-m')?.value || '');
    fetch(window.MAXMOBILA_AJAX_URL, { method: 'POST', body: fd }).catch(e => console.log('Notice:', e));
  }
  form.reset();
  toast('Mesaj trimis cu succes! Revenim ?n maximum 24h.');
};

  function initApp() {
    if (!document.getElementById('view')) return;
    renderStatic();
    render();
  }

  window.addEventListener('hashchange', () => render());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
