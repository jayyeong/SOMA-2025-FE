"""Reject incomplete CRA builds and assets escaping the 2025 prefix."""
import json
from pathlib import Path
from urllib.parse import unquote, urlparse

root = Path(__file__).resolve().parents[1]
build = root / 'build'
manifest = json.loads((build / 'asset-manifest.json').read_text())
html = (build / 'index.html').read_text()
assert '<div id="root"></div>' in html, 'Missing app root'
assert manifest['entrypoints'], 'Missing entrypoints'
for name, url in manifest['files'].items():
    path = urlparse(url).path
    assert path.startswith('/2025/'), f'Wrong asset prefix: {name}'
    target = (build / unquote(path.removeprefix('/2025/'))).resolve()
    assert target.is_relative_to(build), f'Unsafe asset path: {name}'
    assert target.is_file() and target.stat().st_size, f'Missing asset: {name}'
for entry in manifest['entrypoints']:
    assert f'/2025/{entry}' in html, f'Entry point absent from HTML: {entry}'
for source in (root / 'public').rglob('*'):
    if source.is_file() and source.name != 'index.html':
        target = build / source.relative_to(root / 'public')
        assert target.is_file() and target.stat().st_size == source.stat().st_size, f'Missing public asset: {source}'
print(f'Validated {len(manifest["files"])} bundled assets and public files under /2025/.')
