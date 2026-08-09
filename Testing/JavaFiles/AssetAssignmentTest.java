package com.test;

import java.time.Duration;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;


public class AssetAssignmentTest {

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

        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(2));

        wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        // Open application
        driver.get(BASE_URL);

        // Home page
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[normalize-space()='ITAMS']")
        ));

        // -----------------------------------------------------
        // STEP 1: Click Login
        // -----------------------------------------------------

        clickElement(
                By.xpath("//button[normalize-space()='Login']")
        );

        // -----------------------------------------------------
        // STEP 2:
        // Do NOT enter username/password
        // -----------------------------------------------------

        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//button[normalize-space()='Asset Mgmt']")
        ));

        // -----------------------------------------------------
        // STEP 3: Click Asset Mgmt
        // -----------------------------------------------------

        clickElement(
                By.xpath("//button[normalize-space()='Asset Mgmt']")
        );

        // -----------------------------------------------------
        // STEP 4: Wait for Asset Management page
        // -----------------------------------------------------

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h1[normalize-space()='Asset Management']")
        ));

        // -----------------------------------------------------
        // STEP 5: Click Asset Assignment from sidebar
        // -----------------------------------------------------

        clickElement(
                By.xpath("//aside//*[normalize-space()='Asset Assignment']")
        );

        // -----------------------------------------------------
        // STEP 6: Wait for Asset Assignment page
        // -----------------------------------------------------

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//h1[normalize-space()='Asset Assignment']")
        ));
    }


    // =========================================================
    // HELPER METHOD - SAFE CLICK
    // =========================================================

    private void clickElement(By locator) {

        WebElement element = wait.until(
                ExpectedConditions.presenceOfElementLocated(locator)
        );

        scrollToElement(element);

        try {

            wait.until(
                    ExpectedConditions.elementToBeClickable(locator)
            ).click();

        } catch (Exception e) {

            // JavaScript click fallback
            ((JavascriptExecutor) driver)
                    .executeScript("arguments[0].click();", element);
        }
    }


    // =========================================================
    // HELPER METHOD - SCROLL
    // =========================================================

    private void scrollToElement(WebElement element) {

        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].scrollIntoView({block:'center', inline:'center'});",
                element
        );
    }


    // =========================================================
    // TEST 1
    // Verify Asset Assignment page is displayed
    // =========================================================

    @Test
    public void testAssetAssignmentPageDisplayed() {

        WebElement heading = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//h1[normalize-space()='Asset Assignment']")
                )
        );

        assertTrue(
                "Asset Assignment page should be displayed",
                heading.isDisplayed()
        );

        System.out.println("TEST 1 PASSED: Asset Assignment page displayed");
    }


    // =========================================================
    // TEST 2
    // Verify sidebar
    // =========================================================

    @Test
    public void testSidebarItems() {

        assertTrue(
                driver.findElement(
                        By.xpath("//aside//*[normalize-space()='Dashboard']")
                ).isDisplayed()
        );

        assertTrue(
                driver.findElement(
                        By.xpath("//aside//*[normalize-space()='Asset Management']")
                ).isDisplayed()
        );

        assertTrue(
                driver.findElement(
                        By.xpath("//aside//*[normalize-space()='Asset Assignment']")
                ).isDisplayed()
        );

        assertTrue(
                driver.findElement(
                        By.xpath("//aside//*[normalize-space()='Request Approval']")
                ).isDisplayed()
        );

        assertTrue(
                driver.findElement(
                        By.xpath("//aside//*[normalize-space()='Maintenance']")
                ).isDisplayed()
        );

        System.out.println("TEST 2 PASSED: Sidebar items displayed");
    }


    // =========================================================
    // TEST 3
    // Verify search box and Search button
    // =========================================================

    @Test
    public void testSearchElements() {

        WebElement searchBox = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector("input.asa-input")
                )
        );

        WebElement searchButton = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//button[normalize-space()='Search']")
                )
        );

        assertTrue(
                "Search input should be displayed",
                searchBox.isDisplayed()
        );

        assertTrue(
                "Search button should be displayed",
                searchButton.isDisplayed()
        );

        System.out.println("TEST 3 PASSED: Search elements displayed");
    }


    // =========================================================
    // TEST 4
    // Empty Employee ID validation
    // =========================================================

    @Test
    public void testEmptyEmployeeIdValidation() {

        WebElement searchBox = driver.findElement(
                By.cssSelector("input.asa-input")
        );

        searchBox.clear();

        clickElement(
                By.xpath("//button[normalize-space()='Search']")
        );

        WebElement error = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//*[contains(normalize-space(),'Please enter an Employee ID to search')]"
                        )
                )
        );

        assertTrue(
                "Empty Employee ID error should be displayed",
                error.isDisplayed()
        );

        System.out.println(
                "TEST 4 PASSED: Empty Employee ID validation"
        );
    }


    // =========================================================
    // TEST 5
    // Invalid Employee ID - does not start with EMP
    // =========================================================

    @Test
    public void testInvalidEmployeeIdPrefix() {

        WebElement searchBox = driver.findElement(
                By.cssSelector("input.asa-input")
        );

        searchBox.clear();

        searchBox.sendKeys("ABC001");

        clickElement(
                By.xpath("//button[normalize-space()='Search']")
        );

        WebElement error = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//*[contains(normalize-space(),\"Employee ID must start with 'EMP'\")]"
                        )
                )
        );

        assertTrue(
                "Invalid prefix error should be displayed",
                error.isDisplayed()
        );

        System.out.println(
                "TEST 5 PASSED: Invalid Employee ID prefix"
        );
    }


    // =========================================================
    // TEST 6
    // Invalid Employee ID - spaces
    // =========================================================

    @Test
    public void testEmployeeIdWithSpaces() {

        WebElement searchBox = driver.findElement(
                By.cssSelector("input.asa-input")
        );

        searchBox.clear();

        searchBox.sendKeys("EMP 001");

        clickElement(
                By.xpath("//button[normalize-space()='Search']")
        );

        WebElement error = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//*[contains(normalize-space(),'Employee ID should not contain spaces')]"
                        )
                )
        );

        assertTrue(
                "Space validation error should be displayed",
                error.isDisplayed()
        );

        System.out.println(
                "TEST 6 PASSED: Employee ID spaces validation"
        );
    }


    // =========================================================
    // TEST 7
    // Invalid Employee ID - special characters
    // =========================================================

    @Test
    public void testEmployeeIdSpecialCharacters() {

        WebElement searchBox = driver.findElement(
                By.cssSelector("input.asa-input")
        );

        searchBox.clear();

        searchBox.sendKeys("EMP@01");

        clickElement(
                By.xpath("//button[normalize-space()='Search']")
        );

        WebElement error = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//*[contains(normalize-space(),'Employee ID should not contain special characters')]"
                        )
                )
        );

        assertTrue(
                "Special character validation error should be displayed",
                error.isDisplayed()
        );

        System.out.println(
                "TEST 7 PASSED: Employee ID special character validation"
        );
    }


    // =========================================================
    // TEST 8
    // Valid Employee ID search
    // =========================================================

    @Test
    public void testValidEmployeeIdSearch() {

        WebElement searchBox = driver.findElement(
                By.cssSelector("input.asa-input")
        );

        searchBox.clear();

        searchBox.sendKeys("EMP001");

        clickElement(
                By.xpath("//button[normalize-space()='Search']")
        );

        // Wait for Employee 1
        WebElement employee = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//td[normalize-space()='Employee 1']"
                        )
                )
        );

        assertTrue(
                "Employee 1 should be displayed",
                employee.isDisplayed()
        );

        System.out.println(
                "TEST 8 PASSED: Valid Employee ID search"
        );
    }


    // =========================================================
    // TEST 9
    // Verify pending request table
    // =========================================================

    @Test
    public void testPendingRequestTable() {

        WebElement heading = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//h2[contains(normalize-space(),'Request Approved Information')]"
                        )
                )
        );

        assertTrue(
                heading.isDisplayed()
        );

        // Verify first request
        assertTrue(
                driver.findElement(
                        By.xpath("//td[normalize-space()='AR001']")
                ).isDisplayed()
        );

        assertTrue(
                driver.findElement(
                        By.xpath("//td[normalize-space()='Employee 1']")
                ).isDisplayed()
        );

        assertTrue(
                driver.findElement(
                        By.xpath("//td[normalize-space()='Laptop']")
                ).isDisplayed()
        );

        System.out.println(
                "TEST 9 PASSED: Pending request table verified"
        );
    }


    // =========================================================
    // TEST 10
    // Verify assignment history
    // =========================================================

    @Test
    public void testAssignmentHistory() {

        WebElement heading = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//h2[contains(normalize-space(),'Assignment History')]"
                        )
                )
        );

        assertTrue(
                heading.isDisplayed()
        );

        // Verify assignment IDs
        assertTrue(
                driver.findElement(
                        By.xpath("//td[normalize-space()='ASG001']")
                ).isDisplayed()
        );

        assertTrue(
                driver.findElement(
                        By.xpath("//td[normalize-space()='ASG002']")
                ).isDisplayed()
        );

        assertTrue(
                driver.findElement(
                        By.xpath("//td[normalize-space()='ASG003']")
                ).isDisplayed()
        );

        // Verify status
        assertTrue(
                driver.findElement(
                        By.xpath("//span[normalize-space()='Assigned']")
                ).isDisplayed()
        );

        System.out.println(
                "TEST 10 PASSED: Assignment history verified"
        );
    }


    // =========================================================
    // TEST 11
    // Verify rows dropdown
    // =========================================================

    @Test
    public void testRowsDropdown() {

        WebElement rowsDropdown = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector("select.asa-rows-select")
                )
        );

        assertTrue(
                rowsDropdown.isDisplayed()
        );

        Select select = new Select(rowsDropdown);

        // Select All
        select.selectByVisibleText("All");

        assertTrue(
                "Rows dropdown should select All",
                select.getFirstSelectedOption()
                        .getText()
                        .equals("All")
        );

        System.out.println(
                "TEST 11 PASSED: Rows dropdown works"
        );
    }


    // =========================================================
    // TEST 12
    // Open Assign modal
    // =========================================================

    @Test
    public void testOpenAssignModal() {

        // Click first Assign button
        clickElement(
                By.xpath(
                    "(//button[normalize-space()='Assign'])[1]"
                )
        );

        // Wait for modal
        WebElement modalTitle = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//h2[normalize-space()='Assign Asset']"
                        )
                )
        );

        assertTrue(
                "Assign Asset modal should be displayed",
                modalTitle.isDisplayed()
        );

        // Verify request ID
        assertTrue(
                driver.findElement(
                        By.xpath(
                            "//*[normalize-space()='AR001']"
                        )
                ).isDisplayed()
        );

        System.out.println(
                "TEST 12 PASSED: Assign modal opened"
        );
    }


    // =========================================================
    // TEST 13
    // Assign modal empty Asset Name / ID validation
    // =========================================================

    @Test
    public void testAssignEmptyAssetNameValidation() {

        // Open modal
        clickElement(
                By.xpath(
                    "(//button[normalize-space()='Assign'])[1]"
                )
        );

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//h2[normalize-space()='Assign Asset']"
                        )
                )
        );

        // Find modal input
        WebElement assetInput = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector("input.asa-modal-input")
                )
        );

        assetInput.clear();

        // Click Confirm Assignment
        clickElement(
                By.xpath(
                    "//button[normalize-space()='Confirm Assignment']"
                )
        );

        // Verify error
        WebElement error = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//*[contains(normalize-space(),'Asset Name/ID is required')]"
                        )
                )
        );

        assertTrue(
                "Asset Name/ID required error should appear",
                error.isDisplayed()
        );

        System.out.println(
                "TEST 13 PASSED: Empty Asset Name/ID validation"
        );
    }


    // =========================================================
    // TEST 14
    // Invalid Asset ID validation
    // =========================================================

    @Test
    public void testInvalidAssetId() {

        // Open modal
        clickElement(
                By.xpath(
                    "(//button[normalize-space()='Assign'])[1]"
                )
        );

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//h2[normalize-space()='Assign Asset']"
                        )
                )
        );

        WebElement assetInput = driver.findElement(
                By.cssSelector("input.asa-modal-input")
        );

        assetInput.clear();

        // Invalid AST ID
        assetInput.sendKeys("AST12");

        clickElement(
                By.xpath(
                    "//button[normalize-space()='Confirm Assignment']"
                )
        );

        WebElement error = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//*[contains(normalize-space(),'Asset ID must be exactly 6 characters')]"
                        )
                )
        );

        assertTrue(
                "Invalid Asset ID error should appear",
                error.isDisplayed()
        );

        System.out.println(
                "TEST 14 PASSED: Invalid Asset ID validation"
        );
    }


    // =========================================================
    // TEST 15
    // Valid Asset assignment
    // =========================================================

    @Test
    public void testValidAssetAssignment() {

        // Open first Assign modal
        clickElement(
                By.xpath(
                    "(//button[normalize-space()='Assign'])[1]"
                )
        );

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//h2[normalize-space()='Assign Asset']"
                        )
                )
        );

        // Enter valid Asset ID
        WebElement assetInput = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector("input.asa-modal-input")
                )
        );

        assetInput.clear();

        assetInput.sendKeys("AST001");

        // Confirm assignment
        clickElement(
                By.xpath(
                    "//button[normalize-space()='Confirm Assignment']"
                )
        );

        // -----------------------------------------------------
        // JavaScript alert appears after successful assignment
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.alertIsPresent()
        );

        String alertText = driver.switchTo()
                .alert()
                .getText();

        assertTrue(
                "Success alert should contain Asset assigned successfully",
                alertText.contains("Asset assigned successfully")
        );

        System.out.println(
                "TEST 15 PASSED: Valid asset assignment"
        );

        // Accept alert
        driver.switchTo()
                .alert()
                .accept();

        // -----------------------------------------------------
        // Verify modal closed
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.xpath(
                            "//h2[normalize-space()='Assign Asset']"
                        )
                )
        );

        // -----------------------------------------------------
        // Verify AST001 appears in history
        // -----------------------------------------------------

        WebElement asset = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//td[normalize-space()='AST001']"
                        )
                )
        );

        assertTrue(
                "Assigned asset should appear in history",
                asset.isDisplayed()
        );

        System.out.println(
                "TEST 15 PASSED: Asset added to assignment history"
        );
    }


    // =========================================================
    // TEST 16
    // Cancel Assign modal
    // =========================================================

    @Test
    public void testCancelAssignModal() {

        // Open modal
        clickElement(
                By.xpath(
                    "(//button[normalize-space()='Assign'])[1]"
                )
        );

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//h2[normalize-space()='Assign Asset']"
                        )
                )
        );

        // Click Cancel
        clickElement(
                By.xpath(
                    "//button[normalize-space()='Cancel']"
                )
        );

        // Verify modal disappears
        wait.until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.xpath(
                            "//h2[normalize-space()='Assign Asset']"
                        )
                )
        );

        System.out.println(
                "TEST 16 PASSED: Cancel button works"
        );
    }


    // =========================================================
    // TEST 17
    // Verify Back button
    // =========================================================

    @Test
    public void testBackButton() {

        WebElement backButton = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//button[contains(normalize-space(),'Back')]"
                        )
                )
        );

        scrollToElement(backButton);

        clickElement(
                By.xpath(
                    "//button[contains(normalize-space(),'Back')]"
                )
        );

        // Depending on your App navigation,
        // Asset Management page should appear.

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                            "//h1[normalize-space()='Asset Management']"
                        )
                )
        );

        assertTrue(
                "Back should return to Asset Management",
                driver.findElement(
                        By.xpath(
                            "//h1[normalize-space()='Asset Management']"
                        )
                ).isDisplayed()
        );

        System.out.println(
                "TEST 17 PASSED: Back button works"
        );
    }


    // =========================================================
    // TEARDOWN
    // =========================================================

    @After
    public void tearDown() {

        if (driver != null) {

            driver.quit();
        }
    }
}
