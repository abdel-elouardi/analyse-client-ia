# 🤖 Analyse Client IA

Application web de segmentation clients et détection de churn
construite avec Python et React.

## 🎯 Fonctionnalités

- Segmentation automatique en 4 groupes (KMeans)
- Prédiction de churn avec probabilité (Random Forest)
- Recommandations automatiques par client
- Historique des analyses
- Interface web moderne et responsive

## 🛠️ Technologies

| Frontend | Backend | Machine Learning |
|---|---|---|
| React | FastAPI | Scikit-learn |
| Vite | Python | KMeans |
| CSS | Uvicorn | Random Forest |

## 🚀 Lancer le projet

### Backend
```bash
source venv/bin/activate
uvicorn main:app --reload
```

### Frontend
```bash
cd mon-app
npm run dev
```

## 📊 Résultats du modèle

- Accuracy : 89%
- 4 segments clients identifiés
- Détection de churn avec 99% de précision sur clients à risque

## 👤 Auteur

Abdel El Ouardi — Étudiant M1 Data/IA
