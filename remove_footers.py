import re
import glob

def remove_div_block_at(content, start_pos):
    """Remove a <div>...</div> block starting at start_pos, properly handling nested divs."""
    depth = 0
    i = start_pos
    while i < len(content):
        if content[i:i+4] == '<div':
            depth += 1
            while i < len(content) and content[i] != '>':
                i += 1
            i += 1
        elif content[i:i+6] == '</div>':
            depth -= 1
            if depth == 0:
                end = i + 6
                return content[:start_pos] + content[end:]
            i += 6
        else:
            i += 1
    return content


def remove_all_divs_with_class(content, class_name):
    """Remove all <div class="...class_name...">...</div> blocks."""
    pattern = re.compile(r'<div[^>]*\bclass="[^"]*\b' + re.escape(class_name) + r'\b[^"]*"[^>]*>')
    while True:
        match = pattern.search(content)
        if not match:
            break
        content = remove_div_block_at(content, match.start())
    return content


def get_div_end(content, start_pos):
    """Find the end position of a div block starting at start_pos."""
    depth = 0
    i = start_pos
    while i < len(content):
        if content[i:i+4] == '<div':
            depth += 1
            while i < len(content) and content[i] != '>':
                i += 1
            i += 1
        elif content[i:i+6] == '</div>':
            depth -= 1
            if depth == 0:
                return i + 6
            i += 6
        else:
            i += 1
    return -1


def remove_divs_containing_footer_text(content):
    """Remove any small <div>...</div> that contains footer-related text."""
    pattern = re.compile(r'<div[^>]*>')
    pos = 0
    while True:
        match = pattern.search(content, pos)
        if not match:
            break
        start = match.start()
        end = get_div_end(content, start)
        if end == -1:
            break
        block = content[start:end]
        is_footer = (
            ('Presentation by Cognine AI Practice' in block or '24-Feb-2026' in block)
            and 'slide-container' not in block
            and 'slide-wrapper' not in block
            and len(block) < 3000
        )
        if is_footer:
            content = content[:start] + content[end:]
            # Re-scan from same position
        else:
            # Advance past just the opening tag to scan inner divs
            pos = match.end()
    return content


def remove_orphaned_footer_spans(content):
    """Remove standalone <span> elements containing footer text."""
    # Remove spans with inline styles containing footer text
    content = re.sub(
        r'<span\s+style="[^"]*font-family[^"]*"[^>]*>(?:Presentation by Cognine AI Practice|24-Feb-2026[^<]*)</span>',
        '', content, flags=re.DOTALL
    )
    # Remove plain spans containing only date/separator/number (orphaned from removed footer div)
    content = re.sub(r'<span>24-Feb-2026</span>', '', content)
    content = re.sub(r'<span>\|</span>', '', content)
    # Remove slide number spans that are isolated (single 2-digit number)
    content = re.sub(r'<span>\d{2}</span>\s*\n', '', content)
    return content


def remove_footer_css(content):
    """Remove footer-related CSS rules."""
    content = re.sub(r'\s*\.footer\s*\{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*\.footer-brand\s*\{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*\.footer-meta\s*\{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*\.footer-branding\s+span\s*\{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*\.footer-branding\s+i\s*\{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*\.footer-branding\s*\{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*\.footer-left\s*\{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*footer\s+span\s*\{[^}]*\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*footer\s*\{[^}]*\}', '', content, flags=re.DOTALL)
    return content


def remove_footer_comments(content):
    content = re.sub(r'\s*<!--\s*Footer[^>]*-->', '', content)
    return content


def remove_footer_tag(content):
    content = re.sub(r'\s*<footer>.*?</footer>', '', content, flags=re.DOTALL)
    return content


def fix_padding(content):
    content = content.replace('padding: 32px 56px 80px;', 'padding: 32px 56px;')
    content = content.replace('padding: 40px 40px 80px;', 'padding: 40px 40px;')
    content = content.replace('padding: 40px 60px 80px;', 'padding: 40px 60px;')
    return content


def process_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        original = f.read()

    content = original

    content = remove_footer_tag(content)
    for cls in ['footer', 'footer-meta', 'footer-brand', 'footer-branding']:
        content = remove_all_divs_with_class(content, cls)
    content = remove_divs_containing_footer_text(content)
    content = remove_orphaned_footer_spans(content)
    content = remove_footer_css(content)
    content = remove_footer_comments(content)
    content = fix_padding(content)

    if content != original:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated: {filename}')
    else:
        print(f'No change: {filename}')


files = [f for f in glob.glob('*.html') if f != 'index.html']
for filename in sorted(files):
    process_file(filename)

print('Done.')
