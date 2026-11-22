import tempfile
from pathlib import Path
import pytest
from app.core.path_safety import is_safe_path, resolve_safe_path


def test_resolve_safe_path_valid():
    with tempfile.TemporaryDirectory() as tmp_dir:
        base = Path(tmp_dir)
        sub_file = "extracted/manifest.txt"
        safe_path = resolve_safe_path(base, sub_file)
        assert Path(safe_path) == (base / sub_file).resolve()
        assert is_safe_path(base, sub_file) is True


def test_resolve_safe_path_directory_traversal():
    with tempfile.TemporaryDirectory() as tmp_dir:
        base = Path(tmp_dir)

        malicious_paths = [
            "../etc/passwd",
            "../../windows/win.ini",
            "extracted/../../secret.txt",
            "foo/bar/../../../escaped.py",
        ]

        for mal_path in malicious_paths:
            assert is_safe_path(base, mal_path) is False
            with pytest.raises(PermissionError) as exc_info:
                resolve_safe_path(base, mal_path)
            assert "Intento de Path Traversal detectado" in str(exc_info.value)
