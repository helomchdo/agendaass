
from flask import Blueprint, jsonify, request, current_app
from supabase import create_client, Client
import os
from datetime import datetime

# ─── Conexão ──────────────────────────────────────────────────────────────
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ─── Blueprint ────────────────────────────────────────────────────────────
solicitacoes_bp = Blueprint(
    "solicitacoes",
    __name__,
    url_prefix="/api/solicitacoes",
               # aceita /api/solicitacoes e /api/solicitacoes/
)

# ─── Helpers ──────────────────────────────────────────────────────────────
def _erro_resp(exc, status_code=400):
    """Converte exceções Supabase → JSON consistente"""
    msg = getattr(exc, "message", str(exc))
    current_app.logger.error("SUPABASE ERROR: %s", msg)
    return jsonify({"error": msg}), status_code


# ─── Rotas CRUD ───────────────────────────────────────────────────────────
@solicitacoes_bp.route("", methods=["GET"])
def listar_solicitacoes():
    """GET /api/solicitacoes – lista tudo"""
    try:
        resp = (
            supabase.table("solicitacoes")
            .select("*")
            .order("id", desc=True)
            .execute()
        )
        return jsonify(resp.data), 200
    except Exception as exc:
        return _erro_resp(exc, 500)


@solicitacoes_bp.route("/<int:sol_id>", methods=["GET"])
def obter_solicitacao(sol_id):
    """GET /api/solicitacoes/<id> – item único"""
    try:
        resp = (
            supabase.table("solicitacoes")
            .select("*")
            .eq("id", sol_id)
            .single()
            .execute()
        )
        return jsonify(resp.data), 200
    except Exception as exc:
        return _erro_resp(exc, 404)


@solicitacoes_bp.route("", methods=["POST"])
def criar_solicitacao():
    """POST /api/solicitacoes – cria nova"""
    body = request.get_json() or {}
    body.setdefault("data_envio_gi", datetime.utcnow().isoformat())
    body.setdefault("situacao", "SOLICITADO")

    try:
        resp = supabase.table("solicitacoes").insert(body).execute()
        return jsonify(resp.data[0]), 201
    except Exception as exc:
        return _erro_resp(exc)


@solicitacoes_bp.route("/<int:sol_id>", methods=["PUT"])
def atualizar_solicitacao(sol_id):
    """PUT /api/solicitacoes/<id> – edita"""
    body = request.get_json() or {}
    try:
        resp = (
            supabase.table("solicitacoes")
            .update(body)
            .eq("id", sol_id)
            .execute()
        )
        return jsonify(resp.data[0]), 200
    except Exception as exc:
        return _erro_resp(exc)


@solicitacoes_bp.route("/<int:sol_id>", methods=["DELETE"])
def excluir_solicitacao(sol_id):
    """DELETE /api/solicitacoes/<id> – remove"""
    try:
        supabase.table("solicitacoes").delete().eq("id", sol_id).execute()
        return "", 204
    except Exception as exc:
        return _erro_resp(exc)
