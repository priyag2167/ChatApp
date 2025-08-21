## ChatApp — Run Guide (Mobile + Server)

This document explains how to set up and run both the Node.js server and the React Native mobile app (iOS and Android).

### Prerequisites

- **Node.js**: v18+ (check with `node -v`)
- **Package manager**: npm or yarn
- **MongoDB**: running locally or accessible via URI
- For iOS: **Xcode**, **CocoaPods**, Ruby `bundler`
- For Android: **Android Studio**, SDKs, an emulator or a device

### Ports and URLs

- The mobile app points to the API/Socket at:
  - iOS: `http://localhost:5050`
  - Android emulator: `http://10.0.2.2:5050`
- The server should run on port **5050** to match the mobile config.

If you run the mobile app on a physical device, replace the base URL with your machine's LAN IP (e.g., `http://192.168.1.10:5050`) in `mobile/src/helpers/constants/config.ts`.

---

### 1) Server Setup

Location: `server/`

1. Install dependencies:

```bash
cd server
npm install
# or
yarn install (recommanded)
```

2. Create a `.env` file in `server/`:

```bash
PORT=5050
MONGO_URI=mongodb+srv://priyag:shanu%402167@clusterchat.kphvmqw.mongodb.net/?retryWrites=true&w=majority&appName=ClusterChat
JWT_SECRET=dev_secret
```

Notes:
- `PORT` is set to `5050` to align with the mobile app's base URL.
- Update `MONGO_URI` if your MongoDB runs elsewhere.
- Use a strong `JWT_SECRET` in production.

3. Start the server:

```bash
# Development (auto-restart)
npm run dev

# Or 
yarn dev
```

4. Verify the server:

```bash
curl http://localhost:5050/health
# => { "ok": true }
```

Available auth endpoints (JSON):
- POST `/auth/register` { name, email, number, password, status? }
- POST `/auth/login` { email, password }

Protected routes (require `Authorization: Bearer <token>`):
- `/users/*`, `/conversations/*`

---

### 2) Mobile Setup

Location: `mobile/`

1. Install dependencies:

```bash
cd mobile
npm install
# or: yarn
```

2. iOS native deps (first time or after native updates):

```bash
# Ensure bundler installs CocoaPods per Gemfile
bundle install

# Install pods
cd ios && bundle exec pod install && cd ..
```

3. Start Metro (JavaScript bundler):

```bash
npm start
# or: yarn start
```

4. In a new terminal, build and run the app:

Android:

```bash
cd mobile
npm run android
# or: yarn android
```

iOS:

```bash
cd mobile
npm run ios
# or: yarn ios
```

The app is configured to use:
- iOS simulator/device: `http://localhost:5050`
- Android emulator: `http://10.0.2.2:5050`

For physical devices on the same network, update `API_BASE_URL` and `SOCKET_URL` in `mobile/src/helpers/constants/config.ts` to your Mac's LAN IP.

---

### Common Troubleshooting

- Metro cannot find the server or sockets don't connect:
  - Ensure the server is on `PORT=5050` and reachable.
  - On Android emulator, the correct host is `10.0.2.2` (already handled in code).
  - For physical devices, use your machine's LAN IP; avoid `localhost`.

- iOS build fails for pods:
  - Run `bundle install` in `mobile/` and then `cd ios && bundle exec pod install`.
  - Open `ios/Chat.xcworkspace` in Xcode and build once if needed.

- MongoDB connection errors:
  - Start MongoDB locally or update `MONGO_URI` in `server/.env`.

- JWT errors or unauthorized requests:
  - Ensure the client attaches `Authorization: Bearer <token>` after login.

---

### Quick Start (TL;DR)

Server:

```bash
cd server && npm install
echo 'PORT=5050
MONGO_URI="mongodb://127.0.0.1:27017/chatapp"
JWT_SECRET="dev"' > .env
npm run dev
```

Mobile:

```bash
cd mobile && npm install
bundle install && (cd ios && bundle exec pod install)
npm start
# new terminal
npm run ios  # or: npm run android
```


