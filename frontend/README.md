# frontend

This contains the frontend code for the Nori webapp.

## Running

```sh
npm install
npm start
```

The app talks to the Nori backend (`/api/posts/fetch` and `/api/posts/create`). By default it expects the backend at `http://localhost:8080` (`http://10.0.2.2:8080` on the Android emulator). To use a different address, e.g. when running on a physical device, set `EXPO_PUBLIC_API_URL`:

```sh
EXPO_PUBLIC_API_URL=http://192.168.1.20:8080 npm start
```
