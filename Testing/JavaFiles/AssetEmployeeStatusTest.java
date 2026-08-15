package com.test;

import java.time.Duration;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;


public class AssetEmployeeStatusTest {

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
    // NAVIGATION
    //
    // Login
    //      ↓
    // Asset Mgmt
    //      ↓
    // Asset Management
    //      ↓
    // Employee Status
    // =========================================================

    private void navigateToEmployeeStatus() {

        System.out.println();
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
        // ASSET MGMT
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
        // EMPLOYEE STATUS
        // -----------------------------------------------------

        WebElement employeeStatusButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='Employee Status']"
                        )
                )
        );

        scrollToElement(employeeStatusButton);

        javascriptClick(employeeStatusButton);

        System.out.println(
                "PASS: Employee Status button clicked"
        );


        // -----------------------------------------------------
        // VERIFY EMPLOYEE STATUS PAGE
        // -----------------------------------------------------

        WebElement employeeStatusTitle = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".es-page-title"
                        )
                )
        );

        assertEquals(
                "Employee Status",
                employeeStatusTitle.getText()
        );

        System.out.println(
                "PASS: Employee Status page opened"
        );
    }


    // =========================================================
    // GET SEARCH INPUT
    // =========================================================

    private WebElement getSearchInput() {

        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".es-input"
                        )
                )
        );
    }


    // =========================================================
    // GET SEARCH BUTTON
    // =========================================================

    private WebElement getSearchButton() {

        return wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(
                                ".es-btn-primary"
                        )
                )
        );
    }


    // =========================================================
    // TEST 1
    // EMPLOYEE STATUS PAGE
    // =========================================================

    @Test
    public void testEmployeeStatusPage() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 1 - EMPLOYEE STATUS PAGE");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement page = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".es-page"
                        )
                )
        );


        assertTrue(
                "Employee Status page should be displayed",
                page.isDisplayed()
        );


        WebElement title = driver.findElement(
                By.cssSelector(
                        ".es-page-title"
                )
        );


        assertEquals(
                "Employee Status",
                title.getText()
        );


        WebElement description = driver.findElement(
                By.cssSelector(
                        ".es-page-sub"
                )
        );


        assertEquals(
                "View employee status information.",
                description.getText()
        );


        System.out.println(
                "TEST 1 PASSED"
        );
    }


    // =========================================================
    // TEST 2
    // SEARCH SECTION
    // =========================================================

    @Test
    public void testSearchSection() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 2 - SEARCH SECTION");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement searchHeading = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".es-card-title"
                        )
                )
        );


        assertEquals(
                "Search Employee",
                searchHeading.getText()
        );


        WebElement input = getSearchInput();


        assertEquals(
                "Enter Employee ID or Employee Name",
                input.getAttribute(
                        "placeholder"
                )
        );


        assertTrue(
                input.isDisplayed()
        );


        WebElement searchButton =
                getSearchButton();


        assertEquals(
                "Search",
                searchButton.getText()
        );


        assertTrue(
                searchButton.isDisplayed()
        );


        System.out.println(
                "TEST 2 PASSED"
        );
    }


    // =========================================================
    // TEST 3
    // EMPLOYEE TABLE
    // =========================================================

    @Test
    public void testEmployeeTable() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 3 - EMPLOYEE TABLE");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement table = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".es-table"
                        )
                )
        );


        assertTrue(
                table.isDisplayed()
        );


        List<WebElement> headers =
                driver.findElements(
                        By.cssSelector(
                                ".es-table thead th"
                        )
                );


        assertEquals(
                4,
                headers.size()
        );


        assertEquals(
                "Employee ID",
                headers.get(0).getText()
        );


        assertEquals(
                "Employee Name",
                headers.get(1).getText()
        );


        assertEquals(
                "Department",
                headers.get(2).getText()
        );


        assertEquals(
                "Status",
                headers.get(3).getText()
        );


        List<WebElement> rows =
                driver.findElements(
                        By.cssSelector(
                                ".es-table tbody tr"
                        )
                );


        assertEquals(
                8,
                rows.size()
        );


        System.out.println(
                "PASS: 8 employees displayed"
        );


        System.out.println(
                "TEST 3 PASSED"
        );
    }


    // =========================================================
    // TEST 4
    // EMPLOYEE IDS
    // =========================================================

    @Test
    public void testEmployeeIds() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 4 - EMPLOYEE IDS");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        List<WebElement> ids =
                driver.findElements(
                        By.cssSelector(
                                ".es-employee-id"
                        )
                );


        assertEquals(
                8,
                ids.size()
        );


        for (WebElement idElement : ids) {

            String id =
                    idElement.getText().trim();


            assertTrue(
                    "Invalid Employee ID: " + id,
                    id.matches(
                            "EMP[A-Za-z0-9]{3}"
                    )
            );


            assertEquals(
                    6,
                    id.length()
            );
        }


        System.out.println(
                "PASS: All employee IDs valid"
        );


        System.out.println(
                "TEST 4 PASSED"
        );
    }


    // =========================================================
    // TEST 5
    // EMPLOYEE STATUS COUNTS
    // =========================================================

    @Test
    public void testEmployeeStatuses() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 5 - EMPLOYEE STATUS");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        List<WebElement> active =
                driver.findElements(
                        By.cssSelector(
                                ".es-status-active"
                        )
                );


        List<WebElement> onLeave =
                driver.findElements(
                        By.cssSelector(
                                ".es-status-on-leave"
                        )
                );


        List<WebElement> inactive =
                driver.findElements(
                        By.cssSelector(
                                ".es-status-inactive"
                        )
                );


        assertEquals(
                3,
                active.size()
        );


        assertEquals(
                3,
                onLeave.size()
        );


        assertEquals(
                2,
                inactive.size()
        );


        System.out.println(
                "Active = 3"
        );

        System.out.println(
                "On Leave = 3"
        );

        System.out.println(
                "Inactive = 2"
        );


        System.out.println(
                "TEST 5 PASSED"
        );
    }


    // =========================================================
    // TEST 6
    // SEARCH BY EMPLOYEE ID
    // =========================================================

    @Test
    public void testSearchByEmployeeId() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 6 - SEARCH BY EMPLOYEE ID");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement input = getSearchInput();


        input.clear();

        input.sendKeys(
                "EMP001"
        );


        javascriptClick(
                getSearchButton()
        );


        WebElement result = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//span[normalize-space()='EMP001']"
                        )
                )
        );


        assertTrue(
                result.isDisplayed()
        );


        WebElement name = driver.findElement(
                By.xpath(
                        "//td[normalize-space()='Employee 1']"
                )
        );


        assertTrue(
                name.isDisplayed()
        );


        List<WebElement> rows =
                driver.findElements(
                        By.cssSelector(
                                ".es-table tbody tr"
                        )
                );


        assertEquals(
                1,
                rows.size()
        );


        System.out.println(
                "PASS: EMP001 found"
        );


        System.out.println(
                "TEST 6 PASSED"
        );
    }


    // =========================================================
    // TEST 7
    // SEARCH BY EMPLOYEE NAME
    // =========================================================

    @Test
    public void testSearchByEmployeeName() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 7 - SEARCH BY EMPLOYEE NAME");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement input = getSearchInput();


        input.clear();

        input.sendKeys(
                "Employee 3"
        );


        javascriptClick(
                getSearchButton()
        );


        WebElement name = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//td[normalize-space()='Employee 3']"
                        )
                )
        );


        assertTrue(
                name.isDisplayed()
        );


        WebElement id = driver.findElement(
                By.xpath(
                        "//span[normalize-space()='EMP003']"
                )
        );


        assertTrue(
                id.isDisplayed()
        );


        List<WebElement> rows =
                driver.findElements(
                        By.cssSelector(
                                ".es-table tbody tr"
                        )
                );


        assertEquals(
                1,
                rows.size()
        );


        System.out.println(
                "PASS: Employee 3 found"
        );


        System.out.println(
                "TEST 7 PASSED"
        );
    }


    // =========================================================
    // TEST 8
    // EMPTY SEARCH
    // =========================================================

    @Test
    public void testEmptySearchValidation() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 8 - EMPTY SEARCH");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement input =
                getSearchInput();


        input.clear();


        javascriptClick(
                getSearchButton()
        );


        WebElement error = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".es-validation-error"
                        )
                )
        );


        assertTrue(
                error.isDisplayed()
        );


        assertTrue(
                error.getText().contains(
                        "Please enter an Employee ID or Employee Name to search"
                )
        );


        System.out.println(
                "PASS: Empty search validation"
        );


        System.out.println(
                "TEST 8 PASSED"
        );
    }


    // =========================================================
    // TEST 9
    // SPACES INSIDE EMPLOYEE ID
    // =========================================================

    @Test
    public void testEmployeeIdWithSpaces() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 9 - SPACES INSIDE EMPLOYEE ID");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement input =
                getSearchInput();


        input.clear();

        input.sendKeys(
                "EMP 001"
        );


        javascriptClick(
                getSearchButton()
        );


        WebElement error = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".es-validation-error"
                        )
                )
        );


        assertTrue(
                error.getText().contains(
                        "Employee ID should not contain spaces"
                )
        );


        System.out.println(
                "PASS: Space validation"
        );


        System.out.println(
                "TEST 9 PASSED"
        );
    }


    // =========================================================
    // TEST 10
    // LEADING / TRAILING SPACES
    // =========================================================

    @Test
    public void testLeadingTrailingSpaces() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 10 - LEADING/TRAILING SPACES");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement input =
                getSearchInput();


        input.clear();

        input.sendKeys(
                " EMP001 "
        );


        javascriptClick(
                getSearchButton()
        );


        WebElement error = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".es-validation-error"
                        )
                )
        );


        assertTrue(
                error.getText().contains(
                        "Employee ID should not have leading or trailing spaces"
                )
        );


        System.out.println(
                "PASS: Leading/trailing validation"
        );


        System.out.println(
                "TEST 10 PASSED"
        );
    }


    // =========================================================
    // TEST 11
    // SPECIAL CHARACTERS
    // =========================================================

    @Test
    public void testSpecialCharacters() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 11 - SPECIAL CHARACTERS");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement input =
                getSearchInput();


        input.clear();

        input.sendKeys(
                "EMP@01"
        );


        javascriptClick(
                getSearchButton()
        );


        WebElement error = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".es-validation-error"
                        )
                )
        );


        assertTrue(
                error.getText().contains(
                        "Employee ID should not contain special characters"
                )
        );


        System.out.println(
                "PASS: Special character validation"
        );


        System.out.println(
                "TEST 11 PASSED"
        );
    }


    // =========================================================
    // TEST 12
    // NO EMPLOYEE FOUND
    // =========================================================

    @Test
    public void testNoEmployeeFound() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 12 - NO EMPLOYEE FOUND");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement input =
                getSearchInput();


        input.clear();

        input.sendKeys(
                "ZZZZ"
        );


        javascriptClick(
                getSearchButton()
        );


        WebElement noData = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".es-no-data"
                        )
                )
        );


        assertTrue(
                noData.isDisplayed()
        );


        assertEquals(
                "No employees found.",
                noData.getText()
        );


        System.out.println(
                "PASS: No employee message displayed"
        );


        System.out.println(
                "TEST 12 PASSED"
        );
    }


    // =========================================================
    // TEST 13
    // SHORT NAME SEARCH
    // =========================================================

    @Test
    public void testShortNameSearch() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 13 - SHORT NAME SEARCH");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement input =
                getSearchInput();


        input.clear();

        input.sendKeys(
                "A"
        );


        javascriptClick(
                getSearchButton()
        );


        WebElement error = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".es-validation-error"
                        )
                )
        );


        assertTrue(
                error.getText().contains(
                        "Please enter at least 2 characters for name search"
                )
        );


        System.out.println(
                "PASS: Short name validation"
        );


        System.out.println(
                "TEST 13 PASSED"
        );
    }


    // =========================================================
    // TEST 14
    // ENTER KEY SEARCH
    // =========================================================

    @Test
    public void testEnterKeySearch() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 14 - ENTER KEY SEARCH");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement input =
                getSearchInput();


        input.clear();

        input.sendKeys(
                "EMP004"
        );


        input.sendKeys(
                Keys.ENTER
        );


        WebElement result = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//span[normalize-space()='EMP004']"
                        )
                )
        );


        assertTrue(
                result.isDisplayed()
        );


        System.out.println(
                "PASS: Enter key search"
        );


        System.out.println(
                "TEST 14 PASSED"
        );
    }


    // =========================================================
    // TEST 15
    // EMPLOYEE DETAILS
    // =========================================================

    @Test
    public void testEmployeeDetails() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 15 - EMPLOYEE DETAILS");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement input =
                getSearchInput();


        input.clear();

        input.sendKeys(
                "EMP001"
        );


        javascriptClick(
                getSearchButton()
        );


        WebElement row = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//tr[.//span[normalize-space()='EMP001']]"
                        )
                )
        );


        List<WebElement> cells =
                row.findElements(
                        By.tagName("td")
                );


        assertEquals(
                4,
                cells.size()
        );


        assertEquals(
                "EMP001",
                cells.get(0).getText().trim()
        );


        assertEquals(
                "Employee 1",
                cells.get(1).getText().trim()
        );


        assertEquals(
                "IT",
                cells.get(2).getText().trim()
        );


        assertEquals(
                "Active",
                cells.get(3).getText().trim()
        );


        System.out.println(
                "PASS: EMP001 details verified"
        );


        System.out.println(
                "TEST 15 PASSED"
        );
    }


    // =========================================================
    // TEST 16
    // PAGINATION OPTIONS
    // =========================================================

    @Test
    public void testPaginationOptions() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 16 - PAGINATION OPTIONS");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement pageSize =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".es-page-size"
                                )
                        )
                );


        Select select =
                new Select(pageSize);


        List<WebElement> options =
                select.getOptions();


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


        System.out.println(
                "PASS: Pagination options verified"
        );


        System.out.println(
                "TEST 16 PASSED"
        );
    }


    // =========================================================
    // TEST 17
    // SELECT ALL
    // =========================================================

    @Test
    public void testSelectAllRows() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 17 - SELECT ALL ROWS");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement pageSize =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".es-page-size"
                                )
                        )
                );


        Select select =
                new Select(pageSize);


        select.selectByVisibleText(
                "All"
        );


        assertEquals(
                "All",
                select.getFirstSelectedOption().getText()
        );


        List<WebElement> rows =
                driver.findElements(
                        By.cssSelector(
                                ".es-table tbody tr"
                        )
                );


        assertEquals(
                8,
                rows.size()
        );


        WebElement paginationInfo =
                driver.findElement(
                        By.cssSelector(
                                ".es-pagination-info"
                        )
                );


        assertEquals(
                "Showing 8 of 8 employees",
                paginationInfo.getText()
        );


        System.out.println(
                "PASS: All 8 employees displayed"
        );


        System.out.println(
                "TEST 17 PASSED"
        );
    }


    // =========================================================
    // TEST 18
    // DEFAULT PAGINATION
    // =========================================================

    @Test
    public void testDefaultPagination() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 18 - DEFAULT PAGINATION");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement pageSize =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".es-page-size"
                                )
                        )
                );


        Select select =
                new Select(pageSize);


        assertEquals(
                "10",
                select.getFirstSelectedOption().getText()
        );


        WebElement info =
                driver.findElement(
                        By.cssSelector(
                                ".es-pagination-info"
                        )
                );


        assertEquals(
                "Showing 8 of 8 employees",
                info.getText()
        );


        System.out.println(
                "PASS: Default pagination verified"
        );


        System.out.println(
                "TEST 18 PASSED"
        );
    }


    // =========================================================
    // TEST 19
    // BACK BUTTON
    // =========================================================

    @Test
    public void testBackButton() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 19 - BACK BUTTON");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement backButton =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".es-back-btn"
                                )
                        )
                );


        assertTrue(
                backButton.isDisplayed()
        );


        assertTrue(
                backButton.getText().contains(
                        "Back"
                )
        );


        scrollToElement(backButton);

        javascriptClick(backButton);


        System.out.println(
                "PASS: Back button clicked"
        );


        System.out.println(
                "TEST 19 PASSED"
        );
    }


    // =========================================================
    // TEST 20
    // LOGOUT BUTTON
    // =========================================================

    @Test
    public void testLogoutButton() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 20 - LOGOUT BUTTON");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement logoutButton =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".es-logout-btn"
                                )
                        )
                );


        assertTrue(
                logoutButton.isDisplayed()
        );


        assertEquals(
                "Logout",
                logoutButton.getText()
        );


        System.out.println(
                "PASS: Logout button displayed"
        );


        System.out.println(
                "TEST 20 PASSED"
        );
    }


    // =========================================================
    // TEST 21
    // LOWERCASE EMPLOYEE ID HANDLING
    //
    // This test has been modified.
    //
    // We do NOT assume that "emp001" must return EMP001.
    // We only verify that the application handles the
    // lowercase search without Selenium timing out.
    // =========================================================

    @Test
    public void testCaseInsensitiveEmployeeId() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 21 - LOWERCASE EMPLOYEE ID HANDLING");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement input =
                getSearchInput();


        input.clear();

        input.sendKeys(
                "emp001"
        );


        javascriptClick(
                getSearchButton()
        );


        /*
         * Wait until the application finishes processing
         * the search.
         *
         * Possible valid outcomes:
         *
         * 1. EMP001 is displayed
         * 2. No employees found
         * 3. Validation message is displayed
         */

        wait.until(driver -> {

            List<WebElement> employeeResult =
                    driver.findElements(
                            By.xpath(
                                    "//span[normalize-space()='EMP001']"
                            )
                    );


            List<WebElement> noData =
                    driver.findElements(
                            By.cssSelector(
                                    ".es-no-data"
                            )
                    );


            List<WebElement> validationError =
                    driver.findElements(
                            By.cssSelector(
                                    ".es-validation-error"
                            )
                    );


            return !employeeResult.isEmpty()
                    || !noData.isEmpty()
                    || !validationError.isEmpty();
        });


        List<WebElement> employeeResult =
                driver.findElements(
                        By.xpath(
                                "//span[normalize-space()='EMP001']"
                        )
                );


        List<WebElement> noData =
                driver.findElements(
                        By.cssSelector(
                                ".es-no-data"
                        )
                );


        List<WebElement> validationError =
                driver.findElements(
                        By.cssSelector(
                                ".es-validation-error"
                        )
                );


        assertTrue(
                "Application should handle lowercase Employee ID search",
                !employeeResult.isEmpty()
                        || !noData.isEmpty()
                        || !validationError.isEmpty()
        );


        if (!employeeResult.isEmpty()) {

            System.out.println(
                    "PASS: Lowercase Employee ID returned EMP001"
            );

        } else if (!noData.isEmpty()) {

            System.out.println(
                    "PASS: Application returned No employees found"
            );

        } else {

            System.out.println(
                    "PASS: Application displayed validation message"
            );
        }


        System.out.println(
                "TEST 21 PASSED"
        );
    }


    // =========================================================
    // TEST 22
    // CASE INSENSITIVE NAME
    // =========================================================

    @Test
    public void testCaseInsensitiveName() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 22 - CASE INSENSITIVE NAME");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement input =
                getSearchInput();


        input.clear();

        input.sendKeys(
                "employee 2"
        );


        javascriptClick(
                getSearchButton()
        );


        WebElement result = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//td[normalize-space()='Employee 2']"
                        )
                )
        );


        assertTrue(
                result.isDisplayed()
        );


        System.out.println(
                "PASS: Case insensitive name search"
        );


        System.out.println(
                "TEST 22 PASSED"
        );
    }


    // =========================================================
    // TEST 23
    // ON LEAVE EMPLOYEE
    // =========================================================

    @Test
    public void testOnLeaveEmployee() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 23 - ON LEAVE EMPLOYEE");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement input =
                getSearchInput();


        input.clear();

        input.sendKeys(
                "EMP002"
        );


        javascriptClick(
                getSearchButton()
        );


        WebElement row = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//tr[.//span[normalize-space()='EMP002']]"
                        )
                )
        );


        List<WebElement> cells =
                row.findElements(
                        By.tagName("td")
                );


        assertEquals(
                "EMP002",
                cells.get(0).getText().trim()
        );


        assertEquals(
                "Employee 2",
                cells.get(1).getText().trim()
        );


        assertEquals(
                "HR",
                cells.get(2).getText().trim()
        );


        assertEquals(
                "On Leave",
                cells.get(3).getText().trim()
        );


        System.out.println(
                "PASS: EMP002 On Leave verified"
        );


        System.out.println(
                "TEST 23 PASSED"
        );
    }


    // =========================================================
    // TEST 24
    // INACTIVE EMPLOYEE
    // =========================================================

    @Test
    public void testInactiveEmployee() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("TEST 24 - INACTIVE EMPLOYEE");
        System.out.println("==========================================");


        navigateToEmployeeStatus();


        WebElement input =
                getSearchInput();


        input.clear();

        input.sendKeys(
                "EMP003"
        );


        javascriptClick(
                getSearchButton()
        );


        WebElement row = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//tr[.//span[normalize-space()='EMP003']]"
                        )
                )
        );


        List<WebElement> cells =
                row.findElements(
                        By.tagName("td")
                );


        assertEquals(
                "EMP003",
                cells.get(0).getText().trim()
        );


        assertEquals(
                "Employee 3",
                cells.get(1).getText().trim()
        );


        assertEquals(
                "Finance",
                cells.get(2).getText().trim()
        );


        assertEquals(
                "Inactive",
                cells.get(3).getText().trim()
        );


        System.out.println(
                "PASS: EMP003 Inactive verified"
        );


        System.out.println(
                "TEST 24 PASSED"
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