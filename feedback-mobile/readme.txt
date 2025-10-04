# 📱 Feedback Mobile App - React Native

Aplicação mobile para gerenciamento de feedbacks e comentários, construída com React Native e Expo.

---

## 📋 Requisitos

- **Node.js** >= 20.x
- **npm** ou **yarn**
- **Expo CLI** instalado globalmente
- **Backend rodando** (ajustar URL de acordo com o ambiente)
- **Emulador Android/iOS** ou **Expo Go** instalado no smartphone

---

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para apps nativos
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Superset tipado de JavaScript
- **React Navigation** - Navegação entre telas
- **React Hook Form** - Gerenciamento de formulários
- **Yup** - Validação de schemas
- **Axios** - Cliente HTTP
- **Expo Vector Icons** - Ícones do Ionicons e Material
- **Lodash** - Utilitários JavaScript

---

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd feedback-mobile
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure a URL da API

Edite o arquivo `src/api/api.ts` e ajuste a `baseURL`:

```typescript
// Para emulador Android
baseURL: "http://10.0.2.2:3000"

// Para emulador iOS
baseURL: "http://localhost:3000"

// Para dispositivo físico na mesma rede
baseURL: "http://192.168.x.x:3000" // IP da sua máquina
```

---

## 🚀 Como Rodar

### Modo de desenvolvimento

#### Android
```bash
npx expo start --android
```

#### iOS
```bash
npx expo start --ios
# ou
npm run ios
```

#### Web (Preview)
```bash
npx expo start --web
# ou
npm run web
```

### Usando Expo Go

1. Inicie o servidor:
   ```bash
   npx expo start
   ```

2. Escaneie o QR Code com:
   - **Android**: App Expo Go
   - **iOS**: Câmera nativa

---

## 📱 Funcionalidades

### ✅ Lista de Feedbacks
- FlatList otimizada com paginação infinita
- Busca por título ou descrição
- Pull-to-refresh para atualizar dados
- Cards visuais com informações resumidas
- Navegação para detalhes ao tocar no card

### ✅ Detalhes do Feedback
- Visualização completa do feedback
- Lista de comentários
- Criação, edição e exclusão de comentários
- Botão de edição no header
- Layout responsivo portrait/landscape

### ✅ Formulário de Feedback
- Criação de novos feedbacks
- Edição de feedbacks existentes
- Validação em tempo real
- Pickers nativos para categoria e status
- Botão de exclusão (apenas em edição)
- KeyboardAvoidingView configurado

### ✅ Recursos Extras
- Toast notifications para feedback visual
- Estados de loading e empty
- Alertas nativos de confirmação
- Layout totalmente responsivo
- Navegação intuitiva com Native Stack

---

## 📂 Estrutura do Projeto

```
feedback-mobile/
├── assets/                  # Imagens e recursos
├── src/
│   ├── api/                 # Configuração de API
│   │   ├── api.ts           # Instância do Axios
│   │   ├── feedbacks.ts     # Endpoints de feedbacks
│   │   └── comments.ts      # Endpoints de comentários
│   ├── components/          # Componentes reutilizáveis
│   │   ├── AppButton.tsx
│   │   ├── AppHeader.tsx
│   │   ├── AppInput.tsx
│   │   ├── AppPicker.tsx
│   │   ├── BottomButton.tsx
│   │   ├── CommentCard.tsx
│   │   ├── FeedbackCard.tsx
│   │   ├── SearchInput.tsx
│   │   └── ToastCard.tsx
│   ├── context/             # Contextos do para o toast
│   │   └── ToastProvider.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useFeedbacks.ts
│   │   └── useComments.ts
│   ├── navigation/          # Configuração de navegação
│   │   └── AppStack.tsx
│   ├── screens/             # Telas da aplicação
│   │   ├── FeedbackList.tsx #Tela principal onde lista todos os feedbacks
│   │   ├── FeedBackDetails/ #Tela que detalha os feedbacks e da acesso aos comentarios
│   │   └── FeedbackForm.tsx # formulario para feedbacks e em estado de edição , edita e apaga
│   ├── utils/               # Utilitários (enums)
│   │   └── enums.ts
│   └── App.tsx              # Componente raiz
├── app.json                 # Configurações do Expo
├── package.json
└── tsconfig.json
```

---

## 🎨 Componentes Principais

### **FeedbackList**
- FlatList com infinite scroll
- SearchInput com debounce # Configurado para ser quase 3 segundos 
- RefreshControl para atualizar
- BottomButton flutuante para criar feedback

### **FeedbackCard**
- Card visual otimizado
- Truncamento de texto automático
- Ícones de comentários e data
- TouchableOpacity para navegação

### **FeedbackDetail**
- Header customizado com botões #Altera de pagina para pagina
- FlatList de comentários
- CommentCard com edição inline
- Footer fixo com formulário de comentário

### **FeedbackForm**
- Formulário com validação
- Pickers nativos iOS/Android
- KeyboardAvoidingView
- Botões de ação no footer

---

## 🔌 Integração com API

A aplicação consome a API backend através do Axios:

```typescript
// Configuração de baseURL por plataforma
const api = axios.create({
  baseURL: "http://10.0.2.2:3000", // Android Emulator
  timeout: 5000,
});
```

**URLs por ambiente:**
- Android Emulator: `http://10.0.2.2:3000`
- iOS Simulator: `http://localhost:3000`
- Dispositivo físico: `http://<IP-DA-MAQUINA>:3000`

---

## 📐 Layout Responsivo

- **Dimensions API** para cálculos dinâmicos
- **Flex Layout** para adaptação automática
- **ScrollView** quando necessário
- **KeyboardAvoidingView** em formulários
- Testado em portrait e landscape

---

## ⚡ Performance

- **FlatList** otimizada com `keyExtractor`
- **initialNumToRender** configurado
- **onEndReachedThreshold** ajustado
- **Debounce** na busca (500ms)
- **useMemo** e **useCallback** para otimização
- Remoção de duplicados na paginação

---

## 🧪 Validações

Validação de formulários com **Yup**:

### Feedbacks
- Título: mínimo 3 caracteres
- Descrição: mínimo 10 caracteres
- Categoria: valor obrigatório
- Status: valor obrigatório

### Comentários
- Autor: obrigatório
- Conteúdo: obrigatório

---


---

## 🔧 Scripts Disponíveis

```bash
npm start            # Inicia o Expo
npm run android      # Roda no emulador Android
npm run ios          # Roda no simulador iOS
npm run web          # Roda na web
```

---

## 🐛 Troubleshooting

### Erro de conexão com a API
- Verifique se o backend está rodando
- Confirme a `baseURL` correta
- Teste com Postman/Insomnia primeiro

### Emulador Android não conecta
- Use `http://10.0.2.2:3000` (não localhost)
- Verifique se o firewall não está bloqueando

### Keyboard esconde inputs
- `KeyboardAvoidingView` já está configurado
- Ajuste `keyboardVerticalOffset` se necessário

---
