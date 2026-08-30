package com.itams.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class AssetManagementPageTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "http://localhost:3000/";

    // Asset Manager login
    private static final String ASSET_MANAGER_ID = "260822002";
    private static final String ASSET_MANAGER_PASSWORD = "Itams@2026a";

    @BeforeEach
    public void setUp() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println(" ITAMS ASSET MANAGEMENT PAGE TEST");
        System.out.println("==============================================");

        WebDriverManager.chromedriver().setup();

        driver = new ChromeDriver();
        driver.manage().window().maximize();

        driver.manage().timeouts().pageLoadTimeout(
                Duration.ofSeconds(60)
        );

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(20)
        );

        driver.get(BASE_URL);

        waitForPageReady();

        System.out.println(
                "Application opened: " + BASE_URL
        );
    }

    @Test
    public void verifyAssetManagementPageTest() {

        // =========================================================
        // STEP 1 - LOGIN
        // =========================================================

        System.out.println();
        System.out.println("STEP 1: ASSET MANAGER LOGIN");

        openLoginPage();
        login(
                ASSET_MANAGER_ID,
                ASSET_MANAGER_PASSWORD
        );

        System.out.println(
                "LOGIN PASSED"
        );


        // =========================================================
        // STEP 2 - OPEN ASSET MANAGEMENT
        // =========================================================

        System.out.println();
        System.out.println(
                "STEP 2: OPEN ASSET MANAGEMENT"
        );

        WebElement assetManagement =
                waitForTextElement(
                        "Asset Management"
                );

        clickJS(
                assetManagement
        );

        waitForText(
                "Asset Management",
                20
        );

        System.out.println(
                "Asset Management page opened"
        );


        // =========================================================
        // STEP 3 - VERIFY PAGE
        // =========================================================

        System.out.println();
        System.out.println(
                "STEP 3: VERIFY ASSET MANAGEMENT OPTIONS"
        );


        // 1. Add Asset
        verifyOption(
                "Add Asset",
                "ADD ASSET"
        );


        // 2. Manage Assets
        verifyOption(
                "Manage Assets",
                "MANAGE ASSETS"
        );


        // 3. Asset Details
        verifyOption(
                "Asset Details",
                "ASSET DETAILS"
        );


        // 4. Employee Status
        verifyOption(
                "Employee Status",
                "EMPLOYEE STATUS"
        );


        // 5. Asset Return
        verifyOption(
                "Asset Return",
                "ASSET RETURN"
        );


        // =========================================================
        // FINAL
        // =========================================================

        System.out.println();
        System.out.println(
                "=============================================="
        );

        System.out.println(
                " ASSET MANAGEMENT PAGE TEST PASSED"
        );

        System.out.println(
                " All 5 options are present"
        );

        System.out.println(
                "=============================================="
        );
    }


    // =============================================================
    // VERIFY OPTION
    // =============================================================

    private void verifyOption(
            String optionText,
            String logText
    ) {

        WebDriverWait optionWait =
                new WebDriverWait(
                        driver,
                        Duration.ofSeconds(15)
                );

        WebElement element =
                optionWait.until(
                        d -> {

                            List<WebElement> elements =
                                    d.findElements(
                                            By.xpath(
                                                    "//*[self::button or self::a or self::div or self::h2 or self::h3]" +
                                                    "[normalize-space()='" +
                                                    optionText +
                                                    "']"
                                            )
                                    );

                            for (WebElement candidate :
                                    elements) {

                                try {

                                    if (
                                            candidate.isDisplayed()
                                    ) {
                                        return candidate;
                                    }

                                } catch (Exception ignored) {
                                }
                            }

                            /*
                             * Fallback: look for the text anywhere
                             * on the page.
                             */
                            List<WebElement> fallback =
                                    d.findElements(
                                            By.xpath(
                                                    "//*[contains(normalize-space(),'" +
                                                    optionText +
                                                    "')]"
                                            )
                                    );

                            for (WebElement candidate :
                                    fallback) {

                                try {

                                    if (
                                            candidate.isDisplayed()
                                    ) {
                                        return candidate;
                                    }

                                } catch (Exception ignored) {
                                }
                            }

                            return null;
                        }
                );

        assertTrue(
                element.isDisplayed(),
                optionText +
                        " is not displayed on Asset Management page"
        );

        System.out.println(
                logText + " PASSED"
        );
    }


    // =============================================================
    // LOGIN
    // =============================================================

    private void openLoginPage() {

        WebElement login =
                wait.until(
                        d -> {

                            List<WebElement> elements =
                                    d.findElements(
                                            By.xpath(
                                                    "//button[normalize-space()='Login']" +
                                                    " | " +
                                                    "//a[normalize-space()='Login']"
                                            )
                                    );

                            for (WebElement element :
                                    elements) {

                                try {

                                    if (
                                            element.isDisplayed()
                                    ) {
                                        return element;
                                    }

                                } catch (Exception ignored) {
                                }
                            }

                            return null;
                        }
                );

        clickJS(login);

        wait.until(
                d -> {

                    List<WebElement> fields =
                            d.findElements(
                                    By.xpath(
                                            "//input[@type='text']"
                                            + " | "
                                            + "//input[@type='email']"
                                            + " | "
                                            + "//input[contains(@placeholder,'Employee ID')]"
                                    )
                            );

                    for (WebElement field :
                            fields) {

                        try {

                            if (
                                    field.isDisplayed()
                            ) {
                                return true;
                            }

                        } catch (Exception ignored) {
                        }
                    }

                    return false;
                }
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
        employeeField.sendKeys(
                employeeId
        );

        System.out.println(
                "Employee ID entered: " + employeeId
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
        passwordField.sendKeys(
                password
        );

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

        clickJS(
                loginButton
        );

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
                    "Login alert: " + message
            );

            alert.accept();

            System.out.println(
                    "Login alert accepted"
            );

        } catch (Exception e) {

            throw new AssertionError(
                    "Login Successful alert was not displayed."
            );
        }


        waitForPageReady();
        sleep(1000);
    }


    // =============================================================
    // PAGE TEXT
    // =============================================================

    private void waitForText(
            String text,
            int seconds
    ) {

        new WebDriverWait(
                driver,
                Duration.ofSeconds(seconds)
        ).until(
                d -> {

                    try {

                        String body =
                                d.findElement(
                                        By.tagName("body")
                                ).getText();

                        return body != null
                                && body.contains(text);

                    } catch (Exception e) {

                        return false;
                    }
                }
        );
    }


    private WebElement waitForTextElement(
            String text
    ) {

        return wait.until(
                d -> findVisible(
                        d,
                        By.xpath(
                                "//*[normalize-space()='" +
                                        text +
                                        "']"
                        )
                )
        );
    }


    // =============================================================
    // UTILITY
    // =============================================================

    private WebElement findVisible(
            WebDriver webDriver,
            By locator
    ) {

        List<WebElement> elements =
                webDriver.findElements(
                        locator
                );

        for (WebElement element :
                elements) {

            try {

                if (
                        element.isDisplayed()
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

        ((org.openqa.selenium.JavascriptExecutor) driver)
                .executeScript(
                        "arguments[0].click();",
                        element
                );
    }


    private void waitForPageReady() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(20)
            ).until(
                    d -> {

                        try {

                            return ((org.openqa.selenium.JavascriptExecutor) d)
                                    .executeScript(
                                            "return document.readyState"
                                    )
                                    .equals(
                                            "complete"
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
