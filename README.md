# Final Fantasy XIV race tracker
![Screenshot 2024-11-10 at 23-05-01 ](https://github.com/user-attachments/assets/5838d5b2-0dd9-49f4-b2df-f75591bd61c4)

This project is made using Nuxt and Vue. Styling is done with Tailwind.

It was made for my own static's progress Stream coming up in a few weeks but i've made it open to everyone so you can adapt it to your needs too.

It'll display the current race infos like the number of pulls, your best percentage, the composition of your team during the best pull.

All FFLogs API calls are handled server-side with caching (`defineCachedEventHandler`), so multiple overlay clients (OBS scenes, browser tabs, etc.) share the same cached data without multiplying API traffic.

It has other pages with stats:

-   `/lastPull` to see the percentage of your last pull
-   `/deathCounter` to see your death counter for the whole fight.
-   `/stats/nonRace` detailed stats dashboard with pull graphs and PB progression

DeathCounter has no styling because we didn't wanna show it in real time on screen.

## Setup

Make sure to install the dependencies:

```bash
yarn install
```

You then need to copy the `.env.copy` to `.env` and fill in your credentials:

```
NUXT_OAUTH_TOKEN=     # FFLogs OAuth client secret
NUXT_CLIENT_ID=       # FFLogs OAuth client ID
NUXT_GUILD_ID=        # FFLogs guild ID (found on your static's profile page)
```

Credentials can be obtained by following the [FFLogs API Documentation](https://fr.fflogs.com/api/docs).

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
