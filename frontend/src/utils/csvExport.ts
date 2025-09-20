/**
 * Utility functions for exporting data to CSV format
 */

/**
 * Converts a value to a CSV-safe string
 * @param value Any value to convert to a CSV string
 * @returns A CSV-safe string
 */
const toCsvValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  // Convert to string
  const stringValue = String(value);
  
  // If the value contains commas, quotes, or newlines, wrap it in quotes and escape any quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
};

/**
 * Creates a CSV string from an array of objects
 * @param data Array of objects to convert to CSV
 * @param columns Optional column configuration (header and accessor)
 * @returns CSV string
 */
export const objectsToCsv = <T extends Record<string, any>>(
  data: T[],
  columns?: { header: string; accessor: keyof T }[]
): string => {
  if (!data || data.length === 0) {
    return '';
  }
  
  // If columns are not provided, use object keys from the first item
  const cols = columns || Object.keys(data[0]).map(key => ({
    header: key,
    accessor: key as keyof T
  }));
  
  // Create header row
  const headerRow = cols.map(col => toCsvValue(col.header)).join(',');
  
  // Create data rows
  const rows = data.map(item => 
    cols.map(col => toCsvValue(item[col.accessor])).join(',')
  );
  
  // Combine header and rows
  return [headerRow, ...rows].join('\n');
};

/**
 * Creates a CSV string from nested data with a parent-child relationship
 * @param data Array of parent objects with child arrays
 * @param parentColumns Column configuration for parent objects
 * @param childrenKey Key in parent object that contains child array
 * @param childColumns Column configuration for child objects
 * @returns CSV string with flattened parent-child data
 */
export const nestedObjectsToCsv = <
  P extends Record<string, any>,
  C extends Record<string, any>
>(
  data: P[],
  parentColumns: { header: string; accessor: keyof P }[],
  childrenKey: keyof P,
  childColumns: { header: string; accessor: keyof C }[]
): string => {
  if (!data || data.length === 0) {
    return '';
  }
  
  // Create header row with parent and child columns
  const headerRow = [
    ...parentColumns.map(col => toCsvValue(col.header)),
    ...childColumns.map(col => toCsvValue(col.header))
  ].join(',');
  
  // Create data rows with parent and child data
  const rows: string[] = [];
  
  data.forEach(parent => {
    const children = parent[childrenKey] as C[];
    
    if (!children || children.length === 0) {
      // If no children, just add parent data with empty child cells
      const parentData = parentColumns.map(col => toCsvValue(parent[col.accessor])).join(',');
      const emptyCells = childColumns.map(() => '').join(',');
      rows.push(`${parentData},${emptyCells}`);
    } else {
      // If has children, add a row for each child with parent data repeated
      children.forEach(child => {
        const parentData = parentColumns.map(col => toCsvValue(parent[col.accessor])).join(',');
        const childData = childColumns.map(col => toCsvValue(child[col.accessor])).join(',');
        rows.push(`${parentData},${childData}`);
      });
    }
  });
  
  // Combine header and rows
  return [headerRow, ...rows].join('\n');
};

/**
 * Triggers a download of a CSV file in the browser
 * @param csvContent CSV string content
 * @param fileName Name for the downloaded file
 */
export const downloadCsv = (csvContent: string, fileName: string): void => {
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  
  // Append to the document, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};
