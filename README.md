# Infinite Ages Development

This project uses a simple Express server to serve game files. To ensure all JSON data loads correctly, always run the server before opening any game pages.

## Start the Server

```bash
npm start
```

This command runs `server.js` on port 3000 by default. You can set the `PORT` environment variable to use a different port.

## Open the Character Creator

After starting the server, open the following URL in your browser:

```
http://localhost:3000/Game/character-creation.html
```

Opening the HTML files directly from the filesystem will prevent `fetch()` from loading JSON data.


## Troubleshooting

If the character creator displays a message that game data could not be loaded, ensure the Express server is running. The server defaults to port 3000 unless you set the `PORT` environment variable. Once the server is active, refresh the page to try again.

## Verify the Server and Data Requests

Visit `http://localhost:3000/` in your browser after running `npm start` to make sure the server is up. Replace `3000` with your `PORT` value if you configured a different port. You should see the main game page. If the page does not load, the server is not running.

Open the browser developer tools (usually with **F12** or **Ctrl+Shift+I**) and check the **Console** and **Network** tabs. Look for any 404 or failed requests for `.json` files. Every data file resides under `/public/Game/data`, so missing files will show paths from that directory in the network log.

