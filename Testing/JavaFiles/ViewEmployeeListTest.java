package com.itams.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class ViewEmployeeListTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "http://localhost:3000/";

    private static final String HR_ID = "260822001";
    private static final String HR_PASSWORD = "Itams@2026h";

    private static final String EMPLOYEE_ID = "260822004";

    @BeforeEach
    public void setUp() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("       ITAMS VIEW EMPLOYEE LIST TEST");
        System.out.println("==============================================");

        WebDriverManager.chromedriver().setup();

        driver = new ChromeDriver();
        driver.manage().window().maximize();

        driver.manage().timeouts().pageLoadTimeout(
                Duration.ofSeconds(60)
        );

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(25)
        );

        driver.get(BASE_URL);
        waitForPageReady();

        System.out.println(
                "Application opened: " + BASE_URL
        );
    }

    @Test
    public void viewEmployeeDetailsTest() {

        // =====================================================
        // STEP 1 - HR LOGIN
        // =====================================================

        System.out.println();
        System.out.println("STEP 1: HR LOGIN");

        openLoginPage();

        login(
                HR_ID,
                HR_PASSWORD
        );

        System.out.println(
                "HR LOGIN PASSED"
        );


        // =====================================================
        // STEP 2 - OPEN HR MANAGEMENT
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 2: OPEN HR MANAGEMENT"
        );

        WebElement hrManagement =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//*[normalize-space()='HR Management']"
                                )
                        )
                );

        clickJS(hrManagement);

        waitForAnyText(
                "HR Management",
                "View Employee List"
        );

        System.out.println(
                "HR Management page opened"
        );


        // =====================================================
        // STEP 3 - CLICK VIEW LIST
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 3: CLICK VIEW LIST"
        );

        WebElement viewList =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='View List']"
                                )
                        )
                );

        scrollTo(viewList);

        clickJS(viewList);

        sleep(1000);

        waitForAnyText(
                "View Employee List",
                "Search Employee",
                "Employee List"
        );

        System.out.println(
                "View Employee List page opened"
        );


        // =====================================================
        // STEP 4 - ENTER EMPLOYEE ID
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 4: SEARCH EMPLOYEE"
        );

        WebElement searchField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//input[contains(@placeholder,'Enter Employee ID')]"
                                )
                        )
                );

        searchField.clear();

        searchField.sendKeys(
                EMPLOYEE_ID
        );

        System.out.println(
                "Employee ID entered: "
                        + EMPLOYEE_ID
        );


        // =====================================================
        // STEP 5 - CLICK SEARCH
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 5: CLICK SEARCH"
        );

        WebElement searchButton =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Search']"
                                )
                        )
                );

        clickJS(searchButton);

        sleep(1000);

        System.out.println(
                "Search clicked"
        );


        // =====================================================
        // STEP 6 - VERIFY EMPLOYEE ROW
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 6: VERIFY EMPLOYEE"
        );

        WebElement employeeRow =
                wait.until(
                        d -> findEmployeeRow(
                                EMPLOYEE_ID
                        )
                );

        assertTrue(
                employeeRow != null,
                "Employee "
                        + EMPLOYEE_ID
                        + " was not found"
        );

        String rowText =
                employeeRow.getText();

        System.out.println(
                "Employee found: "
                        + rowText
        );

        assertTrue(
                rowText.contains(
                        EMPLOYEE_ID
                ),
                "Employee ID is not displayed"
        );


        // =====================================================
        // STEP 7 - CLICK VIEW
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 7: CLICK VIEW"
        );

        WebElement viewButton =
                employeeRow.findElement(
                        By.xpath(
                                ".//button[normalize-space()='View']"
                        )
                );

        scrollTo(viewButton);

        clickJS(viewButton);

        sleep(700);

        System.out.println(
                "View clicked"
        );


        // =====================================================
        // STEP 8 - VERIFY EMPLOYEE DETAILS
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 8: VERIFY EMPLOYEE DETAILS"
        );

        waitForText(
                "Employee Details"
        );


        String details =
                driver.findElement(
                        By.tagName("body")
                ).getText();


        assertTrue(
                details.contains(
                        EMPLOYEE_ID
                ),
                "Employee ID missing in details"
        );

        assertTrue(
                details.contains(
                        "V Shiva"
                ),
                "Employee Name missing in details"
        );

        assertTrue(
                details.contains(
                        "Marketing"
                ),
                "Department missing in details"
        );

        assertTrue(
                details.contains(
                        "Active"
                ),
                "Employee Status missing in details"
        );

        assertTrue(
                details.contains(
                        "Employee Details"
                ),
                "Employee Details modal did not open"
        );


        System.out.println(
                "Employee ID verified: "
                        + EMPLOYEE_ID
        );

        System.out.println(
                "Employee Name verified: V Shiva"
        );

        System.out.println(
                "Department verified: Marketing"
        );

        System.out.println(
                "Status verified: Active"
        );


        // =====================================================
        // STEP 9 - VERIFY ASSIGNED ASSETS SECTION
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 9: VERIFY ASSIGNED ASSETS"
        );

        assertTrue(
                details.contains(
                        "Assigned Assets"
                ),
                "Assigned Assets section missing"
        );

        System.out.println(
                "Assigned Assets section verified"
        );


        // =====================================================
        // STEP 10 - CLOSE MODAL
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 10: CLOSE DETAILS"
        );

        WebElement closeButton =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Close']"
                                )
                        )
                );

        clickJS(closeButton);

        sleep(500);

        System.out.println(
                "Employee Details closed"
        );


        // =====================================================
        // FINAL
        // =====================================================

        System.out.println();
        System.out.println(
                "=============================================="
        );

        System.out.println(
                "       VIEW EMPLOYEE LIST TEST PASSED"
        );

        System.out.println(
                "=============================================="
        );
    }


    // =====================================================
    // FIND EMPLOYEE ROW
    // =====================================================

    private WebElement findEmployeeRow(
            String employeeId
    ) {

        List<WebElement> rows =
                driver.findElements(
                        By.xpath("//tr")
                );

        for (WebElement row :
                rows) {

            try {

                if (!row.isDisplayed()) {
                    continue;
                }

                String text =
                        row.getText();

                if (
                        text != null
                                &&
                        text.contains(employeeId)
                ) {
                    return row;
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }


    // =====================================================
    // LOGIN
    // =====================================================

    private void openLoginPage() {

        WebElement login =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Login']"
                                        + " | "
                                        + "//a[normalize-space()='Login']"
                                )
                        )
                );

        clickJS(login);

        wait.until(
                d -> findVisible(
                        d,
                        By.xpath(
                                "//input[contains(@placeholder,'Employee ID or Email')]"
                                + " | "
                                + "//input[@type='password']"
                        )
                ) != null
        );

        System.out.println(
                "Login page opened"
        );
    }


    private void login(
            String employeeId,
            String password
    ) {

        WebElement employeeField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//input[contains(@placeholder,'Employee ID or Email')]"
                                        + " | "
                                        + "//input[@name='employeeId']"
                                        + " | "
                                        + "//input[@name='employeeIdOrEmail']"
                                        + " | "
                                        + "//input[@type='text']"
                                )
                        )
                );

        employeeField.clear();
        employeeField.sendKeys(employeeId);

        System.out.println(
                "Employee ID entered: "
                        + employeeId
        );

        WebElement passwordField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//input[@type='password']"
                                )
                        )
                );

        passwordField.clear();
        passwordField.sendKeys(password);

        System.out.println(
                "Password entered"
        );

        WebElement loginButton =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//form//button[@type='submit']"
                                        + " | "
                                        + "//button[normalize-space()='Login']"
                                )
                        )
                );

        clickJS(loginButton);

        System.out.println(
                "Login button clicked"
        );

        try {

            Alert alert =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(10)
                    ).until(
                            ExpectedConditions.alertIsPresent()
                    );

            String message =
                    alert.getText();

            System.out.println(
                    "Login alert: "
                            + message
            );

            alert.accept();

        } catch (Exception e) {

            throw new AssertionError(
                    "Login Successful alert was not displayed"
            );
        }

        waitForPageReady();
        sleep(1000);
    }


    // =====================================================
    // HELPERS
    // =====================================================

    private WebElement findVisible(
            WebDriver webDriver,
            By locator
    ) {

        List<WebElement> elements =
                webDriver.findElements(locator);

        for (WebElement element :
                elements) {

            try {

                if (
                        element.isDisplayed()
                                &&
                        element.isEnabled()
                ) {
                    return element;
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }


    private void clickJS(
            WebElement element
    ) {

        ((JavascriptExecutor) driver)
                .executeScript(
                        "arguments[0].click();",
                        element
                );
    }


    private void scrollTo(
            WebElement element
    ) {

        ((JavascriptExecutor) driver)
                .executeScript(
                        "arguments[0].scrollIntoView({block:'center'});",
                        element
                );

        sleep(300);
    }


    private void waitForText(
            String text
    ) {

        wait.until(
                d -> {

                    try {

                        return d.findElement(
                                By.tagName("body")
                        ).getText().contains(text);

                    } catch (Exception e) {

                        return false;
                    }
                }
        );
    }


    private boolean waitForAnyText(
            String... texts
    ) {

        try {

            return new WebDriverWait(
                    driver,
                    Duration.ofSeconds(15)
            ).until(
                    d -> {

                        try {

                            String body =
                                    d.findElement(
                                            By.tagName("body")
                                    ).getText();

                            if (body == null) {
                                return false;
                            }

                            for (String text :
                                    texts) {

                                if (
                                        body.contains(text)
                                ) {
                                    return true;
                                }
                            }

                        } catch (Exception ignored) {
                        }

                        return false;
                    }
            );

        } catch (Exception e) {

            return false;
        }
    }


    private void waitForPageReady() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(20)
            ).until(
                    d -> {

                        try {

                            return "complete".equals(
                                    ((JavascriptExecutor) d)
                                            .executeScript(
                                                    "return document.readyState"
                                            )
                            );

                        } catch (Exception e) {

                            return false;
                        }
                    }
            );

        } catch (Exception ignored) {
        }
    }


    private void sleep(
            long milliseconds
    ) {

        try {

            Thread.sleep(
                    milliseconds
            );

        } catch (InterruptedException e) {

            Thread.currentThread()
                    .interrupt();
        }
    }


    @AfterEach
    public void tearDown() {

        if (driver != null) {

            driver.quit();

            System.out.println();
            System.out.println(
                    "Browser closed"
            );
        }
    }
}

