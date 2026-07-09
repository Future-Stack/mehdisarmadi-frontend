import os
import glob

tabs = glob.glob('src/features/projects/components/analysis/*Tab.tsx')

for tab in tabs:
    with open(tab, 'r') as f:
        content = f.read()
    
    # 1. Import ProposedChangesReview
    content = content.replace(
        'AIInstructionSection } from "./shared";',
        'AIInstructionSection, ProposedChangesReview } from "./shared";'
    )
    content = content.replace(
        'AIInstructionSection, getRiskBadgeColor } from "./shared";',
        'AIInstructionSection, getRiskBadgeColor, ProposedChangesReview } from "./shared";'
    )
    content = content.replace(
        'getHighlightStyle, AIInstructionSection } from "./shared";',
        'getHighlightStyle, AIInstructionSection, ProposedChangesReview } from "./shared";'
    )
    
    # 2. Add <ProposedChangesReview ... /> inside the main return div
    
    # Determine the section name based on the file name
    filename = os.path.basename(tab)
    section_name = filename.replace('Tab.tsx', '').lower()
    
    # Find the data variable name
    # Usually it's `const data_var = data?.data;` but sometimes it's named summary, scope, etc.
    # Actually, we can just pass `data?.data` instead of the specific variable.
    
    insertion_point = '<div className="space-y-'
    if insertion_point in content:
        parts = content.split(insertion_point, 1)
        if len(parts) == 2:
            new_content = parts[0] + insertion_point + parts[1]
            # Wait, space-y-x could be space-y-6 or space-y-8
            # Let's find `<div className="space-y-` then find `">\n` or `">\n      <div`
            # simpler approach: just find `return (\n    <div className="space-y-6">`
            # and replace with `return (\n    <div className="space-y-6">\n      <ProposedChangesReview projectId={projectId} section="scope" data={data?.data} />`
            
            pass
            
    # Better approach with regex
    import re
    
    content = re.sub(
        r'(return \(\n\s*<div className="space-y-\d+">\n)',
        rf'\1      <ProposedChangesReview projectId={{projectId}} section="{section_name}" data={{data?.data}} />\n',
        content
    )
    
    with open(tab, 'w') as f:
        f.write(content)
        print(f"Updated {tab}")
