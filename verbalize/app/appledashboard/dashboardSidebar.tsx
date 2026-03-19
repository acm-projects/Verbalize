"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock global summary data
const globalSummary = {
  totalStudents: 185,
  pendingCalls: 24,
  completionRate: 82
};

export default function DashboardSidebar({ activePage = 'dashboard' }) {
  // State for AI Q&A input box
  const [aiQuestion, setAiQuestion] = useState("");

  // Dynamically determine the AI bubble's title and text
  let aiTitle = "Welcome, Prof.";
  let aiMessage = "";

  switch (activePage) {
    case 'assignments':
      aiTitle = "Assignments";
      aiMessage = "Here are your weekly assignments. The AI Agent will use these to challenge your students.";
      break;
    case 'students':
      aiTitle = "Student Analysis";
      aiMessage = "Review student code and my interview transcripts here. I've highlighted key logic for you.";
      break;
    case 'grades':
      aiTitle = "Final Grading";
      aiMessage = "Check the oral defense call statuses. You have the final say on the grades based on my evaluations.";
      break;
  }

  return (
    // Outermost container: Fixed on the left side
    <div>
      
    </div>
  );
}