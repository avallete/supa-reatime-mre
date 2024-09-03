## To setup

```
npm install
cp .env.example .env
npx supabase start
npm run dev
```

## Issue
An non authenticated user should not be able
to post or receive realtime broadcast from the 'channel1'

## Expected behaviour

The unauthenticated user window fail to broadcast message to the channel.
The unauthenticated user window fail to receive broadcast from the authenticated users.