const defaultSteps = [
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
			},
			{
				title: 'Create User Stories',
				description:
					'Translate app features into stories that describe the who, what, and why of each feature from a user perspective.',
			},
			{
				title: 'Technical Considerations',
				description:
					'Decide on the technology stack (e.g., native vs. cross-platform for mobile apps), backend infrastructure, data storage, and third-party integrations.',
			},
			{
				title: 'Roadmap & Milestones',
				description:
					'Outline a timeline with key deliverables. Plan your sprints or development cycles if following Agile methodologies.',
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
			},
			{
				title: 'Wireframing',
				description:
					'Sketch low-fidelity wireframes to visualize layout and user journeys.',
			},
			{
				title: 'Interactive Prototypes',
				description:
					'Build high-fidelity mockups or clickable prototypes to gather stakeholder and user feedback early.',
			},
			{
				title: 'Design System/Style Guide',
				description:
					'Establish consistent visual guidelines (colors, typography, icons) that will be used throughout the product.',
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
			},
			{
				title: 'Iterative Feature Implementation',
				description:
					'Start coding the MVP features, integrating design elements and functionality in a modular, testable manner.',
			},
			{
				title: 'Regular Checkpoints',
				description:
					'Conduct daily standups (if Agile/Scrum) and frequent demos to keep the team aligned on progress.',
			},
			{
				title: 'Version Control & Documentation',
				description:
					'Use version control (e.g., Git) rigorously and maintain clear documentation for the codebase and APIs.',
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
			},
			{
				title: 'Integration Testing',
				description:
					'Check that different parts of the system work correctly together (e.g., front-end with back-end APIs).',
			},
			{
				title: 'User Acceptance Testing (UAT)',
				description:
					'Involve a small group of real or representative users to test the app under real-world conditions.',
			},
			{
				title: 'Performance & Security Testing',
				description:
					'Ensure the app meets necessary performance benchmarks (speed, stability) and is secure from common vulnerabilities.',
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
			},
			{
				title: 'Beta User Selection',
				description:
					'Identify a group of beta testers who represent your target audience. They could be existing users or volunteers recruited via sign-ups.',
			},
			{
				title: 'Beta Release & Distribution',
				description:
					'Deploy a beta version (TestFlight for iOS, internal testing tracks for Android, or invite-based web access).',
			},
			{
				title: 'Feedback Collection Mechanisms',
				description:
					'Implement in-app feedback forms, bug-reporting tools, or surveys to capture user feedback rapidly.',
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
			},
			{
				title: 'Iterative Fixes & Updates',
				description:
					'Quickly address bugs and usability issues uncovered by beta users. Release updates with improvements and new features if feasible within the beta phase.',
			},
			{
				title: 'Communication with Beta Testers',
				description:
					'Engage testers via email updates or community forums. Show appreciation for their feedback and keep them informed about upcoming changes.',
			},
		],
	},
];

export default defaultSteps;
