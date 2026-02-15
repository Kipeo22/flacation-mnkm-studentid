export interface Student {
  name: string;
  color: string;
  generation: string;
  region: string;
  image: string;
  ability: string;
}

export function parseCSV(csvText: string): Student[] {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',').map(h => h.trim());
  
  // Helper to parse a line respecting quotes
  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let currentValue = '';
    let insideQuote = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
            values.push(currentValue.trim());
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    values.push(currentValue.trim());
    return values;
  };

  const students: Student[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length < 5) continue; // Skip invalid lines

    // Map based on CSV structure:
    // メンター名,色,leaders期,地域,imageURL,特殊能力
    
    // Clean up image URL (remove quotes if they persisted, though parseLine should handle them if used for wrapping)
    // The CSV has "kuro,jpg", which parseLine handles by keeping it as one value kuro,jpg.
    // However, if the CSV uses quotes for wrapping, we might want to strip them if they are part of the value? 
    // Usually standard CSV doesn't include the quotes in the value.
    // My simple parser toggles insideQuote but adds the char if not a delimiter. 
    // Let's refine the parser to NOT include the quote characters if they are delimiters.
    
    // Actually, let's use a regex or a more robust parsing logic if needed, but for this specific CSV, 
    // standard quote handling is: "value" -> value. "val,ue" -> val,ue.
    // My previous logic included the quotes in `currentValue`. I should fix that.
    
    const student: Student = {
        name: values[0],
        color: values[1],
        generation: values[2],
        region: values[3],
        image: values[4], 
        ability: values[5] || ''
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
