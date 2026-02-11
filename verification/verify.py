from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Page Error: {err}"))

        try:
            print("Navigating to page...")
            page.goto("http://localhost:5173/voca-monster/")

            print("Waiting for content...")
            page.wait_for_timeout(5000)

            print("Taking screenshot...")
            page.screenshot(path="verification/screenshot.png")
            print("Screenshot saved.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
