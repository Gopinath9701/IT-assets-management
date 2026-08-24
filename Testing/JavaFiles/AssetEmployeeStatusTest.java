package com.itams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class EmployeeStatusTest extends BaseTest {

    private static final String BASE_URL = "http://localhost:3000";

    // HR LOGIN
    private static final String HR_ID = "260822001";
    private static final String HR_PASSWORD = "Itams@2026h";

    private static final Duration WAIT =
            Duration.ofSeconds(15);

    private WebDriverWait wait() {
        return new WebDriverWait(driver, WAIT);
    }

    // =========================================================
    // LOGIN + OPEN EMPLOYEE STATUS BEFORE EACH TEST
    // =========================================================

    @BeforeEach
    public void loginAndOpenEmployeeStatus() {

        driver.get(BASE_URL);

        waitForPageLoad();

        loginAsHR();

        openEmployeeStatus();

        waitForEmployeeStatusPage();
    }

    // =========================================================
    // HR LOGIN
    // =========================================================

    private void loginAsHR() {

        WebElement idField = findFirstVisible(
                By.name("employeeIdOrEmail"),
                By.name("employeeId"),
                By.cssSelector("input[type='text']")
        );

        assertNotNull(
                idField,
                "Login Employee ID field not found"
        );

        idField.clear();
        idField.sendKeys(HR_ID);

        WebElement passwordField = findFirstVisible(
                By.name("password"),
                By.cssSelector("input[type='password']")
        );

        assertNotNull(
                passwordField,
                "Login password field not found"
        );

        passwordField.clear();
        passwordField.sendKeys(HR_PASSWORD);

        WebElement loginButton = findFirstVisible(
                By.cssSelector("form button[type='submit']"),
                By.xpath("//button[normalize-space()='Login']"),
                By.xpath("//button[contains(normalize-space(),'Login')]")
        );

        assertNotNull(
                loginButton,
                "Login button not found"
        );

        safeClick(loginButton);

        // Handle Login Successful alert
        try {
            waitForAlert(5);
            driver.switchTo().alert().accept();
        } catch (Exception ignored) {
        }

        sleep(700);
    }

    // =========================================================
    // OPEN EMPLOYEE STATUS
    // =========================================================

    private void openEmployeeStatus() {

        if (isEmployeeStatusPage()) {
            return;
        }

        // Direct Employee Status
        WebElement employeeStatus = findFirstVisible(
                By.xpath(
                        "//*[normalize-space()='Employee Status']"
                ),
                By.xpath(
                        "//button[normalize-space()='Employee Status']"
                ),
                By.xpath(
                        "//div[normalize-space()='Employee Status']"
                )
        );

        if (employeeStatus != null) {

            safeClick(employeeStatus);

            if (waitForEmployeeStatusShort()) {
                return;
            }
        }

        // Try HR Management first
        WebElement hrManagement = findFirstVisible(
                By.xpath(
                        "//*[normalize-space()='HR Management']"
                ),
                By.xpath(
                        "//button[contains(normalize-space(),'HR Management')]"
                ),
                By.xpath(
                        "//div[contains(normalize-space(),'HR Management')]"
                )
        );

        if (hrManagement != null) {

            safeClick(hrManagement);

            sleep(700);

            WebElement status = findFirstVisible(
                    By.xpath(
                            "//*[normalize-space()='Employee Status']"
                    ),
                    By.xpath(
                            "//button[normalize-space()='Employee Status']"
                    ),
                    By.xpath(
                            "//div[normalize-space()='Employee Status']"
                    )
            );

            if (status != null) {
                safeClick(status);
            }
        }

        waitForEmployeeStatusPage();
    }

    // =========================================================
    // PAGE CHECK
    // =========================================================

    private boolean isEmployeeStatusPage() {

        try {

            return !driver.findElements(
                    By.cssSelector(".es-page-title")
            ).isEmpty();

        } catch (Exception e) {

            return false;
        }
    }

    // =========================================================
    // WAIT FOR EMPLOYEE STATUS PAGE
    // =========================================================

    private void waitForEmployeeStatusPage() {

        WebElement title = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-page-title")
                )
        );

        assertEquals(
                "Employee Status",
                title.getText().trim(),
                "Employee Status page was not opened"
        );
    }

    private boolean waitForEmployeeStatusShort() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(5)
            ).until(
                    ExpectedConditions.visibilityOfElementLocated(
                            By.cssSelector(".es-page-title")
                    )
            );

            return true;

        } catch (Exception e) {

            return false;
        }
    }

    // =========================================================
    // TEST 1 - PAGE TITLE
    // =========================================================

    @Test
    public void employeeStatusPageLoadTest() {

        WebElement title = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-page-title")
                )
        );

        assertTrue(title.isDisplayed());

        assertEquals(
                "Employee Status",
                title.getText().trim()
        );
    }

    // =========================================================
    // TEST 2 - PAGE SUBTITLE
    // =========================================================

    @Test
    public void pageSubtitleTest() {

        WebElement subtitle = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-page-sub")
                )
        );

        assertEquals(
                "View employee status.",
                subtitle.getText().trim()
        );
    }

    // =========================================================
    // TEST 3 - ITAMS LOGO
    // =========================================================

    @Test
    public void itamsLogoTest() {

        WebElement logo = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-nav-title")
                )
        );

        assertEquals(
                "ITAMS",
                logo.getText().trim()
        );
    }

    // =========================================================
    // TEST 4 - USERNAME
    // =========================================================

    @Test
    public void usernameDisplayTest() {

        WebElement username = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-nav-user")
                )
        );

        assertTrue(username.isDisplayed());

        assertFalse(
                username.getText().trim().isEmpty(),
                "Username is empty"
        );
    }

    // =========================================================
    // TEST 5 - SEARCH CARD
    // =========================================================

    @Test
    public void searchCardTest() {

        WebElement card = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-card")
                )
        );

        assertTrue(card.isDisplayed());

        assertTrue(
                card.getText().contains(
                        "Search Employee"
                )
        );
    }

    // =========================================================
    // TEST 6 - SEARCH INPUT
    // =========================================================

    @Test
    public void searchInputTest() {

        WebElement input = getSearchInput();

        assertTrue(input.isDisplayed());

        assertEquals(
                "Enter Employee ID or Employee Name",
                input.getAttribute("placeholder")
        );

        assertEquals(
                "9",
                input.getAttribute("maxlength")
        );
    }

    // =========================================================
    // TEST 7 - SEARCH BUTTON
    // =========================================================

    @Test
    public void searchButtonTest() {

        WebElement button = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-btn-primary")
                )
        );

        assertTrue(button.isDisplayed());

        assertEquals(
                "Search",
                button.getText().trim()
        );
    }

    // =========================================================
    // TEST 8 - EMPTY SEARCH VALIDATION
    // =========================================================

    @Test
    public void emptySearchValidationTest() {

        WebElement input = getSearchInput();

        input.clear();

        clickSearch();

        WebElement error = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-validation-error")
                )
        );

        assertEquals(
                "Please enter an Employee ID or Employee Name.",
                error.getText()
                        .replace("⚠️", "")
                        .trim()
        );
    }

    // =========================================================
    // TEST 9 - EMPLOYEE ID TOO SHORT
    // =========================================================

    @Test
    public void employeeIdTooShortTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("260822");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "Employee ID must be exactly 9 digits"
                ),
                "Employee ID length validation failed"
        );
    }

    // =========================================================
    // TEST 10 - EMPLOYEE ID TOO LONG
    // =========================================================

    @Test
    public void employeeIdMaximumLengthTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("260822001999");

        String value =
                input.getAttribute("value");

        assertEquals(
                9,
                value.length(),
                "Employee ID exceeded maximum length"
        );
    }

    // =========================================================
    // TEST 11 - EMPLOYEE ID NON-NUMERIC
    // =========================================================

    @Test
    public void employeeIdNonNumericTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("2608ABC01");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "Employee ID must contain only numbers"
                ),
                "Non-numeric Employee ID validation failed"
        );
    }

    // =========================================================
    // TEST 12 - INVALID MONTH
    // =========================================================

    @Test
    public void invalidEmployeeIdMonthTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("261322001");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "invalid month"
                ),
                "Invalid month validation failed"
        );
    }

    // =========================================================
    // TEST 13 - INVALID DAY
    // =========================================================

    @Test
    public void invalidEmployeeIdDayTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("260832001");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "invalid day"
                ),
                "Invalid day validation failed"
        );
    }

    // =========================================================
    // TEST 14 - INVALID CALENDAR DATE
    // =========================================================

    @Test
    public void invalidCalendarDateTest() {

        // February 31 is not a valid calendar date.
        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("260231001");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "invalid date"
                ),
                "Invalid calendar date validation failed"
        );
    }

    // =========================================================
    // TEST 15 - EMPLOYEE NUMBER 000
    // =========================================================

    @Test
    public void employeeNumberZeroTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("260822000");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "Employee number must be between 001 and 999"
                ),
                "Employee number validation failed"
        );
    }

    // =========================================================
    // TEST 16 - FUTURE DATE
    // =========================================================

    @Test
    public void futureEmployeeIdDateTest() {

        // 991231001 is definitely a future date
        // according to the YYMMDD format.
        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("991231001");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "Future dates are not allowed"
                ),
                "Future date validation failed"
        );
    }

    // =========================================================
    // TEST 17 - VALID HR EMPLOYEE ID
    // =========================================================

    @Test
    public void validEmployeeIdSearchTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys(HR_ID);

        clickSearch();

        sleep(500);

        String body = getBodyText();

        // If employee exists, it should be shown.
        // If not, application should show No employees found.
        assertTrue(
                body.contains(HR_ID)
                        || body.contains("No employees found."),
                "Employee ID search did not produce a valid result"
        );
    }

    // =========================================================
    // TEST 18 - VALID EXISTING EMPLOYEE ID FROM TABLE
    // =========================================================

    @Test
    public void existingEmployeeIdSearchTest() {

        waitForEmployeeTable();

        String employeeId =
                getFirstEmployeeId();

        if (employeeId == null) {
            return;
        }

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys(employeeId);

        clickSearch();

        waitForTableUpdate();

        assertTrue(
                getBodyText().contains(employeeId),
                "Existing employee ID was not displayed"
        );
    }

    // =========================================================
    // TEST 19 - NAME SEARCH
    // =========================================================

    @Test
    public void employeeNameSearchTest() {

        waitForEmployeeTable();

        String employeeName =
                getFirstEmployeeName();

        if (employeeName == null) {
            return;
        }

        WebElement input = getSearchInput();

        input.clear();

        // Search first 2+ characters.
        String searchName =
                employeeName.length() >= 2
                        ? employeeName.substring(0, 2)
                        : employeeName;

        input.sendKeys(searchName);

        clickSearch();

        waitForTableUpdate();

        String body = getBodyText();

        assertTrue(
                body.toLowerCase()
                        .contains(
                                searchName.toLowerCase()
                        )
                        || body.contains("No employees found."),
                "Employee name search failed"
        );
    }

    // =========================================================
    // TEST 20 - NAME SEARCH ONE CHARACTER
    // =========================================================

    @Test
    public void nameSearchMinimumLengthTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("A");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "Please enter at least 2 characters."
                ),
                "Minimum name length validation failed"
        );
    }

    // =========================================================
    // TEST 21 - NAME SEARCH WITH LEADING SPACE
    // =========================================================

    @Test
    public void nameLeadingSpaceValidationTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys(" Rahul");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "spaces before or after"
                ),
                "Leading space validation failed"
        );
    }

    // =========================================================
    // TEST 22 - NAME SEARCH WITH TRAILING SPACE
    // =========================================================

    @Test
    public void nameTrailingSpaceValidationTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("Rahul ");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "spaces before or after"
                ),
                "Trailing space validation failed"
        );
    }

    // =========================================================
    // TEST 23 - MULTIPLE SPACES IN NAME
    // =========================================================

    @Test
    public void multipleSpacesNameValidationTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("Rahul  Sharma");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "multiple spaces"
                ),
                "Multiple spaces validation failed"
        );
    }

    // =========================================================
    // TEST 24 - NAME WITH NUMBERS
    // =========================================================

    @Test
    public void nameWithNumbersValidationTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("Rahul123");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "only letters and single spaces"
                ),
                "Name numeric validation failed"
        );
    }

    // =========================================================
    // TEST 25 - NAME WITH SPECIAL CHARACTER
    // =========================================================

    @Test
    public void nameWithSpecialCharacterValidationTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("Rahul@");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "only letters and single spaces"
                ),
                "Special character name validation failed"
        );
    }

    // =========================================================
    // TEST 26 - ENTER KEY SEARCH
    // =========================================================

    @Test
    public void enterKeySearchTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys(HR_ID);

        input.sendKeys(Keys.ENTER);

        sleep(500);

        String body = getBodyText();

        assertFalse(
                body.contains(
                        "Please enter an Employee ID or Employee Name."
                ),
                "Enter key did not trigger search"
        );
    }

    // =========================================================
    // TEST 27 - SEARCH RESET AFTER INPUT CHANGE
    // =========================================================

    @Test
    public void searchInputChangeResetsValidationTest() {

        WebElement input = getSearchInput();

        input.clear();

        input.sendKeys("A");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "Please enter at least 2 characters."
                )
        );

        input.clear();

        input.sendKeys("Rahul");

        assertFalse(
                getBodyText().contains(
                        "Please enter at least 2 characters."
                ),
                "Validation error was not cleared after input change"
        );
    }

    // =========================================================
    // TEST 28 - EMPLOYEE TABLE
    // =========================================================

    @Test
    public void employeeTableTest() {

        waitForEmployeeTable();

        WebElement table = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-table")
                )
        );

        String text = table.getText();

        assertTrue(
                text.contains("Employee ID"),
                "Employee ID column missing"
        );

        assertTrue(
                text.contains("Employee Name"),
                "Employee Name column missing"
        );

        assertTrue(
                text.contains("Department"),
                "Department column missing"
        );

        assertTrue(
                text.contains("Status"),
                "Status column missing"
        );
    }

    // =========================================================
    // TEST 29 - EMPLOYEE TABLE HEADERS
    // =========================================================

    @Test
    public void employeeTableHeaderTest() {

        List<WebElement> headers =
                driver.findElements(
                        By.cssSelector(
                                ".es-table thead th"
                        )
                );

        assertEquals(
                4,
                headers.size(),
                "Expected 4 employee table columns"
        );
    }

    // =========================================================
    // TEST 30 - EMPLOYEE STATUS VALUES
    // =========================================================

    @Test
    public void employeeStatusValuesTest() {

        waitForEmployeeTable();

        List<WebElement> statuses =
                driver.findElements(
                        By.cssSelector(
                                ".es-status-badge"
                        )
                );

        for (WebElement status :
                statuses) {

            String value =
                    status.getText().trim();

            assertFalse(
                    value.isEmpty(),
                    "Employee status is empty"
            );
        }
    }

    // =========================================================
    // TEST 31 - PAGE SIZE DROPDOWN
    // =========================================================

    @Test
    public void pageSizeDropdownTest() {

        WebElement selectElement = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-page-size")
                )
        );

        Select select =
                new Select(selectElement);

        assertTrue(
                hasOption(select, "10")
        );

        assertTrue(
                hasOption(select, "30")
        );

        assertTrue(
                hasOption(select, "50")
        );

        assertTrue(
                hasOption(select, "All")
        );
    }

    // =========================================================
    // TEST 32 - PAGE SIZE CHANGE 30
    // =========================================================

    @Test
    public void pageSize30Test() {

        WebElement selectElement = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-page-size")
                )
        );

        Select select =
                new Select(selectElement);

        select.selectByVisibleText("30");

        assertEquals(
                "30",
                select.getFirstSelectedOption()
                        .getText()
                        .trim()
        );
    }

    // =========================================================
    // TEST 33 - PAGE SIZE CHANGE 50
    // =========================================================

    @Test
    public void pageSize50Test() {

        WebElement selectElement = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-page-size")
                )
        );

        Select select =
                new Select(selectElement);

        select.selectByVisibleText("50");

        assertEquals(
                "50",
                select.getFirstSelectedOption()
                        .getText()
                        .trim()
        );
    }

    // =========================================================
    // TEST 34 - PAGE SIZE ALL
    // =========================================================

    @Test
    public void pageSizeAllTest() {

        WebElement selectElement = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-page-size")
                )
        );

        Select select =
                new Select(selectElement);

        select.selectByVisibleText("All");

        assertEquals(
                "All",
                select.getFirstSelectedOption()
                        .getText()
                        .trim()
        );
    }

    // =========================================================
    // TEST 35 - PAGINATION INFORMATION
    // =========================================================

    @Test
    public void paginationInformationTest() {

        WebElement info = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-pagination-info")
                )
        );

        String text = info.getText();

        assertTrue(
                text.contains("Showing")
        );

        assertTrue(
                text.contains("employees")
        );
    }

    // =========================================================
    // TEST 36 - NO EMPLOYEE MESSAGE
    // =========================================================

    @Test
    public void noEmployeeMessageTest() {

        waitForEmployeeTable();

        List<WebElement> noData =
                driver.findElements(
                        By.cssSelector(".es-no-data")
                );

        if (!noData.isEmpty()) {

            assertEquals(
                    "No employees found.",
                    noData.get(0).getText().trim()
            );
        }
    }

    // =========================================================
    // TEST 37 - BACK BUTTON
    // =========================================================

    @Test
    public void backButtonTest() {

        WebElement back = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-back-btn")
                )
        );

        assertTrue(
                back.isDisplayed()
        );

        assertTrue(
                back.getText().contains("Back")
        );
    }

    // =========================================================
    // TEST 38 - LOGOUT BUTTON
    // =========================================================

    @Test
    public void logoutButtonTest() {

        WebElement logout = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-logout-btn")
                )
        );

        assertTrue(
                logout.isDisplayed()
        );

        assertEquals(
                "Logout",
                logout.getText().trim()
        );
    }

    // =========================================================
    // HELPERS
    // =========================================================

    private WebElement getSearchInput() {

        return wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-input")
                )
        );
    }

    // =========================================================

    private void clickSearch() {

        WebElement button = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(".es-btn-primary")
                )
        );

        safeClick(button);

        sleep(300);
    }

    // =========================================================

    private void waitForEmployeeTable() {

        wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".es-table")
                )
        );

        sleep(500);
    }

    // =========================================================

    private void waitForTableUpdate() {

        sleep(500);

        try {

            wait().until(
                    ExpectedConditions.visibilityOfElementLocated(
                            By.cssSelector(".es-table")
                    )
            );

        } catch (Exception ignored) {
        }
    }

    // =========================================================

    private String getFirstEmployeeId() {

        List<WebElement> ids =
                driver.findElements(
                        By.cssSelector(".es-employee-id")
                );

        for (WebElement element : ids) {

            try {

                String id =
                        element.getText().trim();

                if (!id.isEmpty()) {
                    return id;
                }

            } catch (StaleElementReferenceException ignored) {
            }
        }

        return null;
    }

    // =========================================================

    private String getFirstEmployeeName() {

        List<WebElement> rows =
                driver.findElements(
                        By.cssSelector(
                                ".es-table tbody tr"
                        )
                );

        for (WebElement row : rows) {

            try {

                List<WebElement> cells =
                        row.findElements(By.tagName("td"));

                if (cells.size() >= 2) {

                    String name =
                            cells.get(1)
                                    .getText()
                                    .trim();

                    if (!name.isEmpty()
                            && !name.equals(
                            "No employees found."
                    )) {
                        return name;
                    }
                }

            } catch (StaleElementReferenceException ignored) {
            }
        }

        return null;
    }

    // =========================================================

    private String getBodyText() {

        return driver.findElement(
                By.tagName("body")
        ).getText();
    }

    // =========================================================

    private WebElement findFirstVisible(
            By... locators
    ) {

        for (By locator : locators) {

            try {

                List<WebElement> elements =
                        driver.findElements(locator);

                for (WebElement element :
                        elements) {

                    try {

                        if (element.isDisplayed()) {
                            return element;
                        }

                    } catch (
                            StaleElementReferenceException ignored
                    ) {
                    }
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }

    // =========================================================

    private boolean hasOption(
            Select select,
            String value
    ) {

        for (WebElement option :
                select.getOptions()) {

            if (option.getText()
                    .trim()
                    .equals(value)) {

                return true;
            }
        }

        return false;
    }

    // =========================================================

    private void safeClick(
            WebElement element
    ) {

        try {

            scrollIntoView(element);

            wait().until(
                    ExpectedConditions.elementToBeClickable(
                            element
                    )
            );

            element.click();

        } catch (Exception e) {

            try {

                ((JavascriptExecutor) driver)
                        .executeScript(
                                "arguments[0].click();",
                                element
                        );

            } catch (Exception ignored) {
            }
        }
    }

    // =========================================================

    private void scrollIntoView(
            WebElement element
    ) {

        try {

            ((JavascriptExecutor) driver)
                    .executeScript(
                            "arguments[0].scrollIntoView({"
                                    + "block:'center',"
                                    + "inline:'center'"
                                    + "});",
                            element
                    );

        } catch (Exception ignored) {
        }
    }

    // =========================================================

    private void waitForPageLoad() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(15)
            ).until(
                    d -> ((JavascriptExecutor) d)
                            .executeScript(
                                    "return document.readyState"
                            )
                            .equals("complete")
            );

        } catch (Exception ignored) {
        }
    }

    // =========================================================

    private void waitForAlert(
            int seconds
    ) {

        new WebDriverWait(
                driver,
                Duration.ofSeconds(seconds)
        ).until(
                ExpectedConditions.alertIsPresent()
        );
    }

    // =========================================================

    private void sleep(
            long milliseconds
    ) {

        try {

            Thread.sleep(milliseconds);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();
        }
    }
}
