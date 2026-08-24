package com.itams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


public class DepartmentManagementTest extends BaseTest {

    private WebDriverWait wait;

    // =========================================================
    // HR LOGIN
    // =========================================================

    private static final String HR_ID =
            "260822001";

    private static final String HR_PASSWORD =
            "Itams@2026h";


    // =========================================================
    // BEFORE EACH TEST
    //
    // LOGIN AS HR
    // OPEN HR MANAGEMENT
    // OPEN DEPARTMENT MANAGEMENT
    // =========================================================

    @BeforeEach
    public void loginAsHRAndOpenDepartmentManagement() {

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(15)
        );

        driver.get(
                "http://localhost:3000"
        );


        // -----------------------------------------------------
        // WAIT FOR APPLICATION
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.tagName("body")
                )
        );


        // -----------------------------------------------------
        // CLICK LOGIN
        // -----------------------------------------------------

        WebElement loginButtonHome =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//button[contains(normalize-space(),'Login')]"
                                )
                        )
                );

        safeClick(loginButtonHome);


        // -----------------------------------------------------
        // EMPLOYEE ID
        // -----------------------------------------------------

        WebElement employeeId =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name(
                                        "employeeIdOrEmail"
                                )
                        )
                );

        employeeId.clear();

        employeeId.sendKeys(
                HR_ID
        );


        // -----------------------------------------------------
        // PASSWORD
        // -----------------------------------------------------

        WebElement password =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name(
                                        "password"
                                )
                        )
                );

        password.clear();

        password.sendKeys(
                HR_PASSWORD
        );


        // -----------------------------------------------------
        // LOGIN
        // -----------------------------------------------------

        WebElement loginButton =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//form//button[@type='submit']"
                                )
                        )
                );

        safeClick(loginButton);


        // -----------------------------------------------------
        // LOGIN SUCCESS ALERT
        // -----------------------------------------------------

        Alert alert =
                wait.until(
                        ExpectedConditions.alertIsPresent()
                );

        String alertText =
                alert.getText();

        assertEquals(
                "Login Successful",
                alertText,
                "HR login failed"
        );

        alert.accept();


        wait.until(
                ExpectedConditions.not(
                        ExpectedConditions.alertIsPresent()
                )
        );


        // -----------------------------------------------------
        // HR MANAGEMENT
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='HR Management']"
                        )
                )
        );


        // -----------------------------------------------------
        // DEPARTMENT MANAGEMENT
        // -----------------------------------------------------

        WebElement departmentButton =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                By.xpath(
                                        "//button[normalize-space()='Manage Departments']"
                                )
                        )
                );

        safeClick(departmentButton);


        // -----------------------------------------------------
        // WAIT FOR DEPARTMENT MANAGEMENT PAGE
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".dm-page-title"
                        )
                )
        );


        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".dm-input"
                        )
                )
        );

        System.out.println(
                "Department Management page opened"
        );
    }


    // =========================================================
    // TEST 1
    // PAGE TITLE
    // =========================================================

    @Test
    public void pageTitleTest() {

        WebElement title =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".dm-page-title"
                                )
                        )
                );

        assertEquals(
                "Department Management",
                title.getText()
        );

        System.out.println(
                "TEST 1 - PAGE TITLE : PASSED"
        );
    }


    // =========================================================
    // TEST 2
    // PAGE SUBTITLE
    // =========================================================

    @Test
    public void pageSubtitleTest() {

        WebElement subtitle =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".dm-page-sub"
                                )
                        )
                );

        assertEquals(
                "Manage organization departments.",
                subtitle.getText()
        );

        System.out.println(
                "TEST 2 - PAGE SUBTITLE : PASSED"
        );
    }


    // =========================================================
    // TEST 3
    // SEARCH FIELD
    // =========================================================

    @Test
    public void searchFieldTest() {

        WebElement search =
                getSearchInput();

        assertTrue(
                search.isDisplayed()
        );

        assertEquals(
                "Enter Department Name",
                search.getAttribute(
                        "placeholder"
                )
        );

        System.out.println(
                "TEST 3 - SEARCH FIELD : PASSED"
        );
    }


    // =========================================================
    // TEST 4
    // EMPTY SEARCH
    // =========================================================

    @Test
    public void emptySearchTest() {

        WebElement search =
                getSearchInput();

        search.clear();

        clickSearch();


        String error =
                getSearchError();


        assertEquals(
                "⚠️ Department Name is required for search",
                error
        );


        System.out.println(
                "TEST 4 - EMPTY SEARCH : PASSED"
        );
    }


    // =========================================================
    // TEST 5
    // SEARCH ONLY SPACES
    // =========================================================

    @Test
    public void searchOnlySpacesTest() {

        WebElement search =
                getSearchInput();

        search.clear();

        search.sendKeys(
                "   "
        );

        clickSearch();


        String error =
                getSearchError();


        assertTrue(
                error.contains(
                        "Search cannot contain only spaces"
                )
        );


        System.out.println(
                "TEST 5 - SEARCH ONLY SPACES : PASSED"
        );
    }


    // =========================================================
    // TEST 6
    // SEARCH ONE CHARACTER
    // =========================================================

    @Test
    public void searchMinimumLengthTest() {

        WebElement search =
                getSearchInput();

        search.clear();

        search.sendKeys(
                "A"
        );

        clickSearch();


        String error =
                getSearchError();


        assertTrue(
                error.contains(
                        "at least 2 characters"
                )
        );


        System.out.println(
                "TEST 6 - SEARCH MINIMUM LENGTH : PASSED"
        );
    }


    // =========================================================
    // TEST 7
    // SEARCH LEADING SPACE
    // =========================================================

    @Test
    public void searchLeadingSpaceTest() {

        WebElement search =
                getSearchInput();

        search.clear();

        search.sendKeys(
                " Information"
        );

        clickSearch();


        String error =
                getSearchError();


        assertTrue(
                error.contains(
                        "leading or trailing spaces"
                )
        );


        System.out.println(
                "TEST 7 - SEARCH LEADING SPACE : PASSED"
        );
    }


    // =========================================================
    // TEST 8
    // SEARCH TRAILING SPACE
    // =========================================================

    @Test
    public void searchTrailingSpaceTest() {

        WebElement search =
                getSearchInput();

        search.clear();

        search.sendKeys(
                "Information "
        );

        clickSearch();


        String error =
                getSearchError();


        assertTrue(
                error.contains(
                        "leading or trailing spaces"
                )
        );


        System.out.println(
                "TEST 8 - SEARCH TRAILING SPACE : PASSED"
        );
    }


    // =========================================================
    // TEST 9
    // SEARCH NUMBERS
    //
    // Numbers are rejected while typing.
    // =========================================================

    @Test
    public void searchNumbersTest() {

        WebElement search =
                getSearchInput();

        search.clear();

        search.sendKeys(
                "12345"
        );


        String value =
                search.getAttribute(
                        "value"
                );


        assertEquals(
                "",
                value,
                "Numbers should not be accepted in search field"
        );


        System.out.println(
                "TEST 9 - SEARCH NUMBERS : PASSED"
        );
    }


    // =========================================================
    // TEST 10
    // SEARCH SPECIAL CHARACTERS
    // =========================================================

    @Test
    public void searchSpecialCharactersTest() {

        WebElement search =
                getSearchInput();

        search.clear();

        search.sendKeys(
                "@#$%"
        );


        String value =
                search.getAttribute(
                        "value"
                );


        assertEquals(
                "",
                value,
                "Special characters should not be accepted"
        );


        System.out.println(
                "TEST 10 - SEARCH SPECIAL CHARACTERS : PASSED"
        );
    }


    // =========================================================
    // TEST 11
    // ENTER KEY SEARCH
    // =========================================================

    @Test
    public void searchEnterKeyTest() {

        WebElement search =
                getSearchInput();

        search.clear();

        search.sendKeys(
                "IT"
        );

        search.sendKeys(
                Keys.ENTER
        );


        /*
         * Wait for search request/UI update.
         */

        wait.until(
                driver ->
                        !driver.findElements(
                                By.cssSelector(
                                        ".dm-table"
                                )
                        ).isEmpty()
        );


        assertTrue(
                driver.findElement(
                        By.cssSelector(
                                ".dm-table"
                        )
                ).isDisplayed()
        );


        System.out.println(
                "TEST 11 - ENTER KEY SEARCH : PASSED"
        );
    }


    // =========================================================
    // TEST 12
    // SEARCH MULTIPLE SPACES
    //
    // Source code explicitly allows multiple spaces
    // in search.
    // =========================================================

    @Test
    public void searchMultipleSpacesAllowedTest() {

        WebElement search =
                getSearchInput();

        search.clear();

        search.sendKeys(
                "Information  Technology"
        );


        String value =
                search.getAttribute(
                        "value"
                );


        assertEquals(
                "Information  Technology",
                value
        );


        System.out.println(
                "TEST 12 - MULTIPLE SEARCH SPACES : PASSED"
        );
    }


    // =========================================================
    // TEST 13
    // DEPARTMENT NAME EMPTY
    // =========================================================

    @Test
    public void emptyDepartmentNameTest() {

        WebElement name =
                getDepartmentName();

        name.clear();

        fillHead(
                "Test Manager"
        );

        fillEmployeeCount(
                "10"
        );

        clickAdd();


        String error =
                getFormError(
                        ".dm-form-group:nth-child(1)"
                );


        assertTrue(
                error.contains(
                        "Department Name is required"
                )
        );


        System.out.println(
                "TEST 13 - EMPTY DEPARTMENT NAME : PASSED"
        );
    }


    // =========================================================
    // TEST 14
    // DEPARTMENT NAME ONLY SPACES
    // =========================================================

    @Test
    public void departmentNameOnlySpacesTest() {

        fillDepartmentName(
                "   "
        );

        fillHead(
                "Test Manager"
        );

        fillEmployeeCount(
                "10"
        );

        clickAdd();


        String error =
                getDepartmentNameError();


        assertTrue(
                error.contains(
                        "cannot contain only spaces"
                )
        );


        System.out.println(
                "TEST 14 - DEPARTMENT NAME SPACES : PASSED"
        );
    }


    // =========================================================
    // TEST 15
    // DEPARTMENT NAME LEADING SPACE
    // =========================================================

    @Test
    public void departmentNameLeadingSpaceTest() {

        fillDepartmentName(
                " IT Department"
        );

        fillHead(
                "Test Manager"
        );

        fillEmployeeCount(
                "10"
        );

        clickAdd();


        String error =
                getDepartmentNameError();


        assertTrue(
                error.contains(
                        "leading or trailing spaces"
                )
        );


        System.out.println(
                "TEST 15 - DEPARTMENT NAME LEADING SPACE : PASSED"
        );
    }


    // =========================================================
    // TEST 16
    // DEPARTMENT NAME TRAILING SPACE
    // =========================================================

    @Test
    public void departmentNameTrailingSpaceTest() {

        fillDepartmentName(
                "IT Department "
        );

        fillHead(
                "Test Manager"
        );

        fillEmployeeCount(
                "10"
        );

        clickAdd();


        String error =
                getDepartmentNameError();


        assertTrue(
                error.contains(
                        "leading or trailing spaces"
                )
        );


        System.out.println(
                "TEST 16 - DEPARTMENT NAME TRAILING SPACE : PASSED"
        );
    }


    // =========================================================
    // TEST 17
    // DEPARTMENT NAME MULTIPLE SPACES
    // =========================================================

    @Test
    public void departmentNameMultipleSpacesTest() {

        fillDepartmentName(
                "IT  Department"
        );

        fillHead(
                "Test Manager"
        );

        fillEmployeeCount(
                "10"
        );

        clickAdd();


        String error =
                getDepartmentNameError();


        assertTrue(
                error.contains(
                        "multiple consecutive spaces"
                )
        );


        System.out.println(
                "TEST 17 - DEPARTMENT NAME MULTIPLE SPACES : PASSED"
        );
    }


    // =========================================================
    // TEST 18
    // DEPARTMENT NAME ONE CHARACTER
    // =========================================================

    @Test
    public void departmentNameMinimumLengthTest() {

        fillDepartmentName(
                "A"
        );

        fillHead(
                "Test Manager"
        );

        fillEmployeeCount(
                "10"
        );

        clickAdd();


        String error =
                getDepartmentNameError();


        assertTrue(
                error.contains(
                        "at least 2 characters"
                )
        );


        System.out.println(
                "TEST 18 - DEPARTMENT NAME MIN LENGTH : PASSED"
        );
    }


    // =========================================================
    // TEST 19
    // DEPARTMENT NAME NUMBERS
    // =========================================================

    @Test
    public void departmentNameNumbersTest() {

        fillDepartmentName(
                "IT123"
        );

        fillHead(
                "Test Manager"
        );

        fillEmployeeCount(
                "10"
        );

        clickAdd();


        String error =
                getDepartmentNameError();


        assertTrue(
                error.contains(
                        "only letters and spaces"
                )
        );


        System.out.println(
                "TEST 19 - DEPARTMENT NAME NUMBERS : PASSED"
        );
    }


    // =========================================================
    // TEST 20
    // DEPARTMENT NAME SPECIAL CHARACTERS
    // =========================================================

    @Test
    public void departmentNameSpecialCharactersTest() {

        fillDepartmentName(
                "IT@Department"
        );

        fillHead(
                "Test Manager"
        );

        fillEmployeeCount(
                "10"
        );

        clickAdd();


        String error =
                getDepartmentNameError();


        assertTrue(
                error.contains(
                        "only letters and spaces"
                )
        );


        System.out.println(
                "TEST 20 - DEPARTMENT NAME SPECIAL CHARACTERS : PASSED"
        );
    }


    // =========================================================
    // TEST 21
    // DEPARTMENT HEAD EMPTY
    // =========================================================

    @Test
    public void departmentHeadEmptyTest() {

        fillDepartmentName(
                "Testing Department"
        );

        getDepartmentHead().clear();

        fillEmployeeCount(
                "10"
        );

        clickAdd();


        String error =
                getDepartmentHeadError();


        assertTrue(
                error.contains(
                        "Department Head is required"
                )
        );


        System.out.println(
                "TEST 21 - DEPARTMENT HEAD EMPTY : PASSED"
        );
    }


    // =========================================================
    // TEST 22
    // DEPARTMENT HEAD NUMBERS
    // =========================================================

    @Test
    public void departmentHeadNumbersTest() {

        fillDepartmentName(
                "Testing Department"
        );

        fillHead(
                "Manager123"
        );

        fillEmployeeCount(
                "10"
        );

        clickAdd();


        String error =
                getDepartmentHeadError();


        assertTrue(
                error.contains(
                        "only letters and spaces"
                )
        );


        System.out.println(
                "TEST 22 - DEPARTMENT HEAD NUMBERS : PASSED"
        );
    }


    // =========================================================
    // TEST 23
    // DEPARTMENT HEAD SPECIAL CHARACTERS
    // =========================================================

    @Test
    public void departmentHeadSpecialCharactersTest() {

        fillDepartmentName(
                "Testing Department"
        );

        fillHead(
                "Manager@Admin"
        );

        fillEmployeeCount(
                "10"
        );

        clickAdd();


        String error =
                getDepartmentHeadError();


        assertTrue(
                error.contains(
                        "only letters and spaces"
                )
        );


        System.out.println(
                "TEST 23 - DEPARTMENT HEAD SPECIAL CHARACTERS : PASSED"
        );
    }


    // =========================================================
    // TEST 24
    // EMPLOYEE COUNT EMPTY
    // =========================================================

    @Test
    public void employeeCountEmptyTest() {

        fillDepartmentName(
                "Testing Department"
        );

        fillHead(
                "Test Manager"
        );

        getEmployeeCount().clear();

        clickAdd();


        String error =
                getEmployeeCountError();


        assertTrue(
                error.contains(
                        "Number of Employees is required"
                )
        );


        System.out.println(
                "TEST 24 - EMPLOYEE COUNT EMPTY : PASSED"
        );
    }


    // =========================================================
    // TEST 25
    // EMPLOYEE COUNT NON NUMERIC
    // =========================================================

    @Test
    public void employeeCountNonNumericTest() {

        fillDepartmentName(
                "Testing Department"
        );

        fillHead(
                "Test Manager"
        );

        fillEmployeeCount(
                "Ten"
        );

        clickAdd();


        String error =
                getEmployeeCountError();


        assertTrue(
                error.contains(
                        "numbers only"
                )
        );


        System.out.println(
                "TEST 25 - EMPLOYEE COUNT NON NUMERIC : PASSED"
        );
    }


    // =========================================================
    // TEST 26
    // EMPLOYEE COUNT ABOVE 1000
    // =========================================================

    @Test
    public void employeeCountAbove1000Test() {

        fillDepartmentName(
                "Testing Department"
        );

        fillHead(
                "Test Manager"
        );

        fillEmployeeCount(
                "1001"
        );

        clickAdd();


        String error =
                getEmployeeCountError();


        assertTrue(
                error.contains(
                        "cannot exceed 1000"
                )
        );


        System.out.println(
                "TEST 26 - EMPLOYEE COUNT ABOVE 1000 : PASSED"
        );
    }


    // =========================================================
    // TEST 27
    // EMPLOYEE COUNT DECIMAL
    // =========================================================

    @Test
    public void employeeCountDecimalTest() {

        fillDepartmentName(
                "Testing Department"
        );

        fillHead(
                "Test Manager"
        );

        fillEmployeeCount(
                "10.5"
        );

        clickAdd();


        String error =
                getEmployeeCountError();


        assertTrue(
                error.contains(
                        "numbers only"
                )
        );


        System.out.println(
                "TEST 27 - EMPLOYEE COUNT DECIMAL : PASSED"
        );
    }


    // =========================================================
    // TEST 28
    // CANCEL BUTTON
    // =========================================================

    @Test
    public void cancelButtonTest() {

        fillDepartmentName(
                "Testing Department"
        );

        fillHead(
                "Test Manager"
        );

        fillEmployeeCount(
                "10"
        );


        WebElement cancel =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.cssSelector(
                                        ".dm-btn-cancel"
                                )
                        )
                );


        safeClick(cancel);


        assertEquals(
                "",
                getDepartmentName()
                        .getAttribute("value")
        );

        assertEquals(
                "",
                getDepartmentHead()
                        .getAttribute("value")
        );

        assertEquals(
                "",
                getEmployeeCount()
                        .getAttribute("value")
        );


        System.out.println(
                "TEST 28 - CANCEL BUTTON : PASSED"
        );
    }


    // =========================================================
    // TEST 29
    // VALID ADD DEPARTMENT
    // =========================================================

    @Test
    public void validAddDepartmentTest() {

        /*
         * Alphabetic unique name.
         *
         * We cannot use numbers because the React validation
         * allows only letters and spaces.
         */

        String uniqueSuffix =
                generateAlphabeticSuffix();

        String departmentName =
                "Automation Department "
                        + uniqueSuffix;


        fillDepartmentName(
                departmentName
        );

        fillHead(
                "Automation Manager"
        );

        fillEmployeeCount(
                "10"
        );


        clickAdd();


        // -----------------------------------------------------
        // SUCCESS ALERT
        // -----------------------------------------------------

        Alert alert =
                wait.until(
                        ExpectedConditions.alertIsPresent()
                );


        String alertText =
                alert.getText();


        assertEquals(
                "✅ Department added successfully!",
                alertText
        );


        alert.accept();


        wait.until(
                ExpectedConditions.not(
                        ExpectedConditions.alertIsPresent()
                )
        );


        System.out.println(
                "TEST 29 - VALID ADD DEPARTMENT : PASSED"
        );
    }


    // =========================================================
    // TEST 30
    // DUPLICATE DEPARTMENT
    // =========================================================

    @Test
    public void duplicateDepartmentTest() {

        String departmentName =
                "Duplicate Department "
                        + generateAlphabeticSuffix();


        // -----------------------------------------------------
        // FIRST ADD
        // -----------------------------------------------------

        fillDepartmentName(
                departmentName
        );

        fillHead(
                "Duplicate Manager"
        );

        fillEmployeeCount(
                "10"
        );


        clickAdd();


        Alert firstAlert =
                wait.until(
                        ExpectedConditions.alertIsPresent()
                );


        firstAlert.accept();


        wait.until(
                ExpectedConditions.not(
                        ExpectedConditions.alertIsPresent()
                )
        );


        // -----------------------------------------------------
        // SECOND ADD WITH SAME NAME
        // -----------------------------------------------------

        fillDepartmentName(
                departmentName
        );

        fillHead(
                "Duplicate Manager"
        );

        fillEmployeeCount(
                "10"
        );


        clickAdd();


        /*
         * Duplicate is handled locally by the component,
         * so no alert is expected.
         */

        String error =
                getDepartmentNameError();


        assertTrue(
                error.contains(
                        "already exists"
                ),
                "Duplicate department validation was not displayed"
        );


        System.out.println(
                "TEST 30 - DUPLICATE DEPARTMENT : PASSED"
        );
    }


    // =========================================================
    // TEST 31
    // DEPARTMENT LIST
    // =========================================================

    @Test
    public void departmentListTest() {

        WebElement table =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".dm-table"
                                )
                        )
                );


        assertTrue(
                table.isDisplayed()
        );


        String tableText =
                table.getText();


        assertTrue(
                tableText.contains(
                        "Department Name"
                )
        );

        assertTrue(
                tableText.contains(
                        "Department Head"
                )
        );

        assertTrue(
                tableText.contains(
                        "Number of Employees"
                )
        );


        System.out.println(
                "TEST 31 - DEPARTMENT LIST : PASSED"
        );
    }


    // =========================================================
    // TEST 32
    // BACK BUTTON
    // =========================================================

    @Test
    public void backButtonTest() {

        WebElement back =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".dm-back-btn"
                                )
                        )
                );


        assertTrue(
                back.isDisplayed()
        );


        assertTrue(
                back.getText().contains(
                        "Back"
                )
        );


        System.out.println(
                "TEST 32 - BACK BUTTON : PASSED"
        );
    }


    // =========================================================
    // TEST 33
    // LOGOUT BUTTON
    // =========================================================

    @Test
    public void logoutButtonTest() {

        WebElement logout =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".dm-logout-btn"
                                )
                        )
                );


        assertTrue(
                logout.isDisplayed()
        );


        assertEquals(
                "Logout",
                logout.getText()
        );


        System.out.println(
                "TEST 33 - LOGOUT BUTTON : PASSED"
        );
    }


    // =========================================================
    // HELPER
    // GET SEARCH INPUT
    // =========================================================

    private WebElement getSearchInput() {

        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".dm-search-input-wrapper .dm-input"
                        )
                )
        );
    }


    // =========================================================
    // HELPER
    // GET DEPARTMENT NAME
    // =========================================================

    private WebElement getDepartmentName() {

        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".dm-add-form .dm-form-group:nth-child(1) .dm-input"
                        )
                )
        );
    }


    // =========================================================
    // HELPER
    // GET DEPARTMENT HEAD
    // =========================================================

    private WebElement getDepartmentHead() {

        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".dm-add-form .dm-form-group:nth-child(2) .dm-input"
                        )
                )
        );
    }


    // =========================================================
    // HELPER
    // GET EMPLOYEE COUNT
    // =========================================================

    private WebElement getEmployeeCount() {

        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".dm-add-form .dm-form-group:nth-child(3) .dm-input"
                        )
                )
        );
    }


    // =========================================================
    // HELPER
    // FILL DEPARTMENT NAME
    // =========================================================

    private void fillDepartmentName(
            String value
    ) {

        WebElement field =
                getDepartmentName();

        field.clear();

        field.sendKeys(
                value
        );
    }


    // =========================================================
    // HELPER
    // FILL DEPARTMENT HEAD
    // =========================================================

    private void fillHead(
            String value
    ) {

        WebElement field =
                getDepartmentHead();

        field.clear();

        field.sendKeys(
                value
        );
    }


    // =========================================================
    // HELPER
    // FILL EMPLOYEE COUNT
    // =========================================================

    private void fillEmployeeCount(
            String value
    ) {

        WebElement field =
                getEmployeeCount();

        field.clear();

        field.sendKeys(
                value
        );
    }


    // =========================================================
    // HELPER
    // CLICK SEARCH
    // =========================================================

    private void clickSearch() {

        WebElement button =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.cssSelector(
                                        ".dm-btn-primary"
                                )
                        )
                );


        safeClick(button);
    }


    // =========================================================
    // HELPER
    // CLICK ADD
    // =========================================================

    private void clickAdd() {

        WebElement button =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.cssSelector(
                                        ".dm-btn-add"
                                )
                        )
                );


        safeClick(button);
    }


    // =========================================================
    // HELPER
    // SEARCH ERROR
    // =========================================================

    private String getSearchError() {

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".dm-search-input-wrapper .dm-error-text"
                                )
                        )
                );


        return error.getText();
    }


    // =========================================================
    // HELPER
    // DEPARTMENT NAME ERROR
    // =========================================================

    private String getDepartmentNameError() {

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".dm-add-form .dm-form-group:nth-child(1) .dm-error-text"
                                )
                        )
                );


        return error.getText();
    }


    // =========================================================
    // HELPER
    // DEPARTMENT HEAD ERROR
    // =========================================================

    private String getDepartmentHeadError() {

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".dm-add-form .dm-form-group:nth-child(2) .dm-error-text"
                                )
                        )
                );


        return error.getText();
    }


    // =========================================================
    // HELPER
    // EMPLOYEE COUNT ERROR
    // =========================================================

    private String getEmployeeCountError() {

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".dm-add-form .dm-form-group:nth-child(3) .dm-error-text"
                                )
                        )
                );


        return error.getText();
    }


    // =========================================================
    // HELPER
    // FORM ERROR BY GROUP
    // =========================================================

    private String getFormError(
            String groupSelector
    ) {

        WebElement group =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".dm-add-form "
                                                + groupSelector
                                )
                        )
                );


        WebElement error =
                group.findElement(
                        By.cssSelector(
                                ".dm-error-text"
                        )
                );


        return error.getText();
    }


    // =========================================================
    // HELPER
    // GENERATE LETTER-ONLY UNIQUE SUFFIX
    //
    // Important:
    // Department name validation allows only A-Z/a-z/spaces.
    // Therefore we cannot use numbers or symbols.
    // =========================================================

    private String generateAlphabeticSuffix() {

        long value =
                System.currentTimeMillis();


        String letters =
                Long.toString(
                        value,
                        36
                )
                .replaceAll(
                        "[0-9]",
                        ""
                );


        if (letters.length() < 3) {

            letters =
                    letters + "abc";
        }


        return letters.substring(
                0,
                Math.min(
                        letters.length(),
                        8
                )
        );
    }


    // =========================================================
    // HELPER
    // SAFE CLICK
    // =========================================================

    private void safeClick(
            WebElement element
    ) {

        JavascriptExecutor js =
                (JavascriptExecutor) driver;


        try {

            js.executeScript(
                    "arguments[0].scrollIntoView({block:'center'});",
                    element
            );

        } catch (
                Exception ignored
        ) {
        }


        js.executeScript(
                "arguments[0].click();",
                element
        );
    }
}
