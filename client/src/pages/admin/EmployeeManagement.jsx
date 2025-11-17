import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "../../context/Toast.jsx";
// Assuming your components are in these paths
// import  AddEmployeeModal  from '../../components/admin/AddEmployeeModal.jsx';
// import  EditEmployeeModal  from '../../components/admin/EditEmployeeModal.jsx';
import { useEmployeeStore } from "../../store/useEmployeeStore.js";
import useAuthStore from "../../store/authStore.js";
import Sidebar from "../../components/admin/Sidebar.jsx";

// --- 1. Add Employee Modal Component ---
const AddEmployeeModal = ({ isOpen, onClose, onAddEmployee, managers }) => {
  if (!isOpen) return null;

  // --- State for all form fields ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [managerId, setManagerId] = useState(""); // Changed from 'manager'
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");

  // Custom styles for this modal's inputs
  const inputBaseStyle =
    "block w-full rounded-lg border-0 bg-[#2b2a40] py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[#5048e5]/50 sm:text-sm sm:leading-6";

  const handleSubmit = async (e) => {
    e.preventDefault();
    // This object *exactly* matches your req.body
    const newEmployeeData = {
      firstName,
      lastName,
      email,
      department,
      jobTitle,
      managerId: managerId || null, // Send null if empty
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean), // Send as array
      location,
    };
    console.log("Submitting New Employee:", newEmployeeData);
    try {
      // Call the "add employee" function from props (from Zustand)
      await onAddEmployee(newEmployeeData);
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Failed to create employee:", error);
      // Handle error (e.g., show a toast)
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#1f1e31] rounded-xl shadow-2xl my-8 font-['Inter'] flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-8 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
                Add Employee
              </h1>
              <p className="text-sm text-gray-400">
                Enter the details below to add a new member to your
                organization.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5048e5] focus:ring-offset-[#1f1e31]"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto px-8 custom-scrollbar">
          {/* Form now has an onSubmit handler */}
          <form className="pb-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              {/* First Name */}
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="first-name"
                >
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    className={inputBaseStyle}
                    id="first-name"
                    name="first-name"
                    type="text"
                    placeholder="e.g. Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="last-name"
                >
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                    className={inputBaseStyle}
                    id="last-name"
                    name="last-name"
                    type="text"
                    placeholder="e.g. Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    className={inputBaseStyle}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g. jane.doe@workorbit.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="department"
                >
                  Department
                </label>
                <div className="mt-2">
                  <select
                    className={inputBaseStyle}
                    id="department"
                    name="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  >
                    <option disabled value="">
                      Select a department
                    </option>
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Support">Support</option>
                    <option value="Product">Product</option>
                  </select>
                </div>
              </div>

              {/* Job Title */}
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="job-title"
                >
                  Job Title
                </label>
                <div className="mt-2">
                  <input
                    className={inputBaseStyle}
                    id="job-title"
                    name="job-title"
                    type="text"
                    placeholder="e.g. Product Manager"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Manager */}
              <div className="sm:col-span-2">
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="manager"
                >
                  Manager
                </label>
                <div className="mt-2">
                  <select
                    className={inputBaseStyle}
                    id="manager"
                    name="manager"
                    value={managerId}
                    onChange={(e) => setManagerId(e.target.value)}
                    // NOT required
                  >
                    <option value="">Select a manager (Optional)</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div className="sm:col-span-2">
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="skills"
                >
                  Skills
                </label>
                <div className="mt-2">
                  <input
                    className={inputBaseStyle}
                    id="skills"
                    name="skills"
                    type="text"
                    placeholder="e.g. UI Design, React, Project Management"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Enter skills separated by a comma.
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="location"
                >
                  Location
                </label>
                <div className="mt-2">
                  <input
                    className={inputBaseStyle}
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer: Buttons are now part of the form */}
            <div className="flex items-center justify-end gap-4 pt-8 bg-[#1f1e31]">
              <button
                type="button" // Prevent form submission
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-300 bg-gray-700 border border-gray-600 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5048e5] focus:ring-offset-[#1f1e31]"
              >
                Cancel
              </button>
              <button
                type="submit" // Submit the form
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#6366F1]/90 hover:to-[#8B5CF6]/90 focus:outline-null focus:ring-2 focus:ring-offset-2 focus:ring-[#5048e5] focus:ring-offset-[#1f1e31]"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- 2. Edit Employee Modal Component ---
const EditEmployeeModal = ({
  isOpen,
  onClose,
  employee,
  onUpdateEmployee,
  managers,
}) => {
  if (!isOpen) return null;

  // --- Use the SAME input style as Add modal ---
  const inputBaseStyle =
    "block w-full rounded-lg border-0 bg-[#2b2a40] py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[#5048e5]/50 sm:text-sm sm:leading-6";

  // --- State for form fields, initialized from the `employee` prop ---
  const [firstName, setFirstName] = useState(employee.firstName || "");
  const [lastName, setLastName] = useState(employee.lastName || "");
  const [email, setEmail] = useState(employee.email || "");
  const [department, setDepartment] = useState(employee.department || "");
  const [jobTitle, setJobTitle] = useState(employee.jobTitle || "");
  const [managerId, setManagerId] = useState(employee.managerId || ""); // Use the transformed managerId
  const [location, setLocation] = useState(employee.location || "");
  const [skills, setSkills] = useState(
    employee.skills ? employee.skills.join(", ") : ""
  );

  // --- Reset form state if the `employee` prop changes ---
  useEffect(() => {
    if (employee) {
      setFirstName(employee.firstName || "");
      setLastName(employee.lastName || "");
      setEmail(employee.email || "");
      setDepartment(employee.department || "");
      setJobTitle(employee.jobTitle || "");
      setManagerId(employee.managerId || ""); // Use managerId from transformed object
      setLocation(employee.location || "");
      setSkills(employee.skills ? employee.skills.join(", ") : "");
    }
  }, [employee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // This object *exactly* matches your req.body
    const employeeUpdateData = {
      firstName,
      lastName,
      email,
      department,
      jobTitle,
      managerId: managerId || null, // Send null if empty
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean), // Send as array
      location,
    };

    try {
      // Call the "update employee" function from props (from Zustand)
      await onUpdateEmployee(employee.id, employeeUpdateData); // employee.id is the _id
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Failed to update employee:", error);
      // Handle error
    }
  };

  return (
    // Use AddModal's backdrop style
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content: Use AddModal's wrapper style: max-w-2xl, bg-[#1f1e31], flex, max-h */}
      <div className="relative w-full max-w-2xl bg-[#1f1e31] rounded-xl shadow-2xl my-8 font-['Inter'] flex flex-col max-h-[90vh]">
        {/* Use AddModal's Header structure */}
        <div className="p-8 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
                Edit Employee
              </h1>
              <p className="text-sm text-gray-400">
                Update the details for this team member.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5048e5] focus:ring-offset-[#1f1e31]"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        {/* Use AddModal's Body (scrollable) structure */}
        <div className="overflow-y-auto px-8 custom-scrollbar">
          {/* Form now has an onSubmit handler and pb-8 */}
          <form className="pb-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="edit-first-name"
                >
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    className={inputBaseStyle} // Use new base style
                    id="edit-first-name"
                    name="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="edit-last-name"
                >
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                    className={inputBaseStyle} // Use new base style
                    id="edit-last-name"
                    name="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="edit-email"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    className={inputBaseStyle} // Use new base style
                    id="edit-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="edit-department"
                >
                  Department
                </label>
                <div className="mt-2">
                  <select
                    className={inputBaseStyle} // Use new base style
                    id="edit-department"
                    name="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Support">Support</option>
                    <option value="Product">Product</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="edit-job-title"
                >
                  Job Title
                </label>
                <div className="mt-2">
                  <input
                    className={inputBaseStyle} // Use new base style
                    id="edit-job-title"
                    name="job-title"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="edit-manager"
                >
                  Manager
                </label>
                <div className="mt-2">
                  <select
                    className={inputBaseStyle} // Use new base style
                    id="edit-manager"
                    name="manager"
                    value={managerId}
                    onChange={(e) => setManagerId(e.target.value)}
                    // NOT required
                  >
                    <option value="">Select a manager (Optional)</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="edit-location"
                >
                  Location
                </label>
                <div className="mt-2">
                  <select
                    className={inputBaseStyle} // Use new base style
                    id="edit-location"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  >
                    <option>New York, NY</option>
                    <option>San Francisco, CA</option>
                    <option>London, UK</option>
                    <option>Remote</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  className="block text-sm font-medium leading-6 text-gray-300"
                  htmlFor="edit-skills"
                >
                  Skills
                </label>
                <div className="mt-2">
                  <input
                    className={inputBaseStyle} // Use new base style
                    id="edit-skills"
                    name="skills"
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Enter skills separated by a comma.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer: Use AddModal's structure and button styles */}
            <div className="flex items-center justify-end gap-4 pt-8 bg-[#1f1e31]">
              <button
                type="button" // Prevent form submission
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-300 bg-gray-700 border border-gray-600 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5048e5] focus:ring-offset-[#1f1e31]"
              >
                Cancel
              </button>
              <button
                type="submit" // Submit the form
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#6366F1]/90 hover:to-[#8B5CF6]/90 focus:outline-null focus:ring-2 focus:ring-offset-2 focus:ring-[#5048e5] focus:ring-offset-[#1f1e31]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- 3. Main Dashboard Component ---

export default function EmployeeManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // --- Zustand Store Integration ---
  const { signup } = useAuthStore();
  const { showToast } = useToast();
  const {
    employees,
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    loading, // You can use this to show a loading spinner
  } = useEmployeeStore();

  // --- Fetch data on component mount ---
  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  // --- Data Transformation Layer (Backend -> UI) ---
  const transformedEmployees = useMemo(() => {
    return employees.map((emp) => ({
      id: emp._id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      name: `${emp.firstName} ${emp.lastName}`,
      email: emp.email,
      department: emp.department,
      jobTitle: emp.jobTitle,
      skills: emp.skills || [],
      userId: emp.userId || null,
      location: emp.location,
      // Handle populated manager data
      managerName: emp.managerId
        ? `${emp.managerId.firstName} ${emp.managerId.lastName}`
        : "N/A",
      // Store the manager's ID for the edit modal dropdown
      managerId: emp.managerId
        ? emp.managerId._id
        : typeof emp.managerId === "string"
        ? emp.managerId
        : null,
      // Generate placeholder image
      img: `https://placehold.co/100x100/4F46E5/FFFFFF?text=${emp.firstName[0]}${emp.lastName[0]}`,
    }));
  }, [employees]);

  // --- Create Manager Options for Dropdowns ---
  const managerOptions = useMemo(() => {
    // All employees can be managers
    return transformedEmployees.map((emp) => ({
      id: emp.id, // This is the _id
      name: emp.name,
    }));
  }, [transformedEmployees]);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  // --- Prop-passing setup for Edit Modal ---
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee); // Pass the *transformed* employee
    setIsEditModalOpen(true);
  };

  // --- Pagination Logic (Now uses transformedEmployees) ---
  const totalEmployees = transformedEmployees.length;
  const totalPages = Math.ceil(totalEmployees / employeesPerPage);

  // Calculate employees for the current page
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = transformedEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  function generateStrongPassword(length = 8) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    return password;
  }

  const createLoginForEmployee = async (email, role, employeeId) => {
    // Implement the logic to create a login for the employee
    try {
      const password = generateStrongPassword();
      let status = await signup(email, password, role, employeeId);
      if(status.ok){
        await getEmployees();
        showToast(`Login created for ${email}`, "success");
      } else {
        showToast(`Failed to create login for ${email}`, "error");
      }
    } catch (error) {
      console.error("Error creating login: ", error);
      showToast("Failed to create login.", "error");
    }
  };
  // Page change handlers
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-[#121121] font-['Inter'] text-gray-200 min-h-screen flex">
      {/* Scrollbar styles moved here to be global for this component */}
      <style>
        {`
          /* For Webkit browsers (Chrome, Safari) */
          .custom-scrollbar::-webkit-scrollbar {
            width: 10px;  /* For vertical scrollbars */
            height: 10px; /* For horizontal scrollbars */
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #2b2a40; /* A slightly lighter bg for the track */
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #5048e5; /* Primary color */
            border-radius: 10px;
            border: 2px solid #2b2a40; /* Track color as border */
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #6366F1; /* Brighter on hover */
          }
          
          /* For Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #5048e5 #2b2a40;
          }
        `}
      </style>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-y-auto h-screen">
        <header className="flex h-16 shrink-0 items-center justify-end border-b border-gray-800 bg-gray-900 px-8 sticky top-0 z-10">
          {/* ... Header content ... (unchanged) */}
          <div className="flex items-center gap-4">
            <button className="relative">
              <span className="material-symbols-outlined text-gray-300">
                notifications
              </span>
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5048e5] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5048e5]"></span>
              </span>
            </button>
            <div className="w-px h-6 bg-gray-700"></div>
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9QVwW_dDhQzgwr1vGuijpIc7R9yL_7TScYS4Jd3jS8USXnega7z7mN0WNZ1kQMCXVsHiYTig2zCsANMYKO4OeKIk0WfMHY2Y-rtXkuvIoufvMJlH66wtzfU9JRl6VQd8G_84n4Fd-y8zA1VbTL_tFM7ry-iyQiJ81_P3j12Kyej7KyDaSAOdb-dG-Iopx5cj-O8ZrLvdoP3UCGD8fD1ozMr3O1G138ff3sa0QtCOxwBt4pwpXWG9YgH2rW236BAroT2Pr57Nj9oY")',
                }}
              ></div>
              <div className="text-sm">
                <p className="font-semibold text-gray-100">Alex Grein</p>
                <p className="text-gray-400">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                Employees
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#5048e5] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#5048e5]/90"
                >
                  <span className="truncate">Add Employee</span>
                </button>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[300px]">
                <label className="flex flex-col h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                    <div className="text-gray-400 flex border border-r-0 border-gray-700 bg-gray-900 items-center justify-center pl-4 rounded-l-lg">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-100 focus:outline-0 focus:ring-2 focus:ring-[#5048e5]/50 border border-gray-700 bg-gray-900 h-full placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                      placeholder="Search employees..."
                    />
                  </div>
                </label>
              </div>
              <div className="flex gap-3">
                <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-900 px-4 border border-gray-700">
                  <p className="text-gray-200 text-sm font-medium leading-normal">
                    Department
                  </p>
                  <span className="material-symbols-outlined text-gray-400">
                    expand_more
                  </span>
                </button>
              </div>
            </div>

            {/* Added 'custom-scrollbar' class here */}
            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900 custom-scrollbar">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th
                      className="px-6 py-4 font-semibold text-gray-300"
                      scope="col"
                    >
                      Name
                    </th>
                    <th
                      className="px-6 py-4 font-semibold text-gray-300"
                      scope="col"
                    >
                      Email
                    </th>
                    <th
                      className="px-6 py-4 font-semibold text-gray-300"
                      scope="col"
                    >
                      Department
                    </th>
                    <th
                      className="px-6 py-4 font-semibold text-gray-300"
                      scope="col"
                    >
                      Job Title
                    </th>
                    <th
                      className="px-6 py-4 font-semibold text-gray-300"
                      scope="col"
                    >
                      Manager Name
                    </th>
                    <th
                      className="px-6 py-4 font-semibold text-gray-300"
                      scope="col"
                    >
                      Skills
                    </th>
                    <th
                      className="px-6 py-4 font-semibold text-gray-300"
                      scope="col"
                    >
                      Location
                    </th>
                    <th
                      className="px-6 py-4 font-semibold text-gray-300"
                      scope="col"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {/* Map over currentEmployees instead of all employees */}
                  {currentEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={emp.img}
                            alt={`${emp.name}'s profile picture`}
                          />
                          <span className="font-medium text-gray-100">
                            {emp.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {emp.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {emp.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {emp.jobTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {emp.managerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          {emp.skills.map((skill, i) => (
                            <span
                              key={i}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                i === 0
                                  ? "bg-[#5048e5]/10 text-[#5048e5]"
                                  : "bg-gray-700 text-gray-200"
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {emp.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        <div className="flex items-center gap-2">
                          {/* EDIT BUTTON: Opens the Edit Modal */}
                          <button
                            onClick={() => handleEditClick(emp)}
                            className="hover:text-[#5048e5]"
                          >
                            <span className="material-symbols-outlined text-base">
                              edit
                            </span>
                          </button>
                          <span className="text-gray-600">•</span>
                          {/* DELETE BUTTON: Now calls store function */}
                          <button
                            onClick={() => deleteEmployee(emp.id)}
                            className="hover:text-red-500"
                          >
                            <span className="material-symbols-outlined text-base">
                              delete
                            </span>
                          </button>
                          {!emp.userId && (
                            <>
                              <span className="text-gray-600">•</span>
                              <button
                                className="hover:text-green-500"
                                onClick={() =>
                                  createLoginForEmployee(
                                    emp.email,
                                    "employee",
                                    emp.id
                                  )
                                }
                              >
                                <span className="material-symbols-outlined text-base">
                                  key
                                </span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls - Now functional */}
            <div className="flex items-center justify-between mt-6 px-2">
              <span className="text-sm text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <div className="inline-flex items-center gap-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base">
                    chevron_left
                  </span>
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Render Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEmployee={createEmployee} // Pass the store function
        managers={managerOptions} // Pass the manager list
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={selectedEmployee}
        onUpdateEmployee={updateEmployee} // Pass the store function
        managers={managerOptions} // Pass the manager list
      />
    </div>
  );
}
