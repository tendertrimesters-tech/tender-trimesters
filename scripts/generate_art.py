from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os, math, random

random.seed(42)
OUT = '/home/z/my-project/public/images'
os.makedirs(OUT, exist_ok=True)

def watercolor_bg(w, h, base):
    img = Image.new('RGBA', (w, h), base)
    return img

def soft_ellipse(draw, cx, cy, rx, ry, color, alpha=80):
    for i in range(3):
        offset = i * 4
        a = max(20, alpha - i * 20)
        c = color + (a,)
        draw.ellipse([cx-rx-offset, cy-ry-offset, cx+rx+offset, cy+ry+offset], fill=c)

def soft_circle(draw, cx, cy, r, color, alpha=100):
    for i in range(3):
        offset = i * 3
        a = max(20, alpha - i * 25)
        c = color + (a,)
        draw.ellipse([cx-r-offset, cy-r-offset, cx+r+offset, cy+r+offset], fill=c)

def wavy_line(draw, x1, y1, x2, y2, color, alpha=60, width=3):
    points = []
    steps = 20
    for i in range(steps + 1):
        t = i / steps
        x = x1 + (x2 - x1) * t
        y = y1 + (y2 - y1) * t + math.sin(t * math.pi * 3) * 8
        points.append((x, y))
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill=color + (alpha,), width=width)

def finalize(img, blur=6, gamma=1.1):
    img = img.filter(ImageFilter.GaussianBlur(blur))
    # Simple brightness boost
    enhancer = Image.new('RGBA', img.size, (255, 255, 255, 0))
    img = Image.blend(img, enhancer, 0.05)
    return img

# Color palette
CREAM = (246, 237, 218)
MOSS = (107, 143, 91)
MOSS_DEEP = (61, 90, 50)
SAGE = (152, 204, 148)
BLUSH = (240, 160, 172)
ROSE = (190, 80, 104)
LAVENDER = (190, 144, 220)
BUTTER = (255, 226, 176)
TERRA = (202, 92, 54)

def draw_leaf(draw, cx, cy, size, angle, color):
    points = []
    for t in range(101):
        tt = t / 100.0
        r = size * math.sin(tt * math.pi) * (1 - 0.3 * tt)
        x = cx + r * math.cos(angle + tt * 2)
        y = cy + r * math.sin(angle + tt * 2)
        points.append((x, y))
    if len(points) > 2:
        draw.polygon(points, fill=color + (70,))

def draw_petals(draw, cx, cy, r, count, color1, color2, center_color):
    for i in range(count):
        angle = (2 * math.pi / count) * i
        px = cx + r * 0.6 * math.cos(angle)
        py = cy + r * 0.6 * math.sin(angle)
        soft_circle(draw, int(px), int(py), int(r * 0.45), color1, 70)
    soft_circle(draw, cx, cy, int(r * 0.3), center_color, 120)
    soft_circle(draw, cx, cy, int(r * 0.15), color2, 100)

# ─── HERO ───
img = watercolor_bg(800, 500, CREAM + (255,))
draw = ImageDraw.Draw(img)
soft_ellipse(draw, 650, 250, 200, 180, SAGE, 50)
soft_ellipse(draw, 620, 230, 150, 140, MOSS, 40)
soft_ellipse(draw, 180, 320, 70, 100, BLUSH, 60)
soft_ellipse(draw, 160, 300, 50, 80, ROSE, 50)
draw_petals(draw, 380, 180, 50, 6, BLUSH, BUTTER, ROSE)
soft_ellipse(draw, 500, 400, 100, 40, MOSS, 30)
soft_ellipse(draw, 100, 420, 80, 35, SAGE, 35)
draw_leaf(draw, 120, 350, 80, 0.5, MOSS)
draw_leaf(draw, 140, 330, 60, 0.8, SAGE)
for _ in range(8):
    x, y = random.randint(50, 750), random.randint(50, 450)
    r = random.randint(3, 8)
    c = random.choice([LAVENDER, BLUSH, BUTTER])
    soft_circle(draw, x, y, r, c, 50)
img = finalize(img, 8)
img = img.convert('RGB')
img.save(f'{OUT}/hero.webp', 'webp', quality=85)
print('Created hero.webp')

# ─── MEDITATION ───
img = watercolor_bg(600, 400, (253, 249, 240, 255))
draw = ImageDraw.Draw(img)
soft_ellipse(draw, 300, 220, 220, 150, LAVENDER, 40)
soft_ellipse(draw, 300, 210, 160, 110, BLUSH, 35)
soft_ellipse(draw, 300, 200, 100, 70, BUTTER, 40)
soft_ellipse(draw, 120, 350, 70, 30, SAGE, 40)
soft_ellipse(draw, 480, 360, 60, 25, MOSS, 35)
for i in range(5):
    x = 100 + i * 100
    y = 60 + (i % 2) * 40
    soft_circle(draw, x, y, random.randint(4, 8), ROSE, 40)
img = finalize(img, 6)
img = img.convert('RGB')
img.save(f'{OUT}/meditation.webp', 'webp', quality=85)
print('Created meditation.webp')

# ─── JOURNAL ───
img = watercolor_bg(600, 400, CREAM + (255,))
draw = ImageDraw.Draw(img)
# Open book shape
soft_ellipse(draw, 300, 200, 200, 130, (240, 232, 208), 80)
soft_ellipse(draw, 300, 200, 160, 100, (255, 255, 255), 90)
# Flowers around
draw_petals(draw, 480, 100, 35, 5, BLUSH, BUTTER, ROSE)
draw_petals(draw, 120, 100, 30, 6, LAVENDER, BUTTER, ROSE)
soft_ellipse(draw, 500, 340, 60, 35, SAGE, 40)
soft_ellipse(draw, 100, 350, 55, 30, MOSS, 35)
draw_leaf(draw, 510, 330, 50, 0.3, MOSS)
draw_leaf(draw, 90, 340, 45, -0.3, SAGE)
for _ in range(6):
    soft_circle(draw, random.randint(50, 550), random.randint(50, 350), random.randint(2, 5), random.choice([LAVENDER, BUTTER]), 40)
img = finalize(img, 5)
img = img.convert('RGB')
img.save(f'{OUT}/journal.webp', 'webp', quality=85)
print('Created journal.webp')

# ─── LETTERS ───
img = watercolor_bg(600, 400, (253, 249, 240, 255))
draw = ImageDraw.Draw(img)
# Envelope
soft_ellipse(draw, 300, 220, 150, 100, (240, 232, 208), 70)
soft_ellipse(draw, 300, 220, 120, 80, (255, 255, 255), 80)
# Heart on envelope
hx, hy = 300, 210
for dx, dy, r in [(-12, -5, 18), (12, -5, 18), (0, 8, 15)]:
    soft_circle(draw, hx+dx, hy+dy, r, BLUSH, 70)
soft_circle(draw, hx, hy, 10, ROSE, 90)
# Flowers
soft_ellipse(draw, 500, 340, 50, 30, SAGE, 40)
soft_circle(draw, 100, 90, 18, LAVENDER, 60)
soft_circle(draw, 85, 110, 14, LAVENDER, 50)
img = finalize(img, 5)
img = img.convert('RGB')
img.save(f'{OUT}/letters.webp', 'webp', quality=85)
print('Created letters.webp')

# ─── FEAR TO FLAME ───
img = watercolor_bg(600, 400, CREAM + (255,))
draw = ImageDraw.Draw(img)
# Left: fear (cool)
soft_ellipse(draw, 180, 220, 100, 130, BLUSH, 50)
soft_ellipse(draw, 180, 220, 70, 90, (200, 200, 220), 40)
soft_ellipse(draw, 180, 220, 35, 45, (255, 255, 255), 60)
# Right: flame (warm)
soft_ellipse(draw, 420, 220, 90, 120, TERRA, 55)
soft_ellipse(draw, 420, 220, 55, 75, BLUSH, 45)
soft_ellipse(draw, 420, 220, 25, 35, BUTTER, 70)
# Connecting vine
draw_leaf(draw, 280, 360, 50, 0.2, MOSS)
draw_leaf(draw, 300, 350, 40, 0.5, SAGE)
img = finalize(img, 6)
img = img.convert('RGB')
img.save(f'{OUT}/fear.webp', 'webp', quality=85)
print('Created fear.webp')

# ─── BELLY BONDING ───
img = watercolor_bg(600, 400, (253, 249, 240, 255))
draw = ImageDraw.Draw(img)
soft_ellipse(draw, 300, 260, 130, 110, BLUSH, 50)
soft_ellipse(draw, 300, 260, 90, 75, BUTTER, 45)
soft_ellipse(draw, 300, 220, 50, 60, BLUSH, 55)
soft_circle(draw, 300, 200, 25, ROSE, 60)
draw_leaf(draw, 180, 170, 55, 0.6, MOSS)
draw_leaf(draw, 420, 160, 50, -0.5, SAGE)
for i in range(4):
    soft_circle(draw, 80 + i * 140, 80 + (i%2)*30, 8, LAVENDER, 40)
img = finalize(img, 6)
img = img.convert('RGB')
img.save(f'{OUT}/belly.webp', 'webp', quality=85)
print('Created belly.webp')

# ─── NAME GARDEN ───
img = watercolor_bg(600, 400, CREAM + (255,))
draw = ImageDraw.Draw(img)
soft_ellipse(draw, 300, 340, 250, 80, SAGE, 40)
soft_ellipse(draw, 300, 340, 180, 55, MOSS, 35)
draw_petals(draw, 150, 180, 35, 5, BLUSH, ROSE, BUTTER)
draw_petals(draw, 300, 140, 32, 6, LAVENDER, BLUSH, BUTTER)
draw_petals(draw, 450, 170, 30, 5, TERRA, BUTTER, ROSE)
for cx, cy in [(150, 240), (300, 220), (450, 230)]:
    wavy_line(draw, cx, cy + 20, cx + 5, 340, MOSS, 40, 2)
img = finalize(img, 5)
img = img.convert('RGB')
img.save(f'{OUT}/garden.webp', 'webp', quality=85)
print('Created garden.webp')

# ─── DREAM KEEPER ───
img = watercolor_bg(600, 400, (42, 38, 24, 255))
draw = ImageDraw.Draw(img)
soft_circle(draw, 300, 180, 80, BUTTER, 60)
soft_circle(draw, 340, 160, 65, (42, 38, 24), 200)
for _ in range(15):
    x, y = random.randint(20, 580), random.randint(20, 380)
    r = random.randint(2, 5)
    c = random.choice([LAVENDER, BUTTER])
    soft_circle(draw, x, y, r, c, 70)
draw_petals(draw, 400, 330, 30, 5, BLUSH, LAVENDER, BUTTER)
img = finalize(img, 4)
img = img.convert('RGB')
img.save(f'{OUT}/dreams.webp', 'webp', quality=85)
print('Created dreams.webp')

# ─── MOTHER STORY ───
img = watercolor_bg(600, 400, CREAM + (255,))
draw = ImageDraw.Draw(img)
soft_ellipse(draw, 200, 260, 75, 100, BLUSH, 50)
soft_ellipse(draw, 200, 230, 45, 55, ROSE, 45)
soft_ellipse(draw, 420, 240, 65, 90, BLUSH, 45)
soft_ellipse(draw, 420, 210, 40, 50, ROSE, 40)
# Baby between them
soft_circle(draw, 310, 230, 20, BUTTER, 70)
# Connecting vine
draw_leaf(draw, 290, 330, 45, 0.3, MOSS)
draw_leaf(draw, 305, 320, 35, 0.6, SAGE)
img = finalize(img, 6)
img = img.convert('RGB')
img.save(f'{OUT}/mother.webp', 'webp', quality=85)
print('Created mother.webp')

# ─── TIME CAPSULE ───
img = watercolor_bg(600, 400, CREAM + (255,))
draw = ImageDraw.Draw(img)
soft_ellipse(draw, 300, 210, 90, 120, (232, 212, 168), 70)
soft_ellipse(draw, 300, 210, 70, 100, (240, 232, 208), 80)
soft_ellipse(draw, 300, 210, 40, 55, BUTTER, 60)
soft_circle(draw, 300, 200, 20, LAVENDER, 70)
soft_ellipse(draw, 140, 350, 60, 30, SAGE, 35)
soft_ellipse(draw, 470, 350, 55, 28, MOSS, 30)
img = finalize(img, 5)
img = img.convert('RGB')
img.save(f'{OUT}/capsule.webp', 'webp', quality=85)
print('Created capsule.webp')

# ─── PLAYLIST ───
img = watercolor_bg(600, 400, (253, 249, 240, 255))
draw = ImageDraw.Draw(img)
# Musical notes as colorful blobs
for cx, cy, r, c in [(150, 180, 45, BLUSH), (300, 150, 40, LAVENDER), (450, 200, 38, SAGE)]:
    soft_circle(draw, cx, cy, r, c, 60)
    soft_circle(draw, cx, cy, r//2, ROSE if c == BLUSH else (TERRA if c == SAGE else ROSE), 50)
soft_circle(draw, 130, 310, 22, BLUSH, 50)
soft_circle(draw, 130, 310, 12, ROSE, 60)
draw_leaf(draw, 470, 340, 40, 0.4, MOSS)
img = finalize(img, 5)
img = img.convert('RGB')
img.save(f'{OUT}/playlist.webp', 'webp', quality=85)
print('Created playlist.webp')

# ─── HORMONE HOROSCOPE ───
img = watercolor_bg(600, 400, (253, 249, 240, 255))
draw = ImageDraw.Draw(img)
soft_ellipse(draw, 300, 200, 160, 160, LAVENDER, 40)
soft_ellipse(draw, 300, 200, 120, 120, BLUSH, 35)
soft_ellipse(draw, 300, 200, 75, 75, BUTTER, 40)
soft_circle(draw, 300, 200, 28, ROSE, 70)
for _ in range(10):
    x, y = random.randint(40, 560), random.randint(30, 370)
    soft_circle(draw, x, y, random.randint(3, 7), random.choice([MOSS, TERRA, LAVENDER, BLUSH]), 50)
img = finalize(img, 6)
img = img.convert('RGB')
img.save(f'{OUT}/hormone.webp', 'webp', quality=85)
print('Created hormone.webp')

# ─── COMMUNITY ───
img = watercolor_bg(600, 400, CREAM + (255,))
draw = ImageDraw.Draw(img)
soft_ellipse(draw, 300, 340, 250, 80, SAGE, 35)
soft_ellipse(draw, 300, 340, 180, 55, MOSS, 30)
for cx, cy in [(150, 180), (300, 140), (450, 180)]:
    soft_circle(draw, cx, cy, 35, BLUSH, 60)
    soft_circle(draw, cx, cy - 15, 20, ROSE, 50)
# Connection lines
for pairs in [((185, 170), (265, 150)), ((335, 150), (415, 170)), ((170, 200), (300, 170)), ((430, 200), (300, 170))]:
    wavy_line(draw, *pairs[0], *pairs[1], BUTTER, 35, 2)
img = finalize(img, 6)
img = img.convert('RGB')
img.save(f'{OUT}/community.webp', 'webp', quality=85)
print('Created community.webp')

# ─── BUMP PHOTOS ───
img = watercolor_bg(600, 400, CREAM + (255,))
draw = ImageDraw.Draw(img)
soft_ellipse(draw, 300, 200, 110, 110, (232, 212, 168), 70)
soft_ellipse(draw, 300, 200, 85, 85, (240, 232, 208), 80)
soft_circle(draw, 300, 200, 45, BLUSH, 55)
soft_circle(draw, 300, 200, 25, ROSE, 60)
soft_circle(draw, 300, 200, 10, BUTTER, 70)
soft_ellipse(draw, 490, 140, 35, 25, SAGE, 40)
soft_circle(draw, 110, 110, 18, LAVENDER, 50)
img = finalize(img, 5)
img = img.convert('RGB')
img.save(f'{OUT}/bump.webp', 'webp', quality=85)
print('Created bump.webp')

print('\nAll illustrations created!')