#!/usr/bin/env python3
"""Fail if the Supabase service-role key can reach browser code.

The previous rule was a path allowlist: a reference was allowed only in
`*.server.ts` or under `src/server*`. TanStack Start puts server handlers in
the same file as the route, as

    export const Route = createFileRoute("/x")({
      server: { handlers: { POST: async () => { ...process.env... } } },
    })

so a legitimate server-only handler sits under `src/routes/` and tripped the
check. Widening the allowlist to all of `src/routes/**` would be the wrong fix,
because that is exactly where browser code lives.

Instead a reference is allowed only when it is lexically inside a `server:`
block of a `createFileRoute` call, which is the part the client build drops.
Everything else fails, as before.

This is still a source-level heuristic. The authoritative check is the scan of
the built client bundle in build-check.yml: if the key's name appears in what is
actually shipped to browsers, that fails regardless of what this script thinks.
"""
import re
import subprocess
import sys

PATTERN = "SUPABASE_SERVICE_ROLE"


def ripgrep_files() -> list[str]:
    """Every tracked TS/TSX file under src mentioning the key."""
    out = subprocess.run(
        ["grep", "-rlE", PATTERN, "src", "--include=*.ts", "--include=*.tsx"],
        capture_output=True, text=True,
    )
    return [p for p in out.stdout.split("\n") if p.strip()]


def path_is_server_only(path: str) -> bool:
    return path.endswith(".server.ts") or path.startswith("src/server")


def server_block_spans(src: str) -> list[tuple[int, int]]:
    """Character spans of each `server: {` block, matched by brace depth."""
    spans = []
    for m in re.finditer(r"\bserver\s*:\s*\{", src):
        depth, i = 0, m.end() - 1
        while i < len(src):
            if src[i] == "{":
                depth += 1
            elif src[i] == "}":
                depth -= 1
                if depth == 0:
                    spans.append((m.start(), i))
                    break
            i += 1
    return spans


def main() -> int:
    failures = []
    for path in ripgrep_files():
        if path_is_server_only(path):
            continue
        src = open(path, encoding="utf-8").read()
        spans = server_block_spans(src) if "createFileRoute" in src else []
        for m in re.finditer(PATTERN, src):
            if not any(a <= m.start() <= b for a, b in spans):
                line = src[: m.start()].count("\n") + 1
                failures.append(f"{path}:{line}")

    for f in failures:
        print(f"::error file={f.split(':')[0]},line={f.split(':')[1]}::"
              f"Service-role key referenced outside a server-only module or a "
              f"createFileRoute server handler")
    if failures:
        print(f"{len(failures)} disallowed service-role reference(s).")
        return 1
    print("Service-role key is referenced only in server-only code.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
