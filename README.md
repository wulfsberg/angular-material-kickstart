angular-material-kickstart
==========================
While Angular is a fairly opinionated framework, and Angular CLI does a good job of setting up a lot of tools and
configuration, there are still a handful of choices and things to remember when setting up a new project from scratch.

This README describes the way I set up a project. It is not meant as a tutorial for neither Angular, nor Angular CLI,
but as a cookbook/checklist for going from "nothing on the disk" to "project I can start actual development in".

It is deliberately not meant as a "seed project", instead going through the additions you need to the default output of
various tools, making it easier to apply to other versions, and to customize for your purpose.

This currently matches Angular 13+.

Prerequisites
-------------
To program in the frontend world, you need [Node.js](https://nodejs.org/) (for the JavaScript runtime which powers most
tools). While not strictly necessary, a [Git](https://git-scm.com/) installation might
also come in handy.

Install the Angular CLI globally:

    npm install @angular/cli --global
    
Since the CLI is responsible for setting up a lot of tool packages and configuration files, make sure you have the
latest version before using it to create a project.
    
Create a project
----------------

    ng new [project-name] --prefix=[component-prefix] --style=scss
    
(**Note**: You may also want to add `--skip-git` if you use another source control system or prefer to initialize it in
other ways).

The `[project-name]` is, well, the project name. Primarily, this becomes the folder name, and also shows up as package
name in `package.json`.

The `[component-prefix]` is a short prefix to component names, which is used when generating new components to avoid
name collision between different libraries. This should typically be company/customer-specific, though in some cases a
project may be large enough to warrant its own prefix.

We use [SASS](http://sass-lang.com/) as the stylesheet language, in part because it works well with Material Design.

The installation will ask whether to add Routing functionality, adding a bit of relevant skeleton code if you choose so.  
 – I find that almost all projects benefit from the deep-linking capabilities of the router, so I'd recommend
installing it, even if it does add a bit of mental overhead initially. (This can also be added by including `--routing`)
on the command line).

Additionally, if you're installing the Angular frontend as a subfolder in another project (such as a Spring Boot project),
you may want to change the directory name with `--directory=[name]`, e.g. ´--directory=angular` to avoid redundancy
in the folder names and signal that this is the Angular part of the stack.

E.g. a complete command line could look like this:

    ng new my-project --prefix=nt --style=scss --routing --skip-git --directory=angular

Step into the newly generated folder and add Angular Material

    ng add @angular/material
    
This will pull in a couple of dependencies and tweak the code as needed for Material features, giving you a couple of
options:

* The install will first ask you for a theme. We will be tweaking this a bit, so choose `Custom`.

* When asking whether to "set up global Angular Material typography styles", say yes. Practically, this simply adds the
`mat-typography`class to the `body` tag, making non-Material components use the same font. Indeed, you may want to
manually add the `mat-app-background` class to the `body` tag too, to make the background color in non-material areas
match the app style.
  
* `animations` is separate from the Angular core to minimize the size for projects which do not need it, but you almost
certainly want it for Material.

I like to additionally add 

    npm install sanitize.css

[`sanitize.css`](https://github.com/jonathantneal/sanitize.css) is a companion project to
[`normalize.css`](http://necolas.github.io/normalize.css/) and provides a handful of
so-sensible-they-are-de-facto-standard rules on top of the normalization.
Notably, this includes using the border-box model and collapsing table borders.
It is not needed if sticking entirely to Material components, but is still a nice help when doing other CSS work.


Enable polyfills
----------------
To enable the needed polyfills, open the `src/polyfills.ts` file and uncomment as needed. Unless you have a special
case and are targeting older browsers, you probably do not need to adjust this.


Set locale
----------
Full translation using the i18n tools which Angular provides is a little out of scope for this setup, but you may
still want to set up the project to ensure that locale-specific pipes (such as date or number format) use the correct
format.

To do so, add

    ng add @angular/localize

to get access to the locale definitions.

Edit your `angular.json` file, adding

    {
      ...
      "projects": {
        "[project-name]": {
          "i18n": {
            "sourceLocale": "da"
          },
          ...
        },
        ...
      },
      ...
    }

This will set the default `LOCALE_ID` for the project to `'da'`, making, say, the `|date` pipe use Danish names and notation. 


Configure CSS/Material palettes
-------------------------------
Create a `src/theme.scss` file and move the theme definitions from `src/styles.scss` into it:

    @use '~@angular/material' as mat;
    
    $projectname-primary: mat.define-palette(mat.$indigo-palette);
    $projectname-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
    
    $projectname-warn: mat.define-palette(mat.$red-palette);
    
    $projectname-theme: mat.define-light-theme((
      color: (
        primary: $projectname-primary,
        accent: $projectname-accent,
        warn: $projectname-warn,
      )
    ));
    
(and delete the similar `$projectname-...` lines in `src/styles.scss`. See below.)

This sets up the Material Design theme as per the [theming guide](https://material.angular.io/guide/theming).
You can choose some of the official
[Material Design colors](https://material.io/guidelines/style/color.html#color-color-palette),
or you can define your own palettes. (A tool like Mikel Bitson's
[Material Design Palette Generator](http://mcg.mbitson.com/) can help you get started on your own palettes).

The reason for moving the palette definition into a separate file is to keep mixins and function calls separate, so we
can import and reuse the color/theme variables in our own components/SCSS without triggering the function calls.
(Notably, the `@include mat-core();` which, as the comments say, should only ever be included once).

Open the `src/styles.scss` and edit it to

    @use '~@angular/material' as mat;
    @import "~sanitize.css/sanitize.css";
    @import "./theme";
    @include mat.core(
      mat.define-typography-config(
        $font-family: 'Comic Sans MS' /* Ok, perhaps not */
      )
    );
    @include mat.all-component-themes($projectname-theme);
    
    html, body { height: 100%; }
    body { margin: 0 }


### mat-icon and default font
The schematics will set up a stylesheet link to [Material Design Icons](https://material.io/icons/) in the `index.html`.
If you do not use Material icons, you can delete this link. (`<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">`)

Similarly, if you have set up your own font in the `mat-typography-config` above, remove any font link from the `head`,
or replace it with your own if needed.

Configure TypeScript
--------------------
The default project settings have already set up TypeScript to run a tight ship, but I prefer to add a bit more.
Open the `tsconfig.json` file and add the following options:

    {
      ...
      "compilerOptions": {
        ...
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        ...
      }
      ...
    }

This is somewhat a matter of taste. Some find this too strict, becoming an annoyance while working on the code.
Pragmatically, though, you will never get around to actually cleaning up such things unless you do it while you're
writing the code initially, so this strict setting ensures that dead legacy code does not accumulate and confuse people
later. 


ESLint
======
Install the TypeScript ESLint and Angular rules with

    ng add @angular-eslint/schematics

Specific linter rules are always a source of heated contention. To use a [reasonable baseline](https://www.npmjs.com/package/@northtech/eslint-config-typescript),
install

   npm i --save-dev @northtech/eslint-config-typescript

and edit the `.eslintrc.json` file to include:

    {
      ...
      "overrides": [
        {
          ...
          "extends": [
            ...
            "@northtech/eslint-config-typescript"
            ],
          ...
        }
        ...
      ]
    }

You can override or set up additional rules to taste under the `rules` section of the file.


Additional tools and resources
==============================
Primary resources
-----------------
 * [Angular](https://angular.io/docs) and its [GitHub repository](https://github.com/angular/angular)
 
 * [Angular Material Design](https://material.angular.io/components) and its [GitHub](https://github.com/angular/material2).

Additional tools
----------------
The [Augury Chrome plug-in](https://augury.angular.io/) provides additional runtime inspection of a project, much like
the development console does for "normal" HTML.

Useful packages
---------------
 * [`moment.js`](https://momentjs.com/) is highly useful for doing date manipulation and parsing/formatting, in 
 particular if you also need to handle time zones (using [`moment-timezone.js`](https://momentjs.com/timezone/)), and
 it will feel familiar if you're used to Joda-Time or Java 8's date/time API.
 * [`anchorme`](https://alexcorvi.github.io/anchorme.js/) is a "linkifier" which turns links in text into clickable
 markup, and seems to strike a good balance between features and (ease of) configuration.


GZip/imagemin
=============
Reaching back in the old bag of tricks, I use some Gulp tasks (in the `gulpfile.js`) to optimize the generated assets
by recompressing images and pre-compressing the files, since many servers can be set up to automatically deliver the
`.gz` or `.br` version of files if they exist and the browser supports it.

To include the needed tools, run

    npm install gulp@^4 gulp-imagemin@^7 gulp-gzip@^1 gulp-brotli@^3 --save-dev
    
Make sure to create and update the `gulpfile.js` to match your project name.
    
I typically add the tasks to the build script in `package.json`, so it looks something like

    "build": "ng build --prod --base-href=/angular-material-kickstart/ && gulp",

(The `--base-href` is there because I deploy on an application path, rather than to the root of the server).

Safari session credentials for script type="module"
===================================================
_**Note:** The current status of this workaround is unknown. I have not worked with the described setup recently:_

If your entire site is behind a session-based access control, the browser will need to send session cookies with the
requests for the compiled JavaScript files. Usually, this is handled automatically, but Safari does not by default send
credentials with requests for the `module` ES6 script type.

To work around this, edit the `angular.json` to include the `crossOrigin` option:

    {
      ...
      "projects": {
        "[YourProjectName]": {
          ...
          "architect": {
            "build": {
              ...
              "options": {
                "crossOrigin": "use-credentials",
                ...
              }
              ...
            }
            ...
          }
        }
      }
      ...
    }

This adds a `crossorigin="use-credentials"` to the script tag in `index.html, per https://github.com/angular/angular-cli/issues/14743.

The Safari dev team are somewhat vague about whether this is a bug and what they consider expected behavior, but given
that it is the only browser with this interpretation, it is likely to change in the future.


Java Deploy
===========
Angular and Angular CLI are not concerned with how to actually deploy the application to a server. Their job ends at
generating the static files; how those files ultimately get served to the web is a task for somebody/something else.

I have included an example of how to prepare a Java Web Application Archive (**.war**) which can be deployed in any
Servlet 3-compliant Java server. 

The specific example uses [Maven](https://maven.apache.org/) to package the actual **.war**, but the ideas can easily be
adapted to other build tools.  

pom.xml
-------
At its simplest, it is a matter of picking up the static webapp files from Angular CLI's output folder rather than from
the normal Java source tree when assembling the **.war** file.
This can be done by configuring the `webResources` parameter of the `maven-war-plugin` in the `pom.xml`.

By and large, the rest of the `pom.xml` is boilerplate to set up the project, though notice that we're directing
Maven to look in the `java-src` folder rather than the default name of `src` in a couple of places
(`sourceDirectory`, `warSourceDirectory` and `webXml`), so as not to mix source code from the two different worlds.

To generate the compiled and bundled Angular application, run

    ng build --prod --base-href=[path-to-app]
    
where `[path-to-app]` is the address your web app is deployed to on the server (typically the **.war** name).
This overrides the `<base href="/">` in `index.html`, ensuring that relative file names are based upon the correct
root path.

(As mentioned above, I recommend setting this command up as a script in the `package.json`, to avoid typos and ensure
consistency).

You can then run

    mvn package

to generate the **.war** file.

HTML5 routing
-------------
Things get a little more tricky when we start to use the Angular Router and its HTML5-style deep links.
The Java server will see those simply as missing resources and respond with a `404 Not Found`.

In theory, we could register all the needed routes and redirect them to the `index.html`, serving that page as the
answer to all relevant routes, but this is a tedious and error-prone double bookkeeping.

Instead, we exploit that the server *does* already answer all routes, namely with the 404 error page, and we customize
that to show the application entry point.

We could simply point the error page to our `index.html`, but this would mean that it would still be served with status
code 404. While this will actually work, it is not pretty.
Instead, we deliver the `index.html` through a Servlet where we can control the HTTP status code. This also has the
benefit of letting us control other headers as well (such as `Content-Security-Policy`)

    <web-app
      xmlns="http://java.sun.com/xml/ns/javaee"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
      version="3.0">
      <error-page>
        <error-code>404</error-code>
        <location>/index.html</location>
      </error-page>
      <servlet>
        <servlet-name>IndexServlet</servlet-name>
        <servlet-class>dk.wolfsbane.angularmaterialkickstart.IndexServlet</servlet-class>
        <init-param>
          <param-name>Content-Security-Policy</param-name>
          <param-value>default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.northtech.dk; frame-ancestors 'none'</param-value>
        </init-param>
      </servlet>
      <servlet-mapping>
        <servlet-name>IndexServlet</servlet-name>
        <url-pattern>/index.html</url-pattern>
      </servlet-mapping>
    </web-app>

(See the Git files for the actual `IndexServlet`).
    
Now all unknown URLs (and `/index.html` itself) will result in the server delivering the `index.html` with a status
code 200, and the Angular application can display its own error message for incorrect routes.
 
Of course, this also means that if you genuinely have a missing file (say, a typo in an image name) you'll get the
`index.html` instead, but I find this a small price to pay for avoiding the duplicated route configuration.
