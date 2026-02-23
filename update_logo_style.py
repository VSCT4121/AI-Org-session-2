import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# Regex to match the full .logo-overlay + .logo-overlay img CSS block
# Handles varying indentation and single-line vs multi-line img properties
logo_css_pattern = re.compile(
    r'([ \t]*)\.logo-overlay\s*\{[^}]*?\}\s*\n[ \t]*\.logo-overlay\s+img\s*\{[^}]*?\}',
    re.DOTALL
)

def build_replacement(indent):
    return (
        f"{indent}.logo-overlay {{\n"
        f"{indent}    position: absolute;\n"
        f"{indent}    top: 16px;\n"
        f"{indent}    right: 20px;\n"
        f"{indent}    z-index: 100;\n"
        f"{indent}    background: #ffffff;\n"
        f"{indent}    border-radius: 8px;\n"
        f"{indent}    padding: 6px 14px;\n"
        f"{indent}    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);\n"
        f"{indent}}}\n"
        f"{indent}.logo-overlay img {{\n"
        f"{indent}    height: 38px;\n"
        f"{indent}    opacity: 1;\n"
        f"{indent}    object-fit: contain;\n"
        f"{indent}    display: block;\n"
        f"{indent}}}"
    )

updated_files = []
skipped_files = []

for filename in sorted(html_files):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    def replacer(match):
        indent = match.group(1)
        return build_replacement(indent)

    new_content, count = logo_css_pattern.subn(replacer, content)

    if count > 0:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        updated_files.append(filename)
        print(f"  [UPDATED] {filename}")
    else:
        skipped_files.append(filename)
        print(f"  [SKIPPED] {filename}  (pattern not matched)")

print(f"\n✅ Total files updated : {len(updated_files)}")
print(f"⚠️  Total files skipped : {len(skipped_files)}")
if skipped_files:
    print("   Skipped files:", skipped_files)
