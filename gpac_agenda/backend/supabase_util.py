import os
import requests
from typing import Any, Dict, Optional, Tuple, Union

# Configure via variáveis de ambiente
SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")  # ex: https://xyz.supabase.co
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    # Não lançar aqui para evitar break em import; funções abaixo vão retornar erro se faltar config
    pass


def _headers() -> Dict[str, str]:
    return {
        "apikey": SUPABASE_KEY or "",
        "Authorization": f"Bearer {SUPABASE_KEY}" if SUPABASE_KEY else "",
        "Content-Type": "application/json",
        # Prefer = return=representation faz o Supabase retornar o objeto criado/atualizado
        "Prefer": "return=representation",
    }


def sb_request(
    method: str,
    path: str,
    data: Optional[Union[Dict[str, Any], list]] = None,
    params: Optional[Dict[str, Any]] = None,
    timeout: int = 10,
) -> Union[requests.Response, Tuple[Dict[str, Any], int]]:
    """
    Faz uma chamada simples ao Supabase REST (Tabela /rest/v1/<path>).

    - method: 'GET'|'POST'|'PATCH'|'DELETE'
    - path: caminho relativo da tabela/endpoint, ex: "users" ou "users?id=eq.1" ou "users?email=eq.x@x.com"
    - data: payload JSON para POST/PATCH
    Retorno:
      - em caso de sucesso retorna o requests.Response (com .json())
      - em caso de erro retorna ({"error": ...}, status_code)
    """

    if not SUPABASE_URL or not SUPABASE_KEY:
        return ({"error": "Supabase URL or Key not configured"}, 500)

    # monta URL completa
    url = f"{SUPABASE_URL}/rest/v1/{path.lstrip('/')}"
    method = method.upper()

    try:
        if method == "GET":
            resp = requests.get(url, headers=_headers(), params=params, timeout=timeout)
        elif method == "POST":
            resp = requests.post(url, headers=_headers(), json=data, params=params, timeout=timeout)
        elif method == "PATCH":
            resp = requests.patch(url, headers=_headers(), json=data, params=params, timeout=timeout)
        elif method == "DELETE":
            resp = requests.delete(url, headers=_headers(), params=params, timeout=timeout)
        else:
            return ({"error": f"Unsupported HTTP method: {method}"}, 400)
    except requests.RequestException as e:
        return ({"error": "Request failed", "detail": str(e)}, 500)

    # Se o Supabase retornar erro HTTP -> devolve tupla com corpo/texto e status
    if not resp.ok:
        try:
            body = resp.json()
        except Exception:
            body = resp.text
        return ({"error": body}, resp.status_code)

    return resp


# Conveniências comuns (retornam a mesma forma: Response ou (error, status))
def get_users_by_email(email: str):
    return sb_request("GET", f"users?email=eq.{email}")


def create_user(row: Dict[str, Any]):
    # row deve conter os campos corretos da tabela (ex: email, password_hash, username, full_name)
    return sb_request("POST", "users", data=row)


def update_user_by_id(user_id: Any, row: Dict[str, Any]):
    return sb_request("PATCH", f"users?id=eq.{user_id}", data=row)


def delete_user_by_id(user_id: Any):
    return sb_request("DELETE", f"users?id=eq.{user_id}")