
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json


class SmartFinderHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/api/profil":
            self.send_error(404, "Endpoint tidak ditemukan")
            return

        try:
            panjang = int(self.headers.get("Content-Length", 0))
            data = json.loads(self.rfile.read(panjang))

            wajib = ["nama", "kampus", "prodi", "semester"]
            if not all(str(data.get(k, "")).strip() for k in wajib):
                self.kirim_json(400, {
                    "success": False,
                    "message": "Semua data profil wajib diisi."
                })
                return

            self.kirim_json(200, {
                "success": True,
                "message": "Data profil berhasil diterima server."
            })

        except (ValueError, json.JSONDecodeError):
            self.kirim_json(400, {
                "success": False,
                "message": "Data yang dikirim tidak valid."
            })

    def kirim_json(self, status, data):
        isi = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(isi)))
        self.end_headers()
        self.wfile.write(isi)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8000), SmartFinderHandler)
    print("SmartFinder berjalan di http://127.0.0.1:8000")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer dihentikan.")
    finally:
        server.server_close()
