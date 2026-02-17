from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture console logs
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

    try:
        response = page.goto("http://localhost:5173/voca-monster/", wait_until="domcontentloaded")
        print(f"Status: {response.status}")

        # Wait a bit
        page.wait_for_timeout(2000)

        # Screenshot regardless
        page.screenshot(path="debug_screenshot.png")
        print("Screenshot taken.")

        # Check for H1
        print("Checking H1...")
        if page.locator("h1").count() > 0:
            h1_text = page.locator("h1").inner_text()
            print(f"H1 text: {h1_text}")
        else:
            print("H1 not found!")
            # Dump HTML
            print(page.content())

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="error_screenshot.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
