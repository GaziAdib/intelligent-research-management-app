// Helper function to clean up task content formatting
export function formatTaskContent(content) {
    if (!content) return '*No content provided*';
    
    // Normalize line breaks and clean up whitespace
    return content
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
    .replace(/^\s+/gm, '')   // Remove leading whitespace from each line
    .trim() + '\n';          // Ensure trailing newline
}