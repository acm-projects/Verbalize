<div align="center">
  <img src = "https://media1.tenor.com/m/33qCDJByr9kAAAAC/can-i-ask-you-a-few-questions-kyle-broflovski.gif">
</div>

# Verbalize 🎙️
Grading code submissions often fail to reveal whether a student truly understands the underlying concepts or merely submitted an AI generated solution. Capture the full picture of student learning with Verbalize! Designed for professors, Verbalize is a web-based automated oral defense platform where students verbally explain their code logic and design choices through voice calls. It analyzes their answers to verify deep comprehension, ensuring grades reflect conceptual understanding rather than just working syntax.

## MVP 🏆
* User Authentication with Signup/Signin
* File upload system
* Database integration for code submissions
* Question generation
* Notification and call system with Twilio
* Confidence score calculation

## Stretch Goals 🚀
* Anti cheating system during calls
* Conversational agent that clarifies on responses
* ElevenLabs integration

## Timeline 🗓️

<table align="center">
  <thead>
    <tr>
      <th>Week</th>
      <th>Frontend Tasks</th>
      <th>Backend Tasks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><strong>Week 1</strong></td>
      <td>
        <ul>
          <li>Discuss overall tech stack & UI designs</li>
          <li>Start Low-to-High Fidelity UI designs</li>
          <li>Research Next.js and Tailwind CSS</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Finalize tech stack (Supabase/PostgreSQL)</li>
          <li>Initialize Next.js API routes</li>
          <li>Explore APIs using Postman</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center"><strong>Week 2</strong></td>
      <td>
        <ul>
          <li>UI design basics review</li>
          <li>Flesh out Professor workflow</li>
          <li><b>Figma Design due by end of week</b></li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Plan database schema (Professors, Classes, Submissions)</li>
          <li>Implement Supabase Auth for professors</li>
          <li>Establish working database connection</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center"><strong>Week 3-4</strong></td>
      <td>
        <ul>
          <li>Code Login/SignUp pages</li>
          <li>Class Creation page</li>
          <li>Assignment Creation page (Title/Description)</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Route to insert student data into DB</li>
          <li>File parsing (extract NetID and code)</li>
          <li>Generate 4-digit unique PINs for students</li>
          <li>Supabase storage setup for code submissions</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center"><strong>Week 4-5</strong></td>
      <td>
        <ul>
          <li>Drag-and-drop UI for student ZIP folders</li>
          <li>Input validation for title/description</li>
          <li>Handle upload state and loading UI</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Prompt engineering for question generation (3-5 questions)</li>
          <li>Difficulty scaling (Recursion, Runtime, Class Purpose)</li>
          <li><b>Optimization:</b> Pre-generate question pool & pick random subsets</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center"><strong>Week 5-6</strong></td>
      <td>
        <ul>
          <li>Student list view for assignments</li>
          <li>Dropdowns for transcripts and recordings</li>
          <li>Add <b>Status Column</b> (Pending, Called, Graded)</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Twilio SendGrid email notification system</li>
          <li>Twilio phone number setup</li>
          <li>Call system: PIN verification & TwiML 
          <li>Record student audio responses</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center"><strong>Week 7-8</strong></td>
      <td>
        <ul>
          <li><b>Analytics Page:</b> Chart.js for score distribution</li>
          <li>Final frontend/backend integration</li>
          <li>Stretch goal implementation</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Integrate Gemini for confidence scoring</li>
          <li>Process Twilio STT transcripts</li>
          <li>Stretch goal implementation</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center"><strong>Week 9-10</strong></td>
      <td>
        <ul>
          <li>Presentation Night Prep 🎉</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Presentation Night Prep 🎉</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Tech Stack & Resources 💻

<details> 
<summary> Frontend </summary>

- [Figma](https://www.figma.com/design/)
- **Next.js + Tailwind CSS**

  - [What is React?](https://www.youtube.com/watch?v=Tn6-PIqc4UM)
  - [React Foundations](https://nextjs.org/learn/react-foundations)
  - [Next.js Course](https://nextjs.org/learn?utm_source=next-site&utm_medium=homepage-cta&utm_campaign=home)
  - [Next.js Tutorial](https://www.youtube.com/watch?v=ZVnjOPwW4ZA)
  - [Next.js in 7 minutes](https://www.youtube.com/watch?v=xnOwOBYaA3w)
  - [Tailwind CSS Docs](https://tailwindcss.com/docs/installation/using-vite)
</details>

<details>
<Summary> Backend </Summary>

- Frameworks
  - [Node.js](https://nodejs.org/en/)
  - [Node.js Crash Course](https://www.youtube.com/watch?v=32M1al-Y6Ag)

- Supabase
  - [PostgreSQL Tutorial](https://www.youtube.com/watch?v=SpfIwlAYaKk)
  - [Supabase Docs](https://supabase.com/docs)
  - [Supabase Course](https://www.youtube.com/watch?v=kyphLGnSz6Q)
  - [User Auth with Supabase](https://supabase.com/docs/guides/auth)
- APIs
  - [Building APIs with Next.js](https://nextjs.org/blog/building-apis-with-nextjs)
  - [Gemini API](https://ai.google.dev/gemini-api/docs)
  - [Groq](https://console.groq.com/docs/overview)

  - Twilio 
    - [SendGrid Docs](https://www.twilio.com/docs/sendgrid)
    - [Voice Docs](https://www.twilio.com/docs/voice)
</details>


<details>
<Summary>Full Stack</Summary>

- [Next.js + Supabase Setup Guide](https://www.youtube.com/watch?v=6XGvBBDtRfo)
- [Trello App built with Next.js, Supabase](https://www.youtube.com/watch?v=ugxI1o5SyMs)
</details>


<details>
<Summary>Developer Tools</Summary>

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download)
- [Postman](https://www.postman.com/downloads/)
- [VS Code](https://code.visualstudio.com/)
  
</details>

## Roadblocks & Possible Solutions 🚧

- Question generation for each student may take too long
  - Use Groq to ensure fast response times
  - Generate around 20 questions at once and choose a random subset of questions for each student at the cost of personalization

- Follow up for certain questions
  - Confidence Threshold Loop: If responses don't satisfy a certain threshold, generating follow up questions based on students' responses may be time consuming.
  - For each question, generate follow up questions beforehand based on response categories such as deep, vague, incorrect, etc.

- Either the frontend or backend team is falling behind
  - If this happens, the best course would be to get some assistance from the other side until caught up.


## Competitors ⚔️
- Verbal Check (Oral plagiarism detector, no code-specific grading)
- MOSS (Only checks similarity between submissions)
- TurnItIn/ZeroGPT (Does not work for code)

## Git Cheatsheet 📓

| Command                             | What it does                               |
| ----------------------------------- | ------------------------------------------ |
| git init                            | Initalize a new Git repo                   |
| git clone "rep-url"                 | Clone a repo from a URL                    |
|                                     |                                            |
| git status                          | Show changes status                        |
| git add "file"                      | Add changes to staging, use "." for all    |
| git commit -m "Descriptive Message" | Commit changes with a message              |
| git push                            | Upload local repo content to a remote repo |
| git log                             | View commit history                        |
|                                     |                                            |
| git branch                          | Lists all the branches                     |
| git branch "branch-name"            | Create a new branch                        |
| git checkout "branch-name"          | Switch to a branch                         |
| git checkout -b "branch-name"       | Combines the previous 2 commands           |
| git merge "branch-name"             | Merge changes from a branch                |
| git branch -d "branch-name"         | Delete a branch                            |
| git push origin "branch-name"       | Push to branch                             |
| git pull origin "branch-name"       | Pull updates from a specific branch        |
|                                     |                                            |
| git pull                            | Fetch and merge changes                    |
| git fetch                           | Fetch changes without merging              |
| git reset --hard HEAD               | Discard changes                            |
| git revert <commit-hash>            | Revert changes in a commit                 |


## Team 👥

- Harshitha Mahesh (Harshey)
- Lidegee Xi Manufactury
- Rupesh Senthil HELLO!!
- Huy Nguyen - Asian boi
- Sunay Shehaan - Project Manager
- Bryce Duncan - Industry Mentor
