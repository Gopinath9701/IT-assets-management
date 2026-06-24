package com.test;

import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class HomePageTest {

    @Test
    public void testHomePage() throws Exception {

        WebDriver driver = new ChromeDriver();

        driver.manage().window().maximize();

        // HP01 - Verify Home Page Opens
        driver.get("http://localhost:3000");
        Thread.sleep(3000);

        Assert.assertNotNull(driver.getTitle());
        System.out.println("HP01 Passed - Home Page Opened");

       

        // HP03 - Verify Features Section Exists
        Assert.assertTrue(driver.getPageSource().contains("Features"));
        System.out.println("HP03 Passed - Features Section Found");

        // HP04 - Verify About Us Section Exists
        Assert.assertTrue(driver.getPageSource().contains("About Us"));
        System.out.println("HP04 Passed - About Us Section Found");

        // HP05 - Verify Contact Section Exists
        Assert.assertTrue(driver.getPageSource().contains("Contact"));
        System.out.println("HP05 Passed - Contact Section Found");

           // HP02 - Verify Login Button
        driver.findElement(By.xpath("//button[contains(text(),'Login')]")).click();
        Thread.sleep(2000);

        Assert.assertTrue(driver.getPageSource().contains("Login"));
        System.out.println("HP02 Passed - Login Page Opened");

        // Return to Home Page
        driver.navigate().back();
        Thread.sleep(2000);

        System.out.println("All Home Page Test Cases Passed Successfully");

        driver.quit();
    }
}