import asyncio
from playwright.async_api import async_playwright
INIT = """
(()=>{const P=CanvasRenderingContext2D.prototype;const rr=P.roundRect;P.roundRect=function(...a){if(String(this.fillStyle).replace(/ /g,'')==='rgba(5,10,12,0.86)')return;return rr.apply(this,a)};
const ft=P.fillText;P.fillText=function(t,...a){const f=this.font;if(/^500 13px/.test(f)||/^600 10px/.test(f))return;return ft.call(this,t,...a)}})();
"""
async def m():
  async with async_playwright() as pw:
    b=await pw.chromium.launch()
    p=await b.new_page(viewport={'width':1500,'height':900},device_scale_factor=2,reduced_motion='reduce')
    await p.add_init_script(INIT)
    await p.goto('http://localhost:8765/gov/',wait_until='networkidle')
    await p.add_style_tag(content="#nav,#brain .title,#brain .closing,#brain .prog,#brain .vig{display:none!important} #brain .card,#brain .mb-trace{visibility:hidden!important}")
    top=await p.evaluate("document.getElementById('brain').offsetTop"); h=await p.evaluate("document.getElementById('brain').offsetHeight-innerHeight")
    await p.evaluate(f"window.scrollTo(0,{top}+{h}*.643)"); await p.wait_for_timeout(1800)
    await p.locator('#mbcv').screenshot(path='brain-clean.png')
    await b.close()
asyncio.run(m())
