package com.itams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ViewEmployeeListTest extends BaseTest {

    private WebDriverWait wait;

    // =========================================================
    // HR LOGIN CREDENTIALS
    // =========================================================

    private static final String HR_ID = "260822001";
    private static final String HR_PASSWORD = "Itams@2026h";

    // =========================================================
    // EMPLOYEE USED FOR TESTING
    // =========================================================

    private static final String EMPLOYEE_ID = "260822004";


    // =========================================================
    // BEFORE EACH TEST
    // LOGIN AS HR
    // OPEN HR MANAGEMENT
    // OPEN VIEW EMPLOYEE LIST
    // =========================================================

    @BeforeEach
    public void loginAndOpenViewEmployeeList() {

        wait = new WebDriverWait(
                driver,
                Duration.ofSeconds(15)
        );

        driver.get("http://localhost:3000");

        wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.tagName("body")
                )
        );

        System.out.println("Application opened");


        // -----------------------------------------------------
        // CLICK LOGIN
        // -----------------------------------------------------

        WebElement homeLoginButton =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//button[contains(normalize-space(),'Login')]"
                                )
                        )
                );

        clickElement(homeLoginButton);


        // -----------------------------------------------------
        // ENTER HR EMPLOYEE ID
        // -----------------------------------------------------

        WebElement employeeIdField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("employeeIdOrEmail")
                        )
                );

        employeeIdField.clear();

        employeeIdField.sendKeys(HR_ID);


        // -----------------------------------------------------
        // ENTER PASSWORD
        // -----------------------------------------------------

        WebElement passwordField =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.name("password")
                        )
                );

        passwordField.clear();

        passwordField.sendKeys(HR_PASSWORD);


        // -----------------------------------------------------
        // CLICK LOGIN
        // -----------------------------------------------------

        WebElement loginButton =
                wait.until(
                        ExpectedConditions.elementToBeClickable(
                                By.xpath(
                                        "//form//button[@type='submit']"
                                )
                        )
                );

        clickElement(loginButton);


        // -----------------------------------------------------
        // HANDLE LOGIN ALERT
        // -----------------------------------------------------

        Alert alert =
                wait.until(
                        ExpectedConditions.alertIsPresent()
                );

        String alertText = alert.getText();

        System.out.println(
                "Login alert: " + alertText
        );

        assertEquals(
                "Login Successful",
                alertText,
                "HR login failed"
        );

        alert.accept();


        // -----------------------------------------------------
        // WAIT FOR ALERT TO CLOSE
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.not(
                        ExpectedConditions.alertIsPresent()
                )
        );


        // -----------------------------------------------------
        // WAIT FOR HR MANAGEMENT
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='HR Management']"
                        )
                )
        );

        System.out.println(
                "HR Management opened"
        );


        // -----------------------------------------------------
        // CLICK VIEW LIST
        // -----------------------------------------------------

        WebElement viewListButton =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                By.xpath(
                                        "//button[normalize-space()='View List']"
                                )
                        )
                );

        clickElement(viewListButton);


        // -----------------------------------------------------
        // WAIT FOR VIEW EMPLOYEE LIST
        // -----------------------------------------------------

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//*[normalize-space()='View Employee List']"
                        )
                )
        );

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".vel-input"
                        )
                )
        );

        System.out.println(
                "View Employee List opened"
        );
    }


    // =========================================================
    // TEST 1 - PAGE HEADING
    // =========================================================

    @Test
    public void verifyViewEmployeeListPageTest() {

        WebElement heading =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.xpath(
                                        "//*[normalize-space()='View Employee List']"
                                )
                        )
                );

        assertTrue(
                heading.isDisplayed()
        );

        System.out.println(
                "TEST 1 - PAGE HEADING : PASSED"
        );
    }


    // =========================================================
    // TEST 2 - SEARCH SECTION
    // =========================================================

    @Test
    public void verifySearchSectionTest() {

        WebElement searchHeading =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.xpath(
                                        "//*[normalize-space()='Search Employee']"
                                )
                        )
                );

        assertTrue(
                searchHeading.isDisplayed()
        );

        System.out.println(
                "TEST 2 - SEARCH SECTION : PASSED"
        );
    }


    // =========================================================
    // TEST 3 - EMPLOYEE LIST SECTION
    // =========================================================

    @Test
    public void verifyEmployeeListSectionTest() {

        WebElement heading =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.xpath(
                                        "//*[normalize-space()='Employee List']"
                                )
                        )
                );

        assertTrue(
                heading.isDisplayed()
        );

        System.out.println(
                "TEST 3 - EMPLOYEE LIST SECTION : PASSED"
        );
    }


    // =========================================================
    // TEST 4 - SEARCH FIELD
    // =========================================================

    @Test
    public void verifySearchFieldTest() {

        WebElement searchField =
                getSearchField();

        assertTrue(
                searchField.isDisplayed()
        );

        assertEquals(
                "9",
                searchField.getAttribute("maxlength"),
                "Search field must allow maximum 9 digits"
        );

        System.out.println(
                "TEST 4 - SEARCH FIELD : PASSED"
        );
    }


    // =========================================================
    // TEST 5 - EMPTY SEARCH
    // =========================================================

    @Test
    public void emptySearchTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        clickSearch();

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-validation-error"
                                )
                        )
                );

        assertTrue(
                error.getText().contains(
                        "Please enter an Employee ID"
                )
        );

        System.out.println(
                "TEST 5 - EMPTY SEARCH : PASSED"
        );
    }


    // =========================================================
    // TEST 6 - SHORT EMPLOYEE ID
    // =========================================================

    @Test
    public void shortEmployeeIdTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "26082200"
        );

        clickSearch();

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-validation-error"
                                )
                        )
                );

        assertTrue(
                error.getText().contains(
                        "exactly 9 digits"
                )
        );

        System.out.println(
                "TEST 6 - SHORT EMPLOYEE ID : PASSED"
        );
    }


    // =========================================================
    // TEST 7 - LONG EMPLOYEE ID
    // =========================================================

    @Test
    public void longEmployeeIdTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "260822004999"
        );

        String value =
                searchField.getAttribute("value");

        assertTrue(
                value.length() <= 9,
                "More than 9 digits were accepted"
        );

        System.out.println(
                "TEST 7 - LONG EMPLOYEE ID : PASSED"
        );
    }


    // =========================================================
    // TEST 8 - NON NUMERIC EMPLOYEE ID
    // =========================================================

    @Test
    public void nonNumericEmployeeIdTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "ABC260822004"
        );

        String value =
                searchField.getAttribute("value");

        assertTrue(
                value.matches("\\d*"),
                "Non numeric characters were accepted"
        );

        System.out.println(
                "TEST 8 - NON NUMERIC ID : PASSED"
        );
    }


    // =========================================================
    // TEST 9 - FUTURE EMPLOYEE ID
    // =========================================================

    @Test
    public void futureEmployeeIdTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "270101001"
        );

        clickSearch();

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-validation-error"
                                )
                        )
                );

        assertTrue(
                error.getText().contains(
                        "Future dates are not allowed"
                )
        );

        System.out.println(
                "TEST 9 - FUTURE EMPLOYEE ID : PASSED"
        );
    }


    // =========================================================
    // TEST 10 - INVALID MONTH
    // =========================================================

    @Test
    public void invalidMonthTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "261301001"
        );

        clickSearch();

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-validation-error"
                                )
                        )
                );

        assertTrue(
                error.getText().contains(
                        "invalid month"
                )
        );

        System.out.println(
                "TEST 10 - INVALID MONTH : PASSED"
        );
    }


    // =========================================================
    // TEST 11 - INVALID DAY
    // =========================================================

    @Test
    public void invalidDayTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "260832001"
        );

        clickSearch();

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-validation-error"
                                )
                        )
                );

        assertTrue(
                error.getText().contains(
                        "invalid day"
                )
        );

        System.out.println(
                "TEST 11 - INVALID DAY : PASSED"
        );
    }


    // =========================================================
    // TEST 12 - VALID EMPLOYEE SEARCH
    // =========================================================

    @Test
    public void validEmployeeSearchTest() {

        searchEmployee(
                EMPLOYEE_ID
        );

        String tableText =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-table"
                                )
                        )
                ).getText();

        assertTrue(
                tableText.contains(
                        EMPLOYEE_ID
                ),
                "Employee 260822004 was not displayed"
        );

        System.out.println(
                "TEST 12 - VALID EMPLOYEE SEARCH : PASSED"
        );
    }


    // =========================================================
    // TEST 13 - ENTER KEY SEARCH
    // =========================================================

    @Test
    public void enterKeySearchTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                EMPLOYEE_ID
        );

        searchField.sendKeys(
                Keys.ENTER
        );


        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='View']"
                        )
                )
        );


        String tableText =
                driver.findElement(
                        By.cssSelector(
                                ".vel-table"
                        )
                ).getText();

        assertTrue(
                tableText.contains(
                        EMPLOYEE_ID
                )
        );

        System.out.println(
                "TEST 13 - ENTER KEY SEARCH : PASSED"
        );
    }


    // =========================================================
    // TEST 14 - NON EXISTING EMPLOYEE
    // =========================================================

    @Test
    public void nonExistingEmployeeTest() {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                "260822999"
        );

        clickSearch();

        WebElement error =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-validation-error"
                                )
                        )
                );

        assertTrue(
                error.getText()
                        .toLowerCase()
                        .contains(
                                "not found"
                        )
        );

        System.out.println(
                "TEST 14 - NON EXISTING EMPLOYEE : PASSED"
        );
    }


    // =========================================================
    // TEST 15 - TABLE HEADERS
    // =========================================================

    @Test
    public void verifyTableHeadersTest() {

        WebElement table =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-table"
                                )
                        )
                );

        String text =
                table.getText();

        assertTrue(
                text.contains(
                        "Employee ID"
                )
        );

        assertTrue(
                text.contains(
                        "Department"
                )
        );

        assertTrue(
                text.contains(
                        "Status"
                )
        );

        assertTrue(
                text.contains(
                        "Action"
                )
        );

        System.out.println(
                "TEST 15 - TABLE HEADERS : PASSED"
        );
    }


    // =========================================================
    // TEST 16 - PAGE SIZE DROPDOWN
    // =========================================================

    @Test
    public void pageSizeDropdownTest() {

        WebElement pageSize =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-page-size"
                                )
                        )
                );

        Select select =
                new Select(pageSize);

        assertEquals(
                4,
                select.getOptions().size()
        );

        assertEquals(
                "10",
                select.getOptions()
                        .get(0)
                        .getText()
        );

        assertEquals(
                "30",
                select.getOptions()
                        .get(1)
                        .getText()
        );

        assertEquals(
                "50",
                select.getOptions()
                        .get(2)
                        .getText()
        );

        assertEquals(
                "All",
                select.getOptions()
                        .get(3)
                        .getText()
        );

        System.out.println(
                "TEST 16 - PAGE SIZE : PASSED"
        );
    }


    // =========================================================
    // TEST 17 - SELECT ALL PAGE SIZE
    // =========================================================

    @Test
    public void pageSizeAllTest() {

        WebElement pageSize =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-page-size"
                                )
                        )
                );

        Select select =
                new Select(pageSize);

        select.selectByVisibleText(
                "All"
        );

        assertEquals(
                "All",
                select.getFirstSelectedOption()
                        .getText()
        );

        System.out.println(
                "TEST 17 - PAGE SIZE ALL : PASSED"
        );
    }


    // =========================================================
    // TEST 18 - SEARCH RESULT COUNT
    // =========================================================

    @Test
    public void searchResultCountTest() {

        searchEmployee(
                EMPLOYEE_ID
        );

        WebElement pagination =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-pagination-info"
                                )
                        )
                );

        assertTrue(
                pagination.getText().contains(
                        "1"
                )
        );

        System.out.println(
                "TEST 18 - SEARCH RESULT COUNT : PASSED"
        );
    }


    // =========================================================
    // TEST 19 - VIEW EMPLOYEE
    // =========================================================

    @Test
    public void viewEmployeeTest() {

        openEmployeeDetails();

        WebElement detailsPanel =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                By.cssSelector(
                                        ".vel-details-panel"
                                )
                        )
                );

        assertTrue(
                detailsPanel.isDisplayed(),
                "Employee details panel is not displayed"
        );

        System.out.println(
                "TEST 19 - VIEW EMPLOYEE : PASSED"
        );
    }


    // =========================================================
    // TEST 20 - EMPLOYEE DETAILS
    // =========================================================

    @Test
    public void employeeDetailsTest() {

        openEmployeeDetails();

        WebElement detailsPanel =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                By.cssSelector(
                                        ".vel-details-panel"
                                )
                        )
                );

        String detailsText =
                detailsPanel.getText();

        System.out.println(
                "========================================"
        );

        System.out.println(
                "EMPLOYEE DETAILS:"
        );

        System.out.println(
                detailsText
        );

        System.out.println(
                "========================================"
        );


        /*
         * Verify the actual employee ID.
         */

        assertTrue(
                detailsText.contains(
                        EMPLOYEE_ID
                ),
                "Employee ID 260822004 is not displayed"
        );


        /*
         * Verify that employee information exists.
         *
         * We don't depend on one exact heading because
         * the React UI can change its labels.
         */

        boolean hasEmployeeInformation =
                detailsText.contains("Employee")
                        ||
                detailsText.contains("Name")
                        ||
                detailsText.contains("Department")
                        ||
                detailsText.contains("Email")
                        ||
                detailsText.contains("Phone");


        assertTrue(
                hasEmployeeInformation,
                "Employee information is not displayed"
        );


        System.out.println(
                "TEST 20 - EMPLOYEE DETAILS : PASSED"
        );
    }


    // =========================================================
    // TEST 21 - PERSONAL INFORMATION
    // =========================================================

    @Test
    public void personalInformationTest() {

        openEmployeeDetails();

        WebElement detailsPanel =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-details-panel"
                                )
                        )
                );

        String detailsText =
                detailsPanel.getText();


        boolean hasEmployeeId =
                detailsText.contains(
                        "Employee ID"
                )
                ||
                detailsText.contains(
                        EMPLOYEE_ID
                );

        boolean hasName =
                detailsText.contains(
                        "Employee Name"
                )
                ||
                detailsText.contains(
                        "Name"
                );

        boolean hasDepartment =
                detailsText.contains(
                        "Department"
                );

        boolean hasPhone =
                detailsText.contains(
                        "Phone"
                );

        boolean hasEmail =
                detailsText.contains(
                        "Email"
                );


        assertTrue(
                hasEmployeeId,
                "Employee ID information missing"
        );

        assertTrue(
                hasName,
                "Employee Name information missing"
        );

        assertTrue(
                hasDepartment,
                "Department information missing"
        );

        assertTrue(
                hasPhone || hasEmail,
                "Phone or Email information missing"
        );


        System.out.println(
                "TEST 21 - PERSONAL INFORMATION : PASSED"
        );
    }


    // =========================================================
    // TEST 22 - ASSIGNED ASSETS
    // =========================================================

    @Test
    public void assignedAssetsTest() {

        openEmployeeDetails();

        WebElement detailsPanel =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-details-panel"
                                )
                        )
                );

        String detailsText =
                detailsPanel.getText();


        assertTrue(
                detailsText.contains(
                        "Assigned Assets"
                ),
                "Assigned Assets section is missing"
        );


        boolean hasAssetInformation =
                detailsText.contains(
                        "Asset ID"
                )
                ||
                detailsText.contains(
                        "No Assets Assigned"
                )
                ||
                detailsText.contains(
                        "No assets assigned"
                );


        assertTrue(
                hasAssetInformation,
                "Asset information is missing"
        );


        System.out.println(
                "TEST 22 - ASSIGNED ASSETS : PASSED"
        );
    }


    // =========================================================
    // TEST 23 - CLOSE DETAILS
    // =========================================================

    @Test
    public void closeDetailsTest() {

        openEmployeeDetails();


        By closeButtonLocator =
                By.xpath(
                        "//button[normalize-space()='Close']"
                );


        /*
         * Verify Close button exists.
         */

        wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        closeButtonLocator
                )
        );


        boolean clicked = false;


        // -----------------------------------------------------
        // CLICK CLOSE BUTTON
        // -----------------------------------------------------

        for (int attempt = 1; attempt <= 5; attempt++) {

            try {

                WebElement closeButton =
                        wait.until(
                                ExpectedConditions.presenceOfElementLocated(
                                        closeButtonLocator
                                )
                        );


                JavascriptExecutor js =
                        (JavascriptExecutor) driver;


                js.executeScript(
                        "arguments[0].scrollIntoView({block:'center'});",
                        closeButton
                );


                /*
                 * Re-find after scrolling.
                 */

                closeButton =
                        driver.findElement(
                                closeButtonLocator
                        );


                js.executeScript(
                        "arguments[0].click();",
                        closeButton
                );


                clicked = true;

                break;


            } catch (
                    org.openqa.selenium.StaleElementReferenceException e
            ) {

                System.out.println(
                        "Close button stale. Retry "
                                + attempt
                );

            } catch (
                    org.openqa.selenium.ElementClickInterceptedException e
            ) {

                System.out.println(
                        "Close button intercepted. Retry "
                                + attempt
                );
            }
        }


        assertTrue(
                clicked,
                "Close button could not be clicked"
        );


        // -----------------------------------------------------
        // VERIFY CLOSE BUTTON DISAPPEARS
        // -----------------------------------------------------

        wait.until(
                driver -> {

                    try {

                        return driver.findElements(
                                closeButtonLocator
                        ).isEmpty();

                    } catch (
                            org.openqa.selenium.StaleElementReferenceException e
                    ) {

                        return true;
                    }
                }
        );


        /*
         * The Close button disappearing is the reliable
         * indication that the details view has closed.
         */

        boolean closeButtonExists =
                !driver.findElements(
                        closeButtonLocator
                ).isEmpty();


        assertTrue(
                !closeButtonExists,
                "Close button is still present after closing details"
        );


        System.out.println(
                "TEST 23 - CLOSE DETAILS : PASSED"
        );
    }


    // =========================================================
    // TEST 24 - BACK BUTTON
    // =========================================================

    @Test
    public void backButtonTest() {

        WebElement backButton =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-back-btn"
                                )
                        )
                );

        assertTrue(
                backButton.isDisplayed()
        );

        System.out.println(
                "TEST 24 - BACK BUTTON : PASSED"
        );
    }


    // =========================================================
    // TEST 25 - LOGOUT BUTTON
    // =========================================================

    @Test
    public void logoutButtonTest() {

        WebElement logoutButton =
                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-logout-btn"
                                )
                        )
                );

        assertTrue(
                logoutButton.isDisplayed()
        );

        System.out.println(
                "TEST 25 - LOGOUT BUTTON : PASSED"
        );
    }


    // =========================================================
    // HELPER - GET SEARCH FIELD
    // =========================================================

    private WebElement getSearchField() {

        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".vel-input"
                        )
                )
        );
    }


    // =========================================================
    // HELPER - CLICK SEARCH
    // =========================================================

    private void clickSearch() {

        WebElement searchButton =
                wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                By.cssSelector(
                                        ".vel-btn-primary"
                                )
                        )
                );

        clickElement(searchButton);
    }


    // =========================================================
    // HELPER - SEARCH EMPLOYEE
    // =========================================================

    private void searchEmployee(
            String employeeId
    ) {

        WebElement searchField =
                getSearchField();

        searchField.clear();

        searchField.sendKeys(
                employeeId
        );

        clickSearch();


        /*
         * Wait for the actual View button.
         * This confirms that the backend returned
         * the employee.
         */

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath(
                                "//button[normalize-space()='View']"
                        )
                )
        );

        System.out.println(
                "Employee found: " + employeeId
        );
    }


    // =========================================================
    // HELPER - OPEN EMPLOYEE DETAILS
    // =========================================================

    private void openEmployeeDetails() {

        /*
         * Search 260822004.
         */

        searchEmployee(
                EMPLOYEE_ID
        );


        /*
         * React may re-render the View button.
         * Therefore we locate it freshly and retry.
         */

        clickViewButtonSafely();


        /*
         * Wait for the details panel.
         */

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.cssSelector(
                                ".vel-details-panel"
                        )
                )
        );
    }


    // =========================================================
    // HELPER - SAFE VIEW BUTTON CLICK
    // =========================================================

    private void clickViewButtonSafely() {

        By viewButtonLocator =
                By.xpath(
                        "//button[normalize-space()='View']"
                );


        for (int attempt = 1; attempt <= 5; attempt++) {

            try {

                /*
                 * Always locate a fresh element.
                 */

                WebElement viewButton =
                        wait.until(
                                ExpectedConditions.presenceOfElementLocated(
                                        viewButtonLocator
                                )
                        );


                JavascriptExecutor js =
                        (JavascriptExecutor) driver;


                js.executeScript(
                        "arguments[0].scrollIntoView({block:'center'});",
                        viewButton
                );


                /*
                 * Find the button AGAIN after scrolling.
                 */

                viewButton =
                        wait.until(
                                ExpectedConditions.presenceOfElementLocated(
                                        viewButtonLocator
                                )
                        );


                /*
                 * JavaScript click avoids interception.
                 */

                js.executeScript(
                        "arguments[0].click();",
                        viewButton
                );


                /*
                 * Wait for details panel.
                 */

                wait.until(
                        ExpectedConditions.visibilityOfElementLocated(
                                By.cssSelector(
                                        ".vel-details-panel"
                                )
                        )
                );


                System.out.println(
                        "View button clicked successfully"
                );

                return;


            } catch (
                    org.openqa.selenium.StaleElementReferenceException e
            ) {

                System.out.println(
                        "View button became stale. Retry "
                                + attempt
                );


            } catch (
                    org.openqa.selenium.ElementClickInterceptedException e
            ) {

                System.out.println(
                        "View button intercepted. Retry "
                                + attempt
                );
            }
        }


        throw new AssertionError(
                "Unable to click View button after 5 attempts"
        );
    }


    // =========================================================
    // HELPER - SAFE GENERAL CLICK
    // =========================================================

    private void clickElement(
            WebElement element
    ) {

        JavascriptExecutor js =
                (JavascriptExecutor) driver;

        js.executeScript(
                "arguments[0].scrollIntoView({block:'center'});",
                element
        );

        js.executeScript(
                "arguments[0].click();",
                element
        );
    }
}
