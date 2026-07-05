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

import io.github.bonigarcia.wdm.WebDriverManager;

public class DepartmentManagementTest {

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

        // Click Manage Departments
        driver.findElement(By.xpath("//button[text()='Manage Departments']")).click();

        Thread.sleep(2000);

    }

    @Test
    public void verifyPageHeading() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Department Management']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Manage organization departments.']")).isDisplayed());

    }

    @Test
    public void verifySearchSection() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Search Department']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//input[@placeholder='Enter Department Name']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Search']")).isDisplayed());

    }

    @Test
    public void verifyDepartmentTable() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Department List']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Department ID']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Department Name']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Department Head']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Number of Employees']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//th[text()='Actions']")).isDisplayed());

    }

    @Test
    public void verifyDepartmentRecords() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='DEP001']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='DEP002']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='DEP003']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='DEP004']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='DEP005']")).isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='DEP006']")).isDisplayed());

    }
        @Test
    public void searchDepartment() throws Exception {

        WebElement searchBox = driver.findElement(
                By.xpath("//input[@placeholder='Enter Department Name']"));

        searchBox.sendKeys("Finance");

        Thread.sleep(1000);

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Finance']"))
                .isDisplayed());

    }

    @Test
    public void searchInvalidDepartment() throws Exception {

        WebElement searchBox = driver.findElement(
                By.xpath("//input[@placeholder='Enter Department Name']"));

        searchBox.sendKeys("Testing");

        Thread.sleep(1000);

        assertTrue(driver.findElement(
                By.xpath("//*[text()='No Department Found']"))
                .isDisplayed());

    }

    @Test
    public void verifyAddDepartmentForm() throws Exception {

        driver.findElement(
                By.xpath("//*[text()='Add New Department']"))
                .click();

        Thread.sleep(1000);

        assertTrue(driver.findElement(
                By.xpath("//input[@placeholder='Department ID']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//input[@placeholder='Department Name']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//input[@placeholder='Department Head']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//input[@placeholder='Number of Employees']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Add']"))
                .isDisplayed());

    }

    @Test
    public void verifyEmptyFieldAlert() throws Exception {

        driver.findElement(
                By.xpath("//*[text()='Add New Department']"))
                .click();

        Thread.sleep(1000);

        driver.findElement(
                By.xpath("//button[text()='Add']"))
                .click();

        Thread.sleep(1000);

        Alert alert = driver.switchTo().alert();

        assertEquals(
                "Please fill all fields.",
                alert.getText());

        alert.accept();

    }

    @Test
    public void addDepartment() throws Exception {

        driver.findElement(
                By.xpath("//*[text()='Add New Department']"))
                .click();

        Thread.sleep(1000);

        driver.findElement(
                By.xpath("//input[@placeholder='Department ID']"))
                .sendKeys("DEP007");

        driver.findElement(
                By.xpath("//input[@placeholder='Department Name']"))
                .sendKeys("Testing");

        driver.findElement(
                By.xpath("//input[@placeholder='Department Head']"))
                .sendKeys("Head 7");

        driver.findElement(
                By.xpath("//input[@placeholder='Number of Employees']"))
                .sendKeys("15");

        driver.findElement(
                By.xpath("//button[text()='Add']"))
                .click();

        Thread.sleep(1000);

        assertTrue(driver.findElement(
                By.xpath("//*[text()='DEP007']"))
                .isDisplayed());

    }

    @Test
    public void verifyDeleteButton() {

        assertTrue(driver.findElement(
                By.xpath("(//button[text()='Delete'])[1]"))
                .isDisplayed());

    }
        @Test
    public void deleteDepartment() throws Exception {

        driver.findElement(
                By.xpath("(//button[text()='Delete'])[1]"))
                .click();

        Thread.sleep(1000);

        assertEquals(
                0,
                driver.findElements(By.xpath("//*[text()='DEP001']")).size());

    }

    @Test
    public void verifySearchTextbox() {

        WebElement searchBox = driver.findElement(
                By.xpath("//input[@placeholder='Enter Department Name']"));

        searchBox.sendKeys("Finance");

        assertEquals(
                "Finance",
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
    public void verifyDeleteButtonCount() {

        int deleteButtons = driver.findElements(
                By.xpath("//button[text()='Delete']")).size();

        assertEquals(6, deleteButtons);

    }

    @Test
    public void verifyTableRowCount() {

        int rows = driver.findElements(
                By.xpath("//tbody/tr")).size();

        assertEquals(6, rows);

    }

    @Test
    public void verifyDepartmentNames() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Information Technology (IT)']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Human Resources (HR)']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Finance']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Marketing']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Sales']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Administration']"))
                .isDisplayed());

    }

    @Test
    public void verifyDepartmentHeads() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Head 1']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Head 2']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Head 3']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Head 4']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Head 5']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Head 6']"))
                .isDisplayed());

    }

    @After
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }

    }

}
