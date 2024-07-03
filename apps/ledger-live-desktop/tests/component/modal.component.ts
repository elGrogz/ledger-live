import { step } from "tests/misc/reporters/step";
import { Component } from "tests/page/abstractClasses";

export class Modal extends Component {
  readonly container = this.page.locator(
    '[data-test-id=modal-container][style*="opacity: 1"][style*="transform: scale(1)"]',
  );
  readonly title = this.page.getByTestId("modal-title");
  readonly content = this.page.getByTestId("modal-content");
  protected backdrop = this.page.getByTestId("modal-backdrop");
  protected continueButton = this.page.getByTestId("modal-continue-button");
  protected saveButton = this.page.getByTestId("modal-save-button");
  protected cancelButton = this.page.getByTestId("modal-cancel-button");
  protected confirmButton = this.page.getByTestId("modal-confirm-button");
  protected closeButton = this.page.getByTestId("modal-close-button");
  protected backButton = this.page.getByTestId("modal-back-button");
  protected titleProvider = this.page.getByTestId("modal-provider-title");
  protected rowProvider = this.page.getByTestId("modal-provider-row");
  protected delegateContinueButton = this.page.locator("id=delegate-continue-button");
  protected spendableBanner = this.page.getByTestId("modal-spendable-banner");
  protected maxAmountCheckbox = this.page.getByTestId("modal-max-checkbox");
  protected cryptoAmountField = this.page.getByTestId("modal-amount-field");
  protected continueAmountButton = this.page.locator("id=send-amount-continue-button");
  protected searchOpenButton = this.page.getByText("Show all");
  protected searchCloseButton = this.page.getByText("Show less");
  protected inputSearchField = this.page.getByPlaceholder("Search by name or address...");
  protected stakeProviderContainer = (stakeProviderID: string) =>
    this.page.getByTestId(`stake-provider-container-${stakeProviderID}`);
  protected signContinueButton = this.page.locator("text=Continue");
  protected confirmText = this.page.locator(
    "text=Please confirm the operation on your device to finalize it",
  );

  @step("Click Continue button")
  async continue() {
    await this.continueButton.click();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async confirm() {
    await this.confirmButton.click();
  }

  async back() {
    await this.backButton.click();
  }

  async close() {
    await this.closeButton.click();
  }

  async waitForModalToAppear() {
    await this.container.waitFor({ state: "attached" });
    await this.backdrop.waitFor({ state: "attached" });
  }

  async waitForModalToDisappear() {
    await this.container.waitFor({ state: "detached" });
  }

  async chooseStakeProvider(stakeProvider: string) {
    await this.stakeProviderContainer(stakeProvider).click();
  }

  async getTitleProvider() {
    await this.titleProvider.waitFor();
    return await this.titleProvider.textContent();
  }

  async continueDelegate() {
    await this.delegateContinueButton.click();
  }

  async getSpendableBannerValue() {
    const amountValue = await this.spendableBanner.textContent();
    // removing non numerical values
    return parseInt(amountValue!.replace(/[^0-9.]/g, ""));
  }

  async toggleMaxAmount() {
    await this.maxAmountCheckbox.click();
  }

  async getCryptoAmount() {
    const valueAmount = await this.cryptoAmountField.inputValue();
    return parseInt(valueAmount);
  }

  async countinueSendAmount() {
    await this.continueAmountButton.click();
  }

  async openSearchProviderModal() {
    await this.searchOpenButton.click();
  }

  async inputProvider(provider: string) {
    await this.inputSearchField.fill(provider);
  }

  async selectProvider(providerIndex: number) {
    await this.rowProvider.nth(providerIndex).click();
    await this.searchCloseButton.click();
  }

  async continueToSignTransaction() {
    await this.signContinueButton.click({ force: true });
  }

  async waitForConfirmationScreenToBeDisplayed() {
    await this.confirmText.waitFor({ state: "visible" });
  }
}
