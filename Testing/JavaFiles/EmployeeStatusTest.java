package com.itams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


public class EmployeeStatusTest extends BaseTest {

    private WebDriverWait wait;

    // =========================================================
    // HR LOGIN DETAILS
    // =========================================================

    private static final String HR_ID =
            "260822001";

    private static final String HR_PASSWORD =
            "Itams@2026h";


    // =========================================================
    // VALID EMPLOYEE ID FOR TESTING
    // =========================================================

    private static final String EMPLOYEE_ID =
            "260822004";


    // =========================================================
    // BEFORE EACH TEST
    //
    // LOGIN AS HR
    // OPEN HR MANAGEMENT
    // OPEN EMPLOYEE STATUS
    // =========================================================

    @BeforeEach
    public void loginAsHRAndOpenEmployeeStatus() {

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

        WebElement loginHomeButton =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//button[contains(normalize-space(),'Login')]"
                                )
                        )
                );

        safeClick(loginHomeButton);


        // -----------------------------------------------------
        // EMPLOYEE ID
        // -----------------------------------------------------

        WebElement employeeIdField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name(
                                        "employeeIdOrEmail"
                                )
                        )
                );

        employeeIdField.clear();

        employeeIdField.sendKeys(
                HR_ID
        );


        // -----------------------------------------------------
        // PASSWORD
        // -----------------------------------------------------

        WebElement passwordField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name(
                                        "password"
                                )
                        )
                );

        passwordField.clear();

        passwordField.sendKeys(
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
        // HANDLE LOGIN ALERT
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
                "HR login was not successful"
        );

        alert.accept();


        // -----------------------------------------------------
        // WAIT UNTIL ALERT IS CLOSED
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.not(
                        ExpectedConditions.alertIsPresent()
                )
        );


        // -----------------------------------------------------
        // WAIT FOR HR MANAGEMENT
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='HR Management']"
                        )
                )
        );


        // -----------------------------------------------------
        // CLICK EMPLOYEE STATUS
        // -----------------------------------------------------

        WebElement employeeStatusButton =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                By.xpath(
                                        "//button[normalize-space()='View Status']"
                                )
                        )
                );

        safeClick(employeeStatusButton);


        // -----------------------------------------------------
        // WAIT FOR EMPLOYEE STATUS PAGE
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='Employee Status']"
                        )
                )
        );


        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".es-input"
                        )
                )
        );

        System.out.println(
                "Employee Status page opened successfully"
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
                                        ".es-page-title"
                                )
                        )
                );

        assertEquals(
                "Employee Status",
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
                                        ".es-page-sub"
                                )
                        )
                );

        assertTrue(
                subtitle.getText().contains(
                        "View and update employee status"
                )
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

        WebElement searchField =
                getSearchField();

        assertTrue(
                searchField.isDisplayed()
        );

        assertEquals(
                "Enter Employee ID or Employee Name",
                searchField.getAttribute(
                        "placeholder"
                )
        );

        assertEquals(
                "50",
                searchField.getAttribute(
                        "maxlength"
                )
        );

        System.out.println(
                "TEST 3 - SEARCH FIELD : PASSED"
        );
    }


    // =========================================================
    // TEST 4
    // EMPTY SEARCH VALIDATION
    // =========================================================

    @Test
    public void emptySearchTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        clickSearch();


        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".es-validation-error"
                                )
                        )
                );


        assertEquals(
                "⚠️ Please enter an Employee ID or Employee Name.",
                error.getText()
        );


        System.out.println(
                "TEST 4 - EMPTY SEARCH VALIDATION : PASSED"
        );
    }


    // =========================================================
    // TEST 5
    // SHORT EMPLOYEE ID
    // =========================================================

    @Test
    public void shortEmployeeIdTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "26082200"
        );

        clickSearch();


        String error =
                getValidationError();


        assertTrue(
                error.contains(
                        "exactly 9 digits"
                )
        );


        System.out.println(
                "TEST 5 - SHORT EMPLOYEE ID : PASSED"
        );
    }


    // =========================================================
    // TEST 6
    // LONG EMPLOYEE ID
    // =========================================================

    @Test
    public void longEmployeeIdTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "260822004999999"
        );


        String value =
                searchField.getAttribute(
                        "value"
                );


        /*
         * The component limits numeric input
         * to 9 digits.
         */

        assertTrue(
                value.length() <= 9,
                "More than 9 digits were accepted"
        );


        System.out.println(
                "TEST 6 - LONG EMPLOYEE ID : PASSED"
        );
    }


    // =========================================================
    // TEST 7
    // INVALID MONTH
    // =========================================================

    @Test
    public void invalidMonthTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "261322001"
        );

        clickSearch();


        String error =
                getValidationError();


        assertTrue(
                error.contains(
                        "invalid month"
                )
        );


        System.out.println(
                "TEST 7 - INVALID MONTH : PASSED"
        );
    }


    // =========================================================
    // TEST 8
    // INVALID DAY
    // =========================================================

    @Test
    public void invalidDayTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "260832001"
        );

        clickSearch();


        String error =
                getValidationError();


        assertTrue(
                error.contains(
                        "invalid day"
                )
        );


        System.out.println(
                "TEST 8 - INVALID DAY : PASSED"
        );
    }


    // =========================================================
    // TEST 9
    // INVALID CALENDAR DATE
    // =========================================================

    @Test
    public void invalidCalendarDateTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        /*
         * February 31, 2026
         */

        searchField.sendKeys(
                "260231001"
        );

        clickSearch();


        String error =
                getValidationError();


        assertTrue(
                error.contains(
                        "invalid date"
                )
        );


        System.out.println(
                "TEST 9 - INVALID CALENDAR DATE : PASSED"
        );
    }


    // =========================================================
    // TEST 10
    // FUTURE EMPLOYEE ID
    // =========================================================

    @Test
    public void futureEmployeeIdTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        /*
         * 2027-01-01
         */

        searchField.sendKeys(
                "270101001"
        );

        clickSearch();


        String error =
                getValidationError();


        assertTrue(
                error.contains(
                        "Future dates are not allowed"
                )
        );


        System.out.println(
                "TEST 10 - FUTURE EMPLOYEE ID : PASSED"
        );
    }


    // =========================================================
    // TEST 11
    // VALID EMPLOYEE ID SEARCH
    // =========================================================

    @Test
    public void validEmployeeIdSearchTest() {

        searchEmployeeById(
                EMPLOYEE_ID
        );


        WebElement table =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".es-table"
                                )
                        )
                );


        assertTrue(
                table.getText().contains(
                        EMPLOYEE_ID
                ),
                "Employee ID was not displayed"
        );


        System.out.println(
                "TEST 11 - VALID EMPLOYEE ID SEARCH : PASSED"
        );
    }


    // =========================================================
    // TEST 12
    // ENTER KEY SEARCH
    // =========================================================

    @Test
    public void enterKeySearchTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                EMPLOYEE_ID
        );

        searchField.sendKeys(
                Keys.ENTER
        );


        wait.until(
                driver ->
                        driver.findElement(
                                By.cssSelector(
                                        ".es-table"
                                )
                        ).getText().contains(
                                EMPLOYEE_ID
                        )
        );


        assertTrue(
                driver.findElement(
                        By.cssSelector(
                                ".es-table"
                        )
                ).getText().contains(
                        EMPLOYEE_ID
                )
        );


        System.out.println(
                "TEST 12 - ENTER KEY SEARCH : PASSED"
        );
    }


    // =========================================================
    // TEST 13
    // NAME SEARCH
    // =========================================================

    @Test
    public void nameSearchValidationTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "A"
        );

        clickSearch();


        String error =
                getValidationError();


        assertTrue(
                error.contains(
                        "at least 2 characters"
                )
        );


        System.out.println(
                "TEST 13 - NAME MINIMUM LENGTH : PASSED"
        );
    }


    // =========================================================
    // TEST 14
    // NAME WITH MULTIPLE SPACES
    // =========================================================

    @Test
    public void multipleSpacesNameTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "Arjun  Reddy"
        );

        clickSearch();


        String error =
                getValidationError();


        assertTrue(
                error.contains(
                        "multiple spaces"
                )
        );


        System.out.println(
                "TEST 14 - MULTIPLE SPACES NAME : PASSED"
        );
    }


    // =========================================================
    // TEST 15
    // NAME WITH LEADING SPACE
    // =========================================================

    @Test
    public void leadingSpaceNameTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                " Arjun"
        );

        clickSearch();


        String error =
                getValidationError();


        assertTrue(
                error.contains(
                        "spaces before or after"
                )
        );


        System.out.println(
                "TEST 15 - LEADING SPACE : PASSED"
        );
    }


    // =========================================================
    // TEST 16
    // NAME WITH TRAILING SPACE
    // =========================================================

    @Test
    public void trailingSpaceNameTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "Arjun "
        );

        clickSearch();


        String error =
                getValidationError();


        assertTrue(
                error.contains(
                        "spaces before or after"
                )
        );


        System.out.println(
                "TEST 16 - TRAILING SPACE : PASSED"
        );
    }


    // =========================================================
    // TEST 17
    // NAME WITH NUMBERS
    // =========================================================

    @Test
    public void nameWithNumbersTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "Arjun123"
        );

        clickSearch();


        String error =
                getValidationError();


        assertTrue(
                error.contains(
                        "only letters"
                )
        );


        System.out.println(
                "TEST 17 - NAME WITH NUMBERS : PASSED"
        );
    }


    // =========================================================
    // TEST 18
    // NAME WITH SPECIAL CHARACTERS
    // =========================================================

    @Test
    public void nameWithSpecialCharactersTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "Arjun@Reddy"
        );

        clickSearch();


        String error =
                getValidationError();


        assertTrue(
                error.contains(
                        "only letters"
                )
        );


        System.out.println(
                "TEST 18 - NAME SPECIAL CHARACTERS : PASSED"
        );
    }


    // =========================================================
    // TEST 19
    // TABLE HEADERS
    // =========================================================

    @Test
    public void tableHeadersTest() {

        WebElement table =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".es-table"
                                )
                        )
                );


        String tableText =
                table.getText();


        assertTrue(
                tableText.contains(
                        "Employee ID"
                )
        );

        assertTrue(
                tableText.contains(
                        "Employee Name"
                )
        );

        assertTrue(
                tableText.contains(
                        "Department"
                )
        );

        assertTrue(
                tableText.contains(
                        "Status"
                )
        );

        assertTrue(
                tableText.contains(
                        "Update"
                )
        );


        System.out.println(
                "TEST 19 - TABLE HEADERS : PASSED"
        );
    }


    // =========================================================
    // TEST 20
    // STATUS DROPDOWN
    // =========================================================

    @Test
    public void statusDropdownTest() {

        searchEmployeeById(
                EMPLOYEE_ID
        );


        WebElement selectElement =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".es-select"
                                )
                        )
                );


        Select select =
                new Select(
                        selectElement
                );


        assertEquals(
                3,
                select.getOptions().size(),
                "Status dropdown should contain 3 options"
        );


        assertTrue(
                containsOption(
                        select,
                        "Active"
                )
        );

        assertTrue(
                containsOption(
                        select,
                        "On Leave"
                )
        );

        assertTrue(
                containsOption(
                        select,
                        "Inactive"
                )
        );


        System.out.println(
                "TEST 20 - STATUS DROPDOWN : PASSED"
        );
    }


    // =========================================================
    // TEST 21
    // UPDATE BUTTON INITIALLY DISABLED
    // =========================================================

    @Test
    public void updateButtonInitiallyDisabledTest() {

        searchEmployeeById(
                EMPLOYEE_ID
        );


        WebElement updateButton =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                By.cssSelector(
                                        ".es-update-btn"
                                )
                        )
                );


        /*
         * No status has been changed yet.
         */

        assertTrue(
                updateButton.isDisplayed()
        );


        assertTrue(
                updateButton.getAttribute(
                        "disabled"
                ) != null,
                "Update button should initially be disabled"
        );


        System.out.println(
                "TEST 21 - UPDATE BUTTON DISABLED : PASSED"
        );
    }


    // =========================================================
    // TEST 22
    // UPDATE WITHOUT CHANGING STATUS
    // =========================================================

    @Test
    public void updateWithoutStatusChangeTest() {

        searchEmployeeById(
                EMPLOYEE_ID
        );


        WebElement selectElement =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".es-select"
                                )
                        )
                );


        Select select =
                new Select(
                        selectElement
                );


        String currentStatus =
                select.getFirstSelectedOption()
                        .getText();


        /*
         * Select the same status.
         */

        select.selectByVisibleText(
                currentStatus
        );


        /*
         * Since no change happened, Update remains disabled.
         */

        WebElement updateButton =
                driver.findElement(
                        By.cssSelector(
                                ".es-update-btn"
                        )
                );


        assertTrue(
                updateButton.getAttribute(
                        "disabled"
                ) != null,
                "Update should remain disabled when status is unchanged"
        );


        System.out.println(
                "TEST 22 - UPDATE WITHOUT CHANGE : PASSED"
        );
    }


    // =========================================================
    // TEST 23
    // CHANGE STATUS TO ON LEAVE
    // =========================================================

    @Test
    public void updateStatusToOnLeaveTest() {

        searchEmployeeById(
                EMPLOYEE_ID
        );


        WebElement selectElement =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".es-select"
                                )
                        )
                );


        Select select =
                new Select(
                        selectElement
                );


        String currentStatus =
                select.getFirstSelectedOption()
                        .getText();


        /*
         * If already On Leave, choose Inactive first
         * so that we definitely create a status change.
         */

        if (
                currentStatus.equals(
                        "On Leave"
                )
        ) {

            select.selectByVisibleText(
                    "Inactive"
            );

        } else {

            select.selectByVisibleText(
                    "On Leave"
            );
        }


        WebElement updateButton =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.cssSelector(
                                        ".es-update-btn"
                                )
                        )
                );


        safeClick(updateButton);


        /*
         * Backend should return successful update alert.
         */

        Alert alert =
                wait.until(
                        ExpectedConditions.alertIsPresent()
                );


        String alertText =
                alert.getText();


        assertTrue(
                alertText.contains(
                        "Status updated"
                ),
                "Status update success alert was not displayed"
        );


        alert.accept();


        wait.until(
                ExpectedConditions.not(
                        ExpectedConditions.alertIsPresent()
                )
        );


        System.out.println(
                "TEST 23 - UPDATE STATUS : PASSED"
        );
    }


    // =========================================================
    // TEST 24
    // PAGINATION DROPDOWN
    // =========================================================

    @Test
    public void pageSizeDropdownTest() {

        WebElement pageSize =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".es-page-size"
                                )
                        )
                );


        Select select =
                new Select(
                        pageSize
                );


        assertEquals(
                4,
                select.getOptions().size()
        );


        assertTrue(
                containsOption(
                        select,
                        "10"
                )
        );

        assertTrue(
                containsOption(
                        select,
                        "30"
                )
        );

        assertTrue(
                containsOption(
                        select,
                        "50"
                )
        );

        assertTrue(
                containsOption(
                        select,
                        "All"
                )
        );


        /*
         * Select All.
         */

        select.selectByVisibleText(
                "All"
        );


        assertEquals(
                "All",
                select.getFirstSelectedOption()
                        .getText()
        );


        System.out.println(
                "TEST 24 - PAGE SIZE DROPDOWN : PASSED"
        );
    }


    // =========================================================
    // TEST 25
    // BACK BUTTON
    // =========================================================

    @Test
    public void backButtonTest() {

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


        System.out.println(
                "TEST 25 - BACK BUTTON : PASSED"
        );
    }


    // =========================================================
    // TEST 26
    // LOGOUT BUTTON
    // =========================================================

    @Test
    public void logoutButtonTest() {

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
                "TEST 26 - LOGOUT BUTTON : PASSED"
        );
    }


    // =========================================================
    // HELPER
    // GET SEARCH FIELD
    // =========================================================

    private WebElement getSearchField() {

        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".es-input"
                        )
                )
        );
    }


    // =========================================================
    // HELPER
    // CLICK SEARCH
    // =========================================================

    private void clickSearch() {

        WebElement searchButton =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.cssSelector(
                                        ".es-btn-primary"
                                )
                        )
                );


        safeClick(
                searchButton
        );
    }


    // =========================================================
    // HELPER
    // GET VALIDATION ERROR
    // =========================================================

    private String getValidationError() {

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".es-validation-error"
                                )
                        )
                );


        return error.getText();
    }


    // =========================================================
    // HELPER
    // SEARCH EMPLOYEE BY ID
    // =========================================================

    private void searchEmployeeById(
            String employeeId
    ) {

        WebElement searchField =
                getSearchField();


        searchField.clear();


        searchField.sendKeys(
                employeeId
        );


        clickSearch();


        /*
         * Wait until the table contains the employee.
         */

        wait.until(
                driver -> {

                    try {

                        WebElement table =
                                driver.findElement(
                                        By.cssSelector(
                                                ".es-table"
                                        )
                                );


                        return table.getText()
                                .contains(
                                        employeeId
                                );

                    } catch (
                            Exception e
                    ) {

                        return false;
                    }
                }
        );


        System.out.println(
                "Employee searched: "
                        + employeeId
        );
    }


    // =========================================================
    // HELPER
    // CHECK DROPDOWN OPTION
    // =========================================================

    private boolean containsOption(
            Select select,
            String optionText
    ) {

        for (
                WebElement option :
                select.getOptions()
        ) {

            if (
                    option.getText()
                            .equals(
                                    optionText
                            )
            ) {

                return true;
            }
        }


        return false;
    }


    // =========================================================
    // HELPER
    // SAFE JAVASCRIPT CLICK
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
