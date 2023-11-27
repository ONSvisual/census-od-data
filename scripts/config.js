export const ni_codes = {
    "N99999991": "N09000001",
    "N99999992": "N09000002",
    "N99999993": "N09000003",
    "N99999994": "N09000004",
    "N99999995": "N09000005",
    "N99999996": "N09000006",
    "N99999997": "N09000007",
    "N99999998": "N09000008",
    "N99999910": "N09000009",
    "N99999911": "N09000010",
    "N99999912": "N09000011"
};

export const inputs = [
    {geo: "msoa", filename: "ODMG01EW_MSOA", from: "Migrant MSOA one year ago code", to: "Middle layer Super Output Areas code", ppd: 20},
    {geo: "lad", filename: "ODMG01EW_LTLA", from: "Migrant LTLA one year ago code", to: "Lower tier local authorities code"},
    {geo: "msoa", filename: "ODWP01EW_MSOA", from: "Middle layer Super Output Areas code", to: "MSOA of workplace code", ppd: 100},
    {geo: "lad", filename: "ODWP01EW_LTLA", from: "Lower tier local authorities code", to: "LTLA of workplace code"},
]

export const geos = {
    "msoa": {input: "MSOA", from: "Middle layer Super Output Areas code", to: "MSOA of workplace code"},
    "lad": {input: "LTLA", from: "Lower tier local authorities code", to: "LTLA of workplace code"}
};