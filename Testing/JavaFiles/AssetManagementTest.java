package com.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;

import java.time.Duration;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;

public class AssetManagementTest {

    WebDriver driver;
    WebDriverWait wait;
    JavascriptExecutor js;

    @Before
    public void setup() throws InterruptedException {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        js = (JavascriptExecutor) driver;

        driver.get("http://localhost:3000");
        Thread.sleep(2000);

        // Step 1: Click the top-right "Login" nav button (home page) to land on the Login page
        try {
            WebElement loginNavBtn = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='Login']")));
            loginNavBtn.click();
            System.out.println("✓ Clicked top-right Login button, now on Login page");
        } catch (Exception e) {
            System.out.println("✗ Top-right Login button not found");
        }
        Thread.sleep(1500);

        // Verify we actually landed on the Login page (form fields present)
        try {
            WebElement loginHeading = driver.findElement(By.xpath("//*[text()='Login']"));
            System.out.println("✓ Login page heading confirmed: " + loginHeading.isDisplayed());
        } catch (Exception e) {
            System.out.println("✗ Login page heading not found");
        }

        // Step 2: Skip entering any credentials — directly click "Asset Mgmt"
        // Step 3: Click "Asset Mgmt" button (top-right quick nav) to land on Asset Management page
        boolean assetMgmtOpened = false;
        try {
            WebElement assetMgmtBtn = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='Asset Mgmt']")));
            assetMgmtBtn.click();
            assetMgmtOpened = true;
            System.out.println("✓ Clicked Asset Mgmt button");
        } catch (Exception e) {
            System.out.println("✗ Asset Mgmt button not found (button variant)");
        }

        if (!assetMgmtOpened) {
            try {
                WebElement assetMgmtLink = driver.findElement(By.xpath("//*[text()='Asset Mgmt']"));
                js.executeScript("arguments[0].click();", assetMgmtLink);
                System.out.println("✓ Clicked Asset Mgmt element");
            } catch (Exception e2) {
                System.out.println("✗ Could not find Asset Mgmt element at all!");
            }
        }

        Thread.sleep(2000);
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    private WebElement getLogoutButton() {
        return driver.findElement(By.xpath("//button[text()='Logout']"));
    }

    private WebElement getSidebarItem(String label) {
        try {
            return driver.findElement(By.xpath("//*[contains(@class,'am-sidebar-item')][text()='" + label + "']"));
        } catch (Exception e) {
            return driver.findElement(By.xpath("//*[text()='" + label + "']"));
        }
    }

    private WebElement getCardByTitle(String title) {
        return driver.findElement(
                By.xpath("//h3[contains(@class,'am-card-title')][text()='" + title + "']/ancestor::div[contains(@class,'am-card')]"));
    }

    private WebElement getCardButton(String buttonLabel) {
        try {
            return driver.findElement(By.xpath("//button[contains(@class,'am-card-btn')][text()='" + buttonLabel + "']"));
        } catch (Exception e) {
            return driver.findElement(By.xpath("//button[text()='" + buttonLabel + "']"));
        }
    }

    private void clickCardButton(String buttonLabel) {
        WebElement btn = getCardButton(buttonLabel);
        js.executeScript("arguments[0].scrollIntoView(true);", btn);
        js.executeScript("arguments[0].click();", btn);
    }

    private void goBackToAssetManagementMain() throws InterruptedException {
        // Sub-pages typically expose a "Back" button; fall back to sidebar click
        try {
            WebElement backBtn = driver.findElement(By.xpath("//button[contains(text(),'Back')]"));
            js.executeScript("arguments[0].scrollIntoView(true);", backBtn);
            js.executeScript("arguments[0].click();", backBtn);
        } catch (Exception e) {
            try {
                WebElement sidebarAssetMgmt = getSidebarItem("Asset Management");
                js.executeScript("arguments[0].click();", sidebarAssetMgmt);
            } catch (Exception e2) {
                System.out.println("✗ Could not navigate back to Asset Management main view");
            }
        }
        Thread.sleep(1000);
    }

    // ==========================================
    // 0. LOGIN-BYPASS NAVIGATION FLOW VERIFICATION
    // ==========================================

    @Test
    public void testAssetMgmtAccessibleWithoutEnteringCredentials() {
        // By the time @Before finishes, we should already be on the Asset Management
        // page without ever having typed an Employee ID or Password.
        assertTrue("Asset Management page title should be visible without logging in",
                driver.findElement(By.xpath("//*[text()='Asset Management']")).isDisplayed());
        assertTrue("Sidebar should be visible, confirming Asset Management page loaded",
                getSidebarItem("Asset Management").isDisplayed());
    }

    // ==========================================
    // 1. HEADER / NAV VERIFICATION
    // ==========================================

    @Test
    public void testVerifyHeader() {
        assertTrue(driver.findElement(By.xpath("//*[text()='ITAMS']")).isDisplayed());
        assertTrue(driver.findElement(By.xpath("//*[text()='IT Asset Management System']")).isDisplayed());
        assertTrue(getLogoutButton().isDisplayed());
    }

    // ==========================================
    // 2. PAGE HEADING VERIFICATION
    // ==========================================

    @Test
    public void testVerifyPageHeading() {
        assertTrue(driver.findElement(By.xpath("//*[text()='Asset Management']")).isDisplayed());
        assertTrue(driver.findElement(
                By.xpath("//*[text()='Manage and track all IT assets in the organization']")).isDisplayed());
    }

    // ==========================================
    // 3. SIDEBAR VERIFICATION
    // ==========================================

    @Test
    public void testVerifySidebarItemsPresent() {
        assertTrue("Dashboard should be visible", getSidebarItem("Dashboard").isDisplayed());
        assertTrue("Asset Management should be visible", getSidebarItem("Asset Management").isDisplayed());
        assertTrue("Asset Assignment should be visible", getSidebarItem("Asset Assignment").isDisplayed());
        assertTrue("Request Approval should be visible", getSidebarItem("Request Approval").isDisplayed());
        assertTrue("Maintenance should be visible", getSidebarItem("Maintenance").isDisplayed());
    }

    @Test
    public void testAssetManagementSidebarItemIsActiveByDefault() {
        WebElement sidebarItem = getSidebarItem("Asset Management");
        String classAttr = sidebarItem.getAttribute("class");
        assertTrue("Asset Management sidebar item should have active class by default",
                classAttr != null && classAttr.contains("am-sidebar-item--active"));
    }

    @Test
    public void testSidebarNavigationToAssetAssignment() throws InterruptedException {
        WebElement sidebarItem = getSidebarItem("Asset Assignment");
        js.executeScript("arguments[0].click();", sidebarItem);
        Thread.sleep(1500);
        // Clicking "Asset Assignment" unmounts AssetManagement and renders a different
        // component (<AssetAssignment>), so the Asset Management action-card content
        // should no longer be present — that's a structure-agnostic way to confirm navigation.
        boolean assetManagementCardsGone = driver.findElements(
                By.xpath("//*[text()='Add new asset information to the system']")).isEmpty();
        assertTrue("Asset Management cards should disappear after navigating to Asset Assignment",
                assetManagementCardsGone);
    }

    @Test
    public void testSidebarNavigationToRequestApproval() throws InterruptedException {
        WebElement sidebarItem = getSidebarItem("Request Approval");
        js.executeScript("arguments[0].click();", sidebarItem);
        Thread.sleep(1500);
        // Same reasoning: RequestApproval is a separate component, so just confirm
        // we've left the Asset Management main view.
        boolean assetManagementCardsGone = driver.findElements(
                By.xpath("//*[text()='Add new asset information to the system']")).isEmpty();
        assertTrue("Asset Management cards should disappear after navigating to Request Approval",
                assetManagementCardsGone);
    }

    @Test
    public void testSidebarNavigationBackToAssetManagement() throws InterruptedException {
        // Navigate away first
        WebElement assignmentItem = getSidebarItem("Asset Assignment");
        js.executeScript("arguments[0].click();", assignmentItem);
        Thread.sleep(1000);

        // Navigate back
        WebElement assetMgmtItem = getSidebarItem("Asset Management");
        js.executeScript("arguments[0].click();", assetMgmtItem);
        Thread.sleep(1000);

        assertTrue(driver.findElement(By.xpath("//*[text()='Asset Management']")).isDisplayed());
    }

    // ==========================================
    // 4. ACTION CARDS VERIFICATION
    // ==========================================

    @Test
    public void testVerifyAllCardsDisplayed() {
        assertTrue(getCardByTitle("Add Asset").isDisplayed());
        assertTrue(getCardByTitle("Manage Assets").isDisplayed());
        assertTrue(getCardByTitle("Asset Details").isDisplayed());
        assertTrue(getCardByTitle("Employee Status").isDisplayed());
    }

    @Test
    public void testVerifyCardDescriptions() {
        assertTrue(driver.findElement(
                By.xpath("//*[text()='Add new asset information to the system']")).isDisplayed());
        assertTrue(driver.findElement(
                By.xpath("//*[text()='Edit or modify asset information and delete assets']")).isDisplayed());
        assertTrue(driver.findElement(
                By.xpath("//*[text()='View detailed information about an asset']")).isDisplayed());
        assertTrue(driver.findElement(
                By.xpath("//*[text()='Check and view the status of employees']")).isDisplayed());
    }

    @Test
    public void testVerifyCardButtonsDisplayed() {
        assertTrue(getCardButton("Add Asset").isDisplayed());
        assertTrue(getCardButton("Manage Assets").isDisplayed());
        assertTrue(getCardButton("Asset Details").isDisplayed());
        assertTrue(getCardButton("Employee Status").isDisplayed());
    }

    // ==========================================
    // 5. CARD NAVIGATION TESTS
    // ==========================================

    @Test
    public void testNavigateToAddAsset() throws InterruptedException {
        clickCardButton("Add Asset");
        Thread.sleep(1500);
        // Landing on Add Asset page should move away from the Asset Management card grid
        boolean cardGridGone = driver.findElements(By.xpath("//*[text()='Add new asset information to the system']")).isEmpty();
        assertTrue("Add Asset card grid should no longer be visible after navigation", cardGridGone);
    }

    @Test
    public void testNavigateToManageAssets() throws InterruptedException {
        clickCardButton("Manage Assets");
        Thread.sleep(1500);
        boolean cardGridGone = driver.findElements(
                By.xpath("//*[text()='Edit or modify asset information and delete assets']")).isEmpty();
        assertTrue("Manage Assets card grid should no longer be visible after navigation", cardGridGone);
    }

    @Test
    public void testNavigateToAssetDetails() throws InterruptedException {
        clickCardButton("Asset Details");
        Thread.sleep(1500);
        boolean cardGridGone = driver.findElements(
                By.xpath("//*[text()='View detailed information about an asset']")).isEmpty();
        assertTrue("Asset Details card grid should no longer be visible after navigation", cardGridGone);
    }

    @Test
    public void testNavigateToEmployeeStatus() throws InterruptedException {
        clickCardButton("Employee Status");
        Thread.sleep(1500);
        // Employee Status page has its own distinct heading
        assertTrue("Employee Status page heading should be visible",
                driver.findElement(By.xpath("//*[text()='Employee Status']")).isDisplayed());
        assertTrue("Employee Status page subtitle should be visible",
                driver.findElement(By.xpath("//*[text()='View and update employee status.']")).isDisplayed());
    }

    @Test
    public void testBackNavigationFromEmployeeStatus() throws InterruptedException {
        clickCardButton("Employee Status");
        Thread.sleep(1500);
        goBackToAssetManagementMain();
        assertTrue("Should return to Asset Management page heading",
                driver.findElement(By.xpath("//*[text()='Asset Management']")).isDisplayed());
    }

    @Test
    public void testBackNavigationFromAddAsset() throws InterruptedException {
        clickCardButton("Add Asset");
        Thread.sleep(1500);
        goBackToAssetManagementMain();
        assertTrue("Should return to Asset Management page heading",
                driver.findElement(By.xpath("//*[text()='Asset Management']")).isDisplayed());
    }

    // ==========================================
    // 6. LOGOUT TEST
    // ==========================================

    @Test
    public void testVerifyLogoutButton() {
        assertTrue(getLogoutButton().isDisplayed());
    }

    @Test
    public void testLogoutFunctionality() throws InterruptedException {
        WebElement logoutBtn = getLogoutButton();
        js.executeScript("arguments[0].click();", logoutBtn);
        Thread.sleep(1500);

        assertTrue("Should be back on Home/Login state after logout",
                driver.findElement(By.xpath("//button[text()='Login']")).isDisplayed());
    }

    @After
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
