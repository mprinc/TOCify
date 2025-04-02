const appTitle = "TOC-generator";

const waitForArticles = (selector, timeout = 10000) => {
	return new Promise((resolve, reject) => {
		const observer = new MutationObserver(() => {
			const articles = document.querySelectorAll(selector);
			if (articles.length > 0) {
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
}

const generateTOC = (sections) => {
	// Build TOC
	const toc = document.createElement("div");
	toc.className = "custom-toc";
	toc.innerHTML = "<h4>TOC</h4><ul></ul>";
	const ul = toc.querySelector("ul");

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
		questionId ++;

		const li = document.createElement("li");
		li.appendChild(a);
		ul.appendChild(li);
	});

	document.body.appendChild(toc);
}

(async () => {
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



	const selector = config.sectionSelector || "article";
	let sections;

	try {
		sections = await waitForArticles(selector);
	} catch (err) {
		console.warn("Articles not found in time:", err);
		return;
	}

	// any sections to process?
	if (!sections.length) {
		console.info(`${appTitle} No sections found with selector "${selector}", exiting.`);
		return;
	} else {
		console.info(`${appTitle} Found ${sections.length} sections with selector "${selector}".`);
	}

	// Sort alphabetically by innerText (example reorganization)
	// sections.sort((a, b) => a.innerText.localeCompare(b.innerText));

	// const container = sections[0].parentNode;

	// Clear and re-append sorted
	sections.forEach((s, i) => {
		s.id = `section-${i + 1}`;
		//   container.appendChild(s);
	});

	generateTOC(sections);
})();
