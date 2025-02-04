import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function TaskList({
	filteredTasks,
	selectedStep,
	handleDragEnd,
	handleEditTask,
	handleDeleteTask,
	openTaskModal,
}) {
	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId={String(selectedStep)}>
				{(provided) => (
					<>
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
											{/* Task Title and description */}
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
												<span className='mr-3 font-medium'>{task.title}:</span>
												<span className='mr-3'>
													{task.description || 'No description yet'}
												</span>
											</div>
											{/* Priority Dropdown */}
											<select
												value={task.priority}
												onChange={(e) =>
													handleEditTask(task.id, 'priority', e.target.value)
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
											{/* Status Dropdown and Delete Button */}
											<div className='flex items-center'>
												<select
													value={task.status}
													onChange={(e) =>
														handleEditTask(task.id, 'status', e.target.value)
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
				)}
			</Droppable>
		</DragDropContext>
	);
}
