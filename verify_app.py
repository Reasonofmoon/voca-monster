from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173/voca-monster/")

    # Check for title
    print("Checking title...")
    if "AI Vocabulary Builder" not in page.title() and "Vite + React + TS" not in page.title():
        # Title might be default Vite one if not set in index.html, let's check h1
        pass

    # Check for H1
    print("Checking H1...")
    page.wait_for_selector("h1")
    h1_text = page.locator("h1").inner_text()
    print(f"H1 text: {h1_text}")
    assert "AI Vocabulary Builder" in h1_text

    # Check for Welcome Text (which is rendered by AnalyzedContent)
    print("Checking Welcome Text...")
    # The welcome text starts with "🎓 Welcome to the AI-Powered Vocabulary Builder!"
    # It might be split if there were highlights, but initially there are none.
    page.wait_for_selector("p.whitespace-pre-wrap")
    content = page.locator("p.whitespace-pre-wrap").first.inner_text()

    assert "Welcome to the AI-Powered Vocabulary Builder" in content

    print("Taking screenshot...")
    page.screenshot(path="verification.png")

    browser.close()
    print("Verification successful!")

with sync_playwright() as playwright:
    run(playwright)
