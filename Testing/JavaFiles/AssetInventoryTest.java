package com.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.time.Duration;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AssetInventoryTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private final String BASE_URL = "http://localhost:3000";

    // =========================================================
    // SETUP
    // =========================================================

    @Before
    public void setUp() {

        driver = new ChromeDriver();

        driver.manage().window().maximize();

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(10)
        );

        driver.get(BASE_URL);

        openInventoryPage();
    }

    // =========================================================
    // OPEN INVENTORY PAGE
    // =========================================================

    private void openInventoryPage() {

        try {

            WebElement inventoryButton = wait.until(
                    ExpectedConditions.elementToBeClickable(
                            By.xpath(
                                    "//button[contains(normalize-space(),'Invtry')]"
                            )
                    )
            );

            inventoryButton.click();

        } catch (Exception firstAttempt) {

            try {

                WebElement loginButton = wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//button[normalize-space()='Login']"
                                )
                        )
                );

                loginButton.click();

            } catch (Exception ignored) {
                // Login may already be completed
            }

            WebElement inventoryButton = wait.until(
                    ExpectedConditions.elementToBeClickable(
                            By.xpath(
                                    "//button[contains(normalize-space(),'Invtry')]"
                            )
                    )
            );

            inventoryButton.click();
        }

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='Asset Inventory']"
                        )
                )
        );
    }

    // =========================================================
    // TEST 1 - PAGE TITLE
    // =========================================================

    @Test
    public void testInventoryPageTitle() {

        WebElement title = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='Asset Inventory']"
                        )
                )
        );

        assertEquals(
                "Asset Inventory",
                title.getText().trim()
        );
    }

    // =========================================================
    // TEST 2 - PAGE DESCRIPTION
    // =========================================================

    @Test
    public void testInventoryPageDescription() {

        WebElement description = driver.findElement(
                By.xpath(
                        "//*[contains(text(),'Track and monitor all IT assets inventory')]"
                )
        );

        assertTrue(
                description.getText().contains(
                        "Track and monitor all IT assets inventory"
                )
        );
    }

    // =========================================================
    // TEST 3 - SELECT ASSET LABEL
    // =========================================================

    @Test
    public void testSelectAssetLabel() {

        WebElement label = driver.findElement(
                By.xpath(
                        "//*[normalize-space()='Select Asset']"
                )
        );

        assertEquals(
                "Select Asset",
                label.getText().trim()
        );
    }

    // =========================================================
    // TEST 4 - DEFAULT DROPDOWN
    // =========================================================

    @Test
    public void testDefaultAssetSelection() {

        WebElement dropdown = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-dropdown-btn")
                )
        );

        assertTrue(
                dropdown.getText().trim().contains(
                        "All Assets (Complete Inventory)"
                )
        );
    }

    // =========================================================
    // TEST 5 - TOTAL ASSETS
    // =========================================================

    @Test
    public void testDefaultTotalAssets() {

        WebElement value = driver.findElement(
                By.xpath(
                        "//span[contains(@class,'ai-stat-label') " +
                        "and normalize-space()='Total Assets']" +
                        "/following-sibling::span[contains(@class,'ai-stat-value')]"
                )
        );

        assertEquals(
                "130",
                value.getText().trim()
        );
    }

    // =========================================================
    // TEST 6 - AVAILABLE ASSETS
    // =========================================================

    @Test
    public void testDefaultAvailableAssets() {

        WebElement value = driver.findElement(
                By.xpath(
                        "//span[contains(@class,'ai-stat-label') " +
                        "and normalize-space()='Available Assets']" +
                        "/following-sibling::span[contains(@class,'ai-stat-value')]"
                )
        );

        assertEquals(
                "38",
                value.getText().trim()
        );
    }

    // =========================================================
    // TEST 7 - ASSIGNED ASSETS
    // =========================================================

    @Test
    public void testDefaultAssignedAssets() {

        WebElement value = driver.findElement(
                By.xpath(
                        "//span[contains(@class,'ai-stat-label') " +
                        "and normalize-space()='Assigned Assets']" +
                        "/following-sibling::span[contains(@class,'ai-stat-value')]"
                )
        );

        assertEquals(
                "81",
                value.getText().trim()
        );
    }

    // =========================================================
    // TEST 8 - MAINTENANCE ASSETS
    // =========================================================

    @Test
    public void testDefaultMaintenanceAssets() {

        WebElement value = driver.findElement(
                By.xpath(
                        "//span[contains(@class,'ai-stat-label') " +
                        "and normalize-space()='Under Maintenance']" +
                        "/following-sibling::span[contains(@class,'ai-stat-value')]"
                )
        );

        assertEquals(
                "11",
                value.getText().trim()
        );
    }

    // =========================================================
    // TEST 9 - OUT OF STOCK
    // =========================================================

    @Test
    public void testDefaultOutOfStock() {

        WebElement value = driver.findElement(
                By.xpath(
                        "//span[contains(@class,'ai-stat-label') " +
                        "and normalize-space()='Out of Stock']" +
                        "/following-sibling::span[contains(@class,'ai-stat-value')]"
                )
        );

        assertEquals(
                "2",
                value.getText().trim()
        );
    }

    // =========================================================
    // TEST 10 - INVENTORY TABLE
    // =========================================================

    @Test
    public void testInventoryTableDisplayed() {

        WebElement table = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-table")
                )
        );

        assertTrue(
                table.isDisplayed()
        );
    }

    // =========================================================
    // TEST 11 - LAPTOP ROW
    // =========================================================

    @Test
    public void testLaptopRow() {

        WebElement row = driver.findElement(
                By.xpath(
                        "//table[contains(@class,'ai-table')]//tr[" +
                        "td[normalize-space()='Laptop']" +
                        "]"
                )
        );

        String rowText = row.getText();

        assertTrue(rowText.contains("Laptop"));
        assertTrue(rowText.contains("50"));
        assertTrue(rowText.contains("18"));
        assertTrue(rowText.contains("30"));
        assertTrue(rowText.contains("2"));
        assertTrue(rowText.contains("Available"));
    }

    // =========================================================
    // TEST 12 - MONITOR ROW
    // =========================================================

    @Test
    public void testMonitorRow() {

        WebElement row = driver.findElement(
                By.xpath(
                        "//table[contains(@class,'ai-table')]//tr[" +
                        "td[normalize-space()='Monitor']" +
                        "]"
                )
        );

        String rowText = row.getText();

        assertTrue(rowText.contains("Monitor"));
        assertTrue(rowText.contains("30"));
        assertTrue(rowText.contains("7"));
        assertTrue(rowText.contains("21"));
        assertTrue(rowText.contains("2"));
        assertTrue(rowText.contains("Available"));
    }

    // =========================================================
    // TEST 13 - OPEN DROPDOWN
    // =========================================================

    @Test
    public void testAssetDropdownOpens() {

        WebElement dropdown = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(".ai-dropdown-btn")
                )
        );

        dropdown.click();

        WebElement dropdownList = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-dropdown-list")
                )
        );

        assertTrue(
                dropdownList.isDisplayed()
        );
    }

    // =========================================================
    // TEST 14 - SELECT MONITOR
    // =========================================================

    @Test
    public void testSelectMonitor() {

        WebElement dropdown = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(".ai-dropdown-btn")
                )
        );

        dropdown.click();

        WebElement monitorOption = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//li[contains(@class,'ai-dropdown-item')" +
                                " and normalize-space()='Monitor']"
                        )
                )
        );

        monitorOption.click();

        wait.until(
                ExpectedConditions.textToBePresentInElement(
                        dropdown,
                        "Monitor"
                )
        );

        /*
         * Selenium may read an invisible/newline character
         * from the dropdown button.
         *
         * So normalize the text before checking it.
         */

        String selectedText = dropdown
                .getText()
                .replaceAll("[^A-Za-z]", "")
                .trim();

        assertEquals(
                "Monitor",
                selectedText
        );
    }

    // =========================================================
    // TEST 15 - MONITOR FILTER VALUES
    // =========================================================

    @Test
    public void testMonitorFilterValues() {

        WebElement dropdown = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(".ai-dropdown-btn")
                )
        );

        dropdown.click();

        WebElement monitorOption = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//li[contains(@class,'ai-dropdown-item')" +
                                " and normalize-space()='Monitor']"
                        )
                )
        );

        monitorOption.click();

        wait.until(
                ExpectedConditions.textToBePresentInElement(
                        dropdown,
                        "Monitor"
                )
        );

        // Total Assets = 30

        WebElement total = driver.findElement(
                By.xpath(
                        "//span[contains(@class,'ai-stat-label') " +
                        "and normalize-space()='Total Assets']" +
                        "/following-sibling::span[contains(@class,'ai-stat-value')]"
                )
        );

        assertEquals(
                "30",
                total.getText().trim()
        );

        // Available = 7

        WebElement available = driver.findElement(
                By.xpath(
                        "//span[contains(@class,'ai-stat-label') " +
                        "and normalize-space()='Available Assets']" +
                        "/following-sibling::span[contains(@class,'ai-stat-value')]"
                )
        );

        assertEquals(
                "7",
                available.getText().trim()
        );

        // Assigned = 21

        WebElement assigned = driver.findElement(
                By.xpath(
                        "//span[contains(@class,'ai-stat-label') " +
                        "and normalize-space()='Assigned Assets']" +
                        "/following-sibling::span[contains(@class,'ai-stat-value')]"
                )
        );

        assertEquals(
                "21",
                assigned.getText().trim()
        );

        // Maintenance = 2

        WebElement maintenance = driver.findElement(
                By.xpath(
                        "//span[contains(@class,'ai-stat-label') " +
                        "and normalize-space()='Under Maintenance']" +
                        "/following-sibling::span[contains(@class,'ai-stat-value')]"
                )
        );

        assertEquals(
                "2",
                maintenance.getText().trim()
        );
    }

    // =========================================================
    // TEST 16 - MONITOR TABLE AFTER FILTER
    // =========================================================

    @Test
    public void testMonitorTableAfterFilter() {

        WebElement dropdown = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(".ai-dropdown-btn")
                )
        );

        dropdown.click();

        WebElement monitorOption = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//li[contains(@class,'ai-dropdown-item')" +
                                " and normalize-space()='Monitor']"
                        )
                )
        );

        monitorOption.click();

        wait.until(
                ExpectedConditions.textToBePresentInElement(
                        dropdown,
                        "Monitor"
                )
        );

        WebElement table = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-table")
                )
        );

        String tableText =
                table.getText()
                        .replaceAll("\\s+", " ")
                        .trim();

        assertTrue(tableText.contains("Monitor"));
        assertTrue(tableText.contains("30"));
        assertTrue(tableText.contains("7"));
        assertTrue(tableText.contains("21"));
        assertTrue(tableText.contains("2"));
        assertTrue(tableText.contains("Available"));
    }

    // =========================================================
    // TEST 17 - BACK BUTTON
    // =========================================================

    @Test
    public void testBackButtonDisplayed() {

        WebElement backButton = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ai-back-btn")
                )
        );

        assertTrue(
                backButton.isDisplayed()
        );

        assertEquals(
                "Back",
                backButton.getText().trim()
        );
    }

    // =========================================================
    // TEST 18 - TABLE HEADERS
    // =========================================================

    @Test
    public void testInventoryTableHeaders() {

        WebElement table = driver.findElement(
                By.cssSelector(".ai-table")
        );

        String tableText =
                table.getText()
                        .replaceAll("\\s+", " ")
                        .trim();

        assertTrue(tableText.contains("Asset Name"));
        assertTrue(tableText.contains("Total Stock"));
        assertTrue(tableText.contains("Available"));
        assertTrue(tableText.contains("Assigned"));
        assertTrue(tableText.contains("Under Maintenance"));
        assertTrue(tableText.contains("Status"));
    }

    // =========================================================
    // CLEANUP
    // =========================================================

    @After
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
