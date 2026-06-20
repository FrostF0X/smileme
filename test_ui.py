from playwright.sync_api import sync_playwright

def test_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('http://localhost:5173/')

        # Check Ae Logo
        logo = page.locator('text="Ae"')
        if logo.count() > 0:
            print("Logo 'Ae' found!")
        else:
            print("Logo 'Ae' NOT found.")

        # Check that old buttons are not in nav
        nav = page.locator('nav')
        if nav.locator('text="File (Import)"').count() == 0:
            print("Old buttons successfully removed from Nav.")
        else:
            print("Old buttons still in Nav!")

        # Hover settings trigger
        settings_trigger = page.locator('span.material-symbols-outlined:has-text("settings")')
        if settings_trigger.count() > 0:
            print("Settings trigger icon found!")
            # The dropdown should contain File
            dropdown_file = page.locator('.group-hover\\:flex >> text="File (Import)"')
            if dropdown_file.count() > 0:
                print("Settings dropdown contains File (Import)!")
            else:
                print("Settings dropdown does NOT contain File (Import).")
        else:
            print("Settings trigger NOT found.")

        browser.close()

test_ui()
