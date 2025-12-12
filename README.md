# My Web Portfolio

## Overview

This is a dynamic, single-page professional portfolio built to showcase
expertise in scalable system architecture, full-stack polyglot
development, and high-reliability automation.

**Slogan: "Don't Just Write Code. Architect Reliability."**

The site is built using a modern dark, high-contrast theme ("Electro
Blue") implemented with Tailwind CSS. It adheres to the principle of
separation of concerns by completely isolating content, logic, and
styling into distinct files.

### Key Technologies

-   **HTML5:** Structural skeleton (`index.html`)
-   **CSS3 (Tailwind CSS):** Styling and responsive layout
-   **JavaScript (ES6+):** Pure Vanilla JS for DOM manipulation and
    rendering logic
-   **Data Model:** All content is stored as a JavaScript object for
    easy maintenance

## Folder Structure

The project uses a simple, highly encapsulated folder structure. The
entire application is rendered by the `index.html` file, which links to
the dedicated CSS and JavaScript files.

    /sobodh-jagaran.github.io
    |
    +-- index.html      <-- Main structural skeleton
    |
    +-- css/
    |   +-- style.css   <-- All custom styling and aesthetic rules
    |
    +-- js/
        +-- data.js     <-- Content only (resumeData object)
        +-- app.js      <-- Logic only (reads data.js and builds the DOM)

## Design Architecture

This portfolio utilizes a Model-View-Controller (MVC) Lite architecture
implemented purely on the client side:

1.  **Model (M):**\
    The `js/data.js` file holds the state and content (`resumeData`
    object). This file holds zero rendering logic.

2.  **View (V):**\
    The `index.html` file acts as the view container, providing hooks
    (e.g., `<div id="content-root">`) where the dynamic content will be
    injected.

3.  **Controller (C):**\
    The `js/app.js` file acts as the controller, managing the
    application flow:

    -   Initializes the portfolio (`window.onload`)
    -   Retrieves data from the Model (`resumeData`)
    -   Executes DOM manipulation functions (`renderHeader`,
        `renderProjects`) to update the View

This separation ensures that content updates only require editing
`js/data.js`, and styling changes only require editing `css/style.css`,
significantly improving maintenance and scalability.

## Usage

### 1. Running Locally

Since this is a client-side application, you do not need a web server.

``` bash
# Clone the repository
git clone https://github.com/Sobodh-Jagaran/my-portfolio.git

# Navigate into the project folder
cd my-portfolio

# Open the file in your default browser
open index.html
```

### 2. Deployment

This project is optimized for deployment on any static hosting platform
(e.g., GitHub Pages, Netlify, Vercel).\
The application loads successfully from the root directory because the
`index.html` file and all asset paths are configured using relative
addressing.

## License

This project is licensed under the MIT License.

    Copyright (c) 2024 Sobodh Jagaran

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
