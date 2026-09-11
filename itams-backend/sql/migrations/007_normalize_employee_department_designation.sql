-- Normalizes employees.department and employees.designation to match the
-- canonical lists in AddEmployee.js / UpdateEmployee.js (DEPARTMENTS +
-- DESIGNATIONS_BY_DEPARTMENT). Existing data had drifted: a "Software
-- Development" department not in the canonical 6, plus inconsistent/generic
-- designations (case dupes like "accountant", mismatched pairs like a
-- Marketing employee with designation "Financial Analyst", etc).
--
-- Run manually against the DB (e.g. via psql or the Neon SQL editor).

SELECT department, designation, COUNT(*)
FROM employees
GROUP BY department, designation
ORDER BY department, designation;

BEGIN;

-- Software Development department did not exist in the canonical list;
-- these employees are folded into IT along with a designation fix.
UPDATE employees SET department = 'IT', designation = 'Software Developer'
WHERE employee_id IN ('240122002','240322002','240622002','250122003','250222001','250822004','250822006','260122001');

UPDATE employees SET department = 'IT', designation = 'Senior Developer'
WHERE employee_id IN ('250122001');

-- IT designation fixes (department already correct)
UPDATE employees SET designation = 'Software Developer'
WHERE employee_id IN ('230822001','240522001','241022002','250622001','251122002','251222001','260823001','260823003','260906001','260909001');

UPDATE employees SET designation = 'QA Engineer'
WHERE employee_id IN ('240722001','260906002');

UPDATE employees SET designation = 'System Administrator'
WHERE employee_id IN ('250422001');

-- HR designation fixes
UPDATE employees SET designation = 'HR Executive'
WHERE employee_id IN ('231122001','240222002','240222003','240622001','240822002','241022003','250822003','260815001');

-- Finance designation fixes
UPDATE employees SET designation = 'Accountant'
WHERE employee_id IN ('240122001','240122003','240222001','240822001','241122001','250622002','251022003','251022004','260904001','260906003','260908002','260910001');

UPDATE employees SET designation = 'Finance Manager'
WHERE employee_id IN ('260908001');

-- Marketing designation fixes
UPDATE employees SET designation = 'Marketing Executive'
WHERE employee_id IN ('250122002','250822002','250822005','251022002','260622002','260822004');

-- Operations designation fixes
UPDATE employees SET designation = 'Operations Executive'
WHERE employee_id IN ('230922001','240422002','240722003','241222002');

UPDATE employees SET designation = 'Process Analyst'
WHERE employee_id IN ('240322001','260522001');

UPDATE employees SET designation = 'Operations Manager'
WHERE employee_id IN ('260823002');

-- Sales designation fixes
UPDATE employees SET designation = 'Sales Executive'
WHERE employee_id IN ('241022001','250822001','251022001','260222002','260903001');

COMMIT;

-- Verify: every (department, designation) pair should now be one of the
-- canonical combinations below, and no "Software Development" rows remain.
SELECT department, designation, COUNT(*)
FROM employees
GROUP BY department, designation
ORDER BY department, designation;

SELECT DISTINCT department FROM employees ORDER BY department;

-- Remove department records with no employees actually assigned to them.
-- departments.employee_count is a manually-typed field from the "Add
-- Department" form, not a real count, so it can't be trusted here - this
-- checks the real employees table instead. Software Development ends up
-- with 0 after the reassignment above; the rest (Data Science, Banking,
-- Quality Assurance, Management, Marketing business) already have 0.
BEGIN;

DELETE FROM departments d
WHERE NOT EXISTS (
  SELECT 1 FROM employees e WHERE e.department = d.name
);

COMMIT;

SELECT department_id, name, employee_count FROM departments ORDER BY department_id;
