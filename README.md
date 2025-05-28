# 🗨️ Nest Chat  — Vue 3 + NestJS

Ce projet est une application de messagerie en temps réel construite avec :

- **Frontend** : Vue 3 + Vue Router + Composition API + TypeScript + Pinia + ShadcnVue + Socket.io
- **Backend** : NestJS + WebSockets + MongoDB (Mongoose)  
- **Objectif** : Discuter en temps réel, gérer l'historique, les utilisateurs, les statuts de lecture...

---

## 🚀 Fonctionnalités principales

### Frontend (Vue 3)

- 🔐 Authentification utilisateur
- 📥 Saisie et envoi de messages  
- 📆 Séparation automatique des messages par date
- 👥 Affichage des utilisateurs tapant en temps réel  
- ✅ Indication de messages lus / délivrés 
- 🎨 Profil avec couleur personnalisée et utilisation dans l'UI global
- 📦 Store utilisateur via Pinia  
- 🔔 Notifications toast  

### Backend (NestJS)

- 📡 WebSocket Gateway :
  - Connexion au chat / Déconnexion du chat
  - Envoi / réception des messages  
  - État de frappe (`isTyping`)  
  - Notifications de lecture (`markAsRead`)  
- 🛢️ Base de données : MongoDB avec Mongoose (Schema Mongoose)
- 🧪 Types stricts (`IUser`, `IMessage`, `IChat`)
- 📚 Utilisation d’Enums pour une meilleure lisibilité et maintenance

### Docker 
- 🐳 Conteneurisation simplifiée avec Docker Compose
- 🔗 Mise en réseau front / back pour un environnement local cohérent

---

## 📁 Arborescence (simplifiée)

📦nest-chat/
├── backend/
│ └── src/
│ ├── modules/ # controllers, services, modules
│ │ ├── chat/
│ │ │ └── dto/ # DTOs pour validation des schemas
│ │ ├── auth/
│ │ │ └── jwt/ # logique JWT
│ │ └── user/
│ └── schemas/ # schémas Mongoose (models)
├── frontend/
│ └── src/
│ ├── components/ # components ShadcnVue et custom
│ ├── composables/ # fonctions réutilisables : auth, jwt, toast...
│ ├── router/ # Vue Router
│ ├── services/ # appels API backend
│ ├── stores/ # stores Pinia
│ └── types/ # types & enums frontend
├── docker-compose.yml
└── .env-example

## 🔧 Installation & Lancement

1. Cloner le projet
2. Copier .env-example en .env et configurer les variables d’environnement
3. Lancer la commande d̀ocker compose up --build`

# Frontend 
1. Faire la commande suivante c̀d frontend`
2. Lancer le serveur avec ǹpm run dev`

# Backend
1. Faire ǹest start`

