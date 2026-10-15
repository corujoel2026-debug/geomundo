import { Country } from '../types';
import { COUNTRY_SUBREGION_MAP } from './subregions';

const rawCountries: Omit<Country, 'subregion'>[] = [
  {
    "id": "ao",
    "name": "Angola",
    "capital": "Luanda",
    "continent": "África",
    "iso2": "ao",
    "iso3": "AGO",
    "isoNumeric": "024",
    "coords": [
      -8.83,
      13.23
    ],
    "population": 35588000,
    "areaKm2": 1246700,
    "curiosity": "Posee las cataratas de Kalandula, una de las mayores caídas de agua de África austral."
  },
  {
    "id": "dz",
    "name": "Argelia",
    "capital": "Argel",
    "continent": "África",
    "iso2": "dz",
    "iso3": "DZA",
    "isoNumeric": "012",
    "coords": [
      36.75,
      3.05
    ],
    "population": 44900000,
    "areaKm2": 2381741,
    "curiosity": "Es el país más extenso de África; más del 80% de su territorio lo forma el desierto del Sahara."
  },
  {
    "id": "bj",
    "name": "Benín",
    "capital": "Porto Novo",
    "continent": "África",
    "iso2": "bj",
    "iso3": "BEN",
    "isoNumeric": "204",
    "coords": [
      6.49,
      2.62
    ],
    "population": 13350000,
    "areaKm2": 114763,
    "curiosity": "Cuna del antiguo Reino de Dahomey y del vudú tradicional, reconocido como patrimonio cultural."
  },
  {
    "id": "bw",
    "name": "Botsuana",
    "capital": "Gaborone",
    "continent": "África",
    "iso2": "bw",
    "iso3": "BWA",
    "isoNumeric": "072",
    "coords": [
      -24.65,
      25.9
    ],
    "population": 2630000,
    "areaKm2": 581730,
    "curiosity": "Hogar del delta del Okavango, un oasis interior único en el mundo en medio del desierto del Kalahari."
  },
  {
    "id": "bf",
    "name": "Burkina Faso",
    "capital": "Uagadugú",
    "continent": "África",
    "iso2": "bf",
    "iso3": "BFA",
    "isoNumeric": "854",
    "coords": [
      12.37,
      -1.53
    ],
    "population": 22670000,
    "areaKm2": 274200,
    "curiosity": "Su nombre significa «patria de personas íntegras» en lenguas autóctonas mossi y diula."
  },
  {
    "id": "bi",
    "name": "Burundi",
    "capital": "Gitega",
    "continent": "África",
    "iso2": "bi",
    "iso3": "BDI",
    "isoNumeric": "108",
    "coords": [
      -3.42,
      29.92
    ],
    "population": 12890000,
    "areaKm2": 27834,
    "curiosity": "País de los grandes lagos africanos, bañado por el legendario lago Tanganica."
  },
  {
    "id": "cv",
    "name": "Cabo Verde",
    "capital": "Praia",
    "continent": "África",
    "iso2": "cv",
    "iso3": "CPV",
    "isoNumeric": "132",
    "coords": [
      14.93,
      -23.51
    ],
    "population": 593000,
    "areaKm2": 4033,
    "curiosity": "Archipiélago volcánico atlántico célebre mundialmente por su música morna y Cesária Évora."
  },
  {
    "id": "cm",
    "name": "Camerún",
    "capital": "Yaundé",
    "continent": "África",
    "iso2": "cm",
    "iso3": "CMR",
    "isoNumeric": "120",
    "coords": [
      3.84,
      11.5
    ],
    "population": 27910000,
    "areaKm2": 475442,
    "curiosity": "Apodado «África en miniatura» debido a su extraordinaria variedad climática y paisajística."
  },
  {
    "id": "td",
    "name": "Chad",
    "capital": "Yamena",
    "continent": "África",
    "iso2": "td",
    "iso3": "TCD",
    "isoNumeric": "148",
    "coords": [
      12.13,
      15.05
    ],
    "population": 17720000,
    "areaKm2": 1284000,
    "curiosity": "Alberga el macizo de Tibesti en el Sahara, con el volcán Emi Koussi, el más alto del desierto."
  },
  {
    "id": "km",
    "name": "Comoras",
    "capital": "Moroni",
    "continent": "África",
    "iso2": "km",
    "iso3": "COM",
    "isoNumeric": "174",
    "coords": [
      -11.71,
      43.25
    ],
    "population": 836000,
    "areaKm2": 2235,
    "curiosity": "Conocidas como las «islas del perfume» por sus plantaciones aromáticas de vainilla y ylang-ylang."
  },
  {
    "id": "cg",
    "name": "República del Congo",
    "capital": "Brazzaville",
    "continent": "África",
    "iso2": "cg",
    "iso3": "COG",
    "isoNumeric": "178",
    "coords": [
      -4.26,
      15.28
    ],
    "population": 5970000,
    "areaKm2": 342000,
    "curiosity": "Su capital Brazzaville está frente a Kinsasa, separadas únicamente por el caudaloso río Congo."
  },
  {
    "id": "cd",
    "name": "República Democrática del Congo",
    "capital": "Kinsasa",
    "continent": "África",
    "iso2": "cd",
    "iso3": "COD",
    "isoNumeric": "180",
    "coords": [
      -4.32,
      15.32
    ],
    "population": 99000000,
    "areaKm2": 2344858,
    "curiosity": "Posee la segunda mayor selva tropical del planeta y las reservas más ricas de coltán."
  },
  {
    "id": "ci",
    "name": "Costa de Marfil",
    "capital": "Yamusukro",
    "continent": "África",
    "iso2": "ci",
    "iso3": "CIV",
    "isoNumeric": "384",
    "coords": [
      6.82,
      -5.27
    ],
    "population": 29380000,
    "areaKm2": 322463,
    "curiosity": "El primer productor mundial de cacao; su capital ostenta la basílica más grande del mundo."
  },
  {
    "id": "eg",
    "name": "Egipto",
    "capital": "El Cairo",
    "continent": "África",
    "iso2": "eg",
    "iso3": "EGY",
    "isoNumeric": "818",
    "coords": [
      30.04,
      31.23
    ],
    "population": 109300000,
    "areaKm2": 1002450,
    "curiosity": "Cuna de la civilización faraónica milenaria, las pirámides de Guiza y el histórico río Nilo."
  },
  {
    "id": "er",
    "name": "Eritrea",
    "capital": "Asmara",
    "continent": "África",
    "iso2": "er",
    "iso3": "ERI",
    "isoNumeric": "232",
    "coords": [
      15.33,
      38.93
    ],
    "population": 3680000,
    "areaKm2": 117600,
    "curiosity": "Asmara es apodada «la pequeña Roma» por sus joyas arquitectónicas modernistas y cafés italianos."
  },
  {
    "id": "sz",
    "name": "Esuatini",
    "capital": "Mbabane",
    "continent": "África",
    "iso2": "sz",
    "iso3": "SWZ",
    "isoNumeric": "748",
    "coords": [
      -26.31,
      31.13
    ],
    "population": 1200000,
    "areaKm2": 17364,
    "curiosity": "Monarquía tradicional africana que cambió su nombre oficial de Suazilandia a Esuatini en 2018."
  },
  {
    "id": "et",
    "name": "Etiopía",
    "capital": "Adís Abeba",
    "continent": "África",
    "iso2": "et",
    "iso3": "ETH",
    "isoNumeric": "231",
    "coords": [
      9.03,
      38.74
    ],
    "population": 123400000,
    "areaKm2": 1104300,
    "curiosity": "Mantiene su propio calendario de 13 meses y es la cuna botánica original de la planta del café."
  },
  {
    "id": "ga",
    "name": "Gabón",
    "capital": "Libreville",
    "continent": "África",
    "iso2": "ga",
    "iso3": "GAB",
    "isoNumeric": "266",
    "coords": [
      0.39,
      9.45
    ],
    "population": 2380000,
    "areaKm2": 267668,
    "curiosity": "El 88% de su territorio está cubierto de densa selva virgen con parques nacionales marinos y terrestres."
  },
  {
    "id": "gm",
    "name": "Gambia",
    "capital": "Banjul",
    "continent": "África",
    "iso2": "gm",
    "iso3": "GMB",
    "isoNumeric": "270",
    "coords": [
      13.45,
      -16.57
    ],
    "population": 2700000,
    "areaKm2": 11295,
    "curiosity": "Es el país más pequeño de África continental, rodeando en su totalidad al río Gambia."
  },
  {
    "id": "gh",
    "name": "Ghana",
    "capital": "Acra",
    "continent": "África",
    "iso2": "gh",
    "iso3": "GHA",
    "isoNumeric": "288",
    "coords": [
      5.55,
      -0.2
    ],
    "population": 33480000,
    "areaKm2": 238533,
    "curiosity": "Conocida como la Costa del Oro, fue pionera en la independencia del África subsahariana en 1957."
  },
  {
    "id": "gn",
    "name": "Guinea",
    "capital": "Conakri",
    "continent": "África",
    "iso2": "gn",
    "iso3": "GIN",
    "isoNumeric": "324",
    "coords": [
      9.5,
      -13.7
    ],
    "population": 13860000,
    "areaKm2": 245857,
    "curiosity": "Llamada el «castillo de agua de África Occidental» porque allí nacen los ríos Níger, Senegal y Gambia."
  },
  {
    "id": "gw",
    "name": "Guinea-Bisáu",
    "capital": "Bisáu",
    "continent": "África",
    "iso2": "gw",
    "iso3": "GNB",
    "isoNumeric": "624",
    "coords": [
      11.86,
      -15.58
    ],
    "population": 2060000,
    "areaKm2": 36125,
    "curiosity": "El archipiélago de las Bijagós cuenta con 88 islas donde habitan singulares hipopótamos de agua salada."
  },
  {
    "id": "gq",
    "name": "Guinea Ecuatorial",
    "capital": "Malabo",
    "continent": "África",
    "iso2": "gq",
    "iso3": "GNQ",
    "isoNumeric": "226",
    "coords": [
      3.75,
      8.78
    ],
    "population": 1670000,
    "areaKm2": 28051,
    "curiosity": "Es el único país independiente del continente africano que tiene el idioma español como lengua oficial."
  },
  {
    "id": "ke",
    "name": "Kenia",
    "capital": "Nairobi",
    "continent": "África",
    "iso2": "ke",
    "iso3": "KEN",
    "isoNumeric": "404",
    "coords": [
      -1.29,
      36.82
    ],
    "population": 54030000,
    "areaKm2": 580367,
    "curiosity": "Escenario de la Gran Migración de millones de herbívoros en el Parque Nacional Masái Mara."
  },
  {
    "id": "ls",
    "name": "Lesoto",
    "capital": "Maseru",
    "continent": "África",
    "iso2": "ls",
    "iso3": "LSO",
    "isoNumeric": "426",
    "coords": [
      -29.31,
      27.48
    ],
    "population": 2300000,
    "areaKm2": 30355,
    "curiosity": "Apodado el «Reino del Cielo», ningún rincón de su territorio desciende por debajo de los 1.000 m."
  },
  {
    "id": "lr",
    "name": "Liberia",
    "capital": "Monrovia",
    "continent": "África",
    "iso2": "lr",
    "iso3": "LBR",
    "isoNumeric": "430",
    "coords": [
      6.31,
      -10.8
    ],
    "population": 5300000,
    "areaKm2": 111369,
    "curiosity": "Primera república democrática africana en proclamar su independencia, fundada en 1847."
  },
  {
    "id": "ly",
    "name": "Libia",
    "capital": "Trípoli",
    "continent": "África",
    "iso2": "ly",
    "iso3": "LBY",
    "isoNumeric": "434",
    "coords": [
      32.88,
      13.19
    ],
    "population": 6810000,
    "areaKm2": 1759540,
    "curiosity": "Alberga monumentos arqueológicos colosales romanos como las ruinas de Leptis Magna y Sabratha."
  },
  {
    "id": "mg",
    "name": "Madagascar",
    "capital": "Antananarivo",
    "continent": "África",
    "iso2": "mg",
    "iso3": "MDG",
    "isoNumeric": "450",
    "coords": [
      -18.91,
      47.53
    ],
    "population": 29610000,
    "areaKm2": 587041,
    "curiosity": "Isla santuario de biodiversidad con los famosos baobabs gigantes y más de 100 especies de lémures."
  },
  {
    "id": "mw",
    "name": "Malaui",
    "capital": "Lilongüe",
    "continent": "África",
    "iso2": "mw",
    "iso3": "MWI",
    "isoNumeric": "454",
    "coords": [
      -13.98,
      33.78
    ],
    "population": 20400000,
    "areaKm2": 118484,
    "curiosity": "El lago Malaui contiene más especies de peces cíclidos que cualquier otro cuerpo lacustre del mundo."
  },
  {
    "id": "ml",
    "name": "Malí",
    "capital": "Bamako",
    "continent": "África",
    "iso2": "ml",
    "iso3": "MLI",
    "isoNumeric": "466",
    "coords": [
      12.65,
      -8
    ],
    "population": 22590000,
    "areaKm2": 1240192,
    "curiosity": "En la mítica ciudad de Tombuctú se conservan cientos de miles de manuscritos medievales islámicos."
  },
  {
    "id": "ma",
    "name": "Marruecos",
    "capital": "Rabat",
    "continent": "África",
    "iso2": "ma",
    "iso3": "MAR",
    "isoNumeric": "504",
    "coords": [
      34.02,
      -6.84
    ],
    "population": 37460000,
    "areaKm2": 446550,
    "curiosity": "Puerta de entrada al Magreb con la cordillera del Atlas, dunas de Merzouga y zocos centenarios."
  },
  {
    "id": "mu",
    "name": "Mauricio",
    "capital": "Port Louis",
    "continent": "África",
    "iso2": "mu",
    "iso3": "MUS",
    "isoNumeric": "480",
    "coords": [
      -20.16,
      57.5
    ],
    "population": 1260000,
    "areaKm2": 2040,
    "curiosity": "Paraíso en el océano Índico famoso por el fenómeno visual de la catarata submarina en Le Morne."
  },
  {
    "id": "mr",
    "name": "Mauritania",
    "capital": "Nuakchot",
    "continent": "África",
    "iso2": "mr",
    "iso3": "MRT",
    "isoNumeric": "478",
    "coords": [
      18.08,
      -15.97
    ],
    "population": 4730000,
    "areaKm2": 1030700,
    "curiosity": "Por su desierto circula uno de los trenes de carga más largos del planeta con mineral de hierro."
  },
  {
    "id": "mz",
    "name": "Mozambique",
    "capital": "Maputo",
    "continent": "África",
    "iso2": "mz",
    "iso3": "MOZ",
    "isoNumeric": "508",
    "coords": [
      -25.96,
      32.58
    ],
    "population": 32980000,
    "areaKm2": 801590,
    "curiosity": "Posee una costa de aguas turquesas de más de 2.500 km y el archipiélago coralino de Bazaruto."
  },
  {
    "id": "na",
    "name": "Namibia",
    "capital": "Windhoek",
    "continent": "África",
    "iso2": "na",
    "iso3": "NAM",
    "isoNumeric": "516",
    "coords": [
      -22.56,
      17.08
    ],
    "population": 2567000,
    "areaKm2": 824292,
    "curiosity": "Sus dunas rojizas de Sossusvlei y los árboles petrificados de Deadvlei tienen miles de años."
  },
  {
    "id": "ne",
    "name": "Níger",
    "capital": "Niamey",
    "continent": "África",
    "iso2": "ne",
    "iso3": "NER",
    "isoNumeric": "562",
    "coords": [
      13.51,
      2.11
    ],
    "population": 26200000,
    "areaKm2": 1267000,
    "curiosity": "Destacado enclave sahariano en el que floreció la histórica mezquita de barro de Agadez."
  },
  {
    "id": "ng",
    "name": "Nigeria",
    "capital": "Abuya",
    "continent": "África",
    "iso2": "ng",
    "iso3": "NGA",
    "isoNumeric": "566",
    "coords": [
      9.07,
      7.49
    ],
    "population": 218500000,
    "areaKm2": 923768,
    "curiosity": "Gigante demográfico de África con más de 250 grupos étnicos y una vibrante escena musical Afrobeats."
  },
  {
    "id": "cf",
    "name": "República Centroafricana",
    "capital": "Bangui",
    "continent": "África",
    "iso2": "cf",
    "iso3": "CAF",
    "isoNumeric": "140",
    "coords": [
      4.36,
      18.55
    ],
    "population": 5570000,
    "areaKm2": 622984,
    "curiosity": "Zona de transición ecológica clave donde convergen las sabanas del norte y las selvas del Congo."
  },
  {
    "id": "rw",
    "name": "Ruanda",
    "capital": "Kigali",
    "continent": "África",
    "iso2": "rw",
    "iso3": "RWA",
    "isoNumeric": "646",
    "coords": [
      -1.94,
      29.87
    ],
    "population": 13780000,
    "areaKm2": 26338,
    "curiosity": "Conocida como la «tierra de las mil colinas» y hogar de los gorilas de montaña en los volcanes Virunga."
  },
  {
    "id": "st",
    "name": "Santo Tomé y Príncipe",
    "capital": "Santo Tomé",
    "continent": "África",
    "iso2": "st",
    "iso3": "STP",
    "isoNumeric": "678",
    "coords": [
      0.33,
      6.73
    ],
    "population": 227000,
    "areaKm2": 964,
    "curiosity": "Situado en el golfo de Guinea sobre la línea del ecuador, rodeado de frondosa naturaleza volcánica."
  },
  {
    "id": "sn",
    "name": "Senegal",
    "capital": "Dakar",
    "continent": "África",
    "iso2": "sn",
    "iso3": "SEN",
    "isoNumeric": "686",
    "coords": [
      14.69,
      -17.44
    ],
    "population": 17320000,
    "areaKm2": 196722,
    "curiosity": "Célebre por el lago Retba (Lago Rosa), con alta salinidad que le otorga su coloración tan singular."
  },
  {
    "id": "sc",
    "name": "Seychelles",
    "capital": "Victoria",
    "continent": "África",
    "iso2": "sc",
    "iso3": "SYC",
    "isoNumeric": "690",
    "coords": [
      -4.62,
      55.45
    ],
    "population": 100000,
    "areaKm2": 459,
    "curiosity": "Archipiélago paradisíaco con rocas de granito rosado pulidas por las olas del océano Índico."
  },
  {
    "id": "sl",
    "name": "Sierra Leona",
    "capital": "Freetown",
    "continent": "África",
    "iso2": "sl",
    "iso3": "SLE",
    "isoNumeric": "694",
    "coords": [
      8.48,
      -13.23
    ],
    "population": 8600000,
    "areaKm2": 71740,
    "curiosity": "Su capital Freetown tiene uno de los puertos naturales de aguas profundas más extensos del globo."
  },
  {
    "id": "so",
    "name": "Somalia",
    "capital": "Mogadiscio",
    "continent": "África",
    "iso2": "so",
    "iso3": "SOM",
    "isoNumeric": "706",
    "coords": [
      2.04,
      45.34
    ],
    "population": 17590000,
    "areaKm2": 637657,
    "curiosity": "Ocupa el Cuerno de África con la mayor extensión de costas de todo el continente continental."
  },
  {
    "id": "za",
    "name": "Sudáfrica",
    "capital": "Pretoria",
    "continent": "África",
    "iso2": "za",
    "iso3": "ZAF",
    "isoNumeric": "710",
    "coords": [
      -25.74,
      28.18
    ],
    "population": 59890000,
    "areaKm2": 1221037,
    "curiosity": "Llamada la «Nación del Arcoíris», cuenta con 11 lenguas oficiales y una rica herencia histórica."
  },
  {
    "id": "sd",
    "name": "Sudán",
    "capital": "Jartum",
    "continent": "África",
    "iso2": "sd",
    "iso3": "SDN",
    "isoNumeric": "729",
    "coords": [
      15.55,
      32.53
    ],
    "population": 46870000,
    "areaKm2": 1861484,
    "curiosity": "En Jartum se produce la confluencia entre el Nilo Blanco y el Nilo Azul para formar el gran río Nilo."
  },
  {
    "id": "ss",
    "name": "Sudán del Sur",
    "capital": "Yuba",
    "continent": "África",
    "iso2": "ss",
    "iso3": "SSD",
    "isoNumeric": "728",
    "coords": [
      4.85,
      31.6
    ],
    "population": 10910000,
    "areaKm2": 619745,
    "curiosity": "Alberga los humedales del Sudd, uno de los pantanos tropicales más extensos del planeta."
  },
  {
    "id": "tz",
    "name": "Tanzania",
    "capital": "Dodoma",
    "continent": "África",
    "iso2": "tz",
    "iso3": "TZA",
    "isoNumeric": "834",
    "coords": [
      -6.17,
      35.74
    ],
    "population": 65500000,
    "areaKm2": 947303,
    "curiosity": "El monte Kilimanjaro se alza a 5.895 m con cumbres nevadas justo al sur del ecuador terrestre."
  },
  {
    "id": "tg",
    "name": "Togo",
    "capital": "Lomé",
    "continent": "África",
    "iso2": "tg",
    "iso3": "TGO",
    "isoNumeric": "768",
    "coords": [
      6.13,
      1.22
    ],
    "population": 8850000,
    "areaKm2": 56785,
    "curiosity": "Su capital costera Lomé destaca por sus playas de cocoteros y mercados de artesanía y especias."
  },
  {
    "id": "tn",
    "name": "Túnez",
    "capital": "Túnez",
    "continent": "África",
    "iso2": "tn",
    "iso3": "TUN",
    "isoNumeric": "788",
    "coords": [
      36.8,
      10.18
    ],
    "population": 12350000,
    "areaKm2": 163610,
    "curiosity": "Cuna de la antigua Cartago de Aníbal y punto de partida de la histórica Primavera Árabe."
  },
  {
    "id": "ug",
    "name": "Uganda",
    "capital": "Kampala",
    "continent": "África",
    "iso2": "ug",
    "iso3": "UGA",
    "isoNumeric": "800",
    "coords": [
      0.31,
      32.58
    ],
    "population": 47250000,
    "areaKm2": 241550,
    "curiosity": "Allí nacen las fuentes del Nilo en el lago Victoria; rodeada de las montañas Rwenzori nevadas."
  },
  {
    "id": "dj",
    "name": "Yibuti",
    "capital": "Yibuti",
    "continent": "África",
    "iso2": "dj",
    "iso3": "DJI",
    "isoNumeric": "262",
    "coords": [
      11.58,
      43.14
    ],
    "population": 1120000,
    "areaKm2": 23200,
    "curiosity": "Enclave geoestratégico en el estrecho de Bab el-Mandeb, puerta del mar Rojo al Índico."
  },
  {
    "id": "zm",
    "name": "Zambia",
    "capital": "Lusaka",
    "continent": "África",
    "iso2": "zm",
    "iso3": "ZMB",
    "isoNumeric": "894",
    "coords": [
      -15.41,
      28.28
    ],
    "population": 20020000,
    "areaKm2": 752618,
    "curiosity": "Comparte con Zimbabue las espectaculares cataratas Victoria en el gran río Zambeze."
  },
  {
    "id": "zw",
    "name": "Zimbabue",
    "capital": "Harare",
    "continent": "África",
    "iso2": "zw",
    "iso3": "ZWE",
    "isoNumeric": "716",
    "coords": [
      -17.82,
      31.05
    ],
    "population": 16320000,
    "areaKm2": 390757,
    "curiosity": "Toma su nombre del Gran Zimbabue, colosales murallas de piedra construidas sin argamasa en el siglo XI."
  },
  {
    "id": "ag",
    "name": "Antigua y Barbuda",
    "capital": "Saint John",
    "continent": "América",
    "iso2": "ag",
    "iso3": "ATG",
    "isoNumeric": "028",
    "coords": [
      17.12,
      -61.85
    ],
    "population": 94000,
    "areaKm2": 442,
    "curiosity": "Cuenta la tradición local que tiene 365 playas de arena blanca, una para cada día del año."
  },
  {
    "id": "ar",
    "name": "Argentina",
    "capital": "Buenos Aires",
    "continent": "América",
    "iso2": "ar",
    "iso3": "ARG",
    "isoNumeric": "032",
    "coords": [
      -34.6,
      -58.38
    ],
    "population": 46040000,
    "areaKm2": 2780400,
    "curiosity": "Ostenta el Aconcagua (6.961 m), la cumbre más alta de América, y el glaciar Perito Moreno."
  },
  {
    "id": "bs",
    "name": "Bahamas",
    "capital": "Nasáu",
    "continent": "América",
    "iso2": "bs",
    "iso3": "BHS",
    "isoNumeric": "044",
    "coords": [
      25.04,
      -77.35
    ],
    "population": 410000,
    "areaKm2": 13943,
    "curiosity": "Archipiélago de más de 700 islas en aguas cristalinas turquesas famosas por sus arrecifes de coral."
  },
  {
    "id": "bb",
    "name": "Barbados",
    "capital": "Bridgetown",
    "continent": "América",
    "iso2": "bb",
    "iso3": "BRB",
    "isoNumeric": "052",
    "coords": [
      13.1,
      -59.62
    ],
    "population": 281000,
    "areaKm2": 430,
    "curiosity": "Es la isla más oriental de las Antillas Menores y cuna internacional de la cantante Rihanna."
  },
  {
    "id": "bz",
    "name": "Belice",
    "capital": "Belmopán",
    "continent": "América",
    "iso2": "bz",
    "iso3": "BLZ",
    "isoNumeric": "084",
    "coords": [
      17.25,
      -88.77
    ],
    "population": 405000,
    "areaKm2": 22966,
    "curiosity": "Alberga la segunda barrera de arrecifes de coral más grande del mundo y el célebre Gran Agujero Azul."
  },
  {
    "id": "bo",
    "name": "Bolivia",
    "capital": "Sucre",
    "continent": "América",
    "iso2": "bo",
    "iso3": "BOL",
    "isoNumeric": "068",
    "coords": [
      -19.04,
      -65.26
    ],
    "population": 12220000,
    "areaKm2": 1098581,
    "curiosity": "Posee el Salar de Uyuni, el desierto de sal continuo más grande y brillante de la Tierra."
  },
  {
    "id": "br",
    "name": "Brasil",
    "capital": "Brasilia",
    "continent": "América",
    "iso2": "br",
    "iso3": "BRA",
    "isoNumeric": "076",
    "coords": [
      -15.79,
      -47.88
    ],
    "population": 215300000,
    "areaKm2": 8515767,
    "curiosity": "El país más grande de América Latina; alberga más del 60% de la cuenca amazónica y el Cristo Redentor."
  },
  {
    "id": "ca",
    "name": "Canadá",
    "capital": "Ottawa",
    "continent": "América",
    "iso2": "ca",
    "iso3": "CAN",
    "isoNumeric": "124",
    "coords": [
      45.42,
      -75.7
    ],
    "population": 39500000,
    "areaKm2": 9984670,
    "curiosity": "El segundo país más extenso del mundo y el que posee la mayor cantidad de lagos de agua dulce."
  },
  {
    "id": "cl",
    "name": "Chile",
    "capital": "Santiago",
    "continent": "América",
    "iso2": "cl",
    "iso3": "CHL",
    "isoNumeric": "152",
    "coords": [
      -33.45,
      -70.67
    ],
    "population": 19600000,
    "areaKm2": 756102,
    "curiosity": "El país más largo y angosto del mundo, hogar del desierto de Atacama y la mística Isla de Pascua."
  },
  {
    "id": "co",
    "name": "Colombia",
    "capital": "Bogotá",
    "continent": "América",
    "iso2": "co",
    "iso3": "COL",
    "isoNumeric": "170",
    "coords": [
      4.71,
      -74.07
    ],
    "population": 52000000,
    "areaKm2": 1141748,
    "curiosity": "El único país de Sudamérica con costas sobre el océano Pacífico y el mar Caribe; mayor variedad de aves."
  },
  {
    "id": "cr",
    "name": "Costa Rica",
    "capital": "San José",
    "continent": "América",
    "iso2": "cr",
    "iso3": "CRI",
    "isoNumeric": "188",
    "coords": [
      9.93,
      -84.08
    ],
    "population": 5200000,
    "areaKm2": 51100,
    "curiosity": "Pionero ecológico: más del 25% de su superficie son reservas naturales y abolió su ejército en 1948."
  },
  {
    "id": "cu",
    "name": "Cuba",
    "capital": "La Habana",
    "continent": "América",
    "iso2": "cu",
    "iso3": "CUB",
    "isoNumeric": "192",
    "coords": [
      23.11,
      -82.37
    ],
    "population": 11210000,
    "areaKm2": 109884,
    "curiosity": "La mayor isla de las Antillas, reconocida por su arquitectura colonial, son cubano y coches clásicos."
  },
  {
    "id": "dm",
    "name": "Dominica",
    "capital": "Roseau",
    "continent": "América",
    "iso2": "dm",
    "iso3": "DMA",
    "isoNumeric": "212",
    "coords": [
      15.3,
      -61.39
    ],
    "population": 72000,
    "areaKm2": 751,
    "curiosity": "Conocida como «la isla de la naturaleza» por sus fuentes termales, selvas intactas y el Boiling Lake."
  },
  {
    "id": "ec",
    "name": "Ecuador",
    "capital": "Quito",
    "continent": "América",
    "iso2": "ec",
    "iso3": "ECU",
    "isoNumeric": "218",
    "coords": [
      -0.18,
      -78.47
    ],
    "population": 18000000,
    "areaKm2": 276841,
    "curiosity": "Las islas Galápagos inspiraron la teoría de la evolución de Darwin; el volcán Chimborazo es el punto más cercano al sol."
  },
  {
    "id": "sv",
    "name": "El Salvador",
    "capital": "San Salvador",
    "continent": "América",
    "iso2": "sv",
    "iso3": "SLV",
    "isoNumeric": "222",
    "coords": [
      13.69,
      -89.22
    ],
    "population": 6330000,
    "areaKm2": 21041,
    "curiosity": "Conocido como «la tierra de los volcanes» por tener más de 20 conos volcánicos en su territorio."
  },
  {
    "id": "us",
    "name": "Estados Unidos",
    "capital": "Washington D.C.",
    "continent": "América",
    "iso2": "us",
    "iso3": "USA",
    "isoNumeric": "840",
    "coords": [
      38.91,
      -77.04
    ],
    "population": 333000000,
    "areaKm2": 9833517,
    "curiosity": "Tercer país más poblado del mundo con hitos naturales como el Gran Cañón y el parque Yellowstone."
  },
  {
    "id": "gd",
    "name": "Granada",
    "capital": "Saint George",
    "continent": "América",
    "iso2": "gd",
    "iso3": "GRD",
    "isoNumeric": "308",
    "coords": [
      12.05,
      -61.75
    ],
    "population": 125000,
    "areaKm2": 344,
    "curiosity": "Conocida como la «isla de las especias» por ser un gran productor mundial de nuez moscada."
  },
  {
    "id": "gt",
    "name": "Guatemala",
    "capital": "Ciudad de Guatemala",
    "continent": "América",
    "iso2": "gt",
    "iso3": "GTM",
    "isoNumeric": "320",
    "coords": [
      14.63,
      -90.51
    ],
    "population": 17980000,
    "areaKm2": 108889,
    "curiosity": "Corazón del Imperio Maya con las espectaculares pirámides selváticas de Tikal y el lago de Atitlán."
  },
  {
    "id": "gy",
    "name": "Guyana",
    "capital": "Georgetown",
    "continent": "América",
    "iso2": "gy",
    "iso3": "GUY",
    "isoNumeric": "328",
    "coords": [
      6.8,
      -58.16
    ],
    "population": 808000,
    "areaKm2": 214969,
    "curiosity": "Único país de Sudamérica donde el inglés es idioma oficial; alberga las cataratas Kaieteur."
  },
  {
    "id": "ht",
    "name": "Haití",
    "capital": "Puerto Príncipe",
    "continent": "América",
    "iso2": "ht",
    "iso3": "HTI",
    "isoNumeric": "332",
    "coords": [
      18.59,
      -72.31
    ],
    "population": 11580000,
    "areaKm2": 27750,
    "curiosity": "Primera república negra del mundo e históricamente la primera en abolir la esclavitud tras su revolución en 1804."
  },
  {
    "id": "hn",
    "name": "Honduras",
    "capital": "Tegucigalpa",
    "continent": "América",
    "iso2": "hn",
    "iso3": "HND",
    "isoNumeric": "340",
    "coords": [
      14.07,
      -87.19
    ],
    "population": 10430000,
    "areaKm2": 112492,
    "curiosity": "Hogar de las ruinas mayas de Copán, famosas por su escalinata jeroglífica de piedra única en Mesoamérica."
  },
  {
    "id": "jm",
    "name": "Jamaica",
    "capital": "Kingston",
    "continent": "América",
    "iso2": "jm",
    "iso3": "JAM",
    "isoNumeric": "388",
    "coords": [
      17.97,
      -76.79
    ],
    "population": 2830000,
    "areaKm2": 10991,
    "curiosity": "Cuna del género reggae, Bob Marley y de los atletas velocistas más veloces de la historia olímpica."
  },
  {
    "id": "mx",
    "name": "México",
    "capital": "Ciudad de México",
    "continent": "América",
    "iso2": "mx",
    "iso3": "MEX",
    "isoNumeric": "484",
    "coords": [
      19.43,
      -99.13
    ],
    "population": 128500000,
    "areaKm2": 1964375,
    "curiosity": "Cuna de aztecas y mayas; su gastronomía tradicional es Patrimonio Cultural Inmaterial de la Humanidad."
  },
  {
    "id": "ni",
    "name": "Nicaragua",
    "capital": "Managua",
    "continent": "América",
    "iso2": "ni",
    "iso3": "NIC",
    "isoNumeric": "558",
    "coords": [
      12.11,
      -86.24
    ],
    "population": 6950000,
    "areaKm2": 130373,
    "curiosity": "Tierra de lagos y volcanes; el lago Cocibolca alberga los únicos tiburones toro adaptados a agua dulce."
  },
  {
    "id": "pa",
    "name": "Panamá",
    "capital": "Ciudad de Panamá",
    "continent": "América",
    "iso2": "pa",
    "iso3": "PAN",
    "isoNumeric": "591",
    "coords": [
      8.98,
      -79.52
    ],
    "population": 4410000,
    "areaKm2": 75417,
    "curiosity": "Su famoso canal interoceánico de 82 km une el Atlántico y el Pacífico desde 1914."
  },
  {
    "id": "py",
    "name": "Paraguay",
    "capital": "Asunción",
    "continent": "América",
    "iso2": "py",
    "iso3": "PRY",
    "isoNumeric": "600",
    "coords": [
      -25.26,
      -57.58
    ],
    "population": 6780000,
    "areaKm2": 406752,
    "curiosity": "Nación bilingüe donde la gran mayoría de la población habla con orgullo el guaraní junto al español."
  },
  {
    "id": "pe",
    "name": "Perú",
    "capital": "Lima",
    "continent": "América",
    "iso2": "pe",
    "iso3": "PER",
    "isoNumeric": "604",
    "coords": [
      -12.05,
      -77.04
    ],
    "population": 33720000,
    "areaKm2": 1285216,
    "curiosity": "Cuna del Imperio Inca con la ciudadela sagrada de Machu Picchu y las enigmáticas líneas de Nazca."
  },
  {
    "id": "do",
    "name": "República Dominicana",
    "capital": "Santo Domingo",
    "continent": "América",
    "iso2": "do",
    "iso3": "DOM",
    "isoNumeric": "214",
    "coords": [
      18.49,
      -69.93
    ],
    "population": 11230000,
    "areaKm2": 48671,
    "curiosity": "Santo Domingo posee la primera catedral, hospital y universidad erigidos por europeos en América."
  },
  {
    "id": "kn",
    "name": "San Cristóbal y Nieves",
    "capital": "Basseterre",
    "continent": "América",
    "iso2": "kn",
    "iso3": "KNA",
    "isoNumeric": "659",
    "coords": [
      17.3,
      -62.73
    ],
    "population": 48000,
    "areaKm2": 261,
    "curiosity": "El país soberano más pequeño en superficie y población de todo el continente americano."
  },
  {
    "id": "vc",
    "name": "San Vicente y las Granadinas",
    "capital": "Kingstown",
    "continent": "América",
    "iso2": "vc",
    "iso3": "VCT",
    "isoNumeric": "670",
    "coords": [
      13.16,
      -61.22
    ],
    "population": 104000,
    "areaKm2": 389,
    "curiosity": "Compuesto por 32 islas y cayos caribeños con playas volcánicas negras y doradas de gran belleza."
  },
  {
    "id": "lc",
    "name": "Santa Lucía",
    "capital": "Castries",
    "continent": "América",
    "iso2": "lc",
    "iso3": "LCA",
    "isoNumeric": "662",
    "coords": [
      14.01,
      -60.99
    ],
    "population": 180000,
    "areaKm2": 616,
    "curiosity": "Famosa por los picos gemelos Pitons que emergen abruptamente desde el mar hasta casi 800 metros."
  },
  {
    "id": "sr",
    "name": "Surinam",
    "capital": "Paramaribo",
    "continent": "América",
    "iso2": "sr",
    "iso3": "SUR",
    "isoNumeric": "740",
    "coords": [
      5.85,
      -55.2
    ],
    "population": 618000,
    "areaKm2": 163820,
    "curiosity": "El país con mayor porcentaje de cubierta forestal del mundo (más del 93% es selva amazónica virgen)."
  },
  {
    "id": "tt",
    "name": "Trinidad y Tobago",
    "capital": "Puerto España",
    "continent": "América",
    "iso2": "tt",
    "iso3": "TTO",
    "isoNumeric": "780",
    "coords": [
      10.66,
      -61.52
    ],
    "population": 1530000,
    "areaKm2": 5130,
    "curiosity": "Cuna del calipso, la soca, los tambores metálicos steelpan y el lago de asfalto natural Pitch Lake."
  },
  {
    "id": "uy",
    "name": "Uruguay",
    "capital": "Montevideo",
    "continent": "América",
    "iso2": "uy",
    "iso3": "URY",
    "isoNumeric": "858",
    "coords": [
      -34.9,
      -56.16
    ],
    "population": 3440000,
    "areaKm2": 176215,
    "curiosity": "Pionero social mundial: primer país en legalizar el divorcio por voluntad de la mujer y entregar portátiles a cada escolar."
  },
  {
    "id": "ve",
    "name": "Venezuela",
    "capital": "Caracas",
    "continent": "América",
    "iso2": "ve",
    "iso3": "VEN",
    "isoNumeric": "862",
    "coords": [
      10.49,
      -66.9
    ],
    "population": 28300000,
    "areaKm2": 916445,
    "curiosity": "Alberga el Salto Ángel (979 m), la cascada ininterrumpida más alta del planeta, en el Parque Nacional Canaima."
  },
  {
    "id": "af",
    "name": "Afganistán",
    "capital": "Kabul",
    "continent": "Asia",
    "iso2": "af",
    "iso3": "AFG",
    "isoNumeric": "004",
    "coords": [
      34.53,
      69.17
    ],
    "population": 41130000,
    "areaKm2": 652864,
    "curiosity": "Encrucijada histórica de la Ruta de la Seda custodiada por la colosal cordillera del Hindu Kush."
  },
  {
    "id": "sa",
    "name": "Arabia Saudita",
    "capital": "Riad",
    "continent": "Asia",
    "iso2": "sa",
    "iso3": "SAU",
    "isoNumeric": "682",
    "coords": [
      24.71,
      46.68
    ],
    "population": 36410000,
    "areaKm2": 2149690,
    "curiosity": "Cuna del islam con las ciudades santas de La Meca y Medina; alberga el desierto Rub al-Jali."
  },
  {
    "id": "am",
    "name": "Armenia",
    "capital": "Ereván",
    "continent": "Asia",
    "iso2": "am",
    "iso3": "ARM",
    "isoNumeric": "051",
    "coords": [
      40.18,
      44.51
    ],
    "population": 2780000,
    "areaKm2": 29743,
    "curiosity": "Fue la primera nación del mundo en adoptar el cristianismo como religión oficial de estado en el año 301."
  },
  {
    "id": "az",
    "name": "Azerbaiyán",
    "capital": "Bakú",
    "continent": "Asia",
    "iso2": "az",
    "iso3": "AZE",
    "isoNumeric": "031",
    "coords": [
      40.41,
      49.87
    ],
    "population": 10140000,
    "areaKm2": 86600,
    "curiosity": "Conocida como la «tierra del fuego» por las llamas eternas que brotan de su suelo rico en gas en Yanar Dag."
  },
  {
    "id": "bd",
    "name": "Bangladés",
    "capital": "Daca",
    "continent": "Asia",
    "iso2": "bd",
    "iso3": "BGD",
    "isoNumeric": "050",
    "coords": [
      23.81,
      90.41
    ],
    "population": 171200000,
    "areaKm2": 148460,
    "curiosity": "Hogar de los Sundarbans, el bosque de manglar más grande del mundo y refugio del tigre de Bengala."
  },
  {
    "id": "bh",
    "name": "Baréin",
    "capital": "Manama",
    "continent": "Asia",
    "iso2": "bh",
    "iso3": "BHR",
    "isoNumeric": "048",
    "coords": [
      26.23,
      50.59
    ],
    "population": 1470000,
    "areaKm2": 786,
    "curiosity": "Pequeño archipiélago del golfo Pérsico célebre históricamente por la pesca tradicional de perlas finas."
  },
  {
    "id": "mm",
    "name": "Birmania",
    "capital": "Naipyidó",
    "continent": "Asia",
    "iso2": "mm",
    "iso3": "MMR",
    "isoNumeric": "104",
    "coords": [
      19.76,
      96.08
    ],
    "population": 54180000,
    "areaKm2": 676578,
    "curiosity": "En la llanura de Bagán se alzan más de 2.000 templos y pagodas budistas medievales doradas."
  },
  {
    "id": "bn",
    "name": "Brunéi",
    "capital": "Bandar Seri Begawan",
    "continent": "Asia",
    "iso2": "bn",
    "iso3": "BRN",
    "isoNumeric": "096",
    "coords": [
      4.9,
      114.94
    ],
    "population": 449000,
    "areaKm2": 5765,
    "curiosity": "Sultanato en la isla de Borneo famoso por su inmensa riqueza petrolífera y mezquitas con cúpulas de oro puro."
  },
  {
    "id": "bt",
    "name": "Bután",
    "capital": "Timbu",
    "continent": "Asia",
    "iso2": "bt",
    "iso3": "BTN",
    "isoNumeric": "064",
    "coords": [
      27.47,
      89.64
    ],
    "population": 782000,
    "areaKm2": 38394,
    "curiosity": "Mide el bienestar de su población con la Felicidad Nacional Bruta y es el primer país con huella de carbono negativa."
  },
  {
    "id": "kh",
    "name": "Camboya",
    "capital": "Nom Pen",
    "continent": "Asia",
    "iso2": "kh",
    "iso3": "KHM",
    "isoNumeric": "116",
    "coords": [
      11.56,
      104.92
    ],
    "population": 16770000,
    "areaKm2": 181035,
    "curiosity": "Alberga Angkor Wat, el monumento religioso más grande jamás construido, joya de la arquitectura jemer."
  },
  {
    "id": "qa",
    "name": "Catar",
    "capital": "Doha",
    "continent": "Asia",
    "iso2": "qa",
    "iso3": "QAT",
    "isoNumeric": "634",
    "coords": [
      25.29,
      51.53
    ],
    "population": 2700000,
    "areaKm2": 11586,
    "curiosity": "Península ultramoderna en el golfo Pérsico que acogió la Copa Mundial de Fútbol 2022."
  },
  {
    "id": "cn",
    "name": "China",
    "capital": "Pekín",
    "continent": "Asia",
    "iso2": "cn",
    "iso3": "CHN",
    "isoNumeric": "156",
    "coords": [
      39.9,
      116.41
    ],
    "population": 1412000000,
    "areaKm2": 9596961,
    "curiosity": "Civilización milenaria constructora de la Gran Muralla (más de 21.000 km) y cuna del papel, la brújula y la pólvora."
  },
  {
    "id": "cy",
    "name": "Chipre",
    "capital": "Nicosia",
    "continent": "Asia",
    "iso2": "cy",
    "iso3": "CYP",
    "isoNumeric": "196",
    "coords": [
      35.19,
      33.38
    ],
    "population": 1250000,
    "areaKm2": 9251,
    "curiosity": "Isla mediterránea mítica donde la tradición sitúa el nacimiento de Afrodita, diosa del amor."
  },
  {
    "id": "kp",
    "name": "Corea del Norte",
    "capital": "Pionyang",
    "continent": "Asia",
    "iso2": "kp",
    "iso3": "PRK",
    "isoNumeric": "408",
    "coords": [
      39.04,
      125.76
    ],
    "population": 26070000,
    "areaKm2": 120538,
    "curiosity": "El estado más hermético del mundo, gobernado bajo la doctrina política del Juche."
  },
  {
    "id": "kr",
    "name": "Corea del Sur",
    "capital": "Seúl",
    "continent": "Asia",
    "iso2": "kr",
    "iso3": "KOR",
    "isoNumeric": "410",
    "coords": [
      37.57,
      126.98
    ],
    "population": 51630000,
    "areaKm2": 100210,
    "curiosity": "Potencia tecnológica y cultural mundial gracias a la ola «Hallyu» del K-Pop y el cine coreano."
  },
  {
    "id": "ae",
    "name": "Emiratos Árabes Unidos",
    "capital": "Abu Dabi",
    "continent": "Asia",
    "iso2": "ae",
    "iso3": "ARE",
    "isoNumeric": "784",
    "coords": [
      24.45,
      54.38
    ],
    "population": 9440000,
    "areaKm2": 83600,
    "curiosity": "En Dubái se alza el Burj Khalifa (828 m), el rascacielos y estructura humana más alta de la Tierra."
  },
  {
    "id": "ph",
    "name": "Filipinas",
    "capital": "Manila",
    "continent": "Asia",
    "iso2": "ph",
    "iso3": "PHL",
    "isoNumeric": "608",
    "coords": [
      14.6,
      120.98
    ],
    "population": 115600000,
    "areaKm2": 300000,
    "curiosity": "Archipiélago de más de 7.600 islas tropicales con las milenarias terrazas de arroz de Banaue."
  },
  {
    "id": "ge",
    "name": "Georgia",
    "capital": "Tiflis",
    "continent": "Asia",
    "iso2": "ge",
    "iso3": "GEO",
    "isoNumeric": "268",
    "coords": [
      41.72,
      44.79
    ],
    "population": 3710000,
    "areaKm2": 69700,
    "curiosity": "Considerada la cuna mundial del vino con más de 8.000 años elaborándolo en vasijas de barro qvevri."
  },
  {
    "id": "in",
    "name": "India",
    "capital": "Nueva Delhi",
    "continent": "Asia",
    "iso2": "in",
    "iso3": "IND",
    "isoNumeric": "356",
    "coords": [
      28.61,
      77.21
    ],
    "population": 1428600000,
    "areaKm2": 3287263,
    "curiosity": "El país más poblado de la Tierra, cuna del yoga, el ajedrez y el majestuoso mausoleo del Taj Mahal."
  },
  {
    "id": "id",
    "name": "Indonesia",
    "capital": "Yakarta",
    "continent": "Asia",
    "iso2": "id",
    "iso3": "IDN",
    "isoNumeric": "360",
    "coords": [
      -6.21,
      106.85
    ],
    "population": 275500000,
    "areaKm2": 1904569,
    "curiosity": "El mayor país archipelágico del mundo con más de 17.000 islas y hogar del dragón de Komodo."
  },
  {
    "id": "iq",
    "name": "Irak",
    "capital": "Bagdad",
    "continent": "Asia",
    "iso2": "iq",
    "iso3": "IRQ",
    "isoNumeric": "368",
    "coords": [
      33.32,
      44.36
    ],
    "population": 44500000,
    "areaKm2": 438317,
    "curiosity": "Cuna de Mesopotamia («entre ríos» Tigris y Éufrates) donde florecieron la escritura cuneiforme y Babilonia."
  },
  {
    "id": "ir",
    "name": "Irán",
    "capital": "Teherán",
    "continent": "Asia",
    "iso2": "ir",
    "iso3": "IRN",
    "isoNumeric": "364",
    "coords": [
      35.69,
      51.39
    ],
    "population": 88550000,
    "areaKm2": 1648195,
    "curiosity": "Heredero del Imperio Persa con las ruinas de Persépolis y las cúpulas de mosaicos turquesas de Isfahán."
  },
  {
    "id": "il",
    "name": "Israel",
    "capital": "Jerusalén",
    "continent": "Asia",
    "iso2": "il",
    "iso3": "ISR",
    "isoNumeric": "376",
    "coords": [
      31.77,
      35.22
    ],
    "population": 9550000,
    "areaKm2": 22072,
    "curiosity": "Alberga el mar Muerto, el punto emergido más bajo de la Tierra a más de 430 m bajo el nivel del mar."
  },
  {
    "id": "jp",
    "name": "Japón",
    "capital": "Tokio",
    "continent": "Asia",
    "iso2": "jp",
    "iso3": "JPN",
    "isoNumeric": "392",
    "coords": [
      35.68,
      139.69
    ],
    "population": 125100000,
    "areaKm2": 377975,
    "curiosity": "Archipiélago volcánico con el sagrado monte Fuji, trenes bala Shinkansen y milenaria tradición sintoísta."
  },
  {
    "id": "jo",
    "name": "Jordania",
    "capital": "Amán",
    "continent": "Asia",
    "iso2": "jo",
    "iso3": "JOR",
    "isoNumeric": "400",
    "coords": [
      31.95,
      35.93
    ],
    "population": 11290000,
    "areaKm2": 89342,
    "curiosity": "Custodia la mítica ciudad nabatea de Petra, esculpida directamente en acantilados de roca arenisca rosa."
  },
  {
    "id": "kz",
    "name": "Kazajistán",
    "capital": "Astaná",
    "continent": "Asia",
    "iso2": "kz",
    "iso3": "KAZ",
    "isoNumeric": "398",
    "coords": [
      51.17,
      71.45
    ],
    "population": 19620000,
    "areaKm2": 2724900,
    "curiosity": "El mayor país del mundo sin salida al mar; desde su cosmódromo de Baikonur partió Yuri Gagarin al espacio."
  },
  {
    "id": "kg",
    "name": "Kirguistán",
    "capital": "Biskek",
    "continent": "Asia",
    "iso2": "kg",
    "iso3": "KGZ",
    "isoNumeric": "417",
    "coords": [
      42.87,
      74.59
    ],
    "population": 6960000,
    "areaKm2": 199951,
    "curiosity": "Dominado por las cumbres de Tian Shan («montañas celestiales») y la cultura nómada de las yurtas."
  },
  {
    "id": "kw",
    "name": "Kuwait",
    "capital": "Ciudad de Kuwait",
    "continent": "Asia",
    "iso2": "kw",
    "iso3": "KWT",
    "isoNumeric": "414",
    "coords": [
      29.38,
      47.98
    ],
    "population": 4270000,
    "areaKm2": 17818,
    "curiosity": "El dinar kuwaití es la unidad monetaria con mayor valor nominal de todo el planeta."
  },
  {
    "id": "la",
    "name": "Laos",
    "capital": "Vientián",
    "continent": "Asia",
    "iso2": "la",
    "iso3": "LAO",
    "isoNumeric": "418",
    "coords": [
      17.98,
      102.63
    ],
    "population": 7530000,
    "areaKm2": 236800,
    "curiosity": "Único país del Sudeste Asiático sin salida al mar; atravesado de norte a sur por el río Mekong."
  },
  {
    "id": "lb",
    "name": "Líbano",
    "capital": "Beirut",
    "continent": "Asia",
    "iso2": "lb",
    "iso3": "LBN",
    "isoNumeric": "422",
    "coords": [
      33.89,
      35.5
    ],
    "population": 5490000,
    "areaKm2": 10452,
    "curiosity": "Cuna de los navegantes fenicios; su bandera luce el cedro milenario del Líbano."
  },
  {
    "id": "my",
    "name": "Malasia",
    "capital": "Kuala Lumpur",
    "continent": "Asia",
    "iso2": "my",
    "iso3": "MYS",
    "isoNumeric": "458",
    "coords": [
      3.14,
      101.69
    ],
    "population": 33940000,
    "areaKm2": 330803,
    "curiosity": "Las torres Petronas fueron los edificios más altos del mundo y continúan siendo las torres gemelas más altas."
  },
  {
    "id": "mv",
    "name": "Maldivas",
    "capital": "Malé",
    "continent": "Asia",
    "iso2": "mv",
    "iso3": "MDV",
    "isoNumeric": "462",
    "coords": [
      4.18,
      73.51
    ],
    "population": 524000,
    "areaKm2": 298,
    "curiosity": "El país más bajo del planeta, con una altitud media de apenas 1,5 metros sobre el nivel del mar."
  },
  {
    "id": "mn",
    "name": "Mongolia",
    "capital": "Ulán Bator",
    "continent": "Asia",
    "iso2": "mn",
    "iso3": "MNG",
    "isoNumeric": "496",
    "coords": [
      47.92,
      106.92
    ],
    "population": 3400000,
    "areaKm2": 1564116,
    "curiosity": "El país soberano con menor densidad demográfica del mundo (apenas 2 habitantes por km²); tierra de Gengis Kan."
  },
  {
    "id": "np",
    "name": "Nepal",
    "capital": "Katmandú",
    "continent": "Asia",
    "iso2": "np",
    "iso3": "NPL",
    "isoNumeric": "524",
    "coords": [
      27.72,
      85.32
    ],
    "population": 30550000,
    "areaKm2": 147181,
    "curiosity": "Alberga el monte Everest (8.848 m) y es el único país del mundo cuya bandera oficial no es cuadrilátera."
  },
  {
    "id": "om",
    "name": "Omán",
    "capital": "Mascate",
    "continent": "Asia",
    "iso2": "om",
    "iso3": "OMN",
    "isoNumeric": "512",
    "coords": [
      23.59,
      58.41
    ],
    "population": 4580000,
    "areaKm2": 309500,
    "curiosity": "Célebre por sus antiguos fuertes de adobe, sus fiordos desérticos en Musandam y la ruta del incienso."
  },
  {
    "id": "pk",
    "name": "Pakistán",
    "capital": "Islamabad",
    "continent": "Asia",
    "iso2": "pk",
    "iso3": "PAK",
    "isoNumeric": "586",
    "coords": [
      33.69,
      73.04
    ],
    "population": 235800000,
    "areaKm2": 881913,
    "curiosity": "Posee el K2 (8.611 m), la segunda montaña más alta del mundo en la cordillera del Karakórum."
  },
  {
    "id": "sg",
    "name": "Singapur",
    "capital": "Singapur",
    "continent": "Asia",
    "iso2": "sg",
    "iso3": "SGP",
    "isoNumeric": "702",
    "coords": [
      1.35,
      103.82
    ],
    "population": 5640000,
    "areaKm2": 734,
    "curiosity": "Ciudad-estado insular líder en innovación, célebre por sus superárboles verticales en Gardens by the Bay."
  },
  {
    "id": "sy",
    "name": "Siria",
    "capital": "Damasco",
    "continent": "Asia",
    "iso2": "sy",
    "iso3": "SYR",
    "isoNumeric": "760",
    "coords": [
      33.51,
      36.29
    ],
    "population": 22130000,
    "areaKm2": 185180,
    "curiosity": "Damasco es considerada una de las ciudades continuamente habitadas más antiguas del planeta."
  },
  {
    "id": "lk",
    "name": "Sri Lanka",
    "capital": "Sri Jayawardenepura Kotte",
    "continent": "Asia",
    "iso2": "lk",
    "iso3": "LKA",
    "isoNumeric": "144",
    "coords": [
      6.91,
      79.9
    ],
    "population": 22180000,
    "areaKm2": 65610,
    "curiosity": "Conocida como la «lágrima de la India», famosa mundialmente por el té de Ceilán y la fortaleza de Sigiriya."
  },
  {
    "id": "th",
    "name": "Tailandia",
    "capital": "Bangkok",
    "continent": "Asia",
    "iso2": "th",
    "iso3": "THA",
    "isoNumeric": "764",
    "coords": [
      13.76,
      100.5
    ],
    "population": 71700000,
    "areaKm2": 513120,
    "curiosity": "El único país del Sudeste Asiático que nunca fue colonizado por potencias europeas; tierra de templos dorados."
  },
  {
    "id": "tj",
    "name": "Tayikistán",
    "capital": "Dusambé",
    "continent": "Asia",
    "iso2": "tj",
    "iso3": "TJK",
    "isoNumeric": "762",
    "coords": [
      38.56,
      68.78
    ],
    "population": 9960000,
    "areaKm2": 143100,
    "curiosity": "Más del 90% de su territorio montañoso está cubierto por la impresionante cordillera del Pamir."
  },
  {
    "id": "tl",
    "name": "Timor Oriental",
    "capital": "Dili",
    "continent": "Asia",
    "iso2": "tl",
    "iso3": "TLS",
    "isoNumeric": "626",
    "coords": [
      -8.56,
      125.57
    ],
    "population": 1340000,
    "areaKm2": 14874,
    "curiosity": "Uno de los países más jóvenes del siglo XXI, habiendo recuperado su soberanía completa en 2002."
  },
  {
    "id": "tm",
    "name": "Turkmenistán",
    "capital": "Asjabad",
    "continent": "Asia",
    "iso2": "tm",
    "iso3": "TKM",
    "isoNumeric": "795",
    "coords": [
      37.95,
      58.38
    ],
    "population": 6430000,
    "areaKm2": 488100,
    "curiosity": "Alberga el cráter de gas de Darvaza, apodado «la Puerta del Infierno», en llamas continuas desde 1971."
  },
  {
    "id": "tr",
    "name": "Turquía",
    "capital": "Ankara",
    "continent": "Asia",
    "iso2": "tr",
    "iso3": "TUR",
    "isoNumeric": "792",
    "coords": [
      39.93,
      32.85
    ],
    "population": 85300000,
    "areaKm2": 783562,
    "curiosity": "Puente transcontinental entre Europa y Asia; alberga las chimeneas de hadas de Capadocia y Santa Sofía."
  },
  {
    "id": "uz",
    "name": "Uzbekistán",
    "capital": "Taskent",
    "continent": "Asia",
    "iso2": "uz",
    "iso3": "UZB",
    "isoNumeric": "860",
    "coords": [
      41.31,
      69.24
    ],
    "population": 35650000,
    "areaKm2": 447400,
    "curiosity": "Samarcanda y Bujará fueron joyas de la Ruta de la Seda con fastuosas madrasas de azulejos azul cobalto."
  },
  {
    "id": "vn",
    "name": "Vietnam",
    "capital": "Hanói",
    "continent": "Asia",
    "iso2": "vn",
    "iso3": "VNM",
    "isoNumeric": "704",
    "coords": [
      21.03,
      105.85
    ],
    "population": 98190000,
    "areaKm2": 331212,
    "curiosity": "La bahía de Ha Long deslumbra con miles de islas kársticas cubiertas de vegetación selvática."
  },
  {
    "id": "ye",
    "name": "Yemen",
    "capital": "Saná",
    "continent": "Asia",
    "iso2": "ye",
    "iso3": "YEM",
    "isoNumeric": "887",
    "coords": [
      15.35,
      44.21
    ],
    "population": 33700000,
    "areaKm2": 527968,
    "curiosity": "Shibam es apodada el «Manhattan del desierto» por sus rascacielos residenciales de adobe del siglo XVI."
  },
  {
    "id": "al",
    "name": "Albania",
    "capital": "Tirana",
    "continent": "Europa",
    "iso2": "al",
    "iso3": "ALB",
    "isoNumeric": "008",
    "coords": [
      41.33,
      19.82
    ],
    "population": 2780000,
    "areaKm2": 28748,
    "curiosity": "Su costa en la Riviera albanesa combina aguas cristalinas del mar Jónico con los Alpes dináricos."
  },
  {
    "id": "de",
    "name": "Alemania",
    "capital": "Berlín",
    "continent": "Europa",
    "iso2": "de",
    "iso3": "DEU",
    "isoNumeric": "276",
    "coords": [
      52.52,
      13.4
    ],
    "population": 84360000,
    "areaKm2": 357022,
    "curiosity": "Motor industrial europeo y cuna de genios como Bach, Beethoven, Einstein y la escuela Bauhaus."
  },
  {
    "id": "ad",
    "name": "Andorra",
    "capital": "Andorra la Vieja",
    "continent": "Europa",
    "iso2": "ad",
    "iso3": "AND",
    "isoNumeric": "020",
    "coords": [
      42.51,
      1.52
    ],
    "population": 80000,
    "areaKm2": 468,
    "curiosity": "Coprincipado enclavado en los Pirineos cuya capital es la más alta sobre el nivel del mar en Europa (1.023 m)."
  },
  {
    "id": "at",
    "name": "Austria",
    "capital": "Viena",
    "continent": "Europa",
    "iso2": "at",
    "iso3": "AUT",
    "isoNumeric": "040",
    "coords": [
      48.21,
      16.37
    ],
    "population": 9040000,
    "areaKm2": 83879,
    "curiosity": "Patria de Mozart y los valses del Danubio; más del 60% de su geografía son picos de los Alpes."
  },
  {
    "id": "be",
    "name": "Bélgica",
    "capital": "Bruselas",
    "continent": "Europa",
    "iso2": "be",
    "iso3": "BEL",
    "isoNumeric": "056",
    "coords": [
      50.85,
      4.35
    ],
    "population": 11690000,
    "areaKm2": 30528,
    "curiosity": "Corazón institucional de la Unión Europea y la OTAN; mundialmente famosa por su chocolate y gofres."
  },
  {
    "id": "by",
    "name": "Bielorrusia",
    "capital": "Minsk",
    "continent": "Europa",
    "iso2": "by",
    "iso3": "BLR",
    "isoNumeric": "112",
    "coords": [
      53.9,
      27.57
    ],
    "population": 9200000,
    "areaKm2": 207600,
    "curiosity": "Alberga el bosque primigenio de Białowieża, último refugio salvaje del bisonte europeo."
  },
  {
    "id": "ba",
    "name": "Bosnia y Herzegovina",
    "capital": "Sarajevo",
    "continent": "Europa",
    "iso2": "ba",
    "iso3": "BIH",
    "isoNumeric": "070",
    "coords": [
      43.86,
      18.41
    ],
    "population": 3230000,
    "areaKm2": 51197,
    "curiosity": "El puente otomano Stari Most en Móstar es un sobrecogedor símbolo de reconciliación cultural."
  },
  {
    "id": "bg",
    "name": "Bulgaria",
    "capital": "Sofía",
    "continent": "Europa",
    "iso2": "bg",
    "iso3": "BGR",
    "isoNumeric": "100",
    "coords": [
      42.7,
      23.32
    ],
    "population": 6450000,
    "areaKm2": 110879,
    "curiosity": "El Valle de las Rosas búlgaro produce casi la mitad del aceite de rosas de alta perfumería mundial."
  },
  {
    "id": "hr",
    "name": "Croacia",
    "capital": "Zagreb",
    "continent": "Europa",
    "iso2": "hr",
    "iso3": "HRV",
    "isoNumeric": "191",
    "coords": [
      45.81,
      15.98
    ],
    "population": 3860000,
    "areaKm2": 56594,
    "curiosity": "Cuenta con más de 1.200 islas e islotes en el Adriático y las murallas de piedra intactas de Dubrovnik."
  },
  {
    "id": "dk",
    "name": "Dinamarca",
    "capital": "Copenhague",
    "continent": "Europa",
    "iso2": "dk",
    "iso3": "DNK",
    "isoNumeric": "208",
    "coords": [
      55.68,
      12.57
    ],
    "population": 5930000,
    "areaKm2": 42933,
    "curiosity": "Cuna de los cuentos de Hans Christian Andersen, los bloques de LEGO y la monarquía continua más antigua."
  },
  {
    "id": "sk",
    "name": "Eslovaquia",
    "capital": "Bratislava",
    "continent": "Europa",
    "iso2": "sk",
    "iso3": "SVK",
    "isoNumeric": "703",
    "coords": [
      48.15,
      17.11
    ],
    "population": 5430000,
    "areaKm2": 49035,
    "curiosity": "Tiene una de las mayores densidades de castillos medievales por habitante de Europa (más de 180)."
  },
  {
    "id": "si",
    "name": "Eslovenia",
    "capital": "Liubliana",
    "continent": "Europa",
    "iso2": "si",
    "iso3": "SVN",
    "isoNumeric": "705",
    "coords": [
      46.05,
      14.51
    ],
    "population": 2110000,
    "areaKm2": 20273,
    "curiosity": "El lago Bled, con su pintoresca iglesia en una isla alpina central, parece sacado de un cuento de hadas."
  },
  {
    "id": "es",
    "name": "España",
    "capital": "Madrid",
    "continent": "Europa",
    "iso2": "es",
    "iso3": "ESP",
    "isoNumeric": "724",
    "coords": [
      40.42,
      -3.7
    ],
    "population": 47620000,
    "areaKm2": 505990,
    "curiosity": "Segundo país más visitado del mundo; posee tesoros universales como la Alhambra de Granada y la Sagrada Familia."
  },
  {
    "id": "ee",
    "name": "Estonia",
    "capital": "Tallin",
    "continent": "Europa",
    "iso2": "ee",
    "iso3": "EST",
    "isoNumeric": "233",
    "coords": [
      59.44,
      24.75
    ],
    "population": 1330000,
    "areaKm2": 45228,
    "curiosity": "Pionero mundial indiscutible en administración digital: el 99% de sus trámites públicos se realizan en línea."
  },
  {
    "id": "fi",
    "name": "Finlandia",
    "capital": "Helsinki",
    "continent": "Europa",
    "iso2": "fi",
    "iso3": "FIN",
    "isoNumeric": "246",
    "coords": [
      60.17,
      24.94
    ],
    "population": 5540000,
    "areaKm2": 338424,
    "curiosity": "Llamado «el país de los mil lagos» (tiene más de 188.000) y reconocido por su prestigioso sistema educativo."
  },
  {
    "id": "fr",
    "name": "Francia",
    "capital": "París",
    "continent": "Europa",
    "iso2": "fr",
    "iso3": "FRA",
    "isoNumeric": "250",
    "coords": [
      48.86,
      2.35
    ],
    "population": 67970000,
    "areaKm2": 643801,
    "curiosity": "Icono global del arte, la alta cocina y la moda; París acoge la Torre Eiffel y el Museo del Louvre."
  },
  {
    "id": "gr",
    "name": "Grecia",
    "capital": "Atenas",
    "continent": "Europa",
    "iso2": "gr",
    "iso3": "GRC",
    "isoNumeric": "300",
    "coords": [
      37.98,
      23.73
    ],
    "population": 10430000,
    "areaKm2": 131957,
    "curiosity": "Cuna de la democracia occidental, la filosofía, las artes teatrales y los antiguos Juegos Olímpicos."
  },
  {
    "id": "hu",
    "name": "Hungría",
    "capital": "Budapest",
    "continent": "Europa",
    "iso2": "hu",
    "iso3": "HUN",
    "isoNumeric": "348",
    "coords": [
      47.5,
      19.04
    ],
    "population": 9690000,
    "areaKm2": 93028,
    "curiosity": "Budapest es célebre por sus baños termales de vapor caliente y el monumental Parlamento a orillas del Danubio."
  },
  {
    "id": "ie",
    "name": "Irlanda",
    "capital": "Dublín",
    "continent": "Europa",
    "iso2": "ie",
    "iso3": "IRL",
    "isoNumeric": "372",
    "coords": [
      53.35,
      -6.26
    ],
    "population": 5130000,
    "areaKm2": 70273,
    "curiosity": "Apodada la «Isla Esmeralda» por el verdor ininterrumpido de sus paisajes y los acantilados de Moher."
  },
  {
    "id": "is",
    "name": "Islandia",
    "capital": "Reikiavik",
    "continent": "Europa",
    "iso2": "is",
    "iso3": "ISL",
    "isoNumeric": "352",
    "coords": [
      64.15,
      -21.94
    ],
    "population": 388000,
    "areaKm2": 103000,
    "curiosity": "Tierra de fuego y hielo donde volcanes activos conviven con glaciares masivos y auroras boreales."
  },
  {
    "id": "it",
    "name": "Italia",
    "capital": "Roma",
    "continent": "Europa",
    "iso2": "it",
    "iso3": "ITA",
    "isoNumeric": "380",
    "coords": [
      41.9,
      12.5
    ],
    "population": 58850000,
    "areaKm2": 301340,
    "curiosity": "El país con mayor número de sitios declarados Patrimonio de la Humanidad por la UNESCO en el mundo."
  },
  {
    "id": "lv",
    "name": "Letonia",
    "capital": "Riga",
    "continent": "Europa",
    "iso2": "lv",
    "iso3": "LVA",
    "isoNumeric": "428",
    "coords": [
      56.95,
      24.11
    ],
    "population": 1880000,
    "areaKm2": 64589,
    "curiosity": "Su capital Riga conserva la mayor concentración intacta de arquitectura Art Nouveau de toda Europa."
  },
  {
    "id": "li",
    "name": "Liechtenstein",
    "capital": "Vaduz",
    "continent": "Europa",
    "iso2": "li",
    "iso3": "LIE",
    "isoNumeric": "438",
    "coords": [
      47.14,
      9.52
    ],
    "population": 39000,
    "areaKm2": 160,
    "curiosity": "Uno de los dos únicos países doblemente sin salida al mar (rodeado únicamente por estados sin litoral)."
  },
  {
    "id": "lt",
    "name": "Lituania",
    "capital": "Vilna",
    "continent": "Europa",
    "iso2": "lt",
    "iso3": "LTU",
    "isoNumeric": "440",
    "coords": [
      54.69,
      25.28
    ],
    "population": 2830000,
    "areaKm2": 65300,
    "curiosity": "Hogar de la Colina de las Cruces y poseedor de un idioma báltico que conserva rasgos indoeuropeos ancestrales."
  },
  {
    "id": "lu",
    "name": "Luxemburgo",
    "capital": "Luxemburgo",
    "continent": "Europa",
    "iso2": "lu",
    "iso3": "LUX",
    "isoNumeric": "442",
    "coords": [
      49.61,
      6.13
    ],
    "population": 660000,
    "areaKm2": 2586,
    "curiosity": "El único gran ducado soberano del mundo y el primer país en ofrecer todo el transporte público gratis."
  },
  {
    "id": "mk",
    "name": "Macedonia del Norte",
    "capital": "Skopie",
    "continent": "Europa",
    "iso2": "mk",
    "iso3": "MKD",
    "isoNumeric": "807",
    "coords": [
      42,
      21.43
    ],
    "population": 1830000,
    "areaKm2": 25713,
    "curiosity": "El lago de Ocrida es uno de los más antiguos y profundos de Europa, con ecosistema biológico único."
  },
  {
    "id": "mt",
    "name": "Malta",
    "capital": "La Valeta",
    "continent": "Europa",
    "iso2": "mt",
    "iso3": "MLT",
    "isoNumeric": "470",
    "coords": [
      35.9,
      14.51
    ],
    "population": 535000,
    "areaKm2": 316,
    "curiosity": "Alberga templos megalíticos de piedra anteriores a las pirámides de Egipto y a Stonehenge."
  },
  {
    "id": "md",
    "name": "Moldavia",
    "capital": "Chisináu",
    "continent": "Europa",
    "iso2": "md",
    "iso3": "MDA",
    "isoNumeric": "498",
    "coords": [
      47.01,
      28.86
    ],
    "population": 2530000,
    "areaKm2": 33846,
    "curiosity": "Custodia la bodega vinícola subterránea de Mileștii Mici, la más extensa del mundo con 200 km de túneles."
  },
  {
    "id": "mc",
    "name": "Mónaco",
    "capital": "Mónaco",
    "continent": "Europa",
    "iso2": "mc",
    "iso3": "MCO",
    "isoNumeric": "492",
    "coords": [
      43.74,
      7.42
    ],
    "population": 39000,
    "areaKm2": 2,
    "curiosity": "El segundo país más pequeño del mundo y el más densamente poblado; sede del circuito de F1 de Montecarlo."
  },
  {
    "id": "me",
    "name": "Montenegro",
    "capital": "Podgorica",
    "continent": "Europa",
    "iso2": "me",
    "iso3": "MNE",
    "isoNumeric": "499",
    "coords": [
      42.44,
      19.26
    ],
    "population": 620000,
    "areaKm2": 13812,
    "curiosity": "La bahía de Kotor es considerada el fiordo más meridional de Europa, esculpido entre altas cumbres rocosas."
  },
  {
    "id": "no",
    "name": "Noruega",
    "capital": "Oslo",
    "continent": "Europa",
    "iso2": "no",
    "iso3": "NOR",
    "isoNumeric": "578",
    "coords": [
      59.91,
      10.75
    ],
    "population": 5460000,
    "areaKm2": 385207,
    "curiosity": "Célebre por sus majestuosos fiordos, el sol de medianoche en el cabo Norte y las luces de la aurora boreal."
  },
  {
    "id": "nl",
    "name": "Países Bajos",
    "capital": "Ámsterdam",
    "continent": "Europa",
    "iso2": "nl",
    "iso3": "NLD",
    "isoNumeric": "528",
    "coords": [
      52.37,
      4.89
    ],
    "population": 17800000,
    "areaKm2": 41543,
    "curiosity": "Cerca de un tercio de su territorio está bajo el nivel del mar, protegido por canales, diques y molinos."
  },
  {
    "id": "pl",
    "name": "Polonia",
    "capital": "Varsovia",
    "continent": "Europa",
    "iso2": "pl",
    "iso3": "POL",
    "isoNumeric": "616",
    "coords": [
      52.23,
      21.01
    ],
    "population": 37700000,
    "areaKm2": 312696,
    "curiosity": "Cuna del astrónomo Copérnico, Frédéric Chopin y de la milenaria mina subterránea de sal de Wieliczka."
  },
  {
    "id": "pt",
    "name": "Portugal",
    "capital": "Lisboa",
    "continent": "Europa",
    "iso2": "pt",
    "iso3": "PRT",
    "isoNumeric": "620",
    "coords": [
      38.72,
      -9.14
    ],
    "population": 10400000,
    "areaKm2": 92212,
    "curiosity": "Nación pionera de las grandes exploraciones marítimas; famosa por el fado melancólico y los azulejos."
  },
  {
    "id": "gb",
    "name": "Reino Unido",
    "capital": "Londres",
    "continent": "Europa",
    "iso2": "gb",
    "iso3": "GBR",
    "isoNumeric": "826",
    "coords": [
      51.51,
      -0.13
    ],
    "population": 67500000,
    "areaKm2": 242495,
    "curiosity": "Cuna de la Revolución Industrial, la lengua inglesa global, William Shakespeare y la banda The Beatles."
  },
  {
    "id": "cz",
    "name": "República Checa",
    "capital": "Praga",
    "continent": "Europa",
    "iso2": "cz",
    "iso3": "CZE",
    "isoNumeric": "203",
    "coords": [
      50.08,
      14.44
    ],
    "population": 10520000,
    "areaKm2": 78867,
    "curiosity": "Praga es la «Ciudad de las Cien Torres», y el país es el mayor consumidor de cerveza per cápita del mundo."
  },
  {
    "id": "ro",
    "name": "Rumanía",
    "capital": "Bucarest",
    "continent": "Europa",
    "iso2": "ro",
    "iso3": "ROU",
    "isoNumeric": "642",
    "coords": [
      44.43,
      26.1
    ],
    "population": 19050000,
    "areaKm2": 238391,
    "curiosity": "Hogar de la legendaria región de Transilvania, el castillo de Bran y la serpenteante carretera Transfăgărășan."
  },
  {
    "id": "ru",
    "name": "Rusia",
    "capital": "Moscú",
    "continent": "Europa",
    "iso2": "ru",
    "iso3": "RUS",
    "isoNumeric": "643",
    "coords": [
      55.75,
      37.62
    ],
    "population": 144200000,
    "areaKm2": 17098242,
    "curiosity": "El país más extenso del planeta abarca 11 husos horarios y contiene el lago Baikal, el más profundo del mundo."
  },
  {
    "id": "sm",
    "name": "San Marino",
    "capital": "San Marino",
    "continent": "Europa",
    "iso2": "sm",
    "iso3": "SMR",
    "isoNumeric": "674",
    "coords": [
      43.94,
      12.46
    ],
    "population": 34000,
    "areaKm2": 61,
    "curiosity": "Fundada en el año 301 d.C., ostenta el título de la república soberana más antigua aún existente en el mundo."
  },
  {
    "id": "rs",
    "name": "Serbia",
    "capital": "Belgrado",
    "continent": "Europa",
    "iso2": "rs",
    "iso3": "SRB",
    "isoNumeric": "688",
    "coords": [
      44.82,
      20.46
    ],
    "population": 6660000,
    "areaKm2": 88361,
    "curiosity": "Belgrado es una de las capitales más antiguas del sudeste europeo, en la confluencia del Sava y el Danubio."
  },
  {
    "id": "se",
    "name": "Suecia",
    "capital": "Estocolmo",
    "continent": "Europa",
    "iso2": "se",
    "iso3": "SWE",
    "isoNumeric": "752",
    "coords": [
      59.33,
      18.07
    ],
    "population": 10520000,
    "areaKm2": 450295,
    "curiosity": "Sede de la entrega anual de los Premios Nobel, creados por el inventor de la dinamita Alfred Nobel."
  },
  {
    "id": "ch",
    "name": "Suiza",
    "capital": "Berna",
    "continent": "Europa",
    "iso2": "ch",
    "iso3": "CHE",
    "isoNumeric": "756",
    "coords": [
      46.95,
      7.45
    ],
    "population": 8800000,
    "areaKm2": 41285,
    "curiosity": "Mantiene una histórica neutralidad; hogar del pico Cervino (Matterhorn), relojes de precisión y 4 lenguas oficiales."
  },
  {
    "id": "ua",
    "name": "Ucrania",
    "capital": "Kiev",
    "continent": "Europa",
    "iso2": "ua",
    "iso3": "UKR",
    "isoNumeric": "804",
    "coords": [
      50.45,
      30.52
    ],
    "population": 38000000,
    "areaKm2": 603550,
    "curiosity": "El país con mayor superficie íntegramente en territorio europeo; conocido como el «granero de Europa»."
  },
  {
    "id": "va",
    "name": "Ciudad del Vaticano",
    "capital": "Ciudad del Vaticano",
    "continent": "Europa",
    "iso2": "va",
    "iso3": "VAT",
    "isoNumeric": "336",
    "coords": [
      41.9,
      12.45
    ],
    "population": 800,
    "areaKm2": 0.49,
    "curiosity": "El estado soberano más diminuto del mundo; alberga la colosal Basílica de San Pedro y la Capilla Sixtina."
  },
  {
    "id": "au",
    "name": "Australia",
    "capital": "Camberra",
    "continent": "Oceanía",
    "iso2": "au",
    "iso3": "AUS",
    "isoNumeric": "036",
    "coords": [
      -35.28,
      149.13
    ],
    "population": 26000000,
    "areaKm2": 7692024,
    "curiosity": "Continente-isla que alberga la Gran Barrera de Coral y especies únicas como canguros, koalas y ornitorrincos."
  },
  {
    "id": "fj",
    "name": "Fiyi",
    "capital": "Suva",
    "continent": "Oceanía",
    "iso2": "fj",
    "iso3": "FJI",
    "isoNumeric": "242",
    "coords": [
      -18.14,
      178.44
    ],
    "population": 930000,
    "areaKm2": 18274,
    "curiosity": "Archipiélago de más de 330 islas en el Pacífico sur célebre por sus lagunas de coral blando."
  },
  {
    "id": "mh",
    "name": "Islas Marshall",
    "capital": "Majuro",
    "continent": "Oceanía",
    "iso2": "mh",
    "iso3": "MHL",
    "isoNumeric": "584",
    "coords": [
      7.11,
      171.38
    ],
    "population": 42000,
    "areaKm2": 181,
    "curiosity": "Formado por 29 atolones de coral de escasa altitud con el famoso atolón Bikini."
  },
  {
    "id": "sb",
    "name": "Islas Salomón",
    "capital": "Honiara",
    "continent": "Oceanía",
    "iso2": "sb",
    "iso3": "SLB",
    "isoNumeric": "090",
    "coords": [
      -9.43,
      159.95
    ],
    "population": 720000,
    "areaKm2": 28896,
    "curiosity": "Escenario crucial de la Segunda Guerra Mundial en la batalla de Guadalcanal; aguas repletas de pecios marinos."
  },
  {
    "id": "ki",
    "name": "Kiribati",
    "capital": "Tarawa del Sur",
    "continent": "Oceanía",
    "iso2": "ki",
    "iso3": "KIR",
    "isoNumeric": "296",
    "coords": [
      1.33,
      172.98
    ],
    "population": 130000,
    "areaKm2": 811,
    "curiosity": "El único país del mundo que se extiende a través de los cuatro hemisferios terrestres (norte, sur, este y oeste)."
  },
  {
    "id": "fm",
    "name": "Micronesia",
    "capital": "Palikir",
    "continent": "Oceanía",
    "iso2": "fm",
    "iso3": "FSM",
    "isoNumeric": "583",
    "coords": [
      6.92,
      158.16
    ],
    "population": 114000,
    "areaKm2": 702,
    "curiosity": "En la isla de Pohnpei yacen las ruinas arqueológicas megalíticas marinas de Nan Madol."
  },
  {
    "id": "nr",
    "name": "Nauru",
    "capital": "Yaren",
    "continent": "Oceanía",
    "iso2": "nr",
    "iso3": "NRU",
    "isoNumeric": "520",
    "coords": [
      -0.55,
      166.92
    ],
    "population": 12500,
    "areaKm2": 21,
    "curiosity": "La república independiente más pequeña del mundo; no posee una capital oficial designada por ley."
  },
  {
    "id": "nz",
    "name": "Nueva Zelanda",
    "capital": "Wellington",
    "continent": "Oceanía",
    "iso2": "nz",
    "iso3": "NZL",
    "isoNumeric": "554",
    "coords": [
      -41.29,
      174.78
    ],
    "population": 5120000,
    "areaKm2": 268021,
    "curiosity": "Llamada Aotearoa («tierra de la larga nube blanca») por los maoríes; hogar del ave kiwi y fiordos en Milford Sound."
  },
  {
    "id": "pw",
    "name": "Palaos",
    "capital": "Ngerulmud",
    "continent": "Oceanía",
    "iso2": "pw",
    "iso3": "PLW",
    "isoNumeric": "585",
    "coords": [
      7.5,
      134.62
    ],
    "population": 18000,
    "areaKm2": 459,
    "curiosity": "Creó el primer santuario del mundo para tiburones y el famoso lago marino de las medusas doradas no urticantes."
  },
  {
    "id": "pg",
    "name": "Papúa Nueva Guinea",
    "capital": "Port Moresby",
    "continent": "Oceanía",
    "iso2": "pg",
    "iso3": "PNG",
    "isoNumeric": "598",
    "coords": [
      -9.44,
      147.18
    ],
    "population": 10140000,
    "areaKm2": 462840,
    "curiosity": "El país con mayor diversidad lingüística del mundo, con más de 840 lenguas vivas registradas."
  },
  {
    "id": "ws",
    "name": "Samoa",
    "capital": "Apia",
    "continent": "Oceanía",
    "iso2": "ws",
    "iso3": "WSM",
    "isoNumeric": "882",
    "coords": [
      -13.83,
      -171.76
    ],
    "population": 220000,
    "areaKm2": 2842,
    "curiosity": "Conserva con profundo respeto el Fa'a Samoa (el estilo de vida tradicional samoano y sus tatuajes pe'a)."
  },
  {
    "id": "to",
    "name": "Tonga",
    "capital": "Nukualofa",
    "continent": "Oceanía",
    "iso2": "to",
    "iso3": "TON",
    "isoNumeric": "776",
    "coords": [
      -21.14,
      -175.2
    ],
    "population": 106000,
    "areaKm2": 747,
    "curiosity": "Única monarquía polinesia que nunca perdió formalmente su soberanía indígena ante potencias foráneas."
  },
  {
    "id": "tv",
    "name": "Tuvalu",
    "capital": "Funafuti",
    "continent": "Oceanía",
    "iso2": "tv",
    "iso3": "TUV",
    "isoNumeric": "798",
    "coords": [
      -8.52,
      179.2
    ],
    "population": 11200,
    "areaKm2": 26,
    "curiosity": "Su dominio de internet de nivel superior (.tv) le genera valiosos ingresos para su economía nacional."
  },
  {
    "id": "vu",
    "name": "Vanuatu",
    "capital": "Port Vila",
    "continent": "Oceanía",
    "iso2": "vu",
    "iso3": "VUT",
    "isoNumeric": "548",
    "coords": [
      -17.73,
      168.32
    ],
    "population": 320000,
    "areaKm2": 12189,
    "curiosity": "Cuna del salto de naghol en la isla de Pentecostés, el precursor ritual ancestral del puenting moderno."
  }
,
  {
    "id": "pr",
    "name": "Puerto Rico",
    "capital": "San Juan",
    "continent": "América",
    "iso2": "pr",
    "iso3": "PRI",
    "isoNumeric": "630",
    "coords": [
      18.2208,
      -66.5901
    ],
    "population": 3260000,
    "areaKm2": 9104,
    "curiosity": "Estado libre asociado en las Antillas Mayores con la fortaleza histórica del Morro y el bosque lluvioso de El Yunque."
  },
  {
    "id": "vi",
    "name": "Islas Vírgenes de EE.UU.",
    "capital": "Charlotte Amalie",
    "continent": "América",
    "iso2": "vi",
    "iso3": "VIR",
    "isoNumeric": "850",
    "coords": [
      18.3358,
      -64.8963
    ],
    "population": 87000,
    "areaKm2": 346,
    "curiosity": "Territorio insular caribeño compuesto por Saint Thomas, Saint John y Saint Croix, comprado a Dinamarca en 1917."
  },
  {
    "id": "vg",
    "name": "Islas Vírgenes Británicas",
    "capital": "Road Town",
    "continent": "América",
    "iso2": "vg",
    "iso3": "VGB",
    "isoNumeric": "092",
    "coords": [
      18.4207,
      -64.6399
    ],
    "population": 31000,
    "areaKm2": 153,
    "curiosity": "Archipiélago volcánico en el Caribe nororiental célebre por los colosales bloques graníticos de The Baths en Virgen Gorda."
  },
  {
    "id": "ai",
    "name": "Anguila",
    "capital": "The Valley",
    "continent": "América",
    "iso2": "ai",
    "iso3": "AIA",
    "isoNumeric": "660",
    "coords": [
      18.2206,
      -63.0686
    ],
    "population": 15700,
    "areaKm2": 91,
    "curiosity": "Isla llana y alargada de roca caliza y coral en las Islas de Sotavento, famosa por sus playas vírgenes y bahías turquesas."
  },
  {
    "id": "ky",
    "name": "Islas Caimán",
    "capital": "George Town",
    "continent": "América",
    "iso2": "ky",
    "iso3": "CYM",
    "isoNumeric": "136",
    "coords": [
      19.3133,
      -81.2546
    ],
    "population": 71000,
    "areaKm2": 264,
    "curiosity": "Tres islas en el Caribe occidental que constituyen las cumbres emergidas de la dorsal submarina de Caimán."
  },
  {
    "id": "ms",
    "name": "Montserrat",
    "capital": "Plymouth / Brades",
    "continent": "América",
    "iso2": "ms",
    "iso3": "MSR",
    "isoNumeric": "500",
    "coords": [
      16.7425,
      -62.1874
    ],
    "population": 4400,
    "areaKm2": 102,
    "curiosity": "Conocida como la isla esmeralda del Caribe; su capital original Plymouth quedó sepultada por la erupción de Soufrière Hills."
  },
  {
    "id": "tc",
    "name": "Islas Turcas y Caicos",
    "capital": "Cockburn Town",
    "continent": "América",
    "iso2": "tc",
    "iso3": "TCA",
    "isoNumeric": "796",
    "coords": [
      21.694,
      -71.7979
    ],
    "population": 45000,
    "areaKm2": 948,
    "curiosity": "Archipiélago atlántico al sureste de las Bahamas rodeado por una de las mayores barreras de coral del hemisferio occidental."
  },
  {
    "id": "bm",
    "name": "Bermudas",
    "capital": "Hamilton",
    "continent": "América",
    "iso2": "bm",
    "iso3": "BMU",
    "isoNumeric": "060",
    "coords": [
      32.3078,
      -64.7505
    ],
    "population": 64000,
    "areaKm2": 54,
    "curiosity": "Archipiélago atlántico formado por unas ciento ochenta y una islas sobre una antigua caldera volcánica submarina."
  },
  {
    "id": "aw",
    "name": "Aruba",
    "capital": "Oranjestad",
    "continent": "América",
    "iso2": "aw",
    "iso3": "ABW",
    "isoNumeric": "533",
    "coords": [
      12.5211,
      -69.9683
    ],
    "population": 107000,
    "areaKm2": 180,
    "curiosity": "Isla de las Antillas Menores caracterizada por su clima árido, formaciones de árboles dividivi y playas de arena blanca."
  },
  {
    "id": "cw",
    "name": "Curazao",
    "capital": "Willemstad",
    "continent": "América",
    "iso2": "cw",
    "iso3": "CUW",
    "isoNumeric": "531",
    "coords": [
      12.1696,
      -68.99
    ],
    "population": 152000,
    "areaKm2": 444,
    "curiosity": "Isla caribeña distinguida por los coloridos frentes holandeses de Handelskade en Willemstad y sus arrecifes de coral."
  },
  {
    "id": "sx",
    "name": "Sint Maarten",
    "capital": "Philipsburg",
    "continent": "América",
    "iso2": "sx",
    "iso3": "SXM",
    "isoNumeric": "534",
    "coords": [
      18.0425,
      -63.0548
    ],
    "population": 42000,
    "areaKm2": 34,
    "curiosity": "Territorio autónomo neerlandés en la mitad sur de la isla caribeña, conocida por la icónica playa de Maho."
  },
  {
    "id": "mf",
    "name": "San Martín",
    "capital": "Marigot",
    "continent": "América",
    "iso2": "mf",
    "iso3": "MAF",
    "isoNumeric": "663",
    "coords": [
      18.0708,
      -63.0501
    ],
    "population": 32000,
    "areaKm2": 53,
    "curiosity": "Colectividad de ultramar francesa que ocupa la vertiente norte de la isla de San Martín en las Antillas Menores."
  },
  {
    "id": "bl",
    "name": "San Bartolomé",
    "capital": "Gustavia",
    "continent": "América",
    "iso2": "bl",
    "iso3": "BLM",
    "isoNumeric": "652",
    "coords": [
      17.9,
      -62.8333
    ],
    "population": 10000,
    "areaKm2": 25,
    "curiosity": "Isla antillana francesa que perteneció a Suecia durante más de un siglo, origen del nombre de su capital Gustavia."
  },
  {
    "id": "bq",
    "name": "Bonaire",
    "capital": "Kralendijk",
    "continent": "América",
    "iso2": "bq",
    "iso3": "BES",
    "isoNumeric": "535",
    "coords": [
      12.2019,
      -68.2624
    ],
    "population": 22000,
    "areaKm2": 288,
    "curiosity": "Municipio especial neerlandés célebre por su parque marino protegido y las salinas rosadas pobladas de flamencos."
  },
  {
    "id": "gp",
    "name": "Guadalupe",
    "capital": "Basse-Terre",
    "continent": "América",
    "iso2": "gp",
    "iso3": "GLP",
    "isoNumeric": "312",
    "coords": [
      16.265,
      -61.551
    ],
    "population": 384000,
    "areaKm2": 1628,
    "curiosity": "Archipiélago francés con forma de alas de mariposa dividido por el río Salée entre Basse-Terre y Grande-Terre."
  },
  {
    "id": "mq",
    "name": "Martinica",
    "capital": "Fort-de-France",
    "continent": "América",
    "iso2": "mq",
    "iso3": "MTQ",
    "isoNumeric": "474",
    "coords": [
      14.6415,
      -61.0242
    ],
    "population": 360000,
    "areaKm2": 1128,
    "curiosity": "Isla caribeña francesa coronada por el volcán activo del monte Pelée y rodeada por densas selvas tropicales."
  },
  {
    "id": "gf",
    "name": "Guayana Francesa",
    "capital": "Cayena",
    "continent": "América",
    "iso2": "gf",
    "iso3": "GUF",
    "isoNumeric": "254",
    "coords": [
      3.9339,
      -53.1258
    ],
    "population": 301000,
    "areaKm2": 83534,
    "curiosity": "Región ultraperiférica de la Unión Europea en la Amazonia donde se encuentra el puerto espacial de Kourou."
  },
  {
    "id": "pm",
    "name": "San Pedro y Miquelón",
    "capital": "Saint-Pierre",
    "continent": "América",
    "iso2": "pm",
    "iso3": "SPM",
    "isoNumeric": "666",
    "coords": [
      46.8852,
      -56.3159
    ],
    "population": 5900,
    "areaKm2": 242,
    "curiosity": "Colectividad francesa al sur de la isla canadiense de Terranova, último vestigio territorial del virreinato de Nueva Francia."
  },
  {
    "id": "gl",
    "name": "Groenlandia",
    "capital": "Nuuk",
    "continent": "América",
    "iso2": "gl",
    "iso3": "GRL",
    "isoNumeric": "304",
    "coords": [
      71.7069,
      -42.6043
    ],
    "population": 56600,
    "areaKm2": 2166086,
    "curiosity": "La mayor isla del planeta fuera del rango continental, cubierta por un inmenso casquete de hielo perenne de hasta 3.000 metros de espesor."
  },
  {
    "id": "fk",
    "name": "Islas Malvinas",
    "capital": "Puerto Argentino",
    "continent": "América",
    "iso2": "fk",
    "iso3": "FLK",
    "isoNumeric": "238",
    "coords": [
      -51.7963,
      -59.5236
    ],
    "population": 3600,
    "areaKm2": 12173,
    "curiosity": "Archipiélago del Atlántico Sur compuesto por Soledad y Gran Malvina, rodeado de ricas colonias marinas de pingüinos y lobos marinos."
  },
  {
    "id": "gs",
    "name": "Georgias del Sur y Sandwich del Sur",
    "capital": "King Edward Point",
    "continent": "América",
    "iso2": "gs",
    "iso3": "SGS",
    "isoNumeric": "239",
    "coords": [
      -54.2811,
      -36.5092
    ],
    "population": 35,
    "areaKm2": 3903,
    "curiosity": "Territorio subantártico de picos nevados y fiordos glaciares donde reposan los restos mortales del explorador polar Ernest Shackleton."
  },
  {
    "id": "gi",
    "name": "Gibraltar",
    "capital": "Gibraltar",
    "continent": "Europa",
    "iso2": "gi",
    "iso3": "GIB",
    "isoNumeric": "292",
    "coords": [
      36.1408,
      -5.3536
    ],
    "population": 34000,
    "areaKm2": 6.8,
    "curiosity": "Promontorio calcáreo que custodia el estrecho homónimo y alberga la única población de macacos en libertad de Europa continental."
  },
  {
    "id": "fo",
    "name": "Islas Feroe",
    "capital": "Tórshavn",
    "continent": "Europa",
    "iso2": "fo",
    "iso3": "FRO",
    "isoNumeric": "234",
    "coords": [
      61.8926,
      -6.9118
    ],
    "population": 54000,
    "areaKm2": 1393,
    "curiosity": "Dieciocho islas atlánticas de origen volcánico con sobrecogedores acantilados marinos e histórico autogobierno bajo la corona danesa."
  },
  {
    "id": "im",
    "name": "Isla de Man",
    "capital": "Douglas",
    "continent": "Europa",
    "iso2": "im",
    "iso3": "IMN",
    "isoNumeric": "833",
    "coords": [
      54.2361,
      -4.5481
    ],
    "population": 84000,
    "areaKm2": 572,
    "curiosity": "Dependencia de la Corona en el mar de Irlanda con el parlamento bicameral ininterrumpido más longevo de la historia (el Tynwald)."
  },
  {
    "id": "je",
    "name": "Jersey",
    "capital": "Saint Helier",
    "continent": "Europa",
    "iso2": "je",
    "iso3": "JEY",
    "isoNumeric": "832",
    "coords": [
      49.2144,
      -2.1312
    ],
    "population": 103000,
    "areaKm2": 119,
    "curiosity": "La mayor de las islas Anglonormandas, famosa por sus espectaculares mareas de más de doce metros de desnivel vertical."
  },
  {
    "id": "gg",
    "name": "Guernsey",
    "capital": "Saint Peter Port",
    "continent": "Europa",
    "iso2": "gg",
    "iso3": "GGY",
    "isoNumeric": "831",
    "coords": [
      49.4482,
      -2.5895
    ],
    "population": 64000,
    "areaKm2": 65,
    "curiosity": "Bailiazgo en el canal de la Mancha que incluye las islas menores de Sark, Alderney y Herm, donde residió desterrado Victor Hugo."
  },
  {
    "id": "ax",
    "name": "Islas Åland",
    "capital": "Mariehamn",
    "continent": "Europa",
    "iso2": "ax",
    "iso3": "ALA",
    "isoNumeric": "248",
    "coords": [
      60.1785,
      19.9156
    ],
    "population": 30000,
    "areaKm2": 1580,
    "curiosity": "Archipiélago desmilitarizado y de lengua sueca perteneciente a Finlandia en la entrada septentrional del mar Báltico."
  },
  {
    "id": "sj",
    "name": "Svalbard",
    "capital": "Longyearbyen",
    "continent": "Europa",
    "iso2": "sj",
    "iso3": "SJM",
    "isoNumeric": "744",
    "coords": [
      77.5536,
      23.6703
    ],
    "population": 2600,
    "areaKm2": 61022,
    "curiosity": "Archipiélago ártico noruego en el paralelo 78 norte donde se conserva el Banco Mundial de Semillas bajo la roca helada."
  },
  {
    "id": "gb-eng",
    "name": "Inglaterra",
    "capital": "Londres",
    "continent": "Europa",
    "iso2": "gb-eng",
    "iso3": "ENG",
    "isoNumeric": "901",
    "coords": [
      52.3555,
      -1.1743
    ],
    "population": 56500000,
    "areaKm2": 130279,
    "curiosity": "Nación constituyente meridional de Gran Bretaña que alberga la cuenca del Támesis, Stonehenge y los páramos de los Peninos."
  },
  {
    "id": "gb-sct",
    "name": "Escocia",
    "capital": "Edimburgo",
    "continent": "Europa",
    "iso2": "gb-sct",
    "iso3": "SCT",
    "isoNumeric": "902",
    "coords": [
      56.4907,
      -4.2026
    ],
    "population": 5460000,
    "areaKm2": 77933,
    "curiosity": "Tierras altas septentrionales con profundos lochs glaciares, casi ochocientas islas y el pico más alto de las islas británicas (Ben Nevis)."
  },
  {
    "id": "gb-wls",
    "name": "Gales",
    "capital": "Cardiff",
    "continent": "Europa",
    "iso2": "gb-wls",
    "iso3": "WLS",
    "isoNumeric": "903",
    "coords": [
      52.1307,
      -3.7837
    ],
    "population": 3107000,
    "areaKm2": 20779,
    "curiosity": "País constituyente céltico montañoso con su lengua vernácula viva (cymraeg) y la cordillera de Eryri (Snowdonia)."
  },
  {
    "id": "gb-nir",
    "name": "Irlanda del Norte",
    "capital": "Belfast",
    "continent": "Europa",
    "iso2": "gb-nir",
    "iso3": "NIR",
    "isoNumeric": "904",
    "coords": [
      54.7877,
      -6.4923
    ],
    "population": 1903000,
    "areaKm2": 14130,
    "curiosity": "Región en el noreste de la isla de Irlanda que acoge el lago Neagh y las cuarenta mil columnas basálticas de la Calzada del Gigante."
  },
  {
    "id": "xk",
    "name": "Kosovo",
    "capital": "Pristina",
    "continent": "Europa",
    "iso2": "xk",
    "iso3": "XKX",
    "isoNumeric": "983",
    "coords": [
      42.6026,
      20.903
    ],
    "population": 1800000,
    "areaKm2": 10887,
    "curiosity": "Territorio balcánico sin salida al mar rodeado por los montes Šar y los Alpes Dináricos en el sureste europeo."
  },
  {
    "id": "hk",
    "name": "Hong Kong",
    "capital": "Hong Kong",
    "continent": "Asia",
    "iso2": "hk",
    "iso3": "HKG",
    "isoNumeric": "344",
    "coords": [
      22.3193,
      114.1694
    ],
    "population": 7413000,
    "areaKm2": 1106,
    "curiosity": "Región administrativa especial en el delta del río de las Perlas con el puerto Victoria y una de las mayores densidades urbanas del mundo."
  },
  {
    "id": "mo",
    "name": "Macao",
    "capital": "Macao",
    "continent": "Asia",
    "iso2": "mo",
    "iso3": "MAC",
    "isoNumeric": "446",
    "coords": [
      22.1987,
      113.5439
    ],
    "population": 686000,
    "areaKm2": 32.9,
    "curiosity": "Península e islas en el sur de China que fue el primer y último enclave colonial europeo en Asia Oriental, administrado por Portugal hasta 1999."
  },
  {
    "id": "tw",
    "name": "Taiwán",
    "capital": "Taipéi",
    "continent": "Asia",
    "iso2": "tw",
    "iso3": "TWN",
    "isoNumeric": "158",
    "coords": [
      23.6978,
      120.9605
    ],
    "population": 23570000,
    "areaKm2": 36197,
    "curiosity": "Isla montañosa en el Pacífico occidental atravesada por el trópico de Cáncer, con picos de casi cuatro mil metros en Yu Shan."
  },
  {
    "id": "ps",
    "name": "Palestina",
    "capital": "Ramala / Jerusalén Este",
    "continent": "Asia",
    "iso2": "ps",
    "iso3": "PSE",
    "isoNumeric": "275",
    "coords": [
      31.9522,
      35.2332
    ],
    "population": 5227000,
    "areaKm2": 6020,
    "curiosity": "Tierra histórica del Levante mediterráneo constituida por Cisjordania y la Franja de Gaza, con milenios de patrimonio cultural."
  },
  {
    "id": "io",
    "name": "Territorio Británico del Océano Índico",
    "capital": "Diego García",
    "continent": "Asia",
    "iso2": "io",
    "iso3": "IOT",
    "isoNumeric": "086",
    "coords": [
      -6.3432,
      71.8765
    ],
    "population": 3000,
    "areaKm2": 60,
    "curiosity": "Archipiélago de Chagos formado por cincuenta y cinco islas coralinas en medio del océano Índico, centrado en el atolón de Diego García."
  },
  {
    "id": "cx",
    "name": "Isla de Navidad",
    "capital": "Flying Fish Cove",
    "continent": "Asia",
    "iso2": "cx",
    "iso3": "CXR",
    "isoNumeric": "162",
    "coords": [
      -10.4475,
      105.6904
    ],
    "population": 1800,
    "areaKm2": 135,
    "curiosity": "Territorio australiano en el Índico reconocido por la migración sincrónica de más de cuarenta millones de cangrejos rojos terrestres."
  },
  {
    "id": "cc",
    "name": "Islas Cocos",
    "capital": "West Island",
    "continent": "Asia",
    "iso2": "cc",
    "iso3": "CCK",
    "isoNumeric": "166",
    "coords": [
      -12.1642,
      96.871
    ],
    "population": 600,
    "areaKm2": 14,
    "curiosity": "Dos atolones coralinos con veintisiete islotes de palmeras cocoteras a mitad de camino entre Australia y Sri Lanka."
  },
  {
    "id": "eh",
    "name": "Sahara Occidental",
    "capital": "El Aaiún",
    "continent": "África",
    "iso2": "eh",
    "iso3": "ESH",
    "isoNumeric": "732",
    "coords": [
      24.2155,
      -12.8858
    ],
    "population": 597000,
    "areaKm2": 266000,
    "curiosity": "Territorio sahariano atlántico que alberga una de las mayores reservas mundiales de fosfatos y una costa virgen de más de mil kilómetros."
  },
  {
    "id": "re",
    "name": "Reunión",
    "capital": "Saint-Denis",
    "continent": "África",
    "iso2": "re",
    "iso3": "REU",
    "isoNumeric": "638",
    "coords": [
      -21.1151,
      55.5364
    ],
    "population": 870000,
    "areaKm2": 2511,
    "curiosity": "Isla volcánica en las Mascareñas al este de Madagascar con el Piton de la Fournaise, uno de los volcanes más activos del mundo."
  },
  {
    "id": "yt",
    "name": "Mayotte",
    "capital": "Mamoudzu",
    "continent": "África",
    "iso2": "yt",
    "iso3": "MYT",
    "isoNumeric": "175",
    "coords": [
      -12.8275,
      45.1662
    ],
    "population": 310000,
    "areaKm2": 374,
    "curiosity": "Departamento de ultramar francés en el canal de Mozambique rodeado por una doble barrera de arrecifes coralinos de excepcional biodiversidad."
  },
  {
    "id": "sh",
    "name": "Santa Elena, Ascensión y Tristán de Acuña",
    "capital": "Jamestown",
    "continent": "África",
    "iso2": "sh",
    "iso3": "SHN",
    "isoNumeric": "654",
    "coords": [
      -15.965,
      -5.7089
    ],
    "population": 5600,
    "areaKm2": 394,
    "curiosity": "Islas volcánicas remotas en la dorsal mesoatlántica del hemisferio sur; en Santa Elena falleció Napoleón Bonaparte en 1821."
  },
  {
    "id": "nc",
    "name": "Nueva Caledonia",
    "capital": "Numea",
    "continent": "Oceanía",
    "iso2": "nc",
    "iso3": "NCL",
    "isoNumeric": "540",
    "coords": [
      -20.9043,
      165.618
    ],
    "population": 271000,
    "areaKm2": 18575,
    "curiosity": "Archipiélago melanesio con la laguna coralina más extensa de la Tierra y extraordinarios bosques prehistóricos de araucarias."
  },
  {
    "id": "pf",
    "name": "Polinesia Francesa",
    "capital": "Papeete",
    "continent": "Oceanía",
    "iso2": "pf",
    "iso3": "PYF",
    "isoNumeric": "258",
    "coords": [
      -17.6797,
      -149.4068
    ],
    "population": 280000,
    "areaKm2": 4167,
    "curiosity": "Ciento dieciocho islas dispersas en un área oceánica del tamaño de Europa occidental que incluye Tahití, Moorea y Bora Bora."
  },
  {
    "id": "wf",
    "name": "Wallis y Futuna",
    "capital": "Mata-Utu",
    "continent": "Oceanía",
    "iso2": "wf",
    "iso3": "WLF",
    "isoNumeric": "876",
    "coords": [
      -13.7687,
      -177.1561
    ],
    "population": 11500,
    "areaKm2": 142,
    "curiosity": "Tres islas volcánicas polinesias que conservan tres reinos tradicionales reconocidos en el marco institucional francés."
  },
  {
    "id": "gu",
    "name": "Guam",
    "capital": "Hagåtña",
    "continent": "Oceanía",
    "iso2": "gu",
    "iso3": "GUM",
    "isoNumeric": "316",
    "coords": [
      13.4443,
      144.7937
    ],
    "population": 153000,
    "areaKm2": 549,
    "curiosity": "La mayor y más meridional isla de las Marianas, nexo histórico del Galeón de Manila entre Acapulco y Filipinas durante casi tres siglos."
  },
  {
    "id": "mp",
    "name": "Islas Marianas del Norte",
    "capital": "Saipán",
    "continent": "Oceanía",
    "iso2": "mp",
    "iso3": "MNP",
    "isoNumeric": "580",
    "coords": [
      15.0979,
      145.6739
    ],
    "population": 47000,
    "areaKm2": 464,
    "curiosity": "Cadena de catorce islas volcánicas que discurre en paralelo a la fosa oceánica de las Marianas en el Pacífico noroccidental."
  },
  {
    "id": "as",
    "name": "Samoa Americana",
    "capital": "Pago Pago",
    "continent": "Oceanía",
    "iso2": "as",
    "iso3": "ASM",
    "isoNumeric": "016",
    "coords": [
      -14.271,
      -170.1322
    ],
    "population": 49700,
    "areaKm2": 199,
    "curiosity": "Territorio polinesio estadounidense compuesto por Tutuila y las islas Manu'a, con el Parque Nacional de Samoa Americana."
  },
  {
    "id": "ck",
    "name": "Islas Cook",
    "capital": "Avarua",
    "continent": "Oceanía",
    "iso2": "ck",
    "iso3": "COK",
    "isoNumeric": "184",
    "coords": [
      -21.2367,
      -159.7777
    ],
    "population": 17500,
    "areaKm2": 236,
    "curiosity": "Quince islas en el Pacífico Sur en libre asociación con Nueva Zelanda, con la cristalina laguna de Aitutaki como icono natural."
  },
  {
    "id": "nu",
    "name": "Niue",
    "capital": "Alofi",
    "continent": "Oceanía",
    "iso2": "nu",
    "iso3": "NIU",
    "isoNumeric": "570",
    "coords": [
      -19.0544,
      -169.8672
    ],
    "population": 1900,
    "areaKm2": 260,
    "curiosity": "El atolón coralino emergido más grande del mundo, apodado 'la Roca de Polinesia' por sus impresionantes simas y cavernas costeras."
  },
  {
    "id": "tk",
    "name": "Tokelau",
    "capital": "sin capital fija",
    "continent": "Oceanía",
    "iso2": "tk",
    "iso3": "TKL",
    "isoNumeric": "772",
    "coords": [
      -9.2002,
      -171.8484
    ],
    "population": 1500,
    "areaKm2": 12,
    "curiosity": "Tres atolones aislados en el Pacífico Sur que se convirtieron en el primer territorio mundial 100% abastecido por energía solar."
  },
  {
    "id": "pn",
    "name": "Islas Pitcairn",
    "capital": "Adamstown",
    "continent": "Oceanía",
    "iso2": "pn",
    "iso3": "PCN",
    "isoNumeric": "612",
    "coords": [
      -24.7036,
      -127.4393
    ],
    "population": 50,
    "areaKm2": 47,
    "curiosity": "El territorio con menor población permanente del mundo, poblado en 1790 por los marineros amotinados del barco HMS Bounty."
  },
  {
    "id": "nf",
    "name": "Isla Norfolk",
    "capital": "Kingston",
    "continent": "Oceanía",
    "iso2": "nf",
    "iso3": "NFK",
    "isoNumeric": "574",
    "coords": [
      -29.0408,
      167.9547
    ],
    "population": 2180,
    "areaKm2": 36,
    "curiosity": "Isla volcánica entre Australia y Nueva Zelanda caracterizada por sus gigantescos pinos de Norfolk y su dialecto norfuk."
  },
  {
    "id": "es-ce",
    "name": "Ceuta",
    "officialName": "Ciudad Autónoma de Ceuta",
    "capital": "Ceuta",
    "continent": "África",
    "iso2": "es",
    "iso3": "ESP",
    "isoNumeric": "724",
    "coords": [
      35.8894,
      -5.3213
    ],
    "population": 83117,
    "areaKm2": 19,
    "curiosity": "Ciudad autónoma española situada en la orilla africana del estrecho de Gibraltar. Posee las emblemáticas Murallas Reales y el monte Hacho, considerado tradicionalmente una de las míticas Columnas de Hércules.",
    "flagUrl": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'><rect width='300' height='200' fill='%23000000'/><polygon points='150,100 0,0 150,0' fill='%23ffffff'/><polygon points='150,100 300,0 300,100' fill='%23ffffff'/><polygon points='150,100 300,200 150,200' fill='%23ffffff'/><polygon points='150,100 0,200 0,100' fill='%23ffffff'/><g transform='translate(150, 100)'><path d='M-22,-30 h44 v36 a22,22 0 0,1 -44,0 z' fill='%23ffffff' stroke='%23c00000' stroke-width='4'/><path d='M-18,-26 h36 v32 a18,18 0 0,1 -36,0 z' fill='%23ffffff'/><rect x='-14' y='-20' width='8' height='10' rx='3' fill='%230038a8'/><rect x='6' y='-20' width='8' height='10' rx='3' fill='%230038a8'/><rect x='-4' y='-12' width='8' height='10' rx='3' fill='%230038a8'/><rect x='-14' y='-4' width='8' height='10' rx='3' fill='%230038a8'/><rect x='6' y='-4' width='8' height='10' rx='3' fill='%230038a8'/><path d='M-20,-30 l4,-8 l8,5 l8,-7 l8,5 l8,-7 l4,8 z' fill='%23f1bf00' stroke='%23997000' stroke-width='1'/></g></svg>"
  },
  {
    "id": "es-ml",
    "name": "Melilla",
    "officialName": "Ciudad Autónoma de Melilla",
    "capital": "Melilla",
    "continent": "África",
    "iso2": "es",
    "iso3": "ESP",
    "isoNumeric": "724",
    "coords": [
      35.2923,
      -2.9381
    ],
    "population": 85170,
    "areaKm2": 12,
    "curiosity": "Ciudad autónoma española en el litoral septentrional de África, en el cabo de Tres Forcas. Su ciudadela amurallada Melilla La Vieja y su ensanche modernista la convierten en una de las joyas arquitectónicas del norte de África.",
    "flagUrl": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'><rect width='300' height='200' fill='%232980b9'/><g transform='translate(150, 100)'><path d='M-24,-30 h48 v38 a24,24 0 0,1 -48,0 z' fill='%231b4f72' stroke='%23f1c40f' stroke-width='3'/><path d='M-20,-26 h40 v34 a20,20 0 0,1 -40,0 z' fill='%23fdfefe'/><rect x='-14' y='-20' width='28' height='14' rx='3' fill='%23d4ac0d' stroke='%23900c3f' stroke-width='1.5'/><rect x='-14' y='2' width='28' height='14' rx='3' fill='%23d4ac0d' stroke='%23900c3f' stroke-width='1.5'/><path d='M-24,-30 l5,-10 l9,6 l10,-8 l10,6 l9,-6 l5,10 z' fill='%23f1c40f' stroke='%23b7950b' stroke-width='1.2'/><circle cx='0' cy='-44' r='5' fill='%23f1c40f'/><path d='M-40,24 q40,20 80,0' fill='none' stroke='%23fdfefe' stroke-width='3'/></g></svg>"
  },
  {
    "id": "so-sl",
    "name": "Somalilandia",
    "officialName": "República de Somalilandia",
    "capital": "Hargeisa",
    "continent": "África",
    "iso2": "so",
    "iso3": "SOM",
    "isoNumeric": "706",
    "coords": [
      9.56,
      44.06
    ],
    "population": 5700000,
    "areaKm2": 176120,
    "curiosity": "Estado con autogobierno independiente de facto en el Cuerno de África desde 1991. Alberga las extraordinarias pinturas rupestres neolíticas de Laas Geel y mantiene su propio sistema democrático, moneda y fuerzas de seguridad.",
    "flagUrl": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 150'><rect width='300' height='50' fill='%23006600'/><rect y='50' width='300' height='50' fill='%23ffffff'/><rect y='100' width='300' height='50' fill='%23cc0000'/><polygon points='150,57 155,71 169,71 158,80 162,94 150,85 138,94 142,80 131,71 145,71' fill='%23000000'/><g fill='%23ffffff' transform='translate(150, 32)'><text text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='16' letter-spacing='2'>لَا إِلٰهَ إِلَّا الله</text></g></svg>"
  },
  {
    "id": "cy-nc",
    "name": "República Turca del Norte de Chipre",
    "officialName": "República Turca del Norte de Chipre",
    "capital": "Nicosia Norte / Lefkoşa",
    "continent": "Asia",
    "iso2": "cy",
    "iso3": "CYP",
    "isoNumeric": "196",
    "coords": [
      35.20,
      33.38
    ],
    "population": 382836,
    "areaKm2": 3355,
    "curiosity": "Territorio situado en el tercio septentrional de la isla de Chipre en el Mediterráneo oriental, separado de la República de Chipre por la Línea Verde de la ONU. Su capital compartida, Nicosia Norte (Lefkoşa), alberga la mezquita Selimiye y el histórico caravasar Büyük Han.",
    "flagUrl": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'><rect width='300' height='200' fill='%23ffffff'/><rect y='20' width='300' height='20' fill='%23e30a17'/><rect y='160' width='300' height='20' fill='%23e30a17'/><g transform='translate(135, 100)'><circle cx='0' cy='0' r='40' fill='%23e30a17'/><circle cx='10' cy='0' r='32' fill='%23ffffff'/><polygon points='28,-14 33,2 47,2 35,11 39,26 28,17 17,26 21,11 9,2 23,2' fill='%23e30a17'/></g></svg>"
  }
];

export const COUNTRIES: Country[] = rawCountries.map(c => ({
  ...c,
  subregion: COUNTRY_SUBREGION_MAP[c.id] || 'África Central',
}));

export const COUNTRIES_BY_CONTINENT = {
  'África': COUNTRIES.filter(c => c.continent === 'África'),
  'América': COUNTRIES.filter(c => c.continent === 'América'),
  'Asia': COUNTRIES.filter(c => c.continent === 'Asia'),
  'Europa': COUNTRIES.filter(c => c.continent === 'Europa'),
  'Oceanía': COUNTRIES.filter(c => c.continent === 'Oceanía'),
  'Antártida': [] as Country[]
};

export const TOTAL_COUNTRIES_COUNT = COUNTRIES.length;

export function getCountryById(id: string): Country | undefined {
  const normalized = id.toLowerCase();
  return COUNTRIES.find(c => c.id.toLowerCase() === normalized || c.iso2.toLowerCase() === normalized || c.iso3.toLowerCase() === normalized);
}

export function getCountryByIsoNumeric(numeric: string): Country | undefined {
  const norm = numeric.padStart(3, '0');
  return COUNTRIES.find(c => c.isoNumeric === norm || c.isoNumeric === numeric);
}
