const language = "eng";
const workerPromise = Tesseract.createWorker(language);
const pdfToImage = new PdfToImage();

const analyze_image = (event) => {
	var fileReader = new FileReader();
	var file = event.target.files[0];
	pdfToImage.addListener('page', async ({ pageNum, blob }) => {
		console.log(blob);
		new_file = new File([blob], "image.jpg");
		console.log(new_file);
		fileReader.readAsDataURL(new_file)
		const worker = await workerPromise;
		await worker.reinitialize(language);
		const data = await worker.recognize(new_file);
		console.log(data);
	})
	console.log(pdfToImage);
	console.log(file);
	fileReader.addEventListener("load", () => pdfToImage.toImages({data: fileReader.result})
	)
	fileReader.readAsBinaryString(file);
}
