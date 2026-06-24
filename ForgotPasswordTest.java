package com.test;

import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class ForgotPasswordTest {

    @Test
    public void testForgotPasswordPage() throws Exception {

        WebDriver driver = new ChromeDriver();

        driver.manage().window().maximize();
        driver.get("http://localhost:3000");

        Thread.sleep(3000);

        // Open Login Page
        driver.findElement(By.xpath("//button[contains(text(),'Login')]")).click();
        Thread.sleep(2000);

        // Open Forgot Password Page
        driver.findElement(By.linkText("Forgot Password?")).click();
        Thread.sleep(2000);

        // FP01 - Forgot Password Page Opened
        Assert.assertTrue(driver.getPageSource().contains("Forget Password"));
        System.out.println("FP01 Passed - Forgot Password Page Opened");

        // FP02 - Email/Employee ID Field
        Assert.assertTrue(
                driver.findElement(By.xpath("//input[@placeholder='Enter your email or employee ID']")).isDisplayed());
        System.out.println("FP02 Passed - Email/Employee ID Field Displayed");

        // FP03 - Send OTP Button
        Assert.assertTrue(
                driver.findElement(By.xpath("//button[contains(text(),'Send OTP')]")).isDisplayed());
        System.out.println("FP03 Passed - Send OTP Button Displayed");

        // FP04 - OTP Field
        Assert.assertTrue(
                driver.findElement(By.xpath("//input[@placeholder='Enter the OTP sent to your email']")).isDisplayed());
        System.out.println("FP04 Passed - OTP Field Displayed");

        // FP05 - Verify OTP Button
        Assert.assertTrue(
                driver.findElement(By.xpath("//button[contains(text(),'Verify OTP')]")).isDisplayed());
        System.out.println("FP05 Passed - Verify OTP Button Displayed");

        // FP06 - New Password Field
        Assert.assertTrue(
                driver.findElement(By.xpath("//input[@placeholder='Enter new password']")).isDisplayed());
        System.out.println("FP06 Passed - New Password Field Displayed");

        // FP07 - Confirm Password Field
        Assert.assertTrue(
                driver.findElement(By.xpath("//input[@placeholder='Confirm new password']")).isDisplayed());
        System.out.println("FP07 Passed - Confirm Password Field Displayed");

        // FP08 - Reset Password Button
        Assert.assertTrue(
                driver.findElement(By.xpath("//button[contains(text(),'Reset Password')]")).isDisplayed());
        System.out.println("FP08 Passed - Reset Password Button Displayed");

        System.out.println("All Forgot Password Test Cases Passed");

        driver.quit();
    }
}
