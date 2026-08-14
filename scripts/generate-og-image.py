'''Generate OG image (1200x630) and favicon for Tender Trimesters using brand palette.'''
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np
from PIL import Image
import io

# Register fonts
fm.fontManager.addfont('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')
fm.fontManager.addfont('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
plt.rcParams['font.sans-serif'] = ['Noto Sans SC', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

# Brand colors
MOSS = '#6B7A5A'
CREAM = '#F5EFE0'
BLUSH = '#FADADD'
ROSE_GOLD = '#B76E79'
MOSS_DEEP = '#4A5A3A'

# === OG Image (1200x630) ===
fig, ax = plt.subplots(1, 1, figsize=(12, 6.3), dpi=100)
ax.set_xlim(0, 1200)
ax.set_ylim(0, 630)
ax.axis('off')
fig.patch.set_facecolor(CREAM)
ax.set_facecolor(CREAM)

# Left side moss panel (0-450)
rect_left = plt.Rectangle((0, 0), 450, 630, facecolor=MOSS, edgecolor='none')
ax.add_patch(rect_left)

# Subtle circle decorations
for cx, cy, r, alpha in [(350, 500, 120, 0.15), (100, 130, 80, 0.1), (380, 100, 60, 0.08)]:
    circle = plt.Circle((cx, cy), r, facecolor='white', edgecolor='none', alpha=alpha)
    ax.add_patch(circle)

# Brand name on left panel
ax.text(225, 400, 'TENDER', fontsize=38, fontweight='bold', color=CREAM,
        ha='center', va='center', fontfamily='DejaVu Sans')
ax.text(225, 350, 'TRIMESTERS', fontsize=38, fontweight='bold', color=CREAM,
        ha='center', va='center', fontfamily='DejaVu Sans')
ax.text(225, 290, 'by Mommies Matter', fontsize=14, color=BLUSH,
        ha='center', va='center', fontfamily='DejaVu Sans', style='italic')

# Right side — tagline
ax.text(700, 370, 'Your pregnancy,', fontsize=32, color=MOSS_DEEP,
        ha='center', va='center', fontweight='bold')
ax.text(700, 310, 'one week at a time.', fontsize=32, color=ROSE_GOLD,
        ha='center', va='center', fontweight='bold')

# Subtle blush accent bar
rect_bar = plt.Rectangle((480, 420), 440, 4, facecolor=BLUSH, edgecolor='none', alpha=0.6)
ax.add_patch(rect_bar)

# Bottom blush strip
rect_bottom = plt.Rectangle((450, 0), 750, 50, facecolor=BLUSH, edgecolor='none', alpha=0.3)
ax.add_patch(rect_bottom)

fig.tight_layout(pad=0)
fig.savefig('/home/z/my-project/public/og-image.png', dpi=100, bbox_inches='tight',
            facecolor=fig.get_facecolor(), edgecolor='none', pad_inches=0)
plt.close(fig)
print('OG image saved')

# === Favicon (32x32 and 180x180 apple icon) ===
fig2, ax2 = plt.subplots(1, 1, figsize=(1.8, 1.8), dpi=100)
ax2.set_xlim(0, 180)
ax2.set_ylim(0, 180)
ax2.axis('off')
fig2.patch.set_facecolor(MOSS)
ax2.set_facecolor(MOSS)

# Circle background
circle_bg = plt.Circle((90, 90), 85, facecolor=MOSS, edgecolor='none')
ax2.add_patch(circle_bg)

# "T" letter
ax2.text(90, 95, 'T', fontsize=80, fontweight='bold', color=CREAM,
        ha='center', va='center', fontfamily='DejaVu Sans')

fig2.tight_layout(pad=0)
fig2.savefig('/home/z/my-project/public/apple-icon.png', dpi=100, bbox_inches='tight',
             facecolor=fig2.get_facecolor(), edgecolor='none', pad_inches=0)
plt.close(fig2)

# Copy as favicon.ico (using PIL to convert PNG to ICO)
img = Image.open('/home/z/my-project/public/apple-icon.png')
img = img.resize((32, 32), Image.Resampling.LANCZOS)
img.save('/home/z/my-project/public/favicon.ico', format='ICO')
print('Favicon + apple-icon saved')
