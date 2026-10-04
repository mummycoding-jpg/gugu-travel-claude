# Gugu Taxi Tour & Travel – Cab Booking Website

Static website for a 7-seater AC Toyota Rumion cab service based in Siwan, Bihar.
Call and WhatsApp booking for Bihar and all-India trips. No backend, no database.

## Edit your details
Open `config.js`. Change the phone number, routes and rates, save, refresh.

## Replace the car photo
Replace `assets/rumion.jpg` with your own photo (keep the same file name).

## Run on Replit
1. Create a new Repl, choose **Import from GitHub**, paste this repo URL.
2. Press **Run**. The site opens in the preview.
3. Press **Deploy**, choose **Static**, to get a public link.

## Run on your computer
    python3 -m http.server 8000
then open http://localhost:8000

## Files
- `index.html` page structure
- `styles.css` design
- `script.js` WhatsApp links, booking form, 3D highway animation
- `config.js` your editable details

## Deploy on Railway
1. railway.com, then **New Project**, then **Deploy from GitHub repo**, pick this repo.
2. Railway builds the `Dockerfile` automatically and serves the site on its `PORT`.
3. Open **Settings**, then **Networking**, then **Generate Domain** to get the public link.
