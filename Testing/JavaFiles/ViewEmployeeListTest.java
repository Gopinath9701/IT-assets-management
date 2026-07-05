package com.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.time.Duration;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import io.github.bonigarcia.wdm.WebDriverManager;

public class ViewEmployeeListTest {

    WebDriver driver;

    @Before
    public void setup() throws InterruptedException {

        WebDriverManager.chromedriver().setup();

        driver = new ChromeDriver();

        driver.manage().window().maximize();

        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

        driver.get("http://localhost:3000");

        Thread.sleep(2000);

        // Click Login
        driver.findElement(By.xpath("//button[text()='Login']")).click();

        Thread.sleep(2000);

        // Click HR Mgmt
        driver.findElement(By.xpath("//*[text()='HR Mgmt']")).click();

        Thread.sleep(2000);

        // Click View List
        driver.findElement(By.xpath("//button[text()='View List']")).click();

        Thread.sleep(2000);

    }

    @Test
    public void verifyHeader() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='ITAMS']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='IT Asset Management System']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Logout']")).isDisplayed());

    }

    @Test
    public void verifyPageHeading() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='View Employee List']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='View employee information and assigned assets.']")).isDisplayed());

    }

    @Test
    public void verifySearchSection() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Search Employee']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Search']")).isDisplayed());

    }

    @Test
    public void verifyEmployeeTable() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Employee List']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Employee ID']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Department']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Status']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Action']")).isDisplayed());

    }
        @Test
    public void verifyEmployeeRecords() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='EMP001']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='EMP002']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='EMP003']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='EMP004']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='EMP005']")).isDisplayed());

    }

    @Test
    public void searchEmployee() throws InterruptedException {

        driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID']"))
                .sendKeys("EMP001");

        Thread.sleep(1000);

        assertTrue(driver.findElement(
                By.xpath("//*[text()='EMP001']")).isDisplayed());

    }

    @Test
    public void searchInvalidEmployee() throws InterruptedException {

        driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID']"))
                .sendKeys("EMP999");

        Thread.sleep(1000);

        assertTrue(driver.findElement(
                By.xpath("//*[text()='No Employee Found']")).isDisplayed());

    }

    @Test
    public void verifyViewButton() {

        assertTrue(driver.findElement(
                By.xpath("(//button[text()='View'])[1]"))
                .isDisplayed());

    }

    @Test
    public void verifyEmployeePopup() throws InterruptedException {

        driver.findElement(
                By.xpath("(//button[text()='View'])[1]"))
                .click();

        Thread.sleep(1000);

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Employee Details']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[contains(text(),'Employee ID')]"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[contains(text(),'Name')]"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[contains(text(),'Email')]"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[contains(text(),'Department')]"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[contains(text(),'Status')]"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[contains(text(),'Phone')]"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[contains(text(),'Date of Joining')]"))
                .isDisplayed());

    }

    @Test
    public void verifyAssignedAssetsTable() throws InterruptedException {

        driver.findElement(
                By.xpath("(//button[text()='View'])[1]"))
                .click();

        Thread.sleep(1000);

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Assigned Assets']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Asset ID']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Asset Type']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Assigned Date']"))
                .isDisplayed());

    }
        @Test
    public void verifyAssetDetails() throws InterruptedException {

        driver.findElement(
                By.xpath("(//button[text()='View'])[1]"))
                .click();

        Thread.sleep(1000);

        assertTrue(driver.findElement(
                By.xpath("//*[text()='AST001']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Laptop']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='15-02-2026']")).isDisplayed());

    }

    @Test
public void verifyNoAssetsAssigned() throws Exception {

    WebElement viewButton =
            driver.findElement(By.xpath("(//button[text()='View'])[4]"));

    JavascriptExecutor js = (JavascriptExecutor) driver;

    js.executeScript("arguments[0].scrollIntoView(true);", viewButton);

    Thread.sleep(1000);

    viewButton.click();

    Thread.sleep(1000);

    assertTrue(driver.findElement(
            By.xpath("//*[text()='No Assets Assigned']"))
            .isDisplayed());

}

    @Test
    public void verifyClosePopup() throws InterruptedException {

        driver.findElement(
                By.xpath("(//button[text()='View'])[1]"))
                .click();

        Thread.sleep(1000);

        driver.findElement(
                By.xpath("//button[contains(text(),'✕')]"))
                .click();

        Thread.sleep(1000);

    }

    @Test
    public void verifySearchTextbox() {

        driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID']"))
                .sendKeys("EMP002");

        assertEquals(
                "EMP002",
                driver.findElement(
                        By.xpath("//input[@placeholder='Enter Employee ID']"))
                        .getAttribute("value"));

    }

    @Test
    public void verifyLogoutButton() {

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Logout']"))
                .isDisplayed());

    }

    @After
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }

    }

}
