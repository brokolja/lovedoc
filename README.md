# lovedoc

LOcal development of liVE projects like a DOC.

Tested: OSX

Status: Alpha

## Description

Lovedoc makes it possible for you to develop local but see your changes applied to the livesite immediately. Therefore the livesite will be proxied to your localhost and you can use a jQuery like syntax to apply html,js,css files to it. The code you apply will be added to the real sourcecode of the the proxied site so you can define the order of your scripts/stylesheets and inject html exactly where you want it. Also lovedoc overlays your local directory on top of the livesites one. In other words, if a requested file doesn't exist locally, the request will transparently fall through to the livesite so you can easily replace a file requested by the livesite with your local one or maybe you can serve some new images to load them via css.

## Installation

Installation via git

```shell
git clone https://github.com/koljakutschera/lovedoc
cd lovedoc/
sudo npm install -g
cd ..
sudo rm -rf lovedoc # we dont need the repo after npm install...
```

Uninstallation

```shell
sudo npm uninstall -g
```

## Usage lovedoc

```shell
lovedoc [REMOTEURL|Required] [LOCALPORT|Required] [DIRECTORY|Optional]
```

REMOTEURL: Full url of the livesite to work on

LOCALPORT: Local port to proxy the livesite 

DIRECTORY: Local directory to serve files from. Without / at begin and end. Default: cwd


## Usage lovedoc.json
> Hint: Your local directory will overlay the livesite. If a local file exists it will be requested - If not the one from the livesite will be served.

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
> You can see the example filestructure [repo](https://github.com/koljakutschera/lovedoc/tree/master/test)

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

## Licensing

SEE LICENSE FILE
