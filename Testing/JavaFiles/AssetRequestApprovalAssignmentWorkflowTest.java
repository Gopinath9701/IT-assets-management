package com.itams.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class AssetRequestApprovalAssignmentWorkflowTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "http://localhost:3000/";

    // HR
    private static final String HR_ID = "260822001";
    private static final String HR_PASSWORD = "Itams@2026h";

    // Asset Manager
    private static final String ASSET_MANAGER_ID = "260822002";
    private static final String ASSET_MANAGER_PASSWORD = "Itams@2026a";

    // Request employee
    private static final String EMPLOYEE_ID = "260822004";

    // Test request type.
    // RequestApproval.js does not include Headset in its search-type list,
    // so this test searches by Employee ID and selects the Headset row
    // directly from the displayed request table.
    private static final String ASSET_TYPE = "Mouse";

    private static final String APPROVE_PURPOSE =
            "Old mouse is not working";

    private static final String REJECT_PURPOSE =
            "Spare mouse required for team";

    private static final String REJECTION_REASON =
            "out of stock";


    @BeforeEach
    public void setUp() {

        System.out.println();
        System.out.println("==================================================");
        System.out.println(" ITAMS ASSET REQUEST -> APPROVAL -> ASSIGNMENT ");
        System.out.println("==================================================");

        WebDriverManager.chromedriver().setup();

        driver = new ChromeDriver();

        driver.manage().window().maximize();

        driver.manage().timeouts().implicitlyWait(
                Duration.ofSeconds(2)
        );

        driver.manage().timeouts().pageLoadTimeout(
                Duration.ofSeconds(60)
        );

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(25)
        );

        driver.get(BASE_URL);

        waitForPageReady();

        System.out.println("Application opened");
    }


    @Test
    public void completeAssetRequestApprovalAssignmentWorkflow() {

        // =========================================================
        // STEP 1 - HR LOGIN
        // =========================================================

        System.out.println();
        System.out.println("STEP 1: HR LOGIN");

        clickLogin();

        login(
                HR_ID,
                HR_PASSWORD
        );

        System.out.println("HR LOGIN PASSED");


        // =========================================================
        // STEP 2 - OPEN ASSET REQUEST
        // =========================================================

        System.out.println();
        System.out.println("STEP 2: OPEN ASSET REQUEST");

        openAssetRequestPage();

        System.out.println(
                "Asset Request page opened"
        );


        // =========================================================
        // STEP 3 - CREATE REQUEST TO APPROVE
        // =========================================================

        System.out.println();
        System.out.println(
                "STEP 3: CREATE REQUEST FOR APPROVAL"
        );

        submitAssetRequest(
                APPROVE_PURPOSE
        );

        System.out.println(
                "Approval request submitted"
        );


        // =========================================================
        // STEP 4 - CREATE REQUEST TO REJECT
        // =========================================================

        System.out.println();
        System.out.println(
                "STEP 4: CREATE REQUEST FOR REJECTION"
        );

        /*
         * After Submit Request, the ITAMS Asset Request screen remains
         * open and shows the Request History below the form. We can
         * submit the second request directly from the same form.
         *
         * Do NOT navigate back to HR Management here.
         */
        submitAssetRequest(
                REJECT_PURPOSE
        );

        System.out.println(
                "Rejection request submitted"
        );


        // =========================================================
        // STEP 5 - HR LOGOUT
        // =========================================================

        System.out.println();
        System.out.println(
                "STEP 5: HR LOGOUT"
        );

        logout();

        System.out.println(
                "HR LOGOUT PASSED"
        );


        // =========================================================
        // STEP 6 - ASSET MANAGER LOGIN
        // =========================================================

        System.out.println();
        System.out.println(
                "STEP 6: ASSET MANAGER LOGIN"
        );

        driver.get(BASE_URL);

        waitForPageReady();

        sleep(1000);

        clickLogin();

        login(
                ASSET_MANAGER_ID,
                ASSET_MANAGER_PASSWORD
        );

        System.out.println(
                "ASSET MANAGER LOGIN PASSED"
        );


        // =========================================================
        // STEP 7 - REQUEST APPROVAL
        // =========================================================

        System.out.println();
        System.out.println(
                "STEP 7: REQUEST APPROVAL"
        );

        openSidebarPage(
                "Request Approval"
        );


        // Search only by Employee ID.
        // RequestApproval.js validates Employee ID before applying the search.
        searchRequestByEmployeeId(
                EMPLOYEE_ID
        );


        // ---------------------------------------------------------
        // 7A - APPROVE FIRST REQUEST
        // ---------------------------------------------------------

        System.out.println();
        System.out.println(
                "STEP 7A: APPROVE REQUEST"
        );

        selectRequestByPurpose(
                APPROVE_PURPOSE
        );

        scrollToSelectedDetails();

        clickApprove();

        handleAllAlerts();

        System.out.println(
                "APPROVE PASSED"
        );


        // ---------------------------------------------------------
        // 7B - REJECT SECOND REQUEST
        // ---------------------------------------------------------

        System.out.println();
        System.out.println(
                "STEP 7B: REJECT REQUEST"
        );

        searchRequestByEmployeeId(
                EMPLOYEE_ID
        );

        selectRequestByPurpose(
                REJECT_PURPOSE
        );

        scrollToSelectedDetails();

        enterRejectionReason(
                REJECTION_REASON
        );

        clickReject();

        handleAllAlerts();

        System.out.println(
                "REJECT PASSED"
        );


        // =========================================================
        // STEP 8 - ASSET ASSIGNMENT
        // =========================================================

        System.out.println();
        System.out.println(
                "STEP 8: ASSET ASSIGNMENT"
        );

        openSidebarPage(
                "Asset Assignment"
        );


        searchAssignmentByEmployeeId(
                EMPLOYEE_ID
        );


        // The approved request is identified by the exact purpose
        // that we created in Step 3.
        clickAssignForPurpose(
                APPROVE_PURPOSE
        );


        // =========================================================
        // STEP 9 - CONFIRM ASSIGNMENT
        // =========================================================

        System.out.println();
        System.out.println(
                "STEP 9: CONFIRM ASSIGNMENT"
        );

        clickConfirmAssignment();

        handleAllAlerts();

        System.out.println(
                "CONFIRM ASSIGNMENT PASSED"
        );


        // =========================================================
        // STEP 10 - VERIFY ASSIGNED STATUS
        // =========================================================

        System.out.println();
        System.out.println(
                "STEP 10: VERIFY ASSIGNMENT"
        );

        searchAssignmentByEmployeeId(
                EMPLOYEE_ID
        );

        verifyAssignmentHistory();

        System.out.println(
                "ASSIGNMENT VERIFIED"
        );


        // =========================================================
        // STEP 11 - LOGOUT
        // =========================================================

        System.out.println();
        System.out.println(
                "STEP 11: ASSET MANAGER LOGOUT"
        );

        logout();

        System.out.println(
                "ASSET MANAGER LOGOUT PASSED"
        );


        // =========================================================
        // FINAL
        // =========================================================

        System.out.println();
        System.out.println(
                "=================================================="
        );

        System.out.println(
                " COMPLETE ASSET WORKFLOW PASSED"
        );

        System.out.println(
                "=================================================="
        );
    }


    // =============================================================
    // LOGIN
    // =============================================================

    private void clickLogin() {

        WebElement button =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Login']"
                                        + " | "
                                        + "//a[normalize-space()='Login']"
                                )
                        )
                );

        clickJS(button);

        wait.until(
                d -> {
                    try {
                        return findEmployeeLoginField() != null;
                    } catch (Exception e) {
                        return false;
                    }
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
                        d -> {
                            try {
                                return findEmployeeLoginField();
                            } catch (Exception e) {
                                return null;
                            }
                        }
                );

        employeeField.clear();
        employeeField.sendKeys(employeeId);

        System.out.println(
                "Employee ID entered: "
                        + employeeId
        );


        WebElement passwordField =
                wait.until(
                        d -> {
                            List<WebElement> fields =
                                    d.findElements(
                                            By.xpath(
                                                    "//input[@type='password']"
                                            )
                                    );

                            for (WebElement field : fields) {
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
                );

        passwordField.clear();
        passwordField.sendKeys(password);

        System.out.println(
                "Password entered"
        );


        WebElement loginButton =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//form//button[@type='submit']"
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

            System.out.println(
                    "Login alert: " +
                    alert.getText()
            );

            alert.accept();

            System.out.println(
                    "Login alert accepted"
            );

        } catch (TimeoutException e) {

            throw new AssertionError(
                    "Login Successful alert was not displayed."
            );
        }


        waitForPageReady();
        sleep(1200);
    }


    private WebElement findEmployeeLoginField() {

        String[] selectors = {
                "//input[@name='employeeIdOrEmail']",
                "//input[@name='employeeId']",
                "//input[contains(@placeholder,'Employee ID or Email')]",
                "//input[contains(@placeholder,'Employee ID')]",
                "//input[@type='text']"
        };


        for (String selector : selectors) {

            List<WebElement> elements =
                    driver.findElements(
                            By.xpath(selector)
                    );

            for (WebElement element : elements) {

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
        }


        throw new RuntimeException(
                "Login Employee ID/Email field not found"
        );
    }


    // =============================================================
    // OPEN ASSET REQUEST FROM HR MANAGEMENT PAGE
    // =============================================================

    private void openAssetRequestPage() {

        closeAnyOpenAlert();

        /*
         * After a request is submitted, this React page can remain on
         * the Asset Request screen. In that case the "Request Asset"
         * button is not present. Return to HR Management first.
         */
        if (isAssetRequestFormVisible()) {
            returnToHRManagement();
        }

        WebElement requestButton =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Request Asset']"
                                )
                        )
                );

        scrollTo(requestButton);
        clickJS(requestButton);

        sleep(1000);
        waitForPageReady();

        wait.until(
                d -> {
                    try {
                        String body =
                                d.findElement(By.tagName("body")).getText();

                        return body.contains("Asset Request")
                                && body.contains("Purpose")
                                && body.contains("Required Date");
                    } catch (Exception e) {
                        return false;
                    }
                }
        );

        System.out.println("Asset Request page opened");
    }


    private boolean isAssetRequestFormVisible() {

        try {
            return !driver.findElements(
                    By.xpath(
                            "//textarea[contains(@placeholder,'Purpose')]"
                    )
            ).isEmpty();

        } catch (Exception e) {
            return false;
        }
    }


    private void returnToHRManagement() {

        System.out.println(
                "Returning to HR Management page..."
        );

        /*
         * After Submit Request the React app can remain on the
         * Asset Request route. The Cancel button is not guaranteed
         * to navigate back, so do not wait on it.
         *
         * Because authentication is already stored in the
         * application, opening the root route returns to the
         * logged-in HR page without another login.
         */
        closeAnyOpenAlert();

        driver.get(BASE_URL);

        waitForPageReady();

        sleep(1500);

        closeAnyOpenAlert();

        /*
         * The HR Management page contains the Request Asset button.
         * Wait for that concrete element instead of checking only
         * the word "HR Management".
         */
        WebElement requestAsset =
                new WebDriverWait(
                        driver,
                        Duration.ofSeconds(20)
                ).until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Request Asset']"
                                )
                        )
                );

        scrollTo(requestAsset);

        System.out.println(
                "Returned to HR Management page"
        );
    }


    // =============================================================
    // ASSET REQUEST
    // =============================================================

    private void submitAssetRequest(
            String purpose
    ) {

        /*
         * Employee ID
         */
        WebElement employeeField =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//input[contains(@placeholder,'Enter Employee ID')]"
                                )
                        )
                );

        employeeField.clear();

        employeeField.sendKeys(
                EMPLOYEE_ID
        );

        System.out.println(
                "Asset Request Employee ID: "
                        + EMPLOYEE_ID
        );


        /*
         * Asset Type
         */
        WebElement assetSelect =
                wait.until(
                        d -> {

                            List<WebElement> selects =
                                    d.findElements(
                                            By.xpath(
                                                    "//select"
                                            )
                                    );

                            for (WebElement select : selects) {

                                try {

                                    if (
                                            select.isDisplayed()
                                    ) {

                                        return select;
                                    }

                                } catch (Exception ignored) {
                                }
                            }

                            return null;
                        }
                );


        Select select =
                new Select(
                        assetSelect
                );

        boolean selected = false;

        /*
         * Prefer Headset, because that is the asset type
         * requested for this workflow.
         */
        for (WebElement option :
                select.getOptions()) {

            String text =
                    option.getText().trim();

            if (
                    text.equalsIgnoreCase(
                            ASSET_TYPE
                    )
            ) {

                select.selectByVisibleText(
                        text
                );

                selected = true;
                break;
            }
        }


        /*
         * If the Asset Request UI does not expose Headset,
         * fail clearly instead of silently submitting another type.
         */
        if (!selected) {

            throw new AssertionError(
                    "Asset Request page does not contain asset type: "
                            + ASSET_TYPE
                            +
                            ". Check the AssetRequest.js asset-type options."
            );
        }


        System.out.println(
                "Asset Type selected: "
                        + ASSET_TYPE
        );


        /*
         * Purpose
         */
        WebElement purposeField =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//textarea[contains(@placeholder,'Purpose')]"
                                )
                        )
                );

        purposeField.clear();

        purposeField.sendKeys(
                purpose
        );

        System.out.println(
                "Purpose entered: "
                        + purpose
        );


        /*
         * Required date.
         * The screenshot/UI says today or within the next 10 days.
         * Use tomorrow.
         */
        LocalDate requiredDate =
                LocalDate.now().plusDays(1);

        fillRequiredDate(
                requiredDate
        );

        System.out.println(
                "Required Date: "
                        + requiredDate
        );


        /*
         * Submit Request
         */
        WebElement submitButton =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Submit Request']"
                                )
                        )
                );

        scrollTo(submitButton);

        clickJS(submitButton);

        System.out.println(
                "Submit Request clicked"
        );


        /*
         * Handle success alert.
         */
        waitForAnyAlertAndAccept();

        sleep(1200);
    }


    private void fillRequiredDate(
            LocalDate ignoredDate
    ) {

        /*
         * User requested 30-08-2026.
         * HTML <input type="date"> expects YYYY-MM-DD.
         */
        final String requestedDate = "2026-08-30";
        final String displayDate = "30-08-2026";

        List<WebElement> dateInputs =
                driver.findElements(
                        By.xpath("//input[@type='date']")
                );

        for (WebElement input : dateInputs) {

            try {

                if (
                        input.isDisplayed()
                                &&
                        input.isEnabled()
                ) {

                    setInputValue(
                            input,
                            requestedDate
                    );

                    /*
                     * Verify the browser accepted the value.
                     */
                    String value =
                            input.getAttribute("value");

                    if (
                            requestedDate.equals(value)
                    ) {
                        return;
                    }

                    /*
                     * Fallback to direct typing.
                     */
                    input.clear();
                    input.sendKeys(
                            requestedDate
                    );

                    return;

                }

            } catch (Exception ignored) {
            }
        }

        /*
         * Fallback when the page uses a normal text/date field.
         */
        List<WebElement> textDateInputs =
                driver.findElements(
                        By.xpath(
                                "//input[contains(@placeholder,'dd-mm-yyyy')"
                                + " or contains(@placeholder,'DD-MM-YYYY')]"
                        )
                );

        for (WebElement input : textDateInputs) {

            try {

                if (
                        input.isDisplayed()
                                &&
                        input.isEnabled()
                ) {

                    input.clear();
                    input.sendKeys(displayDate);

                    return;
                }

            } catch (Exception ignored) {
            }
        }

        throw new AssertionError(
                "Required Date input was not found."
        );
    }


    // =============================================================
    // REQUEST APPROVAL
    // =============================================================

    private void openSidebarPage(
            String pageName
    ) {

        closeAnyOpenAlert();

        WebElement page =
                wait.until(
                        d -> {

                            String xpath =
                                    "//*[self::button or self::a or self::div]"
                                    +
                                    "[normalize-space()='"
                                    + pageName
                                    + "']";

                            return findVisibleElement(
                                    d,
                                    By.xpath(xpath)
                            );
                        }
                );


        scrollTo(page);

        clickJS(page);

        sleep(1200);

        waitForPageReady();

        System.out.println(
                pageName
                        + " page opened"
        );
    }


    private void searchRequestByEmployeeId(
            String employeeId
    ) {

        WebElement search =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//input[contains(@placeholder,'Enter employee ID')]"
                                )
                        )
                );

        search.clear();

        search.sendKeys(
                employeeId
        );


        WebElement searchButton =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Search']"
                                )
                        )
                );

        clickJS(searchButton);

        sleep(1200);


        /*
         * Verify that the requested employee is visible
         * in the results.
         */
        wait.until(
                d -> {

                    String body =
                            d.findElement(
                                    By.tagName("body")
                            ).getText();

                    return body.contains(
                            employeeId
                    );
                }
        );


        System.out.println(
                "Request Approval searched Employee ID: "
                        + employeeId
        );
    }


    private void selectRequestByPurpose(
            String purpose
    ) {

        WebDriverWait rowWait =
                new WebDriverWait(
                        driver,
                        Duration.ofSeconds(20)
                );


        WebElement row =
                rowWait.until(
                        d -> {

                            List<WebElement> rows =
                                    d.findElements(
                                            By.xpath(
                                                    "//tr[contains(normalize-space(),'"
                                                            + purpose
                                                            + "')]"
                                            )
                                    );


                            for (WebElement candidate :
                                    rows) {

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


        scrollTo(row);

        clickJS(row);

        sleep(700);


        /*
         * Request Details should now appear.
         */
        wait.until(
                d -> {

                    String body =
                            d.findElement(
                                    By.tagName("body")
                            ).getText();

                    return body.contains(
                            "Request Details"
                    );
                }
        );


        System.out.println(
                "Selected request: "
                        + purpose
        );
    }


    private void scrollToSelectedDetails() {

        WebElement details =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//*[normalize-space()='Request Details']"
                                )
                        )
                );


        scrollTo(details);

        sleep(500);
    }


    private void clickApprove() {

        WebElement approve =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Approve']"
                                )
                        )
                );


        scrollTo(approve);

        clickJS(approve);

        System.out.println(
                "Approve clicked"
        );
    }


    private void enterRejectionReason(
            String reason
    ) {

        WebElement textarea =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//textarea[@placeholder='Enter description for rejection']"
                                )
                        )
                );


        textarea.clear();

        textarea.sendKeys(
                reason
        );


        System.out.println(
                "Rejection reason entered: "
                        + reason
        );
    }


    private void clickReject() {

        WebElement reject =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Reject']"
                                )
                        )
                );


        scrollTo(reject);

        clickJS(reject);

        System.out.println(
                "Reject clicked"
        );
    }


    // =============================================================
    // ASSET ASSIGNMENT
    // =============================================================

    private void searchAssignmentByEmployeeId(
            String employeeId
    ) {

        WebElement search =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//input[@placeholder='Enter Employee ID (e.g., 260808001)']"
                                )
                        )
                );


        search.clear();

        search.sendKeys(
                employeeId
        );


        WebElement searchButton =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Search']"
                                )
                        )
                );


        clickJS(searchButton);

        sleep(1200);


        wait.until(
                d -> {

                    String body =
                            d.findElement(
                                    By.tagName("body")
                            ).getText();

                    return body.contains(
                            employeeId
                    );
                }
        );


        System.out.println(
                "Asset Assignment searched Employee ID: "
                        + employeeId
        );
    }


    private void clickAssignForPurpose(
            String purpose
    ) {

        WebDriverWait rowWait =
                new WebDriverWait(
                        driver,
                        Duration.ofSeconds(20)
                );


        WebElement row =
                rowWait.until(
                        d -> {

                            List<WebElement> rows =
                                    d.findElements(
                                            By.xpath(
                                                    "//tr[contains(normalize-space(),'"
                                                            + purpose
                                                            + "')]"
                                            )
                                    );


                            for (WebElement candidate :
                                    rows) {

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


        scrollTo(row);

        WebElement assignButton =
                row.findElement(
                        By.xpath(
                                ".//button[normalize-space()='Assign']"
                        )
                );


        clickJS(assignButton);

        sleep(800);


        /*
         * Assign modal.
         */
        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='Assign Asset']"
                        )
                )
        );


        System.out.println(
                "Assign button clicked"
        );
    }


    private void clickConfirmAssignment() {

        WebElement confirm =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Confirm Assignment']"
                                )
                        )
                );


        scrollTo(confirm);

        clickJS(confirm);

        sleep(1000);

        System.out.println(
                "Confirm Assignment clicked"
        );
    }


    private void verifyAssignmentHistory() {

        WebElement historyHeading =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//*[normalize-space()='Assignment History (Already Assigned Assets)']"
                                )
                        )
                );


        scrollTo(historyHeading);

        sleep(500);


        /*
         * Check that the assignment history contains the employee
         * and Assigned status.
         */
        wait.until(
                d -> {

                    String body =
                            d.findElement(
                                    By.tagName("body")
                            ).getText();

                    return body.contains(
                            EMPLOYEE_ID
                    )
                            &&
                            body.contains(
                                    "Assigned"
                            );
                }
        );


        System.out.println(
                "Assignment history shows Assigned"
        );
    }


    // =============================================================
    // LOGOUT
    // =============================================================

    private void logout() {

        closeAnyOpenAlert();

        WebElement logout =
                wait.until(
                        d -> findVisibleElement(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Logout']"
                                        + " | "
                                        + "//a[normalize-space()='Logout']"
                                )
                        )
                );


        scrollTo(logout);

        clickJS(logout);

        sleep(900);

        closeAnyOpenAlert();

        System.out.println(
                "Logout clicked"
        );
    }


    // =============================================================
    // ALERTS
    // =============================================================

    private void waitForAnyAlertAndAccept() {

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
                    "Alert: "
                            + message
            );


            String lower =
                    message == null
                            ? ""
                            : message.toLowerCase();


            alert.accept();


            if (
                    lower.contains("error")
                            ||
                    lower.contains("failed")
                            ||
                    lower.contains("unable")
                            ||
                    lower.contains("violates")
            ) {

                throw new AssertionError(
                        "Application returned error alert: "
                                + message
                );
            }

        } catch (TimeoutException e) {

            throw new AssertionError(
                    "Expected application alert was not displayed."
            );
        }
    }


    private void handleAllAlerts() {

        for (int i = 0; i < 5; i++) {

            try {

                Alert alert =
                        new WebDriverWait(
                                driver,
                                Duration.ofSeconds(2)
                        ).until(
                                ExpectedConditions.alertIsPresent()
                        );


                String message =
                        alert.getText();


                System.out.println(
                        "Alert: "
                                + message
                );


                String lower =
                        message == null
                                ? ""
                                : message.toLowerCase();


                alert.accept();


                if (
                        lower.contains("error")
                                ||
                        lower.contains("failed")
                                ||
                        lower.contains("unable")
                                ||
                        lower.contains("violates")
                ) {

                    throw new AssertionError(
                            "Application returned error alert: "
                                    + message
                    );
                }


                sleep(300);

            } catch (TimeoutException e) {

                break;
            }
        }
    }


    private void closeAnyOpenAlert() {

        for (int i = 0; i < 3; i++) {

            try {

                Alert alert =
                        new WebDriverWait(
                                driver,
                                Duration.ofSeconds(1)
                        ).until(
                                ExpectedConditions.alertIsPresent()
                        );

                System.out.println(
                        "Closing alert: "
                                + alert.getText()
                );

                alert.accept();

                sleep(300);

            } catch (TimeoutException e) {

                break;
            }
        }
    }


    // =============================================================
    // UTILITY
    // =============================================================

    private WebElement findVisibleElement(
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


    private void setInputValue(
            WebElement element,
            String value
    ) {

        JavascriptExecutor js =
                (JavascriptExecutor) driver;


        js.executeScript(
                "const el = arguments[0];" +
                "const value = arguments[1];" +
                "const setter = Object.getOwnPropertyDescriptor(" +
                "HTMLInputElement.prototype, 'value').set;" +
                "setter.call(el, value);" +
                "el.dispatchEvent(new Event('input', {bubbles:true}));" +
                "el.dispatchEvent(new Event('change', {bubbles:true}));",
                element,
                value
        );
    }


    private void clickJS(
            WebElement element
    ) {

        JavascriptExecutor js =
                (JavascriptExecutor) driver;


        js.executeScript(
                "arguments[0].click();",
                element
        );
    }


    private void scrollTo(
            WebElement element
    ) {

        JavascriptExecutor js =
                (JavascriptExecutor) driver;


        js.executeScript(
                "arguments[0].scrollIntoView({block:'center'});",
                element
        );


        sleep(300);
    }


    private void waitForPageReady() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(20)
            ).until(
                    d -> {

                        try {

                            return (
                                    (JavascriptExecutor) d
                            )
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

            try {
                closeAnyOpenAlert();
            } catch (Exception ignored) {
            }

            driver.quit();

            System.out.println();
            System.out.println(
                    "Browser closed"
            );
        }
    }
}
