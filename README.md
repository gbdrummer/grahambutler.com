# Chasis & NGN Starter Template

The starter template is based on the Chassis showroom template. The
package includes all of the necessary modules to build a Chassis-based
template. The template also includes the full NGN library (including
data capabilities). Finally, it contains a build system to make development
a little easier.

## Ridiculously Fast Quickstart

_Requires Node v6.0.0+ and gulp pre-installed._

Run `npm i -g chassistpl`, then run `chassistpl` in the directory where you
want to generate the template.

## Quickstart

First, you'll need Node.js 6.0.0+. We recommend installing it with
[nvm for Windows](https://github.com/coreybutler/nvm-windows) or [n](https://github.com/tj/n) (for OSX/Linux). Once Node is installed,
you'll also need to install Gulp.

To install gulp, type `npm install -g gulp-cli`.

Next, clone this repository as your project root:

```sh
git clone https://github.com/ngnjs/chassis-boilerplate myProjectFolder
```

Next, setup the development environment. This is done by navigating
to `myProjectFolder` from the command line and running `npm install`. This
is a one-time action, but it may take some time to load everything.

Once this is all done, launch the development environment by typing
`npm start`. This will generate an output directory called `myProjectFolder/dist`.

`myProjectFolder/dist` will be the webroot for the new application. We strongly
recommend the use of [Fenix Web Server](http://fenixwebserver.com) to host
your site locally. Create a new server and set the webroot to the `dist` folder.

### Live Reload

The development environment is configured to build everything for you on the fly.
For convenience, a livereload server has been built in.

If you're unfamiliar with live reload, it automatically refreshes your browser
for you anytime you change a source file. This saves you from constantly hitting
refresh or `CMD+r`/`ctrl+r` on every change.

If you want to use live reload, just add `<!-- LIVERELOAD -->`
in the HTML where the livereload.js script will be loaded (normally in the `<head>`).
The development environment will do the rest for you.

**Notice**

Sometimes changes are so minimal and/or fast that it's hard to tell when live
reloading is complete. If you prefer, you can enable a desktop notification that
will show up every time a page is reloaded. This is accomplished by starting with
the `notify` flag, i.e. `npm start --notify`.

## Source Files

When developing your app/site, all of your work should be done in the `src` and
`sass` directories. All SASS output is generated in a directory called `dist/assets/css`.
Any work done in the SASS directory will be automatically compiled and output
to this directory.
