const fs = require('fs');
const path = require('path');

const HTML_FILE = 'index.html';
const LOGOS_DIR = './LOGOS';

// Function to normalize a string for comparison
function normalizeName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function updateLogos() {
    try {
        // Read HTML file
        let htmlContent = fs.readFileSync(HTML_FILE, 'utf-8');
        
        // Read logos directory
        const files = fs.readdirSync(LOGOS_DIR);
        
        // Create a map of normalized filename (without extension) to actual filename
        const fileMap = {};
        for (const file of files) {
            const ext = path.extname(file);
            const baseName = path.basename(file, ext);
            // also handle double extensions like .svg.png
            const cleanName = baseName.replace(/\.svg$/, '').replace(/\.jpg$/, '');
            fileMap[normalizeName(cleanName)] = file;
        }

        // Regex to match img tags that have an alt attribute
        const imgRegex = /<img[^>]+alt="([^"]+)"[^>]*>/g;
        
        let updatedCount = 0;
        
        htmlContent = htmlContent.replace(imgRegex, (match, altText) => {
            const normAlt = normalizeName(altText);
            
            // Skip images that aren't bank logos (like hero images, video placeholders)
            if (normAlt.includes('preview') || normAlt.includes('ecosystem') || normAlt.includes('logo') || altText.length > 30) {
                return match;
            }

            let bestMatch = null;
            
            // Direct match
            if (fileMap[normAlt]) {
                bestMatch = fileMap[normAlt];
            } else {
                // Partial match
                for (const normFile in fileMap) {
                    if (normFile.length > 2 && (normAlt.includes(normFile) || normFile.includes(normAlt))) {
                        bestMatch = fileMap[normFile];
                        break;
                    }
                }
            }

            if (bestMatch) {
                // Replace the src attribute
                const newSrc = `LOGOS/${bestMatch}`;
                const srcRegex = /src="([^"]+)"/;
                if (srcRegex.test(match)) {
                    updatedCount++;
                    console.log(`Matched: "${altText}" -> ${bestMatch}`);
                    return match.replace(srcRegex, `src="${newSrc}"`);
                }
            }
            
            console.log(`No match found for: "${altText}"`);
            return match;
        });

        // Save the updated HTML
        fs.writeFileSync(HTML_FILE, htmlContent);
        console.log(`\nSuccessfully updated ${updatedCount} logo paths in ${HTML_FILE}`);
        console.log("Note: If any logos didn't match, ensure the filename in the 'LOGOS' folder matches the 'alt' text of the bank.");

    } catch (error) {
        console.error("Error updating logos:", error.message);
    }
}

updateLogos();
