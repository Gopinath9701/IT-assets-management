package com.itams;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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

public class EmployeeStatusTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "http://localhost:3000/";

    // Asset Manager login
    private static final String HR_ID = "260822001";
    private static final String HR_PASSWORD = "Itams@2026h";

    // Employee to search
    private static final String EMPLOYEE_ID = "260822004";

    @BeforeEach
    public void setUp() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("       ITAMS HR EMPLOYEE STATUS AUTOMATION");
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

    @Test
    public void employeeStatusUpdateTest() {

        // =====================================================
        // STEP 1 - LOGIN
        // =====================================================

        System.out.println();
        System.out.println("STEP 1: HR LOGIN");

        openLoginPage();

        login(
                HR_ID,
                HR_PASSWORD
        );

        System.out.println(
                "LOGIN PASSED"
        );


        // =====================================================
        // STEP 2
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 2: OPEN HR MANAGEMENT"
        );

        /*
         * After HR login the application opens the HR Management page.
         * Confirm that page rather than clicking Asset Management.
         */
        waitForText("HR Management");

        System.out.println(
                "HR Management page opened"
        );


        // =====================================================
        // STEP 3
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 3: OPEN EMPLOYEE STATUS"
        );

        /*
         * In the HR Management card, the heading is "Employee Status"
         * but the actual clickable button is "View Status".
         */
        WebElement viewStatusButton =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='View Status']"
                                )
                        )
                );

        scrollTo(viewStatusButton);

        System.out.println(
                "View Status button found"
        );

        clickJS(viewStatusButton);

        sleep(1000);

        waitForAnyText(
                "Employee Status",
                "Search Employee",
                "Enter Employee ID or Employee Name"
        );

        System.out.println(
                "Employee Status page opened"
        );


        // =====================================================
        // STEP 4 - SEARCH EMPLOYEE
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 4: SEARCH EMPLOYEE"
        );

        searchEmployee(
                EMPLOYEE_ID
        );


        // =====================================================
        // STEP 5 - CHANGE TO ON LEAVE
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 5: CHANGE STATUS TO ON LEAVE"
        );

        updateEmployeeStatus(
                EMPLOYEE_ID,
                "On Leave"
        );

        System.out.println(
                "ON LEAVE UPDATE PASSED"
        );


        // =====================================================
        // STEP 6 - CHANGE TO INACTIVE
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 6: CHANGE STATUS TO INACTIVE"
        );

        updateEmployeeStatus(
                EMPLOYEE_ID,
                "Inactive"
        );

        System.out.println(
                "INACTIVE UPDATE PASSED"
        );


        // =====================================================
        // STEP 7 - CHANGE BACK TO ACTIVE
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 7: CHANGE STATUS TO ACTIVE"
        );

        updateEmployeeStatus(
                EMPLOYEE_ID,
                "Active"
        );

        System.out.println(
                "ACTIVE UPDATE PASSED"
        );


        // =====================================================
        // STEP 8 - VERIFY FINAL STATUS
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 8: VERIFY FINAL STATUS"
        );

        searchEmployee(
                EMPLOYEE_ID
        );

        WebElement finalRow =
                wait.until(
                        d -> findEmployeeRow(
                                EMPLOYEE_ID
                        )
                );

        assertTrue(
                finalRow != null,
                "Employee row not found after status updates"
        );

        String finalText =
                finalRow.getText();

        assertTrue(
                finalText.contains("Active"),
                "Final employee status is not Active. Row: "
                        + finalText
        );

        System.out.println(
                "Final Status verified: Active"
        );


        // =====================================================
        // FINAL
        // =====================================================

        System.out.println();
        System.out.println(
                "=============================================="
        );

        System.out.println(
                "     EMPLOYEE STATUS UPDATE TEST PASSED"
        );

        System.out.println(
                "=============================================="
        );
    }


    // =====================================================
    // SEARCH EMPLOYEE
    // =====================================================

    private void searchEmployee(
            String employeeId
    ) {

        WebElement searchField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//input[contains(@placeholder,'Employee ID or Employee Name')]"
                                        + " | "
                                        + "//input[contains(@placeholder,'Employee ID')]"
                                )
                        )
                );

        searchField.clear();

        searchField.sendKeys(
                employeeId
        );

        System.out.println(
                "Employee ID entered: "
                        + employeeId
        );


        WebElement searchButton =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Search']"
                                )
                        )
                );

        scrollTo(searchButton);

        clickJS(searchButton);

        sleep(1000);

        wait.until(
                d -> findEmployeeRow(
                        employeeId
                ) != null
        );

        System.out.println(
                "Employee search completed"
        );
    }


    // =====================================================
    // UPDATE EMPLOYEE STATUS
    // =====================================================

    private void updateEmployeeStatus(
            String employeeId,
            String newStatus
    ) {

        WebElement row =
                wait.until(
                        d -> findEmployeeRow(
                                employeeId
                        )
                );

        assertTrue(
                row != null,
                "Employee row not found for status update: "
                        + employeeId
        );


        /*
         * The row contains:
         * Employee ID | Employee Name | Department | Status |
         * Update dropdown | Update button
         *
         * Use the select inside this exact employee row.
         */
        WebElement statusSelect =
                findVisible(
                        row,
                        By.xpath(
                                ".//select"
                        )
                );

        assertTrue(
                statusSelect != null,
                "Status update dropdown was not found for "
                        + employeeId
        );


        Select select =
                new Select(
                        statusSelect
                );

        boolean optionExists = false;

        for (WebElement option :
                select.getOptions()) {

            if (
                    option.getText()
                            .trim()
                            .equalsIgnoreCase(
                                    newStatus
                            )
            ) {

                select.selectByVisibleText(
                        option.getText().trim()
                );

                optionExists = true;
                break;
            }
        }

        assertTrue(
                optionExists,
                "Status option '" +
                        newStatus +
                        "' was not found"
        );

        System.out.println(
                "Update dropdown selected: "
                        + newStatus
        );


        /*
         * Click Update from the same employee row.
         */
        WebElement updateButton =
                findVisible(
                        row,
                        By.xpath(
                                ".//button[normalize-space()='Update']"
                        )
                );

        assertTrue(
                updateButton != null,
                "Update button was not found for "
                        + employeeId
        );

        scrollTo(updateButton);

        clickJS(updateButton);

        sleep(1000);

        System.out.println(
                "Update button clicked"
        );


        /*
         * Accept the success alert if the application displays one.
         */
        handleOptionalAlert();


        /*
         * Refresh/search again and confirm the new status
         * is displayed in the same row.
         */
        searchEmployee(
                employeeId
        );

        WebElement updatedRow =
                wait.until(
                        d -> findEmployeeRow(
                                employeeId
                        )
                );

        assertTrue(
                updatedRow != null,
                "Employee row disappeared after status update"
        );

        String updatedText =
                updatedRow.getText();

        assertTrue(
                updatedText.contains(
                        newStatus
                ),
                "Status '" +
                        newStatus +
                        "' was not displayed after update. Row: "
                        + updatedText
        );

        System.out.println(
                "Verified status: "
                        + newStatus
        );
    }


    private WebElement findVisible(
            WebElement parent,
            By locator
    ) {

        List<WebElement> elements =
                parent.findElements(
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


    // =====================================================
    // FIND EMPLOYEE ROW
    // =====================================================

    private WebElement findEmployeeRow(
            String employeeId
    ) {

        List<WebElement> rows =
                driver.findElements(
                        By.xpath("//tr")
                );

        for (WebElement row :
                rows) {

            try {

                if (!row.isDisplayed()) {
                    continue;
                }

                String text =
                        row.getText();

                if (
                        text != null
                                &&
                        text.contains(employeeId)
                ) {
                    return row;
                }

            } catch (Exception ignored) {
            }
        }


        /*
         * Fallback for a div/table-like layout.
         */
        List<WebElement> elements =
                driver.findElements(
                        By.xpath(
                                "//*[contains(normalize-space(),'"
                                        + employeeId
                                        + "')]"
                        )
                );

        for (WebElement element :
                elements) {

            try {

                if (!element.isDisplayed()) {
                    continue;
                }

                List<WebElement> ancestors =
                        element.findElements(
                                By.xpath(
                                        "./ancestor::tr[1]"
                                )
                        );

                if (!ancestors.isEmpty()) {
                    return ancestors.get(0);
                }

                String text =
                        element.getText();

                if (
                        text != null
                                &&
                        text.contains(employeeId)
                ) {
                    return element;
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }


    // =====================================================
    // LOGIN
    // =====================================================

    private void openLoginPage() {

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

        clickJS(login);

        wait.until(
                d -> findVisible(
                        d,
                        By.xpath(
                                "//input[contains(@placeholder,'Employee ID or Email')]"
                                + " | "
                                + "//input[@type='password']"
                        )
                ) != null
        );

        System.out.println(
                "Login page opened"
        );
    }


    private void login(
            String employeeId,
            String password
    ) {

        WebElement employeeField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//input[contains(@placeholder,'Employee ID or Email')]"
                                        + " | "
                                        + "//input[@name='employeeId']"
                                        + " | "
                                        + "//input[@name='employeeIdOrEmail']"
                                        + " | "
                                        + "//input[@type='text']"
                                )
                        )
                );

        employeeField.clear();

        employeeField.sendKeys(
                employeeId
        );

        System.out.println(
                "HR Employee ID entered: "
                        + employeeId
        );


        WebElement passwordField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//input[@type='password']"
                                )
                        )
                );

        passwordField.clear();

        passwordField.sendKeys(
                password
        );

        System.out.println(
                "Password entered"
        );


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

        clickJS(loginButton);

        System.out.println(
                "Login button clicked"
        );


        try {

            Alert alert =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(10)
                    ).until(
                            ExpectedConditions.alertIsPresent()
                    );

            String message =
                    alert.getText();

            System.out.println(
                    "Login alert: "
                            + message
            );

            alert.accept();

        } catch (Exception e) {

            throw new AssertionError(
                    "Login Successful alert was not displayed"
            );
        }

        waitForPageReady();

        sleep(1000);
    }


    // =====================================================
    // NAVIGATION
    // =====================================================

    private void clickVisibleText(
            String text
    ) {

        WebElement element =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//*[normalize-space()='"
                                                + text
                                                + "']"
                                )
                        )
                );

        scrollTo(element);

        clickJS(element);

        sleep(700);
    }



    // =====================================================
    // OPTIONAL ALERT
    // =====================================================

    private void handleOptionalAlert() {

        try {

            Alert alert =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(5)
                    ).until(
                            ExpectedConditions.alertIsPresent()
                    );

            String message =
                    alert.getText();

            System.out.println(
                    "Application alert: " + message
            );

            String lower =
                    message == null
                            ? ""
                            : message.toLowerCase();

            alert.accept();

            assertTrue(
                    !lower.contains("error")
                            &&
                    !lower.contains("failed")
                            &&
                    !lower.contains("unable"),
                    "Application returned an error: " + message
            );

        } catch (org.openqa.selenium.TimeoutException ignored) {
            // No alert was displayed; continue normally.
        }
    }


    // =====================================================
    // UTILITY
    // =====================================================

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

        sleep(300);
    }


    private void clickJS(
            WebElement element
    ) {

        ((JavascriptExecutor) driver)
                .executeScript(
                        "arguments[0].click();",
                        element
                );
    }


    private void waitForText(
            String text
    ) {

        wait.until(
                d -> {

                    try {

                        return d.findElement(
                                By.tagName("body")
                        ).getText().contains(text);

                    } catch (Exception e) {

                        return false;
                    }
                }
        );
    }


    private boolean waitForAnyText(
            String... texts
    ) {

        try {

            return new WebDriverWait(
                    driver,
                    Duration.ofSeconds(15)
            ).until(
                    d -> {

                        try {

                            String body =
                                    d.findElement(
                                            By.tagName("body")
                                    ).getText();

                            if (body == null) {
                                return false;
                            }

                            for (String text :
                                    texts) {

                                if (
                                        body.contains(text)
                                ) {
                                    return true;
                                }
                            }

                        } catch (Exception ignored) {
                        }

                        return false;
                    }
            );

        } catch (Exception e) {

            return false;
        }
    }


    private void waitForPageReady() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(20)
            ).until(
                    d -> {

                        try {

                            return "complete".equals(
                                    ((JavascriptExecutor) d)
                                            .executeScript(
                                                    "return document.readyState"
                                            )
                            );

                        } catch (Exception e) {

                            return false;
                        }
                    }
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

            Thread.currentThread()
                    .interrupt();
        }
    }


    @AfterEach
    public void tearDown() {

        if (driver != null) {

            driver.quit();

            System.out.println(
                    "Browser closed"
            );
        }
    }
}
