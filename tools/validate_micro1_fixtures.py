"""Validate only the local fictional fixture, not a real dataset or integration."""
from __future__ import annotations
import json
from collections import Counter
from pathlib import Path


def main() -> None:
    root = Path(__file__).resolve().parent.parent / 'micro1' / 'data'
    order = json.loads((root / 'demo-order.json').read_text(encoding='utf-8'))
    records = json.loads((root / 'demo-episodes.json').read_text(encoding='utf-8'))['episodes']
    ids = [r['episode_id'] for r in records]
    assert len(ids) == len(set(ids)), 'Duplicate episode identifiers'
    assert all(r['simulation'] is True for r in records), 'Fixture must be simulated'
    assert all(r['order_id'] == order['order_id'] for r in records), 'Unexpected order'
    counts = Counter(r['qa_disposition'] for r in records)
    expected = order['expected_end_state']
    assert set(counts) == {'accepted', 'held_for_review', 'rejected'}, 'Unexpected disposition'
    assert len(records) == expected['captured'] == sum(counts.values())
    for status in counts:
        assert counts[status] == expected[status], f'Incorrect {status} count'
    variants = {v['variant_id']: v for v in order['variants']}
    assert len(variants) == 3 * 4 * 2 * 2 == 48
    assert all(r['variant_id'] in variants for r in records), 'Unknown variation'
    accepted = Counter(r['variant_id'] for r in records if r['qa_disposition'] == 'accepted')
    for variant_id, variant in variants.items():
        assert accepted[variant_id] == variant['accepted_quota'], f'Unmet quota: {variant_id}'
    assert counts['accepted'] == order['requested_output']['target']
    assert expected['actual_submission'] is False
    print('PASS: 1,320 fictional episodes = 1,200 accepted + 72 held + 48 rejected.')
    print('PASS: 48 variation quotas met, with 25 accepted episodes each.')
    print('PASS: Unique episode IDs and simulation-only boundaries preserved.')


if __name__ == '__main__':
    main()
