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
import org.openqa.selenium.chrome.ChromeDriver;

import org.openqa.selenium.support.ui.Select;

import io.github.bonigarcia.wdm.WebDriverManager;

public class UpdateEmployeeTest {

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

        // Click HR Management
        driver.findElement(By.xpath("//*[text()='HR Mgmt']")).click();

        Thread.sleep(2000);

        // Click Update Details
        driver.findElement(By.xpath("//button[text()='Update Details']")).click();

        Thread.sleep(2000);

    }

    @Test
    public void verifyHeader() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='ITAMS']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='IT Asset Management System']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Logout']"))
                .isDisplayed());

    }

    @Test
    public void verifyPageHeading() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Update Employee Details']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Search and update employee information.']"))
                .isDisplayed());

    }

    @Test
    public void verifySearchSection() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Search Employee']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID or Email']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Search']"))
                .isDisplayed());

    }

    @Test
    public void verifyEmployeeDetailsHeading() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Employee Details']"))
                .isDisplayed());

    }

    @Test
    public void verifyEmployeeFields() {

        assertTrue(driver.findElement(
                By.name("employeeId"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.name("employeeName"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.name("email"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.name("department"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.name("designation"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.name("phone"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.name("joiningDate"))
                .isDisplayed());

    }
        @Test
    public void verifyButtons() {

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Update Employee']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Cancel']"))
                .isDisplayed());

    }

    @Test
    public void verifyEmployeeIdReadOnly() {

        String readOnly = driver.findElement(
                By.name("employeeId"))
                .getAttribute("readonly");

        assertTrue(readOnly != null);

    }

    @Test
    public void verifyDepartmentDropdown() {

        Select department = new Select(
                driver.findElement(By.name("department")));

        assertEquals(9, department.getOptions().size());

        assertEquals("Select Department",
                department.getOptions().get(0).getText());

        assertEquals("HR",
                department.getOptions().get(1).getText());

        assertEquals("Asset Manager",
                department.getOptions().get(2).getText());

        assertEquals("Inventory",
                department.getOptions().get(3).getText());

        assertEquals("IT",
                department.getOptions().get(4).getText());

        assertEquals("Finance",
                department.getOptions().get(5).getText());

        assertEquals("Marketing",
                department.getOptions().get(6).getText());

        assertEquals("Sales",
                department.getOptions().get(7).getText());

        assertEquals("Administration",
                department.getOptions().get(8).getText());

    }

    @Test
    public void searchEmployee() throws InterruptedException {

        driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID or Email']"))
                .sendKeys("EMP101");

        driver.findElement(
                By.xpath("//button[text()='Search']"))
                .click();

        Thread.sleep(1000);

    }

    @Test
    public void verifySearchAlert() throws InterruptedException {

        driver.findElement(
                By.xpath("//input[@placeholder='Enter Employee ID or Email']"))
                .sendKeys("EMP101");

        driver.findElement(
                By.xpath("//button[text()='Search']"))
                .click();

        Thread.sleep(1000);

        Alert alert = driver.switchTo().alert();

        assertEquals(
                "Search functionality will be connected to the database later.",
                alert.getText());

        alert.accept();

    }
        @Test
    public void updateEmployee() throws InterruptedException {

        driver.findElement(By.name("employeeName"))
                .sendKeys("Satwika");

        driver.findElement(By.name("email"))
                .sendKeys("satwika@gmail.com");

        Select department = new Select(
                driver.findElement(By.name("department")));

        department.selectByVisibleText("HR");

        driver.findElement(By.name("designation"))
                .sendKeys("HR Executive");

        driver.findElement(By.name("phone"))
                .sendKeys("9876543210");

        driver.findElement(By.name("joiningDate"))
                .sendKeys("01-07-2026");

        Thread.sleep(1000);

        driver.findElement(
                By.xpath("//button[text()='Update Employee']"))
                .click();

    }

    @Test
    public void verifyUpdateAlert() throws InterruptedException {

        driver.findElement(By.name("employeeName"))
                .sendKeys("Satwika");

        driver.findElement(By.name("email"))
                .sendKeys("satwika@gmail.com");

        Select department = new Select(
                driver.findElement(By.name("department")));

        department.selectByVisibleText("HR");

        driver.findElement(By.name("designation"))
                .sendKeys("HR Executive");

        driver.findElement(By.name("phone"))
                .sendKeys("9876543210");

        driver.findElement(By.name("joiningDate"))
                .sendKeys("01-07-2026");

        driver.findElement(
                By.xpath("//button[text()='Update Employee']"))
                .click();

        Thread.sleep(1000);

        Alert alert = driver.switchTo().alert();

        assertEquals(
                "Employee Updated Successfully!",
                alert.getText());

        alert.accept();

    }

    @Test
    public void verifyFormLabels() {

        assertTrue(driver.findElement(
                By.xpath("//label[text()='Employee ID']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//label[text()='Employee Name']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//label[text()='Email']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//label[text()='Department']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//label[text()='Designation']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//label[text()='Phone Number']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//label[text()='Date of Joining']"))
                .isDisplayed());

    }

    @Test
    public void verifyPlaceholders() {

        assertEquals("Employee ID",
                driver.findElement(By.name("employeeId"))
                        .getAttribute("placeholder"));

        assertEquals("Employee Name",
                driver.findElement(By.name("employeeName"))
                        .getAttribute("placeholder"));

        assertEquals("Email Address",
                driver.findElement(By.name("email"))
                        .getAttribute("placeholder"));

        assertEquals("Designation",
                driver.findElement(By.name("designation"))
                        .getAttribute("placeholder"));

        assertEquals("Phone Number",
                driver.findElement(By.name("phone"))
                        .getAttribute("placeholder"));

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