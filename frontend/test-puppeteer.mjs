import puppeteer from 'puppeteer';

(async () => {
  try {
    console.log("Launching browser");
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    console.log("Browser launched");
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
    
    console.log("Navigating");
    await page.goto('http://localhost:9800/templates', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log("Navigation complete");
    await page.screenshot({ path: 'test-screenshot.png' });
    console.log("Screenshot saved");
    await browser.close();
  } catch (e) {
    console.error("Puppeteer Error:", e);
  }
  process.exit(0);
})();
