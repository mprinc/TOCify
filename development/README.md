Create chromium (chrome, edge, ...) extension that can 
1. read the page content and reorganize sections in it (they are all with the `<article` tag)
3. add anchors to each section
2. Generate on the page TOC (with abs coordinates) with links to each section

Configuration support:
1. hostnames to run on
1. section selectors to recognize

Provide all the files to launch it locally in DEV mode.

```html
<article class="w-full text-token-text-primary" dir="auto" data-testid="conversation-turn-25"
	data-scroll-anchor="false">
	<h5 class="sr-only">You said:</h5>
	<div class="text-base my-auto mx-auto py-5 px-6">
		<div class="mx-auto flex flex-1 text-base gap-4 md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] group/turn-messages focus-visible:outline-none"
			tabindex="-1">
			<div
				class="group/conversation-turn relative flex w-full min-w-0 flex-col @xs/thread:px-0 @sm/thread:px-1.5 @md/thread:px-4">
				<div class="relative flex-col gap-1 md:gap-3">
					<div class="flex max-w-full flex-col flex-grow">
						<div data-message-author-role="user" data-message-id="adebf499-dad8-4c50-8ad7-2df37afc6d57"
							dir="auto"
							class="min-h-8 text-message relative flex w-full flex-col items-end gap-2 whitespace-normal break-words text-start [.text-message+&amp;]:mt-5">
							<div class="w-full">
								<div class="flex w-full flex-col gap-1 empty:hidden items-end rtl:items-start">
									<div
										class="relative max-w-[var(--user-chat-width,70%)] rounded-3xl bg-token-message-surface px-5 py-2.5">
										<div class="whitespace-pre-wrap">how to conceptually map mutations and actions
											into zustand mindset? With actions I usually access backend and (i) store
											local-store (vuex/zustand) data into database or retrieve data from database
											and store them into local-store (vuex/zustand) data</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="flex absolute left-0 right-0 flex justify-end">
						<div
							class="-me-1 -ms-2.5 flex select-none items-center p-1 touch:-me-2 touch:-ms-3.5 focus-within:transition-none hover:transition-none duration-300 group-hover/turn-messages:delay-300 pointer-events-none opacity-0 motion-safe:transition-opacity group-hover/turn-messages:pointer-events-auto group-hover/turn-messages:opacity-100 group-focus-within/turn-messages:pointer-events-auto group-focus-within/turn-messages:opacity-100 has-[[data-state=open]]:pointer-events-auto has-[[data-state=open]]:opacity-100">
							<span class="" data-state="closed"><button
									class="rounded-lg text-token-text-secondary hover:bg-token-main-surface-secondary"
									aria-label="Copy" data-testid="copy-turn-action-button"><span
										class="flex h-[30px] w-[30px] items-center justify-center touch:w-[38px]"><svg
											width="24" height="24" viewBox="0 0 24 24" fill="none"
											xmlns="http://www.w3.org/2000/svg" class="icon-md-heavy">
											<path fill-rule="evenodd" clip-rule="evenodd"
												d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z"
												fill="currentColor"></path>
										</svg></span></button></span><span class="" data-state="closed"><button
									class="rounded-lg text-token-text-secondary hover:bg-token-main-surface-secondary"
									aria-label="Edit message"><span
										class="flex h-[30px] w-[30px] items-center justify-center touch:w-[38px]"><svg
											width="24" height="24" viewBox="0 0 24 24" fill="none"
											xmlns="http://www.w3.org/2000/svg" class="icon-md-heavy">
											<path fill-rule="evenodd" clip-rule="evenodd"
												d="M13.2929 4.29291C15.0641 2.52167 17.9359 2.52167 19.7071 4.2929C21.4784 6.06414 21.4784 8.93588 19.7071 10.7071L18.7073 11.7069L11.6135 18.8007C10.8766 19.5376 9.92793 20.0258 8.89999 20.1971L4.16441 20.9864C3.84585 21.0395 3.52127 20.9355 3.29291 20.7071C3.06454 20.4788 2.96053 20.1542 3.01362 19.8356L3.80288 15.1C3.9742 14.0721 4.46243 13.1234 5.19932 12.3865L13.2929 4.29291ZM13 7.41422L6.61353 13.8007C6.1714 14.2428 5.87846 14.8121 5.77567 15.4288L5.21656 18.7835L8.57119 18.2244C9.18795 18.1216 9.75719 17.8286 10.1993 17.3865L16.5858 11L13 7.41422ZM18 9.5858L14.4142 6.00001L14.7071 5.70712C15.6973 4.71693 17.3027 4.71693 18.2929 5.70712C19.2831 6.69731 19.2831 8.30272 18.2929 9.29291L18 9.5858Z"
												fill="currentColor"></path>
										</svg></span></button></span></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</article>
```