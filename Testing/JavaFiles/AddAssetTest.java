package com.itams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class AddAssetTest extends BaseTest {

    // ============================================================
    // CONFIGURATION
    // ============================================================

    private static final String BASE_URL =
            "http://localhost:3000";

    private static final String EMPLOYEE_ID =
            "260822002";

    private static final String PASSWORD =
            "Itams@2026a";

    private static final Duration WAIT_TIME =
            Duration.ofSeconds(15);

    // ============================================================
    // WAIT
    // ============================================================

    private WebDriverWait wait() {
        return new WebDriverWait(driver, WAIT_TIME);
    }

    // ============================================================
    // BEFORE EACH TEST
    // LOGIN AND OPEN ADD ASSET PAGE
    // ============================================================

    @BeforeEach
    public void setUpAddAssetPage() {

        driver.get(BASE_URL);

        waitForPageLoad();

        loginAsAssetManager();

        openAddAssetPage();

        waitForAddAssetPage();
    }

    // ============================================================
    // LOGIN
    // ============================================================

    private void loginAsAssetManager() {

        // --------------------------------------------------------
        // Find Login button
        // --------------------------------------------------------

        WebElement loginButton = findFirstVisible(
                By.xpath(
                        "//button[contains(normalize-space(),'Login')]"
                ),
                By.xpath(
                        "//a[contains(normalize-space(),'Login')]"
                )
        );

        if (loginButton != null) {

            safeClick(loginButton);

        }

        // --------------------------------------------------------
        // Employee ID
        // --------------------------------------------------------

        WebElement employeeId = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("employeeIdOrEmail")
                )
        );

        employeeId.clear();

        employeeId.sendKeys(EMPLOYEE_ID);

        // --------------------------------------------------------
        // Password
        // --------------------------------------------------------

        WebElement password = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("password")
                )
        );

        password.clear();

        password.sendKeys(PASSWORD);

        // --------------------------------------------------------
        // Submit
        // --------------------------------------------------------

        WebElement submit = findFirstVisible(
                By.cssSelector(
                        "form button[type='submit']"
                ),
                By.xpath(
                        "//button[contains(normalize-space(),'Login')]"
                )
        );

        assertTrue(
                submit != null,
                "Login submit button was not found"
        );

        safeClick(submit);

        handleAlertIfPresent();

        // --------------------------------------------------------
        // Wait until login completes
        // --------------------------------------------------------

        wait().until(driver ->
                !driver.findElements(
                        By.name("employeeIdOrEmail")
                ).stream().anyMatch(
                        WebElement::isDisplayed
                )
        );

        System.out.println(
                "Asset Manager login successful."
        );
    }

    // ============================================================
    // OPEN ADD ASSET PAGE
    // ============================================================

    private void openAddAssetPage() {

        // If Add Asset is already displayed, no navigation required.

        if (!driver.findElements(
                By.cssSelector(".aa-page-title")
        ).isEmpty()) {

            return;
        }

        // --------------------------------------------------------
        // Try Add Asset card/button
        // --------------------------------------------------------

        WebElement addAssetButton = findFirstVisible(
                By.xpath(
                        "//button[normalize-space()='Add Asset']"
                ),
                By.xpath(
                        "//*[contains(@class,'am-card')]"
                                + "//button[contains(normalize-space(),'Add Asset')]"
                )
        );

        assertTrue(
                addAssetButton != null,
                "Add Asset button was not found on Asset Management page"
        );

        safeClick(addAssetButton);

        waitForAddAssetPage();
    }

    // ============================================================
    // WAIT FOR ADD ASSET PAGE
    // ============================================================

    private void waitForAddAssetPage() {

        wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".aa-page-title")
                )
        );

        WebElement title = driver.findElement(
                By.cssSelector(".aa-page-title")
        );

        assertEquals(
                "Add Asset",
                title.getText().trim(),
                "Incorrect page opened"
        );
    }

    // ============================================================
    // TEST 1
    // PAGE LOAD
    // ============================================================

    @Test
    public void addAssetPageLoadTest() {

        WebElement title = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".aa-page-title")
                )
        );

        assertTrue(
                title.isDisplayed(),
                "Add Asset page title is not displayed"
        );

        assertEquals(
                "Add Asset",
                title.getText().trim()
        );

        System.out.println(
                "PASS: Add Asset page loaded successfully."
        );
    }

    // ============================================================
    // TEST 2
    // PAGE SUBTITLE
    // ============================================================

    @Test
    public void pageSubtitleTest() {

        WebElement subtitle = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".aa-page-subtitle")
                )
        );

        assertTrue(
                subtitle.isDisplayed(),
                "Page subtitle is not displayed"
        );

        assertTrue(
                subtitle.getText()
                        .toLowerCase()
                        .contains("new asset"),
                "Incorrect Add Asset subtitle"
        );

        System.out.println(
                "PASS: Add Asset subtitle displayed."
        );
    }

    // ============================================================
    // TEST 3
    // ITAMS LOGO
    // ============================================================

    @Test
    public void itamsLogoTest() {

        WebElement logo = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".aa-nav-logo-title")
                )
        );

        assertEquals(
                "ITAMS",
                logo.getText().trim()
        );

        System.out.println(
                "PASS: ITAMS logo displayed."
        );
    }

    // ============================================================
    // TEST 4
    // USERNAME
    // ============================================================

    @Test
    public void usernameDisplayTest() {

        WebElement username = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".aa-nav-username")
                )
        );

        assertTrue(
                username.isDisplayed(),
                "Username is not displayed"
        );

        assertFalse(
                username.getText().trim().isEmpty(),
                "Username is empty"
        );

        System.out.println(
                "PASS: Username displayed."
        );
    }

    // ============================================================
    // TEST 5
    // ASSET ID
    // ============================================================

    @Test
    public void assetIdAutoGenerationTest() {

        WebElement assetId = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                "input.aa-input--readonly"
                        )
                )
        );

        assertTrue(
                assetId.getAttribute("readonly") != null,
                "Asset ID should be read-only"
        );

        String value = assetId.getAttribute("value");

        assertTrue(
                value.matches(
                        "^(AST|MON|KEY|WEB|PRO|MOU|CPU|PRI)\\d{3}$"
                ),
                "Invalid automatically generated Asset ID: "
                        + value
        );

        System.out.println(
                "PASS: Asset ID generated automatically: "
                        + value
        );
    }

    // ============================================================
    // TEST 6
    // ASSET TYPE OPTIONS
    // ============================================================

    @Test
    public void assetTypeOptionsTest() {

        Select select = new Select(
                wait().until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("assetType")
                        )
                )
        );

        assertTrue(
                select.getOptions()
                        .stream()
                        .anyMatch(
                                option ->
                                        option.getText()
                                                .equals("Monitor")
                        ),
                "Monitor option not found"
        );

        assertTrue(
                select.getOptions()
                        .stream()
                        .anyMatch(
                                option ->
                                        option.getText()
                                                .equals("Keyboard")
                        ),
                "Keyboard option not found"
        );

        assertTrue(
                select.getOptions()
                        .stream()
                        .anyMatch(
                                option ->
                                        option.getText()
                                                .equals("Webcam")
                        ),
                "Webcam option not found"
        );

        assertTrue(
                select.getOptions()
                        .stream()
                        .anyMatch(
                                option ->
                                        option.getText()
                                                .equals("Projector")
                        ),
                "Projector option not found"
        );

        assertTrue(
                select.getOptions()
                        .stream()
                        .anyMatch(
                                option ->
                                        option.getText()
                                                .equals("Mouse")
                        ),
                "Mouse option not found"
        );

        assertTrue(
                select.getOptions()
                        .stream()
                        .anyMatch(
                                option ->
                                        option.getText()
                                                .equals("CPU")
                        ),
                "CPU option not found"
        );

        assertTrue(
                select.getOptions()
                        .stream()
                        .anyMatch(
                                option ->
                                        option.getText()
                                                .equals("Printer")
                        ),
                "Printer option not found"
        );

        System.out.println(
                "PASS: Asset Type options displayed."
        );
    }

    // ============================================================
    // TEST 7
    // BRAND DISABLED BEFORE ASSET TYPE
    // ============================================================

    @Test
    public void brandInitiallyDisabledTest() {

        WebElement brand = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("brand")
                )
        );

        assertTrue(
                brand.isEnabled() == false,
                "Brand should be disabled before Asset Type selection"
        );

        System.out.println(
                "PASS: Brand is disabled initially."
        );
    }

    // ============================================================
    // TEST 8
    // MODEL DISABLED BEFORE BRAND
    // ============================================================

    @Test
    public void modelInitiallyDisabledTest() {

        WebElement model = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("model")
                )
        );

        assertTrue(
                !model.isEnabled(),
                "Model should be disabled before Brand selection"
        );

        System.out.println(
                "PASS: Model is disabled initially."
        );
    }

    // ============================================================
    // TEST 9
    // SELECT ASSET TYPE
    // ============================================================

    @Test
    public void assetTypeSelectionTest() {

        Select assetType = new Select(
                wait().until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("assetType")
                        )
                )
        );

        assetType.selectByVisibleText("Monitor");

        WebElement brand = wait().until(
                ExpectedConditions.elementToBeEnabled(
                        By.name("brand")
                )
        );

        assertTrue(
                brand.isEnabled(),
                "Brand should become enabled after Asset Type selection"
        );

        System.out.println(
                "PASS: Asset Type selection works."
        );
    }

    // ============================================================
    // TEST 10
    // BRAND OPTIONS AFTER TYPE
    // ============================================================

    @Test
    public void brandOptionsTest() {

        selectAssetType("Monitor");

        Select brand = new Select(
                wait().until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("brand")
                        )
                )
        );

        assertTrue(
                brand.getOptions()
                        .stream()
                        .anyMatch(
                                option ->
                                        option.getText()
                                                .equals("Dell")
                        ),
                "Dell brand not available"
        );

        assertTrue(
                brand.getOptions()
                        .stream()
                        .anyMatch(
                                option ->
                                        option.getText()
                                                .equals("HP")
                        ),
                "HP brand not available"
        );

        assertTrue(
                brand.getOptions()
                        .stream()
                        .anyMatch(
                                option ->
                                        option.getText()
                                                .equals("LG")
                        ),
                "LG brand not available"
        );

        System.out.println(
                "PASS: Brand options displayed correctly."
        );
    }

    // ============================================================
    // TEST 11
    // MODEL OPTIONS AFTER BRAND
    // ============================================================

    @Test
    public void modelOptionsTest() {

        selectAssetType("Monitor");

        selectBrand("Dell");

        Select model = new Select(
                wait().until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("model")
                        )
                )
        );

        assertTrue(
                model.getOptions()
                        .stream()
                        .anyMatch(
                                option ->
                                        option.getText()
                                                .equals("P2422H")
                        ),
                "Dell P2422H model not available"
        );

        assertTrue(
                model.getOptions()
                        .stream()
                        .anyMatch(
                                option ->
                                        option.getText()
                                                .equals("P2425H")
                        ),
                "Dell P2425H model not available"
        );

        System.out.println(
                "PASS: Model options displayed correctly."
        );
    }

    // ============================================================
    // TEST 12
    // MODEL ENABLED AFTER BRAND
    // ============================================================

    @Test
    public void modelEnabledAfterBrandTest() {

        selectAssetType("Monitor");

        selectBrand("Dell");

        WebElement model = wait().until(
                ExpectedConditions.elementToBeEnabled(
                        By.name("model")
                )
        );

        assertTrue(
                model.isEnabled(),
                "Model should be enabled after Brand selection"
        );

        System.out.println(
                "PASS: Model enabled after Brand selection."
        );
    }

    // ============================================================
    // TEST 13
    // PURCHASE COST ACCEPTS NUMBERS
    // ============================================================

    @Test
    public void purchaseCostValidInputTest() {

        WebElement cost = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("purchaseCost")
                )
        );

        cost.sendKeys("15000.50");

        assertEquals(
                "15000.50",
                cost.getAttribute("value")
        );

        System.out.println(
                "PASS: Valid purchase cost accepted."
        );
    }

    // ============================================================
    // TEST 14
    // PURCHASE COST REJECTS INVALID CHARACTERS
    // ============================================================

    @Test
    public void purchaseCostInvalidCharactersTest() {

        WebElement cost = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("purchaseCost")
                )
        );

        cost.sendKeys("abc");

        String value =
                cost.getAttribute("value");

        assertTrue(
                value.isEmpty()
                        || value.matches("\\d*\\.?\\d*"),
                "Purchase cost accepted invalid characters"
        );

        System.out.println(
                "PASS: Invalid purchase cost characters rejected."
        );
    }

    // ============================================================
    // TEST 15
    // PURCHASE DATE FIELD
    // ============================================================

    @Test
    public void purchaseDateFieldTest() {

        WebElement purchaseDate = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("purchaseDate")
                )
        );

        assertEquals(
                "date",
                purchaseDate.getAttribute("type")
        );

        assertFalse(
                purchaseDate.getAttribute("min").isEmpty(),
                "Purchase date minimum is missing"
        );

        assertFalse(
                purchaseDate.getAttribute("max").isEmpty(),
                "Purchase date maximum is missing"
        );

        System.out.println(
                "PASS: Purchase date restrictions are present."
        );
    }

    // ============================================================
    // TEST 16
    // WARRANTY DISABLED BEFORE PURCHASE DATE
    // ============================================================

    @Test
    public void warrantyInitiallyDisabledTest() {

        WebElement warranty = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("warrantyExpiry")
                )
        );

        assertTrue(
                !warranty.isEnabled(),
                "Warranty field should be disabled before Purchase Date"
        );

        System.out.println(
                "PASS: Warranty field initially disabled."
        );
    }

    // ============================================================
    // TEST 17
    // WARRANTY ENABLED AFTER PURCHASE DATE
    // ============================================================

    @Test
    public void warrantyEnabledAfterPurchaseDateTest() {

        String purchaseDate =
                LocalDate.now()
                        .minusDays(1)
                        .format(
                                DateTimeFormatter.ISO_LOCAL_DATE
                        );

        setInputValue(
                By.name("purchaseDate"),
                purchaseDate
        );

        WebElement warranty = wait().until(
                ExpectedConditions.elementToBeEnabled(
                        By.name("warrantyExpiry")
                )
        );

        assertTrue(
                warranty.isEnabled(),
                "Warranty should be enabled after Purchase Date"
        );

        System.out.println(
                "PASS: Warranty enabled after Purchase Date."
        );
    }

    // ============================================================
    // TEST 18
    // DESCRIPTION ACCEPTS VALID TEXT
    // ============================================================

    @Test
    public void descriptionValidInputTest() {

        WebElement description = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("description")
                )
        );

        description.sendKeys(
                "Dell monitor for office employee"
        );

        assertEquals(
                "Dell monitor for office employee",
                description.getAttribute("value")
        );

        System.out.println(
                "PASS: Valid description accepted."
        );
    }

    // ============================================================
    // TEST 19
    // DESCRIPTION MINIMUM VALIDATION
    // ============================================================

    @Test
    public void descriptionMinimumValidationTest() {

        WebElement description = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("description")
                )
        );

        description.sendKeys("Monitor");

        clickAddAsset();

        WebElement error = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[contains(normalize-space(),"
                                        + "'Description must contain at least 10 characters')]"
                        )
                )
        );

        assertTrue(
                error.isDisplayed(),
                "Minimum description validation message not displayed"
        );

        System.out.println(
                "PASS: Description minimum validation works."
        );
    }

    // ============================================================
    // TEST 20
    // REQUIRED FIELD VALIDATION
    // ============================================================

    @Test
    public void requiredFieldsValidationTest() {

        clickAddAsset();

        String pageText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        assertTrue(
                pageText.contains(
                        "Please select an asset type."
                ),
                "Asset Type required validation not displayed"
        );

        assertTrue(
                pageText.contains(
                        "Please select a brand."
                ),
                "Brand required validation not displayed"
        );

        assertTrue(
                pageText.contains(
                        "Please select a model."
                ),
                "Model required validation not displayed"
        );

        assertTrue(
                pageText.contains(
                        "Purchase cost is required."
                ),
                "Purchase Cost required validation not displayed"
        );

        assertTrue(
                pageText.contains(
                        "Purchase date is required."
                ),
                "Purchase Date required validation not displayed"
        );

        assertTrue(
                pageText.contains(
                        "Warranty expiry date is required."
                ),
                "Warranty required validation not displayed"
        );

        assertTrue(
                pageText.contains(
                        "Description is required."
                ),
                "Description required validation not displayed"
        );

        System.out.println(
                "PASS: Required field validation works."
        );
    }

    // ============================================================
    // TEST 21
    // PURCHASE COST BELOW 100
    // ============================================================

    @Test
    public void purchaseCostMinimumValidationTest() {

        WebElement cost = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("purchaseCost")
                )
        );

        cost.sendKeys("99");

        clickAddAsset();

        String pageText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        assertTrue(
                pageText.contains(
                        "Purchase cost must be at least ₹100."
                ),
                "Minimum purchase cost validation not displayed"
        );

        System.out.println(
                "PASS: Purchase cost minimum validation works."
        );
    }

    // ============================================================
    // TEST 22
    // PURCHASE DATE FUTURE VALIDATION
    // ============================================================

    @Test
    public void futurePurchaseDateValidationTest() {

        String futureDate =
                LocalDate.now()
                        .plusDays(1)
                        .format(
                                DateTimeFormatter.ISO_LOCAL_DATE
                        );

        setInputValue(
                By.name("purchaseDate"),
                futureDate
        );

        clickAddAsset();

        String pageText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        assertTrue(
                pageText.contains(
                        "Purchase date cannot be a future date."
                ),
                "Future purchase date validation not displayed"
        );

        System.out.println(
                "PASS: Future purchase date validation works."
        );
    }

    // ============================================================
    // TEST 23
    // PURCHASE DATE OLDER THAN 7 DAYS
    // ============================================================

    @Test
    public void oldPurchaseDateValidationTest() {

        String oldDate =
                LocalDate.now()
                        .minusDays(8)
                        .format(
                                DateTimeFormatter.ISO_LOCAL_DATE
                        );

        setInputValue(
                By.name("purchaseDate"),
                oldDate
        );

        clickAddAsset();

        String pageText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        assertTrue(
                pageText.contains(
                        "Only purchases from the last 7 days are allowed."
                ),
                "Old purchase date validation not displayed"
        );

        System.out.println(
                "PASS: Old purchase date validation works."
        );
    }

    // ============================================================
    // TEST 24
    // WARRANTY LESS THAN 3 MONTHS
    // ============================================================

    @Test
    public void warrantyMinimumValidationTest() {

        String purchaseDate =
                LocalDate.now()
                        .minusDays(1)
                        .format(
                                DateTimeFormatter.ISO_LOCAL_DATE
                        );

        String invalidWarranty =
                LocalDate.now()
                        .plusMonths(2)
                        .format(
                                DateTimeFormatter.ISO_LOCAL_DATE
                        );

        setInputValue(
                By.name("purchaseDate"),
                purchaseDate
        );

        setInputValue(
                By.name("warrantyExpiry"),
                invalidWarranty
        );

        clickAddAsset();

        String pageText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        assertTrue(
                pageText.contains(
                        "Warranty must be at least 3 months"
                ),
                "Warranty minimum validation not displayed"
        );

        System.out.println(
                "PASS: Warranty minimum validation works."
        );
    }

    // ============================================================
    // TEST 25
    // WARRANTY MORE THAN 3 YEARS
    // ============================================================

    @Test
    public void warrantyMaximumValidationTest() {

        String purchaseDate =
                LocalDate.now()
                        .minusDays(1)
                        .format(
                                DateTimeFormatter.ISO_LOCAL_DATE
                        );

        String invalidWarranty =
                LocalDate.now()
                        .plusMonths(37)
                        .format(
                                DateTimeFormatter.ISO_LOCAL_DATE
                        );

        setInputValue(
                By.name("purchaseDate"),
                purchaseDate
        );

        setInputValue(
                By.name("warrantyExpiry"),
                invalidWarranty
        );

        clickAddAsset();

        String pageText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        assertTrue(
                pageText.contains(
                        "Warranty cannot exceed 3 years"
                ),
                "Warranty maximum validation not displayed"
        );

        System.out.println(
                "PASS: Warranty maximum validation works."
        );
    }

    // ============================================================
    // TEST 26
    // CLEAR BUTTON
    // ============================================================

    @Test
    public void clearButtonTest() {

        selectAssetType("Monitor");

        selectBrand("Dell");

        selectModel("P2422H");

        setText(
                By.name("purchaseCost"),
                "15000"
        );

        String purchaseDate =
                LocalDate.now()
                        .minusDays(1)
                        .format(
                                DateTimeFormatter.ISO_LOCAL_DATE
                        );

        setInputValue(
                By.name("purchaseDate"),
                purchaseDate
        );

        String warrantyDate =
                LocalDate.now()
                        .plusMonths(6)
                        .format(
                                DateTimeFormatter.ISO_LOCAL_DATE
                        );

        setInputValue(
                By.name("warrantyExpiry"),
                warrantyDate
        );

        setText(
                By.name("description"),
                "Dell monitor for office"
        );

        // --------------------------------------------------------
        // Click Clear
        // --------------------------------------------------------

        WebElement clearButton = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(
                                ".aa-btn-outline"
                        )
                )
        );

        safeClick(clearButton);

        // --------------------------------------------------------
        // Verify cleared
        // --------------------------------------------------------

        assertEquals(
                "",
                getValue(By.name("assetType"))
        );

        assertEquals(
                "",
                getValue(By.name("brand"))
        );

        assertEquals(
                "",
                getValue(By.name("model"))
        );

        assertEquals(
                "",
                getValue(By.name("purchaseCost"))
        );

        assertEquals(
                "",
                getValue(By.name("purchaseDate"))
        );

        assertEquals(
                "",
                getValue(By.name("warrantyExpiry"))
        );

        assertEquals(
                "",
                getValue(By.name("description"))
        );

        System.out.println(
                "PASS: Clear button resets the form."
        );
    }

    // ============================================================
    // TEST 27
    // BACK BUTTON
    // ============================================================

    @Test
    public void backButtonTest() {

        WebElement backButton = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(
                                ".aa-btn-back"
                        )
                )
        );

        assertEquals(
                "Back",
                backButton.getText().trim()
        );

        safeClick(backButton);

        wait().until(driver ->
                !driver.findElements(
                        By.cssSelector(".aa-page-title")
                ).stream().anyMatch(
                        WebElement::isDisplayed
                )
        );

        String page =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        assertTrue(
                page.contains("Asset Management")
                        || page.contains("Manage and track all IT assets"),
                "Back button did not return to Asset Management"
        );

        System.out.println(
                "PASS: Back button works."
        );
    }

    // ============================================================
    // TEST 28
    // ADD ASSET BUTTON DISPLAY
    // ============================================================

    @Test
    public void addAssetButtonTest() {

        WebElement button = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".aa-btn-primary"
                        )
                )
        );

        assertTrue(
                button.isDisplayed(),
                "Add Asset submit button is not displayed"
        );

        assertEquals(
                "Add Asset",
                button.getText().trim()
        );

        System.out.println(
                "PASS: Add Asset button displayed."
        );
    }

    // ============================================================
    // TEST 29
    // CLEAR BUTTON DISPLAY
    // ============================================================

    @Test
    public void clearButtonDisplayTest() {

        WebElement button = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".aa-btn-outline"
                        )
                )
        );

        assertTrue(
                button.isDisplayed(),
                "Clear button is not displayed"
        );

        assertEquals(
                "Clear",
                button.getText().trim()
        );

        System.out.println(
                "PASS: Clear button displayed."
        );
    }

    // ============================================================
    // TEST 30
    // DESCRIPTION MAX LENGTH
    // ============================================================

    @Test
    public void descriptionMaxLengthTest() {

        WebElement description = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("description")
                )
        );

        assertEquals(
                "500",
                description.getAttribute("maxlength")
        );

        System.out.println(
                "PASS: Description maximum length is 500."
        );
    }

    // ============================================================
    // TEST 31
    // PURCHASE COST INPUT TYPE
    // ============================================================

    @Test
    public void purchaseCostInputTest() {

        WebElement cost = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("purchaseCost")
                )
        );

        assertEquals(
                "text",
                cost.getAttribute("type")
        );

        assertEquals(
                "decimal",
                cost.getAttribute("inputmode")
        );

        System.out.println(
                "PASS: Purchase Cost input configuration correct."
        );
    }

    // ============================================================
    // TEST 32
    // COMPLETE FORM DATA ENTRY
    // ============================================================

    @Test
    public void completeFormEntryTest() {

        // --------------------------------------------------------
        // Asset Type
        // --------------------------------------------------------

        selectAssetType("Monitor");

        // --------------------------------------------------------
        // Brand
        // --------------------------------------------------------

        selectBrand("Dell");

        // --------------------------------------------------------
        // Model
        // --------------------------------------------------------

        selectModel("P2422H");

        // --------------------------------------------------------
        // Purchase Cost
        // --------------------------------------------------------

        setText(
                By.name("purchaseCost"),
                "15000"
        );

        // --------------------------------------------------------
        // Purchase Date
        // --------------------------------------------------------

        String purchaseDate =
                LocalDate.now()
                        .minusDays(1)
                        .format(
                                DateTimeFormatter.ISO_LOCAL_DATE
                        );

        setInputValue(
                By.name("purchaseDate"),
                purchaseDate
        );

        // --------------------------------------------------------
        // Warranty
        // --------------------------------------------------------

        String warranty =
                LocalDate.now()
                        .plusMonths(6)
                        .format(
                                DateTimeFormatter.ISO_LOCAL_DATE
                        );

        setInputValue(
                By.name("warrantyExpiry"),
                warranty
        );

        // --------------------------------------------------------
        // Description
        // --------------------------------------------------------

        setText(
                By.name("description"),
                "Dell monitor for office employee"
        );

        // --------------------------------------------------------
        // Verify
        // --------------------------------------------------------

        assertEquals(
                "Monitor",
                getValue(By.name("assetType"))
        );

        assertEquals(
                "Dell",
                getValue(By.name("brand"))
        );

        assertEquals(
                "P2422H",
                getValue(By.name("model"))
        );

        assertEquals(
                "15000",
                getValue(By.name("purchaseCost"))
        );

        assertEquals(
                purchaseDate,
                getValue(By.name("purchaseDate"))
        );

        assertEquals(
                warranty,
                getValue(By.name("warrantyExpiry"))
        );

        assertEquals(
                "Dell monitor for office employee",
                getValue(By.name("description"))
        );

        System.out.println(
                "PASS: Complete Add Asset form accepts valid data."
        );
    }

    // ============================================================
    // HELPER
    // SELECT ASSET TYPE
    // ============================================================

    private void selectAssetType(String type) {

        Select select = new Select(
                wait().until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("assetType")
                        )
                )
        );

        select.selectByVisibleText(type);
    }

    // ============================================================
    // HELPER
    // SELECT BRAND
    // ============================================================

    private void selectBrand(String brand) {

        Select select = new Select(
                wait().until(
                        ExpectedConditions.elementToBeEnabled(
                                By.name("brand")
                        )
                )
        );

        select.selectByVisibleText(brand);
    }

    // ============================================================
    // HELPER
    // SELECT MODEL
    // ============================================================

    private void selectModel(String model) {

        Select select = new Select(
                wait().until(
                        ExpectedConditions.elementToBeEnabled(
                                By.name("model")
                        )
                )
        );

        select.selectByVisibleText(model);
    }

    // ============================================================
    // HELPER
    // CLICK ADD ASSET
    // ============================================================

    private void clickAddAsset() {

        WebElement button = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(
                                ".aa-btn-primary"
                        )
                )
        );

        safeClick(button);
    }

    // ============================================================
    // HELPER
    // SET NORMAL TEXT
    // ============================================================

    private void setText(
            By locator,
            String value
    ) {

        WebElement element = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        locator
                )
        );

        element.clear();

        element.sendKeys(value);
    }

    // ============================================================
    // HELPER
    // SET DATE USING JAVASCRIPT
    // ============================================================

    private void setInputValue(
            By locator,
            String value
    ) {

        WebElement element = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        locator
                )
        );

        ((JavascriptExecutor) driver)
                .executeScript(
                        "arguments[0].value = arguments[1];"
                                + "arguments[0].dispatchEvent("
                                + "new Event('input',{bubbles:true})"
                                + ");"
                                + "arguments[0].dispatchEvent("
                                + "new Event('change',{bubbles:true})"
                                + ");",
                        element,
                        value
                );
    }

    // ============================================================
    // HELPER
    // GET VALUE
    // ============================================================

    private String getValue(By locator) {

        return wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        locator
                )
        ).getAttribute("value");
    }

    // ============================================================
    // HELPER
    // FIND FIRST VISIBLE
    // ============================================================

    private WebElement findFirstVisible(
            By... locators
    ) {

        for (By locator : locators) {

            try {

                for (WebElement element :
                        driver.findElements(locator)) {

                    if (element.isDisplayed()) {
                        return element;
                    }
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }

    // ============================================================
    // HELPER
    // SAFE CLICK
    // ============================================================

    private void safeClick(
            WebElement element
    ) {

        try {

            wait().until(
                    ExpectedConditions.elementToBeClickable(
                            element
                    )
            );

            scrollIntoView(element);

            element.click();

        } catch (Exception e) {

            scrollIntoView(element);

            ((JavascriptExecutor) driver)
                    .executeScript(
                            "arguments[0].click();",
                            element
                    );
        }
    }

    // ============================================================
    // HELPER
    // SCROLL
    // ============================================================

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

    // ============================================================
    // HELPER
    // PAGE LOAD
    // ============================================================

    private void waitForPageLoad() {

        wait().until(driver ->
                ((JavascriptExecutor) driver)
                        .executeScript(
                                "return document.readyState"
                        )
                        .equals("complete")
        );
    }

    // ============================================================
    // HELPER
    // ALERT
    // ============================================================

    private void handleAlertIfPresent() {

        try {

            Alert alert =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(5)
                    ).until(
                            ExpectedConditions.alertIsPresent()
                    );

            System.out.println(
                    "Alert: " + alert.getText()
            );

            alert.accept();

        } catch (Exception ignored) {
            // No alert.
        }
    }
}
