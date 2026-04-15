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

## Troubleshooting

- **Keycloak won't start**: Check PostgreSQL is healthy and Keycloak database exists
- **Login redirects fail**: Verify redirect URIs in Keycloak client settings
- **Roles not working**: Check user role assignments in Keycloak

