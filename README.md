# Mon frigo

Gestion du frigo et liste de courses (Next.js, Prisma, SQLite).

```
prisma/schema.prisma      Modèles Product, FridgeItem, ShoppingItem
src/
  app/                    Routes Next.js : pages minces et routes API minces
    api/                  Chaque route délègue à src/server
  features/
    fridge/               Écran du frigo : vue, formulaire, ligne, hook, utilitaires
    shopping/             Écran des courses : vue, formulaire, ligne, hook, export
  components/
    layout/               Navigation
    ui/                   Logo, icônes et sélecteur de catégories
  server/                 Logique métier et accès à la base (jamais importé côté client)
  lib/                    Client API, constantes, instance Prisma
  types/                  Types partagés
```
