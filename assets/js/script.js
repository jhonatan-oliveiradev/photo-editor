const fileInput = document.querySelector(".file-input"),
	filterOptions = document.querySelectorAll(".filter button"),
	filterName = document.querySelector(".filter-info .name"),
	filterValue = document.querySelector(".filter-info .value"),
	filterSlider = document.querySelector(".slider input"),
	rotateOptions = document.querySelectorAll(".rotate button"),
	previewImg = document.querySelector(".preview-img img"),
	resetFilterBtn = document.querySelector(".reset-filter"),
	chooseImgBtn = document.querySelector(".choose-img"),
	saveImgBtn = document.querySelector(".save-img");

let brightness = "100",
	saturation = "100",
	inversion = "0",
	grayscale = "0";

let rotate = 0,
	flipHorizontal = 1,
	flipVertical = 1;

const loadImage = () => {
	let file = fileInput.files[0];
	if (!file) return;
	previewImg.src = URL.createObjectURL(file);
	previewImg.addEventListener("load", () => {
		resetFilterBtn.click();
		document.querySelector(".container").classList.remove("disable");
	});
};

const applyFilters = () => {
	previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
	previewImg.style.filter = `brightness(${brightness}%) 
        saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

filterOptions.forEach((option) => {
	option.addEventListener("click", () => {
		document.querySelector(".filter .active").classList.remove("active");
		option.classList.add("active");
		filterName.innerText = option.innerText;

		if (option.id === "brightness") {
			filterSlider.max = "200";
			filterSlider.value = brightness;
			filterValue.innerText = `${brightness}%`;
		} else if (option.id === "saturation") {
			filterSlider.max = "200";
			filterSlider.value = saturation;
			filterValue.innerText = `${saturation}%`;
		} else if (option.id === "inversion") {
			filterSlider.max = "100";
			filterSlider.value = inversion;
			filterValue.innerText = `${inversion}%`;
		} else {
			filterSlider.max = "100";
			filterSlider.value = grayscale;
			filterValue.innerText = `${grayscale}%`;
		}
	});
});

const updateFilter = () => {
	filterValue.innerText = `${filterSlider.value}%`;
	const selectedFilter = document.querySelector(".filter .active");
	if (selectedFilter.id === "brightness") {
		brightness = filterSlider.value;
	} else if (selectedFilter.id === "saturation") {
		saturation = filterSlider.value;
	} else if (selectedFilter.id === "inversion") {
		inversion = filterSlider.value;
	} else {
		grayscale = filterSlider.value;
	}

	applyFilters();
};

rotateOptions.forEach((option) => {
	option.addEventListener("click", () => {
		if (option.id === "left") {
			rotate -= 90;
		} else if (option.id === "right") {
			rotate += 90;
		} else if (option.id === "horizontal") {
			flipHorizontal = flipHorizontal === 1 ? -1 : 1;
		} else {
			flipVertical = flipVertical === 1 ? -1 : 1;
		}

		applyFilters();
	});
});

const resetFilter = () => {
	brightness = "100";
	saturation = "100";
	inversion = "0";
	grayscale = "0";
	rotate = 0;
	flipHorizontal = 1;
	flipVertical = 1;

	filterSlider.value = "100";
	filterValue.innerText = "100%";

	document.querySelector(".filter .active").classList.remove("active");
	filterOptions[0].classList.add("active");
	filterName.innerText = filterOptions[0].innerText;

	applyFilters();
};

const saveImage = () => {
	// const image = previewImg.src;
	// const link = document.createElement("a");
	// link.href = image;
	// link.download = "image.png";
	// link.click();

	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");
	canvas.width = previewImg.naturalWidth;
	canvas.height = previewImg.naturalHeight;

	context.filter = `brightness(${brightness}%) 
                        saturate(${saturation}%) 
                        invert(${inversion}%) 
                        grayscale(${grayscale}%)`;
	context.translate(canvas.width / 2, canvas.height / 2);
	if (rotate !== 0) {
		context.rotate((rotate * Math.PI) / 180);
	}

	context.scale(flipHorizontal, flipVertical);
	context.drawImage(
		previewImg,
		-canvas.width / 2,
		-canvas.height / 2,
		canvas.width,
		canvas.height
	);

	const imageData = canvas.toDataURL("image/png");
	const link = document.createElement("a");

	link.href = imageData;
	link.download = "image.png";

	link.click();
};

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());

document.onkeypress = function (e) {
	e = e || window.event;
	if (e.keyCode === 13) {
		document.documentElement.classList.toggle("dark-mode");
		document
			.querySelectorAll(".inverted")
			.forEach((el) => el.classList.toggle("invert"));
	}
};
