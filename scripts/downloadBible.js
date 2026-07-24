/**
 * Script para baixar e processar dados da Bíblia Completa
 * Fonte: https://github.com/thiagobodruk/biblia
 * 
 * Uso: node scripts/downloadBible.js [version]
 * Versões disponíveis: nvi, acf, arc, kjv, lut, msg, etc
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configurações
const BIBLE_REPO = 'https://raw.githubusercontent.com/thiagobodruk/biblia/master/json';
const OUTPUT_DIR = path.join(__dirname, '../src/data');
const VERSION = process.argv[2] || 'acf'; // ACF = Almeida Corrigida e Revisada (português)

// Nome dos arquivos
const INPUT_FILE = `${VERSION}.json`;
const OUTPUT_FILE = `bible-${VERSION}-complete.json`;
const OUTPUT_PATH = path.join(OUTPUT_DIR, OUTPUT_FILE);

console.log(`\n📥 Baixando Bíblia ${VERSION}...`);
console.log(`📍 Destino: ${OUTPUT_PATH}\n`);

// Criar diretório se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Baixar arquivo
const downloadFile = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Seguir redirecionamento
        downloadFile(response.headers.location).then(resolve).catch(reject);
      } else if (response.statusCode === 200) {
        let data = '';
        
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        response.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error(`Erro ao fazer parse do JSON: ${error.message}`));
          }
        });
      } else {
        reject(new Error(`Status: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
};

// Processar dados da Bíblia
const processBibleData = (bibleData) => {
  const verses = [];
  
  Object.entries(bibleData).forEach(([book, chapters]) => {
    Object.entries(chapters).forEach(([chapter, verses_in_chapter]) => {
      Object.entries(verses_in_chapter).forEach(([verse, text]) => {
        verses.push({
          id: `${book}_${chapter}_${verse}`,
          book: book,
          chapter: parseInt(chapter),
          verse: parseInt(verse),
          text: text
        });
      });
    });
  });
  
  return verses;
};

// Executar download
downloadFile(`${BIBLE_REPO}/${INPUT_FILE}`)
  .then((bibleData) => {
    console.log('✅ Arquivo baixado com sucesso!\n');
    
    const processedVersesCount = Object.keys(bibleData).reduce((total, book) => {
      return total + Object.keys(bibleData[book]).reduce((subtotal, chapter) => {
        return subtotal + Object.keys(bibleData[book][chapter]).length;
      }, 0);
    }, 0);
    
    console.log(`📖 Livros encontrados: ${Object.keys(bibleData).length}`);
    console.log(`📝 Versículos processados: ${processedVersesCount}`);
    
    // Processar e salvar
    const processedVerses = processBibleData(bibleData);
    
    fs.writeFileSync(
      OUTPUT_PATH,
      JSON.stringify(processedVerses, null, 2)
    );
    
    console.log(`\n✨ Bíblia completa salva em: ${OUTPUT_FILE}`);
    console.log(`📊 Total de versículos: ${processedVerses.length}`);
    console.log(`\n✅ Pronto para usar no projeto!\n`);
  })
  .catch((error) => {
    console.error(`\n❌ Erro: ${error.message}\n`);
    process.exit(1);
  });
