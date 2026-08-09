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

public class ManageAssetTest {

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
    // No credentials entered
    //   ↓
    // Asset Mgmt
    //   ↓
    // Asset Management
    //   ↓
    // Manage Assets
    //   ↓
    // Manage Asset
    // =========================================================

    private void navigateToManageAsset() {

        System.out.println();
        System.out.println("Starting navigation...");

        // -----------------------------------------------------
        // 1. Click Login
        // -----------------------------------------------------

        WebElement loginButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//button[normalize-space()='Login']")
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
                        By.xpath("//button[normalize-space()='Asset Mgmt']")
                )
        );

        scrollToElement(assetMgmtButton);

        assetMgmtButton.click();

        System.out.println(
                "PASS: Asset Mgmt clicked"
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
        // 5. Find Manage Assets button
        // -----------------------------------------------------

        WebElement manageAssetsButton = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='Manage Assets']"
                        )
                )
        );

        assertTrue(
                "Manage Assets button should be visible",
                manageAssetsButton.isDisplayed()
        );

        System.out.println(
                "PASS: Manage Assets button found"
        );

        // -----------------------------------------------------
        // 6. Click Manage Assets
        // -----------------------------------------------------

        scrollToElement(manageAssetsButton);

        wait.until(
                ExpectedConditions.elementToBeClickable(
                        manageAssetsButton
                )
        );

        manageAssetsButton.click();

        System.out.println(
                "PASS: Manage Assets clicked"
        );

        // -----------------------------------------------------
        // 7. Verify Manage Asset page
        // -----------------------------------------------------

        WebElement manageAssetHeading = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//h1[normalize-space()='Manage Asset']"
                        )
                )
        );

        assertTrue(
                "Manage Asset page should be displayed",
                manageAssetHeading.isDisplayed()
        );

        System.out.println(
                "PASS: Manage Asset page opened"
        );
    }

    // =========================================================
    // TEST 1
    // MANAGE ASSET PAGE
    // =========================================================

    @Test
    public void testManageAssetPage() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 1 - MANAGE ASSET PAGE");
        System.out.println("==========================================");

        navigateToManageAsset();

        WebElement heading = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//h1[normalize-space()='Manage Asset']"
                        )
                )
        );

        assertTrue(
                "Manage Asset heading should be visible",
                heading.isDisplayed()
        );

        System.out.println(
                "TEST 1 PASSED"
        );
    }

    // =========================================================
    // TEST 2
    // SEARCH FIELDS
    // =========================================================

    @Test
    public void testSearchFields() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 2 - SEARCH FIELDS");
        System.out.println("==========================================");

        navigateToManageAsset();

        // Search input
        WebElement searchInput = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//input[@placeholder='Enter asset name or ID (e.g., AST001)']"
                        )
                )
        );

        assertTrue(
                "Search input should be visible",
                searchInput.isDisplayed()
        );

        // Asset Type dropdown
        WebElement assetType = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ma-search-row .ma-select"
                        )
                )
        );

        assertTrue(
                "Asset Type dropdown should be visible",
                assetType.isDisplayed()
        );

        // Search button
        WebElement searchButton = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='Search']"
                        )
                )
        );

        assertTrue(
                "Search button should be visible",
                searchButton.isDisplayed()
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

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 3 - EMPTY SEARCH VALIDATION");
        System.out.println("==========================================");

        navigateToManageAsset();

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
                "Search clicked without entering data"
        );

        WebElement errorMessage = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[contains(normalize-space(),'Please enter an Asset Name/ID or select an Asset Type to search')]"
                        )
                )
        );

        assertTrue(
                "Validation message should be displayed",
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

        navigateToManageAsset();

        WebElement searchInput = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//input[@placeholder='Enter asset name or ID (e.g., AST001)']"
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

        searchButton.click();

        System.out.println(
                "Searching AST001"
        );

        WebElement assetId = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//span[normalize-space()='AST001']"
                        )
                )
        );

        assertTrue(
                "AST001 should be displayed",
                assetId.isDisplayed()
        );

        System.out.println(
                "TEST 4 PASSED"
        );
    }

    // =========================================================
    // TEST 5
    // SEARCH BY ASSET TYPE
    // =========================================================

    @Test
    public void testSearchByAssetType() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 5 - SEARCH BY ASSET TYPE");
        System.out.println("==========================================");

        navigateToManageAsset();

        WebElement assetType = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ma-search-row .ma-select"
                        )
                )
        );

        Select select = new Select(assetType);

        select.selectByVisibleText("Laptop");

        System.out.println(
                "Laptop selected"
        );

        WebElement searchButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Search']"
                        )
                )
        );

        searchButton.click();

        WebElement laptop = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//td[normalize-space()='HP Laptop']"
                        )
                )
        );

        assertTrue(
                "HP Laptop should be displayed",
                laptop.isDisplayed()
        );

        System.out.println(
                "TEST 5 PASSED"
        );
    }

    // =========================================================
    // TEST 6
    // SEARCH BY ASSET NAME
    // =========================================================

    @Test
    public void testSearchByAssetName() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 6 - SEARCH BY ASSET NAME");
        System.out.println("==========================================");

        navigateToManageAsset();

        WebElement searchInput = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//input[@placeholder='Enter asset name or ID (e.g., AST001)']"
                        )
                )
        );

        searchInput.clear();

        searchInput.sendKeys("Dell");

        WebElement searchButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Search']"
                        )
                )
        );

        searchButton.click();

        WebElement dellAsset = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//td[contains(normalize-space(),'Dell')]"
                        )
                )
        );

        assertTrue(
                "Dell asset should be displayed",
                dellAsset.isDisplayed()
        );

        System.out.println(
                "TEST 6 PASSED"
        );
    }

    // =========================================================
    // TEST 7
    // ASSET TABLE
    // =========================================================

    @Test
    public void testAssetTable() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 7 - ASSET TABLE");
        System.out.println("==========================================");

        navigateToManageAsset();

        WebElement table = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-table")
                )
        );

        assertTrue(
                "Asset table should be displayed",
                table.isDisplayed()
        );

        assertTrue(
                driver.findElement(
                        By.xpath("//th[normalize-space()='Asset ID']")
                ).isDisplayed()
        );

        assertTrue(
                driver.findElement(
                        By.xpath("//th[normalize-space()='Asset Name']")
                ).isDisplayed()
        );

        assertTrue(
                driver.findElement(
                        By.xpath("//th[normalize-space()='Asset Type']")
                ).isDisplayed()
        );

        assertTrue(
                driver.findElement(
                        By.xpath("//th[normalize-space()='Purchase Date']")
                ).isDisplayed()
        );

        assertTrue(
                driver.findElement(
                        By.xpath("//th[normalize-space()='Warranty Expiry']")
                ).isDisplayed()
        );

        assertTrue(
                driver.findElement(
                        By.xpath("//th[normalize-space()='Actions']")
                ).isDisplayed()
        );

        System.out.println(
                "TEST 7 PASSED"
        );
    }

    // =========================================================
    // TEST 8
    // ROWS PER PAGE
    // =========================================================

    @Test
    public void testRowsPerPage() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 8 - ROWS PER PAGE");
        System.out.println("==========================================");

        navigateToManageAsset();

        WebElement rowsSelect = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-rows-select")
                )
        );

        Select select = new Select(rowsSelect);

        select.selectByVisibleText("All");

        WebElement paginationInfo = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ma-pagination-info")
                )
        );

        assertTrue(
                "Pagination information should be displayed",
                paginationInfo.isDisplayed()
        );

        System.out.println(
                "Pagination: " + paginationInfo.getText()
        );

        System.out.println(
                "TEST 8 PASSED"
        );
    }

    // =========================================================
    // TEST 9
    // EDIT ASSET
    //
    // FIX:
    // Asset ID is READ ONLY.
    // Asset Name is editable.
    //
    // Also handles the success ALERT after Update.
    // =========================================================

    @Test
    public void testEditAsset() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 9 - EDIT ASSET");
        System.out.println("==========================================");

        navigateToManageAsset();

        // -----------------------------------------------------
        // Find AST001 row
        // -----------------------------------------------------

        WebElement row = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//tr[.//span[normalize-space()='AST001']]"
                        )
                )
        );

        // -----------------------------------------------------
        // Find Edit button
        // -----------------------------------------------------

        WebElement editButton = row.findElement(
                By.xpath(
                        ".//button[normalize-space()='Edit']"
                )
        );

        scrollToElement(editButton);

        wait.until(
                ExpectedConditions.elementToBeClickable(
                        editButton
                )
        );

        editButton.click();

        System.out.println(
                "PASS: Edit button clicked"
        );

        // -----------------------------------------------------
        // Verify Edit Asset modal
        // -----------------------------------------------------

        WebElement editModal = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//h2[normalize-space()='Edit Asset']"
                        )
                )
        );

        assertTrue(
                "Edit Asset modal should be displayed",
                editModal.isDisplayed()
        );

        System.out.println(
                "PASS: Edit Asset modal opened"
        );

        // -----------------------------------------------------
        // Find Asset Name
        //
        // IMPORTANT:
        // DO NOT USE:
        //
        // //h2[normalize-space()='Edit Asset']/following::input[1]
        //
        // That finds read-only Asset ID.
        // -----------------------------------------------------

        WebElement assetNameInput = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//input[@placeholder='Enter asset name']"
                        )
                )
        );

        System.out.println(
                "PASS: Asset Name field found"
        );

        // -----------------------------------------------------
        // Verify Asset Name is editable
        // -----------------------------------------------------

        assertTrue(
                "Asset Name should be enabled",
                assetNameInput.isEnabled()
        );

        // -----------------------------------------------------
        // Clear old name
        // -----------------------------------------------------

        assetNameInput.clear();

        // -----------------------------------------------------
        // Enter new name
        // -----------------------------------------------------

        assetNameInput.sendKeys(
                "Dell Monitor Updated"
        );

        System.out.println(
                "Entered: Dell Monitor Updated"
        );

        // -----------------------------------------------------
        // Verify entered value
        // -----------------------------------------------------

        assertEquals(
                "Dell Monitor Updated",
                assetNameInput.getAttribute("value")
        );

        // -----------------------------------------------------
        // Find Update button
        // -----------------------------------------------------

        WebElement updateButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Update']"
                        )
                )
        );

        scrollToElement(updateButton);

        // -----------------------------------------------------
        // Click Update
        // -----------------------------------------------------

        updateButton.click();

        System.out.println(
                "PASS: Update button clicked"
        );

        // =====================================================
        // HANDLE SUCCESS ALERT
        //
        // Application displays:
        //
        // Asset AST001 updated successfully!
        //
        // =====================================================

        wait.until(
                ExpectedConditions.alertIsPresent()
        );

        String alertText =
                driver.switchTo()
                        .alert()
                        .getText();

        System.out.println(
                "Alert: " + alertText
        );

        assertTrue(
                "Update success alert should be displayed",
                alertText.contains(
                        "AST001 updated successfully"
                )
        );

        // Accept alert
        driver.switchTo()
                .alert()
                .accept();

        System.out.println(
                "PASS: Update alert accepted"
        );

        // -----------------------------------------------------
        // Wait for modal to disappear
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.xpath(
                                "//h2[normalize-space()='Edit Asset']"
                        )
                )
        );

        System.out.println(
                "PASS: Edit modal closed"
        );

        // -----------------------------------------------------
        // Verify updated asset in table
        // -----------------------------------------------------

        WebElement updatedAsset = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//td[normalize-space()='Dell Monitor Updated']"
                        )
                )
        );

        assertTrue(
                "Updated Asset Name should be displayed",
                updatedAsset.isDisplayed()
        );

        System.out.println(
                "PASS: Updated asset displayed"
        );

        System.out.println();
        System.out.println(
                "=========================================="
        );
        System.out.println(
                "TEST 9 PASSED"
        );
        System.out.println(
                "=========================================="
        );
    }

    // =========================================================
    // TEST 10
    // CANCEL EDIT
    // =========================================================

    @Test
    public void testCancelEdit() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 10 - CANCEL EDIT");
        System.out.println("==========================================");

        navigateToManageAsset();

        WebElement row = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//tr[.//span[normalize-space()='AST002']]"
                        )
                )
        );

        WebElement editButton = row.findElement(
                By.xpath(
                        ".//button[normalize-space()='Edit']"
                )
        );

        scrollToElement(editButton);

        wait.until(
                ExpectedConditions.elementToBeClickable(
                        editButton
                )
        );

        editButton.click();

        // Wait for modal
        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//h2[normalize-space()='Edit Asset']"
                        )
                )
        );

        // Find Cancel
        WebElement cancelButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Cancel']"
                        )
                )
        );

        scrollToElement(cancelButton);

        cancelButton.click();

        // Verify modal closed
        wait.until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.xpath(
                                "//h2[normalize-space()='Edit Asset']"
                        )
                )
        );

        System.out.println(
                "TEST 10 PASSED"
        );
    }

    // =========================================================
    // TEST 11
    // DELETE CANCEL
    // =========================================================

    @Test
    public void testDeleteCancel() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 11 - DELETE CANCEL");
        System.out.println("==========================================");

        navigateToManageAsset();

        // Find AST003
        WebElement row = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//tr[.//span[normalize-space()='AST003']]"
                        )
                )
        );

        // Find Delete button
        WebElement deleteButton = row.findElement(
                By.xpath(
                        ".//button[normalize-space()='Delete']"
                )
        );

        scrollToElement(deleteButton);

        wait.until(
                ExpectedConditions.elementToBeClickable(
                        deleteButton
                )
        );

        deleteButton.click();

        System.out.println(
                "Delete button clicked"
        );

        // Delete modal
        WebElement deleteModal = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//h2[normalize-space()='Delete Asset']"
                        )
                )
        );

        assertTrue(
                "Delete modal should be displayed",
                deleteModal.isDisplayed()
        );

        // Click No
        WebElement noButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='No']"
                        )
                )
        );

        scrollToElement(noButton);

        noButton.click();

        // Verify modal closed
        wait.until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.xpath(
                                "//h2[normalize-space()='Delete Asset']"
                        )
                )
        );

        // Verify AST003 still exists
        WebElement assetStillExists = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//span[normalize-space()='AST003']"
                        )
                )
        );

        assertTrue(
                "AST003 should still exist",
                assetStillExists.isDisplayed()
        );

        System.out.println(
                "TEST 11 PASSED"
        );
    }

    // =========================================================
    // TEST 12
    // DELETE ASSET
    // =========================================================

    @Test
    public void testDeleteAsset() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 12 - DELETE ASSET");
        System.out.println("==========================================");

        navigateToManageAsset();

        // Find AST004
        WebElement row = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//tr[.//span[normalize-space()='AST004']]"
                        )
                )
        );

        // Delete button
        WebElement deleteButton = row.findElement(
                By.xpath(
                        ".//button[normalize-space()='Delete']"
                )
        );

        scrollToElement(deleteButton);

        wait.until(
                ExpectedConditions.elementToBeClickable(
                        deleteButton
                )
        );

        deleteButton.click();

        System.out.println(
                "Delete button clicked"
        );

        // Verify delete modal
        WebElement deleteModal = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//h2[normalize-space()='Delete Asset']"
                        )
                )
        );

        assertTrue(
                "Delete modal should be displayed",
                deleteModal.isDisplayed()
        );

        // Click Yes
        WebElement yesButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[normalize-space()='Yes']"
                        )
                )
        );

        scrollToElement(yesButton);

        yesButton.click();

        System.out.println(
                "Yes clicked"
        );

        // -----------------------------------------------------
        // Handle browser alert
        // -----------------------------------------------------

        try {

            wait.until(
                    ExpectedConditions.alertIsPresent()
            );

            String alertText =
                    driver.switchTo()
                            .alert()
                            .getText();

            System.out.println(
                    "Delete Alert: " + alertText
            );

            driver.switchTo()
                    .alert()
                    .accept();

        } catch (Exception e) {

            System.out.println(
                    "No delete alert displayed"
            );
        }

        // -----------------------------------------------------
        // Verify AST004 deleted
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.xpath(
                                "//span[normalize-space()='AST004']"
                        )
                )
        );

        System.out.println(
                "PASS: AST004 deleted"
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

        navigateToManageAsset();

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
                "Back button clicked"
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
