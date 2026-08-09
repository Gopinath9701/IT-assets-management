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
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.Assert.assertTrue;

public class AddAssetTest {

    WebDriver driver;
    WebDriverWait wait;

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

        System.out.println("Application opened");
    }


    // =========================================================
    // COMMON METHOD
    // Home
    //   ↓
    // Login
    //   ↓
    // NO USERNAME / NO PASSWORD
    //   ↓
    // Asset Mgmt
    //   ↓
    // Asset Management
    //   ↓
    // Add Asset
    // =========================================================

    private void navigateToAddAsset() {

        // -----------------------------------------------------
        // STEP 1: Click Login
        // -----------------------------------------------------

        WebElement loginButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//button[normalize-space()='Login']")
                )
        );

        loginButton.click();

        System.out.println("Clicked Login");


        // -----------------------------------------------------
        // STEP 2: Verify Login Page
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath("//*[contains(normalize-space(),'Login')]")
                )
        );

        System.out.println("Login page opened");


        // -----------------------------------------------------
        // STEP 3:
        // DO NOT ENTER USERNAME
        // DO NOT ENTER PASSWORD
        // -----------------------------------------------------

        System.out.println(
                "Username and password intentionally left empty"
        );


        // -----------------------------------------------------
        // STEP 4: Click Asset Mgmt
        // -----------------------------------------------------

        WebElement assetMgmtButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//button[normalize-space()='Asset Mgmt']")
                )
        );

        assetMgmtButton.click();

        System.out.println(
                "Clicked Asset Mgmt without credentials"
        );


        // -----------------------------------------------------
        // STEP 5: Verify Asset Management Page
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='Asset Management']"
                        )
                )
        );

        System.out.println(
                "Asset Management page opened"
        );


        // -----------------------------------------------------
        // STEP 6: Find Add Asset button
        // -----------------------------------------------------

        WebElement addAssetButton = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//button[normalize-space()='Add Asset']")
                )
        );


        // -----------------------------------------------------
        // STEP 7: Scroll Add Asset button into view
        // -----------------------------------------------------

        scrollToElement(addAssetButton);


        // -----------------------------------------------------
        // STEP 8: Click Add Asset
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.elementToBeClickable(addAssetButton)
        );

        addAssetButton.click();

        System.out.println(
                "Clicked Add Asset"
        );


        // -----------------------------------------------------
        // STEP 9: Verify Add Asset page
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("assetName")
                )
        );

        System.out.println(
                "Add Asset page opened successfully"
        );
    }


    // =========================================================
    // HELPER METHOD
    // Scroll element to center of screen
    // =========================================================

    private void scrollToElement(WebElement element) {

        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].scrollIntoView({block: 'center', inline: 'center'});",
                element
        );

        // Small pause to allow browser to finish scrolling
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }


    // =========================================================
    // TEST 1
    // Asset Management should open without credentials
    // =========================================================

    @Test
    public void testAssetManagementWithoutLoginCredentials() {

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "TEST 1: Asset Management without credentials"
        );

        System.out.println(
                "=========================================="
        );


        // -----------------------------------------------------
        // Home Page
        // -----------------------------------------------------

        driver.get("http://localhost:3000");

        System.out.println("Application opened");


        // -----------------------------------------------------
        // Click Login
        // -----------------------------------------------------

        WebElement loginButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//button[normalize-space()='Login']")
                )
        );

        loginButton.click();

        System.out.println("Clicked Login");


        // -----------------------------------------------------
        // DO NOT ENTER CREDENTIALS
        // -----------------------------------------------------

        System.out.println(
                "Username and password left empty"
        );


        // -----------------------------------------------------
        // Asset Mgmt button should be visible
        // -----------------------------------------------------

        WebElement assetMgmtButton = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//button[normalize-space()='Asset Mgmt']")
                )
        );

        assertTrue(
                "Asset Mgmt button should be displayed",
                assetMgmtButton.isDisplayed()
        );

        System.out.println(
                "Asset Mgmt button is displayed"
        );


        // -----------------------------------------------------
        // Click Asset Mgmt
        // -----------------------------------------------------

        scrollToElement(assetMgmtButton);

        wait.until(
                ExpectedConditions.elementToBeClickable(assetMgmtButton)
        );

        assetMgmtButton.click();

        System.out.println(
                "Clicked Asset Mgmt without credentials"
        );


        // -----------------------------------------------------
        // Verify Asset Management page
        // -----------------------------------------------------

        WebElement heading = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='Asset Management']"
                        )
                )
        );

        assertTrue(
                "Asset Management page should be displayed",
                heading.isDisplayed()
        );

        System.out.println(
                "PASS: Asset Management opened without credentials"
        );
    }


    // =========================================================
    // TEST 2
    // Navigate to Add Asset
    // =========================================================

    @Test
    public void testNavigateToAddAsset() {

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "TEST 2: Navigate to Add Asset"
        );

        System.out.println(
                "=========================================="
        );


        navigateToAddAsset();


        // -----------------------------------------------------
        // Verify Asset Name field
        // -----------------------------------------------------

        WebElement assetName = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("assetName")
                )
        );

        assertTrue(
                "Asset Name field should be displayed",
                assetName.isDisplayed()
        );

        System.out.println(
                "PASS: Add Asset page opened"
        );
    }


    // =========================================================
    // TEST 3
    // Verify all Add Asset fields
    // =========================================================

    @Test
    public void testAddAssetFields() {

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "TEST 3: Verify Add Asset fields"
        );

        System.out.println(
                "=========================================="
        );


        navigateToAddAsset();


        // -----------------------------------------------------
        // Asset Name
        // -----------------------------------------------------

        WebElement assetName = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("assetName")
                )
        );

        assertTrue(
                "Asset Name field not displayed",
                assetName.isDisplayed()
        );

        System.out.println(
                "Found field: Asset Name"
        );


        // -----------------------------------------------------
        // Asset Type
        // -----------------------------------------------------

        WebElement assetType = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("assetType")
                )
        );

        assertTrue(
                "Asset Type field not displayed",
                assetType.isDisplayed()
        );

        System.out.println(
                "Found field: Asset Type"
        );


        // -----------------------------------------------------
        // Brand
        // -----------------------------------------------------

        WebElement brand = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("brand")
                )
        );

        assertTrue(
                "Brand field not displayed",
                brand.isDisplayed()
        );

        System.out.println(
                "Found field: Brand"
        );


        // -----------------------------------------------------
        // Warranty Expiry
        // -----------------------------------------------------

        WebElement warranty = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("warrantyExpiry")
                )
        );

        assertTrue(
                "Warranty Expiry field not displayed",
                warranty.isDisplayed()
        );

        System.out.println(
                "Found field: Warranty Expiry Date"
        );


        // -----------------------------------------------------
        // Purchase Cost
        // -----------------------------------------------------

        WebElement purchaseCost = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("purchaseCost")
                )
        );

        assertTrue(
                "Purchase Cost field not displayed",
                purchaseCost.isDisplayed()
        );

        System.out.println(
                "Found field: Purchase Cost"
        );


        System.out.println(
                "PASS: All Add Asset fields are displayed"
        );
    }


    // =========================================================
    // TEST 4
    // Empty form validation
    // =========================================================

    @Test
    public void testEmptyFormValidation() {

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "TEST 4: Empty form validation"
        );

        System.out.println(
                "=========================================="
        );


        navigateToAddAsset();


        // -----------------------------------------------------
        // Find Add Asset button
        // -----------------------------------------------------

        WebElement addAssetButton = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//button[normalize-space()='Add Asset']")
                )
        );


        // -----------------------------------------------------
        // Scroll button into view
        // -----------------------------------------------------

        scrollToElement(addAssetButton);


        // -----------------------------------------------------
        // Click Add Asset
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.elementToBeClickable(addAssetButton)
        );

        addAssetButton.click();

        System.out.println(
                "Clicked Add Asset without entering details"
        );


        // -----------------------------------------------------
        // Verify Asset Name validation
        // -----------------------------------------------------

        WebElement errorMessage = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[contains(normalize-space(),'Asset name is required')]"
                        )
                )
        );

        assertTrue(
                "Asset name validation message not displayed",
                errorMessage.isDisplayed()
        );


        System.out.println(
                "PASS: Empty form validation works"
        );
    }


    // =========================================================
    // TEST 5
    // Enter valid asset details
    // =========================================================

    @Test
    public void testEnterValidAssetDetails() {

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "TEST 5: Enter valid asset details"
        );

        System.out.println(
                "=========================================="
        );


        navigateToAddAsset();


        // -----------------------------------------------------
        // Asset Name
        // -----------------------------------------------------

        WebElement assetName = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("assetName")
                )
        );

        assetName.sendKeys("Dell Laptop");

        System.out.println(
                "Entered Asset Name: Dell Laptop"
        );


        // -----------------------------------------------------
        // Asset Type
        // -----------------------------------------------------

        WebElement assetType = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("assetType")
                )
        );

        assetType.click();

        assetType.findElement(
                By.xpath(".//option[@value='Laptop']")
        ).click();

        System.out.println(
                "Selected Asset Type: Laptop"
        );


        // -----------------------------------------------------
        // Brand
        // -----------------------------------------------------

        WebElement brand = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("brand")
                )
        );

        brand.sendKeys("Dell");

        System.out.println(
                "Entered Brand: Dell"
        );


        // -----------------------------------------------------
        // Warranty Expiry Date
        // -----------------------------------------------------

        WebElement warranty = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("warrantyExpiry")
                )
        );

        /*
         * HTML date input expects yyyy-MM-dd
         */
        warranty.sendKeys("2027-12-31");

        System.out.println(
                "Entered Warranty Expiry Date: 2027-12-31"
        );


        // -----------------------------------------------------
        // Purchase Cost
        // -----------------------------------------------------

        WebElement purchaseCost = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("purchaseCost")
                )
        );

        purchaseCost.sendKeys("50000");

        System.out.println(
                "Entered Purchase Cost: 50000"
        );


        // -----------------------------------------------------
        // Verify Asset Name
        // -----------------------------------------------------

        assertTrue(
                "Asset Name value is incorrect",
                assetName.getAttribute("value")
                        .equals("Dell Laptop")
        );


        // -----------------------------------------------------
        // Verify Asset Type
        // -----------------------------------------------------

        assertTrue(
                "Asset Type value is incorrect",
                assetType.getAttribute("value")
                        .equals("Laptop")
        );


        // -----------------------------------------------------
        // Verify Brand
        // -----------------------------------------------------

        assertTrue(
                "Brand value is incorrect",
                brand.getAttribute("value")
                        .equals("Dell")
        );


        // -----------------------------------------------------
        // Verify Purchase Cost
        // -----------------------------------------------------

        assertTrue(
                "Purchase Cost value is incorrect",
                purchaseCost.getAttribute("value")
                        .equals("50000")
        );


        System.out.println(
                "PASS: Valid asset details entered successfully"
        );
    }


    // =========================================================
    // TEST 6
    // Clear button
    // =========================================================

    @Test
    public void testClearButton() {

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "TEST 6: Clear button"
        );

        System.out.println(
                "=========================================="
        );


        navigateToAddAsset();


        // -----------------------------------------------------
        // Enter Asset Name
        // -----------------------------------------------------

        WebElement assetName = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("assetName")
                )
        );

        assetName.sendKeys("Dell Laptop");


        // -----------------------------------------------------
        // Enter Brand
        // -----------------------------------------------------

        WebElement brand = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("brand")
                )
        );

        brand.sendKeys("Dell");


        // -----------------------------------------------------
        // Find Clear button
        // -----------------------------------------------------

        WebElement clearButton = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//button[normalize-space()='Clear']")
                )
        );


        // -----------------------------------------------------
        // Scroll Clear button into view
        // -----------------------------------------------------

        scrollToElement(clearButton);


        // -----------------------------------------------------
        // Click Clear
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.elementToBeClickable(clearButton)
        );

        clearButton.click();

        System.out.println(
                "Clicked Clear"
        );


        // -----------------------------------------------------
        // Verify Asset Name cleared
        // -----------------------------------------------------

        assertTrue(
                "Asset Name was not cleared",
                assetName.getAttribute("value").isEmpty()
        );


        // -----------------------------------------------------
        // Verify Brand cleared
        // -----------------------------------------------------

        assertTrue(
                "Brand was not cleared",
                brand.getAttribute("value").isEmpty()
        );


        System.out.println(
                "PASS: Clear button works correctly"
        );
    }


    // =========================================================
    // TEST 7
    // Back button
    // =========================================================

    @Test
    public void testBackButton() {

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "TEST 7: Back button"
        );

        System.out.println(
                "=========================================="
        );


        navigateToAddAsset();


        // -----------------------------------------------------
        // Find Back button
        // -----------------------------------------------------

        WebElement backButton = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//button[contains(normalize-space(),'Back')]"
                        )
                )
        );


        // -----------------------------------------------------
        // Scroll Back button into view
        // -----------------------------------------------------

        scrollToElement(backButton);


        // -----------------------------------------------------
        // Click Back
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.elementToBeClickable(backButton)
        );

        backButton.click();

        System.out.println(
                "Clicked Back"
        );


        // -----------------------------------------------------
        // Verify Asset Management page
        // -----------------------------------------------------

        WebElement heading = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='Asset Management']"
                        )
                )
        );

        assertTrue(
                "Asset Management page was not displayed",
                heading.isDisplayed()
        );


        System.out.println(
                "PASS: Back button works correctly"
        );
    }


    // =========================================================
    // TEARDOWN
    // =========================================================

    @After
    public void tearDown() {

        if (driver != null) {

            driver.quit();

            System.out.println(
                    "Browser closed"
            );
        }
    }
}
