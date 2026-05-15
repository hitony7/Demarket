# Demarket Bruno Collection

This Bruno collection targets the local backend at `http://localhost:3000/api`.

## Open in Bruno

Open the collection folder:

```text
backend/bruno/Demarket
```

Then select the `local` environment.

## Variables To Fill In

Update these values in `environments/local.bru` before running protected requests:

- `walletAddress`
- `devWalletAddress` (set this to the public wallet address for `PRIVATE_KEY_DEV` when using `Generate Signature (Dev Only)`)
- `authToken`
- `userId`
- `listingId`

## Request Flow

For wallet auth testing, use the auth requests in this order:

1. `Request Nonce`
2. `Generate Signature (Dev Only)`
3. `Verify Signature`

`Generate Signature (Dev Only)` requires `PRIVATE_KEY_DEV` in the backend `.env` and should only be used for local development.
For the dev signature flow, `walletAddress` must match the public wallet address derived from `PRIVATE_KEY_DEV`; otherwise `Verify Signature` will reject the recovered signer.
