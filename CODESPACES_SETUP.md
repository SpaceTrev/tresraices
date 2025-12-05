# GitHub Codespaces Setup for Tres Raíces Site

This guide helps you work on this project from anywhere using VS Code in your browser.

## Quick Start (5 minutes)

### 1. Create a Codespace

**From GitHub.com:**
1. Go to your repository: `https://github.com/SpaceTrev/tresraices`
2. Click the green **Code** button
3. Select **Codespaces** tab
4. Click **Create codespace on main**

**From VS Code Desktop:**
1. Install the **GitHub Codespaces** extension
2. Press `Cmd+Shift+P` → "Codespaces: Create New Codespace"
3. Select `SpaceTrev/tresraices`

### 2. Setup Environment Variables

Once your Codespace starts, create `.env.local`:

```bash
cp .env.example .env.local
```

Then add your Firebase credentials (from your local `.env.local` or Firebase console):

```env
# Firebase Client (public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (server-side)
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'

# Admin Key
NEXT_PUBLIC_ADMIN_KEY=your_admin_key
```

### 3. Start Development

Dependencies are auto-installed via `postCreateCommand`. Just run:

```bash
pnpm dev
```

The dev server will start on port 5173. Codespaces will automatically forward the port and give you a URL.

## Using GitHub Copilot

GitHub Copilot is pre-configured and will auto-suggest code as you type.

### Copilot Chat

- **Inline Chat**: `Cmd+I` (Mac) or `Ctrl+I` (Windows/Linux)
- **Chat Panel**: Click Copilot icon in sidebar or `Cmd+Shift+I`

### Pre-configured Context

The `.github/copilot-instructions.md` file tells Copilot about this project's:
- Architecture (Next.js 15, Firebase, static JSON menus)
- Coding standards (TypeScript, ESM, minimal dependencies)
- Key patterns (PDF parsing, pricing regions, Tailwind utilities)

### Example Prompts

```
@workspace How do I add a new product category?
@workspace Explain the pricing markup flow from PDF to menu page
@workspace Create a new API route to fetch supplier data
```

## Working on Mobile/Tablet

### iOS/iPadOS
1. Install **GitHub** app from App Store
2. Navigate to your repository
3. Tap **Code** → **Codespaces** → **Create**
4. Opens in mobile Safari with VS Code interface

### Android
1. Use GitHub mobile app or browser
2. Same flow as iOS

### Pro Tip
Add Codespaces to your home screen for quick access:
- Safari: Share → Add to Home Screen
- Chrome: Menu → Add to Home Screen

## Recommended Workflow During Migration

### Option A: Quick Edits
1. Open Codespace on your phone/tablet
2. Make small changes via GitHub Copilot Chat
3. Commit directly from Codespace terminal

### Option B: Continue Later
1. **Suspend Codespace**: Close the browser tab (Codespace auto-stops after 30 min)
2. **Resume**: Open same URL or create new Codespace from GitHub
3. Your work persists (files, git state, uncommitted changes)

### Option C: Pair with Local Machine
1. Work in Codespace while traveling
2. `git push` when done
3. `git pull` on local machine when back

## Port Forwarding

Codespaces automatically forwards:
- **5173**: Dev server (Next.js dev mode)
- **3000**: Alternative Next.js port

Access via auto-generated URLs like:
```
https://legendary-space-train-5173.app.github.dev
```

Make them public for testing on other devices:
1. Click **Ports** tab in Codespace
2. Right-click port → **Port Visibility** → **Public**

## Troubleshooting

### Copilot Not Working
- Verify Copilot subscription is active: `https://github.com/settings/copilot`
- Restart Codespace: `Cmd+Shift+P` → "Codespaces: Rebuild Container"

### Environment Variables Missing
- Check `.env.local` exists in workspace root
- Restart dev server after adding new vars

### Slow Performance
- Codespaces use 2-core machines by default
- Upgrade machine type: Repository Settings → Codespaces → Machine type

### Firebase Admin Errors
- Ensure `FIREBASE_SERVICE_ACCOUNT_JSON` is valid JSON (no line breaks)
- Test with: `pnpm exec node scripts/test-firebase.mjs`

## Pricing & Limits

**Free tier** (GitHub Free account):
- 120 core-hours/month (60 hours on 2-core machine)
- 15 GB storage

**Pro tier** (GitHub Pro):
- 180 core-hours/month
- 20 GB storage

**Tips to conserve hours:**
- Stop Codespace when not in use (auto-stops after 30 min idle)
- Use smaller machine types for simple edits
- Delete old Codespaces from `https://github.com/codespaces`

## Alternative: VS Code Remote

If you have a stable server/desktop at home:

1. Install **Remote - SSH** extension in VS Code
2. Configure SSH access to your machine
3. Connect via `Cmd+Shift+P` → "Remote-SSH: Connect to Host"
4. Open `/Users/trevspace/Space/tres-raices-site`

This doesn't count against Codespaces hours but requires your machine to be online.

## Resources

- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces)
- [Copilot in Codespaces](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-in-github-codespaces)
- [Manage Codespaces](https://github.com/codespaces)
