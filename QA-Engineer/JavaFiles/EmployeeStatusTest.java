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

public class EmployeeStatusTest {

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

        // Click View Status
        driver.findElement(By.xpath("//button[text()='View Status']")).click();

        Thread.sleep(2000);

    }

    @Test
    public void verifyPageHeading() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Employee Status']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='View and update employee status.']"))
                .isDisplayed());

    }

    @Test
    public void verifySearchSection() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Search Employee']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID or Employee Name']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Search']"))
                .isDisplayed());

    }

    @Test
    public void verifyTableHeaders() {

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Employee ID']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Employee Name']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Department']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Status']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Update']"))
                .isDisplayed());

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

        assertTrue(driver.findElement(
                By.xpath("//*[text()='EMP006']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='EMP007']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='EMP008']")).isDisplayed());

    }
        @Test
    public void searchByEmployeeId() throws InterruptedException {

        WebElement searchBox = driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID or Employee Name']"));

        searchBox.sendKeys("EMP001");

        Thread.sleep(1000);

        assertTrue(driver.findElement(
                By.xpath("//*[text()='EMP001']")).isDisplayed());

    }

    @Test
    public void searchByEmployeeName() throws InterruptedException {

        WebElement searchBox = driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID or Employee Name']"));

        searchBox.sendKeys("Employee 1");

        Thread.sleep(1000);

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Employee 1']")).isDisplayed());

    }

    @Test
    public void searchInvalidEmployee() throws InterruptedException {

        WebElement searchBox = driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID or Employee Name']"));

        searchBox.sendKeys("EMP999");

        Thread.sleep(1000);

        assertEquals(
                0,
                driver.findElements(By.xpath("//td[text()='EMP999']")).size());

    }

    @Test
    public void verifyStatusDropdown() {

        Select status = new Select(
                driver.findElement(By.xpath("(//select)[1]")));

        assertEquals(3, status.getOptions().size());

        assertEquals(
                "Active",
                status.getOptions().get(0).getText());

        assertEquals(
                "On Leave",
                status.getOptions().get(1).getText());

        assertEquals(
                "Inactive",
                status.getOptions().get(2).getText());

    }

    @Test
    public void updateStatusToOnLeave() throws Exception {

        Select status = new Select(
                driver.findElement(By.xpath("(//select)[1]")));

        status.selectByVisibleText("On Leave");

        driver.findElement(
                By.xpath("(//button[text()='Update'])[1]"))
                .click();

        Thread.sleep(1000);

        Alert alert = driver.switchTo().alert();

        assertEquals(
                "Status Updated Successfully",
                alert.getText());

        alert.accept();

    }

    @Test
    public void updateStatusToInactive() throws Exception {

        Select status = new Select(
                driver.findElement(By.xpath("(//select)[2]")));

        status.selectByVisibleText("Inactive");

        driver.findElement(
                By.xpath("(//button[text()='Update'])[2]"))
                .click();

        Thread.sleep(1000);

        Alert alert = driver.switchTo().alert();

        assertEquals(
                "Status Updated Successfully",
                alert.getText());

        alert.accept();

    }

    @Test
    public void verifyUpdateButtons() {

        assertEquals(
                8,
                driver.findElements(
                        By.xpath("//button[text()='Update']")).size());

    }
        @Test
    public void verifySearchTextbox() {

        WebElement searchBox = driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID or Employee Name']"));

        searchBox.sendKeys("EMP005");

        assertEquals(
                "EMP005",
                searchBox.getAttribute("value"));

    }

    @Test
    public void verifySearchButton() {

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Search']"))
                .isDisplayed());

        driver.findElement(
                By.xpath("//button[text()='Search']"))
                .click();

    }

    @Test
    public void verifyDropdownCount() {

        assertEquals(
                8,
                driver.findElements(By.tagName("select")).size());

    }

    @Test
    public void verifyUpdateButtonCount() {

        assertEquals(
                8,
                driver.findElements(
                        By.xpath("//button[text()='Update']")).size());

    }

    @Test
    public void updateThirdEmployeeStatus() throws Exception {

        Select status = new Select(
                driver.findElement(By.xpath("(//select)[3]")));

        status.selectByVisibleText("Active");

        driver.findElement(
                By.xpath("(//button[text()='Update'])[3]"))
                .click();

        Thread.sleep(1000);

        Alert alert = driver.switchTo().alert();

        assertEquals(
                "Status Updated Successfully",
                alert.getText());

        alert.accept();

    }

    @Test
    public void verifyTableRowCount() {

        int rows = driver.findElements(
                By.xpath("//tbody/tr")).size();

        assertEquals(8, rows);

    }

    @Test
    public void verifyEmployeeDepartments() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='IT']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='HR']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Finance']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Marketing']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Sales']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Operations']")).isDisplayed());

    }

    @After
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }

    }

}