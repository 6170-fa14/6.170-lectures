Lecture 17: Ur/Web

Ur/Web is a new Web programming language, developed in Prof. Chlipala's group.  It's certainly not part of the core material of 6.170; this is a kind of "bonus" lecture, involving a look at one contender for the future of programming the Web and similar platforms!  More information, including the language implementation itself, can be found on the project home page:
       http://www.impredicative.com/ur/

The code demo is successive versions of "Fritter" (in the style of Project 2), adding new kinds of functionality.  The visual styling is intentionally simple to help us focus on the logic; please don't take this as an example of classy GUI design for 6.170, or of what visual styling Ur/Web allows. :-)

Here are the demos:
  fritter0: dead-simple user account management with cookies
  fritter1: basic message posting and reading, using multiple pages
  fritter2: adding followers
  fritter3: adding hashtags with searching
  fritter4: switching to a single-page version with AJAX calls
  fritter5: using asynchronous messaging to notify clients of new messages

Almost all details of using Ur/Web are outside the scope of this lecture.  However, for anyone who has managed to build and install the Ur/Web development tools, the following sequence of commands should suffice for building and running any of the demos, assuming PostgreSQL is installed and configured properly:
  urweb fritterN
  createdb fritter
  psql -f fritter.sql fritter
  ./fritterN.exe
