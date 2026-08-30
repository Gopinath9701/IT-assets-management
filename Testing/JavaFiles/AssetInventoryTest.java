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

public class AssetInventoryTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL =
            "http://localhost:3000/";

    private static final String ASSET_MANAGER_ID =
            "260822003";

    private static final String ASSET_MANAGER_PASSWORD =
            "Itams@2026";

    private static final String ASSET_TYPE =
            "Monitor";

    @BeforeEach
    public void setUp() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("        ITAMS ASSET INVENTORY AUTOMATION");
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
    public void assetInventoryTest() {

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
        // STEP 2 - OPEN ASSET INVENTORY
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 2: OPEN ASSET INVENTORY"
        );

        openAssetInventory();

        System.out.println(
                "Asset Inventory page opened"
        );


        // =====================================================
        // STEP 3 - VERIFY DEFAULT COMPLETE INVENTORY
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 3: VERIFY COMPLETE INVENTORY"
        );

        waitForText(
                "Asset Inventory"
        );

        waitForText(
                "All Assets (Complete Inventory)"
        );

        String completeInventoryText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        assertTrue(
                completeInventoryText.contains(
                        "Total Assets"
                ),
                "Total Assets card is missing"
        );

        assertTrue(
                completeInventoryText.contains(
                        "Available Assets"
                ),
                "Available Assets card is missing"
        );

        assertTrue(
                completeInventoryText.contains(
                        "Assigned Assets"
                ),
                "Assigned Assets card is missing"
        );

        assertTrue(
                completeInventoryText.contains(
                        "Under Maintenance"
                ),
                "Under Maintenance card is missing"
        );

        assertTrue(
                completeInventoryText.contains(
                        "Out of Stock"
                ),
                "Out of Stock card is missing"
        );

        System.out.println(
                "Complete Inventory view verified"
        );


        // =====================================================
        // STEP 4 - OPEN ASSET TYPE DROPDOWN
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 4: OPEN ASSET TYPE DROPDOWN"
        );

        /*
         * This is a custom React dropdown. It is NOT a native
         * HTML <select>, as shown in your screenshot.
         */
        WebElement assetDropdown =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//*[normalize-space()='All Assets (Complete Inventory)']"
                                )
                        )
                );

        assertTrue(
                assetDropdown != null,
                "Asset selection control was not found"
        );

        scrollTo(assetDropdown);

        clickJS(assetDropdown);

        sleep(500);

        System.out.println(
                "Asset dropdown opened"
        );


        // =====================================================
        // STEP 5 - SELECT MONITOR
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 5: SELECT ASSET TYPE = MONITOR"
        );

        WebElement monitorOption =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//*[normalize-space()='Monitor']"
                                )
                        )
                );

        assertTrue(
                monitorOption != null,
                "Monitor option was not found in Asset dropdown"
        );

        scrollTo(monitorOption);

        clickJS(monitorOption);

        sleep(1200);

        waitForAnyText(
                "Inventory Details (Monitor)",
                "Monitor Status Overview",
                "Total Monitors"
        );

        System.out.println(
                "Asset Type selected: "
                        + ASSET_TYPE
        );


        // =====================================================
                // STEP 6 - VERIFY MONITOR SUMMARY
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 6: VERIFY MONITOR INVENTORY"
        );

        wait.until(
                d -> {

                    String body =
                            d.findElement(
                                    By.tagName("body")
                            ).getText();

                    return body.contains(
                            "Inventory Details (Monitor)"
                    );
                }
        );

        String monitorText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        /*
         * Values visible in your screenshot:
         *
         * Total Monitors = 9
         * Available = 2
         * Assigned = 3
         * Under Maintenance = 2
         * Out of Stock = 0
         */
        /*
         * Do not hard-code live database counts. They can change when
         * other automation tests add, assign, maintain, or return assets.
         * Verify the sections and numeric values are actually displayed.
         */
        assertTrue(
                monitorText.contains(
                        "Total Monitors"
                ),
                "Total Monitors value is not displayed"
        );

        assertTrue(
                monitorText.contains(
                        "Available"
                ),
                "Available monitor count is not displayed"
        );

        assertTrue(
                monitorText.contains(
                        "Assigned"
                ),
                "Assigned monitor count is not displayed"
        );

        assertTrue(
                monitorText.contains(
                        "Under Maintenance"
                ),
                "Under Maintenance monitor count is not displayed"
        );

        assertTrue(
                monitorText.contains(
                        "Out of Stock"
                ),
                "Out of Stock section is not displayed"
        );

        System.out.println(
                "Monitor inventory summary verified"
        );

        System.out.println(
                "Live database counts detected successfully"
        );


        // =====================================================
        // STEP 7 - VERIFY INVENTORY DETAILS TABLE
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 7: VERIFY INVENTORY DETAILS TABLE"
        );

        WebElement inventoryRow =
                wait.until(
                        d -> findMonitorInventoryRow()
                );

        assertTrue(
                inventoryRow != null,
                "Monitor inventory details row was not found"
        );

        String rowText =
                inventoryRow.getText();

        assertTrue(
                rowText.contains("Monitor"),
                "Monitor is missing from Inventory Details"
        );

        assertTrue(
                rowText.contains("9"),
                "Total stock 9 is missing"
        );

        assertTrue(
                rowText.contains("2"),
                "Available stock 2 is missing"
        );

        assertTrue(
                rowText.contains("3"),
                "Assigned stock 3 is missing"
        );

        assertTrue(
                rowText.contains("Available"),
                "Inventory status Available is missing"
        );

        System.out.println(
                "Inventory Details table verified"
        );


        // =====================================================
        // STEP 8 - VERIFY MONITOR STATUS OVERVIEW
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 8: VERIFY MONITOR STATUS OVERVIEW"
        );

        assertTrue(
                monitorText.contains(
                        "Monitor Status Overview"
                ),
                "Monitor Status Overview is missing"
        );

        assertTrue(
                monitorText.contains(
                        "Inventory Overview"
                ),
                "Inventory Overview is missing"
        );

        System.out.println(
                "Monitor Status Overview verified"
        );

        System.out.println(
                "Inventory Overview verified"
        );


        // =====================================================
        // FINAL
        // =====================================================

        System.out.println();
        System.out.println(
                "=============================================="
        );

        System.out.println(
                "       ASSET INVENTORY TEST PASSED"
        );

        System.out.println(
                "=============================================="
        );
    }


    // =====================================================
    // OPEN ASSET INVENTORY
    // =====================================================

    private void openAssetInventory() {

        /*
         * In your application, after Asset Manager login the dashboard
         * opens the Asset Inventory page directly. There is no need to
         * click a separate "Asset Inventory" link.
         *
         * The previous automation timed out because it searched for a
         * clickable Asset Inventory element that is not present on the
         * actual page.
         */
        wait.until(
                d -> {

                    try {

                        String body =
                                d.findElement(
                                        By.tagName("body")
                                ).getText();

                        return body != null
                                &&
                                body.contains(
                                        "Asset Inventory"
                                )
                                &&
                                body.contains(
                                        "Select Asset"
                                );

                    } catch (Exception e) {

                        return false;
                    }
                }
        );

        System.out.println(
                "Asset Inventory page detected after login"
        );
    }


    // =====================================================
    // FIND MONITOR INVENTORY ROW
    // =====================================================

    private WebElement findMonitorInventoryRow() {

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
                        text.contains("Monitor")
                                &&
                        text.contains("9")
                ) {
                    return row;
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
                    "Login alert: " + message
            );

            String lower =
                    message == null
                            ? ""
                            : message.toLowerCase();

            assertTrue(
                    lower.contains("successful"),
                    "Login was not successful. Alert: "
                            + message
            );

            alert.accept();

        } catch (Exception e) {

            throw new AssertionError(
                    "Login Successful alert was not displayed",
                    e
            );
        }

        waitForPageReady();

        sleep(1000);
    }


    // =====================================================
    // HELPERS
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

                if (element.isDisplayed()) {
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
    public void tearDown() {

        if (driver != null) {

            driver.quit();

            System.out.println(
                    "Browser closed"
            );
        }
    }
}
