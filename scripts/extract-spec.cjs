#!/usr/bin/env node
// Simple DOCX -> Markdown extraction for project specification
// Usage: npm run extract:spec

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const DOCX_NAME = 'Educate4Dignity_updated.docx';
const ROOT = path.resolve(__dirname, '..', '..'); // go up out of frontend folder to project root
const DOCX_PATH = path.join(ROOT, 'Context', DOCX_NAME);
const OUT_PATH = path.join(ROOT, 'Context', 'CONTEXT_SPEC.md');

async function run(){
  if(!fs.existsSync(DOCX_PATH)){
    console.error('DOCX file not found at', DOCX_PATH);
    process.exit(1);
  }
  try {
    const buffer = fs.readFileSync(DOCX_PATH);
    const { value } = await mammoth.convertToMarkdown({buffer});
    const header = `# Extracted Specification\n\n> Source: ${DOCX_NAME}\n> Generated: ${new Date().toISOString()}\n\n`;
    fs.writeFileSync(OUT_PATH, header + value, 'utf8');
    console.log('Specification extracted to', OUT_PATH);
  } catch (err){
    console.error('Extraction failed:', err);
    process.exit(1);
  }
}
run();
