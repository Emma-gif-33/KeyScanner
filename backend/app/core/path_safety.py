import os
from pathlib import Path
from typing import Union


def resolve_safe_path(base_dir: Union[str, Path], untrusted_path: Union[str, Path]) -> str:
    """
    Resuelve una ruta relativa dentro de un directorio base permitido y verifica
    estrictamente que el archivo resultante permanezca dentro de los límites del directorio base.
    Utiliza canonicalización con os.path.abspath y validación de prefijo de contención reconocido por CodeQL.
    Previene vulnerabilidades de Path Traversal (CWE-22 / CWE-23 / CWE-36).
    """
    canonical_base = os.path.abspath(str(base_dir))
    canonical_target = os.path.abspath(os.path.join(canonical_base, str(untrusted_path)))

    # Verificación de contención estricta mediante prefijo canónico
    if not canonical_target.startswith(canonical_base + os.sep) and canonical_target != canonical_base:
        raise PermissionError(f"Intento de Path Traversal detectado: '{untrusted_path}' escapa de '{base_dir}'")

    return canonical_target


def is_safe_path(base_dir: Union[str, Path], untrusted_path: Union[str, Path]) -> bool:
    """Verifica si una ruta es segura sin lanzar excepción."""
    try:
        resolve_safe_path(base_dir, untrusted_path)
        return True
    except (PermissionError, ValueError):
        return False
