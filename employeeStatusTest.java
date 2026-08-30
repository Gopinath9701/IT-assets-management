package com.itams.tests;
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
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class employeeStatusTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "http://localhost:3000/";

    // Asset Manager login
    private static final String ASSET_MANAGER_ID = "260822002";
    private static final String ASSET_MANAGER_PASSWORD = "Itams@2026a";

    // Employee to search
    private static final String EMPLOYEE_ID = "260822004";

    @BeforeEach
    public void setUp() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("       ITAMS EMPLOYEE STATUS AUTOMATION");
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
    public void employeeStatusSearchTest() {

        // =====================================================
        // STEP 1 - LOGIN
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 1: ASSET MANAGER LOGIN"
        );

        openLoginPage();

        login(
                ASSET_MANAGER_ID,
                ASSET_MANAGER_PASSWORD
        );

        System.out.println(
                "LOGIN PASSED"
        );


        // =====================================================
        // STEP 2 - OPEN ASSET MANAGEMENT
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 2: OPEN ASSET MANAGEMENT"
        );

        clickVisibleText(
                "Asset Management"
        );

        waitForText(
                "Asset Management"
        );

        System.out.println(
                "Asset Management page opened"
        );


        // =====================================================
        // STEP 3 - OPEN EMPLOYEE STATUS
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 3: OPEN EMPLOYEE STATUS"
        );

        WebElement employeeStatusButton =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Employee Status']"
                                )
                        )
                );

        scrollTo(employeeStatusButton);

        System.out.println(
                "Employee Status button found"
        );

        clickJS(employeeStatusButton);

        sleep(1000);

        waitForAnyText(
                "Search Employee",
                "Enter Employee ID or Employee Name"
        );

        System.out.println(
                "Employee Status page opened"
        );


        // =====================================================
        // STEP 4 - ENTER EMPLOYEE ID
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 4: SEARCH EMPLOYEE"
        );

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
                EMPLOYEE_ID
        );

        System.out.println(
                "Employee ID entered: "
                        + EMPLOYEE_ID
        );


        // =====================================================
        // STEP 5 - CLICK SEARCH
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 5: CLICK SEARCH"
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

        sleep(1200);

        System.out.println(
                "Search clicked"
        );


        // =====================================================
        // STEP 6 - VERIFY EMPLOYEE
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 6: VERIFY EMPLOYEE RESULT"
        );

        WebElement employeeRow =
                wait.until(
                        d -> findEmployeeRow(
                                EMPLOYEE_ID
                        )
                );

        assertTrue(
                employeeRow != null,
                "Employee " + EMPLOYEE_ID
                        + " was not found"
        );

        String rowText =
                employeeRow.getText();

        System.out.println(
                "Employee found: "
                        + rowText
        );

        assertTrue(
                rowText.contains(
                        EMPLOYEE_ID
                ),
                "Employee ID is not displayed in result"
        );


        // =====================================================
        // STEP 7 - VERIFY STATUS
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 7: VERIFY EMPLOYEE STATUS"
        );

        /*
         * The page shown in the screenshot displays the employee
         * status as Active. We verify that the selected employee row
         * contains Active or Inactive status.
         */
        boolean hasStatus =
                rowText.contains("Active")
                        ||
                rowText.contains("Inactive");

        assertTrue(
                hasStatus,
                "Employee status was not displayed for "
                        + EMPLOYEE_ID
        );

        System.out.println(
                "Employee status found in result"
        );


        // =====================================================
        // STEP 8 - FINAL VERIFICATION
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 8: VERIFY EMPLOYEE STATUS PAGE"
        );

        String pageText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        assertTrue(
                pageText.contains(
                        "Search Employee"
                ),
                "Search Employee section is missing"
        );

        assertTrue(
                pageText.contains(
                        "Employee Name"
                ),
                "Employee Name column is missing"
        );

        assertTrue(
                pageText.contains(
                        "Department"
                ),
                "Department column is missing"
        );

        assertTrue(
                pageText.contains(
                        "Status"
                ),
                "Status column is missing"
        );

        System.out.println(
                "Employee Status page verified"
        );


        // =====================================================
        // FINAL
        // =====================================================

        System.out.println();
        System.out.println(
                "=============================================="
        );

        System.out.println(
                "       EMPLOYEE STATUS TEST PASSED"
        );

        System.out.println(
                "=============================================="
        );
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
                "Login Employee ID entered: "
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
