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
const VERSIONS = process.argv.slice(2).length > 0 ? process.argv.slice(2) : ['acf', 'arc']; // ACF = Almeida Corrigida e Revisada, ARC = Almeida Revista e Corrigida

console.log(`\n📚 Baixando Bíblias: ${VERSIONS.join(', ').toUpperCase()}...`);
console.log(`📍 Destino: ${OUTPUT_DIR}\n`);

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

// Processar cada versão
const processVersions = async () => {
  for (const version of VERSIONS) {
    try {
      console.log(`⏳ Processando ${version.toUpperCase()}...`);
      
      const bibleData = await downloadFile(`${BIBLE_REPO}/${version}.json`);
      console.log(`✅ Arquivo ${version}.json baixado com sucesso!`);
      
      const bookCount = Object.keys(bibleData).length;
      const processedVersesCount = Object.keys(bibleData).reduce((total, book) => {
        return total + Object.keys(bibleData[book]).reduce((subtotal, chapter) => {
          return subtotal + Object.keys(bibleData[book][chapter]).length;
        }, 0);
      }, 0);
      
      console.log(`📖 Livros encontrados: ${bookCount}`);
      console.log(`📝 Versículos processados: ${processedVersesCount}`);
      
      // Processar e salvar
      const processedVerses = processBibleData(bibleData);
      const OUTPUT_FILE = `bible-${version}-complete.json`;
      const OUTPUT_PATH = path.join(OUTPUT_DIR, OUTPUT_FILE);
      
      fs.writeFileSync(
        OUTPUT_PATH,
        JSON.stringify(processedVerses, null, 2)
      );
      
      console.log(`✨ Bíblia ${version.toUpperCase()} salva em: ${OUTPUT_FILE}`);
      console.log(`📊 Total de versículos: ${processedVerses.length}\n`);
    } catch (error) {
      console.error(`\n❌ Erro ao processar ${version.toUpperCase()}: ${error.message}\n`);
    }
  }
  
  console.log(`\n✅ Download e processamento concluído!\n`);
};

processVersions();
