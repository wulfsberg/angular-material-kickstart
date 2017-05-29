angular-material-kickstart
==========================
While Angular is a fairly opinionated framework, and Angular-CLI does a good job of setting up a lot of tools and
configuration, there are still a handful of choices and things to remember when setting up a new project from scratch.

This README describes the way I set up a project. It is not meant as a tutorial for neither Angular, nor Angular-CLI,
but as a cookbook/checklist for going from "nothing on the disk" to "project I can start actual development in".

It currently matches Angular 4.1.3, Angular-CLI 1.1.0-rc.2 and Material 2.0.0-beta.6.

Prerequisites
-------------
To program in the frontend world, you need [Node.js](https://nodejs.org/) (for the JavaScript runtime
which powers most tools) and a [Git](https://git-scm.com/) installation (to download modules and tools
from a central repository).

Install the Angular CLI globally:

    npm install @angular/cli@1.1.0-rc.2 -g
    
Since the CLI is responsible for setting up a lot of tool packages and configuration files,
make sure you have the latest version before using it to create a project.
    
Create a project
----------------

    ng new [project-name] --prefix=[component-prefix] --style=scss
    
(**Note**: You may also want to add `--skip-git` if you use another source control system or prefer to initialize it in other ways).

The `[project-name]` is, well, the project name. Primarily, this becomes the folder name, and also shows up as package
name in `package.json`.

The `[component-prefix]` is a short prefix to component names, which is used when generating new components to avoid
name collision between different libraries. This should typically be company/customer-specific,
though in some cases a project may be large enough to warrant its own prefix.

We use [SASS](http://sass-lang.com/) as the stylesheet language, in part because it works well with Material Design.

Step into the newly generated folder and add the following dependencies:

    npm install @angular/material --save
    npm install @angular/animations --save
    npm install web-animations-js --save
    npm install sanitize.css --save
    npm install hammerjs --save

(or `yarn add @angular/material @angular/animations web-animations-js sanitize.css hammerjs` if you're so inclined).
    
and possibly

    npm install intl --save
    
`material` is the [Angular implementation](https://material.angular.io/) of
[Google's Material Design](https://material.io/guidelines/) and provides some elegant standard components.

`animations` is separate from the Angular core to minimize the size for projects which do not need it,
but it is needed for Material.
 
`web-animations-js` is a polyfill of the upcoming [Web Animations API](http://w3c.github.io/web-animations/)
which is needed for many current browsers.

[`sanitize.css`](https://github.com/jonathantneal/sanitize.css) is a companion project to
[`normalize.css`](http://necolas.github.io/normalize.css/) and provides a handful of
so-sensible-they-are-de-facto-standard rules on top of the normalization.
Notably, this includes using the border-box model and collapsing table borders.
It is less of an issue when using the Material project, but is still a nice help when doing other CSS work.

[`hammerjs`](http://hammerjs.github.io/) provides gesture support, such as swipe and pinch. A couple of the Material
components support this, so we include the library to get full functionality.

`intl` is a polyfill for the ECMAScript internationalization API, to handle things like date and number formats.
The standard API is widely supported in modern browsers, only lacking in IE10, Safari 9 or Opera Mini,
so you may or may not need this polyfill, depending on your target.

Enable polyfills
----------------
To enable the needed polyfills, open the `src/polyfills.ts` file and uncomment as needed.

Enable animations
-----------------
The animations module needs to be imported in the `src/app/app.module.ts`:

    import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
    ...
    imports: [
      BrowserAnimationsModule,
      ...
    ]
    ...
    
Enable gestures
---------------
Like the animations, the Hammer.js gesture support needs to be explicitly imported to be activated, so add this to
the `src/app/app.module.ts`:

    ...
    import 'hammerjs';
    ...

Set locale
----------
To ensure that locale-specific pipes (such as date or number format) use the correct locale, add a `LOCALE_ID`
provider to the app module. I.e. in `src/app/app.module.ts`, edit providers to include

    import { LOCALE_ID, NgModule } from '@angular/core';
    ...
    providers: [{provide: LOCALE_ID, useValue: 'da-DK'}],
    ...

Configure CSS/Material palettes
-------------------------------
Open the `src/styles.scss` and edit it to

    @import "~sanitize.css/sanitize.css";

    @import "~@angular/material/theming";
    @include mat-core();
    $custom-theme-primary: mat-palette($mat-indigo);
    $custom-theme-accent:  mat-palette($mat-pink);
    $custom-theme-warn:    mat-palette($mat-red);
    $theme: mat-light-theme($custom-theme-primary, $custom-theme-accent, $custom-theme-warn);
    @include angular-material-theme($theme);

I.e.

 * Import the CSS normalization mentioned above.
 * Set up the Material Design theme as per the [theming guide](https://material.angular.io/guide/theming).
   You can choose some of the official [Material Design colors](https://material.io/guidelines/style/color.html#color-color-palette),
   or you can define your own palettes. (A tool like Mikel Bitson's
   [Material Design Palette Generator](http://mcg.mbitson.com/) can help you get started on your own palettes).
   
Configure TypeScript
--------------------
Open the `tsconfig.json` file and add the following options:

    ...
    "compilerOptions": {
      ...
      "strict": true,
      "noImplicitReturns": true,
      "noUnusedLocals": true,
      "noFallthroughCasesInSwitch": true,
      "forceConsistentCasingInFileNames": true,
      ...
    }
    ...

This sets up the TypeScript compiler to run a very tight ship, enforcing explicit declarations and null-handling.
This may seem pedantic, but it does catch bugs and makes the code more robust.

Unfortunately, we cannot currently use `"noUnusedParameters": true` due to issues with both
[Angular](https://github.com/angular/angular/issues/15532) and 
[Material](https://github.com/angular/material2/issues/4443), but these will hopefully be fixed.


Primary resources
-----------------
 * [Angular](https://angular.io/docs/ts/latest/) and its [GitHub repository](https://github.com/angular/angular)
 * [Angular-CLI](https://cli.angular.io/) and its [GitHub repository](https://github.com/angular/angular-cli).
   (The most relevant documentation is on the project's [GitHub Wiki](https://github.com/angular/angular-cli/wiki))
 * [Angular Material Design](https://material.angular.io/components) and its [GitHub](https://github.com/angular/material2).
 

Additional tools
----------------
The [Augury Chrome plug-in](https://augury.angular.io/) provides additional runtime inspection of a project,
much like the development console does for "normal" HTML.

Useful packages
---------------
 * [`moment.js`](http://momentjs.com/) is highly useful for doing date manipulation and parsing/formatting,
 in particular if you also need to handle time zones (using [`moment-timezone.js`](http://momentjs.com/timezone/)),
 and it will feel familiar if you're used to Joda-Time or Java 8's date/time API.
 
TSLint
======
The `tslint.json` settings are very much a matter of opinion. One you can pretty safely add, however, is the
[no-conditional-assignment](https://palantir.github.io/tslint/rules/no-conditional-assignment/).

    "no-conditional-assignment": true 

Java Deploy
===========
Angular and Angular-CLI are not concerned with how to actually deploy the application to a server.
Their job ends at generating the static files; how those files ultimately get served to the web is a task for
somebody/something else.

I have included an example of how to prepare a Java Web Application Archive (**.war**)
which can be deployed in any Servlet 3-compliant Java server. 

The specific example uses [Maven](https://maven.apache.org/) to package the actual **.war**,
but the ideas can easily be adapted to other build tools.  

pom.xml
-------
At its simplest, it is a matter of picking up the static webapp files from Angular-CLI's output folder
rather than from the normal Java source tree when assembling the **.war** file.
This can be done by configuring the `webResources` parameter of the `maven-war-plugin` in the `pom.xml`.

By and large, the rest of the `pom.xml` is boilerplate to set up the project, though notice that we're directing
Maven to look in the `java-src` folder rather than the default name of `src` in a couple of places
(`sourceDirectory`, `warSourceDirectory` and `webXml`),
so as not to mix source code from the two different worlds.

To generate the compiled and bundled Angular application, run

    ng build --prod --base-href=[path-to-app]
    
where `[path-to-app]` is the address your web app is deployed to on the server (By default the **.war** name).
This overrides the `<base href="/">` in `index.html`,
ensuring that relative file names are picked up from the correct path.

(I recommend setting this command up as a script in the `package.json`, to avoid typos and ensure consistency).

You can then run

    mvn package

to generate the **.war** file.

HTML5 routing
-------------
Things get a little more tricky when we start to use the Angular Router and its HTML5-style deep links.
The Java server will see those simply as missing resources and respond with a `404 Not Found`.

In theory, we could register all the needed routes and redirect them to the `index.html`,
serving that page as the answer to all relevant routes, but this is a tedious and error-prone double book-keeping.

Instead, we exploit that the server *does* already answer all routes, namely with the 404 error page,
and we customize that to show the application entry point.

We could simply point the error page to our `index.html`,
but this would mean that it would still be served with status code 404. While this will actually work, it is not pretty.
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
    
Now all unknown URLs will result in the server delivering the `index.html` with a status code 200,
and the Angular application can display its own error message for incorrect routes.
 
Of course, this also means that if you genuinely have a missing file (say, a typo in an image name)
you'll get the `index.html` instead,
but I find this a small price to pay for avoiding the duplicated route configuration.
