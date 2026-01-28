const { browser, expect } = require("@wdio/globals");

describe("Electron Testing", () => {
  it("should print application title", async () => {
    console.log("Hello", await browser.getTitle(), "application!");
  });
});

describe("Test markdown preview", () => {
  it("should show the correct preview", async () => {
    // Find the editor element
    const editor = await $("#editor");
    
    // Set the value in the editor
    await editor.setValue("# Editor");
    
    // Potentially wait for the markdown to render
    await browser.waitUntil(async () => {
      const previewContent = await $("#preview").getHTML();
      return previewContent.includes("<h1>Editor</h1>");
    }, {
      timeout: 5000,
      timeoutMsg: 'Preview did not update in time'
    });
    
    // Get the HTML content from the preview
    const preview = await $("#preview");
    const previewHTML = await preview.getHTML();
    
    // Assert the preview HTML is as expected
    expect(previewHTML).toContain("<h1>Editor</h1>");
  });
});
