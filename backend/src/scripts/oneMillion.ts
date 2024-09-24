// const targetCount = 1000000;

export function duplicateDatasetToMillionEntries(dataset: any[], targetCount: number): any[] {
    const result = [];
    let currentIndex = 0;

    // Loop until we generate one million entries
    for (let i = 0; i < targetCount; i++) {
        // Get the current entry from the dataset, duplicating it if necessary
        const entry = { ...dataset[currentIndex % dataset.length] }; // Duplicate the current entry

        // Optionally, add a unique identifier for each entry
        // entry.uniqueId = `entry_${i + 1}`;  // Add unique ID if necessary

        result.push(entry);
        currentIndex++;
    }

    return result;
}
