# Docker reacts to hot reload

Look at this repo whenever you nedd to make docker and react work together - with hot reloading!

Before cloning this repo, you should install

 - Docker
 - Docker Compose
 - Node
 - Yarn or NPM

----------

# Files

```
├── src: folder where source the project's source files live
  ├── app: the React app
    ├── index.html: a simple HTML file linked to the bundle that webpack will produce
    └── index.js: the file which uses React to show the "Hello, world!" message
  ├── infra: the project's infrastructure
    └── environment.js: where you declare the important environment variables for the app ── I'll explain it better later
  └── domain: (NOT PROVIDED) for files relative to the project's domain
├── .babelrc: it configures the babel transpiler to work with React
├── .dockerignore: the files here won't be transfered to Docker
├── .editorconfig: how files will be formatted across the project
├── .gitignore: files which should not be commited on git
├── .nvmrc: for those who use NVM, this file allows to use the correct node version on the machine
├── Dockerfile: Docker reads this file when creating the image
├── docker-compose.yml: Docker Compose reads this file when mouting the container
├── package.json: Node and your package manager read this file in order to make everything work
├── README.md: you're reading it
└── webpack.config.js: I've been using Webpack to bundle my React projects
```

# Running the project

The intent of this project is to have the app running by simply running the command bellow

> docker-compose up --build

## Oops, an error
If you try it, you may get an error because "docker-compose.yml" tries to read **${APP_PORT}:** from your environment variables. If so, it happens due to the line which says somethins like:

> ${APP_PORT} : ${APP_PORT}

Instead of adding this variable manuall, create a ".env" file where all environment variables the project depends should live. For instance, if the port you've chosen for your project is 4321, you'd run.

> echo "APP_PORT=4321" >> .env

### .env
Keep in mind that ".env" shouldn not be commited, otherwise you may compromise:

 1. Security: ".env" files may have sensitive information, as passwords, which should not be uploaded because doind so would make easy for developers to share what should be private.

 2. Project's bootstrap: you don't know which variables will colide with the ones your fellows are using, for instance if you hardcode the port to 4321 on ".env" and commit it, other person may be using the port already, they would have to either use a dirty git stage (i.e. modify the file only to run the project) or change the file and recommit it, making possible for that happen again.

That's the reason why ".env" is part of ".gitignore".

But ignoring this file has a downside: in case where the environment variables usage is spread in multiple project's files, it may be hard to add the ones you need to the ".env" file, unless they stop you from working.

That's why I like adding a "src/infra/environment.js" file. In it, I am able to concentrate all the environment variables, at the same time it is possible to default vital variables to the app to work, such as the port it runs. All the other files need to do, is not rely on *process.env* directly.

## Try  it again

If you try again, the project will be running at https://0.0.0.0:PORT/ after docker finishes building it, this will be the only command you and your team mates will ever need.

> docker-compose up --build

Keep in mind that it may still fail, for instance, when a package is not avaiable.

## Dockerfile x docker.compose.yml

The Dockerfile is responsable for creating an docker image, in this one we use *node:8.9.4* which comes bundled with Node and Yarn to:

 - *workdir* (creates the temporary folder if it does not exists and) enters the temporary folder on the container. Docker is pointing to this directory, as if yoi had changed to it to type some commands.
 - There, "package.json" is copied from the real machine to the container. Though for me I feel more like if the *copy* command marks the real file as something to oberserve (due to the next step).
 - We *run* the command *yarn install* which is "linked" to the last *copy* command i.e. it will run every time we change "package.json".
 - We *workdir* a new folder  named the same as in the volume from "docker-compose.yml', **otherwise hot reload will not work**, but this time we *copy* everything that is not on ".dockerignore" to the container. I'll call it APP here.
 - Then we *run* a command which will copy node_modules folder from the temporary folder to the APP folder. It works as a kind of cache but I don't know why (though I suspect that it is related to marking "package.json" as the only file which will trigger *yarn insall*).
 - And finally the project is built. And whatever file changes, we repeat the cicle of copying node_modules and building it.
 - The last step is exposing the port we want bind the project to.
