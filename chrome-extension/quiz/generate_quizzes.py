#!/usr/bin/env python3
"""
Script de génération de quiz pour couples à distance
Génère des quiz complets avec 10-15 questions
"""

import json
import random

# Templates de quiz supplémentaires
additional_quizzes = [
    {
        "id": "quiz_006_conflits_distance",
        "theme_id": "theme_061",
        "title": "Disputes à distance",
        "description": "Gérer les conflits sans être physiquement ensemble",
        "category": "Conflits & Résilience",
        "theme_type": "precise",
        "difficulty": "medium",
        "premium_level": "couple",
        "estimated_time": 8,
        "scoring_method": "dimension_based",
        "tags": ["disputes", "conflits", "désaccords", "tension"],
        "questions": [
            {
                "id": "q1",
                "text": "Comment se terminent généralement vos disputes à distance ?",
                "type": "multiple_choice",
                "dimension": "conflict_resolution",
                "answers": [
                    {
                        "text": "On en discute calmement et on trouve une solution",
                        "value": 5,
                        "dimension_score": {"conflict_resolution": 5, "communication": 5}
                    },
                    {
                        "text": "L'un de nous s'excuse et on passe à autre chose",
                        "value": 3,
                        "dimension_score": {"conflict_resolution": 3, "communication": 3}
                    },
                    {
                        "text": "On évite le sujet et on fait comme si de rien n'était",
                        "value": 1,
                        "dimension_score": {"conflict_resolution": 1, "communication": 1}
                    },
                    {
                        "text": "Ça prend du temps mais on finit par se réconcilier",
                        "value": 4,
                        "dimension_score": {"conflict_resolution": 4, "emotional_security": 3}
                    }
                ]
            },
            {
                "id": "q2",
                "text": "Pendant une dispute, arrives-tu à exprimer clairement tes émotions par message ?",
                "type": "scale",
                "dimension": "communication",
                "answers": [
                    {"text": "Très difficilement", "value": 1},
                    {"text": "Difficilement", "value": 2},
                    {"text": "Moyennement", "value": 3},
                    {"text": "Facilement", "value": 4},
                    {"text": "Très facilement", "value": 5}
                ]
            },
            {
                "id": "q3",
                "text": "Préfères-tu régler un conflit par message ou en appel ?",
                "type": "multiple_choice",
                "dimension": "communication",
                "answers": [
                    {
                        "text": "Par message, j'ai le temps de réfléchir",
                        "value": 3,
                        "dimension_score": {"communication": 3, "conflict_resolution": 3}
                    },
                    {
                        "text": "En appel, c'est plus direct et humain",
                        "value": 5,
                        "dimension_score": {"communication": 5, "conflict_resolution": 5}
                    },
                    {
                        "text": "Ça dépend de la gravité du conflit",
                        "value": 4,
                        "dimension_score": {"communication": 4, "conflict_resolution": 4}
                    }
                ],
                "partner_comparison": True
            },
            {
                "id": "q4",
                "text": "Combien de temps dure généralement une dispute entre vous ?",
                "type": "multiple_choice",
                "dimension": "conflict_resolution",
                "answers": [
                    {"text": "Quelques minutes, on règle vite", "value": 5},
                    {"text": "Quelques heures", "value": 4},
                    {"text": "Un jour ou deux", "value": 2},
                    {"text": "Plusieurs jours", "value": 1}
                ]
            },
            {
                "id": "q5",
                "text": "Qui fait généralement le premier pas après une dispute ?",
                "type": "multiple_choice",
                "dimension": "conflict_resolution",
                "answers": [
                    {
                        "text": "Toujours moi",
                        "value": 3,
                        "dimension_score": {"conflict_resolution": 3, "emotional_security": 4}
                    },
                    {
                        "text": "Toujours mon/ma partenaire",
                        "value": 3,
                        "dimension_score": {"conflict_resolution": 3, "trust": 4}
                    },
                    {
                        "text": "Ça dépend de qui a tort",
                        "value": 4,
                        "dimension_score": {"conflict_resolution": 4, "communication": 4}
                    },
                    {
                        "text": "On fait tous les deux l'effort",
                        "value": 5,
                        "dimension_score": {"conflict_resolution": 5, "communication": 5}
                    }
                ],
                "partner_comparison": True
            },
            {
                "id": "q6",
                "text": "La distance rend-elle les conflits plus difficiles à gérer ?",
                "type": "scale",
                "dimension": "conflict_resolution",
                "answers": [
                    {"text": "Beaucoup plus facile", "value": 5},
                    {"text": "Un peu plus facile", "value": 4},
                    {"text": "Aucune différence", "value": 3},
                    {"text": "Un peu plus difficile", "value": 2},
                    {"text": "Beaucoup plus difficile", "value": 1}
                ]
            },
            {
                "id": "q7",
                "text": "As-tu déjà bloqué ou ignoré ton/ta partenaire après une dispute ?",
                "type": "multiple_choice",
                "dimension": "conflict_resolution",
                "answers": [
                    {
                        "text": "Jamais, on communique toujours",
                        "value": 5,
                        "dimension_score": {"conflict_resolution": 5, "communication": 5}
                    },
                    {
                        "text": "Une ou deux fois dans un moment de colère",
                        "value": 2,
                        "dimension_score": {"conflict_resolution": 2, "emotional_security": 2}
                    },
                    {
                        "text": "Parfois, j'ai besoin de temps seul(e)",
                        "value": 3,
                        "dimension_score": {"conflict_resolution": 3, "independence": 4}
                    },
                    {
                        "text": "Souvent, c'est ma façon de gérer",
                        "value": 1,
                        "dimension_score": {"conflict_resolution": 1, "communication": 1}
                    }
                ]
            },
            {
                "id": "q8",
                "text": "Quels types de sujets causent le plus de conflits ?",
                "type": "multiple_choice",
                "dimension": "conflict_resolution",
                "answers": [
                    {"text": "La communication et le temps accordé", "value": 3},
                    {"text": "La jalousie et la confiance", "value": 2},
                    {"text": "Les projets d'avenir et la distance", "value": 3},
                    {"text": "Des malentendus par messages", "value": 3},
                    {"text": "On a rarement des conflits", "value": 5}
                ]
            },
            {
                "id": "q9",
                "text": "Après une dispute, avez-vous une discussion pour éviter que ça se reproduise ?",
                "type": "multiple_choice",
                "dimension": "conflict_resolution",
                "answers": [
                    {
                        "text": "Oui, toujours, on analyse ce qui s'est passé",
                        "value": 5,
                        "dimension_score": {"conflict_resolution": 5, "communication": 5}
                    },
                    {
                        "text": "Parfois, si c'était sérieux",
                        "value": 3,
                        "dimension_score": {"conflict_resolution": 3, "communication": 3}
                    },
                    {
                        "text": "Rarement, on préfère tourner la page",
                        "value": 2,
                        "dimension_score": {"conflict_resolution": 2, "communication": 2}
                    },
                    {
                        "text": "Jamais, on passe à autre chose",
                        "value": 1,
                        "dimension_score": {"conflict_resolution": 1, "communication": 1}
                    }
                ]
            },
            {
                "id": "q10",
                "text": "Les conflits renforcent-ils ou affaiblissent-ils votre relation ?",
                "type": "scale",
                "dimension": "conflict_resolution",
                "answers": [
                    {"text": "Renforcent beaucoup", "value": 5},
                    {"text": "Renforcent un peu", "value": 4},
                    {"text": "Aucun impact", "value": 3},
                    {"text": "Affaiblissent un peu", "value": 2},
                    {"text": "Affaiblissent beaucoup", "value": 1}
                ],
                "partner_comparison": True
            }
        ]
    },
    # Quiz 7 - Souvenirs communs (Fun)
    {
        "id": "quiz_007_souvenirs_communs",
        "theme_id": "theme_079",
        "title": "Souvenirs communs",
        "description": "Testez votre mémoire sur vos moments partagés",
        "category": "Fun & Légèreté",
        "theme_type": "fun",
        "difficulty": "easy",
        "premium_level": "free",
        "estimated_time": 6,
        "scoring_method": "fun",
        "tags": ["souvenirs", "mémoire", "passé", "nostalgie"],
        "partner_comparison": True,
        "questions": [
            {
                "id": "q1",
                "text": "Où vous êtes-vous rencontrés ?",
                "type": "multiple_choice",
                "dimension": "fun_connection",
                "answers": [
                    {"text": "En ligne (app, réseau social, jeu)", "value": 1},
                    {"text": "Par des amis communs", "value": 2},
                    {"text": "Au travail/études", "value": 3},
                    {"text": "Par hasard (voyage, événement)", "value": 4}
                ],
                "partner_comparison": True
            },
            {
                "id": "q2",
                "text": "Quelle est la date de votre premier message/rendez-vous ?",
                "type": "multiple_choice",
                "dimension": "fun_connection",
                "answers": [
                    {"text": "Je m'en souviens exactement", "value": 5},
                    {"text": "Je me souviens du mois et de l'année", "value": 4},
                    {"text": "Je me souviens de l'année seulement", "value": 3},
                    {"text": "Je ne m'en souviens plus vraiment", "value": 1}
                ],
                "partner_comparison": True
            },
            {
                "id": "q3",
                "text": "Qui a fait le premier pas ?",
                "type": "multiple_choice",
                "dimension": "fun_connection",
                "answers": [
                    {"text": "Moi, clairement", "value": 1},
                    {"text": "Mon/ma partenaire", "value": 2},
                    {"text": "Difficile à dire, c'était mutuel", "value": 3}
                ],
                "partner_comparison": True
            },
            {
                "id": "q4",
                "text": "Quel est votre premier souvenir ensemble ?",
                "type": "multiple_choice",
                "dimension": "fun_connection",
                "answers": [
                    {"text": "Je m'en souviens très bien", "value": 5},
                    {"text": "Je m'en souviens vaguement", "value": 3},
                    {"text": "Je ne m'en souviens plus", "value": 1}
                ],
                "partner_comparison": True
            },
            {
                "id": "q5",
                "text": "Quelle a été votre première dispute ?",
                "type": "multiple_choice",
                "dimension": "fun_connection",
                "answers": [
                    {"text": "Je me souviens exactement du sujet", "value": 5},
                    {"text": "Je me souviens qu'on s'est disputés mais pas du sujet", "value": 3},
                    {"text": "On ne s'est jamais vraiment disputés", "value": 4},
                    {"text": "Je ne m'en souviens pas", "value": 2}
                ]
            },
            {
                "id": "q6",
                "text": "Quel est votre moment préféré ensemble jusqu'à présent ?",
                "type": "multiple_choice",
                "dimension": "fun_connection",
                "answers": [
                    {"text": "Une visite/retrouvailles en personne", "value": 5},
                    {"text": "Un appel vidéo spécial", "value": 4},
                    {"text": "Un échange de messages marquant", "value": 3},
                    {"text": "Difficile de choisir, il y en a plusieurs", "value": 5}
                ]
            },
            {
                "id": "q7",
                "text": "Quelle chanson vous représente le mieux en tant que couple ?",
                "type": "multiple_choice",
                "dimension": "fun_connection",
                "answers": [
                    {"text": "On a une chanson officielle", "value": 5},
                    {"text": "Il y a plusieurs chansons qui nous rappellent à nous", "value": 4},
                    {"text": "On n'a pas vraiment de chanson", "value": 2}
                ],
                "partner_comparison": True
            },
            {
                "id": "q8",
                "text": "Combien de fois vous êtes-vous vus en personne ?",
                "type": "multiple_choice",
                "dimension": "fun_connection",
                "answers": [
                    {"text": "Jamais encore", "value": 1},
                    {"text": "Une fois", "value": 2},
                    {"text": "2-5 fois", "value": 3},
                    {"text": "Plus de 5 fois", "value": 4}
                ]
            },
            {
                "id": "q9",
                "text": "Quel est le surnom que tu donnes à ton/ta partenaire ?",
                "type": "multiple_choice",
                "dimension": "fun_connection",
                "answers": [
                    {"text": "On a plusieurs surnoms mignons", "value": 5},
                    {"text": "On a un surnom principal", "value": 4},
                    {"text": "On s'appelle par nos prénoms", "value": 3}
                ],
                "partner_comparison": True
            },
            {
                "id": "q10",
                "text": "Quelle est la chose la plus folle que vous ayez faite pour être ensemble ?",
                "type": "multiple_choice",
                "dimension": "fun_connection",
                "answers": [
                    {"text": "Un voyage imprévu/surprise", "value": 5},
                    {"text": "Changer nos plans pour se voir", "value": 4},
                    {"text": "Des horaires de sommeil complètement décalés", "value": 3},
                    {"text": "Rien de vraiment fou pour l'instant", "value": 2}
                ]
            }
        ]
    }
]

# Charger le fichier existant
with open('/home/user/aymen/chrome-extension/quiz/data/quizzes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Ajouter les nouveaux quiz
data['quizzes'].extend(additional_quizzes)
data['total_quizzes'] = len(data['quizzes'])

# Sauvegarder
with open('/home/user/aymen/chrome-extension/quiz/data/quizzes.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ {len(additional_quizzes)} quiz ajoutés. Total: {data['total_quizzes']}")
