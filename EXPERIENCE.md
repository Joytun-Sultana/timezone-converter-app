# Experience Report

At the beginning, I was confused about what to include in the **skills** and **rules** files for Cursor. Using the prompt format provided by the mentor, I generated project-specific rules and skills for the timezone converter.

While creating a new skill, Cursor opened a `/create-skill` prompt automatically. After describing the project requirements, Cursor generated the skill file, including UTC handling, reusable conversion logic, validation, and testing requirements.

After setting up rules and skills, I split the full project requirement into **five separate prompts**:

1. Generate context folder
2. Generate tests from context
3. Implement conversion logic
4. Build Vue UI
5. Add Playwright tests

This helped follow a **context-driven development approach** and improved output quality.

Finally, I implemented the **Git submodule** concept. Since this was new to me, I faced some confusion initially. I moved the `context/` folder into a separate repository and added it as a submodule to simulate a multi-repo setup.

Overall, the experience was very helpful. I learned context-based development, Cursor skills configuration, structured prompting, and Git submodules.
