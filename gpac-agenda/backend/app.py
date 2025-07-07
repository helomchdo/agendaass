from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

app = Flask(
    __name__,
    static_folder='static',
    static_url_path=''
)

from routes.solicitacoes import solicitacoes_bp

app.register_blueprint(solicitacoes_bp)

# CORS liberado
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Serve o index.html na raiz
@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

# Serve arquivos estáticos (JS, CSS, imagens etc.)
@app.route('/api/<path:path>')
def api_404(path):
    return jsonify({"error": "Resource not found"}), 404

@app.route('/<path:path>')
def serve_static_file(path):
    return send_from_directory(app.static_folder, path)


# Exemplo de rota da API (saúde do sistema)
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"}), 200

# Inicialização padrão
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
