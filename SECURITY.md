# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability in the SamaySetu platform (either in the live deployment or in the documentation), please report it responsibly.

### How to Report

1. **Do NOT** open a public issue for security vulnerabilities
2. Open a **private security advisory** using GitHub's built-in security advisory feature
3. Alternatively, reach out via the contact information provided in the repository

### What to Include

- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact assessment
- Suggested mitigation (if any)

### Response Timeline

| Phase | Timeline |
|-------|----------|
| Acknowledgment | Within 48 hours |
| Initial Assessment | Within 5 business days |
| Resolution Plan | Within 10 business days |
| Patch Deployment | Depends on severity |

### Scope

The following are in scope for security reports:

- ✅ Authentication and authorization bypasses
- ✅ Data exposure vulnerabilities
- ✅ Injection attacks (SQL, XSS, etc.)
- ✅ Cryptographic weaknesses
- ✅ Rate limiting bypasses

The following are out of scope:

- ❌ Denial of Service (DoS) attacks
- ❌ Social engineering
- ❌ Physical security
- ❌ Issues in third-party dependencies (report to the dependency maintainer instead)

---

## Security Measures

For a detailed overview of the security architecture, see [docs/security.md](docs/security.md).
