# /gov link-preview card (assets/gov/og-gov.jpg)

1. Serve the repo root (`python3 -m RangeHTTPServer 8765`) and run `python3 capture_brain.py` from this folder. It captures the /gov Brain at the GOV-DEMO-001 restocking scene (scroll position .438) without page chrome or canvas labels (writes brain-clean.png).
2. Crop to the brain and drop the background to black: crop (560,140,2560,1600) from the capture (brain-clean-a.png), map channel values <=14 to 0 and scale the rest by 1.35, save as brain-crop.png.
3. Screenshot `og-card.html` at 1200x630, device scale 2, then downscale to 1200x630 and save as `assets/gov/og-gov.jpg`.

Scene text is synthetic and labelled so on the card.

The camera inset (`inset-restock.jpg`) is a 16:9 crop of the generated ceiling-camera restocking image around the humanoid.
