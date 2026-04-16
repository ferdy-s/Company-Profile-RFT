import NextAuth from 'next-auth';
import { customFetch } from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';
import { env } from './lib/env';

/**
 * Alihkan fetch OIDC dari origin publik (KEYCLOAK_ISSUER) ke Keycloak di jaringan Docker,
 * agar token / userinfo tidak lewat Cloudflare atau hairpin NAT.
 */
function keycloakInternalProxyFetch(
  publicIssuer: string,
  internalBaseUrl: string
): typeof fetch {
  const publicOrigin = new URL(publicIssuer).origin;
  const internalOrigin = new URL(internalBaseUrl).origin;

  return (input: RequestInfo | URL, init?: RequestInit) => {
    const rewrite = (urlStr: string) =>
      urlStr.startsWith(publicOrigin)
        ? internalOrigin + urlStr.slice(publicOrigin.length)
        : null;

    if (typeof input === 'string') {
      const next = rewrite(input);
      return next ? fetch(next, init) : fetch(input, init);
    }
    if (input instanceof URL) {
      const next = rewrite(input.href);
      return next ? fetch(next, init) : fetch(input, init);
    }
    const next = rewrite(input.url);
    return next
      ? fetch(new Request(next, input), init)
      : fetch(input, init);
  };
}

/**
 * Decode JWT payload tanpa verifikasi signature (hanya untuk extract claims).
 */
function decodeJwtPayload(jwt: string): Record<string, unknown> {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return {};
    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    // Add base64 padding
    while (payload.length % 4) payload += '=';
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

/**
 * Extract roles dari profile (userinfo/ID token) dan fallback ke access token.
 */
function extractRoles(
  profile: unknown,
  accessToken?: string
): string[] {
  const p = profile as {
    realm_access?: { roles?: string[] };
    resource_access?: Record<string, { roles?: string[] }>;
  };

  let realm = p?.realm_access?.roles ?? [];
  const clientId = env.KEYCLOAK_CLIENT_ID;
  let client = clientId ? p?.resource_access?.[clientId]?.roles ?? [] : [];

  // Fallback: decode access_token jika profile tidak mengandung realm_access
  if (realm.length === 0 && accessToken) {
    const decoded = decodeJwtPayload(accessToken) as {
      realm_access?: { roles?: string[] };
      resource_access?: Record<string, { roles?: string[] }>;
    };
    realm = decoded.realm_access?.roles ?? [];
    if (client.length === 0 && clientId) {
      client = decoded.resource_access?.[clientId]?.roles ?? [];
    }
  }

  return [...new Set([...realm, ...client])];
}

function resolveRole(roles: string[]): string {
  if (roles.includes('admin')) return 'admin';
  return roles[0] ?? 'user';
}

/** Masa berlaku sesi login aplikasi (detik). Setelah lewat, user harus login lagi. */
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 1 hari

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Docker, reverse proxy, or IP access: avoids UntrustedHost / "server configuration" errors on /api/auth/*.
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Keycloak({
      clientId: env.KEYCLOAK_CLIENT_ID,
      clientSecret: env.KEYCLOAK_CLIENT_SECRET,
      issuer: env.KEYCLOAK_ISSUER,
      ...(env.KEYCLOAK_WELL_KNOWN
        ? { wellKnown: env.KEYCLOAK_WELL_KNOWN }
        : {}),
      ...(env.KEYCLOAK_INTERNAL_BASE_URL
        ? {
            [customFetch]: keycloakInternalProxyFetch(
              env.KEYCLOAK_ISSUER,
              env.KEYCLOAK_INTERNAL_BASE_URL
            ),
            // Beberapa proxy tidak menyukai Basic auth ke token endpoint; Keycloak menerima POST secret.
            client: {
              token_endpoint_auth_method: 'client_secret_post',
            },
          }
        : {}),
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }

      if (profile || account) {
        token.email = profile?.email ?? token.email;
        token.name = profile?.name ?? token.name;
        const roles = extractRoles(profile, account?.access_token as string | undefined);
        token.role = resolveRole(roles);
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  secret: env.AUTH_SECRET,
});

