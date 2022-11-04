import { browser, logging } from 'protractor';
import { E2ePage } from './page-objects/e2e.po';
import * as faker from 'faker';

/**
 * The spec file contains the test suite, setup, and teardown code that will be run.
 * The spec file should use page objects to interact with the elements on the view.
 * A test should never query for elements directly, it should always go through a page object.
 * You can have multiple page objects in a test, although this example doesn't show this.
 * Tests should be kept as independent as possible. Since protractor is run with Jasmine,
 * syntax is the same as unit testing.
 */
describe('E2ePage', () => {
  let page: E2ePage;

  /**
   * Use beforeEach and beforeAll functions to initialize test state.
   */
  beforeAll(() => {
    /**
     * Initializing the page and navigating to it should be present in every
     * spec file.
     */
    page = new E2ePage();
    page.navigateTo();
  });

  /**
   * The description should describe the scenario being tested. In this case we are testing a scenario
   * where the user has submitted a message.
   */
  describe('when the user submits a message', () => {
    let message: string;

    /**
     * Use beforeEach and beforeAll functions to initialize test state. In this case we want to ensure
     * that a message has already been sent and is visible on the view before starting the tests
     */
    beforeEach(async () => {
      message = faker.random.word();
      /**
       * We could use protractor's locator operators to get the input and button elements to perform
       * the message submission, but that would couple this test suite to the applications implementation.
       * Its best practice to use page objects instead. This way if there is an implementation change we
       * just have to modify the page object.
       */
      await page.sendMessage(message);
    });

    /**
     * We use the afterEach callback in this case to cleanup the input text so the old words that were input
     * don't pollute the next test cases.
     */
    afterEach(async () => {
      await page.clearText();
    });

    /**
     * The description should describe the outcome we expect to see from the previously described scenario.
     */
    it('should get displayed with double quotes around it', async () => {
      const messages = await page.getDisplayedMessages();
      expect(messages.includes(message)).toBeTruthy();
    });

    /**
     * This is an extension of the previous scenario where the user has submitted a message after
     * after the user has submitted a message.
     */
    describe('when the user clicks a messages delete icon', () => {
      /**
       * Use beforeEach and beforeAll functions to initialize test state. In this case we want
       * the delete dialog to be open before starting our tests.
       */
      beforeEach(async () => {
        await page.clickDeleteIcon(message);
      });

      afterEach(async () => {
        try {
          await page.cancelDelete();
        } catch (_) {
          // Will catch an error if the delete dialog is not displayed
        }
      });

      it('should open the delete dialog', async () => {
        const isDisplayed = await page.deleteDialog.isDisplayed();
        expect(isDisplayed).toBeTruthy();
      });

      /**
       * This is another extension of the previous scenario where the user has clicked the confirm button on the opened dialog
       * after opening the dialog.
       */
      describe('when the user clicks the confirm button on the delete dialog', () => {
        it('should close the delete dialog and delete the message from the view', async () => {
          await page.confirmDelete();
          const messages = await page.getDisplayedMessages();
          expect(messages.includes(message)).toBeFalsy();
        });
      });

      /**
       * This is another extension of the previous where the user has clicked the cancel button on the opened dialog
       * after opening the dialog.
       */
      describe('when the user clicks the cancel button on the delete dialog', () => {
        it('should close the delete dialog and still show the message on the view', async () => {
          await page.cancelDelete();
          const messages = await page.getDisplayedMessages();
          expect(messages.includes(message)).toBeTruthy();
        });
      });
    });
  });

  /**
   * Default code generated by angular to check for errors in the browser
   */
  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    );
  });
});
