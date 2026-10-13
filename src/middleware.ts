import { withAuth } from "next-auth/middleware";

/**
 * Auth middleware — protects all API routes that touch user data.
 *
 * Routes NOT matched here (public):
 *   /              – landing page (client-side decides view)
 *   /api/waitlist  – anyone can join
 *   /api/partner/* – partner read-only access (uses its own token)
 *   /api/weekly-content – static pregnancy data
 *   /api/hormone-horoscope – static hormone data
 *   /api/stripe/webhook – Stripe sends this directly
 *   /privacy, /terms – legal pages
 *   /sitemap.xml, /robots.txt, /og-image.png – static assets
 *   /_next/*       – Next.js internals
 */
export default withAuth({
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ token, req }) {
      // Allow all page routes (Next.js pages handle auth client-side)
      if (!req.nextUrl.pathname.startsWith("/api/")) return true;

      // Allow known public API routes
      const publicPaths = [
        "/api/auth",
        "/api/waitlist",
        "/api/partner",
        "/api/weekly-content",
        "/api/hormone-horoscope",
        "/api/stripe/webhook",
      ];
      if (publicPaths.some((p) => req.nextUrl.pathname.startsWith(p))) return true;

      // All other API routes require a valid session token
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, apple-icon.png (icon files)
     * - public assets (og-image.png, etc.)
     * - sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon\.ico|apple-icon\.png|og-image|sitemap\.xml|robots\.txt).*)",
  ],
};
