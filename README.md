![Kyle](https://media1.tenor.com/m/33qCDJByr9kAAAAC/can-i-ask-you-a-few-questions-kyle-broflovski.gif)



# Verbalize
Grading code submissions often fail to reveal whether a student truly understands the underlying concepts or merely submitted an AI generated solution. Capture the full picture of student learning with Verbalize! Designed for professors, Verbalize is a web-based automated oral defense platform where students verbally explain their code logic and design choices through voice calls. It analyzes their answers to verify deep comprehension, ensuring grades reflect conceptual understanding rather than just working syntax.

## MVP 
* User Authentication with Signup/Signin
* File upload system
* Database integration for code submissions
* Question generation
* Notification and call system with Twilio
* Confidence score calculation

## Stretch Goals
* Anti cheating system during calls
* Conversational agent that clarifies on responses
* ElevenLabs integration

## Timeline

## Tech Stack & Resources

<details> 
<summary> Frontend </summary>

- [Figma](https://www.figma.com/design/)
- **Next.js + Tailwind CSS**

  - [What is React?](https://www.youtube.com/watch?v=Tn6-PIqc4UM)
  - [React Foundations](https://nextjs.org/learn/react-foundations)
  - [Next.js Course](https://nextjs.org/learn?utm_source=next-site&utm_medium=homepage-cta&utm_campaign=home)
  - [Next.js Tutorial]("https://www.youtube.com/watch?v=ZVnjOPwW4ZA")
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

- [Git]("https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download)
- [Postman](https://www.postman.com/downloads/)
- [VS Code](https://code.visualstudio.com/)
  
</details>

## Roadblocks & Possible Solutions

- Question generation for each student may take too long
  - Use Groq to ensure fast response times
  - Generate around 20 questions at once and choose a random subset of questions for each student at the cost of personalization

- Follow up for certain questions
  - Confidence Threshold Loop: If responses don't satisfy a certain threshold, generating follow up questions based on students' responses may be time consuming.
  - For each question, generate follow up questions beforehand based on response categories such as deep, vague, incorrect, etc.

- Either the frontend or backend team is falling behind
  - If this happens, the best course would be to get some assistance from the other side until caught up.


## Competitors
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


## Team


