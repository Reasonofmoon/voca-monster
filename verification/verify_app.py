from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Page Error: {err}"))

    try:
        print("Navigating...")
        page.goto("http://localhost:5173/voca-monster/")
        print("Waiting for h1...")

        # Wait for the h1 to load
        page.wait_for_selector("h1", timeout=10000)

        # Take a screenshot
        page.screenshot(path="verification/verification.png")
    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="verification/error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
