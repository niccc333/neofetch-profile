<div align="center">
  <h1 style="font-size: 28px; margin: 10px 0;">GitHub Neofetch Profile</h1>
  <p>Generate a retro terminal-style stats card for your GitHub profile README — just like <a href="https://github.com/dylanaraps/neofetch">Neofetch</a>, but for GitHub!</p>
</div>

<div align="center">
  <img src="./assets/github-profile-dark.png" alt="Dark Mode">
  <p>Dark mode</p>
</div>
<div align="center">
  <img src="./assets/github-profile-light.png" alt="Light Mode">
  <p>Light mode</p>
</div>
<div align="center">
  <img src="./assets/color-light.png" alt="Light Mode">
  <p>Color light mode</p>
</div>
<div align="center">
  <img src="./assets/custom-color.png" alt="Light Mode">
  <p>Custom colors</p>
</div>
<div align="center">
  <img src="./assets/pikachu-dark.png" alt="Light Mode">
  <p>Custom PNG</p>
</div>
<div align="center">
  <img src="./assets/svg-dark.png" alt="Light Mode">
  <p>SVG</p>
</div>

## Features

- **ASCII Avatar** — Your GitHub profile picture converted to ASCII art
- **Real-time Stats** — Repos, stars, commits, followers, and lines of code
- **Dark/Light Themes** — Automatically matches the viewer's GitHub theme
- **Fully Customizable** — Add your own sections via JSON config
- **No Setup Required** — Just add the URL to your README

## Table of Contents

- [Quick Start](#quick-start)
- [Add to Your GitHub Profile](#add-to-your-github-profile)
- [Dark/Light Mode Support](#darklight-mode-support)
- [Parameters](#parameters)
- [Custom Configuration](#custom-configuration)
- [Deploy Your Own](#deploy-your-own)
- [Local Development](#local-development)

## Quick Start

Add this to your GitHub profile README:

```markdown
![Neofetch Stats](https://neofetch-profile.vercel.app/api?username=YOUR_USERNAME)
```

Replace `YOUR_USERNAME` with your GitHub username. That's it!

## Add to Your GitHub Profile

### Step 1: Create Your Profile Repository

If you don't have one yet, create a repository with the **same name as your GitHub username** (e.g., `username/username`). This is a special repository — its `README.md` appears on your GitHub profile page.

### Step 2: Add the Card to Your README

Edit your profile `README.md` and add:

```markdown
![Neofetch Stats](https://neofetch-profile.vercel.app/api?username=YOUR_USERNAME)
```

### Step 3: Commit and View

Commit the changes and visit your GitHub profile. Your neofetch card will appear!

## Dark/Light Mode Support

GitHub users can choose dark or light themes. Use the `<picture>` element to automatically show the right theme:

```html
<a href="https://github.com/jeantimex/neofetch-profile">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://neofetch-profile.vercel.app/api?username=[YOUR_USERNAME]&theme=github-dark">
    <img alt="Neofetch Profile" src="https://neofetch-profile.vercel.app/api?username=[YOUR_USERNAME]&theme=github-light">
  </picture>
</a>
```

### Centered Version

```html
<p align="center">
  <a href="https://github.com/jeantimex/neofetch-profile">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://neofetch-profile.vercel.app/api?username=[YOUR_USERNAME]&theme=github-dark">
      <img alt="Neofetch Profile" src="https://neofetch-profile.vercel.app/api?username=[YOUR_USERNAME]&theme=github-light">
    </picture>
  </a>
</p>
```

### With Custom Config

When using a config URL, **URL-encode** the config parameter:

```html
<p align="center">
  <a href="https://github.com/jeantimex/neofetch-profile">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://neofetch-profile.vercel.app/api?username=[YOUR_USERNAME]&theme=github-dark&config=[YOUR_CONFIG_JSON_FILE_URL]">
      <img alt="Neofetch Profile" src="https://neofetch-profile.vercel.app/api?username=[YOUR_USERNAME]&theme=github-light&config=[YOUR_CONFIG_JSON_FILE_URL]">
    </picture>
  </a>
</p>
```

## Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `username` | Your GitHub username (required) | — |
| `theme` | `github-dark` or `github-light` | `github-dark` |
| `config` | URL to a JSON config file | — |

### Examples

```
# Basic
https://neofetch-profile.vercel.app/api?username=jeantimex

# Light theme
https://neofetch-profile.vercel.app/api?username=jeantimex&theme=github-light

# With custom config (URL-encoded for GitHub README)
https://neofetch-profile.vercel.app/api?username=jeantimex&theme=github-dark&config=https%3A%2F%2Fraw.githubusercontent.com%2Fjeantimex%2Fneofetch-profile%2Fmain%2Fpublic%2Fconfig.json
```

> **Tip:** Use [urlencoder.org](https://www.urlencoder.org/) to encode your config URL.

## Custom Configuration

Want to customize the info displayed? Host a JSON config file and pass its URL.

### Step 1: Create Config File

Create `neofetch.json` in your profile repository:

```json
{
  "sections": [
    {
      "title": "{{username}}@github",
      "fields": [
        { "key": "Name", "value": "{{name}}" },
        { "key": "Location", "value": "{{location}}" },
        { "key": "Created", "value": "{{created}}" },
        { "key": "Uptime", "value": "{{uptime}}" },
        { "key": "Company", "value": "{{company}}" }
      ]
    },
    {
      "fields": [
        { "key": "Languages", "value": "{{languages}}" },
        { "key": "IDE", "value": "Cursor, VSCode, Neovim" }
      ]
    },
    {
      "fields": [
        { "key": "Hobbies.Software", "value": "WebGL, WebGPU, AI/ML" },
        { "key": "Hobbies.Hardware", "value": "Mechanical Keyboards" }
      ]
    },
    {
      "title": "- Contact",
      "fields": [
        { "key": "Email", "value": "{{email}}" },
        { "key": "Website", "value": "https://github.com/{{username}}" },
        { "key": "Twitter", "value": "{{twitter}}" }
      ]
    }
  ],
  "stats": {
    "title": "- GitHub Stats",
    "rows": [
      { "left": { "key": "Repos", "value": "{{repos}}" }, "right": { "key": "Stars", "value": "{{stars}}" } },
      { "left": { "key": "Following", "value": "{{following}}" }, "right": { "key": "Followers", "value": "{{followers}}" } },
      { "left": { "key": "Commits", "value": "{{commits}}" }, "right": { "key": "Forks", "value": "{{forks}}" } },
      { "left": { "key": "Issues", "value": "{{issues}}" }, "right": { "key": "PRs", "value": "{{prs}}" } },
      "loc"
    ]
  }
}
```

### Step 2: Get the Raw URL

After committing, get the raw URL:

```
https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/main/neofetch.json
```

### Step 3: Add Config Parameter

**Important:** URL-encode the config URL for GitHub README compatibility.

```markdown
![Neofetch Stats](https://neofetch-profile.vercel.app/api?username=YOUR_USERNAME&config=https%3A%2F%2Fraw.githubusercontent.com%2FYOUR_USERNAME%2FYOUR_GITHUB_PROJECT%2Fmain%2Fconfig.json)
```

### Template Variables

Use these variables in your config to pull data from GitHub automatically:

| Variable | Description | Example Output |
|----------|-------------|----------------|
| `{{username}}` | GitHub username | `jeantimex` |
| `{{name}}` | Display name | `Yong Su` |
| `{{company}}` | Company (auto-capitalized) | `Apple Inc` |
| `{{location}}` | Location | `San Francisco, CA` |
| `{{bio}}` | Bio (first 40 chars) | `Software Engineer` |
| `{{uptime}}` | Account age | `10 years, 3 months, 5 days` |
| `{{created}}` | Account creation date | `2015-03-21` |
| `{{languages}}` | Top 4 programming languages | `TypeScript, Python, Go, Rust` |
| `{{repos}}` | Number of repositories | `42` |
| `{{stars}}` | Total stars received | `128` |
| `{{forks}}` | Total forks across repos | `64` |
| `{{gists}}` | Number of public gists | `12` |
| `{{issues}}` | Total issues created | `85` |
| `{{prs}}` | Total pull requests created | `142` |
| `{{commits}}` | Estimated total commits | `5,000` |
| `{{followers}}` | Follower count | `256` |
| `{{following}}` | Following count | `128` |
| `{{email}}` | Public email | `you@example.com` |
| `{{blog}}` | Website/blog URL | `yoursite.com` |
| `{{twitter}}` | Twitter/X username | `yourhandle` |

### Config Structure

| Field | Description |
|-------|-------------|
| `image` | Custom image URL for ASCII art (optional). Supports PNG, WebP, AVIF, GIF, SVG. |
| `coloredImage` | `true` to render ASCII with original image colors |
| `imageScale` | Scale factor: `0` = no image, `0.5` = half size, `1` = full size (default), `2` = 2x zoom |
| `imageOffsetX` | Horizontal offset: number, `"50px"`, or `"25%"` |
| `imageOffsetY` | Vertical offset: number, `"50px"`, or `"25%"` |
| `imageColor` | Override image color: `"lightColor, darkColor"` |
| `removeBackground` | `true` to auto-detect and remove background color |
| `backgroundColor` | Custom card background: `"lightColor, darkColor"` |
| `separatorColor` | Custom dots/separator color: `"lightColor, darkColor"` |
| `sections` | Array of sections to display |
| `sections[].title` | Section header (optional). Use `"{{username}}@github"` for the first section, `"- Section Name"` for others |
| `sections[].titleColor` | Custom title colors: `{ "text": "light, dark", "line": "light, dark" }` |
| `sections[].fields` | Array of field objects (see Field Options below) |
| `stats` | GitHub Stats section configuration (optional) |
| `stats.title` | Stats section title (default: `"- GitHub Stats"`) |
| `stats.titleColor` | Custom stats title colors: `{ "text": "light, dark", "line": "light, dark" }` |
| `stats.enabled` | Set to `false` to hide stats section |
| `stats.rows` | Array of row types to display |

### Field Options

Each field in `sections[].fields` supports:

| Field | Description |
|-------|-------------|
| `key` | Label text (required) |
| `value` | Value text or template variable (required) |
| `keyColor` | Custom key color: `"lightColor, darkColor"` |
| `valueColor` | Custom value color: `"lightColor, darkColor"` |

### Custom Image

Use a custom image instead of your GitHub avatar:

```json
{
  "image": "https://example.com/my-logo.png",
  "sections": [...]
}
```

Supported formats: **PNG**, **WebP**, **AVIF**, **GIF**, **SVG**

Transparency is automatically preserved — transparent pixels render as spaces.

### Colored ASCII Art

Render the image with its original colors:

```json
{
  "image": "https://example.com/pikachu.png",
  "coloredImage": true
}
```

### Image Scaling

Control the image size with `imageScale`:

```json
{
  "imageScale": 0.5
}
```

| Value | Effect |
|-------|--------|
| `0` | No image (empty space) |
| `0.5` | Half size, centered |
| `1` | Full size (default) |
| `2` | 2x zoom (crops to center) |

### Background Removal

Auto-detect and remove solid background colors:

```json
{
  "image": "https://example.com/logo.png",
  "removeBackground": true
}
```

### Image Offset

Shift the image crop position with `imageOffsetX` and `imageOffsetY`:

```json
{
  "imageScale": 2,
  "imageOffsetX": "20%",
  "imageOffsetY": -50
}
```

| Value | Description |
|-------|-------------|
| `50` | Shift 50 pixels |
| `"50px"` | Shift 50 pixels |
| `"25%"` | Shift 25% of crop dimensions |
| `-50` | Shift in opposite direction |

Offsets are relative to the grid size. Positive X shifts right, positive Y shifts down.

### Render Pipeline

Understanding how images are processed helps you get the best results:

```
┌─────────────────────────────────────────────────────────────────┐
│  1. LOAD         Load image (PNG, WebP, AVIF, GIF, SVG)         │
├─────────────────────────────────────────────────────────────────┤
│  2. REMOVE BG    If removeBackground: true, detect and remove   │
│                  solid background color (keeps original size)   │
├─────────────────────────────────────────────────────────────────┤
│  3. CROP         For transparent images: crop to bounding box   │
│                  of opaque pixels (removes transparent padding) │
├─────────────────────────────────────────────────────────────────┤
│  4. CONTAIN      Fit image in 38x25 character grid, maintain    │
│                  aspect ratio, center both horizontally and     │
│                  vertically (no cropping, image fits entirely)  │
├─────────────────────────────────────────────────────────────────┤
│  5. SCALE        Apply imageScale multiplier from center        │
│                  (>1 = zoom in, <1 = zoom out)                  │
├─────────────────────────────────────────────────────────────────┤
│  6. OFFSET       Shift image position by imageOffsetX/Y         │
├─────────────────────────────────────────────────────────────────┤
│  7. ASCII        Convert each pixel to ASCII character with     │
│                  color (if coloredImage: true)                  │
├─────────────────────────────────────────────────────────────────┤
│  8. FINAL CROP   Crop to final 38x25 character grid             │
└─────────────────────────────────────────────────────────────────┘
```

**Key behaviors:**
- **Transparent PNGs**: Transparent padding is automatically cropped so your content fills the grid
- **removeBackground**: Only removes background color, does NOT crop the image
- **Scale + Offset**: Use `imageScale > 1` to zoom in, then `imageOffsetX/Y` to pan around

### Custom Colors

Override colors with light/dark mode support. Format: `"lightModeColor, darkModeColor"`

**Card Background:**
```json
{
  "backgroundColor": "#ffffff, #1a1a2e"
}
```

**Separator/Dots Color:**
```json
{
  "separatorColor": "#cccccc, #555555"
}
```

**Image Color Override:**
```json
{
  "imageColor": "#333333, #00ff00"
}
```

**Section Title Colors:**
```json
{
  "sections": [
    {
      "title": "{{username}}@github",
      "titleColor": {
        "text": "#1A73E8, #4285F4",
        "line": "#5F6368, #9AA0A6"
      },
      "fields": [...]
    }
  ]
}
```

**Field Colors:**
```json
{
  "fields": [
    {
      "key": "Name",
      "value": "{{name}}",
      "keyColor": "#EA4335, #EA4335",
      "valueColor": "#202124, #E8EAED"
    }
  ]
}
```

**Color format:**
- Use `"lightColor, darkColor"` for different light/dark mode colors
- Use `"color"` (no comma) for the same color in both modes

**Supported color values:**
- Hex: `#FF0000`, `#f00`
- Named: `red`, `blue`, `green`
- RGB/RGBA: `rgb(255,0,0)`, `rgba(0,0,0,0.5)`
- HSL/HSLA: `hsl(0,100%,50%)`, `hsla(0,100%,50%,0.5)`

**Examples:**
```json
{
  "backgroundColor": "red",
  "keyColor": "#4285F4",
  "valueColor": "#333, #fff"
}
```

### Themed Examples

**Pikachu Theme** (yellow/red/brown):
```json
{
  "image": "https://example.com/pikachu.png",
  "coloredImage": true,
  "sections": [
    {
      "title": "{{username}}@github",
      "titleColor": { "text": "#CC9900, #FFD700", "line": "#8B4513, #D4A574" },
      "fields": [
        { "key": "Name", "value": "{{name}}", "keyColor": "#CC9900, #FFC107", "valueColor": "#5D4037, #FFEB3B" }
      ]
    }
  ]
}
```

**Google Theme** (blue/red/yellow/green):
```json
{
  "image": "https://example.com/marker.svg",
  "coloredImage": true,
  "sections": [
    {
      "title": "{{username}}@github",
      "titleColor": { "text": "#1A73E8, #4285F4", "line": "#5F6368, #9AA0A6" },
      "fields": [
        { "key": "Name", "value": "{{name}}", "keyColor": "#1A73E8, #4285F4", "valueColor": "#202124, #E8EAED" },
        { "key": "Location", "value": "{{location}}", "keyColor": "#EA4335, #EA4335", "valueColor": "#202124, #E8EAED" },
        { "key": "Created", "value": "{{created}}", "keyColor": "#FBBC04, #FBBC04", "valueColor": "#202124, #E8EAED" },
        { "key": "Uptime", "value": "{{uptime}}", "keyColor": "#34A853, #34A853", "valueColor": "#202124, #E8EAED" }
      ]
    }
  ]
}
```

### Stats Row Types

| Row Type | Description |
|----------|-------------|
| `{ "left": {...}, "right": {...} }` | Split row with `\|` separator. Each side has `key` and `value` |
| `"loc"` | Special row: `Lines of Code: X ( Y++, Z-- )` |

### Example Stats Config

```json
{
  "stats": {
    "title": "- GitHub Stats",
    "rows": [
      { "left": { "key": "Repos", "value": "{{repos}}" }, "right": { "key": "Stars", "value": "{{stars}}" } },
      { "left": { "key": "Commits", "value": "{{commits}}" }, "right": { "key": "Followers", "value": "{{followers}}" } },
      { "left": { "key": "Forks", "value": "{{forks}}" }, "right": { "key": "Gists", "value": "{{gists}}" } },
      "loc"
    ]
  }
}
```

To hide the stats section entirely:

```json
{
  "stats": {
    "enabled": false
  }
}
```

## Deploy Your Own

For private repo stats or higher rate limits, deploy your own instance:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jeantimex/neofetch-profile)

### Add GitHub Token (Optional)

For private repos or to avoid rate limits:

1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Select the `repo` scope
4. Copy the token
5. In your Vercel project, go to **Settings → Environment Variables**
6. Add `GITHUB_TOKEN` with your token value

## Local Development

```bash
# Clone the repo
git clone https://github.com/jeantimex/neofetch-profile.git
cd neofetch-profile

# Install dependencies
npm install

# Create .env file with your GitHub token
echo "GITHUB_TOKEN=your_token_here" > .env

# Run locally (requires Vercel CLI)
vercel dev
```

### Test URLs

Basic usage:
```
http://localhost:3000/api?username=YOUR_USERNAME
```

With theme:
```
http://localhost:3000/api?username=YOUR_USERNAME&theme=github-light
```

With local config file (edit `public/config.json` to customize):
```
http://localhost:3000/api?username=YOUR_USERNAME&config=http://localhost:3000/config.json
```

## How It Works

1. Fetches your GitHub profile and repository data via the GitHub API
2. Converts your avatar to ASCII art using image processing
3. Calculates stats: repos, stars, total commits, followers, lines of code
4. Generates an SVG with neofetch-style terminal aesthetics
5. Caches the result for 4 hours for performance

## Credits

Andrew K is the goat respect to him

This project is inspired by [**Andrew Grant's GitHub Profile**](https://github.com/Andrew6rant) — the original neofetch-style GitHub profile that started it all. Check out his amazing work!

Also inspired by:
- [neofetch](https://github.com/dylanaraps/neofetch) — The original CLI system info tool
- [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) — GitHub stats cards

## License

MIT
