package com.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.time.Duration;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.Select;

import io.github.bonigarcia.wdm.WebDriverManager;

public class ReportMaintenanceTest {

    WebDriver driver;

    @Before
    public void setup() throws Exception {

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

        // Click Report Issue
        driver.findElement(By.xpath("//button[text()='Report Issue']")).click();

        Thread.sleep(2000);

    }

    @Test
    public void verifyPageHeading() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Report Maintenance']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Report issues related to IT assets.']")).isDisplayed());

    }

    @Test
    public void verifyMaintenanceForm() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Maintenance Request Form']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//input[@placeholder='Enter Asset ID']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//textarea[@placeholder='Enter issue description']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Submit Request']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Clear']")).isDisplayed());

    }

    @Test
    public void verifyTableHeaders() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='My Maintenance Requests']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Request ID']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Asset ID']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Issue Category']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Issue Description']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Priority']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Status']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Report Date']")).isDisplayed());

    }

    @Test
    public void verifyDefaultReports() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='MR001']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='MR002']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='MR003']")).isDisplayed());

    }
        @Test
    public void verifyEmptyFieldAlert() throws Exception {

        driver.findElement(
                By.xpath("//button[text()='Submit Request']"))
                .click();

        Thread.sleep(1000);

        Alert alert = driver.switchTo().alert();

        assertEquals(
                "Please fill all fields.",
                alert.getText());

        alert.accept();

    }

    @Test
    public void verifyIssueCategoryDropdown() {

        Select category = new Select(
                driver.findElement(By.tagName("select")));

        assertEquals(5, category.getOptions().size());

        assertEquals("Select Category",
                category.getOptions().get(0).getText());

        assertEquals("Hardware Issue",
                category.getOptions().get(1).getText());

        assertEquals("Software Issue",
                category.getOptions().get(2).getText());

        assertEquals("Performance Issue",
                category.getOptions().get(3).getText());

        assertEquals("Security Issue",
                category.getOptions().get(4).getText());

    }

    @Test
    public void submitMaintenanceRequest() throws Exception {

        driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID']"))
                .sendKeys("EMP010");

        driver.findElement(
                By.xpath("//input[@placeholder='Enter Asset ID']"))
                .sendKeys("AST010");

        Select category = new Select(
                driver.findElement(By.tagName("select")));

        category.selectByVisibleText("Hardware Issue");

        driver.findElement(
                By.xpath("//textarea[@placeholder='Enter issue description']"))
                .sendKeys("Laptop keyboard not working.");

        driver.findElement(
                By.xpath("//input[@value='High']"))
                .click();

        driver.findElement(
                By.xpath("//button[text()='Submit Request']"))
                .click();

        Thread.sleep(2000);

        assertTrue(driver.findElement(
                By.xpath("//*[contains(text(),'AST010')]"))
                .isDisplayed());

    }

    @Test
    public void verifyPriorityRadioButtons() {

        assertTrue(driver.findElement(
                By.xpath("//input[@value='Low']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//input[@value='Medium']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//input[@value='High']"))
                .isDisplayed());

    }

    @Test
    public void verifyHighPrioritySelection() {

        driver.findElement(
                By.xpath("//input[@value='High']"))
                .click();

        assertTrue(driver.findElement(
                By.xpath("//input[@value='High']"))
                .isSelected());

    }

    @Test
    public void verifyClearButtonDisplayed() {

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Clear']"))
                .isDisplayed());

    }
        @Test
    public void verifyClearButtonFunctionality() {

        driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID']"))
                .sendKeys("EMP100");

        driver.findElement(
                By.xpath("//input[@placeholder='Enter Asset ID']"))
                .sendKeys("AST100");

        driver.findElement(
                By.xpath("//textarea[@placeholder='Enter issue description']"))
                .sendKeys("Testing clear button");

        driver.findElement(
                By.xpath("//button[text()='Clear']"))
                .click();

        assertEquals(
                "",
                driver.findElement(
                        By.xpath("//input[@placeholder='Enter Employee ID']"))
                        .getAttribute("value"));

        assertEquals(
                "",
                driver.findElement(
                        By.xpath("//input[@placeholder='Enter Asset ID']"))
                        .getAttribute("value"));

        assertEquals(
                "",
                driver.findElement(
                        By.xpath("//textarea[@placeholder='Enter issue description']"))
                        .getAttribute("value"));

    }

    @Test
    public void verifyTableRowCount() {

        int rows = driver.findElements(
                By.xpath("//tbody/tr")).size();

        assertEquals(3, rows);

    }

    @Test
    public void verifyPendingStatus() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Pending']"))
                .isDisplayed());

    }

    @Test
    public void verifyRequestIds() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='MR001']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='MR002']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='MR003']"))
                .isDisplayed());

    }

    @Test
    public void verifyReportDates() {

        assertTrue(driver.findElement(
                By.xpath("//*[contains(text(),'30-06-2026')]"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[contains(text(),'29-06-2026')]"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[contains(text(),'27-06-2026')]"))
                .isDisplayed());

    }

    @Test
    public void verifyButtonsDisplayed() {

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Submit Request']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Clear']"))
                .isDisplayed());

    }

    @After
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }

    }

}
