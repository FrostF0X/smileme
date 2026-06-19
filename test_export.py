from playwright.sync_api import sync_playwright
import subprocess
import time

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        server_process = subprocess.Popen(['npm', 'run', 'dev'])
        time.sleep(3)

        try:
            page.goto('http://localhost:5173')
            page.wait_for_selector('svg.touch-none', timeout=10000)

            svg_rect = page.evaluate('''() => {
                const svg = document.querySelector('svg.touch-none');
                const rect = svg.getBoundingClientRect();
                return {x: rect.x, y: rect.y, width: rect.width, height: rect.height};
            }''')

            # Start drawing inside the svg boundaries
            start_x = svg_rect['x'] + 100
            start_y = svg_rect['y'] + 100

            page.mouse.move(start_x, start_y)
            page.mouse.down()
            page.mouse.move(start_x + 50, start_y + 50, steps=10)
            page.mouse.move(start_x + 100, start_y, steps=10)
            page.mouse.up()
            time.sleep(1)

            # Verify we drew something
            shapes_count = page.evaluate("document.querySelectorAll('g[data-shape-index]').length")
            print(f"Shapes drawn: {shapes_count}")

            # Click Export
            with page.expect_download() as download_info:
                page.click("text=Export")

            download = download_info.value
            download_path = download.path()
            print(f"Downloaded file to: {download_path}")

            with open(download_path, 'r') as f:
                content = f.read()
                print("--- SVG CONTENT ---")
                print(content[:500])
                if "<g transform=" in content and "fill=" in content:
                    print("Test Passed: SVG contains group transforms and fill attributes.")
                else:
                    print("Test Failed: Missing expected SVG structure.")

        finally:
            server_process.terminate()
            browser.close()

if __name__ == '__main__':
    run_test()
