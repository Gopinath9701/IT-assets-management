package com.itams;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class LoginIntegrationTest extends BaseTest {

    // ============================================================
    // USER DETAILS
    // ============================================================

    private static final String HR_ID = "260822001";
    private static final String HR_EMAIL = "260822001a@gmail.com";
    private static final String HR_PASSWORD = "Itams@2026h";

    private static final String ASSET_MANAGER_ID = "260822002";
    private static final String ASSET_MANAGER_EMAIL =
            "260822002a@gmail.com";
    private static final String ASSET_MANAGER_PASSWORD =
            "Itams@2026a";

    private static final String INVENTORY_MANAGER_ID = "260822003";
    private static final String INVENTORY_MANAGER_EMAIL =
            "260822003a@gmail.com";
    private static final String INVENTORY_MANAGER_PASSWORD =
            "Itams@2026";


    // ============================================================
    // TEST 1 - HR LOGIN USING EMPLOYEE ID
    // ============================================================

    @Test
    public void validHRLoginWithEmployeeIdTest() {

        loginAndVerify(
                HR_ID,
                HR_PASSWORD,
                "HR - Employee ID"
        );

        System.out.println(
                "VALID HR LOGIN USING EMPLOYEE ID : PASSED"
        );
    }


    // ============================================================
    // TEST 2 - ASSET MANAGER LOGIN USING EMPLOYEE ID
    // ============================================================

    @Test
    public void validAssetManagerLoginWithEmployeeIdTest() {

        loginAndVerify(
                ASSET_MANAGER_ID,
                ASSET_MANAGER_PASSWORD,
                "Asset Manager - Employee ID"
        );

        System.out.println(
                "VALID ASSET MANAGER LOGIN USING EMPLOYEE ID : PASSED"
        );
    }


    // ============================================================
    // TEST 3 - INVENTORY MANAGER LOGIN USING EMPLOYEE ID
    // ============================================================

    @Test
    public void validInventoryManagerLoginWithEmployeeIdTest() {

        loginAndVerify(
                INVENTORY_MANAGER_ID,
                INVENTORY_MANAGER_PASSWORD,
                "Inventory Manager - Employee ID"
        );

        System.out.println(
                "VALID INVENTORY MANAGER LOGIN USING EMPLOYEE ID : PASSED"
        );
    }


    // ============================================================
    // TEST 4 - HR LOGIN USING EMAIL
    // ============================================================

    @Test
    public void validHRLoginWithEmailTest() {

        loginAndVerify(
                HR_EMAIL,
                HR_PASSWORD,
                "HR - Email"
        );

        System.out.println(
                "VALID HR LOGIN USING EMAIL : PASSED"
        );
    }


    // ============================================================
    // TEST 5 - ASSET MANAGER LOGIN USING EMAIL
    // ============================================================

    @Test
    public void validAssetManagerLoginWithEmailTest() {

        loginAndVerify(
                ASSET_MANAGER_EMAIL,
                ASSET_MANAGER_PASSWORD,
                "Asset Manager - Email"
        );

        System.out.println(
                "VALID ASSET MANAGER LOGIN USING EMAIL : PASSED"
        );
    }


    // ============================================================
    // TEST 6 - INVENTORY MANAGER LOGIN USING EMAIL
    // ============================================================

    @Test
    public void validInventoryManagerLoginWithEmailTest() {

        loginAndVerify(
                INVENTORY_MANAGER_EMAIL,
                INVENTORY_MANAGER_PASSWORD,
                "Inventory Manager - Email"
        );

        System.out.println(
                "VALID INVENTORY MANAGER LOGIN USING EMAIL : PASSED"
        );
    }


    // ============================================================
    // TEST 7 - INVALID EMPLOYEE ID FORMAT
    // ============================================================

    @Test
    public void invalidEmployeeIdFormatTest() {

        WebDriverWait wait = openLoginPage();

        WebElement employeeField = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("employeeIdOrEmail")
                )
        );

        // Invalid Employee ID - only 7 digits
        employeeField.sendKeys("2608002");

        // Trigger React validation
        employeeField.sendKeys(Keys.TAB);

        // Wait for validation class
        wait.until(
                ExpectedConditions.attributeContains(
                        employeeField,
                        "class",
                        "input-error"
                )
        );

        String formText = driver
                .findElement(By.tagName("form"))
                .getText();

        assertTrue(
                formText.contains(
                        "Employee ID must be exactly 9 digits"
                ),
                "Employee ID validation message was not displayed"
        );

        System.out.println(
                "INVALID EMPLOYEE ID FORMAT : PASSED"
        );
    }


    // ============================================================
    // TEST 8 - INVALID EMAIL FORMAT
    // ============================================================

    @Test
    public void invalidEmailFormatTest() {

        WebDriverWait wait = openLoginPage();

        WebElement employeeField = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("employeeIdOrEmail")
                )
        );

        /*
         * Correct email:
         * 260522001a@gmail.com
         *
         * Invalid email:
         * 260522001@gmail.com
         */

        employeeField.sendKeys("260522001@gmail.com");

        // Trigger React validation
        employeeField.sendKeys(Keys.TAB);

        // Wait for input-error class
        wait.until(
                ExpectedConditions.attributeContains(
                        employeeField,
                        "class",
                        "input-error"
                )
        );

        String formText = driver
                .findElement(By.tagName("form"))
                .getText();

        assertTrue(
                formText.contains(
                        "Email must be in this format"
                ),
                "Email validation message was not displayed"
        );

        System.out.println(
                "INVALID EMAIL FORMAT : PASSED"
        );
    }


    // ============================================================
    // TEST 9 - INVALID PASSWORD
    // ============================================================

    @Test
    public void invalidCredentialsTest() {

        WebDriverWait wait = openLoginPage();

        // Valid Employee ID
        WebElement employeeField = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("employeeIdOrEmail")
                )
        );

        employeeField.sendKeys(HR_ID);

        // Wrong password
        WebElement passwordField = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("password")
                )
        );

        passwordField.sendKeys("WrongPassword@123");

        // Click Login
        WebElement loginButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//form//button[@type='submit']")
                )
        );

        loginButton.click();

        // Wait for invalid credentials alert
        Alert alert = wait.until(
                ExpectedConditions.alertIsPresent()
        );

        String alertText = alert.getText();

        System.out.println(
                "Invalid login alert: " + alertText
        );

        assertEquals(
                "Invalid credentials",
                alertText,
                "Invalid credentials alert was not displayed"
        );

        alert.accept();

        System.out.println(
                "INVALID CREDENTIALS : PASSED"
        );
    }


    // ============================================================
    // COMMON VALID LOGIN METHOD
    // ============================================================

    private void loginAndVerify(
            String username,
            String password,
            String testName
    ) {

        WebDriverWait wait = openLoginPage();

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "Running test: " + testName
        );

        // --------------------------------------------------------
        // STEP 1 - ENTER EMPLOYEE ID / EMAIL
        // --------------------------------------------------------

        WebElement employeeField = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("employeeIdOrEmail")
                )
        );

        employeeField.clear();
        employeeField.sendKeys(username);


        // --------------------------------------------------------
        // STEP 2 - ENTER PASSWORD
        // --------------------------------------------------------

        WebElement passwordField = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("password")
                )
        );

        passwordField.clear();
        passwordField.sendKeys(password);


        // --------------------------------------------------------
        // STEP 3 - CLICK LOGIN
        // --------------------------------------------------------

        WebElement loginButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//form//button[@type='submit']")
                )
        );

        loginButton.click();


        // --------------------------------------------------------
        // STEP 4 - WAIT FOR LOGIN RESULT
        // --------------------------------------------------------

        boolean loginSuccessful = false;

        long endTime =
                System.currentTimeMillis() + 15000;

        while (System.currentTimeMillis() < endTime) {

            // ----------------------------------------------------
            // CHECK FOR ALERT
            // ----------------------------------------------------

            try {

                Alert alert = driver.switchTo().alert();

                String alertText = alert.getText();

                System.out.println(
                        "Login response alert: " + alertText
                );

                if ("Login Successful".equals(alertText)) {

                    alert.accept();

                    loginSuccessful = true;

                    break;
                }

                if ("Invalid credentials".equals(alertText)) {

                    alert.accept();

                    loginSuccessful = false;

                    break;
                }

            } catch (Exception ignored) {

                // No alert currently present
            }


            // ----------------------------------------------------
            // CHECK LOCAL STORAGE
            // ----------------------------------------------------

            try {

                JavascriptExecutor js =
                        (JavascriptExecutor) driver;

                Object token =
                        js.executeScript(
                                "return window.localStorage.getItem('token');"
                        );

                Object user =
                        js.executeScript(
                                "return window.localStorage.getItem('user');"
                        );

                if (token != null &&
                        !token.toString().isEmpty() &&
                        user != null &&
                        !user.toString().isEmpty()) {

                    loginSuccessful = true;

                    System.out.println(
                            "Authentication data detected in localStorage."
                    );

                    break;
                }

            } catch (Exception ignored) {

                // Continue checking
            }


            // ----------------------------------------------------
            // WAIT A LITTLE BEFORE CHECKING AGAIN
            // ----------------------------------------------------

            try {

                Thread.sleep(500);

            } catch (InterruptedException e) {

                Thread.currentThread().interrupt();

                break;
            }
        }


        // --------------------------------------------------------
        // STEP 5 - VERIFY LOGIN
        // --------------------------------------------------------

        assertTrue(
                loginSuccessful,
                "Login did not complete successfully for: "
                        + testName
        );


        // --------------------------------------------------------
        // STEP 6 - VERIFY TOKEN
        // --------------------------------------------------------

        JavascriptExecutor js =
                (JavascriptExecutor) driver;

        Object token =
                js.executeScript(
                        "return window.localStorage.getItem('token');"
                );

        assertTrue(
                token != null &&
                        !token.toString().isEmpty(),
                "JWT token was not stored for: "
                        + testName
        );


        // --------------------------------------------------------
        // STEP 7 - VERIFY USER DATA
        // --------------------------------------------------------

        Object user =
                js.executeScript(
                        "return window.localStorage.getItem('user');"
                );

        assertTrue(
                user != null &&
                        !user.toString().isEmpty(),
                "User information was not stored for: "
                        + testName
        );


        System.out.println(
                "Token stored: YES"
        );

        System.out.println(
                "User data stored: YES"
        );

        System.out.println(
                "LOGIN INTEGRATION TEST PASSED: "
                        + testName
        );

        System.out.println(
                "=========================================="
        );
    }


    // ============================================================
    // OPEN LOGIN PAGE
    // ============================================================

    private WebDriverWait openLoginPage() {

        WebDriverWait wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(10)
        );

        // Home page → Login
        WebElement homeLoginButton = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[contains(text(),'Login')]"
                        )
                )
        );

        homeLoginButton.click();

        // Wait until Login form appears
        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("employeeIdOrEmail")
                )
        );

        return wait;
    }
}
