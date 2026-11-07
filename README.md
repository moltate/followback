# Followback

A small mobile app that shows who follows you back on Instagram, wrapped in a Japanese-inspired design: sumi ink black, washi paper cream and a vermilion accent.

You import your own official Instagram data export. There is no login, no password and no server. Everything stays on your phone.

> Not affiliated with, endorsed by, or connected to Instagram or Meta.

## Features

- **Dashboard** with an ensō (hand-drawn circle) ring showing your follow-back percentage, plus cards for Followers, Following, Mutuals and Fans. Tap a card to open that list.
- **People** screen with five filters, search and A–Z / Newest sorting.
- **Not following back** list with a checkbox per person, a progress bar and an **Open next** button. It opens the next profile on your list in Instagram so you can unfollow quickly.
- **Compare** two imports to see new followers, lost followers and changes in who you follow.
- **Local save**: your data is stored on the device, so it is still there when you reopen the app.
- **Settings**: import again, delete old imports, or delete all data.
- Hanko-seal style avatars (each username keeps its own colour), a seigaiha wave pattern background and a Fuji and red sun welcome banner.

## Tech stack

- Expo SDK 58, React Native, TypeScript
- Fonts: Shippori Mincho (headings) and Zen Kaku Gothic New (body)
- Jest for unit tests

## Getting started

You need Node.js and the Expo Go app on your phone (update it if you see an "incompatible SDK" error, since this project uses SDK 58).

```bash
git clone https://github.com/YOUR-USERNAME/followback.git
cd followback
npm install
npx expo start
```

Scan the QR code with Expo Go. Your phone and computer must be on the same network.

If package versions complain, run:

```bash
npx expo install --check
```

If an old version keeps showing after a change, restart with a clean cache:

```bash
npx expo start -c
```

## How to use

1. Request your data from Instagram (Accounts Center, then download your information) and choose the **JSON** format. Include followers and following.
2. Unzip the download on your phone or computer. The app cannot read ZIP files directly.
3. Open the app and tap **Import files**.
4. Select `followers_1.json` and `following.json` together.
5. Explore the dashboard and lists. Import again later and use **Compare** to see what changed.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm test` | Run the Jest test suite |

## Project structure

```
App.tsx              App entry, loading and tab switching
src/
  components/        Shared UI: tab bar, hanko avatar, ensō ring, seigaiha, buttons
  screens/           Welcome, Dashboard, List, Compare, Settings
  services/          Instagram parser, relationship engine, import builder, file picker
  store/             Local storage and compact data codec
  hooks/             Reusable hooks
  theme/             Colours, spacing and fonts
  utils/             Helpers such as date formatting
```

## Privacy

- Your followers and following lists are read from files you choose and saved only on your device.
- Nothing is uploaded anywhere, and the app never asks for your Instagram password.
- Settings has a **Delete all data** option that wipes everything the app has stored.

## Known limitations

- Unfollowing happens in Instagram itself. The app only opens the profile for you, so in-app unfollow is not possible.
- ZIP files must be unzipped before importing.
- The file picker and file reading follow the Expo documentation but have had limited testing across different devices.
- The parser was built and tested against sample structures of the Instagram export. If your file fails to import, please open an issue (remove usernames from any sample you share).

## License

See the [LICENSE](LICENSE) file.
