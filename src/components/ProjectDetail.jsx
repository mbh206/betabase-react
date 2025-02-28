// src/components/Dashboard/ProjectDetail.jsx
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { UserName } from '../components/UserName';

export default function ProjectDetail({
	project,
	selectedStep,
	setSelectedStep,
	selectedDueDate,
	setSelectedDueDate,
	calculateStepProgress,
	isMobile,
	isTaskHintCollapsed,
	setIsTaskHintCollapsed,
	allTasks,
	handleDragEnd,
	handleEditTask,
	handleDeleteTask,
	openTaskModal,
	setEditingProject,
	handleEditProject,
	handleDeleteProject,
}) {
	const [viewType, setViewType] = React.useState('list');

	useEffect(() => {
		function updateDescHeight() {
			const descEl = document.getElementById('description-div');
			if (descEl) {
				document.documentElement.style.setProperty(
					'--desc-height',
					`${descEl.offsetHeight}px`
				);
			}
		}
		updateDescHeight();
		window.addEventListener('resize', updateDescHeight);
		return () => window.removeEventListener('resize', updateDescHeight);
	}, []);

	if (!project) return <div>No project selected.</div>;

	const listViewTasks = allTasks
		.filter((t) => t.step === selectedStep)
		.sort((a, b) => a.order - b.order);
	const kanbanViewTasks = allTasks;

	const newTaskTemplate = (step) => ({
		title: '',
		description: '',
		dueDate: '',
		step: step,
		status: 'To Do',
		priority: 'Medium',
		issues: [],
		challenges: [],
		images: [],
		links: [],
		awaiting: '',
		assignee: '',
	});

	return (
		<div className='project-detail flex flex-col h-full overflow-hidden'>
			<div
				id='description-div'
				className='header px-4 py-2 flex-shrink-0'>
				<div className='flex flex-col sm:flex-row justify-between items-center mb-2 gap-2'>
					<div className='border-b p-1 flex gap-2'>
						<h2 className='text-2xl font-bold uppercase mx-1'>
							{project.name}
						</h2>
						<button
							onClick={(e) => {
								e.stopPropagation();
								setEditingProject(project);
							}}
							className='bg-teal-500 hover:shadow-lg shadow text-white text-xs m-1 rounded uppercase'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='w-6 h-6 text-white rounded p-1'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
								/>
							</svg>
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleDeleteProject(project.id);
							}}
							className='bg-red-500 hover:shadow-lg shadow text-white text-xs m-1 rounded'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='w-6 h-6 text-white rounded p-1'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
								/>
							</svg>
						</button>
					</div>
					<div>
						<button
							onClick={() => setViewType('list')}
							className={`px-2 py-1 mr-2 rounded ${
								viewType === 'list' ? 'bg-blue-300' : 'bg-gray-200'
							}`}>
							List View
						</button>
						<button
							onClick={() => setViewType('kanban')}
							className={`px-2 py-1 rounded ${
								viewType === 'kanban' ? 'bg-blue-300' : 'bg-gray-200'
							}`}>
							Kanban View
						</button>
					</div>
				</div>
				<div className='flex gap-2 mb-1 text-gray-800 rounded'>
					<p>
						<strong>Owner:</strong> <UserName uid={project.owner} />
					</p>
					<p>
						<strong>Collaborators:</strong>{' '}
						{project.collaborators && project.collaborators.length > 0
							? project.collaborators.map((uid, index) => (
									<React.Fragment key={uid}>
										<UserName uid={uid} />
										{index < project.collaborators.length - 1 ? ', ' : ''}
									</React.Fragment>
							  ))
							: 'None'}
					</p>
				</div>
				<div className='mb-2 text-gray-800 rounded'>{project.description}</div>
			</div>

			<div className='content flex-1 overflow-hidden max-w-screen'>
				{viewType === 'list' && (
					<div className='list-view h-full overflow-y-auto px-4'>
						{isMobile ? (
							<div className='flex space-x-4 border-b mb-4'>
								<select
									className='px-4 py-2 w-full border rounded'
									value={selectedStep}
									onChange={(e) => setSelectedStep(Number(e.target.value))}>
									{project.steps.map((step, idx) => (
										<option
											key={idx}
											value={idx}>
											{step.title} ({calculateStepProgress(idx)}%)
										</option>
									))}
								</select>
							</div>
						) : (
							<div className='flex justify-between space-x-2 border-b mb-0 border-t-2 text-xs'>
								{project.steps.map((step, idx) => (
									<button
										key={idx}
										className={`p-2 border-b-2 ${
											selectedStep === idx
												? 'border-blue-500 text-blue-500 font-bold bg-white'
												: 'border-transparent'
										}`}
										onClick={() => setSelectedStep(idx)}>
										{step.title} ({calculateStepProgress(idx)}%)
									</button>
								))}
							</div>
						)}

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
														{currentStepData.tasks?.map(
															(guideTask, guideIndex) => {
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
															}
														)}
													</ul>
												)}
											</div>
											<ul
												ref={provided.innerRef}
												{...provided.droppableProps}
												className='space-y-2'>
												{listViewTasks.map((task, index) => (
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
																		className='mr-2 flex'
																		onClick={() => openTaskModal(task)}>
																		<svg
																			xmlns='http://www.w3.org/2000/svg'
																			fill='none'
																			viewBox='0 0 24 24'
																			strokeWidth={1.5}
																			stroke='currentColor'
																			className='w-5 h-5 mr-2'>
																			<path
																				strokeLinecap='round'
																				strokeLinejoin='round'
																				d='M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
																			/>
																		</svg>
																		<span className='mr-3 font-medium uppercase'>
																			{task.title}:
																		</span>
																	</button>
																	<span className='mr-3 text-xs text-red-300'>
																		Due: {task.dueDate || 'No due date yet'}
																	</span>
																</div>
																<div>
																	<select
																		value={task.priority}
																		onChange={(e) =>
																			handleEditTask(
																				task.id,
																				'priority',
																				e.target.value
																			)
																		}
																		className={`text-sm font-semibold my-2 ${
																			task.priority === 'High'
																				? 'text-red-500'
																				: task.priority === 'Medium'
																				? 'text-orange-500'
																				: 'text-yellow-500'
																		}`}>
																		<option
																			value='High'
																			className='text-red-500'>
																			High Priority
																		</option>
																		<option
																			value='Medium'
																			className='text-orange-500'>
																			Medium Priority
																		</option>
																		<option
																			value='Low'
																			className='text-yellow-500'>
																			Low Priority
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
																					? 'bg-orange-600'
																					: task.status === 'In Progress'
																					? 'bg-purple-600'
																					: 'bg-teal-600'
																			}`}>
																			<option value='To Do'>To Do</option>
																			<option value='In Progress'>
																				In Progress
																			</option>
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
																</div>
															</li>
														)}
													</Draggable>
												))}
												{provided.placeholder}
											</ul>
											<div className='mt-2'>
												<button
													onClick={() =>
														openTaskModal(newTaskTemplate(selectedStep))
													}
													className='w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded'>
													+ Add Task
												</button>
											</div>
										</>
									);
								}}
							</Droppable>
						</DragDropContext>
					</div>
				)}
				{viewType === 'kanban' && (
					<div className='flex-0 overflow-x-auto'>
						<DragDropContext onDragEnd={handleDragEnd}>
							<div
								className={`flex space-x-1 w-full dynamic-height overflow-auto`}>
								{project.steps.map((step, stepIndex) => {
									const tasksForStep = kanbanViewTasks
										.filter((t) => t.step === stepIndex)
										.sort((a, b) => a.order - b.order);
									return (
										<Droppable
											droppableId={String(stepIndex)}
											key={stepIndex}>
											{(provided) => (
												<div
													className='bg-gray-200 rounded p-2 flex-shrink-0 w-64 flex flex-col h-full'
													ref={provided.innerRef}
													{...provided.droppableProps}>
													<h3 className='font-bold mb-2'>
														{step.title} ({calculateStepProgress(stepIndex)}%)
													</h3>
													<div className='flex-1 overflow-y-auto'>
														{tasksForStep.map((task, index) => (
															<Draggable
																key={task.id}
																draggableId={task.id}
																index={index}>
																{(provided) => (
																	<div
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																		className='bg-white p-2 rounded mb-2 shadow'>
																		<div className='flex flex-col gap-2 text-left'>
																			<span
																				className='bg-gray-100 px-1 rounded w-full font-semibold cursor-pointer flex'
																				onClick={() => openTaskModal(task)}>
																				{task.title}
																				<svg
																					xmlns='http://www.w3.org/2000/svg'
																					fill='none'
																					viewBox='0 0 24 24'
																					strokeWidth={1.5}
																					stroke='currentColor'
																					className='size-4 mt-1 ml-1'>
																					<path
																						strokeLinecap='round'
																						strokeLinejoin='round'
																						d='M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
																					/>
																				</svg>
																			</span>
																			<p className='text-xs text-gray-600'>
																				Assigned to:{' '}
																				{task.assignee ? (
																					<UserName uid={task.assignee} />
																				) : (
																					'Unassigned'
																				)}
																			</p>
																			<div className='flex justify-between'>
																				<select
																					value={task.status}
																					onChange={(e) =>
																						handleEditTask(
																							task.id,
																							'status',
																							e.target.value
																						)
																					}
																					className={`flex-shrink-0 text-xs text-white py-0 px-1 m-0 rounded uppercase ${
																						task.status === 'To Do'
																							? 'bg-orange-600'
																							: task.status === 'In Progress'
																							? 'bg-purple-600'
																							: 'bg-teal-600'
																					}`}>
																					<option value='To Do'>To Do</option>
																					<option value='In Progress'>
																						In Progress
																					</option>
																					<option value='Done'>Done</option>
																				</select>
																				<p className='flex-shrink-0 text-xs text-red-300 m-0'>
																					Due: {task.dueDate || 'None'}
																				</p>
																			</div>
																		</div>
																	</div>
																)}
															</Draggable>
														))}
														{provided.placeholder}
													</div>
													<div className='mt-2'>
														<button
															onClick={() =>
																openTaskModal(newTaskTemplate(stepIndex))
															}
															className='w-full bg-teal-500 hover:bg-teal-600 text-white py-1 rounded'>
															+ Add Task
														</button>
													</div>
												</div>
											)}
										</Droppable>
									);
								})}
							</div>
						</DragDropContext>
					</div>
				)}
			</div>
		</div>
	);
}
