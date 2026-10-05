"""Healers module: admin creates a healer, a visitor books a time slot, staff confirm and cancel.

Needs a freshly seeded local database with no healers. See tests/e2e/README.md."""
import os, re
from urllib.parse import unquote
from playwright.sync_api import sync_playwright, expect
from common import B, DEVLOG, EMAIL, PW
def step(m): print("✓", m)
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={"width":1440,"height":900}); pg=ctx.new_page(); pg.set_default_timeout(20000)
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(B+"/"); pg.evaluate("sessionStorage.setItem('hex-preloaded','1')")

    # Nothing published yet: the page explains, the homepage section is absent
    pg.goto(B+"/healers", wait_until="networkidle")
    expect(pg.get_by_text("profiles are on their way")).to_be_visible()
    pg.goto(B+"/", wait_until="networkidle")
    assert pg.locator("#home-healers-title").count()==0
    step("no healers: Our Healers page explains, homepage section hidden")

    # Admin creates a healer
    pg.goto(B+"/login"); pg.fill("#email",EMAIL); pg.fill("#password",PW); pg.click("button[type=submit]"); pg.wait_for_url(B+"/admin")
    pg.goto(B+"/admin/healers/new", wait_until="networkidle")
    pg.fill("#name","Test Healer"); pg.fill("#title","Hypnotherapist & Energy Healer")
    pg.fill("#bio","A calm, patient guide.\n\nSecond paragraph about their approach.")
    pg.fill("#experienceYears","12"); pg.fill("#languages","Nepali, English"); pg.fill("#qualifications","Certified Hypnotherapist\nReiki Level II")
    pg.get_by_label("Pokhara").check(); pg.get_by_label("Online sessions").check()
    # publishing without a service or hours is refused
    pg.get_by_role("switch").click()
    pg.get_by_role("button", name="Add healer").click()
    expect(pg.get_by_text("Add at least one service with a price before publishing.")).to_be_visible()
    step("publishing without services is refused with a clear message")
    row=pg.locator("li", has=pg.get_by_label("Hypnotherapy", exact=True))
    pg.get_by_label("Hypnotherapy", exact=True).check()
    row.get_by_label("Price for Hypnotherapy in rupees").fill("3000")
    row.get_by_label("Session length for Hypnotherapy").select_option("60")
    row2=pg.locator("li", has=pg.get_by_label("Energy Healing", exact=True))
    pg.get_by_label("Energy Healing", exact=True).check()
    row2.get_by_label("Price for Energy Healing in rupees").fill("2000")
    row2.get_by_label("Session length for Energy Healing").select_option("90")
    for day in ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]:
        pg.get_by_label(day, exact=True).check()
    pg.get_by_role("button", name="Add healer").click()
    pg.wait_for_url(B+"/admin/healers")
    expect(pg.get_by_text("Test Healer")).to_be_visible()
    step("admin creates a healer with services, prices and weekly hours")

    # Public: list, homepage, service page, profile
    v=b.new_context(viewport={"width":1440,"height":900}).new_page(); v.set_default_timeout(20000)
    v.on("pageerror", lambda e: errs.append(str(e)))
    v.goto(B+"/"); v.evaluate("sessionStorage.setItem('hex-preloaded','1')")
    v.goto(B+"/healers", wait_until="networkidle")
    expect(v.get_by_role("heading", name="Test Healer")).to_be_visible()
    expect(v.get_by_text("Rs 2,000")).to_be_visible()   # "from" = lowest price
    v.goto(B+"/", wait_until="networkidle"); assert v.locator("#home-healers-title").count()==1
    v.goto(B+"/services/hypnotherapy", wait_until="networkidle")
    expect(v.get_by_text("Healers who offer hypnotherapy")).to_be_visible()
    expect(v.get_by_text("Rs 3,000")).to_be_visible()
    v.get_by_role("link", name="Book with Test Healer").click()
    v.wait_for_url(re.compile(r"/healers/test-healer\?service=hypnotherapy"))
    expect(v.get_by_role("heading", name="Test Healer")).to_be_visible()
    expect(v.get_by_text("12 years")).to_be_visible()
    expect(v.get_by_text("Reiki Level II")).to_be_visible()
    step("healer shows on Our Healers, homepage, the service page and their profile")

    # Booking: service preselected from the service page; pick place, day, time
    form=v.locator("form[aria-label='Book a session with Test Healer']")
    assert form.get_by_role("button", name=re.compile("Hypnotherapy")).get_attribute("aria-pressed")=="true"
    form.get_by_role("button", name="Pokhara").click()
    days=form.locator("button[aria-label*=', 20']"); days.first.wait_for()
    assert days.count()==30, days.count()
    day_label=days.first.get_attribute("aria-label"); days.first.click()
    times=form.get_by_role("button", name=re.compile(r"^\d{1,2}:\d{2} (AM|PM)$")); times.first.wait_for()
    n=times.count(); first_time=times.first.inner_text()
    assert n==11 and first_time=="11:00 AM", (n, first_time)   # 11:00–17:00, 60 min, every 30 min → 11:00 … 4:00
    times.first.click()
    form.locator("#slot-name").fill("Slot Visitor"); form.locator("#slot-phone").fill("9800000002"); form.locator("#slot-email").fill("slot@example.com")
    form.get_by_role("button", name="Request this time").click()
    expect(v.get_by_text("Your request is in.")).to_be_visible()
    ref=v.locator("dd", has_text=re.compile(r"^HEX-[2-9A-Z]{6}$")).inner_text()
    wa=unquote(v.get_by_role("link", name=re.compile("Message us on WhatsApp")).get_attribute("href"))
    assert ref in wa and "Test Healer" in wa, wa
    step(f"visitor books {day_label} {first_time} and gets reference {ref}")

    # The held slot (and the half-hour either side that would overlap) is gone for the next visitor
    w=b.new_context(viewport={"width":1440,"height":900}).new_page(); w.set_default_timeout(20000)
    w.goto(B+"/"); w.evaluate("sessionStorage.setItem('hex-preloaded','1')")
    w.goto(B+"/healers/test-healer?service=hypnotherapy", wait_until="networkidle")
    f2=w.locator("form[aria-label='Book a session with Test Healer']")
    f2.get_by_role("button", name="Online session").click()
    f2.locator(f"button[aria-label='{day_label}']").click()
    t2=f2.get_by_role("button", name=re.compile(r"^\d{1,2}:\d{2} (AM|PM)$")); t2.first.wait_for()
    labels=[t2.nth(i).inner_text() for i in range(t2.count())]
    assert "11:00 AM" not in labels and "11:30 AM" not in labels and labels[0]=="12:00 PM", labels
    step("the booked time is no longer offered to other visitors")

    # Dashboard: booking shows healer, slot, fee; confirm → visitor email + WhatsApp confirmation
    pg.goto(B+"/admin/bookings", wait_until="networkidle")
    pg.get_by_role("link", name=re.compile("Slot Visitor")).first.click()
    pg.wait_for_url(re.compile(r"/admin/bookings/\w+"))
    expect(pg.get_by_text(ref)).to_be_visible()
    expect(pg.get_by_text("Test Healer").first).to_be_visible()
    expect(pg.get_by_text("Rs 3,000")).to_be_visible()
    expect(pg.get_by_text("60 minutes")).to_be_visible()
    pg.get_by_role("button", name="Confirm booking").click()
    conf=pg.get_by_role("link", name="Send confirmation on WhatsApp"); conf.wait_for()
    msg=unquote(conf.get_attribute("href"))
    assert msg.startswith("https://wa.me/9779800000002?text=") and ref in msg and "confirmed" in msg and "Test Healer" in msg, msg
    pg.wait_for_timeout(800)
    log=open(DEVLOG).read()
    # Email is switched off for tests: the mailer logs the message (dev) or its subject (production mode).
    assert f"Your booking is confirmed ({ref})" in log, "confirmation email not sent"
    step("confirming shows the booking details, emails the visitor and offers the WhatsApp confirmation")

    # Cancel frees the slot again
    pg.get_by_role("button", name="Cancel booking").click()
    expect(pg.get_by_role("button", name="Reopen")).to_be_visible()
    w.reload(wait_until="networkidle")
    f2=w.locator("form[aria-label='Book a session with Test Healer']")
    f2.locator(f"button[aria-label='{day_label}']").click()
    t2=f2.get_by_role("button", name=re.compile(r"^\d{1,2}:\d{2} (AM|PM)$")); t2.first.wait_for()
    assert t2.first.inner_text()=="11:00 AM"
    step("cancelling the booking frees the time slot")

    # A review linked to the healer feeds their rating
    pg.goto(B+"/admin/testimonials/new", wait_until="networkidle")
    pg.fill("#name","Happy Client"); pg.fill("#quote","Gentle and clear. I felt at ease."); pg.select_option("#rating","4")
    pg.select_option("#healerId", label="Test Healer")
    pg.get_by_role("button", name="Add testimonial").click(); pg.wait_for_url(B+"/admin/testimonials")
    v.goto(B+"/healers/test-healer", wait_until="networkidle")
    expect(v.get_by_label("Rated 4 out of 5 from 1 review").first).to_be_visible()
    expect(v.get_by_text("Gentle and clear. I felt at ease.")).to_be_visible()
    step("a testimonial linked to the healer shows on their profile with the rating")

    # Unpublishing hides the healer and their profile
    pg.goto(B+"/admin/healers", wait_until="networkidle"); pg.get_by_role("link", name=re.compile("Test Healer")).first.click()
    pg.get_by_role("switch").click(); pg.get_by_role("button", name="Save changes").click(); pg.wait_for_url(B+"/admin/healers")
    r=v.goto(B+"/healers/test-healer"); assert r.status==404, r.status
    step("unpublishing hides the healer's profile (404)")
    assert not errs, errs
    b.close()
print("healer flow ok")
