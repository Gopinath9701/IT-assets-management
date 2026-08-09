package com.test;

import java.time.Duration;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.Keys;
import org.openqa.selenium.chrome.ChromeDriver;

import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

public class RequestApprovalTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "http://localhost:3000";

    // =========================================================
    // SETUP
    // =========================================================

    @Before
    public void setUp() {

        driver = new ChromeDriver();

        driver.manage().window().maximize();

        driver.manage().timeouts().implicitlyWait(
                Duration.ofSeconds(2)
        );

        driver.manage().timeouts().pageLoadTimeout(
                Duration.ofSeconds(30)
        );

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(15)
        );

        driver.get(BASE_URL);

        waitForPageReady();
    }

    // =========================================================
    // TEARDOWN
    // =========================================================

    @After
    public void tearDown() {

        if (driver != null) {

            try {
                acceptAlertIfPresent();
            } catch (Exception ignored) {
            }

            driver.quit();
        }
    }

    // =========================================================
    // WAIT FOR PAGE
    // =========================================================

    private void waitForPageReady() {

        wait.until(driver ->
                ((JavascriptExecutor) driver)
                        .executeScript(
                                "return document.readyState"
                        )
                        .equals("complete")
        );
    }

    // =========================================================
    // WAIT VISIBLE
    // =========================================================

    private WebElement waitForVisible(By locator) {

        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        locator
                )
        );
    }

    // =========================================================
    // WAIT CLICKABLE
    // =========================================================

    private WebElement waitForClickable(By locator) {

        return wait.until(
                ExpectedConditions.elementToBeClickable(
                        locator
                )
        );
    }

    // =========================================================
    // SCROLL
    // =========================================================

    private void scrollIntoView(WebElement element) {

        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].scrollIntoView({block:'center', inline:'center'});",
                element
        );
    }

    // =========================================================
    // SAFE CLICK
    // =========================================================

    private void safeClick(By locator) {

        WebElement element = waitForClickable(locator);

        scrollIntoView(element);

        try {

            element.click();

        } catch (Exception e) {

            ((JavascriptExecutor) driver).executeScript(
                    "arguments[0].click();",
                    element
            );
        }
    }

    // =========================================================
    // NORMAL INPUT
    // =========================================================

    private void normalType(By locator, String text) {

        WebElement element = waitForVisible(locator);

        scrollIntoView(element);

        element.click();

        element.clear();

        element.sendKeys(text);
    }

    // =========================================================
    // IMPORTANT:
    // REJECTION TEXTAREA INPUT
    //
    // DO NOT CLICK THE TEXTAREA
    // DO NOT USE element.sendKeys()
    //
    // JavaScript directly changes the React controlled value.
    // =========================================================

    private void typeRejectionReason(String text) {

        By locator = By.xpath(
                "//textarea[@placeholder='Enter reason for rejection']"
        );

        WebElement textarea = waitForVisible(locator);

        ((JavascriptExecutor) driver).executeScript(

                "arguments[0].scrollIntoView({" +
                        "block:'center'," +
                        "inline:'nearest'" +
                        "});",

                textarea
        );

        wait.until(
                ExpectedConditions.visibilityOf(textarea)
        );

        /*
         * React controlled textarea.
         *
         * We use the native textarea value setter,
         * then fire input and change events.
         */

        ((JavascriptExecutor) driver).executeScript(

                "const textarea = arguments[0];" +
                "const value = arguments[1];" +

                "const setter = Object.getOwnPropertyDescriptor(" +
                "HTMLTextAreaElement.prototype," +
                "'value').set;" +

                "setter.call(textarea, value);" +

                "textarea.dispatchEvent(" +
                "new Event('input', { bubbles: true })" +
                ");" +

                "textarea.dispatchEvent(" +
                "new Event('change', { bubbles: true })" +
                ");",

                textarea,
                text
        );

        /*
         * Small wait so React updates its state.
         */

        try {

            Thread.sleep(300);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();
        }
    }

    // =========================================================
    // ALERT HANDLING
    // =========================================================

    private void acceptAlertIfPresent() {

        try {

            WebDriverWait shortWait =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(3)
                    );

            Alert alert = shortWait.until(
                    ExpectedConditions.alertIsPresent()
            );

            System.out.println(
                    "Alert: " + alert.getText()
            );

            alert.accept();

        } catch (NoAlertPresentException ignored) {

        } catch (Exception ignored) {

        }
    }

    // =========================================================
    // OPEN REQUEST APPROVAL PAGE
    //
    // Home
    // ↓
    // Login
    // ↓
    // NO CREDENTIALS
    // ↓
    // Asset Mgmt
    // ↓
    // Asset Management
    // ↓
    // Request Approval
    // =========================================================

    private void openRequestApprovalPage() {

        // -----------------------------------------------------
        // HOME
        // -----------------------------------------------------

        waitForVisible(
                By.xpath(
                        "//button[normalize-space()='Login']"
                )
        );

        // -----------------------------------------------------
        // LOGIN
        // -----------------------------------------------------

        safeClick(
                By.xpath(
                        "//button[normalize-space()='Login']"
                )
        );

        System.out.println(
                "PASS: Login clicked"
        );

        // -----------------------------------------------------
        // DO NOT ENTER USERNAME/PASSWORD
        // -----------------------------------------------------

        System.out.println(
                "Username and password left empty"
        );

        // -----------------------------------------------------
        // ASSET MGMT
        // -----------------------------------------------------

        waitForVisible(
                By.xpath(
                        "//button[normalize-space()='Asset Mgmt']"
                )
        );

        safeClick(
                By.xpath(
                        "//button[normalize-space()='Asset Mgmt']"
                )
        );

        System.out.println(
                "PASS: Asset Mgmt clicked"
        );

        // -----------------------------------------------------
        // ASSET MANAGEMENT PAGE
        // -----------------------------------------------------

        waitForVisible(
                By.xpath(
                        "//h1[normalize-space()='Asset Management']"
                )
        );

        System.out.println(
                "PASS: Asset Management opened"
        );

        // -----------------------------------------------------
        // REQUEST APPROVAL SIDEBAR
        // -----------------------------------------------------

        safeClick(
                By.xpath(
                        "//*[normalize-space()='Request Approval']"
                )
        );

        System.out.println(
                "PASS: Request Approval clicked"
        );

        // -----------------------------------------------------
        // REQUEST APPROVAL PAGE
        // -----------------------------------------------------

        waitForVisible(
                By.xpath(
                        "//h1[normalize-space()='Request Approval']"
                )
        );

        System.out.println(
                "PASS: Request Approval page opened"
        );
    }

    // =========================================================
    // SELECT REQUEST
    // =========================================================

    private void selectRequest(String requestId) {

        By rowLocator = By.xpath(
                "//tbody/tr[td[normalize-space()='" +
                        requestId +
                        "']]"
        );

        WebElement row = waitForVisible(
                rowLocator
        );

        scrollIntoView(row);

        try {

            row.click();

        } catch (Exception e) {

            ((JavascriptExecutor) driver).executeScript(
                    "arguments[0].click();",
                    row
            );
        }

        waitForVisible(
                By.xpath(
                        "//h2[normalize-space()='Request Details']"
                )
        );
    }

    // =========================================================
    // GET STATUS
    // =========================================================

    private String getRequestStatus() {

        WebElement status = waitForVisible(
                By.xpath(
                        "//h2[normalize-space()='Request Details']" +
                        "/following::span[contains(@class,'ra-badge')][1]"
                )
        );

        return status.getText().trim();
    }

    // =========================================================
    // TEST 1
    // OPEN REQUEST APPROVAL
    // =========================================================

    @Test
    public void testNavigateToRequestApproval() {

        openRequestApprovalPage();

        WebElement heading = waitForVisible(
                By.xpath(
                        "//h1[normalize-space()='Request Approval']"
                )
        );

        Assert.assertTrue(
                heading.isDisplayed()
        );

        System.out.println(
                "RA01 PASS - Request Approval page opened"
        );
    }

    // =========================================================
    // TEST 2
    // SEARCH SECTION
    // =========================================================

    @Test
    public void testSearchSectionDisplayed() {

        openRequestApprovalPage();

        Assert.assertTrue(
                waitForVisible(
                        By.xpath(
                                "//input[@placeholder='Enter employee ID']"
                        )
                ).isDisplayed()
        );

        Assert.assertTrue(
                waitForVisible(
                        By.xpath("//select")
                ).isDisplayed()
        );

        Assert.assertTrue(
                waitForVisible(
                        By.xpath(
                                "//button[normalize-space()='Search']"
                        )
                ).isDisplayed()
        );

        System.out.println(
                "RA02 PASS - Search section displayed"
        );
    }

    // =========================================================
    // TEST 3
    // EMPTY SEARCH
    // =========================================================

    @Test
    public void testEmptySearchValidation() {

        openRequestApprovalPage();

        safeClick(
                By.xpath(
                        "//button[normalize-space()='Search']"
                )
        );

        WebElement error = waitForVisible(
                By.xpath(
                        "//*[contains(normalize-space()," +
                        "'Please enter an Employee ID or select an Asset Type to search')]"
                )
        );

        Assert.assertTrue(
                error.isDisplayed()
        );

        System.out.println(
                "RA03 PASS - Empty search validation"
        );
    }

    // =========================================================
    // TEST 4
    // INVALID EMPLOYEE ID
    // =========================================================

    @Test
    public void testInvalidEmployeeId() {

        openRequestApprovalPage();

        normalType(
                By.xpath(
                        "//input[@placeholder='Enter employee ID']"
                ),
                "ABC123"
        );

        safeClick(
                By.xpath(
                        "//button[normalize-space()='Search']"
                )
        );

        WebElement error = waitForVisible(
                By.xpath(
                        "//*[contains(normalize-space()," +
                        "\"Employee ID must start with 'EMP'\")]"
                )
        );

        Assert.assertTrue(
                error.isDisplayed()
        );

        System.out.println(
                "RA04 PASS - Invalid Employee ID"
        );
    }

    // =========================================================
    // TEST 5
    // EMPLOYEE ID SPACE
    // =========================================================

    @Test
    public void testEmployeeIdSpace() {

        openRequestApprovalPage();

        normalType(
                By.xpath(
                        "//input[@placeholder='Enter employee ID']"
                ),
                "EMP 01"
        );

        safeClick(
                By.xpath(
                        "//button[normalize-space()='Search']"
                )
        );

        WebElement error = waitForVisible(
                By.xpath(
                        "//*[contains(normalize-space()," +
                        "'Employee ID should not contain spaces')]"
                )
        );

        Assert.assertTrue(
                error.isDisplayed()
        );

        System.out.println(
                "RA05 PASS - Space validation"
        );
    }

    // =========================================================
    // TEST 6
    // VALID EMPLOYEE SEARCH
    // =========================================================

    @Test
    public void testValidEmployeeSearch() {

        openRequestApprovalPage();

        normalType(
                By.xpath(
                        "//input[@placeholder='Enter employee ID']"
                ),
                "EMP001"
        );

        safeClick(
                By.xpath(
                        "//button[normalize-space()='Search']"
                )
        );

        WebElement row = waitForVisible(
                By.xpath(
                        "//tbody/tr[td[normalize-space()='AR001']]"
                )
        );

        Assert.assertTrue(
                row.isDisplayed()
        );

        System.out.println(
                "RA06 PASS - EMP001 search"
        );
    }

    // =========================================================
    // TEST 7
    // ASSET TYPE SEARCH
    // =========================================================

    @Test
    public void testSearchByAssetType() {

        openRequestApprovalPage();

        WebElement selectElement = waitForVisible(
                By.xpath("//select")
        );

        Select select = new Select(
                selectElement
        );

        select.selectByVisibleText(
                "Laptop"
        );

        safeClick(
                By.xpath(
                        "//button[normalize-space()='Search']"
                )
        );

        WebElement laptop = waitForVisible(
                By.xpath(
                        "//tbody/tr[td[normalize-space()='Laptop']]"
                )
        );

        Assert.assertTrue(
                laptop.isDisplayed()
        );

        System.out.println(
                "RA07 PASS - Laptop search"
        );
    }

    // =========================================================
    // TEST 8
    // SELECT REQUEST
    // =========================================================

    @Test
    public void testSelectRequest() {

        openRequestApprovalPage();

        selectRequest(
                "AR001"
        );

        Assert.assertTrue(
                waitForVisible(
                        By.xpath(
                                "//h2[normalize-space()='Request Details']"
                        )
                ).isDisplayed()
        );

        Assert.assertTrue(
                waitForVisible(
                        By.xpath(
                                "//*[normalize-space()='AR001']"
                        )
                ).isDisplayed()
        );

        Assert.assertTrue(
                waitForVisible(
                        By.xpath(
                                "//*[normalize-space()='EMP001']"
                        )
                ).isDisplayed()
        );

        System.out.println(
                "RA08 PASS - Request selected"
        );
    }

    // =========================================================
    // TEST 9
    // REQUEST DETAILS
    // =========================================================

    @Test
    public void testRequestDetails() {

        openRequestApprovalPage();

        selectRequest(
                "AR001"
        );

        Assert.assertTrue(
                waitForVisible(
                        By.xpath(
                                "//*[normalize-space()='Employee 1']"
                        )
                ).isDisplayed()
        );

        Assert.assertTrue(
                waitForVisible(
                        By.xpath(
                                "//*[normalize-space()='IT']"
                        )
                ).isDisplayed()
        );

        Assert.assertTrue(
                waitForVisible(
                        By.xpath(
                                "//*[normalize-space()='Laptop']"
                        )
                ).isDisplayed()
        );

        Assert.assertTrue(
                waitForVisible(
                        By.xpath(
                                "//*[normalize-space()='Development Work']"
                        )
                ).isDisplayed()
        );

        System.out.println(
                "RA09 PASS - Request details verified"
        );
    }

    // =========================================================
    // TEST 10
    // APPROVE
    // =========================================================

    @Test
    public void testApproveRequest() {

        openRequestApprovalPage();

        selectRequest(
                "AR001"
        );

        Assert.assertEquals(
                "Pending",
                getRequestStatus()
        );

        safeClick(
                By.xpath(
                        "//button[normalize-space()='Approve']"
                )
        );

        acceptAlertIfPresent();

        Assert.assertEquals(
                "Approved",
                getRequestStatus()
        );

        System.out.println(
                "RA10 PASS - Request approved"
        );
    }

    // =========================================================
    // TEST 11
    // REJECT WITHOUT REASON
    // =========================================================

    @Test
    public void testRejectWithoutReason() {

        openRequestApprovalPage();

        selectRequest(
                "AR001"
        );

        safeClick(
                By.xpath(
                        "//button[normalize-space()='Reject']"
                )
        );

        WebElement error = waitForVisible(
                By.xpath(
                        "//*[contains(normalize-space()," +
                        "'Reason for rejection is required.')]"
                )
        );

        Assert.assertTrue(
                error.isDisplayed()
        );

        Assert.assertEquals(
                "Pending",
                getRequestStatus()
        );

        System.out.println(
                "RA11 PASS - Empty rejection validation"
        );
    }

    // =========================================================
    // TEST 12
    // SHORT REJECTION REASON
    // =========================================================

    @Test
    public void testRejectShortReason() {

        openRequestApprovalPage();

        selectRequest(
                "AR001"
        );

        /*
         * IMPORTANT:
         * This method DOES NOT click the textarea.
         */
        typeRejectionReason(
                "Bad"
        );

        safeClick(
                By.xpath(
                        "//button[normalize-space()='Reject']"
                )
        );

        WebElement error = waitForVisible(
                By.xpath(
                        "//*[contains(normalize-space()," +
                        "'Reason for rejection must be at least 5 characters long.')]"
                )
        );

        Assert.assertTrue(
                error.isDisplayed()
        );

        Assert.assertEquals(
                "Pending",
                getRequestStatus()
        );

        System.out.println(
                "RA12 PASS - Short rejection reason validation"
        );
    }

    // =========================================================
    // TEST 13
    // VALID REJECTION
    // =========================================================

    @Test
    public void testValidRejectRequest() {

        openRequestApprovalPage();

        selectRequest(
                "AR001"
        );

        /*
         * IMPORTANT:
         * JavaScript is used here instead of Selenium click/sendKeys.
         */
        typeRejectionReason(
                "Asset not required"
        );

        safeClick(
                By.xpath(
                        "//button[normalize-space()='Reject']"
                )
        );

        /*
         * RequestApproval.js shows a browser alert
         * after successful rejection.
         */
        wait.until(
                ExpectedConditions.alertIsPresent()
        );

        Alert alert = driver.switchTo().alert();

        String alertText = alert.getText();

        System.out.println(
                "Alert: " + alertText
        );

        Assert.assertTrue(
                alertText.contains(
                        "rejected"
                )
        );

        alert.accept();

        Assert.assertEquals(
                "Rejected",
                getRequestStatus()
        );

        System.out.println(
                "RA13 PASS - Request rejected"
        );
    }

    // =========================================================
    // TEST 14
    // ROWS PER PAGE
    // =========================================================

    @Test
    public void testRowsPerPage() {

        openRequestApprovalPage();

        WebElement rows = waitForVisible(
                By.xpath(
                        "//select[contains(@class,'ra-rows-select')]"
                )
        );

        Select select = new Select(
                rows
        );

        select.selectByVisibleText(
                "30"
        );

        Assert.assertEquals(
                "30",
                select.getFirstSelectedOption().getText()
        );

        System.out.println(
                "RA14 PASS - Rows per page"
        );
    }

    // =========================================================
    // TEST 15
    // SIDEBAR ACTIVE
    // =========================================================

    @Test
    public void testRequestApprovalSidebarActive() {

        openRequestApprovalPage();

        WebElement sidebar = waitForVisible(
                By.xpath(
                        "//*[normalize-space()='Request Approval']"
                )
        );

        String className =
                sidebar.getAttribute("class");

        Assert.assertTrue(
                className.contains(
                        "ra-sidebar-item--active"
                )
        );

        System.out.println(
                "RA15 PASS - Request Approval sidebar active"
        );
    }
}
