package com.test;

import java.time.Duration;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import org.openqa.selenium.Alert;
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

public class UpdateEmployeeTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private JavascriptExecutor js;

    private final String BASE_URL = "http://localhost:3000";


    // ============================================================
    // SETUP
    // ============================================================

    @Before
    public void setUp() {

        driver = new ChromeDriver();

        driver.manage().window().maximize();

        driver.manage().timeouts()
                .implicitlyWait(Duration.ofSeconds(2));

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(15)
        );

        js = (JavascriptExecutor) driver;

        driver.get(BASE_URL);

        wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.tagName("body")
                )
        );

        System.out.println("======================================");
        System.out.println("Application started");
        System.out.println("======================================");
    }


    // ============================================================
    // HELPER - SCROLL TO ELEMENT
    // ============================================================

    private void scrollToElement(WebElement element) {

        js.executeScript(
                "arguments[0].scrollIntoView({block:'center', inline:'center'});",
                element
        );

        try {

            Thread.sleep(300);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();
        }
    }


    // ============================================================
    // HELPER - SAFE CLICK
    // ============================================================

    private void safeClick(By locator) {

        WebElement element =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                locator
                        )
                );

        scrollToElement(element);

        try {

            wait.until(
                    ExpectedConditions.elementToBeClickable(
                            locator
                    )
            ).click();

        } catch (Exception e) {

            System.out.println(
                    "Normal click failed. Using JavaScript click."
            );

            js.executeScript(
                    "arguments[0].click();",
                    element
            );
        }
    }


    // ============================================================
    // HELPER - CLEAR AND TYPE
    // ============================================================

    private void clearAndType(
            By locator,
            String text
    ) {

        WebElement element =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                locator
                        )
                );

        scrollToElement(element);

        wait.until(
                ExpectedConditions.elementToBeClickable(
                        locator
                )
        );

        element.click();

        element.clear();

        element.sendKeys(text);
    }


    // ============================================================
    // HELPER - ACCEPT ALERT
    // ============================================================

    private String acceptAlert() {

        WebDriverWait alertWait =
                new WebDriverWait(
                        driver,
                        Duration.ofSeconds(5)
                );

        Alert alert =
                alertWait.until(
                        ExpectedConditions.alertIsPresent()
                );

        String text = alert.getText();

        System.out.println(
                "Alert message: " + text
        );

        alert.accept();

        return text;
    }


    // ============================================================
    // NAVIGATION
    //
    // Home
    //    ↓
    // Login
    //    ↓
    // HR Mgmt
    //    ↓
    // HR Management
    //    ↓
    // Update Details
    //    ↓
    // Update Employee Details
    // ============================================================

    private void navigateToUpdateEmployeePage() {

        System.out.println("");
        System.out.println(
                "Starting navigation..."
        );


        // --------------------------------------------------------
        // STEP 1 - HOME
        // --------------------------------------------------------

        wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.tagName("body")
                )
        );

        System.out.println(
                "STEP 1: Home page opened"
        );


        // --------------------------------------------------------
        // STEP 2 - LOGIN
        // --------------------------------------------------------

        By loginButton =
                By.xpath(
                        "//button[normalize-space()='Login']"
                );

        safeClick(loginButton);

        System.out.println(
                "STEP 2: Login button clicked"
        );


        // --------------------------------------------------------
        // STEP 3 - LOGIN PAGE
        // --------------------------------------------------------

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='Login']"
                        )
                )
        );

        System.out.println(
                "STEP 3: Login page opened"
        );


        // --------------------------------------------------------
        // IMPORTANT:
        // DO NOT ENTER USERNAME OR PASSWORD
        // --------------------------------------------------------

        By hrMgmtButton =
                By.xpath(
                        "//button[normalize-space()='HR Mgmt']"
                );

        safeClick(hrMgmtButton);

        System.out.println(
                "STEP 4: HR Mgmt clicked without credentials"
        );


        // --------------------------------------------------------
        // STEP 5 - HR MANAGEMENT PAGE
        // --------------------------------------------------------

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


        // --------------------------------------------------------
        // STEP 6 - UPDATE DETAILS
        // --------------------------------------------------------

        By updateDetailsButton =
                By.xpath(
                        "//button[normalize-space()='Update Details']"
                );

        safeClick(updateDetailsButton);

        System.out.println(
                "STEP 6: Update Details clicked"
        );


        // --------------------------------------------------------
        // STEP 7 - UPDATE EMPLOYEE PAGE
        // --------------------------------------------------------

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
    }


    // ============================================================
    // HELPER - SEARCH EMPLOYEE
    // ============================================================

    private void searchEmployee(String employeeId) {

        By searchInput =
                By.xpath(
                        "//input[@placeholder='Enter Employee ID (e.g., EMP001)']"
                );

        clearAndType(
                searchInput,
                employeeId
        );

        System.out.println(
                "Entered Employee ID: " + employeeId
        );


        By searchButton =
                By.xpath(
                        "//button[normalize-space()='Search']"
                );

        safeClick(searchButton);

        System.out.println(
                "Search button clicked"
        );


        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='Employee Details']"
                        )
                )
        );
    }


    // ============================================================
    // TEST 1
    // NAVIGATION TO UPDATE EMPLOYEE
    // ============================================================

    @Test
    public void testNavigationToUpdateEmployee() {

        navigateToUpdateEmployeePage();

        WebElement heading =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.xpath(
                                        "//*[normalize-space()='Update Employee Details']"
                                )
                        )
                );

        assertTrue(
                heading.isDisplayed()
        );

        System.out.println(
                "PASS: Navigation to Update Employee Details"
        );
    }


    // ============================================================
    // TEST 2
    // SEARCH EMP001
    // ============================================================

    @Test
    public void testSearchEmployeeEMP001() {

        navigateToUpdateEmployeePage();

        searchEmployee("EMP001");

        By employeeIdField =
                By.cssSelector(
                        "input[readonly]"
                );

        WebElement employeeId =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                employeeIdField
                        )
                );

        assertEquals(
                "EMP001",
                employeeId.getAttribute("value")
        );

        System.out.println(
                "PASS: EMP001 searched successfully"
        );
    }


    // ============================================================
    // TEST 3
    // VERIFY EMPLOYEE NAME
    // ============================================================

    @Test
    public void testEmployeeNameDisplayed() {

        navigateToUpdateEmployeePage();

        searchEmployee("EMP001");

        By nameInput =
                By.name("name");

        WebElement name =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                nameInput
                        )
                );

        assertEquals(
                "Emp1",
                name.getAttribute("value")
        );

        System.out.println(
                "PASS: Employee name displayed correctly"
        );
    }


    // ============================================================
    // TEST 4
    // VERIFY DEPARTMENT
    // ============================================================

    @Test
    public void testDepartmentDisplayed() {

        navigateToUpdateEmployeePage();

        searchEmployee("EMP001");

        By department =
                By.name("department");

        WebElement departmentElement =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                department
                        )
                );

        Select select =
                new Select(departmentElement);

        assertEquals(
                "IT",
                select
                        .getFirstSelectedOption()
                        .getText()
        );

        System.out.println(
                "PASS: Department displayed correctly"
        );
    }


    // ============================================================
    // TEST 5
    // VERIFY DESIGNATION
    // ============================================================

    @Test
    public void testDesignationDisplayed() {

        navigateToUpdateEmployeePage();

        searchEmployee("EMP001");

        By designation =
                By.name("designation");

        WebElement designationElement =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                designation
                        )
                );

        Select select =
                new Select(designationElement);

        assertEquals(
                "Developer",
                select
                        .getFirstSelectedOption()
                        .getText()
        );

        System.out.println(
                "PASS: Designation displayed correctly"
        );
    }


    // ============================================================
    // TEST 6
    // VERIFY PHONE
    // ============================================================

    @Test
    public void testPhoneDisplayed() {

        navigateToUpdateEmployeePage();

        searchEmployee("EMP001");

        By phone =
                By.name("phone");

        WebElement phoneElement =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                phone
                        )
                );

        assertEquals(
                "9876543210",
                phoneElement.getAttribute("value")
        );

        System.out.println(
                "PASS: Phone number displayed correctly"
        );
    }


    // ============================================================
    // TEST 7
    // INVALID EMPLOYEE ID
    // ============================================================

    @Test
    public void testInvalidEmployeeId() {

        navigateToUpdateEmployeePage();

        System.out.println(
                "Testing invalid Employee ID..."
        );


        By searchInput =
                By.xpath(
                        "//input[@placeholder='Enter Employee ID (e.g., EMP001)']"
                );

        WebElement input =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                searchInput
                        )
                );

        scrollToElement(input);

        input.click();

        input.clear();

        input.sendKeys(
                "ABC123"
        );


        System.out.println(
                "Entered invalid ID: ABC123"
        );


        By searchButton =
                By.xpath(
                        "//button[normalize-space()='Search']"
                );

        WebElement button =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                searchButton
                        )
                );

        scrollToElement(button);

        js.executeScript(
                "arguments[0].click();",
                button
        );


        System.out.println(
                "Search button clicked"
        );


        By errorMessage =
                By.cssSelector(
                        ".search-error"
                );

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                errorMessage
                        )
                );

        String actualMessage =
                error.getText();

        System.out.println(
                "Validation message: "
                        + actualMessage
        );


        assertTrue(
                "Expected Employee ID validation message, but got: "
                        + actualMessage,

                actualMessage.contains(
                        "Employee ID must start with"
                )
        );


        System.out.println(
                "PASS: Invalid Employee ID validation"
        );
    }


    // ============================================================
    // TEST 8
    // EMPTY EMPLOYEE ID
    // ============================================================

    @Test
    public void testEmptyEmployeeId() {

        navigateToUpdateEmployeePage();

        System.out.println(
                "Testing empty Employee ID..."
        );


        By searchInput =
                By.xpath(
                        "//input[@placeholder='Enter Employee ID (e.g., EMP001)']"
                );

        WebElement input =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                searchInput
                        )
                );

        scrollToElement(input);

        input.click();

        input.clear();


        By searchButton =
                By.xpath(
                        "//button[normalize-space()='Search']"
                );

        WebElement button =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                searchButton
                        )
                );

        scrollToElement(button);

        js.executeScript(
                "arguments[0].click();",
                button
        );


        System.out.println(
                "Search button clicked"
        );


        By errorMessage =
                By.cssSelector(
                        ".search-error"
                );

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                errorMessage
                        )
                );

        String actualMessage =
                error.getText();


        assertTrue(
                "Expected empty Employee ID validation message, but got: "
                        + actualMessage,

                actualMessage.contains(
                        "Please enter an Employee ID to search"
                )
        );


        System.out.println(
                "PASS: Empty Employee ID validation"
        );
    }


    // ============================================================
    // TEST 9
    // EDIT EMPLOYEE NAME
    // ============================================================

    @Test
    public void testEditEmployeeName() {

        navigateToUpdateEmployeePage();

        searchEmployee("EMP001");

        By name =
                By.name("name");

        clearAndType(
                name,
                "Emp Updated"
        );

        WebElement nameElement =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                name
                        )
                );

        assertEquals(
                "Emp Updated",
                nameElement.getAttribute("value")
        );

        System.out.println(
                "PASS: Employee name edited"
        );
    }


    // ============================================================
    // TEST 10
    // EDIT PHONE NUMBER
    // ============================================================

    @Test
    public void testEditPhoneNumber() {

        navigateToUpdateEmployeePage();

        searchEmployee("EMP001");

        By phone =
                By.name("phone");

        clearAndType(
                phone,
                "9123456789"
        );

        WebElement phoneElement =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                phone
                        )
                );

        assertEquals(
                "9123456789",
                phoneElement.getAttribute("value")
        );

        System.out.println(
                "PASS: Phone number edited"
        );
    }


    // ============================================================
    // TEST 11
    // INVALID PHONE NUMBER
    // ============================================================

    @Test
    public void testInvalidPhoneNumber() {

        navigateToUpdateEmployeePage();

        searchEmployee("EMP001");

        By phone =
                By.name("phone");

        clearAndType(
                phone,
                "12345"
        );


        safeClick(
                By.xpath(
                        "//button[normalize-space()='Update Details']"
                )
        );


        By error =
                By.xpath(
                        "//*[contains(text(),'Phone number must be exactly 10 digits')]"
                );


        WebElement errorElement =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                error
                        )
                );


        assertTrue(
                errorElement.isDisplayed()
        );


        System.out.println(
                "PASS: Invalid phone validation"
        );
    }


    // ============================================================
    // TEST 12
    // CANCEL BUTTON
    // ============================================================

    @Test
    public void testCancelButton() {

        navigateToUpdateEmployeePage();

        searchEmployee("EMP001");


        // Change name temporarily
        clearAndType(
                By.name("name"),
                "Temporary Name"
        );


        // Click Cancel
        safeClick(
                By.xpath(
                        "//button[normalize-space()='Cancel']"
                )
        );


        // Verify original value returned
        WebElement name =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("name")
                        )
                );


        assertEquals(
                "Emp1",
                name.getAttribute("value")
        );


        System.out.println(
                "PASS: Cancel restored original details"
        );
    }


    // ============================================================
    // TEST 13
    // COMPLETE UPDATE
    // ============================================================

    @Test
    public void testUpdateEmployeeDetails() {

        navigateToUpdateEmployeePage();

        searchEmployee("EMP001");


        // --------------------------------------------------------
        // CHANGE NAME
        // --------------------------------------------------------

        clearAndType(
                By.name("name"),
                "Emp Updated"
        );


        // --------------------------------------------------------
        // CHANGE DEPARTMENT
        // --------------------------------------------------------

        Select department =
                new Select(
                        wait.until(
                                ExpectedConditions.visibilityOfElementLocated(
                                        By.name("department")
                                )
                        )
                );

        department.selectByVisibleText(
                "HR"
        );


        // --------------------------------------------------------
        // CHANGE DESIGNATION
        // --------------------------------------------------------

        Select designation =
                new Select(
                        wait.until(
                                ExpectedConditions.visibilityOfElementLocated(
                                        By.name("designation")
                                )
                        )
                );

        designation.selectByVisibleText(
                "Manager"
        );


        // --------------------------------------------------------
        // CHANGE PHONE
        // --------------------------------------------------------

        clearAndType(
                By.name("phone"),
                "9123456789"
        );


        // --------------------------------------------------------
        // CLICK UPDATE DETAILS
        // --------------------------------------------------------

        safeClick(
                By.xpath(
                        "//button[normalize-space()='Update Details']"
                )
        );


        System.out.println(
                "Update Details clicked"
        );


        // --------------------------------------------------------
        // JAVASCRIPT SUCCESS ALERT
        // --------------------------------------------------------

        String alertText =
                acceptAlert();


        System.out.println(
                "Success alert: "
                        + alertText
        );


        assertTrue(
                "Update success alert not found",

                alertText.contains(
                        "Employee EMP001 updated successfully!"
                )
        );


        // --------------------------------------------------------
        // VERIFY SUCCESS MESSAGE
        // --------------------------------------------------------

        By successMessage =
                By.xpath(
                        "//*[contains(text(),'Employee details updated successfully')]"
                );


        WebElement success =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                successMessage
                        )
                );


        assertTrue(
                success.isDisplayed()
        );


        // --------------------------------------------------------
        // VERIFY UPDATED NAME
        // --------------------------------------------------------

        WebElement updatedName =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("name")
                        )
                );


        assertEquals(
                "Emp Updated",
                updatedName.getAttribute("value")
        );


        // --------------------------------------------------------
        // VERIFY UPDATED DEPARTMENT
        // --------------------------------------------------------

        Select updatedDepartment =
                new Select(
                        driver.findElement(
                                By.name("department")
                        )
                );


        assertEquals(
                "HR",
                updatedDepartment
                        .getFirstSelectedOption()
                        .getText()
        );


        // --------------------------------------------------------
        // VERIFY UPDATED DESIGNATION
        // --------------------------------------------------------

        Select updatedDesignation =
                new Select(
                        driver.findElement(
                                By.name("designation")
                        )
                );


        assertEquals(
                "Manager",
                updatedDesignation
                        .getFirstSelectedOption()
                        .getText()
        );


        // --------------------------------------------------------
        // VERIFY UPDATED PHONE
        // --------------------------------------------------------

        WebElement updatedPhone =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("phone")
                        )
                );


        assertEquals(
                "9123456789",
                updatedPhone.getAttribute("value")
        );


        System.out.println(
                "PASS: Employee updated successfully"
        );
    }


    // ============================================================
    // CLEANUP
    // ============================================================

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
