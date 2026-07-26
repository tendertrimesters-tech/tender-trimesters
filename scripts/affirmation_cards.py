"""
Tender Trimesters — Affirmation Cards PDF
40 printable affirmation cards, one per pregnancy week.
Format: 4 cards per page (2x2 grid), designed to be printed and cut.
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register fonts
FONT_DIR = "/home/z/my-project/fonts"
pdfmetrics.registerFont(TTFont("Cormorant", os.path.join(FONT_DIR, "Cormorant-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Cormorant-Semi", os.path.join(FONT_DIR, "Cormorant-SemiBold.ttf")))
pdfmetrics.registerFont(TTFont("Cormorant-Bold", os.path.join(FONT_DIR, "Cormorant-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Montserrat", os.path.join(FONT_DIR, "Montserrat-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Montserrat-Med", os.path.join(FONT_DIR, "Montserrat-Medium.ttf")))
pdfmetrics.registerFont(TTFont("Montserrat-Semi", os.path.join(FONT_DIR, "Montserrat-SemiBold.ttf")))
pdfmetrics.registerFont(TTFont("Dancing", os.path.join(FONT_DIR, "DancingScript-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Dancing-Bold", os.path.join(FONT_DIR, "DancingScript-Bold.ttf")))

# Brand palette
CREAM = HexColor("#F5EFE0")
CREAM_DEEP = HexColor("#EDE4D1")
MOSS = HexColor("#6B7A5A")
MOSS_DEEP = HexColor("#3A4233")
TERRACOTTA = HexColor("#C97B5C")
BLUSH = HexColor("#FADADD")
BLUSH_DEEP = HexColor("#F4C2C2")
ROSE_GOLD = HexColor("#B76E79")
SAGE = HexColor("#CFE3DC")
BUTTER = HexColor("#FFF6E5")
LAVENDER = HexColor("#D9C2E6")
INK = HexColor("#2D2A24")

# 40 weeks of affirmation data — matching the app's seed data
WEEKS = [
    (1, "Poppy Seed", "My body knows exactly what to do."),
    (2, "Poppy Seed", "I trust the timing of my life."),
    (3, "Pinhead", "Something miraculous is unfolding inside me."),
    (4, "Sesame Seed", "I am ready for this journey."),
    (5, "Apple Seed", "Rest is productive. My body is doing important work."),
    (6, "Lentil", "Every wave of nausea is a sign my baby is growing."),
    (7, "Blueberry", "I am exactly the mother my baby needs."),
    (8, "Raspberry", "I am growing a life. That is enough."),
    (9, "Grape", "I release the need to control what I cannot."),
    (10, "Kumquat", "I trust my body to carry this pregnancy."),
    (11, "Lime", "The hardest part is almost over. I am strong."),
    (12, "Plum", "I have made it through the first trimester."),
    (13, "Lemon", "Welcome to the second trimester. I am ready."),
    (14, "Peach", "I am blooming into motherhood."),
    (15, "Apple", "My voice is the first sound my baby will know."),
    (16, "Avocado", "My changing body is beautiful."),
    (17, "Pear", "I am connected to my baby in ways I cannot see."),
    (18, "Bell Pepper", "I am documenting this season with love."),
    (19, "Mango", "Every mark on my body is a love letter to my baby."),
    (20, "Banana", "I am halfway to holding my baby."),
    (21, "Carrot", "I am nourishing my baby, body and soul."),
    (22, "Spaghetti Squash", "My touch is my baby's first language of love."),
    (23, "Grapefruit", "My worries are valid, and they are not in charge."),
    (24, "Corn Cob", "My baby is getting stronger every day."),
    (25, "Cauliflower", "I am preparing with intention."),
    (26, "Lettuce Head", "I am tuned in to my body's signals."),
    (27, "Cabbage", "Welcome to the third trimester. The final stretch."),
    (28, "Eggplant", "I trust my body to birth my baby."),
    (29, "Butternut Squash", "I am strong enough for this final stretch."),
    (30, "Cucumber", "I am creating a sanctuary for my baby."),
    (31, "Coconut", "My discomfort is temporary. My love is forever."),
    (32, "Jicama", "I am prepared for what's ahead."),
    (33, "Pineapple", "I am almost ready to meet my baby."),
    (34, "Cantaloupe", "Everything is falling into place."),
    (35, "Honeydew Melon", "I am savoring these final days of carrying my baby."),
    (36, "Papaya", "I am ready when my baby is ready."),
    (37, "Swiss Chard", "My baby will come when they are ready."),
    (38, "Leek", "I surrender to my baby's timing."),
    (39, "Mini Watermelon", "I trust my body completely."),
    (40, "Pumpkin", "Today could be the day. I am ready."),
]

# Card colors — alternate through brand palette
CARD_COLORS = [
    (BLUSH, ROSE_GOLD),       # week 1
    (SAGE, MOSS_DEEP),        # week 2
    (BUTTER, TERRACOTTA),     # week 3
    (LAVENDER, MOSS_DEEP),    # week 4
]

OUTPUT_PATH = "/home/z/my-project/download/affirmation-cards.pdf"

# Page setup: US Letter, landscape, 0.5" margins
PAGE_W, PAGE_H = letter
MARGIN = 0.5 * inch

def draw_cover(c):
    """Cover page"""
    c.setFillColor(MOSS_DEEP)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Decorative circles
    c.setFillColor(BLUSH)
    c.circle(PAGE_W * 0.15, PAGE_H * 0.85, 80, fill=1, stroke=0)
    c.setFillColor(SAGE)
    c.circle(PAGE_W * 0.85, PAGE_H * 0.15, 100, fill=1, stroke=0)

    # Title
    c.setFillColor(CREAM)
    c.setFont("Cormorant-Bold", 52)
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.62, "40 Weeks of")
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.54, "Affirmations")

    # Decorative line
    c.setStrokeColor(ROSE_GOLD)
    c.setLineWidth(1.5)
    c.line(PAGE_W * 0.35, PAGE_H * 0.48, PAGE_W * 0.65, PAGE_H * 0.48)

    # Subtitle
    c.setFont("Montserrat", 12)
    c.setFillColor(BLUSH)
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.43, "ONE CARD FOR EACH WEEK OF YOUR PREGNANCY")

    # Author
    c.setFont("Dancing", 32)
    c.setFillColor(CREAM)
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.32, "from Tender Trimesters")

    # Footer
    c.setFont("Montserrat", 9)
    c.setFillColor(CREAM)
    c.setFillAlpha(0.6)
    c.drawCentredString(PAGE_W / 2, 0.4 * inch, "by Mommies Matter  ·  Made with love, mama")
    c.setFillAlpha(1)

def draw_card(c, x, y, w, h, week_num, baby_size, affirmation, bg_color, accent_color):
    """Draw a single affirmation card at the given position."""
    # Card background
    c.setFillColor(bg_color)
    c.roundRect(x, y, w, h, 12, fill=1, stroke=0)

    # Decorative accent line at top
    c.setStrokeColor(accent_color)
    c.setLineWidth(2)
    c.line(x + w * 0.25, y + h - 30, x + w * 0.75, y + h - 30)

    # Week label
    c.setFillColor(accent_color)
    c.setFont("Montserrat", 8)
    c.drawCentredString(x + w / 2, y + h - 22, "WEEK")

    c.setFont("Cormorant-Bold", 36)
    c.drawCentredString(x + w / 2, y + h - 65, str(week_num))

    # Baby size label
    c.setFillColor(INK)
    c.setFont("Montserrat", 9)
    c.drawCentredString(x + w / 2, y + h * 0.55, f"Baby is the size of a")

    c.setFont("Cormorant-Semi", 18)
    c.drawCentredString(x + w / 2, y + h * 0.48, baby_size)

    # Decorative divider
    c.setStrokeColor(accent_color)
    c.setLineWidth(0.5)
    c.line(x + w * 0.35, y + h * 0.40, x + w * 0.65, y + h * 0.40)

    # Affirmation (handwritten style)
    c.setFillColor(MOSS_DEEP)
    c.setFont("Dancing", 16)
    # Word wrap
    words = affirmation.split()
    lines = []
    line = ""
    for word in words:
        test = (line + " " + word).strip()
        if c.stringWidth(test, "Dancing", 16) > w - 50:
            lines.append(line)
            line = word
        else:
            line = test
    if line:
        lines.append(line)

    line_height = 22
    total_h = len(lines) * line_height
    start_y = y + h * 0.30 + (total_h / 2)
    for i, line in enumerate(lines):
        c.drawCentredString(x + w / 2, start_y - i * line_height, line)

    # Brand footer
    c.setFillColor(accent_color)
    c.setFont("Montserrat", 7)
    c.setFillAlpha(0.7)
    c.drawCentredString(x + w / 2, y + 18, "TENDER TRIMESTERS")
    c.setFillAlpha(1)

def draw_back_page(c):
    """Back page with cut instructions + CTA"""
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Title
    c.setFillColor(MOSS_DEEP)
    c.setFont("Cormorant-Bold", 36)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 1.5 * inch, "How to use these cards")

    # Decorative line
    c.setStrokeColor(ROSE_GOLD)
    c.setLineWidth(1.5)
    c.line(PAGE_W * 0.4, PAGE_H - 1.7 * inch, PAGE_W * 0.6, PAGE_H - 1.7 * inch)

    # Instructions
    instructions = [
        ("Print this PDF on heavy cardstock (80-100 lb) for the best feel.", MOSS_DEEP, 11),
        ("Cut along the grid lines to separate each card.", MOSS_DEEP, 11),
        ("Pull the card for your current week each Sunday.", MOSS_DEEP, 11),
        ("Pin it to your mirror, tape it to your fridge, or tuck it", MOSS_DEEP, 11),
        ("in your wallet — wherever you'll see it daily.", MOSS_DEEP, 11),
        ("Read it out loud. Let it sink in. Repeat as needed.", MOSS_DEEP, 11),
    ]
    y = PAGE_H - 2.3 * inch
    for text, color, size in instructions:
        c.setFillColor(color)
        c.setFont("Montserrat", size)
        c.drawCentredString(PAGE_W / 2, y, text)
        y -= 22

    # Handwritten affirmation
    y -= 30
    c.setFillColor(ROSE_GOLD)
    c.setFont("Dancing", 32)
    c.drawCentredString(PAGE_W / 2, y, "you've got this, mama")

    # CTA box
    c.setFillColor(BLUSH)
    c.roundRect(PAGE_W * 0.2, 2 * inch, PAGE_W * 0.6, 1.4 * inch, 12, fill=1, stroke=0)
    c.setFillColor(MOSS_DEEP)
    c.setFont("Cormorant-Bold", 18)
    c.drawCentredString(PAGE_W / 2, 3 * inch, "Carry these with you everywhere.")

    c.setFont("Montserrat", 10)
    c.drawCentredString(PAGE_W / 2, 2.7 * inch, "Download the Tender Trimesters app for the full")
    c.drawCentredString(PAGE_W / 2, 2.5 * inch, "40-week journey — Tempie AI companion, journal, and more.")

    # Footer
    c.setFillColor(MOSS_DEEP)
    c.setFont("Montserrat", 8)
    c.setFillAlpha(0.6)
    c.drawCentredString(PAGE_W / 2, 0.5 * inch, "Tender Trimesters  ·  by Mommies Matter  ·  Made with love")
    c.setFillAlpha(1)

def main():
    c = canvas.Canvas(OUTPUT_PATH, pagesize=letter)
    c.setTitle("40 Weeks of Affirmations — Tender Trimesters")
    c.setAuthor("Mommies Matter")
    c.setSubject("Pregnancy affirmation cards, one per week")
    c.setCreator("Tender Trimesters")

    # Cover
    draw_cover(c)
    c.showPage()

    # Card pages — 4 cards per page (2x2 grid)
    # Each card is 3.5" wide x 4.5" tall on a letter-sized page
    card_w = 3.5 * inch
    card_h = 4.5 * inch
    gap_x = 0.25 * inch
    gap_y = 0.25 * inch
    start_x = (PAGE_W - (2 * card_w + gap_x)) / 2
    start_y = (PAGE_H - (2 * card_h + gap_y)) / 2

    for i in range(0, 40, 4):
        page_weeks = WEEKS[i:i+4]
        for j, (week, size, aff) in enumerate(page_weeks):
            row = j // 2
            col = j % 2
            x = start_x + col * (card_w + gap_x)
            y = start_y + (1 - row) * (card_h + gap_y)  # top row first
            color_idx = (week - 1) % 4
            bg, accent = CARD_COLORS[color_idx]
            draw_card(c, x, y, card_w, card_h, week, size, aff, bg, accent)
        c.showPage()

    # Back page
    draw_back_page(c)
    c.showPage()

    c.save()
    print(f"Generated: {OUTPUT_PATH}")
    print(f"  Pages: cover + 10 card pages (4 cards each) + back = 12 pages")
    print(f"  Cards: 40")

if __name__ == "__main__":
    main()
