import React, { useState } from "react";import "./DepartmentManagement.css";

// =====================================================
// VALIDATION - DEPARTMENT NAME
// =====================================================
const validateDepartmentName = (name) => {
  if (name.length === 0) {
    return {
      isValid: false,
      message: "Department Name is required",
    };
  }

  if (name.trim() === "") {
    return {
      isValid: false,
      message: "Department Name cannot contain only spaces",
    };
  }

  if (name !== name.trim()) {
    return {
      isValid: false,
      message:
        "Department Name should not have leading or trailing spaces",
    };
  }

  // No multiple consecutive spaces
  if (/\s{2,}/.test(name)) {
    return {
      isValid: false,
      message:
        "Department Name should not contain multiple consecutive spaces",
    };
  }

  if (name.length < 2) {
    return {
      isValid: false,
      message:
        "Department Name must be at least 2 characters",
    };
  }

  if (name.length > 100) {
    return {
      isValid: false,
      message:
        "Department Name cannot exceed 100 characters",
    };
  }

  // ONLY LETTERS AND SPACES
  if (!/^[A-Za-z\s]+$/.test(name)) {
    return {
      isValid: false,
      message:
        "Department Name should contain only letters and spaces",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// VALIDATION - DEPARTMENT HEAD
// =====================================================
const validateDepartmentHead = (head) => {
  if (head.length === 0) {
    return {
      isValid: false,
      message: "Department Head is required",
    };
  }

  if (head.trim() === "") {
    return {
      isValid: false,
      message: "Department Head cannot contain only spaces",
    };
  }

  if (head !== head.trim()) {
    return {
      isValid: false,
      message:
        "Department Head should not have leading or trailing spaces",
    };
  }

  // No multiple consecutive spaces
  if (/\s{2,}/.test(head)) {
    return {
      isValid: false,
      message:
        "Department Head should not contain multiple consecutive spaces",
    };
  }

  if (head.length < 2) {
    return {
      isValid: false,
      message:
        "Department Head must be at least 2 characters",
    };
  }

  if (head.length > 100) {
    return {
      isValid: false,
      message:
        "Department Head cannot exceed 100 characters",
    };
  }

  // ONLY LETTERS AND SPACES
  if (!/^[A-Za-z\s]+$/.test(head)) {
    return {
      isValid: false,
      message:
        "Department Head should contain only letters and spaces",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// VALIDATION - EMPLOYEE COUNT
// =====================================================
const validateEmployeeCount = (count) => {
  if (count.length === 0) {
    return {
      isValid: false,
      message: "Number of Employees is required",
    };
  }

  if (count.trim() === "") {
    return {
      isValid: false,
      message:
        "Number of Employees cannot contain only spaces",
    };
  }

  if (count !== count.trim()) {
    return {
      isValid: false,
      message:
        "Number of Employees should not have leading or trailing spaces",
    };
  }

  // Numbers only
  if (!/^[0-9]+$/.test(count)) {
    return {
      isValid: false,
      message:
        "Number of Employees must contain numbers only",
    };
  }

  const number = Number(count);

  if (number > 1000) {
    return {
      isValid: false,
      message:
        "Number of Employees cannot exceed 1000",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// VALIDATION - SEARCH
// =====================================================
const validateSearch = (search) => {
  if (search.length === 0) {
    return {
      isValid: false,
      message:
        "Department Name is required for search",
    };
  }

  if (search.trim() === "") {
    return {
      isValid: false,
      message:
        "Search cannot contain only spaces",
    };
  }

  if (search !== search.trim()) {
    return {
      isValid: false,
      message:
        "Search should not have leading or trailing spaces",
    };
  }

  // ===================================================
  // MULTIPLE SPACES ARE ALLOWED
  // ===================================================

  // NO multiple-space validation here.
  // Example:
  // Information Technology       Department
  // is allowed.

  if (search.length < 2) {
    return {
      isValid: false,
      message:
        "Search must contain at least 2 characters",
    };
  }

  if (search.length > 100) {
    return {
      isValid: false,
      message:
        "Search cannot exceed 100 characters",
    };
  }

  // ===================================================
  // ONLY LETTERS AND SPACES
  // ===================================================

  if (!/^[A-Za-z ]+$/.test(search)) {
    return {
      isValid: false,
      message:
        "Search should contain only letters and spaces",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// =====================================================
// MAIN COMPONENT
// =====================================================
const DepartmentManagement = ({
  username = "username",
  onLogout,
  onBack,
}) => {
  // =====================================================
  // SEARCH STATES
  // =====================================================
  const [search, setSearch] = useState("");
  const [searchApplied, setSearchApplied] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchTouched, setSearchTouched] = useState(false);

  // =====================================================
  // FORM STATES
  // =====================================================
  const [departmentName, setDepartmentName] = useState("");
  const [departmentHead, setDepartmentHead] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");

  const [errors, setErrors] = useState({});

  // =====================================================
  // DEPARTMENT DATA
  // =====================================================
  const [departments, setDepartments] = useState([]);

  // =====================================================
  // FETCH DEPARTMENTS FROM BACKEND
  // =====================================================

  React.useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/departments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.departments) {
          setDepartments(
            data.departments.map((dept) => ({
              id: dept.department_id,
              name: dept.name,
              head: dept.head || "",
              employees: dept.employee_count || 0,
            }))
          );
        }
      } catch (err) {
        console.error("Fetch Departments Error:", err);
      }
    };
    fetchDepartments();
  }, []);

  // =====================================================
  // GENERATE DEPARTMENT ID
  // =====================================================
  const generateDepartmentId = () => {
    const nextNumber = departments.length + 1;

    return `DEP${String(nextNumber).padStart(3, "0")}`;
  };

  // =====================================================
  // SEARCH INPUT CHANGE
  // =====================================================
  const handleSearchChange = (e) => {
    const value = e.target.value;

    // ===================================================
    // ONLY LETTERS AND SPACES ARE ALLOWED WHILE TYPING
    // Numbers and special characters are automatically
    // rejected.
    // ===================================================

    if (!/^[A-Za-z ]*$/.test(value)) {
      return;
    }

    setSearch(value);
    setSearchTouched(false);

    if (value === "") {
      setSearchError("");
      setSearchApplied("");
      return;
    }

    const result = validateSearch(value);

    if (!result.isValid) {
      setSearchError(result.message);
    } else {
      setSearchError("");
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================
  const handleSearch = async () => {
    setSearchTouched(true);

    const result = validateSearch(search);

    if (!result.isValid) {
      setSearchError(result.message);
      setSearchApplied(null);
      return;
    }

    setSearchError("");
    setSearchApplied(search);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/departments?search=${encodeURIComponent(search)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok && data.departments) {
        setDepartments(
          data.departments.map((dept) => ({
            id: dept.department_id,
            name: dept.name,
            head: dept.head || "",
            employees: dept.employee_count || 0,
          }))
        );
      }
    } catch (err) {
      console.error("Search Departments Error:", err);
    }
  };

  // =====================================================
  // SEARCH ENTER KEY
  // =====================================================
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // =====================================================
  // FILTER DEPARTMENTS
  // =====================================================
  const filteredDepartments =
    searchApplied === null
      ? []
      : departments.filter((dept) =>
          dept.name
            .toLowerCase()
            .includes(
              (searchApplied || "").toLowerCase()
            )
        );

  // =====================================================
  // FORM VALIDATION
  // =====================================================
  const validateForm = () => {
    const newErrors = {};

    const nameResult =
      validateDepartmentName(departmentName);

    if (!nameResult.isValid) {
      newErrors.departmentName =
        nameResult.message;
    }

    const headResult =
      validateDepartmentHead(departmentHead);

    if (!headResult.isValid) {
      newErrors.departmentHead =
        headResult.message;
    }

    const countResult =
      validateEmployeeCount(employeeCount);

    if (!countResult.isValid) {
      newErrors.employeeCount =
        countResult.message;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // FIELD CHANGE HANDLER
  // =====================================================
  const handleFieldChange =
    (setter, field, validator) => (e) => {
      const value = e.target.value;

      setter(value);

      // Empty field - don't show error until Add
      if (value === "") {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
        return;
      }

      const result = validator(value);

      setErrors((prev) => ({
        ...prev,
        [field]: result.isValid
          ? ""
          : result.message,
      }));
    };

  // =====================================================
  // ADD DEPARTMENT
  // =====================================================
  const addDepartment = async () => {
    // Validate all fields
    if (!validateForm()) {
      return;
    }

    // Check duplicate locally
    const duplicate = departments.some(
      (dept) =>
        dept.name.toLowerCase() ===
        departmentName.trim().toLowerCase()
    );

    if (duplicate) {
      setErrors((prev) => ({
        ...prev,
        departmentName:
          "This Department already exists",
      }));

      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          departmentName: departmentName.trim(),
          departmentHead: departmentHead.trim(),
          employeeCount: Number(employeeCount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors((prev) => ({
            ...prev,
            departmentName: "This Department already exists",
          }));
          return;
        }
        alert(data.message || "Failed to add department.");
        return;
      }

      // Refresh departments list
      const refreshResponse = await fetch("http://localhost:5000/api/departments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const refreshData = await refreshResponse.json();
      if (refreshResponse.ok && refreshData.departments) {
        setDepartments(
          refreshData.departments.map((dept) => ({
            id: dept.department_id,
            name: dept.name,
            head: dept.head || "",
            employees: dept.employee_count || 0,
          }))
        );
      }

      // Clear form
      setDepartmentName("");
      setDepartmentHead("");
      setEmployeeCount("");
      setErrors({});
      setSearchApplied("");

      alert("✅ Department added successfully!");
    } catch (error) {
      console.error("Add Department Error:", error);
      alert("Unable to connect to server. Please make sure the backend is running.");
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================
  const handleCancel = () => {
    setDepartmentName("");
    setDepartmentHead("");
    setEmployeeCount("");
    setErrors({});
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="dm-page">

      {/* NAVBAR */}
      <nav className="dm-nav">

        <div className="dm-nav-logo">
          <span className="dm-nav-title">
            ITAMS
          </span>

          <span className="dm-nav-sub">
            IT Asset Management System
          </span>
        </div>

        <div className="dm-nav-right">

          <span className="dm-nav-user">
            {username}
          </span>

          <span className="dm-nav-divider">
            |
          </span>

          <button
            className="dm-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* BODY */}
      <div className="dm-body">

        <h1 className="dm-page-title">
          Department Management
        </h1>

        <p className="dm-page-sub">
          Manage organization departments.
        </p>

        {/* SEARCH CARD */}
        <div className="dm-card">

          <h2 className="dm-card-title">
            Search Department
          </h2>

          <div className="dm-search-row">

            <div className="dm-search-input-wrapper">

              <input
                className={`dm-input ${
                  searchError && searchTouched
                    ? "dm-input-error"
                    : ""
                }`}
                type="text"
                placeholder="Enter Department Name"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
              />

              {searchError &&
                searchTouched && (
                  <span className="dm-error-text">
                    ⚠️ {searchError}
                  </span>
                )}

            </div>

            <button
              className="dm-btn-primary"
              onClick={handleSearch}
            >
              Search
            </button>

          </div>

        </div>

        {/* ADD NEW DEPARTMENT */}
        <div className="dm-card">

          <h2 className="dm-card-title">
            Add New Department
          </h2>

          <div className="dm-add-form">

            {/* DEPARTMENT NAME */}
            <div className="dm-form-group">

              <input
                className={`dm-input ${
                  errors.departmentName
                    ? "dm-input-error"
                    : ""
                }`}
                type="text"
                placeholder="Department Name"
                value={departmentName}
                onChange={handleFieldChange(
                  setDepartmentName,
                  "departmentName",
                  validateDepartmentName
                )}
              />

              {errors.departmentName && (
                <span className="dm-error-text">
                  ⚠️ {errors.departmentName}
                </span>
              )}

            </div>

            {/* DEPARTMENT HEAD */}
            <div className="dm-form-group">

              <input
                className={`dm-input ${
                  errors.departmentHead
                    ? "dm-input-error"
                    : ""
                }`}
                type="text"
                placeholder="Department Head"
                value={departmentHead}
                onChange={handleFieldChange(
                  setDepartmentHead,
                  "departmentHead",
                  validateDepartmentHead
                )}
              />

              {errors.departmentHead && (
                <span className="dm-error-text">
                  ⚠️ {errors.departmentHead}
                </span>
              )}

            </div>

            {/* NUMBER OF EMPLOYEES */}
            <div className="dm-form-group">

              <input
                className={`dm-input ${
                  errors.employeeCount
                    ? "dm-input-error"
                    : ""
                }`}
                type="text"
                inputMode="numeric"
                placeholder="Number of Employees"
                value={employeeCount}
                onChange={handleFieldChange(
                  setEmployeeCount,
                  "employeeCount",
                  validateEmployeeCount
                )}
              />

              {errors.employeeCount && (
                <span className="dm-error-text">
                  ⚠️ {errors.employeeCount}
                </span>
              )}

            </div>

            {/* BUTTONS */}
            <div className="dm-btn-row">

              <button
                className="dm-btn-add"
                onClick={addDepartment}
              >
                Add
              </button>

              <button
                className="dm-btn-cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

        {/* DEPARTMENT LIST */}
        <div className="dm-card">

          <h2 className="dm-card-title">
            Department List
          </h2>

          <div className="dm-table-wrapper">

            <table className="dm-table">

              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Department Head</th>
                  <th>Number of Employees</th>
                </tr>
              </thead>

              <tbody>

                {filteredDepartments.length > 0 ? (

                  filteredDepartments.map(
                    (dept) => (
                      <tr key={dept.id}>

                        <td>
                          {dept.name}
                        </td>

                        <td>
                          {dept.head}
                        </td>

                        <td>
                          {dept.employees}
                        </td>

                      </tr>
                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="3"
                      className="dm-no-data"
                    >
                      No Department Found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* BACK BUTTON */}
        <button
          className="dm-back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>

    </div>
  );
};

export default DepartmentManagement;
