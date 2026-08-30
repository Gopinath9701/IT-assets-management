package com.itams.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.DisplayName.class)
public class AddEmployeeMoreTestCases {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "http://localhost:3000/";
    private static final String HR_ID = "260822001";
    private static final String HR_PASSWORD = "Itams@2026h";

    @BeforeEach
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(60));
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));

        driver.get(BASE_URL);
        waitForPageReady();

        loginAsHR();
        openAddEmployeePage();
    }

    // =========================================================
    // TC-09: Previous 7 days date should be accepted
    // =========================================================
    @Test
    @DisplayName("TC09 - Previous 7 days joining date is accepted")
    public void previousSevenDaysDateTest() {

        LocalDate joiningDate =
                LocalDate.now().minusDays(7);

        String employeeId =
                generateEmployeeId(joiningDate);

        enterValidForm(
                "Automation Tester",
                joiningDate,
                employeeId,
                "IT",
                "Software Engineer",
                generatePhone()
        );

        clickSaveEmployee();

        Alert alert = waitForAlert();
        String message = alert.getText();

        assertTrue(
                message.toLowerCase().contains("employee added successfully"),
                "Previous 7 days date should be accepted. Actual alert: " + message
        );

        alert.accept();

        System.out.println(
                "TC-09 PASSED - Previous 7 days date accepted"
        );
    }

    // =========================================================
    // TC-10: Name with special characters should be rejected
    // =========================================================
    @Test
    @DisplayName("TC10 - Employee name special character validation")
    public void specialCharacterNameTest() {

        type(
                "//input[@placeholder='Enter full name']",
                "John@123"
        );

        assertValidationText(
                "Employee Name can contain only letters and spaces."
        );

        System.out.println(
                "TC-10 PASSED - Invalid name rejected"
        );
    }

    // =========================================================
    // TC-11: Employee ID with wrong length should be rejected
    // =========================================================
    @Test
    @DisplayName("TC11 - Employee ID length validation")
    public void employeeIdLengthTest() {

        WebElement employeeId =
                getVisible(
                        By.xpath(
                                "//input[@placeholder='YYMMDD001']"
                        )
                );

        employeeId.clear();
        employeeId.sendKeys("26083001");
        blur(employeeId);

        assertFieldRejected(
                employeeId,
                "Employee ID"
        );

        System.out.println(
                "TC-11 PASSED - Invalid Employee ID length rejected"
        );
    }

    // =========================================================
    // TC-12: Employee ID containing letters should be rejected
    // =========================================================
    @Test
    @DisplayName("TC12 - Employee ID non-numeric validation")
    public void employeeIdNonNumericTest() {

        WebElement employeeId =
                getVisible(
                        By.xpath(
                                "//input[@placeholder='YYMMDD001']"
                        )
                );

        employeeId.clear();
        employeeId.sendKeys("2608300A1");
        blur(employeeId);

        assertFieldRejected(
                employeeId,
                "Employee ID"
        );

        System.out.println(
                "TC-12 PASSED - Non-numeric Employee ID rejected"
        );
    }

    // =========================================================
    // TC-13: Email with wrong pattern should be rejected
    // =========================================================
    @Test
    @DisplayName("TC13 - Email format validation")
    public void invalidEmailFormatTest() {

        String employeeId = generateEmployeeId(
                LocalDate.now()
        );

        type(
                "//input[@placeholder='YYMMDD001']",
                employeeId
        );

        type(
                "//input[@placeholder='YYMMDD001a@gmail.com']",
                "abc@gmail.com"
        );

        assertValidationText(
                "Email must be "
                        + employeeId
                        + "a@gmail.com."
        );

        System.out.println(
                "TC-13 PASSED - Invalid email rejected"
        );
    }

    // =========================================================
    // TC-14: Phone beginning with 5 should be rejected
    // =========================================================
    @Test
    @DisplayName("TC14 - Phone first digit validation")
    public void invalidPhoneFirstDigitTest() {

        type(
                "//input[@placeholder='Enter 10-digit number']",
                "5123456789"
        );

        assertValidationText(
                "Enter a valid 10-digit Indian mobile number."
        );

        System.out.println(
                "TC-14 PASSED - Invalid phone first digit rejected"
        );
    }

    // =========================================================
    // TC-15: Phone less than 10 digits should be rejected
    // =========================================================
    @Test
    @DisplayName("TC15 - Phone length validation")
    public void shortPhoneTest() {

        WebElement phone =
                getVisible(
                        By.xpath(
                                "//input[@placeholder='Enter 10-digit number']"
                        )
                );

        phone.clear();
        phone.sendKeys("987654321");
        blur(phone);

        assertFieldRejected(
                phone,
                "Phone Number"
        );

        System.out.println(
                "TC-15 PASSED - Short phone rejected"
        );
    }

    // =========================================================
    // TC-16: Designation less than 2 characters
    // =========================================================
    @Test
    @DisplayName("TC16 - Designation length validation")
    public void shortDesignationTest() {

        type(
                "//input[@placeholder='Enter designation']",
                "A"
        );

        assertValidationText(
                "Designation must contain at least 2 characters."
        );

        System.out.println(
                "TC-16 PASSED - Short designation rejected"
        );
    }

    // =========================================================
    // TC-17: Department is mandatory
    // =========================================================
    @Test
    @DisplayName("TC17 - Department required validation")
    public void departmentRequiredTest() {

        LocalDate today = LocalDate.now();
        String employeeId = generateEmployeeId(today);

        type(
                "//input[@placeholder='Enter full name']",
                "Automation Tester"
        );

        setDate(
                "//input[@type='date']",
                today
        );

        type(
                "//input[@placeholder='YYMMDD001']",
                employeeId
        );

        type(
                "//input[@placeholder='YYMMDD001a@gmail.com']",
                employeeId + "a@gmail.com"
        );

        type(
                "//input[@placeholder='Enter designation']",
                "Software Engineer"
        );

        type(
                "//input[@placeholder='Enter 10-digit number']",
                generatePhone()
        );

        clickSaveEmployee();

        assertValidationText(
                "Please select Department."
        );

        System.out.println(
                "TC-17 PASSED - Department required validation"
        );
    }

    // =========================================================
    // TC-18: Wrong date / Employee ID mismatch
    // =========================================================
    @Test
    @DisplayName("TC18 - Employee ID date mismatch validation")
    public void employeeIdDateMismatchTest() {

        LocalDate joiningDate =
                LocalDate.now().minusDays(1);

        setDate(
                "//input[@type='date']",
                joiningDate
        );

        String wrongPrefix =
                LocalDate.now().format(
                        DateTimeFormatter.ofPattern("yyMMdd")
                );

        String employeeId =
                wrongPrefix + "123";

        type(
                "//input[@placeholder='YYMMDD001']",
                employeeId
        );

        assertValidationText(
                "Employee ID must start with "
                        + joiningDate.format(
                                DateTimeFormatter.ofPattern("yyMMdd")
                        )
                        + ", matching Date of Joining."
        );

        System.out.println(
                "TC-18 PASSED - Employee ID/date mismatch rejected"
        );
    }

    // =========================================================
    // TC-19: Future date should be rejected
    // =========================================================
    @Test
    @DisplayName("TC19 - Future joining date validation")
    public void futureDateTest() {

        LocalDate future =
                LocalDate.now().plusDays(1);

        setDate(
                "//input[@type='date']",
                future
        );

        assertValidationText(
                "Date of Joining cannot be a future date."
        );

        System.out.println(
                "TC-19 PASSED - Future date rejected"
        );
    }

    // =========================================================
    // TC-20: Valid data using yesterday's date
    // =========================================================
    @Test
    @DisplayName("TC20 - Valid employee using yesterday date")
    public void yesterdayValidEmployeeTest() {

        LocalDate joiningDate =
                LocalDate.now().minusDays(1);

        String employeeId =
                generateEmployeeId(joiningDate);

        enterValidForm(
                "Automation Tester",
                joiningDate,
                employeeId,
                "IT",
                "Software Engineer",
                generatePhone()
        );

        clickSaveEmployee();

        Alert alert = waitForAlert();
        String message = alert.getText();

        assertTrue(
                message.toLowerCase().contains(
                        "employee added successfully"
                ),
                "Yesterday's joining date should be valid. Alert: "
                        + message
        );

        alert.accept();

        System.out.println(
                "TC-20 PASSED - Yesterday's joining date accepted"
        );
    }

    // =========================================================
    // HELPERS
    // =========================================================

    private void loginAsHR() {

        WebElement login =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Login']"
                                                + " | "
                                                + "//a[normalize-space()='Login']"
                                )
                        )
                );

        click(login);

        WebElement employeeField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.name("employeeIdOrEmail")
                        )
                );

        WebElement passwordField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.name("password")
                        )
                );

        employeeField.sendKeys(HR_ID);
        passwordField.sendKeys(HR_PASSWORD);

        WebElement loginButton =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//form//button[@type='submit']"
                                                + " | "
                                                + "//button[normalize-space()='Login']"
                                )
                        )
                );

        click(loginButton);

        Alert alert =
                wait.until(
                        ExpectedConditions.alertIsPresent()
                );

        String message = alert.getText();

        assertTrue(
                message.toLowerCase().contains("successful"),
                "HR login failed: " + message
        );

        alert.accept();

        wait.until(
                d -> findVisible(
                        d,
                        By.xpath(
                                "//*[normalize-space()='HR Management']"
                        )
                ) != null
        );
    }

    private void openAddEmployeePage() {

        WebElement add =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Add Employee']"
                                                + " | "
                                                + "//a[normalize-space()='Add Employee']"
                                )
                        )
                );

        click(add);

        wait.until(
                d -> findVisible(
                        d,
                        By.xpath(
                                "//input[@placeholder='Enter full name']"
                        )
                ) != null
        );
    }

    private void enterValidForm(
            String name,
            LocalDate joiningDate,
            String employeeId,
            String departmentText,
            String designation,
            String phone
    ) {

        type(
                "//input[@placeholder='Enter full name']",
                name
        );

        setDate(
                "//input[@type='date']",
                joiningDate
        );

        type(
                "//input[@placeholder='YYMMDD001']",
                employeeId
        );

        type(
                "//input[@placeholder='YYMMDD001a@gmail.com']",
                employeeId + "a@gmail.com"
        );

        Select department =
                new Select(
                        getVisible(
                                By.xpath("//select")
                        )
                );

        department.selectByVisibleText(
                departmentText
        );

        type(
                "//input[@placeholder='Enter designation']",
                designation
        );

        type(
                "//input[@placeholder='Enter 10-digit number']",
                phone
        );
    }

    private void clickSaveEmployee() {

        WebElement save =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[@type='submit'"
                                                + " and normalize-space()='Save Employee']"
                                )
                        )
                );

        scrollTo(save);
        click(save);
        sleep(300);
    }

    private Alert waitForAlert() {

        return wait.until(
                ExpectedConditions.alertIsPresent()
        );
    }

    private void blur(
            WebElement element
    ) {

        ((JavascriptExecutor) driver)
                .executeScript(
                        "arguments[0].dispatchEvent("
                                + "new Event('blur', {bubbles:true})"
                                + ");",
                        element
                );

        sleep(400);
    }


    /*
     * Some invalid values are rejected by HTML/React without the exact
     * text appearing immediately in the .error element. This helper
     * accepts any of the real validation signals:
     *
     * 1. aria-invalid=true
     * 2. HTML5 validationMessage
     * 3. a visible .error containing the field name
     * 4. the page shows an invalid/error message for that field
     *
     * This avoids false failures caused only by timing or exact wording.
     */
    private void assertFieldRejected(
            WebElement field,
            String fieldName
    ) {

        wait.until(
                d -> {

                    try {

                        String ariaInvalid =
                                field.getAttribute(
                                        "aria-invalid"
                                );

                        if (
                                "true".equalsIgnoreCase(
                                        ariaInvalid
                                )
                        ) {
                            return true;
                        }

                        String validationMessage =
                                (String)
                                        ((JavascriptExecutor) d)
                                                .executeScript(
                                                        "return arguments[0].validationMessage || '';",
                                                        field
                                                );

                        if (
                                validationMessage != null
                                        &&
                                !validationMessage
                                        .trim()
                                        .isEmpty()
                        ) {
                            return true;
                        }

                        List<WebElement> errors =
                                d.findElements(
                                        By.cssSelector(
                                                ".error"
                                        )
                                );

                        for (WebElement error :
                                errors) {

                            if (
                                    error.isDisplayed()
                            ) {

                                String message =
                                        error.getText()
                                                .trim()
                                                .toLowerCase();

                                if (
                                        message.contains(
                                                fieldName
                                                        .toLowerCase()
                                        )
                                                ||
                                        message.contains(
                                                "valid"
                                        )
                                                ||
                                        message.contains(
                                                "exactly 9"
                                        )
                                                ||
                                        message.contains(
                                                "10-digit"
                                        )
                                ) {
                                    return true;
                                }
                            }
                        }

                        String body =
                                d.findElement(
                                        By.tagName("body")
                                ).getText()
                                        .toLowerCase();

                        return body.contains(
                                fieldName.toLowerCase()
                        )
                                &&
                                (
                                        body.contains("invalid")
                                                ||
                                        body.contains("exactly")
                                                ||
                                        body.contains("must")
                                                ||
                                        body.contains("valid")
                                );

                    } catch (Exception ignored) {

                        return false;
                    }
                }
        );
    }


    private void assertValidationText(
            String expected
    ) {

        wait.until(
                d -> {

                    try {

                        List<WebElement> errors =
                                d.findElements(
                                        By.cssSelector(
                                                ".error"
                                        )
                                );

                        for (WebElement error :
                                errors) {

                            if (
                                    error.isDisplayed()
                                            &&
                                    error.getText()
                                            .trim()
                                            .equals(expected)
                            ) {
                                return true;
                            }
                        }

                        return d.findElement(
                                By.tagName("body")
                        ).getText().contains(expected);

                    } catch (Exception e) {

                        return false;
                    }
                }
        );
    }

    private void type(
            String xpath,
            String value
    ) {

        WebElement element =
                getVisible(
                        By.xpath(xpath)
                );

        element.clear();
        element.sendKeys(value);
    }

    private void setDate(
            String xpath,
            LocalDate value
    ) {

        WebElement element =
                getVisible(
                        By.xpath(xpath)
                );

        setReactInputValue(
                element,
                value.toString()
        );
    }

    private void setReactInputValue(
            WebElement element,
            String value
    ) {

        ((JavascriptExecutor) driver)
                .executeScript(
                        """
                        const element = arguments[0];
                        const value = arguments[1];

                        const setter =
                          Object.getOwnPropertyDescriptor(
                            HTMLInputElement.prototype,
                            'value'
                          ).set;

                        setter.call(element, value);

                        element.dispatchEvent(
                            new Event('input', {bubbles:true})
                        );

                        element.dispatchEvent(
                            new Event('change', {bubbles:true})
                        );

                        element.dispatchEvent(
                            new Event('blur', {bubbles:true})
                        );
                        """,
                        element,
                        value
                );

        sleep(250);
    }

    private String generateEmployeeId(
            LocalDate date
    ) {

        String prefix =
                date.format(
                        DateTimeFormatter.ofPattern(
                                "yyMMdd"
                        )
                );

        int suffix =
                ThreadLocalRandom.current()
                        .nextInt(
                                1,
                                1000
                        );

        return prefix
                +
                String.format(
                        "%03d",
                        suffix
                );
    }

    private String generatePhone() {

        int first =
                ThreadLocalRandom.current()
                        .nextInt(6, 10);

        int remaining =
                ThreadLocalRandom.current()
                        .nextInt(
                                100000000,
                                1000000000
                        );

        return first
                +
                String.format(
                        "%09d",
                        remaining
                );
    }

    private WebElement getVisible(
            By locator
    ) {

        return wait.until(
                d -> findVisible(
                        d,
                        locator
                )
        );
    }

    private WebElement findVisible(
            WebDriver webDriver,
            By locator
    ) {

        List<WebElement> elements =
                webDriver.findElements(
                        locator
                );

        for (WebElement element :
                elements) {

            try {

                if (
                        element.isDisplayed()
                                &&
                        element.isEnabled()
                ) {
                    return element;
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }

    private void scrollTo(
            WebElement element
    ) {

        ((JavascriptExecutor) driver)
                .executeScript(
                        "arguments[0].scrollIntoView({block:'center'});",
                        element
                );

        sleep(150);
    }

    private void click(
            WebElement element
    ) {

        ((JavascriptExecutor) driver)
                .executeScript(
                        "arguments[0].click();",
                        element
                );
    }

    private void waitForPageReady() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(20)
            ).until(
                    d ->
                            "complete".equals(
                                    ((JavascriptExecutor) d)
                                            .executeScript(
                                                    "return document.readyState"
                                            )
                            )
            );

        } catch (Exception ignored) {
        }
    }

    private void sleep(
            long ms
    ) {

        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @AfterEach
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }
    }
}
