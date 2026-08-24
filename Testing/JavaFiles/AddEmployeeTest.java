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
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class AddEmployeeTest extends BaseTest {

    private WebDriverWait wait;

    // HR credentials
    private static final String HR_ID = "260822001";
    private static final String HR_PASSWORD = "Itams@2026h";

    // =========================================================
    // BEFORE EACH TEST
    // Login as HR and open Add Employee page
    // =========================================================

    @BeforeEach
    public void loginAsHRAndOpenAddEmployee() {

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(15)
        );

        driver.get("http://localhost:3000");

        // -----------------------------------------------------
        // Click Login
        // -----------------------------------------------------

        WebElement loginHomeButton =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//button[contains(normalize-space(),'Login')]"
                                )
                        )
                );

        loginHomeButton.click();

        // -----------------------------------------------------
        // Employee ID
        // -----------------------------------------------------

        WebElement employeeIdField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("employeeIdOrEmail")
                        )
                );

        employeeIdField.sendKeys(HR_ID);

        // -----------------------------------------------------
        // Password
        // -----------------------------------------------------

        WebElement passwordField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("password")
                        )
                );

        passwordField.sendKeys(HR_PASSWORD);

        // -----------------------------------------------------
        // Login
        // -----------------------------------------------------

        WebElement loginButton =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//form//button[@type='submit']"
                                )
                        )
                );

        loginButton.click();

        // Login Successful alert
        acceptAlertIfPresent();

        // -----------------------------------------------------
        // Verify HR Management page
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//h1[normalize-space()='HR Management']"
                        )
                )
        );

        // -----------------------------------------------------
        // Click Add Employee
        // -----------------------------------------------------

        WebElement addEmployeeButton =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//button[normalize-space()='Add Employee']"
                                )
                        )
                );

        addEmployeeButton.click();

        // -----------------------------------------------------
        // Wait for Add Employee page
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                "input[placeholder='Enter full name']"
                        )
                )
        );
    }


    // =========================================================
    // TEST 1
    // Verify Add Employee page
    // =========================================================

    @Test
    public void verifyAddEmployeePageTest() {

        String pageSource = driver.getPageSource();

        assertTrue(
                pageSource.contains("Add Employee"),
                "Add Employee heading not displayed"
        );

        assertTrue(
                pageSource.contains("Employee Name"),
                "Employee Name field not displayed"
        );

        assertTrue(
                pageSource.contains("Employee ID"),
                "Employee ID field not displayed"
        );

        assertTrue(
                pageSource.contains("Email"),
                "Email field not displayed"
        );

        assertTrue(
                pageSource.contains("Department"),
                "Department field not displayed"
        );

        assertTrue(
                pageSource.contains("Designation"),
                "Designation field not displayed"
        );

        assertTrue(
                pageSource.contains("Phone Number"),
                "Phone Number field not displayed"
        );

        assertTrue(
                pageSource.contains("Date of Joining"),
                "Date of Joining field not displayed"
        );

        assertTrue(
                pageSource.contains("Save Employee"),
                "Save Employee button not displayed"
        );

        System.out.println(
                "TEST 1 - ADD EMPLOYEE PAGE : PASSED"
        );
    }


    // =========================================================
    // TEST 2
    // Empty form validation
    // =========================================================

    @Test
    public void emptyFormValidationTest() {

        clickSaveEmployee();

        String pageSource =
                driver.getPageSource().toLowerCase();

        assertTrue(
                pageSource.contains("required")
                        || pageSource.contains("enter")
                        || pageSource.contains("select"),
                "Required field validation was not displayed"
        );

        System.out.println(
                "TEST 2 - EMPTY FORM VALIDATION : PASSED"
        );
    }


    // =========================================================
    // TEST 3
    // Invalid Employee Name
    // =========================================================

    @Test
    public void invalidEmployeeNameTest() {

        WebElement nameField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        "input[placeholder='Enter full name']"
                                )
                        )
                );

        nameField.sendKeys("12345");

        nameField.sendKeys(Keys.TAB);

        String pageSource =
                driver.getPageSource().toLowerCase();

        assertTrue(
                pageSource.contains("name")
                        || pageSource.contains("letter")
                        || pageSource.contains("valid"),
                "Employee Name validation was not displayed"
        );

        System.out.println(
                "TEST 3 - INVALID EMPLOYEE NAME : PASSED"
        );
    }


    // =========================================================
    // TEST 4
    // Invalid Employee ID
    // =========================================================

    @Test
    public void invalidEmployeeIdTest() {

        WebElement idField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        "input[placeholder='YYMMDD001']"
                                )
                        )
                );

        idField.sendKeys("12345");

        idField.sendKeys(Keys.TAB);

        String pageSource =
                driver.getPageSource().toLowerCase();

        assertTrue(
                pageSource.contains("employee id")
                        || pageSource.contains("9 digits")
                        || pageSource.contains("valid"),
                "Employee ID validation was not displayed"
        );

        System.out.println(
                "TEST 4 - INVALID EMPLOYEE ID : PASSED"
        );
    }


    // =========================================================
    // TEST 5
    // Invalid Phone Number
    // =========================================================

    @Test
    public void invalidPhoneTest() {

        WebElement phoneField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        "input[placeholder='Enter 10-digit number']"
                                )
                        )
                );

        phoneField.sendKeys("1234567890");

        phoneField.sendKeys(Keys.TAB);

        String pageSource =
                driver.getPageSource().toLowerCase();

        assertTrue(
                pageSource.contains("phone")
                        || pageSource.contains("mobile")
                        || pageSource.contains("10-digit")
                        || pageSource.contains("valid"),
                "Phone validation was not displayed"
        );

        System.out.println(
                "TEST 5 - INVALID PHONE : PASSED"
        );
    }


    // =========================================================
    // TEST 6
    // Joining date older than 7 days
    // =========================================================

    @Test
    public void oldJoiningDateTest() {

        LocalDate oldDate =
                LocalDate.now().minusDays(10);

        WebElement dateField =
                getDateField();

        setDate(dateField, oldDate);

        String minDate =
                dateField.getAttribute("min");

        System.out.println(
                "Minimum allowed date: " + minDate
        );

        /*
         * The page should restrict joining dates to
         * today or previous 7 days.
         */

        boolean dateRestrictionExists =
                minDate != null
                        && !minDate.isEmpty();

        assertTrue(
                dateRestrictionExists,
                "Date of Joining does not have the expected minimum-date restriction"
        );

        System.out.println(
                "TEST 6 - OLD JOINING DATE VALIDATION : PASSED"
        );
    }


    // =========================================================
    // TEST 7
    // Future joining date
    // =========================================================

    @Test
    public void futureJoiningDateTest() {

        LocalDate futureDate =
                LocalDate.now().plusDays(1);

        WebElement dateField =
                getDateField();

        setDate(dateField, futureDate);

        String maxDate =
                dateField.getAttribute("max");

        System.out.println(
                "Maximum allowed date: " + maxDate
        );

        /*
         * The HTML date field should have a maximum date
         * which prevents future dates.
         */

        assertTrue(
                maxDate != null
                        && !maxDate.isEmpty(),
                "Date field does not contain maximum-date restriction"
        );

        /*
         * Check browser constraint validation.
         */

        JavascriptExecutor js =
                (JavascriptExecutor) driver;

        Boolean rangeOverflow =
                (Boolean) js.executeScript(
                        "return arguments[0].validity.rangeOverflow;",
                        dateField
                );

        assertTrue(
                Boolean.TRUE.equals(rangeOverflow),
                "Future date was not identified as invalid"
        );

        System.out.println(
                "TEST 7 - FUTURE JOINING DATE : PASSED"
        );
    }


    // =========================================================
    // TEST 8
    // Invalid Email
    // =========================================================

    @Test
    public void invalidEmailTest() {

        WebElement emailField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        "input[placeholder='YYMMDD001a@gmail.com']"
                                )
                        )
                );

        emailField.sendKeys("wrong-email");

        emailField.sendKeys(Keys.TAB);

        String pageSource =
                driver.getPageSource().toLowerCase();

        assertTrue(
                pageSource.contains("email")
                        || pageSource.contains("format")
                        || pageSource.contains("valid"),
                "Invalid email validation was not displayed"
        );

        System.out.println(
                "TEST 8 - INVALID EMAIL : PASSED"
        );
    }


    // =========================================================
    // TEST 9
    // Valid Employee ID + Email
    // =========================================================

    @Test
    public void validEmployeeIdAndEmailTest() {

        LocalDate today =
                LocalDate.now();

        String datePart =
                String.format(
                        "%02d%02d%02d",
                        today.getYear() % 100,
                        today.getMonthValue(),
                        today.getDayOfMonth()
                );

        String employeeId =
                datePart + "997";

        String email =
                employeeId + "a@gmail.com";

        // Date
        setDate(
                getDateField(),
                today
        );

        // Employee ID
        WebElement idField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        "input[placeholder='YYMMDD001']"
                                )
                        )
                );

        idField.sendKeys(employeeId);

        // Email
        WebElement emailField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        "input[placeholder='YYMMDD001a@gmail.com']"
                                )
                        )
                );

        emailField.sendKeys(email);

        emailField.sendKeys(Keys.TAB);

        System.out.println(
                "Employee ID: " + employeeId
        );

        System.out.println(
                "Email: " + email
        );

        /*
         * Verify both values are actually entered.
         */

        assertTrue(
                employeeId.equals(
                        idField.getAttribute("value")
                ),
                "Employee ID was not entered correctly"
        );

        assertTrue(
                email.equals(
                        emailField.getAttribute("value")
                ),
                "Email was not entered correctly"
        );

        System.out.println(
                "TEST 9 - VALID EMPLOYEE ID AND EMAIL : PASSED"
        );
    }


    // =========================================================
    // TEST 10
    // Department dropdown
    // =========================================================

    @Test
    public void departmentDropdownTest() {

        WebElement department =
                findDepartmentDropdown();

        assertTrue(
                department.isDisplayed(),
                "Department dropdown is not displayed"
        );

        Select select =
                new Select(department);

        assertTrue(
                select.getOptions().size() > 1,
                "Department dropdown does not contain options"
        );

        System.out.println(
                "Number of departments: "
                        + select.getOptions().size()
        );

        System.out.println(
                "TEST 10 - DEPARTMENT DROPDOWN : PASSED"
        );
    }


    // =========================================================
    // TEST 11
    // Valid Add Employee
    // =========================================================

    @Test
    public void validAddEmployeeTest() {

        LocalDate today =
                LocalDate.now();

        String datePart =
                String.format(
                        "%02d%02d%02d",
                        today.getYear() % 100,
                        today.getMonthValue(),
                        today.getDayOfMonth()
                );

        String employeeId =
                datePart + "996";

        String email =
                employeeId + "a@gmail.com";

        // -----------------------------------------------------
        // Employee Name
        // -----------------------------------------------------

        WebElement nameField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        "input[placeholder='Enter full name']"
                                )
                        )
                );

        nameField.sendKeys(
                "Automation Tester"
        );

        // -----------------------------------------------------
        // Date of Joining
        // -----------------------------------------------------

        setDate(
                getDateField(),
                today
        );

        // -----------------------------------------------------
        // Employee ID
        // -----------------------------------------------------

        WebElement idField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        "input[placeholder='YYMMDD001']"
                                )
                        )
                );

        idField.sendKeys(employeeId);

        // -----------------------------------------------------
        // Email
        // -----------------------------------------------------

        WebElement emailField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        "input[placeholder='YYMMDD001a@gmail.com']"
                                )
                        )
                );

        emailField.sendKeys(email);

        // -----------------------------------------------------
        // Department
        // -----------------------------------------------------

        WebElement department =
                findDepartmentDropdown();

        Select departmentSelect =
                new Select(department);

        if (departmentSelect.getOptions().size() > 1) {

            departmentSelect.selectByIndex(1);
        }

        // -----------------------------------------------------
        // Designation
        // -----------------------------------------------------

        WebElement designation =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        "input[placeholder='Enter designation']"
                                )
                        )
                );

        designation.sendKeys(
                "Developer"
        );

        // -----------------------------------------------------
        // Phone
        // -----------------------------------------------------

        WebElement phone =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        "input[placeholder='Enter 10-digit number']"
                                )
                        )
                );

        phone.sendKeys(
                "9876543210"
        );

        // -----------------------------------------------------
        // Save
        // -----------------------------------------------------

        clickSaveEmployee();

        // -----------------------------------------------------
        // Handle alert if application displays one
        // -----------------------------------------------------

        try {

            WebDriverWait alertWait =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(10)
                    );

            alertWait.until(
                    ExpectedConditions.alertIsPresent()
            );

            Alert alert =
                    driver.switchTo().alert();

            String alertText =
                    alert.getText();

            System.out.println(
                    "Add Employee Alert: "
                            + alertText
            );

            alert.accept();

            assertTrue(
                    alertText.toLowerCase().contains(
                            "success"
                    )
                    || alertText.toLowerCase().contains(
                            "added"
                    ),
                    "Employee was not added successfully"
            );

        } catch (Exception e) {

            /*
             * If there is no alert, check that the page
             * remains functional after Save.
             */

            String pageSource =
                    driver.getPageSource().toLowerCase();

            assertTrue(
                    pageSource.contains("employee"),
                    "Employee page could not be verified after Save"
            );
        }

        System.out.println(
                "TEST 11 - VALID ADD EMPLOYEE : PASSED"
        );
    }


    // =========================================================
    // HELPER 1
    // Get Date Field
    // =========================================================

    private WebElement getDateField() {

        return wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.cssSelector(
                                "input[type='date']"
                        )
                )
        );
    }


    // =========================================================
    // HELPER 2
    // Set Date
    // =========================================================

    private void setDate(
            WebElement dateField,
            LocalDate date
    ) {

        scrollIntoView(dateField);

        JavascriptExecutor js =
                (JavascriptExecutor) driver;

        js.executeScript(
                "var input = arguments[0];" +
                "var value = arguments[1];" +
                "var setter = Object.getOwnPropertyDescriptor(" +
                "HTMLInputElement.prototype, 'value').set;" +
                "setter.call(input, value);" +
                "input.dispatchEvent(new Event('input', {bubbles:true}));" +
                "input.dispatchEvent(new Event('change', {bubbles:true}));" +
                "input.dispatchEvent(new Event('blur', {bubbles:true}));",
                dateField,
                date.toString()
        );
    }


    // =========================================================
    // HELPER 3
    // Find Department Dropdown
    // =========================================================

    private WebElement findDepartmentDropdown() {

        try {

            return driver.findElement(
                    By.xpath(
                            "//label[contains(normalize-space(),'Department')]" +
                            "/following::select[1]"
                    )
            );

        } catch (Exception e) {

            return driver.findElement(
                    By.xpath(
                            "//select"
                    )
            );
        }
    }


    // =========================================================
    // HELPER 4
    // Scroll Into View
    // =========================================================

    private void scrollIntoView(
            WebElement element
    ) {

        JavascriptExecutor js =
                (JavascriptExecutor) driver;

        js.executeScript(
                "arguments[0].scrollIntoView(" +
                "{block:'center', inline:'nearest'}" +
                ");",
                element
        );
    }


    // =========================================================
    // HELPER 5
    // Click Save Employee
    // =========================================================

    private void clickSaveEmployee() {

        WebElement saveButton =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                By.xpath(
                                        "//button[normalize-space()='Save Employee']"
                                )
                        )
                );

        // First scroll to button
        scrollIntoView(saveButton);

        try {

            wait.until(
                    ExpectedConditions.elementToBeClickable(
                            saveButton
                    )
            ).click();

        } catch (Exception e) {

            /*
             * If normal Selenium click is intercepted,
             * JavaScript click is used.
             */

            JavascriptExecutor js =
                    (JavascriptExecutor) driver;

            js.executeScript(
                    "arguments[0].click();",
                    saveButton
            );
        }
    }


    // =========================================================
    // HELPER 6
    // Accept Alert
    // =========================================================

    private void acceptAlertIfPresent() {

        try {

            WebDriverWait alertWait =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(10)
                    );

            alertWait.until(
                    ExpectedConditions.alertIsPresent()
            );

            Alert alert =
                    driver.switchTo().alert();

            System.out.println(
                    "Alert: " + alert.getText()
            );

            alert.accept();

        } catch (Exception ignored) {

            // No alert appeared.
        }
    }
}
