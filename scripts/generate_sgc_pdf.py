import json
import re
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "chatgpt_share.html"
OUT_DIR = ROOT / "output" / "pdf"
PDF_PATH = OUT_DIR / "SGC_conversa_a_partir_volume_1.pdf"
MD_PATH = OUT_DIR / "SGC_conversa_a_partir_volume_1.md"


def normalize_text(text: str) -> str:
    replacements = {
        "\u2013": "-",
        "\u2014": "-",
        "\u2011": "-",
        "\u2022": "-",
        "\U0001f4c4": "",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{4,}", "\n\n\n", text)
    return text.strip()


def load_share_payload():
    html = HTML_PATH.read_text(encoding="utf-8")
    chunks = re.findall(r'streamController\.enqueue\("(.*?)"\);', html, flags=re.S)
    if not chunks:
        raise RuntimeError("Nao encontrei o payload da conversa no HTML.")
    payload = json.loads(json.loads('"' + chunks[0] + '"'))
    return payload


def revive_payload(values):
    sys.setrecursionlimit(20000)
    total = len(values)
    memo = {}

    def ref(value):
        if isinstance(value, int) and 0 <= value < total:
            return revive(value)
        if value == -5:
            return None
        return value

    def revive(index):
        if index in memo:
            return memo[index]
        value = values[index]
        if isinstance(value, dict):
            obj = {}
            memo[index] = obj
            for raw_key, raw_value in value.items():
                key = (
                    ref(int(raw_key[1:]))
                    if isinstance(raw_key, str)
                    and raw_key.startswith("_")
                    and raw_key[1:].isdigit()
                    else raw_key
                )
                obj[key] = ref(raw_value)
            return obj
        if isinstance(value, list):
            obj = []
            memo[index] = obj
            obj.extend(ref(item) for item in value)
            return obj
        return value

    return revive(0)


def extract_messages():
    root = revive_payload(load_share_payload())
    data = root["loaderData"]["routes/share.$shareId.($action)"]["serverResponse"]["data"]
    messages = []
    for node in data["linear_conversation"]:
        message = node.get("message") or {}
        role = (message.get("author") or {}).get("role")
        parts = (message.get("content") or {}).get("parts") or []
        text = "\n".join(str(part) for part in parts if part)
        if role in {"user", "assistant"} and text.strip():
            messages.append({"role": role, "text": normalize_text(text)})
    return messages


def build_markdown(messages):
    start_index = None
    start_marker = "# SGC - Sistema de Gestao da Cobranca"
    fallback_marker = "Volume 1 - Visao Geral do Sistema"

    comparable = [
        normalize_text(msg["text"])
        .replace("Gestão", "Gestao")
        .replace("Cobrança", "Cobranca")
        .replace("Visão", "Visao")
        for msg in messages
    ]
    for idx, text in enumerate(comparable):
        if start_marker in text and fallback_marker in text:
            start_index = idx
            break
    if start_index is None:
        raise RuntimeError("Nao encontrei o ponto inicial do Volume 1.")

    output = [
        "# SGC - Sistema de Gestao da Cobranca",
        "",
        "Compilacao da conversa compartilhada a partir do Volume 1 - Visao Geral do Sistema (BRD + PRD).",
        "",
        "---",
        "",
    ]

    first_text = messages[start_index]["text"]
    exact_start = first_text.find("# SGC - Sistema de Gestão da Cobrança")
    if exact_start < 0:
        exact_start = first_text.find("# SGC - Sistema de Gestao da Cobranca")
    if exact_start < 0:
        exact_start = first_text.find("SGC - Sistema de Gestão da Cobrança")
    if exact_start < 0:
        exact_start = first_text.find("SGC - Sistema de Gestao da Cobranca")
    if exact_start >= 0:
        first_text = first_text[exact_start:]

    selected = [{"role": "assistant", "text": first_text}] + messages[start_index + 1 :]
    for idx, msg in enumerate(selected):
        text = msg["text"].strip()
        if not text:
            continue
        if idx > 0:
            label = "Usuario" if msg["role"] == "user" else "Assistente"
            output.extend([f"## {label}", ""])
        output.extend([text, "", "---", ""])

    return "\n".join(output).strip() + "\n"


def inline_markdown(text: str) -> str:
    text = (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`(.+?)`", r"<font name='Courier'>\1</font>", text)
    return text


def make_styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=26,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#1f2937"),
            spaceAfter=18,
        ),
        "h1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=19,
            textColor=colors.HexColor("#111827"),
            spaceBefore=12,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12.5,
            leading=16,
            textColor=colors.HexColor("#374151"),
            spaceBefore=10,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13.5,
            alignment=TA_LEFT,
            spaceAfter=5,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13.5,
            leftIndent=14,
            firstLineIndent=-8,
            spaceAfter=3,
        ),
        "quote": ParagraphStyle(
            "Quote",
            parent=base["BodyText"],
            fontName="Helvetica-Oblique",
            fontSize=9.5,
            leading=13.5,
            leftIndent=16,
            textColor=colors.HexColor("#4b5563"),
            spaceAfter=5,
        ),
    }


def header_footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setStrokeColor(colors.HexColor("#e5e7eb"))
    canvas.line(1.6 * cm, height - 1.35 * cm, width - 1.6 * cm, height - 1.35 * cm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#6b7280"))
    canvas.drawString(1.6 * cm, height - 1.05 * cm, "SGC - Sistema de Gestao da Cobranca")
    canvas.drawRightString(width - 1.6 * cm, 1.05 * cm, f"Pagina {doc.page}")
    canvas.restoreState()


def markdown_to_story(markdown: str):
    styles = make_styles()
    story = []

    for raw_line in markdown.splitlines():
        line = raw_line.rstrip()
        if line.startswith("```"):
            continue
        if not line.strip():
            story.append(Spacer(1, 5))
            continue
        if line.strip() == "---":
            story.append(Spacer(1, 8))
            continue
        if line.startswith("# "):
            text = inline_markdown(line[2:].strip())
            style = styles["title"] if not story else styles["h1"]
            story.append(Paragraph(text, style))
            continue
        if line.startswith("### "):
            story.append(Paragraph(inline_markdown(line[4:].strip()), styles["h2"]))
            continue
        if line.startswith("## "):
            story.append(Paragraph(inline_markdown(line[3:].strip()), styles["h2"]))
            continue
        if line.startswith(">"):
            story.append(Paragraph(inline_markdown(line.lstrip("> ").strip()), styles["quote"]))
            continue
        if re.match(r"^\s*[-*]\s+", line):
            story.append(Paragraph("- " + inline_markdown(re.sub(r"^\s*[-*]\s+", "", line)), styles["bullet"]))
            continue
        if re.match(r"^\s*\d+\.\s+", line):
            story.append(Paragraph(inline_markdown(line.strip()), styles["bullet"]))
            continue
        story.append(Paragraph(inline_markdown(line), styles["body"]))
    return story


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    markdown = build_markdown(extract_messages())
    MD_PATH.write_text(markdown, encoding="utf-8")

    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        rightMargin=1.7 * cm,
        leftMargin=1.7 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.6 * cm,
        title="SGC - Conversa a partir do Volume 1",
        author="Codex",
    )
    doc.build(markdown_to_story(markdown), onFirstPage=header_footer, onLaterPages=header_footer)
    print(PDF_PATH)
    print(MD_PATH)


if __name__ == "__main__":
    main()
