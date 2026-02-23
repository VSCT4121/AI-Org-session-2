import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# Match the updated (white-box) logo CSS block
logo_css_pattern = re.compile(
    r'([ \t]*)\.logo-overlay\s*\{[^}]*?\}\s*\n[ \t]*\.logo-overlay\s+img\s*\{[^}]*?\}',
    re.DOTALL
)

def build_original(indent):
    return (
        f"{indent}.logo-overlay {{\n"
        f"{indent}    position: absolute;\n"
        f"{indent}    top: 16px;\n"
        f"{indent}    right: 20px;\n"
        f"{indent}    z-index: 100;\n"
        f"{indent}}}\n"
        f"{indent}.logo-overlay img {{\n"
        f"{indent}    height: 50px;\n"
        f"{indent}    opacity: 0.95;\n"
        f"{indent}    object-fit: contain;\n"
        f"{indent}}}"
    )

updated_files = []
skipped_files = []

for filename in sorted(html_files):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    def replacer(match):
        indent = match.group(1)
        return build_original(indent)

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
