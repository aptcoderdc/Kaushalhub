import { facultyMembers, type FacultyMember } from "@/lib/faculty";

export type ProgramTopic = { title: string; description: string };
export type ProgramJourneyStep = {
  period: string;
  title: string;
  description: string;
};

export type ProgramSection =
  | { kind: "learning"; title: string; columns: 2 | 3; items: ProgramTopic[] }
  | {
      kind: "journey";
      title: "Indicative Learning Journey";
      note: string;
      steps: ProgramJourneyStep[];
    }
  | { kind: "campus"; title: string; body: string }
  | { kind: "audience"; title: string; body?: string; groups?: ProgramTopic[] }
  | { kind: "structure"; title: string; items: ProgramTopic[] }
  | { kind: "outcomes"; title: string; items: string[] }
  | { kind: "venue"; title: string; body: string; details: string[] };

export type Program = {
  slug: string;
  path: string;
  title: string;
  description: string;
  metadata: { label: string; value: string }[];
  seoDescription: string;
  subtitle: string;
  pageDescription: string;
  details: { label: string; value: string }[];
  heroNotice: string;
  sections: ProgramSection[];
  /** Faculty shown in the "Meet Your Faculty" section; leave empty to hide it. */
  faculty: FacultyMember[];
  finalNotice: string;
};

export const programs: Program[] = [
  {
    slug: "entrepreneurship-for-school-students",
    path: "/programs/entrepreneurship-for-school-students",
    title: "Entrepreneurship for School Students",
    description:
      "An introduction to identifying problems, developing ideas and understanding how ventures are built.",
    metadata: [{ label: "Eligibility", value: "Class 12 students" }],
    seoDescription:
      "An introductory entrepreneurship program for Class 12 students, with practical learning about problems, ideas and ventures.",
    subtitle:
      "Learn to identify problems, develop ideas and explore how ventures are built.",
    pageDescription:
      "An introductory entrepreneurship program designed for Class 12 students who want to understand how ideas become practical solutions.",
    details: [
      { label: "Duration", value: "4 weeks" },
      { label: "Program fee", value: "₹8,000" },
      { label: "Eligibility", value: "Class 12 students" },
      { label: "Format", value: "Online learning with campus immersion" },
      { label: "Campus immersion", value: "IIT Delhi" },
    ],
    heroNotice: "Explore the program structure and learning experience.",
    sections: [
      {
        kind: "learning",
        title: "What You’ll Learn",
        columns: 2,
        items: [
          {
            title: "Spot Real-World Problems",
            description:
              "Recognise problems in everyday life, communities, familiar industries and the environments around you.",
          },
          {
            title: "Develop and Evaluate Ideas",
            description:
              "Turn a problem into a potential solution and learn to compare different approaches.",
          },
          {
            title: "Understand Customers",
            description:
              "Identify who experiences a problem and learn how asking useful questions can improve an idea.",
          },
          {
            title: "Explore How Ventures Work",
            description:
              "Understand the basics of customers, value creation, costs, revenue and business models.",
          },
        ],
      },
      {
        kind: "journey",
        title: "Indicative Learning Journey",
        note: "This is an indicative progression, not a final approved curriculum.",
        steps: [
          {
            period: "Week 1",
            title: "Problems and Opportunities",
            description: "Identify a meaningful problem worth exploring.",
          },
          {
            period: "Week 2",
            title: "Ideas and Solutions",
            description: "Develop and evaluate potential solutions.",
          },
          {
            period: "Week 3",
            title: "Customers and Business Basics",
            description:
              "Understand users, value and introductory business models.",
          },
          {
            period: "Week 4",
            title: "Presenting an Idea",
            description:
              "Present a venture concept and explain its potential.",
          },
        ],
      },
      {
        kind: "campus",
        title: "Experience Learning at IIT Delhi",
        body:
          "The program includes a campus immersion at IIT Delhi, connecting the learning experience with an in-person campus environment.",
      },
      {
        kind: "audience",
        title: "Who Is This Program For?",
        body:
          "This program is intended for Class 12 students interested in entrepreneurship, problem-solving, innovation and understanding how businesses are created.",
      },
    ],
    faculty: facultyMembers,
    finalNotice:
      "To ask about dates, registration or anything else about this program, get in touch with the Kaushal Hub team.",
  },
  {
    slug: "entrepreneurship-for-undergraduates",
    path: "/programs/entrepreneurship-for-undergraduates",
    title: "Entrepreneurship for Undergraduate Students",
    description:
      "A practical introduction to identifying opportunities, testing ideas and exploring the process of building a venture.",
    metadata: [{ label: "Eligibility", value: "Undergraduate students" }],
    seoDescription:
      "A six-week entrepreneurship program for undergraduate students interested in testing ideas and exploring venture building.",
    subtitle: "Turn promising ideas into opportunities worth testing.",
    pageDescription:
      "A practical introduction to identifying opportunities, testing ideas and exploring the process of building a venture.",
    details: [
      { label: "Duration", value: "6 weeks" },
      { label: "Program fee", value: "₹19,999" },
      { label: "Eligibility", value: "Undergraduate students" },
      { label: "Format", value: "Online learning with campus immersion" },
      { label: "Campus immersion", value: "IIT Delhi" },
    ],
    heroNotice: "Discover what you will learn in this program.",
    sections: [
      {
        kind: "learning",
        title: "What You’ll Learn",
        columns: 3,
        items: [
          {
            title: "Opportunity Discovery",
            description:
              "Identify problems and unmet needs that could support a venture.",
          },
          {
            title: "Customer Discovery and Validation",
            description:
              "Understand potential customers, existing alternatives and ways to test assumptions.",
          },
          {
            title: "Prototyping and MVPs",
            description:
              "Explore practical ways to represent, demonstrate and test an early solution.",
          },
          {
            title: "Business Models and Pricing",
            description:
              "Understand how a venture creates value, reaches customers and generates revenue.",
          },
          {
            title: "Go-to-Market Fundamentals",
            description:
              "Learn the basics of positioning, customer acquisition and early sales.",
          },
          {
            title: "Pitching Your Venture",
            description:
              "Communicate a problem, solution, target market and business opportunity clearly.",
          },
        ],
      },
      {
        kind: "journey",
        title: "Indicative Learning Journey",
        note:
          "This is a preliminary structure and should not be treated as a final or approved curriculum.",
        steps: [
          {
            period: "Week 1",
            title: "Problems and Opportunities",
            description: "Define an opportunity worth exploring.",
          },
          {
            period: "Week 2",
            title: "Customer Discovery",
            description: "Gather initial customer evidence.",
          },
          {
            period: "Week 3",
            title: "Solution and MVP",
            description: "Develop a testable solution concept.",
          },
          {
            period: "Week 4",
            title: "Business Model and Pricing",
            description:
              "Explain how the venture could create and capture value.",
          },
          {
            period: "Week 5",
            title: "Go-to-Market Fundamentals",
            description:
              "Develop an initial approach to reaching potential customers.",
          },
          {
            period: "Week 6",
            title: "Venture Presentation",
            description: "Present the concept and supporting evidence.",
          },
        ],
      },
      {
        kind: "campus",
        title: "Take Your Learning to IIT Delhi",
        body:
          "The program includes a campus immersion at IIT Delhi, giving participants an in-person campus experience alongside their online learning.",
      },
      {
        kind: "audience",
        title: "Who Is This Program For?",
        body:
          "The program is intended for undergraduate students interested in entrepreneurship, innovation, startups, product development or exploring a venture while studying.",
      },
    ],
    faculty: facultyMembers,
    finalNotice:
      "To ask about dates, registration or anything else about this program, get in touch with the Kaushal Hub team.",
  },
  {
    slug: "generative-ai-in-action",
    path: "/programs/generative-ai-in-action",
    title: "Generative AI in Action with Microsoft Intelligent Tools",
    description:
      "Learn from Microsoft experts to understand, build and responsibly use Generative AI with real-world tools.",
    metadata: [
      {
        label: "Eligibility",
        value: "People interested in practical Generative AI learning",
      },
      { label: "Format", value: "One-day, hands-on program" },
      { label: "Location", value: "IIT Delhi" },
    ],
    seoDescription:
      "A one-day, hands-on Generative AI program at IIT Delhi covering Microsoft tools, AI-assisted development and responsible AI use.",
    subtitle:
      "Understand, build and responsibly use Generative AI with real-world tools.",
    pageDescription:
      "A one-day, hands-on program at IIT Delhi designed to introduce participants to modern Generative AI systems, Microsoft’s AI ecosystem, AI-assisted development and responsible AI use.",
    details: [
      { label: "Duration", value: "1 day" },
      { label: "Location", value: "IIT Delhi" },
      { label: "Format", value: "In-person, hands-on" },
      {
        label: "Focus",
        value:
          "Generative AI, Microsoft AI tools, AI-assisted development and Responsible AI",
      },
    ],
    heroNotice: "Explore the learning journey, program format and key outcomes.",
    sections: [
      {
        kind: "audience",
        title: "Who Is This Program For?",
        groups: [
          {
            title: "Class 12 Students",
            description:
              "Explore how Generative AI works, where it can be useful and how to use AI tools thoughtfully.",
          },
          {
            title: "B.Tech Students — Third and Fourth Year",
            description:
              "Understand how AI tools can support software development, prototyping and the development lifecycle.",
          },
          {
            title: "Entrepreneurs",
            description:
              "Explore how Generative AI and AI-powered tools can support research, workflows, experimentation and business problem-solving.",
          },
        ],
      },
      {
        kind: "structure",
        title: "A Single Day, Structured Across Five Domains",
        items: [
          {
            title: "Generative AI Fundamentals",
            description:
              "Explore the architecture of large language models, context and retrieval, and the boundaries of current systems.",
          },
          {
            title: "The Microsoft AI Ecosystem",
            description:
              "An introduction to Copilot, Copilot Studio, Azure AI Foundry and Agent Builder, including their roles in different AI workflows.",
          },
          {
            title: "GitHub Copilot for Developers",
            description:
              "An introduction to how AI supports real software development.",
          },
          {
            title: "Azure AI Foundry",
            description:
              "Understand how AI models are selected, evaluated and deployed in practice.",
          },
          {
            title: "Responsible AI",
            description:
              "Explore Microsoft’s principles for safety, governance and accountable use.",
          },
        ],
      },
      {
        kind: "outcomes",
        title: "What Participants Can Expect to Learn",
        items: [
          "Develop a foundational understanding of Generative AI and its limitations.",
          "Become familiar with relevant Microsoft AI tools and their use cases.",
          "Understand how AI can support software development and prototyping.",
          "Learn the basic considerations involved in model selection, evaluation and deployment.",
          "Understand principles of responsible AI use, safety and governance.",
        ],
      },
      {
        kind: "venue",
        title: "One Day at IIT Delhi",
        body:
          "The program is an in-person, hands-on day at IIT Delhi.",
        details: [
          "One-day program",
          "In-person format",
          "IIT Delhi",
          "Intended for Class 12 students, third- and fourth-year B.Tech students, and entrepreneurs",
        ],
      },
    ],
    // The shared faculty list does not teach this course, so its page has no faculty section.
    faculty: [],
    finalNotice:
      "To ask about dates, registration or anything else about this program, get in touch with the Kaushal Hub team.",
  },
];

export function findProgram(slug: string) {
  return programs.find((program) => program.slug === slug);
}
