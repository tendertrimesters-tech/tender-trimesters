"""
Tender Trimesters — First Trimester Survival Kit (Lead Magnet PDF)
Beautiful brand-aligned checklist for email capture.
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
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

OUTPUT_PATH = "/home/z/my-project/download/first-trimester-checklist.pdf"

# Page setup
PAGE_W, PAGE_H = letter
MARGIN = 0.75 * inch

def draw_cover(c):
    """Cover page"""
    # Background gradient effect with rectangles
    c.setFillColor(MOSS_DEEP)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Decorative circles
    c.setFillColor(BLUSH)
    c.setFillAlpha(0.4)
    c.circle(PAGE_W * 0.2, PAGE_H * 0.85, 100, fill=1, stroke=0)
    c.setFillColor(SAGE)
    c.setFillAlpha(0.3)
    c.circle(PAGE_W * 0.85, PAGE_H * 0.2, 130, fill=1, stroke=0)
    c.setFillAlpha(1)

    # Top tag
    c.setFillColor(BLUSH)
    c.setFont("Montserrat-Semi", 10)
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.75, "TENDER TRIMESTERS  ·  LEAD MAGNET")
    c.setFillColor(CREAM)

    # Title
    c.setFont("Cormorant-Bold", 56)
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.62, "Your First")
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.55, "Trimester")
    c.setFillColor(BLUSH)
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.47, "Survival Kit")

    # Decorative line
    c.setStrokeColor(ROSE_GOLD)
    c.setLineWidth(1.5)
    c.line(PAGE_W * 0.35, PAGE_H * 0.41, PAGE_W * 0.65, PAGE_H * 0.41)

    # Subtitle
    c.setFont("Montserrat", 12)
    c.setFillColor(CREAM)
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.36, "A gentle, practical guide for weeks 1–13.")
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.33, "Made for the mama who wants to feel held, not overwhelmed.")

    # Handwritten
    c.setFont("Dancing-Bold", 32)
    c.setFillColor(BLUSH)
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.22, "you've got this, mama")

    # Author footer
    c.setFont("Montserrat", 9)
    c.setFillColor(CREAM)
    c.setFillAlpha(0.7)
    c.drawCentredString(PAGE_W / 2, 0.6 * inch, "by Helena-Ann Baker  ·  Mommies Matter  ·  Tender Trimesters")
    c.setFillAlpha(1)

    c.showPage()

def draw_intro_page(c):
    """Intro page with welcome from Helena-Ann"""
    # Background
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Decorative top bar
    c.setFillColor(MOSS)
    c.rect(0, PAGE_H - 0.4 * inch, PAGE_W, 0.4 * inch, fill=1, stroke=0)

    # Title
    c.setFillColor(MOSS_DEEP)
    c.setFont("Cormorant-Bold", 32)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 1.2 * inch, "Welcome, mama.")

    # Decorative line
    c.setStrokeColor(ROSE_GOLD)
    c.setLineWidth(1)
    c.line(PAGE_W * 0.42, PAGE_H - 1.4 * inch, PAGE_W * 0.58, PAGE_H - 1.4 * inch)

    # Welcome letter
    intro_text = [
        "If you're reading this, you're either holding a positive test, hoping for one,",
        "or quietly supporting someone who is. Either way — welcome.",
        "",
        "The first trimester is a strange and tender season. Your body is doing the most",
        "extraordinary work of your life, and yet most days you feel like you're just",
        "trying to survive. Tired. Nauseous. Maybe anxious. Maybe overjoyed. Often all",
        "of those things before lunch.",
        "",
        "I wrote this guide because when I was pregnant with my son Tatum, I needed",
        "someone to tell me what to actually do. Not the textbook version. The real",
        "version. The one that says: eat the saltines, take the nap, call your OB when",
        "you're worried, and trust that you are not alone in this.",
        "",
        "This is your survival kit. Print it. Check things off. Cross things out. Write",
        "in the margins. This is yours.",
        "",
        "With love,",
    ]
    y = PAGE_H - 1.9 * inch
    for line in intro_text:
        c.setFillColor(INK)
        c.setFont("Montserrat", 11)
        c.drawCentredString(PAGE_W / 2, y, line)
        y -= 18

    # Signature
    c.setFillColor(ROSE_GOLD)
    c.setFont("Dancing-Bold", 28)
    c.drawCentredString(PAGE_W / 2, y - 10, "Helena-Ann")

    c.showPage()

def draw_section_page(c, section_title, section_subtitle, items, bg_color, accent_color, page_num):
    """A checklist page"""
    # Background
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Top accent bar
    c.setFillColor(accent_color)
    c.rect(0, PAGE_H - 0.3 * inch, PAGE_W, 0.3 * inch, fill=1, stroke=0)

    # Section header card
    c.setFillColor(bg_color)
    c.roundRect(MARGIN, PAGE_H - 1.8 * inch, PAGE_W - 2 * MARGIN, 1.2 * inch, 16, fill=1, stroke=0)

    # Section number
    c.setFillColor(accent_color)
    c.setFont("Montserrat-Semi", 10)
    c.drawString(MARGIN + 0.4 * inch, PAGE_H - 0.95 * inch, f"SECTION {page_num}")

    # Title
    c.setFillColor(MOSS_DEEP)
    c.setFont("Cormorant-Bold", 28)
    c.drawString(MARGIN + 0.4 * inch, PAGE_H - 1.35 * inch, section_title)

    # Subtitle
    c.setFillColor(MOSS)
    c.setFont("Montserrat", 10)
    c.drawString(MARGIN + 0.4 * inch, PAGE_H - 1.6 * inch, section_subtitle)

    # Checklist items
    y = PAGE_H - 2.3 * inch
    for item in items:
        # Checkbox
        c.setStrokeColor(accent_color)
        c.setLineWidth(1.5)
        c.roundRect(MARGIN + 0.2 * inch, y - 2, 16, 16, 3, fill=0, stroke=1)

        # Item text (with word wrap)
        c.setFillColor(INK)
        c.setFont("Montserrat", 11)
        words = item.split()
        line = ""
        lines = []
        for word in words:
            test = (line + " " + word).strip()
            if c.stringWidth(test, "Montserrat", 11) > PAGE_W - 2 * MARGIN - 60:
                lines.append(line)
                line = word
            else:
                line = test
        if line:
            lines.append(line)

        for i, l in enumerate(lines):
            c.drawString(MARGIN + 0.55 * inch, y + 10 - i * 14, l)
        y -= max(28, len(lines) * 14 + 10)

    # Page number
    c.setFillColor(MOSS)
    c.setFont("Montserrat", 9)
    c.setFillAlpha(0.6)
    c.drawCentredString(PAGE_W / 2, 0.4 * inch, f"— {page_num} —")
    c.setFillAlpha(1)

    c.showPage()

def draw_tempie_tips_page(c):
    """Tempie's Tips callout page"""
    c.setFillColor(MOSS_DEEP)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Decorative
    c.setFillColor(BLUSH)
    c.setFillAlpha(0.3)
    c.circle(PAGE_W * 0.15, PAGE_H * 0.15, 100, fill=1, stroke=0)
    c.setFillAlpha(1)

    # Section tag
    c.setFillColor(BLUSH)
    c.setFont("Montserrat-Semi", 10)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 1 * inch, "A NOTE FROM YOUR AI COMPANION")

    # Title
    c.setFillColor(CREAM)
    c.setFont("Cormorant-Bold", 40)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 1.7 * inch, "Tempie's Tips")

    # Decorative line
    c.setStrokeColor(ROSE_GOLD)
    c.setLineWidth(1.5)
    c.line(PAGE_W * 0.4, PAGE_H - 2 * inch, PAGE_W * 0.6, PAGE_H - 2 * inch)

    # Tips
    tips = [
        ("01.", "Eat before you stand up.", "Keep saltines on your nightstand. Eat two before you even sit up. This single habit changed my mornings."),
        ("02.", "Take the nap.", "I know there's laundry. I know there's email. The nap. Always. Your body is building a human and a placenta — give it rest."),
        ("03.", "Call your OB when worried.", "Peace of mind is worth the call. They'd rather hear from you than not. You are not a burden."),
        ("04.", "Tell one person today.", "Even if you're not ready to announce, tell one trusted human. You were not meant to carry this alone."),
        ("05.", "Drink water first thing.", "One full glass before coffee, before phone, before anything. Hydration is your first-trimester superpower."),
    ]

    y = PAGE_H - 2.7 * inch
    for num, title, body in tips:
        # Number
        c.setFillColor(ROSE_GOLD)
        c.setFont("Cormorant-Bold", 24)
        c.drawString(MARGIN, y, num)

        # Title
        c.setFillColor(BLUSH)
        c.setFont("Cormorant-Semi", 18)
        c.drawString(MARGIN + 0.6 * inch, y, title)

        # Body
        c.setFillColor(CREAM)
        c.setFont("Montserrat", 10)
        # Word wrap
        words = body.split()
        line = ""
        lines = []
        for word in words:
            test = (line + " " + word).strip()
            if c.stringWidth(test, "Montserrat", 10) > PAGE_W - 2 * MARGIN - 0.6 * inch:
                lines.append(line)
                line = word
            else:
                line = test
        if line:
            lines.append(line)

        for i, l in enumerate(lines):
            c.drawString(MARGIN + 0.6 * inch, y - 18 - i * 14, l)

        y -= 18 + len(lines) * 14 + 25

    # Footer
    c.setFillColor(CREAM)
    c.setFont("Dancing-Bold", 24)
    c.drawCentredString(PAGE_W / 2, 0.7 * inch, "I'm here, 24/7. — Tempie")

    c.showPage()

def draw_cta_page(c):
    """Final CTA page"""
    c.setFillColor(BLUSH)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Decorative circles
    c.setFillColor(SAGE)
    c.setFillAlpha(0.5)
    c.circle(PAGE_W * 0.85, PAGE_H * 0.9, 100, fill=1, stroke=0)
    c.setFillAlpha(1)

    # Tag
    c.setFillColor(ROSE_GOLD)
    c.setFont("Montserrat-Semi", 10)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 1.3 * inch, "WHAT'S NEXT")

    # Title
    c.setFillColor(MOSS_DEEP)
    c.setFont("Cormorant-Bold", 44)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 2.1 * inch, "Carry this with you.")

    # Decorative line
    c.setStrokeColor(ROSE_GOLD)
    c.setLineWidth(1.5)
    c.line(PAGE_W * 0.4, PAGE_H - 2.4 * inch, PAGE_W * 0.6, PAGE_H - 2.4 * inch)

    # Description
    c.setFillColor(MOSS_DEEP)
    c.setFont("Montserrat", 12)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 2.9 * inch, "This guide is just the beginning.")
    c.drawCentredString(PAGE_W / 2, PAGE_H - 3.15 * inch, "The Tender Trimesters app walks with you through all 40 weeks —")

    c.setFont("Montserrat", 11)
    c.setFillColor(MOSS)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 3.45 * inch, "weekly milestones, daily affirmations, a private journal,")
    c.drawCentredString(PAGE_W / 2, PAGE_H - 3.65 * inch, "mood tracking, and Tempie — your 24/7 AI companion.")

    # Feature pills
    features = ["Weekly Milestones", "Daily Affirmations", "Private Journal", "Tempie AI Chat"]
    pill_y = PAGE_H - 4.3 * inch
    pill_x = PAGE_W / 2 - (len(features) * 1.4 * inch) / 2
    for feat in features:
        c.setFillColor(CREAM)
        c.roundRect(pill_x, pill_y, 1.3 * inch, 0.4 * inch, 20, fill=1, stroke=0)
        c.setFillColor(MOSS_DEEP)
        c.setFont("Montserrat-Semi", 9)
        c.drawCentredString(pill_x + 0.65 * inch, pill_y + 0.14 * inch, feat)
        pill_x += 1.4 * inch

    # Big CTA
    c.setFillColor(MOSS_DEEP)
    c.roundRect(PAGE_W * 0.25, PAGE_H * 0.35, PAGE_W * 0.5, 0.9 * inch, 30, fill=1, stroke=0)
    c.setFillColor(CREAM)
    c.setFont("Cormorant-Bold", 22)
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.35 + 0.45 * inch, "Download the App")
    c.setFont("Montserrat", 10)
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.35 + 0.2 * inch, "Free forever. Premium $9.99 one-time.")

    # Handwritten closer
    c.setFillColor(ROSE_GOLD)
    c.setFont("Dancing-Bold", 36)
    c.drawCentredString(PAGE_W / 2, PAGE_H * 0.22, "you've got this, mama")

    # Footer
    c.setFillColor(MOSS_DEEP)
    c.setFont("Montserrat", 9)
    c.setFillAlpha(0.7)
    c.drawCentredString(PAGE_W / 2, 0.5 * inch, "Tender Trimesters  ·  by Mommies Matter  ·  Made with love")
    c.setFillAlpha(1)

    c.showPage()

def main():
    c = canvas.Canvas(OUTPUT_PATH, pagesize=letter)
    c.setTitle("Your First Trimester Survival Kit")
    c.setAuthor("Helena-Ann Baker, Mommies Matter")
    c.setSubject("First trimester pregnancy checklist and survival guide")
    c.setCreator("Tender Trimesters")

    # Cover
    draw_cover(c)

    # Welcome
    draw_intro_page(c)

    # Section 1: Health & Body
    draw_section_page(c,
        "Health & Body",
        "The essentials for your physical wellbeing in weeks 1–13.",
        [
            "Start a prenatal vitamin with 400mcg folic acid (if you haven't already).",
            "Schedule your first OB-GYN appointment — usually around 8 weeks.",
            "Cut out alcohol, smoking, and recreational drugs completely.",
            "Limit caffeine to under 200mg/day (about one 12oz coffee).",
            "Avoid raw fish, deli meats, soft cheeses, and high-mercury fish.",
            "Drink at least 8–10 glasses of water daily.",
            "Track your symptoms — note what triggers nausea and what helps.",
            "Get 7–9 hours of sleep; nap when your body asks.",
            "Switch to gentle skincare (avoid retinols, salicylic acid, hydroquinone).",
            "If nausea is severe (can't keep water down 24hrs), call your OB.",
        ],
        BLUSH, ROSE_GOLD, 1
    )

    # Section 2: Appointments & Tests
    draw_section_page(c,
        "Appointments & Tests",
        "Know what's coming so you can ask the right questions.",
        [
            "First prenatal visit (typically weeks 6–8) — confirm pregnancy, bloodwork, due date.",
            "First ultrasound (around week 8) — confirm heartbeat and dating.",
            "NIPT (Non-Invasive Prenatal Testing) — optional, weeks 10–13. Screens for chromosomal conditions.",
            "NT Scan (Nuchal Translucency) — weeks 11–13. Ultrasound for chromosomal markers.",
            "Schedule your anatomy scan for around week 20.",
            "Write down questions before each appointment — brain fog is real.",
            "Bring your partner or a friend to the first ultrasound.",
            "Ask your OB about their after-hours line and save it in your phone.",
            "Check your insurance coverage for prenatal care and delivery.",
            "Consider a doula — research shows they improve outcomes.",
        ],
        SAGE, MOSS_DEEP, 2
    )

    # Section 3: Emotional Wellness
    draw_section_page(c,
        "Emotional Wellness",
        "Your heart is doing as much work as your body. Tend to it.",
        [
            "Tell at least one trusted person about your pregnancy (partner, best friend, parent).",
            "Start a pregnancy journal — even one sentence a day counts.",
            "Set boundaries with well-meaning advice-givers. 'I'll let you know if I need input.'",
            "Limit doom-scrolling pregnancy forums. Helpful in doses, harmful in excess.",
            "Acknowledge that anxiety is normal in the first trimester. You're not 'too much.'",
            "If you have a history of depression or anxiety, tell your OB early.",
            "Practice one grounding technique daily: 4-7-8 breathing, body scan, or a short walk.",
            "Give yourself permission to not feel 'glowing' yet. Survival mode is okay.",
            "Talk to your partner about your fears — they're probably scared too.",
            "If intrusive thoughts become overwhelming, call your OB or a therapist.",
        ],
        LAVENDER, MOSS_DEEP, 3
    )

    # Section 4: Nutrition
    draw_section_page(c,
        "Nutrition",
        "Eat for nourishment, not for two. Calories matter less than quality.",
        [
            "Prioritize protein: eggs, lean meat, beans, Greek yogurt, tofu.",
            "Eat leafy greens daily (spinach, kale, arugula) for folate and iron.",
            "Add omega-3s: salmon (cooked), chia seeds, walnuts, flaxseed.",
            "Calcium-rich foods: yogurt, cheese (pasteurized), almonds, fortified plant milks.",
            "Vitamin C helps iron absorption — pair spinach with citrus or tomatoes.",
            "Eat small frequent meals to manage nausea and blood sugar.",
            "Keep easy snacks on hand: nuts, crackers, cheese, fruit, hard-boiled eggs.",
            "Hydrate with electrolytes if vomiting — coconut water, broth, sports drinks.",
            "If food aversions are intense, eat what you can. Calories > perfection right now.",
            "Limit added sugar and ultra-processed foods where possible.",
        ],
        BUTTER, TERRACOTTA, 4
    )

    # Section 5: Practical Prep
    draw_section_page(c,
        "Practical Prep",
        "Set up your life so the rest of pregnancy feels less chaotic.",
        [
            "Tell your employer (or plan when you will) — usually after week 12.",
            "Research your company's maternity leave policy.",
            "Look into childcare options NOW — waitlists are often 6+ months long.",
            "Set up a pregnancy tracking app (like Tender Trimesters).",
            "Buy a pregnancy pillow — even if you don't think you need one yet.",
            "Start a 'pregnancy memory' photo folder on your phone.",
            "Take a 12-week belly photo, even if you don't 'look pregnant.'",
            "Make a list of baby names you both like — start the conversation early.",
            "Budget for baby essentials (and start a sinking fund if possible).",
            "Plan a 'before baby' trip or date — second trimester is the sweet spot.",
        ],
        CREAM_DEEP, MOSS, 5
    )

    # Section 6: Self-Care
    draw_section_page(c,
        "Self-Care",
        "Not a luxury. A necessity. You cannot pour from an empty cup, mama.",
        [
            "Take one bath a week with Epsom salts (skip if your OB says no hot baths).",
            "Get a prenatal massage (many insurance plans cover it).",
            "Moisturize your belly daily — skin stretching begins early.",
            "Switch to flat, supportive shoes. Heels will betray you.",
            "Gentle movement 3–4x a week: walking, prenatal yoga, swimming.",
            "Stretch before bed to ease round ligament pain.",
            "Have one non-negotiable 'me time' ritual: tea, a book, a podcast.",
            "Limit exposure to stressful news and social media.",
            "Say no to commitments that don't fill your cup. Practice the word 'no.'",
            "Kiss your partner. Hug your dog. Pet your cat. Connection is medicine.",
        ],
        BLUSH, ROSE_GOLD, 6
    )

    # Tempie's Tips
    draw_tempie_tips_page(c)

    # Final CTA
    draw_cta_page(c)

    c.save()
    print(f"Generated: {OUTPUT_PATH}")
    print(f"  Pages: cover + intro + 6 sections + Tempie's tips + CTA = 10 pages")

if __name__ == "__main__":
    main()
