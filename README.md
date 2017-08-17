# lovedoc

LOcal development of liVE-sites like a DOC.

Semver: 0.1.5

## Description

Lovedoc makes it possible for you to develop local but see your changes applied to the live-site immediately. The code you apply will be added to the real sourcecode by manipulation of the http-response so you can define the order of your scripts/stylesheets and inject html exactly where you want it. Also lovedoc overlays your local directory on top of the live-sites one so you can load resources like images from your local directory or overwrite resources from the live-site with local ones. You can even overlay all your sites live assets with local assets and edit them without uploading on every change.

## How it works

After installation you can use lovedoc in your terminal. Simply put a lovedoc.json file in some directory and it will be read by lovedoc when started. Depending on the operations you defined in lovedoc.json you will see them applied to the live-site on your localhost at a predefined port. Also your local folder will overlay the live-site. 

## Installation

Installation via git

```shell
git clone https://github.com/koljakutschera/lovedoc
cd lovedoc/
sudo npm install -g
cd ..
sudo rm -rf lovedoc # we dont need the repo after global npm install...
```

Installation via npm:

```shell
Comming soon...
```

Uninstallation

```shell
sudo npm uninstall lovedoc -g
```

## Usage lovedoc

```shell
lovedoc [REMOTEURL|Required] [LOCALPORT|Required] [DIRECTORY|Optional]
```

REMOTEURL: Url/Domain of the live-site to work on (no subfolders, you can navigate the proxied site)

LOCALPORT: Local port to proxy the live-site to

DIRECTORY: Local directory to serve files from. Without / at begin and end. Default: cwd


## Usage lovedoc.json

A lovedoc operation is made of 3 parts: selector, action, file.
Selector and action are based on a jQuery like syntax. File is a path to a local file on your system. If file extension is .html the plain content of it will be injected. If file extension is .js/.css a style/script-tag will be injected with its src pointing to your lokal file which is served by lovedoc.

For example the following operation:

```shell
{
  "body > *": {
    "test.html" : "replaceWith"
  }
...
```

translates to: 

```
selector: "body > *"
action: replaceWith
Local file to use: test.html
```

which simply does the following:

```
Replace all elements which are exact children of body with the content of your local file test.html.
```

## Getting started
> You can see the example filestructure in the [repo](https://github.com/koljakutschera/lovedoc/tree/master/test)

In the root of your project direcory for example:

1. Create some test.html,test.css,test.js files and insert something fancy.

2. Create a file named: lovedoc.json and fill it like this:

```json
{
  "head": {
    "test.css" : "prepend",
    "test.js" : "append"
  },
  "body > *": {
    "test.html" : "replaceWith"
  }
}
```

3. Open terminal and run lovedoc

```shell
lovedoc http://koljakutschera.de 9001
```

4. Open browser and goto: localhost:9001 to watch your changes applied to the livesite.

## Troubleshooting

If you get redirected from localhost maybe this is because REMOTEURL does not exactly match the final url of your livesite. This happens for example if you use http:// in REMOTEURL but the livesite does an auto-redirect to https://. Simply use the final url as argument for lovedoc to fix this.

If you really want to add the same filenames within the same selector to a lovedoc.json file simply add some whitespace (which gets removed by lovedoc) to the filename so its valid json.

## Tested on:

OSX

## Licensing

SEE LICENSE FILE
