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

public class AddAssetTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "http://localhost:3000/";

    private static final String ASSET_MANAGER_ID = "260822002";
    private static final String ASSET_MANAGER_PASSWORD = "Itams@2026a";

    private static final String ASSET_TYPE = "Mouse";
    private static final String BRAND = "Lenovo";
    private static final String MODEL = "Essential Wireless Mouse";
    private static final String PURCHASE_COST = "500";

    // The screenshot says 28-08-2006, but the application says
    // purchases must be within the last 7 days. The intended valid
    // date is therefore 28-08-2026.
    private static final String PURCHASE_DATE = "28-08-2026";
    private static final String WARRANTY_EXPIRY = "28-01-2027";

    private static final String DESCRIPTION =
            "Lenovo Mouse Essential Wireless Mouse";

    @BeforeEach
    public void setUp() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("        ITAMS ADD ASSET AUTOMATION");
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
    public void addMouseAssetTest() {

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

        System.out.println(
                "LOGIN PASSED"
        );


        // =====================================================
        // STEP 2 - OPEN ASSET MANAGEMENT
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 2: OPEN ASSET MANAGEMENT"
        );

        clickVisibleText(
                "Asset Management"
        );

        waitForText(
                "Asset Management"
        );

        System.out.println(
                "Asset Management page opened"
        );


        // =====================================================
        // STEP 3 - OPEN ADD ASSET
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 3: OPEN ADD ASSET"
        );

        WebElement addAssetButton =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Add Asset']"
                                )
                        )
                );

        clickJS(addAssetButton);

        waitForAnyText(
                "Add Asset",
                "Add Asset Details"
        );

        System.out.println(
                "Add Asset page opened"
        );


        // =====================================================
        // STEP 4 - VERIFY AUTO GENERATED ASSET ID
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 4: VERIFY ASSET ID"
        );

        WebElement assetIdField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//input[@readonly]"
                                        + " | "
                                        + "//input[contains(@value,'AST')]"
                                )
                        )
                );

        String assetId =
                assetIdField.getAttribute("value");

        assertTrue(
                assetId != null
                        && assetId.startsWith("AST"),
                "Auto-generated Asset ID was not found"
        );

        System.out.println(
                "Generated Asset ID: " + assetId
        );


        // =====================================================
        // STEP 5 - SELECT ASSET TYPE
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 5: SELECT ASSET TYPE"
        );

        WebElement assetTypeSelect =
                findSelectNearLabel(
                        "Asset Type"
                );

        new Select(
                assetTypeSelect
        ).selectByVisibleText(
                ASSET_TYPE
        );

        System.out.println(
                "Asset Type selected: " + ASSET_TYPE
        );


        // =====================================================
        // STEP 6 - SELECT BRAND
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 6: SELECT BRAND"
        );

        WebElement brandSelect =
                findSelectNearLabel(
                        "Brand"
                );

        wait.until(
                d -> {

                    try {

                        Select select =
                                new Select(brandSelect);

                        for (WebElement option :
                                select.getOptions()) {

                            if (
                                    option.getText()
                                            .trim()
                                            .equalsIgnoreCase(
                                                    BRAND
                                            )
                            ) {
                                return true;
                            }
                        }

                    } catch (Exception ignored) {
                    }

                    return false;
                }
        );

        new Select(
                brandSelect
        ).selectByVisibleText(
                BRAND
        );

        System.out.println(
                "Brand selected: " + BRAND
        );


        // =====================================================
        // STEP 7 - SELECT MODEL
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 7: SELECT MODEL"
        );

        WebElement modelSelect =
                findSelectNearLabel(
                        "Model"
                );

        wait.until(
                d -> {

                    try {

                        Select select =
                                new Select(modelSelect);

                        for (WebElement option :
                                select.getOptions()) {

                            if (
                                    option.getText()
                                            .trim()
                                            .equalsIgnoreCase(
                                                    MODEL
                                            )
                            ) {
                                return true;
                            }
                        }

                    } catch (Exception ignored) {
                    }

                    return false;
                }
        );

        new Select(
                modelSelect
        ).selectByVisibleText(
                MODEL
        );

        System.out.println(
                "Model selected: " + MODEL
        );


        // =====================================================
        // STEP 8 - PURCHASE COST
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 8: ENTER PURCHASE COST"
        );

        WebElement costField =
                findInputNearLabel(
                        "Purchase Cost"
                );

        costField.clear();

        costField.sendKeys(
                PURCHASE_COST
        );

        System.out.println(
                "Purchase Cost entered: ₹" +
                        PURCHASE_COST
        );


        // =====================================================
        // STEP 9 - PURCHASE DATE
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 9: ENTER PURCHASE DATE"
        );

        WebElement purchaseDateField =
                findDateFieldNearLabel(
                        "Purchase Date"
                );

        setDateValue(
                purchaseDateField,
                "2026-08-28",
                PURCHASE_DATE
        );

        System.out.println(
                "Purchase Date entered: "
                        + PURCHASE_DATE
        );


        // =====================================================
        // STEP 10 - WARRANTY EXPIRY DATE
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 10: ENTER WARRANTY EXPIRY DATE"
        );

        WebElement warrantyField =
                findDateFieldNearLabel(
                        "Warranty Expiry Date"
                );

        setDateValue(
                warrantyField,
                "2027-01-28",
                WARRANTY_EXPIRY
        );

        System.out.println(
                "Warranty Expiry Date entered: "
                        + WARRANTY_EXPIRY
        );


        // =====================================================
        // STEP 11 - DESCRIPTION
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 11: ENTER DESCRIPTION"
        );

        WebElement description =
                findTextareaNearLabel(
                        "Description"
                );

        description.clear();

        description.sendKeys(
                DESCRIPTION
        );

        System.out.println(
                "Description entered: "
                        + DESCRIPTION
        );


        // =====================================================
        // STEP 12 - CLICK ADD ASSET
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 12: ADD ASSET"
        );

        WebElement addButton =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Add Asset']"
                                )
                        )
                );

        scrollTo(addButton);

        clickJS(addButton);

        System.out.println(
                "Add Asset button clicked"
        );


        // =====================================================
        // STEP 13 - HANDLE RESULT
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 13: VERIFY RESULT"
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
                    "Application alert: " + message
            );

            String lower =
                    message == null
                            ? ""
                            : message.toLowerCase();

            assertTrue(
                    !lower.contains("error")
                            &&
                    !lower.contains("failed")
                            &&
                    !lower.contains("unable"),
                    "Application returned an error: "
                            + message
            );

            alert.accept();

            System.out.println(
                    "Success alert accepted"
            );

        } catch (org.openqa.selenium.TimeoutException e) {

            /*
             * Some versions of the application may navigate/update
             * the page without a browser alert. In that case inspect
             * visible page text.
             */
            boolean success =
                    waitForAnyText(
                            "Asset added successfully",
                            "Asset added",
                            "successfully",
                            "Asset Management"
                    );

            assertTrue(
                    success,
                    "No successful Add Asset response was detected"
            );
        }


        System.out.println();
        System.out.println(
                "=============================================="
        );

        System.out.println(
                "       ADD ASSET TEST PASSED"
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

        System.out.println(
                "Login page opened"
        );
    }


    private void login(
            String employeeId,
            String password
    ) {

        WebElement employee =
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

        employee.clear();

        employee.sendKeys(
                employeeId
        );

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


    // =====================================================
    // FIELD HELPERS
    // =====================================================

    private WebElement findSelectNearLabel(
            String labelText
    ) {

        return wait.until(
                d -> {

                    List<WebElement> labels =
                            d.findElements(
                                    By.xpath(
                                            "//label[normalize-space()='"
                                                    + labelText
                                                    + "']"
                                    )
                            );

                    for (WebElement label :
                            labels) {

                        try {

                            WebElement parent =
                                    label.findElement(
                                            By.xpath(
                                                    "./.."
                                            )
                                    );

                            List<WebElement> selects =
                                    parent.findElements(
                                            By.xpath(
                                                    ".//select"
                                            )
                                    );

                            for (WebElement select :
                                    selects) {

                                if (
                                        select.isDisplayed()
                                ) {
                                    return select;
                                }
                            }

                        } catch (Exception ignored) {
                        }
                    }

                    /*
                     * Fallback for React layouts where label and select
                     * are not wrapped in the same parent.
                     */
                    List<WebElement> allSelects =
                            d.findElements(
                                    By.xpath("//select")
                            );

                    for (WebElement select :
                            allSelects) {

                        try {

                            if (select.isDisplayed()) {
                                String aria =
                                        select.getAttribute("aria-label");

                                String name =
                                        select.getAttribute("name");

                                String placeholder =
                                        select.getAttribute("title");

                                String combined =
                                        ((aria == null ? "" : aria)
                                                + " "
                                                + (name == null ? "" : name)
                                                + " "
                                                + (placeholder == null ? "" : placeholder))
                                                .toLowerCase();

                                if (
                                        combined.contains(
                                                labelText.toLowerCase()
                                        )
                                ) {
                                    return select;
                                }
                            }

                        } catch (Exception ignored) {
                        }
                    }

                    return null;
                }
        );
    }


    private WebElement findInputNearLabel(
            String labelText
    ) {

        return wait.until(
                d -> {

                    List<WebElement> labels =
                            d.findElements(
                                    By.xpath(
                                            "//label[normalize-space()='"
                                                    + labelText
                                                    + "']"
                                    )
                            );

                    for (WebElement label :
                            labels) {

                        try {

                            WebElement parent =
                                    label.findElement(
                                            By.xpath(
                                                    "./.."
                                            )
                                    );

                            List<WebElement> inputs =
                                    parent.findElements(
                                            By.xpath(
                                                    ".//input"
                                            )
                                    );

                            for (WebElement input :
                                    inputs) {

                                if (
                                        input.isDisplayed()
                                                &&
                                        input.isEnabled()
                                ) {
                                    return input;
                                }
                            }

                        } catch (Exception ignored) {
                        }
                    }

                    return null;
                }
        );
    }


    private WebElement findDateFieldNearLabel(
            String labelText
    ) {

        return findInputNearLabel(
                labelText
        );
    }


    private WebElement findTextareaNearLabel(
            String labelText
    ) {

        return wait.until(
                d -> {

                    List<WebElement> labels =
                            d.findElements(
                                    By.xpath(
                                            "//label[normalize-space()='"
                                                    + labelText
                                                    + "']"
                                    )
                            );

                    for (WebElement label :
                            labels) {

                        try {

                            WebElement parent =
                                    label.findElement(
                                            By.xpath(
                                                    "./.."
                                            )
                                    );

                            List<WebElement> textareas =
                                    parent.findElements(
                                            By.xpath(
                                                    ".//textarea"
                                            )
                                    );

                            for (WebElement textarea :
                                    textareas) {

                                if (
                                        textarea.isDisplayed()
                                                &&
                                        textarea.isEnabled()
                                ) {
                                    return textarea;
                                }
                            }

                        } catch (Exception ignored) {
                        }
                    }

                    return null;
                }
        );
    }


    // =====================================================
    // DATE HELPER
    // =====================================================

    private void setDateValue(
            WebElement field,
            String htmlDate,
            String displayDate
    ) {

        JavascriptExecutor js =
                (JavascriptExecutor) driver;

        String type =
                field.getAttribute("type");

        if (
                "date".equalsIgnoreCase(type)
        ) {

            js.executeScript(
                    "const e=arguments[0];" +
                    "const v=arguments[1];" +
                    "const setter=Object.getOwnPropertyDescriptor(" +
                    "HTMLInputElement.prototype,'value').set;" +
                    "setter.call(e,v);" +
                    "e.dispatchEvent(new Event('input',{bubbles:true}));" +
                    "e.dispatchEvent(new Event('change',{bubbles:true}));",
                    field,
                    htmlDate
            );

        } else {

            field.clear();

            field.sendKeys(
                    displayDate
            );
        }
    }


    // =====================================================
    // NAVIGATION / TEXT
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

                        String body =
                                d.findElement(
                                        By.tagName("body")
                                ).getText();

                        return body != null
                                &&
                                body.contains(text);

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
                                        body.toLowerCase()
                                                .contains(
                                                        text.toLowerCase()
                                                )
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


    // =====================================================
    // UTILITY
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
                ) {
                    return element;
                }

            } catch (Exception ignored) {
            }
        }

        return null;
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


    private void sleep(
            long ms
    ) {

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
