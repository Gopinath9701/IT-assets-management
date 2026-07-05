package com.test;

import static org.junit.Assert.assertTrue;

import java.time.Duration;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
//import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import io.github.bonigarcia.wdm.WebDriverManager;
public class HRManagementTest {

    WebDriver driver;

    @Before
public void setup() throws InterruptedException{

    WebDriverManager.chromedriver().setup();

    driver = new ChromeDriver();

    driver.manage().window().maximize();

    driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

    driver.get("http://localhost:3000");
    // Wait for Home page
    Thread.sleep(2000);

    // Click Login button
    driver.findElement(By.xpath("//button[text()='Login']")).click();

    // Wait for Dashboard
    Thread.sleep(2000);

    // Click HR Management
    driver.findElement(By.xpath("//*[text()='HR Mgmt']")).click();

    // Wait for HR Management page
    Thread.sleep(2000);
}
    @Test
    public void verifyHRManagementPage() {

        assertTrue(driver.findElement(By.xpath("//*[text()='HR Management']")).isDisplayed());

        assertTrue(driver.findElement(By.xpath("//*[text()='Manage employee information, status and departments']")).isDisplayed());

        assertTrue(driver.findElement(By.xpath("//*[text()='Add Employee']")).isDisplayed());

        assertTrue(driver.findElement(By.xpath("//*[text()='Update Employee Details']")).isDisplayed());

        assertTrue(driver.findElement(By.xpath("//*[text()='View Employee List']")).isDisplayed());

        assertTrue(driver.findElement(By.xpath("//*[text()='Employee Status']")).isDisplayed());

        assertTrue(driver.findElement(By.xpath("//*[text()='Department Management']")).isDisplayed());

        assertTrue(driver.findElement(By.xpath("//*[text()='Report Maintainance']")).isDisplayed());

        assertTrue(driver.findElement(By.xpath("//*[text()='Employee Status Overview']")).isDisplayed());

    }

    @Test
    public void clickAddEmployee() {

        driver.findElement(By.xpath("//button[text()='Add Employee']")).click();

    }

    @Test
    public void clickUpdateEmployee() {

        driver.findElement(By.xpath("//button[text()='Update Details']")).click();

    }

    @Test
    public void clickViewEmployeeList() {

        driver.findElement(By.xpath("//button[text()='View List']")).click();

    }

    @Test
    public void clickEmployeeStatus() {

        driver.findElement(By.xpath("//button[text()='View Status']")).click();

    }

    @Test
    public void clickDepartmentManagement() {

        driver.findElement(By.xpath("//button[text()='Manage Departments']")).click();

    }

    @Test
    public void clickReportIssue() {

        driver.findElement(By.xpath("//button[text()='Report Issue']")).click();

    }

    @Test
    public void verifyLogoutButton() {

        assertTrue(driver.findElement(By.xpath("//button[text()='Logout']")).isDisplayed());

    }

    @After
    public void tearDown() {

        driver.quit();

    }

}
