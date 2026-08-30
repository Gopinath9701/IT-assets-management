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
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class MaintenanceWorkflowTest {

    private WebDriver driver;
    private WebDriverWait wait;

    // ============================================================
    // APPLICATION
    // ============================================================

    private static final String BASE_URL =
            "http://localhost:3000/";

    // ============================================================
    // HR LOGIN
    // ============================================================

    private static final String HR_ID =
            "260822001";

    private static final String HR_PASSWORD =
            "Itams@2026h";

    // ============================================================
    // ASSET MANAGER LOGIN
    // ============================================================

    private static final String ASSET_MANAGER_ID =
            "260822002";

    private static final String ASSET_MANAGER_PASSWORD =
            "Itams@2026a";

    // ============================================================
    // REPORT DETAILS
    // ============================================================

    private static final String REPORT_EMPLOYEE_ID =
            "260822004";

    private static final String ASSET_ID =
            "LAP001";

    private static final String ISSUE_CATEGORY =
            "Hardware Issue";

    private static final String ISSUE_DESCRIPTION =
            "Laptop screen is not responding.";

    private static final String PRIORITY =
            "High";


    // ============================================================
    // SETUP
    // ============================================================

    @BeforeEach
    public void setUp() {

        System.out.println();
        System.out.println("==========================================");
        System.out.println(" ITAMS MAINTENANCE WORKFLOW AUTOMATION");
        System.out.println("==========================================");

        WebDriverManager.chromedriver().setup();

        driver = new ChromeDriver();

        driver.manage().window().maximize();

        driver.manage().timeouts().implicitlyWait(
                Duration.ofSeconds(2)
        );

        driver.manage().timeouts().pageLoadTimeout(
                Duration.ofSeconds(60)
        );

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(20)
        );

        driver.get(BASE_URL);

        waitForPageReady();

        System.out.println(
                "Application opened: " +
                driver.getCurrentUrl()
        );
    }


    // ============================================================
    // COMPLETE WORKFLOW
    // ============================================================

    @Test
    public void completeMaintenanceWorkflowTest() {

        // ========================================================
        // STEP 1 - HR LOGIN
        // ========================================================

        System.out.println();
        System.out.println("STEP 1: HR LOGIN");

        clickLogin();

        login(
                HR_ID,
                HR_PASSWORD
        );

        System.out.println(
                "HR LOGIN PASSED"
        );


        // ========================================================
        // STEP 2 - OPEN REPORT ISSUE
        // ========================================================

        System.out.println();
        System.out.println(
                "STEP 2: OPEN REPORT ISSUE"
        );

        openReportIssue();

        System.out.println(
                "Report Maintenance page opened"
        );


        // ========================================================
        // STEP 3 - ENTER DETAILS
        // ========================================================

        System.out.println();
        System.out.println(
                "STEP 3: ENTER REPORT ISSUE DETAILS"
        );

        enterReportDetails();


        // ========================================================
        // STEP 4 - SUBMIT
        // ========================================================

        System.out.println();
        System.out.println(
                "STEP 4: SUBMIT MAINTENANCE REQUEST"
        );

        submitRequest();


        // ========================================================
        // STEP 5 - HR LOGOUT
        // ========================================================

        System.out.println();
        System.out.println(
                "STEP 5: HR LOGOUT"
        );

        logout();

        System.out.println(
                "HR logout completed"
        );


        // ========================================================
        // STEP 6 - ASSET MANAGER LOGIN
        // ========================================================

        System.out.println();
        System.out.println(
                "STEP 6: ASSET MANAGER LOGIN"
        );

        driver.get(BASE_URL);

        waitForPageReady();

        sleep(1000);

        clickLogin();

        login(
                ASSET_MANAGER_ID,
                ASSET_MANAGER_PASSWORD
        );

        System.out.println(
                "ASSET MANAGER LOGIN PASSED"
        );


        // ========================================================
        // STEP 7 - OPEN MAINTENANCE
        // ========================================================

        System.out.println();
        System.out.println(
                "STEP 7: OPEN MAINTENANCE"
        );

        openMaintenance();

        System.out.println(
                "Maintenance page opened"
        );


        // ========================================================
        // STEP 8 - FIND TICKET
        // ========================================================

        System.out.println();
        System.out.println(
                "STEP 8: FIND NEW MAINTENANCE TICKET"
        );

        WebElement ticket =
                findTicket();

        assertTrue(
                ticket != null,
                "Maintenance ticket was not found for "
                        + ASSET_ID
        );

        System.out.println(
                "Maintenance ticket found for Asset ID: "
                        + ASSET_ID
        );


        // ========================================================
        // STEP 9 - START REPAIR
        // ========================================================

        System.out.println();
        System.out.println(
                "STEP 9: START REPAIR"
        );

        clickStartRepair(ticket);

        System.out.println(
                "Start Repair completed"
        );


        // ========================================================
        // STEP 9A - SCROLL DOWN TO REPAIRED
        // ========================================================

        System.out.println();
        System.out.println("STEP 9A: SCROLL DOWN TO REPAIRED");

        // IMPORTANT: stay on the SAME Maintenance page.
        // Do NOT refresh, navigate, or reopen the page here.
        sleep(2000);

        WebElement repairedButton = waitForRepairedButton(40);

        assertTrue(repairedButton != null,
                "Repaired button did not appear after Start Repair");

        scrollTo(repairedButton);
        System.out.println("Repaired button found");

        // ========================================================
        // STEP 10 - CLICK REPAIRED
        // ========================================================

        System.out.println();
        System.out.println("STEP 10: CLICK REPAIRED");

        clickJS(repairedButton);
        System.out.println("Repaired button clicked");

        // Accept confirmation/success alerts generated by the app.
        waitForRepairAlertsToFinish();
        sleep(2000);

        // ========================================================
        // STEP 10A - SCROLL DOWN AND VERIFY COMPLETED
        // ========================================================

        System.out.println();
        System.out.println("STEP 10A: SCROLL DOWN TO COMPLETED");

        // Again, stay on the SAME page. Scroll all the way down so the
        // updated ticket/status is visible. No refresh is performed.
        scrollToBottom();

        boolean completed = waitForCompletedStatusAfterRepair(40);

        assertTrue(completed,
                "Ticket did not move to Completed after clicking Repaired");

        System.out.println("COMPLETED VERIFIED");

        // ========================================================
        // STEP 11 - ASSET MANAGER LOGOUT
        // ========================================================

        System.out.println();
        System.out.println("STEP 11: ASSET MANAGER LOGOUT");

        logout();
        System.out.println("ASSET MANAGER logout completed");


        // FINAL
        // ========================================================

        System.out.println();
        System.out.println(
                "=========================================="
        );

        System.out.println(
                " COMPLETE MAINTENANCE WORKFLOW PASSED"
        );

        System.out.println(
                "=========================================="
        );
    }


    // ============================================================
    // LOGIN BUTTON
    // ============================================================

    private void clickLogin() {

        WebElement loginButton =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//button[normalize-space()='Login']"
                                        +
                                        " | "
                                        +
                                        "//a[normalize-space()='Login']"
                                )
                        )
                );

        clickJS(loginButton);

        sleep(1000);

        System.out.println(
                "Login page opened"
        );
    }


    // ============================================================
    // LOGIN
    // ============================================================

    private void login(
            String employeeId,
            String password
    ) {

        WebElement employeeField =
                wait.until(
                        d -> {
                            try {
                                WebElement e = findEmployeeField();
                                return (e.isDisplayed() && e.isEnabled()) ? e : null;
                            } catch (Exception ex) {
                                return null;
                            }
                        }
                );

        employeeField.clear();
        employeeField.sendKeys(employeeId);

        System.out.println(
                "Employee ID entered: "
                        + employeeId
        );

        WebElement passwordField =
                wait.until(
                        d -> {
                            try {
                                WebElement e = findPasswordField();
                                return (e.isDisplayed() && e.isEnabled()) ? e : null;
                            } catch (Exception ex) {
                                return null;
                            }
                        }
                );

        passwordField.clear();
        passwordField.sendKeys(password);

        System.out.println("Password entered");

        WebElement loginButton =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//form//button[@type='submit']"
                                )
                        )
                );

        clickJS(loginButton);

        System.out.println("Login button clicked");

        /*
         * The ITAMS application displays a browser alert such as
         * "Login Successful".  It MUST be accepted before Selenium
         * attempts to click another page element.
         */
        waitAndAcceptLoginAlert();

        waitForPageReady();
        sleep(1500);
    }


    // ============================================================
    // FIND EMPLOYEE FIELD
    // ============================================================

    private WebElement findEmployeeField() {

        String[] xpaths = {

                "//input[@name='employeeIdOrEmail']",

                "//input[@name='employeeId']",

                "//input[contains(@placeholder,'Employee ID')]",

                "//input[contains(@placeholder,'Employee')]",

                "//input[@type='text']",

                "//input[1]"
        };


        for (String xpath : xpaths) {

            List<WebElement> elements =
                    driver.findElements(
                            By.xpath(xpath)
                    );

            for (WebElement element : elements) {

                if (
                        element.isDisplayed()
                                &&
                        element.isEnabled()
                ) {

                    return element;
                }
            }
        }


        throw new RuntimeException(
                "Employee ID input field not found"
        );
    }


    // ============================================================
    // FIND PASSWORD FIELD
    // ============================================================

    private WebElement findPasswordField() {

        List<WebElement> elements =
                driver.findElements(
                        By.xpath(
                                "//input[@type='password']"
                        )
                );


        for (WebElement element : elements) {

            if (
                    element.isDisplayed()
                            &&
                    element.isEnabled()
            ) {

                return element;
            }
        }


        throw new RuntimeException(
                "Password input field not found"
        );
    }


    // ============================================================
    // OPEN REPORT ISSUE
    // ============================================================

    private void openReportIssue() {

        // Make absolutely sure no login/previous alert is blocking the page.
        closeAnyOpenAlert();

        WebElement reportButton =
                wait.until(
                        d -> {
                            List<WebElement> elements =
                                    d.findElements(
                                            By.xpath(
                                                    "//*[self::button or self::a]" +
                                                    "[contains(normalize-space()," +
                                                    "'Report Issue')]"
                                            )
                                    );

                            if (elements.isEmpty()) {
                                elements =
                                        d.findElements(
                                                By.xpath(
                                                        "//*[contains(normalize-space()," +
                                                        "'Report Issue')]"
                                                )
                                        );
                            }

                            for (WebElement e : elements) {
                                try {
                                    if (e.isDisplayed() && e.isEnabled()) {
                                        return e;
                                    }
                                } catch (Exception ignored) {
                                }
                            }

                            return null;
                        }
                );

        scrollTo(reportButton);
        clickJS(reportButton);

        System.out.println("Report Issue clicked");

        sleep(1000);
        closeAnyOpenAlert();
        waitForPageReady();

        wait.until(
                driver -> {
                    try {
                        String pageText =
                                driver.findElement(By.tagName("body")).getText();

                        return pageText.contains("Report Maintenance")
                                || pageText.contains("Issue Description");
                    } catch (Exception e) {
                        return false;
                    }
                }
        );
    }


    // ============================================================
    // ENTER REPORT DETAILS
    // ============================================================

    private void enterReportDetails() {

        // Employee ID
        WebElement employee =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.xpath(
                                        "//input[contains(@placeholder,"
                                        +
                                        "'Enter Employee ID')]"
                                )
                        )
                );

        employee.clear();

        employee.sendKeys(
                REPORT_EMPLOYEE_ID
        );

        System.out.println(
                "Report Employee ID entered: "
                        + REPORT_EMPLOYEE_ID
        );


        // Asset ID
        WebElement asset =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.xpath(
                                        "//input[contains(@placeholder,"
                                        +
                                        "'LAP001')]"
                                )
                        )
                );

        asset.clear();

        asset.sendKeys(
                ASSET_ID
        );

        System.out.println(
                "Asset ID entered: "
                        + ASSET_ID
        );


        // Category
        List<WebElement> selects =
                driver.findElements(
                        By.xpath("//select")
                );


        if (!selects.isEmpty()) {

            WebElement category =
                    selects.get(0);

            Select categorySelect =
                    new Select(category);

            try {

                categorySelect.selectByVisibleText(
                        ISSUE_CATEGORY
                );

            }
            catch (Exception e) {

                try {

                    categorySelect.selectByValue(
                            "Hardware Issue"
                    );

                }
                catch (Exception ignored) {
                }
            }

            System.out.println(
                    "Issue Category selected: "
                            + ISSUE_CATEGORY
            );
        }


        // Description
        WebElement description =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.xpath("//textarea")
                        )
                );

        description.clear();

        description.sendKeys(
                ISSUE_DESCRIPTION
        );

        System.out.println(
                "Issue Description entered"
        );


        // Priority
        selectPriority(
                PRIORITY
        );

        System.out.println(
                "Priority selected: "
                        + PRIORITY
        );
    }


    // ============================================================
    // SELECT PRIORITY
    // ============================================================

    private void selectPriority(
            String priority
    ) {

        List<WebElement> radios =
                driver.findElements(
                        By.xpath(
                                "//input[@type='radio']"
                        )
                );


        for (WebElement radio : radios) {

            String value =
                    radio.getAttribute(
                            "value"
                    );

            if (
                    value != null
                            &&
                    value.equalsIgnoreCase(
                            priority
                    )
            ) {

                clickJS(
                        radio
                );

                return;
            }
        }


        List<WebElement> labels =
                driver.findElements(
                        By.xpath(
                                "//label[contains(normalize-space(),'"
                                        + priority
                                        + "')]"
                        )
                );


        if (!labels.isEmpty()) {

            clickJS(
                    labels.get(0)
            );

            return;
        }


        throw new RuntimeException(
                "Priority not found: "
                        + priority
        );
    }


    // ============================================================
    // SUBMIT REQUEST
    // ============================================================

    private void submitRequest() {

        WebElement submit =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//button[normalize-space()='Submit Request']"
                                )
                        )
                );


        clickJS(submit);

        System.out.println(
                "Submit Request clicked"
        );

        sleep(1000);


        try {

            Alert alert =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(5)
                    ).until(
                            ExpectedConditions.alertIsPresent()
                    );

            String text =
                    alert.getText();

            System.out.println(
                    "Application response: "
                            + text
            );

            String lower =
                    text.toLowerCase();

            alert.accept();


            if (
                    lower.contains("error")
                            ||
                    lower.contains("violates")
                            ||
                    lower.contains("failed")
                            ||
                    lower.contains("foreign key")
            ) {

                throw new AssertionError(
                        "Maintenance request failed: "
                                + text
                );
            }

        }
        catch (
                org.openqa.selenium.TimeoutException e
        ) {

            System.out.println(
                    "No browser alert displayed"
            );
        }


        sleep(1500);

        System.out.println(
                "Maintenance request submitted"
        );
    }


    // ============================================================
    // LOGOUT
    // ============================================================

    private void logout() {

        List<WebElement> buttons =
                driver.findElements(
                        By.xpath(
                                "//*[self::button or self::a]"
                                +
                                "[normalize-space()='Logout']"
                        )
                );


        if (buttons.isEmpty()) {

            buttons =
                    driver.findElements(
                            By.xpath(
                                    "//*[contains(normalize-space(),"
                                    +
                                    "'Logout')]"
                            )
                    );
        }


        if (buttons.isEmpty()) {

            throw new RuntimeException(
                    "Logout button not found"
            );
        }


        clickJS(
                buttons.get(0)
        );

        sleep(1000);

        /*
         * Handle all logout alerts if any.
         */

        closeAnyOpenAlert();

        System.out.println(
                "Logout button clicked"
        );
    }


    // ============================================================
    // OPEN MAINTENANCE
    // ============================================================

    private void openMaintenance() {

        /*
         * First handle any unexpected alert.
         */

        closeAnyOpenAlert();


        List<WebElement> elements =
                driver.findElements(
                        By.xpath(
                                "//*[self::button or self::a]"
                                +
                                "[normalize-space()='Maintenance']"
                        )
                );


        if (elements.isEmpty()) {

            elements =
                    driver.findElements(
                            By.xpath(
                                    "//*[contains(normalize-space(),"
                                    +
                                    "'Maintenance')]"
                            )
                    );
        }


        if (elements.isEmpty()) {

            throw new RuntimeException(
                    "Maintenance menu not found"
            );
        }


        clickJS(
                elements.get(0)
        );

        sleep(1500);


        wait.until(
                driver -> {

                    String text =
                            driver.findElement(
                                    By.tagName("body")
                            ).getText();

                    return text.contains(
                            "Maintenance"
                    );
                }
        );
    }


    // ============================================================
    // WAIT FOR REPAIR ALERTS
    // ============================================================

    private void waitForRepairAlertsToFinish() {

        /*
         * The backend/UI can produce:
         *
         * Start repair for Ticket XX?
         * Repair started for Ticket XX
         *
         * The second alert may arrive later, so give the application
         * enough time to produce it and accept every alert.
         */
        for (int round = 0; round < 3; round++) {

            try {

                WebDriverWait alertWait =
                        new WebDriverWait(
                                driver,
                                Duration.ofSeconds(2)
                        );

                Alert alert =
                        alertWait.until(
                                ExpectedConditions.alertIsPresent()
                        );

                String message =
                        alert.getText();

                System.out.println(
                        "Alert: " + message
                );

                alert.accept();

                sleep(800);

            } catch (
                    org.openqa.selenium.TimeoutException e
            ) {

                /*
                 * No alert currently exists.
                 */
                break;

            } catch (
                    org.openqa.selenium.NoAlertPresentException e
            ) {

                break;
            }
        }

        /*
         * One final short check catches a delayed second alert.
         */
        closeAnyOpenAlert();
    }


    // ============================================================
    // FIND TICKET
    // ============================================================

    // ============================================================
    // WAIT FOR GLOBAL ACTION BUTTON
    // ============================================================

    private boolean waitForGlobalButton(
            String buttonText,
            int seconds
    ) {

        try {

            waitForGlobalButtonElement(
                    buttonText,
                    seconds
            );

            return true;

        } catch (Exception e) {

            return false;
        }
    }


    private WebElement waitForGlobalButtonElement(
            String buttonText,
            int seconds
    ) {

        WebDriverWait buttonWait =
                new WebDriverWait(
                        driver,
                        Duration.ofSeconds(seconds)
                );

        return buttonWait.until(d -> {

            try {

                closeAnyOpenAlert();

                List<WebElement> buttons =
                        d.findElements(
                                By.xpath(
                                        "//button[" +
                                        "contains(normalize-space(),'"
                                        + buttonText
                                        + "')]" +
                                        " | " +
                                        "//a[" +
                                        "contains(normalize-space(),'"
                                        + buttonText
                                        + "')]" +
                                        " | " +
                                        "//*[self::button or self::a][" +
                                        "contains(@value,'"
                                        + buttonText
                                        + "')]" 
                                )
                        );

                for (WebElement button : buttons) {

                    try {

                        if (button.isDisplayed()
                                && button.isEnabled()) {

                            return button;
                        }

                    } catch (Exception ignored) {
                    }
                }

                return null;

            } catch (org.openqa.selenium.UnhandledAlertException e) {

                closeAnyOpenAlert();
                return null;

            } catch (Exception e) {

                return null;
            }
        });
    }


    private WebElement findTicket() {

        WebDriverWait ticketWait =
                new WebDriverWait(
                        driver,
                        Duration.ofSeconds(30)
                );

        return ticketWait.until(d -> {

            try {

                // --------------------------------------------
                // TABLE ROW
                // --------------------------------------------

                List<WebElement> rows =
                        d.findElements(
                                By.xpath(
                                        "//tr[contains(.,'"
                                                + ASSET_ID
                                                + "')]"
                                )
                        );

                for (WebElement row : rows) {

                    try {
                        if (row.isDisplayed()) {
                            return row;
                        }
                    } catch (Exception ignored) {
                    }
                }

                // --------------------------------------------
                // CARDS / DIVS / OTHER ELEMENTS
                // --------------------------------------------

                List<WebElement> elements =
                        d.findElements(
                                By.xpath(
                                        "//*[contains(normalize-space(),'"
                                                + ASSET_ID
                                                + "')]"
                                )
                        );

                for (WebElement element : elements) {

                    try {

                        if (!element.isDisplayed()) {
                            continue;
                        }

                        // Prefer table row when available.
                        List<WebElement> parentRows =
                                element.findElements(
                                        By.xpath(
                                                "./ancestor::tr[1]"
                                        )
                                );

                        if (!parentRows.isEmpty()
                                && parentRows.get(0).isDisplayed()) {

                            return parentRows.get(0);
                        }

                        /*
                         * If the application uses cards instead of a
                         * table, return the nearest useful container.
                         */
                        List<WebElement> cards =
                                element.findElements(
                                        By.xpath(
                                                "./ancestor::*[" +
                                                "self::div or self::li" +
                                                "][.//button][1]"
                                        )
                                );

                        if (!cards.isEmpty()
                                && cards.get(0).isDisplayed()) {

                            return cards.get(0);
                        }

                    } catch (Exception ignored) {
                    }
                }

                return null;

            } catch (org.openqa.selenium.UnhandledAlertException e) {

                closeAnyOpenAlert();
                return null;

            } catch (Exception e) {

                return null;
            }
        });
    }


    // ============================================================
    // START REPAIR
    // ============================================================

    private void clickStartRepair(
            WebElement ticket
    ) {

        WebElement button =
                findButton(
                        ticket,
                        "Start Repair"
                );


        scrollTo(
                button
        );


        clickJS(
                button
        );


        sleep(700);


        /*
         * Handle BOTH alerts.
         *
         * This is the main fix for your current error.
         */

        handleAllAlerts();
        sleep(700);
        handleAllAlerts();


        /*
         * Give React time to update the database/UI.
         */

        sleep(1500);
    }


    // ============================================================
    // REPAIRED
    // ============================================================

    private void clickRepaired(
            WebElement ticket
    ) {

        WebElement button =
                findButton(
                        ticket,
                        "Repaired"
                );


        scrollTo(
                button
        );


        clickJS(
                button
        );


        sleep(700);


        /*
         * Handle confirmation + success alerts.
         */

        handleAllAlerts();
        sleep(700);
        handleAllAlerts();


        sleep(1500);
    }


    // ============================================================
    // FIND BUTTON
    // ============================================================

    private WebElement findButton(
            WebElement container,
            String text
    ) {

        List<WebElement> buttons =
                container.findElements(
                        By.xpath(
                                ".//button"
                        )
                );


        for (WebElement button : buttons) {

            String buttonText =
                    button.getText()
                            .trim();


            if (
                    buttonText.equalsIgnoreCase(
                            text
                    )
            ) {

                return button;
            }
        }


        for (WebElement button : buttons) {

            String buttonText =
                    button.getText()
                            .trim()
                            .toLowerCase();


            if (
                    buttonText.contains(
                            text.toLowerCase()
                    )
            ) {

                return button;
            }
        }


        /*
         * Search entire page.
         */

        List<WebElement> pageButtons =
                driver.findElements(
                        By.xpath(
                                "//button[contains(normalize-space(),'"
                                        + text
                                        + "')]"
                        )
                );


        for (WebElement button : pageButtons) {

            if (
                    button.isDisplayed()
            ) {

                return button;
            }
        }


        throw new RuntimeException(
                text
                        + " button not found"
        );
    }


    // ============================================================
    // CHECK ACTION BUTTON
    // ============================================================

    private boolean hasActionButton(
            WebElement ticket,
            String text
    ) {

        if (
                ticket == null
        ) {

            return false;
        }


        try {

            List<WebElement> buttons =
                    ticket.findElements(
                            By.xpath(
                                    ".//button"
                            )
                    );


            for (WebElement button : buttons) {

                if (
                        !button.isDisplayed()
                ) {

                    continue;
                }


                String buttonText =
                        button.getText()
                                .trim();


                if (
                        buttonText.equalsIgnoreCase(
                                text
                        )
                                ||
                        buttonText.toLowerCase()
                                .contains(
                                        text.toLowerCase()
                                )
                ) {

                    return true;
                }
            }

        }
        catch (Exception ignored) {
        }


        return false;
    }


    // ============================================================
    // WAIT FOR REPAIRED BUTTON
    // ============================================================

    private WebElement waitForRepairedButton(int seconds) {

        WebDriverWait buttonWait =
                new WebDriverWait(
                        driver,
                        Duration.ofSeconds(seconds)
                );

        return buttonWait.until(d -> {

            try {

                closeAnyOpenAlert();

                // Scroll progressively down the SAME page while waiting.
                // This is important because the Repaired button is below
                // the visible part of the maintenance page.
                JavascriptExecutor js = (JavascriptExecutor) d;
                js.executeScript(
                        "window.scrollBy(0, Math.max(500, window.innerHeight * 0.8));"
                );

                sleep(300);

                List<WebElement> buttons =
                        d.findElements(
                                By.xpath(
                                        "//button[contains(translate(normalize-space()," +
                                        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ'," +
                                        "'abcdefghijklmnopqrstuvwxyz'),'repaired')]"
                                )
                        );

                for (WebElement button : buttons) {

                    try {
                        if (button.isDisplayed() && button.isEnabled()) {
                            return button;
                        }
                    } catch (Exception ignored) {
                    }
                }

                return null;

            } catch (org.openqa.selenium.UnhandledAlertException e) {

                closeAnyOpenAlert();
                return null;

            } catch (Exception e) {

                return null;
            }
        });
    }


    // ============================================================
    // WAIT FOR COMPLETED STATUS
    // ============================================================

    private boolean waitForCompletedStatusAfterRepair(int seconds) {

        WebDriverWait completedWait =
                new WebDriverWait(
                        driver,
                        Duration.ofSeconds(seconds)
                );

        return completedWait.until(d -> {

            try {

                closeAnyOpenAlert();

                // Keep scrolling on the SAME page.
                scrollToBottom();
                sleep(400);

                String body =
                        d.findElement(By.tagName("body")).getText();

                if (body != null &&
                        body.toLowerCase().contains("completed")) {
                    return true;
                }

                List<WebElement> completedElements =
                        d.findElements(
                                By.xpath(
                                        "//*[contains(translate(normalize-space()," +
                                        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ'," +
                                        "'abcdefghijklmnopqrstuvwxyz'),'completed')]"
                                )
                        );

                for (WebElement element : completedElements) {
                    try {
                        if (element.isDisplayed()) {
                            return true;
                        }
                    } catch (Exception ignored) {
                    }
                }

                return false;

            } catch (org.openqa.selenium.UnhandledAlertException e) {

                closeAnyOpenAlert();
                return false;

            } catch (Exception e) {

                return false;
            }
        });
    }


    private boolean waitForCompletedStatus(int seconds) {

        WebDriverWait completedWait =
                new WebDriverWait(
                        driver,
                        Duration.ofSeconds(seconds)
                );

        try {

            return completedWait.until(d -> {

                try {

                    closeAnyOpenAlert();

                    String body =
                            d.findElement(
                                    By.tagName("body")
                            ).getText();

                    if (
                            body != null
                                    &&
                            body.toLowerCase()
                                    .contains("completed")
                    ) {

                        return true;
                    }

                    /*
                     * Check status-like elements too.
                     */
                    List<WebElement> elements =
                            d.findElements(
                                    By.xpath(
                                            "//*[contains(" +
                                            "translate(normalize-space()," +
                                            "'ABCDEFGHIJKLMNOPQRSTUVWXYZ'," +
                                            "'abcdefghijklmnopqrstuvwxyz')," +
                                            "'completed')]"
                                    )
                            );

                    for (WebElement element : elements) {

                        try {

                            if (element.isDisplayed()) {
                                return true;
                            }

                        } catch (Exception ignored) {
                        }
                    }

                    return false;

                } catch (Exception e) {

                    return false;
                }
            });

        } catch (org.openqa.selenium.TimeoutException e) {

            /*
             * If the Repaired action is gone after the update and the
             * ticket remains on the Maintenance page, that is still a
             * useful fallback signal that the transition occurred.
             */
            try {

                closeAnyOpenAlert();

                List<WebElement> repaired =
                        driver.findElements(
                                By.xpath(
                                        "//button[contains(" +
                                        "translate(normalize-space()," +
                                        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ'," +
                                        "'abcdefghijklmnopqrstuvwxyz')," +
                                        "'repaired')]"
                                )
                        );

                for (WebElement button : repaired) {

                    if (button.isDisplayed()) {
                        return false;
                    }
                }

            } catch (Exception ignored) {
            }

            return false;
        }
    }


    // ============================================================
    // CHECK STATUS
    // ============================================================

    private boolean ticketShowsStatus(
            WebElement ticket,
            String status
    ) {

        if (ticket == null) {
            return false;
        }

        try {

            String ticketText =
                    ticket.getText();

            if (ticketText != null
                    && ticketText.toLowerCase()
                    .contains(status.toLowerCase())) {

                return true;
            }

            /*
             * React may replace the ticket DOM after an update.
             * Check the visible page as a fallback.
             */
            String pageText =
                    driver.findElement(By.tagName("body")).getText();

            return pageText.toLowerCase()
                    .contains(status.toLowerCase());

        } catch (Exception e) {

            return false;
        }
    }


    // ============================================================
    // HANDLE LOGIN ALERT
    // ============================================================

    private void waitAndAcceptLoginAlert() {

        try {
            Alert alert =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(10)
                    ).until(
                            ExpectedConditions.alertIsPresent()
                    );

            String message = alert.getText();

            System.out.println(
                    "Login alert: " + message
            );

            alert.accept();

            System.out.println(
                    "Login alert accepted"
            );

        } catch (org.openqa.selenium.TimeoutException e) {

            throw new AssertionError(
                    "Login completed but the expected browser alert " +
                    "was not displayed."
            );
        } catch (org.openqa.selenium.NoAlertPresentException e) {

            throw new AssertionError(
                    "Login alert disappeared before it could be accepted."
            );
        }

        // Give the browser a moment to finish the React navigation.
        sleep(700);
    }


    // ============================================================
    // CLOSE ANY REMAINING ALERTS
    // ============================================================

    private void closeAnyOpenAlert() {

        for (int i = 0; i < 5; i++) {

            try {

                Alert alert =
                        new WebDriverWait(
                                driver,
                                Duration.ofSeconds(1)
                        ).until(
                                ExpectedConditions.alertIsPresent()
                        );

                String text = alert.getText();

                System.out.println(
                        "Closing remaining alert: " + text
                );

                alert.accept();

                sleep(400);

            } catch (org.openqa.selenium.TimeoutException e) {

                break;

            } catch (org.openqa.selenium.NoAlertPresentException e) {

                break;
            }
        }
    }


    // ============================================================
    // HANDLE ALL ALERTS
    // ============================================================

    private void handleAllAlerts() {

        /*
         * Some ITAMS actions can display more than one alert.
         * Keep accepting alerts until none remains.
         */
        closeAnyOpenAlert();
    }


    // ============================================================
    // JAVASCRIPT CLICK
    // ============================================================

    private void clickJS(
            WebElement element
    ) {

        JavascriptExecutor js =
                (JavascriptExecutor) driver;


        js.executeScript(
                "arguments[0].click();",
                element
        );
    }


    // ============================================================
    // SCROLL
    // ============================================================

    private void scrollDownPage() {

        JavascriptExecutor js = (JavascriptExecutor) driver;

        js.executeScript(
                "window.scrollBy(0, Math.max(700, window.innerHeight));"
        );

        sleep(700);
    }


    private void scrollToBottom() {

        JavascriptExecutor js = (JavascriptExecutor) driver;

        js.executeScript(
                "window.scrollTo({top: document.body.scrollHeight, behavior: 'instant'});"
        );

        sleep(800);
    }


    private void scrollTo(
            WebElement element
    ) {

        JavascriptExecutor js =
                (JavascriptExecutor) driver;


        js.executeScript(
                "arguments[0].scrollIntoView({block:'center'});",
                element
        );


        sleep(300);
    }


    // ============================================================
    // PAGE READY
    // ============================================================

    private void waitForPageReady() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(20)
            ).until(
                    d ->
                            ((JavascriptExecutor) d)
                                    .executeScript(
                                            "return document.readyState"
                                    )
                                    .equals(
                                            "complete"
                                    )
            );

        }
        catch (Exception ignored) {
        }
    }


    // ============================================================
    // SLEEP
    // ============================================================

    private void sleep(
            long milliseconds
    ) {

        try {

            Thread.sleep(
                    milliseconds
            );

        }
        catch (InterruptedException e) {

            Thread.currentThread()
                    .interrupt();
        }
    }


    // ============================================================
    // TEARDOWN
    // ============================================================

    @AfterEach
    public void tearDown() {

        if (
                driver != null
        ) {

            try {

                handleAllAlerts();

            }
            catch (Exception ignored) {
            }


            driver.quit();

            System.out.println();
            System.out.println(
                    "Browser closed"
            );
        }
    }
}
