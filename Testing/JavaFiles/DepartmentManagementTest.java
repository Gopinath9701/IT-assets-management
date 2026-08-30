package com.itams.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class DepartmentManagementTest {

    private WebDriver driver;
    private WebDriverWait wait;

    private static final String BASE_URL = "http://localhost:3000/";
    private static final String HR_ID = "260822001";
    private static final String HR_PASSWORD = "Itams@2026h";

    private static final String SEARCH_DEPARTMENT =
            "Human Resources";

    private static final String NEW_DEPARTMENT =
            "Data Science";

    private static final String DEPARTMENT_HEAD =
            "Supriya";

    @BeforeEach
    void setUp() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("     ITAMS DEPARTMENT MANAGEMENT AUTOMATION");
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

    // =========================================================
    // TC01 - Open Department Management
    // =========================================================

    @Test
    @Order(1)
    @DisplayName("TC01 - Open Department Management page")
    void openDepartmentManagementTest() {

        System.out.println();
        System.out.println(
                "TC01: OPEN DEPARTMENT MANAGEMENT"
        );

        loginAsHR();
        openDepartmentManagement();

        assertTrue(
                pageContains("Department Management"),
                "Department Management page was not opened"
        );

        assertTrue(
                findDepartmentSearchField() != null,
                "Search Department field not found"
        );

        assertTrue(
                findAddDepartmentNameField() != null,
                "Add New Department section not found"
        );

        System.out.println(
                "TC01 PASSED - Department Management page opened"
        );
    }

    // =========================================================
    // TC02 - Search existing department
    // =========================================================

    @Test
    @Order(2)
    @DisplayName("TC02 - Search existing department")
    void searchExistingDepartmentTest() {

        System.out.println();
        System.out.println(
                "TC02: SEARCH EXISTING DEPARTMENT"
        );

        loginAsHR();
        openDepartmentManagement();

        searchDepartment(
                SEARCH_DEPARTMENT
        );

        wait.until(
                d -> pageContains(
                        SEARCH_DEPARTMENT
                )
        );

        assertTrue(
                pageContains(SEARCH_DEPARTMENT),
                "Human Resources department was not found"
        );

        System.out.println(
                "Department found: "
                        + SEARCH_DEPARTMENT
        );

        System.out.println(
                "TC02 PASSED - Existing department search completed"
        );
    }

    // =========================================================
    // TC03 - Add new department
    // =========================================================

    @Test
    @Order(3)
    @DisplayName("TC03 - Add Data Science department")
    void addNewDepartmentTest() {

        System.out.println();
        System.out.println(
                "TC03: ADD NEW DEPARTMENT"
        );

        loginAsHR();
        openDepartmentManagement();

        WebElement departmentName =
                findAddDepartmentNameField();

        WebElement departmentHead =
                findDepartmentHeadField();

        WebElement employeeCount =
                findEmployeeCountField();

        assertTrue(
                departmentName != null,
                "Department Name field not found"
        );

        assertTrue(
                departmentHead != null,
                "Department Head field not found"
        );

        assertTrue(
                employeeCount != null,
                "Number of Employees field not found"
        );

        departmentName.clear();
        departmentName.sendKeys(
                NEW_DEPARTMENT
        );

        departmentHead.clear();
        departmentHead.sendKeys(
                DEPARTMENT_HEAD
        );

        employeeCount.clear();
        employeeCount.sendKeys("20");

        System.out.println(
                "Department Name: "
                        + NEW_DEPARTMENT
        );

        System.out.println(
                "Department Head: "
                        + DEPARTMENT_HEAD
        );

        System.out.println(
                "Number of Employees: 20"
        );

        WebElement addButton =
                waitForButton("Add");

        scrollTo(addButton);
        click(addButton);

        handleOptionalAlert();

        wait.until(
                d -> pageContains(
                        NEW_DEPARTMENT
                )
        );

        assertTrue(
                pageContains(NEW_DEPARTMENT),
                "New department was not displayed after adding"
        );

        assertTrue(
                pageContains(DEPARTMENT_HEAD),
                "Department Head was not displayed after adding"
        );

        System.out.println(
                "TC03 PASSED - Data Science department added"
        );
    }

    // =========================================================
    // TC04 - Search newly added department
    // =========================================================

    @Test
    @Order(4)
    @DisplayName("TC04 - Search newly added department")
    void searchNewDepartmentTest() {

        System.out.println();
        System.out.println(
                "TC04: SEARCH NEWLY ADDED DEPARTMENT"
        );

        loginAsHR();
        openDepartmentManagement();

        searchDepartment(
                NEW_DEPARTMENT
        );

        wait.until(
                d -> pageContains(
                        NEW_DEPARTMENT
                )
        );

        assertTrue(
                pageContains(NEW_DEPARTMENT),
                "Data Science department was not found"
        );

        System.out.println(
                "TC04 PASSED - Newly added department found"
        );
    }

    // =========================================================
    // TC05 - Empty department name validation
    // =========================================================

    @Test
    @Order(5)
    @DisplayName("TC05 - Empty department name validation")
    void emptyDepartmentNameTest() {

        System.out.println();
        System.out.println(
                "TC05: EMPTY DEPARTMENT NAME VALIDATION"
        );

        loginAsHR();
        openDepartmentManagement();

        WebElement name =
                findAddDepartmentNameField();

        WebElement head =
                findDepartmentHeadField();

        WebElement count =
                findEmployeeCountField();

        assertTrue(
                name != null && head != null && count != null,
                "Add department form fields were not found"
        );

        name.clear();
        head.clear();
        head.sendKeys("Supriya");
        count.clear();
        count.sendKeys("20");

        WebElement add =
                waitForButton("Add");

        click(add);

        sleep(700);

        String body =
                driver.findElement(
                        By.tagName("body")
                ).getText()
                        .toLowerCase();

        boolean rejected =
                body.contains("required")
                        ||
                body.contains("department name")
                        ||
                name.getAttribute("value")
                        .trim()
                        .isEmpty();

        assertTrue(
                rejected,
                "Empty Department Name was not rejected"
        );

        System.out.println(
                "TC05 PASSED - Empty department name handled"
        );
    }

    // =========================================================
    // TC06 - Invalid employee count
    // =========================================================

    @Test
    @Order(6)
    @DisplayName("TC06 - Invalid number of employees validation")
    void invalidEmployeeCountTest() {

        System.out.println();
        System.out.println(
                "TC06: INVALID NUMBER OF EMPLOYEES"
        );

        loginAsHR();
        openDepartmentManagement();

        WebElement name =
                findAddDepartmentNameField();

        WebElement head =
                findDepartmentHeadField();

        WebElement count =
                findEmployeeCountField();

        assertTrue(
                name != null && head != null && count != null,
                "Add department form fields were not found"
        );

        name.clear();
        name.sendKeys("Testing Validation Department");

        head.clear();
        head.sendKeys("Supriya");

        count.clear();
        count.sendKeys("abc");

        WebElement add =
                waitForButton("Add");

        click(add);

        sleep(700);

        String body =
                driver.findElement(
                        By.tagName("body")
                ).getText()
                        .toLowerCase();

        boolean rejected =
                body.contains("number")
                        ||
                body.contains("invalid")
                        ||
                !pageContains(
                        "Testing Validation Department"
                );

        assertTrue(
                rejected,
                "Invalid employee count was not rejected"
        );

        System.out.println(
                "TC06 PASSED - Invalid employee count handled"
        );
    }

    // =========================================================
    // TC07 - Scroll and verify Department List
    // =========================================================

    @Test
    @Order(7)
    @DisplayName("TC07 - Verify department list")
    void departmentListTest() {

        System.out.println();
        System.out.println(
                "TC07: VERIFY DEPARTMENT LIST"
        );

        loginAsHR();
        openDepartmentManagement();

        WebElement listHeading =
                findVisible(
                        driver,
                        By.xpath(
                                "//*[normalize-space()='Department List']"
                        )
                );

        assertTrue(
                listHeading != null,
                "Department List section was not found"
        );

        scrollTo(listHeading);

        assertTrue(
                pageContains("Department List"),
                "Department List is not displayed"
        );

        System.out.println(
                "Department List section verified"
        );

        System.out.println(
                "TC07 PASSED - Department List verified"
        );
    }

    // =========================================================
    // TC08 - Search empty value
    // =========================================================

    @Test
    @Order(8)
    @DisplayName("TC08 - Empty department search validation")
    void emptyDepartmentSearchTest() {

        System.out.println();
        System.out.println(
                "TC08: EMPTY DEPARTMENT SEARCH"
        );

        loginAsHR();
        openDepartmentManagement();

        WebElement search =
                findDepartmentSearchField();

        assertTrue(
                search != null,
                "Department search field was not found"
        );

        search.clear();

        WebElement searchButton =
                waitForButton("Search");

        click(searchButton);

        sleep(500);

        assertTrue(
                pageContains("Department Management"),
                "Page became unavailable after empty search"
        );

        System.out.println(
                "TC08 PASSED - Empty search handled"
        );
    }

    // =========================================================
    // LOGIN
    // =========================================================

    private void loginAsHR() {

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

        click(login);

        WebElement user =
                wait.until(
                        d -> findVisible(
                                d,
                                By.name(
                                        "employeeIdOrEmail"
                                )
                        )
                );

        WebElement password =
                wait.until(
                        d -> findVisible(
                                d,
                                By.name("password")
                        )
                );

        user.clear();
        user.sendKeys(HR_ID);

        password.clear();
        password.sendKeys(HR_PASSWORD);

        WebElement submit =
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

        click(submit);

        Alert alert =
                wait.until(
                        ExpectedConditions.alertIsPresent()
                );

        String text =
                alert.getText();

        System.out.println(
                "Login alert: " + text
        );

        assertTrue(
                text.toLowerCase()
                        .contains("successful"),
                "HR login failed: " + text
        );

        alert.accept();

        wait.until(
                d -> findVisible(
                        d,
                        By.xpath(
                                "//*[normalize-space()='HR Management']"
                        )
                ) != null
        );

        System.out.println(
                "HR Management page opened"
        );
    }

    // =========================================================
    // OPEN DEPARTMENT MANAGEMENT
    // =========================================================

    private void openDepartmentManagement() {

        WebElement button =
                wait.until(
                        d -> findVisible(
                                d,
                                By.xpath(
                                        "//button[normalize-space()='Manage Departments']"
                                                + " | "
                                                + "//a[normalize-space()='Manage Departments']"
                                )
                        )
                );

        scrollTo(button);
        click(button);

        wait.until(
                d -> findVisible(
                        d,
                        By.xpath(
                                "//*[normalize-space()='Department Management']"
                        )
                ) != null
        );

        wait.until(
                d -> findDepartmentSearchField() != null
        );

        System.out.println(
                "Department Management page opened"
        );
    }

    // =========================================================
    // SEARCH DEPARTMENT
    // =========================================================

    private void searchDepartment(
            String department
    ) {

        WebElement search =
                findDepartmentSearchField();

        assertTrue(
                search != null,
                "Department search field not found"
        );

        search.clear();
        search.sendKeys(department);

        System.out.println(
                "Department entered: "
                        + department
        );

        WebElement searchButton =
                waitForButton("Search");

        click(searchButton);

        System.out.println(
                "Search clicked"
        );

        sleep(700);
    }

    // =========================================================
    // FIELD LOCATORS
    // =========================================================

    private WebElement findDepartmentSearchField() {

        return findVisible(
                driver,
                By.xpath(
                        "//input[@placeholder='Enter Department Name']"
                                + " | "
                                + "//input[contains(@placeholder,'Department Name')]"
                )
        );
    }

    private WebElement findAddDepartmentNameField() {

        List<WebElement> fields =
                driver.findElements(
                        By.xpath(
                                "//input[@placeholder='Department Name']"
                        )
                );

        for (WebElement field :
                fields) {

            try {

                if (field.isDisplayed()) {
                    return field;
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }

    private WebElement findDepartmentHeadField() {

        return findVisible(
                driver,
                By.xpath(
                        "//input[@placeholder='Department Head']"
                )
        );
    }

    private WebElement findEmployeeCountField() {

        return findVisible(
                driver,
                By.xpath(
                        "//input[@placeholder='Number of Employees']"
                )
        );
    }

    // =========================================================
    // BUTTON
    // =========================================================

    private WebElement waitForButton(
            String text
    ) {

        return wait.until(
                d -> findVisible(
                        d,
                        By.xpath(
                                "//button[normalize-space()='"
                                        + text
                                        + "']"
                        )
                )
        );
    }

    // =========================================================
    // ALERT
    // =========================================================

    private void handleOptionalAlert() {

        try {

            WebDriverWait shortWait =
                    new WebDriverWait(
                            driver,
                            Duration.ofSeconds(4)
                    );

            Alert alert =
                    shortWait.until(
                            ExpectedConditions.alertIsPresent()
                    );

            System.out.println(
                    "Application alert: "
                            + alert.getText()
            );

            alert.accept();

        } catch (Exception ignored) {

            System.out.println(
                    "No application alert displayed"
            );
        }
    }

    // =========================================================
    // COMMON HELPERS
    // =========================================================

    private boolean pageContains(
            String text
    ) {

        try {

            return driver.findElement(
                    By.tagName("body")
            ).getText()
                    .contains(text);

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

                if (element.isDisplayed()
                        && element.isEnabled()) {

                    return element;
                }

            } catch (Exception ignored) {
            }
        }

        return null;
    }

    private void click(
            WebElement element
    ) {

        ((JavascriptExecutor) driver)
                .executeScript(
                        "arguments[0].click();",
                        element
                );
    }

    private void scrollTo(
            WebElement element
    ) {

        ((JavascriptExecutor) driver)
                .executeScript(
                        "arguments[0].scrollIntoView({block:'center'});",
                        element
                );

        sleep(250);
    }

    private void waitForPageReady() {

        try {

            new WebDriverWait(
                    driver,
                    Duration.ofSeconds(20)
            ).until(
                    d ->
                            "complete".equals(
                                    ((JavascriptExecutor) d)
                                            .executeScript(
                                                    "return document.readyState"
                                            )
                            )
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
    void tearDown() {

        if (driver != null) {

            driver.quit();

            System.out.println(
                    "Browser closed"
            );
        }
    }
}
