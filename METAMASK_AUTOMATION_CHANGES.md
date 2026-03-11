# INSURANCE SMART CLAIM: Direct Metamask Automation Setup

This document outlines the architectural changes made to transition the "INSURANCE SMART CLAIM" application away from Coinbase Developer Platform (CDP) Embedded Wallets to a pure, direct Metamask automated backend leveraging standard Ethereum libraries.

## 1. Complete Architecture Pivot
Due to compatibility issues with Coinbase's Embedded Web Wallets requiring React 18 frontend modals (and breaking under React 19 focus states), the application was re-architected to a **Backend-Driven Metamask Automation** model, completely bypassing the CDP.

## 2. Backend Redevelopment (`crypto-verifier-backend/server.js`)
*   **Removed CDP SDK**: Ripped out `@coinbase/coinbase-sdk`.
*   **Implemented Ethers.js**: Installed `ethers@6.x` to handle raw EVM transaction cryptography.
*   **Secure Private Key Storage**: Placed the raw Metamask private key in a hidden `.env` file (`PRIVATE_KEY=...`) so it remains exclusively on the secure server side, completely isolated from the browser.
*   **Direct RPC Connectivity**: Replaced the theoretical Hoodi RPC (`rpc.hoodi.com`) with a live, verified public endpoint: `https://ethereum-hoodi-rpc.publicnode.com`.
*   **Raw Transaction Construction**: The `/api/transfer` endpoint now programmatically builds standard Ethereum transactions targeting the specific Hoodi Chain ID (`560048`), signing the raw bytes locally using the injected private key and firing them directly to the blockchain mempool, removing all frontend signature popups.

## 3. Frontend UI Overhaul (`crypto-verifier/src/App.jsx`)
*   **Removed Frontend SDKs**: Ripped out `@coinbase/cdp-react` and `@coinbase/cdp-hooks` dependencies.
*   **Removed `<CDPReactProvider />`**: Cleaned up the root `main.jsx` and detached the React tree from Coinbase state management.
*   **Restored Native Form Elements**: Rebuilt the application view as `INSURANCE SMART CLAIM - Direct Metamask Automation Setup`.
*   **Automated Sender Validation**: The React application now hits the backend `GET /api/address` endpoint natively on startup. It strictly displays the Metamask derived public address (e.g. `0x411860...`) in a locked, unbreakable layout element, ensuring the "Bot" wallet is live before allowing user interaction.
*   **Seamless Execution**: The "Execute Automated Transfer" button operates smoothly with zero third-party modals. It simply sends the `Recipient Address` and `Amount` payload directly to the Express proxy.

## 4. CSS Refinement
*   **Scoped Styling**: All raw HTML styled inputs in `index.css` were properly scoped to explicitly target `.app-container` components. This removes global layout pollution, ensuring high aesthetic design standards without breaking external tools or widgets.

## Summary 
The platform is now fully armed as an automated "Insurance Payout Bot", entirely self-hosted using raw Ethers.js and Express over the Hoodi Testnet.
