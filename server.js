const http = require('http');
const puppeteer = require('puppeteer');

const server = http.createServer(async (req, res) => {
  const url = req.url.slice(1); // Убираем первый символ (/) из URL

  console.log(`Request received for: ${url}`);

  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch();

    console.log('Opening new page...');
    const page = await browser.newPage();

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle0' });

    console.log('Generating PDF...');
    const pdfBuffer = await page.pdf();
    console.log('PDF generated, closing browser...');

    await browser.close();

    console.log('Sending response...');
    res.setHeader('Content-Type', 'application/pdf');
    res.end(pdfBuffer);
    console.log('Response sent successfully.');
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    res.statusCode = 500;
    res.end('Error generating PDF');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});