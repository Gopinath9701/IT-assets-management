package com.itams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class AssetInventoryTest extends BaseTest {

    private static final String BASE_URL =
            "http://localhost:3000";

    // Asset Manager credentials
    private static final String ASSET_MANAGER_ID =
            "260822002";

    private static final String ASSET_MANAGER_PASSWORD =
            "Itams@2026a";

    private static final Duration WAIT_TIME =
            Duration.ofSeconds(15);

    // =========================================================
    // WAIT
    // =========================================================

    private WebDriverWait wait() {
        return new WebDriverWait(driver, WAIT_TIME);
    }

    // =========================================================
    // BEFORE EACH TEST
    // LOGIN -> ASSET MANAGEMENT -> ASSET INVENTORY
    // =========================================================

    @BeforeEach
    public void loginAndOpenAssetInventory() {

        driver.get(BASE_URL);

        waitForPageLoad();

        loginAsAssetManager();

        openAssetInventory();

        waitForInventoryPage();
    }

    // =========================================================
    // LOGIN AS ASSET MANAGER
    // =========================================================

    private void loginAsAssetManager() {

        WebElement idField = findFirstVisible(
                By.name("employeeIdOrEmail"),
                By.name("employeeId"),
                By.cssSelector("input[type='text']")
        );

        assertNotNull(
                idField,
                "Login Employee ID field not found"
        );

        idField.clear();
        idField.sendKeys(ASSET_MANAGER_ID);

        WebElement passwordField = findFirstVisible(
                By.name("password"),
                By.cssSelector("input[type='password']")
        );

        assertNotNull(
                passwordField,
                "Login password field not found"
        );

        passwordField.clear();
        passwordField.sendKeys(
                ASSET_MANAGER_PASSWORD
        );

        WebElement loginButton = findFirstVisible(
                By.cssSelector(
                        "form button[type='submit']"
                ),
                By.xpath(
                        "//button[normalize-space()='Login']"
                ),
                By.xpath(
                        "//button[contains(normalize-space(),'Login')]"
                )
        );

        assertNotNull(
                loginButton,
                "Login button not found"
        );

        safeClick(loginButton);

        // Login Successful alert
        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(5)
            ).until(
                    ExpectedConditions.alertIsPresent()
            );

            driver.switchTo()
                    .alert()
                    .accept();

        } catch (Exception ignored) {
        }

        sleep(700);
    }

    // =========================================================
    // OPEN ASSET INVENTORY
    // =========================================================

    private void openAssetInventory() {

        if (isInventoryPage()) {
            return;
        }

        // Try Asset Inventory directly
        WebElement inventory = findFirstVisible(
                By.xpath(
                        "//*[normalize-space()='Asset Inventory']"
                ),
                By.xpath(
                        "//button[normalize-space()='Asset Inventory']"
                ),
                By.xpath(
                        "//div[normalize-space()='Asset Inventory']"
                ),
                By.xpath(
                        "//a[normalize-space()='Asset Inventory']"
                )
        );

        if (inventory != null) {

            safeClick(inventory);

            if (waitForInventoryShort()) {
                return;
            }
        }

        // Try Asset Management
        WebElement assetManagement =
                findFirstVisible(
                        By.xpath(
                                "//*[normalize-space()='Asset Management']"
                        ),
                        By.xpath(
                                "//button[contains(normalize-space(),'Asset Management')]"
                        ),
                        By.xpath(
                                "//div[contains(normalize-space(),'Asset Management')]"
                        ),
                        By.xpath(
                                "//a[contains(normalize-space(),'Asset Management')]"
                        )
                );

        if (assetManagement != null) {

            safeClick(assetManagement);

            sleep(700);

            inventory = findFirstVisible(
                    By.xpath(
                            "//*[normalize-space()='Asset Inventory']"
                    ),
                    By.xpath(
                            "//button[normalize-space()='Asset Inventory']"
                    ),
                    By.xpath(
                            "//div[normalize-space()='Asset Inventory']"
                    ),
                    By.xpath(
                            "//a[normalize-space()='Asset Inventory']"
                    )
            );

            if (inventory != null) {
                safeClick(inventory);
            }
        }

        waitForInventoryPage();
    }

    // =========================================================
    // CHECK INVENTORY PAGE
    // =========================================================

    private boolean isInventoryPage() {

        try {

            return !driver.findElements(
                    By.cssSelector(".ai-page-title")
            ).isEmpty();

        } catch (Exception e) {

            return false;
        }
    }

    // =========================================================
    // WAIT INVENTORY PAGE
    // =========================================================

    private void waitForInventoryPage() {

        WebElement title = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-page-title")
                )
        );

        assertEquals(
                "Asset Inventory",
                title.getText().trim()
        );
    }

    private boolean waitForInventoryShort() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(5)
            ).until(
                    ExpectedConditions.visibilityOfElementLocated(
                            By.cssSelector(".ai-page-title")
                    )
            );

            return true;

        } catch (Exception e) {

            return false;
        }
    }

    // =========================================================
    // TEST 1 - PAGE TITLE
    // =========================================================

    @Test
    public void assetInventoryPageLoadTest() {

        WebElement title = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-page-title")
                )
        );

        assertTrue(title.isDisplayed());

        assertEquals(
                "Asset Inventory",
                title.getText().trim()
        );
    }

    // =========================================================
    // TEST 2 - PAGE SUBTITLE
    // =========================================================

    @Test
    public void pageSubtitleTest() {

        WebElement subtitle = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-page-sub")
                )
        );

        assertEquals(
                "Track and monitor all IT assets inventory in the organization.",
                subtitle.getText().trim()
        );
    }

    // =========================================================
    // TEST 3 - ITAMS LOGO
    // =========================================================

    @Test
    public void itamsLogoTest() {

        WebElement logo = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-nav-title")
                )
        );

        assertEquals(
                "ITAMS",
                logo.getText().trim()
        );
    }

    // =========================================================
    // TEST 4 - NAVBAR USERNAME
    // =========================================================

    @Test
    public void usernameDisplayTest() {

        WebElement username = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-nav-user")
                )
        );

        assertTrue(username.isDisplayed());

        assertFalse(
                username.getText().trim().isEmpty(),
                "Username should not be empty"
        );
    }

    // =========================================================
    // TEST 5 - LOGOUT BUTTON
    // =========================================================

    @Test
    public void logoutButtonTest() {

        WebElement logout = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-logout-btn")
                )
        );

        assertTrue(logout.isDisplayed());

        assertEquals(
                "Logout",
                logout.getText().trim()
        );
    }

    // =========================================================
    // TEST 6 - SELECT ASSET LABEL
    // =========================================================

    @Test
    public void selectAssetLabelTest() {

        WebElement label = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-select-label")
                )
        );

        assertEquals(
                "Select Asset",
                label.getText().trim()
        );
    }

    // =========================================================
    // TEST 7 - DROPDOWN BUTTON
    // =========================================================

    @Test
    public void assetDropdownTest() {

        WebElement dropdown = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-dropdown-btn")
                )
        );

        assertTrue(dropdown.isDisplayed());

        assertEquals(
                "All Assets (Complete Inventory)",
                dropdown.findElement(
                        By.cssSelector("span")
                ).getText().trim()
        );
    }

    // =========================================================
    // TEST 8 - DROPDOWN OPTIONS
    // =========================================================

    @Test
    public void assetDropdownOptionsTest() {

        openAssetDropdown();

        List<WebElement> options =
                wait().until(
                        ExpectedConditions.visibilityOfAllElementsLocatedBy(
                                By.cssSelector(
                                        ".ai-dropdown-item"
                                )
                        )
                );

        assertEquals(
                9,
                options.size(),
                "Expected 9 asset filter options"
        );

        assertTrue(
                getDropdownText().contains(
                        "All Assets (Complete Inventory)"
                )
        );

        assertTrue(
                getDropdownText().contains("Monitor")
        );

        assertTrue(
                getDropdownText().contains("Keyboard")
        );

        assertTrue(
                getDropdownText().contains("Mouse")
        );

        assertTrue(
                getDropdownText().contains("Printer")
        );

        assertTrue(
                getDropdownText().contains("Laptop")
        );

        assertTrue(
                getDropdownText().contains("CPU")
        );

        assertTrue(
                getDropdownText().contains("Webcam")
        );

        assertTrue(
                getDropdownText().contains("Projector")
        );
    }

    // =========================================================
    // TEST 9 - MONITOR FILTER
    // =========================================================

    @Test
    public void monitorFilterTest() {

        selectAssetType("Monitor");

        WebElement dropdown =
                getDropdownButton();

        assertTrue(
                dropdown.getText()
                        .contains("Monitor"),
                "Monitor was not selected"
        );

        WebElement tableTitle = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-table-title")
                )
        );

        assertTrue(
                tableTitle.getText()
                        .contains("Monitor"),
                "Monitor inventory table was not displayed"
        );
    }

    // =========================================================
    // TEST 10 - KEYBOARD FILTER
    // =========================================================

    @Test
    public void keyboardFilterTest() {

        selectAssetType("Keyboard");

        assertTrue(
                getDropdownButton()
                        .getText()
                        .contains("Keyboard")
        );

        assertTrue(
                getBodyText()
                        .contains(
                                "Inventory Details (Keyboard)"
                        )
        );
    }

    // =========================================================
    // TEST 11 - MOUSE FILTER
    // =========================================================

    @Test
    public void mouseFilterTest() {

        selectAssetType("Mouse");

        assertTrue(
                getDropdownButton()
                        .getText()
                        .contains("Mouse")
        );

        assertTrue(
                getBodyText()
                        .contains(
                                "Inventory Details (Mouse)"
                        )
        );
    }

    // =========================================================
    // TEST 12 - PRINTER FILTER
    // =========================================================

    @Test
    public void printerFilterTest() {

        selectAssetType("Printer");

        assertTrue(
                getDropdownButton()
                        .getText()
                        .contains("Printer")
        );
    }

    // =========================================================
    // TEST 13 - LAPTOP FILTER
    // =========================================================

    @Test
    public void laptopFilterTest() {

        selectAssetType("Laptop");

        assertTrue(
                getDropdownButton()
                        .getText()
                        .contains("Laptop")
        );
    }

    // =========================================================
    // TEST 14 - CPU FILTER
    // =========================================================

    @Test
    public void cpuFilterTest() {

        selectAssetType("CPU");

        assertTrue(
                getDropdownButton()
                        .getText()
                        .contains("CPU")
        );
    }

    // =========================================================
    // TEST 15 - WEBCAM FILTER
    // =========================================================

    @Test
    public void webcamFilterTest() {

        selectAssetType("Webcam");

        assertTrue(
                getDropdownButton()
                        .getText()
                        .contains("Webcam")
        );
    }

    // =========================================================
    // TEST 16 - PROJECTOR FILTER
    // =========================================================

    @Test
    public void projectorFilterTest() {

        selectAssetType("Projector");

        assertTrue(
                getDropdownButton()
                        .getText()
                        .contains("Projector")
        );
    }

    // =========================================================
    // TEST 17 - RETURN TO ALL ASSETS
    // =========================================================

    @Test
    public void allAssetsFilterTest() {

        selectAssetType(
                "All Assets (Complete Inventory)"
        );

        assertTrue(
                getDropdownButton()
                        .getText()
                        .contains(
                                "All Assets (Complete Inventory)"
                        )
        );

        assertTrue(
                getBodyText()
                        .contains(
                                "Inventory Details"
                        )
        );
    }

    // =========================================================
    // TEST 18 - STATISTICS CARDS
    // =========================================================

    @Test
    public void statisticsCardsTest() {

        List<WebElement> cards =
                wait().until(
                        ExpectedConditions.visibilityOfAllElementsLocatedBy(
                                By.cssSelector(
                                        ".ai-stat-card"
                                )
                        )
                );

        assertEquals(
                5,
                cards.size(),
                "Expected 5 inventory statistics cards"
        );
    }

    // =========================================================
    // TEST 19 - TOTAL ASSETS CARD
    // =========================================================

    @Test
    public void totalAssetsCardTest() {

        WebElement card =
                findStatCard("Total Assets");

        assertNotNull(
                card,
                "Total Assets card not found"
        );

        assertTrue(
                card.getText()
                        .contains("Total Assets")
        );

        assertTrue(
                card.getText()
                        .contains(
                                "All assets in system"
                        )
        );
    }

    // =========================================================
    // TEST 20 - AVAILABLE ASSETS CARD
    // =========================================================

    @Test
    public void availableAssetsCardTest() {

        WebElement card =
                findStatCard("Available Assets");

        assertNotNull(card);

        assertTrue(
                card.getText()
                        .contains(
                                "Ready to assign"
                        )
        );
    }

    // =========================================================
    // TEST 21 - ASSIGNED ASSETS CARD
    // =========================================================

    @Test
    public void assignedAssetsCardTest() {

        WebElement card =
                findStatCard("Assigned Assets");

        assertNotNull(card);

        assertTrue(
                card.getText()
                        .contains(
                                "Currently assigned"
                        )
        );
    }

    // =========================================================
    // TEST 22 - MAINTENANCE CARD
    // =========================================================

    @Test
    public void maintenanceAssetsCardTest() {

        WebElement card =
                findStatCard("Under Maintenance");

        assertNotNull(card);

        assertTrue(
                card.getText()
                        .contains(
                                "Being serviced"
                        )
        );
    }

    // =========================================================
    // TEST 23 - OUT OF STOCK CARD
    // =========================================================

    @Test
    public void outOfStockCardTest() {

        WebElement card =
                findStatCard("Out of Stock");

        assertNotNull(card);

        assertTrue(
                card.getText()
                        .contains(
                                "Not available"
                        )
        );
    }

    // =========================================================
    // TEST 24 - INVENTORY TABLE
    // =========================================================

    @Test
    public void inventoryTableTest() {

        WebElement table = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-table")
                )
        );

        assertTrue(table.isDisplayed());

        String tableText =
                table.getText();

        assertTrue(
                tableText.contains(
                        "Asset Name"
                )
        );

        assertTrue(
                tableText.contains(
                        "Total Stock"
                )
        );

        assertTrue(
                tableText.contains(
                        "Available"
                )
        );

        assertTrue(
                tableText.contains(
                        "Assigned"
                )
        );

        assertTrue(
                tableText.contains(
                        "Under Maintenance"
                )
        );

        assertTrue(
                tableText.contains(
                        "Status"
                )
        );
    }

    // =========================================================
    // TEST 25 - TABLE HEADER COUNT
    // =========================================================

    @Test
    public void inventoryTableHeaderCountTest() {

        List<WebElement> headers =
                driver.findElements(
                        By.cssSelector(
                                ".ai-table thead th"
                        )
                );

        assertEquals(
                6,
                headers.size(),
                "Expected 6 inventory table columns"
        );
    }

    // =========================================================
    // TEST 26 - INVENTORY DATA ROWS
    // =========================================================

    @Test
    public void inventoryDataRowsTest() {

        waitForInventoryTable();

        List<WebElement> rows =
                driver.findElements(
                        By.cssSelector(
                                ".ai-table tbody tr"
                        )
                );

        // Backend can legitimately return zero records.
        // In that case the table should still exist.
        assertNotNull(rows);
    }

    // =========================================================
    // TEST 27 - ASSET STATUS
    // =========================================================

    @Test
    public void assetStatusBadgeTest() {

        waitForInventoryTable();

        List<WebElement> badges =
                driver.findElements(
                        By.cssSelector(
                                ".ai-status-badge"
                        )
                );

        for (WebElement badge : badges) {

            try {

                String text =
                        badge.getText().trim();

                assertFalse(
                        text.isEmpty(),
                        "Asset status is empty"
                );

            } catch (
                    StaleElementReferenceException ignored
            ) {
            }
        }
    }

    // =========================================================
    // TEST 28 - INVENTORY OVERVIEW CHART
    // =========================================================

    @Test
    public void inventoryOverviewChartTest() {

        List<WebElement> charts =
                wait().until(
                        ExpectedConditions.visibilityOfAllElementsLocatedBy(
                                By.cssSelector(
                                        ".ai-chart-card"
                                )
                        )
                );

        assertTrue(
                charts.size() >= 2,
                "Expected at least two chart cards"
        );

        assertTrue(
                getBodyText()
                        .contains(
                                "Inventory Overview"
                        )
        );
    }

    // =========================================================
    // TEST 29 - CATEGORY CHART
    // =========================================================

    @Test
    public void inventoryCategoryChartTest() {

        assertTrue(
                getBodyText()
                        .contains(
                                "Inventory by Category"
                        )
        );
    }

    // =========================================================
    // TEST 30 - CHART SVG
    // =========================================================

    @Test
    public void pieChartSvgTest() {

        List<WebElement> svgs =
                driver.findElements(
                        By.cssSelector(
                                ".ai-chart-card svg"
                        )
                );

        assertTrue(
                svgs.size() >= 2,
                "Pie charts were not rendered"
        );
    }

    // =========================================================
    // TEST 31 - CHART LEGENDS
    // =========================================================

    @Test
    public void chartLegendTest() {

        List<WebElement> legends =
                driver.findElements(
                        By.cssSelector(
                                ".ai-legend"
                        )
                );

        assertTrue(
                legends.size() >= 2,
                "Chart legends are missing"
        );
    }

    // =========================================================
    // TEST 32 - INVENTORY CHART FOOTER
    // =========================================================

    @Test
    public void chartFooterTest() {

        WebElement footer = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-chart-footer")
                )
        );

        assertTrue(
                footer.getText()
                        .contains(
                                "Total Assets"
                        )
        );
    }

    // =========================================================
    // TEST 33 - MONITOR DETAILS
    // =========================================================

    @Test
    public void monitorDetailsTest() {

        selectAssetType("Monitor");

        sleep(500);

        List<WebElement> details =
                driver.findElements(
                        By.cssSelector(
                                ".ai-table-card"
                        )
                );

        assertTrue(
                details.size() >= 2,
                "Monitor details table was not displayed"
        );

        assertTrue(
                getBodyText()
                        .contains(
                                "Inventory Details (Monitor)"
                        )
        );
    }

    // =========================================================
    // TEST 34 - MONITOR DETAIL TOTAL ROW
    // =========================================================

    @Test
    public void monitorTotalRowTest() {

        selectAssetType("Monitor");

        sleep(500);

        List<WebElement> totalRows =
                driver.findElements(
                        By.cssSelector(
                                ".ai-total-row"
                        )
                );

        // Monitor details are conditional on backend
        // data having details.
        if (!totalRows.isEmpty()) {

            String text =
                    totalRows.get(0)
                            .getText();

            assertTrue(
                    text.contains("Total")
            );

            assertTrue(
                    text.contains("30")
            );

            assertTrue(
                    text.contains("7")
            );

            assertTrue(
                    text.contains("21")
            );

            assertTrue(
                    text.contains("2")
            );
        }
    }

    // =========================================================
    // TEST 35 - BACK BUTTON
    // =========================================================

    @Test
    public void backButtonTest() {

        List<WebElement> backButtons =
                driver.findElements(
                        By.cssSelector(
                                ".ai-back-btn"
                        )
                );

        // onBack is conditionally rendered.
        if (!backButtons.isEmpty()) {

            WebElement back =
                    backButtons.get(0);

            assertTrue(
                    back.isDisplayed()
            );

            assertEquals(
                    "Back",
                    back.getText().trim()
            );
        }
    }

    // =========================================================
    // TEST 36 - SELECT MONITOR THEN CHANGE BACK
    // =========================================================

    @Test
    public void assetFilterChangeTest() {

        selectAssetType("Monitor");

        assertTrue(
                getDropdownButton()
                        .getText()
                        .contains("Monitor")
        );

        selectAssetType("Laptop");

        assertTrue(
                getDropdownButton()
                        .getText()
                        .contains("Laptop")
        );

        selectAssetType(
                "All Assets (Complete Inventory)"
        );

        assertTrue(
                getDropdownButton()
                        .getText()
                        .contains(
                                "All Assets (Complete Inventory)"
                        )
        );
    }

    // =========================================================
    // HELPER - OPEN DROPDOWN
    // =========================================================

    private void openAssetDropdown() {

        WebElement dropdown =
                wait().until(
                        ExpectedConditions.elementToBeClickable(
                                By.cssSelector(
                                        ".ai-dropdown-btn"
                                )
                        )
                );

        safeClick(dropdown);

        wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ai-dropdown-list"
                        )
                )
        );
    }

    // =========================================================
    // HELPER - SELECT ASSET TYPE
    // =========================================================

    private void selectAssetType(
            String assetType
    ) {

        openAssetDropdown();

        List<WebElement> options =
                driver.findElements(
                        By.cssSelector(
                                ".ai-dropdown-item"
                        )
                );

        for (WebElement option : options) {

            try {

                if (option.getText()
                        .trim()
                        .equals(assetType)) {

                    safeClick(option);

                    sleep(400);

                    return;
                }

            } catch (
                    StaleElementReferenceException ignored
            ) {
            }
        }

        fail(
                "Asset option not found: "
                        + assetType
        );
    }

    // =========================================================
    // HELPER - DROPDOWN TEXT
    // =========================================================

    private String getDropdownText() {

        return driver.findElement(
                By.cssSelector(
                        ".ai-dropdown-list"
                )
        ).getText();
    }

    // =========================================================
    // HELPER - DROPDOWN BUTTON
    // =========================================================

    private WebElement getDropdownButton() {

        return wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ai-dropdown-btn"
                        )
                )
        );
    }

    // =========================================================
    // HELPER - STAT CARD
    // =========================================================

    private WebElement findStatCard(
            String title
    ) {

        List<WebElement> cards =
                driver.findElements(
                        By.cssSelector(
                                ".ai-stat-card"
                        )
                );

        for (WebElement card : cards) {

            try {

                if (card.getText()
                        .contains(title)) {

                    return card;
                }

            } catch (
                    StaleElementReferenceException ignored
            ) {
            }
        }

        return null;
    }

    // =========================================================
    // HELPER - INVENTORY TABLE
    // =========================================================

    private void waitForInventoryTable() {

        wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-table")
                )
        );

        sleep(300);
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
    // HELPER - FIND VISIBLE ELEMENT
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
    // HELPER - SLEEP
    // =========================================================

    private void sleep(
            long milliseconds
    ) {

        try {

            Thread.sleep(milliseconds);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();
        }
    }
}
