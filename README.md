## Getting Started

This document is intended to get you started quickly in building a backend driven Node.js application complete with pages and content, backend logic and a PostgreSQL database for data storage.
## Prerequisites

The only prerequisite software required to have installed at this point is Git for version control and a code editor - we will use VS Code (VSC).

## Package Management

The foundation of the project development software is Node. While functional, Node depends on "packages" to add functionality to accomplish common tasks. This requires a package manager. Three common managers are NPM (Node Package Manager), YARN, and PNPM. While all do the same thing, they do it slightly differently. We will use PNPM for two reasons: 1) All packages are stored on your computer only once and then symlinks (system links) are created from the package to the project as needed, 2) performance is increased meaning that when the project builds, it does so faster.
You will need to either install or activate PNPM before using it. See https://pnpm.io/

## Install the Project Dependencies

1. Open the downloaded project folder (where this file is located) in VS Code (VSC).
2. Open the VSC terminal: Terminal > New Window.
3. Run the following command in the terminal:

    pnpm install

4. The first time it may take a few minutes, depending on the speed of your computer and the speed of your Internet connection. This command will instruct PNPM to read the package.json file and download and install the dependencies (packages) needed for the project. It will build a "node_modules" folder storing each dependency and its dependencies. It should also create a pnpm-lock.yaml file. This file should NEVER be altered by you. It is an internal file (think of it as an inventory) that PNPM uses to keep track of everything in the project.

## Start the Express Server

With the packages installed you're ready to run the initial test.
1. If the VSC terminal is still open use it. If it is closed, open it again using the same command as before.
2. Type the following command, then press Enter:

    pnpm run dev

3. If the command works, you should see the message "app listening on localhost:5500" in the console.
4. Open the package.json file.
5. Note the "Scripts" area? There is a line with the name of "dev", which tells the nodemon package to run the server.js file.
6. This is the command you just ran.
7. Open the server.js file.
8. Near the bottom you'll see two variables "Port" and "Host". The values for the variables are stored in the .env file.
9. These variables are used when the server starts on your local machine.

## Move the demo file

When you installed Git and cloned the remote repository in week 1, you should have created a simple web page.
1. Find and move that simple web page to the public folder. Be sure to note its name.
## Test in a browser

1. Go to http://localhost:5500 in a browser tab. Nothing should be visible as the server has not been setup to repond to that route.
2. Add "/filename.html" to the end of the URL (replacing filename with the name of the file you moved to the public folder).
3. You should see that page in the browser.

## DataBase on Render.com
1. Upon logging into the render.com platform, please take the following steps: initiate the process by selecting the "New" button, and subsequently, opt for the PostgreSQL option to commence the setup of our database. It's worth emphasizing that prior to embarking on this procedure, it is imperative that you have the PGAdmin application downloaded and installed on your PC.

2. As you proceed with the PostgreSQL database setup, you will be prompted to furnish an instance name and a database name, ensuring that both names match. Additionally, select the region that is geographically proximate to the end user to ensure optimal performance. You will be presented with the choice to either opt for a paid instance or avail yourself of the complimentary version, which remains valid for a duration of three months, after which it will be automatically deactivated.

3. Upon confirming your preferred payment plan selection, proceed by clicking the "Create Database" button. It is of paramount importance to establish a connection between your project and the database during the creation process through the utilization of the .env file, assuming that the .env file has been previously configured. This connection will necessitate the use of the access token associated with your project. If you are utilizing the free version of the database, please take note that it will be replaced every three months. Consequently, it is crucial to consistently update the database URL to reflect the new database location.

4. In order to seamlessly connect your database instance with the PGAdmin4 application, you will require specific information, including the database hostname, external URL, and the SSL mode parameter set to "prefer." Additionally, the password provided within the database information section on the render.com platform will be needed. As a helpful recommendation, consider using the "remember the password" option to streamline the process, minimizing the need to repeatedly enter credentials when connecting to the render.com platform and the PGadmin4 app. 

5. For users of the free database version, it is imperative to bear in mind that every three months, the existing database must be deleted, and the connection must be redirected to the new database. Consequently, the entire aforementioned process should be reiterated accordingly.

## database file to work.
Upon initializing your server within the PGAdmin4 application, navigate to the query tool. Here, you should proceed to copy the contents of your 'db-sql-code' file and paste it into the query tool interface. Execute the provided code. Subsequently, replicate this process for the 'assignment2' file. If all tasks are executed successfully, please take a moment to acknowledge and commend yourself for your accomplishments.
