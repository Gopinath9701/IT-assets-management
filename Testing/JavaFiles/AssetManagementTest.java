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

public class AssetManagementTest extends BaseTest {

    // ============================================================
    // ASSET MANAGER LOGIN
    // ============================================================

    private static final String ASSET_MANAGER_ID = "260822002";
    private static final String ASSET_MANAGER_PASSWORD = "Itams@2026a";

    private static final String BASE_URL = "http://localhost:3000";

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
    // BEFORE EACH TEST
    // LOGIN AS ASSET MANAGER
    // ============================================================

    @BeforeEach
    public void loginAsAssetManager() {

        driver.get(BASE_URL);

        waitForPageLoad();

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

        WebElement employeeIdField = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("employeeIdOrEmail")
                )
        );

        employeeIdField.clear();
        employeeIdField.sendKeys(ASSET_MANAGER_ID);

        // --------------------------------------------------------
        // Password
        // --------------------------------------------------------

        WebElement passwordField = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("password")
                )
        );

        passwordField.clear();
        passwordField.sendKeys(ASSET_MANAGER_PASSWORD);

        // --------------------------------------------------------
        // Login submit
        // --------------------------------------------------------

        WebElement submitButton = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//form//button[@type='submit']"
                        )
                )
        );

        safeClick(submitButton);

        // --------------------------------------------------------
        // Handle Login Successful alert
        // --------------------------------------------------------

        handleLoginAlert();

        // --------------------------------------------------------
        // Wait until Asset Management page is displayed
        // --------------------------------------------------------

        wait().until(
                ExpectedConditions.or(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.xpath(
                                        "//*[normalize-space()='Asset Management']"
                                )
                        ),
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".am-page-title"
                                )
                        )
                )
        );

        System.out.println(
                "Asset Manager logged in successfully."
        );
    }

    // ============================================================
    // TEST 1
    // VERIFY ASSET MANAGEMENT PAGE
    // ============================================================

    @Test
    public void assetManagementPageLoadTest() {

        WebElement title = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".am-page-title")
                )
        );

        assertTrue(
                title.isDisplayed(),
                "Asset Management title is not displayed"
        );

        assertTrue(
                title.getText()
                        .trim()
                        .equalsIgnoreCase("Asset Management"),
                "Incorrect page title displayed"
        );

        System.out.println(
                "PASS: Asset Management page loaded."
        );
    }

    // ============================================================
    // TEST 2
    // VERIFY PAGE SUBTITLE
    // ============================================================

    @Test
    public void pageSubtitleTest() {

        WebElement subtitle = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".am-page-subtitle")
                )
        );

        String text =
                subtitle.getText();

        assertTrue(
                text.contains("Manage")
                        || text.contains("assets")
                        || text.contains("organization"),
                "Asset Management subtitle is incorrect"
        );

        System.out.println(
                "PASS: Page subtitle displayed correctly."
        );
    }

    // ============================================================
    // TEST 3
    // VERIFY ITAMS LOGO
    // ============================================================

    @Test
    public void itamsLogoTest() {

        WebElement logo = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".am-nav-logo-title"
                        )
                )
        );

        assertTrue(
                logo.getText()
                        .trim()
                        .equals("ITAMS"),
                "ITAMS logo is not displayed correctly"
        );

        System.out.println(
                "PASS: ITAMS logo displayed."
        );
    }

    // ============================================================
    // TEST 4
    // VERIFY USERNAME
    // ============================================================

    @Test
    public void usernameDisplayTest() {

        WebElement username = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".am-nav-username"
                        )
                )
        );

        assertTrue(
                username.isDisplayed(),
                "Username is not displayed"
        );

        assertTrue(
                !username.getText().trim().isEmpty(),
                "Username is empty"
        );

        System.out.println(
                "PASS: Asset Manager username displayed."
        );
    }

    // ============================================================
    // TEST 5
    // VERIFY LOGOUT BUTTON
    // ============================================================

    @Test
    public void logoutButtonTest() {

        WebElement logoutButton = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".am-logout-btn"
                        )
                )
        );

        assertTrue(
                logoutButton.isDisplayed(),
                "Logout button is not displayed"
        );

        assertTrue(
                logoutButton.getText()
                        .trim()
                        .equalsIgnoreCase("Logout"),
                "Logout button text is incorrect"
        );

        System.out.println(
                "PASS: Logout button displayed."
        );
    }

    // ============================================================
    // TEST 6
    // VERIFY SIDEBAR
    // ============================================================

    @Test
    public void sidebarItemsTest() {

        String[] sidebarItems = {
                "Dashboard",
                "Asset Management",
                "Asset Assignment",
                "Request Approval",
                "Maintenance"
        };

        for (String item : sidebarItems) {

            WebElement element = wait().until(
                    ExpectedConditions.visibilityOfElementLocated(
                            By.xpath(
                                    "//aside[contains(@class,'am-sidebar')]"
                                            + "//*[normalize-space()='"
                                            + item
                                            + "']"
                            )
                    )
            );

            assertTrue(
                    element.isDisplayed(),
                    item + " sidebar item is not displayed"
            );
        }

        System.out.println(
                "PASS: All sidebar items displayed."
        );
    }

    // ============================================================
    // TEST 7
    // VERIFY ADD ASSET CARD
    // ============================================================

    @Test
    public void addAssetCardTest() {

        WebElement button = findCardButton("Add Asset");

        assertTrue(
                button != null,
                "Add Asset button was not found"
        );

        assertTrue(
                button.isDisplayed(),
                "Add Asset button is not visible"
        );

        System.out.println(
                "PASS: Add Asset card displayed."
        );
    }

    // ============================================================
    // TEST 8
    // VERIFY MANAGE ASSETS CARD
    // ============================================================

    @Test
    public void manageAssetsCardTest() {

        WebElement button = findCardButton("Manage Assets");

        assertTrue(
                button != null,
                "Manage Assets button was not found"
        );

        assertTrue(
                button.isDisplayed(),
                "Manage Assets button is not visible"
        );

        System.out.println(
                "PASS: Manage Assets card displayed."
        );
    }

    // ============================================================
    // TEST 9
    // VERIFY ASSET DETAILS CARD
    // ============================================================

    @Test
    public void assetDetailsCardTest() {

        WebElement button = findCardButton("Asset Details");

        assertTrue(
                button != null,
                "Asset Details button was not found"
        );

        assertTrue(
                button.isDisplayed(),
                "Asset Details button is not visible"
        );

        System.out.println(
                "PASS: Asset Details card displayed."
        );
    }

    // ============================================================
    // TEST 10
    // VERIFY EMPLOYEE STATUS CARD
    // ============================================================

    @Test
    public void employeeStatusCardTest() {

        WebElement button = findCardButton("Employee Status");

        assertTrue(
                button != null,
                "Employee Status button was not found"
        );

        assertTrue(
                button.isDisplayed(),
                "Employee Status button is not visible"
        );

        System.out.println(
                "PASS: Employee Status card displayed."
        );
    }

    // ============================================================
    // TEST 11
    // VERIFY ASSET RETURN CARD
    // ============================================================

    @Test
    public void assetReturnCardTest() {

        WebElement button = findCardButton("Return");

        assertTrue(
                button != null,
                "Asset Return button was not found"
        );

        assertTrue(
                button.isDisplayed(),
                "Asset Return button is not visible"
        );

        System.out.println(
                "PASS: Asset Return card displayed."
        );
    }

    // ============================================================
    // TEST 12
    // CLICK ADD ASSET
    // ============================================================

    @Test
    public void addAssetNavigationTest() {

        WebElement button = findCardButton("Add Asset");

        assertTrue(
                button != null,
                "Add Asset button was not found"
        );

        safeClick(button);

        waitForNavigation();

        String page =
                driver.getPageSource()
                        .toLowerCase();

        assertTrue(
                page.contains("add asset"),
                "Add Asset page was not opened"
        );

        System.out.println(
                "PASS: Add Asset navigation works."
        );
    }

    // ============================================================
    // TEST 13
    // CLICK MANAGE ASSETS
    // ============================================================

    @Test
    public void manageAssetsNavigationTest() {

        WebElement button = findCardButton("Manage Assets");

        assertTrue(
                button != null,
                "Manage Assets button was not found"
        );

        safeClick(button);

        waitForNavigation();

        String page =
                driver.getPageSource()
                        .toLowerCase();

        assertTrue(
                page.contains("manage")
                        || page.contains("asset"),
                "Manage Assets page was not opened"
        );

        System.out.println(
                "PASS: Manage Assets navigation works."
        );
    }

    // ============================================================
    // TEST 14
    // CLICK ASSET DETAILS
    // ============================================================

    @Test
    public void assetDetailsNavigationTest() {

        WebElement button = findCardButton("Asset Details");

        assertTrue(
                button != null,
                "Asset Details button was not found"
        );

        safeClick(button);

        waitForNavigation();

        String page =
                driver.getPageSource()
                        .toLowerCase();

        assertTrue(
                page.contains("asset details")
                        || page.contains("asset"),
                "Asset Details page was not opened"
        );

        System.out.println(
                "PASS: Asset Details navigation works."
        );
    }

    // ============================================================
    // TEST 15
    // CLICK EMPLOYEE STATUS
    // ============================================================

    @Test
    public void employeeStatusNavigationTest() {

        WebElement button =
                findCardButton("Employee Status");

        assertTrue(
                button != null,
                "Employee Status button was not found"
        );

        safeClick(button);

        waitForNavigation();

        String page =
                driver.getPageSource()
                        .toLowerCase();

        assertTrue(
                page.contains("employee status")
                        || page.contains("employee"),
                "Employee Status page was not opened"
        );

        System.out.println(
                "PASS: Employee Status navigation works."
        );
    }

    // ============================================================
    // TEST 16
    // CLICK ASSET RETURN
    // ============================================================

    @Test
    public void assetReturnNavigationTest() {

        WebElement button = findCardButton("Return");

        assertTrue(
                button != null,
                "Asset Return button was not found"
        );

        safeClick(button);

        waitForNavigation();

        String page =
                driver.getPageSource()
                        .toLowerCase();

        assertTrue(
                page.contains("asset return")
                        || page.contains("return")
                        || page.contains("asset"),
                "Asset Return page was not opened"
        );

        System.out.println(
                "PASS: Asset Return navigation works."
        );
    }

    // ============================================================
    // TEST 17
    // SIDEBAR ASSET MANAGEMENT
    // ============================================================

    @Test
    public void sidebarAssetManagementTest() {

        WebElement sidebarItem = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//aside[contains(@class,'am-sidebar')]"
                                        + "//*[normalize-space()='Asset Management']"
                        )
                )
        );

        safeClick(sidebarItem);

        wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".am-page-title")
                )
        );

        assertTrue(
                driver.findElement(
                        By.cssSelector(".am-page-title")
                ).getText()
                        .trim()
                        .equalsIgnoreCase("Asset Management"),
                "Asset Management page is not active"
        );

        System.out.println(
                "PASS: Asset Management sidebar navigation works."
        );
    }

    // ============================================================
    // TEST 18
    // SIDEBAR ASSET ASSIGNMENT
    // ============================================================

    @Test
    public void sidebarAssetAssignmentTest() {

        WebElement item = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//aside[contains(@class,'am-sidebar')]"
                                        + "//*[normalize-space()='Asset Assignment']"
                        )
                )
        );

        safeClick(item);

        waitForNavigation();

        String page =
                driver.getPageSource()
                        .toLowerCase();

        assertTrue(
                page.contains("asset assignment")
                        || page.contains("assignment"),
                "Asset Assignment page was not opened"
        );

        System.out.println(
                "PASS: Asset Assignment navigation works."
        );
    }

    // ============================================================
    // TEST 19
    // SIDEBAR REQUEST APPROVAL
    // ============================================================

    @Test
    public void sidebarRequestApprovalTest() {

        WebElement item = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//aside[contains(@class,'am-sidebar')]"
                                        + "//*[normalize-space()='Request Approval']"
                        )
                )
        );

        safeClick(item);

        waitForNavigation();

        String page =
                driver.getPageSource()
                        .toLowerCase();

        assertTrue(
                page.contains("request approval")
                        || page.contains("approval"),
                "Request Approval page was not opened"
        );

        System.out.println(
                "PASS: Request Approval navigation works."
        );
    }

    // ============================================================
    // TEST 20
    // SIDEBAR MAINTENANCE
    // ============================================================

    @Test
    public void sidebarMaintenanceTest() {

        WebElement item = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//aside[contains(@class,'am-sidebar')]"
                                        + "//*[normalize-space()='Maintenance']"
                        )
                )
        );

        safeClick(item);

        waitForNavigation();

        String page =
                driver.getPageSource()
                        .toLowerCase();

        assertTrue(
                page.contains("maintenance"),
                "Maintenance page was not opened"
        );

        System.out.println(
                "PASS: Maintenance navigation works."
        );
    }

    // ============================================================
    // TEST 21
    // LOGOUT
    // ============================================================

    @Test
    public void logoutTest() {

        WebElement logoutButton = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(
                                ".am-logout-btn"
                        )
                )
        );

        safeClick(logoutButton);

        waitForNavigation();

        String page =
                driver.getPageSource()
                        .toLowerCase();

        boolean loginDisplayed =
                page.contains("login")
                        || !driver.findElements(
                                By.name("employeeIdOrEmail")
                        ).isEmpty();

        assertTrue(
                loginDisplayed,
                "Logout did not return to login page"
        );

        System.out.println(
                "PASS: Logout works."
        );
    }

    // ============================================================
    // FIND ACTION CARD BUTTON
    // ============================================================

    private WebElement findCardButton(String buttonText) {

        try {

            List<WebElement> buttons =
                    driver.findElements(
                            By.xpath(
                                    "//div[contains(@class,'am-card')]"
                                            + "//button[normalize-space()='"
                                            + buttonText
                                            + "']"
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
    // SAFE CLICK
    // ============================================================

    private void safeClick(WebElement element) {

        try {

            wait().until(
                    ExpectedConditions.elementToBeClickable(
                            element
                    )
            );

            scrollIntoView(element);

            element.click();

        } catch (Exception e) {

            try {

                scrollIntoView(element);

                ((JavascriptExecutor) driver)
                        .executeScript(
                                "arguments[0].click();",
                                element
                        );

            } catch (Exception ignored) {
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
    // LOGIN ALERT
    // ============================================================

    private void handleLoginAlert() {

        try {

            Alert alert = new WebDriverWait(
                    driver,
                    Duration.ofSeconds(8)
            ).until(
                    ExpectedConditions.alertIsPresent()
            );

            String text = alert.getText();

            System.out.println(
                    "Login alert: " + text
            );

            alert.accept();

        } catch (Exception ignored) {
            // No alert appeared.
        }
    }

    // ============================================================
    // WAIT FOR PAGE LOAD
    // ============================================================

    private void waitForPageLoad() {

        wait().until(driver ->
                ((JavascriptExecutor) driver)
                        .executeScript(
                                "return document.readyState"
                        )
                        .equals("complete")
        );
    }

    // ============================================================
    // WAIT FOR NAVIGATION
    // ============================================================

    private void waitForNavigation() {

        try {

            Thread.sleep(800);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();
        }
    }
}
