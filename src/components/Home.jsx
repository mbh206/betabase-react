import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
	collection,
	doc,
	getDocs,
	updateDoc,
	deleteDoc,
	addDoc,
} from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Home() {
	const [projects, setProjects] = useState([]);
	const [newProjectName, setNewProjectName] = useState('');
	const [newProjectDescription, setNewProjectDescription] = useState('');
	const [editingProject, setEditingProject] = useState(null);
	const [selectedProject, setSelectedProject] = useState(null);
	const [selectedStep, setSelectedStep] = useState(0);
	const [tasks, setTasks] = useState([]);
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const [filterPriority, setFilterPriority] = useState('');
	const [filterSearch, setFilterSearch] = useState('');
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // New state for sidebar collapse

	useEffect(() => {
		const fetchProjects = async () => {
			const projSnapshot = await getDocs(collection(db, 'projects'));
			const fetchedProjects = projSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			// Attach tasks to each project
			const allTasks = [];
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
				allTasks.push(...projectTasks);
			}

			setProjects(fetchedProjects);
		};

		fetchProjects();
	}, []);

	const handleSelectProject = (project) => {
		setSelectedProject(project);
		setSelectedStep(0);
		setTasks(project.tasks || []);
		setIsSidebarCollapsed(false); // Expand sidebar when a project is selected
	};

	const handleAddProject = async () => {
		if (!newProjectName.trim()) return;

		try {
			const projectRef = collection(db, 'projects');
			const newProject = {
				name: newProjectName,
				description: newProjectDescription,
				steps: [
					{ title: 'Ideation', completed: false },
					{ title: 'Development', completed: false },
					{ title: 'Testing', completed: false },
				],
				createdAt: new Date(),
			};
			const docRef = await addDoc(projectRef, newProject);

			setProjects([...projects, { id: docRef.id, ...newProject }]);
			setNewProjectName('');
			setNewProjectDescription('');
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

		// If moved within the same step, reorder tasks
		if (source.droppableId === destination.droppableId) {
			const updatedTasks = Array.from(tasks);
			const [movedTask] = updatedTasks.splice(source.index, 1);
			updatedTasks.splice(destination.index, 0, movedTask);
			setTasks(updatedTasks);

			// Update Firestore with the new order
			await updateTaskOrder(updatedTasks);
		} else {
			// If moved to a new step, update the task's step
			await updateTaskStep(draggedTask.id, parseInt(destination.droppableId));
		}
	};

	const updateTaskOrder = async (updatedTasks) => {
		try {
			const batch = updatedTasks.map((task, index) => ({
				id: task.id,
				order: index,
			}));

			// Update Firestore with the new order
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
				description: '',
				dueDate: '',
				step: selectedStep,
				status: 'To Do',
				priority: priority || 'Medium',
				order: tasks.length, // Add this line
			};
			const docRef = await addDoc(taskRef, newTask);

			setTasks([...tasks, { ...newTask, id: docRef.id }]);
			setNewTaskTitle('');
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

	return (
		<div className='flex h-screen'>
			{/* Sidebar */}
			{selectedProject && (
				<div
					className={`bg-gray-800 text-white p-4 transition-all duration-300 ${
						isSidebarCollapsed ? 'w-16' : 'w-64'
					}`}>
					{/* Toggle Button */}
					<button
						onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
						className='mb-4 text-white'>
						{isSidebarCollapsed ? '☰' : '✕'}
					</button>

					{/* Sidebar Content */}
					{!isSidebarCollapsed && (
						<>
							<h2 className='text-xl font-semibold mb-4'>Projects</h2>
							<ul>
								{projects.map((project) => (
									<li
										key={project.id}
										className={`cursor-pointer p-2 rounded ${
											selectedProject?.id === project.id
												? 'bg-gray-600'
												: 'hover:bg-gray-700'
										}`}
										onClick={() => handleSelectProject(project)}>
										{project.name}
										<button
											onClick={(e) => {
												e.stopPropagation();
												setEditingProject(project);
											}}
											className='ml-2 text-sm text-blue-500'>
											Edit
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteProject(project.id);
											}}
											className='ml-2 text-sm text-red-500'>
											Delete
										</button>
									</li>
								))}
							</ul>
							<div className='mt-4'>
								<input
									type='text'
									placeholder='New Project Name'
									value={newProjectName}
									onChange={(e) => setNewProjectName(e.target.value)}
									className='border p-2 rounded w-full mb-2 text-gray-500'
								/>
								<input
									type='text'
									placeholder='Description'
									value={newProjectDescription}
									onChange={(e) => setNewProjectDescription(e.target.value)}
									className='border p-2 rounded w-full mb-2 text-gray-500'
								/>
								<button
									onClick={handleAddProject}
									className='bg-green-500 text-white px-4 py-2 rounded w-full'>
									Add Project
								</button>
							</div>
						</>
					)}
				</div>
			)}

			{/* Main Workspace */}
			<div
				className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ${
					selectedProject ? (isSidebarCollapsed ? 'ml-0' : 'ml-0') : ''
				}`}>
				{selectedProject ? (
					<>
						{/* Project Header */}
						<div className='flex justify-between items-center mb-4'>
							<h2 className='text-2xl font-bold'>{selectedProject.name}</h2>
							<button
								onClick={() => setSelectedProject(null)}
								className='bg-red-500 text-white px-4 py-2 rounded'>
								Back to Projects
							</button>
						</div>

						{/* Step Tabs & Progress */}
						<div className='flex space-x-4 border-b mb-4'>
							{selectedProject.steps.map((step, index) => (
								<button
									key={index}
									className={`px-4 py-2 border-b-2 ${
										selectedStep === index
											? 'border-blue-500 text-blue-500 font-bold'
											: 'border-transparent'
									}`}
									onClick={() => setSelectedStep(index)}>
									{step.title} ({calculateStepProgress(index)}%)
								</button>
							))}
						</div>

						{/* Filters */}
						<div className='flex space-x-4 mb-4'>
							<select
								value={filterPriority}
								onChange={(e) => setFilterPriority(e.target.value)}
								className='border p-2 rounded'>
								<option value=''>All Priorities</option>
								<option value='High'>🔴 High</option>
								<option value='Medium'>🟠 Medium</option>
								<option value='Low'>🟢 Low</option>
							</select>
							<input
								type='text'
								placeholder='Search Tasks'
								value={filterSearch}
								onChange={(e) => setFilterSearch(e.target.value)}
								className='border p-2 rounded'
							/>
						</div>

						{/* Drag-and-Drop Task List */}
						<DragDropContext onDragEnd={handleDragEnd}>
							<Droppable droppableId={String(selectedStep)}>
								{(provided) => (
									<ul
										ref={provided.innerRef}
										{...provided.droppableProps}
										className='space-y-2 mt-2'>
										{filteredTasks.map((task, index) => (
											<Draggable
												key={task.id}
												draggableId={task.id}
												index={index}>
												{(provided) => (
													<li
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														className='bg-white p-4 rounded shadow flex justify-between items-center'>
														<span>{task.title}</span>
														<span
															className={`text-sm font-semibold ${
																task.priority === 'High'
																	? 'text-red-500'
																	: task.priority === 'Medium'
																	? 'text-orange-500'
																	: 'text-green-500'
															}`}>
															{task.priority}
														</span>
														<select
															value={task.status}
															onChange={(e) =>
																handleEditTask(
																	task.id,
																	'status',
																	e.target.value
																)
															}
															className={`text-white py-1 px-2 rounded ${
																task.status === 'To Do'
																	? 'bg-blue-500'
																	: task.status === 'In Progress'
																	? 'bg-green-500'
																	: 'bg-gray-500'
															}`}>
															<option value='To Do'>To Do</option>
															<option value='In Progress'>In Progress</option>
															<option value='Done'>Done</option>
														</select>
													</li>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</ul>
								)}
							</Droppable>
						</DragDropContext>

						{/* Quick Add Task Form */}
						<div className='mt-4'>
							<input
								type='text'
								placeholder='New Task'
								value={newTaskTitle}
								onChange={(e) => setNewTaskTitle(e.target.value)}
								className='border p-2 rounded w-full'
								onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
							/>
							<div className='flex space-x-2 mt-2'>
								<button
									onClick={() => handleAddTask('High')}
									className='bg-red-500 text-white px-4 py-2 rounded'>
									Add High Priority
								</button>
								<button
									onClick={() => handleAddTask('Medium')}
									className='bg-orange-500 text-white px-4 py-2 rounded'>
									Add Medium Priority
								</button>
								<button
									onClick={() => handleAddTask('Low')}
									className='bg-green-500 text-white px-4 py-2 rounded'>
									Add Low Priority
								</button>
							</div>
						</div>
					</>
				) : (
					<>
						{/* Initial Load: Show All Projects as Cards */}
						<h2 className='text-2xl font-bold mb-4'>All Projects</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
							{projects.map((project) => (
								<div
									key={project.id}
									onClick={() => handleSelectProject(project)}
									className='bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition-shadow'>
									<h3 className='text-xl font-semibold'>{project.name}</h3>
									<p className='text-gray-600'>{project.description}</p>
								</div>
							))}
						</div>
					</>
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
		</div>
	);
}
