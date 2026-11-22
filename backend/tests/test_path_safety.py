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


def test_extract_zip_safely_valid():
    from app.services.ingestion import extract_zip_safely
    import io
    import zipfile

    # Create in-memory zip
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        zf.writestr("test.py", "print('hello')")
        zf.writestr("sub/data.txt", "123")
    buf.seek(0)

    with tempfile.TemporaryDirectory() as tmp_dir:
        extracted = extract_zip_safely(buf.getvalue(), tmp_dir)
        assert "test.py" in extracted
        assert "sub/data.txt" in extracted
        assert (Path(tmp_dir) / "test.py").exists()
        assert (Path(tmp_dir) / "sub/data.txt").exists()

