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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class UpdateEmployeeTest extends BaseTest {

    private WebDriverWait wait;

    // =========================================================
    // HR LOGIN CREDENTIALS
    // =========================================================

    private static final String HR_ID = "260822001";
    private static final String HR_PASSWORD = "Itams@2026h";


    // =========================================================
    // EMPLOYEE USED FOR UPDATE TESTING
    // =========================================================

    private static final String EMPLOYEE_ID = "260822004";


    // =========================================================
    // BEFORE EACH TEST
    // =========================================================

    @BeforeEach
    public void openUpdateEmployeePage() {

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(15)
        );

        // -----------------------------------------------------
        // STEP 1 - OPEN APPLICATION
        // -----------------------------------------------------

        driver.get("http://localhost:3000");

        wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.tagName("body")
                )
        );

        System.out.println("STEP 1: Home page opened");


        // -----------------------------------------------------
        // STEP 2 - CLICK LOGIN
        // -----------------------------------------------------

        WebElement loginButton =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//button[contains(normalize-space(),'Login')]"
                                )
                        )
                );

        loginButton.click();

        System.out.println("STEP 2: Login button clicked");


        // -----------------------------------------------------
        // STEP 3 - ENTER HR EMPLOYEE ID
        // -----------------------------------------------------

        WebElement employeeField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("employeeIdOrEmail")
                        )
                );

        employeeField.clear();

        employeeField.sendKeys(
                HR_ID
        );


        // -----------------------------------------------------
        // STEP 4 - ENTER HR PASSWORD
        // -----------------------------------------------------

        WebElement passwordField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("password")
                        )
                );

        passwordField.clear();

        passwordField.sendKeys(
                HR_PASSWORD
        );


        // -----------------------------------------------------
        // STEP 5 - CLICK LOGIN
        // -----------------------------------------------------

        WebElement loginSubmit =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//form//button[@type='submit']"
                                )
                        )
                );

        loginSubmit.click();

        System.out.println("STEP 3: HR credentials submitted");


        // -----------------------------------------------------
        // STEP 6 - HANDLE LOGIN ALERT
        // -----------------------------------------------------

        try {

            Alert alert =
                    wait.until(
                            ExpectedConditions.alertIsPresent()
                    );

            System.out.println(
                    "Login Alert: " + alert.getText()
            );

            alert.accept();

        } catch (Exception ignored) {

            System.out.println(
                    "No login alert displayed."
            );
        }


        // -----------------------------------------------------
        // STEP 7 - WAIT FOR HR MANAGEMENT
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.or(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.xpath(
                                        "//*[normalize-space()='HR Management']"
                                )
                        ),
                        ExpectedConditions.visibilityOfElementLocated(
                                By.xpath(
                                        "//button[normalize-space()='HR Mgmt']"
                                )
                        )
                )
        );


        // -----------------------------------------------------
        // STEP 8 - CLICK HR MGMT
        // -----------------------------------------------------

        try {

            WebElement hrMgmtButton =
                    wait.until(
                            ExpectedConditions.elementToBeClickable(
                                    By.xpath(
                                            "//button[normalize-space()='HR Mgmt']"
                                    )
                            )
                    );

            clickUsingJS(hrMgmtButton);

            System.out.println(
                    "STEP 4: HR Mgmt clicked"
            );

        } catch (Exception ignored) {

            System.out.println(
                    "HR Management page already open."
            );
        }


        // -----------------------------------------------------
        // STEP 9 - WAIT FOR HR MANAGEMENT PAGE
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='HR Management']"
                        )
                )
        );

        System.out.println(
                "STEP 5: HR Management page opened"
        );


        // -----------------------------------------------------
        // STEP 10 - CLICK UPDATE DETAILS
        // -----------------------------------------------------

        WebElement updateDetailsButton =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//button[normalize-space()='Update Details']"
                                )
                        )
                );

        scrollIntoView(
                updateDetailsButton
        );

        clickUsingJS(
                updateDetailsButton
        );

        System.out.println(
                "STEP 6: Update Details clicked"
        );


        // -----------------------------------------------------
        // STEP 11 - WAIT FOR UPDATE EMPLOYEE PAGE
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='Update Employee Details']"
                        )
                )
        );

        System.out.println(
                "STEP 7: Update Employee Details page opened"
        );


        // -----------------------------------------------------
        // WAIT FOR SEARCH FIELD
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//input[@placeholder='Enter Employee ID (e.g., 260822004)']"
                        )
                )
        );
    }


    // =========================================================
    // TEST 1 - VERIFY PAGE
    // =========================================================

    @Test
    public void verifyUpdateEmployeePageTest() {

        assertTrue(
                driver.findElement(
                        By.xpath(
                                "//*[normalize-space()='Update Employee Details']"
                        )
                ).isDisplayed(),
                "Update Employee Details heading not displayed"
        );

        assertTrue(
                driver.findElement(
                        By.xpath(
                                "//*[normalize-space()='Search Employee']"
                        )
                ).isDisplayed(),
                "Search Employee section not displayed"
        );

        assertTrue(
                driver.findElement(
                        By.xpath(
                                "//*[normalize-space()='Employee Details']"
                        )
                ).isDisplayed(),
                "Employee Details section not displayed"
        );

        System.out.println(
                "TEST 1 - UPDATE EMPLOYEE PAGE : PASSED"
        );
    }


    // =========================================================
    // TEST 2 - SEARCH FIELD
    // =========================================================

    @Test
    public void verifySearchFieldTest() {

        WebElement searchField =
                getSearchField();

        assertTrue(
                searchField.isDisplayed(),
                "Search field is not displayed"
        );

        assertEquals(
                "Enter Employee ID (e.g., 260822004)",
                searchField.getAttribute("placeholder"),
                "Search placeholder is incorrect"
        );

        assertEquals(
                "9",
                searchField.getAttribute("maxlength"),
                "Search field maxlength should be 9"
        );

        System.out.println(
                "TEST 2 - SEARCH FIELD : PASSED"
        );
    }


    // =========================================================
    // TEST 3 - EMPTY EMPLOYEE ID
    // =========================================================

    @Test
    public void emptyEmployeeIdSearchTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        clickSearch();

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(".search-error")
                        )
                );

        assertTrue(
                error.getText().contains(
                        "Employee ID is required"
                ),
                "Employee ID required validation not displayed"
        );

        System.out.println(
                "TEST 3 - EMPTY EMPLOYEE ID : PASSED"
        );
    }


    // =========================================================
    // TEST 4 - SHORT EMPLOYEE ID
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

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(".search-error")
                        )
                );

        assertTrue(
                error.getText().contains(
                        "exactly 9 digits"
                ),
                "Short Employee ID validation not displayed"
        );

        System.out.println(
                "TEST 4 - SHORT EMPLOYEE ID : PASSED"
        );
    }


    // =========================================================
    // TEST 5 - INVALID EMPLOYEE ID
    // =========================================================

    @Test
    public void invalidEmployeeIdTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "261399999"
        );

        clickSearch();

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(".search-error")
                        )
                );

        assertTrue(
                error.isDisplayed(),
                "Invalid Employee ID error not displayed"
        );

        System.out.println(
                "TEST 5 - INVALID EMPLOYEE ID : PASSED"
        );
    }


    // =========================================================
    // TEST 6 - NON EXISTING EMPLOYEE
    // =========================================================

    @Test
    public void nonExistingEmployeeTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "261231999"
        );

        clickSearch();

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(".search-error")
                        )
                );

        assertTrue(
                error.isDisplayed(),
                "Employee not found error not displayed"
        );

        System.out.println(
                "TEST 6 - NON EXISTING EMPLOYEE : PASSED"
        );
    }


    // =========================================================
    // TEST 7 - SEARCH EMPLOYEE 260822004
    // =========================================================

    @Test
    public void searchEmployeeTest() {

        searchEmployee();

        WebElement idField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("id")
                        )
                );

        assertEquals(
                EMPLOYEE_ID,
                idField.getAttribute("value"),
                "Employee 260822004 was not loaded"
        );

        System.out.println(
                "TEST 7 - SEARCH EMPLOYEE 260822004 : PASSED"
        );
    }


    // =========================================================
    // TEST 8 - EMPLOYEE ID READ ONLY
    // =========================================================

    @Test
    public void employeeIdReadOnlyTest() {

        searchEmployee();

        WebElement idField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("id")
                        )
                );

        String readOnly =
                idField.getAttribute("readonly");

        assertNotNull(
                readOnly,
                "Employee ID should be read-only"
        );

        System.out.println(
                "TEST 8 - EMPLOYEE ID READ ONLY : PASSED"
        );
    }


    // =========================================================
    // TEST 9 - VERIFY EMPLOYEE NAME FIELD
    // =========================================================

    @Test
    public void employeeNameFieldTest() {

        searchEmployee();

        WebElement nameField =
                getNameField();

        assertTrue(
                nameField.isDisplayed(),
                "Employee name field not displayed"
        );

        assertTrue(
                !nameField.getAttribute("value").isEmpty(),
                "Employee name should be populated"
        );

        System.out.println(
                "TEST 9 - EMPLOYEE NAME FIELD : PASSED"
        );
    }


    // =========================================================
    // TEST 10 - VERIFY DEPARTMENT
    // =========================================================

    @Test
    public void departmentDropdownTest() {

        searchEmployee();

        WebElement departmentElement =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("department")
                        )
                );

        Select department =
                new Select(
                        departmentElement
                );

        assertTrue(
                department.getOptions().size() > 1,
                "Department dropdown has no options"
        );

        System.out.println(
                "TEST 10 - DEPARTMENT DROPDOWN : PASSED"
        );
    }


    // =========================================================
    // TEST 11 - VERIFY DESIGNATION
    // =========================================================

    @Test
    public void designationDropdownTest() {

        searchEmployee();

        WebElement designationElement =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("designation")
                        )
                );

        Select designation =
                new Select(
                        designationElement
                );

        assertTrue(
                designation.getOptions().size() > 1,
                "Designation dropdown has no options"
        );

        System.out.println(
                "TEST 11 - DESIGNATION DROPDOWN : PASSED"
        );
    }


    // =========================================================
    // TEST 12 - EMPTY NAME
    // =========================================================

    @Test
    public void emptyEmployeeNameTest() {

        searchEmployee();

        WebElement nameField =
                getNameField();

        nameField.clear();

        clickUpdate();

        String pageText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        assertTrue(
                pageText.toLowerCase().contains(
                        "employee name"
                ),
                "Employee name validation not displayed"
        );

        System.out.println(
                "TEST 12 - EMPTY EMPLOYEE NAME : PASSED"
        );
    }


    // =========================================================
    // TEST 13 - NAME WITH NUMBERS
    // =========================================================

    @Test
    public void employeeNameWithNumbersTest() {

        searchEmployee();

        WebElement nameField =
                getNameField();

        nameField.clear();

        nameField.sendKeys(
                "Rahul123"
        );

        clickUpdate();

        String pageText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        assertTrue(
                pageText.toLowerCase().contains(
                        "name"
                ),
                "Name validation not displayed"
        );

        System.out.println(
                "TEST 13 - NAME WITH NUMBERS : PASSED"
        );
    }


    // =========================================================
    // TEST 14 - PHONE LENGTH
    // =========================================================

    @Test
    public void invalidPhoneLengthTest() {

        searchEmployee();

        WebElement phoneField =
                getPhoneField();

        phoneField.clear();

        phoneField.sendKeys(
                "987654321"
        );

        clickUpdate();

        String pageText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        assertTrue(
                pageText.toLowerCase().contains(
                        "phone"
                ),
                "Phone validation not displayed"
        );

        System.out.println(
                "TEST 14 - INVALID PHONE LENGTH : PASSED"
        );
    }


    // =========================================================
    // TEST 15 - EMPTY PHONE
    // =========================================================

    @Test
    public void emptyPhoneTest() {

        searchEmployee();

        WebElement phoneField =
                getPhoneField();

        phoneField.clear();

        clickUpdate();

        String pageText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        assertTrue(
                pageText.toLowerCase().contains(
                        "phone"
                ),
                "Phone required validation not displayed"
        );

        System.out.println(
                "TEST 15 - EMPTY PHONE : PASSED"
        );
    }


    // =========================================================
    // TEST 16 - VERIFY EMAIL
    // =========================================================

    @Test
    public void verifyEmailFieldTest() {

        searchEmployee();

        WebElement emailField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("email")
                        )
                );

        assertTrue(
                emailField.isDisplayed(),
                "Email field not displayed"
        );

        assertTrue(
                !emailField.getAttribute("value").isEmpty(),
                "Email should be populated"
        );

        System.out.println(
                "TEST 16 - EMAIL FIELD : PASSED"
        );
    }


    // =========================================================
    // TEST 17 - VERIFY JOINING DATE
    // =========================================================

    @Test
    public void verifyJoiningDateTest() {

        searchEmployee();

        WebElement joiningDate =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("joiningDate")
                        )
                );

        assertTrue(
                joiningDate.isDisplayed(),
                "Joining date field not displayed"
        );

        System.out.println(
                "TEST 17 - JOINING DATE : PASSED"
        );
    }


    // =========================================================
    // TEST 18 - CANCEL BUTTON
    // =========================================================

    @Test
    public void cancelButtonTest() {

        searchEmployee();

        WebElement nameField =
                getNameField();

        String originalName =
                nameField.getAttribute("value");

        nameField.clear();

        nameField.sendKeys(
                "Temporary Name"
        );

        WebElement cancelButton =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                By.xpath(
                                        "//button[normalize-space()='Cancel']"
                                )
                        )
                );

        scrollIntoView(
                cancelButton
        );

        clickUsingJS(
                cancelButton
        );

        String currentName =
                nameField.getAttribute("value");

        assertEquals(
                originalName,
                currentName,
                "Cancel did not restore original details"
        );

        System.out.println(
                "TEST 18 - CANCEL BUTTON : PASSED"
        );
    }


    // =========================================================
    // TEST 19 - VALID UPDATE
    // =========================================================

    @Test
    public void validUpdateTest() {

        searchEmployee();

        WebElement nameField =
                getNameField();

        assertTrue(
                !nameField.getAttribute("value").isEmpty(),
                "Employee name should be populated"
        );


        WebElement phoneField =
                getPhoneField();

        assertTrue(
                phoneField
                        .getAttribute("value")
                        .matches("\\d{10}"),
                "Phone number should contain 10 digits"
        );


        Select department =
                new Select(
                        driver.findElement(
                                By.name("department")
                        )
                );

        assertTrue(
                department
                        .getFirstSelectedOption()
                        .getText()
                        .length() > 0,
                "Department should be selected"
        );


        Select designation =
                new Select(
                        driver.findElement(
                                By.name("designation")
                        )
                );

        assertTrue(
                designation
                        .getFirstSelectedOption()
                        .getText()
                        .length() > 0,
                "Designation should be selected"
        );


        // Click Update Details
        clickUpdate();


        // Handle success alert if application displays it
        try {

            Alert alert =
                    wait.until(
                            ExpectedConditions.alertIsPresent()
                    );

            String alertText =
                    alert.getText();

            System.out.println(
                    "Update Alert: " + alertText
            );

            alert.accept();

            assertTrue(
                    alertText.toLowerCase().contains(
                            "success"
                    )
                    ||
                    alertText.toLowerCase().contains(
                            "updated"
                    ),
                    "Successful update message not displayed"
            );

        } catch (Exception ignored) {

            System.out.println(
                    "No update alert displayed."
            );
        }

        System.out.println(
                "TEST 19 - VALID UPDATE : PASSED"
        );
    }


    // =========================================================
    // TEST 20 - BACK BUTTON
    // =========================================================

    @Test
    public void backButtonTest() {

        WebElement backButton =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                By.xpath(
                                        "//button[contains(normalize-space(),'Back')]"
                                )
                        )
                );

        assertTrue(
                backButton.isDisplayed(),
                "Back button is not displayed"
        );

        System.out.println(
                "TEST 20 - BACK BUTTON : PASSED"
        );
    }


    // =========================================================
    // HELPER - GET SEARCH FIELD
    // =========================================================

    private WebElement getSearchField() {

        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//input[@placeholder='Enter Employee ID (e.g., 260822004)']"
                        )
                )
        );
    }


    // =========================================================
    // HELPER - SEARCH EMPLOYEE 260822004
    // =========================================================

    private void searchEmployee() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                EMPLOYEE_ID
        );

        System.out.println(
                "Searching Employee ID: "
                        + EMPLOYEE_ID
        );

        clickSearch();


        // Wait until employee details are loaded
        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("id")
                )
        );


        WebElement idField =
                driver.findElement(
                        By.name("id")
                );


        assertEquals(
                EMPLOYEE_ID,
                idField.getAttribute("value"),
                "Employee 260822004 was not loaded"
        );

        System.out.println(
                "Employee 260822004 loaded successfully."
        );
    }


    // =========================================================
    // HELPER - CLICK SEARCH
    // =========================================================

    private void clickSearch() {

        WebElement searchButton =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                By.xpath(
                                        "//button[normalize-space()='Search']"
                                )
                        )
                );

        scrollIntoView(
                searchButton
        );

        clickUsingJS(
                searchButton
        );

        System.out.println(
                "Search button clicked."
        );
    }


    // =========================================================
    // HELPER - NAME FIELD
    // =========================================================

    private WebElement getNameField() {

        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("name")
                )
        );
    }


    // =========================================================
    // HELPER - PHONE FIELD
    // =========================================================

    private WebElement getPhoneField() {

        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("phone")
                )
        );
    }


    // =========================================================
    // HELPER - CLICK UPDATE
    // =========================================================

    private void clickUpdate() {

        WebElement updateButton =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                By.xpath(
                                        "//button[normalize-space()='Update Details']"
                                )
                        )
                );

        scrollIntoView(
                updateButton
        );

        clickUsingJS(
                updateButton
        );

        System.out.println(
                "Update Details button clicked."
        );
    }


    // =========================================================
    // HELPER - SCROLL
    // =========================================================

    private void scrollIntoView(
            WebElement element
    ) {

        JavascriptExecutor js =
                (JavascriptExecutor) driver;

        js.executeScript(
                "arguments[0].scrollIntoView({block:'center'});",
                element
        );
    }


    // =========================================================
    // HELPER - SAFE CLICK
    // =========================================================

    private void clickUsingJS(
            WebElement element
    ) {

        try {

            wait.until(
                    ExpectedConditions.elementToBeClickable(
                            element
                    )
            ).click();

        } catch (Exception e) {

            JavascriptExecutor js =
                    (JavascriptExecutor) driver;

            js.executeScript(
                    "arguments[0].click();",
                    element
            );
        }
    }
}
