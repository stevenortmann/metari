"""Render the Metari Government capability brief to PDF.

Usage, from the repository root:
    python3 gov/brief/render_brief.py
Needs Playwright with Chromium (pip install playwright && python3 -m playwright install chromium).
Writes gov/metari-government-capability-brief.pdf and page previews in gov/brief/preview/.
"""
import asyncio, pathlib
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / 'gov' / 'brief' / 'capability-brief.html'
OUT = ROOT / 'gov' / 'metari-government-capability-brief.pdf'


async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        p = await b.new_page()
        await p.goto(SRC.as_uri(), wait_until='networkidle')
        await p.wait_for_timeout(500)
        await p.pdf(path=str(OUT), format='Letter', print_background=True, prefer_css_page_size=True)
        await b.close()
    print('wrote', OUT)

asyncio.run(main())
