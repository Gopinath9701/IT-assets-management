package com.itams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class HRManagementTest extends BaseTest {

    private WebDriverWait wait;

    private final String HR_ID = "260822001";
    private final String HR_PASSWORD = "Itams@2026h";

    @BeforeEach
    public void loginAsHR() {

        wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        driver.get("http://localhost:3000");

        // Click Login
        wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//button[contains(normalize-space(),'Login')]")
                )
        ).click();

        // Employee ID
        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("employeeIdOrEmail")
                )
        ).sendKeys(HR_ID);

        // Password
        driver.findElement(
                By.name("password")
        ).sendKeys(HR_PASSWORD);

        // Login
        driver.findElement(
                By.xpath("//form//button[@type='submit']")
        ).click();

        // Accept success alert
        try {
            new WebDriverWait(driver, Duration.ofSeconds(10))
                    .until(ExpectedConditions.alertIsPresent());

            Alert alert = driver.switchTo().alert();

            System.out.println("Login Alert: " + alert.getText());

            alert.accept();

        } catch (Exception ignored) {
        }

        // Wait for HR Management
        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//h1[normalize-space()='HR Management']")
                )
        );
    }


    @Test
    public void verifyHRManagementPage() {

        assertTrue(
                driver.getPageSource().contains("HR Management"),
                "HR Management page not displayed"
        );

        assertTrue(
                driver.getPageSource().contains(
                        "Manage employee information, status and departments"
                ),
                "HR Management subtitle not displayed"
        );

        System.out.println(
                "HR MANAGEMENT PAGE : PASSED"
        );
    }


    @Test
    public void verifyAllHRActionCards() {

        String page = driver.getPageSource();

        assertTrue(
                page.contains("Add Employee"),
                "Add Employee card not displayed"
        );

        assertTrue(
                page.contains("Update Employee Details"),
                "Update Employee Details card not displayed"
        );

        assertTrue(
                page.contains("View Employee List"),
                "View Employee List card not displayed"
        );

        assertTrue(
                page.contains("Employee Status"),
                "Employee Status card not displayed"
        );

        assertTrue(
                page.contains("Department Management"),
                "Department Management card not displayed"
        );

        assertTrue(
                page.contains("Report Maintainance"),
                "Report Maintainance card not displayed"
        );

        assertTrue(
                page.contains("Asset Request"),
                "Asset Request card not displayed"
        );

        System.out.println(
                "ALL HR ACTION CARDS : PASSED"
        );
    }


    @Test
    public void verifyEmployeeStatusOverview() {

        String page = driver.getPageSource();

        assertTrue(
                page.contains("Active Employees"),
                "Active Employees not displayed"
        );

        assertTrue(
                page.contains("On Leave"),
                "On Leave not displayed"
        );

        assertTrue(
                page.contains("Resigned"),
                "Resigned not displayed"
        );

        assertTrue(
                page.contains("Inactive"),
                "Inactive not displayed"
        );

        assertTrue(
                page.contains("Total Employees"),
                "Total Employees not displayed"
        );

        System.out.println(
                "EMPLOYEE STATUS OVERVIEW : PASSED"
        );
    }
}
