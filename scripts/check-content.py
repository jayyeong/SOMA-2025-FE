"""Protect exhibition data and media while reorganizing the archive."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
baseline = json.loads((root / 'scripts/content-baseline.json').read_text())
for name in ('members', 'teams'):
    data = (root / f'src/data/{name}.json').read_bytes()
    assert hashlib.sha256(data).hexdigest() == baseline[f'{name}Sha256'], f'{name} content changed'
for path, expected in baseline['assets'].items():
    assert hashlib.sha256((root / 'src' / path).read_bytes()).hexdigest() == expected, f'Member asset changed: {path}'
galleries = json.loads((root / 'src/data/galleries.json').read_text())
assert galleries == baseline['galleries'], 'Gallery order/content changed'
public_paths = []
for gallery in galleries.values():
    public_paths.extend(gallery['images'])
    public_paths.extend(video['thumb'] for video in gallery['videos'])
public_paths.extend(team['poster'] for team in json.loads((root / 'src/data/teams.json').read_text()))
public_paths.extend(f'/2025/lookbook/SOMA2025{i if i else ""}.jpg' for i in range(252))
for path in public_paths:
    assert (root / 'public' / path.removeprefix('/2025/')).is_file(), f'Missing public asset: {path}'
app = (root / 'src/App.js').read_text()
navigation = (root / 'src/data/navigation.js').read_text()
for removed in ('/search', '/store', '/cart', '/checkout', '/admin', '/order-complete'):
    assert removed not in app + navigation, f'Inactive backend route exposed: {removed}'
for file in (root / 'src').rglob('*'):
    if 'legacy' not in file.parts and file.suffix in ('.js', '.jsx'):
        source = file.read_text()
        assert 'require(`' not in source, f'Broad dynamic module import: {file}'
        assert '/legacy/' not in source, f'Inactive code imported: {file}'
print(f'Preserved {baseline["members"]} members, {len(baseline["assets"])} member images, and {len(public_paths)} public media references.')
