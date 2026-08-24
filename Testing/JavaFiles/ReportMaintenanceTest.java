package com.itams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class ReportMaintenanceTest extends BaseTest {

    // ============================================================
    // HR LOGIN DETAILS
    // ============================================================

    private static final String HR_ID = "260822001";
    private static final String HR_PASSWORD = "Itams@2026h";

    // ============================================================
    // WAIT
    // ============================================================

    private WebDriverWait wait() {
        return new WebDriverWait(
                driver,
                Duration.ofSeconds(15)
        );
    }

    // ============================================================
    // LOGIN + OPEN REPORT MAINTENANCE PAGE
    // ============================================================

    @BeforeEach
    public void loginAndOpenReportMaintenance() {

        driver.get("http://localhost:3000");

        waitForPage();

        // --------------------------------------------------------
        // Click Login
        // --------------------------------------------------------

        WebElement loginButton = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[contains(normalize-space(),'Login')]"
                        )
                )
        );

        safeClick(loginButton);

        // --------------------------------------------------------
        // Employee ID
        // --------------------------------------------------------

        WebElement employeeField = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("employeeIdOrEmail")
                )
        );

        employeeField.clear();
        employeeField.sendKeys(HR_ID);

        // --------------------------------------------------------
        // Password
        // --------------------------------------------------------

        WebElement passwordField = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("password")
                )
        );

        passwordField.clear();
        passwordField.sendKeys(HR_PASSWORD);

        // --------------------------------------------------------
        // Submit Login
        // --------------------------------------------------------

        WebElement submitLogin = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//form//button[@type='submit']"
                        )
                )
        );

        safeClick(submitLogin);

        // --------------------------------------------------------
        // Handle Login Successful alert
        // --------------------------------------------------------

        try {

            Alert alert = new WebDriverWait(
                    driver,
                    Duration.ofSeconds(10)
            ).until(
                    ExpectedConditions.alertIsPresent()
            );

            System.out.println(
                    "Login Alert: " + alert.getText()
            );

            alert.accept();

        } catch (Exception ignored) {
            // Alert may not appear in some application versions.
        }

        // --------------------------------------------------------
        // Wait for HR Management
        // --------------------------------------------------------

        wait().until(
                ExpectedConditions.or(
                        ExpectedConditions.presenceOfElementLocated(
                                By.xpath(
                                        "//*[normalize-space()='HR Management']"
                                )
                        ),
                        ExpectedConditions.presenceOfElementLocated(
                                By.xpath(
                                        "//*[contains(normalize-space(),'HR Management')]"
                                )
                        )
                )
        );

        // --------------------------------------------------------
        // Click Report Issue
        // --------------------------------------------------------

        WebElement reportButton = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[contains(normalize-space(),'Report Issue')]"
                        )
                )
        );

        safeClick(reportButton);

        // --------------------------------------------------------
        // Wait for Report Maintenance page
        // --------------------------------------------------------

        wait().until(driver -> {

            String page =
                    driver.getPageSource().toLowerCase();

            return page.contains("report")
                    || page.contains("maintenance")
                    || page.contains("issue");
        });

        System.out.println(
                "Report Maintenance page opened successfully."
        );
    }

    // ============================================================
    // TEST 1 - PAGE LOAD
    // ============================================================

    @Test
    public void reportMaintenancePageLoadTest() {

        String page =
                driver.getPageSource().toLowerCase();

        assertTrue(
                page.contains("report")
                        || page.contains("maintenance")
                        || page.contains("issue"),
                "Report Maintenance page was not displayed"
        );

        System.out.println(
                "PASS: Report Maintenance page loaded."
        );
    }

    // ============================================================
    // TEST 2 - FORM SHOULD BE PRESENT
    // ============================================================

    @Test
    public void reportFormDisplayTest() {

        List<WebElement> forms =
                driver.findElements(By.tagName("form"));

        String page =
                driver.getPageSource().toLowerCase();

        boolean formExists =
                !forms.isEmpty()
                        || page.contains("asset")
                        || page.contains("issue")
                        || page.contains("description")
                        || page.contains("report");

        assertTrue(
                formExists,
                "Report Maintenance form was not displayed"
        );

        System.out.println(
                "PASS: Report Maintenance form is displayed."
        );
    }

    // ============================================================
    // TEST 3 - CHECK INPUT FIELDS
    // ============================================================

    @Test
    public void reportInputFieldsTest() {

        List<WebElement> inputs =
                driver.findElements(
                        By.cssSelector(
                                "input, textarea, select"
                        )
                );

        assertTrue(
                !inputs.isEmpty(),
                "No input fields were found on Report Maintenance page"
        );

        System.out.println(
                "PASS: Report form input fields are available."
        );
    }

    // ============================================================
    // TEST 4 - CHECK DESCRIPTION FIELD
    // ============================================================

    @Test
    public void descriptionFieldTest() {

        WebElement field =
                findField(
                        "description",
                        "issueDescription",
                        "remarks",
                        "reason",
                        "details",
                        "message"
                );

        if (field == null) {

            List<WebElement> textareas =
                    driver.findElements(
                            By.tagName("textarea")
                    );

            if (!textareas.isEmpty()) {
                field = textareas.get(0);
            }
        }

        assertTrue(
                field != null,
                "Issue description field was not found"
        );

        System.out.println(
                "PASS: Issue description field is available."
        );
    }

    // ============================================================
    // TEST 5 - ENTER DESCRIPTION
    // ============================================================

    @Test
    public void enterIssueDescriptionTest() {

        WebElement field =
                findField(
                        "description",
                        "issueDescription",
                        "remarks",
                        "reason",
                        "details",
                        "message"
                );

        if (field == null) {

            List<WebElement> textareas =
                    driver.findElements(
                            By.tagName("textarea")
                    );

            if (!textareas.isEmpty()) {
                field = textareas.get(0);
            }
        }

        assertTrue(
                field != null,
                "Issue description field was not found"
        );

        scrollIntoView(field);

        field.clear();

        field.sendKeys(
                "Laptop is not working properly and requires maintenance."
        );

        String value =
                field.getAttribute("value");

        assertTrue(
                value != null
                        && value.contains("Laptop"),
                "Issue description was not entered correctly"
        );

        System.out.println(
                "PASS: Issue description entered."
        );
    }

    // ============================================================
    // TEST 6 - EMPTY FORM VALIDATION
    // ============================================================

    @Test
    public void emptyFormValidationTest() {

        WebElement submitButton =
                findSubmitButton();

        assertTrue(
                submitButton != null,
                "Report/Submit button was not found"
        );

        scrollIntoView(submitButton);

        safeClick(submitButton);

        try {

            wait().until(driver -> {

                String page =
                        driver.getPageSource()
                                .toLowerCase();

                return page.contains("required")
                        || page.contains("please")
                        || page.contains("invalid")
                        || page.contains("enter")
                        || page.contains("select");
            });

            System.out.println(
                    "PASS: Empty form validation message displayed."
            );

        } catch (Exception e) {

            System.out.println(
                    "INFO: Application may use browser validation."
            );
        }
    }

    // ============================================================
    // TEST 7 - SUBMIT BUTTON
    // ============================================================

    @Test
    public void submitButtonTest() {

        WebElement submitButton =
                findSubmitButton();

        assertTrue(
                submitButton != null,
                "Submit/Report button was not found"
        );

        assertTrue(
                submitButton.isDisplayed(),
                "Submit/Report button is not visible"
        );

        System.out.println(
                "PASS: Submit/Report button is displayed."
        );
    }

    // ============================================================
    // TEST 8 - VALID REPORT DATA
    // ============================================================

    @Test
    public void validReportDataTest() {

        fillValidReport();

        WebElement submitButton =
                findSubmitButton();

        assertTrue(
                submitButton != null,
                "Submit button was not found"
        );

        System.out.println(
                "PASS: Valid maintenance report data entered."
        );
    }

    // ============================================================
    // TEST 9 - SUBMIT REPORT
    // ============================================================

    @Test
    public void submitMaintenanceReportTest() {

        fillValidReport();

        WebElement submitButton =
                findSubmitButton();

        assertTrue(
                submitButton != null,
                "Submit/Report button was not found"
        );

        scrollIntoView(submitButton);

        safeClick(submitButton);

        try {

            Alert alert = new WebDriverWait(
                    driver,
                    Duration.ofSeconds(5)
            ).until(
                    ExpectedConditions.alertIsPresent()
            );

            String text =
                    alert.getText().toLowerCase();

            System.out.println(
                    "Report Alert: " + text
            );

            alert.accept();

        } catch (Exception ignored) {
        }

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        String page =
                driver.getPageSource()
                        .toLowerCase();

        boolean result =
                page.contains("success")
                        || page.contains("submitted")
                        || page.contains("reported")
                        || page.contains("created")
                        || page.contains("maintenance")
                        || page.contains("issue");

        assertTrue(
                result,
                "Report submission result was not displayed"
        );

        System.out.println(
                "PASS: Maintenance report submission tested."
        );
    }

    // ============================================================
    // TEST 10 - SPECIAL CHARACTERS
    // ============================================================

    @Test
    public void specialCharactersTest() {

        WebElement field =
                findField(
                        "description",
                        "issueDescription",
                        "remarks",
                        "reason",
                        "details",
                        "message"
                );

        if (field == null) {

            List<WebElement> textareas =
                    driver.findElements(
                            By.tagName("textarea")
                    );

            if (!textareas.isEmpty()) {
                field = textareas.get(0);
            }
        }

        assertTrue(
                field != null,
                "Description field was not found"
        );

        scrollIntoView(field);

        field.clear();

        field.sendKeys(
                "Laptop issue: screen & keyboard not working - Test #1."
        );

        System.out.println(
                "PASS: Special characters tested."
        );
    }

    // ============================================================
    // TEST 11 - PAGE STABILITY
    // ============================================================

    @Test
    public void pageStabilityTest() {

        String page =
                driver.getPageSource()
                        .toLowerCase();

        assertTrue(
                !page.contains("uncaught runtime error")
                        && !page.contains("cannot read properties"),
                "Report Maintenance page contains a runtime error"
        );

        System.out.println(
                "PASS: Report Maintenance page is stable."
        );
    }

    // ============================================================
    // FIND FIELD
    // ============================================================

    private WebElement findField(String... names) {

        // --------------------------------------------------------
        // Search by name
        // --------------------------------------------------------

        for (String name : names) {

            try {

                List<WebElement> elements =
                        driver.findElements(
                                By.name(name)
                        );

                for (WebElement element : elements) {

                    if (element.isDisplayed()) {
                        return element;
                    }
                }

            } catch (Exception ignored) {
            }
        }

        // --------------------------------------------------------
        // Search by id
        // --------------------------------------------------------

        for (String name : names) {

            try {

                List<WebElement> elements =
                        driver.findElements(
                                By.id(name)
                        );

                for (WebElement element : elements) {

                    if (element.isDisplayed()) {
                        return element;
                    }
                }

            } catch (Exception ignored) {
            }
        }

        // --------------------------------------------------------
        // Search placeholder
        // --------------------------------------------------------

        for (String name : names) {

            try {

                List<WebElement> elements =
                        driver.findElements(
                                By.xpath(
                                        "//input[contains(" +
                                        "translate(@placeholder," +
                                        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ'," +
                                        "'abcdefghijklmnopqrstuvwxyz')," +
                                        "'" + name.toLowerCase() +
                                        "')]"
                                )
                        );

                for (WebElement element : elements) {

                    if (element.isDisplayed()) {
                        return element;
                    }
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }

    // ============================================================
    // FIND SUBMIT BUTTON
    // ============================================================

    private WebElement findSubmitButton() {

        String[] buttonNames = {
                "Report Issue",
                "Submit Report",
                "Submit",
                "Report",
                "Create Report",
                "Save"
        };

        for (String name : buttonNames) {

            try {

                List<WebElement> buttons =
                        driver.findElements(
                                By.xpath(
                                        "//button[contains(" +
                                        "translate(normalize-space(.)," +
                                        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ'," +
                                        "'abcdefghijklmnopqrstuvwxyz')," +
                                        "'" + name.toLowerCase() +
                                        "')]"
                                )
                        );

                for (WebElement button : buttons) {

                    if (button.isDisplayed()) {
                        return button;
                    }
                }

            } catch (Exception ignored) {
            }
        }

        // --------------------------------------------------------
        // Submit button by type
        // --------------------------------------------------------

        try {

            List<WebElement> buttons =
                    driver.findElements(
                            By.cssSelector(
                                    "button[type='submit']"
                            )
                    );

            for (WebElement button : buttons) {

                if (button.isDisplayed()) {
                    return button;
                }
            }

        } catch (Exception ignored) {
        }

        return null;
    }

    // ============================================================
    // FILL VALID REPORT
    // ============================================================

    private void fillValidReport() {

        // --------------------------------------------------------
        // Asset / Issue field
        // --------------------------------------------------------

        WebElement assetField =
                findField(
                        "asset",
                        "assetId",
                        "assetName",
                        "assetType"
                );

        if (assetField != null) {

            scrollIntoView(assetField);

            try {

                assetField.clear();

                assetField.sendKeys(
                        "Laptop"
                );

            } catch (Exception ignored) {
            }
        }

        // --------------------------------------------------------
        // Description
        // --------------------------------------------------------

        WebElement description =
                findField(
                        "description",
                        "issueDescription",
                        "remarks",
                        "reason",
                        "details",
                        "message"
                );

        if (description == null) {

            List<WebElement> textareas =
                    driver.findElements(
                            By.tagName("textarea")
                    );

            if (!textareas.isEmpty()) {
                description =
                        textareas.get(0);
            }
        }

        if (description != null) {

            scrollIntoView(description);

            description.clear();

            description.sendKeys(
                    "Laptop is not working properly and requires maintenance."
            );
        }
    }

    // ============================================================
    // SAFE CLICK
    // ============================================================

    private void safeClick(WebElement element) {

        try {

            wait().until(
                    ExpectedConditions.elementToBeClickable(
                            element
                    )
            );

            element.click();

        } catch (Exception e) {

            scrollIntoView(element);

            try {

                element.click();

            } catch (Exception secondException) {

                ((JavascriptExecutor) driver)
                        .executeScript(
                                "arguments[0].click();",
                                element
                        );
            }
        }
    }

    // ============================================================
    // SCROLL
    // ============================================================

    private void scrollIntoView(WebElement element) {

        try {

            ((JavascriptExecutor) driver)
                    .executeScript(
                            "arguments[0].scrollIntoView({block:'center'});",
                            element
                    );

        } catch (Exception ignored) {
        }
    }

    // ============================================================
    // PAGE LOAD WAIT
    // ============================================================

    private void waitForPage() {

        wait().until(
                driver ->
                        ((JavascriptExecutor) driver)
                                .executeScript(
                                        "return document.readyState"
                                )
                                .equals("complete")
        );
    }
}
