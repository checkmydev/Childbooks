/* ============================================================================
 * stories.js — Contenu des histoires (français, 5–10 ans).
 * Chaque page a :
 *   - scene : clé d'illustration SVG (voir illustrations.js)
 *   - image : nom de fichier PNG optionnel (dans /images). Si présent et
 *             disponible, il remplace le SVG. Sinon, on affiche le SVG.
 *   - text  : le texte de la page (lu par la synthèse vocale)
 *   - alt   : description accessible de l'image
 * ==========================================================================*/

const STORIES = [
  {
    id: "loutre",
    title: "Momo la petite loutre et l'étoile tombée",
    subtitle: "Une histoire d'entraide",
    age: [5, 6],
    cover: "cover_loutre",
    color: "#3b2c6b",
    emoji: "🦦",
    pages: [
      {
        scene: "loutre_riviere",
        image: "loutre-page1.png",
        text: "Au bord de la rivière vivait Momo, une petite loutre au poil doux comme la mousse. Chaque matin, elle glissait sur les galets et faisait des bulles dans l'eau fraîche.",
        alt: "Une petite loutre au bord d'une rivière ensoleillée."
      },
      {
        scene: "loutre_etoile",
        image: "loutre-page2.png",
        text: "Un soir, alors que la lune brillait, une étoile toute dorée tomba du ciel et se posa sur la colline. « Oh ! » souffla Momo. « Cette étoile a l'air perdue. »",
        alt: "Une étoile dorée tombe du ciel étoilé près d'une colline."
      },
      {
        scene: "loutre_etoile",
        image: "loutre-page3.png",
        text: "L'étoile clignotait tout doucement, comme si elle avait envie de pleurer. « Ne t'inquiète pas, dit Momo. Je vais t'aider à retrouver le ciel. Mais je ne suis pas assez grande toute seule. »",
        alt: "La petite loutre parle à l'étoile posée sur la colline."
      },
      {
        scene: "loutre_amis",
        image: "loutre-page4.png",
        text: "Alors Momo appela ses amis. Le lapin arriva en bondissant, et le renard roux accourut. Ensemble, ils réfléchirent : comment renvoyer une étoile dans le ciel ?",
        alt: "La loutre, un lapin et un renard réunis pour aider."
      },
      {
        scene: "loutre_amis",
        image: "loutre-page5.png",
        text: "« J'ai une idée ! » dit le renard. Ils montèrent les uns sur les autres, tout en haut de la colline. Momo prit l'étoile entre ses pattes et la lança le plus haut possible.",
        alt: "Les amis empilés lancent l'étoile vers le ciel."
      },
      {
        scene: "loutre_maison",
        image: "loutre-page6.png",
        text: "L'étoile remonta, remonta, et retrouva sa place dans le ciel, plus brillante que jamais. « Merci les amis ! » murmura le vent. Et Momo comprit qu'à plusieurs, on peut toucher les étoiles.",
        alt: "L'étoile brille de nouveau dans le ciel au coucher du soleil."
      }
    ]
  },

  {
    id: "dragon",
    title: "Le dragon qui avait peur du noir",
    subtitle: "Apprivoiser ses peurs",
    age: [6, 8],
    cover: "cover_dragon",
    color: "#101a3a",
    emoji: "🐲",
    pages: [
      {
        scene: "dragon_grotte_jour",
        image: "dragon-page1.png",
        text: "Gaston était un dragon vert avec des ailes minuscules et un grand cœur. Il habitait une grotte confortable au flanc de la montagne. Le jour, Gaston était le dragon le plus courageux du pays.",
        alt: "Un petit dragon vert devant sa grotte, en plein jour."
      },
      {
        scene: "dragon_noir",
        image: "dragon-page2.png",
        text: "Mais dès que la nuit tombait, tout changeait. Dans le noir de la grotte, Gaston tremblait. Il imaginait des ombres, des monstres et des bruits bizarres. « Et si quelque chose se cachait là ? »",
        alt: "Le dragon effrayé dans l'obscurité totale de sa grotte."
      },
      {
        scene: "dragon_noir",
        image: "dragon-page3.png",
        text: "Un dragon crache du feu, se disait Gaston, alors pourquoi ai-je si peur ? Il essaya de souffler une flamme pour s'éclairer... mais quand on a peur, même le feu ne veut pas venir.",
        alt: "Le dragon essaie de cracher du feu dans le noir."
      },
      {
        scene: "dragon_luciole",
        image: "dragon-page4.png",
        text: "Cette nuit-là, une petite luciole entra dans la grotte. Elle brillait comme une minuscule lanterne. « Bonsoir, dit-elle. Pourquoi te caches-tu ? » « J'ai peur du noir », avoua Gaston tout bas.",
        alt: "Une luciole lumineuse rend visite au dragon dans la nuit."
      },
      {
        scene: "dragon_luciole",
        image: "dragon-page5.png",
        text: "« Le noir n'est pas méchant, dit la luciole. Il aime juste jouer à cache-cache. Regarde : quand je brille, les ombres deviennent des amies. » Et elle dansa autour de Gaston jusqu'à ce qu'il sourie.",
        alt: "La luciole danse et éclaire doucement la grotte."
      },
      {
        scene: "dragon_luciole",
        image: "dragon-page6.png",
        text: "Gaston respira très fort, ferma les yeux, et repensa à la lumière de son amie. Alors, une petite flamme chaude jaillit enfin de sa bouche. La grotte s'illumina, et il n'y avait aucun monstre. Rien que lui.",
        alt: "Le dragon rassuré crache enfin une flamme qui éclaire la grotte."
      },
      {
        scene: "dragon_courage",
        image: "dragon-page7.png",
        text: "Depuis ce jour, Gaston n'a plus jamais peur du noir. Le soir, il allume sa petite flamme, la luciole vient jouer, et ils regardent les étoiles ensemble. Car le courage, parfois, c'est juste une lumière qu'on partage.",
        alt: "Le dragon courageux et la luciole au coucher du soleil."
      }
    ]
  },

  {
    id: "lila",
    title: "Lila et la graine magique",
    subtitle: "La patience et la nature",
    age: [7, 8],
    cover: "cover_lila",
    color: "#2f7d4f",
    emoji: "🌱",
    pages: [
      {
        scene: "lila_jardin",
        image: "lila-page1.png",
        text: "Lila adorait le jardin de sa grand-mère. Un jour, au fond d'un vieux tiroir, elle trouva une graine argentée qui scintillait. Une étiquette disait : « Graine magique — à planter avec patience. »",
        alt: "Lila dans un jardin fleuri tient une graine brillante."
      },
      {
        scene: "lila_jardin",
        image: "lila-page2.png",
        text: "Lila creusa un petit trou, y déposa la graine et la recouvrit de terre douce. « Voilà ! » dit-elle. Puis elle attendit. Une heure. Deux heures. Mais rien ne poussait. « La magie est peut-être en retard ? »",
        alt: "Lila plante la graine dans la terre du jardin."
      },
      {
        scene: "lila_pluie",
        image: "lila-page3.png",
        text: "Le lendemain, il plut toute la journée. Lila était triste de ne pas pouvoir jardiner. Mais grand-mère sourit : « La pluie, c'est la nature qui arrose tes rêves. La magie a besoin d'eau, de temps et d'amour. »",
        alt: "Il pleut sur le jardin, une petite pousse commence à sortir."
      },
      {
        scene: "lila_pousse",
        image: "lila-page4.png",
        text: "Chaque matin, Lila rendait visite à sa graine. Elle lui parlait, lui chantait des chansons et lui donnait un peu d'eau. Un jour, enfin, une toute petite pousse verte pointa le bout de son nez !",
        alt: "Une petite pousse verte sort de terre près de Lila."
      },
      {
        scene: "lila_pousse",
        image: "lila-page5.png",
        text: "La pousse grandit un peu chaque jour. Des feuilles apparurent, puis un bouton, puis une fleur orange comme un petit soleil. Lila comprit que les plus belles choses ne poussent pas en un claquement de doigts.",
        alt: "La pousse est devenue une plante avec une fleur orange."
      },
      {
        scene: "lila_arbre",
        image: "lila-page6.png",
        text: "Les semaines passèrent, et la graine magique devint un arbre immense, couvert de fleurs multicolores. Les oiseaux vinrent y chanter. « Tu vois, dit grand-mère, la vraie magie, c'est la patience. »",
        alt: "Un grand arbre fleuri au coucher du soleil, avec Lila à côté."
      }
    ]
  },

  {
    id: "inventeurs",
    title: "Les trois inventeurs de la forêt",
    subtitle: "L'union fait la force",
    age: [9, 10],
    cover: "cover_invent",
    color: "#2f7d4f",
    emoji: "🦊",
    pages: [
      {
        scene: "invent_foret",
        image: "invent-page1.png",
        text: "Au cœur de la Grande Forêt vivaient trois amis très différents. Roux le renard était rapide et rusé. Bibi la lapine débordait d'idées. Et Hulotte la chouette, perchée sur sa branche, connaissait tous les livres de la forêt.",
        alt: "Un renard, une lapine et une chouette réunis dans la forêt."
      },
      {
        scene: "invent_probleme",
        image: "invent-page2.png",
        text: "Un matin, une nouvelle inquiétante circula : la rivière avait tellement grossi que le vieux pont s'était écroulé. Les animaux du village ne pouvaient plus traverser pour rejoindre le verger, de l'autre côté.",
        alt: "Le pont cassé au-dessus d'une rivière en crue."
      },
      {
        scene: "invent_probleme",
        image: "invent-page3.png",
        text: "« Sautons ! » proposa Roux. Mais la rivière était bien trop large. « Nageons ! » dit Bibi. Mais le courant était bien trop fort. Hulotte réfléchit un instant, puis déclara : « Chacun de nous a un talent. Utilisons-les ensemble. »",
        alt: "Les trois amis discutent au bord de la rivière."
      },
      {
        scene: "invent_machine",
        image: "invent-page4.png",
        text: "Hulotte dessina le plan d'une drôle de machine. Bibi imagina un système de poulies avec des lianes solides. Et Roux, agile, grimpa aux arbres pour tout attacher. Chacun apportait sa pierre à l'édifice.",
        alt: "Les amis construisent une machine à poulies dans la forêt."
      },
      {
        scene: "invent_machine",
        image: "invent-page5.png",
        text: "Après trois jours de travail, la machine était prête : un radeau tiré par des cordes, qui glissait d'une rive à l'autre en toute sécurité. « Ça ne marchera jamais », grognaient les grognons. Mais les trois amis tirèrent sur la corde...",
        alt: "Le radeau à cordes prêt à traverser la rivière."
      },
      {
        scene: "invent_fete",
        image: "invent-page6.png",
        text: "Et le radeau traversa ! Un par un, tous les animaux purent enfin rejoindre le verger. Ce soir-là, on organisa une grande fête sous les confettis. « Seuls, on va plus vite, dit Hulotte, mais ensemble, on va plus loin. »",
        alt: "Grande fête avec confettis pour célébrer la traversée réussie."
      }
    ]
  }
];

window.STORIES = STORIES;
