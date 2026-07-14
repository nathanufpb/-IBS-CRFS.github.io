#!/usr/bin/env python3
"""Generate data/collection-data.js from data/colecao.csv.

Usage:
    python scripts/build_collection.py [--csv data/colecao.csv] [--out data/collection-data.js]

Notes:
- Keep data/colecao.csv only locally; do not commit it.
- The generated JS is what the site uses for the collection table and map.
"""

import argparse
import csv
import json
from pathlib import Path

DEFAULT_INPUT = Path('data/colecao.csv')
DEFAULT_OUTPUT = Path('data/collection-data.js')

FIELDS = [
    'catalogNumber',
    'order',
    'family',
    'genus',
    'scientificName',
    'specificEpithet',
    'stateProvince',
    'municipality',
    'locality',
    'eventDate',
    'preparations',
    'decimalLatitude',
    'decimalLongitude',
]


def load_csv(path: Path):
    with path.open('r', encoding='utf-8') as fh:
        reader = csv.DictReader(fh)
        rows = []
        for row in reader:
            rec = {field: row.get(field, '') for field in FIELDS}
            rows.append(rec)
        return rows


def to_js(data, generated_at: str):
    meta = {
        'generatedAt': generated_at,
        'recordCount': len(data),
    }
    payload = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    meta_json = json.dumps(meta, ensure_ascii=False, separators=(',', ':'))
    return (
        '// Auto-generated. Do not edit manually.\n'
        f'window.COLLECTION_DATA = {payload};\n'
        f'window.COLLECTION_META = {meta_json};\n'
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--csv', type=Path, default=DEFAULT_INPUT, help='Path to colecao.csv (local only)')
    parser.add_argument('--out', type=Path, default=DEFAULT_OUTPUT, help='Path to write collection-data.js')
    args = parser.parse_args()

    if not args.csv.exists():
        raise SystemExit(f'CSV não encontrado: {args.csv}')

    data = load_csv(args.csv)
    js = to_js(data, generated_at=args.csv.stat().st_mtime_ns)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(js, encoding='utf-8')
    print(f'Gerado {args.out} com {len(data)} registros.')


if __name__ == '__main__':
    main()
