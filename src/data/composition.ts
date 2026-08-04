export interface OutcomeEvidence {
	title: string;
	href: string;
	connection: string;
}

export interface CourseOutcome {
	number: string;
	id: string;
	title: string;
	wording: string;
	reflection: string[];
	evidence: OutcomeEvidence[];
}

export interface PortfolioArtifact {
	number: string;
	type: string;
	title: string;
	summary: string;
	date: string;
	href: string;
	download: string | null;
	outcomeIds: string[];
}

export const outcomes: CourseOutcome[] = [
	{
		number: '01',
		id: 'generating-inquiry',
		title: 'Generating Inquiry',
		wording: 'Generate and explore genuine lines of inquiry related to writing, language, literacy, and/or rhetoric.',
		reflection: [
			`My research question came from something I see all the time: students making unofficial class group chats to ask about due dates, instructions, and anything else they are unsure about. At first, I only knew that I wanted to study these chats. The Initial Research Proposal made me narrow that interest into a question about how students use the chats to clarify course expectations and support one another. It also made me explain why short messages, reactions, tone, timing, and audience are worth studying as writing.`,
			`My question changed once I started reading sources and doing interviews. In the CARS Model Introduction, I noticed that much of the existing research looks at messaging spaces created or observed by instructors. I decided to focus on chats run entirely by students instead. Participants also brought up incorrect information, too many notifications, and situations where quieter students felt left out. Because of that, I stopped treating the chats as automatically helpful. I kept the same main question, but I became more careful not to decide what the answer should be before looking at the interviews.`
		],
		evidence: [
			{
				title: 'Initial Research Proposal',
				href: '/portfolio/composition/initial-research-proposal',
				connection: 'This is where I turned a general interest in class group chats into a question I could study and laid out the first version of my method.'
			},
			{
				title: 'Annotated Bibliography',
				href: '/portfolio/composition/annotated-bibliography',
				connection: 'Comparing four sources helped me see what existing studies covered and narrow my inquiry to student-run chats outside official course spaces.'
			},
			{
				title: 'Final Research Paper',
				href: '/portfolio/composition/investigative-field-essay',
				connection: 'In the final paper, I answer the question with evidence from my interviews and explain both how the chats help and where they can cause problems.'
			},
			{
				title: 'CARS Model Introduction',
				href: '/portfolio/composition/process-archive#01-cars-model-introduction',
				connection: 'This exercise helped me identify what earlier studies had not covered and narrow the project to chats run by students.'
			},
			{
				title: 'Mid-Project Reflection',
				href: '/portfolio/composition/process-archive#05-mid-project-reflection',
				connection: 'This reflection records the point where the interviews made me stop assuming the chats were always helpful.'
			}
		]
	},
	{
		number: '02',
		id: 'multiple-ways',
		title: 'Multiple Ways of Writing',
		wording: 'Purposefully integrate multimodality, multiple languages, and/or multiliteracies into writing products to support their goals.',
		reflection: [
			`The Genre and Discourse Communities response helped me understand the difference between a medium and a genre. GroupMe, Discord, and email are media that can carry many kinds of writing. An assignment-clarification question is a genre because students use it repeatedly for the same basic purpose. I looked at the usual parts of that message: giving context, admitting uncertainty, asking a direct question, and responding with a short reply or reaction. Each part helps a student ask for help quickly without making the message feel too formal.`,
			`When I started building this ePortfolio, I realized that a page with only download links would not show how the assignments connect. I organized the site around the six outcomes and kept the original files available. One peer reviewer said the site worked well on a phone but needed more multimodality, so I added the coding table and bar chart from the final paper. A later reader still had trouble finding the outcome reflections. I responded by separating the original long overview into a Start Here page, an Outcomes & Reflections page, and an Artifact Index. This lets readers choose an outcome first or start with an artifact and follow its outcome links back to the reflection.`
		],
		evidence: [
			{
				title: 'Final Research Paper',
				href: '/portfolio/composition/investigative-field-essay#data-display',
				connection: 'I use a coding table and bar chart to make the interview patterns easier to see. Headings and appendices keep the longer paper organized.'
			},
			{
				title: 'Genre and Discourse Communities',
				href: '/portfolio/composition/process-archive#03-reading-response-genre-and-discourse-communities',
				connection: 'I analyze the assignment-clarification message as a genre and explain how short messages, reactions, and informal wording work together.'
			},
			{
				title: 'ePortfolio Design Reflection',
				href: '/portfolio/composition/process-archive#06-eportfolio-design-reflection',
				connection: 'I explain why I used separate pages, clear labels, and a mobile layout to make the project easier to read online.'
			},
			{
				title: 'ePortfolio Peer Review',
				href: '/portfolio/composition/process-archive#08-eportfolio-peer-review',
				connection: 'This section records two rounds of reader feedback: one about multimodality and another about finding the outcome reflections. It also lists what I changed in response.'
			}
		]
	},
	{
		number: '03',
		id: 'information-literacy',
		title: 'Information Literacy',
		wording: 'Evaluate and act on criteria for relevance, credibility, and ethics when gathering, analyzing, and presenting primary and secondary source materials.',
		reflection: [
			`For the Annotated Bibliography, I did not use the first four articles I found. I looked through more sources, read their abstracts, checked where they were published, and compared the methods they used. I left out articles that mentioned technology but did not actually study communication. In the second paragraph of each annotation, I explain why the source is credible, where it is limited, and how I could use it. For example, Gronseth and Hebert studied graduate educational-technology students. Their study is closely related to my topic, but that group may not represent a typical undergraduate class.`,
			`Ethics changed my project too. After my instructor pointed out that private chat messages would require permission from everyone involved, I decided not to collect screenshots. I completed CITI's Human Subjects Research training before beginning the interview work. I used semi-structured interviews, took written notes instead of recordings, removed course names, and labeled participants P1 through P5 in the paper. In the Analyzing Primary Data response, I wrote about waiting to create codes, including exceptions, and avoiding claims that a small sample cannot support. This part of the project taught me that information literacy is not only about finding credible sources. It also means being honest about how I collected evidence, what I did to protect people, and how much five interviews can actually show.`
		],
		evidence: [
			{
				title: 'Initial Research Proposal',
				href: '/portfolio/composition/initial-research-proposal#instructor-feedback-and-next-decision',
				connection: 'My instructor’s privacy concern led me to stop considering group-chat screenshots and use interviews instead.'
			},
			{
				title: 'Annotated Bibliography',
				href: '/portfolio/composition/annotated-bibliography',
				connection: 'Each annotation evaluates the source’s credibility, relevance, methods, and limits instead of only summarizing it.'
			},
			{
				title: 'Final Research Paper',
				href: '/portfolio/composition/investigative-field-essay',
				connection: 'The paper explains which sources I used, how I protected participants, how I analyzed the interviews, and what five interviews can and cannot show.'
			},
			{
				title: 'Analyzing Primary Data',
				href: '/portfolio/composition/process-archive#02-reading-response-analyzing-primary-data',
				connection: 'I planned how to code interviews without forcing categories, protect participant privacy, and keep my claims within the sample.'
			},
			{
				title: 'CITI Human Subjects Research Training',
				href: '/portfolio/composition/process-archive#07-citi-human-subjects-research-training',
				connection: 'The training informed my choices about consent, anonymity, written notes, and reporting.'
			}
		]
	},
	{
		number: '04',
		id: 'research-genre',
		title: 'Research Genre Production',
		wording: 'Produce writing that navigates choices and constraints in public and/or academic research genres that matter to specific communities.',
		reflection: [
			`The proposal, bibliography, and final paper all focus on the same project, but each one required a different kind of writing. In the Initial Research Proposal, I introduced a question and suggested methods for research I had not completed yet. In the Annotated Bibliography, each entry needed both a summary and an evaluation. The CARS exercise gave me a basic order for the final paper’s introduction: explain what earlier researchers have studied, point out what they have not covered, and then state my own question.`,
			`For the Final Research Paper, I used a reflective cover letter followed by Introduction, Methods, Findings and Analysis, Discussion, Conclusion, Works Cited, and four appendices. The Methods section tells readers how I selected participants, took notes, protected privacy, and coded the interviews. The Findings and Analysis section reports the patterns, while the Discussion compares them with published research on genre, audience, participation, and mobile messaging. Working on all three assignments showed me why I could not use the same structure for each one. The proposal needed a realistic research plan, the bibliography needed an evaluation of each source, and the final paper needed a clear method, findings, and conclusion.`
		],
		evidence: [
			{
				title: 'Initial Research Proposal',
				href: '/portfolio/composition/initial-research-proposal',
				connection: 'I write for a planning genre: I introduce the question, explain why it matters, and propose a method before collecting data.'
			},
			{
				title: 'Annotated Bibliography',
				href: '/portfolio/composition/annotated-bibliography',
				connection: 'I follow the annotation genre by separating each source summary from my evaluation of how the source can be used.'
			},
			{
				title: 'Final Research Paper',
				href: '/portfolio/composition/investigative-field-essay',
				connection: 'I use the sections of an academic research paper to explain the method, report findings, discuss sources, and document the study in appendices.'
			},
			{
				title: 'CARS Model Introduction',
				href: '/portfolio/composition/process-archive#01-cars-model-introduction',
				connection: 'I use the CARS model to explain what earlier research covers, what it leaves out, and why I focused on student-run chats.'
			},
			{
				title: 'Genre and Discourse Communities',
				href: '/portfolio/composition/process-archive#03-reading-response-genre-and-discourse-communities',
				connection: 'I analyze the assignment-clarification question as a genre by identifying its usual parts and explaining what each part does.'
			}
		]
	},
	{
		number: '05',
		id: 'contributing-knowledge',
		title: 'Contributing Knowledge',
		wording: 'Draw conclusions from primary evidence and place that work in conversation with other source materials.',
		reflection: [
			`The five interviews gave me information that the published research could not provide on its own. I spoke with four friends who are current or recent college students and one classmate, all of whom had used student-run class group chats. I labeled parts of their answers with codes such as assignment clarification, deadline checking, reactions, professor avoidance, reassurance, misinformation, humor, and notification stress. I grouped those codes into five broad themes: quick academic information, audience and rhetorical cost, quiet participation, emotional and social support, and risks and boundaries. The final table records how I defined each theme, and the chart shows how many participants mentioned six of the main patterns.`,
			`I used nine secondary sources to make sense of those patterns. Lauricella and Kay helped me explain why students communicate differently with classmates and professors. Baron et al. and Hrastinski helped me discuss reactions and quiet reading as participation. Devitt, Bawarshi, and Reiff gave me a way to describe the chat as a genre built around repeated social actions. Based on both the interviews and the sources, I argue that students often use class chats to restate official instructions in more familiar language and ask questions with less pressure. I also discuss incorrect information, too many notifications, and questions that can cross an academic-integrity boundary. Since I only interviewed five people, I do not treat these patterns as true for every college student. They show what happened in this group and what a larger study could look for.`
		],
		evidence: [
			{
				title: 'Final Research Paper',
				href: '/portfolio/composition/investigative-field-essay#data-display',
				connection: 'I code five interviews, group them into themes, and compare those findings with nine secondary sources before making the final claim.'
			},
			{
				title: 'Analyzing Primary Data',
				href: '/portfolio/composition/process-archive#02-reading-response-analyzing-primary-data',
				connection: 'This early response shows the analysis plan I later used to move from interview notes to codes and themes.'
			}
		]
	},
	{
		number: '06',
		id: 'revision',
		title: 'Revision',
		wording: 'Negotiate differences in and act with intention on feedback from readers when drafting, revising, and editing writing.',
		reflection: [
			`Before this course, I probably would have called grammar corrections and word changes “revision.” The Revision vs. Editing assignment helped me separate the two. Revision can change the claim, organization, evidence, or explanation, while editing deals with sentences, citations, and formatting after the larger decisions are made. Draft 1 of my field essay already contained the full research project, but it repeated some ideas and did not explain several parts of the method clearly enough.`,
			`The biggest changes between Draft 1 and Revision 1 were defining “student-run class group chat” earlier, making the claim more specific, explaining the convenience sample and coding process, and separating the findings from the Discussion. For the final paper, I used the feedback I received to make the coding visible, bring more sources into the Discussion, support the analysis with more examples, and explain where the research could go next. I also added a reflective cover letter and four appendices containing the consent records, interview protocol, coding matrix, and dated interview notes. The ePortfolio peer review raised the same issue about multimodality, so I added the paper’s coding table and bar chart to the web page too. When a later reader had trouble finding the outcome reflections, I split the original overview into three pages and added a “Why it connects” explanation for every artifact listed under an outcome.`
		],
		evidence: [
			{
				title: 'Final Research Paper',
				href: '/portfolio/composition/investigative-field-essay#revision-map',
				connection: 'The revision map shows changes to the claim, method, organization, evidence display, source use, and conclusion across three versions. The cover letter explains why I made the final round of changes and what I would keep working on.'
			},
			{
				title: 'Revision vs. Editing',
				href: '/portfolio/composition/process-archive#04-revision-vs-editing',
				connection: 'This assignment helped me separate large changes to meaning and structure from sentence-level editing.'
			},
			{
				title: 'Mid-Project Reflection',
				href: '/portfolio/composition/process-archive#05-mid-project-reflection',
				connection: 'In this reflection, I explain how the interviews challenged my first assumptions and what I needed to change in the next draft.'
			},
			{
				title: 'ePortfolio Design Reflection',
				href: '/portfolio/composition/process-archive#06-eportfolio-design-reflection',
				connection: 'I explain why I replaced the early placeholder pages with separate pages for the outcomes, artifacts, assignments, and process work.'
			},
			{
				title: 'ePortfolio Peer Review',
				href: '/portfolio/composition/process-archive#08-eportfolio-peer-review',
				connection: 'I record feedback about multimodality and navigation, then explain the specific design changes I made in response.'
			}
		]
	}
];

export const artifacts: PortfolioArtifact[] = [
	{
		number: '01',
		type: 'Major · Gordon Rule',
		title: 'Initial Research Proposal',
		summary: 'My original question, its connection to Writing Studies, and my first plan for primary research.',
		date: 'Jul 06',
		href: '/portfolio/composition/initial-research-proposal',
		download: '/portfolio/composition/files/initial-research-proposal.docx',
		outcomeIds: ['generating-inquiry', 'information-literacy', 'research-genre']
	},
	{
		number: '02',
		type: 'Major · Gordon Rule',
		title: 'Annotated Bibliography',
		summary: 'Four scholarly sources, with a summary and evaluation of each one.',
		date: 'Jul 12',
		href: '/portfolio/composition/annotated-bibliography',
		download: '/portfolio/composition/files/annotated-bibliography.docx',
		outcomeIds: ['generating-inquiry', 'information-literacy', 'research-genre']
	},
	{
		number: '03',
		type: 'Major · Gordon Rule',
		title: 'Final Research Paper',
		summary: 'The completed interview study, with a reflective cover letter, coding table, chart, nine secondary sources, and four appendices.',
		date: 'Aug 02',
		href: '/portfolio/composition/investigative-field-essay',
		download: '/portfolio/composition/files/final-research-paper.docx',
		outcomeIds: ['generating-inquiry', 'multiple-ways', 'information-literacy', 'research-genre', 'contributing-knowledge', 'revision']
	},
	{
		number: '04',
		type: 'Process',
		title: 'CARS Model Introduction',
		summary: 'An introduction organized around earlier research, what it leaves out, and my question.',
		date: 'Jul 15',
		href: '/portfolio/composition/process-archive#01-cars-model-introduction',
		download: '/portfolio/composition/files/cars-model-introduction.docx',
		outcomeIds: ['generating-inquiry', 'research-genre']
	},
	{
		number: '05',
		type: 'Reading Response',
		title: 'Analyzing Primary Data',
		summary: 'My original plan for coding, anonymity, recurring patterns, and the limits of my evidence.',
		date: 'Jul 13',
		href: '/portfolio/composition/process-archive#02-reading-response-analyzing-primary-data',
		download: '/portfolio/composition/files/analyzing-primary-data.docx',
		outcomeIds: ['information-literacy', 'contributing-knowledge']
	},
	{
		number: '06',
		type: 'Reading Response',
		title: 'Genre and Discourse Communities',
		summary: 'An analysis of how students ask for assignment clarification in class chats.',
		date: 'Jul 27',
		href: '/portfolio/composition/process-archive#03-reading-response-genre-and-discourse-communities',
		download: '/portfolio/composition/files/understanding-genre.docx',
		outcomeIds: ['multiple-ways', 'research-genre']
	},
	{
		number: '07',
		type: 'Process Reflection',
		title: 'Revision vs. Editing',
		summary: 'My explanation of how revision differs from sentence-level editing.',
		date: 'Jul 24',
		href: '/portfolio/composition/process-archive#04-revision-vs-editing',
		download: null,
		outcomeIds: ['revision']
	},
	{
		number: '08',
		type: 'Process Reflection',
		title: 'Mid-Project Reflection',
		summary: 'A check-in on how my question changed and what I still needed to do.',
		date: 'Jul 20',
		href: '/portfolio/composition/process-archive#05-mid-project-reflection',
		download: null,
		outcomeIds: ['generating-inquiry', 'revision']
	},
	{
		number: '09',
		type: 'Digital Composition',
		title: 'ePortfolio Design Reflection',
		summary: 'Why I organized the site around course outcomes, assignments, and the order of the project.',
		date: 'Jul 17–28',
		href: '/portfolio/composition/process-archive#06-eportfolio-design-reflection',
		download: null,
		outcomeIds: ['multiple-ways', 'revision']
	},
	{
		number: '10',
		type: 'Research Ethics Training',
		title: 'CITI Human Subjects Research Training',
		summary: 'The required training I completed before interviewing participants.',
		date: 'Jul 03',
		href: '/portfolio/composition/process-archive#07-citi-human-subjects-research-training',
		download: null,
		outcomeIds: ['information-literacy']
	},
	{
		number: '11',
		type: 'Peer Feedback',
		title: 'ePortfolio Peer Review',
		summary: 'Two rounds of reader feedback on navigation, accessibility, artifact use, and multimodality, followed by the changes I made.',
		date: 'Jul 27–Aug 03',
		href: '/portfolio/composition/process-archive#08-eportfolio-peer-review',
		download: null,
		outcomeIds: ['multiple-ways', 'revision']
	}
];

export const researchArc = [
	{ date: 'Jul 06', title: 'Choose the question', note: 'Decide to study how students use class chats for questions and support.' },
	{ date: 'Jul 12', title: 'Research the topic', note: 'Compare four sources on messaging, participation, and peer support.' },
	{ date: 'Jul 15', title: 'Narrow the focus', note: 'Focus on chats created by students, not messaging spaces run by instructors.' },
	{ date: 'Jul 16–19', title: 'Interview and code', note: 'Interview five participants and group their answers by recurring ideas.' },
	{ date: 'Jul 19–Aug 02', title: 'Draft, revise, and submit', note: 'Revise the claim and organization, then add the data display, more sources, a cover letter, and four appendices.' }
];

export const outcomeById = new Map(outcomes.map((outcome) => [outcome.id, outcome]));

export const artifactByTitle = new Map(artifacts.map((artifact) => [artifact.title, artifact]));

const evidencePairs = new Set(
	outcomes.flatMap((outcome) => outcome.evidence.map((item) => `${outcome.id}::${item.title}`))
);
const taggedPairs = new Set(
	artifacts.flatMap((artifact) => artifact.outcomeIds.map((outcomeId) => `${outcomeId}::${artifact.title}`))
);
const relationshipDrift = [
	...[...evidencePairs].filter((pair) => !taggedPairs.has(pair)),
	...[...taggedPairs].filter((pair) => !evidencePairs.has(pair))
];

if (artifacts.length !== 11 || evidencePairs.size !== 26 || taggedPairs.size !== 26 || relationshipDrift.length > 0) {
	throw new Error(
		`Composition portfolio data is out of sync: ${artifacts.length} artifacts, ${evidencePairs.size} explained connections, ${taggedPairs.size} tagged connections, drift: ${relationshipDrift.join(', ') || 'none'}.`
	);
}

export const connectionsForArtifact = (artifactTitle: string) =>
	outcomes.flatMap((outcome) => {
		const evidence = outcome.evidence.find((item) => item.title === artifactTitle);
		return evidence ? [{ outcome, evidence }] : [];
	});

export const outcomeHref = (title: string) => {
	if (title === 'All Six Course Outcomes') return '/portfolio/composition/outcomes';
	const outcome = outcomes.find((item) => item.title === title);
	return outcome ? `/portfolio/composition/outcomes#${outcome.id}` : '/portfolio/composition/outcomes';
};
