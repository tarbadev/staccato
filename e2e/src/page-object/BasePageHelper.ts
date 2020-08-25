import { ElementHandle } from 'puppeteer'

export default abstract class BasePageHelper {
  protected url: string
  protected pageLoadedSelector: string
  private appUrl: string = process.env.APP_URL ? process.env.APP_URL : 'http://localhost:3000'

  protected constructor(url: string, pageLoadedSelector: string) {
    this.url = url
    this.pageLoadedSelector = pageLoadedSelector
  }

  public waitForPageLoaded(): Promise<ElementHandle> {
    return page.waitForSelector(this.pageLoadedSelector)
  }

  public async goTo(): Promise<ElementHandle> {
    await page.goto(`${this.appUrl}${this.url}`, { waitUntil: 'networkidle2' })
    return this.waitForPageLoaded()
  }

  public getCurrentPageUrl(): string {
    return page.url()
  }

  public clickOnSettingsButton(): Promise<void> {
    return this.clickOnElement('[data-menu-settings]')
  }

  protected getTextContentBySelector(selector: string): Promise<string | null> {
    return page.$eval(selector, element => element.textContent)
  }

  protected clickOnElement(selector: string): Promise<void> {
    return page.click(selector)
  }

  protected async typeText(selector: string, text: string): Promise<void> {
    await page.click(selector, { clickCount: 3 })
    await page.keyboard.press('Backspace')
    return page.type(selector, text)
  }

  protected getAllSelectorTextContent(selector: string): Promise<{ name: string | null }[]> {
    return page.$$eval(
      selector,
      elements => elements.map(el => ({ name: el.textContent })),
    )
  }

  protected async getBySelector(selector: string): Promise<ElementHandle> {
    const element = await page.$(selector)
    if (!element) {
      throw new Error(`Element "${selector}" is not present`)
    }
    return element
  }

  protected async waitForTextByCss(cssSelector: string, text: string): Promise<void> {
    await page.waitForFunction(
      (selector, textToSearch) => {
        const element = document.querySelector(selector)
        if (element && element.innerText) {
          return element.innerText.toLowerCase().includes(textToSearch)
        }
      },
      {},
      cssSelector.replace(/"/g, '\\"'),
      text.toLowerCase(),
    )
  }
}