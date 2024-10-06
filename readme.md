## Libheic

### Usage

```javascript
file.addEventListener("input", async (ev) => {
  const file = ev.target.files[0];

  const buffer = await file.arrayBuffer();
  fetch("libheif.wasm")
    .then((res) => res.arrayBuffer())
    .then(async (wasmBinary) => {
      // HeifConvert class is in convert.js
      // libheif is in libheif.js
      const heic = new HeifConvert(libheif({ wasmBinary: wasmBinary }))
      const canvas = heic.convert(buffer);
    })
});
```

<pre>
  # libheic will convert heic to canvas object
  # After that we can convert canvas to png/jpg with any quality option
  
  canvas.toBlob(callback, type, quality)

  For your information : 
  Recommended quality: 0.8
  Miro, Mural, Figjam all render heic as jpg format.
</pre>

### License

License: GNU Lesser General Public License

Based on <a href="https://github.com/strukturag/libheif">libheif</a>

Author: <a href="https://ajlovechina.github.io">AJLoveChina</a>
