package com.itams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ManageAssetTest extends BaseTest {

    private static final String BASE_URL =
            "http://localhost:3000";

    // Asset Manager credentials
    private static final String ASSET_MANAGER_ID =
            "260822002";

    private static final String ASSET_MANAGER_PASSWORD =
            "Itams@2026a";

    private static final Duration WAIT =
            Duration.ofSeconds(15);

    @BeforeEach
    public void loginAndOpenManageAsset() {

        driver.get(BASE_URL);

        waitForPageLoad();

        loginAsAssetManager();

        openManageAsset();

        waitForManageAssetPage();
    }

    // =========================================================
    // LOGIN
    // =========================================================

    private void loginAsAssetManager() {

        WebElement employeeId = findFirstVisible(
                By.name("employeeIdOrEmail"),
                By.name("employeeId"),
                By.cssSelector("input[type='text']")
        );

        assertNotNull(
                employeeId,
                "Employee ID field not found"
        );

        employeeId.clear();
        employeeId.sendKeys(ASSET_MANAGER_ID);

        WebElement password = findFirstVisible(
                By.name("password"),
                By.cssSelector("input[type='password']")
        );

        assertNotNull(
                password,
                "Password field not found"
        );

        password.clear();
        password.sendKeys(ASSET_MANAGER_PASSWORD);

        WebElement loginButton = findFirstVisible(
                By.cssSelector("form button[type='submit']"),
                By.xpath("//button[normalize-space()='Login']"),
                By.xpath("//button[contains(normalize-space(),'Login')]")
        );

        assertNotNull(
                loginButton,
                "Login button not found"
        );

        safeClick(loginButton);

        // Handle Login Successful alert
        acceptAlertIfPresent();

        sleep(800);
    }

    // =========================================================
    // OPEN MANAGE ASSET
    // =========================================================

    private void openManageAsset() {

        if (isManageAssetPage()) {
            return;
        }

        WebElement manageAsset = findFirstVisible(
                By.xpath("//*[normalize-space()='Manage Asset']"),
                By.xpath("//button[normalize-space()='Manage Asset']"),
                By.xpath("//a[normalize-space()='Manage Asset']"),
                By.xpath("//div[normalize-space()='Manage Asset']")
        );

        if (manageAsset != null) {

            safeClick(manageAsset);

            if (waitForManageAssetShort()) {
                return;
            }
        }

        // Sometimes Manage Asset is inside Asset Management
        WebElement assetManagement = findFirstVisible(
                By.xpath(
                        "//*[normalize-space()='Asset Management']"
                ),
                By.xpath(
                        "//button[contains(normalize-space(),'Asset Management')]"
                ),
                By.xpath(
                        "//a[contains(normalize-space(),'Asset Management')]"
                )
        );

        if (assetManagement != null) {

            safeClick(assetManagement);

            sleep(700);

            manageAsset = findFirstVisible(
                    By.xpath(
                            "//*[normalize-space()='Manage Asset']"
                    ),
                    By.xpath(
                            "//button[normalize-space()='Manage Asset']"
                    ),
                    By.xpath(
                            "//a[normalize-space()='Manage Asset']"
                    ),
                    By.xpath(
                            "//div[normalize-space()='Manage Asset']"
                    )
            );

            if (manageAsset != null) {
                safeClick(manageAsset);
            }
        }

        waitForManageAssetPage();
    }

    // =========================================================
    // PAGE CHECK
    // =========================================================

    private boolean isManageAssetPage() {

        try {

            return !driver.findElements(
                    By.cssSelector(".ma-page-title")
            ).isEmpty();

        } catch (Exception e) {

            return false;
        }
    }

    private boolean waitForManageAssetShort() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(5)
            ).until(
                    ExpectedConditions.visibilityOfElementLocated(
                            By.cssSelector(".ma-page-title")
                    )
            );

            return true;

        } catch (Exception e) {

            return false;
        }
    }

    private void waitForManageAssetPage() {

        WebElement title = new WebDriverWait(
                driver,
                WAIT
        ).until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-page-title")
                )
        );

        assertEquals(
                "Manage Asset",
                title.getText().trim()
        );
    }

    // =========================================================
    // TEST 1 - PAGE LOAD
    // =========================================================

    @Test
    public void manageAssetPageLoadTest() {

        WebElement title = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-page-title")
                )
        );

        assertTrue(title.isDisplayed());

        assertEquals(
                "Manage Asset",
                title.getText().trim()
        );
    }

    // =========================================================
    // TEST 2 - SUBTITLE
    // =========================================================

    @Test
    public void pageSubtitleTest() {

        WebElement subtitle = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-page-subtitle")
                )
        );

        assertTrue(
                subtitle.getText().contains(
                        "Edit or delete existing IT assets"
                )
        );
    }

    // =========================================================
    // TEST 3 - LOGO
    // =========================================================

    @Test
    public void logoTest() {

        WebElement logo = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-nav-logo-title")
                )
        );

        assertEquals(
                "ITAMS",
                logo.getText().trim()
        );
    }

    // =========================================================
    // TEST 4 - USERNAME
    // =========================================================

    @Test
    public void usernameTest() {

        WebElement username = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-nav-username")
                )
        );

        assertTrue(username.isDisplayed());

        assertFalse(
                username.getText().trim().isEmpty()
        );
    }

    // =========================================================
    // TEST 5 - LOGOUT BUTTON
    // =========================================================

    @Test
    public void logoutButtonTest() {

        WebElement logout = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-logout-btn")
                )
        );

        assertTrue(logout.isDisplayed());

        assertEquals(
                "Logout",
                logout.getText().trim()
        );
    }

    // =========================================================
    // TEST 6 - SEARCH ASSET CARD
    // =========================================================

    @Test
    public void searchAssetCardTest() {

        WebElement heading = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-card-heading")
                )
        );

        assertTrue(
                heading.getText().contains(
                        "Search Asset"
                )
        );
    }

    // =========================================================
    // TEST 7 - ASSET ID INPUT
    // =========================================================

    @Test
    public void assetIdInputTest() {

        WebElement input = getAssetIdInput();

        assertTrue(input.isDisplayed());

        assertEquals(
                "Enter Asset ID (e.g., LAP001)",
                input.getAttribute("placeholder")
        );

        assertEquals(
                "6",
                input.getAttribute("maxlength")
        );
    }

    // =========================================================
    // TEST 8 - ASSET TYPE DROPDOWN
    // =========================================================

    @Test
    public void assetTypeDropdownTest() {

        WebElement select = getAssetTypeSelect();

        assertTrue(select.isDisplayed());

        List<WebElement> options =
                select.findElements(By.tagName("option"));

        assertEquals(
                10,
                options.size(),
                "Expected 10 asset type options"
        );

        assertTrue(
                getSelectOptionTexts(select)
                        .contains("All Assets")
        );

        assertTrue(
                getSelectOptionTexts(select)
                        .contains("Monitor")
        );

        assertTrue(
                getSelectOptionTexts(select)
                        .contains("Keyboard")
        );

        assertTrue(
                getSelectOptionTexts(select)
                        .contains("Laptop")
        );

        assertTrue(
                getSelectOptionTexts(select)
                        .contains("Mouse")
        );

        assertTrue(
                getSelectOptionTexts(select)
                        .contains("Printer")
        );

        assertTrue(
                getSelectOptionTexts(select)
                        .contains("Desktop")
        );

        assertTrue(
                getSelectOptionTexts(select)
                        .contains("Webcam")
        );

        assertTrue(
                getSelectOptionTexts(select)
                        .contains("Scanner")
        );

        assertTrue(
                getSelectOptionTexts(select)
                        .contains("Projector")
        );
    }

    // =========================================================
    // TEST 9 - SEARCH BUTTON
    // =========================================================

    @Test
    public void searchButtonTest() {

        WebElement button = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-search-btn")
                )
        );

        assertTrue(button.isDisplayed());

        assertEquals(
                "Search",
                button.getText().trim()
        );
    }

    // =========================================================
    // TEST 10 - SEARCH WITHOUT INPUT
    // =========================================================

    @Test
    public void emptySearchValidationTest() {

        WebElement input = getAssetIdInput();

        input.clear();

        selectAssetType("All Assets");

        clickSearch();

        WebElement error = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-search-error-container")
                )
        );

        assertTrue(
                error.getText().contains(
                        "Please enter an Asset ID or select an Asset Type"
                )
        );
    }

    // =========================================================
    // TEST 11 - INVALID ASSET ID
    // =========================================================

    @Test
    public void invalidAssetIdFormatTest() {

        WebElement input = getAssetIdInput();

        input.clear();
        input.sendKeys("ABC12");

        selectAssetType("All Assets");

        clickSearch();

        WebElement error = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-search-error-container")
                )
        );

        assertTrue(
                error.getText().contains(
                        "Asset ID must be exactly 6 characters"
                )
        );
    }

    // =========================================================
    // TEST 12 - LOWERCASE INPUT
    // =========================================================

    @Test
    public void lowercaseAssetIdConversionTest() {

        WebElement input = getAssetIdInput();

        input.clear();
        input.sendKeys("lap001");

        assertEquals(
                "LAP001",
                input.getAttribute("value")
        );
    }

    // =========================================================
    // TEST 13 - SPECIAL CHARACTER INPUT
    // =========================================================

    @Test
    public void specialCharacterAssetIdTest() {

        WebElement input = getAssetIdInput();

        input.clear();
        input.sendKeys("LAP@01");

        String value =
                input.getAttribute("value");

        assertFalse(
                value.contains("@"),
                "Special characters should be removed"
        );
    }

    // =========================================================
    // TEST 14 - VALID ASSET ID SEARCH
    // =========================================================

    @Test
    public void validAssetIdSearchTest() {

        WebElement input = getAssetIdInput();

        input.clear();
        input.sendKeys("LAP001");

        selectAssetType("All Assets");

        clickSearch();

        sleep(700);

        String body = getBodyText();

        assertTrue(
                body.contains("LAP001") ||
                body.contains("No assets found."),
                "Search did not complete correctly"
        );
    }

    // =========================================================
    // TEST 15 - SEARCH BY ASSET TYPE
    // =========================================================

    @Test
    public void searchByAssetTypeTest() {

        getAssetIdInput().clear();

        selectAssetType("Laptop");

        clickSearch();

        sleep(700);

        WebElement selected =
                getAssetTypeSelect();

        assertEquals(
                "Laptop",
                getSelectedValue(selected)
        );
    }

    // =========================================================
    // TEST 16 - MONITOR TYPE SEARCH
    // =========================================================

    @Test
    public void monitorTypeSearchTest() {

        getAssetIdInput().clear();

        selectAssetType("Monitor");

        clickSearch();

        sleep(500);

        assertEquals(
                "Monitor",
                getSelectedValue(
                        getAssetTypeSelect()
                )
        );
    }

    // =========================================================
    // TEST 17 - LAPTOP TYPE SEARCH
    // =========================================================

    @Test
    public void laptopTypeSearchTest() {

        getAssetIdInput().clear();

        selectAssetType("Laptop");

        clickSearch();

        sleep(500);

        assertEquals(
                "Laptop",
                getSelectedValue(
                        getAssetTypeSelect()
                )
        );
    }

    // =========================================================
    // TEST 18 - KEYBOARD TYPE SEARCH
    // =========================================================

    @Test
    public void keyboardTypeSearchTest() {

        getAssetIdInput().clear();

        selectAssetType("Keyboard");

        clickSearch();

        sleep(500);

        assertEquals(
                "Keyboard",
                getSelectedValue(
                        getAssetTypeSelect()
                )
        );
    }

    // =========================================================
    // TEST 19 - ENTER KEY SEARCH
    // =========================================================

    @Test
    public void enterKeySearchTest() {

        WebElement input = getAssetIdInput();

        input.clear();
        input.sendKeys("LAP001");

        input.sendKeys(Keys.ENTER);

        sleep(700);

        String value =
                input.getAttribute("value");

        assertEquals(
                "LAP001",
                value
        );
    }

    // =========================================================
    // TEST 20 - ASSET LIST
    // =========================================================

    @Test
    public void assetListTest() {

        WebElement heading = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ma-card--table .ma-card-heading"
                        )
                )
        );

        assertEquals(
                "Asset List",
                heading.getText().trim()
        );
    }

    // =========================================================
    // TEST 21 - ASSET TABLE HEADERS
    // =========================================================

    @Test
    public void assetTableHeadersTest() {

        List<WebElement> headers =
                driver.findElements(
                        By.cssSelector(
                                ".ma-table thead th"
                        )
                );

        assertEquals(
                3,
                headers.size()
        );

        assertEquals(
                "Asset ID",
                headers.get(0).getText().trim()
        );

        assertEquals(
                "Asset Type",
                headers.get(1).getText().trim()
        );

        assertEquals(
                "Actions",
                headers.get(2).getText().trim()
        );
    }

    // =========================================================
    // TEST 22 - ASSET DATA / DEMO DATA
    // =========================================================

    @Test
    public void assetDataTest() {

        waitForAssetTable();

        String tableText =
                driver.findElement(
                        By.cssSelector(".ma-table")
                ).getText();

        // Either backend data or demo data is valid.
        assertTrue(
                tableText.contains("LAP") ||
                tableText.contains("MON") ||
                tableText.contains("KEY") ||
                tableText.contains("MOU") ||
                tableText.contains("PRI") ||
                tableText.contains("DES") ||
                tableText.contains("No assets found."),
                "Asset list did not load"
        );
    }

    // =========================================================
    // TEST 23 - EDIT BUTTON
    // =========================================================

    @Test
    public void editButtonTest() {

        waitForAssetTable();

        List<WebElement> editButtons =
                driver.findElements(
                        By.cssSelector(".ma-btn-edit")
                );

        if (editButtons.isEmpty()) {

            // No database/demo rows.
            assertTrue(
                    getBodyText().contains(
                            "No assets found."
                    ) ||
                    getBodyText().contains(
                            "Loading assets..."
                    )
            );

            return;
        }

        assertTrue(
                editButtons.get(0).isDisplayed()
        );

        assertEquals(
                "Edit",
                editButtons.get(0).getText().trim()
        );
    }

    // =========================================================
    // TEST 24 - DELETE BUTTON
    // =========================================================

    @Test
    public void deleteButtonTest() {

        waitForAssetTable();

        List<WebElement> deleteButtons =
                driver.findElements(
                        By.cssSelector(".ma-btn-delete")
                );

        if (!deleteButtons.isEmpty()) {

            assertTrue(
                    deleteButtons.get(0).isDisplayed()
            );

            assertEquals(
                    "Delete",
                    deleteButtons.get(0)
                            .getText()
                            .trim()
            );
        }
    }

    // =========================================================
    // TEST 25 - OPEN EDIT PAGE
    // =========================================================

    @Test
    public void openEditPageTest() {

        openFirstAssetForEdit();

        WebElement title = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ma-edit-page-title"
                        )
                )
        );

        assertEquals(
                "Edit Asset",
                title.getText().trim()
        );
    }

    // =========================================================
    // TEST 26 - EDIT FORM FIELDS
    // =========================================================

    @Test
    public void editFormFieldsTest() {

        openFirstAssetForEdit();

        assertTrue(
                findFirstVisible(
                        By.cssSelector(
                                ".ma-input--readonly"
                        )
                ).isDisplayed()
        );

        assertTrue(
                findFirstVisible(
                        By.cssSelector(
                                ".ma-edit-form select"
                        )
                ).isDisplayed()
        );

        assertTrue(
                findFirstVisible(
                        By.cssSelector(
                                ".ma-edit-form input[type='text']"
                        )
                ).isDisplayed()
        );

        assertTrue(
                findFirstVisible(
                        By.cssSelector(
                                ".ma-edit-form input[type='date']"
                        )
                ).isDisplayed()
        );

        assertTrue(
                findFirstVisible(
                        By.cssSelector(
                                ".ma-edit-form textarea"
                        )
                ).isDisplayed()
        );
    }

    // =========================================================
    // TEST 27 - EDIT ASSET ID READONLY
    // =========================================================

    @Test
    public void editAssetIdReadonlyTest() {

        openFirstAssetForEdit();

        WebElement assetId =
                wait().until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".ma-input--readonly"
                                )
                        )
                );

        assertEquals(
                "true",
                assetId.getAttribute("readonly")
        );
    }

    // =========================================================
    // TEST 28 - UPDATE BUTTON DISABLED WITHOUT CHANGES
    // =========================================================

    @Test
    public void updateButtonDisabledWithoutChangesTest() {

        openFirstAssetForEdit();

        WebElement update =
                wait().until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".ma-edit-save-btn"
                                )
                        )
                );

        assertEquals(
                "true",
                update.getAttribute("disabled")
        );
    }

    // =========================================================
    // TEST 29 - MODEL VALIDATION
    // =========================================================

    @Test
    public void invalidModelValidationTest() {

        openFirstAssetForEdit();

        WebElement model =
                getEditModelInput();

        model.clear();
        model.sendKeys("A");

        changeDescriptionIfNeeded();

        clickUpdate();

        sleep(400);

        assertTrue(
                getBodyText().contains(
                        "Model must contain at least 2 characters"
                )
        );
    }

    // =========================================================
    // TEST 30 - MODEL MAX LENGTH
    // =========================================================

    @Test
    public void modelMaxLengthTest() {

        openFirstAssetForEdit();

        WebElement model =
                getEditModelInput();

        String longText =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
                + "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

        model.clear();
        model.sendKeys(longText);

        String value =
                model.getAttribute("value");

        assertTrue(
                value.length() <= 50,
                "Model exceeded 50 characters"
        );
    }

    // =========================================================
    // TEST 31 - DESCRIPTION MINIMUM LENGTH
    // =========================================================

    @Test
    public void invalidDescriptionValidationTest() {

        openFirstAssetForEdit();

        WebElement description =
                getEditDescription();

        description.clear();
        description.sendKeys("Short");

        changeModelIfNeeded();

        clickUpdate();

        sleep(400);

        assertTrue(
                getBodyText().contains(
                        "Description must contain at least 10 characters"
                )
        );
    }

    // =========================================================
    // TEST 32 - DESCRIPTION MAX LENGTH
    // =========================================================

    @Test
    public void descriptionMaxLengthTest() {

        openFirstAssetForEdit();

        WebElement description =
                getEditDescription();

        StringBuilder text =
                new StringBuilder();

        for (int i = 0; i < 600; i++) {
            text.append("a");
        }

        description.clear();
        description.sendKeys(text.toString());

        String value =
                description.getAttribute("value");

        assertTrue(
                value.length() <= 500,
                "Description exceeded 500 characters"
        );
    }

    // =========================================================
    // TEST 33 - CANCEL EDIT
    // =========================================================

    @Test
    public void cancelEditTest() {

        openFirstAssetForEdit();

        WebElement cancel =
                wait().until(
                        ExpectedConditions.elementToBeClickable(
                                By.cssSelector(
                                        ".ma-edit-cancel-btn"
                                )
                        )
                );

        safeClick(cancel);

        wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-page-title")
                )
        );

        assertTrue(
                isManageAssetPage()
        );
    }

    // =========================================================
    // TEST 34 - BACK FROM EDIT
    // =========================================================

    @Test
    public void backFromEditTest() {

        openFirstAssetForEdit();

        WebElement back =
                wait().until(
                        ExpectedConditions.elementToBeClickable(
                                By.cssSelector(
                                        ".ma-edit-page-container .ma-back-btn"
                                )
                        )
                );

        safeClick(back);

        wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-page-title")
                )
        );

        assertTrue(
                isManageAssetPage()
        );
    }

    // =========================================================
    // TEST 35 - DELETE CONFIRMATION
    // =========================================================

    @Test
    public void deleteConfirmationPopupTest() {

        waitForAssetTable();

        List<WebElement> deleteButtons =
                driver.findElements(
                        By.cssSelector(
                                ".ma-btn-delete"
                        )
                );

        if (deleteButtons.isEmpty()) {
            return;
        }

        safeClick(deleteButtons.get(0));

        WebElement modal = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ma-modal-overlay"
                        )
                )
        );

        assertTrue(modal.isDisplayed());

        assertTrue(
                getBodyText().contains(
                        "Delete Asset"
                )
        );

        assertTrue(
                getBodyText().contains(
                        "Are you sure you want to delete this asset?"
                )
        );
    }

    // =========================================================
    // TEST 36 - DELETE POPUP BUTTONS
    // =========================================================

    @Test
    public void deletePopupButtonsTest() {

        waitForAssetTable();

        List<WebElement> deleteButtons =
                driver.findElements(
                        By.cssSelector(
                                ".ma-btn-delete"
                        )
                );

        if (deleteButtons.isEmpty()) {
            return;
        }

        safeClick(deleteButtons.get(0));

        WebElement noButton =
                wait().until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".ma-modal-cancel"
                                )
                        )
                );

        WebElement yesButton =
                wait().until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".ma-modal-delete"
                                )
                        )
                );

        assertEquals(
                "No",
                noButton.getText().trim()
        );

        assertEquals(
                "Yes",
                yesButton.getText().trim()
        );
    }

    // =========================================================
    // TEST 37 - CANCEL DELETE
    // =========================================================

    @Test
    public void cancelDeleteTest() {

        waitForAssetTable();

        List<WebElement> deleteButtons =
                driver.findElements(
                        By.cssSelector(
                                ".ma-btn-delete"
                        )
                );

        if (deleteButtons.isEmpty()) {
            return;
        }

        safeClick(deleteButtons.get(0));

        WebElement noButton =
                wait().until(
                        ExpectedConditions.elementToBeClickable(
                                By.cssSelector(
                                        ".ma-modal-cancel"
                                )
                        )
                );

        safeClick(noButton);

        wait().until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.cssSelector(
                                ".ma-modal-overlay"
                        )
                )
        );

        assertTrue(
                driver.findElements(
                        By.cssSelector(
                                ".ma-modal-overlay"
                        )
                ).isEmpty()
        );
    }

    // =========================================================
    // TEST 38 - PAGINATION DROPDOWN
    // =========================================================

    @Test
    public void rowsPerPageDropdownTest() {

        WebElement select =
                wait().until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".ma-rows-select"
                                )
                        )
                );

        List<WebElement> options =
                select.findElements(
                        By.tagName("option")
                );

        assertEquals(
                4,
                options.size()
        );

        assertTrue(
                getSelectOptionTexts(select)
                        .contains("10")
        );

        assertTrue(
                getSelectOptionTexts(select)
                        .contains("30")
        );

        assertTrue(
                getSelectOptionTexts(select)
                        .contains("50")
        );

        assertTrue(
                getSelectOptionTexts(select)
                        .contains("All")
        );
    }

    // =========================================================
    // TEST 39 - PAGINATION 30
    // =========================================================

    @Test
    public void rowsPerPage30Test() {

        WebElement select =
                getRowsSelect();

        selectOption(select, "30");

        assertEquals(
                "30",
                getSelectedValue(select)
        );
    }

    // =========================================================
    // TEST 40 - PAGINATION 50
    // =========================================================

    @Test
    public void rowsPerPage50Test() {

        WebElement select =
                getRowsSelect();

        selectOption(select, "50");

        assertEquals(
                "50",
                getSelectedValue(select)
        );
    }

    // =========================================================
    // TEST 41 - PAGINATION ALL
    // =========================================================

    @Test
    public void rowsPerPageAllTest() {

        WebElement select =
                getRowsSelect();

        selectOption(select, "All");

        assertEquals(
                "All",
                getSelectedValue(select)
        );
    }

    // =========================================================
    // TEST 42 - PAGINATION INFO
    // =========================================================

    @Test
    public void paginationInfoTest() {

        WebElement info =
                wait().until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".ma-pagination-info"
                                )
                        )
                );

        assertTrue(
                info.getText().contains(
                        "Showing"
                )
        );

        assertTrue(
                info.getText().contains(
                        "assets"
                )
        );
    }

    // =========================================================
    // TEST 43 - BACK BUTTON MAIN PAGE
    // =========================================================

    @Test
    public void mainBackButtonTest() {

        WebElement back =
                wait().until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".ma-table-footer .ma-back-btn"
                                )
                        )
                );

        assertEquals(
                "← Back",
                back.getText().trim()
        );
    }

    // =========================================================
    // TEST 44 - SEARCH TYPE + ASSET ID
    // =========================================================

    @Test
    public void assetIdAndTypeSearchTest() {

        WebElement input =
                getAssetIdInput();

        input.clear();
        input.sendKeys("LAP001");

        selectAssetType("Laptop");

        clickSearch();

        sleep(700);

        assertEquals(
                "Laptop",
                getSelectedValue(
                        getAssetTypeSelect()
                )
        );

        assertEquals(
                "LAP001",
                input.getAttribute("value")
        );
    }

    // =========================================================
    // HELPER - OPEN FIRST ASSET FOR EDIT
    // =========================================================

    private void openFirstAssetForEdit() {

        // Reset filters first.
        getAssetIdInput().clear();

        selectAssetType("All Assets");

        clickSearch();

        sleep(500);

        waitForAssetTable();

        List<WebElement> editButtons =
                driver.findElements(
                        By.cssSelector(
                                ".ma-btn-edit"
                        )
                );

        if (editButtons.isEmpty()) {

            fail(
                    "No asset available to open Edit page."
            );
        }

        // Re-find element immediately before clicking
        // to reduce stale-element failures.
        WebElement edit =
                wait().until(
                        ExpectedConditions.elementToBeClickable(
                                By.cssSelector(
                                        ".ma-btn-edit"
                                )
                        )
                );

        safeClick(edit);

        wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ma-edit-page-title"
                        )
                )
        );
    }

    // =========================================================
    // HELPER - ASSET ID INPUT
    // =========================================================

    private WebElement getAssetIdInput() {

        return wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ma-search-row input[type='text']"
                        )
                )
        );
    }

    // =========================================================
    // HELPER - ASSET TYPE
    // =========================================================

    private WebElement getAssetTypeSelect() {

        return wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ma-search-row select"
                        )
                )
        );
    }

    // =========================================================
    // HELPER - EDIT MODEL
    // =========================================================

    private WebElement getEditModelInput() {

        return wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ma-edit-form input[type='text']:not(.ma-input--readonly)"
                        )
                )
        );
    }

    // =========================================================
    // HELPER - EDIT DESCRIPTION
    // =========================================================

    private WebElement getEditDescription() {

        return wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ma-edit-form textarea"
                        )
                )
        );
    }

    // =========================================================
    // HELPER - CLICK SEARCH
    // =========================================================

    private void clickSearch() {

        WebElement button =
                wait().until(
                        ExpectedConditions.elementToBeClickable(
                                By.cssSelector(
                                        ".ma-search-btn"
                                )
                        )
                );

        safeClick(button);
    }

    // =========================================================
    // HELPER - WAIT TABLE
    // =========================================================

    private void waitForAssetTable() {

        wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-table")
                )
        );

        sleep(400);
    }

    // =========================================================
    // HELPER - ROWS SELECT
    // =========================================================

    private WebElement getRowsSelect() {

        return wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ma-rows-select"
                        )
                )
        );
    }

    // =========================================================
    // HELPER - SELECT ASSET TYPE
    // =========================================================

    private void selectAssetType(
            String type
    ) {

        WebElement select =
                getAssetTypeSelect();

        selectOption(select, type);
    }

    // =========================================================
    // HELPER - SELECT OPTION
    // =========================================================

    private void selectOption(
            WebElement select,
            String value
    ) {

        org.openqa.selenium.support.ui.Select dropdown =
                new org.openqa.selenium.support.ui.Select(
                        select
                );

        dropdown.selectByVisibleText(value);
    }

    // =========================================================
    // HELPER - SELECTED VALUE
    // =========================================================

    private String getSelectedValue(
            WebElement select
    ) {

        return new org.openqa.selenium.support.ui.Select(
                select
        )
                .getFirstSelectedOption()
                .getText()
                .trim();
    }

    // =========================================================
    // HELPER - OPTION TEXT
    // =========================================================

    private String getSelectOptionTexts(
            WebElement select
    ) {

        StringBuilder result =
                new StringBuilder();

        for (WebElement option :
                select.findElements(
                        By.tagName("option")
                )) {

            result.append(
                    option.getText()
            ).append("\n");
        }

        return result.toString();
    }

    // =========================================================
    // HELPER - CHANGE MODEL IF NECESSARY
    // =========================================================

    private void changeModelIfNeeded() {

        WebElement model =
                getEditModelInput();

        String current =
                model.getAttribute("value");

        if (current == null ||
                current.trim().isEmpty()) {

            model.clear();
            model.sendKeys("Test Model");
            return;
        }

        model.clear();
        model.sendKeys(
                current + " Updated"
        );
    }

    // =========================================================
    // HELPER - CHANGE DESCRIPTION IF NECESSARY
    // =========================================================

    private void changeDescriptionIfNeeded() {

        WebElement description =
                getEditDescription();

        String current =
                description.getAttribute("value");

        if (current == null ||
                current.trim().isEmpty()) {

            description.clear();

            description.sendKeys(
                    "Valid asset description for testing"
            );

            return;
        }

        description.clear();

        description.sendKeys(
                current + " Updated"
        );
    }

    // =========================================================
    // HELPER - UPDATE BUTTON
    // =========================================================

    private void clickUpdate() {

        WebElement update =
                wait().until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".ma-edit-save-btn"
                                )
                        )
                );

        scrollIntoView(update);

        safeClick(update);
    }

    // =========================================================
    // HELPER - FIND FIRST VISIBLE
    // =========================================================

    private WebElement findFirstVisible(
            By... locators
    ) {

        for (By locator : locators) {

            try {

                List<WebElement> elements =
                        driver.findElements(locator);

                for (WebElement element :
                        elements) {

                    try {

                        if (element.isDisplayed()) {
                            return element;
                        }

                    } catch (
                            StaleElementReferenceException ignored
                    ) {
                    }
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }

    // =========================================================
    // HELPER - SAFE CLICK
    // =========================================================

    private void safeClick(
            WebElement element
    ) {

        try {

            scrollIntoView(element);

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(8)
            ).until(
                    ExpectedConditions.elementToBeClickable(
                            element
                    )
            );

            element.click();

        } catch (Exception e) {

            try {

                ((JavascriptExecutor) driver)
                        .executeScript(
                                "arguments[0].click();",
                                element
                        );

            } catch (Exception ignored) {
            }
        }
    }

    // =========================================================
    // HELPER - SCROLL
    // =========================================================

    private void scrollIntoView(
            WebElement element
    ) {

        try {

            ((JavascriptExecutor) driver)
                    .executeScript(
                            "arguments[0].scrollIntoView({"
                                    + "block:'center',"
                                    + "inline:'center'"
                                    + "});",
                            element
                    );

        } catch (Exception ignored) {
        }
    }

    // =========================================================
    // HELPER - ALERT
    // =========================================================

    private void acceptAlertIfPresent() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(4)
            ).until(
                    ExpectedConditions.alertIsPresent()
            );

            driver.switchTo()
                    .alert()
                    .accept();

        } catch (Exception ignored) {
        }
    }

    // =========================================================
    // HELPER - BODY TEXT
    // =========================================================

    private String getBodyText() {

        return driver.findElement(
                By.tagName("body")
        ).getText();
    }

    // =========================================================
    // HELPER - PAGE LOAD
    // =========================================================

    private void waitForPageLoad() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(15)
            ).until(
                    d -> ((JavascriptExecutor) d)
                            .executeScript(
                                    "return document.readyState"
                            )
                            .equals("complete")
            );

        } catch (Exception ignored) {
        }
    }

    // =========================================================
    // HELPER - WAIT
    // =========================================================

    private WebDriverWait wait() {

        return new WebDriverWait(
                driver,
                WAIT
        );
    }

    // =========================================================
    // HELPER - SLEEP
    // =========================================================

    private void sleep(long milliseconds) {

        try {

            Thread.sleep(milliseconds);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();
        }
    }
}
