"""Site-wide QA crawl: every public and dashboard page at desktop and phone width.

Flags console/page errors, failed requests, broken images, sideways scrolling, public text under
16px, pages without exactly one <h1>, and content that never animates in. Also exercises the mobile
menu, gallery viewer, FAQ, bowl and WhatsApp link. See README.md in this folder.
"""
import re

from playwright.sync_api import sync_playwright

from common import B, EMAIL, PW, WHATSAPP_NUMBER

issues = []


def note(where, what):
    issues.append(f"{where}: {what}")


def go(pg, url):
    """Load a page, then give the network a bounded time to settle (one slow image mustn't hang the crawl)."""
    resp = pg.goto(url, wait_until="load")
    try:
        pg.wait_for_load_state("networkidle", timeout=8000)
    except Exception:
        pass
    return resp


CHECK = """async (pub)=>{
  for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}
  await new Promise(r=>setTimeout(r,700));
  const out={};
  out.over=document.documentElement.scrollWidth>innerWidth+1;
  out.broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.getAttribute('src')).map(i=>i.getAttribute('src')).slice(0,3);
  out.h1=document.querySelectorAll('h1').length;
  if(pub){out.small=[...document.querySelectorAll('main *, footer *')].filter(e=>e.offsetParent&&[...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim())&&parseFloat(getComputedStyle(e).fontSize)<16).map(e=>e.tagName+':'+e.textContent.trim().slice(0,30)).slice(0,3)}
  out.hidden=[...document.querySelectorAll('main .page-reveal')].filter(e=>getComputedStyle(e).opacity==='0').length;
  return out}"""


def visit(pg, path, label, pub):
    errs, fails = [], []
    on_console = lambda m: errs.append(m.text) if m.type == "error" else None
    on_error = lambda e: errs.append("pageerror: " + str(e))
    on_response = lambda r: fails.append(f"{r.status} {r.url.replace(B, '')}") if r.status >= 400 and not r.url.endswith("favicon.ico") else None
    pg.on("console", on_console)
    pg.on("pageerror", on_error)
    pg.on("response", on_response)
    resp = go(pg, B + path)
    status = resp.status if resp else 0
    r = pg.evaluate(CHECK, pub)
    pg.remove_listener("console", on_console)
    pg.remove_listener("pageerror", on_error)
    pg.remove_listener("response", on_response)
    where = f"[{label}] {path}"
    if status >= 400:
        note(where, f"HTTP {status}")
    for e in errs[:3]:
        note(where, "console: " + e[:180])
    for f in fails[:3]:
        note(where, "request: " + f)
    if r["over"]:
        note(where, "horizontal overflow")
    if r["broken"]:
        note(where, "broken images " + str(r["broken"]))
    if r["h1"] != 1:
        note(where, f"{r['h1']} h1 elements")
    if pub and r.get("small"):
        note(where, "text <16px " + str(r["small"]))
    if r["hidden"]:
        note(where, f"{r['hidden']} reveal blocks still hidden after scroll")


def links(pg, path, prefix):
    """Real content links under `prefix` on a page (not route strings inside JS bundles)."""
    go(pg, B + path)
    hrefs = pg.eval_on_selector_all(f"main a[href^='{prefix}']", "els=>els.map(e=>e.getAttribute('href'))")
    return sorted({h.split("?")[0].split("#")[0] for h in hrefs})


with sync_playwright() as p:
    b = p.chromium.launch()
    for label, (w, h) in [("desktop", (1440, 900)), ("mobile", (390, 844))]:
        ctx = b.new_context(viewport={"width": w, "height": h})
        pg = ctx.new_page()
        pg.goto(B + "/")
        pg.evaluate("sessionStorage.setItem('hex-preloaded','1')")

        pub = ["/", "/about", "/services", "/healers", "/portfolio", "/blog", "/contact", "/book", "/book?service=hypnotherapy"]
        pub += links(pg, "/services", "/services/") + links(pg, "/blog", "/blog/") + links(pg, "/healers", "/healers/")
        for path in pub:
            visit(pg, path, label, True)
        for path in ["/login", "/forgot-password"]:
            visit(pg, path, label, False)
        r = pg.goto(B + "/no-such-page")
        if r.status != 404:
            note(f"[{label}] /no-such-page", f"expected 404, got {r.status}")

        # A booking, so the booking detail page exists.
        if label == "desktop":
            go(pg, B + "/book?service=hypnotherapy")
            pg.fill("#booking-name", "QA Visitor")
            pg.fill("#booking-phone", "9800000001")
            pg.select_option("#booking-centre", "Online")
            pg.click("button[type=submit]")
            pg.wait_for_timeout(1500)
            if "Thank you" not in pg.content() or not re.search(r"HEX-[2-9A-Z]{6}", pg.content()):
                note("[desktop] /book", "booking submit failed or no reference shown")

        pg.goto(B + "/login")
        pg.fill("#email", EMAIL)
        pg.fill("#password", PW)
        pg.click("button[type=submit]")
        pg.wait_for_url(B + "/admin")
        sections = ["bookings", "healers", "blogs", "services", "portfolio", "testimonials"]
        admin = ["/admin", "/admin/bookings?status=all", "/admin/users", "/admin/users/new", "/admin/account"]
        for section in sections:
            base = f"/admin/{section}"
            admin.append(base)
            if section != "bookings":
                admin.append(f"{base}/new")
            go(pg, B + base + ("?status=all" if section == "bookings" else ""))
            ids = [x for x in sorted(set(re.findall(base + r"/([A-Za-z0-9_-]{8,})", pg.content()))) if x != "new"]
            if ids:
                admin.append(f"{base}/{ids[0]}")
        for path in admin:
            visit(pg, path, label, False)
        ctx.close()

    # Interactions (phone width)
    ctx = b.new_context(viewport={"width": 390, "height": 844})
    pg = ctx.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    go(pg, B + "/")
    pg.evaluate("sessionStorage.setItem('hex-preloaded','1')")
    go(pg, B + "/")
    pg.get_by_role("button", name="Open menu").click()
    pg.wait_for_timeout(500)
    if not pg.get_by_role("link", name="Book Now").last.is_visible():
        note("[mobile] menu", "Book Now not visible in open menu")
    pg.get_by_role("button", name="Close menu").click()
    pg.wait_for_timeout(400)
    strike = pg.get_by_role("button", name="Strike the bowl")
    strike.scroll_into_view_if_needed()
    strike.click()
    pg.wait_for_timeout(300)
    go(pg, B + "/portfolio")
    tile = pg.locator("#gallery li button").first
    tile.scroll_into_view_if_needed()
    tile.click()
    pg.wait_for_timeout(500)
    if not pg.locator("dialog[open]").count():
        note("[mobile] portfolio", "gallery viewer did not open")
    pg.keyboard.press("ArrowRight")
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(300)
    if pg.locator("dialog[open]").count():
        note("[mobile] portfolio", "gallery viewer did not close")
    go(pg, B + "/contact")
    faq = pg.locator("details").first
    faq.scroll_into_view_if_needed()
    faq.locator("summary").click()
    pg.wait_for_timeout(200)
    if not faq.evaluate("e=>e.open"):
        note("[mobile] contact", "FAQ did not open")
    wa = pg.get_by_role("link", name="Chat with us on WhatsApp").first.get_attribute("href")
    if not wa.startswith(f"https://wa.me/{WHATSAPP_NUMBER}?text="):
        note("[mobile] contact", "bad WhatsApp link " + wa)
    for e in errs:
        note("[mobile] interactions", "pageerror " + e[:150])
    b.close()

print(f"{len(issues)} issue(s)")
for issue in issues:
    print(" -", issue)
