#!/usr/bin/env python3
"""Génère des icônes PNG simples pour l'extension Chrome"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    """Crée une icône carrée avec un fond vert et le texte 'WF'"""
    # Créer une image avec fond vert
    img = Image.new('RGB', (size, size), color='#10B981')
    draw = ImageDraw.Draw(img)

    # Dessiner un cercle blanc au centre
    circle_margin = size // 8
    draw.ellipse(
        [circle_margin, circle_margin, size - circle_margin, size - circle_margin],
        fill='white'
    )

    # Ajouter le texte "WF" (Winner Finder)
    try:
        # Essayer d'utiliser une police système
        font_size = size // 2
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        # Fallback sur la police par défaut
        font = ImageFont.load_default()

    text = "WF"
    # Centrer le texte
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((size - text_width) // 2, (size - text_height) // 2 - size // 10)

    draw.text(position, text, fill='#10B981', font=font)

    # Sauvegarder
    img.save(output_path, 'PNG')
    print(f"✅ Créé : {output_path} ({size}x{size})")

def main():
    """Génère toutes les icônes requises"""
    sizes = [16, 32, 48, 128]

    script_dir = os.path.dirname(os.path.abspath(__file__))

    for size in sizes:
        output_path = os.path.join(script_dir, f'icon{size}.png')
        create_icon(size, output_path)

    print("\n🎉 Toutes les icônes ont été générées avec succès !")

if __name__ == '__main__':
    main()
