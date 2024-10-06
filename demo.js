const file = document.getElementById("file");
const result = document.getElementById("result");
const type = document.getElementById("type");
const quality = document.getElementById("quality");
const convertBtn = document.getElementById("convert");

function initHeicConverter() {
  return new Promise((resolve, reject) => {
    fetch("libheif.wasm")
      .then((res) => res.arrayBuffer())
      .then(async (wasmBinary) => {
        resolve(new HeifConvert(libheif({ wasmBinary: wasmBinary })));
      })
      .catch(reject);
  });
}

function showResult(params) {
  result.innerHTML = "";
  result.append(`Time cost:${params.time}ms`);
  params.canvas.toBlob(
    (blob) => {
      const image = new Image();
      image.src = URL.createObjectURL(blob);
      image.onload = () => {
        result.appendChild(image);
      };
    },
    type.value,
    parseFloat(quality.value)
  );
}

let libInsCache = undefined;
async function processBuffer(buffer) {
  if (!libInsCache) {
    libInsCache = await initHeicConverter();
  }

  console.log("Using libheif", libInsCache.libheif.heif_get_version());
  const start = performance.now();
  const canvas = await libInsCache.convert(buffer);
  const time = performance.now() - start;

  showResult({ time, canvas });
}

let cacheBuffer = undefined;
file.addEventListener("input", async (ev) => {
  const file = ev.target.files[0];
  if (!file) {
    return alert("no files");
  }

  const buffer = await file.arrayBuffer();
  cacheBuffer = buffer;
  await processBuffer(buffer);
});

window.onload = () => {
  fetch("example.heic").then(async (res) => {
    const buffer = await res.arrayBuffer();
    cacheBuffer = buffer;
    await processBuffer(buffer);
  });
};

convertBtn.addEventListener("click", async () => {
  await processBuffer(cacheBuffer);
});
