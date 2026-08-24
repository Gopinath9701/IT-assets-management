package com.itams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class RequestApprovalTest extends BaseTest {

    private static final String BASE_URL =
            "http://localhost:3000";

    private static final String EMPLOYEE_ID =
            "260822002";

    private static final String PASSWORD =
            "Itams@2026a";

    private final Duration WAIT_TIME =
            Duration.ofSeconds(15);

    // =========================================================
    // SETUP
    // =========================================================

    @BeforeEach
    public void setUpRequestApproval() {

        driver.get(BASE_URL);

        waitForPageLoad();

        login();

        openRequestApproval();

        waitForRequestApprovalPage();
    }

    // =========================================================
    // LOGIN
    // =========================================================

    private void login() {

        WebElement employeeId = findVisible(
                By.name("employeeIdOrEmail"),
                By.name("employeeId"),
                By.cssSelector("input[type='text']")
        );

        assertNotNull(
                employeeId,
                "Employee ID field not found"
        );

        employeeId.clear();
        employeeId.sendKeys(EMPLOYEE_ID);

        WebElement password = findVisible(
                By.name("password"),
                By.cssSelector("input[type='password']")
        );

        assertNotNull(
                password,
                "Password field not found"
        );

        password.clear();
        password.sendKeys(PASSWORD);

        WebElement loginButton = findVisible(
                By.cssSelector("form button[type='submit']"),
                By.xpath("//button[normalize-space()='Login']"),
                By.xpath("//button[contains(normalize-space(),'Login')]")
        );

        assertNotNull(
                loginButton,
                "Login button not found"
        );

        safeClick(loginButton);

        acceptAlertIfPresent();

        sleep(800);
    }

    // =========================================================
    // OPEN REQUEST APPROVAL
    // =========================================================

    private void openRequestApproval() {

        if (isRequestApprovalPage()) {
            return;
        }

        WebElement requestApproval = findVisible(
                By.xpath(
                        "//*[normalize-space()='Request Approval']"
                ),
                By.xpath(
                        "//button[normalize-space()='Request Approval']"
                ),
                By.xpath(
                        "//a[normalize-space()='Request Approval']"
                ),
                By.xpath(
                        "//div[normalize-space()='Request Approval']"
                )
        );

        assertNotNull(
                requestApproval,
                "Request Approval navigation option not found"
        );

        safeClick(requestApproval);

        waitForRequestApprovalPage();
    }

    // =========================================================
    // PAGE CHECK
    // =========================================================

    private boolean isRequestApprovalPage() {

        return !driver.findElements(
                By.cssSelector(".ra-page-title")
        ).isEmpty();
    }

    private void waitForRequestApprovalPage() {

        WebElement title = new WebDriverWait(
                driver,
                WAIT_TIME
        ).until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(".ra-page-title")
                )
        );

        assertEquals(
                "Request Approval",
                title.getText().trim()
        );
    }

    // =========================================================
    // TEST 1 - PAGE TITLE
    // =========================================================

    @Test
    public void requestApprovalPageTest() {

        WebElement title =
                driver.findElement(
                        By.cssSelector(".ra-page-title")
                );

        assertTrue(title.isDisplayed());

        assertEquals(
                "Request Approval",
                title.getText().trim()
        );
    }

    // =========================================================
    // TEST 2 - PAGE SUBTITLE
    // =========================================================

    @Test
    public void pageSubtitleTest() {

        WebElement subtitle =
                driver.findElement(
                        By.cssSelector(".ra-page-subtitle")
                );

        assertTrue(
                subtitle.getText().contains(
                        "Review and approve or reject asset requests."
                )
        );
    }

    // =========================================================
    // TEST 3 - ITAMS LOGO
    // =========================================================

    @Test
    public void itamsLogoTest() {

        WebElement logo =
                driver.findElement(
                        By.cssSelector(
                                ".ra-nav-logo-title"
                        )
                );

        assertEquals(
                "ITAMS",
                logo.getText().trim()
        );
    }

    // =========================================================
    // TEST 4 - LOGOUT BUTTON
    // =========================================================

    @Test
    public void logoutButtonTest() {

        WebElement logout =
                driver.findElement(
                        By.cssSelector(
                                ".ra-logout-btn"
                        )
                );

        assertTrue(logout.isDisplayed());

        assertEquals(
                "Logout",
                logout.getText().trim()
        );
    }

    // =========================================================
    // TEST 5 - SIDEBAR
    // =========================================================

    @Test
    public void sidebarItemsTest() {

        String body =
                driver.findElement(
                        By.cssSelector(".ra-sidebar")
                ).getText();

        assertTrue(body.contains("Dashboard"));
        assertTrue(body.contains("Asset Management"));
        assertTrue(body.contains("Asset Assignment"));
        assertTrue(body.contains("Request Approval"));
        assertTrue(body.contains("Maintenance"));
    }

    // =========================================================
    // TEST 6 - REQUEST APPROVAL ACTIVE SIDEBAR
    // =========================================================

    @Test
    public void requestApprovalActiveSidebarTest() {

        WebElement active =
                driver.findElement(
                        By.cssSelector(
                                ".ra-sidebar-item--active"
                        )
                );

        assertEquals(
                "Request Approval",
                active.getText().trim()
        );
    }

    // =========================================================
    // TEST 7 - SEARCH REQUEST CARD
    // =========================================================

    @Test
    public void searchRequestCardTest() {

        WebElement heading =
                driver.findElement(
                        By.cssSelector(
                                ".ra-card-heading"
                        )
                );

        assertEquals(
                "Search Request",
                heading.getText().trim()
        );
    }

    // =========================================================
    // TEST 8 - EMPLOYEE ID FIELD
    // =========================================================

    @Test
    public void employeeIdFieldTest() {

        WebElement input =
                getEmployeeIdInput();

        assertTrue(
                input.isDisplayed()
        );

        assertEquals(
                "Enter employee ID",
                input.getAttribute("placeholder")
        );

        assertEquals(
                "9",
                input.getAttribute("maxlength")
        );
    }

    // =========================================================
    // TEST 9 - ASSET TYPE DROPDOWN
    // =========================================================

    @Test
    public void assetTypeDropdownTest() {

        WebElement select =
                getAssetTypeSelect();

        List<WebElement> options =
                select.findElements(
                        By.tagName("option")
                );

        assertEquals(
                7,
                options.size()
        );

        assertTrue(
                optionExists(select, "All Assets")
        );

        assertTrue(
                optionExists(select, "Laptop")
        );

        assertTrue(
                optionExists(select, "Monitor")
        );

        assertTrue(
                optionExists(select, "Keyboard")
        );

        assertTrue(
                optionExists(select, "Mouse")
        );

        assertTrue(
                optionExists(select, "Printer")
        );

        assertTrue(
                optionExists(select, "Desktop")
        );
    }

    // =========================================================
    // TEST 10 - SEARCH BUTTON
    // =========================================================

    @Test
    public void searchButtonTest() {

        WebElement button =
                driver.findElement(
                        By.cssSelector(
                                ".ra-search-btn"
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

    // =========================================================
    // TEST 11 - EMPTY SEARCH
    // =========================================================

    @Test
    public void emptySearchValidationTest() {

        getEmployeeIdInput().clear();

        selectAssetType("All Assets");

        clickSearch();

        WebElement error =
                new WebDriverWait(
                        driver,
                        WAIT_TIME
                ).until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".ra-search-error"
                                )
                        )
                );

        assertTrue(
                error.getText().contains(
                        "Please enter an Employee ID or select an Asset Type"
                )
        );
    }

    // =========================================================
    // TEST 12 - EMPLOYEE ID LETTER VALIDATION
    // =========================================================

    @Test
    public void employeeIdLettersValidationTest() {

        WebElement input =
                getEmployeeIdInput();

        input.clear();

        input.sendKeys(
                "ABCDEF001"
        );

        selectAssetType("All Assets");

        clickSearch();

        WebElement error =
                waitForSearchError();

        assertTrue(
                error.getText().contains(
                        "Employee ID should contain numbers only"
                )
        );
    }

    // =========================================================
    // TEST 13 - EMPLOYEE ID LENGTH
    // =========================================================

    @Test
    public void employeeIdLengthValidationTest() {

        WebElement input =
                getEmployeeIdInput();

        input.clear();

        input.sendKeys("26080800");

        selectAssetType("All Assets");

        clickSearch();

        WebElement error =
                waitForSearchError();

        assertTrue(
                error.getText().contains(
                        "Employee ID must contain exactly 9 digits"
                )
        );
    }

    // =========================================================
    // TEST 14 - INVALID MONTH
    // =========================================================

    @Test
    public void invalidMonthValidationTest() {

        WebElement input =
                getEmployeeIdInput();

        input.clear();

        // YYMMDD + employee number
        input.sendKeys("261308001");

        selectAssetType("All Assets");

        clickSearch();

        WebElement error =
                waitForSearchError();

        assertTrue(
                error.getText().contains(
                        "valid month"
                )
        );
    }

    // =========================================================
    // TEST 15 - INVALID DAY
    // =========================================================

    @Test
    public void invalidDayValidationTest() {

        WebElement input =
                getEmployeeIdInput();

        input.clear();

        input.sendKeys("260832001");

        selectAssetType("All Assets");

        clickSearch();

        WebElement error =
                waitForSearchError();

        assertTrue(
                error.getText().contains(
                        "valid day"
                )
        );
    }

    // =========================================================
    // TEST 16 - EMPLOYEE NUMBER 000
    // =========================================================

    @Test
    public void employeeNumberZeroValidationTest() {

        WebElement input =
                getEmployeeIdInput();

        input.clear();

        input.sendKeys("260808000");

        selectAssetType("All Assets");

        clickSearch();

        WebElement error =
                waitForSearchError();

        assertTrue(
                error.getText().contains(
                        "Employee number cannot be 000"
                )
        );
    }

    // =========================================================
    // TEST 17 - FUTURE EMPLOYEE DATE
    // =========================================================

    @Test
    public void futureEmployeeDateValidationTest() {

        WebElement input =
                getEmployeeIdInput();

        input.clear();

        // 99/12/31 is future relative to current system
        input.sendKeys("991231001");

        selectAssetType("All Assets");

        clickSearch();

        WebElement error =
                waitForSearchError();

        assertTrue(
                error.getText().contains(
                        "Future date Employee IDs are not allowed"
                )
        );
    }

    // =========================================================
    // TEST 18 - VALID EMPLOYEE ID
    // =========================================================

    @Test
    public void validEmployeeIdSearchTest() {

        WebElement input =
                getEmployeeIdInput();

        input.clear();

        input.sendKeys(
                "260808001"
        );

        selectAssetType("All Assets");

        clickSearch();

        sleep(500);

        assertEquals(
                "260808001",
                input.getAttribute("value")
        );
    }

    // =========================================================
    // TEST 19 - ASSET TYPE ONLY SEARCH
    // =========================================================

    @Test
    public void assetTypeOnlySearchTest() {

        getEmployeeIdInput().clear();

        selectAssetType("Laptop");

        clickSearch();

        sleep(500);

        assertEquals(
                "Laptop",
                getSelectedAssetType()
        );

        // No validation error should be displayed
        assertTrue(
                driver.findElements(
                        By.cssSelector(
                                ".ra-search-error"
                        )
                ).isEmpty()
        );
    }

    // =========================================================
    // TEST 20 - ENTER KEY SEARCH
    // =========================================================

    @Test
    public void enterKeySearchTest() {

        WebElement input =
                getEmployeeIdInput();

        input.clear();

        input.sendKeys(
                "260808001"
        );

        input.sendKeys(
                Keys.ENTER
        );

        sleep(500);

        assertEquals(
                "260808001",
                input.getAttribute("value")
        );
    }

    // =========================================================
    // TEST 21 - REQUEST TABLE
    // =========================================================

    @Test
    public void requestTableTest() {

        WebElement heading =
                findVisible(
                        By.xpath(
                                "//h2[normalize-space()='Pending Request List']"
                        )
                );

        assertNotNull(
                heading,
                "Pending Request List not found"
        );

        assertEquals(
                "Pending Request List",
                heading.getText().trim()
        );
    }

    // =========================================================
    // TEST 22 - TABLE HEADERS
    // =========================================================

    @Test
    public void tableHeadersTest() {

        List<WebElement> headers =
                driver.findElements(
                        By.cssSelector(
                                ".ra-table thead th"
                        )
                );

        assertEquals(
                6,
                headers.size()
        );

        assertEquals(
                "Request ID",
                headers.get(0).getText().trim()
        );

        assertEquals(
                "Employee ID",
                headers.get(1).getText().trim()
        );

        assertEquals(
                "Asset Type",
                headers.get(2).getText().trim()
        );

        assertEquals(
                "Purpose",
                headers.get(3).getText().trim()
        );

        assertEquals(
                "Required Date",
                headers.get(4).getText().trim()
        );

        assertEquals(
                "Status",
                headers.get(5).getText().trim()
        );
    }

    // =========================================================
    // TEST 23 - REQUEST ROW
    // =========================================================

    @Test
    public void requestRowTest() {

        List<WebElement> rows =
                driver.findElements(
                        By.cssSelector(
                                ".ra-table-row"
                        )
                );

        if (rows.isEmpty()) {

            assertTrue(
                    driver.getPageSource()
                            .contains(
                                    "No requests found."
                            )
            );

            return;
        }

        assertTrue(
                rows.get(0).isDisplayed()
        );
    }

    // =========================================================
    // TEST 24 - REQUEST SELECTION
    // =========================================================

    @Test
    public void requestSelectionTest() {

        List<WebElement> rows =
                driver.findElements(
                        By.cssSelector(
                                ".ra-table-row"
                        )
                );

        if (rows.isEmpty()) {
            return;
        }

        safeClick(rows.get(0));

        WebElement details =
                new WebDriverWait(
                        driver,
                        WAIT_TIME
                ).until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".ra-card--details"
                                )
                        )
                );

        assertTrue(
                details.isDisplayed()
        );

        assertTrue(
                details.getText().contains(
                        "Request Details"
                )
        );
    }

    // =========================================================
    // TEST 25 - REQUEST DETAILS
    // =========================================================

    @Test
    public void requestDetailsTest() {

        selectFirstRequest();

        String details =
                driver.findElement(
                        By.cssSelector(
                                ".ra-card--details"
                        )
                ).getText();

        assertTrue(
                details.contains("Request ID")
        );

        assertTrue(
                details.contains("Employee ID")
        );

        assertTrue(
                details.contains("Employee Name")
        );

        assertTrue(
                details.contains("Department")
        );

        assertTrue(
                details.contains("Asset Type")
        );

        assertTrue(
                details.contains("Purpose")
        );

        assertTrue(
                details.contains("Required Date")
        );

        assertTrue(
                details.contains("Request Status")
        );
    }

    // =========================================================
    // TEST 26 - APPROVE BUTTON
    // =========================================================

    @Test
    public void approveButtonTest() {

        selectFirstRequest();

        WebElement approve =
                driver.findElement(
                        By.cssSelector(
                                ".ra-approve-btn"
                        )
                );

        assertTrue(
                approve.isDisplayed()
        );

        assertEquals(
                "Approve",
                approve.getText().trim()
        );
    }

    // =========================================================
    // TEST 27 - REJECT BUTTON
    // =========================================================

    @Test
    public void rejectButtonTest() {

        selectFirstRequest();

        WebElement reject =
                driver.findElement(
                        By.cssSelector(
                                ".ra-reject-btn"
                        )
                );

        assertTrue(
                reject.isDisplayed()
        );

        assertEquals(
                "Reject",
                reject.getText().trim()
        );
    }

    // =========================================================
    // TEST 28 - REJECTION TEXTAREA
    // =========================================================

    @Test
    public void rejectionTextareaTest() {

        selectFirstRequest();

        WebElement textarea =
                driver.findElement(
                        By.cssSelector(
                                ".ra-textarea"
                        )
                );

        assertTrue(
                textarea.isDisplayed()
        );

        assertEquals(
                "Enter description for rejection",
                textarea.getAttribute("placeholder")
        );
    }

    // =========================================================
    // TEST 29 - REJECT WITHOUT REASON
    // =========================================================

    @Test
    public void rejectWithoutReasonTest() {

        selectFirstRequest();

        WebElement textarea =
                driver.findElement(
                        By.cssSelector(
                                ".ra-textarea"
                        )
                );

        textarea.clear();

        WebElement reject =
                driver.findElement(
                        By.cssSelector(
                                ".ra-reject-btn"
                        )
                );

        safeClick(reject);

        WebElement error =
                new WebDriverWait(
                        driver,
                        WAIT_TIME
                ).until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".ra-error"
                                )
                        )
                );

        assertTrue(
                error.getText().contains(
                        "Reason for rejection is required"
                )
        );
    }

    // =========================================================
    // TEST 30 - SHORT REJECTION REASON
    // =========================================================

    @Test
    public void shortRejectionReasonTest() {

        selectFirstRequest();

        WebElement textarea =
                driver.findElement(
                        By.cssSelector(
                                ".ra-textarea"
                        )
                );

        textarea.clear();
        textarea.sendKeys("Too short");

        safeClick(
                driver.findElement(
                        By.cssSelector(
                                ".ra-reject-btn"
                        )
                )
        );

        WebElement error =
                waitForRejectError();

        assertTrue(
                error.getText().contains(
                        "at least 10 characters"
                )
        );
    }

    // =========================================================
    // TEST 31 - SPECIAL CHARACTER REJECTION
    // =========================================================

    @Test
    public void specialCharacterRejectionTest() {

        selectFirstRequest();

        WebElement textarea =
                getRejectionTextarea();

        textarea.clear();

        textarea.sendKeys(
                "Invalid@reason!"
        );

        clickReject();

        WebElement error =
                waitForRejectError();

        assertTrue(
                error.getText().contains(
                        "only letters, numbers and single spaces"
                )
        );
    }

    // =========================================================
    // TEST 32 - MULTIPLE SPACE REJECTION
    // =========================================================

    @Test
    public void multipleSpaceRejectionTest() {

        selectFirstRequest();

        WebElement textarea =
                getRejectionTextarea();

        textarea.clear();

        textarea.sendKeys(
                "Reason  contains multiple spaces"
        );

        clickReject();

        WebElement error =
                waitForRejectError();

        assertTrue(
                error.getText().contains(
                        "multiple consecutive spaces"
                )
        );
    }

    // =========================================================
    // TEST 33 - LEADING SPACE REJECTION
    // =========================================================

    @Test
    public void leadingSpaceRejectionTest() {

        selectFirstRequest();

        WebElement textarea =
                getRejectionTextarea();

        textarea.clear();

        textarea.sendKeys(
                " Invalid reason here"
        );

        clickReject();

        WebElement error =
                waitForRejectError();

        assertTrue(
                error.getText().contains(
                        "leading or trailing spaces"
                )
        );
    }

    // =========================================================
    // TEST 34 - VALID REJECTION REASON
    // =========================================================

    @Test
    public void validRejectionReasonTest() {

        selectFirstRequest();

        WebElement textarea =
                getRejectionTextarea();

        textarea.clear();

        textarea.sendKeys(
                "Asset is not required now"
        );

        assertEquals(
                "Asset is not required now",
                textarea.getAttribute("value")
        );
    }

    // =========================================================
    // TEST 35 - PAGINATION OPTIONS
    // =========================================================

    @Test
    public void paginationOptionsTest() {

        WebElement select =
                driver.findElement(
                        By.cssSelector(
                                ".ra-rows-select"
                        )
                );

        List<WebElement> options =
                select.findElements(
                        By.tagName("option")
                );

        assertEquals(
                4,
                options.size()
        );

        assertTrue(
                optionExists(select, "10")
        );

        assertTrue(
                optionExists(select, "30")
        );

        assertTrue(
                optionExists(select, "50")
        );

        assertTrue(
                optionExists(select, "All")
        );
    }

    // =========================================================
    // TEST 36 - PAGINATION 30
    // =========================================================

    @Test
    public void pagination30Test() {

        WebElement select =
                getRowsSelect();

        new Select(select)
                .selectByVisibleText("30");

        assertEquals(
                "30",
                new Select(select)
                        .getFirstSelectedOption()
                        .getText()
        );
    }

    // =========================================================
    // TEST 37 - PAGINATION 50
    // =========================================================

    @Test
    public void pagination50Test() {

        WebElement select =
                getRowsSelect();

        new Select(select)
                .selectByVisibleText("50");

        assertEquals(
                "50",
                new Select(select)
                        .getFirstSelectedOption()
                        .getText()
        );
    }

    // =========================================================
    // TEST 38 - PAGINATION ALL
    // =========================================================

    @Test
    public void paginationAllTest() {

        WebElement select =
                getRowsSelect();

        new Select(select)
                .selectByVisibleText("All");

        assertEquals(
                "All",
                new Select(select)
                        .getFirstSelectedOption()
                        .getText()
        );
    }

    // =========================================================
    // TEST 39 - PAGINATION INFORMATION
    // =========================================================

    @Test
    public void paginationInfoTest() {

        WebElement info =
                driver.findElement(
                        By.cssSelector(
                                ".ra-pagination-info"
                        )
                );

        assertTrue(
                info.getText().contains(
                        "Showing"
                )
        );

        assertTrue(
                info.getText().contains(
                        "requests"
                )
        );
    }

    // =========================================================
    // TEST 40 - SIDEBAR NAVIGATION
    // =========================================================

    @Test
    public void sidebarNavigationTest() {

        List<WebElement> items =
                driver.findElements(
                        By.cssSelector(
                                ".ra-sidebar-item"
                        )
                );

        assertEquals(
                5,
                items.size()
        );

        assertEquals(
                "Dashboard",
                items.get(0).getText().trim()
        );

        assertEquals(
                "Asset Management",
                items.get(1).getText().trim()
        );

        assertEquals(
                "Asset Assignment",
                items.get(2).getText().trim()
        );

        assertEquals(
                "Request Approval",
                items.get(3).getText().trim()
        );

        assertEquals(
                "Maintenance",
                items.get(4).getText().trim()
        );
    }

    // =========================================================
    // TEST 41 - BACK BUTTON
    // =========================================================

    @Test
    public void backButtonTest() {

        WebElement back =
                driver.findElement(
                        By.cssSelector(
                                ".ra-back-btn"
                        )
                );

        assertTrue(
                back.isDisplayed()
        );

        assertEquals(
                "← Back",
                back.getText().trim()
        );
    }

    // =========================================================
    // TEST 42 - SEARCH BY EMPLOYEE + TYPE
    // =========================================================

    @Test
    public void employeeAndAssetTypeSearchTest() {

        WebElement input =
                getEmployeeIdInput();

        input.clear();

        input.sendKeys(
                "260808001"
        );

        selectAssetType("Laptop");

        clickSearch();

        sleep(500);

        assertEquals(
                "260808001",
                input.getAttribute("value")
        );

        assertEquals(
                "Laptop",
                getSelectedAssetType()
        );
    }

    // =========================================================
    // TEST 43 - SEARCH ERROR CLEARS ON INPUT
    // =========================================================

    @Test
    public void searchErrorClearsOnInputTest() {

        getEmployeeIdInput().clear();

        selectAssetType("All Assets");

        clickSearch();

        waitForSearchError();

        WebElement input =
                getEmployeeIdInput();

        input.sendKeys("260808001");

        assertTrue(
                driver.findElements(
                        By.cssSelector(
                                ".ra-search-error"
                        )
                ).isEmpty()
        );
    }

    // =========================================================
    // TEST 44 - REJECTION ERROR CLEARS ON INPUT
    // =========================================================

    @Test
    public void rejectionErrorClearsOnInputTest() {

        selectFirstRequest();

        clickReject();

        waitForRejectError();

        WebElement textarea =
                getRejectionTextarea();

        textarea.sendKeys(
                "Valid reason"
        );

        assertTrue(
                driver.findElements(
                        By.cssSelector(
                                ".ra-error"
                        )
                ).isEmpty()
        );
    }

    // =========================================================
    // HELPER - EMPLOYEE ID
    // =========================================================

    private WebElement getEmployeeIdInput() {

        return new WebDriverWait(
                driver,
                WAIT_TIME
        ).until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ra-search-row input"
                        )
                )
        );
    }

    // =========================================================
    // HELPER - ASSET TYPE
    // =========================================================

    private WebElement getAssetTypeSelect() {

        return new WebDriverWait(
                driver,
                WAIT_TIME
        ).until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ra-search-row select"
                        )
                )
        );
    }

    // =========================================================
    // HELPER - SELECT TYPE
    // =========================================================

    private void selectAssetType(
            String type
    ) {

        Select select =
                new Select(
                        getAssetTypeSelect()
                );

        select.selectByVisibleText(type);
    }

    // =========================================================
    // HELPER - SELECTED TYPE
    // =========================================================

    private String getSelectedAssetType() {

        return new Select(
                getAssetTypeSelect()
        )
                .getFirstSelectedOption()
                .getText()
                .trim();
    }

    // =========================================================
    // HELPER - SEARCH
    // =========================================================

    private void clickSearch() {

        WebElement button =
                driver.findElement(
                        By.cssSelector(
                                ".ra-search-btn"
                        )
                );

        safeClick(button);
    }

    // =========================================================
    // HELPER - SEARCH ERROR
    // =========================================================

    private WebElement waitForSearchError() {

        return new WebDriverWait(
                driver,
                WAIT_TIME
        ).until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ra-search-error"
                        )
                )
        );
    }

    // =========================================================
    // HELPER - SELECT FIRST REQUEST
    // =========================================================

    private void selectFirstRequest() {

        List<WebElement> rows =
                driver.findElements(
                        By.cssSelector(
                                ".ra-table-row"
                        )
                );

        if (rows.isEmpty()) {

            fail(
                    "No request is available for Request Approval testing."
            );
        }

        safeClick(rows.get(0));

        new WebDriverWait(
                driver,
                WAIT_TIME
        ).until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ra-card--details"
                        )
                )
        );
    }

    // =========================================================
    // HELPER - REJECTION TEXTAREA
    // =========================================================

    private WebElement getRejectionTextarea() {

        return new WebDriverWait(
                driver,
                WAIT_TIME
        ).until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ra-textarea"
                        )
                )
        );
    }

    // =========================================================
    // HELPER - REJECT
    // =========================================================

    private void clickReject() {

        WebElement reject =
                driver.findElement(
                        By.cssSelector(
                                ".ra-reject-btn"
                        )
                );

        safeClick(reject);
    }

    // =========================================================
    // HELPER - REJECT ERROR
    // =========================================================

    private WebElement waitForRejectError() {

        return new WebDriverWait(
                driver,
                WAIT_TIME
        ).until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".ra-error"
                        )
                )
        );
    }

    // =========================================================
    // HELPER - ROWS SELECT
    // =========================================================

    private WebElement getRowsSelect() {

        return driver.findElement(
                By.cssSelector(
                        ".ra-rows-select"
                )
        );
    }

    // =========================================================
    // HELPER - OPTION EXISTS
    // =========================================================

    private boolean optionExists(
            WebElement select,
            String optionText
    ) {

        List<WebElement> options =
                select.findElements(
                        By.tagName("option")
                );

        for (WebElement option : options) {

            if (option.getText()
                    .trim()
                    .equals(optionText)) {

                return true;
            }
        }

        return false;
    }

    // =========================================================
    // HELPER - FIND VISIBLE
    // =========================================================

    private WebElement findVisible(
            By... locators
    ) {

        for (By locator : locators) {

            List<WebElement> elements =
                    driver.findElements(locator);

            for (WebElement element : elements) {

                try {

                    if (element.isDisplayed()) {
                        return element;
                    }

                } catch (Exception ignored) {
                }
            }
        }

        return null;
    }

    // =========================================================
    // HELPER - SAFE CLICK
    // =========================================================

    private void safeClick(
            WebElement element
    ) {

        try {

            scrollIntoView(element);

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(8)
            ).until(
                    ExpectedConditions.elementToBeClickable(
                            element
                    )
            );

            element.click();

        } catch (Exception e) {

            ((JavascriptExecutor) driver)
                    .executeScript(
                            "arguments[0].click();",
                            element
                    );
        }
    }

    // =========================================================
    // HELPER - SCROLL
    // =========================================================

    private void scrollIntoView(
            WebElement element
    ) {

        ((JavascriptExecutor) driver)
                .executeScript(
                        "arguments[0].scrollIntoView({"
                                + "block:'center'"
                                + "});",
                        element
                );
    }

    // =========================================================
    // HELPER - ALERT
    // =========================================================

    private void acceptAlertIfPresent() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(3)
            ).until(
                    ExpectedConditions.alertIsPresent()
            );

            driver.switchTo()
                    .alert()
                    .accept();

        } catch (Exception ignored) {
        }
    }

    // =========================================================
    // HELPER - PAGE LOAD
    // =========================================================

    private void waitForPageLoad() {

        try {

            new WebDriverWait(
                    driver,
                    WAIT_TIME
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
    // HELPER - SLEEP
    // =========================================================

    private void sleep(long milliseconds) {

        try {

            Thread.sleep(milliseconds);

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();
        }
    }
}
