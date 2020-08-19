export default abstract class BasePage {
  protected url: string
  protected pageLoadedSelector: string
  private appUrl: string = process.env.APP_URL ? process.env.APP_URL : 'http://localhost:3000'

  protected constructor(url: string, pageLoadedSelector: string) {
    this.url = url
    this.pageLoadedSelector = pageLoadedSelector
  }

  async waitForPageLoaded() {
    await page.waitForSelector(this.pageLoadedSelector)
  }

  async goTo() {
    await page.goto(`${this.appUrl}${this.url}`, { waitUntil: 'networkidle2' })
    await this.waitForPageLoaded()
  }

  protected getTextContentBySelector(selector: string): Promise<string | null> {
    return page.$eval(selector, element => element.textContent)
  }

  getCurrentPageUrl(): string {
    return page.url()
  }

  clickOnElement(selector: string): Promise<void> {
    return page.click(selector)
  }

  async typeText(selector: string, text: string): Promise<void> {
    await page.click(selector, { clickCount: 3 })
    await page.keyboard.press('Backspace')
    return page.type(selector, text)
  }
}