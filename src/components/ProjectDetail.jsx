// src/components/Dashboard/ProjectDetail.jsx
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function ProjectDetail({
	project,
	selectedStep,
	setSelectedStep,
	calculateStepProgress,
	isMobile,
	isTaskHintCollapsed,
	setIsTaskHintCollapsed,
	filteredTasks,
	handleDragEnd,
	newTaskTitle,
	newTaskDescription,
	handleAddTask,
	handleEditTask,
	handleDeleteTask,
	openTaskModal,
	setEditingProject,
	handleEditProject,
	handleDeleteProject,
	setNewTaskTitle,
	setNewTaskDescription,
}) {
	if (!project) return <div>No project selected.</div>;

	return (
		<div className='project-detail'>
			{/* Project Header */}
			<div className='flex justify-between items-center mb-2'>
				<h2 className='text-2xl font-bold'>{project.name}</h2>
				<span>
					{/*
            Note: You can later pass editing and deletion functions if needed.
            For now, the Edit and Delete buttons are shown without functionality.
          */}
					<button
						onClick={(e) => {
							e.stopPropagation();
							setEditingProject(project);
						}}
						className='bg-teal-500 text-white text-sm mr-2 px-2 py-1 rounded'>
						Edit
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleDeleteProject(project.id);
						}}
						className='bg-red-500 text-white text-sm mr-2 px-2 py-1 rounded'>
						Delete
					</button>
				</span>
			</div>
			<div className='mb-2 p-1 bg-white rounded'>{project.description}</div>

			{/* Step Tabs & Progress */}
			{isMobile ? (
				<div className='flex space-x-4 border-b mb-4'>
					<select
						className='px-4 py-2 w-full border rounded'
						value={selectedStep}
						onChange={(e) => setSelectedStep(Number(e.target.value))}>
						{project.steps.map((step, index) => (
							<option
								key={index}
								value={index}>
								{step.title} ({calculateStepProgress(index)}%)
							</option>
						))}
					</select>
				</div>
			) : (
				<div className='flex justify-between space-x-2 border-b mb-0 border-t-2 text-xs'>
					{project.steps.map((step, index) => (
						<button
							key={index}
							className={`p-2 border-b-2 ${
								selectedStep === index
									? 'border-blue-500 text-blue-500 font-bold bg-white'
									: 'border-transparent'
							}`}
							onClick={() => setSelectedStep(index)}>
							{step.title} ({calculateStepProgress(index)}%)
						</button>
					))}
				</div>
			)}

			{/* Drag-and-Drop Task List */}
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId={String(selectedStep)}>
					{(provided) => {
						const currentStepData = project.steps[selectedStep];
						return (
							<>
								<div
									className={`flex flex-col bg-gray-200 p-2 mb-2 rounded text-xs gap-2 ${
										isTaskHintCollapsed ? 'h-10' : ''
									}`}>
									<h3 className='flex justify-between'>
										<strong>Typical Tasks for this step</strong>
										<button
											onClick={() =>
												setIsTaskHintCollapsed(!isTaskHintCollapsed)
											}
											className='text-gray-500'>
											{isTaskHintCollapsed ? (
												<svg
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													viewBox='0 0 24 24'
													strokeWidth={1.5}
													stroke='currentColor'
													className='w-6 h-6'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														d='M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25'
													/>
												</svg>
											) : (
												<svg
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													viewBox='0 0 24 24'
													strokeWidth={1.5}
													stroke='currentColor'
													className='w-6 h-6'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
													/>
												</svg>
											)}
										</button>
									</h3>
									{!isTaskHintCollapsed && (
										<ul className='list-inside'>
											{currentStepData.tasks?.map((guideTask, guideIndex) => {
												if (typeof guideTask === 'string') {
													return <li key={guideIndex}>{guideTask}</li>;
												} else if (typeof guideTask === 'object') {
													return (
														<li key={guideTask.title}>
															<strong>{guideTask.title}:</strong>{' '}
															{guideTask.description}
														</li>
													);
												}
												return null;
											})}
										</ul>
									)}
								</div>
								{/* (Optional) Filters can be added here */}
								<ul
									ref={provided.innerRef}
									{...provided.droppableProps}
									className='space-y-2'>
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
													<div className='flex items-center'>
														<button
															className='mr-2'
															onClick={() => openTaskModal(task)}>
															<svg
																xmlns='http://www.w3.org/2000/svg'
																fill='none'
																viewBox='0 0 24 24'
																strokeWidth={1.5}
																stroke='currentColor'
																className='w-6 h-6'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	d='M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
																/>
															</svg>
														</button>
														<span className='mr-3 font-medium'>
															{task.title}:
														</span>
														<span className='mr-3'>
															{task.description || 'No description yet'}
														</span>
													</div>
													<select
														value={task.priority}
														onChange={(e) =>
															handleEditTask(
																task.id,
																'priority',
																e.target.value
															)
														}
														className={`text-sm font-semibold mx-2 ${
															task.priority === 'High'
																? 'text-red-500'
																: task.priority === 'Medium'
																? 'text-orange-500'
																: 'text-green-500'
														}`}>
														<option
															value='High'
															className='text-red-500'>
															High
														</option>
														<option
															value='Medium'
															className='text-orange-500'>
															Medium
														</option>
														<option
															value='Low'
															className='text-green-500'>
															Low
														</option>
													</select>
													<div className='flex items-center'>
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
														<button
															className='ml-3'
															onClick={() => handleDeleteTask(task.id)}>
															<svg
																xmlns='http://www.w3.org/2000/svg'
																fill='none'
																viewBox='0 0 24 24'
																strokeWidth={1.5}
																stroke='currentColor'
																className='w-6 h-6 text-white bg-red-500 rounded p-1'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
																/>
															</svg>
														</button>
													</div>
												</li>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</ul>
							</>
						);
					}}
				</Droppable>
			</DragDropContext>

			{/* Add Task Form */}
			<div className='mt-2'>
				<input
					type='text'
					placeholder='New Task Name'
					value={newTaskTitle}
					onChange={(e) => setNewTaskTitle(e.target.value)}
					className='border p-2 rounded w-full'
					onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
				/>
				<input
					type='text'
					placeholder='New Task Description'
					value={newTaskDescription}
					onChange={(e) => setNewTaskDescription(e.target.value)}
					className='border p-2 mt-1 rounded w-full'
					onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
				/>
				<div className='flex space-x-2 mt-2'>
					<button
						onClick={() => handleAddTask('High')}
						className='bg-red-500 text-white px-2 py-1 rounded'>
						Add as High Priority
					</button>
					<button
						onClick={() => handleAddTask('Medium')}
						className='bg-orange-500 text-white px-2 py-1 rounded'>
						Add as Medium Priority
					</button>
					<button
						onClick={() => handleAddTask('Low')}
						className='bg-green-500 text-white px-2 py-1 rounded'>
						Add as Low Priority
					</button>
				</div>
			</div>
		</div>
	);
}
