const colorThief = new ColorThief();
const container = document.querySelector('div[data-warna="container"]');
const img = container.querySelector("img");

getColour("load");

document.querySelector('[data-warna="upload"]').addEventListener("change", () => {
   getColour("upload");
});

function getColour(tipe) {
   img.crossOrigin = "anonymous";

   if (tipe == "upload") {
      const [file] = upload.files;
      if (file) {
         img.src = URL.createObjectURL(file);
      }

      img.addEventListener('error', () => {
         img.src = "https://raw.githubusercontent.com/abinoval/image-to-palette/master/assets/ico/mstile-310x310.png";
         alert("Maaf, sepertinya yang ada upload bukan gambar!");
      });
   }

   if (img.complete) {
      setAll();
   } else {
      img.addEventListener("load", () => {
         setAll();
      });
   }
}

function RGBToHex(r, g, b) {
   r = r.toString(16);
   g = g.toString(16);
   b = b.toString(16);

   if (r.length == 1) r = "0" + r;
   if (g.length == 1) g = "0" + g;
   if (b.length == 1) b = "0" + b;

   return "#" + r + g + b;
}

function setAll() {
   const colour = colorThief.getColor(img);
   const palette = colorThief.getPalette(img);

   container.querySelector('[data-warna="dominan"]').style.background = `rgb(${colour})`;
   container.querySelector('[data-warna="dominan-hex"]').innerHTML = RGBToHex(colour[0], colour[1], colour[2]);

   for (let i = 0; i < palette.length; i++) {
      container.querySelectorAll('[data-warna="palet"]')[i].style.background = `rgb(${palette[i]})`;
      container.querySelectorAll('[data-warna="palet-hex"]')[i].innerHTML = RGBToHex(palette[i][0], palette[i][1], palette[i][2]);
   }
}

document.querySelector("#download").addEventListener("click", () => {
   saveStaticDataToFile();
});

function saveStaticDataToFile() {
   const colour = colorThief.getColor(img);
   const palette = colorThief.getPalette(img);

   let textColours = `Warna Dominan : ${RGBToHex(colour[0],colour[1],colour[2])} \n\nPalet Warna : \n`;
   for (let i = 0; i < palette.length; i++) {
      textColours += ` - ${RGBToHex(palette[i][0],palette[i][1],palette[i][2])} \n`;
   }

   let cssColours = `--clr-itp-primary: ${RGBToHex(colour[0],colour[1],colour[2])};\n`;
   for (let i = 0; i < palette.length; i++) {
      cssColours += `--clr-itp-${i + 1}: ${RGBToHex(palette[i][0],palette[i][1],palette[i][2])};\n`;
   }

   let sassColours = `$clr-itp-primary: ${RGBToHex(colour[0],colour[1],colour[2])};\n`;
   for (let i = 0; i < palette.length; i++) {
      sassColours += `$clr-itp-${i + 1}: ${RGBToHex(palette[i][0],palette[i][1],palette[i][2])};\n`;
   }

   let zip = new JSZip();
   zip.file("colours.txt", textColours);
   zip.file("css.txt", cssColours);
   zip.file("sass.txt", sassColours);
   zip.generateAsync({
      type: "blob"
   }).then(function (content) {
      saveAs(content, `itp - ${RGBToHex(colour[0], colour[1], colour[2]).toUpperCase().substring(1)}.zip`);
   });
}