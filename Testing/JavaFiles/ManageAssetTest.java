package com.test;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class ManageAssetTest {

    private ChromeDriver driver;
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


        // =====================================================
        // FRONTEND ONLY MOCK
        // =====================================================

        String mockScript = """

        (() => {

            // =================================================
            // FAKE LOGIN TOKEN
            // =================================================

            localStorage.setItem(
                "token",
                "frontend-test-token"
            );

            localStorage.setItem(
                "user",
                JSON.stringify({
                    employee_id: "EMP001",
                    username: "Test User",
                    email: "test@gmail.com"
                })
            );


            // =================================================
            // SAVE ORIGINAL FETCH
            // =================================================

            const originalFetch = window.fetch;


            // =================================================
            // MOCK FETCH
            // =================================================

            window.fetch = async function(url, options) {

                console.log(
                    "FRONTEND MOCK FETCH:",
                    url,
                    options
                );


                // =================================================
                // GET ASSETS
                // =================================================

                if (
                    typeof url === "string" &&
                    url.includes("/api/assets") &&
                    (
                        !options ||
                        !options.method ||
                        options.method.toUpperCase() === "GET"
                    )
                ) {

                    let assets = [

                        {
                            asset_id: "AST001",
                            asset_type: "Monitor",
                            model: "Dell Monitor",
                            description: "Office monitor",
                            purchase_date: "2025-01-10",
                            warranty_expiry: "2027-01-10"
                        },

                        {
                            asset_id: "AST002",
                            asset_type: "Keyboard",
                            model: "Logitech Keyboard",
                            description: "Wireless keyboard",
                            purchase_date: "2025-02-15",
                            warranty_expiry: "2027-02-15"
                        },

                        {
                            asset_id: "AST003",
                            asset_type: "Laptop",
                            model: "HP Laptop",
                            description: "Development laptop",
                            purchase_date: "2025-03-20",
                            warranty_expiry: "2028-03-20"
                        },

                        {
                            asset_id: "AST004",
                            asset_type: "Mouse",
                            model: "Logitech Mouse",
                            description: "Wireless mouse",
                            purchase_date: "2025-04-10",
                            warranty_expiry: "2027-04-10"
                        },

                        {
                            asset_id: "AST005",
                            asset_type: "Printer",
                            model: "HP Printer",
                            description: "Office printer",
                            purchase_date: "2025-05-10",
                            warranty_expiry: "2028-05-10"
                        }

                    ];


                    // =============================================
                    // SEARCH PARAMETER SUPPORT
                    // =============================================

                    try {

                        const parsedUrl =
                            new URL(url);

                        const search =
                            parsedUrl.searchParams.get(
                                "search"
                            );

                        const type =
                            parsedUrl.searchParams.get(
                                "type"
                            );


                        if (search) {

                            assets =
                                assets.filter(
                                    asset =>
                                        asset.asset_id
                                            .toLowerCase()
                                            .includes(
                                                search.toLowerCase()
                                            )
                                );
                        }


                        if (type) {

                            assets =
                                assets.filter(
                                    asset =>
                                        asset.asset_type === type
                                );
                        }

                    } catch (e) {

                        console.log(
                            "URL parsing skipped"
                        );
                    }


                    return new Response(

                        JSON.stringify({

                            success: true,

                            assets: assets

                        }),

                        {
                            status: 200,

                            headers: {
                                "Content-Type":
                                    "application/json"
                            }
                        }

                    );
                }


                // =================================================
                // UPDATE ASSET
                // =================================================

                if (
                    typeof url === "string" &&
                    url.includes("/api/assets/") &&
                    options &&
                    options.method &&
                    options.method.toUpperCase() === "PUT"
                ) {

                    return new Response(

                        JSON.stringify({

                            success: true,

                            message:
                                "Asset updated successfully"

                        }),

                        {
                            status: 200,

                            headers: {
                                "Content-Type":
                                    "application/json"
                            }
                        }

                    );
                }


                // =================================================
                // DELETE ASSET
                // =================================================

                if (
                    typeof url === "string" &&
                    url.includes("/api/assets/") &&
                    options &&
                    options.method &&
                    options.method.toUpperCase() === "DELETE"
                ) {

                    return new Response(

                        JSON.stringify({

                            success: true,

                            message:
                                "Asset deleted successfully"

                        }),

                        {
                            status: 200,

                            headers: {
                                "Content-Type":
                                    "application/json"
                            }
                        }

                    );
                }


                // =================================================
                // OTHER REQUESTS
                // =================================================

                return originalFetch.apply(
                    this,
                    arguments
                );

            };

        })();

        """;


        // =====================================================
        // INSTALL MOCK BEFORE REACT LOADS
        // =====================================================

        Map<String, Object> params =
                new HashMap<>();

        params.put(
                "source",
                mockScript
        );


        driver.executeCdpCommand(
                "Page.addScriptToEvaluateOnNewDocument",
                params
        );


        // =====================================================
        // OPEN APPLICATION
        // =====================================================

        driver.get(URL);

        System.out.println();
        System.out.println(
                "=========================================="
        );
        System.out.println(
                "APPLICATION OPENED"
        );
        System.out.println(
                "FRONTEND ONLY TEST"
        );
        System.out.println(
                "BACKEND NOT REQUIRED"
        );
        System.out.println(
                "=========================================="
        );
    }


    // =========================================================
    // COMMON CLICK METHOD
    // =========================================================

    private void safeClick(By locator) {

        WebElement element =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                locator
                        )
                );


        ((JavascriptExecutor) driver)
                .executeScript(
                        "arguments[0].scrollIntoView({block:'center'});",
                        element
                );


        try {

            element.click();

        } catch (Exception e) {

            ((JavascriptExecutor) driver)
                    .executeScript(
                            "arguments[0].click();",
                            element
                    );
        }
    }


    // =========================================================
    // WAIT FOR ELEMENT
    // =========================================================

    private WebElement waitForVisible(
            By locator
    ) {

        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        locator
                )
        );
    }


    // =========================================================
    // PAUSE
    // =========================================================

    private void pause() {

        try {

            Thread.sleep(700);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();
        }
    }


    // =========================================================
    // HANDLE ALERT
    // =========================================================

    private void acceptAlertIfPresent() {

        try {

            WebDriverWait shortWait =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(2)
                    );

            Alert alert =
                    shortWait.until(
                            ExpectedConditions.alertIsPresent()
                    );

            System.out.println(
                    "Alert: " + alert.getText()
            );

            alert.accept();

        } catch (Exception ignored) {

        }
    }


    // =========================================================
    // NAVIGATION
    //
    // Home
    //   ↓
    // Login
    //   ↓
    // NO USERNAME
    // NO PASSWORD
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
        System.out.println(
                "STARTING NAVIGATION"
        );


        // =====================================================
        // STEP 1
        // HOME PAGE
        // =====================================================

        WebElement loginButton =
                waitForVisible(
                        By.xpath(
                                "//button[normalize-space()='Login']"
                        )
                );


        assertTrue(
                "Login button should be displayed",
                loginButton.isDisplayed()
        );


        safeClick(
                By.xpath(
                        "//button[normalize-space()='Login']"
                )
        );


        System.out.println(
                "PASS: Login button clicked"
        );


        // =====================================================
        // STEP 2
        // LOGIN PAGE
        // =====================================================

        wait.until(
                ExpectedConditions.or(

                        ExpectedConditions.visibilityOfElementLocated(
                                By.name(
                                        "employeeIdOrEmail"
                                )
                        ),

                        ExpectedConditions.visibilityOfElementLocated(
                                By.xpath(
                                        "//*[normalize-space()='Login']"
                                )
                        )

                )
        );


        System.out.println(
                "PASS: Login page opened"
        );


        // =====================================================
        // IMPORTANT
        // =====================================================
        //
        // DO NOT ENTER USERNAME
        // DO NOT ENTER PASSWORD
        //
        // Same navigation style as AddAssetTest.
        // =====================================================


        System.out.println(
                "Username and password intentionally NOT entered"
        );


        // =====================================================
        // STEP 3
        // ASSET MGMT
        // =====================================================

        safeClick(
                By.xpath(
                        "//button[normalize-space()='Asset Mgmt']"
                )
        );


        System.out.println(
                "PASS: Asset Mgmt clicked"
        );


        // =====================================================
        // STEP 4
        // ASSET MANAGEMENT PAGE
        // =====================================================

        waitForVisible(
                By.xpath(
                        "//h1[normalize-space()='Asset Management']"
                )
        );


        System.out.println(
                "PASS: Asset Management page opened"
        );


        // =====================================================
        // STEP 5
        // MANAGE ASSETS BUTTON
        // =====================================================

        safeClick(
                By.xpath(
                        "//button[normalize-space()='Manage Assets']"
                )
        );


        System.out.println(
                "PASS: Manage Assets button clicked"
        );


        // =====================================================
        // STEP 6
        // MANAGE ASSET PAGE
        // =====================================================

        waitForVisible(
                By.cssSelector(
                        ".ma-page-title"
                )
        );


        WebElement heading =
                waitForVisible(
                        By.cssSelector(
                                ".ma-page-title"
                        )
                );


        assertEquals(
                "Manage Asset",
                heading.getText().trim()
        );


        System.out.println(
                "PASS: Manage Asset page opened"
        );


        pause();
    }


    // =========================================================
    // TEST 01
    // NAVIGATION
    // =========================================================

    @Test
    public void testNavigateToManageAsset() {

        System.out.println();
        System.out.println(
                "=========================================="
        );
        System.out.println(
                "TEST 01 - NAVIGATION"
        );
        System.out.println(
                "=========================================="
        );


        navigateToManageAsset();


        WebElement heading =
                waitForVisible(
                        By.cssSelector(
                                ".ma-page-title"
                        )
                );


        assertEquals(
                "Manage Asset",
                heading.getText().trim()
        );


        System.out.println(
                "TEST 01 PASSED"
        );
    }


    // =========================================================
    // TEST 02
    // PAGE TITLE AND SUBTITLE
    // =========================================================

    @Test
    public void testPageTitleAndSubtitle() {

        navigateToManageAsset();


        WebElement title =
                waitForVisible(
                        By.cssSelector(
                                ".ma-page-title"
                        )
                );


        WebElement subtitle =
                waitForVisible(
                        By.cssSelector(
                                ".ma-page-subtitle"
                        )
                );


        assertEquals(
                "Manage Asset",
                title.getText().trim()
        );


        assertEquals(
                "Edit or delete existing IT assets in the organization.",
                subtitle.getText().trim()
        );


        System.out.println(
                "TEST 02 PASSED - Title and subtitle"
        );
    }


    // =========================================================
    // TEST 03
    // SEARCH SECTION
    // =========================================================

    @Test
    public void testSearchSection() {

        navigateToManageAsset();


        WebElement searchInput =
                waitForVisible(
                        By.xpath(
                                "//input[@placeholder='Enter Asset ID (e.g., AST001)']"
                        )
                );


        WebElement typeDropdown =
                waitForVisible(
                        By.cssSelector(
                                ".ma-search-row .ma-select"
                        )
                );


        WebElement searchButton =
                waitForVisible(
                        By.cssSelector(
                                ".ma-search-btn"
                        )
                );


        assertTrue(
                searchInput.isDisplayed()
        );


        assertTrue(
                typeDropdown.isDisplayed()
        );


        assertTrue(
                searchButton.isDisplayed()
        );


        assertEquals(
                "Search",
                searchButton.getText().trim()
        );


        System.out.println(
                "TEST 03 PASSED - Search section"
        );
    }


    // =========================================================
    // TEST 04
    // ASSET TYPE DROPDOWN
    // =========================================================

    @Test
    public void testAssetTypeDropdown() {

        navigateToManageAsset();


        Select dropdown =
                new Select(
                        waitForVisible(
                                By.cssSelector(
                                        ".ma-search-row .ma-select"
                                )
                        )
                );


        String[] expectedOptions = {

                "All Assets",
                "Monitor",
                "Keyboard",
                "Laptop",
                "Mouse",
                "Printer",
                "Desktop",
                "Webcam",
                "Scanner",
                "Projector"

        };


        assertEquals(
                expectedOptions.length,
                dropdown.getOptions().size()
        );


        for (
                int i = 0;
                i < expectedOptions.length;
                i++
        ) {

            assertEquals(
                    expectedOptions[i],
                    dropdown
                            .getOptions()
                            .get(i)
                            .getText()
                            .trim()
            );
        }


        dropdown.selectByVisibleText(
                "Monitor"
        );


        assertEquals(
                "Monitor",
                dropdown
                        .getFirstSelectedOption()
                        .getText()
                        .trim()
        );


        System.out.println(
                "TEST 04 PASSED - Asset Type dropdown"
        );
    }


    // =========================================================
    // TEST 05
    // EMPTY SEARCH VALIDATION
    // =========================================================

    @Test
    public void testEmptySearchValidation() {

        navigateToManageAsset();


        WebElement searchInput =
                waitForVisible(
                        By.xpath(
                                "//input[@placeholder='Enter Asset ID (e.g., AST001)']"
                        )
                );


        searchInput.clear();


        Select dropdown =
                new Select(
                        driver.findElement(
                                By.cssSelector(
                                        ".ma-search-row .ma-select"
                                )
                        )
                );


        dropdown.selectByVisibleText(
                "All Assets"
        );


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        WebElement error =
                waitForVisible(
                        By.xpath(
                                "//*[contains(normalize-space(),'Please enter an Asset ID or select an Asset Type to search')]"
                        )
                );


        assertTrue(
                error.isDisplayed()
        );


        System.out.println(
                "TEST 05 PASSED - Empty search validation"
        );
    }


    // =========================================================
    // TEST 06
    // LOWERCASE AST
    // =========================================================

    @Test
    public void testLowercaseAssetIdValidation() {

        navigateToManageAsset();


        WebElement searchInput =
                waitForVisible(
                        By.xpath(
                                "//input[@placeholder='Enter Asset ID (e.g., AST001)']"
                        )
                );


        searchInput.clear();

        searchInput.sendKeys(
                "ast001"
        );


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        WebElement error =
                waitForVisible(
                        By.xpath(
                                "//*[contains(normalize-space(),\"Asset ID must start with 'AST' (uppercase)\")]"
                        )
                );


        assertTrue(
                error.isDisplayed()
        );


        System.out.println(
                "TEST 06 PASSED - Lowercase validation"
        );
    }


    // =========================================================
    // TEST 07
    // SPACE VALIDATION
    // =========================================================

    @Test
    public void testAssetIdSpaceValidation() {

        navigateToManageAsset();


        WebElement searchInput =
                waitForVisible(
                        By.xpath(
                                "//input[@placeholder='Enter Asset ID (e.g., AST001)']"
                        )
                );


        searchInput.clear();

        searchInput.sendKeys(
                "AST 01"
        );


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        WebElement error =
                waitForVisible(
                        By.xpath(
                                "//*[contains(normalize-space(),'Asset ID should not contain spaces')]"
                        )
                );


        assertTrue(
                error.isDisplayed()
        );


        System.out.println(
                "TEST 07 PASSED - Space validation"
        );
    }


    // =========================================================
    // TEST 08
    // SPECIAL CHARACTER
    // =========================================================

    @Test
    public void testSpecialCharacterValidation() {

        navigateToManageAsset();


        WebElement searchInput =
                waitForVisible(
                        By.xpath(
                                "//input[@placeholder='Enter Asset ID (e.g., AST001)']"
                        )
                );


        searchInput.clear();

        searchInput.sendKeys(
                "AST@01"
        );


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        WebElement error =
                waitForVisible(
                        By.xpath(
                                "//*[contains(normalize-space(),'Asset ID should not contain special characters')]"
                        )
                );


        assertTrue(
                error.isDisplayed()
        );


        System.out.println(
                "TEST 08 PASSED - Special character validation"
        );
    }


    // =========================================================
    // TEST 09
    // LENGTH VALIDATION
    // =========================================================

    @Test
    public void testAssetIdLengthValidation() {

        navigateToManageAsset();


        WebElement searchInput =
                waitForVisible(
                        By.xpath(
                                "//input[@placeholder='Enter Asset ID (e.g., AST001)']"
                        )
                );


        searchInput.clear();

        searchInput.sendKeys(
                "AST01"
        );


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        WebElement error =
                waitForVisible(
                        By.xpath(
                                "//*[contains(normalize-space(),'Asset ID must be exactly 6 characters long')]"
                        )
                );


        assertTrue(
                error.isDisplayed()
        );


        System.out.println(
                "TEST 09 PASSED - Length validation"
        );
    }


    // =========================================================
    // TEST 10
    // VALID SEARCH
    // =========================================================

    @Test
    public void testValidAssetSearch() {

        navigateToManageAsset();


        WebElement searchInput =
                waitForVisible(
                        By.xpath(
                                "//input[@placeholder='Enter Asset ID (e.g., AST001)']"
                        )
                );


        searchInput.clear();

        searchInput.sendKeys(
                "AST001"
        );


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        pause();


        WebElement assetId =
                waitForVisible(
                        By.cssSelector(
                                ".ma-asset-id"
                        )
                );


        assertEquals(
                "AST001",
                assetId.getText().trim()
        );


        System.out.println(
                "TEST 10 PASSED - Valid search"
        );
    }


    // =========================================================
    // TEST 11
    // SEARCH BY TYPE
    // =========================================================

    @Test
    public void testSearchByAssetType() {

        navigateToManageAsset();


        Select dropdown =
                new Select(
                        waitForVisible(
                                By.cssSelector(
                                        ".ma-search-row .ma-select"
                                )
                        )
                );


        dropdown.selectByVisibleText(
                "Laptop"
        );


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        pause();


        WebElement assetId =
                waitForVisible(
                        By.cssSelector(
                                ".ma-asset-id"
                        )
                );


        assertEquals(
                "AST003",
                assetId.getText().trim()
        );


        System.out.println(
                "TEST 11 PASSED - Search by Asset Type"
        );
    }


    // =========================================================
    // TEST 12
    // ASSET TABLE
    // =========================================================

    @Test
    public void testAssetTableDisplayed() {

        navigateToManageAsset();


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        pause();


        WebElement table =
                waitForVisible(
                        By.cssSelector(
                                ".ma-table"
                        )
                );


        assertTrue(
                table.isDisplayed()
        );


        assertTrue(
                table.getText().contains(
                        "AST001"
                )
        );


        assertTrue(
                table.getText().contains(
                        "Monitor"
                )
        );


        assertTrue(
                table.getText().contains(
                        "AST002"
                )
        );


        assertTrue(
                table.getText().contains(
                        "Keyboard"
                )
        );


        System.out.println(
                "TEST 12 PASSED - Asset table"
        );
    }


    // =========================================================
    // TEST 13
    // ROWS PER PAGE
    // =========================================================

    @Test
    public void testRowsPerPage() {

        navigateToManageAsset();


        Select rowsDropdown =
                new Select(
                        waitForVisible(
                                By.cssSelector(
                                        ".ma-rows-select"
                                )
                        )
                );


        rowsDropdown.selectByVisibleText(
                "30"
        );


        assertEquals(
                "30",
                rowsDropdown
                        .getFirstSelectedOption()
                        .getText()
                        .trim()
        );


        rowsDropdown.selectByVisibleText(
                "50"
        );


        assertEquals(
                "50",
                rowsDropdown
                        .getFirstSelectedOption()
                        .getText()
                        .trim()
        );


        rowsDropdown.selectByVisibleText(
                "All"
        );


        assertEquals(
                "All",
                rowsDropdown
                        .getFirstSelectedOption()
                        .getText()
                        .trim()
        );


        System.out.println(
                "TEST 13 PASSED - Rows per page"
        );
    }


    // =========================================================
    // TEST 14
    // EDIT BUTTON
    // =========================================================

    @Test
    public void testEditButton() {

        navigateToManageAsset();


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        pause();


        WebElement editButton =
                waitForVisible(
                        By.cssSelector(
                                ".ma-btn-edit"
                        )
                );


        assertEquals(
                "Edit",
                editButton.getText().trim()
        );


        safeClick(
                By.cssSelector(
                        ".ma-btn-edit"
                )
        );


        pause();


        WebElement editTitle =
                waitForVisible(
                        By.cssSelector(
                                ".ma-edit-page-title"
                        )
                );


        assertEquals(
                "Edit Asset",
                editTitle.getText().trim()
        );


        System.out.println(
                "TEST 14 PASSED - Edit button"
        );
    }


    // =========================================================
    // TEST 15
    // EDIT PAGE FIELDS
    // =========================================================

    @Test
    public void testEditPageFields() {

        navigateToManageAsset();


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        pause();


        safeClick(
                By.cssSelector(
                        ".ma-btn-edit"
                )
        );


        pause();


        WebElement assetId =
                waitForVisible(
                        By.cssSelector(
                                ".ma-input--readonly"
                        )
                );


        assertEquals(
                "AST001",
                assetId.getAttribute(
                        "value"
                )
        );


        WebElement assetType =
                waitForVisible(
                        By.cssSelector(
                                ".ma-edit-form .ma-select"
                        )
                );


        assertTrue(
                assetType.isDisplayed()
        );


        WebElement model =
                waitForVisible(
                        By.xpath(
                                "//input[@placeholder='Enter Model']"
                        )
                );


        assertTrue(
                model.isDisplayed()
        );


        WebElement purchaseDate =
                waitForVisible(
                        By.cssSelector(
                                "input[type='date']"
                        )
                );


        assertTrue(
                purchaseDate.isDisplayed()
        );


        WebElement description =
                waitForVisible(
                        By.xpath(
                                "//textarea[@placeholder='Enter Description']"
                        )
                );


        assertTrue(
                description.isDisplayed()
        );


        System.out.println(
                "TEST 15 PASSED - Edit fields"
        );
    }


    // =========================================================
    // TEST 16
    // MODEL VALIDATION
    // =========================================================

    @Test
    public void testModelValidation() {

        navigateToManageAsset();


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        pause();


        safeClick(
                By.cssSelector(
                        ".ma-btn-edit"
                )
        );


        pause();


        WebElement model =
                waitForVisible(
                        By.xpath(
                                "//input[@placeholder='Enter Model']"
                        )
                );


        model.clear();

        model.sendKeys(
                "A"
        );


        safeClick(
                By.cssSelector(
                        ".ma-edit-save-btn"
                )
        );


        WebElement error =
                waitForVisible(
                        By.xpath(
                                "//*[contains(normalize-space(),'Model must contain at least 2 characters')]"
                        )
                );


        assertTrue(
                error.isDisplayed()
        );


        System.out.println(
                "TEST 16 PASSED - Model validation"
        );
    }


    // =========================================================
    // TEST 17
    // DESCRIPTION VALIDATION
    // =========================================================

    @Test
    public void testDescriptionValidation() {

        navigateToManageAsset();


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        pause();


        safeClick(
                By.cssSelector(
                        ".ma-btn-edit"
                )
        );


        pause();


        WebElement description =
                waitForVisible(
                        By.xpath(
                                "//textarea[@placeholder='Enter Description']"
                        )
                );


        description.clear();

        description.sendKeys(
                "Test"
        );


        safeClick(
                By.cssSelector(
                        ".ma-edit-save-btn"
                )
        );


        WebElement error =
                waitForVisible(
                        By.xpath(
                                "//*[contains(normalize-space(),'Description must contain at least 5 characters')]"
                        )
                );


        assertTrue(
                error.isDisplayed()
        );


        System.out.println(
                "TEST 17 PASSED - Description validation"
        );
    }


    // =========================================================
    // TEST 18
    // CANCEL EDIT
    // =========================================================

    @Test
    public void testCancelEdit() {

        navigateToManageAsset();


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        pause();


        safeClick(
                By.cssSelector(
                        ".ma-btn-edit"
                )
        );


        pause();


        WebElement editTitle =
                waitForVisible(
                        By.cssSelector(
                                ".ma-edit-page-title"
                        )
                );


        assertEquals(
                "Edit Asset",
                editTitle.getText().trim()
        );


        safeClick(
                By.cssSelector(
                        ".ma-edit-cancel-btn"
                )
        );


        pause();


        WebElement mainTitle =
                waitForVisible(
                        By.cssSelector(
                                ".ma-page-title"
                        )
                );


        assertEquals(
                "Manage Asset",
                mainTitle.getText().trim()
        );


        System.out.println(
                "TEST 18 PASSED - Cancel Edit"
        );
    }


    // =========================================================
    // TEST 19
    // DELETE BUTTON
    // =========================================================

    @Test
    public void testDeleteButton() {

        navigateToManageAsset();


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        pause();


        WebElement deleteButton =
                waitForVisible(
                        By.cssSelector(
                                ".ma-btn-delete"
                        )
                );


        assertEquals(
                "Delete",
                deleteButton.getText().trim()
        );


        safeClick(
                By.cssSelector(
                        ".ma-btn-delete"
                )
        );


        pause();


        WebElement modal =
                waitForVisible(
                        By.cssSelector(
                                ".ma-modal-overlay"
                        )
                );


        assertTrue(
                modal.isDisplayed()
        );


        System.out.println(
                "TEST 19 PASSED - Delete button"
        );
    }


    // =========================================================
    // TEST 20
    // DELETE MODAL
    // =========================================================

    @Test
    public void testDeleteConfirmationModal() {

        navigateToManageAsset();


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        pause();


        safeClick(
                By.cssSelector(
                        ".ma-btn-delete"
                )
        );


        pause();


        WebElement modalTitle =
                waitForVisible(
                        By.cssSelector(
                                ".ma-modal-title"
                        )
                );


        assertEquals(
                "Delete Asset",
                modalTitle.getText().trim()
        );


        WebElement message =
                waitForVisible(
                        By.cssSelector(
                                ".ma-modal-msg"
                        )
                );


        assertTrue(
                message.getText().contains(
                        "Are you sure you want"
                )
        );


        WebElement yesButton =
                waitForVisible(
                        By.cssSelector(
                                ".ma-modal-delete"
                        )
                );


        WebElement noButton =
                waitForVisible(
                        By.cssSelector(
                                ".ma-modal-cancel"
                        )
                );


        assertEquals(
                "Yes",
                yesButton.getText().trim()
        );


        assertEquals(
                "No",
                noButton.getText().trim()
        );


        System.out.println(
                "TEST 20 PASSED - Delete confirmation modal"
        );
    }


    // =========================================================
    // TEST 21
    // DELETE NO
    // =========================================================

    @Test
    public void testDeleteNoButton() {

        navigateToManageAsset();


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        pause();


        safeClick(
                By.cssSelector(
                        ".ma-btn-delete"
                )
        );


        pause();


        safeClick(
                By.cssSelector(
                        ".ma-modal-cancel"
                )
        );


        pause();


        boolean modalPresent =
                !driver.findElements(
                        By.cssSelector(
                                ".ma-modal-overlay"
                        )
                ).isEmpty();


        assertTrue(
                "Delete modal should close after clicking No",
                !modalPresent
        );


        System.out.println(
                "TEST 21 PASSED - Delete No"
        );
    }


    // =========================================================
    // TEST 22
    // BACK BUTTON
    // =========================================================

    @Test
    public void testBackButton() {

        navigateToManageAsset();


        WebElement backButton =
                waitForVisible(
                        By.cssSelector(
                                ".ma-back-btn"
                        )
                );


        assertEquals(
                "← Back",
                backButton.getText().trim()
        );


        safeClick(
                By.cssSelector(
                        ".ma-back-btn"
                )
        );


        pause();


        WebElement assetManagement =
                waitForVisible(
                        By.xpath(
                                "//h1[normalize-space()='Asset Management']"
                        )
                );


        assertTrue(
                assetManagement.isDisplayed()
        );


        System.out.println(
                "TEST 22 PASSED - Back button"
        );
    }


    // =========================================================
    // TEST 23
    // LOGOUT BUTTON
    // =========================================================

    @Test
    public void testLogoutButtonDisplayed() {

        navigateToManageAsset();


        WebElement logout =
                waitForVisible(
                        By.cssSelector(
                                ".ma-logout-btn"
                        )
                );


        assertTrue(
                logout.isDisplayed()
        );


        assertEquals(
                "Logout",
                logout.getText().trim()
        );


        System.out.println(
                "TEST 23 PASSED - Logout button"
        );
    }


    // =========================================================
    // TEST 24
    // USERNAME
    // =========================================================

    @Test
    public void testUsernameDisplayed() {

        navigateToManageAsset();


        WebElement username =
                waitForVisible(
                        By.cssSelector(
                                ".ma-nav-username"
                        )
                );


        assertTrue(
                username.isDisplayed()
        );


        System.out.println(
                "TEST 24 PASSED - Username displayed"
        );
    }


    // =========================================================
    // TEST 25
    // ASSET TYPE SEARCH
    // =========================================================

    @Test
    public void testMonitorSearch() {

        navigateToManageAsset();


        Select dropdown =
                new Select(
                        waitForVisible(
                                By.cssSelector(
                                        ".ma-search-row .ma-select"
                                )
                        )
                );


        dropdown.selectByVisibleText(
                "Monitor"
        );


        safeClick(
                By.cssSelector(
                        ".ma-search-btn"
                )
        );


        pause();


        WebElement assetId =
                waitForVisible(
                        By.cssSelector(
                                ".ma-asset-id"
                        )
                );


        assertEquals(
                "AST001",
                assetId.getText().trim()
        );


        System.out.println(
                "TEST 25 PASSED - Monitor search"
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
            System.out.println(
                    "Browser closed"
            );
        }
    }
}
