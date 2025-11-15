// Security headers configuration

export const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'self'",
  ].join("; "),
};

// Content Security Policy builder
export function buildCSP(directives: Record<string, string[]>): string {
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
}

// Security audit checklist
export const securityChecklist = {
  authentication: {
    "JWT tokens stored securely": false,
    "Token refresh implemented": false,
    "Password hashing (bcrypt)": false,
    "Rate limiting on auth endpoints": false,
  },
  authorization: {
    "Role-based access control": false,
    "Resource ownership checks": false,
    "API endpoint protection": false,
  },
  data: {
    "Input validation": false,
    "SQL injection prevention": false,
    "XSS prevention": false,
    "CSRF protection": false,
  },
  transport: {
    "HTTPS enforced": false,
    "Secure cookies": false,
    "HSTS headers": false,
  },
  dependencies: {
    "Dependencies up to date": false,
    "Vulnerability scanning": false,
    "No known CVEs": false,
  },
};

