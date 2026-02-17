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

        # Check for H1
        print("Checking H1...")
        if page.locator("h1").count() > 0:
            h1_text = page.locator("h1").inner_text()
            print(f"H1 text: {h1_text}")
            assert "AI Vocabulary Builder" in h1_text
        else:
            print("H1 not found!")
            exit(1)

        # Check for AnalyzedContent (Welcome Text)
        print("Checking Welcome Text...")
        # Search for a unique string in the welcome text
        welcome_snippet = "Welcome to the AI-Powered Vocabulary Builder"

        # AnalyzedContent renders <p className="whitespace-pre-wrap">
        locator = page.locator("p.whitespace-pre-wrap")
        if locator.count() > 0:
            content = locator.first.inner_text()
            if welcome_snippet in content:
                print("Welcome Text FOUND!")
            else:
                print(f"Welcome Text NOT FOUND in p tag. Content start: {content[:50]}...")
        else:
            print("p.whitespace-pre-wrap NOT FOUND!")
            # Dump body text to see what's there
            print(page.locator("body").inner_text()[:200])

        page.screenshot(path="verification_success.png")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="error_screenshot.png")
        exit(1)

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
