export interface Student {
  name: string;
  color: string;
  generation: string;
  region: string;
  image: string;
  ability: string;
  hasTeamFlag: boolean;
}

// Helper to parse a line respecting quotes - defined outside to be hoisted or we can keep it inside if we want, 
// but the previous code had it inside? 
// Actually, I'll just rewrite the whole function body as requested by replace_file_content constraints for that chunk.

export function parseCSV(csvText: string): Student[] {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  // Skip header
  // const headers = lines[0].split(',').map(h => h.trim());

  const students: Student[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    // The new CSV likely has around 9 columns. We should be safe if we have enough for our needs.
    if (values.length < 6) continue; 

    // Mapping based on new CSV (v2):
    // ... (same comments as before)
    // 7: 特殊効果 -> ability
    // 8: チームフラグ -> teamFlag

    const student: Student = {
        name: values[0],
        color: values[2] || '#EBC700', // Default color if missing
        generation: values[3],
        region: values[4],
        image: values[5], 
        ability: values[7] || '',
        hasTeamFlag: values[8]?.trim() === '1'
    };
    students.push(student);
  }

  return students;
}

// Improved parseLine to strip quotes
function parseLine(line: string): string[] {
    const values: string[] = [];
    let currentValue = '';
    let insideQuote = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            insideQuote = !insideQuote;
            // Don't add quote char to value
        } else if (char === ',' && !insideQuote) {
            values.push(currentValue.trim());
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    values.push(currentValue.trim());
    return values;
}
