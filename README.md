# 📖 Bíblia Completa - Off-line

Um app responsivo e completo da Bíblia construído com React, TypeScript e funcionalidade 100% off-line usando IndexedDB.

## ✨ Funcionalidades

- ✅ **Leitura completa da Bíblia** - Todos os livros, capítulos e versículos
- ✅ **Modo Off-line** - Funciona completamente sem conexão com internet
- ✅ **Busca avançada** - Procure por palavras, versículos ou livros
- ✅ **Favoritos** - Salve seus versículos favoritos
- ✅ **Anotações pessoais** - Adicione notas aos versículos
- ✅ **Copiar e compartilhar** - Copie versículos ou compartilhe com amigos
- ✅ **Tema claro/escuro** - Alterne entre temas para melhor conforto visual
- ✅ **Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- ✅ **Interface intuitiva** - Design moderno e fácil de usar

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Storage**: IndexedDB (para dados off-line)
- **UI Icons**: Lucide React
- **Estilos**: CSS3 com variáveis customizadas

## 🚀 Como começar

### Requisitos
- Node.js 16+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/davidamorim1288/B-blia-completa-Off-line.git

# Entre na pasta do projeto
cd B-blia-completa-Off-line

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O app abrirá automaticamente em `http://localhost:3000`

### Build para produção

```bash
npm run build
```

Os arquivos compilados estarão na pasta `dist/`

## 📱 Uso

1. **Navegação**: Use a barra lateral para selecionar um livro e capítulo
2. **Busca**: Digite no campo de busca para procurar por palavras ou referências (ex: "Mateus 5")
3. **Favoritos**: Clique no ❤️ para adicionar um versículo aos favoritos
4. **Anotações**: Clique em "Adicionar anotação" para salvar notas pessoais
5. **Compartilhar**: Use os botões de copiar ou compartilhar
6. **Tema**: Alterne entre tema escuro e claro

## 📚 Estrutura do Projeto

```
src/
├── components/
│   ├── BibleReader.tsx      # Componente principal de leitura
│   ├── SearchBar.tsx         # Barra de busca
│   ├── Sidebar.tsx           # Navegação de livros
│   ├── ThemeToggle.tsx       # Toggle de tema
│   └── Favorites.tsx         # Modal de favoritos
├── services/
│   ├── indexedDbService.ts  # Operações com IndexedDB
│   └── bibleService.ts      # Lógica da Bíblia
├── styles/
│   └── *.css                 # Estilos dos componentes
├── data/
│   └── bible.json            # Dados da Bíblia
├── App.tsx                   # Componente raiz
└── index.css                 # Estilos globais
```

## 🎨 Customização

Você pode customizar as cores editando as variáveis CSS em `src/index.css`:

```css
:root {
  --primary: #1a1a2e;
  --secondary: #16213e;
  --accent: #0f3460;
  --highlight: #e94560;
  --text-light: #eaeaea;
  --text-dark: #1a1a2e;
  --bg-light: #f5f5f5;
  --bg-dark: #0f0f1e;
  --border: #2a2a3e;
}
```

## 📝 Dados da Bíblia

O app inclui um dataset inicial com alguns versículos em `src/data/bible.json`. Para uma Bíblia completa, você pode:

1. Obter um arquivo JSON completo de um repositório público
2. Processar e adicionar ao banco de dados IndexedDB

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

## 🙏 Créditos

- Desenvolvido com ❤️ por David Amorim
- Dados da Bíblia na versão Almeida Corrigida e Revisada (ACR)

## 📧 Suporte

Para reportar bugs ou sugerir features, abra uma issue no repositório.

---

**Nota**: Este é um projeto em desenvolvimento. Mais recursos e otimizações virão em breve!
