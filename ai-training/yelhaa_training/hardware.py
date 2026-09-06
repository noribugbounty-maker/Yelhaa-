"""
Réglages CPU : nombre de fils et type de flottant.

Tout ici part du principe qu'il n'y a **pas** de GPU. CUDA n'est jamais
sollicité ; `bitsandbytes`, `flash-attn` et `xformers` ne sont ni importés ni
requis. PyTorch CPU ordinaire suffit.
"""

from __future__ import annotations

import os
from typing import Any

THREAD_ENV_VARS = ("OMP_NUM_THREADS", "MKL_NUM_THREADS", "OPENBLAS_NUM_THREADS")


def set_thread_env(threads: int) -> None:
    """
    À appeler **avant** `import torch` : les bibliothèques BLAS lisent ces
    variables à leur chargement. Une valeur déjà posée par l'utilisateur est
    respectée.
    """
    for name in THREAD_ENV_VARS:
        os.environ.setdefault(name, str(threads))
    # Évite l'avertissement oneDNN sur certaines machines Windows sans AVX-512.
    os.environ.setdefault("KMP_DUPLICATE_LIB_OK", "TRUE")


INSTALL_HINT = (
    "pip install torch --index-url https://download.pytorch.org/whl/cpu\n"
    "  pip install -r ai-training/requirements.txt"
)


def missing_dependency_message(error: ModuleNotFoundError) -> str:
    """Message actionnable quand torch / transformers / peft manquent."""
    name = error.name or "une dépendance"
    return f"{name} introuvable — installer les dépendances CPU (README, « Installation ») :\n  {INSTALL_HINT}"


def configure_torch(threads: int) -> Any:
    """Importe torch, fixe les fils et rend le module. Lève ModuleNotFoundError si absent."""
    import torch

    torch.set_num_threads(threads)
    try:
        torch.set_num_interop_threads(max(1, min(2, threads)))
    except RuntimeError:
        # Déjà fixé par un import antérieur : sans conséquence.
        pass
    return torch


def torch_dtype(name: str) -> Any:
    import torch

    return {"float32": torch.float32, "bfloat16": torch.bfloat16}[name]


def describe_environment(torch: Any, threads: int, dtype_name: str) -> str:
    lines = [
        f"  torch            {torch.__version__} (CPU, cuda={'oui' if torch.cuda.is_available() else 'non — attendu'})",
        f"  fils CPU         {threads} (torch.get_num_threads={torch.get_num_threads()}, cpu_count={os.cpu_count()})",
        f"  dtype des poids  {dtype_name}",
    ]
    return "\n".join(lines)


def estimate_weights_gib(parameter_count: int, dtype_name: str) -> float:
    bytes_per = 4 if dtype_name == "float32" else 2
    return parameter_count * bytes_per / (1024 ** 3)
