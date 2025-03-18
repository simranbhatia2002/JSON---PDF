const fs = require("fs");
const PDFDocument = require("pdfkit");

// Load JSON file
const jsonFile = __dirname + "/messages.json";
const outputPDF = "chat_conversations.pdf";

// Read JSON data
const jsonData = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));

// Create a PDF Document
const doc = new PDFDocument();
const stream = fs.createWriteStream(outputPDF);
doc.pipe(stream);

// Add a title
doc.fontSize(20).text("Chat Conversations Export", { align: "center" });
doc.moveDown();

// Loop through conversations
jsonData.conversations.forEach((conversation, convoIndex) => {
  doc
    .fontSize(16)
    .fillColor("black")
    .text(`Chat with: ${conversation.displayName || "Unknown"}`, {
      underline: true,
    });
  doc.moveDown();

  // Loop through messages in each conversation
  conversation.MessageList.forEach((msg, index) => {
    doc
      .fontSize(12)
      .fillColor("blue")
      .text(`Sender: ${msg.displayName || "Unknown"}`);
    doc
      .fillColor("gray")
      .text(`Time: ${msg.originalarrivaltime || "No Timestamp"}`);
    doc
      .fillColor("black")
      .text(`Message: ${msg.content.replace(/<.*?>/g, "") || "No Content"}`);
    doc.moveDown();

    // Add separator after each message
    if (index < conversation.MessageList.length - 1) {
      doc
        .strokeColor("gray")
        .lineWidth(0.5)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();
      doc.moveDown();
    }
  });

  // Add a space between conversations
  if (convoIndex < jsonData.conversations.length - 1) {
    doc.addPage(); // Start a new page for the next conversation
  }
});

// Finalize PDF
doc.end();

console.log("✅ PDF file has been created:", outputPDF);
