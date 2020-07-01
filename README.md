angular-material-kickstart
==========================
While Angular is a fairly opinionated framework, and Angular CLI does a good job of setting up a lot of tools and
configuration, there are still a handful of choices and things to remember when setting up a new project from scratch.

This README describes the way I set up a project. It is not meant as a tutorial for neither Angular, nor Angular CLI,
but as a cookbook/checklist for going from "nothing on the disk" to "project I can start actual development in".

It is deliberately not meant as a "seed project", instead going through the additions you need to the default output of
various tools, making it easier to apply to other versions, and to customize for your purpose.

This currently matches the schematics-driven installation of Angular 10.0 and onwards.

Prerequisites
-------------
To program in the frontend world, you need [Node.js](https://nodejs.org/) (for the JavaScript runtime which powers most
tools). While not strictly necessary, a [Git](https://git-scm.com/) installation might
also come in handy.

Install the Angular CLI globally:

    npm install @angular/cli -g
    
Since the CLI is responsible for setting up a lot of tool packages and configuration files, make sure you have the
latest version before using it to create a project.
    
Create a project
----------------

    ng new [project-name] --prefix=[component-prefix] --style=scss --strict
    
(**Note**: You may also want to add `--skip-git` if you use another source control system or prefer to initialize it in
other ways).

The `[project-name]` is, well, the project name. Primarily, this becomes the folder name, and also shows up as package
name in `package.json`.

The `[component-prefix]` is a short prefix to component names, which is used when generating new components to avoid
name collision between different libraries. This should typically be company/customer-specific, though in some cases a
project may be large enough to warrant its own prefix.

We use [SASS](http://sass-lang.com/) as the stylesheet language, in part because it works well with Material Design.

`--strict` sets up several TypeScript options which I would recommend anyway. Be aware that this also sets up your project
as "side-effect free", which can mess up 3rd party imports if they actually do rely on side effects. Most modern
libraries should be written in a purer style, though, so you can probably enable this, or in worst case
[designate
 specific files as having side effects](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free).

The installation will ask whether to add Routing functionality, adding a bit of relevant skeleton code if you choose so.  
 – I find that almost all projects benefit from the deep-linking capabilities of the router, so I'd recommend
installing it, even if it does add a bit of mental overhead initially.

Step into the newly generated folder and add Angular Material

    ng add @angular/material
    
This will pull in a couple of dependencies and tweak the code as needed for Material features, giving you a couple of
options:

* The install will first ask you for a theme. We will be tweaking this a bit, so choose `Custom`.

* When asking whether to "set up global Angular Material typography styles", say yes. Practically, this simply adds the
`mat-typography` class to the `body` tag, making non-Material components use the same font. Indeed, you may want to
manually add the 'mat-app-background' class to the `body` tag too, to make the background in non-material areas match
the app style.
  
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
Full translations using the i18n tools which Angular provides is a little out of scope for this setup, but you may
still want to set up the project to ensure that locale-specific pipes (such as date or number format) use the correct
format.

To do so, add

    ng add @angular/localize

to get access to the locale definitions (as [seen here](https://github.com/angular/angular/tree/master/packages/common/locales)).

Edit your `angular.json` file, adding

    {
       ...
      "projects": {
        "[project-name]": {
          "i18n": {
            "sourceLocale": "da"
          },
          ...
        "architect": {
          "build": {
            ...
            "options": {
              "localize": true,
              ...
            }
          ...
        }
        ...
      }
    }
             
i.e. add the `i18n` block to the project definition, and the `"localize": true` option to the `architect/build/options`
which serve as the default for all configurations.  
(Be aware that once you invoke the i18n options like this, your built files will start showing up in a locale-specific
folder under `dist`, e.g. `dist/da`).


Configure CSS/Material palettes
-------------------------------
Create a `src/theme.scss` file containing

    @import '~@angular/material/theming';
    $projectname-primary: mat-palette($mat-indigo);
    $projectname-accent: mat-palette($mat-pink, A200, A100, A400);
    $projectname-warn: mat-palette($mat-red);
    $projectname-theme: mat-light-theme($projectname-primary, $projectname-accent, $projectname-warn);
    
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

    @import "~sanitize.css/sanitize.css";
    @import '~@angular/material/theming';
    @import "./theme";
    @include mat-core(mat-typography-config(
      $font-family: 'Comic Sans MS' /* Ok, perhaps not */
    ));
    @include angular-material-theme($projectname-theme);    
    html, body { height: 100%; }
    body { margin: 0; }

### mat-icon and default font
The schematics will set up a stylesheet link to [Material Design Icons](https://material.io/icons/) in the `index.html`.
If you do not use Material icons, you can delete this link. (`<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">`)

Similarly, if you have set up your own font in the `mat-typography-config` above, remove any font link from the `head`,
or replace it with your own if needed.

Configure TypeScript
--------------------
The `--strict` has already set up TypeScript to run a tight ship, but I prefer to add a bit more.
Open the `tsconfig.base.json` file and add the following options:

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

This is a bit of a matter of taste. Some find it annoying that they cannot leave variables around while working on the
code, but I find that forcing yourself to express what you actually mean pays off in the long run. 


TSLint
======
Simlarly, the `tslint.json` settings are very much a matter of opinion. Options worth considering are
[no-conditional-assignment](https://palantir.github.io/tslint/rules/no-conditional-assignment/),
[member-access](https://palantir.github.io/tslint/rules/member-access/),
[no-null-keyword](https://palantir.github.io/tslint/rules/no-null-keyword/),
[no-this-assignment](https://palantir.github.io/tslint/rules/no-this-assignment/) and
[variable-name](https://palantir.github.io/tslint/rules/variable-name/); and updating 
[arrow-return-shorthand](https://palantir.github.io/tslint/rules/arrow-return-shorthand/),
[semicolon](https://palantir.github.io/tslint/rules/semicolon/),
[quotemark](https://palantir.github.io/tslint/rules/quotemark/),
[triple-equals](https://palantir.github.io/tslint/rules/triple-equals/):

    "arrow-return-shorthand": [true, "multiline"],
    "member-access": [true, "no-public"],
    "no-conditional-assignment": true,
    "no-null-keyword": true,
    "no-this-assignment": true,
    "quotemark": [true, "single", "avoid-escape", "avoid-template"],
    "semicolon": [true, "always", "strict-bound-class-methods"],
    "triple-equals": [true, "allow-undefined-check"],
    "variable-name": { "options": ["check-format", "ban-keywords", "require-const-for-all-caps", "allow-leading-underscore"]},

This adopts the [TypeScript convention](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#null-and-undefined)
of using `undefined` rather than `null`.
If you need to guard against null from 3rd-party libraries, use coercing equality (`==undefined` and `!=undefined`),
which is explicitly allowed by these rules.


Primary resources
-----------------
 * [Angular](https://angular.io/docs) and its [GitHub repository](https://github.com/angular/angular)
 * [Angular CLI](https://cli.angular.io/) and its [GitHub repository](https://github.com/angular/angular-cli).
   (The documentation is moving to the main Angular site, but the project's [GitHub Wiki](https://github.com/angular/angular-cli/wiki)
   still has more information, in particular the [stories](https://github.com/angular/angular-cli/wiki/stories))

 * [Angular Material Design](https://material.angular.io/components) and its [GitHub](https://github.com/angular/material2).

Additional tools
----------------
The [Augury Chrome plug-in](https://augury.angular.io/) provides additional runtime inspection of a project, much like
the development console does for "normal" HTML.

The [Angular Console](https://angularconsole.com/) is a visual facade to the Angular CLI and its `angular.json`
configuration, which may make it easier to remember the different options, depending on your preferred style.

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

    npm install gulp@^4 gulp-imagemin@^6 gulp-gzip@^1 gulp-brotli@^1 --save-dev
    
Make sure to create and update the `gulpfile.js` to match your project name.
    
I typically add the tasks to the build script in `package.json`, so it looks something like

    "build": "ng build --prod --base-href=/angular-material-kickstart/ && gulp",

(The `--base-href` is there because I deploy on an application path, rather than to the root of the server).

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
This overrides the `<base href="/">` in `index.html`, ensuring that relative file names are picked up from the correct
path.

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
So instead, we edit the `web.xml` to configure our error page for 404 to be a **.jsp**.
We also need additional configuration to ensure that the JSP compiler handles the files as UTF-8 rather than the
default ISO-8859-1:

    ...
    <jsp-config>
      <jsp-property-group>
        <url-pattern>*.html</url-pattern>
        <page-encoding>utf-8</page-encoding>
      </jsp-property-group>
      <jsp-property-group>
        <url-pattern>*.jsp</url-pattern>
        <page-encoding>utf-8</page-encoding>
      </jsp-property-group>
    </jsp-config>
    <error-page>
      <error-code>404</error-code>
      <location>/index.jsp</location>
    </error-page>
    ...

...and the `index.jsp` sets the status code and includes the original `index.html`:

    <% response.setStatus(200); %><%@ include file="/index.html" %>
    
Now all unknown URLs will result in the server delivering the `index.html` with a status code 200, and the Angular
application can display its own error message for incorrect routes.
 
Of course, this also means that if you genuinely have a missing file (say, a typo in an image name) you'll get the
`index.html` instead, but I find this a small price to pay for avoiding the duplicated route configuration.
