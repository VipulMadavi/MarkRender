# Dev Journal - MarkRender

### Mar 3, 2026 - 15:45

yo, just finished setting up the project docs and planning stuff. the tracker files are looking pretty solid but man, writing all those technical specs took forever. i'm kinda excited to actually start coding though. vite + react should be fast. i just hope i don't mess up the codemirror 6 config, i heard it's a bit of a beast compared to v5. anyway, plan is ready. gonna start scaffolding next. fingers crossed. 🤞
i also added this journal cuz i keep forgetting what i did yesterday and the formal changelogs are just... too boring lol. lets see how this goes.

### Mar 3, 2026 - 16:15

phase 2 is done! damn, that calm night theme looks sick. the gradient background and that blur on the toolbar... chef's kiss. spent way too much time fiddling with the css colors to get it "just right" but it was worth it. chrome's headless mode was being a pain with the screenshots but i verified the styles via js so we're good. a4 page simulation in the preview looks pretty close to what i want. on to the markdown meat next. 🥩

### Mar 3, 2026 - 16:30

pipeline is officially live. katex and prism were a bit of a shuffle—had to make sure the math processing happened before the markdown-it render so the parser wouldn't escape the backslashes. frontmatter stripping works like a charm too. it's cool seeing the toolbar title change automatically when i edit the "raw" markdown string in the test code. word count feels accurate enough. next up is the big one: codemirror 6. time to turn that ugly pre tag into a real editor. 💻

### Mar 4, 2026 - 00:03

okay THE EDITOR IS IN. codemirror 6 was honestly not as scary as i thought it'd be. the extension-based API is actually kinda clean once you get the mental model. had to hunt down `@codemirror/commands` cuz it wasn't installed as a transitive dep—wasted like 5 min wondering why `defaultKeymap` was undefined lol. but now we got line numbers, undo/redo, bracket matching, markdown highlighting, the whole thing. and the calm night theme looks SO GOOD in the editor. typed in 7500 words and it didn't even flinch, 43ms dispatch. the live preview updating as i type is super satisfying. the `pre` tag is dead, long live CodeMirror. 🎉

### Mar 4, 2026 - 00:15

phase 5 done and honestly this one felt quick. the preview component is basically a wrapper around dangerouslySetInnerHTML but with scroll preservation which was the tricky bit—used a ref to track scrollTop so it doesn't jump around when you're typing. the error boundary was fun to build, the fallback UI with the warning icon and "Try Again" button looks surprisingly polished for something you hope users never see lol. threw in an XSS test with a script tag and it just sits there doing nothing, which is exactly what we want. everything renders: math, code, tables, headings. no white screens. vibes are good. onto PDF export next 📄

### Mar 4, 2026 - 00:31

pdf export is in!! the PrintSettings panel turned out really nice honestly—glassmorphism dropdown with the page size, margins, and title fields. the title auto-fills from frontmatter which is a nice touch. the whole `window.print()` approach is kinda hacky but it works—inject a dynamic `@page` style, call print, then yank it back out. the browser print dialog is unavoidable which is annoying but hey, it does the job. the panel has a smooth scale+fade animation on open and close-on-click-outside... feels way more polished than i expected for a "dropdown". 6 down, 3 to go. next one is the BIG one—full app layout with toolbar, autosave, shortcuts, the whole nine yards. gonna be a ride 🎢
