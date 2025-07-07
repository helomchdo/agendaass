# routes/solicitacoes.py
from flask import Blueprint, jsonify, request
from supabase import create_client, Client
import os
from datetime import datetime

# ------ Conexão ----------------------------------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ------ Blueprint --------------------------------------------------
solicitacoes_bp = Blueprint(
    "solicitacoes",
    __name__,
    url_prefix="/api/solicitacoes"
)

# ------ Helpers ----------------------------------------------------
def _erro_resp(error, status_code=400):
    """Formata erro do Supabase em JSON Flask‑friendly"""
    return jsonify({"error": error.message if hasattr(error, "message") else str(error)}), status_code

# ------ Rotas CRUD -------------------------------------------------
@solicitacoes_bp.route("", methods=["GET"])
def listar_solicitacoes():
    """GET /api/solicitacoes  – lista tudo"""
    resp = supabase.table("solicitacoes").select("*").order("id", desc=True).execute()
    if resp.error:
        return _erro_resp(resp.error, 500)
    return jsonify(resp.data), 200


@solicitacoes_bp.route("/<int:sol_id>", methods=["GET"])
def obter_solicitacao(sol_id):
    """GET /api/solicitacoes/<id>  – item único"""
    resp = (supabase
            .table("solicitacoes")
            .select("*")
            .eq("id", sol_id)
            .single()
            .execute())
    if resp.error:
        return _erro_resp(resp.error, 404)
    return jsonify(resp.data), 200


@solicitacoes_bp.route("", methods=["POST"])
def criar_solicitacao():
    """POST /api/solicitacoes  – cria nova"""
    body = request.get_json() or {}

    # exemplo: se front não mandar data_envio_gi, salvamos agora
    body.setdefault("data_envio_gi", datetime.utcnow().isoformat())
    # situacao tem default 'SOLICITADO' no BD, mas garantimos
    body.setdefault("situacao", "SOLICITADO")

    resp = supabase.table("solicitacoes").insert(body).execute()
    if resp.error:
        return _erro_resp(resp.error)
    return jsonify(resp.data[0]), 201


@solicitacoes_bp.route("/<int:sol_id>", methods=["PUT"])
def atualizar_solicitacao(sol_id):
    """PUT /api/solicitacoes/<id>  – edita"""
    body = request.get_json() or {}
    resp = (supabase
            .table("solicitacoes")
            .update(body)
            .eq("id", sol_id)
            .execute())
    if resp.error:
        return _erro_resp(resp.error)
    return jsonify(resp.data[0]), 200


@solicitacoes_bp.route("/<int:sol_id>", methods=["DELETE"])
def excluir_solicitacao(sol_id):
    """DELETE /api/solicitacoes/<id> – remove"""
    resp = (supabase
            .table("solicitacoes")
            .delete()
            .eq("id", sol_id)
            .execute())
    if resp.error:
        return _erro_resp(resp.error)
    return "", 204   # No Content
