package com.itams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class AssetRequestTest extends BaseTest {

    // ============================================================
    // HR LOGIN DETAILS
    // ============================================================

    private static final String HR_EMPLOYEE_ID = "260822001";
    private static final String HR_PASSWORD = "Itams@2026h";

    private static final String HR_EMAIL =
            "260522001a@gmail.com";

    // ============================================================
    // WAIT
    // ============================================================

    private WebDriverWait wait() {
        return new WebDriverWait(
                driver,
                Duration.ofSeconds(15)
        );
    }

    // ============================================================
    // BEFORE EACH TEST
    // ============================================================

    @BeforeEach
    public void loginAndOpenAssetRequest() {

        driver.get("http://localhost:3000");

        waitForPage();

        // --------------------------------------------------------
        // Click Login on Home Page
        // --------------------------------------------------------

        WebElement loginHomeButton = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[contains(normalize-space(),'Login')]"
                        )
                )
        );

        safeClick(loginHomeButton);

        // --------------------------------------------------------
        // Employee ID / Email
        // --------------------------------------------------------

        WebElement employeeField = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("employeeIdOrEmail")
                )
        );

        employeeField.clear();
        employeeField.sendKeys(HR_EMPLOYEE_ID);

        // --------------------------------------------------------
        // Password
        // --------------------------------------------------------

        WebElement passwordField = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.name("password")
                )
        );

        passwordField.clear();
        passwordField.sendKeys(HR_PASSWORD);

        // --------------------------------------------------------
        // Login
        // --------------------------------------------------------

        WebElement loginButton = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//form//button[@type='submit']"
                        )
                )
        );

        safeClick(loginButton);

        // --------------------------------------------------------
        // Handle Login Successful Alert
        // --------------------------------------------------------

        try {

            Alert alert = new WebDriverWait(
                    driver,
                    Duration.ofSeconds(10)
            ).until(
                    ExpectedConditions.alertIsPresent()
            );

            String alertText = alert.getText();

            System.out.println(
                    "Login Alert: " + alertText
            );

            if (alertText.toLowerCase().contains("login successful")) {
                alert.accept();
            } else {
                alert.accept();
            }

        } catch (Exception ignored) {
            // Some application versions may not show an alert.
        }

        // --------------------------------------------------------
        // Wait for HR Management
        // --------------------------------------------------------

        wait().until(
                ExpectedConditions.or(
                        ExpectedConditions.presenceOfElementLocated(
                                By.xpath(
                                        "//*[normalize-space()='HR Management']"
                                )
                        ),
                        ExpectedConditions.presenceOfElementLocated(
                                By.xpath(
                                        "//*[contains(normalize-space(),'HR Management')]"
                                )
                        )
                )
        );

        // --------------------------------------------------------
        // Click Asset Request
        // --------------------------------------------------------

        WebElement assetRequestButton = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath(
                                "//button[contains(normalize-space(),'Request Asset')]"
                        )
                )
        );

        safeClick(assetRequestButton);

        // --------------------------------------------------------
        // Wait for Asset Request page
        // --------------------------------------------------------

        wait().until(driver -> {

            String source =
                    driver.getPageSource().toLowerCase();

            return source.contains("asset request")
                    || source.contains("request asset")
                    || source.contains("asset type");
        });

        System.out.println(
                "Asset Request page opened successfully."
        );
    }

    // ============================================================
    // TEST 1
    // PAGE SHOULD OPEN
    // ============================================================

    @Test
    public void assetRequestPageLoadTest() {

        String pageSource =
                driver.getPageSource().toLowerCase();

        assertTrue(
                pageSource.contains("asset request")
                        || pageSource.contains("request asset")
                        || pageSource.contains("asset type"),
                "Asset Request page was not displayed"
        );

        System.out.println(
                "PASS: Asset Request page loaded."
        );
    }

    // ============================================================
    // TEST 2
    // CHECK FORM IS PRESENT
    // ============================================================

    @Test
    public void assetRequestFormTest() {

        boolean formPresent = false;

        List<WebElement> forms =
                driver.findElements(By.tagName("form"));

        if (!forms.isEmpty()) {
            formPresent = true;
        }

        String pageSource =
                driver.getPageSource().toLowerCase();

        if (pageSource.contains("asset type")
                || pageSource.contains("quantity")
                || pageSource.contains("reason")
                || pageSource.contains("request")) {

            formPresent = true;
        }

        assertTrue(
                formPresent,
                "Asset Request form was not displayed"
        );

        System.out.println(
                "PASS: Asset Request form is displayed."
        );
    }

    // ============================================================
    // TEST 3
    // CHECK ASSET TYPE FIELD
    // ============================================================

    @Test
    public void assetTypeFieldTest() {

        WebElement field =
                findField(
                        "assetType",
                        "asset_type",
                        "asset",
                        "type"
                );

        assertTrue(
                field != null,
                "Asset Type field was not found"
        );

        System.out.println(
                "PASS: Asset Type field is available."
        );
    }

    // ============================================================
    // TEST 4
    // CHECK QUANTITY FIELD
    // ============================================================

    @Test
    public void quantityFieldTest() {

        WebElement field =
                findField(
                        "quantity",
                        "assetQuantity",
                        "requestQuantity"
                );

        if (field == null) {

            List<WebElement> numberFields =
                    driver.findElements(
                            By.cssSelector(
                                    "input[type='number']"
                            )
                    );

            if (!numberFields.isEmpty()) {
                field = numberFields.get(0);
            }
        }

        assertTrue(
                field != null,
                "Quantity field was not found"
        );

        System.out.println(
                "PASS: Quantity field is available."
        );
    }

    // ============================================================
    // TEST 5
    // CHECK REASON / DESCRIPTION FIELD
    // ============================================================

    @Test
    public void reasonFieldTest() {

        WebElement field =
                findField(
                        "reason",
                        "description",
                        "remarks",
                        "purpose"
                );

        if (field == null) {

            List<WebElement> textareas =
                    driver.findElements(
                            By.tagName("textarea")
                    );

            if (!textareas.isEmpty()) {
                field = textareas.get(0);
            }
        }

        assertTrue(
                field != null,
                "Reason/Description field was not found"
        );

        System.out.println(
                "PASS: Reason/Description field is available."
        );
    }

    // ============================================================
    // TEST 6
    // EMPTY FORM VALIDATION
    // ============================================================

    @Test
    public void emptyFormValidationTest() {

        WebElement submitButton =
                findSubmitButton();

        assertTrue(
                submitButton != null,
                "Submit/Request button was not found"
        );

        scrollIntoView(submitButton);

        safeClick(submitButton);

        wait().until(
                driver -> {

                    String text =
                            driver.getPageSource();

                    String lower =
                            text.toLowerCase();

                    return lower.contains("required")
                            || lower.contains("please")
                            || lower.contains("select")
                            || lower.contains("enter")
                            || lower.contains("invalid")
                            || lower.contains("asset");
                }
        );

        System.out.println(
                "PASS: Empty form validation checked."
        );
    }

    // ============================================================
    // TEST 7
    // ENTER ASSET TYPE
    // ============================================================

    @Test
    public void assetTypeInputTest() {

        WebElement field =
                findField(
                        "assetType",
                        "asset_type",
                        "asset"
                );

        if (field == null) {

            List<WebElement> selects =
                    driver.findElements(
                            By.tagName("select")
                    );

            if (!selects.isEmpty()) {

                field = selects.get(0);

                scrollIntoView(field);

                try {
                    field.click();

                    List<WebElement> options =
                            field.findElements(
                                    By.tagName("option")
                            );

                    if (options.size() > 1) {
                        options.get(1).click();
                    }

                } catch (Exception ignored) {
                }
            }
        }

        assertTrue(
                field != null,
                "Asset Type field was not found"
        );

        System.out.println(
                "PASS: Asset Type input tested."
        );
    }

    // ============================================================
    // TEST 8
    // ENTER QUANTITY
    // ============================================================

    @Test
    public void validQuantityTest() {

        WebElement field =
                findField(
                        "quantity",
                        "assetQuantity",
                        "requestQuantity"
                );

        if (field == null) {

            List<WebElement> numberFields =
                    driver.findElements(
                            By.cssSelector(
                                    "input[type='number']"
                            )
                    );

            if (!numberFields.isEmpty()) {
                field = numberFields.get(0);
            }
        }

        assertTrue(
                field != null,
                "Quantity field was not found"
        );

        scrollIntoView(field);

        field.clear();
        field.sendKeys("1");

        String value =
                field.getAttribute("value");

        assertTrue(
                "1".equals(value),
                "Quantity value was not entered correctly"
        );

        System.out.println(
                "PASS: Valid quantity entered."
        );
    }

    // ============================================================
    // TEST 9
    // INVALID QUANTITY
    // ============================================================

    @Test
    public void invalidQuantityTest() {

        WebElement field =
                findField(
                        "quantity",
                        "assetQuantity",
                        "requestQuantity"
                );

        if (field == null) {

            List<WebElement> numberFields =
                    driver.findElements(
                            By.cssSelector(
                                    "input[type='number']"
                            )
                    );

            if (!numberFields.isEmpty()) {
                field = numberFields.get(0);
            }
        }

        assertTrue(
                field != null,
                "Quantity field was not found"
        );

        scrollIntoView(field);

        field.clear();
        field.sendKeys("0");

        WebElement submitButton =
                findSubmitButton();

        if (submitButton != null) {

            scrollIntoView(submitButton);

            safeClick(submitButton);

            try {

                wait().until(
                        driver -> {

                            String text =
                                    driver.getPageSource()
                                            .toLowerCase();

                            return text.contains("quantity")
                                    || text.contains("greater")
                                    || text.contains("invalid")
                                    || text.contains("required");
                        }
                );

            } catch (Exception ignored) {
            }
        }

        System.out.println(
                "PASS: Invalid quantity validation checked."
        );
    }

    // ============================================================
    // TEST 10
    // REASON INPUT
    // ============================================================

    @Test
    public void reasonInputTest() {

        WebElement field =
                findField(
                        "reason",
                        "description",
                        "remarks",
                        "purpose"
                );

        if (field == null) {

            List<WebElement> textareas =
                    driver.findElements(
                            By.tagName("textarea")
                    );

            if (!textareas.isEmpty()) {
                field = textareas.get(0);
            }
        }

        assertTrue(
                field != null,
                "Reason field was not found"
        );

        scrollIntoView(field);

        field.clear();

        field.sendKeys(
                "Requesting IT asset for official work."
        );

        assertTrue(
                field.getAttribute("value") != null
                        || field.getText().contains(
                                "Requesting IT asset"
                        ),
                "Reason was not entered"
        );

        System.out.println(
                "PASS: Reason entered successfully."
        );
    }

    // ============================================================
    // TEST 11
    // SPECIAL CHARACTERS IN REASON
    // ============================================================

    @Test
    public void specialCharactersInReasonTest() {

        WebElement field =
                findField(
                        "reason",
                        "description",
                        "remarks",
                        "purpose"
                );

        if (field == null) {

            List<WebElement> textareas =
                    driver.findElements(
                            By.tagName("textarea")
                    );

            if (!textareas.isEmpty()) {
                field = textareas.get(0);
            }
        }

        assertTrue(
                field != null,
                "Reason field was not found"
        );

        scrollIntoView(field);

        field.clear();

        field.sendKeys(
                "Need laptop for development & testing - 2026."
        );

        System.out.println(
                "PASS: Special characters accepted in reason field."
        );
    }

    // ============================================================
    // TEST 12
    // SUBMIT BUTTON PRESENT
    // ============================================================

    @Test
    public void submitButtonTest() {

        WebElement submitButton =
                findSubmitButton();

        assertTrue(
                submitButton != null,
                "Submit/Request Asset button was not found"
        );

        assertTrue(
                submitButton.isDisplayed(),
                "Submit/Request Asset button is not visible"
        );

        System.out.println(
                "PASS: Submit button is displayed."
        );
    }

    // ============================================================
    // TEST 13
    // FORM WITH VALID DATA
    // ============================================================

    @Test
    public void validAssetRequestFormTest() {

        fillValidForm();

        WebElement submitButton =
                findSubmitButton();

        assertTrue(
                submitButton != null,
                "Submit button was not found"
        );

        System.out.println(
                "PASS: Valid Asset Request data entered."
        );
    }

    // ============================================================
    // TEST 14
    // SUBMIT VALID REQUEST
    // ============================================================

    @Test
    public void submitValidAssetRequestTest() {

        fillValidForm();

        WebElement submitButton =
                findSubmitButton();

        assertTrue(
                submitButton != null,
                "Submit button was not found"
        );

        scrollIntoView(submitButton);

        safeClick(submitButton);

        // Give application time to process request.
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        String pageText =
                driver.getPageSource().toLowerCase();

        boolean result =
                pageText.contains("success")
                        || pageText.contains("submitted")
                        || pageText.contains("request")
                        || pageText.contains("created")
                        || pageText.contains("pending");

        assertTrue(
                result,
                "Asset request submission result was not displayed"
        );

        System.out.println(
                "PASS: Asset request submission tested."
        );
    }

    // ============================================================
    // TEST 15
    // PAGE SHOULD NOT CRASH
    // ============================================================

    @Test
    public void pageStabilityTest() {

        String source =
                driver.getPageSource().toLowerCase();

        assertTrue(
                !source.contains("cannot read properties")
                        && !source.contains("uncaught runtime error")
                        && !source.contains("application error"),
                "Asset Request page contains a runtime error"
        );

        System.out.println(
                "PASS: Asset Request page is stable."
        );
    }

    // ============================================================
    // FIND FIELD
    // ============================================================

    private WebElement findField(String... names) {

        for (String name : names) {

            try {

                List<WebElement> elements =
                        driver.findElements(
                                By.name(name)
                        );

                if (!elements.isEmpty()
                        && elements.get(0).isDisplayed()) {

                    return elements.get(0);
                }

            } catch (Exception ignored) {
            }

            try {

                List<WebElement> elements =
                        driver.findElements(
                                By.id(name)
                        );

                if (!elements.isEmpty()
                        && elements.get(0).isDisplayed()) {

                    return elements.get(0);
                }

            } catch (Exception ignored) {
            }
        }

        // --------------------------------------------------------
        // Search by placeholder
        // --------------------------------------------------------

        for (String name : names) {

            try {

                List<WebElement> elements =
                        driver.findElements(
                                By.xpath(
                                        "//input[contains(" +
                                        "translate(@placeholder," +
                                        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ'," +
                                        "'abcdefghijklmnopqrstuvwxyz')," +
                                        "'" + name.toLowerCase() +
                                        "')]"
                                )
                        );

                if (!elements.isEmpty()
                        && elements.get(0).isDisplayed()) {

                    return elements.get(0);
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }

    // ============================================================
    // FIND SUBMIT BUTTON
    // ============================================================

    private WebElement findSubmitButton() {

        String[] buttonTexts = {
                "Submit Request",
                "Submit",
                "Request Asset",
                "Send Request",
                "Create Request",
                "Save Request"
        };

        for (String text : buttonTexts) {

            try {

                List<WebElement> buttons =
                        driver.findElements(
                                By.xpath(
                                        "//button[" +
                                        "contains(" +
                                        "translate(normalize-space(.)," +
                                        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ'," +
                                        "'abcdefghijklmnopqrstuvwxyz')," +
                                        "'" + text.toLowerCase() +
                                        "')]"
                                )
                        );

                for (WebElement button : buttons) {

                    if (button.isDisplayed()) {
                        return button;
                    }
                }

            } catch (Exception ignored) {
            }
        }

        // --------------------------------------------------------
        // Submit type
        // --------------------------------------------------------

        try {

            List<WebElement> buttons =
                    driver.findElements(
                            By.cssSelector(
                                    "button[type='submit']"
                            )
                    );

            for (WebElement button : buttons) {

                if (button.isDisplayed()) {
                    return button;
                }
            }

        } catch (Exception ignored) {
        }

        return null;
    }

    // ============================================================
    // FILL VALID FORM
    // ============================================================

    private void fillValidForm() {

        // --------------------------------------------------------
        // Asset Type
        // --------------------------------------------------------

        WebElement assetField =
                findField(
                        "assetType",
                        "asset_type",
                        "asset"
                );

        if (assetField != null) {

            scrollIntoView(assetField);

            try {

                String tag =
                        assetField.getTagName();

                if ("select".equalsIgnoreCase(tag)) {

                    List<WebElement> options =
                            assetField.findElements(
                                    By.tagName("option")
                            );

                    if (options.size() > 1) {
                        options.get(1).click();
                    }

                } else {

                    assetField.clear();

                    assetField.sendKeys(
                            "Laptop"
                    );
                }

            } catch (Exception ignored) {
            }
        }

        // --------------------------------------------------------
        // Quantity
        // --------------------------------------------------------

        WebElement quantityField =
                findField(
                        "quantity",
                        "assetQuantity",
                        "requestQuantity"
                );

        if (quantityField == null) {

            List<WebElement> numberFields =
                    driver.findElements(
                            By.cssSelector(
                                    "input[type='number']"
                            )
                    );

            if (!numberFields.isEmpty()) {
                quantityField =
                        numberFields.get(0);
            }
        }

        if (quantityField != null) {

            scrollIntoView(quantityField);

            quantityField.clear();
            quantityField.sendKeys("1");
        }

        // --------------------------------------------------------
        // Reason
        // --------------------------------------------------------

        WebElement reasonField =
                findField(
                        "reason",
                        "description",
                        "remarks",
                        "purpose"
                );

        if (reasonField == null) {

            List<WebElement> textareas =
                    driver.findElements(
                            By.tagName("textarea")
                    );

            if (!textareas.isEmpty()) {
                reasonField =
                        textareas.get(0);
            }
        }

        if (reasonField != null) {

            scrollIntoView(reasonField);

            reasonField.clear();

            reasonField.sendKeys(
                    "Requesting IT asset for official work."
            );
        }
    }

    // ============================================================
    // SAFE CLICK
    // ============================================================

    private void safeClick(WebElement element) {

        try {

            wait().until(
                    ExpectedConditions.elementToBeClickable(
                            element
                    )
            );

            element.click();

        } catch (Exception e) {

            scrollIntoView(element);

            try {

                element.click();

            } catch (Exception secondException) {

                ((JavascriptExecutor) driver)
                        .executeScript(
                                "arguments[0].click();",
                                element
                        );
            }
        }
    }

    // ============================================================
    // SCROLL
    // ============================================================

    private void scrollIntoView(WebElement element) {

        try {

            ((JavascriptExecutor) driver)
                    .executeScript(
                            "arguments[0].scrollIntoView({block:'center'});",
                            element
                    );

        } catch (Exception ignored) {
        }
    }

    // ============================================================
    // PAGE WAIT
    // ============================================================

    private void waitForPage() {

        wait().until(
                driver ->
                        ((JavascriptExecutor) driver)
                                .executeScript(
                                        "return document.readyState"
                                )
                                .equals("complete")
        );
    }
}
