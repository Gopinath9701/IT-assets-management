package com.test;

import java.time.Duration;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;


public class AssetDetailsTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private final String URL = "http://localhost:3000";


    // =========================================================
    // SETUP
    // =========================================================

    @Before
    public void setUp() {

        driver = new ChromeDriver();

        driver.manage().window().maximize();

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(15)
        );

        driver.get(URL);

        System.out.println();
        System.out.println("==========================================");
        System.out.println("APPLICATION STARTED");
        System.out.println("==========================================");
    }


    // =========================================================
    // SCROLL TO ELEMENT
    // =========================================================

    private void scrollToElement(WebElement element) {

        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].scrollIntoView({block:'center', inline:'center'});",
                element
        );

        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }


    // =========================================================
    // JAVASCRIPT CLICK
    // =========================================================

    private void javascriptClick(WebElement element) {

        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].click();",
                element
        );
    }


    // =========================================================
    // NAVIGATE TO ASSET DETAILS
    // =========================================================

    private void navigateToAssetDetails() {

        System.out.println("Starting navigation...");


        // -----------------------------------------------------
        // LOGIN
        // -----------------------------------------------------

        WebElement loginButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='Login']"
                        )
                )
        );

        scrollToElement(loginButton);

        javascriptClick(loginButton);

        System.out.println(
                "PASS: Login button clicked"
        );


        // -----------------------------------------------------
        // ASSET MANAGEMENT
        // -----------------------------------------------------

        WebElement assetMgmtButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='Asset Mgmt']"
                        )
                )
        );

        scrollToElement(assetMgmtButton);

        javascriptClick(assetMgmtButton);

        System.out.println(
                "PASS: Asset Mgmt button clicked"
        );


        // -----------------------------------------------------
        // VERIFY ASSET MANAGEMENT
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='Asset Management']"
                        )
                )
        );

        System.out.println(
                "PASS: Asset Management page opened"
        );


        // -----------------------------------------------------
        // ASSET DETAILS
        // -----------------------------------------------------

        WebElement assetDetailsButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='Asset Details']"
                        )
                )
        );

        scrollToElement(assetDetailsButton);

        javascriptClick(assetDetailsButton);

        System.out.println(
                "PASS: Asset Details button clicked"
        );


        // -----------------------------------------------------
        // VERIFY ASSET DETAILS PAGE
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//h1[normalize-space()='Asset Details']"
                        )
                )
        );

        System.out.println(
                "PASS: Asset Details page opened"
        );


        // -----------------------------------------------------
        // SEARCH INPUT
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.cssSelector(
                                ".ad-search-input"
                        )
                )
        );
    }


    // =========================================================
    // CHECK WHETHER ASSET ROWS EXIST
    // =========================================================

    private boolean hasAssets() {

        List<WebElement> assetRows = driver.findElements(
                By.xpath(
                        "//tbody//tr[.//button[normalize-space()='View']]"
                )
        );

        return !assetRows.isEmpty();
    }


    // =========================================================
    // CHECK NO ASSETS MESSAGE
    // =========================================================

    private boolean hasNoAssetsMessage() {

        List<WebElement> messages = driver.findElements(
                By.xpath(
                        "//*[normalize-space()='No assets found.']"
                )
        );

        return !messages.isEmpty();
    }


    // =========================================================
    // WAIT FOR TABLE DATA
    // =========================================================

    private void waitForAssetTable() {

        wait.until(driver -> {

            boolean assetsExist = hasAssets();

            boolean noAssets = hasNoAssetsMessage();

            return assetsExist || noAssets;
        });
    }


    // =========================================================
    // TEST 1
    // ASSET DETAILS PAGE
    // =========================================================

    @Test
    public void testAssetDetailsPage() {

        System.out.println(
                "========== TEST 1: ASSET DETAILS PAGE =========="
        );

        navigateToAssetDetails();


        WebElement heading = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//h1[normalize-space()='Asset Details']"
                        )
                )
        );


        assertTrue(
                "Asset Details heading should be displayed",
                heading.isDisplayed()
        );


        WebElement breadcrumb = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//span[normalize-space()='Asset Details']"
                        )
                )
        );


        assertTrue(
                "Asset Details breadcrumb should be displayed",
                breadcrumb.isDisplayed()
        );


        WebElement searchInput = driver.findElement(
                By.cssSelector(
                        ".ad-search-input"
                )
        );


        assertTrue(
                "Search input should be displayed",
                searchInput.isDisplayed()
        );


        System.out.println(
                "TEST 1 PASSED"
        );
    }


    // =========================================================
    // TEST 2
    // STATISTICS
    // =========================================================

    @Test
    public void testAssetStatistics() {

        System.out.println(
                "========== TEST 2: ASSET STATISTICS =========="
        );

        navigateToAssetDetails();


        WebElement totalLabel = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//span[normalize-space()='Total Assets']"
                        )
                )
        );


        WebElement inUseLabel = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='In Use']"
                )
        );


        WebElement maintenanceLabel = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Under Maintenance']"
                )
        );


        WebElement notInUseLabel = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Not In Use']"
                )
        );


        assertTrue(totalLabel.isDisplayed());
        assertTrue(inUseLabel.isDisplayed());
        assertTrue(maintenanceLabel.isDisplayed());
        assertTrue(notInUseLabel.isDisplayed());


        String totalValue = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Total Assets']/following-sibling::span"
                )
        ).getText();


        String inUseValue = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='In Use']/following-sibling::span"
                )
        ).getText();


        String maintenanceValue = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Under Maintenance']/following-sibling::span"
                )
        ).getText();


        String notInUseValue = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Not In Use']/following-sibling::span"
                )
        ).getText();


        assertTrue(
                "Total Assets should be numeric",
                totalValue.matches("\\d+")
        );


        assertTrue(
                "In Use should be numeric",
                inUseValue.matches("\\d+")
        );


        assertTrue(
                "Under Maintenance should be numeric",
                maintenanceValue.matches("\\d+")
        );


        assertTrue(
                "Not In Use should be numeric",
                notInUseValue.matches("\\d+")
        );


        System.out.println(
                "Total Assets = " + totalValue
        );

        System.out.println(
                "In Use = " + inUseValue
        );

        System.out.println(
                "Under Maintenance = " + maintenanceValue
        );

        System.out.println(
                "Not In Use = " + notInUseValue
        );


        System.out.println(
                "TEST 2 PASSED"
        );
    }


    // =========================================================
    // TEST 3
    // EMPTY SEARCH VALIDATION
    // =========================================================

    @Test
    public void testEmptySearchValidation() {

        System.out.println(
                "========== TEST 3: EMPTY SEARCH VALIDATION =========="
        );

        navigateToAssetDetails();


        WebElement searchButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='Search']"
                        )
                )
        );


        scrollToElement(searchButton);

        javascriptClick(searchButton);


        WebElement errorMessage = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[contains(normalize-space(),'Please enter a search term or select at least one filter.')]"
                        )
                )
        );


        assertTrue(
                errorMessage.isDisplayed()
        );


        System.out.println(
                "TEST 3 PASSED"
        );
    }


    // =========================================================
    // TEST 4
    // ASSET TYPE DROPDOWN
    // =========================================================

    @Test
    public void testAssetTypeDropdown() {

        System.out.println(
                "========== TEST 4: ASSET TYPE DROPDOWN =========="
        );

        navigateToAssetDetails();


        WebElement categoryDropdown = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ad-filter-select"
                        )
                )
        );


        Select categorySelect =
                new Select(categoryDropdown);


        List<WebElement> options =
                categorySelect.getOptions();


        assertEquals(
                8,
                options.size()
        );


        assertEquals(
                "All Asset Types",
                options.get(0).getText()
        );


        assertEquals(
                "Monitor",
                options.get(1).getText()
        );


        assertEquals(
                "Keyboard",
                options.get(2).getText()
        );


        assertEquals(
                "Webcam",
                options.get(3).getText()
        );


        assertEquals(
                "CPU",
                options.get(4).getText()
        );


        assertEquals(
                "Mouse",
                options.get(5).getText()
        );


        assertEquals(
                "Projector",
                options.get(6).getText()
        );


        assertEquals(
                "Printer",
                options.get(7).getText()
        );


        System.out.println(
                "TEST 4 PASSED"
        );
    }


    // =========================================================
    // TEST 5
    // STATUS DROPDOWN
    // =========================================================

    @Test
    public void testStatusDropdown() {

        System.out.println(
                "========== TEST 5: STATUS DROPDOWN =========="
        );

        navigateToAssetDetails();


        List<WebElement> dropdowns = driver.findElements(
                By.cssSelector(
                        ".ad-filter-select"
                )
        );


        assertEquals(
                "Two filter dropdowns should be displayed",
                2,
                dropdowns.size()
        );


        Select statusSelect =
                new Select(dropdowns.get(1));


        List<WebElement> options =
                statusSelect.getOptions();


        assertEquals(
                4,
                options.size()
        );


        assertEquals(
                "All Status",
                options.get(0).getText()
        );


        assertEquals(
                "Active",
                options.get(1).getText()
        );


        assertEquals(
                "Inactive",
                options.get(2).getText()
        );


        assertEquals(
                "onLeave",
                options.get(3).getText()
        );


        System.out.println(
                "TEST 5 PASSED"
        );
    }


    // =========================================================
    // TEST 6
    // SEARCH BY ASSET ID
    //
    // If assets exist:
    //     Search using actual Asset ID.
    //
    // If no assets exist:
    //     Verify "No assets found."
    //     and pass the test.
    // =========================================================

    @Test
    public void testSearchByAssetId() {

        System.out.println(
                "========== TEST 6: SEARCH BY ASSET ID =========="
        );

        navigateToAssetDetails();


        waitForAssetTable();


        // -----------------------------------------------------
        // CASE 1: NO ASSETS
        // -----------------------------------------------------

        if (!hasAssets()) {

            assertTrue(
                    "No assets message should be displayed",
                    hasNoAssetsMessage()
            );


            System.out.println(
                    "No assets available."
            );

            System.out.println(
                    "PASS: No assets found state verified"
            );


            System.out.println(
                    "TEST 6 PASSED"
            );

            return;
        }


        // -----------------------------------------------------
        // CASE 2: ASSETS EXIST
        // -----------------------------------------------------

        List<WebElement> assetRows = driver.findElements(
                By.xpath(
                        "//tbody//tr[.//button[normalize-space()='View']]"
                )
        );


        WebElement firstRow =
                assetRows.get(0);


        String assetId = firstRow
                .findElement(
                        By.cssSelector(
                                "td:nth-child(1)"
                        )
                )
                .getText()
                .trim();


        assertTrue(
                "Asset ID should not be empty",
                !assetId.isEmpty()
        );


        System.out.println(
                "Asset ID selected: " + assetId
        );


        WebElement searchInput = driver.findElement(
                By.cssSelector(
                        ".ad-search-input"
                )
        );


        searchInput.clear();

        searchInput.sendKeys(
                assetId
        );


        WebElement searchButton = driver.findElement(
                By.xpath(
                        "//button[normalize-space()='Search']"
                )
        );


        javascriptClick(searchButton);


        waitForAssetTable();


        List<WebElement> resultRows = driver.findElements(
                By.xpath(
                        "//tbody//tr[.//button[normalize-space()='View']]"
                )
        );


        assertTrue(
                "Search should return at least one asset",
                resultRows.size() > 0
        );


        String resultAssetId = resultRows
                .get(0)
                .findElement(
                        By.cssSelector(
                                "td:nth-child(1)"
                        )
                )
                .getText()
                .trim();


        assertEquals(
                assetId,
                resultAssetId
        );


        System.out.println(
                "TEST 6 PASSED"
        );
    }


    // =========================================================
    // TEST 7
    // VERIFY VIEW BUTTON
    //
    // If assets exist:
    //     Open View.
    //
    // If no assets:
    //     Verify No assets found.
    // =========================================================

    @Test
    public void testSearchByAssetName() {

        System.out.println(
                "========== TEST 7: VIEW ASSET =========="
        );

        navigateToAssetDetails();


        waitForAssetTable();


        // -----------------------------------------------------
        // NO ASSETS
        // -----------------------------------------------------

        if (!hasAssets()) {

            assertTrue(
                    "No assets message should be displayed",
                    hasNoAssetsMessage()
            );


            System.out.println(
                    "No assets available for View test."
            );


            System.out.println(
                    "PASS: Empty asset state verified"
            );


            System.out.println(
                    "TEST 7 PASSED"
            );

            return;
        }


        // -----------------------------------------------------
        // ASSETS EXIST
        // -----------------------------------------------------

        WebElement viewButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//tbody//tr[.//button[normalize-space()='View']]//button[normalize-space()='View']"
                        )
                )
        );


        assertTrue(
                "View button should be displayed",
                viewButton.isDisplayed()
        );


        scrollToElement(viewButton);

        javascriptClick(viewButton);


        // -----------------------------------------------------
        // VERIFY MODAL
        // -----------------------------------------------------

        WebElement modalTitle = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//h2[normalize-space()='Asset Details']"
                        )
                )
        );


        assertTrue(
                modalTitle.isDisplayed()
        );


        System.out.println(
                "PASS: Asset Details modal opened"
        );


        // Close
        WebElement closeButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='Close']"
                        )
                )
        );


        scrollToElement(closeButton);

        javascriptClick(closeButton);


        wait.until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.xpath(
                                "//h2[normalize-space()='Asset Details']"
                        )
                )
        );


        System.out.println(
                "PASS: Modal closed"
        );


        System.out.println(
                "TEST 7 PASSED"
        );
    }


    // =========================================================
    // TEST 8
    // FILTER BY ASSET TYPE
    // =========================================================

    @Test
    public void testFilterByAssetType() {

        System.out.println(
                "========== TEST 8: FILTER BY ASSET TYPE =========="
        );

        navigateToAssetDetails();


        List<WebElement> dropdowns = driver.findElements(
                By.cssSelector(
                        ".ad-filter-select"
                )
        );


        Select categorySelect =
                new Select(dropdowns.get(0));


        categorySelect.selectByVisibleText(
                "Monitor"
        );


        WebElement searchButton = driver.findElement(
                By.xpath(
                        "//button[normalize-space()='Search']"
                )
        );


        javascriptClick(searchButton);


        waitForAssetTable();


        // -----------------------------------------------------
        // If no Monitor exists
        // -----------------------------------------------------

        if (!hasAssets()) {

            assertTrue(
                    "No assets message should be displayed",
                    hasNoAssetsMessage()
            );


            System.out.println(
                    "No Monitor assets available."
            );


            System.out.println(
                    "TEST 8 PASSED"
            );

            return;
        }


        // -----------------------------------------------------
        // Verify returned asset types
        // -----------------------------------------------------

        List<WebElement> rows = driver.findElements(
                By.xpath(
                        "//tbody//tr[.//button[normalize-space()='View']]"
                )
        );


        for (WebElement row : rows) {

            String assetType = row
                    .findElement(
                            By.cssSelector(
                                    "td:nth-child(2)"
                            )
                    )
                    .getText()
                    .trim();


            assertEquals(
                    "Monitor",
                    assetType
            );
        }


        System.out.println(
                "TEST 8 PASSED"
        );
    }


    // =========================================================
    // TEST 9
    // FILTER BY STATUS
    // =========================================================

    @Test
    public void testFilterByStatus() {

        System.out.println(
                "========== TEST 9: FILTER BY STATUS =========="
        );

        navigateToAssetDetails();


        List<WebElement> dropdowns = driver.findElements(
                By.cssSelector(
                        ".ad-filter-select"
                )
        );


        Select statusSelect =
                new Select(dropdowns.get(1));


        statusSelect.selectByVisibleText(
                "Active"
        );


        WebElement searchButton = driver.findElement(
                By.xpath(
                        "//button[normalize-space()='Search']"
                )
        );


        javascriptClick(searchButton);


        waitForAssetTable();


        // -----------------------------------------------------
        // If no Active assets
        // -----------------------------------------------------

        if (!hasAssets()) {

            assertTrue(
                    "No assets message should be displayed",
                    hasNoAssetsMessage()
            );


            System.out.println(
                    "No Active assets available."
            );


            System.out.println(
                    "TEST 9 PASSED"
            );

            return;
        }


        // -----------------------------------------------------
        // Verify status
        // -----------------------------------------------------

        List<WebElement> rows = driver.findElements(
                By.xpath(
                        "//tbody//tr[.//button[normalize-space()='View']]"
                )
        );


        for (WebElement row : rows) {

            String status = row
                    .findElement(
                            By.cssSelector(
                                    "td:nth-child(3)"
                            )
                    )
                    .getText()
                    .trim();


            assertEquals(
                    "Active",
                    status
            );
        }


        System.out.println(
                "TEST 9 PASSED"
        );
    }


    // =========================================================
    // TEST 10
    // RESET BUTTON
    // =========================================================

    @Test
    public void testResetButton() {

        System.out.println(
                "========== TEST 10: RESET BUTTON =========="
        );

        navigateToAssetDetails();


        // Search
        WebElement searchInput = driver.findElement(
                By.cssSelector(
                        ".ad-search-input"
                )
        );


        searchInput.sendKeys(
                "TEST"
        );


        // Dropdowns
        List<WebElement> dropdowns = driver.findElements(
                By.cssSelector(
                        ".ad-filter-select"
                )
        );


        Select categorySelect =
                new Select(dropdowns.get(0));


        categorySelect.selectByVisibleText(
                "Monitor"
        );


        Select statusSelect =
                new Select(dropdowns.get(1));


        statusSelect.selectByVisibleText(
                "Active"
        );


        // Reset
        WebElement resetButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='Reset']"
                        )
                )
        );


        scrollToElement(resetButton);

        javascriptClick(resetButton);


        // Verify search
        assertEquals(
                "",
                searchInput.getAttribute("value")
        );


        // Verify Asset Type
        assertEquals(
                "All Asset Types",
                categorySelect
                        .getFirstSelectedOption()
                        .getText()
        );


        // Verify Status
        assertEquals(
                "All Status",
                statusSelect
                        .getFirstSelectedOption()
                        .getText()
        );


        System.out.println(
                "PASS: Search reset"
        );


        System.out.println(
                "PASS: Asset Type reset"
        );


        System.out.println(
                "PASS: Status reset"
        );


        System.out.println(
                "TEST 10 PASSED"
        );
    }


    // =========================================================
    // TEST 11
    // VIEW ASSET DETAILS MODAL
    //
    // If assets exist:
    //     Verify complete modal.
    //
    // If no assets:
    //     Verify empty state.
    // =========================================================

    @Test
    public void testViewAssetDetails() {

        System.out.println(
                "========== TEST 11: VIEW ASSET DETAILS =========="
        );

        navigateToAssetDetails();


        waitForAssetTable();


        // -----------------------------------------------------
        // NO ASSETS
        // -----------------------------------------------------

        if (!hasAssets()) {

            assertTrue(
                    "No assets message should be displayed",
                    hasNoAssetsMessage()
            );


            System.out.println(
                    "No assets available for View modal."
            );


            System.out.println(
                    "PASS: Empty asset state verified"
            );


            System.out.println(
                    "TEST 11 PASSED"
            );

            return;
        }


        // -----------------------------------------------------
        // ASSETS EXIST
        // -----------------------------------------------------

        WebElement viewButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//tbody//tr[.//button[normalize-space()='View']]//button[normalize-space()='View']"
                        )
                )
        );


        scrollToElement(viewButton);

        javascriptClick(viewButton);


        System.out.println(
                "PASS: View button clicked"
        );


        // -----------------------------------------------------
        // MODAL TITLE
        // -----------------------------------------------------

        WebElement modalTitle = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//h2[normalize-space()='Asset Details']"
                        )
                )
        );


        assertTrue(
                "Asset Details modal should be displayed",
                modalTitle.isDisplayed()
        );


        // -----------------------------------------------------
        // ASSET ID
        // -----------------------------------------------------

        WebElement assetIdLabel = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Asset ID']"
                )
        );


        assertTrue(
                assetIdLabel.isDisplayed()
        );


        WebElement assetIdValue = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Asset ID']/following-sibling::span"
                )
        );


        assertTrue(
                "Asset ID should not be empty",
                !assetIdValue.getText().trim().isEmpty()
        );


        // -----------------------------------------------------
        // ASSET TYPE
        // -----------------------------------------------------

        WebElement assetTypeLabel = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Asset Type']"
                )
        );


        assertTrue(
                assetTypeLabel.isDisplayed()
        );


        WebElement assetTypeValue = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Asset Type']/following-sibling::span"
                )
        );


        assertTrue(
                "Asset Type should not be empty",
                !assetTypeValue.getText().trim().isEmpty()
        );


        // -----------------------------------------------------
        // BRAND
        // -----------------------------------------------------

        assertTrue(
                driver.findElement(
                        By.xpath(
                                "//span[normalize-space()='Brand']"
                        )
                ).isDisplayed()
        );


        // -----------------------------------------------------
        // MODEL
        // -----------------------------------------------------

        assertTrue(
                driver.findElement(
                        By.xpath(
                                "//span[normalize-space()='Model']"
                        )
                ).isDisplayed()
        );


        // -----------------------------------------------------
        // STATUS
        // -----------------------------------------------------

        assertTrue(
                driver.findElement(
                        By.xpath(
                                "//span[normalize-space()='Status']"
                        )
                ).isDisplayed()
        );


        // -----------------------------------------------------
        // PURCHASE DATE
        // -----------------------------------------------------

        assertTrue(
                driver.findElement(
                        By.xpath(
                                "//span[normalize-space()='Purchase Date']"
                        )
                ).isDisplayed()
        );


        // -----------------------------------------------------
        // WARRANTY EXPIRY
        // -----------------------------------------------------

        assertTrue(
                driver.findElement(
                        By.xpath(
                                "//span[normalize-space()='Warranty Expiry']"
                        )
                ).isDisplayed()
        );


        // -----------------------------------------------------
        // DESCRIPTION
        // -----------------------------------------------------

        assertTrue(
                driver.findElement(
                        By.xpath(
                                "//span[normalize-space()='Description']"
                        )
                ).isDisplayed()
        );


        System.out.println(
                "PASS: Asset ID displayed"
        );

        System.out.println(
                "PASS: Asset Type displayed"
        );

        System.out.println(
                "PASS: Brand displayed"
        );

        System.out.println(
                "PASS: Model displayed"
        );

        System.out.println(
                "PASS: Status displayed"
        );

        System.out.println(
                "PASS: Purchase Date displayed"
        );

        System.out.println(
                "PASS: Warranty Expiry displayed"
        );

        System.out.println(
                "PASS: Description displayed"
        );


        // -----------------------------------------------------
        // CLOSE MODAL
        // -----------------------------------------------------

        WebElement closeButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='Close']"
                        )
                )
        );


        scrollToElement(closeButton);

        javascriptClick(closeButton);


        wait.until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.xpath(
                                "//h2[normalize-space()='Asset Details']"
                        )
                )
        );


        System.out.println(
                "PASS: Modal closed"
        );


        System.out.println(
                "TEST 11 PASSED"
        );
    }


    // =========================================================
    // TEST 12
    // ROWS PER PAGE
    // =========================================================

    @Test
    public void testRowsPerPage() {

        System.out.println(
                "========== TEST 12: ROWS PER PAGE =========="
        );

        navigateToAssetDetails();


        WebElement rowsDropdown = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ad-rows-select"
                        )
                )
        );


        Select rowsSelect =
                new Select(rowsDropdown);


        List<WebElement> options =
                rowsSelect.getOptions();


        assertEquals(
                4,
                options.size()
        );


        assertEquals(
                "10",
                options.get(0).getText()
        );


        assertEquals(
                "30",
                options.get(1).getText()
        );


        assertEquals(
                "50",
                options.get(2).getText()
        );


        assertEquals(
                "All",
                options.get(3).getText()
        );


        rowsSelect.selectByVisibleText(
                "All"
        );


        assertEquals(
                "All",
                rowsSelect
                        .getFirstSelectedOption()
                        .getText()
        );


        WebElement paginationInfo = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ad-pagination-info"
                        )
                )
        );


        assertTrue(
                paginationInfo.isDisplayed()
        );


        String paginationText =
                paginationInfo.getText();


        assertTrue(
                paginationText.contains("Showing")
        );


        assertTrue(
                paginationText.contains("assets")
        );


        System.out.println(
                "Pagination: " + paginationText
        );


        System.out.println(
                "TEST 12 PASSED"
        );
    }


    // =========================================================
    // TEST 13
    // BACK BUTTON
    // =========================================================

    @Test
    public void testBackButton() {

        System.out.println(
                "========== TEST 13: BACK BUTTON =========="
        );

        navigateToAssetDetails();


        WebElement backButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//button[contains(normalize-space(),'Back')]"
                        )
                )
        );


        scrollToElement(backButton);

        javascriptClick(backButton);


        System.out.println(
                "PASS: Back button clicked"
        );


        wait.until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.xpath(
                                "//h1[normalize-space()='Asset Details']"
                        )
                )
        );


        System.out.println(
                "PASS: Asset Details page closed"
        );


        System.out.println(
                "TEST 13 PASSED"
        );
    }


    // =========================================================
    // TEARDOWN
    // =========================================================

    @After
    public void tearDown() {

        if (driver != null) {

            driver.quit();

            System.out.println();
            System.out.println("==========================================");
            System.out.println("BROWSER CLOSED");
            System.out.println("==========================================");
        }
    }
}
