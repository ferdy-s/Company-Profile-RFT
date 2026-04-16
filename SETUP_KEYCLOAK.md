# Keycloak Setup Guide

## Prerequisites

1. **Keycloak database**

   On a **fresh** `docker-compose` install, Postgres runs scripts in [`scripts/init-db`](./scripts/init-db), which creates a `keycloak` database automatically.

   If your Postgres volume was created **before** that init script existed, create the database once (Keycloak will not start without it). Option A — Docker:

   ```bash
   docker-compose exec postgres psql -U postgres -c "CREATE DATABASE keycloak;"
   ```

   Option B — local `psql`:

   ```bash
   psql -h localhost -U postgres -c "CREATE DATABASE keycloak;"
   ```

2. Start the Docker services:
   ```bash
   docker-compose up -d
   ```

3. Wait for all services to be healthy (especially PostgreSQL and Keycloak).

## Keycloak Initial Setup

### Step 1: Access Keycloak Admin Console

1. Open your browser and navigate to: `http://localhost:8080`
2. Click on "Administration Console"
3. Login with:
   - Username: `admin` (or your `KEYCLOAK_ADMIN` env var)
   - Password: `admin` (or your `KEYCLOAK_ADMIN_PASSWORD` env var)

### Step 2: Create a Realm

1. Hover over the realm dropdown (top left, shows "Master")
2. Click "Create Realm"
3. Name it: `rft` (or match your `KEYCLOAK_ISSUER` configuration)
4. Click "Create"

### Step 3: Create a Client

1. In the left sidebar, go to "Clients"
2. Click "Create client"
3. Configure:
   - **Client type**: OpenID Connect
   - **Client ID**: `rft-web` (must match `KEYCLOAK_CLIENT_ID` in your .env)
   - Click "Next"
4. **Capability config**:
   - Enable "Client authentication" (confidential client)
   - Enable "Authorization" (optional)
   - Click "Next"
5. **Login settings**:
   - **Root URL**: `http://localhost:3000`
   - **Home URL**: `http://localhost:3000`
   - **Valid redirect URIs**: 
     - `http://localhost:3000/api/auth/callback/keycloak`
     - `http://localhost:3000/*`
   - **Web origins**: `http://localhost:3000`
   - Click "Save"
6. Go to the "Credentials" tab
7. Copy the "Client secret" and add it to your `.env` file as `KEYCLOAK_CLIENT_SECRET`

### Step 4: Create Users and Roles

1. Go to "Users" → "Create new user"
2. Fill in:
   - **Username**: (e.g., `admin`)
   - **Email**: (e.g., `admin@rfttech.com`)
   - Enable "Email verified"
   - Click "Create"
3. Go to the "Credentials" tab
4. Set a password (temporary password, then user will be prompted to change)
5. Go to "Role mapping" tab
6. Click "Assign role"
7. Filter by realm roles
8. Create/assign "admin" role (or use existing roles)

### Step 5: Configure Roles (Optional)

1. Go to "Realm roles"
2. Create roles like: `admin`, `user`, `editor`
3. Assign these roles to users as needed

## Environment Variables

Make sure your `.env` file includes:

```env
KEYCLOAK_CLIENT_ID=rft-web
KEYCLOAK_CLIENT_SECRET=<your-client-secret-from-keycloak>
KEYCLOAK_ISSUER=http://localhost:8080/realms/rft
```

For production, update the issuer URL to your production Keycloak instance.

## Production (rftdigitalsolution.com + Keycloak di subdomain)

Pastikan **Nginx Proxy Manager** sudah mem-proxy:

- `https://keycloak.rftdigitalsolution.com` → container Keycloak (mis. `native_rft_keycloak:8080` di `global-net`, atau host `8095`).

Di **`.env` production** (sudah disetel di repo):

- `KEYCLOAK_ISSUER=https://keycloak.rftdigitalsolution.com/realms/rft`
- `KEYCLOAK_CLIENT_ID=rft-web` (harus sama persis di Keycloak)
- `KEYCLOAK_CLIENT_SECRET=…` (dari tab **Credentials** client di Keycloak)
- **`KEYCLOAK_WELL_KNOWN`** (disarankan di Docker): URL discovery **internal** ke container Keycloak, mis. `http://keycloak:8080/realms/rft/.well-known/openid-configuration`. Di `docker-compose.yml` service `nextjs` sudah ada default ini; ubah path `/realms/...` jika nama realm bukan `rft`. Tanpa ini, Next.js di container sering memanggil URL publik Keycloak dan mendapat status non-200 → error Auth.js *Authorization Server Metadata* / login `Configuration`.

### Langkah ringkas di Keycloak Admin

1. Buka konsol admin: `https://keycloak.rftdigitalsolution.com/admin` (login pakai `KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD`).
2. **Realm** `rft`: buat jika belum ada (nama harus sama dengan path di `KEYCLOAK_ISSUER`: `/realms/rft`).
3. **Clients** → client **OpenID Connect** dengan Client ID **`rft-web`**:
   - **Client authentication**: ON (confidential).
   - **Valid redirect URIs** (wajib):
     - `https://rftdigitalsolution.com/api/auth/callback/keycloak`
     - `https://rftdigitalsolution.com/*` (opsional tapi praktis)
   - **Web origins**: `https://rftdigitalsolution.com`
   - Simpan, lalu di tab **Credentials** salin **Client secret** → isi `KEYCLOAK_CLIENT_SECRET` di `.env` → `docker compose up -d --force-recreate nextjs`.
4. **Realm roles**: buat role `admin` (dan lainnya jika perlu).
5. **Users**: buat user admin → **Role mapping** → assign role **`admin`** (kode app menganggap admin dari role ini).

### Cek cepat dari server (Next bisa reach Keycloak)

Dari host atau container Next:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" "https://keycloak.rftdigitalsolution.com/realms/rft/.well-known/openid-configuration"
```

Harus **200**. Kalau bukan 200, perbaiki proxy / DNS / TLS dulu — tanpa ini login akan `Configuration`.

## Troubleshooting

- **Log Next.js: `"response" is not a conform Authorization Server Metadata response (unexpected HTTP status code)`**  
  Proses login mem-fetch `.../.well-known/openid-configuration` dan mendapat HTTP bukan 200 (atau bukan JSON metadata). Dari **dalam container** `native_rft_web`, cek:  `curl -sS -o /dev/null -w "%{http_code}\n" "https://keycloak.rftdigitalsolution.com/realms/rft/.well-known/openid-configuration"`  
  Jika bukan 200, set **`KEYCLOAK_WELL_KNOWN`** ke URL internal (lihat bagian production di atas), lalu `docker compose up -d --force-recreate nextjs`. Pastikan **`KC_HOSTNAME`** Keycloak = hostname publik (`keycloak.rftdigitalsolution.com`) agar field `issuer` di metadata sama dengan `KEYCLOAK_ISSUER`.

- **Keycloak won't start**: Check PostgreSQL is healthy and Keycloak database exists
- **Login redirects fail**: Verify redirect URIs in Keycloak client settings
- **Roles not working**: Check user role assignments in Keycloak

