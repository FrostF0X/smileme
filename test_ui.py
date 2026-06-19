from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.on("pageerror", lambda err: print(f"Page error: {err}"))
        page.on("console", lambda msg: print(f"Console message: {msg.text}"))
        page.goto("http://localhost:4173/")
        try:
            page.wait_for_selector("svg", timeout=10000)
            print("UI is working. Found canvas SVG.")
        except Exception as e:
            print(f"Failed to find SVG: {e}")
        browser.close()

run()
