# Panga Mobile

Application mobile Expo (React Native + TypeScript) pour la plateforme immobilière **Panga** (RDC).
Elle se connecte directement à l'API de production : **https://panga-api-seven.vercel.app** (annuaire public `/v1/listings`).

## Flux de l'application

```
WelcomeScreen (accueil)
      │  Commencer / Passer / Se connecter
      ▼
ListingsScreen (liste des logements + filtre ville)
      │  appui sur une carte
      ▼
ListingDetailScreen (photos, caractéristiques, équipements, bailleur)
```

## Prérequis

- **Termux** sur ton Samsung (Node 22, npm)
- **Expo Go** installé depuis le Play Store (gratuit)

## Lancer et tester

```bash
cd panga-mobile
npx expo start --lan      # démarrer le serveur Metro (LAN)
```

Expo affiche une adresse du style `exp://192.168.1.200:8081`.

Dans **Expo Go** : option **« Enter URL manually »** → tape exactement l'adresse affichée (`exp://<adresse>:8081`).

> Si la connexion LAN échoue : `npx expo start --tunnel` (nécessite éventuellement `npm install --global @expo/ngrok`) et utilise l'adresse `.exp.direct` affichée. Le tunnel est plus lent.

Diagnostic rapide de Metro : `curl http://127.0.0.1:8081/status` doit répondre `packager-status:running`.

## Architecture

```
panga-mobile/
├── App.tsx                           # NavigationContainer + SafeAreaProvider
└── src/
    ├── config.ts                     # API_BASE_URL (à changer pour changer d'environnement)
    ├── types.ts                      # Types TypeScript (PublicHousing, ListingDetail…)
    ├── api.ts                        # Client HTTP (fetch) + formatage
    ├── theme/                        # Thème centralisé
    │   ├── palette.ts                # Couleurs de la marque Panga (navy, teal…)
    │   └── index.ts                  # Couleurs sémantiques + espacements + rayons
    ├── navigation/
    │   ├── types.ts                  # RootStackParamList (routes typées)
    │   └── RootNavigator.tsx         # Pile native-stack (Welcome → Listings → Detail)
    ├── components/
    │   ├── ListingCard.tsx           # Carte d'un logement (liste)
    │   └── ui/                       # Composants réutilisables
    │       ├── PrimaryButton.tsx     # Bouton plein (Commencer)
    │       ├── SecondaryButton.tsx   # Bouton contour (Se connecter)
    │       ├── PaginationDots.tsx    # Points de pagination
    │       ├── Feature.tsx           # Bloc d'argumentaire (icône + texte)
    │       ├── LanguageSelector.tsx  # Sélecteur langue (drapeau RDC + FR)
    │       ├── Chip.tsx              # Badge (équipement, caractéristique…)
    │       └── Avatar.tsx            # Avatar initiales (bailleur)
    └── screens/
        ├── WelcomeScreen.tsx         # Page 1 (accueil/onboarding)
        ├── ListingsScreen.tsx        # Liste + filtre ville
        └── ListingDetailScreen.tsx   # Fiche détaillée
```

## Commandes utiles

| Commande                  | Effet                                  |
|---------------------------|----------------------------------------|
| `npx expo start --lan`    | Démarre Metro (LAN)                    |
| `npx expo start --tunnel` | Démarre Metro via tunnel (si LAN KO)   |
| `npx expo start -c`       | Redémarre Metro en vidant le cache     |
| `npx tsc --noEmit`        | Vérifie les types TypeScript           |

## Étapes suivantes (plus tard)

- Connexion utilisateur (OAuth Mbayo) pour de vraies demandes de location.
- Espace propriétaire : gérer ses logements (depuis l'API `/v1` authentifiée).
- Générer un **APK** avec **EAS Build** (build cloud, sans Android Studio ni SDK local).