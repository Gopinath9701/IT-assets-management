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

public class AddEmployeeTest {

    WebDriver driver;

    @Before
    public void setup() throws InterruptedException {

        WebDriverManager.chromedriver().setup();

        driver = new ChromeDriver();

        driver.manage().window().maximize();

        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

        driver.get("http://localhost:3000");

        Thread.sleep(2000);

        // Click Login button on Home Page
        driver.findElement(By.xpath("//button[text()='Login']")).click();

        Thread.sleep(2000);

        // Click HR Management button
        driver.findElement(By.xpath("//*[text()='HR Mgmt']")).click();

        Thread.sleep(2000);

        // Click Add Employee button
        driver.findElement(By.xpath("//button[text()='Add Employee']")).click();

        Thread.sleep(2000);
    }

    @Test
    public void verifyPageHeading() {

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Add Employee']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Fill in the employee details below.']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//*[text()='Employee Information']"))
                .isDisplayed());

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
    public void verifyAllFields() {

        assertTrue(driver.findElement(
                By.name("employeeName"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.name("employeeId"))
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
                By.xpath("//button[text()='Save Employee']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Cancel']"))
                .isDisplayed());

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
    public void addEmployee() throws InterruptedException {

        driver.findElement(By.name("employeeName"))
                .sendKeys("Satwika");

        driver.findElement(By.name("employeeId"))
                .sendKeys("EMP101");

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
                By.xpath("//button[text()='Save Employee']"))
                .click();

    }

    @Test
    public void verifySuccessAlert() throws InterruptedException {

        driver.findElement(By.name("employeeName"))
                .sendKeys("Satwika");

        driver.findElement(By.name("employeeId"))
                .sendKeys("EMP101");

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
                By.xpath("//button[text()='Save Employee']"))
                .click();

        Thread.sleep(1000);

        Alert alert = driver.switchTo().alert();

        assertEquals(
                "Employee Added Successfully!",
                alert.getText());

        alert.accept();

    }
        @Test
    public void verifyCancelButton() {

        driver.findElement(By.name("employeeName"))
                .sendKeys("Satwika");

        driver.findElement(By.name("employeeId"))
                .sendKeys("EMP101");

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
                By.xpath("//button[text()='Cancel']"))
                .click();

        assertEquals("",
                driver.findElement(By.name("employeeName"))
                        .getAttribute("value"));

        assertEquals("",
                driver.findElement(By.name("employeeId"))
                        .getAttribute("value"));

        assertEquals("",
                driver.findElement(By.name("email"))
                        .getAttribute("value"));

        assertEquals("",
                driver.findElement(By.name("designation"))
                        .getAttribute("value"));

        assertEquals("",
                driver.findElement(By.name("phone"))
                        .getAttribute("value"));

        assertEquals("",
                driver.findElement(By.name("joiningDate"))
                        .getAttribute("value"));

    }

    @Test
    public void verifyLogoutButton() {

        assertTrue(driver.findElement(
                By.xpath("//button[text()='Logout']"))
                .isDisplayed());

    }

    @Test
    public void verifyFormLabels() {

        assertTrue(driver.findElement(
                By.xpath("//label[text()='Employee Name']"))
                .isDisplayed());

        assertTrue(driver.findElement(
                By.xpath("//label[text()='Employee ID']"))
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

        assertEquals("Enter full name",
                driver.findElement(By.name("employeeName"))
                        .getAttribute("placeholder"));

        assertEquals("Enter employee ID",
                driver.findElement(By.name("employeeId"))
                        .getAttribute("placeholder"));

        assertEquals("Enter email address",
                driver.findElement(By.name("email"))
                        .getAttribute("placeholder"));

        assertEquals("Enter designation",
                driver.findElement(By.name("designation"))
                        .getAttribute("placeholder"));

        assertEquals("Enter phone number",
                driver.findElement(By.name("phone"))
                        .getAttribute("placeholder"));

    }

    @After
    public void tearDown() {

        if (driver != null) {
            driver.quit();
        }

    }

}