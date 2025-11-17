import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/admin/Sidebar";
import useOnboardingStore from "../../store/onboardingStore";

// Note: this component now uses the `useOnboardingStore` zustand store to fetch
// and manage templates (checklists) and tasks. We keep small local UI state
// for modals and the currently-selected template.

// ## MAIN PAGE COMPONENT

/**
 * Main component that renders the templates page and all modals.
 */
export default function OnboardingTemplatesPage() {
  // --- State Management ---

  // Data state (fetched from backend via zustand store)
  const templatesRaw = useOnboardingStore((s) => s.templates);
  const fetchTemplates = useOnboardingStore((s) => s.fetchTemplates);
  const createTemplate = useOnboardingStore((s) => s.createTemplate);
  const updateTemplate = useOnboardingStore((s) => s.updateTemplate);
  const deleteTemplate = useOnboardingStore((s) => s.deleteTemplate);
  const addTask = useOnboardingStore((s) => s.addTask);
  const updateTask = useOnboardingStore((s) => s.updateTask);
  const deleteTask = useOnboardingStore((s) => s.deleteTask);
  const assignOnboarding = useOnboardingStore((s) => s.assignOnboarding);

  // Local UI state for template list and tasks view
  // Helper: format a date to a human readable string
  const formatDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleString();
    } catch (e) {
      return String(d);
    }
  };

  // Helper: map a server checklist object into a display-friendly shape
  const mapServerToDisplay = (t) => {
    if (!t) return null;
    return {
      id: t._id,
      name: t.title,
      description: t.description,
      tasks: (t.items || []).length,
      lastUpdated: formatDate(t.updatedAt || t.createdAt),
      items: t.items || [],
      raw: t,
    };
  };

  // derive display-friendly templates from raw server templates
  const displayTemplates = useMemo(
    () => (templatesRaw || []).map((t) => mapServerToDisplay(t)),
    [templatesRaw]
  );

  // Modal visibility state
  const [isManageTasksModalOpen, setIsManageTasksModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // State for the currently selected item
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentTasks, setCurrentTasks] = useState([]); // Tasks for the selected template

  // --- Modal Open/Close Handlers ---

  const openModal = (modalSetter, template) => {
    setSelectedTemplate(template);
    modalSetter(true);
  };

  const handleOpenManageTasks = (template) => {
    // Map server items into UI tasks when opening manage modal
    const serverTemplate =
      templatesRaw.find((t) => t._id === template.id) || null;
    const items = (serverTemplate?.items || []).map((it) => ({
      id: it.key,
      title: it.title,
      requiresApproval: !!it.requiresApproval,
      isCompleted: false,
    }));
    setCurrentTasks(items);
    const display = mapServerToDisplay(serverTemplate || template);
    setSelectedTemplate(display);
    openModal(setIsManageTasksModalOpen, display);
  };

  const handleOpenCreate = () => {
    openModal(setIsEditModalOpen, null); // Pass null for "create" mode
  };

  const handleOpenEdit = (template) => {
    const serverTemplate =
      templatesRaw.find((t) => t._id === template.id) || null;
    const display = mapServerToDisplay(serverTemplate || template);
    setSelectedTemplate(display);
    openModal(setIsEditModalOpen, display);
  };

  const handleOpenDuplicate = (template) => {
    const serverTemplate =
      templatesRaw.find((t) => t._id === template.id) || null;
    const display = mapServerToDisplay(serverTemplate || template);
    setSelectedTemplate(display);
    openModal(setIsDuplicateModalOpen, display);
  };

  const handleOpenDelete = (template) => {
    const serverTemplate =
      templatesRaw.find((t) => t._id === template.id) || null;
    const display = mapServerToDisplay(serverTemplate || template);
    setSelectedTemplate(display);
    openModal(setIsDeleteModalOpen, display);
  };

  const handleOpenAddTask = () => {
    // This is called from *within* the ManageTasks modal
    setIsManageTasksModalOpen(false); // Close task list
    setIsAddTaskModalOpen(true); // Open add task modal (selectedTemplate is already set)
  };

  const handleCloseModals = () => {
    setIsManageTasksModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsDuplicateModalOpen(false);
    setIsAddTaskModalOpen(false);
    setSelectedTemplate(null);
    setCurrentTasks([]);
  };

  /**
   * Special handler for canceling the "Add Task" modal.
   * This closes the "Add Task" modal and re-opens the "Manage Tasks" modal.
   */
  const handleCancelAddTask = () => {
    setIsAddTaskModalOpen(false);
    if (selectedTemplate) {
      // Re-open manage tasks, which will re-filter from the main `tasks` list
      handleOpenManageTasks(selectedTemplate);
    } else {
      handleCloseModals(); // Fallback
    }
  };

  // --- "Backend Ready" Handler Functions (Placeholders) ---
  // Replace console.logs with your API calls (e.g., using fetch, axios)

  /**
   * Called from Edit/Create modal.
   * @param {object} formData - { id, name, description }
   */
  const handleSaveTemplate = async (formData) => {
    // Create or update via API
    try {
      if (formData.id) {
        await updateTemplate(formData.id, {
          title: formData.name,
          description: formData.description,
        });
      } else {
        await createTemplate({
          title: formData.name,
          description: formData.description,
          items: [],
        });
      }
      await fetchTemplates();
    } catch (err) {
      console.error("Save template failed", err);
    }
    handleCloseModals();
  };

  /**
   * Called from Duplicate modal.
   * @param {string} newName - The name for the new template
   * @param {boolean} includeTasks - Whether to copy tasks
   */
  const handleDuplicateTemplate = (newName, includeTasks) => {
    (async () => {
      try {
        const payload = {
          title: newName,
          description: selectedTemplate?.description,
          items: includeTasks
            ? selectedTemplate?.raw?.items || selectedTemplate?.items || []
            : [],
        };
        await createTemplate(payload);
        await fetchTemplates();
      } catch (err) {
        console.error("Duplicate failed", err);
      }
      handleCloseModals();
    })();
  };

  /**
   * Called from Delete modal.
   */
  const handleDeleteConfirm = () => {
    (async () => {
      try {
        await deleteTemplate(selectedTemplate?.id);
        await fetchTemplates();
      } catch (err) {
        console.error("Delete failed", err);
      }
      handleCloseModals();
    })();
  };

  /**
   * Called from Add New Task modal.
   * @param {object} taskData - { title, requiresApproval }
   */
  const handleSaveNewTask = (taskData) => {
    (async () => {
      try {
        await addTask(selectedTemplate?.id, taskData);
        await fetchTemplates();
        // refresh current tasks from server
        const updated = useOnboardingStore
          .getState()
          .templates.find((t) => t._id === selectedTemplate?.id);
        const items = (updated?.items || []).map((it) => ({
          id: it.key,
          title: it.title,
          requiresApproval: !!it.requiresApproval,
          isCompleted: false,
        }));
        setCurrentTasks(items);
      } catch (err) {
        console.error("Add task failed", err);
      }
      setIsAddTaskModalOpen(false);
      setIsManageTasksModalOpen(true);
    })();
  };

  // Fetch templates on mount and derive display list
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  /**
   * Called from Manage Tasks modal.
   * @param {number} taskId - The ID of the task to toggle
   */
  const handleToggleTask = (taskId) => {
    // For template items toggling completion is not stored on the checklist; this
    // action should map to onboarding instance updates. No-op here.
    setCurrentTasks(
      currentTasks.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );
  };

  /**
   * Called from Manage Tasks modal.
   * @param {number} taskId - The ID of the task to delete
   */
  const handleDeleteTask = (taskId) => {
    (async () => {
      try {
        await deleteTask(selectedTemplate?.id, taskId);
        await fetchTemplates();
        const updated = useOnboardingStore
          .getState()
          .templates.find((t) => t._id === selectedTemplate?.id);
        const items = (updated?.items || []).map((it) => ({
          id: it.key,
          title: it.title,
          requiresApproval: !!it.requiresApproval,
          isCompleted: false,
        }));
        setCurrentTasks(items);
      } catch (err) {
        console.error("Delete task failed", err);
      }
    })();
  };

  return (
    <>
      <div className="flex min-h-screen w-full">
        {/* SideNavBar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* TopNavBar */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#272546] px-6 lg:px-10 py-4 bg-[#1a1931]">
            <div className="flex items-center gap-4 text-white">
              <div className="text-[#5048e5] size-6 flex items-center justify-center">
                <span
                  className="material-symbols-outlined fill"
                  style={{ fontSize: "24px" }}
                >
                  assignment
                </span>
              </div>
              <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                Onboarding Templates
              </h2>
            </div>
            <div className="flex flex-1 justify-end items-center gap-4">
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-[#272546] text-white/70 hover:text-white transition-colors duration-200">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                data-alt="User profile avatar"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYupjPmBWxLLf-5YyhUSRbE7LJJJz1LVmo62f6nIEj2WiPEDH72I1Rn4dIXmehs_C8wrbYpOiWE1hQP_vVijmKJFv4wwFKuQjT-HQO0FgMnoqvJvWWaxW71WaCANyKLTcABMQs0-B_KhzjVmw_qJ2hocsrr0j25iMA99YLEXNmj3WQOKv-Ro80ERFNkiZHHD1HoMU_e9CMAW40L1TDEtuUywS7xyGLOT4748Xchdx2y3bsiAOPfnzjiCpFu8qpY2zAm6trZ0pjyGM")',
                }}
              ></div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-10 bg-[#131221]">
            <div className="w-full mx-auto">
              {/* Action Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="w-full md:w-auto flex-1 md:flex-grow-[2]">
                  <label className="flex flex-col w-[full]">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                      <div className="text-[#9795c6] flex bg-[#272546] items-center justify-center pl-3 rounded-l-lg">
                        <span className="material-symbols-outlined">
                          search
                        </span>
                      </div>
                      <input
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-white/90 focus:outline-0 focus:ring-2 focus:ring-[#5048e5]/50 border-none bg-[#272546] h-full placeholder:text-[#9795c6] px-4 py-2 text-base font-normal leading-normal"
                        placeholder="Search templates..."
                        defaultValue=""
                      />
                    </div>
                  </label>
                </div>
                <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 flex-1">
                  <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#272546] px-4">
                    <p className="text-white text-sm font-medium leading-normal">
                      Sort by: Last Updated
                    </p>
                    <span className="material-symbols-outlined text-white/70">
                      expand_more
                    </span>
                  </button>
                  <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#5048e5] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#4741d0] transition-colors duration-200"
                    onClick={handleOpenCreate}
                  >
                    <span className="material-symbols-outlined">add</span>
                    <span className="truncate">Create</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-[#1a1931] rounded-xl overflow-hidden border border-solid border-[#272546]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#272546]">
                        <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                          Template Name
                        </th>
                        <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                          Tasks
                        </th>
                        <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#272546]">
                      {displayTemplates.length > 0 ? (
                        displayTemplates.map((template) => (
                          <tr
                            key={template.id}
                            className="hover:bg-[#272546]/50 transition-colors duration-200"
                          >
                            <td className="p-4 text-sm font-medium text-white">
                              {template.name}
                            </td>
                            <td className="p-4 text-sm text-white/70 max-w-xs truncate">
                              {template.description}
                            </td>
                            <td className="p-4 text-sm text-white/70">
                              {template.tasks}
                            </td>
                            <td className="p-4 text-sm text-white/70">
                              {template.lastUpdated}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#5048e5] text-sm font-semibold hover:bg-[#5048e5]/10 transition-colors"
                                  onClick={() =>
                                    handleOpenManageTasks(template)
                                  }
                                >
                                  <span className="material-symbols-outlined text-base">
                                    checklist
                                  </span>
                                  <span>Manage Tasks</span>
                                </button>
                                <button
                                  className="p-2 rounded-md text-white/70 hover:bg-[#272546] hover:text-white"
                                  onClick={() => handleOpenEdit(template)}
                                >
                                  <span className="material-symbols-outlined">
                                    edit
                                  </span>
                                </button>
                                <button
                                  className="p-2 rounded-md text-white/70 hover:bg-[#272546] hover:text-white"
                                  onClick={() => handleOpenDuplicate(template)}
                                >
                                  <span className="material-symbols-outlined">
                                    content_copy
                                  </span>
                                </button>
                                <button
                                  className="p-2 rounded-md text-red-500/80 hover:bg-red-500/20 hover:text-red-500"
                                  onClick={() => handleOpenDelete(template)}
                                >
                                  <span className="material-symbols-outlined">
                                    delete
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        // Empty State
                        <tr>
                          <td colSpan="5">
                            <div className="flex flex-col items-center justify-center text-center p-12">
                              <div className="text-[#5048e5]/50 mb-4">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-16 w-16"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-white">
                                No templates found
                              </h3>
                              <p className="text-white/60 mt-1 text-sm">
                                Click 'Create Template' to get started.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* This is where all the modals are rendered.
        They are conditionally displayed based on the 'is...ModalOpen' state.
        Each modal component is defined below.
      */}
      {isManageTasksModalOpen && (
        <ManageTasksModal
          template={selectedTemplate}
          tasks={currentTasks}
          onClose={handleCloseModals}
          onAddTask={handleOpenAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {isEditModalOpen && (
        <EditTemplateModal
          template={selectedTemplate}
          onClose={handleCloseModals}
          onSave={handleSaveTemplate}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteTemplateModal
          template={selectedTemplate}
          onClose={handleCloseModals}
          onDelete={handleDeleteConfirm}
        />
      )}

      {isDuplicateModalOpen && (
        <DuplicateTemplateModal
          template={selectedTemplate}
          onClose={handleCloseModals}
          onDuplicate={handleDuplicateTemplate}
        />
      )}

      {isAddTaskModalOpen && (
        <AddNewTaskModal
          template={selectedTemplate}
          onClose={handleCancelAddTask}
          onSave={handleSaveNewTask}
        />
      )}
    </>
  );
}

// ############################################################################
// ## MODAL COMPONENTS
// ############################################################################

/**
 * Modal: Manage Tasks
 */
function ManageTasksModal({
  template,
  tasks,
  onClose,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) {
  // This style provides the SVG for the custom checkbox
  const checkboxStyle = {
    "--checkbox-tick-svg":
      "url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(255,255,255)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')",
  };

  return (
    <div style={checkboxStyle}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-[#131221]/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex h-full min-h-screen w-full items-center justify-center p-4">
        <div className="flex w-full max-w-2xl flex-col rounded-xl bg-[#1e1c3a] shadow-2xl">
          <div className="flex items-start justify-between p-6 border-b border-white/10">
            <div className="flex flex-col gap-1">
              <p className="text-white text-2xl font-bold leading-tight tracking-tight">
                {template.name}
              </p>
              <p className="text-[#9795c6] text-base font-normal leading-normal">
                {template.description}
              </p>
            </div>
            <button
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#9795c6] transition-colors hover:bg-[#272546] hover:text-white shrink-0 ml-4"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Task List - now dynamic */}
          <div className="flex flex-col p-4 divide-y divide-white/10 max-h-[60vh] overflow-y-auto">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center justify-between gap-4 px-2 py-3 hover:bg-white/5 rounded-md"
                >
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => onToggleTask(task.id)}
                        className="h-5 w-5 rounded border-[#383663] border-2 bg-transparent text-[#5048e5] checked:bg-[#5048e5] checked:border-[#5048e5] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#5048e5] focus:outline-none"
                      />
                      <div className="flex flex-col justify-center">
                        <p
                          className={`text-white text-base font-medium leading-normal line-clamp-1 ${
                            task.isCompleted ? "line-through text-white/50" : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.requiresApproval && (
                          <p className="text-[#9795c6] text-sm font-normal leading-normal line-clamp-2">
                            Requires Approval
                          </p>
                        )}
                      </div>
                    </label>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-full hover:bg-white/10">
                      <span className="material-symbols-outlined text-[#9795c6] hover:text-white">
                        edit
                      </span>
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-red-500/20"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      <span className="material-symbols-outlined text-[#9795c6] hover:text-red-400">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8">
                <p className="text-lg font-semibold text-white">No tasks yet</p>
                <p className="text-white/60 mt-1 text-sm">
                  Click 'Add New Task' to get started.
                </p>
              </div>
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-6 border-t border-white/10">
            <button
              className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#5048e5] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#4741d0] transition-colors"
              onClick={onAddTask}
            >
              <span className="truncate">Add New Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal: Edit/Create Template
 */
function EditTemplateModal({ template, onClose, onSave }) {
  const [title, setTitle] = useState(template?.name || "");
  const [description, setDescription] = useState(template?.description || "");

  const isCreating = !template;

  const handleSaveClick = () => {
    onSave({
      id: template?.id,
      name: title,
      description: description,
    });
  };

  return (
    <div>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-[#131221]/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex h-full min-h-screen w-full items-center justify-center p-4">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 items-center justify-center py-5">
            <div className="layout-content-container flex w-full max-w-2xl flex-col rounded-xl bg-[#1c1b32] border border-[#383663]/50 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#383663] px-6 py-4">
                <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] text-white">
                  {isCreating
                    ? "Create New Template"
                    : "Edit Onboarding Template"}
                </h1>
                <button
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#9795c6] transition-colors hover:bg-[#272546] hover:text-white"
                  onClick={onClose}
                >
                  <span className="material-symbols-outlined text-xl">
                    close
                  </span>
                </button>
              </div>

              {/* Form Content */}
              <div className="flex flex-col gap-4 p-6">
                {/* Template Title Field */}
                <div className="flex flex-col">
                  <label
                    className="text-sm font-medium leading-normal text-white pb-2"
                    htmlFor="template-title"
                  >
                    Template Title
                  </label>
                  <input
                    id="template-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Sales Team Onboarding"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-[#5048e5]/50 border border-[#383663] bg-[#131221] focus:border-[#5048e5] h-14 placeholder:text-[#9795c6] px-4 py-3 text-base font-normal leading-normal"
                  />
                </div>
                {/* Description Field */}
                <div className="flex flex-col">
                  <label
                    className="text-sm font-medium leading-normal text-white pb-2"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A brief description of this template..."
                    className="flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-[#5048e5]/50 border border-[#383663] bg-[#131221] focus:border-[#5048e5] min-h-36 placeholder:text-[#9795c6] p-4 text-base font-normal leading-normal"
                  ></textarea>
                </div>
              </div>

              {/* Footer / Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-[#383663] px-6 py-4">
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#272546] text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-[#383663]"
                  onClick={onClose}
                >
                  <span className="truncate">Cancel</span>
                </button>
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#5048e5] text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-[#4741d0]"
                  onClick={handleSaveClick}
                >
                  <span className="truncate">
                    {isCreating ? "Create Template" : "Save Changes"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal: Delete Confirmation
 */
function DeleteTemplateModal({ template, onClose, onDelete }) {
  return (
    <div>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Wrapper */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Modal Container */}
        <div className="layout-container flex h-full grow flex-col items-center justify-center">
          <div className="flex w-full max-w-md flex-col items-center justify-center rounded-xl bg-[#1A202C] p-6 text-center shadow-2xl ring-1 ring-white/10">
            {/* Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-4">
              <span className="material-symbols-outlined text-4xl text-red-500">
                warning
              </span>
            </div>
            {/* Headline Text */}
            <div className="layout-content-container flex flex-col w-full">
              <h3 className="text-white tracking-tight text-2xl font-bold leading-tight pb-2 pt-1">
                Delete Template Confirmation
              </h3>
            </div>
            {/* Body Text */}
            <div className="layout-content-container flex flex-col w-full">
              <p className="text-gray-400 text-base font-normal leading-relaxed pb-6 pt-1">
                Are you sure you want to delete the{" "}
                <strong>"{template.name}"</strong> template? This action cannot
                be undone.
              </p>
            </div>
            {/* Button Group */}
            <div className="layout-content-container flex flex-col w-full">
              <div className="flex w-full justify-stretch">
                <div className="flex flex-1 gap-3 flex-row px-0 py-1 justify-center">
                  <button
                    className="flex flex-1 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#272546] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/10 transition-colors"
                    onClick={onClose}
                  >
                    <span className="truncate">Cancel</span>
                  </button>
                  <button
                    className="flex flex-1 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-red-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-700 transition-colors"
                    onClick={onDelete}
                  >
                    <span className="truncate">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal: Duplicate Template
 */
function DuplicateTemplateModal({ template, onClose, onDuplicate }) {
  const [newName, setNewName] = useState(`${template.name} (Copy)`);
  const [includeTasks, setIncludeTasks] = useState(true);

  const checkboxStyle = {
    "--checkbox-tick-svg":
      "url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(255,255,255)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')",
  };

  const handleDuplicateClick = () => {
    onDuplicate(newName, includeTasks);
  };

  return (
    <div style={checkboxStyle}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-lg overflow-hidden bg-[#1f2937] rounded-xl shadow-2xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h1 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
              Duplicate Onboarding Template
            </h1>
            <button
              className="text-slate-400 hover:text-white transition-colors"
              onClick={onClose}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <p className="text-slate-300 text-base font-normal leading-normal pb-6">
              Create a new template based on <strong>'{template.name}'</strong>.
            </p>
            <div className="flex flex-col gap-y-6">
              {/* Text Field */}
              <label className="flex flex-col w-full">
                <p className="text-white text-base font-medium leading-normal pb-2">
                  New Template Name
                </p>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-[#5048e5]/50 border border-slate-600 bg-slate-700 h-14 placeholder:text-slate-400 px-4 py-3 text-base font-normal leading-normal"
                  placeholder="e.g., Engineering Onboarding V2"
                />
              </label>
              {/* Checkbox */}
              <label className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                  checked={includeTasks}
                  onChange={(e) => setIncludeTasks(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-600 border-2 bg-transparent text-[#5048e5] checked:bg-[#5048e5] checked:border-[#5048e5] checked:bg-[image:--checkbox-tick-svg] focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-[#5048e5]/50 focus:outline-none"
                />
                <p className="text-white text-base font-normal leading-normal">
                  Include all tasks from the original template
                </p>
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 flex-wrap p-6 bg-slate-800/50 border-t border-slate-700">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent text-slate-300 hover:bg-slate-700/50 text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
              onClick={onClose}
            >
              <span className="truncate">Cancel</span>
            </button>
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#5048e5] hover:bg-[#4741d0] text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
              onClick={handleDuplicateClick}
            >
              <span className="truncate">Duplicate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal: Add New Task
 */
function AddNewTaskModal({ template, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(false);

  const checkboxStyle = {
    "--checkbox-tick-svg":
      "url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(255,255,255)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')",
  };

  const handleSaveClick = () => {
    onSave({
      title,
      requiresApproval,
    });
  };

  return (
    <div style={checkboxStyle}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-[#131221]/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex h-full min-h-screen w-full items-center justify-center p-4">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 items-center justify-center py-5">
            <div className="layout-content-container flex w-full max-w-2xl flex-col rounded-xl bg-[#1c1b32] border border-[#383663]/50 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#383663] px-6 py-4">
                <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] text-white">
                  Add New Task
                </h1>
                <button
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#9795c6] transition-colors hover:bg-[#272546] hover:text-white"
                  onClick={onClose}
                >
                  <span className="material-symbols-outlined text-xl">
                    close
                  </span>
                </button>
              </div>

              {/* Form Content */}
              <div className="flex flex-col gap-4 p-6">
                <p className="text-sm font-medium text-white/70 -mt-2">
                  Adding to: <strong>{template.name}</strong>
                </p>

                {/* Task Title Field */}
                <div className="flex flex-col">
                  <label
                    className="text-sm font-medium leading-normal text-white pb-2"
                    htmlFor="task-title"
                  >
                    Task Title
                  </label>
                  <input
                    id="task-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Schedule 30-day check-in"
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-[#5048e5]/50 border border-[#383663] bg-[#131221] focus:border-[#5048e5] h-14 placeholder:text-[#9795c6] px-4 py-3 text-base font-normal leading-normal"
                  />
                </div>

                {/* Requires Approval Checkbox */}
                <label className="flex items-center gap-x-3 mt-2">
                  <input
                    type="checkbox"
                    checked={requiresApproval}
                    onChange={(e) => setRequiresApproval(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-600 border-2 bg-transparent text-[#5048e5] checked:bg-[#5048e5] checked:border-[#5048e5] checked:bg-[image:--checkbox-tick-svg] focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1c1b32] focus:ring-[#5048e5]/50 focus:outline-none"
                  />
                  <p className="text-white text-base font-normal leading-normal">
                    This task requires manager approval
                  </p>
                </label>
              </div>

              {/* Footer / Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-[#383663] px-6 py-4">
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#272546] text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-[#383663]"
                  onClick={onClose}
                >
                  <span className="truncate">Cancel</span>
                </button>
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#5048e5] text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-[#4741d0]"
                  onClick={handleSaveClick}
                >
                  <span className="truncate">Add Task</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
