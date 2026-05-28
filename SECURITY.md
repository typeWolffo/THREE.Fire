# Security Policy

## Supported Versions

Security fixes are applied to the latest published minor version on npm
(`@wolffo/three-fire`). Older versions are not maintained.

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅        |
| < 1.0   | ❌        |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, report privately via GitHub's
[Security Advisories](https://github.com/typeWolffo/THREE.Fire/security/advisories/new).
If you are unable to use that, you may contact the maintainer through their
GitHub profile at [@typeWolffo](https://github.com/typeWolffo).

Please include:

- A description of the vulnerability and its impact
- Steps to reproduce (a minimal repro is ideal)
- Affected version(s)

You can expect an initial response within a few days. Once the issue is confirmed
and fixed, a patched release will be published and the reporter credited (unless
anonymity is requested).

## Scope

This is a rendering library with no network, filesystem, or authentication
surface. The most relevant concerns are:

- Supply-chain integrity of the published package (mitigated by npm provenance)
- Safe handling of consumer-provided textures and shader parameters
