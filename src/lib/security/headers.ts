/**
 * Centralized security headers. Applied in middleware and next.config headers().
 */

export function securityHeaders(): Record<string, string> {
  return {
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "accelerometer=(), autoplay=(), camera=(self), clipboard-read=(self), clipboard-write=(self), " +
      "display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), " +
      "magnetometer=(), microphone=(self), midi=(), payment=(), picture-in-picture=(), usb=(), " +
      "screen-wake-lock=(), web-share=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-DNS-Prefetch-Control": "on",
    "X-Permitted-Cross-Domain-Policies": "none",
  };
}
