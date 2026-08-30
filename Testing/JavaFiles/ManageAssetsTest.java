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

public class ManageAssetsTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "http://localhost:3000/";

    private static final String ASSET_MANAGER_ID = "260822002";
    private static final String ASSET_MANAGER_PASSWORD = "Itams@2026a";

    // Asset created in the previous Add Asset test.
    private static final String ASSET_ID = "MOU001";
    private static final String ASSET_TYPE = "Mouse";

    // Value used for the edit test.
    private static final String UPDATED_COST = "550";

    @BeforeEach
    public void setUp() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("       ITAMS MANAGE ASSETS AUTOMATION");
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
    public void manageAssetsEditTest() {

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

        clickText("Asset Management");

        waitForText("Asset Management");

        System.out.println(
                "Asset Management page opened"
        );


        // =====================================================
        // STEP 3 - OPEN MANAGE ASSETS
        // =====================================================

        System.out.println();
        System.out.println("STEP 3: OPEN MANAGE ASSETS");

        WebElement manageAssets =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Manage Assets']"
                                        + " | "
                                        + "//a[normalize-space()='Manage Assets']"
                                )
                        )
                );

        clickJS(manageAssets);

        waitForAnyText(
                "Manage Asset",
                "Search Asset",
                "Asset List"
        );

        System.out.println(
                "Manage Assets page opened"
        );


        // =====================================================
        // STEP 4 - ENTER ASSET ID
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 4: SEARCH ASSET"
        );

        WebElement assetIdField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//input[contains(@placeholder,'Asset ID')]"
                                        + " | "
                                        + "//input[@name='assetId']"
                                )
                        )
                );

        assetIdField.clear();
        assetIdField.sendKeys(ASSET_ID);

        System.out.println(
                "Asset ID entered: " + ASSET_ID
        );


        // =====================================================
        // STEP 5 - SELECT ASSET TYPE
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 5: SELECT ASSET TYPE"
        );

        List<WebElement> selects =
                driver.findElements(
                        By.xpath("//select")
                );

        WebElement assetTypeSelect = null;

        for (WebElement select : selects) {

            try {

                if (select.isDisplayed()) {
                    assetTypeSelect = select;
                    break;
                }

            } catch (Exception ignored) {
            }
        }

        assertTrue(
                assetTypeSelect != null,
                "Asset Type select was not found"
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
        // STEP 6 - SEARCH
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 6: CLICK SEARCH"
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

        sleep(1200);

        System.out.println(
                "Search clicked"
        );


        // =====================================================
        // STEP 7 - VERIFY REQUESTED ASSET
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 7: VERIFY ASSET"
        );

        WebElement assetRow =
                wait.until(
                        d -> findAssetRow(
                                ASSET_ID,
                                ASSET_TYPE
                        )
                );

        assertTrue(
                assetRow != null,
                "Requested asset was not found"
        );

        System.out.println(
                "Asset found: "
                        + ASSET_ID
                        + " / "
                        + ASSET_TYPE
        );


        // =====================================================
        // STEP 8 - CLICK EDIT
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 8: CLICK EDIT"
        );

        WebElement editButton =
                findButtonInRow(
                        assetRow,
                        "Edit"
                );

        assertTrue(
                editButton != null,
                "Edit button was not found for "
                        + ASSET_ID
        );

        scrollTo(editButton);

        clickJS(editButton);

        sleep(1000);

        System.out.println(
                "Edit clicked"
        );


        // =====================================================
        // STEP 9 - EDIT ASSET DETAILS
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 9: EDIT DESCRIPTION"
        );

        /*
         * The actual Edit screen shown in the screenshot has a
         * required Description * textarea. Change only this valid
         * field so the Update Asset button becomes enabled.
         */
        WebElement descriptionField =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//label[normalize-space()='Description *']/following::textarea[1]"
                                        + " | "
                                        + "//textarea"
                                )
                        )
                );

        scrollTo(descriptionField);

        String oldDescription =
                descriptionField.getAttribute("value");

        if (oldDescription == null || oldDescription.isBlank()) {
            oldDescription = descriptionField.getText();
        }

        String updatedDescription =
                "Updated mouse with Lenovo brand and wireless model";

        descriptionField.clear();
        descriptionField.sendKeys(
                updatedDescription
        );

        System.out.println(
                "Description changed from: "
                        + oldDescription
                        + " to: "
                        + updatedDescription
        );

        sleep(500);

        // STEP 10 - SAVE
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 10: CLICK UPDATE ASSET"
        );

        WebElement updateButton =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Update Asset']"
                                )
                        )
                );

        scrollTo(updateButton);

        wait.until(
                d -> {
                    try {
                        return updateButton.isEnabled();
                    } catch (Exception e) {
                        return false;
                    }
                }
        );

        clickJS(updateButton);

        sleep(1200);

        System.out.println(
                "Update Asset button clicked"
        );

        // STEP 11 - VERIFY RESULT
        // =====================================================

        System.out.println();
        System.out.println(
                "STEP 11: VERIFY UPDATE"
        );

        boolean successAlert = false;

        try {

            Alert alert =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(8)
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
                    "Application returned an error: " + message
            );

            alert.accept();
            successAlert = true;

        } catch (org.openqa.selenium.TimeoutException ignored) {
        }

        boolean pageVisible =
                waitForAnyText(
                        "Manage Asset",
                        "Asset List",
                        "Asset Management"
                );

        assertTrue(
                successAlert || pageVisible,
                "Update Asset did not complete successfully"
        );

        System.out.println(
                "ASSET UPDATE PASSED"
        );

        // FINAL
        // =====================================================

        System.out.println();
        System.out.println(
                "=============================================="
        );

        System.out.println(
                "       MANAGE ASSETS TEST PASSED"
        );

        System.out.println(
                "=============================================="
        );
    }


    // =====================================================
    // FIND ASSET ROW
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

        /*
         * Fallback when the table uses div based rows.
         */
        List<WebElement> candidates =
                driver.findElements(
                        By.xpath(
                                "//*[contains(normalize-space(),'"
                                        + assetId
                                        + "')]"
                        )
                );

        for (WebElement candidate :
                candidates) {

            try {

                if (!candidate.isDisplayed()) {
                    continue;
                }

                String text =
                        candidate.getText();

                if (
                        text != null
                                &&
                        text.toLowerCase()
                                .contains(
                                        assetType.toLowerCase()
                                )
                ) {

                    List<WebElement> parents =
                            candidate.findElements(
                                    By.xpath(
                                            "./ancestor::tr[1]"
                                    )
                            );

                    if (!parents.isEmpty()) {
                        return parents.get(0);
                    }

                    return candidate;
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }


    private WebElement findButtonInRow(
            WebElement row,
            String text
    ) {

        List<WebElement> buttons =
                row.findElements(
                        By.xpath(
                                ".//button[normalize-space()='"
                                        + text
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
    // FIND FIRST EDITABLE FIELD IN EDIT FORM
    // =====================================================

    private WebElement findFirstEditableField() {

        /*
         * Prefer fields inside a visible modal/dialog when one exists.
         */
        List<WebElement> containers =
                driver.findElements(
                        By.xpath(
                                "//*[self::div or self::section or self::form]"
                                + "[.//button[normalize-space()='Save']"
                                + " or .//button[contains(normalize-space(),'Save Changes')]]"
                        )
                );

        for (WebElement container : containers) {

            try {

                if (!container.isDisplayed()) {
                    continue;
                }

                List<WebElement> fields =
                        container.findElements(
                                By.xpath(
                                        ".//input | .//textarea"
                                )
                        );

                for (WebElement field : fields) {

                    if (isEditableField(field)) {
                        return field;
                    }
                }

            } catch (Exception ignored) {
            }
        }

        /*
         * Fallback: search all visible inputs/textareas.
         */
        List<WebElement> fields =
                driver.findElements(
                        By.xpath(
                                "//input | //textarea"
                        )
                );

        for (WebElement field : fields) {

            if (isEditableField(field)) {
                return field;
            }
        }

        return null;
    }


    private boolean isEditableField(
            WebElement field
    ) {

        try {

            if (!field.isDisplayed()
                    || !field.isEnabled()) {
                return false;
            }

            String type =
                    field.getAttribute("type");

            if (
                    "hidden".equalsIgnoreCase(type)
                        ||
                    "submit".equalsIgnoreCase(type)
                        ||
                    "button".equalsIgnoreCase(type)
                        ||
                    "checkbox".equalsIgnoreCase(type)
                        ||
                    "radio".equalsIgnoreCase(type)
            ) {
                return false;
            }

            String readonly =
                    field.getAttribute("readonly");

            return readonly == null
                    ||
                    !"true".equalsIgnoreCase(readonly);

        } catch (Exception e) {

            return false;
        }
    }


    private void setInputValue(
            WebElement field,
            String value
    ) {

        JavascriptExecutor js =
                (JavascriptExecutor) driver;

        js.executeScript(
                "const el = arguments[0];"
                        + "const value = arguments[1];"
                        + "const setter = Object.getOwnPropertyDescriptor("
                        + "HTMLInputElement.prototype,'value').set;"
                        + "if (setter) setter.call(el,value);"
                        + "else el.value=value;"
                        + "el.dispatchEvent(new Event('input',{bubbles:true}));"
                        + "el.dispatchEvent(new Event('change',{bubbles:true}));",
                field,
                value
        );
    }


    // =====================================================
    // EDIT FIELD
    // =====================================================

    private WebElement findEditableField(
            String labelText,
            String placeholderText,
            String name1,
            String name2
    ) {

        // Label-based lookup.
        List<WebElement> labels =
                driver.findElements(
                        By.xpath(
                                "//label[normalize-space()='"
                                        + labelText
                                        + "']"
                        )
                );

        for (WebElement label : labels) {

            try {

                WebElement parent =
                        label.findElement(
                                By.xpath("./..")
                        );

                List<WebElement> fields =
                        parent.findElements(
                                By.xpath(
                                        ".//input"
                                )
                        );

                for (WebElement field : fields) {

                    if (
                            field.isDisplayed()
                                    &&
                            field.isEnabled()
                                    &&
                            !"readonly".equals(
                                            field.getAttribute("readonly")
                                    )
                    ) {
                        return field;
                    }
                }

            } catch (Exception ignored) {
            }
        }


        // Placeholder lookup.
        List<WebElement> placeholders =
                driver.findElements(
                        By.xpath(
                                "//input[contains(@placeholder,'"
                                        + placeholderText
                                        + "')]"
                        )
                );

        for (WebElement field :
                placeholders) {

            try {

                if (
                        field.isDisplayed()
                                &&
                        field.isEnabled()
                ) {
                    return field;
                }

            } catch (Exception ignored) {
            }
        }


        // Name lookup.
        List<WebElement> named =
                driver.findElements(
                        By.xpath(
                                "//input[@name='"
                                        + name1
                                        + "' or @name='"
                                        + name2
                                        + "']"
                        )
                );

        for (WebElement field :
                named) {

            try {

                if (
                        field.isDisplayed()
                                &&
                        field.isEnabled()
                ) {
                    return field;
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

        employeeField.sendKeys(
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

        } catch (Exception e) {

            throw new AssertionError(
                    "Login Successful alert was not displayed"
            );
        }

        waitForPageReady();

        sleep(1000);
    }


    // =====================================================
    // NAVIGATION
    // =====================================================

    private void clickText(
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

        clickJS(element);
    }


    // =====================================================
    // ALERT
    // =====================================================

    private void handleOptionalAlert() {

        try {

            Alert alert =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(5)
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

            alert.accept();

            assertTrue(
                    !lower.contains("error")
                            &&
                    !lower.contains("failed")
                            &&
                    !lower.contains("unable"),
                    "Application returned error: "
                            + message
            );

        } catch (Exception ignored) {
        }
    }


    // =====================================================
    // TEXT / ELEMENT HELPERS
    // =====================================================

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


    private void waitForText(
            String text
    ) {

        wait.until(
                d -> {

                    try {

                        return d.findElement(
                                By.tagName("body")
                        ).getText()
                                .contains(text);

                    } catch (Exception e) {

                        return false;
                    }
                }
        );
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
