# MarkDown-Editor
A markdown editor in electronjs
![](./doc/Preview.png)

## Header/Footer
Il y a une grille avec 3 emplacements pour le header et 3 emplacements pour le footer. On peut les remplir librement, avec du texte ou du html, ou les laisser vides. Certainent valeur permettent d'insérer des valeures spéciales
- `<span class="date"></span>`: La date actuelle
- `<span class="pageNumber"></span>`: Le numéro de page
- `<span class="totalPages"></span>`: Le nombre total de page

Il est également possible de modifier le header/footer avec du css, voici le template html utilisé:
```html
headerTemplate: |-
    <style>
      /*Votre css personnalisé*/
    </style>
    <div class="header" style="font-size: 11px; text-align: center; width: 100%; display: flex; flex-direction: row; justify-content: space-around;">
      <p><!-- Header Left--></p>
      <p><!-- Header Center--></p>
      <p><!-- Header Right--></p>
    </div>
  footerTemplate: |-
    <div class="footer" style="font-size: 11px; text-align: center; width: 100%; display: flex; flex-direction: row; justify-content: space-around;">
      <p><!-- Footer Left--></p>
      <p><!-- Footer Center--></p>
      <p><!-- Footer Right--></p>
    </div>
```

## Css personnalisé
Il est possible de changer le style du corps du document avec du css.

## Marges
Il est possible de changer les marges du documents et le format de la page.
Les valeurs par défaut sont: 

```
    30mm
20mm A4 20mm
    30mm
```

## Titre
Il est possible de donner un titre au document. La valeur par défaut est le nom du fichier.

## Fonctionnalités
### Minimum
- [x] Ecriture de documents en markdown
- [x] Affichage d'une preview en temps réel
- [x] Export pdf
	- [x] En-têtes et pieds-de-pages customisés
	- [x] Taille de police et des titre
	- [x] Couleur de fond
	- [x] Taille des interlignes
	- [x] Choix de la police
- [ ] Rechercher et remplacer

### En plus
- [ ] Syntax highlighting pour les blocs de code
	- [ ] Plusieurs languages
- [ ] Themes pour l'éditeur
- [ ] Synchronisation cloud (backend perso ou onedrive/google drive):
	- [ ] Chacun peux self-hosted son serveur
	- [ ] On renseigne l'url du serveur et ses credentials et on peut synchroniser
- [ ] Workflow pour build l'app

## Objectifs
### Semaine 1
- [x] Application electron avec une zone de texte
- [x] Affichage d'une preview (pas forcement en temps réel)
- [x] Sauvegarde et ouverture de fichiers
