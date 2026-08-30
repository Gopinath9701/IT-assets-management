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

public class AssetReturnTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "http://localhost:3000/";

    private static final String ASSET_MANAGER_ID = "260822002";
    private static final String ASSET_MANAGER_PASSWORD = "Itams@2026a";

    private static final String EMPLOYEE_ID = "260822004";

    // From your employee details screenshot, PRI005 is assigned
    // to employee 260822004.
    private static final String RETURN_ASSET_ID = "MOU009";

    // Return condition for this test.
    private static final String RETURN_CONDITION = "Good";

    // Remark is optional, but we provide one for the test.
    private static final String RETURN_REMARK =
            "Returned in good condition";

    @BeforeEach
    public void setUp() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("          ITAMS ASSET RETURN TEST");
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
    public void assetReturnTest() {

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
        // STEP 3 - OPEN ASSET RETURN
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 3: OPEN ASSET RETURN"
        );

        WebElement returnButton =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Return']"
                                )
                        )
                );

        scrollTo(returnButton);

        clickJS(returnButton);

        sleep(1000);

        waitForAnyText(
                "Asset Return",
                "Search Employee",
                "Enter Employee ID"
        );

        System.out.println(
                "Asset Return page opened"
        );


        // =====================================================
        // STEP 4 - ENTER EMPLOYEE ID
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 4: SEARCH EMPLOYEE"
        );

        WebElement employeeField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//input[contains(@placeholder,'Employee ID')]"
                                        + " | "
                                        + "//input[@name='employeeId']"
                                )
                        )
                );

        employeeField.clear();

        employeeField.sendKeys(
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
        // STEP 6 - VERIFY EMPLOYEE ASSETS
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 6: VERIFY ASSIGNED ASSETS"
        );

        waitForAnyText(
                RETURN_ASSET_ID,
                "Assigned Assets",
                "Return"
        );

        WebElement assetRow =
                wait.until(
                        d -> findAssignedAssetRow(
                                RETURN_ASSET_ID
                        )
                );

        assertTrue(
                assetRow != null,
                "Assigned asset "
                        + RETURN_ASSET_ID
                        + " was not found in the Assigned Assets section for employee "
                        + EMPLOYEE_ID
        );

        System.out.println(
                "Assigned asset found: "
                        + RETURN_ASSET_ID
        );


        // =====================================================
        // STEP 7 - CLICK RETURN
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 7: CLICK RETURN FOR ASSET"
        );

        WebElement rowReturnButton =
                findReturnButtonForAsset(
                        assetRow,
                        RETURN_ASSET_ID
                );

        /*
         * In the application the asset text and its Return action can be
         * rendered in different nested containers, so the button is not
         * necessarily a direct child of the detected row element.
         */
        assertTrue(
                rowReturnButton != null,
                "Return button was not found for asset "
                        + RETURN_ASSET_ID
        );

        scrollTo(rowReturnButton);

        clickJS(rowReturnButton);

        sleep(700);

        System.out.println(
                "Return clicked for "
                        + RETURN_ASSET_ID
        );


        // =====================================================
        // STEP 8 - SELECT CONDITION
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 8: SELECT RETURN CONDITION"
        );

        /*
         * The application supports:
         * Good
         * Damaged
         * Faulty
         */
        WebElement conditionSelect =
                wait.until(
                        d -> findConditionSelect()
                );

        assertTrue(
                conditionSelect != null,
                "Return condition dropdown was not found"
        );

        Select condition =
                new Select(
                        conditionSelect
                );

        boolean conditionFound = false;

        for (WebElement option :
                condition.getOptions()) {

            if (
                    option.getText()
                            .trim()
                            .equalsIgnoreCase(
                                    RETURN_CONDITION
                            )
            ) {

                condition.selectByVisibleText(
                        option.getText().trim()
                );

                conditionFound = true;
                break;
            }
        }

        assertTrue(
                conditionFound,
                "Return condition '"
                        + RETURN_CONDITION
                        + "' was not found"
        );

        System.out.println(
                "Return condition selected: "
                        + RETURN_CONDITION
        );


        // =====================================================
        // STEP 9 - ENTER OPTIONAL REMARK
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 9: ENTER OPTIONAL REMARK"
        );

        WebElement remark =
                findVisible(
                        driver,
                        By.xpath(
                                "//textarea[contains(@placeholder,'Remark')]"
                                        + " | "
                                        + "//textarea[contains(@placeholder,'remark')]"
                                        + " | "
                                        + "//textarea"
                        )
                );

        if (remark != null) {

            remark.clear();

            remark.sendKeys(
                    RETURN_REMARK
            );

            System.out.println(
                    "Remark entered: "
                            + RETURN_REMARK
            );

        } else {

            System.out.println(
                    "Remark field not required / not displayed"
            );
        }


        // =====================================================
        // STEP 10 - CONFIRM RETURN
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 10: CONFIRM RETURN"
        );

        WebElement confirmReturn =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Confirm Return']"
                                        + " | "
                                        + "//button[contains(normalize-space(),'Confirm Return')]"
                                )
                        )
                );

        scrollTo(confirmReturn);

        clickJS(confirmReturn);

        sleep(1000);

        System.out.println(
                "Confirm Return clicked"
        );


        // =====================================================
        // STEP 11 - VERIFY RETURN RESULT
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 11: VERIFY RETURN RESULT"
        );

        boolean alertHandled = false;

        try {

            Alert alert =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(8)
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

            /*
             * A successful return may show a success alert, but we do
             * not depend on the exact wording of that alert.
             */
            assertTrue(
                    !lower.contains("error")
                            &&
                    !lower.contains("failed")
                            &&
                    !lower.contains("unable"),
                    "Application returned an error: " + message
            );

            alert.accept();

            alertHandled = true;

        } catch (org.openqa.selenium.TimeoutException ignored) {

            System.out.println(
                    "No browser alert displayed after Confirm Return"
            );
        }


        // =====================================================
        // STEP 12 - REFRESH / SEARCH EMPLOYEE AGAIN
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 12: VERIFY RETURNED ASSET"
        );

        searchEmployeeAgain(
                EMPLOYEE_ID
        );

        sleep(1000);

        String pageText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        /*
         * Your actual application keeps the returned asset in the page
         * with its return condition. The observed row after confirmation
         * is:
         *
         * PRI005 260822004 Printer 29-08-2026 Good -
         *
         * Therefore "Good" is the reliable UI confirmation for this
         * return workflow. We also confirm that the asset and employee
         * IDs remain associated with the return record.
         */
        assertTrue(
                pageText.contains(RETURN_ASSET_ID),
                "Returned asset ID " + RETURN_ASSET_ID
                        + " is not displayed after return"
        );

        assertTrue(
                pageText.contains(EMPLOYEE_ID),
                "Employee ID " + EMPLOYEE_ID
                        + " is not displayed after return"
        );

        assertTrue(
                pageText.toLowerCase().contains(
                        RETURN_CONDITION.toLowerCase()
                ),
                "Return condition '" + RETURN_CONDITION
                        + "' is not displayed after return"
        );

        /*
         * The returned record should no longer present an actionable
         * Return button for PRI005. Check the row specifically.
         */
        WebElement returnedRow =
                findAssignedAssetRow(
                        RETURN_ASSET_ID
                );

        assertTrue(
                returnedRow != null,
                "Returned asset record was not found"
        );

        String returnedRowText =
                returnedRow.getText();

        System.out.println(
                "Returned asset record: "
                        + returnedRowText
        );

        boolean stillActionable =
                findVisible(
                        returnedRow,
                        By.xpath(
                                ".//button[normalize-space()='Return']"
                        )
                ) != null;

        assertTrue(
                !stillActionable,
                "PRI005 still has an active Return button"
        );

        assertTrue(
                alertHandled
                        || returnedRowText.contains(RETURN_CONDITION)
                        || pageText.contains(
                                "Return History"
                        )
                        || pageText.contains(
                                "Returned Assets"
                        ),
                "Return could not be verified from the UI"
        );

        System.out.println(
                "Asset return verified successfully"
        );

        // =====================================================
        // FINAL
        // =====================================================

        System.out.println();
        System.out.println(
                "=============================================="
        );

        System.out.println(
                "         ASSET RETURN TEST PASSED"
        );

        System.out.println(
                "=============================================="
        );
    }


    private void searchEmployeeAgain(
            String employeeId
    ) {

        WebElement employeeField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//input[contains(@placeholder,'Employee ID')]"
                                        + " | "
                                        + "//input[@name='employeeId']"
                                )
                        )
                );

        employeeField.clear();
        employeeField.sendKeys(employeeId);

        WebElement searchButton =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Search']"
                                )
                        )
                );

        clickJS(searchButton);

        sleep(1000);

        wait.until(
                d -> {

                    try {
                        String body =
                                d.findElement(
                                        By.tagName("body")
                                ).getText();

                        return body != null
                                && body.contains(employeeId);

                    } catch (Exception e) {
                        return false;
                    }
                }
        );
    }


    private WebElement findReturnButtonForAsset(
            WebElement assetElement,
            String assetId
    ) {

        /*
         * 1. First try the detected table/card element itself.
         */
        WebElement button =
                findVisible(
                        assetElement,
                        By.xpath(
                                ".//button[normalize-space()='Return']"
                                        + " | "
                                        + ".//button[contains(normalize-space(),'Return')]"
                        )
                );

        if (button != null) {
            return button;
        }


        /*
         * 2. Walk upward through parent containers only as a fallback.
         */
        WebElement current =
                assetElement;

        for (int level = 0; level < 5; level++) {

            try {

                current =
                        current.findElement(
                                By.xpath("./..")
                        );

                button =
                        findVisible(
                                current,
                                By.xpath(
                                        ".//button[normalize-space()='Return']"
                                )
                        );

                if (button != null) {
                    return button;
                }

            } catch (Exception ignored) {
                break;
            }
        }


        /*
         * 3. Use the exact asset ID text as an anchor and inspect its
         * nearest ancestors for a Return button.
         */
        List<WebElement> assetTexts =
                driver.findElements(
                        By.xpath(
                                "//*[normalize-space()='"
                                        + assetId
                                        + "']"
                        )
                );

        for (WebElement assetText : assetTexts) {

            try {

                if (!assetText.isDisplayed()) {
                    continue;
                }

                WebElement parent =
                        assetText;

                for (int level = 0; level < 8; level++) {

                    parent =
                            parent.findElement(
                                    By.xpath("./..")
                            );

                    button =
                            findVisible(
                                    parent,
                                    By.xpath(
                                            ".//button[normalize-space()='Return']"
                                                    + " | "
                                                    + ".//button[contains(normalize-space(),'Return')]"
                                    )
                            );

                    if (button != null) {
                        return button;
                    }
                }

            } catch (Exception ignored) {
            }
        }


        /*
         * 4. Final fallback: if the searched result contains exactly one
         * visible Return button, use it. This avoids selecting a button
         * from an unrelated page section when several are present.
         */
        List<WebElement> returnButtons =
                driver.findElements(
                        By.xpath(
                                "//button[normalize-space()='Return']"
                                        + " | "
                                        + "//button[contains(normalize-space(),'Return')]"
                        )
                );

        WebElement onlyButton = null;
        int visibleCount = 0;

        for (WebElement candidate :
                returnButtons) {

            try {

                if (
                        candidate.isDisplayed()
                                &&
                        candidate.isEnabled()
                ) {
                    onlyButton = candidate;
                    visibleCount++;
                }

            } catch (Exception ignored) {
            }
        }

        if (visibleCount == 1) {
            return onlyButton;
        }

        return null;
    }


    // =====================================================
    // FIND CURRENT ASSIGNED ASSET ROW
    // =====================================================

    private WebElement findAssignedAssetRow(
            String assetId
    ) {

        /*
         * The page contains two different tables:
         *   1. Assigned Assets
         *   2. Asset Return History
         *
         * The asset ID may also exist in the history table, so search
         * only inside the "2. Assigned Assets" section.
         */
        List<WebElement> headings =
                driver.findElements(
                        By.xpath(
                                "//*[normalize-space()='2. Assigned Assets']"
                        )
                );

        for (WebElement heading : headings) {

            try {

                if (!heading.isDisplayed()) {
                    continue;
                }

                /*
                 * Move up to the nearest container that contains the
                 * Assigned Assets heading and a table.
                 */
                WebElement section =
                        heading;

                for (int level = 0; level < 5; level++) {

                    section =
                            section.findElement(
                                    By.xpath("./..")
                            );

                    List<WebElement> rows =
                            section.findElements(
                                    By.xpath(".//tr")
                            );

                    if (!rows.isEmpty()) {

                        for (WebElement row :
                                rows) {

                            try {

                                if (!row.isDisplayed()) {
                                    continue;
                                }

                                String rowText =
                                        row.getText();

                                if (
                                        rowText != null
                                                &&
                                        rowText.contains(assetId)
                                ) {
                                    return row;
                                }

                            } catch (Exception ignored) {
                            }
                        }
                    }
                }

            } catch (Exception ignored) {
            }
        }

        /*
         * Fallback: find the exact asset ID, then only accept it when
         * the nearest table has a Return button in the same row.
         */
        List<WebElement> exactAssetIds =
                driver.findElements(
                        By.xpath(
                                "//*[normalize-space()='"
                                        + assetId
                                        + "']"
                        )
                );

        for (WebElement assetElement :
                exactAssetIds) {

            try {

                if (!assetElement.isDisplayed()) {
                    continue;
                }

                WebElement row =
                        assetElement.findElement(
                                By.xpath(
                                        "./ancestor::tr[1]"
                                )
                        );

                if (row != null) {

                    WebElement returnButton =
                            findVisible(
                                    row,
                                    By.xpath(
                                            ".//button[normalize-space()='Return']"
                                    )
                            );

                    if (returnButton != null) {
                        return row;
                    }
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }


    // =====================================================
    // FIND ASSET ROW
    // =====================================================

    private WebElement findAssetRow(
            String assetId
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
                        text.contains(assetId)
                ) {
                    return row;
                }

            } catch (Exception ignored) {
            }
        }


        // Fallback for div-based rows.
        List<WebElement> elements =
                driver.findElements(
                        By.xpath(
                                "//*[contains(normalize-space(),'"
                                        + assetId
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

                return element;

            } catch (Exception ignored) {
            }
        }

        return null;
    }


    // =====================================================
    // FIND CONDITION SELECT
    // =====================================================

    private WebElement findConditionSelect() {

        List<WebElement> selects =
                driver.findElements(
                        By.xpath("//select")
                );

        for (WebElement select :
                selects) {

            try {

                if (!select.isDisplayed()) {
                    continue;
                }

                Select s =
                        new Select(select);

                for (WebElement option :
                        s.getOptions()) {

                    String text =
                            option.getText()
                                    .trim();

                    if (
                            text.equalsIgnoreCase("Good")
                                    ||
                            text.equalsIgnoreCase("Damaged")
                                    ||
                            text.equalsIgnoreCase("Faulty")
                    ) {
                        return select;
                    }
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
                "Employee ID entered: "
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
    // PAGE HELPERS
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
                                        body.toLowerCase()
                                                .contains(
                                                        text.toLowerCase()
                                                )
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
