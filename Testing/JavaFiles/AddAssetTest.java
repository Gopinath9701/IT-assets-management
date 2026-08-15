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

public class AddAssetTest {

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

        System.out.println("Application opened");
    }


    // =========================================================
    // NAVIGATE TO ADD ASSET
    // Home
    //   ↓
    // Login
    //   ↓
    // Asset Mgmt
    //   ↓
    // Asset Management
    //   ↓
    // Add Asset
    // =========================================================

    private void navigateToAddAsset() {

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
        // Click Asset Mgmt
        // -----------------------------------------------------

        WebElement assetMgmtButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//button[normalize-space()='Asset Mgmt']")
                )
        );

        assetMgmtButton.click();

        System.out.println("Clicked Asset Mgmt");


        // -----------------------------------------------------
        // Verify Asset Management
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='Asset Management']"
                        )
                )
        );

        System.out.println(
                "Asset Management page opened"
        );


        // -----------------------------------------------------
        // Click Add Asset
        // -----------------------------------------------------

        WebElement addAssetButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='Add Asset']"
                        )
                )
        );

        scrollToElement(addAssetButton);

        javascriptClick(addAssetButton);

        System.out.println(
                "Clicked Add Asset"
        );


        // -----------------------------------------------------
        // Verify Add Asset page
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("assetType")
                )
        );

        System.out.println(
                "Add Asset page opened successfully"
        );
    }


    // =========================================================
    // SCROLL ELEMENT
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
    // SET HTML DATE INPUT
    // =========================================================

    private void setDate(
            WebElement element,
            String date
    ) {

        scrollToElement(element);

        /*
         * HTML input type="date" does not always accept
         * sendKeys() consistently with Selenium/Chrome.
         *
         * We use the native HTMLInputElement value setter
         * and dispatch input/change events so React receives
         * the value.
         */

        ((JavascriptExecutor) driver).executeScript(
                "const input = arguments[0];" +
                "const value = arguments[1];" +
                "const setter = Object.getOwnPropertyDescriptor(" +
                "HTMLInputElement.prototype, 'value').set;" +
                "setter.call(input, value);" +
                "input.dispatchEvent(new Event('input', { bubbles: true }));" +
                "input.dispatchEvent(new Event('change', { bubbles: true }));",
                element,
                date
        );

        /*
         * Verify the value.
         */
        String actualValue = element.getAttribute("value");

        if (!date.equals(actualValue)) {

            // Fallback
            ((JavascriptExecutor) driver).executeScript(
                    "arguments[0].value = arguments[1];" +
                    "arguments[0].dispatchEvent(" +
                    "new Event('input', {bubbles:true}));" +
                    "arguments[0].dispatchEvent(" +
                    "new Event('change', {bubbles:true}));",
                    element,
                    date
            );
        }

        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].blur();",
                element
        );
    }


    // =========================================================
    // CLICK ADD ASSET
    // =========================================================

    private void clickAddAsset() {

        WebElement addAssetButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='Add Asset']"
                        )
                )
        );

        scrollToElement(addAssetButton);

        javascriptClick(addAssetButton);

        System.out.println(
                "Clicked Add Asset"
        );
    }


    // =========================================================
    // TEST 1
    // VERIFY ADD ASSET PAGE
    // =========================================================

    @Test
    public void testAddAssetPage() {

        System.out.println(
                "========== TEST 1: Add Asset Page =========="
        );

        navigateToAddAsset();


        WebElement heading = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//h1[normalize-space()='Add Asset']"
                        )
                )
        );

        assertTrue(
                "Add Asset heading is not displayed",
                heading.isDisplayed()
        );


        System.out.println(
                "PASS: Add Asset page displayed"
        );
    }


    // =========================================================
    // TEST 2
    // VERIFY ALL FIELDS
    // =========================================================

    @Test
    public void testAllAddAssetFields() {

        System.out.println(
                "========== TEST 2: Verify Fields =========="
        );

        navigateToAddAsset();


        // Asset ID
        WebElement assetId = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.cssSelector(
                                "input.aa-input--readonly"
                        )
                )
        );

        assertTrue(
                "Asset ID is not displayed",
                assetId.isDisplayed()
        );

        assertTrue(
                "Asset ID should be readonly",
                assetId.getAttribute("readonly") != null
        );


        // Asset Type
        WebElement assetType = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("assetType")
                )
        );

        assertTrue(
                "Asset Type is not displayed",
                assetType.isDisplayed()
        );


        // Brand
        WebElement brand = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("brand")
                )
        );

        assertTrue(
                "Brand is not displayed",
                brand.isDisplayed()
        );


        // Model
        WebElement model = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("model")
                )
        );

        assertTrue(
                "Model is not displayed",
                model.isDisplayed()
        );


        // Purchase Cost
        WebElement purchaseCost = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("purchaseCost")
                )
        );

        assertTrue(
                "Purchase Cost is not displayed",
                purchaseCost.isDisplayed()
        );


        // Purchase Date
        WebElement purchaseDate = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("purchaseDate")
                )
        );

        assertTrue(
                "Purchase Date is not displayed",
                purchaseDate.isDisplayed()
        );


        // Warranty Expiry
        WebElement warrantyExpiry = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("warrantyExpiry")
                )
        );

        assertTrue(
                "Warranty Expiry is not displayed",
                warrantyExpiry.isDisplayed()
        );


        // Description
        WebElement description = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.cssSelector(
                                "textarea[name='description']"
                        )
                )
        );

        scrollToElement(description);

        assertTrue(
                "Description is not displayed",
                description.isDisplayed()
        );


        System.out.println(
                "PASS: All Add Asset fields verified"
        );
    }


    // =========================================================
    // TEST 3
    // ASSET TYPE DROPDOWN
    // =========================================================

    @Test
    public void testAssetTypeDropdown() {

        System.out.println(
                "========== TEST 3: Asset Type Dropdown =========="
        );

        navigateToAddAsset();


        WebElement assetType = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("assetType")
                )
        );


        Select select = new Select(assetType);


        assertEquals(
                "Select Asset Type",
                select.getOptions().get(0).getText()
        );

        assertEquals(
                "Monitor",
                select.getOptions().get(1).getText()
        );

        assertEquals(
                "Keyboard",
                select.getOptions().get(2).getText()
        );

        assertEquals(
                "Webcam",
                select.getOptions().get(3).getText()
        );

        assertEquals(
                "Projector",
                select.getOptions().get(4).getText()
        );

        assertEquals(
                "Mouse",
                select.getOptions().get(5).getText()
        );

        assertEquals(
                "CPU",
                select.getOptions().get(6).getText()
        );

        assertEquals(
                "Printer",
                select.getOptions().get(7).getText()
        );


        System.out.println(
                "PASS: Asset Type dropdown values are correct"
        );
    }


    // =========================================================
    // TEST 4
    // EMPTY FORM VALIDATION
    // =========================================================

    @Test
    public void testEmptyFormValidation() {

        System.out.println(
                "========== TEST 4: Empty Form Validation =========="
        );

        navigateToAddAsset();


        clickAddAsset();


        // Asset Type
        WebElement assetTypeError = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[contains(text(),'Please select an asset type.')]"
                        )
                )
        );

        assertTrue(
                assetTypeError.isDisplayed()
        );


        // Brand
        WebElement brandError = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[contains(text(),'Brand is required.')]"
                        )
                )
        );

        assertTrue(
                brandError.isDisplayed()
        );


        // Model
        WebElement modelError = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[contains(text(),'Model is required.')]"
                        )
                )
        );

        assertTrue(
                modelError.isDisplayed()
        );


        // Purchase Cost
        WebElement costError = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[contains(text(),'Purchase cost is required.')]"
                        )
                )
        );

        assertTrue(
                costError.isDisplayed()
        );


        // Purchase Date
        WebElement purchaseDateError = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[contains(text(),'Purchase date is required.')]"
                        )
                )
        );

        assertTrue(
                purchaseDateError.isDisplayed()
        );


        // Warranty
        WebElement warrantyError = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[contains(text(),'Warranty expiry date is required.')]"
                        )
                )
        );

        assertTrue(
                warrantyError.isDisplayed()
        );


        // Description
        WebElement descriptionError = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[contains(text(),'Description is required.')]"
                        )
                )
        );

        assertTrue(
                descriptionError.isDisplayed()
        );


        System.out.println(
                "PASS: Empty form validation works"
        );
    }


    // =========================================================
    // TEST 5
    // ENTER VALID ASSET DETAILS
    // =========================================================

    @Test
    public void testEnterValidAssetDetails() {

        System.out.println(
                "========== TEST 5: Valid Asset Details =========="
        );

        navigateToAddAsset();


        // Asset Type
        WebElement assetType = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("assetType")
                )
        );

        new Select(assetType)
                .selectByVisibleText("Monitor");


        // Brand
        WebElement brand = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("brand")
                )
        );

        brand.sendKeys("Dell");


        // Model
        WebElement model = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("model")
                )
        );

        model.sendKeys("U2723QE");


        // Purchase Cost
        WebElement purchaseCost = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("purchaseCost")
                )
        );

        purchaseCost.sendKeys("50000");


        // Purchase Date
        WebElement purchaseDate = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("purchaseDate")
                )
        );

        setDate(
                purchaseDate,
                "2026-08-10"
        );


        // Warranty Expiry
        WebElement warrantyExpiry = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("warrantyExpiry")
                )
        );

        setDate(
                warrantyExpiry,
                "2027-12-31"
        );


        // Description
        WebElement description = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.cssSelector(
                                "textarea[name='description']"
                        )
                )
        );

        description.sendKeys(
                "Dell monitor for office use"
        );


        // -----------------------------------------------------
        // Verify values
        // -----------------------------------------------------

        assertEquals(
                "Monitor",
                assetType.getAttribute("value")
        );

        assertEquals(
                "Dell",
                brand.getAttribute("value")
        );

        assertEquals(
                "U2723QE",
                model.getAttribute("value")
        );

        assertEquals(
                "50000",
                purchaseCost.getAttribute("value")
        );

        assertEquals(
                "2026-08-10",
                purchaseDate.getAttribute("value")
        );

        assertEquals(
                "2027-12-31",
                warrantyExpiry.getAttribute("value")
        );

        assertEquals(
                "Dell monitor for office use",
                description.getAttribute("value")
        );


        System.out.println(
                "PASS: Valid asset details entered"
        );
    }


    // =========================================================
    // TEST 6
    // BRAND VALIDATION
    // =========================================================

    @Test
    public void testBrandValidation() {

        System.out.println(
                "========== TEST 6: Brand Validation =========="
        );

        navigateToAddAsset();


        // Asset Type
        new Select(
                driver.findElement(
                        By.name("assetType")
                )
        ).selectByVisibleText("Monitor");


        // Invalid Brand
        driver.findElement(
                By.name("brand")
        ).sendKeys("A");


        // Other required fields
        driver.findElement(
                By.name("model")
        ).sendKeys("U2723QE");

        driver.findElement(
                By.name("purchaseCost")
        ).sendKeys("50000");


        setDate(
                driver.findElement(
                        By.name("purchaseDate")
                ),
                "2026-08-10"
        );

        setDate(
                driver.findElement(
                        By.name("warrantyExpiry")
                ),
                "2027-12-31"
        );


        driver.findElement(
                By.cssSelector(
                        "textarea[name='description']"
                )
        ).sendKeys(
                "Dell monitor for office use"
        );


        clickAddAsset();


        WebElement error = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[contains(text(),'Brand must contain at least 2 characters.')]"
                        )
                )
        );

        assertTrue(
                "Brand validation not displayed",
                error.isDisplayed()
        );


        System.out.println(
                "PASS: Brand validation works"
        );
    }


    // =========================================================
    // TEST 7
    // MODEL VALIDATION
    // =========================================================

    @Test
    public void testModelValidation() {

        System.out.println(
                "========== TEST 7: Model Validation =========="
        );

        navigateToAddAsset();


        // Asset Type
        new Select(
                driver.findElement(
                        By.name("assetType")
                )
        ).selectByVisibleText("Monitor");


        // Brand
        driver.findElement(
                By.name("brand")
        ).sendKeys("Dell");


        // Invalid Model
        driver.findElement(
                By.name("model")
        ).sendKeys("A");


        // Cost
        driver.findElement(
                By.name("purchaseCost")
        ).sendKeys("50000");


        // Dates
        setDate(
                driver.findElement(
                        By.name("purchaseDate")
                ),
                "2026-08-10"
        );

        setDate(
                driver.findElement(
                        By.name("warrantyExpiry")
                ),
                "2027-12-31"
        );


        // Description
        driver.findElement(
                By.cssSelector(
                        "textarea[name='description']"
                )
        ).sendKeys(
                "Dell monitor for office use"
        );


        clickAddAsset();


        WebElement error = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[contains(text(),'Model must contain at least 2 characters.')]"
                        )
                )
        );

        assertTrue(
                "Model validation not displayed",
                error.isDisplayed()
        );


        System.out.println(
                "PASS: Model validation works"
        );
    }


    // =========================================================
    // TEST 8
    // PURCHASE COST VALIDATION
    // =========================================================

    @Test
    public void testPurchaseCostValidation() {

        System.out.println(
                "========== TEST 8: Purchase Cost Validation =========="
        );

        navigateToAddAsset();


        // Asset Type
        new Select(
                driver.findElement(
                        By.name("assetType")
                )
        ).selectByVisibleText("Monitor");


        // Brand
        driver.findElement(
                By.name("brand")
        ).sendKeys("Dell");


        // Model
        driver.findElement(
                By.name("model")
        ).sendKeys("U2723QE");


        // Invalid cost
        driver.findElement(
                By.name("purchaseCost")
        ).sendKeys("0");


        // Dates
        setDate(
                driver.findElement(
                        By.name("purchaseDate")
                ),
                "2026-08-10"
        );

        setDate(
                driver.findElement(
                        By.name("warrantyExpiry")
                ),
                "2027-12-31"
        );


        // Description
        driver.findElement(
                By.cssSelector(
                        "textarea[name='description']"
                )
        ).sendKeys(
                "Dell monitor for office use"
        );


        clickAddAsset();


        WebElement error = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[contains(text(),'Purchase cost must be greater than 0.')]"
                        )
                )
        );

        assertTrue(
                "Purchase Cost validation not displayed",
                error.isDisplayed()
        );


        System.out.println(
                "PASS: Purchase Cost validation works"
        );
    }


    // =========================================================
    // TEST 9
    // PURCHASE DATE FUTURE VALIDATION
    // =========================================================

    @Test
    public void testPurchaseDateFutureValidation() {

        System.out.println(
                "========== TEST 9: Purchase Date Validation =========="
        );

        navigateToAddAsset();


        // Asset Type
        new Select(
                driver.findElement(
                        By.name("assetType")
                )
        ).selectByVisibleText("Monitor");


        // Brand
        driver.findElement(
                By.name("brand")
        ).sendKeys("Dell");


        // Model
        driver.findElement(
                By.name("model")
        ).sendKeys("U2723QE");


        // Cost
        driver.findElement(
                By.name("purchaseCost")
        ).sendKeys("50000");


        // Future Purchase Date
        setDate(
                driver.findElement(
                        By.name("purchaseDate")
                ),
                "2027-01-01"
        );


        // Valid Warranty
        setDate(
                driver.findElement(
                        By.name("warrantyExpiry")
                ),
                "2027-12-31"
        );


        // Description
        driver.findElement(
                By.cssSelector(
                        "textarea[name='description']"
                )
        ).sendKeys(
                "Dell monitor for office use"
        );


        clickAddAsset();


        WebElement error = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[contains(text(),'Purchase date cannot be a future date.')]"
                        )
                )
        );

        assertTrue(
                "Purchase Date validation not displayed",
                error.isDisplayed()
        );


        System.out.println(
                "PASS: Purchase Date validation works"
        );
    }


    // =========================================================
    // TEST 10
    // WARRANTY VALIDATION
    // =========================================================

    @Test
    public void testWarrantyValidation() {

        System.out.println(
                "========== TEST 10: Warranty Validation =========="
        );

        navigateToAddAsset();


        // Asset Type
        new Select(
                driver.findElement(
                        By.name("assetType")
                )
        ).selectByVisibleText("Monitor");


        // Brand
        driver.findElement(
                By.name("brand")
        ).sendKeys("Dell");


        // Model
        driver.findElement(
                By.name("model")
        ).sendKeys("U2723QE");


        // Cost
        driver.findElement(
                By.name("purchaseCost")
        ).sendKeys("50000");


        // Purchase Date
        setDate(
                driver.findElement(
                        By.name("purchaseDate")
                ),
                "2026-08-10"
        );


        // Warranty before purchase date
        setDate(
                driver.findElement(
                        By.name("warrantyExpiry")
                ),
                "2026-08-09"
        );


        // Description
        driver.findElement(
                By.cssSelector(
                        "textarea[name='description']"
                )
        ).sendKeys(
                "Dell monitor for office use"
        );


        clickAddAsset();


        WebElement error = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[contains(text(),'Warranty expiry must be after the purchase date.')]"
                        )
                )
        );

        assertTrue(
                "Warranty validation not displayed",
                error.isDisplayed()
        );


        System.out.println(
                "PASS: Warranty validation works"
        );
    }


    // =========================================================
    // TEST 11
    // DESCRIPTION VALIDATION
    // =========================================================

    @Test
    public void testDescriptionValidation() {

        System.out.println(
                "========== TEST 11: Description Validation =========="
        );

        navigateToAddAsset();


        // Asset Type
        new Select(
                driver.findElement(
                        By.name("assetType")
                )
        ).selectByVisibleText("Monitor");


        // Brand
        driver.findElement(
                By.name("brand")
        ).sendKeys("Dell");


        // Model
        driver.findElement(
                By.name("model")
        ).sendKeys("U2723QE");


        // Cost
        driver.findElement(
                By.name("purchaseCost")
        ).sendKeys("50000");


        // Purchase Date
        setDate(
                driver.findElement(
                        By.name("purchaseDate")
                ),
                "2026-08-10"
        );


        // Warranty
        setDate(
                driver.findElement(
                        By.name("warrantyExpiry")
                ),
                "2027-12-31"
        );


        // Invalid description
        WebElement description = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.cssSelector(
                                "textarea[name='description']"
                        )
                )
        );

        description.sendKeys("Test");


        clickAddAsset();


        WebElement error = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[contains(text(),'Description must contain at least 5 characters.')]"
                        )
                )
        );

        assertTrue(
                "Description validation not displayed",
                error.isDisplayed()
        );


        System.out.println(
                "PASS: Description validation works"
        );
    }


    // =========================================================
    // TEST 12
    // CLEAR BUTTON
    // =========================================================

    @Test
    public void testClearButton() {

        System.out.println(
                "========== TEST 12: Clear Button =========="
        );

        navigateToAddAsset();


        // Fill valid form
        fillValidForm();


        // Clear button
        WebElement clearButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='Clear']"
                        )
                )
        );

        scrollToElement(clearButton);

        javascriptClick(clearButton);

        System.out.println(
                "Clicked Clear"
        );


        // Verify fields are cleared

        assertEquals(
                "",
                driver.findElement(
                        By.name("assetType")
                ).getAttribute("value")
        );

        assertEquals(
                "",
                driver.findElement(
                        By.name("brand")
                ).getAttribute("value")
        );

        assertEquals(
                "",
                driver.findElement(
                        By.name("model")
                ).getAttribute("value")
        );

        assertEquals(
                "",
                driver.findElement(
                        By.name("purchaseCost")
                ).getAttribute("value")
        );

        assertEquals(
                "",
                driver.findElement(
                        By.name("purchaseDate")
                ).getAttribute("value")
        );

        assertEquals(
                "",
                driver.findElement(
                        By.name("warrantyExpiry")
                ).getAttribute("value")
        );

        assertEquals(
                "",
                driver.findElement(
                        By.cssSelector(
                                "textarea[name='description']"
                        )
                ).getAttribute("value")
        );


        // Asset ID reset
        assertEquals(
                "AST-000123",
                driver.findElement(
                        By.cssSelector(
                                "input.aa-input--readonly"
                        )
                ).getAttribute("value")
        );


        System.out.println(
                "PASS: Clear button works"
        );
    }


    // =========================================================
    // TEST 13
    // BACK BUTTON
    // =========================================================

    @Test
    public void testBackButton() {

        System.out.println(
                "========== TEST 13: Back Button =========="
        );

        navigateToAddAsset();


        WebElement backButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='Back']"
                        )
                )
        );

        scrollToElement(backButton);

        javascriptClick(backButton);

        System.out.println(
                "Clicked Back"
        );


        // Verify Asset Management
        WebElement heading = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='Asset Management']"
                        )
                )
        );

        assertTrue(
                "Asset Management page not displayed",
                heading.isDisplayed()
        );


        System.out.println(
                "PASS: Back button works"
        );
    }


    // =========================================================
    // FILL VALID FORM
    // =========================================================

    private void fillValidForm() {

        // Asset Type
        WebElement assetType = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.name("assetType")
                )
        );

        new Select(assetType)
                .selectByVisibleText("Monitor");


        // Brand
        driver.findElement(
                By.name("brand")
        ).sendKeys("Dell");


        // Model
        driver.findElement(
                By.name("model")
        ).sendKeys("U2723QE");


        // Purchase Cost
        driver.findElement(
                By.name("purchaseCost")
        ).sendKeys("50000");


        // Purchase Date
        setDate(
                driver.findElement(
                        By.name("purchaseDate")
                ),
                "2026-08-10"
        );


        // Warranty Expiry
        setDate(
                driver.findElement(
                        By.name("warrantyExpiry")
                ),
                "2027-12-31"
        );


        // Description
        WebElement description = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.cssSelector(
                                "textarea[name='description']"
                        )
                )
        );

        description.sendKeys(
                "Dell monitor for office use"
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
