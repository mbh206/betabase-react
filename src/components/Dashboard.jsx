import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
	collection,
	doc,
	query,
	where,
	getDocs,
	updateDoc,
	deleteDoc,
	addDoc,
	onSnapshot,
} from 'firebase/firestore';
import Sidebar from './Sidebar';
import ProjectDetail from './ProjectDetail';
import AddProjectModal from './AddProjectModal';
import ProjectList from './ProjectList';
import TaskModal from './TaskModal';
import defaultSteps from '../templates/defaultStepTemplate';

export default function Dashboard({ selectedProject, setSelectedProject }) {
	const navigate = useNavigate();
	const { projectId } = useParams();
	const [projects, setProjects] = useState([]);
	const [newProjectName, setNewProjectName] = useState('');
	const [newProjectDescription, setNewProjectDescription] = useState('');
	const [editingProject, setEditingProject] = useState(null);
	const [selectedStep, setSelectedStep] = useState(0);
	const [selectedDueDate, setSelectedDueDate] = useState(0);
	const [tasks, setTasks] = useState([]);
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const [newTaskDescription, setNewTaskDescription] = useState('');
	const [filterPriority] = useState('');
	const [filterSearch] = useState('');
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isTaskHintCollapsed, setIsTaskHintCollapsed] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [activeTaskModal, setActiveTaskModal] = useState(null);
	const [showAddProjectForm, setShowAddProjectForm] = useState(false);
	const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

	useEffect(() => {
		const fetchProjects = async () => {
			const q = query(
				collection(db, 'projects'),
				where('owner', '==', auth.currentUser.uid)
			);
			const projSnapshot = await getDocs(q);
			const fetchedProjects = projSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			for (let project of fetchedProjects) {
				const tasksSnap = await getDocs(
					collection(db, 'projects', project.id, 'tasks')
				);
				const projectTasks = tasksSnap.docs.map((taskDoc) => ({
					id: taskDoc.id,
					...taskDoc.data(),
					projectId: project.id,
				}));
				project.tasks = projectTasks;
			}
			setProjects(fetchedProjects);
		};

		const width = window.innerWidth;
		if (width < 1000) {
			setIsMobile(true);
		}
		fetchProjects();
	}, []);

	useEffect(() => {
		if (!projectId) {
			setSelectedProject(null);
			return;
		}
		const found = projects.find((p) => p.id === projectId) || null;
		setSelectedProject(found);
	}, [projectId, projects, setSelectedProject]);

	useEffect(() => {
		if (selectedProject) {
			const tasksRef = collection(db, 'projects', selectedProject.id, 'tasks');
			const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
				const tasksData = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setTasks(tasksData);
			});
			return () => unsubscribe();
		} else {
			setTasks([]);
		}
	}, [selectedProject]);

	const handleSelectProject = (project) => {
		setSelectedProject(project);
		setSelectedStep(0);
		setTasks(project?.tasks || []);
		if (window.innerWidth >= 1000) {
			setIsSidebarCollapsed(false);
		}
		setIsTaskHintCollapsed(false);
		navigate(`/dashboard/${project.id}`);
	};

	const handleAddProject = async (collaboratorsArray = []) => {
		if (!newProjectName.trim()) return;

		try {
			const projectRef = collection(db, 'projects');
			const ownerUid = auth.currentUser.uid;
			const allowedUsers = Array.from(
				new Set([ownerUid, ...collaboratorsArray])
			);
			const newProject = {
				name: newProjectName,
				description: newProjectDescription,
				owner: ownerUid,
				collaborators: collaboratorsArray,
				allowedUsers: allowedUsers,
				steps: defaultSteps,
				createdAt: new Date(),
			};
			const docRef = await addDoc(projectRef, newProject);
			const createdProject = { id: docRef.id, ...newProject };

			setProjects([...projects, createdProject]);
			setNewProjectName('');
			setNewProjectDescription('');
			setShowAddProjectForm(false);
			setSelectedProject(createdProject);
			navigate(`/dashboard/${createdProject.id}`);
		} catch (error) {
			console.error('Error adding project:', error);
		}
	};

	const handleEditProject = async (projectId, updatedFields) => {
		try {
			const projectRef = doc(db, 'projects', projectId);
			await updateDoc(projectRef, updatedFields);

			setProjects((prevProjects) =>
				prevProjects.map((project) =>
					project.id === projectId ? { ...project, ...updatedFields } : project
				)
			);
			if (selectedProject && selectedProject.id === projectId) {
				setSelectedProject((prev) => ({ ...prev, ...updatedFields }));
			}
			setEditingProject(null);
		} catch (error) {
			console.error('Error updating project:', error);
		}
	};

	const handleDeleteProject = async (projectId) => {
		try {
			await deleteDoc(doc(db, 'projects', projectId));
			setProjects((prevProjects) =>
				prevProjects.filter((project) => project.id !== projectId)
			);

			if (selectedProject && selectedProject.id === projectId) {
				setSelectedProject(null);
				setTasks([]);
			}
		} catch (error) {
			console.error('Error deleting project:', error);
		}
	};

	const calculateStepProgress = (stepIndex) => {
		const stepTasks = tasks.filter((task) => task.step === stepIndex);
		const completedTasks = stepTasks.filter(
			(task) => task.status === 'Done'
		).length;
		return stepTasks.length > 0
			? Math.round((completedTasks / stepTasks.length) * 100)
			: 0;
	};

	const filteredTasks = tasks
		.filter((task) => task.step === selectedStep)
		.filter((task) =>
			filterPriority ? task.priority === filterPriority : true
		)
		.filter((task) =>
			task.title.toLowerCase().includes(filterSearch.toLowerCase())
		)
		.sort((a, b) => a.order - b.order);

	const handleDragEnd = async (result) => {
		if (!result.destination) return;

		const { source, destination, draggableId } = result;

		if (source.droppableId !== destination.droppableId) {
			const updatedStep = Number(destination.droppableId);
			const updatedTasks = tasks.map((task) =>
				task.id === draggableId ? { ...task, step: updatedStep } : task
			);
			setTasks(updatedTasks);

			try {
				const taskRef = doc(
					db,
					'projects',
					selectedProject.id,
					'tasks',
					draggableId
				);
				await updateDoc(taskRef, { step: updatedStep });
			} catch (error) {
				console.error('Error updating task step:', error);
			}
		} else {
			const columnTasks = tasks
				.filter((task) => task.step === Number(source.droppableId))
				.sort((a, b) => a.order - b.order);

			const [removedTask] = columnTasks.splice(source.index, 1);
			columnTasks.splice(destination.index, 0, removedTask);

			const updatedColumnTasks = columnTasks.map((task, index) => ({
				...task,
				order: index,
			}));

			const updatedTasks = tasks.map((task) => {
				if (task.step === Number(source.droppableId)) {
					return updatedColumnTasks.find((t) => t.id === task.id) || task;
				}
				return task;
			});

			setTasks(updatedTasks);

			for (const task of updatedColumnTasks) {
				try {
					const taskRef = doc(
						db,
						'projects',
						selectedProject.id,
						'tasks',
						task.id
					);
					await updateDoc(taskRef, { order: task.order });
				} catch (error) {
					console.error('Error updating task order:', error);
				}
			}
		}
	};

	const updateTaskOrder = async (updatedTasks) => {
		try {
			const batch = updatedTasks.map((task, index) => ({
				id: task.id,
				order: index,
			}));

			for (const task of batch) {
				const taskRef = doc(
					db,
					'projects',
					selectedProject.id,
					'tasks',
					task.id
				);
				await updateDoc(taskRef, { order: task.order });
			}
		} catch (error) {
			console.error('Error updating task order:', error);
		}
	};

	const updateTaskStep = async (taskId, newStepIndex) => {
		try {
			const taskRef = doc(db, 'projects', selectedProject.id, 'tasks', taskId);
			await updateDoc(taskRef, { step: newStepIndex });

			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === taskId ? { ...task, step: newStepIndex } : task
				)
			);
		} catch (error) {
			console.error('Error updating task step:', error);
		}
	};

	const handleAddTask = async (priority) => {
		if (!newTaskTitle.trim()) return;
		try {
			const taskRef = collection(db, 'projects', selectedProject.id, 'tasks');
			const newTask = {
				title: newTaskTitle,
				description: newTaskDescription,
				dueDate: selectedDueDate,
				step: selectedStep,
				status: 'To Do',
				priority: priority || 'Medium',
				order: tasks.length,
				issues: [],
				challenges: [],
				images: [],
				links: [],
				awaiting: '',
				assignee: '',
			};
			const docRef = await addDoc(taskRef, newTask);

			setTasks([...tasks, { ...newTask, id: docRef.id }]);
			setNewTaskTitle('');
			setNewTaskDescription('');
			setSelectedDueDate('');
		} catch (error) {
			console.error('Error adding task:', error);
		}
	};

	const handleEditTask = async (taskId, field, value) => {
		try {
			const taskRef = doc(db, 'projects', selectedProject.id, 'tasks', taskId);
			await updateDoc(taskRef, { [field]: value });

			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === taskId ? { ...task, [field]: value } : task
				)
			);
		} catch (error) {
			console.error('Error updating task:', error);
		}
	};

	const handleDeleteTask = async (taskId) => {
		try {
			await deleteDoc(doc(db, 'projects', selectedProject.id, 'tasks', taskId));
			setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
		} catch (error) {
			console.error('Error deleting task:', error);
		}
	};

	const openTaskModal = (task) => {
		setActiveTaskModal({ ...task });
	};

	const handleSaveTask = async (updatedTask) => {
		try {
			if (updatedTask.id) {
				const taskRef = doc(
					db,
					'projects',
					selectedProject.id,
					'tasks',
					updatedTask.id
				);
				await updateDoc(taskRef, updatedTask);
				setTasks((prevTasks) =>
					prevTasks.map((task) =>
						task.id === updatedTask.id ? updatedTask : task
					)
				);
			} else {
				const taskCollectionRef = collection(
					db,
					'projects',
					selectedProject.id,
					'tasks'
				);
				const docRef = await addDoc(taskCollectionRef, updatedTask);
				const newTask = { ...updatedTask, id: docRef.id };
				setTasks((prevTasks) => [...prevTasks, newTask]);
			}
			setActiveTaskModal(null);
		} catch (error) {
			console.error('Error saving task: ', error);
		}
	};

	return (
		<div className='flex h-full min-h-screen'>
			{/* Sidebar */}
			<Sidebar
				className='w-64 flex-shrink-0'
				projects={projects}
				selectedProject={selectedProject}
				newProjectName={newProjectName}
				newProjectDescription={newProjectDescription}
				isSidebarCollapsed={isSidebarCollapsed}
				isMobile={isMobile}
				isMobileSidebarOpen={isMobileSidebarOpen}
				setIsSidebarCollapsed={setIsSidebarCollapsed}
				setIsMobileSidebarOpen={setIsMobileSidebarOpen}
				setSelectedProject={handleSelectProject}
				setNewProjectName={setNewProjectName}
				setNewProjectDescription={setNewProjectDescription}
				handleAddProject={handleAddProject}
				handleSelectProject={handleSelectProject}
				setShowAddForm={setShowAddProjectForm}
				showAddProjectForm={showAddProjectForm}
			/>
			{/* Main Workspace */}
			<div
				className={`flex-1 flex flex-col overflow-hidden bg-gray-100 px-2 transition-all duration-300`}>
				{selectedProject ? (
					<ProjectDetail
						project={selectedProject}
						tasks={tasks}
						selectedStep={selectedStep}
						setSelectedStep={setSelectedStep}
						selectedDueDate={selectedDueDate}
						setSelectedDueDate={setSelectedDueDate}
						calculateStepProgress={calculateStepProgress}
						isMobile={isMobile}
						isTaskHintCollapsed={isTaskHintCollapsed}
						setIsTaskHintCollapsed={setIsTaskHintCollapsed}
						allTasks={tasks}
						handleDragEnd={handleDragEnd}
						newTaskTitle={newTaskTitle}
						newTaskDescription={newTaskDescription}
						handleAddTask={handleAddTask}
						handleEditTask={handleEditTask}
						selectedProject={selectedProject}
						handleDeleteTask={handleDeleteTask}
						openTaskModal={openTaskModal}
						handleSelectProject={handleSelectProject}
						handleEditProject={handleEditProject}
						handleDeleteProject={handleDeleteProject}
						setEditingProject={setEditingProject}
						setNewTaskTitle={setNewTaskTitle}
						setNewTaskDescription={setNewTaskDescription}
					/>
				) : (
					<div className='flex flex-col items-center justify-center h-full'>
						<h2 className='text-2xl font-bold mb-2'>No project selected!</h2>
						<button
							className='bg-orange-500 text-white px-4 py-1 rounded-lg shadow uppercase'
							onClick={() => setIsAddProjectModalOpen(true)}>
							Add New Project
						</button>
						<AddProjectModal
							isOpen={isAddProjectModalOpen}
							onClose={() => setIsAddProjectModalOpen(false)}
							newProjectName={newProjectName}
							newProjectDescription={newProjectDescription}
							setNewProjectName={setNewProjectName}
							setNewProjectDescription={setNewProjectDescription}
							handleAddProject={handleAddProject}
						/>
						{projects && (
							<>
								<p>Or select one below</p>
								<ProjectList
									projects={projects}
									handleSelectProject={handleSelectProject}
								/>
							</>
						)}
					</div>
				)}
			</div>

			{/* Edit Project Modal */}
			{editingProject && (
				<div className='fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50'>
					<div className='bg-white w-11/12 max-w-2xl p-6 rounded shadow-md'>
						<h2 className='text-2xl font-bold mb-4'>Edit Project</h2>
						<input
							type='text'
							placeholder='Project Name'
							value={editingProject.name}
							onChange={(e) =>
								setEditingProject({ ...editingProject, name: e.target.value })
							}
							className='border p-2 rounded w-full mb-2'
						/>
						<input
							type='text'
							placeholder='Description'
							value={editingProject.description}
							onChange={(e) =>
								setEditingProject({
									...editingProject,
									description: e.target.value,
								})
							}
							className='border p-2 rounded w-full mb-2'
						/>
						<button
							onClick={() =>
								handleEditProject(editingProject.id, {
									name: editingProject.name,
									description: editingProject.description,
								})
							}
							className='bg-blue-500 text-white px-4 py-2 rounded'>
							Save Changes
						</button>
						<button
							onClick={() => setEditingProject(null)}
							className='bg-gray-500 text-white px-4 py-2 rounded ml-2'>
							Cancel
						</button>
					</div>
				</div>
			)}

			{/* Task Details Modal */}
			{activeTaskModal && (
				<TaskModal
					task={activeTaskModal}
					onClose={() => setActiveTaskModal(null)}
					onSave={handleSaveTask}
					projectCollaborators={selectedProject.collaborators || []}
				/>
			)}
		</div>
	);
}
