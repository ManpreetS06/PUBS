import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

const params = new URLSearchParams(window.location.search);
const issueKey = params.get("issue");

const issue = issues[issueKey];

const titleElement = document.getElementById("issue-title");
const descriptionElement = document.getElementById("issue-description");
const flipbookElement = document.getElementById("flipbook");
const openPdfLink = document.getElementById("open-pdf-link");
const pageStatus = document.getElementById("page-status");

const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");

let pageFlip;

if (!issue) {
    titleElement.textContent = "Issue Not Found";
    descriptionElement.textContent = "Sorry, we could not find the issue you are looking for.";
    flipbookElement.innerHTML = "<p class='reader-error'>This issue does not exist yet.</p>";
} else {
    titleElement.textContent = issue.title;
    descriptionElement.textContent = issue.description;
    openPdfLink.href = issue.pdf;

    loadPDF(issue.pdf);
}

async function loadPDF(pdfPath) {
    const loadingTask = pdfjsLib.getDocument(pdfPath);
    const pdf = await loadingTask.promise;

    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

        const pageDiv = document.createElement("div");
        pageDiv.classList.add("page");

        const img = document.createElement("img");
        img.src = canvas.toDataURL("image/jpeg", 0.95);
        img.alt = `Page ${pageNumber} of ${issue.title}`;

        pageDiv.appendChild(img);
        pages.push(pageDiv);
    }

    flipbookElement.innerHTML = "";

    pages.forEach(page => {
        flipbookElement.appendChild(page);
    });

    createFlipbook();
}

function createFlipbook() {
    pageFlip = new St.PageFlip(flipbookElement, {
        width: 450,
        height: 600,
        size: "stretch",
        minWidth: 280,
        maxWidth: 900,
        minHeight: 400,
        maxHeight: 1200,
        showCover: true,
        mobileScrollSupport: false
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page"));

    updatePageStatus();

    pageFlip.on("flip", () => {
        updatePageStatus();
    });
}

function updatePageStatus() {
    if (!pageFlip) return;

    const currentPage = pageFlip.getCurrentPageIndex() + 1;
    const totalPages = pageFlip.getPageCount();

    pageStatus.textContent = `Page ${currentPage} of ${totalPages}`;
}

prevButton.addEventListener("click", () => {
    if (pageFlip) {
        pageFlip.flipPrev();
    }
});

nextButton.addEventListener("click", () => {
    if (pageFlip) {
        pageFlip.flipNext();
    }
});