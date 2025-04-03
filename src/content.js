const appTitle = "TOCify";
const appTitle1 = "TOC";
const appTitle2 = "ify";

let sectionSelector;

const waitForArticles = (selector, timeout = 10000) => {
	return new Promise((resolve, reject) => {
		const existing = document.querySelectorAll(selector);
		if (existing.length > 0) {
			console.info(`${appTitle} Found ${existing.length} sections immediately`);
			return resolve(Array.from(existing));
		}

		console.info(`${appTitle} No sections found immediately, waiting for DOM mutations...`);

		const observer = new MutationObserver(() => {
			const articles = document.querySelectorAll(selector);
			if (articles.length > 0) {
				console.info(`${appTitle} Found ${articles.length} sections via MutationObserver`);
				observer.disconnect();
				resolve(Array.from(articles));
			}
		});

		observer.observe(document.body, { childList: true, subtree: true });

		setTimeout(() => {
			observer.disconnect();
			reject(new Error("Timeout waiting for articles"));
		}, timeout);
	});
};

const getSections = async (selector) => {
	let sections;

	try {
		console.info(`${appTitle} Looking for sections with selector "${selector}"...`);
		sections = await waitForArticles(sectionSelector);
	} catch (err) {
		console.warn(`${appTitle} Sections not found in time: ${err}`);
		return;
	}

	// any sections to process?
	if (!sections.length) {
		console.info(`${appTitle} No sections found with selector "${sectionSelector}", exiting.`);
		return;
	} else {
		console.info(`${appTitle} Found ${sections.length} sections with selector "${sectionSelector}".`);
	}

	// Sort alphabetically by innerText (example reorganization)
	// sections.sort((a, b) => a.innerText.localeCompare(b.innerText));

	// const container = sections[0].parentNode;

	// Clear and re-append sorted
	sections.forEach((s, i) => {
		s.id = `section-${i + 1}`;
		//   container.appendChild(s);
	});

	return sections;
};

const generateTOC = (sections) => {
	document.querySelector(".mPrinC__toc")?.remove(); // Remove old TOC

	// Build TOC
	const toc = document.createElement("div");
	toc.className = "mPrinC__toc";

	// Inject fixed header with title and reload button
	const header = document.createElement("div");
	header.className = "mPrinC__toc-header";
	header.innerHTML = `
	<div class="mPrinC__toc-header-inner">
		<span>
			<img src="${chrome.runtime.getURL("logo.png")}" alt="TOCify logo" height="35px" width="35px"/>
		</span>
		<span>
			<a href="https://github.com/mprinc/TOCify" title="View on GitHub" target="_blank" rel="noopener noreferrer">
				<svg height="20" viewBox="0 0 16 16" width="20" aria-hidden="true" fill="#333">
					<path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 
					0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
					-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78
					-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 
					0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27 7.6 7.6 0 0 1 2 .27c1.53-1.04 2.2-.82 
					2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 
					0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 
					0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 
					0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
				</svg>
			</a>
		</span>
		<button class="mPrinC__toc-header-reload" title="Reload TOC">⟳ Reload</button>
	</div>
`;
	toc.appendChild(header);

	// Add reload functionality
	header.querySelector(".mPrinC__toc-header-reload").addEventListener("click", async () => {
		console.info(`${appTitle} Reloading...`);
		const sections = await getSections(sectionSelector);
		generateTOC(sections); // Re-generate
	});

	// Inject toc list
	const tocList = document.createElement("ul");
	toc.appendChild(tocList);

	let questionId = 1;
	sections.forEach((s, i) => {
		const titleText = s.querySelector("h1,h2,h3,h4,h5,h6")?.textContent || `Section ${i + 1}`;
		const messageElement = s.querySelector(".text-message");
		// filter only messages with attribute `data-message-author-role="user"`
		if (!messageElement || messageElement.getAttribute("data-message-author-role") !== "user") {
			return;
		}

		// select text content (including children elements' content)
		const messageText = messageElement?.innerText || "";
		// limit to first 50 characters and last 50 characters
		const messageStartLength = 50;
		const messageEndLength = 25;
		const messageTextShort = messageText.length > (messageStartLength + messageEndLength) ? `${messageText.slice(0, messageStartLength)} [...] ${messageText.slice(-messageEndLength)}` : messageText;
		const a = document.createElement("a");
		a.href = `#section-${i + 1}`;
		a.innerHTML = `<bold style="color: #aaaaff">${questionId}. ${titleText}:</bold> ${messageTextShort}`;
		questionId++;

		const contentEntry = document.createElement("li");
		contentEntry.appendChild(a);
		tocList.appendChild(contentEntry);
	});

	document.body.appendChild(toc);
}

const generateTOCShowHideButton = () => {
	const toggleButton = document.createElement("div");
	toggleButton.className = "mPrinC__toc-toggle";
	toggleButton.title = "Show/Hide TOC";
	toggleButton.innerHTML = `
		<img src="${chrome.runtime.getURL("logo.png")}" alt="TOCify logo"/>
	`;
	document.body.appendChild(toggleButton);
	
	toggleButton.addEventListener("click", () => {
		const toc = document.querySelector(".mPrinC__toc");
		if (!toc) return;
	
		toc.style.display = toc.style.display === "none" ? "flex" : "none";
	});
};

(async () => {

	generateTOCShowHideButton();

	const hostname = window.location.hostname;

	// Load config
	console.info(`${appTitle} Loading config...`);
	const configRes = await fetch(chrome.runtime.getURL("config.json"));
	const config = await configRes.json();
	console.info(`${appTitle} Config loaded: ${JSON.stringify(config, null, 4)}`);

	// is the page of interest? We mach hostname against any sub-string in the hostnames config string list
	if (!config.hostnames.includes(hostname)) {
		console.info(`${appTitle} Hostname "${hostname}" not of interest, exiting.`);
		return;
	} else {
		console.info(`${appTitle} Hostname "${hostname}" is of interest.`);
	}

	sectionSelector = config.sectionSelector || "article";
	const sections = await getSections(sectionSelector);
	generateTOC(sections);
})();
