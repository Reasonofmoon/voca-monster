from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

        # Subscribe to console logs
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

        # Navigate to the app
        print("Navigating to app...")
        try:
            page.goto("http://localhost:5173/voca-monster/", timeout=60000)
        except Exception as e:
            print(f"Navigation failed: {e}")

        # Wait for content to be visible
        print("Waiting for content...")
        try:
            # The AnalyzedContent is inside div.prose
            expect(page.locator("div.prose")).to_be_visible(timeout=10000)
            expect(page.locator("body")).to_contain_text("Welcome to the AI-Powered Vocabulary Builder!")
            print("Content check passed.")
        except Exception as e:
            print(f"Content check failed: {e}")

        # Take screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification/verification.png")

        browser.close()
        print("Done.")

if __name__ == "__main__":
    run()
