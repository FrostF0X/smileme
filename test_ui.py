from playwright.sync_api import sync_playwright

def test_app():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        errors = []
        page.on("pageerror", lambda err: errors.append(err.message))
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)

        page.goto('http://localhost:4173/')
        page.wait_for_selector('canvas, svg', timeout=5000)

        if len(errors) > 0:
            print("Console Errors Found:")
            for err in errors:
                print(f"- {err}")
            exit(1)

        print("Application loaded successfully with no console errors.")
        browser.close()

if __name__ == "__main__":
    test_app()
