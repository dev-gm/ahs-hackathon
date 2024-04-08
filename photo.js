const language = "eng";
const workerPromise = Tesseract.createWorker(language);

const analyze_image = (event) => {
	var fileReader = new FileReader();
	var file = event.target.files[0];
	fileReader.onload = function(ev) {
	  pdfjsLib.getDocument(fileReader.result).promise.then((pdf) => {
		//
		// Fetch the first page
		//
		pdf.getPage(1).then((page) => {
		  var scale = 1.5;
		  var viewport = page.getViewport(scale);

		  //
		  // Prepare canvas using PDF page dimensions
		  //
		  var canvas = document.getElementById('canvas');
		  var context = canvas.getContext('2d');
		  canvas.height = viewport.height;
		  canvas.width = viewport.width;

		  //
		  // Render PDF page into canvas context
		  //
			console.log(page)
		  page.render({canvasContext: context, viewport: viewport}).promise.then(() => {
			console.log(canvas);
			canvas.toBlob((jpeg_file) => {
				//var jpeg_file = new File([blob], "order.png");
				console.log(jpeg_file)
				workerPromise.then((worker) => {
					worker.reinitialize(language).then(() => {
						var reader = new FileReader();
						reader.readAsDataURL(jpeg_file);
						worker.recognize(jpeg_file).then((data) => {
							console.log(data);
							worker.terminate();
						})
					})
				})
			},'image/png')
		  });
		});
	  }, function(error){
		console.log(error);
	  });
	};
	fileReader.readAsDataURL(file);
}
