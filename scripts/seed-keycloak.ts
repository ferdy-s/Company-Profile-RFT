/**
 * Keycloak Seed Script
 * ====================
 * Otomatis setup realm, client, role, dan user di Keycloak.
 *
 * Usage:
 *   npx tsx scripts/seed-keycloak.ts
 *
 * Prerequisites:
 *   - Keycloak harus running di http://localhost:8080
 *   - Docker dev services: docker-compose -f docker-compose.dev.yml up -d
 */

const KEYCLOAK_BASE = process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080';
const ADMIN_USER = process.env.KEYCLOAK_ADMIN || 'admin';
const ADMIN_PASS = process.env.KEYCLOAK_ADMIN_PASSWORD || 'K3y_Adm1n_Rul3z!2026';

const REALM_NAME = 'rft';
const CLIENT_ID = 'rft-web';
const APP_URL = 'http://localhost:3000';

// User yang akan dibuat
const SEED_USERS = [
  {
    username: 'admin',
    email: 'admin@rftdigital.com',
    firstName: 'Admin',
    lastName: 'RFT',
    password: 'Admin@RFT2026',
    roles: ['admin'],
  },
];

// -------------------------------------------------------------------

async function getAdminToken(): Promise<string> {
  const res = await fetch(
    `${KEYCLOAK_BASE}/realms/master/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: 'admin-cli',
        username: ADMIN_USER,
        password: ADMIN_PASS,
      }),
    }
  );
  if (!res.ok) throw new Error(`Failed to get admin token: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

function headers(token: string, json = true) {
  const h: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

// -------------------------------------------------------------------
// Realm
// -------------------------------------------------------------------
async function ensureRealm(token: string) {
  const res = await fetch(`${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}`, {
    headers: headers(token, false),
  });
  if (res.ok) {
    console.log(`✓ Realm "${REALM_NAME}" sudah ada`);
    return;
  }
  console.log(`→ Membuat realm "${REALM_NAME}"...`);
  const create = await fetch(`${KEYCLOAK_BASE}/admin/realms`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      realm: REALM_NAME,
      enabled: true,
      displayName: 'RFT Digital Solution',
    }),
  });
  if (!create.ok) throw new Error(`Gagal buat realm: ${create.status}`);
  console.log(`✓ Realm "${REALM_NAME}" berhasil dibuat`);
}

// -------------------------------------------------------------------
// Client
// -------------------------------------------------------------------
async function ensureClient(token: string): Promise<string> {
  // Check existing
  const res = await fetch(
    `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/clients?clientId=${CLIENT_ID}`,
    { headers: headers(token, false) }
  );
  const clients = await res.json();

  const clientConfig = {
    clientId: CLIENT_ID,
    name: 'RFT Web Application',
    enabled: true,
    protocol: 'openid-connect',
    publicClient: false,
    clientAuthenticatorType: 'client-secret',
    directAccessGrantsEnabled: true,
    standardFlowEnabled: true,
    rootUrl: APP_URL,
    baseUrl: APP_URL,
    redirectUris: [
      `${APP_URL}/api/auth/callback/keycloak`,
      `${APP_URL}/*`,
    ],
    webOrigins: [APP_URL, '+'],
    attributes: {
      'post.logout.redirect.uris': `${APP_URL}/*`,
    },
  };

  if (clients.length > 0) {
    const internalId = clients[0].id;
    console.log(`✓ Client "${CLIENT_ID}" sudah ada (${internalId})`);

    // Update redirect URIs
    await fetch(
      `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/clients/${internalId}`,
      {
        method: 'PUT',
        headers: headers(token),
        body: JSON.stringify(clientConfig),
      }
    );
    console.log(`  → Redirect URIs diperbarui`);

    // Get secret
    const secretRes = await fetch(
      `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/clients/${internalId}/client-secret`,
      { headers: headers(token, false) }
    );
    const { value: secret } = await secretRes.json();
    console.log(`  → Client Secret: ${secret}`);
    return internalId;
  }

  // Create new client
  console.log(`→ Membuat client "${CLIENT_ID}"...`);
  const create = await fetch(
    `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/clients`,
    {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(clientConfig),
    }
  );
  if (!create.ok) throw new Error(`Gagal buat client: ${create.status}`);

  // Get the created client
  const newRes = await fetch(
    `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/clients?clientId=${CLIENT_ID}`,
    { headers: headers(token, false) }
  );
  const newClients = await newRes.json();
  const internalId = newClients[0].id;

  // Get secret
  const secretRes = await fetch(
    `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/clients/${internalId}/client-secret`,
    { headers: headers(token, false) }
  );
  const { value: secret } = await secretRes.json();

  console.log(`✓ Client "${CLIENT_ID}" berhasil dibuat`);
  console.log(`  → Client Secret: ${secret}`);
  console.log(`  ⚠ Pastikan KEYCLOAK_CLIENT_SECRET di .env = ${secret}`);
  return internalId;
}

// -------------------------------------------------------------------
// Protocol Mappers (agar realm_access muncul di ID token & userinfo)
// -------------------------------------------------------------------
async function ensureRoleMappers(token: string, clientInternalId: string) {
  // Check existing mappers
  const res = await fetch(
    `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/clients/${clientInternalId}/protocol-mappers/models`,
    { headers: headers(token, false) }
  );
  const mappers = await res.json();
  const hasRealmMapper = (mappers as { name: string }[]).some(
    (m) => m.name === 'realm roles'
  );

  if (hasRealmMapper) {
    console.log('✓ Protocol mapper "realm roles" sudah ada');
    return;
  }

  console.log('→ Menambahkan protocol mapper "realm roles"...');
  const create = await fetch(
    `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/clients/${clientInternalId}/protocol-mappers/models`,
    {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({
        name: 'realm roles',
        protocol: 'openid-connect',
        protocolMapper: 'oidc-usermodel-realm-role-mapper',
        config: {
          'claim.name': 'realm_access.roles',
          'jsonType.label': 'String',
          multivalued: 'true',
          'id.token.claim': 'true',
          'access.token.claim': 'true',
          'userinfo.token.claim': 'true',
          'introspection.token.claim': 'true',
        },
      }),
    }
  );
  if (!create.ok && create.status !== 409) {
    throw new Error(`Gagal buat mapper: ${create.status}`);
  }
  console.log('✓ Protocol mapper "realm roles" berhasil ditambahkan');
}

// -------------------------------------------------------------------
// Roles
// -------------------------------------------------------------------
async function ensureRole(token: string, roleName: string) {
  const res = await fetch(
    `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/roles/${roleName}`,
    { headers: headers(token, false) }
  );
  if (res.ok) {
    console.log(`✓ Role "${roleName}" sudah ada`);
    return;
  }

  console.log(`→ Membuat role "${roleName}"...`);
  const create = await fetch(
    `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/roles`,
    {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ name: roleName, description: `${roleName} role` }),
    }
  );
  if (!create.ok && create.status !== 409)
    throw new Error(`Gagal buat role: ${create.status}`);
  console.log(`✓ Role "${roleName}" berhasil dibuat`);
}

// -------------------------------------------------------------------
// Users
// -------------------------------------------------------------------
async function ensureUser(
  token: string,
  user: (typeof SEED_USERS)[0]
) {
  // Check existing
  const res = await fetch(
    `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/users?username=${user.username}&exact=true`,
    { headers: headers(token, false) }
  );
  const users = await res.json();

  let userId: string;

  if (users.length > 0) {
    userId = users[0].id;
    console.log(`✓ User "${user.username}" sudah ada (${userId})`);
  } else {
    console.log(`→ Membuat user "${user.username}"...`);
    const create = await fetch(
      `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/users`,
      {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          enabled: true,
          emailVerified: true,
        }),
      }
    );
    if (!create.ok) throw new Error(`Gagal buat user: ${create.status}`);

    // Get user ID
    const newRes = await fetch(
      `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/users?username=${user.username}&exact=true`,
      { headers: headers(token, false) }
    );
    const newUsers = await newRes.json();
    userId = newUsers[0].id;
    console.log(`✓ User "${user.username}" berhasil dibuat (${userId})`);
  }

  // Set password
  await fetch(
    `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/users/${userId}/reset-password`,
    {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify({
        type: 'password',
        value: user.password,
        temporary: false,
      }),
    }
  );
  console.log(`  → Password di-set`);

  // Assign roles
  for (const roleName of user.roles) {
    const roleRes = await fetch(
      `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/roles/${roleName}`,
      { headers: headers(token, false) }
    );
    if (!roleRes.ok) {
      console.log(`  ⚠ Role "${roleName}" tidak ditemukan, skip`);
      continue;
    }
    const role = await roleRes.json();

    await fetch(
      `${KEYCLOAK_BASE}/admin/realms/${REALM_NAME}/users/${userId}/role-mappings/realm`,
      {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify([role]),
      }
    );
    console.log(`  → Role "${roleName}" di-assign`);
  }
}

// -------------------------------------------------------------------
// Main
// -------------------------------------------------------------------
async function main() {
  console.log('🔑 Keycloak Seed Script');
  console.log('=======================\n');

  // Wait for Keycloak
  console.log(`Menghubungi Keycloak di ${KEYCLOAK_BASE}...`);
  let retries = 10;
  while (retries > 0) {
    try {
      const res = await fetch(`${KEYCLOAK_BASE}/realms/master`);
      if (res.ok) break;
    } catch {
      // ignore
    }
    retries--;
    if (retries === 0) {
      console.error('❌ Keycloak tidak bisa dihubungi. Pastikan sudah running.');
      process.exit(1);
    }
    console.log(`  Menunggu Keycloak... (${retries} percobaan tersisa)`);
    await new Promise((r) => setTimeout(r, 3000));
  }
  console.log('✓ Keycloak terhubung\n');

  const token = await getAdminToken();
  console.log('✓ Admin token diperoleh\n');

  // 1. Realm
  await ensureRealm(token);

  // 2. Client
  const clientInternalId = await ensureClient(token);

  // 2b. Protocol Mappers (realm roles di ID token)
  await ensureRoleMappers(token, clientInternalId);

  // 3. Roles
  const allRoles = [...new Set(SEED_USERS.flatMap((u) => u.roles))];
  for (const role of allRoles) {
    await ensureRole(token, role);
  }

  // 4. Users
  console.log('');
  for (const user of SEED_USERS) {
    await ensureUser(token, user);
    console.log('');
  }

  console.log('=======================');
  console.log('🎉 Keycloak seed selesai!\n');
  console.log('Akses login:');
  for (const u of SEED_USERS) {
    console.log(`  Username : ${u.username}`);
    console.log(`  Password : ${u.password}`);
    console.log(`  Role     : ${u.roles.join(', ')}`);
    console.log('');
  }
  console.log(`Login di: ${APP_URL}/login`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
