#!/usr/bin/env python3
"""
Generate a beautiful PDF version of the Tender Trimesters meditation scripts.

- Cover page with brand styling (cream background, moss/rose-gold accents)
- 8 meditation chapters, each starting on a new page
- Brand fonts: Cormorant Garamond (headings) + Montserrat (body)
- Brand palette: Hearth Cream #F5EFE0, Serene Moss #6B7A5A, Rose Gold #B76E79
- No emoji, no artificial endings
- Page numbers in footer
"""

import re
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether,
    BaseDocTemplate, PageTemplate, Frame
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# === Paths ===
SCRIPTS_MD = "/home/z/my-project/download/meditations/meditation-scripts.md"
OUTPUT_PDF = "/home/z/my-project/download/meditations/meditation-scripts.pdf"
FONT_DIR = "/home/z/my-project/fonts"

# === Brand palette ===
HEARTH_CREAM = HexColor("#F5EFE0")
SERENE_MOSS = HexColor("#6B7A5A")
MOSS_DEEP = HexColor("#4A5645")
DUSTY_TERRACOTTA = HexColor("#C97B5C")
ROSE_GOLD = HexColor("#B76E79")
BLUSH_PINK = HexColor("#FADADD")
TEXT_DARK = HexColor("#3A3A3A")
TEXT_MUTED = HexColor("#7A7A7A")

# === Register fonts ===
pdfmetrics.registerFont(TTFont("Cormorant", os.path.join(FONT_DIR, "Cormorant-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Cormorant-Bold", os.path.join(FONT_DIR, "Cormorant-SemiBold.ttf")))
pdfmetrics.registerFont(TTFont("Cormorant-Black", os.path.join(FONT_DIR, "Cormorant-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Montserrat", os.path.join(FONT_DIR, "Montserrat-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Montserrat-Medium", os.path.join(FONT_DIR, "Montserrat-Medium.ttf")))
pdfmetrics.registerFont(TTFont("DancingScript", os.path.join(FONT_DIR, "DancingScript-Regular.ttf")))
pdfmetrics.registerFont(TTFont("DancingScript-Bold", os.path.join(FONT_DIR, "DancingScript-Bold.ttf")))

# === Styles ===
styles = {
    "cover_brand": ParagraphStyle(
        "cover_brand", fontName="Montserrat-Medium", fontSize=10,
        textColor=ROSE_GOLD, alignment=TA_CENTER, spaceAfter=8,
        leading=14,
    ),
    "cover_title": ParagraphStyle(
        "cover_title", fontName="Cormorant-Black", fontSize=44,
        textColor=MOSS_DEEP, alignment=TA_CENTER, spaceAfter=12,
        leading=52,
    ),
    "cover_subtitle": ParagraphStyle(
        "cover_subtitle", fontName="DancingScript", fontSize=22,
        textColor=DUSTY_TERRACOTTA, alignment=TA_CENTER, spaceAfter=24,
        leading=28,
    ),
    "cover_desc": ParagraphStyle(
        "cover_desc", fontName="Montserrat", fontSize=11,
        textColor=TEXT_MUTED, alignment=TA_CENTER, spaceAfter=8,
        leading=16,
    ),
    "cover_footer": ParagraphStyle(
        "cover_footer", fontName="Montserrat", fontSize=9,
        textColor=ROSE_GOLD, alignment=TA_CENTER,
        leading=12,
    ),
    "med_number": ParagraphStyle(
        "med_number", fontName="Montserrat-Medium", fontSize=10,
        textColor=ROSE_GOLD, alignment=TA_LEFT, spaceAfter=4,
        leading=12,
    ),
    "med_title": ParagraphStyle(
        "med_title", fontName="Cormorant-Bold", fontSize=28,
        textColor=MOSS_DEEP, alignment=TA_LEFT, spaceAfter=6,
        leading=34,
    ),
    "med_category": ParagraphStyle(
        "med_category", fontName="DancingScript", fontSize=16,
        textColor=DUSTY_TERRACOTTA, alignment=TA_LEFT, spaceAfter=18,
        leading=20,
    ),
    "med_meta": ParagraphStyle(
        "med_meta", fontName="Montserrat", fontSize=9,
        textColor=TEXT_MUTED, alignment=TA_LEFT, spaceAfter=20,
        leading=12,
    ),
    "body": ParagraphStyle(
        "body", fontName="Montserrat", fontSize=10.5,
        textColor=TEXT_DARK, alignment=TA_LEFT, spaceAfter=10,
        leading=16, firstLineIndent=0,
    ),
    "body_first": ParagraphStyle(
        "body_first", fontName="Montserrat", fontSize=10.5,
        textColor=TEXT_DARK, alignment=TA_LEFT, spaceAfter=10,
        leading=16, firstLineIndent=0,
    ),
    "section_break": ParagraphStyle(
        "section_break", fontName="Cormorant", fontSize=10.5,
        textColor=SERENE_MOSS, alignment=TA_CENTER, spaceAfter=12, spaceBefore=8,
        leading=14,
    ),
}

# === Parse the markdown ===
def parse_markdown(md_text):
    """Parse the meditation-scripts.md into a list of meditation dicts."""
    meditations = []
    lines = md_text.split("\n")
    i = 0
    # Skip the header/intro section until we hit the first "## Meditation"
    while i < len(lines) and not lines[i].startswith("## Meditation"):
        i += 1

    while i < len(lines):
        line = lines[i]
        match = re.match(r"^## Meditation\s+(\d+):\s*(.+?)\s*\((.+?)\)\s*$", line)
        if not match:
            i += 1
            continue

        num = int(match.group(1))
        title = match.group(2).strip()
        category = match.group(3).strip()

        # Skip the metadata block (Duration, Use case, Category) until ---
        i += 1
        meta_lines = []
        while i < len(lines) and lines[i].strip() != "---":
            if lines[i].strip():
                meta_lines.append(lines[i].strip())
            i += 1
        # Skip the --- separator
        i += 1

        # Collect body until next "## Meditation" or end of file
        body_lines = []
        while i < len(lines) and not lines[i].startswith("## Meditation"):
            body_lines.append(lines[i])
            i += 1

        meditations.append({
            "number": num,
            "title": title,
            "category": category,
            "meta": meta_lines,
            "body": "\n".join(body_lines).strip(),
        })

    return meditations


# === Page templates ===
def draw_cover_page(canvas, doc):
    """Cover page: cream background with brand-colored decorative elements."""
    canvas.saveState()
    w, h = letter

    # Full-bleed cream background
    canvas.setFillColor(HEARTH_CREAM)
    canvas.rect(0, 0, w, h, fill=1, stroke=0)

    # Top decorative band (moss)
    canvas.setFillColor(SERENE_MOSS)
    canvas.rect(0, h - 0.4 * inch, w, 0.4 * inch, fill=1, stroke=0)

    # Bottom decorative band (rose gold, thinner)
    canvas.setFillColor(ROSE_GOLD)
    canvas.rect(0, 0, w, 0.25 * inch, fill=1, stroke=0)

    # Decorative leaf-like circle (top right)
    canvas.setFillColor(BLUSH_PINK)
    canvas.circle(w - 1.2 * inch, h - 1.5 * inch, 0.6 * inch, fill=1, stroke=0)

    # Decorative circle (bottom left)
    canvas.setFillColor(HexColor("#CFE3DC"))  # Sage
    canvas.circle(1.0 * inch, 1.5 * inch, 0.8 * inch, fill=1, stroke=0)

    canvas.restoreState()


def draw_content_page(canvas, doc):
    """Content pages: minimal, with page number and small brand mark in footer."""
    canvas.saveState()
    w, h = letter

    # Subtle cream tint at top
    canvas.setFillColor(HEARTH_CREAM)
    canvas.rect(0, h - 0.6 * inch, w, 0.6 * inch, fill=1, stroke=0)

    # Small brand mark (leaf) in top left
    canvas.setFillColor(SERENE_MOSS)
    canvas.circle(0.7 * inch, h - 0.4 * inch, 0.06 * inch, fill=1, stroke=0)

    # Brand name in top right
    canvas.setFillColor(MOSS_DEEP)
    canvas.setFont("Cormorant-Bold", 11)
    canvas.drawRightString(w - 0.75 * inch, h - 0.45 * inch, "Tender Trimesters")

    # Page number in footer
    canvas.setFillColor(TEXT_MUTED)
    canvas.setFont("Montserrat", 9)
    page_num = canvas.getPageNumber()
    canvas.drawCentredString(w / 2, 0.45 * inch, f"— {page_num} —")

    canvas.restoreState()


# === Build PDF ===
def build_pdf():
    with open(SCRIPTS_MD, "r", encoding="utf-8") as f:
        md_text = f.read()

    meditations = parse_markdown(md_text)
    print(f"Parsed {len(meditations)} meditations")

    doc = BaseDocTemplate(
        OUTPUT_PDF,
        pagesize=letter,
        leftMargin=0.9 * inch,
        rightMargin=0.9 * inch,
        topMargin=0.9 * inch,
        bottomMargin=0.9 * inch,
        title="Tender Trimesters — Meditation Scripts",
        author="Helena-Ann · Mommies Matter",
        subject="Guided meditation scripts for the Tender Trimesters premium library",
        creator="Tender Trimesters",
    )

    # Cover frame (full page minus margins)
    cover_frame = Frame(
        0.8 * inch, 0.8 * inch,
        letter[0] - 1.6 * inch, letter[1] - 1.6 * inch,
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
        showBoundary=0,
    )
    # Content frame
    content_frame = Frame(
        0.9 * inch, 0.7 * inch,
        letter[0] - 1.8 * inch, letter[1] - 1.6 * inch,
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
        showBoundary=0,
    )

    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[cover_frame], onPage=draw_cover_page),
        PageTemplate(id="content", frames=[content_frame], onPage=draw_content_page),
    ])

    story = []

    # === Cover page ===
    story.append(Spacer(1, 1.5 * inch))
    story.append(Paragraph("MOMMIES MATTER", styles["cover_brand"]))
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph("Meditation Scripts", styles["cover_title"]))
    story.append(Paragraph("for the Tender Mama", styles["cover_subtitle"]))
    story.append(Spacer(1, 0.4 * inch))
    story.append(Paragraph(
        "Eight guided meditations for every chapter of pregnancy —",
        styles["cover_desc"]
    ))
    story.append(Paragraph(
        "from the first whispered hello to the quiet days after birth.",
        styles["cover_desc"]
    ))
    story.append(Spacer(1, 0.4 * inch))
    story.append(Paragraph(
        "Read these aloud to record your own audio, or use them as a guide<br/>"
        "for personal practice. Each script is paced for slow reading<br/>"
        "with natural pauses at every paragraph break.",
        styles["cover_desc"]
    ))
    story.append(Spacer(1, 1.2 * inch))
    story.append(Paragraph("Written by Helena-Ann", styles["cover_footer"]))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("Tender Trimesters · Premium Library", styles["cover_footer"]))

    # Switch to content template
    from reportlab.platypus import NextPageTemplate
    story.append(NextPageTemplate("content"))
    story.append(PageBreak())

    # === Meditation chapters ===
    for idx, med in enumerate(meditations):
        # Meditation number badge
        story.append(Paragraph(f"MEDITATION {med['number']} OF 8", styles["med_number"]))
        # Title
        story.append(Paragraph(med["title"], styles["med_title"]))
        # Category (in Dancing Script)
        story.append(Paragraph(med["category"], styles["med_category"]))

        # Meta info (Duration, Use case)
        meta_html = "  ·  ".join(med["meta"])
        story.append(Paragraph(meta_html, styles["med_meta"]))

        # Body — split on --- for section breaks, render paragraphs
        body = med["body"]
        # Split on lines that are just ---
        sections = re.split(r"\n---\s*\n", body)

        for sec_idx, section in enumerate(sections):
            if sec_idx > 0:
                # Section break: small ornament
                story.append(Spacer(1, 6))
                story.append(Paragraph("· · ·", styles["section_break"]))
                story.append(Spacer(1, 6))

            # Split section into paragraphs (blank line separated)
            paragraphs = [p.strip() for p in section.split("\n\n") if p.strip()]
            for para in paragraphs:
                # Clean markdown: remove ** and * markers
                clean = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", para)
                clean = re.sub(r"\*(.+?)\*", r"\1", clean)
                # Convert smart quotes
                clean = clean.replace("\u201c", '"').replace("\u201d", '"')
                clean = clean.replace("\u2018", "'").replace("\u2019", "'")
                # Replace newlines within paragraph with spaces (single paragraph)
                clean = re.sub(r"\s+", " ", clean)
                if clean:
                    story.append(Paragraph(clean, styles["body"]))

        # Page break between meditations (except after the last one)
        if idx < len(meditations) - 1:
            story.append(PageBreak())

    doc.build(story)
    size = os.path.getsize(OUTPUT_PDF)
    print(f"\nGenerated: {OUTPUT_PDF}")
    print(f"Size: {size / 1024:.1f} KB")


if __name__ == "__main__":
    build_pdf()
