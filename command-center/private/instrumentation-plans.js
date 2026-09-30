
/* Metari environment-specific concept blueprints.
 * All dimensions, placements and spec values are design assumptions, not surveys.
 * Edit this data file to adapt a verified site plan after engineering review. */
(function(root){
 const plans = {
  "guest": {
    "id": "guest",
    "prefix": "GR",
    "width": 8,
    "depth": 6,
    "description": "A king-bed training suite with a partitioned bath, luggage area and service threshold.",
    "fixtures": [
      {
        "kind": "bed",
        "name": "King bed",
        "x": 1,
        "y": 1,
        "w": 2.3,
        "h": 2.7,
        "solid": false
      },
      {
        "kind": "table",
        "name": "Nightstand",
        "x": 0.4,
        "y": 1,
        "w": 0.45,
        "h": 0.6,
        "solid": false
      },
      {
        "kind": "table",
        "name": "Nightstand",
        "x": 3.45,
        "y": 1,
        "w": 0.5,
        "h": 0.6,
        "solid": false
      },
      {
        "kind": "desk",
        "name": "Desk",
        "x": 4.5,
        "y": 0.4,
        "w": 1.5,
        "h": 0.55,
        "solid": false
      },
      {
        "kind": "chair",
        "name": "Chair",
        "x": 4.9,
        "y": 1.05,
        "w": 0.5,
        "h": 0.6,
        "solid": false
      },
      {
        "kind": "sofa",
        "name": "Seating",
        "x": 4.9,
        "y": 2.1,
        "w": 1.4,
        "h": 0.8,
        "solid": false
      },
      {
        "kind": "rack",
        "name": "Luggage",
        "x": 0.45,
        "y": 4.6,
        "w": 1.3,
        "h": 0.65,
        "solid": false
      },
      {
        "kind": "cart",
        "name": "Service cart",
        "x": 6.4,
        "y": 4.6,
        "w": 0.65,
        "h": 0.9,
        "solid": false
      },
      {
        "kind": "shower",
        "name": "Shower",
        "x": 6.8,
        "y": 0.15,
        "w": 1.05,
        "h": 1.2,
        "solid": false
      },
      {
        "kind": "vanity",
        "name": "Vanity",
        "x": 6.75,
        "y": 2.1,
        "w": 1.05,
        "h": 0.55,
        "solid": false
      }
    ],
    "zones": [
      {
        "name": "Bed turnover",
        "x": 0.6,
        "y": 0.7,
        "w": 3.6,
        "h": 3.4,
        "reset": "Detach alternating fitted-sheet corners; rotate the duvet 90 degrees. Reset bedding after every repetition.",
        "hazard": false,
        "id": "GR-Z1",
        "seed": 23
      },
      {
        "name": "Desk / luggage",
        "x": 4.2,
        "y": 0.3,
        "w": 1.8,
        "h": 3.2,
        "reset": "Move a light suitcase between three marked positions. Keep the approved walking route clear.",
        "hazard": false,
        "id": "GR-Z2",
        "seed": 42
      },
      {
        "name": "Linen staging",
        "x": 0.4,
        "y": 4.4,
        "w": 1.7,
        "h": 1,
        "reset": "Place two staged towels in the cart and vary towel texture.",
        "hazard": false,
        "id": "GR-Z3",
        "seed": 61
      },
      {
        "name": "Entry / bath transition",
        "x": 6.2,
        "y": 3.1,
        "w": 1.5,
        "h": 2.6,
        "reset": "Vary the service-cart angle at the threshold. Do not enter the private-use bath.",
        "hazard": false,
        "id": "GR-Z4",
        "seed": 80
      }
    ],
    "cameras": [
      {
        "name": "Entry / inward overview",
        "x": 7.6,
        "y": 5.6,
        "bearing": 220,
        "fov": 88,
        "range": 8,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "GR-C1",
        "zoneId": "GR-Z1"
      },
      {
        "name": "Bed-wide context",
        "x": 0.3,
        "y": 5.5,
        "bearing": 311,
        "fov": 75,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "GR-C2",
        "zoneId": "GR-Z2"
      },
      {
        "name": "Bed-side turnover",
        "x": 4.4,
        "y": 0.3,
        "bearing": 120,
        "fov": 72,
        "range": 5,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "GR-C3",
        "zoneId": "GR-Z3"
      },
      {
        "name": "Desk & luggage",
        "x": 5.9,
        "y": 3.6,
        "bearing": 250,
        "fov": 75,
        "range": 4,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "GR-C4",
        "zoneId": "GR-Z4"
      },
      {
        "name": "Bath transition only",
        "x": 6.3,
        "y": 5.7,
        "bearing": 270,
        "fov": 50,
        "range": 3,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "GR-C5",
        "zoneId": "GR-Z4"
      },
      {
        "name": "Service threshold",
        "x": 7.7,
        "y": 3.6,
        "bearing": 124,
        "fov": 70,
        "range": 3.5,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "GR-C6",
        "zoneId": "GR-Z4"
      }
    ],
    "walls": [
      [
        6.5,
        0,
        6.5,
        3.1
      ],
      [
        6.5,
        3.1,
        6.65,
        3.1
      ],
      [
        7.5,
        3.1,
        8,
        3.1
      ]
    ],
    "doors": [
      {
        "x": 7,
        "y": 6,
        "w": 0.9,
        "side": "bottom"
      },
      {
        "x": 6.65,
        "y": 3.1,
        "w": 0.85,
        "side": "inner"
      }
    ],
    "sensors": [
      {
        "name": "Entry contact",
        "kind": "Door state",
        "x": 7.4,
        "y": 5.9,
        "id": "GR-S1"
      },
      {
        "name": "Bed-zone depth",
        "kind": "Depth",
        "x": 3.85,
        "y": 2.3,
        "id": "GR-S2"
      },
      {
        "name": "Light / temperature",
        "kind": "Environment",
        "x": 0.3,
        "y": 2.7,
        "id": "GR-S3"
      }
    ],
    "path": [
      [
        7.3,
        5.5
      ],
      [
        5.7,
        4.1
      ],
      [
        3.9,
        4.1
      ],
      [
        3.8,
        2.8
      ],
      [
        3.9,
        4.1
      ],
      [
        1.5,
        4.1
      ],
      [
        1.5,
        5.2
      ],
      [
        6.3,
        5.4
      ]
    ],
    "privacy": "Dedicated unoccupied research suite. Bath-use area is excluded from room cameras; the separate bathroom set requires explicit approval. No actual guests.",
    "notes": "The bed is a low fixture; the bath partition blocks 2D rays. The bathroom doorway camera covers the transition only.",
    "exclusions": [
      {
        "x": 6.5,
        "y": 0,
        "w": 1.5,
        "h": 3.1,
        "name": "Bath-use privacy mask"
      }
    ]
  },
  "bathroom": {
    "id": "bathroom",
    "prefix": "BA",
    "width": 5,
    "depth": 4.5,
    "description": "A purpose-built test bathroom, with separated vanity, shower and surface-cleaning stations.",
    "fixtures": [
      {
        "kind": "vanity",
        "name": "Double vanity",
        "x": 0.4,
        "y": 0.2,
        "w": 2.3,
        "h": 0.65,
        "solid": false
      },
      {
        "kind": "wc",
        "name": "Toilet prop",
        "x": 3.7,
        "y": 2.7,
        "w": 0.7,
        "h": 1,
        "solid": false
      },
      {
        "kind": "shower",
        "name": "Shower glass",
        "x": 3.1,
        "y": 0.15,
        "w": 1.75,
        "h": 1.65,
        "solid": false
      },
      {
        "kind": "rack",
        "name": "Towel shelf",
        "x": 0.2,
        "y": 2.6,
        "w": 0.65,
        "h": 1.15,
        "solid": true
      }
    ],
    "zones": [
      {
        "name": "Vanity / mirror",
        "x": 0.4,
        "y": 0.3,
        "w": 2.3,
        "h": 1.4,
        "reset": "Vary towel position and inert bottle occlusion at the vanity. Keep the mirror free of personal information.",
        "hazard": false,
        "id": "BA-Z1",
        "seed": 44
      },
      {
        "name": "Shower glass",
        "x": 3.1,
        "y": 0.2,
        "w": 1.7,
        "h": 1.5,
        "reset": "Stage dry reflective glass and removable marks. Use an approved inert cleaning prop.",
        "hazard": false,
        "id": "BA-Z2",
        "seed": 63
      },
      {
        "name": "Toilet test zone",
        "x": 3.35,
        "y": 2.3,
        "w": 1.45,
        "h": 1.6,
        "reset": "Use an unused toilet prop only. Record cleaning motions, never personal use.",
        "hazard": false,
        "id": "BA-Z3",
        "seed": 82
      },
      {
        "name": "Towel staging",
        "x": 0.85,
        "y": 2.7,
        "w": 1.4,
        "h": 1.4,
        "reset": "Place one towel beneath the vanity and alternate folds before each take.",
        "hazard": false,
        "id": "BA-Z4",
        "seed": 31
      }
    ],
    "cameras": [
      {
        "name": "Doorway context",
        "x": 2.4,
        "y": 4.2,
        "bearing": 270,
        "fov": 90,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "BA-C1",
        "zoneId": "BA-Z4"
      },
      {
        "name": "Vanity approach",
        "x": 0.3,
        "y": 1.8,
        "bearing": 320,
        "fov": 83,
        "range": 3,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "BA-C2",
        "zoneId": "BA-Z1"
      },
      {
        "name": "Shower interior / glass approach",
        "x": 4.65,
        "y": 0.28,
        "bearing": 130,
        "fov": 76,
        "range": 3.0,
        "mount": "Test-enclosure ceiling corner",
        "height": 2.55,
        "mode": "sector",
        "enabled": true,
        "id": "BA-C3",
        "zoneId": "BA-Z2"
      },
      {
        "name": "Toilet prop zone",
        "x": 4.7,
        "y": 4.2,
        "bearing": 255,
        "fov": 65,
        "range": 2.9,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "BA-C4",
        "zoneId": "BA-Z3"
      },
      {
        "name": "Upper-wide test set",
        "x": 2.1,
        "y": 2.2,
        "bearing": 0,
        "fov": 90,
        "range": 2.1,
        "mount": "Overhead task station",
        "height": 2.7,
        "mode": "overhead",
        "enabled": true,
        "id": "BA-C5",
        "zoneId": "BA-Z4"
      }
    ],
    "walls": [
      [
        3,
        0,
        3,
        1.8
      ]
    ],
    "doors": [
      {
        "x": 2,
        "y": 4.5,
        "w": 0.9,
        "side": "bottom"
      }
    ],
    "sensors": [
      {
        "name": "Humidity",
        "kind": "Environment",
        "x": 0.2,
        "y": 1.3,
        "id": "BA-S1"
      },
      {
        "name": "Water-event prop",
        "kind": "Water state",
        "x": 3.8,
        "y": 1.8,
        "id": "BA-S2"
      },
      {
        "name": "Surface geometry",
        "kind": "Depth",
        "x": 2.8,
        "y": 2.3,
        "id": "BA-S3"
      }
    ],
    "path": [
      [
        2.4,
        4.2
      ],
      [
        2.3,
        2.2
      ],
      [
        1.7,
        1.5
      ],
      [
        2.3,
        2.2
      ],
      [
        3.5,
        2
      ],
      [
        3.5,
        3.4
      ],
      [
        2.2,
        3.6
      ]
    ],
    "privacy": "Dedicated test bathroom only. Default capture gate closed until approval. No real bathing, dressing, toilet use or guests. Audio off.",
    "notes": "Concept plan only. Camera markers are not connected devices. Mint dots are sampled 2D sightlines, not a measured point cloud. Glass, reflections, vertical optics and lens calibration require field validation.",
    "exclusions": []
  },
  "kitchen": {
    "id": "kitchen",
    "prefix": "KT",
    "width": 10,
    "depth": 7,
    "description": "Commercial prep, cold handoff, cooking-line and wash zones separated by service aisles.",
    "fixtures": [
      {
        "kind": "hob",
        "name": "Cooking line",
        "x": 0.7,
        "y": 0.25,
        "w": 4,
        "h": 0.9,
        "solid": false
      },
      {
        "kind": "prep",
        "name": "Prep island",
        "x": 2.2,
        "y": 2.4,
        "w": 2.8,
        "h": 1.15,
        "solid": false
      },
      {
        "kind": "counter",
        "name": "Handoff pass",
        "x": 7.5,
        "y": 1.8,
        "w": 0.9,
        "h": 3.3,
        "solid": false
      },
      {
        "kind": "vanity",
        "name": "Wash-up",
        "x": 0.3,
        "y": 4.7,
        "w": 1.1,
        "h": 1.8,
        "solid": false
      },
      {
        "kind": "rack",
        "name": "Cold storage",
        "x": 8.8,
        "y": 0.35,
        "w": 0.8,
        "h": 1.3,
        "solid": true
      },
      {
        "kind": "cart",
        "name": "Tray cart",
        "x": 6.1,
        "y": 5.4,
        "w": 0.8,
        "h": 1,
        "solid": false
      }
    ],
    "zones": [
      {
        "name": "Prep / plating",
        "x": 1.8,
        "y": 1.9,
        "w": 3.7,
        "h": 2.2,
        "reset": "Offset the empty plate by 15 cm. Alternate left and right approach with inert ingredients.",
        "hazard": false,
        "id": "KT-Z1",
        "seed": 37
      },
      {
        "name": "Cold handoff",
        "x": 6.5,
        "y": 1.5,
        "w": 2.4,
        "h": 3.8,
        "reset": "A trained colleague approaches the pass from alternating sides with a cold tray.",
        "hazard": false,
        "id": "KT-Z2",
        "seed": 56
      },
      {
        "name": "Cooking-line boundary",
        "x": 0.5,
        "y": 0.15,
        "w": 4.5,
        "h": 1.55,
        "reset": "Use cold, isolated appliances in the demo. Keep the human-only boundary visible.",
        "hazard": true,
        "id": "KT-Z3",
        "seed": 75
      },
      {
        "name": "Wash / clearing",
        "x": 0.2,
        "y": 4.45,
        "w": 1.6,
        "h": 2.3,
        "reset": "Stage dry utensils and clear one tray into the wash station.",
        "hazard": false,
        "id": "KT-Z4",
        "seed": 24
      },
      {
        "name": "Traffic crossing",
        "x": 5.4,
        "y": 4.8,
        "w": 2.6,
        "h": 1.7,
        "reset": "Move an empty service cart through the marked crossing; stop for the staged colleague.",
        "hazard": false,
        "id": "KT-Z5",
        "seed": 43
      }
    ],
    "cameras": [
      {
        "name": "Prep overhead",
        "x": 3.6,
        "y": 2.9,
        "bearing": 0,
        "fov": 90,
        "range": 2,
        "mount": "Overhead task station",
        "height": 2.7,
        "mode": "overhead",
        "enabled": true,
        "id": "KT-C1",
        "zoneId": "KT-Z1"
      },
      {
        "name": "Handoff eye-line",
        "x": 9.6,
        "y": 4.9,
        "bearing": 224,
        "fov": 83,
        "range": 5,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "KT-C2",
        "zoneId": "KT-Z2"
      },
      {
        "name": "Cooking-line overview",
        "x": 0.3,
        "y": 2,
        "bearing": 337,
        "fov": 85,
        "range": 5,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "KT-C3",
        "zoneId": "KT-Z3"
      },
      {
        "name": "Wash-up side view",
        "x": 2.6,
        "y": 6.6,
        "bearing": 230,
        "fov": 72,
        "range": 4,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "KT-C4",
        "zoneId": "KT-Z4"
      },
      {
        "name": "Service aisle",
        "x": 5.4,
        "y": 6.6,
        "bearing": 270,
        "fov": 76,
        "range": 7,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "KT-C5",
        "zoneId": "KT-Z5"
      },
      {
        "name": "Pass-through return",
        "x": 6.3,
        "y": 0.35,
        "bearing": 63,
        "fov": 75,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "KT-C6",
        "zoneId": "KT-Z5"
      }
    ],
    "walls": [],
    "doors": [
      {
        "x": 8.8,
        "y": 7,
        "w": 1.1,
        "side": "bottom"
      }
    ],
    "sensors": [
      {
        "name": "Pass geometry",
        "kind": "Depth",
        "x": 7,
        "y": 2.7,
        "id": "KT-S1"
      },
      {
        "name": "Tray check",
        "kind": "Load state",
        "x": 7.7,
        "y": 4.2,
        "id": "KT-S2"
      },
      {
        "name": "Hot-zone boundary",
        "kind": "Temperature",
        "x": 2.4,
        "y": 1.3,
        "id": "KT-S3"
      }
    ],
    "path": [
      [
        9.5,
        6.4
      ],
      [
        6.7,
        6.2
      ],
      [
        5.7,
        4.3
      ],
      [
        6.8,
        3.3
      ],
      [
        5.5,
        4.3
      ],
      [
        3.6,
        4.3
      ],
      [
        2,
        4.2
      ],
      [
        2,
        5.5
      ]
    ],
    "privacy": "Opt-in staged kitchen sessions. Inert food/props and isolated cooking equipment. No customer audio, faces or payment data.",
    "notes": "Heat labels describe a staged hazard boundary, not a verified thermal measurement. Appliance use requires a separate safety protocol.",
    "exclusions": []
  },
  "cafe": {
    "id": "cafe",
    "prefix": "CA",
    "width": 10,
    "depth": 7,
    "description": "Dining tables, beverage counter and a clearly separated service lane.",
    "fixtures": [
      {
        "kind": "counter",
        "name": "Service counter",
        "x": 0.4,
        "y": 0.3,
        "w": 3.2,
        "h": 0.7,
        "solid": false
      },
      {
        "kind": "roundTable",
        "name": "Table 1",
        "x": 2,
        "y": 2,
        "w": 1.6,
        "h": 1.6,
        "solid": false
      },
      {
        "kind": "roundTable",
        "name": "Table 2",
        "x": 5,
        "y": 2,
        "w": 1.6,
        "h": 1.6,
        "solid": false
      },
      {
        "kind": "table",
        "name": "Dining table",
        "x": 6.9,
        "y": 4.8,
        "w": 2.2,
        "h": 1.1,
        "solid": false
      },
      {
        "kind": "cart",
        "name": "Return cart",
        "x": 0.5,
        "y": 5.4,
        "w": 0.8,
        "h": 0.9,
        "solid": false
      }
    ],
    "zones": [
      {
        "name": "Beverage staging",
        "x": 0.4,
        "y": 0.4,
        "w": 3.4,
        "h": 1.5,
        "reset": "Place empty cups with handles rotated away. Use cold beverages only.",
        "hazard": false,
        "id": "CA-Z1",
        "seed": 86
      },
      {
        "name": "Table settings",
        "x": 1.5,
        "y": 1.5,
        "w": 2.6,
        "h": 2.6,
        "reset": "Alternate one and two place settings; shift a chair into the marked scenario position.",
        "hazard": false,
        "id": "CA-Z2",
        "seed": 35
      },
      {
        "name": "Table clearance",
        "x": 4.5,
        "y": 1.5,
        "w": 2.6,
        "h": 2.6,
        "reset": "Stage two inert dishes and a partially occupied tray.",
        "hazard": false,
        "id": "CA-Z3",
        "seed": 54
      },
      {
        "name": "Service return",
        "x": 0.4,
        "y": 4.5,
        "w": 2,
        "h": 2,
        "reset": "Return tableware props using the marked one-way service lane.",
        "hazard": false,
        "id": "CA-Z4",
        "seed": 73
      }
    ],
    "cameras": [
      {
        "name": "Entry context",
        "x": 9.6,
        "y": 6.6,
        "bearing": 219,
        "fov": 88,
        "range": 10,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "CA-C1",
        "zoneId": "CA-Z1"
      },
      {
        "name": "Counter service",
        "x": 3.9,
        "y": 0.25,
        "bearing": 148,
        "fov": 82,
        "range": 5,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "CA-C2",
        "zoneId": "CA-Z2"
      },
      {
        "name": "Table cluster A",
        "x": 0.3,
        "y": 2.5,
        "bearing": 10,
        "fov": 78,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "CA-C3",
        "zoneId": "CA-Z3"
      },
      {
        "name": "Table cluster B",
        "x": 9.6,
        "y": 2.3,
        "bearing": 165,
        "fov": 80,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "CA-C4",
        "zoneId": "CA-Z4"
      },
      {
        "name": "Service return lane",
        "x": 3.4,
        "y": 6.65,
        "bearing": 222,
        "fov": 75,
        "range": 4,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "CA-C5",
        "zoneId": "CA-Z4"
      }
    ],
    "walls": [],
    "doors": [
      {
        "x": 8.7,
        "y": 7,
        "w": 1,
        "side": "bottom"
      }
    ],
    "sensors": [
      {
        "name": "Dining geometry",
        "kind": "Depth",
        "x": 4.4,
        "y": 3.8,
        "id": "CA-S1"
      },
      {
        "name": "Light state",
        "kind": "Environment",
        "x": 8.9,
        "y": 0.3,
        "id": "CA-S2"
      }
    ],
    "path": [
      [
        9.5,
        6.3
      ],
      [
        5.7,
        4.5
      ],
      [
        4.2,
        3.7
      ],
      [
        4.2,
        1.5
      ],
      [
        2.5,
        1.5
      ],
      [
        1.2,
        1.8
      ],
      [
        1.2,
        4.4
      ],
      [
        1.8,
        5.8
      ]
    ],
    "privacy": "Closed research set; consented adult participants only. Audio off. No guest recording.",
    "notes": "Assumed plan geometry. A site survey, risk assessment and camera calibration are required before installation.",
    "exclusions": []
  },
  "banquet": {
    "id": "banquet",
    "prefix": "BQ",
    "width": 16,
    "depth": 10,
    "description": "A reconfigurable event hall with round tables, a stage and a service station.",
    "fixtures": [
      {
        "kind": "stage",
        "name": "Stage",
        "x": 5,
        "y": 0.3,
        "w": 6,
        "h": 1.4,
        "solid": false
      },
      {
        "kind": "roundTable",
        "name": "Table 1",
        "x": 2,
        "y": 3,
        "w": 2.1,
        "h": 2.1,
        "solid": false
      },
      {
        "kind": "roundTable",
        "name": "Table 2",
        "x": 7,
        "y": 3,
        "w": 2.1,
        "h": 2.1,
        "solid": false
      },
      {
        "kind": "roundTable",
        "name": "Table 3",
        "x": 12,
        "y": 3,
        "w": 2.1,
        "h": 2.1,
        "solid": false
      },
      {
        "kind": "roundTable",
        "name": "Table 4",
        "x": 4.5,
        "y": 6.2,
        "w": 2.1,
        "h": 2.1,
        "solid": false
      },
      {
        "kind": "roundTable",
        "name": "Table 5",
        "x": 9.5,
        "y": 6.2,
        "w": 2.1,
        "h": 2.1,
        "solid": false
      },
      {
        "kind": "counter",
        "name": "Service station",
        "x": 0.3,
        "y": 7.1,
        "w": 1.1,
        "h": 2.4,
        "solid": false
      },
      {
        "kind": "cart",
        "name": "Linen cart",
        "x": 14.5,
        "y": 7.8,
        "w": 0.8,
        "h": 1.2,
        "solid": false
      }
    ],
    "zones": [
      {
        "name": "Table cluster",
        "x": 1.8,
        "y": 2.8,
        "w": 3,
        "h": 3,
        "reset": "Reset six place settings and alternate napkin folds; photograph the initial state.",
        "hazard": false,
        "id": "BQ-Z1",
        "seed": 37
      },
      {
        "name": "Service station",
        "x": 0.3,
        "y": 6.7,
        "w": 2,
        "h": 2.9,
        "reset": "Stage linen and empty tableware props in two tray layouts.",
        "hazard": false,
        "id": "BQ-Z2",
        "seed": 56
      },
      {
        "name": "Room reset",
        "x": 7,
        "y": 5.8,
        "w": 5,
        "h": 3.4,
        "reset": "Move chairs between the marked classroom and banquet positions.",
        "hazard": false,
        "id": "BQ-Z3",
        "seed": 75
      },
      {
        "name": "Entry route",
        "x": 13.5,
        "y": 6.5,
        "w": 2,
        "h": 3,
        "reset": "Move an empty linen cart through the service entry and pause before crossing.",
        "hazard": false,
        "id": "BQ-Z4",
        "seed": 24
      }
    ],
    "cameras": [
      {
        "name": "Room-wide front",
        "x": 0.35,
        "y": 0.35,
        "bearing": 40,
        "fov": 87,
        "range": 17,
        "mount": "Perimeter ceiling",
        "height": 3.6,
        "mode": "sector",
        "enabled": true,
        "id": "BQ-C1",
        "zoneId": "BQ-Z1"
      },
      {
        "name": "Table-cluster overhead",
        "x": 3.2,
        "y": 4.3,
        "bearing": 0,
        "fov": 90,
        "range": 3.4,
        "mount": "Overhead task station",
        "height": 3.6,
        "mode": "overhead",
        "enabled": true,
        "id": "BQ-C2",
        "zoneId": "BQ-Z2"
      },
      {
        "name": "Service-station angle",
        "x": 2.8,
        "y": 9.6,
        "bearing": 245,
        "fov": 73,
        "range": 5,
        "mount": "Perimeter ceiling",
        "height": 3.2,
        "mode": "sector",
        "enabled": true,
        "id": "BQ-C3",
        "zoneId": "BQ-Z3"
      },
      {
        "name": "Cart-entry view",
        "x": 15.6,
        "y": 9.5,
        "bearing": 226,
        "fov": 76,
        "range": 7,
        "mount": "Perimeter ceiling",
        "height": 3.2,
        "mode": "sector",
        "enabled": true,
        "id": "BQ-C4",
        "zoneId": "BQ-Z4"
      },
      {
        "name": "Stage-return overview",
        "x": 12,
        "y": 0.35,
        "bearing": 118,
        "fov": 84,
        "range": 12,
        "mount": "Perimeter ceiling",
        "height": 3.6,
        "mode": "sector",
        "enabled": true,
        "id": "BQ-C5",
        "zoneId": "BQ-Z4"
      },
      {
        "name": "Rear circulation",
        "x": 7.5,
        "y": 9.65,
        "bearing": 268,
        "fov": 84,
        "range": 13,
        "mount": "Perimeter ceiling",
        "height": 3.6,
        "mode": "sector",
        "enabled": true,
        "id": "BQ-C6",
        "zoneId": "BQ-Z4"
      }
    ],
    "walls": [],
    "doors": [
      {
        "x": 14.4,
        "y": 10,
        "w": 1.2,
        "side": "bottom"
      }
    ],
    "sensors": [
      {
        "name": "Hall light state",
        "kind": "Environment",
        "x": 8,
        "y": 1.9,
        "id": "BQ-S1"
      },
      {
        "name": "Table geometry",
        "kind": "Depth",
        "x": 8,
        "y": 5.8,
        "id": "BQ-S2"
      },
      {
        "name": "Cart checkpoint",
        "kind": "Tag reader",
        "x": 14.5,
        "y": 8.8,
        "id": "BQ-S3"
      }
    ],
    "path": [
      [
        15,
        9
      ],
      [
        14.5,
        6.1
      ],
      [
        10.5,
        5.8
      ],
      [
        6.1,
        5.7
      ],
      [
        4.3,
        4.3
      ],
      [
        4.3,
        5.7
      ],
      [
        2,
        6.1
      ],
      [
        2,
        8.7
      ]
    ],
    "privacy": "Closed research set; consented adult participants only. Audio off. No guest recording.",
    "notes": "Assumed plan geometry. A site survey, risk assessment and camera calibration are required before installation.",
    "exclusions": []
  },
  "laundry": {
    "id": "laundry",
    "prefix": "LA",
    "width": 9,
    "depth": 6,
    "description": "Washer-transfer, linen sorting, overhead folding and shelf-stacking stations.",
    "fixtures": [
      {
        "kind": "washer",
        "name": "Washer",
        "x": 0.35,
        "y": 0.3,
        "w": 1.15,
        "h": 1.15,
        "solid": false
      },
      {
        "kind": "washer",
        "name": "Dryer",
        "x": 1.7,
        "y": 0.3,
        "w": 1.15,
        "h": 1.15,
        "solid": false
      },
      {
        "kind": "table",
        "name": "Folding bench",
        "x": 3,
        "y": 2.2,
        "w": 2.5,
        "h": 1.1,
        "solid": false
      },
      {
        "kind": "table",
        "name": "Sorting bench",
        "x": 0.5,
        "y": 3.4,
        "w": 1.6,
        "h": 1.25,
        "solid": false
      },
      {
        "kind": "rack",
        "name": "Linen shelves",
        "x": 7.6,
        "y": 0.4,
        "w": 1.05,
        "h": 2.6,
        "solid": true
      },
      {
        "kind": "cart",
        "name": "Clean cart",
        "x": 6,
        "y": 4.6,
        "w": 0.85,
        "h": 0.9,
        "solid": false
      },
      {
        "kind": "cart",
        "name": "Used linen",
        "x": 2.6,
        "y": 4.7,
        "w": 0.8,
        "h": 0.9,
        "solid": false
      }
    ],
    "zones": [
      {
        "name": "Folding station",
        "x": 2.7,
        "y": 1.9,
        "w": 3.2,
        "h": 2,
        "reset": "Rotate towel stacks and mix three sizes; preserve a visible task boundary.",
        "hazard": false,
        "id": "LA-Z1",
        "seed": 37
      },
      {
        "name": "Linen sorting",
        "x": 0.3,
        "y": 3,
        "w": 2.1,
        "h": 2,
        "reset": "Mix approved towel and pillowcase textures; stage one inside-out pillowcase.",
        "hazard": false,
        "id": "LA-Z2",
        "seed": 56
      },
      {
        "name": "Shelf placement",
        "x": 6.6,
        "y": 0.3,
        "w": 2.1,
        "h": 3.2,
        "reset": "Alternate low and middle shelf placements with light towels.",
        "hazard": false,
        "id": "LA-Z3",
        "seed": 75
      },
      {
        "name": "Washer transfer",
        "x": 0.3,
        "y": 0.3,
        "w": 3.1,
        "h": 1.8,
        "reset": "Use isolated empty appliances and dry linens. No powered cycle during a take.",
        "hazard": false,
        "id": "LA-Z4",
        "seed": 24
      },
      {
        "name": "Cart loading",
        "x": 5.6,
        "y": 4.1,
        "w": 1.7,
        "h": 1.5,
        "reset": "Load an empty cart, alternate stack orientation, then reset.",
        "hazard": false,
        "id": "LA-Z5",
        "seed": 43
      }
    ],
    "cameras": [
      {
        "name": "Folding overhead",
        "x": 4.25,
        "y": 2.75,
        "bearing": 0,
        "fov": 90,
        "range": 1.8,
        "mount": "Overhead task station",
        "height": 2.7,
        "mode": "overhead",
        "enabled": true,
        "id": "LA-C1",
        "zoneId": "LA-Z1"
      },
      {
        "name": "Sorting-side detail",
        "x": 0.25,
        "y": 5.65,
        "bearing": 302,
        "fov": 77,
        "range": 4,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "LA-C2",
        "zoneId": "LA-Z2"
      },
      {
        "name": "Shelf placement",
        "x": 6.2,
        "y": 3.8,
        "bearing": 304,
        "fov": 72,
        "range": 4.8,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "LA-C3",
        "zoneId": "LA-Z3"
      },
      {
        "name": "Washer-transfer context",
        "x": 3.6,
        "y": 0.3,
        "bearing": 144,
        "fov": 89,
        "range": 4,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "LA-C4",
        "zoneId": "LA-Z4"
      },
      {
        "name": "Cart loading",
        "x": 8.65,
        "y": 5.65,
        "bearing": 213,
        "fov": 83,
        "range": 4.7,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "LA-C5",
        "zoneId": "LA-Z5"
      },
      {
        "name": "Full-room context",
        "x": 8.6,
        "y": 0.3,
        "bearing": 145,
        "fov": 86,
        "range": 9,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "LA-C6",
        "zoneId": "LA-Z5"
      }
    ],
    "walls": [],
    "doors": [
      {
        "x": 4.8,
        "y": 6,
        "w": 1,
        "side": "bottom"
      }
    ],
    "sensors": [
      {
        "name": "Shelf depth",
        "kind": "Depth",
        "x": 6.9,
        "y": 1.8,
        "id": "LA-S1"
      },
      {
        "name": "Cart scale",
        "kind": "Load state",
        "x": 6,
        "y": 4.2,
        "id": "LA-S2"
      },
      {
        "name": "Room humidity",
        "kind": "Environment",
        "x": 0.3,
        "y": 2.4,
        "id": "LA-S3"
      }
    ],
    "path": [
      [
        5.7,
        5.5
      ],
      [
        5.9,
        3.9
      ],
      [
        4.2,
        3.8
      ],
      [
        2.7,
        3.5
      ],
      [
        2.1,
        2
      ],
      [
        1.8,
        1.8
      ],
      [
        3.4,
        1.7
      ],
      [
        6.4,
        1.7
      ],
      [
        6.4,
        3.8
      ],
      [
        6.4,
        4.2
      ]
    ],
    "privacy": "Closed research set; consented adult participants only. Audio off. No guest recording.",
    "notes": "Assumed plan geometry. A site survey, risk assessment and camera calibration are required before installation.",
    "exclusions": []
  },
  "corridor": {
    "id": "corridor",
    "prefix": "CO",
    "width": 14,
    "depth": 5,
    "description": "A long service corridor with a blind corner, recessed door and cart parking bays.",
    "fixtures": [
      {
        "kind": "cabinet",
        "name": "Store wall",
        "x": 0.2,
        "y": 0.15,
        "w": 8.7,
        "h": 1.3,
        "solid": true
      },
      {
        "kind": "cabinet",
        "name": "Service block",
        "x": 0.2,
        "y": 3.7,
        "w": 8.7,
        "h": 1.1,
        "solid": true
      },
      {
        "kind": "cart",
        "name": "Parked cart",
        "x": 6,
        "y": 2.8,
        "w": 0.8,
        "h": 0.6,
        "solid": false
      },
      {
        "kind": "cabinet",
        "name": "Corner wall",
        "x": 10.7,
        "y": 0.2,
        "w": 3.1,
        "h": 2.7,
        "solid": true
      }
    ],
    "zones": [
      {
        "name": "Long service run",
        "x": 1,
        "y": 1.65,
        "w": 7.5,
        "h": 1.7,
        "reset": "Vary empty versus staged cart load; maintain the marked human-yield zone.",
        "hazard": false,
        "id": "CO-Z1",
        "seed": 44
      },
      {
        "name": "Blind turn",
        "x": 8.7,
        "y": 2.2,
        "w": 2.4,
        "h": 1.4,
        "reset": "Stage an inert obstacle behind the corner; stop and inspect before the turn.",
        "hazard": false,
        "id": "CO-Z2",
        "seed": 63
      },
      {
        "name": "Door crossing",
        "x": 4,
        "y": 1.3,
        "w": 1.5,
        "h": 1.3,
        "reset": "Alternate a fully open and partially staged service doorway; no powered closing.",
        "hazard": false,
        "id": "CO-Z3",
        "seed": 82
      },
      {
        "name": "Cart parking bay",
        "x": 5.6,
        "y": 2.75,
        "w": 1.9,
        "h": 0.85,
        "reset": "Reset the cart into two marked parking angles.",
        "hazard": false,
        "id": "CO-Z4",
        "seed": 31
      }
    ],
    "cameras": [
      {
        "name": "Long corridor view",
        "x": 0.4,
        "y": 2.2,
        "bearing": 0,
        "fov": 52,
        "range": 13,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "CO-C1",
        "zoneId": "CO-Z1"
      },
      {
        "name": "Blind-corner return",
        "x": 10,
        "y": 4.6,
        "bearing": 258,
        "fov": 73,
        "range": 5,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "CO-C2",
        "zoneId": "CO-Z2"
      },
      {
        "name": "East crossing",
        "x": 13.5,
        "y": 3.4,
        "bearing": 183,
        "fov": 56,
        "range": 8,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "CO-C3",
        "zoneId": "CO-Z3"
      },
      {
        "name": "Service doorway",
        "x": 4.4,
        "y": 1.5,
        "bearing": 83,
        "fov": 74,
        "range": 3,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "CO-C4",
        "zoneId": "CO-Z4"
      },
      {
        "name": "Parking bay view",
        "x": 7.6,
        "y": 3.5,
        "bearing": 220,
        "fov": 72,
        "range": 4,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "CO-C5",
        "zoneId": "CO-Z4"
      }
    ],
    "walls": [
      [
        9.1,
        0,
        9.1,
        1.7
      ],
      [
        10.6,
        0,
        10.6,
        2.8
      ]
    ],
    "doors": [],
    "sensors": [
      {
        "name": "Service door",
        "kind": "Door state",
        "x": 4.6,
        "y": 1.5,
        "id": "CO-S1"
      },
      {
        "name": "Corner geometry",
        "kind": "Depth",
        "x": 9.8,
        "y": 3.3,
        "id": "CO-S2"
      },
      {
        "name": "Cart marker",
        "kind": "Tag reader",
        "x": 5.9,
        "y": 3.5,
        "id": "CO-S3"
      }
    ],
    "path": [
      [
        0.7,
        2.3
      ],
      [
        5.1,
        2.3
      ],
      [
        8.9,
        2.3
      ],
      [
        9.7,
        3.6
      ],
      [
        13.3,
        3.6
      ]
    ],
    "privacy": "Closed research set; consented adult participants only. Audio off. No guest recording.",
    "notes": "Full-height service blocks clip sightlines. Blind-corner checks are design estimates, not navigation safety guarantees.",
    "exclusions": []
  },
  "stairs": {
    "id": "stairs",
    "prefix": "ST",
    "width": 8,
    "depth": 7,
    "description": "Two stair flights and a return landing, with a human exclusion zone for traversal.",
    "fixtures": [
      {
        "kind": "stairs",
        "name": "Up flight",
        "x": 1,
        "y": 1,
        "w": 2.1,
        "h": 4.8,
        "solid": false
      },
      {
        "kind": "stairs",
        "name": "Down flight",
        "x": 4.4,
        "y": 1,
        "w": 2.1,
        "h": 4.8,
        "solid": false
      },
      {
        "kind": "cabinet",
        "name": "Stairwell void",
        "x": 3.35,
        "y": 1.4,
        "w": 0.7,
        "h": 3.7,
        "solid": true
      }
    ],
    "zones": [
      {
        "name": "Lower approach",
        "x": 0.6,
        "y": 5.6,
        "w": 2.9,
        "h": 1,
        "reset": "Stage an empty landing and mark the approved stopping point.",
        "hazard": false,
        "id": "ST-Z1",
        "seed": 30
      },
      {
        "name": "Upper landing",
        "x": 0.5,
        "y": 0.15,
        "w": 6.5,
        "h": 0.75,
        "reset": "Vary approach angle using lightweight objects on the landing only.",
        "hazard": false,
        "id": "ST-Z2",
        "seed": 49
      },
      {
        "name": "Step-clearance test",
        "x": 4.25,
        "y": 1.1,
        "w": 2.5,
        "h": 4.6,
        "reset": "Supervised traversal under a separately approved robotics safety protocol.",
        "hazard": true,
        "id": "ST-Z3",
        "seed": 68
      }
    ],
    "cameras": [
      {
        "name": "Lower approach",
        "x": 0.4,
        "y": 6.6,
        "bearing": 313,
        "fov": 79,
        "range": 7,
        "mount": "Perimeter ceiling",
        "height": 2.8,
        "mode": "sector",
        "enabled": true,
        "id": "ST-C1",
        "zoneId": "ST-Z1"
      },
      {
        "name": "Upper landing",
        "x": 7.6,
        "y": 0.4,
        "bearing": 154,
        "fov": 86,
        "range": 8,
        "mount": "Perimeter ceiling",
        "height": 3,
        "mode": "sector",
        "enabled": true,
        "id": "ST-C2",
        "zoneId": "ST-Z2"
      },
      {
        "name": "Side flight",
        "x": 0.45,
        "y": 2.9,
        "bearing": 5,
        "fov": 65,
        "range": 7,
        "mount": "Perimeter ceiling",
        "height": 2.8,
        "mode": "sector",
        "enabled": true,
        "id": "ST-C3",
        "zoneId": "ST-Z3"
      },
      {
        "name": "Return landing",
        "x": 7.6,
        "y": 6.6,
        "bearing": 234,
        "fov": 80,
        "range": 8,
        "mount": "Perimeter ceiling",
        "height": 3,
        "mode": "sector",
        "enabled": true,
        "id": "ST-C4",
        "zoneId": "ST-Z3"
      }
    ],
    "walls": [],
    "doors": [],
    "sensors": [
      {
        "name": "Landing light",
        "kind": "Environment",
        "x": 7.6,
        "y": 3.1,
        "id": "ST-S1"
      },
      {
        "name": "Step geometry",
        "kind": "Depth",
        "x": 3.8,
        "y": 6.4,
        "id": "ST-S2"
      }
    ],
    "path": [
      [
        1.9,
        6.3
      ],
      [
        1.9,
        1
      ],
      [
        3.8,
        0.7
      ],
      [
        5.4,
        1
      ],
      [
        5.4,
        6.2
      ]
    ],
    "privacy": "Closed stair test set. Trained adults and a separate fall-protection protocol. No public circulation.",
    "notes": "This is a 2D plan projection. Elevation, fall risk, vertical occlusion and handrail geometry are NOT validated here.",
    "exclusions": []
  },
  "elevator": {
    "id": "elevator",
    "prefix": "EL",
    "width": 8,
    "depth": 7,
    "description": "A mock lift cabin, lobby queue area and marked approach path.",
    "fixtures": [
      {
        "kind": "lift",
        "name": "Mock lift cabin",
        "x": 2.5,
        "y": 0.3,
        "w": 3,
        "h": 2.6,
        "solid": false
      },
      {
        "kind": "bench",
        "name": "Lobby bench",
        "x": 0.35,
        "y": 4.5,
        "w": 0.65,
        "h": 1.7,
        "solid": false
      },
      {
        "kind": "cart",
        "name": "Service cart",
        "x": 6,
        "y": 4.5,
        "w": 0.8,
        "h": 1.1,
        "solid": false
      }
    ],
    "zones": [
      {
        "name": "Approach / queue",
        "x": 2.3,
        "y": 4,
        "w": 3.3,
        "h": 2.5,
        "reset": "Alternate empty queue and an inert cart in the marked waiting position.",
        "hazard": false,
        "id": "EL-Z1",
        "seed": 44
      },
      {
        "name": "Threshold",
        "x": 2.8,
        "y": 2.6,
        "w": 2.4,
        "h": 1.1,
        "reset": "Vary marked threshold strips in an isolated mock lift; no powered doors.",
        "hazard": false,
        "id": "EL-Z2",
        "seed": 63
      },
      {
        "name": "Cabin reorientation",
        "x": 2.8,
        "y": 0.7,
        "w": 2.4,
        "h": 1.7,
        "reset": "Enter the stationary open cabin with an empty cart and reorient.",
        "hazard": false,
        "id": "EL-Z3",
        "seed": 82
      },
      {
        "name": "Exit / yield",
        "x": 5.4,
        "y": 3.2,
        "w": 1.8,
        "h": 2.6,
        "reset": "Pause on exit for a trained colleague in the designated yield zone.",
        "hazard": false,
        "id": "EL-Z4",
        "seed": 31
      }
    ],
    "cameras": [
      {
        "name": "Lobby context",
        "x": 0.4,
        "y": 6.6,
        "bearing": 316,
        "fov": 88,
        "range": 8,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "EL-C1",
        "zoneId": "EL-Z1"
      },
      {
        "name": "Threshold side",
        "x": 6.2,
        "y": 3.5,
        "bearing": 213,
        "fov": 74,
        "range": 4.5,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "EL-C2",
        "zoneId": "EL-Z2"
      },
      {
        "name": "Cabin inward",
        "x": 2.7,
        "y": 0.5,
        "bearing": 58,
        "fov": 96,
        "range": 4,
        "mount": "Perimeter ceiling",
        "height": 2.35,
        "mode": "sector",
        "enabled": true,
        "id": "EL-C3",
        "zoneId": "EL-Z3"
      },
      {
        "name": "Queue / cart view",
        "x": 7.6,
        "y": 6.6,
        "bearing": 228,
        "fov": 80,
        "range": 8,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "EL-C4",
        "zoneId": "EL-Z4"
      }
    ],
    "walls": [
      [
        2.4,
        0.2,
        2.4,
        2.9
      ],
      [
        5.6,
        0.2,
        5.6,
        2.9
      ],
      [
        2.4,
        2.9,
        3.1,
        2.9
      ],
      [
        4.9,
        2.9,
        5.6,
        2.9
      ]
    ],
    "doors": [],
    "sensors": [
      {
        "name": "Mock door state",
        "kind": "Door state",
        "x": 3.1,
        "y": 2.95,
        "id": "EL-S1"
      },
      {
        "name": "Threshold geometry",
        "kind": "Depth",
        "x": 5.6,
        "y": 3.1,
        "id": "EL-S2"
      },
      {
        "name": "Lobby light",
        "kind": "Environment",
        "x": 7.7,
        "y": 3.5,
        "id": "EL-S3"
      }
    ],
    "path": [
      [
        4,
        6.5
      ],
      [
        4,
        3.4
      ],
      [
        4,
        2.6
      ],
      [
        4,
        1.5
      ],
      [
        4.5,
        1.5
      ],
      [
        4.5,
        3.5
      ],
      [
        6,
        4
      ]
    ],
    "privacy": "Isolated mock elevator. Operator-approved cabin recording only. No access to a real hotel elevator controller.",
    "notes": "No live lift integration. Door timings, threshold height and interlocks require engineering validation.",
    "exclusions": []
  },
  "pool": {
    "id": "pool",
    "prefix": "PL",
    "width": 18,
    "depth": 12,
    "description": "Dry-deck service routes, loungers and towel staging around a no-entry pool boundary.",
    "fixtures": [
      {
        "kind": "pool",
        "name": "Pool / excluded water",
        "x": 5,
        "y": 2.6,
        "w": 8,
        "h": 5.3,
        "solid": false
      },
      {
        "kind": "lounger",
        "name": "Lounger",
        "x": 3,
        "y": 0.6,
        "w": 1.1,
        "h": 1.7,
        "solid": false
      },
      {
        "kind": "lounger",
        "name": "Lounger",
        "x": 5,
        "y": 0.6,
        "w": 1.1,
        "h": 1.7,
        "solid": false
      },
      {
        "kind": "lounger",
        "name": "Lounger",
        "x": 7,
        "y": 0.6,
        "w": 1.1,
        "h": 1.7,
        "solid": false
      },
      {
        "kind": "lounger",
        "name": "Lounger",
        "x": 9,
        "y": 0.6,
        "w": 1.1,
        "h": 1.7,
        "solid": false
      },
      {
        "kind": "lounger",
        "name": "Lounger",
        "x": 11,
        "y": 0.6,
        "w": 1.1,
        "h": 1.7,
        "solid": false
      },
      {
        "kind": "lounger",
        "name": "Lounger",
        "x": 13,
        "y": 0.6,
        "w": 1.1,
        "h": 1.7,
        "solid": false
      },
      {
        "kind": "counter",
        "name": "Towel station",
        "x": 0.5,
        "y": 3,
        "w": 1.4,
        "h": 2.1,
        "solid": false
      },
      {
        "kind": "cabinet",
        "name": "Equipment store",
        "x": 14.9,
        "y": 7,
        "w": 2.1,
        "h": 2,
        "solid": true
      }
    ],
    "zones": [
      {
        "name": "Dry-deck route",
        "x": 2.3,
        "y": 8.7,
        "w": 11.2,
        "h": 1.5,
        "reset": "Stage furniture on a dry deck; keep the pool boundary and exit route unobstructed.",
        "hazard": false,
        "id": "PL-Z1",
        "seed": 86
      },
      {
        "name": "Lounger reset",
        "x": 2.7,
        "y": 0.4,
        "w": 4,
        "h": 2,
        "reset": "Vary lounger orientation and reset towel placement.",
        "hazard": false,
        "id": "PL-Z2",
        "seed": 35
      },
      {
        "name": "Towel service",
        "x": 0.3,
        "y": 2.7,
        "w": 2.1,
        "h": 3,
        "reset": "Alternate towel stack height at the dry service station.",
        "hazard": false,
        "id": "PL-Z3",
        "seed": 54
      },
      {
        "name": "Equipment staging",
        "x": 14.3,
        "y": 5,
        "w": 3,
        "h": 1.6,
        "reset": "Stage lightweight tools away from the water boundary.",
        "hazard": false,
        "id": "PL-Z4",
        "seed": 73
      }
    ],
    "cameras": [
      {
        "name": "Deck-wide north",
        "x": 0.5,
        "y": 0.45,
        "bearing": 34,
        "fov": 94,
        "range": 18,
        "mount": "Perimeter ceiling",
        "height": 3.5,
        "mode": "sector",
        "enabled": true,
        "id": "PL-C1",
        "zoneId": "PL-Z1"
      },
      {
        "name": "Cabana / seating",
        "x": 17.5,
        "y": 0.5,
        "bearing": 148,
        "fov": 85,
        "range": 16,
        "mount": "Perimeter ceiling",
        "height": 3.3,
        "mode": "sector",
        "enabled": true,
        "id": "PL-C2",
        "zoneId": "PL-Z2"
      },
      {
        "name": "Towel station",
        "x": 0.3,
        "y": 6.6,
        "bearing": 289,
        "fov": 72,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "PL-C3",
        "zoneId": "PL-Z3"
      },
      {
        "name": "Service gate",
        "x": 16.8,
        "y": 11.5,
        "bearing": 215,
        "fov": 85,
        "range": 15,
        "mount": "Perimeter ceiling",
        "height": 3.5,
        "mode": "sector",
        "enabled": true,
        "id": "PL-C4",
        "zoneId": "PL-Z4"
      },
      {
        "name": "Dry-deck south",
        "x": 5,
        "y": 11.5,
        "bearing": 330,
        "fov": 79,
        "range": 12,
        "mount": "Perimeter ceiling",
        "height": 3.4,
        "mode": "sector",
        "enabled": true,
        "id": "PL-C5",
        "zoneId": "PL-Z4"
      },
      {
        "name": "Equipment approach",
        "x": 17.4,
        "y": 5,
        "bearing": 170,
        "fov": 74,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "PL-C6",
        "zoneId": "PL-Z4"
      }
    ],
    "walls": [],
    "doors": [],
    "sensors": [
      {
        "name": "Weather / lux",
        "kind": "Environment",
        "x": 17.5,
        "y": 2.7,
        "id": "PL-S1"
      },
      {
        "name": "Gate state",
        "kind": "Door state",
        "x": 16.7,
        "y": 11.7,
        "id": "PL-S2"
      },
      {
        "name": "Dry-route geometry",
        "kind": "Depth",
        "x": 3.2,
        "y": 9.6,
        "id": "PL-S3"
      }
    ],
    "path": [
      [
        16.8,
        10.3
      ],
      [
        13.8,
        10.1
      ],
      [
        8.9,
        9.5
      ],
      [
        3.1,
        9.4
      ],
      [
        2.9,
        6.5
      ],
      [
        2.7,
        2.4
      ],
      [
        7.5,
        2
      ]
    ],
    "privacy": "Closed research deck; no guests, swimming, changing areas or private cabanas. Do not record public-use pool activity.",
    "notes": "Water is an excluded no-entry region, not a recording target. Thermal and deck-condition layers are simulated only.",
    "exclusions": [
      {
        "x": 5,
        "y": 2.6,
        "w": 8,
        "h": 5.3,
        "name": "Water / no-entry boundary"
      }
    ]
  },
  "garden": {
    "id": "garden",
    "prefix": "GD",
    "width": 16,
    "depth": 11,
    "description": "Planting beds, path junctions, tool staging and fenced service access.",
    "fixtures": [
      {
        "kind": "plant",
        "name": "Planting bed A",
        "x": 0.5,
        "y": 0.5,
        "w": 5,
        "h": 3,
        "solid": false
      },
      {
        "kind": "plant",
        "name": "Planting bed B",
        "x": 9.8,
        "y": 0.5,
        "w": 5.7,
        "h": 3,
        "solid": false
      },
      {
        "kind": "plant",
        "name": "Planting bed C",
        "x": 0.5,
        "y": 6.9,
        "w": 5.1,
        "h": 3.4,
        "solid": false
      },
      {
        "kind": "tree",
        "name": "Tree",
        "x": 11,
        "y": 7,
        "w": 1.8,
        "h": 1.8,
        "solid": false
      },
      {
        "kind": "rack",
        "name": "Tool staging",
        "x": 13.6,
        "y": 6.1,
        "w": 1.4,
        "h": 2.8,
        "solid": false
      },
      {
        "kind": "cart",
        "name": "Planter trolley",
        "x": 6.6,
        "y": 8.6,
        "w": 1,
        "h": 1.2,
        "solid": false
      }
    ],
    "zones": [
      {
        "name": "Plant handling",
        "x": 0.5,
        "y": 0.5,
        "w": 5,
        "h": 3,
        "reset": "Alternate three pot sizes and partial foliage occlusion. Use hand watering only.",
        "hazard": false,
        "id": "GD-Z1",
        "seed": 30
      },
      {
        "name": "Path junction",
        "x": 5.7,
        "y": 3.8,
        "w": 3.9,
        "h": 2.5,
        "reset": "Stage a hose prop at the marked junction; keep a parallel clear access path.",
        "hazard": false,
        "id": "GD-Z2",
        "seed": 49
      },
      {
        "name": "Tool staging",
        "x": 13,
        "y": 5.7,
        "w": 2.5,
        "h": 3.1,
        "reset": "Place closed hand tools and lightweight supplies in two orientations.",
        "hazard": false,
        "id": "GD-Z3",
        "seed": 68
      },
      {
        "name": "Debris route",
        "x": 0.7,
        "y": 5.1,
        "w": 4.4,
        "h": 1.4,
        "reset": "Distribute inert leaf props across the designated paved route.",
        "hazard": false,
        "id": "GD-Z4",
        "seed": 87
      }
    ],
    "cameras": [
      {
        "name": "Grounds overview",
        "x": 0.4,
        "y": 10.5,
        "bearing": 323,
        "fov": 94,
        "range": 17,
        "mount": "Perimeter ceiling",
        "height": 3.7,
        "mode": "sector",
        "enabled": true,
        "id": "GD-C1",
        "zoneId": "GD-Z1"
      },
      {
        "name": "Tool station",
        "x": 15.5,
        "y": 9.7,
        "bearing": 252,
        "fov": 81,
        "range": 7,
        "mount": "Perimeter ceiling",
        "height": 3,
        "mode": "sector",
        "enabled": true,
        "id": "GD-C2",
        "zoneId": "GD-Z2"
      },
      {
        "name": "Path junction",
        "x": 8,
        "y": 10.4,
        "bearing": 267,
        "fov": 78,
        "range": 12,
        "mount": "Perimeter ceiling",
        "height": 3.5,
        "mode": "sector",
        "enabled": true,
        "id": "GD-C3",
        "zoneId": "GD-Z3"
      },
      {
        "name": "Planting detail",
        "x": 5.4,
        "y": 0.35,
        "bearing": 138,
        "fov": 80,
        "range": 7,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "GD-C4",
        "zoneId": "GD-Z4"
      },
      {
        "name": "Service access",
        "x": 15.5,
        "y": 0.4,
        "bearing": 135,
        "fov": 90,
        "range": 16,
        "mount": "Perimeter ceiling",
        "height": 3.5,
        "mode": "sector",
        "enabled": true,
        "id": "GD-C5",
        "zoneId": "GD-Z4"
      }
    ],
    "walls": [],
    "doors": [],
    "sensors": [
      {
        "name": "Moisture indicator",
        "kind": "Environment",
        "x": 2.1,
        "y": 3.6,
        "id": "GD-S1"
      },
      {
        "name": "Outdoor light",
        "kind": "Environment",
        "x": 9.2,
        "y": 5.3,
        "id": "GD-S2"
      },
      {
        "name": "Tool docking",
        "kind": "Tag reader",
        "x": 13.4,
        "y": 8.7,
        "id": "GD-S3"
      }
    ],
    "path": [
      [
        14.8,
        10
      ],
      [
        8.6,
        9.3
      ],
      [
        7.9,
        5.3
      ],
      [
        5.7,
        4.7
      ],
      [
        3,
        4.8
      ],
      [
        3.1,
        3.7
      ],
      [
        5.8,
        4.4
      ],
      [
        12.4,
        4.4
      ],
      [
        13.2,
        6.1
      ]
    ],
    "privacy": "Closed research set; consented adult participants only. Audio off. No guest recording.",
    "notes": "Foliage and terrain are illustrative. GNSS accuracy, grade and outdoor exposure are not modeled.",
    "exclusions": []
  },
  "boh": {
    "id": "boh",
    "prefix": "BH",
    "width": 11,
    "depth": 6,
    "description": "Service storage, sorting bins and a cart-staging route behind the public areas.",
    "fixtures": [
      {
        "kind": "rack",
        "name": "Supply shelving",
        "x": 0.3,
        "y": 0.3,
        "w": 3.5,
        "h": 0.9,
        "solid": true
      },
      {
        "kind": "rack",
        "name": "Return shelving",
        "x": 6.1,
        "y": 0.3,
        "w": 4.5,
        "h": 0.9,
        "solid": true
      },
      {
        "kind": "counter",
        "name": "Sorting station",
        "x": 0.35,
        "y": 3.6,
        "w": 2.8,
        "h": 1.5,
        "solid": false
      },
      {
        "kind": "cart",
        "name": "Housekeeping cart",
        "x": 4.7,
        "y": 3.8,
        "w": 0.85,
        "h": 1.25,
        "solid": false
      },
      {
        "kind": "bin",
        "name": "Recycling props",
        "x": 8.5,
        "y": 4.3,
        "w": 1.8,
        "h": 1.1,
        "solid": false
      }
    ],
    "zones": [
      {
        "name": "Supply pick",
        "x": 0.5,
        "y": 1.4,
        "w": 3.3,
        "h": 1.5,
        "reset": "Stage lightweight bins at alternating shelf heights.",
        "hazard": false,
        "id": "BH-Z1",
        "seed": 79
      },
      {
        "name": "Cart reset",
        "x": 4.4,
        "y": 3.1,
        "w": 2.1,
        "h": 2.5,
        "reset": "Vary cart layout and bin color while preserving the clear aisle.",
        "hazard": false,
        "id": "BH-Z2",
        "seed": 28
      },
      {
        "name": "Return sorting",
        "x": 0.3,
        "y": 3.4,
        "w": 3,
        "h": 2,
        "reset": "Stage recyclable inert props and record completion boundaries.",
        "hazard": false,
        "id": "BH-Z3",
        "seed": 47
      },
      {
        "name": "Service crossing",
        "x": 6.8,
        "y": 2.1,
        "w": 3.2,
        "h": 1.6,
        "reset": "Move the empty cart past a staged colleague at the marked stop.",
        "hazard": false,
        "id": "BH-Z4",
        "seed": 66
      }
    ],
    "cameras": [
      {
        "name": "Service-entry context",
        "x": 10.5,
        "y": 5.6,
        "bearing": 222,
        "fov": 88,
        "range": 11,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "BH-C1",
        "zoneId": "BH-Z1"
      },
      {
        "name": "Supply shelves",
        "x": 4.3,
        "y": 0.4,
        "bearing": 142,
        "fov": 79,
        "range": 5,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "BH-C2",
        "zoneId": "BH-Z2"
      },
      {
        "name": "Cart reset",
        "x": 3.5,
        "y": 5.6,
        "bearing": 307,
        "fov": 84,
        "range": 5,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "BH-C3",
        "zoneId": "BH-Z3"
      },
      {
        "name": "Sorting overhead",
        "x": 1.8,
        "y": 4.2,
        "bearing": 0,
        "fov": 90,
        "range": 2,
        "mount": "Overhead task station",
        "height": 2.7,
        "mode": "overhead",
        "enabled": true,
        "id": "BH-C4",
        "zoneId": "BH-Z4"
      },
      {
        "name": "Service intersection",
        "x": 10.6,
        "y": 1.6,
        "bearing": 156,
        "fov": 74,
        "range": 8,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "BH-C5",
        "zoneId": "BH-Z4"
      }
    ],
    "walls": [],
    "doors": [],
    "sensors": [
      {
        "name": "Service door",
        "kind": "Door state",
        "x": 10.6,
        "y": 5.8,
        "id": "BH-S1"
      },
      {
        "name": "Cart tag",
        "kind": "Tag reader",
        "x": 5.3,
        "y": 3.2,
        "id": "BH-S2"
      },
      {
        "name": "Aisle depth",
        "kind": "Depth",
        "x": 6.9,
        "y": 2.7,
        "id": "BH-S3"
      }
    ],
    "path": [
      [
        10.5,
        5.4
      ],
      [
        7.7,
        3.3
      ],
      [
        5.9,
        2.7
      ],
      [
        2.7,
        2.7
      ],
      [
        2.7,
        1.8
      ],
      [
        3.9,
        2.8
      ],
      [
        4.4,
        4.6
      ]
    ],
    "privacy": "Closed research set; consented adult participants only. Audio off. No guest recording.",
    "notes": "Assumed plan geometry. A site survey, risk assessment and camera calibration are required before installation.",
    "exclusions": []
  },
  "loading": {
    "id": "loading",
    "prefix": "LD",
    "width": 14,
    "depth": 9,
    "description": "An isolated loading bay, trolley staging, package table and separated vehicle boundary.",
    "fixtures": [
      {
        "kind": "truck",
        "name": "Parked vehicle",
        "x": 9,
        "y": 0.4,
        "w": 3.8,
        "h": 4.2,
        "solid": false
      },
      {
        "kind": "table",
        "name": "Package table",
        "x": 1,
        "y": 1.1,
        "w": 3,
        "h": 1.4,
        "solid": false
      },
      {
        "kind": "rack",
        "name": "Return racks",
        "x": 0.4,
        "y": 6.5,
        "w": 4.4,
        "h": 1.4,
        "solid": true
      },
      {
        "kind": "cart",
        "name": "Hand trolley",
        "x": 6.7,
        "y": 5.6,
        "w": 0.8,
        "h": 1.3,
        "solid": false
      }
    ],
    "zones": [
      {
        "name": "Package staging",
        "x": 0.7,
        "y": 0.8,
        "w": 3.6,
        "h": 2.2,
        "reset": "Use empty boxes; rotate labels and alternate package orientation.",
        "hazard": false,
        "id": "LD-Z1",
        "seed": 37
      },
      {
        "name": "Vehicle boundary",
        "x": 8.5,
        "y": 4.5,
        "w": 4.4,
        "h": 1.5,
        "reset": "Keep the parked vehicle isolated. No driving or active dock edge in the demo.",
        "hazard": true,
        "id": "LD-Z2",
        "seed": 56
      },
      {
        "name": "Trolley route",
        "x": 5.1,
        "y": 3,
        "w": 3,
        "h": 4.7,
        "reset": "Alternate two lightweight loads and pause at the marked bay boundary.",
        "hazard": false,
        "id": "LD-Z3",
        "seed": 75
      },
      {
        "name": "Return sorting",
        "x": 0.4,
        "y": 5.5,
        "w": 4.7,
        "h": 2.6,
        "reset": "Reset package locations and capture the before / after inventory state.",
        "hazard": false,
        "id": "LD-Z4",
        "seed": 24
      }
    ],
    "cameras": [
      {
        "name": "Bay overview",
        "x": 0.4,
        "y": 0.4,
        "bearing": 40,
        "fov": 91,
        "range": 15,
        "mount": "Perimeter ceiling",
        "height": 3.6,
        "mode": "sector",
        "enabled": true,
        "id": "LD-C1",
        "zoneId": "LD-Z1"
      },
      {
        "name": "Vehicle-boundary view",
        "x": 13.5,
        "y": 6.1,
        "bearing": 190,
        "fov": 78,
        "range": 8,
        "mount": "Perimeter ceiling",
        "height": 3.6,
        "mode": "sector",
        "enabled": true,
        "id": "LD-C2",
        "zoneId": "LD-Z2"
      },
      {
        "name": "Package-table detail",
        "x": 2.5,
        "y": 1.8,
        "bearing": 0,
        "fov": 90,
        "range": 2.1,
        "mount": "Overhead task station",
        "height": 3,
        "mode": "overhead",
        "enabled": true,
        "id": "LD-C3",
        "zoneId": "LD-Z3"
      },
      {
        "name": "Trolley route",
        "x": 7.3,
        "y": 8.5,
        "bearing": 270,
        "fov": 75,
        "range": 9,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "LD-C4",
        "zoneId": "LD-Z4"
      },
      {
        "name": "Return-rack view",
        "x": 5.8,
        "y": 8.5,
        "bearing": 215,
        "fov": 78,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "LD-C5",
        "zoneId": "LD-Z4"
      }
    ],
    "walls": [],
    "doors": [],
    "sensors": [
      {
        "name": "Bay contact",
        "kind": "Door state",
        "x": 13.7,
        "y": 6,
        "id": "LD-S1"
      },
      {
        "name": "Package scale",
        "kind": "Load state",
        "x": 2.5,
        "y": 2.9,
        "id": "LD-S2"
      },
      {
        "name": "Trolley location",
        "kind": "Tag reader",
        "x": 7.1,
        "y": 4.8,
        "id": "LD-S3"
      }
    ],
    "path": [
      [
        7.1,
        8.3
      ],
      [
        7.1,
        4.7
      ],
      [
        5.6,
        3.4
      ],
      [
        4.6,
        3.4
      ],
      [
        4.5,
        2.1
      ],
      [
        4.7,
        5
      ],
      [
        5.3,
        6.3
      ]
    ],
    "privacy": "Closed research set; consented adult participants only. Audio off. No guest recording.",
    "notes": "Stationary, isolated bay only. Real vehicle movements and dock hazards require an approved site safety plan.",
    "exclusions": []
  },
  "warehouse": {
    "id": "warehouse",
    "prefix": "WH",
    "width": 14,
    "depth": 10,
    "description": "Parallel stock aisles, low-weight pick stations and a clear end-of-aisle turn.",
    "fixtures": [
      {
        "kind": "rack",
        "name": "Rack 1",
        "x": 1,
        "y": 1.2,
        "w": 1.6,
        "h": 6.2,
        "solid": true
      },
      {
        "kind": "rack",
        "name": "Rack 2",
        "x": 5,
        "y": 1.2,
        "w": 1.6,
        "h": 6.2,
        "solid": true
      },
      {
        "kind": "rack",
        "name": "Rack 3",
        "x": 9,
        "y": 1.2,
        "w": 1.6,
        "h": 6.2,
        "solid": true
      },
      {
        "kind": "table",
        "name": "Packing bench",
        "x": 0.6,
        "y": 8.3,
        "w": 3,
        "h": 1.2,
        "solid": false
      },
      {
        "kind": "cart",
        "name": "Bin cart",
        "x": 12,
        "y": 7.5,
        "w": 0.85,
        "h": 1.3,
        "solid": false
      }
    ],
    "zones": [
      {
        "name": "Aisle one",
        "x": 2.8,
        "y": 1.2,
        "w": 2,
        "h": 6,
        "reset": "Vary bin positions on the low shelf; use only lightweight parcels.",
        "hazard": false,
        "id": "WH-Z1",
        "seed": 51
      },
      {
        "name": "Aisle two",
        "x": 6.7,
        "y": 1.2,
        "w": 2,
        "h": 6,
        "reset": "Stage one partly obscured label and two bin sizes.",
        "hazard": false,
        "id": "WH-Z2",
        "seed": 70
      },
      {
        "name": "Cross-aisle turn",
        "x": 3.7,
        "y": 7.6,
        "w": 8.6,
        "h": 1.7,
        "reset": "Stage an empty cart and mark the turning clearance.",
        "hazard": false,
        "id": "WH-Z3",
        "seed": 89
      },
      {
        "name": "Packing station",
        "x": 0.5,
        "y": 8.1,
        "w": 3.3,
        "h": 1.6,
        "reset": "Record a parcel handoff and an observable completion state.",
        "hazard": false,
        "id": "WH-Z4",
        "seed": 38
      }
    ],
    "cameras": [
      {
        "name": "Aisle-one long view",
        "x": 3.8,
        "y": 0.4,
        "bearing": 90,
        "fov": 46,
        "range": 10,
        "mount": "Perimeter ceiling",
        "height": 3.2,
        "mode": "sector",
        "enabled": true,
        "id": "WH-C1",
        "zoneId": "WH-Z1"
      },
      {
        "name": "Aisle-two long view",
        "x": 7.8,
        "y": 0.4,
        "bearing": 90,
        "fov": 46,
        "range": 10,
        "mount": "Perimeter ceiling",
        "height": 3.2,
        "mode": "sector",
        "enabled": true,
        "id": "WH-C2",
        "zoneId": "WH-Z2"
      },
      {
        "name": "Rack-face approach",
        "x": 12.9,
        "y": 1.6,
        "bearing": 108,
        "fov": 72,
        "range": 8,
        "mount": "Perimeter ceiling",
        "height": 3.2,
        "mode": "sector",
        "enabled": true,
        "id": "WH-C3",
        "zoneId": "WH-Z3"
      },
      {
        "name": "Cross-aisle return",
        "x": 13.5,
        "y": 9.4,
        "bearing": 200,
        "fov": 80,
        "range": 14,
        "mount": "Perimeter ceiling",
        "height": 3.6,
        "mode": "sector",
        "enabled": true,
        "id": "WH-C4",
        "zoneId": "WH-Z4"
      },
      {
        "name": "Packing overhead",
        "x": 2.2,
        "y": 8.8,
        "bearing": 0,
        "fov": 90,
        "range": 2,
        "mount": "Overhead task station",
        "height": 3,
        "mode": "overhead",
        "enabled": true,
        "id": "WH-C5",
        "zoneId": "WH-Z4"
      }
    ],
    "walls": [],
    "doors": [],
    "sensors": [
      {
        "name": "Rack geometry",
        "kind": "Depth",
        "x": 3.8,
        "y": 4.3,
        "id": "WH-S1"
      },
      {
        "name": "Bin checkpoint",
        "kind": "Tag reader",
        "x": 7.8,
        "y": 4.8,
        "id": "WH-S2"
      },
      {
        "name": "Bay light",
        "kind": "Environment",
        "x": 13.6,
        "y": 4,
        "id": "WH-S3"
      }
    ],
    "path": [
      [
        12.7,
        9.2
      ],
      [
        11.8,
        8
      ],
      [
        7.8,
        8
      ],
      [
        7.8,
        4
      ],
      [
        7.8,
        8
      ],
      [
        3.8,
        8
      ],
      [
        3.8,
        3
      ],
      [
        3.8,
        8
      ],
      [
        3.8,
        9
      ]
    ],
    "privacy": "Closed research set; consented adult participants only. Audio off. No guest recording.",
    "notes": "Opaque racks block sightlines in the planner. Pick precision and safety clearances are not measured.",
    "exclusions": []
  },
  "senior": {
    "id": "senior",
    "prefix": "SL",
    "width": 10,
    "depth": 8,
    "description": "An accessible nonclinical test suite with generous routes and mobility-aid props.",
    "fixtures": [
      {
        "kind": "bed",
        "name": "Accessible bed",
        "x": 0.65,
        "y": 0.7,
        "w": 2.3,
        "h": 2.4,
        "solid": false
      },
      {
        "kind": "table",
        "name": "Bedside table",
        "x": 3.25,
        "y": 0.75,
        "w": 0.65,
        "h": 0.75,
        "solid": false
      },
      {
        "kind": "sofa",
        "name": "Seating",
        "x": 5.6,
        "y": 1.1,
        "w": 2.3,
        "h": 0.9,
        "solid": false
      },
      {
        "kind": "table",
        "name": "Delivery table",
        "x": 6,
        "y": 3,
        "w": 1.6,
        "h": 1.1,
        "solid": false
      },
      {
        "kind": "counter",
        "name": "Kitchenette",
        "x": 8.4,
        "y": 4,
        "w": 0.9,
        "h": 2.8,
        "solid": false
      },
      {
        "kind": "chair",
        "name": "Mobility-aid prop",
        "x": 3,
        "y": 5.7,
        "w": 0.9,
        "h": 1,
        "solid": false
      },
      {
        "kind": "cabinet",
        "name": "Bath privacy wall",
        "x": 0.3,
        "y": 4.6,
        "w": 1.2,
        "h": 2.9,
        "solid": true
      }
    ],
    "zones": [
      {
        "name": "Bedside approach",
        "x": 3.1,
        "y": 1.5,
        "w": 1.8,
        "h": 2.2,
        "reset": "Place a lightweight nonclinical item at alternating safe retrieval heights.",
        "hazard": false,
        "id": "SL-Z1",
        "seed": 30
      },
      {
        "name": "Living / delivery",
        "x": 5.1,
        "y": 2.8,
        "w": 3,
        "h": 2.2,
        "reset": "Deliver a towel to the table; no medication, lifting or personal-care tasks.",
        "hazard": false,
        "id": "SL-Z2",
        "seed": 49
      },
      {
        "name": "Accessible route",
        "x": 2,
        "y": 4.3,
        "w": 5.4,
        "h": 1.3,
        "reset": "Move the walking-aid prop between marked positions without narrowing the approved clear route.",
        "hazard": false,
        "id": "SL-Z3",
        "seed": 68
      },
      {
        "name": "Kitchenette",
        "x": 7.4,
        "y": 4,
        "w": 2.3,
        "h": 3.2,
        "reset": "Stage light household objects and closed drawers.",
        "hazard": false,
        "id": "SL-Z4",
        "seed": 87
      }
    ],
    "cameras": [
      {
        "name": "Entry-wide context",
        "x": 5.2,
        "y": 7.6,
        "bearing": 270,
        "fov": 92,
        "range": 10,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "SL-C1",
        "zoneId": "SL-Z1"
      },
      {
        "name": "Living-room approach",
        "x": 9.6,
        "y": 0.4,
        "bearing": 136,
        "fov": 83,
        "range": 9,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "SL-C2",
        "zoneId": "SL-Z2"
      },
      {
        "name": "Bedside test view",
        "x": 0.35,
        "y": 3.8,
        "bearing": 314,
        "fov": 79,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "SL-C3",
        "zoneId": "SL-Z3"
      },
      {
        "name": "Kitchenette approach",
        "x": 9.65,
        "y": 7.5,
        "bearing": 238,
        "fov": 78,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "SL-C4",
        "zoneId": "SL-Z4"
      },
      {
        "name": "Transition route",
        "x": 2.1,
        "y": 7.6,
        "bearing": 291,
        "fov": 64,
        "range": 5,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "SL-C5",
        "zoneId": "SL-Z4"
      }
    ],
    "walls": [],
    "doors": [],
    "sensors": [
      {
        "name": "Entry state",
        "kind": "Door state",
        "x": 5.2,
        "y": 7.8,
        "id": "SL-S1"
      },
      {
        "name": "Clear-route geometry",
        "kind": "Depth",
        "x": 4.8,
        "y": 5.2,
        "id": "SL-S2"
      },
      {
        "name": "Light state",
        "kind": "Environment",
        "x": 9.6,
        "y": 3.3,
        "id": "SL-S3"
      }
    ],
    "path": [
      [
        5.2,
        7.4
      ],
      [
        5.2,
        5.2
      ],
      [
        4.8,
        3.8
      ],
      [
        4.4,
        2.5
      ],
      [
        5.2,
        4.5
      ],
      [
        6.5,
        4.4
      ],
      [
        7.2,
        5.6
      ]
    ],
    "privacy": "Unoccupied nonclinical research suite. Consented adult role-play only. No residents, health records, medication or personal care.",
    "notes": "Mobility aids are staged props. This plan does not validate accessibility compliance or any clinical capability.",
    "exclusions": [
      {
        "x": 0,
        "y": 4.4,
        "w": 1.6,
        "h": 3.6,
        "name": "Private-use exclusion"
      }
    ]
  },
  "residential": {
    "id": "residential",
    "prefix": "AP",
    "width": 11,
    "depth": 8,
    "description": "An apartment test set with distinct sleeping, living and kitchen zones.",
    "fixtures": [
      {
        "kind": "bed",
        "name": "Bedroom",
        "x": 0.7,
        "y": 0.6,
        "w": 2.3,
        "h": 2.7,
        "solid": false
      },
      {
        "kind": "desk",
        "name": "Desk",
        "x": 3.2,
        "y": 0.5,
        "w": 1.1,
        "h": 0.5,
        "solid": false
      },
      {
        "kind": "sofa",
        "name": "Living sofa",
        "x": 5.5,
        "y": 0.8,
        "w": 2.8,
        "h": 0.9,
        "solid": false
      },
      {
        "kind": "table",
        "name": "Coffee table",
        "x": 6.2,
        "y": 2.7,
        "w": 1.5,
        "h": 0.9,
        "solid": false
      },
      {
        "kind": "counter",
        "name": "Kitchen worktop",
        "x": 9.8,
        "y": 0.4,
        "w": 0.85,
        "h": 3.8,
        "solid": false
      },
      {
        "kind": "table",
        "name": "Dining table",
        "x": 6.8,
        "y": 5.4,
        "w": 2.1,
        "h": 1.2,
        "solid": false
      },
      {
        "kind": "cabinet",
        "name": "Private bath",
        "x": 0.3,
        "y": 5.3,
        "w": 3.7,
        "h": 2.4,
        "solid": true
      }
    ],
    "zones": [
      {
        "name": "Bedroom linen",
        "x": 0.4,
        "y": 0.4,
        "w": 3.8,
        "h": 3.4,
        "reset": "Alternate cushion texture and linen position. No personal occupants.",
        "hazard": false,
        "id": "AP-Z1",
        "seed": 65
      },
      {
        "name": "Living-room reset",
        "x": 5.3,
        "y": 0.5,
        "w": 3.3,
        "h": 3.9,
        "reset": "Stage three cushion positions and a light household object on the table.",
        "hazard": false,
        "id": "AP-Z2",
        "seed": 84
      },
      {
        "name": "Kitchen objects",
        "x": 8.6,
        "y": 0.4,
        "w": 2,
        "h": 3.9,
        "reset": "Use closed or empty appliances and lightweight household props.",
        "hazard": false,
        "id": "AP-Z3",
        "seed": 33
      },
      {
        "name": "Dining setup",
        "x": 6.4,
        "y": 5,
        "w": 2.9,
        "h": 2,
        "reset": "Reset two place settings and alternate chair position.",
        "hazard": false,
        "id": "AP-Z4",
        "seed": 52
      }
    ],
    "cameras": [
      {
        "name": "Entry / hall",
        "x": 4.7,
        "y": 7.6,
        "bearing": 276,
        "fov": 70,
        "range": 7,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "AP-C1",
        "zoneId": "AP-Z1"
      },
      {
        "name": "Living-wide",
        "x": 5.1,
        "y": 4.4,
        "bearing": 313,
        "fov": 88,
        "range": 7,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "AP-C2",
        "zoneId": "AP-Z2"
      },
      {
        "name": "Kitchen counter",
        "x": 9.2,
        "y": 4.6,
        "bearing": 286,
        "fov": 74,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "AP-C3",
        "zoneId": "AP-Z3"
      },
      {
        "name": "Bedroom context",
        "x": 0.35,
        "y": 4.6,
        "bearing": 315,
        "fov": 85,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "AP-C4",
        "zoneId": "AP-Z4"
      },
      {
        "name": "Dining return",
        "x": 10.6,
        "y": 7.6,
        "bearing": 229,
        "fov": 85,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "AP-C5",
        "zoneId": "AP-Z4"
      }
    ],
    "walls": [
      [
        4.5,
        0,
        4.5,
        3.4
      ],
      [
        0,
        5.1,
        3.2,
        5.1
      ],
      [
        4,
        5.1,
        4.3,
        5.1
      ]
    ],
    "doors": [],
    "sensors": [
      {
        "name": "Cabinet state",
        "kind": "Door state",
        "x": 10.6,
        "y": 3.9,
        "id": "AP-S1"
      },
      {
        "name": "Living geometry",
        "kind": "Depth",
        "x": 5.6,
        "y": 3.9,
        "id": "AP-S2"
      },
      {
        "name": "Room light",
        "kind": "Environment",
        "x": 0.3,
        "y": 3.7,
        "id": "AP-S3"
      }
    ],
    "path": [
      [
        4.6,
        7.5
      ],
      [
        4.6,
        4.5
      ],
      [
        5.7,
        4.5
      ],
      [
        7.4,
        4.4
      ],
      [
        8.8,
        3.3
      ],
      [
        8.9,
        4.8
      ],
      [
        7.8,
        6.9
      ],
      [
        5.5,
        5.2
      ],
      [
        3.6,
        4.2
      ]
    ],
    "privacy": "Unoccupied research apartment. The private bath is masked and excluded. No personal data, actual guests or real-home surveillance.",
    "notes": "Assumed plan geometry. A site survey, risk assessment and camera calibration are required before installation.",
    "exclusions": [
      {
        "x": 0,
        "y": 5.1,
        "w": 4.3,
        "h": 2.9,
        "name": "Private bath excluded"
      }
    ]
  },
  "retail": {
    "id": "retail",
    "prefix": "RT",
    "width": 12,
    "depth": 9,
    "description": "Retail shelving, a test checkout counter, demonstration table and stockroom threshold.",
    "fixtures": [
      {
        "kind": "rack",
        "name": "Wall shelving",
        "x": 0.3,
        "y": 0.3,
        "w": 5,
        "h": 0.85,
        "solid": true
      },
      {
        "kind": "rack",
        "name": "Display aisle A",
        "x": 2,
        "y": 2.6,
        "w": 1.1,
        "h": 3.7,
        "solid": true
      },
      {
        "kind": "rack",
        "name": "Display aisle B",
        "x": 5.3,
        "y": 2.6,
        "w": 1.1,
        "h": 3.7,
        "solid": true
      },
      {
        "kind": "counter",
        "name": "Test checkout",
        "x": 9,
        "y": 0.9,
        "w": 2.2,
        "h": 0.8,
        "solid": false
      },
      {
        "kind": "table",
        "name": "Demo table",
        "x": 8.8,
        "y": 4.5,
        "w": 2,
        "h": 1.3,
        "solid": false
      },
      {
        "kind": "cabinet",
        "name": "Stockroom wall",
        "x": 8,
        "y": 7,
        "w": 3.7,
        "h": 1.6,
        "solid": true
      }
    ],
    "zones": [
      {
        "name": "Shelf restock",
        "x": 0.3,
        "y": 1.3,
        "w": 5,
        "h": 1.2,
        "reset": "Vary unbranded packaging, shelf density and label orientation.",
        "hazard": false,
        "id": "RT-Z1",
        "seed": 30
      },
      {
        "name": "Main aisle",
        "x": 3.3,
        "y": 2.7,
        "w": 1.8,
        "h": 3.6,
        "reset": "Stage an inert obstacle and yield before passing.",
        "hazard": false,
        "id": "RT-Z2",
        "seed": 49
      },
      {
        "name": "Demo / handoff",
        "x": 8.3,
        "y": 4,
        "w": 3,
        "h": 2.7,
        "reset": "Handoff an empty shopping bag and folded garment.",
        "hazard": false,
        "id": "RT-Z3",
        "seed": 68
      },
      {
        "name": "Test checkout",
        "x": 8.7,
        "y": 0.5,
        "w": 2.8,
        "h": 2.2,
        "reset": "Use dummy receipts; no payment cards, credentials or personal information.",
        "hazard": false,
        "id": "RT-Z4",
        "seed": 87
      }
    ],
    "cameras": [
      {
        "name": "Entry overview",
        "x": 0.4,
        "y": 8.5,
        "bearing": 317,
        "fov": 87,
        "range": 12,
        "mount": "Perimeter ceiling",
        "height": 3.2,
        "mode": "sector",
        "enabled": true,
        "id": "RT-C1",
        "zoneId": "RT-Z1"
      },
      {
        "name": "Main-aisle context",
        "x": 4.2,
        "y": 7.5,
        "bearing": 270,
        "fov": 55,
        "range": 8,
        "mount": "Perimeter ceiling",
        "height": 3.2,
        "mode": "sector",
        "enabled": true,
        "id": "RT-C2",
        "zoneId": "RT-Z2"
      },
      {
        "name": "Shelf-face view",
        "x": 6.8,
        "y": 0.4,
        "bearing": 146,
        "fov": 79,
        "range": 8,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "RT-C3",
        "zoneId": "RT-Z3"
      },
      {
        "name": "Dummy checkout",
        "x": 11.6,
        "y": 3.1,
        "bearing": 244,
        "fov": 76,
        "range": 5,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "RT-C4",
        "zoneId": "RT-Z4"
      },
      {
        "name": "Product handoff",
        "x": 9.8,
        "y": 5.1,
        "bearing": 0,
        "fov": 90,
        "range": 2.1,
        "mount": "Overhead task station",
        "height": 2.7,
        "mode": "overhead",
        "enabled": true,
        "id": "RT-C5",
        "zoneId": "RT-Z4"
      },
      {
        "name": "Stockroom approach",
        "x": 7.2,
        "y": 8.5,
        "bearing": 293,
        "fov": 77,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "RT-C6",
        "zoneId": "RT-Z4"
      }
    ],
    "walls": [],
    "doors": [],
    "sensors": [
      {
        "name": "Shelf geometry",
        "kind": "Depth",
        "x": 1.4,
        "y": 1.6,
        "id": "RT-S1"
      },
      {
        "name": "Stockroom contact",
        "kind": "Door state",
        "x": 7.5,
        "y": 7.8,
        "id": "RT-S2"
      },
      {
        "name": "Item checkpoint",
        "kind": "Tag reader",
        "x": 8.4,
        "y": 5.7,
        "id": "RT-S3"
      }
    ],
    "path": [
      [
        1.2,
        8.1
      ],
      [
        4.1,
        7.3
      ],
      [
        4.1,
        2
      ],
      [
        7.2,
        2
      ],
      [
        7.4,
        4.9
      ],
      [
        8.2,
        6.2
      ],
      [
        7.4,
        7.6
      ]
    ],
    "privacy": "Closed retail set. Consented adults only. No real transactions, payment information or customer records.",
    "notes": "Assumed plan geometry. A site survey, risk assessment and camera calibration are required before installation.",
    "exclusions": []
  },
  "maintenance": {
    "id": "maintenance",
    "prefix": "MT",
    "width": 9,
    "depth": 6,
    "description": "Isolated tool boards, a low-risk inspection fixture and closed-kit staging.",
    "fixtures": [
      {
        "kind": "rack",
        "name": "Tool board",
        "x": 0.5,
        "y": 0.2,
        "w": 3,
        "h": 0.65,
        "solid": true
      },
      {
        "kind": "workbench",
        "name": "Inspection bench",
        "x": 1.2,
        "y": 2.2,
        "w": 2.6,
        "h": 1.2,
        "solid": false
      },
      {
        "kind": "cabinet",
        "name": "Closed parts storage",
        "x": 7.6,
        "y": 0.5,
        "w": 1,
        "h": 2.8,
        "solid": true
      },
      {
        "kind": "table",
        "name": "Kit staging",
        "x": 5.6,
        "y": 4.3,
        "w": 1.8,
        "h": 1.1,
        "solid": false
      }
    ],
    "zones": [
      {
        "name": "Tool identification",
        "x": 0.4,
        "y": 0.25,
        "w": 3.3,
        "h": 1.5,
        "reset": "Rotate inert tools on the board; record visual identification only.",
        "hazard": false,
        "id": "MT-Z1",
        "seed": 65
      },
      {
        "name": "Fixture inspection",
        "x": 0.9,
        "y": 1.9,
        "w": 3.2,
        "h": 1.8,
        "reset": "Use an isolated cold fixture. No energized electrical or pressure systems.",
        "hazard": false,
        "id": "MT-Z2",
        "seed": 84
      },
      {
        "name": "Closed-kit staging",
        "x": 5.3,
        "y": 4,
        "w": 2.5,
        "h": 1.5,
        "reset": "Move a closed lightweight kit between marked table positions.",
        "hazard": false,
        "id": "MT-Z3",
        "seed": 33
      },
      {
        "name": "Parts organization",
        "x": 6.4,
        "y": 0.5,
        "w": 2.1,
        "h": 3,
        "reset": "Alternate labeled bins and low shelf positions.",
        "hazard": false,
        "id": "MT-Z4",
        "seed": 52
      }
    ],
    "cameras": [
      {
        "name": "Workshop overview",
        "x": 0.35,
        "y": 5.6,
        "bearing": 318,
        "fov": 88,
        "range": 10,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "MT-C1",
        "zoneId": "MT-Z1"
      },
      {
        "name": "Tool-board detail",
        "x": 3.9,
        "y": 0.3,
        "bearing": 145,
        "fov": 78,
        "range": 5,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "MT-C2",
        "zoneId": "MT-Z2"
      },
      {
        "name": "Inspection overhead",
        "x": 2.5,
        "y": 2.8,
        "bearing": 0,
        "fov": 90,
        "range": 1.8,
        "mount": "Overhead task station",
        "height": 2.7,
        "mode": "overhead",
        "enabled": true,
        "id": "MT-C3",
        "zoneId": "MT-Z3"
      },
      {
        "name": "Closed kits",
        "x": 8.6,
        "y": 5.5,
        "bearing": 218,
        "fov": 76,
        "range": 4,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "MT-C4",
        "zoneId": "MT-Z4"
      },
      {
        "name": "Parts approach",
        "x": 6.2,
        "y": 0.3,
        "bearing": 52,
        "fov": 76,
        "range": 5,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "MT-C5",
        "zoneId": "MT-Z4"
      }
    ],
    "walls": [],
    "doors": [],
    "sensors": [
      {
        "name": "Kit checkpoint",
        "kind": "Tag reader",
        "x": 5.6,
        "y": 4.8,
        "id": "MT-S1"
      },
      {
        "name": "Bench depth",
        "kind": "Depth",
        "x": 4.2,
        "y": 2.4,
        "id": "MT-S2"
      },
      {
        "name": "Room light",
        "kind": "Environment",
        "x": 0.3,
        "y": 3.6,
        "id": "MT-S3"
      }
    ],
    "path": [
      [
        4.7,
        5.5
      ],
      [
        4.7,
        3.7
      ],
      [
        4.2,
        1.6
      ],
      [
        2.6,
        1.4
      ],
      [
        4.4,
        1.6
      ],
      [
        6.6,
        3.6
      ],
      [
        6.5,
        5.1
      ]
    ],
    "privacy": "Closed workshop using inert tools and isolated fixtures. No energized work or autonomous repair instruction.",
    "notes": "Assumed plan geometry. A site survey, risk assessment and camera calibration are required before installation.",
    "exclusions": []
  },
  "office": {
    "id": "office",
    "prefix": "OF",
    "width": 11,
    "depth": 8,
    "description": "A meeting table, individual desks, supply shelf and cable-avoidance zone.",
    "fixtures": [
      {
        "kind": "table",
        "name": "Meeting table",
        "x": 1,
        "y": 2.5,
        "w": 3.7,
        "h": 1.8,
        "solid": false
      },
      {
        "kind": "chair",
        "name": "Meeting chair",
        "x": 1.1,
        "y": 1.5,
        "w": 0.7,
        "h": 0.7,
        "solid": false
      },
      {
        "kind": "chair",
        "name": "Meeting chair",
        "x": 3.7,
        "y": 1.5,
        "w": 0.7,
        "h": 0.7,
        "solid": false
      },
      {
        "kind": "desk",
        "name": "Desk A",
        "x": 6.4,
        "y": 0.4,
        "w": 1.8,
        "h": 0.7,
        "solid": false
      },
      {
        "kind": "desk",
        "name": "Desk B",
        "x": 8.6,
        "y": 0.4,
        "w": 1.8,
        "h": 0.7,
        "solid": false
      },
      {
        "kind": "rack",
        "name": "Supply shelf",
        "x": 9.5,
        "y": 4.3,
        "w": 1,
        "h": 2.8,
        "solid": true
      },
      {
        "kind": "chair",
        "name": "Desk chair",
        "x": 7,
        "y": 1.5,
        "w": 0.7,
        "h": 0.7,
        "solid": false
      }
    ],
    "zones": [
      {
        "name": "Meeting reset",
        "x": 0.7,
        "y": 2.2,
        "w": 4.3,
        "h": 2.6,
        "reset": "Reset four dummy notebooks, cups and chairs with no personal information.",
        "hazard": false,
        "id": "OF-Z1",
        "seed": 30
      },
      {
        "name": "Desk organization",
        "x": 6,
        "y": 0.3,
        "w": 4.4,
        "h": 2.4,
        "reset": "Vary desk clutter and screen reflections using powered-off displays.",
        "hazard": false,
        "id": "OF-Z2",
        "seed": 49
      },
      {
        "name": "Supply delivery",
        "x": 8.2,
        "y": 4,
        "w": 2.5,
        "h": 3.3,
        "reset": "Deliver lightweight office supplies and clear the shelf approach.",
        "hazard": false,
        "id": "OF-Z3",
        "seed": 68
      },
      {
        "name": "Cable avoidance",
        "x": 5.7,
        "y": 3.4,
        "w": 2,
        "h": 1.7,
        "reset": "Place inert cable props within the marked test area and pause at the boundary.",
        "hazard": false,
        "id": "OF-Z4",
        "seed": 87
      }
    ],
    "cameras": [
      {
        "name": "Entry-wide",
        "x": 0.4,
        "y": 7.6,
        "bearing": 321,
        "fov": 90,
        "range": 12,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "OF-C1",
        "zoneId": "OF-Z1"
      },
      {
        "name": "Meeting table overhead",
        "x": 2.85,
        "y": 3.4,
        "bearing": 0,
        "fov": 90,
        "range": 2.4,
        "mount": "Overhead task station",
        "height": 2.7,
        "mode": "overhead",
        "enabled": true,
        "id": "OF-C2",
        "zoneId": "OF-Z2"
      },
      {
        "name": "Desk-wide context",
        "x": 10.6,
        "y": 3.5,
        "bearing": 232,
        "fov": 81,
        "range": 7,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "OF-C3",
        "zoneId": "OF-Z3"
      },
      {
        "name": "Supply shelf",
        "x": 7.6,
        "y": 7.6,
        "bearing": 310,
        "fov": 72,
        "range": 6,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "OF-C4",
        "zoneId": "OF-Z4"
      },
      {
        "name": "Cable-route context",
        "x": 5.2,
        "y": 7.6,
        "bearing": 270,
        "fov": 65,
        "range": 7,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "OF-C5",
        "zoneId": "OF-Z4"
      }
    ],
    "walls": [],
    "doors": [],
    "sensors": [
      {
        "name": "Light state",
        "kind": "Environment",
        "x": 0.3,
        "y": 1.3,
        "id": "OF-S1"
      },
      {
        "name": "Desk geometry",
        "kind": "Depth",
        "x": 5.7,
        "y": 2.6,
        "id": "OF-S2"
      },
      {
        "name": "Supply tag",
        "kind": "Tag reader",
        "x": 9.1,
        "y": 5.4,
        "id": "OF-S3"
      }
    ],
    "path": [
      [
        5.6,
        7.5
      ],
      [
        5.6,
        5.2
      ],
      [
        5.2,
        3.4
      ],
      [
        5.3,
        1.7
      ],
      [
        8.8,
        2.5
      ],
      [
        8.5,
        3.7
      ],
      [
        8.7,
        6
      ]
    ],
    "privacy": "Staged office only. Dummy documents, blank screens and no microphones. No employee or client information.",
    "notes": "Assumed plan geometry. A site survey, risk assessment and camera calibration are required before installation.",
    "exclusions": []
  },
  "lobby": {
    "id": "lobby",
    "prefix": "LB",
    "width": 16,
    "depth": 11,
    "description": "Front reception, guest-service seating, luggage staging and a mock lift approach.",
    "fixtures": [
      {
        "kind": "counter",
        "name": "Reception",
        "x": 0.7,
        "y": 1,
        "w": 5.1,
        "h": 1.1,
        "solid": false
      },
      {
        "kind": "sofa",
        "name": "Lounge seating",
        "x": 1.2,
        "y": 5.8,
        "w": 3,
        "h": 0.9,
        "solid": false
      },
      {
        "kind": "sofa",
        "name": "Lounge seating",
        "x": 1.2,
        "y": 8.4,
        "w": 3,
        "h": 0.9,
        "solid": false
      },
      {
        "kind": "table",
        "name": "Lounge table",
        "x": 2,
        "y": 7.1,
        "w": 1.6,
        "h": 0.8,
        "solid": false
      },
      {
        "kind": "rack",
        "name": "Luggage staging",
        "x": 12.8,
        "y": 7,
        "w": 1.6,
        "h": 2.4,
        "solid": false
      },
      {
        "kind": "cart",
        "name": "Luggage cart",
        "x": 10.5,
        "y": 7.6,
        "w": 1.2,
        "h": 1.6,
        "solid": false
      },
      {
        "kind": "lift",
        "name": "Lift approach",
        "x": 12.4,
        "y": 0.4,
        "w": 2.5,
        "h": 2.2,
        "solid": false
      }
    ],
    "zones": [
      {
        "name": "Reception approach",
        "x": 0.7,
        "y": 2.3,
        "w": 5,
        "h": 1.8,
        "reset": "Handoff a dummy information pack; no real reservations or personal data.",
        "hazard": false,
        "id": "LB-Z1",
        "seed": 23
      },
      {
        "name": "Circulation crossing",
        "x": 6.1,
        "y": 3.1,
        "w": 3.6,
        "h": 4.4,
        "reset": "Stage a trained colleague at one of three marked yield positions.",
        "hazard": false,
        "id": "LB-Z2",
        "seed": 42
      },
      {
        "name": "Luggage handling",
        "x": 10.1,
        "y": 6.4,
        "w": 4.8,
        "h": 3.4,
        "reset": "Alternate lightweight suitcase handle height and cart orientation.",
        "hazard": false,
        "id": "LB-Z3",
        "seed": 61
      },
      {
        "name": "Lounge service",
        "x": 0.8,
        "y": 5.3,
        "w": 4,
        "h": 4.3,
        "reset": "Deliver a cold tray to the table, then clear the walkway.",
        "hazard": false,
        "id": "LB-Z4",
        "seed": 80
      },
      {
        "name": "Lift approach",
        "x": 11.8,
        "y": 2.8,
        "w": 3.2,
        "h": 2,
        "reset": "Queue before the isolated mock lift; pause on the marked boundary.",
        "hazard": false,
        "id": "LB-Z5",
        "seed": 29
      }
    ],
    "cameras": [
      {
        "name": "Front-entry overview",
        "x": 7.8,
        "y": 10.5,
        "bearing": 270,
        "fov": 97,
        "range": 15,
        "mount": "Perimeter ceiling",
        "height": 3.6,
        "mode": "sector",
        "enabled": true,
        "id": "LB-C1",
        "zoneId": "LB-Z1"
      },
      {
        "name": "Reception approach",
        "x": 0.4,
        "y": 4.8,
        "bearing": 312,
        "fov": 84,
        "range": 8,
        "mount": "Perimeter ceiling",
        "height": 3.2,
        "mode": "sector",
        "enabled": true,
        "id": "LB-C2",
        "zoneId": "LB-Z2"
      },
      {
        "name": "Lounge context",
        "x": 0.4,
        "y": 10.4,
        "bearing": 314,
        "fov": 81,
        "range": 8,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "LB-C3",
        "zoneId": "LB-Z3"
      },
      {
        "name": "Lift-lobby view",
        "x": 15.5,
        "y": 0.4,
        "bearing": 136,
        "fov": 83,
        "range": 8,
        "mount": "Perimeter ceiling",
        "height": 3.3,
        "mode": "sector",
        "enabled": true,
        "id": "LB-C4",
        "zoneId": "LB-Z4"
      },
      {
        "name": "Luggage staging",
        "x": 15.5,
        "y": 10.5,
        "bearing": 226,
        "fov": 81,
        "range": 7,
        "mount": "Perimeter ceiling",
        "height": 2.7,
        "mode": "sector",
        "enabled": true,
        "id": "LB-C5",
        "zoneId": "LB-Z5"
      },
      {
        "name": "Cross-circulation",
        "x": 6.4,
        "y": 0.4,
        "bearing": 82,
        "fov": 80,
        "range": 13,
        "mount": "Perimeter ceiling",
        "height": 3.5,
        "mode": "sector",
        "enabled": true,
        "id": "LB-C6",
        "zoneId": "LB-Z5"
      }
    ],
    "walls": [],
    "doors": [],
    "sensors": [
      {
        "name": "Front-entry state",
        "kind": "Door state",
        "x": 7.8,
        "y": 10.7,
        "id": "LB-S1"
      },
      {
        "name": "Crossing depth",
        "kind": "Depth",
        "x": 7.4,
        "y": 5.3,
        "id": "LB-S2"
      },
      {
        "name": "Luggage checkpoint",
        "kind": "Tag reader",
        "x": 12.2,
        "y": 6.7,
        "id": "LB-S3"
      }
    ],
    "path": [
      [
        7.9,
        10.1
      ],
      [
        7.7,
        6.8
      ],
      [
        7.6,
        4.5
      ],
      [
        5.2,
        3.4
      ],
      [
        7.6,
        4.5
      ],
      [
        11.3,
        3.3
      ],
      [
        11.1,
        5.7
      ],
      [
        11.4,
        7.1
      ],
      [
        8.7,
        8.7
      ]
    ],
    "privacy": "Closed lobby simulation with adult participants. No real guests, check-in systems, faces of bystanders or reservation details.",
    "notes": "Assumed plan geometry. A site survey, risk assessment and camera calibration are required before installation.",
    "exclusions": []
  }
};
 root.MetariPlans=plans;
 if(typeof module!=="undefined")module.exports=plans;
})(typeof globalThis!=="undefined"?globalThis:this);

