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
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class AssetDetailsTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "http://localhost:3000/";

    private static final String ASSET_MANAGER_ID = "260822002";
    private static final String ASSET_MANAGER_PASSWORD = "Itams@2026a";

    // Asset visible in the Asset Details screenshot.
    private static final String ASSET_ID = "MOU012";
    private static final String ASSET_TYPE = "Mouse";

    @BeforeEach
    public void setUp() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("        ITAMS ASSET DETAILS TEST");
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

        System.out.println("Application opened: " + BASE_URL);
    }

    @Test
    public void searchAndViewAssetDetailsTest() {

        // =====================================================
        // STEP 1 - LOGIN
        // =====================================================

        System.out.println();
        System.out.println("STEP 1: ASSET MANAGER LOGIN");

        openLoginPage();

        login(
                ASSET_MANAGER_ID,
                ASSET_MANAGER_PASSWORD
        );

        System.out.println("LOGIN PASSED");


        // =====================================================
        // STEP 2 - OPEN ASSET MANAGEMENT
        // =====================================================

        System.out.println();
        System.out.println("STEP 2: OPEN ASSET MANAGEMENT");

        clickVisibleText("Asset Management");

        waitForText("Asset Management");

        System.out.println("Asset Management page opened");


        // =====================================================
        // STEP 3 - OPEN ASSET DETAILS
        // =====================================================

        System.out.println();
        System.out.println("STEP 3: OPEN ASSET DETAILS");

        WebElement assetDetailsButton =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Asset Details']"
                                        + " | "
                                        + "//a[normalize-space()='Asset Details']"
                                )
                        )
                );

        scrollTo(assetDetailsButton);
        clickJS(assetDetailsButton);

        waitForAnyText(
                "Asset Details",
                "Search Asset ID"
        );

        System.out.println("Asset Details page opened");


        // =====================================================
        // STEP 4 - ENTER ASSET ID
        // =====================================================

        System.out.println();
        System.out.println("STEP 4: SEARCH ASSET");

        WebElement searchField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//input[contains(@placeholder,'Search Asset ID')]"
                                )
                        )
                );

        searchField.clear();
        searchField.sendKeys(ASSET_ID);

        System.out.println(
                "Asset ID entered: " + ASSET_ID
        );


        // =====================================================
        // STEP 5 - SELECT ASSET TYPE
        // =====================================================

        System.out.println();
        System.out.println("STEP 5: SELECT ASSET TYPE");

        List<WebElement> visibleSelects =
                getVisibleSelects();

        assertTrue(
                visibleSelects.size() >= 1,
                "Asset Type dropdown was not found"
        );

        WebElement assetTypeSelect =
                visibleSelects.get(0);

        Select typeSelect =
                new Select(assetTypeSelect);

        boolean typeFound = false;

        for (WebElement option :
                typeSelect.getOptions()) {

            if (
                    option.getText()
                            .trim()
                            .equalsIgnoreCase(
                                    ASSET_TYPE
                            )
            ) {
                typeSelect.selectByVisibleText(
                        option.getText().trim()
                );
                typeFound = true;
                break;
            }
        }

        assertTrue(
                typeFound,
                "Mouse option was not found in Asset Type dropdown"
        );

        System.out.println(
                "Asset Type selected: " + ASSET_TYPE
        );


        // =====================================================
        // STEP 6 - KEEP STATUS = ALL STATUS
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 6: KEEP STATUS = ALL STATUS"
        );

        if (visibleSelects.size() >= 2) {

            WebElement statusSelect =
                    visibleSelects.get(1);

            try {

                new Select(statusSelect)
                        .selectByVisibleText(
                                "All Status"
                        );

            } catch (Exception ignored) {
                // Already All Status.
            }
        }

        System.out.println(
                "Status filter set to All Status"
        );


        // =====================================================
        // STEP 7 - CLICK SEARCH
        // =====================================================

        System.out.println();
        System.out.println("STEP 7: CLICK SEARCH");

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

        sleep(1200);

        System.out.println("Search clicked");


        // =====================================================
        // STEP 8 - VERIFY ASSET ROW
        // =====================================================

        System.out.println();
        System.out.println("STEP 8: VERIFY ASSET ROW");

        WebElement assetRow =
                wait.until(
                        d -> findAssetRow(
                                ASSET_ID,
                                ASSET_TYPE
                        )
                );

        assertTrue(
                assetRow != null,
                "Asset " + ASSET_ID
                        + " of type " + ASSET_TYPE
                        + " was not found"
        );

        System.out.println(
                "Asset found: "
                        + ASSET_ID
                        + " / "
                        + ASSET_TYPE
        );


        // =====================================================
        // STEP 9 - CLICK VIEW
        // =====================================================

        System.out.println();
        System.out.println("STEP 9: CLICK VIEW");

        WebElement viewButton =
                findButtonInRow(
                        assetRow,
                        "View"
                );

        assertTrue(
                viewButton != null,
                "View button was not found for "
                        + ASSET_ID
        );

        scrollTo(viewButton);
        clickJS(viewButton);

        sleep(700);

        System.out.println(
                "View clicked"
        );


        // =====================================================
        // STEP 10 - VERIFY ASSET DETAILS MODAL
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 10: VERIFY ASSET DETAILS"
        );

        waitForText(
                "Asset Details"
        );

        String pageText =
                driver.findElement(
                        By.tagName("body")
                ).getText();

        assertTrue(
                pageText.contains(ASSET_ID),
                "Asset ID is missing in Asset Details"
        );

        assertTrue(
                pageText.contains(ASSET_TYPE),
                "Asset Type is missing in Asset Details"
        );

        /*
         * Values visible in the provided screenshot:
         * Brand = Lenovo
         * Model = Essential Wireless Mouse
         * Status = Available
         * Purchase Date = 28/08/2026
         * Warranty Expiry = 28/01/2027
         * Description = Lenovo Mouse Essential Wireless Mouse
         */
        assertTrue(
                pageText.contains("Lenovo"),
                "Brand Lenovo is missing in Asset Details"
        );

        assertTrue(
                pageText.contains("Essential Wireless Mouse"),
                "Model is missing in Asset Details"
        );

        assertTrue(
                pageText.contains("Available"),
                "Status Available is missing in Asset Details"
        );

        assertTrue(
                pageText.contains("28/08/2026"),
                "Purchase Date is missing in Asset Details"
        );

        assertTrue(
                pageText.contains("28/01/2027"),
                "Warranty Expiry is missing in Asset Details"
        );

        assertTrue(
                pageText.contains(
                        "Lenovo Mouse Essential Wireless Mouse"
                ),
                "Description is missing in Asset Details"
        );

        System.out.println(
                "Asset ID verified: " + ASSET_ID
        );
        System.out.println(
                "Asset Type verified: " + ASSET_TYPE
        );
        System.out.println(
                "Brand verified: Lenovo"
        );
        System.out.println(
                "Model verified: Essential Wireless Mouse"
        );
        System.out.println(
                "Status verified: Available"
        );
        System.out.println(
                "Purchase Date verified: 28/08/2026"
        );
        System.out.println(
                "Warranty Expiry verified: 28/01/2027"
        );
        System.out.println(
                "Description verified"
        );


        // =====================================================
        // STEP 11 - CLOSE MODAL
        // =====================================================

        System.out.println();
        System.out.println("STEP 11: CLOSE DETAILS");

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
                "Asset Details modal closed"
        );


        // =====================================================
        // FINAL
        // =====================================================

        System.out.println();
        System.out.println(
                "=============================================="
        );

        System.out.println(
                "       ASSET DETAILS TEST PASSED"
        );

        System.out.println(
                "=============================================="
        );
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

        System.out.println("Login page opened");
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
                    "Login alert: " + message
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
    // SELECT HELPERS
    // =====================================================

    private List<WebElement> getVisibleSelects() {

        List<WebElement> all =
                driver.findElements(
                        By.xpath("//select")
                );

        all.removeIf(
                element -> {
                    try {
                        return !element.isDisplayed();
                    } catch (Exception e) {
                        return true;
                    }
                }
        );

        return all;
    }


    // =====================================================
    // ROW HELPERS
    // =====================================================

    private WebElement findAssetRow(
            String assetId,
            String assetType
    ) {

        List<WebElement> rows =
                driver.findElements(
                        By.xpath("//tr")
                );

        for (WebElement row : rows) {

            try {

                if (!row.isDisplayed()) {
                    continue;
                }

                String text =
                        row.getText();

                if (
                        text.contains(assetId)
                                &&
                        text.toLowerCase()
                                .contains(
                                        assetType.toLowerCase()
                                )
                ) {
                    return row;
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }


    private WebElement findButtonInRow(
            WebElement row,
            String buttonText
    ) {

        List<WebElement> buttons =
                row.findElements(
                        By.xpath(
                                ".//button[normalize-space()='"
                                        + buttonText
                                        + "']"
                        )
                );

        for (WebElement button :
                buttons) {

            try {

                if (
                        button.isDisplayed()
                                &&
                        button.isEnabled()
                ) {
                    return button;
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }


    // =====================================================
    // PAGE HELPERS
    // =====================================================

    private void clickVisibleText(
            String text
    ) {

        WebElement element =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//*[normalize-space()='"
                                                + text
                                                + "']"
                                )
                        )
                );

        scrollTo(element);
        clickJS(element);
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

                            for (String text : texts) {

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


    // =====================================================
    // UTILITY
    // =====================================================

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


    private void clickJS(
            WebElement element
    ) {

        ((JavascriptExecutor) driver)
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


    private void sleep(long ms) {

        try {

            Thread.sleep(ms);

        } catch (InterruptedException e) {

            Thread.currentThread()
                    .interrupt();
        }
    }


    @AfterEach
    public void tearDown() {

        if (driver != null) {

            driver.quit();

            System.out.println(
                    "Browser closed"
            );
        }
    }
}
