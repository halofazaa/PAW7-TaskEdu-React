import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Task,
  TaskFormData,
  FilterState,
  ModalMode,
  FilterPredicate,
  Comparator
} from './types/task';
import {
  STORAGE_KEY_TASKS,
  INITIAL_COLLEGE_TASKS,
  getStorageItem,
  setStorageItem,
  filterItems,
  sortItems,
  updateItemInList,
  removeItemFromList,
  generateUniqueId
} from './utils/storage';
import { showToast } from './utils/toast';
import { Header } from './components/Header';
import { TaskStats } from './components/TaskStats';
import { TaskControls } from './components/TaskControls';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // 1. Task State (Loaded from LocalStorage with generic helper)
  const [tasks, setTasks] = useState<Task[]>(() => {
    return getStorageItem<Task[]>(STORAGE_KEY_TASKS, INITIAL_COLLEGE_TASKS);
  });

  // 2. Filter & Sort State
  const [filterState, setFilterState] = useState<FilterState>({
    status: 'all',
    priority: 'all',
    searchQuery: '',
    course: 'all',
    sortBy: 'deadline-asc'
  });

  // 3. Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Sync to LocalStorage on tasks update
  useEffect(() => {
    setStorageItem<Task[]>(STORAGE_KEY_TASKS, tasks);
  }, [tasks]);

  // Handle open create modal
  const handleOpenCreateModal = useCallback(() => {
    setModalMode('create');
    setEditingTask(null);
    setIsModalOpen(true);
  }, []);

  // Handle open edit modal
  const handleOpenEditModal = useCallback((task: Task) => {
    setModalMode('edit');
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  // Handle close modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  // Handle save (create or update)
  const handleSaveTask = useCallback(
    (formData: TaskFormData, editingId?: string) => {
      if (editingId) {
        setTasks((prevTasks) => {
          const existing = prevTasks.find((t) => t.id === editingId);
          if (!existing) return prevTasks;
          const updated: Task = {
            ...existing,
            title: formData.title,
            course: formData.course,
            deadline: formData.deadline,
            description: formData.description,
            priority: formData.priority,
            isCompleted: formData.isCompleted,
            updatedAt: Date.now()
          };
          return updateItemInList<Task>(prevTasks, updated);
        });
        showToast('Tugas berhasil diperbarui!', 'success');
      } else {
        const newTask: Task = {
          id: generateUniqueId(),
          title: formData.title,
          course: formData.course,
          deadline: formData.deadline,
          description: formData.description,
          priority: formData.priority,
          isCompleted: formData.isCompleted,
          createdAt: Date.now()
        };
        setTasks((prevTasks) => [newTask, ...prevTasks]);
        showToast('Tugas kuliah baru berhasil ditambahkan!', 'success');
      }
    },
    []
  );

  // Handle toggle task status
  const handleToggleStatus = useCallback(
    (taskId: string, isCompleted: boolean) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const updatedTask: Task = {
        ...task,
        isCompleted,
        updatedAt: Date.now()
      };

      setTasks((prevTasks) => updateItemInList<Task>(prevTasks, updatedTask));

      if (isCompleted) {
        showToast(`Tugas "${task.title}" ditandai selesai 🎉`, 'success');
      } else {
        showToast(`Tugas "${task.title}" dipindahkan ke belum selesai`, 'info');
      }
    },
    [tasks]
  );

  // Handle delete task
  const handleDeleteTask = useCallback(
    (taskId: string) => {
      const taskToDelete = tasks.find((t) => t.id === taskId);
      if (!taskToDelete) return;

      const confirmDelete = window.confirm(
        `Apakah Anda yakin ingin menghapus tugas "${taskToDelete.title}" untuk mata kuliah ${taskToDelete.course}?`
      );

      if (confirmDelete) {
        setTasks((prevTasks) => removeItemFromList<Task>(prevTasks, taskId));
        showToast(`Tugas "${taskToDelete.title}" telah dihapus`, 'danger');
      }
    },
    [tasks]
  );

  // Handle filter changes
  const handleFilterChange = useCallback((updates: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Filter and Sort tasks using generic helpers
  const filteredAndSortedTasks = useMemo(() => {
    const predicate: FilterPredicate<Task> = (task: Task): boolean => {
      // Filter Status
      if (filterState.status === 'pending' && task.isCompleted) return false;
      if (filterState.status === 'completed' && !task.isCompleted) return false;

      // Filter Prioritas
      if (filterState.priority !== 'all' && task.priority !== filterState.priority) {
        return false;
      }

      // Filter Pencarian
      if (filterState.searchQuery) {
        const query = filterState.searchQuery.trim().toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesCourse = task.course.toLowerCase().includes(query);
        const matchesDesc = (task.description || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesCourse && !matchesDesc) return false;
      }

      return true;
    };

    const filtered = filterItems<Task>(tasks, predicate);

    const comparator: Comparator<Task> = (a: Task, b: Task): number => {
      switch (filterState.sortBy) {
        case 'deadline-asc':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'deadline-desc':
          return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
        case 'created-desc':
          return b.createdAt - a.createdAt;
        case 'title-asc':
          return a.title.localeCompare(b.title, 'id');
        case 'course-asc':
          return a.course.localeCompare(b.course, 'id');
        default:
          return 0;
      }
    };

    return sortItems<Task>(filtered, comparator);
  }, [tasks, filterState]);

  // Counts for tabs
  const totalCount = tasks.length;
  const pendingCount = useMemo(() => tasks.filter((t) => !t.isCompleted).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter((t) => t.isCompleted).length, [tasks]);

  return (
    <div className="app-container">
      {/* 1. Header Bento Component */}
      <Header onAddTask={handleOpenCreateModal} />

      {/* 2. Bento Statistics Grid Component */}
      <TaskStats tasks={tasks} />

      {/* 3. Bento Filter & Controls Component */}
      <TaskControls
        filterState={filterState}
        onFilterChange={handleFilterChange}
        totalCount={totalCount}
        pendingCount={pendingCount}
        completedCount={completedCount}
        visibleCount={filteredAndSortedTasks.length}
      />

      {/* 4. Task Grid & List Component */}
      <TaskList
        tasks={filteredAndSortedTasks}
        filterState={filterState}
        onAddTask={handleOpenCreateModal}
        onToggleStatus={handleToggleStatus}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteTask}
      />

      {/* 5. Footer Bento Component */}
      <Footer />

      {/* 6. Task Modal (Create & Edit) Component */}
      <TaskModal
        isOpen={isModalOpen}
        mode={modalMode}
        task={editingTask}
        onClose={handleCloseModal}
        onSubmit={handleSaveTask}
      />
    </div>
  );
};
