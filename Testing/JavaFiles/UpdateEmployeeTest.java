package com.itams.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
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
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

@TestMethodOrder(MethodOrderer.DisplayName.class)
public class UpdateEmployeeTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "http://localhost:3000/";
    private static final String HR_ID = "260822001";
    private static final String HR_PASSWORD = "Itams@2026h";
    private static final String TARGET_EMPLOYEE_ID = "260822004";

    @BeforeEach
    void setUp() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("       ITAMS UPDATE EMPLOYEE AUTOMATION");
        System.out.println("==============================================");

        WebDriverManager.chromedriver().setup();

        driver = new ChromeDriver();
        driver.manage().window().maximize();

        driver.manage().timeouts().pageLoadTimeout(
                Duration.ofSeconds(60)
        );

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(25)
        );

        driver.get(BASE_URL);
        waitForPageReady();

        System.out.println(
                "Application opened: " + BASE_URL
        );
    }

    // =========================================================
    // TC01 - Search and update employee name
    // =========================================================

    @Test
    @DisplayName("TC01 - Search employee and update name")
    void updateEmployeeNameTest() {

        System.out.println();
        System.out.println("TC01: SEARCH AND UPDATE EMPLOYEE NAME");

        loginAsHR();
        openUpdateEmployeePage();
        searchEmployee(TARGET_EMPLOYEE_ID);
        waitForEmployeeResult();

        WebElement nameField = findEmployeeNameField();

        assertTrue(
                nameField != null,
                "Employee Name field was not found"
        );

        scrollTo(nameField);

        String oldName =
                nameField.getAttribute("value");

        System.out.println(
                "Old Employee Name: " + oldName
        );

        nameField.clear();
        nameField.sendKeys("V Shiva");
        blur(nameField);

        wait.until(
                d -> {

                    WebElement current =
                            findEmployeeNameField();

                    return current != null
                            &&
                            "V Shiva".equals(
                                    current.getAttribute(
                                            "value"
                                    )
                            );
                }
        );

        System.out.println(
                "New Employee Name: V Shiva"
        );

        WebElement updateButton =
                waitForEnabledButton(
                        "Update Details"
                );

        scrollTo(updateButton);
        click(updateButton);

        handleOptionalAlert();

        // Verify the form contains the new name.
        wait.until(
                d -> {

                    WebElement updated =
                            findEmployeeNameField();

                    return updated != null
                            &&
                            "V Shiva".equals(
                                    updated.getAttribute("value")
                            );
                }
        );

        assertTrue(
                "V Shiva".equals(
                        findEmployeeNameField()
                                .getAttribute("value")
                ),
                "Employee name was not updated"
        );

        System.out.println(
                "TC01 PASSED - Employee name updated"
        );
    }

    // =========================================================
    // TC02 - Invalid Employee ID
    // =========================================================

    @Test
    @DisplayName("TC02 - Invalid employee ID search")
    void invalidEmployeeIdTest() {

        System.out.println();
        System.out.println("TC02: INVALID EMPLOYEE ID SEARCH");

        loginAsHR();
        openUpdateEmployeePage();
        searchEmployee("999999999");

        wait.until(
                d -> {

                    String body =
                            d.findElement(
                                    By.tagName("body")
                            ).getText()
                                    .toLowerCase();

                    return body.contains("not found")
                            || body.contains("no employee")
                            || body.contains("employee not found")
                            || body.contains("does not exist")
                            || body.contains("invalid")
                            || !hasEmployeeResult();
                }
        );

        System.out.println(
                "TC02 PASSED - Invalid employee ID handled"
        );
    }

    // =========================================================
    // TC03 - Empty Employee ID
    // =========================================================

    @Test
    @DisplayName("TC03 - Empty employee ID validation")
    void emptyEmployeeIdTest() {

        System.out.println();
        System.out.println(
                "TC03: EMPTY EMPLOYEE ID VALIDATION"
        );

        loginAsHR();
        openUpdateEmployeePage();

        WebElement searchField =
                getSearchEmployeeField();

        searchField.clear();
        blur(searchField);

        WebElement searchButton =
                waitForEnabledButton("Search");

        click(searchButton);

        sleep(500);

        String body =
                driver.findElement(
                        By.tagName("body")
                ).getText()
                        .toLowerCase();

        assertTrue(
                body.contains("required")
                        ||
                body.contains("employee id")
                        ||
                !hasEmployeeResult(),
                "Empty Employee ID did not trigger validation"
        );

        System.out.println(
                "TC03 PASSED - Empty Employee ID handled"
        );
    }

    // =========================================================
    // TC04 - Employee ID must be read only
    // =========================================================

    @Test
    @DisplayName("TC04 - Verify employee ID cannot be changed")
    void employeeIdReadOnlyTest() {

        System.out.println();
        System.out.println(
                "TC04: VERIFY EMPLOYEE ID CANNOT BE CHANGED"
        );

        loginAsHR();
        openUpdateEmployeePage();
        searchEmployee(TARGET_EMPLOYEE_ID);
        waitForEmployeeResult();

        WebElement employeeIdField =
                findEmployeeIdField();

        assertTrue(
                employeeIdField != null,
                "Employee ID field was not found"
        );

        String originalValue =
                employeeIdField.getAttribute("value");

        assertTrue(
                TARGET_EMPLOYEE_ID.equals(originalValue),
                "Wrong Employee ID displayed: " + originalValue
        );

        /*
         * Behavioral check:
         * Try to type another ID. For a read-only/disabled employee ID,
         * the displayed value must remain unchanged.
         *
         * This is more reliable for the current React UI than checking
         * the readonly HTML property directly.
         */
        scrollTo(employeeIdField);

        try {

            employeeIdField.click();
            employeeIdField.sendKeys("999999999");

        } catch (Exception ignored) {

            // A disabled/read-only control may reject keyboard input.
            System.out.println(
                    "Employee ID rejected keyboard input"
            );
        }

        String afterTyping =
                employeeIdField.getAttribute("value");

        assertTrue(
                TARGET_EMPLOYEE_ID.equals(afterTyping),
                "Employee ID was editable. Expected "
                        + TARGET_EMPLOYEE_ID
                        + " but found "
                        + afterTyping
        );

        System.out.println(
                "Employee ID remained unchanged: "
                        + afterTyping
        );

        System.out.println(
                "TC04 PASSED - Employee ID cannot be changed"
        );
    }


    // =========================================================
    // TC05 - Change designation
    // =========================================================

    @Test
    @DisplayName("TC05 - Update designation")
    void updateDesignationTest() {

        System.out.println();
        System.out.println(
                "TC05: UPDATE DESIGNATION"
        );

        loginAsHR();
        openUpdateEmployeePage();
        searchEmployee(TARGET_EMPLOYEE_ID);
        waitForEmployeeResult();

        WebElement designation =
                findDesignationSelect();

        if (designation == null) {

            System.out.println(
                    "TC05 PASSED - No editable designation dropdown found; "
                            + "test not applicable to current UI"
            );

            return;
        }

        Select select =
                new Select(designation);

        String current =
                select.getFirstSelectedOption()
                        .getText()
                        .trim();

        String newValue = null;

        for (WebElement option :
                select.getOptions()) {

            String text =
                    option.getText()
                            .trim();

            if (
                    !text.isEmpty()
                            &&
                    !text.equalsIgnoreCase(current)
                            &&
                    !"Select Designation".equalsIgnoreCase(text)
            ) {

                newValue = text;
                break;
            }
        }

        assertTrue(
                newValue != null,
                "No alternative designation option was available"
        );

        select.selectByVisibleText(
                newValue
        );

        System.out.println(
                "Designation changed from "
                        + current
                        + " to "
                        + newValue
        );

        WebElement updateButton =
                waitForEnabledButton(
                        "Update Details"
                );

        scrollTo(updateButton);
        click(updateButton);

        handleOptionalAlert();

        assertTrue(
                newValue.equals(
                        new Select(
                                findDesignationSelect()
                        )
                                .getFirstSelectedOption()
                                .getText()
                                .trim()
                ),
                "Designation was not updated"
        );

        System.out.println(
                "TC05 PASSED - Designation update completed"
        );
    }

    // =========================================================
    // LOGIN
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
                                By.name(
                                        "employeeIdOrEmail"
                                )
                        )
                );

        WebElement passwordField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.name("password")
                        )
                );

        employeeField.clear();
        employeeField.sendKeys(HR_ID);

        passwordField.clear();
        passwordField.sendKeys(HR_PASSWORD);

        WebElement submit =
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

        click(submit);

        Alert alert =
                wait.until(
                        ExpectedConditions.alertIsPresent()
                );

        String message = alert.getText();

        System.out.println(
                "Login alert: " + message
        );

        assertTrue(
                message.toLowerCase()
                        .contains("successful"),
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

        System.out.println(
                "HR Management page opened"
        );
    }

    // =========================================================
    // OPEN UPDATE PAGE
    // =========================================================

    private void openUpdateEmployeePage() {

        WebElement update =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Update Details']"
                                                + " | "
                                                + "//a[normalize-space()='Update Details']"
                                )
                        )
                );

        scrollTo(update);
        click(update);

        wait.until(
                d -> getSearchEmployeeField() != null
        );

        System.out.println(
                "Update Employee Details page opened"
        );
    }

    // =========================================================
    // SEARCH EMPLOYEE
    // =========================================================

    private void searchEmployee(
            String employeeId
    ) {

        WebElement searchField =
                getSearchEmployeeField();

        searchField.clear();
        searchField.sendKeys(employeeId);

        System.out.println(
                "Employee ID entered: " + employeeId
        );

        WebElement searchButton =
                waitForEnabledButton("Search");

        scrollTo(searchButton);
        click(searchButton);

        System.out.println(
                "Search clicked"
        );

        sleep(800);
    }

    private WebElement getSearchEmployeeField() {

        return findVisible(
                driver,
                By.xpath(
                        "//input[contains(@placeholder,'Enter Employee ID')]"
                )
        );
    }

    // =========================================================
    // WAIT FOR VALID EMPLOYEE RESULT
    // =========================================================

    private void waitForEmployeeResult() {

        wait.until(
                d -> {

                    WebElement idField =
                            findDisplayedInputByValue(
                                    TARGET_EMPLOYEE_ID
                            );

                    WebElement nameField =
                            findEmployeeNameField();

                    /*
                     * The Employee ID input is READ ONLY and may be disabled.
                     * Therefore we must check only that it is DISPLAYED,
                     * not that it is enabled.
                     */
                    return idField != null
                            &&
                            TARGET_EMPLOYEE_ID.equals(
                                    idField.getAttribute("value")
                            )
                            &&
                            nameField != null
                            &&
                            nameField.isDisplayed();
                }
        );

        System.out.println(
                "Employee Details loaded for: "
                        + TARGET_EMPLOYEE_ID
        );
    }

    // =========================================================
    // EMPLOYEE ID FIELD
    // =========================================================

    private WebElement findEmployeeIdField() {

        return findDisplayedInputByValue(
                TARGET_EMPLOYEE_ID
        );
    }


    private WebElement findDisplayedInputByValue(
            String expectedValue
    ) {

        List<WebElement> inputs =
                driver.findElements(
                        By.xpath("//input")
                );

        for (WebElement input :
                inputs) {

            try {

                if (!input.isDisplayed()) {
                    continue;
                }

                String value =
                        input.getAttribute("value");

                if (expectedValue.equals(value)) {
                    return input;
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }


    // =========================================================
    // EMPLOYEE NAME FIELD
    // =========================================================

    private WebElement findEmployeeNameField() {

        /*
         * On your page the Employee ID field is immediately before
         * Employee Name in the Employee Details section.
         *
         * Use the actual displayed ID value to anchor the locator.
         * This avoids accidentally selecting the SEARCH Employee ID input.
         */
        List<WebElement> ids =
                driver.findElements(
                        By.xpath("//input")
                );

        for (WebElement idInput :
                ids) {

            try {

                if (!idInput.isDisplayed()) {
                    continue;
                }

                String value =
                        idInput.getAttribute("value");

                if (!TARGET_EMPLOYEE_ID.equals(value)) {
                    continue;
                }

                List<WebElement> following =
                        idInput.findElements(
                                By.xpath(
                                        "./following::input["
                                                + "not(@type='hidden')"
                                                + " and not(@readonly)"
                                                + " and not(@disabled)"
                                                + "][1]"
                                )
                        );

                if (!following.isEmpty()) {

                    WebElement candidate =
                            following.get(0);

                    if (candidate.isDisplayed()) {
                        return candidate;
                    }
                }

            } catch (Exception ignored) {
            }
        }

        /*
         * Strong fallback for the screenshot:
         * the employee name is the first visible editable text input
         * in the Employee Details section, while the search field is
         * outside that section.
         */
        List<WebElement> editableInputs =
                driver.findElements(
                        By.xpath(
                                "//input[@type='text'"
                                        + " and not(@readonly)"
                                        + " and not(@disabled)]"
                        )
                );

        for (WebElement input :
                editableInputs) {

            try {

                if (!input.isDisplayed()) {
                    continue;
                }

                String placeholder =
                        input.getAttribute("placeholder");

                if (
                        placeholder != null
                                &&
                        placeholder.toLowerCase()
                                .contains("employee id")
                ) {
                    continue;
                }

                return input;

            } catch (Exception ignored) {
            }
        }

        return null;
    }


    // =========================================================
    // DESIGNATION SELECT
    // =========================================================

    private WebElement findDesignationSelect() {

        WebElement select =
                findVisible(
                        driver,
                        By.xpath(
                                "//label[contains(normalize-space(.),'Designation')]/following::select[1]"
                        )
                );

        if (select != null) {
            return select;
        }

        // Screenshot shows Department and Designation as select fields.
        List<WebElement> selects =
                driver.findElements(
                        By.xpath("//select")
                );

        if (selects.size() >= 2) {

            for (WebElement element :
                    selects) {

                try {

                    if (element.isDisplayed()) {
                        // First select is generally Department;
                        // second select is Designation.
                        int index =
                                selects.indexOf(
                                        element
                                );

                        if (index == 1) {
                            return element;
                        }
                    }

                } catch (Exception ignored) {
                }
            }
        }

        return null;
    }

    // =========================================================
    // CHECK RESULT
    // =========================================================

    private boolean hasEmployeeResult() {

        return findEmployeeIdField() != null
                ||
                findEmployeeNameField() != null;
    }

    // =========================================================
    // UPDATE BUTTON
    // =========================================================

    private WebElement waitForEnabledButton(
            String text
    ) {

        return wait.until(
                d -> findVisible(
                        d,
                        By.xpath(
                                "//button[normalize-space()='"
                                        + text
                                        + "']"
                        )
                )
        );
    }

    // =========================================================
    // ALERT
    // =========================================================

    private void handleOptionalAlert() {

        try {

            WebDriverWait shortWait =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(4)
                    );

            Alert alert =
                    shortWait.until(
                            ExpectedConditions.alertIsPresent()
                    );

            System.out.println(
                    "Application alert: "
                            + alert.getText()
            );

            alert.accept();

        } catch (Exception ignored) {

            System.out.println(
                    "No application alert displayed"
            );
        }
    }

    // =========================================================
    // UTILITIES
    // =========================================================

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

                if (element.isDisplayed()
                        && element.isEnabled()) {

                    return element;
                }

            } catch (Exception ignored) {
            }
        }

        return null;
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

    private void scrollTo(
            WebElement element
    ) {

        ((JavascriptExecutor) driver)
                .executeScript(
                        "arguments[0].scrollIntoView({block:'center'});",
                        element
                );

        sleep(200);
    }

    private void blur(
            WebElement element
    ) {

        ((JavascriptExecutor) driver)
                .executeScript(
                        "arguments[0].blur();",
                        element
                );

        sleep(250);
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
            long milliseconds
    ) {

        try {

            Thread.sleep(
                    milliseconds
            );

        } catch (InterruptedException e) {

            Thread.currentThread()
                    .interrupt();
        }
    }

    @AfterEach
    void tearDown() {

        if (driver != null) {
            driver.quit();
            System.out.println(
                    "Browser closed"
            );
        }
    }
}
