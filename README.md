# Carousel
- It's possible to use this code with these CDN:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ignacio-nava/carousel_simple/dist/carousel.css">
<script crossorigin src="https://cdn.jsdelivr.net/gh/ignacio-nava/carousel_simple/dist/carousel.js"></script>
```
- Then create the carousel and select type:
```js
const carousel = new Carousel('#carousel-selector')
carousel.build()
```
- There are three types of carousel: **classic**, **slide**, and **loop**.

  It's feasible to select this options when build the carousel:
```js
carousel.build({
  type: 'slide'
})
```

*Note: This README is under construction*
