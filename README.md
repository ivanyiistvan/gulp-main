# Gulp main

## Rendszerkövetelmények

Az alábbiakat szükséges globálisan installálni a használat előtt.

- Node.js
- Bower
- Gulp
- opcionálisan Node-canvas a css sprite-ok generálásához

## Install

		$ npm install
		$ bower install

## Alepvető beállítások

Az alap beállítások a gulpfile.js options alatt találhatóak.

## Js/Css fájlok kezelése

Bower package manager-t használ a vendor csomagok kezelésére. A fájlok html fájlokba való behúzását automatikusan készíti a megfelelő környezettől függően. Erre példa az index.html fájlban található.
A saját javascript fájlokat az application.json fájlban kell felsorolni, ezek is automatikusan generálódnak a html-fájlokba.

### bower

A bower csomagok nem minden esetben tartalmazzák a megfelelő útvonalat a main fájlhoz, így szükséges lehet a kézzel való beállítása, ebben az esetben a [gulp-bower-files][1] overrides címszó alatt leírtak szerint kell eljárni.

## Dev környezet futtatása

		$ gulp watch

## Production generálása

		$ gulp

## Sprite-ok generálása

A sprite-ok használatához szükséges a Node-canvas-t telepíteni.

* Windows: [https://github.com/LearnBoost/node-canvas/wiki/Installation---Windows][2]
* OSX: [https://github.com/LearnBoost/node-canvas/wiki/Installation---OSX][3]

A spritenak szánt képeket az app/images/sprite alatt kell elhelyezni.
Majd a

		$ gulp sprite

utasítással lehet legenerálni. Így létrejön egy scss fájl is, amely a spritehoz szükséges adatokat tartalmazza.
Scss-ben a kép eléréséhez az `@include sprite($kep-neve);` mixin-t kell használni.



	[1]: https://www.npmjs.org/package/gulp-bower-files
	[2]: https://github.com/LearnBoost/node-canvas/wiki/Installation---Windows
	[3]: https://github.com/LearnBoost/node-canvas/wiki/Installation---OSX