const express = require("express");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const app = express();
const PORT = 3000;

// Generate PDF Function
const generatePDF = () => {
  const jsonFile = __dirname + "/messages.json";
  const outputPDF = "chat_conversations.pdf";

  const jsonData = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(outputPDF);
  doc.pipe(stream);

  doc.fontSize(20).text("Chat Conversations Export", { align: "center" });
  doc.moveDown();

  jsonData.conversations.forEach((conversation, convoIndex) => {
    doc
      .fontSize(16)
      .fillColor("black")
      .text(`Chat with: ${conversation.displayName || "Unknown"}`, {
        underline: true,
      });
    doc.moveDown();

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
    });

    if (convoIndex < jsonData.conversations.length - 1) {
      doc.addPage();
    }
  });

  doc.end();
  return outputPDF;
};

// Route to serve the homepage
app.get("/", (req, res) => {
  res.send("Welcome! Go to <a href='/download'>/download</a> to get the PDF.");
});

// Route to generate and serve the PDF
app.get("/download", (req, res) => {
  const pdfPath = generatePDF();
  res.download(pdfPath);
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
