# Infinite Ages Development

This project uses a simple Express server to serve game files. To ensure all JSON data loads correctly, always run the server before opening any game pages.

## Start the Server

```bash
npm start
```

This command runs `server.js` on port 3000.

## Open the Character Creator

After starting the server, open the following URL in your browser:

```
http://localhost:3000/Game/character-creation.html
```

Opening the HTML files directly from the filesystem will prevent `fetch()` from loading JSON data.

## Troubleshooting

If the character creator displays a message that game data could not be loaded, ensure the Express server is running on port 3000. Once the server is active, refresh the page to try again.
