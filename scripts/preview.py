"""Preview the production build at /2025/, including SPA deep links."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, unquote

DIST = Path(__file__).resolve().parents[1] / 'build'


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST), **kwargs)

    def do_GET(self):
        path = unquote(urlsplit(self.path).path)
        if path in ('/', '/2025'):
            self.send_response(302)
            self.send_header('Location', '/2025/')
            self.end_headers()
            return
        if not path.startswith('/2025/'):
            self.send_error(404)
            return
        relative = path[len('/2025/'):]
        if '..' in Path(relative).parts:
            self.send_error(404)
            return
        if not Path(relative).suffix:
            self.path = '/index.html'
        else:
            self.path = self.path[len('/2025'):]
        super().do_GET()


if __name__ == '__main__':
    if not (DIST / 'index.html').is_file():
        raise SystemExit('Run npm run build first.')
    print('Preview: http://localhost:4175/2025/', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 4175), Handler).serve_forever()
