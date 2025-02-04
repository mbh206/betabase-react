import React, { useEffect, useState } from 'react';
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
} from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Sidebar from './Sidebar';
import ProjectDetail from './ProjectDetail';
import TaskModal from './TaskModal';

export default function Dashboard() {
	const [projects, setProjects] = useState([]);
	const [newProjectName, setNewProjectName] = useState('');
	const [newProjectDescription, setNewProjectDescription] = useState('');
	const [editingProject, setEditingProject] = useState(null);
	const [selectedProject, setSelectedProject] = useState(null);
	const [selectedStep, setSelectedStep] = useState(0);
	const [tasks, setTasks] = useState([]);
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const [newTaskDescription, setNewTaskDescription] = useState('');
	const [filterPriority, setFilterPriority] = useState('');
	const [filterSearch, setFilterSearch] = useState('');
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isTaskHintCollapsed, setIsTaskHintCollapsed] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [activeTaskModal, setActiveTaskModal] = useState(null);
	const [showAddProjectForm, setShowAddProjectForm] = useState(false);

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
			setIsSidebarCollapsed(true);
			setIsMobile(true);
		}
		fetchProjects();
	}, []);

	const handleSelectProject = (project) => {
		setSelectedProject(project);
		setSelectedStep(0);
		setTasks(project?.tasks || []);
		if (window.innerWidth >= 1000) {
			setIsSidebarCollapsed(false);
		}
		setIsTaskHintCollapsed(false);
	};

	const clearSelectedProject = () => {
		setSelectedProject(null);
		setTasks([]);
	};

	const handleAddProject = async () => {
		if (!newProjectName.trim()) return;

		try {
			const projectRef = collection(db, 'projects');
			const newProject = {
				name: newProjectName,
				description: newProjectDescription,
				owner: auth.currentUser.uid,
				steps: [
					{
						title: 'Ideation & Research',
						completed: false,

						tasks: [
							{
								title: 'Problem Definition',
								description:
									'Clearly articulate the issue your app aims to solve. Who is it for, and why does it matter?',
								issues: [],
								challenges: [
									'Need to confirm target audience scope',
									'Validate real user pain points through data',
								],
								images: [],
								links: ['https://example.com/market-research-report.pdf'],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Market Analysis',
								description:
									'Study the competitive landscape. Identify existing solutions and see how your product can stand out.',
								issues: [],
								challenges: [],
								images: [],
								links: ['https://example.com/competitor-analysis'],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'User Research',
								description:
									'Gather insights from potential users about their needs and pain points. Conduct interviews, surveys, or focus groups to validate your hypothesis.',
								issues: ['Need participant consent forms'],
								challenges: ['Scheduling interviews across time zones'],
								images: [],
								links: [],
								awaiting: 'Recruiting participants from user group',
								assignee: 'Jane Smith',
							},
							{
								title: 'Feasibility Analysis',
								description:
									'Assess technical feasibility, potential costs, and revenue models to ensure the concept can be developed sustainably.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
						],
					},
					{
						title: 'Gathering & Planning',
						completed: false,
						tasks: [
							{
								title: 'Define Key Features',
								description:
									'List core functionalities the app must have to satisfy initial user needs (i.e., the minimum viable product or MVP feature set).',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Create User Stories',
								description:
									'Translate app features into stories that describe the who, what, and why of each feature from a user perspective.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Technical Considerations',
								description:
									'Decide on the technology stack (e.g., native vs. cross-platform for mobile apps), backend infrastructure, data storage, and third-party integrations.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Roadmap & Milestones',
								description:
									'Outline a timeline with key deliverables. Plan your sprints or development cycles if following Agile methodologies.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
						],
					},
					{
						title: 'UX/UI & Prototyping',
						completed: false,
						tasks: [
							{
								title: 'Information Architecture',
								description:
									'Define the hierarchy of information and navigational flow.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Wireframing',
								description:
									'Sketch low-fidelity wireframes to visualize layout and user journeys.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Interactive Prototypes',
								description:
									'Build high-fidelity mockups or clickable prototypes to gather stakeholder and user feedback early.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Design System/Style Guide',
								description:
									'Establish consistent visual guidelines (colors, typography, icons) that will be used throughout the product.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
						],
					},
					{
						title: 'Development (MVP)',
						completed: false,
						tasks: [
							{
								title: 'Set Up the Development Environment',
								description:
									'Configure repositories, CI/CD pipeline, and any necessary tools for collaborative work.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Iterative Feature Implementation',
								description:
									'Start coding the MVP features, integrating design elements and functionality in a modular, testable manner.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Regular Checkpoints',
								description:
									'Conduct daily standups (if Agile/Scrum) and frequent demos to keep the team aligned on progress.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Version Control & Documentation',
								description:
									'Use version control (e.g., Git) rigorously and maintain clear documentation for the codebase and APIs.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
						],
					},
					{
						title: 'Testing & QA',
						completed: false,
						tasks: [
							{
								title: 'Unit Testing',
								description:
									'Developers test individual components to ensure each module works as intended.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Integration Testing',
								description:
									'Check that different parts of the system work correctly together (e.g., front-end with back-end APIs).',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'User Acceptance Testing (UAT)',
								description:
									'Involve a small group of real or representative users to test the app under real-world conditions.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Performance & Security Testing',
								description:
									'Ensure the app meets necessary performance benchmarks (speed, stability) and is secure from common vulnerabilities.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
						],
					},
					{
						title: 'Prep for Beta',
						completed: false,
						tasks: [
							{
								title: 'Refine the MVP',
								description:
									'Incorporate feedback from testing to fix critical bugs, improve usability, and stabilize core features.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Beta User Selection',
								description:
									'Identify a group of beta testers who represent your target audience. They could be existing users or volunteers recruited via sign-ups.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Beta Release & Distribution',
								description:
									'Deploy a beta version (TestFlight for iOS, internal testing tracks for Android, or invite-based web access).',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Feedback Collection Mechanisms',
								description:
									'Implement in-app feedback forms, bug-reporting tools, or surveys to capture user feedback rapidly.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
						],
					},
					{
						title: 'Beta Testing & Iteration',
						completed: false,
						tasks: [
							{
								title: 'Monitor Key Metrics',
								description:
									'Track session length, crashes, user retention, and feature usage to assess where improvements are needed.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Iterative Fixes & Updates',
								description:
									'Quickly address bugs and usability issues uncovered by beta users. Release updates with improvements and new features if feasible within the beta phase.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Communication with Beta Testers',
								description:
									'Engage testers via email updates or community forums. Show appreciation for their feedback and keep them informed about upcoming changes.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
						],
					},
				],
				createdAt: new Date(),
			};
			const docRef = await addDoc(projectRef, newProject);
			const createdProject = { id: docRef.id, ...newProject };

			setProjects([...projects, createdProject]);
			setNewProjectName('');
			setNewProjectDescription('');
			setShowAddProjectForm(false);
			setSelectedProject(createdProject);
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

		const { source, destination } = result;
		const draggedTask = tasks[source.index];

		if (source.droppableId === destination.droppableId) {
			const updatedTasks = Array.from(tasks);
			const [movedTask] = updatedTasks.splice(source.index, 1);
			updatedTasks.splice(destination.index, 0, movedTask);
			updatedTasks.forEach((t, i) => {
				t.order = i;
			});
			setTasks(updatedTasks);

			await updateTaskOrder(updatedTasks);
		} else {
			await updateTaskStep(draggedTask.id, parseInt(destination.droppableId));
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
				dueDate: '',
				step: selectedStep,
				status: 'To Do',
				priority: priority || 'Medium',
				order: tasks.length,
			};
			const docRef = await addDoc(taskRef, newTask);

			setTasks([...tasks, { ...newTask, id: docRef.id }]);
			setNewTaskTitle('');
			setNewTaskDescription('');
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
			setActiveTaskModal(null);
		} catch (error) {
			console.log('Error updating task: ', error);
		}
	};

	return (
		<div className='flex h-full min-h-screen'>
			{/* Sidebar */}
			<Sidebar
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
			/>
			{/* Main Workspace */}
			<div className={`flex-1 p-8 bg-gray-100 transition-all duration-300`}>
				{selectedProject ? (
					<ProjectDetail
						project={selectedProject}
						selectedStep={selectedStep}
						setSelectedStep={setSelectedStep}
						calculateStepProgress={calculateStepProgress}
						isMobile={isMobile}
						isTaskHintCollapsed={isTaskHintCollapsed}
						setIsTaskHintCollapsed={setIsTaskHintCollapsed}
						filteredTasks={filteredTasks}
						handleDragEnd={handleDragEnd}
						newTaskTitle={newTaskTitle}
						newTaskDescription={newTaskDescription}
						handleAddTask={handleAddTask}
						handleEditTask={handleEditTask}
						handleDeleteTask={handleDeleteTask}
						openTaskModal={openTaskModal}
						handleEditProject={handleEditProject}
						handleDeleteProject={handleDeleteProject}
						setEditingProject={setEditingProject}
						setNewTaskTitle={setNewTaskTitle}
						setNewTaskDescription={setNewTaskDescription}
					/>
				) : (
					<div className='flex flex-col items-center justify-center h-full'>
						<h2 className='text-2xl font-bold mb-4'>No project selected!</h2>
						<p>Please select a project from the sidebar or create a new one.</p>
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
				/>
			)}
		</div>
	);
}
