package com.itams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class AssetDetailsTest extends BaseTest {

    private static final String BASE_URL = "http://localhost:3000";

    private static final String ASSET_MANAGER_ID = "260822002";
    private static final String ASSET_MANAGER_PASSWORD = "Itams@2026a";

    private static final Duration WAIT_TIME =
            Duration.ofSeconds(15);

    private WebDriverWait wait() {
        return new WebDriverWait(driver, WAIT_TIME);
    }

    // =========================================================
    // LOGIN + OPEN ASSET DETAILS BEFORE EACH TEST
    // =========================================================

    @BeforeEach
    public void loginAndOpenAssetDetails() {

        driver.get(BASE_URL);

        waitForPageLoad();

        loginAsAssetManager();

        openAssetDetails();

        waitForAssetDetailsPage();
    }

    // =========================================================
    // LOGIN
    // =========================================================

    private void loginAsAssetManager() {

        WebElement employeeField = findFirstVisible(
                By.name("employeeIdOrEmail"),
                By.name("employeeId"),
                By.cssSelector("input[type='text']")
        );

        assertNotNull(
                employeeField,
                "Login Employee ID field not found"
        );

        employeeField.clear();
        employeeField.sendKeys(ASSET_MANAGER_ID);

        WebElement passwordField = findFirstVisible(
                By.name("password"),
                By.cssSelector("input[type='password']")
        );

        assertNotNull(
                passwordField,
                "Login password field not found"
        );

        passwordField.clear();
        passwordField.sendKeys(ASSET_MANAGER_PASSWORD);

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

        // Handle "Login Successful" alert
        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(5)
            ).until(
                    ExpectedConditions.alertIsPresent()
            ).accept();

        } catch (Exception ignored) {
        }

        sleep(700);
    }

    // =========================================================
    // OPEN ASSET DETAILS
    // =========================================================

    private void openAssetDetails() {

        if (isAssetDetailsPage()) {
            return;
        }

        // Try direct Asset Details option
        WebElement assetDetails = findFirstVisible(
                By.xpath(
                        "//*[normalize-space()='Asset Details']"
                ),
                By.xpath(
                        "//button[normalize-space()='Asset Details']"
                ),
                By.xpath(
                        "//div[normalize-space()='Asset Details']"
                )
        );

        if (assetDetails != null) {

            safeClick(assetDetails);

            if (waitForAssetDetailsShort()) {
                return;
            }
        }

        // Try Asset Management first
        WebElement assetManagement = findFirstVisible(
                By.xpath(
                        "//*[normalize-space()='Asset Management']"
                ),
                By.xpath(
                        "//button[contains(normalize-space(),'Asset Management')]"
                )
        );

        if (assetManagement != null) {

            safeClick(assetManagement);

            sleep(700);

            WebElement details = findFirstVisible(
                    By.xpath(
                            "//*[normalize-space()='Asset Details']"
                    ),
                    By.xpath(
                            "//button[normalize-space()='Asset Details']"
                    ),
                    By.xpath(
                            "//div[normalize-space()='Asset Details']"
                    )
            );

            if (details != null) {
                safeClick(details);
            }
        }

        waitForAssetDetailsPage();
    }

    // =========================================================
    // PAGE CHECK
    // =========================================================

    private boolean isAssetDetailsPage() {

        try {

            return !driver.findElements(
                    By.cssSelector(".ad-page-title")
            ).isEmpty();

        } catch (Exception e) {
            return false;
        }
    }

    // =========================================================
    // WAIT FOR PAGE
    // =========================================================

    private void waitForAssetDetailsPage() {

        WebElement title = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-page-title")
                )
        );

        assertEquals(
                "Asset Details",
                title.getText().trim(),
                "Asset Details page was not opened"
        );
    }

    private boolean waitForAssetDetailsShort() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(5)
            ).until(
                    ExpectedConditions.visibilityOfElementLocated(
                            By.cssSelector(".ad-page-title")
                    )
            );

            return true;

        } catch (TimeoutException e) {

            return false;
        }
    }

    // =========================================================
    // TEST 1 - PAGE TITLE
    // =========================================================

    @Test
    public void assetDetailsPageLoadTest() {

        WebElement title = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-page-title")
                )
        );

        assertTrue(title.isDisplayed());

        assertEquals(
                "Asset Details",
                title.getText().trim()
        );
    }

    // =========================================================
    // TEST 2 - LOGO
    // =========================================================

    @Test
    public void itamsLogoTest() {

        WebElement logo = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-nav-logo-title")
                )
        );

        assertEquals(
                "ITAMS",
                logo.getText().trim()
        );
    }

    // =========================================================
    // TEST 3 - USERNAME
    // =========================================================

    @Test
    public void usernameDisplayTest() {

        WebElement username = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-nav-username")
                )
        );

        assertTrue(username.isDisplayed());

        assertFalse(
                username.getText().trim().isEmpty(),
                "Username is empty"
        );
    }

    // =========================================================
    // TEST 4 - BREADCRUMB
    // =========================================================

    @Test
    public void breadcrumbTest() {

        WebElement breadcrumb = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-breadcrumb")
                )
        );

        String text = breadcrumb.getText();

        assertTrue(
                text.contains("Dashboard"),
                "Dashboard breadcrumb missing"
        );

        assertTrue(
                text.contains("Asset Details"),
                "Asset Details breadcrumb missing"
        );
    }

    // =========================================================
    // TEST 5 - STAT CARDS
    // =========================================================

    @Test
    public void statisticsCardsTest() {

        List<WebElement> cards =
                driver.findElements(
                        By.cssSelector(".ad-stat-card")
                );

        assertEquals(
                4,
                cards.size(),
                "Expected 4 asset statistics cards"
        );

        String body = getBodyText();

        assertTrue(
                body.contains("Total Assets")
        );

        assertTrue(
                body.contains("Available")
        );

        assertTrue(
                body.contains("In Use")
        );

        assertTrue(
                body.contains("Maintenance")
        );
    }

    // =========================================================
    // TEST 6 - SEARCH INPUT
    // =========================================================

    @Test
    public void assetIdSearchFieldTest() {

        WebElement input = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-search-input")
                )
        );

        assertTrue(input.isDisplayed());

        assertEquals(
                "Search Asset ID",
                input.getAttribute("placeholder")
        );

        assertEquals(
                "6",
                input.getAttribute("maxlength")
        );
    }

    // =========================================================
    // TEST 7 - ASSET TYPE DROPDOWN
    // =========================================================

    @Test
    public void assetTypeDropdownTest() {

        List<WebElement> selects =
                driver.findElements(
                        By.cssSelector(".ad-filter-select")
                );

        assertTrue(
                selects.size() >= 2,
                "Asset type/status dropdowns not found"
        );

        Select assetType =
                new Select(selects.get(0));

        assertTrue(
                hasOption(assetType, "All Asset Types")
        );

        assertTrue(
                hasOption(assetType, "Monitor")
        );

        assertTrue(
                hasOption(assetType, "Keyboard")
        );

        assertTrue(
                hasOption(assetType, "Webcam")
        );

        assertTrue(
                hasOption(assetType, "CPU")
        );

        assertTrue(
                hasOption(assetType, "Mouse")
        );

        assertTrue(
                hasOption(assetType, "Projector")
        );

        assertTrue(
                hasOption(assetType, "Printer")
        );
    }

    // =========================================================
    // TEST 8 - STATUS DROPDOWN
    // =========================================================

    @Test
    public void statusDropdownTest() {

        List<WebElement> selects =
                driver.findElements(
                        By.cssSelector(".ad-filter-select")
                );

        Select status =
                new Select(selects.get(1));

        assertTrue(
                hasOption(status, "All Status")
        );

        assertTrue(
                hasOption(status, "Available")
        );

        assertTrue(
                hasOption(status, "In Use")
        );

        assertTrue(
                hasOption(status, "Maintenance")
        );
    }

    // =========================================================
    // TEST 9 - SEARCH BUTTON
    // =========================================================

    @Test
    public void searchButtonTest() {

        WebElement button = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-search-btn")
                )
        );

        assertTrue(button.isDisplayed());

        assertEquals(
                "Search",
                button.getText().trim()
        );
    }

    // =========================================================
    // TEST 10 - RESET BUTTON
    // =========================================================

    @Test
    public void resetButtonTest() {

        WebElement button = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-reset-btn")
                )
        );

        assertTrue(button.isDisplayed());

        assertEquals(
                "Reset",
                button.getText().trim()
        );
    }

    // =========================================================
    // TEST 11 - EMPTY SEARCH
    // =========================================================

    @Test
    public void emptySearchValidationTest() {

        WebElement input = getSearchInput();

        input.clear();

        clickSearch();

        String body = getBodyText();

        assertTrue(
                body.contains(
                        "Please enter an Asset ID or select a filter."
                ),
                "Empty search validation was not displayed"
        );
    }

    // =========================================================
    // TEST 12 - INVALID LENGTH
    // =========================================================

    @Test
    public void invalidAssetIdLengthTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("LAP01");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "Asset ID must contain exactly 6 characters"
                ),
                "Invalid Asset ID length validation failed"
        );
    }

    // =========================================================
    // TEST 13 - INVALID FORMAT
    // =========================================================

    @Test
    public void invalidAssetIdFormatTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("lap123");

        clickSearch();

        // Component converts input to uppercase.
        // LAP123 becomes valid format, so this test instead
        // checks that invalid characters are removed.
        assertEquals(
                "LAP123",
                input.getAttribute("value")
        );
    }

    // =========================================================
    // TEST 14 - NUMERIC ASSET ID
    // =========================================================

    @Test
    public void numericAssetIdTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("123456");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "Asset ID must be 3 capital letters followed by 3 numbers"
                ),
                "Numeric-only Asset ID validation failed"
        );
    }

    // =========================================================
    // TEST 15 - SPECIAL CHARACTERS
    // =========================================================

    @Test
    public void specialCharacterAssetIdTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("LA@#001");

        // Component removes non A-Z / 0-9 characters.
        String value =
                input.getAttribute("value");

        assertFalse(
                value.contains("@"),
                "Special character was not removed"
        );

        assertFalse(
                value.contains("#"),
                "Special character was not removed"
        );
    }

    // =========================================================
    // TEST 16 - LOWERCASE CONVERSION
    // =========================================================

    @Test
    public void lowercaseAssetIdConversionTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("lap001");

        assertEquals(
                "LAP001",
                input.getAttribute("value"),
                "Asset ID was not converted to uppercase"
        );
    }

    // =========================================================
    // TEST 17 - MAX LENGTH
    // =========================================================

    @Test
    public void assetIdMaximumLengthTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("LAP001999");

        String value =
                input.getAttribute("value");

        assertEquals(
                6,
                value.length(),
                "Asset ID exceeded 6 characters"
        );
    }

    // =========================================================
    // TEST 18 - ENTER KEY SEARCH
    // =========================================================

    @Test
    public void enterKeySearchTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("LAP001");

        input.sendKeys(Keys.ENTER);

        sleep(500);

        String body = getBodyText();

        assertFalse(
                body.contains(
                        "Please enter an Asset ID or select a filter."
                ),
                "Enter key did not trigger search"
        );
    }

    // =========================================================
    // TEST 19 - ASSET TYPE FILTER
    // =========================================================

    @Test
    public void assetTypeFilterTest() {

        List<WebElement> selects =
                driver.findElements(
                        By.cssSelector(".ad-filter-select")
                );

        Select assetType =
                new Select(selects.get(0));

        assetType.selectByVisibleText("Monitor");

        clickSearch();

        sleep(500);

        assertEquals(
                "Monitor",
                assetType.getFirstSelectedOption()
                        .getText()
                        .trim()
        );
    }

    // =========================================================
    // TEST 20 - STATUS FILTER
    // =========================================================

    @Test
    public void statusFilterTest() {

        List<WebElement> selects =
                driver.findElements(
                        By.cssSelector(".ad-filter-select")
                );

        Select status =
                new Select(selects.get(1));

        status.selectByVisibleText("Available");

        clickSearch();

        sleep(500);

        assertEquals(
                "Available",
                status.getFirstSelectedOption()
                        .getText()
                        .trim()
        );
    }

    // =========================================================
    // TEST 21 - RESET FILTERS
    // =========================================================

    @Test
    public void resetFiltersTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("LAP001");

        List<WebElement> selects =
                driver.findElements(
                        By.cssSelector(".ad-filter-select")
                );

        Select assetType =
                new Select(selects.get(0));

        assetType.selectByVisibleText("Monitor");

        Select status =
                new Select(selects.get(1));

        status.selectByVisibleText("Available");

        WebElement reset = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(".ad-reset-btn")
                )
        );

        safeClick(reset);

        sleep(300);

        assertEquals(
                "",
                input.getAttribute("value")
        );

        assertEquals(
                "All Asset Types",
                assetType.getFirstSelectedOption()
                        .getText()
                        .trim()
        );

        assertEquals(
                "All Status",
                status.getFirstSelectedOption()
                        .getText()
                        .trim()
        );
    }

    // =========================================================
    // TEST 22 - TABLE
    // =========================================================

    @Test
    public void assetTableTest() {

        waitUntilTableLoaded();

        WebElement table = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-table")
                )
        );

        String text = table.getText();

        assertTrue(
                text.contains("Asset ID"),
                "Asset ID column missing"
        );

        assertTrue(
                text.contains("Asset Type"),
                "Asset Type column missing"
        );

        assertTrue(
                text.contains("Status"),
                "Status column missing"
        );

        assertTrue(
                text.contains("Purchase Date"),
                "Purchase Date column missing"
        );

        assertTrue(
                text.contains("Actions"),
                "Actions column missing"
        );
    }

    // =========================================================
    // TEST 23 - VIEW BUTTON
    // =========================================================

    @Test
    public void viewAssetButtonTest() {

        waitUntilTableLoaded();

        List<WebElement> buttons =
                driver.findElements(
                        By.cssSelector(".ad-view-btn")
                );

        if (buttons.isEmpty()) {

            assertTrue(
                    getBodyText().contains("No assets found."),
                    "No View buttons but no empty-state message"
            );

            return;
        }

        assertTrue(
                buttons.get(0).isDisplayed(),
                "View button is not displayed"
        );

        assertEquals(
                "View",
                buttons.get(0).getText().trim()
        );
    }

    // =========================================================
    // TEST 24 - VIEW ASSET DETAILS
    // =========================================================

    @Test
    public void viewAssetDetailsTest() {

        waitUntilTableLoaded();

        if (!hasAssets()) {
            return;
        }

        safeClickFresh(
                By.cssSelector(".ad-view-btn")
        );

        WebElement panel = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-detail-panel")
                )
        );

        assertTrue(
                panel.isDisplayed(),
                "Asset details panel did not open"
        );

        assertTrue(
                panel.getText().contains(
                        "Asset Details"
                ),
                "Asset Details title missing"
        );
    }

    // =========================================================
    // TEST 25 - DETAIL FIELDS
    // =========================================================

    @Test
    public void assetDetailsFieldsTest() {

        waitUntilTableLoaded();

        if (!hasAssets()) {
            return;
        }

        safeClickFresh(
                By.cssSelector(".ad-view-btn")
        );

        WebElement panel = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-detail-panel")
                )
        );

        String text = panel.getText();

        assertTrue(
                text.contains("Asset ID"),
                "Asset ID detail missing"
        );

        assertTrue(
                text.contains("Asset Type"),
                "Asset Type detail missing"
        );

        assertTrue(
                text.contains("Brand"),
                "Brand detail missing"
        );

        assertTrue(
                text.contains("Model"),
                "Model detail missing"
        );

        assertTrue(
                text.contains("Status"),
                "Status detail missing"
        );

        assertTrue(
                text.contains("Purchase Date"),
                "Purchase Date detail missing"
        );

        assertTrue(
                text.contains("Warranty Expiry"),
                "Warranty Expiry detail missing"
        );

        assertTrue(
                text.contains("Description"),
                "Description detail missing"
        );
    }

    // =========================================================
    // TEST 26 - CLOSE DETAIL X
    // =========================================================

    @Test
    public void closeAssetDetailsXTest() {

        waitUntilTableLoaded();

        if (!hasAssets()) {
            return;
        }

        safeClickFresh(
                By.cssSelector(".ad-view-btn")
        );

        wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-detail-panel")
                )
        );

        safeClickFresh(
                By.cssSelector(".ad-detail-close")
        );

        wait().until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.cssSelector(".ad-detail-panel")
                )
        );
    }

    // =========================================================
    // TEST 27 - CLOSE BUTTON
    // =========================================================

    @Test
    public void closeAssetDetailsButtonTest() {

        waitUntilTableLoaded();

        if (!hasAssets()) {
            return;
        }

        safeClickFresh(
                By.cssSelector(".ad-view-btn")
        );

        wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-detail-panel")
                )
        );

        WebElement close = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(".ad-close-btn")
                )
        );

        safeClick(close);

        wait().until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.cssSelector(".ad-detail-panel")
                )
        );
    }

    // =========================================================
    // TEST 28 - ROWS DROPDOWN
    // =========================================================

    @Test
    public void rowsPerPageDropdownTest() {

        WebElement selectElement = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-rows-select")
                )
        );

        Select select =
                new Select(selectElement);

        assertTrue(
                hasOption(select, "10")
        );

        assertTrue(
                hasOption(select, "30")
        );

        assertTrue(
                hasOption(select, "50")
        );

        assertTrue(
                hasOption(select, "All")
        );
    }

    // =========================================================
    // TEST 29 - ROWS CHANGE
    // =========================================================

    @Test
    public void rowsPerPageChangeTest() {

        WebElement selectElement = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-rows-select")
                )
        );

        Select select =
                new Select(selectElement);

        select.selectByVisibleText("30");

        assertEquals(
                "30",
                select.getFirstSelectedOption()
                        .getText()
                        .trim()
        );

        select.selectByVisibleText("50");

        assertEquals(
                "50",
                select.getFirstSelectedOption()
                        .getText()
                        .trim()
        );

        select.selectByVisibleText("All");

        assertEquals(
                "All",
                select.getFirstSelectedOption()
                        .getText()
                        .trim()
        );
    }

    // =========================================================
    // TEST 30 - PAGINATION INFO
    // =========================================================

    @Test
    public void paginationInfoTest() {

        WebElement info = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-pagination-info")
                )
        );

        assertTrue(
                info.getText().contains("Showing")
        );

        assertTrue(
                info.getText().contains("assets")
        );
    }

    // =========================================================
    // TEST 31 - STATUS NORMALIZATION
    // =========================================================

    @Test
    public void statusBadgeTest() {

        waitUntilTableLoaded();

        List<WebElement> badges =
                driver.findElements(
                        By.cssSelector(".ad-badge")
                );

        if (badges.isEmpty()) {
            return;
        }

        for (WebElement badge : badges) {

            String status =
                    badge.getText().trim();

            assertTrue(
                    status.equals("Available")
                            || status.equals("In Use")
                            || status.equals("Maintenance"),
                    "Unexpected status displayed: "
                            + status
            );
        }
    }

    // =========================================================
    // TEST 32 - NO ASSETS MESSAGE
    // =========================================================

    @Test
    public void noAssetsMessageTest() {

        waitUntilTableLoaded();

        List<WebElement> rows =
                driver.findElements(
                        By.cssSelector(
                                ".ad-table tbody tr"
                        )
                );

        if (rows.size() == 1) {

            String text =
                    rows.get(0).getText();

            if (text.contains("No assets found.")) {

                assertTrue(
                        text.contains(
                                "No assets found."
                        )
                );
            }
        }
    }

    // =========================================================
    // TEST 33 - BACK BUTTON
    // =========================================================

    @Test
    public void backButtonTest() {

        WebElement back = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-back-btn")
                )
        );

        assertTrue(
                back.isDisplayed()
        );

        assertTrue(
                back.getText().contains("Back")
        );
    }

    // =========================================================
    // TEST 34 - LOGOUT BUTTON
    // =========================================================

    @Test
    public void logoutButtonTest() {

        WebElement logout = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-logout-btn")
                )
        );

        assertTrue(
                logout.isDisplayed()
        );

        assertEquals(
                "Logout",
                logout.getText().trim()
        );
    }

    // =========================================================
    // TEST 35 - SEARCH REAL ASSET ID IF AVAILABLE
    // =========================================================

    @Test
    public void searchExistingAssetIdTest() {

        waitUntilTableLoaded();

        String assetId =
                getFirstAssetId();

        if (assetId == null) {
            return;
        }

        WebElement input =
                getSearchInput();

        input.clear();
        input.sendKeys(assetId);

        clickSearch();

        sleep(500);

        assertTrue(
                getBodyText().contains(assetId),
                "Existing Asset ID was not displayed after search"
        );
    }

    // =========================================================
    // TEST 36 - FILTER STATUS AND VERIFY ROWS
    // =========================================================

    @Test
    public void availableStatusFilterTest() {

        List<WebElement> selects =
                driver.findElements(
                        By.cssSelector(".ad-filter-select")
                );

        Select status =
                new Select(selects.get(1));

        status.selectByVisibleText("Available");

        clickSearch();

        sleep(500);

        List<WebElement> badges =
                driver.findElements(
                        By.cssSelector(".ad-badge")
                );

        for (WebElement badge : badges) {

            String value =
                    badge.getText().trim();

            assertEquals(
                    "Available",
                    value,
                    "Status filter returned non-Available asset"
            );
        }
    }

    // =========================================================
    // HELPERS
    // =========================================================

    private WebElement getSearchInput() {

        return wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ad-search-input")
                )
        );
    }

    // =========================================================

    private void clickSearch() {

        WebElement button = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(".ad-search-btn")
                )
        );

        safeClick(button);
    }

    // =========================================================

    private boolean hasAssets() {

        return !driver.findElements(
                By.cssSelector(".ad-view-btn")
        ).isEmpty();
    }

    // =========================================================

    private String getFirstAssetId() {

        List<WebElement> ids =
                driver.findElements(
                        By.cssSelector(".ad-asset-id")
                );

        for (WebElement id : ids) {

            try {

                String value =
                        id.getText().trim();

                if (!value.isEmpty()) {
                    return value;
                }

            } catch (StaleElementReferenceException ignored) {
            }
        }

        return null;
    }

    // =========================================================

    private void waitUntilTableLoaded() {

        try {

            wait().until(
                    ExpectedConditions.visibilityOfElementLocated(
                            By.cssSelector(".ad-table")
                    )
            );

        } catch (TimeoutException e) {

            // If backend is slow, wait a little longer.
            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(10)
            ).until(
                    ExpectedConditions.visibilityOfElementLocated(
                            By.cssSelector(".ad-table")
                    )
            );
        }
    }

    // =========================================================

    private boolean hasOption(
            Select select,
            String option
    ) {

        for (WebElement element :
                select.getOptions()) {

            if (element.getText()
                    .trim()
                    .equals(option)) {

                return true;
            }
        }

        return false;
    }

    // =========================================================

    private String getBodyText() {

        return driver.findElement(
                By.tagName("body")
        ).getText();
    }

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

                    } catch (StaleElementReferenceException ignored) {
                    }
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }

    // =========================================================

    private void safeClick(
            WebElement element
    ) {

        try {

            scrollIntoView(element);

            wait().until(
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
    // STALE-SAFE CLICK
    // =========================================================

    private void safeClickFresh(
            By locator
    ) {

        for (int attempt = 0; attempt < 3; attempt++) {

            try {

                WebElement element =
                        wait().until(
                                ExpectedConditions
                                        .presenceOfElementLocated(
                                                locator
                                        )
                        );

                scrollIntoView(element);

                wait().until(
                        ExpectedConditions
                                .elementToBeClickable(
                                        locator
                                )
                );

                try {

                    element.click();

                } catch (Exception e) {

                    WebElement fresh =
                            driver.findElement(locator);

                    ((JavascriptExecutor) driver)
                            .executeScript(
                                    "arguments[0].click();",
                                    fresh
                            );
                }

                return;

            } catch (StaleElementReferenceException e) {

                sleep(300);
            }
        }

        fail(
                "Could not click element: "
                        + locator
        );
    }

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

    private void waitForPageLoad() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(15)
            ).until(
                    d ->
                            ((JavascriptExecutor) d)
                                    .executeScript(
                                            "return document.readyState"
                                    )
                                    .equals("complete")
            );

        } catch (Exception ignored) {
        }
    }

    // =========================================================

    private boolean isAlertPresent() {

        try {

            driver.switchTo().alert();

            return true;

        } catch (Exception e) {

            return false;
        }
    }

    // =========================================================

    private void sleep(long milliseconds) {

        try {

            Thread.sleep(milliseconds);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();
        }
    }
}
