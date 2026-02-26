import time
from playwright.sync_api import sync_playwright

def test_homepage(page):
    # Listen to console messages
    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Page Error: {err}"))

    print("Navigating to homepage...")
    response = page.goto("http://localhost:5173/voca-monster/")
    print(f"Status: {response.status}")

    print("Waiting for title...")
    try:
        page.wait_for_selector("text=AI Vocabulary Builder", timeout=5000)
    except Exception as e:
        print(f"Wait failed: {e}")
        # Take screenshot of whatever is there
        page.screenshot(path="verification/debug.png")
        raise e

    print("Waiting for AnalyzedContent text...")
    page.wait_for_selector("text=Welcome to the AI-Powered Vocabulary Builder", timeout=5000)

    print("Taking screenshot...")
    page.screenshot(path="verification/verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            test_homepage(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
