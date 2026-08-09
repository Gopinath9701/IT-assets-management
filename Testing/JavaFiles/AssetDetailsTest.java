package com.test;

import java.time.Duration;

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

        driver.get("http://localhost:3000");

        System.out.println();
        System.out.println("==========================================");
        System.out.println("APPLICATION STARTED");
        System.out.println("==========================================");
    }

    // =========================================================
    // SCROLL HELPER
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
    // NAVIGATION
    //
    // Home
    //   ↓
    // Login
    //   ↓
    // DO NOT ENTER CREDENTIALS
    //   ↓
    // Asset Mgmt
    //   ↓
    // Asset Management
    //   ↓
    // Asset Details
    // =========================================================

    private void navigateToAssetDetails() {

        System.out.println();
        System.out.println("Starting navigation...");

        // -----------------------------------------------------
        // 1. Click Login
        // -----------------------------------------------------

        WebElement loginButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Login']"
                        )
                )
        );

        scrollToElement(loginButton);

        loginButton.click();

        System.out.println(
                "PASS: Login button clicked"
        );

        // -----------------------------------------------------
        // 2. DO NOT ENTER USERNAME/PASSWORD
        // -----------------------------------------------------

        System.out.println(
                "Username and password intentionally left empty"
        );

        // -----------------------------------------------------
        // 3. Click Asset Mgmt
        // -----------------------------------------------------

        WebElement assetMgmtButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Asset Mgmt']"
                        )
                )
        );

        scrollToElement(assetMgmtButton);

        assetMgmtButton.click();

        System.out.println(
                "PASS: Asset Mgmt button clicked"
        );

        // -----------------------------------------------------
        // 4. Verify Asset Management page
        // -----------------------------------------------------

        WebElement assetManagementHeading = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//h1[normalize-space()='Asset Management']"
                        )
                )
        );

        assertTrue(
                "Asset Management page should be displayed",
                assetManagementHeading.isDisplayed()
        );

        System.out.println(
                "PASS: Asset Management page opened"
        );

        // -----------------------------------------------------
        // 5. Click Asset Details
        // -----------------------------------------------------

        WebElement assetDetailsButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Asset Details']"
                        )
                )
        );

        scrollToElement(assetDetailsButton);

        assetDetailsButton.click();

        System.out.println(
                "PASS: Asset Details button clicked"
        );

        // -----------------------------------------------------
        // 6. Verify Asset Details page
        // -----------------------------------------------------

        WebElement assetDetailsHeading = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//h1[normalize-space()='Asset Details']"
                        )
                )
        );

        assertTrue(
                "Asset Details page should be displayed",
                assetDetailsHeading.isDisplayed()
        );

        System.out.println(
                "PASS: Asset Details page opened"
        );
    }

    // =========================================================
    // TEST 1
    // VERIFY ASSET DETAILS PAGE
    // =========================================================

    @Test
    public void testAssetDetailsPage() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 1 - ASSET DETAILS PAGE");
        System.out.println("==========================================");

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

        // Verify breadcrumb
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

        System.out.println(
                "TEST 1 PASSED"
        );
    }

    // =========================================================
    // TEST 2
    // VERIFY STATISTICS
    // =========================================================

    @Test
    public void testAssetStatistics() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 2 - ASSET STATISTICS");
        System.out.println("==========================================");

        navigateToAssetDetails();

        // Total Assets
        WebElement totalLabel = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//span[normalize-space()='Total Assets']"
                        )
                )
        );

        assertTrue(
                totalLabel.isDisplayed()
        );

        // In Use
        WebElement inUseLabel = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//span[normalize-space()='In Use']"
                        )
                )
        );

        assertTrue(
                inUseLabel.isDisplayed()
        );

        // Under Maintenance
        WebElement maintenanceLabel = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//span[normalize-space()='Under Maintenance']"
                        )
                )
        );

        assertTrue(
                maintenanceLabel.isDisplayed()
        );

        // Not In Use
        WebElement notInUseLabel = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//span[normalize-space()='Not In Use']"
                        )
                )
        );

        assertTrue(
                notInUseLabel.isDisplayed()
        );

        // Verify expected values from your JS
        assertTrue(
                driver.findElement(
                        By.xpath(
                                "//span[normalize-space()='Total Assets']/following-sibling::span"
                        )
                ).getText().equals("5")
        );

        assertTrue(
                driver.findElement(
                        By.xpath(
                                "//span[normalize-space()='In Use']/following-sibling::span"
                        )
                ).getText().equals("3")
        );

        assertTrue(
                driver.findElement(
                        By.xpath(
                                "//span[normalize-space()='Under Maintenance']/following-sibling::span"
                        )
                ).getText().equals("1")
        );

        assertTrue(
                driver.findElement(
                        By.xpath(
                                "//span[normalize-space()='Not In Use']/following-sibling::span"
                        )
                ).getText().equals("1")
        );

        System.out.println(
                "TEST 2 PASSED"
        );
    }

    // =========================================================
    // TEST 3
    // SEARCH VALIDATION - EMPTY
    // =========================================================

    @Test
    public void testEmptySearchValidation() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 3 - EMPTY SEARCH VALIDATION");
        System.out.println("==========================================");

        navigateToAssetDetails();

        // Click Search without entering anything
        WebElement searchButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Search']"
                        )
                )
        );

        scrollToElement(searchButton);

        searchButton.click();

        System.out.println(
                "Search clicked without search data"
        );

        // Expected validation message
        WebElement errorMessage = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[contains(normalize-space(),'Please enter a search term or select at least one filter to search')]"
                        )
                )
        );

        assertTrue(
                "Search validation message should be displayed",
                errorMessage.isDisplayed()
        );

        System.out.println(
                "TEST 3 PASSED"
        );
    }

    // =========================================================
    // TEST 4
    // SEARCH BY ASSET ID
    // =========================================================

    @Test
    public void testSearchByAssetId() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 4 - SEARCH BY ASSET ID");
        System.out.println("==========================================");

        navigateToAssetDetails();

        WebElement searchInput = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//input[@placeholder='Search assets by name or ID...']"
                        )
                )
        );

        searchInput.clear();

        searchInput.sendKeys("AST001");

        WebElement searchButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Search']"
                        )
                )
        );

        scrollToElement(searchButton);

        searchButton.click();

        System.out.println(
                "Searching for AST001"
        );

        // Verify AST001
        WebElement assetId = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//td[normalize-space()='AST001']"
                        )
                )
        );

        assertTrue(
                "AST001 should be displayed",
                assetId.isDisplayed()
        );

        // Verify Dell Laptop
        WebElement assetName = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//tr[td[normalize-space()='AST001']]/td[2]"
                        )
                )
        );

        assertEquals(
                "Dell Laptop",
                assetName.getText()
        );

        System.out.println(
                "TEST 4 PASSED"
        );
    }

    // =========================================================
    // TEST 5
    // SEARCH BY ASSET NAME
    // =========================================================

    @Test
    public void testSearchByAssetName() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 5 - SEARCH BY ASSET NAME");
        System.out.println("==========================================");

        navigateToAssetDetails();

        WebElement searchInput = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//input[@placeholder='Search assets by name or ID...']"
                        )
                )
        );

        searchInput.clear();

        searchInput.sendKeys("Dell Laptop");

        WebElement searchButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Search']"
                        )
                )
        );

        searchButton.click();

        WebElement dellLaptop = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//td[normalize-space()='Dell Laptop']"
                        )
                )
        );

        assertTrue(
                "Dell Laptop should be displayed",
                dellLaptop.isDisplayed()
        );

        System.out.println(
                "TEST 5 PASSED"
        );
    }

    // =========================================================
    // TEST 6
    // SEARCH BY CATEGORY
    // =========================================================

    @Test
    public void testSearchByCategory() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 6 - SEARCH BY CATEGORY");
        System.out.println("==========================================");

        navigateToAssetDetails();

        // Category dropdown
        WebElement categoryDropdown = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//select[option[normalize-space()='All Categories']]"
                        )
                )
        );

        Select categorySelect = new Select(
                categoryDropdown
        );

        categorySelect.selectByVisibleText(
                "Laptop"
        );

        System.out.println(
                "Laptop category selected"
        );

        // Click Search
        WebElement searchButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Search']"
                        )
                )
        );

        searchButton.click();

        // Verify Laptop result
        WebElement laptopCategory = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//td[normalize-space()='Laptop']"
                        )
                )
        );

        assertTrue(
                "Laptop category should be displayed",
                laptopCategory.isDisplayed()
        );

        System.out.println(
                "TEST 6 PASSED"
        );
    }

    // =========================================================
    // TEST 7
    // SEARCH BY STATUS
    // =========================================================

    @Test
    public void testSearchByStatus() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 7 - SEARCH BY STATUS");
        System.out.println("==========================================");

        navigateToAssetDetails();

        // Find Status dropdown
        WebElement statusDropdown = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//select[option[normalize-space()='All Status']]"
                        )
                )
        );

        Select statusSelect = new Select(
                statusDropdown
        );

        statusSelect.selectByVisibleText(
                "Under Maintenance"
        );

        System.out.println(
                "Under Maintenance selected"
        );

        // Search
        WebElement searchButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Search']"
                        )
                )
        );

        searchButton.click();

        // Verify Lenovo Desktop
        WebElement lenovo = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//td[normalize-space()='Lenovo Desktop']"
                        )
                )
        );

        assertTrue(
                "Lenovo Desktop should be displayed",
                lenovo.isDisplayed()
        );

        System.out.println(
                "TEST 7 PASSED"
        );
    }

    // =========================================================
    // TEST 8
    // SEARCH BY LOCATION
    // =========================================================

    @Test
    public void testSearchByLocation() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 8 - SEARCH BY LOCATION");
        System.out.println("==========================================");

        navigateToAssetDetails();

        // Location dropdown
        WebElement locationDropdown = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//select[option[normalize-space()='All Locations']]"
                        )
                )
        );

        Select locationSelect = new Select(
                locationDropdown
        );

        locationSelect.selectByVisibleText(
                "Server Room"
        );

        System.out.println(
                "Server Room selected"
        );

        // Search
        WebElement searchButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Search']"
                        )
                )
        );

        searchButton.click();

        // Verify Cisco Switch
        WebElement ciscoSwitch = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//td[normalize-space()='Cisco Switch']"
                        )
                )
        );

        assertTrue(
                "Cisco Switch should be displayed",
                ciscoSwitch.isDisplayed()
        );

        System.out.println(
                "TEST 8 PASSED"
        );
    }

    // =========================================================
    // TEST 9
    // RESET BUTTON
    // =========================================================

    @Test
    public void testResetButton() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 9 - RESET BUTTON");
        System.out.println("==========================================");

        navigateToAssetDetails();

        // Enter search
        WebElement searchInput = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//input[@placeholder='Search assets by name or ID...']"
                        )
                )
        );

        searchInput.sendKeys(
                "AST001"
        );

        // Select category
        WebElement categoryDropdown = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//select[option[normalize-space()='All Categories']]"
                        )
                )
        );

        Select categorySelect = new Select(
                categoryDropdown
        );

        categorySelect.selectByVisibleText(
                "Laptop"
        );

        // Click Reset
        WebElement resetButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Reset']"
                        )
                )
        );

        scrollToElement(resetButton);

        resetButton.click();

        System.out.println(
                "Reset button clicked"
        );

        // Verify search field is empty
        assertEquals(
                "",
                searchInput.getAttribute("value")
        );

        // Verify category reset
        assertEquals(
                "All Categories",
                categorySelect.getFirstSelectedOption().getText()
        );

        System.out.println(
                "PASS: Search field reset"
        );

        System.out.println(
                "PASS: Category reset"
        );

        System.out.println(
                "TEST 9 PASSED"
        );
    }

    // =========================================================
    // TEST 10
    // VIEW ASSET DETAILS
    // =========================================================

    @Test
    public void testViewAssetDetails() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 10 - VIEW ASSET DETAILS");
        System.out.println("==========================================");

        navigateToAssetDetails();

        // -----------------------------------------------------
        // Find AST001 row
        // -----------------------------------------------------

        WebElement row = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//tr[td[normalize-space()='AST001']]"
                        )
                )
        );

        assertTrue(
                "AST001 row should be displayed",
                row.isDisplayed()
        );

        // -----------------------------------------------------
        // Find View button
        // -----------------------------------------------------

        WebElement viewButton = row.findElement(
                By.xpath(
                        ".//button[normalize-space()='View']"
                )
        );

        scrollToElement(viewButton);

        wait.until(
                ExpectedConditions.elementToBeClickable(
                        viewButton
                )
        );

        viewButton.click();

        System.out.println(
                "PASS: View button clicked"
        );

        // -----------------------------------------------------
        // Verify Asset Details modal
        // -----------------------------------------------------

        WebElement detailTitle = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//h2[normalize-space()='Asset Details']"
                        )
                )
        );

        assertTrue(
                "Asset Details modal should be displayed",
                detailTitle.isDisplayed()
        );

        System.out.println(
                "PASS: Asset Details modal opened"
        );

        // -----------------------------------------------------
        // Verify Asset ID
        // -----------------------------------------------------

        WebElement assetId = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//span[normalize-space()='Asset ID']/following-sibling::span"
                        )
                )
        );

        assertEquals(
                "AST001",
                assetId.getText()
        );

        // -----------------------------------------------------
        // Verify Asset Name
        // -----------------------------------------------------

        WebElement assetName = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Asset Name']/following-sibling::span"
                )
        );

        assertEquals(
                "Dell Laptop",
                assetName.getText()
        );

        // -----------------------------------------------------
        // Verify Category
        // -----------------------------------------------------

        WebElement category = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Category']/following-sibling::span"
                )
        );

        assertEquals(
                "Laptop",
                category.getText()
        );

        // -----------------------------------------------------
        // Verify Brand
        // -----------------------------------------------------

        WebElement brand = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Brand']/following-sibling::span"
                )
        );

        assertEquals(
                "Dell",
                brand.getText()
        );

        // -----------------------------------------------------
        // Verify Model
        // -----------------------------------------------------

        WebElement model = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Model']/following-sibling::span"
                )
        );

        assertEquals(
                "Inspiron 15",
                model.getText()
        );

        // -----------------------------------------------------
        // Verify Serial Number
        // -----------------------------------------------------

        WebElement serialNumber = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Serial Number']/following-sibling::span"
                )
        );

        assertEquals(
                "DL123456789",
                serialNumber.getText()
        );

        // -----------------------------------------------------
        // Verify Location
        // -----------------------------------------------------

        WebElement location = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Location']/following-sibling::span"
                )
        );

        assertEquals(
                "IT Department",
                location.getText()
        );

        // -----------------------------------------------------
        // Verify Status
        // -----------------------------------------------------

        WebElement status = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Status']/following-sibling::span"
                )
        );

        assertEquals(
                "In Use",
                status.getText()
        );

        // -----------------------------------------------------
        // Verify Assigned To
        // -----------------------------------------------------

        WebElement assignedTo = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Assigned To']/following-sibling::span"
                )
        );

        assertEquals(
                "John Doe",
                assignedTo.getText()
        );

        // -----------------------------------------------------
        // Verify Purchase Date
        // -----------------------------------------------------

        WebElement purchaseDate = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Purchase Date']/following-sibling::span"
                )
        );

        assertEquals(
                "15-01-2024",
                purchaseDate.getText()
        );

        // -----------------------------------------------------
        // Verify Warranty Expiry
        // -----------------------------------------------------

        WebElement warrantyExpiry = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Warranty Expiry']/following-sibling::span"
                )
        );

        assertEquals(
                "15-01-2027",
                warrantyExpiry.getText()
        );

        // -----------------------------------------------------
        // Verify Description
        // -----------------------------------------------------

        WebElement description = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='Description']/following-sibling::span"
                )
        );

        assertEquals(
                "Dell Inspiron 15 laptop with 8GB RAM, 512GB SSD, Windows 11.",
                description.getText()
        );

        System.out.println(
                "PASS: All AST001 details verified"
        );

        System.out.println(
                "TEST 10 PASSED"
        );
    }

    // =========================================================
    // TEST 11
    // CLOSE DETAILS MODAL
    // =========================================================

    @Test
    public void testCloseAssetDetailsModal() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 11 - CLOSE ASSET DETAILS MODAL");
        System.out.println("==========================================");

        navigateToAssetDetails();

        // Find AST001 row
        WebElement row = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//tr[td[normalize-space()='AST001']]"
                        )
                )
        );

        // Click View
        WebElement viewButton = row.findElement(
                By.xpath(
                        ".//button[normalize-space()='View']"
                )
        );

        scrollToElement(viewButton);

        viewButton.click();

        // Wait for modal
        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//h2[normalize-space()='Asset Details']"
                        )
                )
        );

        System.out.println(
                "Asset Details modal opened"
        );

        // -----------------------------------------------------
        // Click Close button
        // -----------------------------------------------------

        WebElement closeButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Close']"
                        )
                )
        );

        scrollToElement(closeButton);

        closeButton.click();

        System.out.println(
                "Close button clicked"
        );

        // -----------------------------------------------------
        // Verify modal closed
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.xpath(
                                "//h2[normalize-space()='Asset Details']"
                        )
                )
        );

        System.out.println(
                "PASS: Asset Details modal closed"
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

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 12 - ROWS PER PAGE");
        System.out.println("==========================================");

        navigateToAssetDetails();

        WebElement rowsDropdown = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ad-rows-select"
                        )
                )
        );

        Select rowsSelect = new Select(
                rowsDropdown
        );

        // Select All
        rowsSelect.selectByVisibleText(
                "All"
        );

        System.out.println(
                "Rows per page set to All"
        );

        // Verify Showing 5 of 5
        WebElement paginationInfo = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ad-pagination-info"
                        )
                )
        );

        assertTrue(
                "Pagination information should be displayed",
                paginationInfo.isDisplayed()
        );

        assertEquals(
                "Showing 5 of 5 assets",
                paginationInfo.getText()
        );

        System.out.println(
                "PASS: Showing 5 of 5 assets"
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

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 13 - BACK BUTTON");
        System.out.println("==========================================");

        navigateToAssetDetails();

        // Find Back button
        WebElement backButton = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//button[contains(normalize-space(),'Back')]"
                        )
                )
        );

        scrollToElement(backButton);

        wait.until(
                ExpectedConditions.elementToBeClickable(
                        backButton
                )
        );

        backButton.click();

        System.out.println(
                "PASS: Back button clicked"
        );

        System.out.println(
                "TEST 13 PASSED"
        );
    }

    // =========================================================
    // TEST 14
    // SEARCH INVALID ASSET ID
    // =========================================================

    @Test
    public void testInvalidAssetId() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 14 - INVALID ASSET ID");
        System.out.println("==========================================");

        navigateToAssetDetails();

        WebElement searchInput = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//input[@placeholder='Search assets by name or ID...']"
                        )
                )
        );

        searchInput.clear();

        // Invalid ID containing space
        searchInput.sendKeys(
                "AST 01"
        );

        WebElement searchButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Search']"
                        )
                )
        );

        searchButton.click();

        // Verify validation
        WebElement errorMessage = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[contains(normalize-space(),'Asset ID should not contain spaces')]"
                        )
                )
        );

        assertTrue(
                "Invalid Asset ID message should be displayed",
                errorMessage.isDisplayed()
        );

        System.out.println(
                "PASS: Invalid Asset ID validation displayed"
        );

        System.out.println(
                "TEST 14 PASSED"
        );
    }

    // =========================================================
    // TEST 15
    // SEARCH WITH SPECIAL CHARACTER
    // =========================================================

    @Test
    public void testSpecialCharacterAssetId() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 15 - SPECIAL CHARACTER ASSET ID");
        System.out.println("==========================================");

        navigateToAssetDetails();

        WebElement searchInput = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//input[@placeholder='Search assets by name or ID...']"
                        )
                )
        );

        searchInput.clear();

        searchInput.sendKeys(
                "AST@01"
        );

        WebElement searchButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Search']"
                        )
                )
        );

        searchButton.click();

        WebElement errorMessage = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[contains(normalize-space(),'Asset ID should not contain special characters')]"
                        )
                )
        );

        assertTrue(
                "Special character validation should be displayed",
                errorMessage.isDisplayed()
        );

        System.out.println(
                "PASS: Special character validation displayed"
        );

        System.out.println(
                "TEST 15 PASSED"
        );
    }

    // =========================================================
    // TEST 16
    // SEARCH ASSET ID WITH LOWERCASE
    // =========================================================

    @Test
    public void testLowercaseAssetId() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 16 - LOWERCASE ASSET ID");
        System.out.println("==========================================");

        navigateToAssetDetails();

        WebElement searchInput = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//input[@placeholder='Search assets by name or ID...']"
                        )
                )
        );

        searchInput.clear();

        searchInput.sendKeys(
                "ast001"
        );

        WebElement searchButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Search']"
                        )
                )
        );

        searchButton.click();

        // The JS validation requires uppercase AST
        WebElement errorMessage = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[contains(normalize-space(),\"Asset ID must start with 'AST' (uppercase)\")]"
                        )
                )
        );

        assertTrue(
                "Uppercase AST validation should be displayed",
                errorMessage.isDisplayed()
        );

        System.out.println(
                "PASS: Lowercase Asset ID validation displayed"
        );

        System.out.println(
                "TEST 16 PASSED"
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
