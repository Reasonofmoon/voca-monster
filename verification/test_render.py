import time
from playwright.sync_api import sync_playwright

def test_homepage(page):
    print("Navigating to homepage...")
    page.goto("http://localhost:5173/voca-monster/")

    print("Waiting for title...")
    page.wait_for_selector("text=AI Vocabulary Builder", timeout=10000)

    print("Waiting for AnalyzedContent text...")
    page.wait_for_selector("text=Welcome to the AI-Powered Vocabulary Builder", timeout=10000)

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
            try:
                page.screenshot(path="verification/error.png")
            except:
                pass
        finally:
            browser.close()
