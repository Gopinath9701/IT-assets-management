package com.itams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;

public class AssetAssignmentTest extends BaseTest {

    // ============================================================
    // CONFIGURATION
    // ============================================================

    private static final String BASE_URL =
            "http://localhost:3000";

    private static final String ASSET_MANAGER_ID =
            "260822002";

    private static final String ASSET_MANAGER_PASSWORD =
            "Itams@2026a";

    private static final Duration WAIT =
            Duration.ofSeconds(15);

    // ============================================================
    // WAIT
    // ============================================================

    private WebDriverWait wait() {
        return new WebDriverWait(driver, WAIT);
    }

    // ============================================================
    // BEFORE EACH TEST
    // LOGIN -> ASSET MANAGEMENT -> ASSET ASSIGNMENT
    // ============================================================

    @BeforeEach
    public void loginAndOpenAssetAssignment() {

        driver.get(BASE_URL);

        waitForPageLoad();

        loginAsAssetManager();

        openAssetAssignmentPage();

        waitForAssignmentPage();
    }

    // ============================================================
    // LOGIN
    // ============================================================

    private void loginAsAssetManager() {

        WebElement employeeInput = findFirstVisible(
                By.name("employeeIdOrEmail"),
                By.cssSelector("input[name='employeeId']"),
                By.cssSelector("input[type='text']")
        );

        assertNotNull(
                employeeInput,
                "Login Employee ID field was not found"
        );

        employeeInput.clear();
        employeeInput.sendKeys(ASSET_MANAGER_ID);

        WebElement passwordInput = findFirstVisible(
                By.name("password"),
                By.cssSelector("input[type='password']")
        );

        assertNotNull(
                passwordInput,
                "Login password field was not found"
        );

        passwordInput.clear();
        passwordInput.sendKeys(ASSET_MANAGER_PASSWORD);

        WebElement loginButton = findFirstVisible(
                By.cssSelector("form button[type='submit']"),
                By.xpath("//button[normalize-space()='Login']"),
                By.xpath("//button[contains(normalize-space(),'Login')]")
        );

        assertNotNull(
                loginButton,
                "Login button was not found"
        );

        safeClick(loginButton);

        // Your application can show "Login Successful"
        handleAlertIfPresent();

        // Wait until login form disappears
        try {
            wait().until(driver ->
                    driver.findElements(
                            By.name("employeeIdOrEmail")
                    ).stream().noneMatch(
                            WebElement::isDisplayed
                    )
            );
        } catch (TimeoutException ignored) {
            // Continue because some versions of the login page
            // keep the element in the DOM.
        }
    }

    // ============================================================
    // OPEN ASSET ASSIGNMENT
    // ============================================================

    private void openAssetAssignmentPage() {

        // If already on page
        if (isAssignmentPage()) {
            return;
        }

        // Try sidebar directly
        WebElement assignment = findFirstVisible(
                By.xpath(
                        "//*[normalize-space()='Asset Assignment']"
                ),
                By.xpath(
                        "//div[contains(@class,'sidebar-item') " +
                                "and normalize-space()='Asset Assignment']"
                ),
                By.xpath(
                        "//button[normalize-space()='Asset Assignment']"
                )
        );

        if (assignment != null) {

            safeClick(assignment);

            if (waitForAssignmentPageShort()) {
                return;
            }
        }

        // If Asset Management page is visible,
        // click Asset Assignment from there.
        WebElement assetManagement = findFirstVisible(
                By.xpath(
                        "//*[normalize-space()='Asset Management']"
                ),
                By.xpath(
                        "//button[contains(normalize-space(),'Asset Management')]"
                )
        );

        if (assetManagement != null &&
                !isAssignmentPage()) {

            safeClick(assetManagement);

            sleep(500);

            WebElement assignmentAgain =
                    findFirstVisible(
                            By.xpath(
                                    "//*[normalize-space()='Asset Assignment']"
                            ),
                            By.xpath(
                                    "//button[normalize-space()='Asset Assignment']"
                            )
                    );

            assertNotNull(
                    assignmentAgain,
                    "Asset Assignment navigation option was not found"
            );

            safeClick(assignmentAgain);
        }

        waitForAssignmentPage();
    }

    // ============================================================
    // CHECK ASSIGNMENT PAGE
    // ============================================================

    private boolean isAssignmentPage() {

        try {

            return !driver.findElements(
                    By.cssSelector(".asa-page-title")
            ).isEmpty();

        } catch (Exception e) {
            return false;
        }
    }

    // ============================================================
    // WAIT FOR PAGE
    // ============================================================

    private void waitForAssignmentPage() {

        wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".asa-page-title")
                )
        );

        WebElement title = driver.findElement(
                By.cssSelector(".asa-page-title")
        );

        assertEquals(
                "Asset Assignment",
                title.getText().trim(),
                "Incorrect page opened"
        );
    }

    private boolean waitForAssignmentPageShort() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(5)
            ).until(
                    ExpectedConditions.visibilityOfElementLocated(
                            By.cssSelector(".asa-page-title")
                    )
            );

            return true;

        } catch (TimeoutException e) {

            return false;
        }
    }

    // ============================================================
    // TEST 1
    // PAGE LOAD
    // ============================================================

    @Test
    public void assetAssignmentPageLoadTest() {

        WebElement title = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".asa-page-title")
                )
        );

        assertTrue(
                title.isDisplayed(),
                "Asset Assignment title is not displayed"
        );

        assertEquals(
                "Asset Assignment",
                title.getText().trim()
        );
    }

    // ============================================================
    // TEST 2
    // PAGE SUBTITLE
    // ============================================================

    @Test
    public void pageSubtitleTest() {

        WebElement subtitle = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".asa-page-subtitle")
                )
        );

        assertTrue(
                subtitle.isDisplayed()
        );

        assertTrue(
                subtitle.getText()
                        .toLowerCase()
                        .contains("assign approved asset requests"),
                "Incorrect page subtitle"
        );
    }

    // ============================================================
    // TEST 3
    // ITAMS LOGO
    // ============================================================

    @Test
    public void itamsLogoTest() {

        WebElement logo = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".asa-nav-logo-title")
                )
        );

        assertEquals(
                "ITAMS",
                logo.getText().trim()
        );
    }

    // ============================================================
    // TEST 4
    // USERNAME
    // ============================================================

    @Test
    public void usernameDisplayTest() {

        WebElement username = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".asa-nav-username")
                )
        );

        assertTrue(
                username.isDisplayed(),
                "Username is not displayed"
        );

        assertFalse(
                username.getText().trim().isEmpty(),
                "Username is empty"
        );
    }

    // ============================================================
    // TEST 5
    // SIDEBAR ITEMS
    // ============================================================

    @Test
    public void sidebarItemsTest() {

        assertTrue(
                containsVisibleText("Dashboard"),
                "Dashboard sidebar item missing"
        );

        assertTrue(
                containsVisibleText("Asset Management"),
                "Asset Management sidebar item missing"
        );

        assertTrue(
                containsVisibleText("Asset Assignment"),
                "Asset Assignment sidebar item missing"
        );

        assertTrue(
                containsVisibleText("Request Approval"),
                "Request Approval sidebar item missing"
        );

        assertTrue(
                containsVisibleText("Maintenance"),
                "Maintenance sidebar item missing"
        );
    }

    // ============================================================
    // TEST 6
    // ACTIVE SIDEBAR
    // ============================================================

    @Test
    public void activeSidebarTest() {

        WebElement activeItem = findFirstVisible(
                By.cssSelector(
                        ".asa-sidebar-item--active"
                )
        );

        assertNotNull(
                activeItem,
                "Active sidebar item was not found"
        );

        assertEquals(
                "Asset Assignment",
                activeItem.getText().trim()
        );
    }

    // ============================================================
    // TEST 7
    // SEARCH FIELD DISPLAY
    // ============================================================

    @Test
    public void employeeSearchFieldTest() {

        WebElement search = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".asa-input")
                )
        );

        assertTrue(
                search.isDisplayed(),
                "Employee ID search field is not displayed"
        );

        assertEquals(
                "text",
                search.getAttribute("type")
        );

        assertEquals(
                "9",
                search.getAttribute("maxlength")
        );
    }

    // ============================================================
    // TEST 8
    // SEARCH BUTTON
    // ============================================================

    @Test
    public void searchButtonTest() {

        WebElement button = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".asa-search-btn")
                )
        );

        assertTrue(
                button.isDisplayed()
        );

        assertEquals(
                "Search",
                button.getText().trim()
        );
    }

    // ============================================================
    // TEST 9
    // SEARCH EMPTY EMPLOYEE ID
    // ============================================================

    @Test
    public void emptyEmployeeIdSearchTest() {

        WebElement search = getSearchField();

        search.clear();

        clickSearch();

        String text = getBodyText();

        assertTrue(
                text.contains("Employee ID is required"),
                "Required Employee ID validation was not displayed"
        );
    }

    // ============================================================
    // TEST 10
    // SEARCH EMPLOYEE ID WITH LETTERS
    // ============================================================

    @Test
    public void alphabeticEmployeeIdSearchTest() {

        searchEmployeeId("26082A001");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "Employee ID must contain numbers only"
                ),
                "Alphabetic Employee ID validation failed"
        );
    }

    // ============================================================
    // TEST 11
    // SEARCH EMPLOYEE ID LESS THAN 9 DIGITS
    // ============================================================

    @Test
    public void shortEmployeeIdSearchTest() {

        searchEmployeeId("26082100");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "Employee ID must be exactly 9 digits"
                ),
                "9-digit validation failed"
        );
    }

    // ============================================================
    // TEST 12
    // INVALID MONTH
    // ============================================================

    @Test
    public void invalidMonthEmployeeIdTest() {

        searchEmployeeId("261321001");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "valid month"
                ),
                "Invalid month validation failed"
        );
    }

    // ============================================================
    // TEST 13
    // INVALID DAY
    // ============================================================

    @Test
    public void invalidDayEmployeeIdTest() {

        searchEmployeeId("260832001");

        clickSearch();

        String body = getBodyText();

        assertTrue(
                body.contains("valid day")
                        || body.contains("invalid date"),
                "Invalid day validation failed"
        );
    }

    // ============================================================
    // TEST 14
    // FUTURE DATE EMPLOYEE ID
    // ============================================================

    @Test
    public void futureEmployeeIdTest() {

        LocalDate future =
                LocalDate.now().plusDays(5);

        String id =
                future.format(
                        DateTimeFormatter.ofPattern("yyMMdd")
                ) + "001";

        searchEmployeeId(id);

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "Future date Employee IDs are not allowed"
                ),
                "Future Employee ID validation failed"
        );
    }

    // ============================================================
    // TEST 15
    // EMPLOYEE NUMBER 000
    // ============================================================

    @Test
    public void employeeNumberZeroTest() {

        searchEmployeeId("260821000");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "Employee number cannot be 000"
                ),
                "Employee number 000 validation failed"
        );
    }

    // ============================================================
    // TEST 16
    // ENTER KEY SEARCH
    // ============================================================

    @Test
    public void enterKeySearchTest() {

        WebElement search = getSearchField();

        search.clear();

        search.sendKeys("260821001");

        search.sendKeys(
                org.openqa.selenium.Keys.ENTER
        );

        sleep(500);

        String body = getBodyText();

        // Enter must trigger search.
        // Either valid filtered results or no results is acceptable.
        assertFalse(
                body.contains(
                        "Employee ID is required"
                ),
                "Enter key did not trigger search correctly"
        );
    }

    // ============================================================
    // TEST 17
    // SEARCH ERROR CLEARS WHEN TYPING
    // ============================================================

    @Test
    public void searchErrorClearsWhenTypingTest() {

        searchEmployeeId("abc");

        clickSearch();

        assertTrue(
                getBodyText().contains(
                        "Employee ID must contain numbers only"
                )
        );

        WebElement search = getSearchField();

        search.clear();

        search.sendKeys("260821001");

        sleep(300);

        // Error should be cleared while typing.
        WebElement error = findFirstVisible(
                By.cssSelector(".asa-search-error")
        );

        assertTrue(
                error == null ||
                        !error.isDisplayed(),
                "Search error was not cleared while typing"
        );
    }

    // ============================================================
    // TEST 18
    // VALIDATION HINT
    // ============================================================

    @Test
    public void employeeIdValidationHintTest() {

        WebElement hint = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".asa-validation-hint"
                        )
                )
        );

        assertTrue(
                hint.getText()
                        .contains("YYMMDD")
        );

        assertTrue(
                hint.getText()
                        .contains("260808001")
        );
    }

    // ============================================================
    // TEST 19
    // PENDING REQUEST TABLE
    // ============================================================

    @Test
    public void pendingRequestTableTest() {

        WebElement table = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".asa-card .asa-table"
                        )
                )
        );

        assertTrue(
                table.isDisplayed(),
                "Pending request table is not displayed"
        );

        String tableText =
                table.getText();

        assertTrue(
                tableText.contains("Request ID"),
                "Request ID column missing"
        );

        assertTrue(
                tableText.contains("Employee ID"),
                "Employee ID column missing"
        );

        assertTrue(
                tableText.contains("Employee Name"),
                "Employee Name column missing"
        );

        assertTrue(
                tableText.contains("Department"),
                "Department column missing"
        );

        assertTrue(
                tableText.contains("Asset Type"),
                "Asset Type column missing"
        );

        assertTrue(
                tableText.contains("Purpose"),
                "Purpose column missing"
        );

        assertTrue(
                tableText.contains("Required Date"),
                "Required Date column missing"
        );

        assertTrue(
                tableText.contains("Approval Date"),
                "Approval Date column missing"
        );

        assertTrue(
                tableText.contains("Action"),
                "Action column missing"
        );
    }

    // ============================================================
    // TEST 20
    // ASSIGN BUTTON
    // ============================================================

    @Test
    public void assignButtonTest() {

        List<WebElement> buttons =
                driver.findElements(
                        By.cssSelector(".asa-assign-btn")
                );

        if (buttons.isEmpty()) {

            String body = getBodyText();

            assertTrue(
                    body.contains(
                            "No pending requests found."
                    ),
                    "No Assign buttons and no empty-state message"
            );

            return;
        }

        assertTrue(
                buttons.get(0).isDisplayed(),
                "Assign button is not displayed"
        );

        assertEquals(
                "Assign",
                buttons.get(0).getText().trim()
        );
    }

    // ============================================================
    // TEST 21
    // ASSIGN MODAL OPEN
    // ============================================================

    @Test
    public void assignModalOpenTest() {

        List<WebElement> buttons =
                driver.findElements(
                        By.cssSelector(".asa-assign-btn")
                );

        if (buttons.isEmpty()) {
            return;
        }

        safeClickFresh(
                By.cssSelector(".asa-assign-btn")
        );

        WebElement modal = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".asa-modal")
                )
        );

        assertTrue(
                modal.isDisplayed(),
                "Assign modal did not open"
        );

        assertTrue(
                modal.getText()
                        .contains("Assign Asset"),
                "Assign Asset modal title missing"
        );
    }

    // ============================================================
    // TEST 22
    // MODAL CANCEL
    // ============================================================

    @Test
    public void assignModalCancelTest() {

        List<WebElement> buttons =
                driver.findElements(
                        By.cssSelector(".asa-assign-btn")
                );

        if (buttons.isEmpty()) {
            return;
        }

        safeClickFresh(
                By.cssSelector(".asa-assign-btn")
        );

        wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".asa-modal")
                )
        );

        WebElement cancel = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(
                                ".asa-modal-cancel"
                        )
                )
        );

        safeClick(cancel);

        wait().until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.cssSelector(".asa-modal")
                )
        );

        assertTrue(
                driver.findElements(
                        By.cssSelector(".asa-modal")
                ).stream().noneMatch(
                        WebElement::isDisplayed
                ),
                "Modal did not close after Cancel"
        );
    }

    // ============================================================
    // TEST 23
    // MODAL CLOSE X
    // ============================================================

    @Test
    public void assignModalCloseButtonTest() {

        List<WebElement> buttons =
                driver.findElements(
                        By.cssSelector(".asa-assign-btn")
                );

        if (buttons.isEmpty()) {
            return;
        }

        safeClickFresh(
                By.cssSelector(".asa-assign-btn")
        );

        wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".asa-modal")
                )
        );

        WebElement close = wait().until(
                ExpectedConditions.elementToBeClickable(
                        By.cssSelector(
                                ".asa-modal-close"
                        )
                )
        );

        safeClick(close);

        wait().until(
                ExpectedConditions.invisibilityOfElementLocated(
                        By.cssSelector(".asa-modal")
                )
        );
    }

    // ============================================================
    // TEST 24
    // HISTORY TABLE
    // ============================================================

    @Test
    public void assignmentHistoryTableTest() {

        List<WebElement> tables =
                driver.findElements(
                        By.cssSelector(".asa-table")
                );

        assertTrue(
                tables.size() >= 2,
                "Pending and History tables were not found"
        );

        WebElement historyTable =
                tables.get(1);

        String text =
                historyTable.getText();

        assertTrue(
                text.contains("Assignment ID"),
                "Assignment ID column missing"
        );

        assertTrue(
                text.contains("Request ID"),
                "Request ID column missing in history"
        );

        assertTrue(
                text.contains("Employee ID"),
                "Employee ID column missing in history"
        );

        assertTrue(
                text.contains("Employee Name"),
                "Employee Name column missing in history"
        );

        assertTrue(
                text.contains("Asset Type"),
                "Asset Type column missing in history"
        );

        assertTrue(
                text.contains("Asset Name / ID"),
                "Asset Name / ID column missing"
        );

        assertTrue(
                text.contains("Assigned Date"),
                "Assigned Date column missing"
        );

        assertTrue(
                text.contains("Status"),
                "Status column missing"
        );
    }

    // ============================================================
    // TEST 25
    // ASSIGNMENT STATUS BADGE
    // ============================================================

    @Test
    public void assignmentStatusBadgeTest() {

        List<WebElement> badges =
                driver.findElements(
                        By.cssSelector(
                                ".asa-badge--assigned"
                        )
                );

        if (!badges.isEmpty()) {

            assertTrue(
                    badges.get(0).isDisplayed(),
                    "Assignment status badge is not displayed"
            );

            assertEquals(
                    "Assigned",
                    badges.get(0).getText().trim()
            );
        }
    }

    // ============================================================
    // TEST 26
    // PENDING ROW DROPDOWN
    // ============================================================

    @Test
    public void pendingRowsDropdownTest() {

        List<WebElement> selects =
                driver.findElements(
                        By.cssSelector(
                                ".asa-rows-select"
                        )
                );

        assertTrue(
                selects.size() >= 2,
                "Rows dropdowns were not found"
        );

        Select pendingSelect =
                new Select(selects.get(0));

        assertTrue(
                containsOption(
                        pendingSelect,
                        "10"
                ),
                "10 option missing"
        );

        assertTrue(
                containsOption(
                        pendingSelect,
                        "30"
                ),
                "30 option missing"
        );

        assertTrue(
                containsOption(
                        pendingSelect,
                        "50"
                ),
                "50 option missing"
        );

        assertTrue(
                containsOption(
                        pendingSelect,
                        "All"
                ),
                "All option missing"
        );
    }

    // ============================================================
    // TEST 27
    // HISTORY ROW DROPDOWN
    // ============================================================

    @Test
    public void historyRowsDropdownTest() {

        List<WebElement> selects =
                driver.findElements(
                        By.cssSelector(
                                ".asa-rows-select"
                        )
                );

        assertTrue(
                selects.size() >= 2,
                "History rows dropdown not found"
        );

        Select historySelect =
                new Select(selects.get(1));

        assertTrue(
                containsOption(
                        historySelect,
                        "10"
                )
        );

        assertTrue(
                containsOption(
                        historySelect,
                        "30"
                )
        );

        assertTrue(
                containsOption(
                        historySelect,
                        "50"
                )
        );

        assertTrue(
                containsOption(
                        historySelect,
                        "All"
                )
        );
    }

    // ============================================================
    // TEST 28
    // PENDING ROW DROPDOWN CHANGE
    // ============================================================

    @Test
    public void pendingRowsChangeTest() {

        List<WebElement> selects =
                driver.findElements(
                        By.cssSelector(
                                ".asa-rows-select"
                        )
                );

        Select select =
                new Select(selects.get(0));

        select.selectByVisibleText("All");

        assertEquals(
                "All",
                select.getFirstSelectedOption()
                        .getText()
                        .trim()
        );
    }

    // ============================================================
    // TEST 29
    // HISTORY ROW DROPDOWN CHANGE
    // ============================================================

    @Test
    public void historyRowsChangeTest() {

        List<WebElement> selects =
                driver.findElements(
                        By.cssSelector(
                                ".asa-rows-select"
                        )
                );

        Select select =
                new Select(selects.get(1));

        select.selectByVisibleText("30");

        assertEquals(
                "30",
                select.getFirstSelectedOption()
                        .getText()
                        .trim()
        );
    }

    // ============================================================
    // TEST 30
    // PAGINATION INFORMATION
    // ============================================================

    @Test
    public void paginationInformationTest() {

        List<WebElement> info =
                driver.findElements(
                        By.cssSelector(
                                ".asa-pagination-info"
                        )
                );

        assertEquals(
                2,
                info.size(),
                "Expected two pagination information sections"
        );

        assertTrue(
                info.get(0).getText()
                        .contains("Showing")
        );

        assertTrue(
                info.get(1).getText()
                        .contains("Showing")
        );
    }

    // ============================================================
    // TEST 31
    // SEARCH VALID EMPLOYEE ID
    // ============================================================

    @Test
    public void validEmployeeSearchTest() {

        String employeeId =
                getEmployeeIdFromVisibleData();

        if (employeeId == null) {

            // Backend currently has no pending/history records.
            System.out.println(
                    "SKIP: No Employee ID available in current assignment data."
            );

            return;
        }

        searchEmployeeId(employeeId);

        clickSearch();

        sleep(700);

        String body =
                getBodyText();

        // Search should not produce validation error.
        assertFalse(
                body.contains(
                        "Employee ID is required"
                ),
                "Valid Employee ID was rejected"
        );

        assertFalse(
                body.contains(
                        "must contain numbers only"
                ),
                "Valid Employee ID was rejected"
        );

        assertFalse(
                body.contains(
                        "must be exactly 9 digits"
                ),
                "Valid Employee ID was rejected"
        );
    }

    // ============================================================
    // TEST 32
    // FILTER SEARCH RESULT
    // ============================================================

    @Test
    public void searchFilteringTest() {

        String employeeId =
                getEmployeeIdFromVisibleData();

        if (employeeId == null) {
            return;
        }

        searchEmployeeId(employeeId);

        clickSearch();

        sleep(700);

        List<WebElement> rows =
                driver.findElements(
                        By.cssSelector(
                                ".asa-table tbody tr"
                        )
                );

        for (WebElement row : rows) {

            String text;

            try {
                text = row.getText();
            } catch (StaleElementReferenceException e) {
                continue;
            }

            if (text.contains("No pending requests found.")
                    || text.contains("No assignment history found.")) {
                continue;
            }

            // Any displayed employee row should contain
            // the applied Employee ID.
            if (text.matches("(?s).*\\b\\d{9}\\b.*")) {

                assertTrue(
                        text.contains(employeeId),
                        "Search filtering did not filter employee data"
                );
            }
        }
    }

    // ============================================================
    // TEST 33
    // BACK BUTTON DISPLAY
    // ============================================================

    @Test
    public void backButtonDisplayTest() {

        WebElement back = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".asa-back-btn"
                        )
                )
        );

        assertTrue(
                back.isDisplayed()
        );

        assertTrue(
                back.getText().contains("Back")
        );
    }

    // ============================================================
    // TEST 34
    // BACK BUTTON
    // ============================================================

    @Test
    public void backButtonTest() {

        WebElement back =
                wait().until(
                        ExpectedConditions.elementToBeClickable(
                                By.cssSelector(
                                        ".asa-back-btn"
                                )
                        )
                );

        safeClick(back);

        sleep(500);

        // We mainly verify that the page changed.
        assertFalse(
                isAssignmentPage(),
                "Back button did not navigate away from Asset Assignment"
        );
    }

    // ============================================================
    // TEST 35
    // LOGOUT BUTTON DISPLAY
    // ============================================================

    @Test
    public void logoutButtonDisplayTest() {

        WebElement logout = wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".asa-logout-btn"
                        )
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

    // ============================================================
    // TEST 36
    // NO DATA MESSAGE
    // ============================================================

    @Test
    public void noDataMessageTest() {

        String body =
                getBodyText();

        boolean hasPendingData =
                !driver.findElements(
                        By.cssSelector(
                                ".asa-assign-btn"
                        )
                ).isEmpty();

        boolean hasHistoryData =
                !driver.findElements(
                        By.cssSelector(
                                ".asa-badge--assigned"
                        )
                ).isEmpty();

        if (!hasPendingData) {

            assertTrue(
                    body.contains(
                            "No pending requests found."
                    ),
                    "Pending table has no rows but no empty message"
            );
        }

        if (!hasHistoryData) {

            assertTrue(
                    body.contains(
                            "No assignment history found."
                    ),
                    "History table has no rows but no empty message"
            );
        }
    }

    // ============================================================
    // HELPERS
    // ============================================================

    private WebElement getSearchField() {

        return wait().until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".asa-input")
                )
        );
    }

    // ============================================================

    private void searchEmployeeId(
            String employeeId
    ) {

        WebElement search =
                getSearchField();

        search.clear();

        search.sendKeys(employeeId);
    }

    // ============================================================

    private void clickSearch() {

        WebElement button =
                wait().until(
                        ExpectedConditions.elementToBeClickable(
                                By.cssSelector(
                                        ".asa-search-btn"
                                )
                        )
                );

        safeClick(button);
    }

    // ============================================================

    private String getBodyText() {

        return driver.findElement(
                By.tagName("body")
        ).getText();
    }

    // ============================================================

    private boolean containsVisibleText(
            String text
    ) {

        try {

            List<WebElement> elements =
                    driver.findElements(
                            By.xpath(
                                    "//*[normalize-space()='" +
                                            text +
                                            "']"
                            )
                    );

            for (WebElement element : elements) {

                try {

                    if (element.isDisplayed()) {
                        return true;
                    }

                } catch (StaleElementReferenceException ignored) {
                }
            }

        } catch (Exception ignored) {
        }

        return false;
    }

    // ============================================================
    // GET EMPLOYEE ID FROM CURRENT TABLE DATA
    // ============================================================

    private String getEmployeeIdFromVisibleData() {

        Pattern pattern =
                Pattern.compile(
                        "\\b\\d{9}\\b"
                );

        List<WebElement> rows =
                driver.findElements(
                        By.cssSelector(
                                ".asa-table tbody tr"
                        )
                );

        // First search pending table
        for (WebElement row : rows) {

            try {

                String text = row.getText();

                Matcher matcher =
                        pattern.matcher(text);

                if (matcher.find()) {
                    return matcher.group();
                }

            } catch (StaleElementReferenceException ignored) {
            }
        }

        // If not found, search all table rows again.
        rows = driver.findElements(
                By.cssSelector(
                        ".asa-table tbody tr"
                )
        );

        for (WebElement row : rows) {

            try {

                String text = row.getText();

                Matcher matcher =
                        pattern.matcher(text);

                if (matcher.find()) {
                    return matcher.group();
                }

            } catch (StaleElementReferenceException ignored) {
            }
        }

        return null;
    }

    // ============================================================
    // SELECT OPTION
    // ============================================================

    private boolean containsOption(
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

    // ============================================================
    // FIND FIRST VISIBLE
    // ============================================================

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

    // ============================================================
    // SAFE CLICK
    // ============================================================

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

        } catch (
                StaleElementReferenceException
                | TimeoutException e
        ) {

            // Caller should normally reacquire the element.
            // JavaScript fallback for overlay/interception.
            try {

                ((JavascriptExecutor) driver)
                        .executeScript(
                                "arguments[0].click();",
                                element
                        );

            } catch (Exception ignored) {
            }

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

    // ============================================================
    // SAFE FRESH CLICK
    // Avoids stale element problems.
    // ============================================================

    private void safeClickFresh(
            By locator
    ) {

        for (int attempt = 0; attempt < 3; attempt++) {

            try {

                WebElement element =
                        wait().until(
                                ExpectedConditions
                                        .presenceOfElementLocated(
                                                locator
                                        )
                        );

                scrollIntoView(element);

                wait().until(
                        ExpectedConditions
                                .elementToBeClickable(
                                        locator
                                )
                );

                try {

                    element.click();

                } catch (Exception e) {

                    ((JavascriptExecutor) driver)
                            .executeScript(
                                    "arguments[0].click();",
                                    driver.findElement(locator)
                            );
                }

                return;

            } catch (StaleElementReferenceException e) {

                sleep(300);
            }
        }

        fail(
                "Could not click element: "
                        + locator
        );
    }

    // ============================================================
    // SCROLL
    // ============================================================

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

    // ============================================================
    // PAGE LOAD
    // ============================================================

    private void waitForPageLoad() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(15)
            ).until(
                    d ->
                            ((JavascriptExecutor) d)
                                    .executeScript(
                                            "return document.readyState"
                                    )
                                    .equals("complete")
            );

        } catch (Exception ignored) {
        }
    }

    // ============================================================
    // ALERT
    // ============================================================

    private void handleAlertIfPresent() {

        try {

            WebDriverWait alertWait =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(5)
                    );

            Alert alert =
                    alertWait.until(
                            ExpectedConditions.alertIsPresent()
                    );

            System.out.println(
                    "Alert: " + alert.getText()
            );

            alert.accept();

        } catch (
                TimeoutException
                | NoAlertPresentException ignored
        ) {
        }
    }

    // ============================================================
    // SLEEP
    // ============================================================

    private void sleep(long milliseconds) {

        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
